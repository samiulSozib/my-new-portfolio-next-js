'use client';

import { route } from '@dashboard/lib/route';
import InputError from '@dashboard/components/InputError';
import InputLabel from '@dashboard/components/InputLabel';
import PrimaryButton from '@dashboard/components/PrimaryButton';
import TextInput from '@dashboard/components/TextInput';
import GuestLayout from '@dashboard/layouts/GuestLayout';
import { Head, Link, useForm } from '@dashboard/lib/inertia';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout title="Reset your password" description="Enter your email address and we will send you a link to choose a new password.">
            <Head title="Forgot Password" />

            {status && (
                <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <InputLabel htmlFor="email" value="Email" />

                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1.5 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <PrimaryButton className="mt-6 w-full" disabled={processing}>
                    Email password reset link
                </PrimaryButton>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Remembered it?{' '}
                    <Link href={route('login')} className="font-medium text-violet-700 hover:text-violet-900">
                        Back to log in
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
