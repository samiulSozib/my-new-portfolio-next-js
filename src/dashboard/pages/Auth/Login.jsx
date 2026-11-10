'use client';

import { route } from '@dashboard/lib/route';
import Checkbox from '@dashboard/components/Checkbox';
import InputError from '@dashboard/components/InputError';
import InputLabel from '@dashboard/components/InputLabel';
import PrimaryButton from '@dashboard/components/PrimaryButton';
import TextInput from '@dashboard/components/TextInput';
import GuestLayout from '@dashboard/layouts/GuestLayout';
import { Head, Link, useForm } from '@dashboard/lib/inertia';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login.store'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout title="Welcome back" description="Sign in to manage your site.">
            <Head title="Log in" />

            {status && (
                <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1.5 block w-full"
                        autoComplete="username"
                        placeholder="you@example.com"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1.5 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between gap-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-slate-600">
                            Remember me
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm font-medium text-violet-700 hover:text-violet-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
                        >
                            Forgot your password?
                        </Link>
                    )}
                </div>

                <PrimaryButton className="w-full" disabled={processing}>
                    Log in
                </PrimaryButton>
            </form>
        </GuestLayout>
    );
}
