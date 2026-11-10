'use client';

/*
 * A small stand-in for @inertiajs/react, so the dashboard pages (written for Inertia) run on Next.js
 * with few changes. Pages are server-rendered by src/app/(dashboard); forms send JSON to src/app/api.
 *
 * API protocol:
 *   2xx  -> { redirect?: string, flash?: string, status?: string }  (flash shows as the toast)
 *   422  -> { message, errors: { "title.en": "..." } }               (errors land on the form)
 *   401  -> the browser is sent to /login
 */

import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, forwardRef, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

// --- Shared props and flash --------------------------------------------------------------------

const FlashContext = createContext(null);
const SharedContext = createContext({});

// The Next router and the flash setter, reachable from plain event handlers (router.post, useForm).
const bridge = { router: null, setFlash: () => {} };

// Mounted once in the (dashboard) layout, so a flash survives the navigation that follows a save.
export function DashboardProvider({ children }) {
    const nextRouter = useRouter();
    const [flash, setFlashState] = useState(null);

    bridge.router = nextRouter;
    bridge.setFlash = setFlashState;

    // Each flash shows once; clearing it lets the same message show again on the next save.
    useEffect(() => {
        if (!flash) return undefined;
        const timer = setTimeout(() => setFlashState(null), 4500);
        return () => clearTimeout(timer);
    }, [flash]);

    return <FlashContext.Provider value={flash}>{children}</FlashContext.Provider>;
}

// Rendered by every page.tsx with the Inertia-style shared props (auth.user, siteName, publicSiteUrl).
// Pages provide them, not the layout, because Next does not re-render layouts on client navigation.
export function SharedProps({ value, children }) {
    return <SharedContext.Provider value={value}>{children}</SharedContext.Provider>;
}

export function usePage() {
    const shared = useContext(SharedContext);
    const flash = useContext(FlashContext);
    const url = usePathname();
    return useMemo(() => ({ props: { ...shared, flash: { success: flash?.message ?? null } }, url }), [shared, flash, url]);
}

function showFlash(message) {
    if (message) bridge.setFlash({ message, id: Date.now() });
}

// --- Components ---------------------------------------------------------------------------------

// Titles come from each page.tsx's metadata, so <Head> renders nothing.
export function Head() {
    return null;
}

export const Link = forwardRef(function Link({ preserveScroll, preserveState, method, as, data, only, ...props }, ref) {
    return <NextLink ref={ref} scroll={preserveScroll ? false : undefined} {...props} />;
});

// --- Requests ------------------------------------------------------------------------------------

async function send(method, url, payload) {
    const init = {
        method: method.toUpperCase(),
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
    };
    if (payload !== undefined && init.method !== 'GET') {
        init.headers['Content-Type'] = 'application/json';
        init.body = JSON.stringify(payload);
    }

    let response;
    try {
        response = await fetch(url, init);
    } catch {
        return { status: 0, body: { message: 'Network error. Check your connection and try again.' } };
    }

    let body = {};
    try {
        body = await response.json();
    } catch {}

    return { status: response.status, body };
}

function navigateAfter(body, { preserveScroll = false } = {}) {
    const router = bridge.router;
    if (!router) return;
    const target = body?.redirect;
    // Leaving the dashboard (logout, deleted account) is a full page load: the public site has its own root layout.
    if (target && !/^\/(admin|account|login|forgot-password|reset-password)(\/|\?|$)/.test(target)) {
        window.location.assign(target);
        return;
    }
    if (target && target !== window.location.pathname + window.location.search) {
        router.push(target, { scroll: !preserveScroll });
    } else {
        router.refresh();
    }
}

/**
 * Sends a request and applies the shared response handling. Returns { ok, errors, body }.
 */
async function visit(method, url, payload, options = {}) {
    const { status, body } = await send(method, url, payload);

    if (status === 401) {
        window.location.assign('/login');
        return { ok: false, errors: {}, body };
    }

    if (status === 422) {
        return { ok: false, errors: body?.errors ?? { form: body?.message ?? 'The given data was invalid.' }, body };
    }

    if (status < 200 || status >= 300) {
        const message = body?.message || 'Something went wrong. Please try again.';
        window.alert(message);
        return { ok: false, errors: { form: message }, body };
    }

    showFlash(body?.flash);
    if (options.navigate !== false) navigateAfter(body, options);
    return { ok: true, errors: {}, body };
}

export const router = {
    get: (url, options = {}) => bridge.router?.push(url, { scroll: !options.preserveScroll }),
    visit: (url, options = {}) => {
        const method = (options.method ?? 'get').toLowerCase();
        if (method === 'get') return router.get(url, options);
        return router[method](url, options.data, options);
    },
    reload: () => bridge.router?.refresh(),
    post: (url, data, options) => routerSubmit('post', url, data, options),
    put: (url, data, options) => routerSubmit('put', url, data, options),
    patch: (url, data, options) => routerSubmit('patch', url, data, options),
    // Inertia's signature: router.delete(url, options)
    delete: (url, options) => routerSubmit('delete', url, undefined, options),
};

async function routerSubmit(method, url, data, options = {}) {
    options.onStart?.();
    const result = await visit(method, url, data ?? {}, options);
    if (result.ok) options.onSuccess?.(result.body);
    else options.onError?.(result.errors);
    options.onFinish?.();
    return result;
}

// --- useForm --------------------------------------------------------------------------------------

export function useForm(initialValues = {}) {
    const defaultsRef = useRef(initialValues);
    const [data, setDataState] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(null);
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);
    const [wasSuccessful, setWasSuccessful] = useState(false);
    const transformRef = useRef((value) => value);
    const dataRef = useRef(data);
    dataRef.current = data;

    const recentTimer = useRef(null);
    useEffect(() => () => clearTimeout(recentTimer.current), []);

    const setData = useCallback((keyOrValues, value) => {
        setDataState((current) => {
            if (typeof keyOrValues === 'function') return keyOrValues(current);
            if (typeof keyOrValues === 'object' && keyOrValues !== null) return { ...current, ...keyOrValues };
            return { ...current, [keyOrValues]: value };
        });
    }, []);

    const reset = useCallback((...fields) => {
        const defaults = defaultsRef.current;
        if (fields.length === 0) {
            setDataState(defaults);
            return;
        }
        setDataState((current) => {
            const next = { ...current };
            for (const field of fields) next[field] = defaults[field];
            return next;
        });
    }, []);

    const clearErrors = useCallback((...fields) => {
        if (fields.length === 0) {
            setErrors({});
            return;
        }
        setErrors((current) => {
            const next = { ...current };
            for (const field of fields) delete next[field];
            return next;
        });
    }, []);

    const setError = useCallback((keyOrErrors, message) => {
        setErrors((current) =>
            typeof keyOrErrors === 'object' ? { ...current, ...keyOrErrors } : { ...current, [keyOrErrors]: message },
        );
    }, []);

    const submit = useCallback(async (method, url, options = {}) => {
        const payload = transformRef.current(dataRef.current);
        setProcessing(true);
        setWasSuccessful(false);
        setRecentlySuccessful(false);
        options.onStart?.();

        const result = await visit(method, url, payload, options);

        setProcessing(false);
        setProgress(null);
        if (result.ok) {
            setErrors({});
            setWasSuccessful(true);
            setRecentlySuccessful(true);
            clearTimeout(recentTimer.current);
            recentTimer.current = setTimeout(() => setRecentlySuccessful(false), 2000);
            options.onSuccess?.(result.body);
        } else {
            setErrors(result.errors);
            options.onError?.(result.errors);
        }
        options.onFinish?.();
        return result;
    }, []);

    return {
        data,
        setData,
        errors,
        hasErrors: Object.keys(errors).length > 0,
        processing,
        progress,
        setProgress,
        recentlySuccessful,
        wasSuccessful,
        isDirty: JSON.stringify(data) !== JSON.stringify(defaultsRef.current),
        transform: (callback) => {
            transformRef.current = callback;
        },
        setDefaults: (keyOrValues, value) => {
            const current = dataRef.current;
            defaultsRef.current =
                keyOrValues === undefined
                    ? current
                    : typeof keyOrValues === 'object'
                      ? { ...defaultsRef.current, ...keyOrValues }
                      : { ...defaultsRef.current, [keyOrValues]: value };
        },
        reset,
        clearErrors,
        setError,
        submit,
        get: (url, options) => submit('get', url, options),
        post: (url, options) => submit('post', url, options),
        put: (url, options) => submit('put', url, options),
        patch: (url, options) => submit('patch', url, options),
        delete: (url, options) => submit('delete', url, options),
    };
}
