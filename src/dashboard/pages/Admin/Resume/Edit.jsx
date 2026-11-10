'use client';

import { route } from '@dashboard/lib/route';
import Icon from '@dashboard/components/Admin/Icon';
import { Card, buttonClass, dangerButtonClass, secondaryButtonClass } from '@dashboard/components/Admin/ui';
import AdminLayout from '@dashboard/layouts/AdminLayout';
import { formatBytes, formatDate, formatNumber } from '@dashboard/lib/format';
import { imageSize, uploadResumeFile } from '@dashboard/lib/upload';
import { router, useForm, usePage } from '@dashboard/lib/inertia';
import { useEffect, useRef, useState } from 'react';

const CV_MAX = 10 * 1024 * 1024;
const PHOTO_MAX = 4 * 1024 * 1024;

// A drag-and-drop area backed by a hidden file input.
function DropZone({ accept, onFile, icon, title, hint, disabled = false, id }) {
    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);

    const pick = (files) => {
        const file = files?.[0];
        if (file) onFile(file);
    };

    return (
        <div
            onDragOver={(event) => {
                event.preventDefault();
                if (!disabled) setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                if (!disabled) pick(event.dataTransfer.files);
            }}
            className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
                dragging ? 'border-violet-500 bg-violet-50' : 'border-slate-300 bg-slate-50/60 hover:border-violet-300 hover:bg-violet-50/40'
            }`}
        >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm ring-1 ring-slate-200">
                <Icon name={icon} className="h-6 w-6" />
            </span>
            <p className="mt-4 text-sm font-medium text-slate-800">
                {title}{' '}
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => inputRef.current?.click()}
                    className="font-semibold text-violet-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                >
                    browse
                </button>
            </p>
            <p className="mt-1 text-xs text-slate-500">{hint}</p>
            <input
                ref={inputRef}
                id={id}
                type="file"
                accept={accept}
                className="sr-only"
                tabIndex={-1}
                onChange={(event) => {
                    pick(event.target.files);
                    event.target.value = '';
                }}
            />
        </div>
    );
}

function ProgressBar({ percentage }) {
    return (
        <div className="space-y-1" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage ?? 0}>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 transition-all" style={{ width: `${percentage ?? 0}%` }} />
            </div>
            <p className="text-xs text-slate-500 tabular-nums">Uploading… {percentage ?? 0}%</p>
        </div>
    );
}

function CvSection({ cv, downloadName }) {
    const form = useForm({ cv: null });
    const [localError, setLocalError] = useState(null);
    const [busy, setBusy] = useState(false);
    const [percentage, setPercentage] = useState(null);
    form.processing = busy;

    const choose = (file) => {
        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
            setLocalError('Please choose a PDF file.');
            return;
        }
        if (file.size > CV_MAX) {
            setLocalError('The file is larger than 10 MB.');
            return;
        }
        setLocalError(null);
        form.clearErrors();
        form.setData('cv', file);
    };

    const upload = async (event) => {
        event.preventDefault();
        if (!form.data.cv || form.processing) return;
        setBusy(true);
        setPercentage(0);
        const result = await uploadResumeFile('cv', form.data.cv, { onProgress: setPercentage });
        setBusy(false);
        setPercentage(null);
        if (result.ok) form.reset();
        else form.setError('cv', result.error);
    };

    const remove = () => {
        if (window.confirm('Remove the CV? Visitors will no longer be able to download it. The download count is kept.')) {
            router.delete(route('admin.resume.cv.destroy'), { preserveScroll: true });
        }
    };

    const error = localError ?? form.errors.cv;

    return (
        <Card title="CV / résumé" description="The PDF visitors download from your site." icon="file">
            {cv ? (
                <div className="rounded-xl border border-slate-200 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 items-start gap-3">
                            <span className="flex h-12 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-[11px] font-bold text-red-600 ring-1 ring-red-100">
                                PDF
                            </span>
                            <div className="min-w-0">
                                <p className="truncate font-semibold text-slate-900">{cv.name}</p>
                                <p className="mt-0.5 text-sm text-slate-500">
                                    {formatBytes(cv.size)} · Uploaded {formatDate(cv.uploaded_at)}
                                </p>
                            </div>
                        </div>
                        <div className="flex shrink-0 gap-2">
                            <a href={cv.url} target="_blank" rel="noreferrer" className={secondaryButtonClass}>
                                <Icon name="eye" className="h-4 w-4" />
                                Preview / download
                            </a>
                            <button type="button" className={dangerButtonClass} onClick={remove} aria-label="Remove CV">
                                <Icon name="trash" className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <dl className="mt-4 grid gap-3 border-t border-slate-100 pt-4 text-sm sm:grid-cols-2">
                        <div>
                            <dt className="text-slate-500">Downloads</dt>
                            <dd className="mt-0.5 text-xl font-semibold text-slate-900">{formatNumber(cv.downloads)}</dd>
                        </div>
                        <div className="min-w-0">
                            <dt className="text-slate-500">Visitors receive it as</dt>
                            <dd className="mt-0.5 truncate font-mono text-sm text-slate-800">{downloadName}</dd>
                        </div>
                    </dl>
                    <p className="mt-3 text-xs text-slate-400">Opening the preview link counts as a download.</p>
                </div>
            ) : (
                <p className="text-sm text-slate-500">
                    No CV uploaded yet. The download button on the site stays hidden until you add one. Visitors will receive it as{' '}
                    <span className="font-mono text-slate-700">{downloadName}</span>.
                </p>
            )}

            <form onSubmit={upload} className="space-y-4">
                <DropZone
                    id="cv"
                    accept="application/pdf,.pdf"
                    icon="upload"
                    title={cv ? 'Drop a new PDF to replace it, or' : 'Drop your CV here, or'}
                    hint="PDF only, up to 10 MB."
                    onFile={choose}
                    disabled={form.processing}
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                {form.data.cv && (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-violet-200 bg-violet-50/50 px-4 py-3">
                        <div className="flex min-w-0 items-center gap-3">
                            <Icon name="file" className="h-5 w-5 shrink-0 text-violet-600" />
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-slate-900">{form.data.cv.name}</p>
                                <p className="text-xs text-slate-500">{formatBytes(form.data.cv.size)}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button type="button" className={secondaryButtonClass} onClick={() => form.reset()} disabled={form.processing}>
                                Cancel
                            </button>
                            <button type="submit" className={buttonClass} disabled={form.processing}>
                                <Icon name="upload" className="h-4 w-4" />
                                {cv ? 'Replace CV' : 'Upload CV'}
                            </button>
                        </div>
                    </div>
                )}
                {percentage !== null && <ProgressBar percentage={percentage} />}
            </form>
        </Card>
    );
}

function PhotoSection({ photoUrl }) {
    const { siteName } = usePage().props;
    const form = useForm({ photo: null });
    const [preview, setPreview] = useState(null);
    const [localError, setLocalError] = useState(null);
    const [busy, setBusy] = useState(false);
    const [percentage, setPercentage] = useState(null);
    form.processing = busy;

    useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

    const choose = async (file) => {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            setLocalError('Please choose a JPG, PNG or WebP image.');
            return;
        }
        if (file.size > PHOTO_MAX) {
            setLocalError('The image is larger than 4 MB.');
            return;
        }
        const size = await imageSize(file);
        if (!size) {
            setLocalError('That image could not be read. Please choose another file.');
            return;
        }
        if (size.width < 200 || size.height < 200) {
            setLocalError('The photo must be at least 200×200 pixels.');
            return;
        }
        setLocalError(null);
        form.clearErrors();
        form.setData('photo', file);
        setPreview(URL.createObjectURL(file));
    };

    const cancel = () => {
        form.reset();
        setPreview(null);
    };

    const upload = async (event) => {
        event.preventDefault();
        if (!form.data.photo || form.processing) return;
        setBusy(true);
        setPercentage(0);
        const result = await uploadResumeFile('photo', form.data.photo, { onProgress: setPercentage });
        setBusy(false);
        setPercentage(null);
        if (result.ok) cancel();
        else form.setError('photo', result.error);
    };

    const remove = () => {
        if (window.confirm('Remove your profile photo?')) {
            router.delete(route('admin.resume.photo.destroy'), { preserveScroll: true });
        }
    };

    const shown = preview ?? photoUrl;
    const error = localError ?? form.errors.photo;

    return (
        <Card title="Profile photo" description="Shown on the home and about pages." icon="image">
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative">
                    <div className="rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 p-1">
                        {shown ? (
                            <img src={shown} alt="Profile photo" className="h-36 w-36 rounded-full border-4 border-white object-cover" />
                        ) : (
                            <span className="flex h-36 w-36 items-center justify-center rounded-full border-4 border-white bg-slate-100 text-slate-400">
                                <Icon name="user" className="h-14 w-14" strokeWidth={1.25} />
                            </span>
                        )}
                    </div>
                    {preview && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-2 py-0.5 text-[11px] font-medium text-white">
                            Preview
                        </span>
                    )}
                </div>
                <div>
                    <p className="font-semibold text-slate-900">{siteName}</p>
                    <p className="text-xs text-slate-500">{photoUrl ? 'Current photo' : 'No photo yet; initials are shown instead.'}</p>
                </div>
            </div>

            <form onSubmit={upload} className="space-y-4">
                {preview ? (
                    <div className="flex flex-wrap justify-center gap-2">
                        <button type="button" className={secondaryButtonClass} onClick={cancel} disabled={form.processing}>
                            Cancel
                        </button>
                        <button type="submit" className={buttonClass} disabled={form.processing}>
                            <Icon name="upload" className="h-4 w-4" />
                            Save photo
                        </button>
                    </div>
                ) : (
                    <DropZone
                        id="photo"
                        accept="image/jpeg,image/png,image/webp"
                        icon="image"
                        title={photoUrl ? 'Drop a new photo, or' : 'Drop a photo here, or'}
                        hint="JPG, PNG or WebP · up to 4 MB · at least 200×200 px."
                        onFile={choose}
                        disabled={form.processing}
                    />
                )}
                {error && <p className="text-center text-sm text-red-600">{error}</p>}
                {percentage !== null && <ProgressBar percentage={percentage} />}
                {photoUrl && !preview && (
                    <div className="text-center">
                        <button type="button" className={dangerButtonClass} onClick={remove}>
                            <Icon name="trash" className="h-4 w-4" />
                            Remove photo
                        </button>
                    </div>
                )}
            </form>
        </Card>
    );
}

export default function ResumeEdit({ cv, photoUrl, downloadName }) {
    return (
        <AdminLayout title="Resume & photo" description="Your downloadable CV and the profile photo used across the site.">
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
                <CvSection cv={cv} downloadName={downloadName} />
                <PhotoSection photoUrl={photoUrl} />
            </div>
        </AdminLayout>
    );
}
