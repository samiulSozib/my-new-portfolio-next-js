import { upload } from '@vercel/blob/client';

import { router } from '@dashboard/lib/inertia';
import { route } from '@dashboard/lib/route';

/*
 * Uploads a file straight from the browser to Vercel Blob (so large files skip the ~4.5 MB function body limit),
 * then records it with the dashboard API. `kind` is "cv" or "photo".
 * Returns { ok, error }.
 */
export async function uploadResumeFile(kind, file, { onProgress } = {}) {
    let blob;
    try {
        blob = await upload(`${kind === 'cv' ? 'cv' : 'profile'}/${file.name}`, file, {
            access: 'public',
            handleUploadUrl: route('admin.resume.upload'),
            clientPayload: kind,
            multipart: file.size > 5 * 1024 * 1024,
            onUploadProgress: ({ percentage }) => onProgress?.(Math.round(percentage)),
        });
    } catch (error) {
        return { ok: false, error: error?.message || 'The upload failed. Please try again.' };
    }

    const result = await router.post(
        route(kind === 'cv' ? 'admin.resume.cv.store' : 'admin.resume.photo.store'),
        { url: blob.url, pathname: blob.pathname, name: file.name, size: file.size },
        { preserveScroll: true },
    );

    return result.ok ? { ok: true } : { ok: false, error: result.errors[kind] ?? result.errors.url ?? Object.values(result.errors)[0] };
}

/** Resolves with the image's natural size, for the 200×200 minimum. */
export function imageSize(file) {
    return new Promise((resolve) => {
        const url = URL.createObjectURL(file);
        const image = new Image();
        image.onload = () => {
            resolve({ width: image.naturalWidth, height: image.naturalHeight });
            URL.revokeObjectURL(url);
        };
        image.onerror = () => {
            resolve(null);
            URL.revokeObjectURL(url);
        };
        image.src = url;
    });
}
