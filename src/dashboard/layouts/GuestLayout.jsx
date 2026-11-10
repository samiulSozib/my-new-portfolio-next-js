import Icon from '@dashboard/components/Admin/Icon';
import { Link, usePage } from '@dashboard/lib/inertia';

// Decorative "neural network" of nodes and links for the brand panel.
const nodes = [
    [60, 80], [180, 40], [300, 110], [420, 60], [110, 210], [240, 250], [380, 220], [470, 300],
    [70, 360], [200, 400], [330, 370], [440, 430], [130, 500], [280, 520], [400, 540],
];
const links = [
    [0, 1], [1, 2], [2, 3], [0, 4], [1, 5], [2, 5], [2, 6], [3, 6], [6, 7], [4, 5], [5, 6], [4, 8],
    [5, 9], [6, 10], [7, 11], [8, 9], [9, 10], [10, 11], [8, 12], [9, 13], [10, 13], [11, 14], [12, 13], [13, 14],
];

function BrandPanel() {
    const { siteName } = usePage().props;

    return (
        <div className="relative hidden overflow-hidden bg-slate-950 text-white lg:flex lg:w-1/2 lg:flex-col xl:w-[55%]">
            <div className="bg-grid-dark absolute inset-0 animate-drift [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" aria-hidden="true" />
            <div className="absolute -top-32 -left-24 h-[28rem] w-[28rem] animate-glow rounded-full bg-violet-600/40 blur-3xl" aria-hidden="true" />
            <div className="absolute -right-20 -bottom-32 h-[26rem] w-[26rem] animate-glow rounded-full bg-cyan-500/30 blur-3xl [animation-delay:-4s]" aria-hidden="true" />

            <svg viewBox="0 0 520 580" className="absolute top-1/2 right-[-6%] h-[78%] -translate-y-1/2 opacity-60" aria-hidden="true">
                <defs>
                    <linearGradient id="net-line" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#a78bfa" />
                        <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                </defs>
                {links.map(([a, b]) => (
                    <line
                        key={`${a}-${b}`}
                        x1={nodes[a][0]}
                        y1={nodes[a][1]}
                        x2={nodes[b][0]}
                        y2={nodes[b][1]}
                        stroke="url(#net-line)"
                        strokeOpacity="0.35"
                        strokeWidth="1"
                    />
                ))}
                {nodes.map(([x, y], index) => (
                    <circle key={index} cx={x} cy={y} r={index % 3 === 0 ? 4 : 2.5} fill={index % 2 ? '#22d3ee' : '#a78bfa'} fillOpacity="0.9" />
                ))}
            </svg>

            <div className="relative flex flex-1 flex-col justify-between p-12 xl:p-16">
                <Link href="/" className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-lg shadow-violet-900/40">
                        <Icon name="sparkles" className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <span className="text-lg font-semibold">{siteName}</span>
                </Link>

                <div className="max-w-md">
                    <p className="text-sm font-medium tracking-wider text-cyan-300 uppercase">Content dashboard</p>
                    <h2 className="mt-3 text-4xl leading-tight font-semibold tracking-tight">
                        Write, build and share{' '}
                        <span className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">what you learn.</span>
                    </h2>
                    <p className="mt-4 text-slate-400">
                        Manage posts, projects, experience and your CV for the public site, all from one place.
                    </p>
                </div>

                <p className="text-sm text-slate-500" suppressHydrationWarning>© {new Date().getFullYear()} {siteName}</p>
            </div>
        </div>
    );
}

export default function GuestLayout({ title, description, children }) {
    const { siteName } = usePage().props;

    return (
        <div className="flex min-h-screen bg-white">
            <BrandPanel />

            <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12">
                <div className="mx-auto w-full max-w-sm">
                    <Link href="/" className="mb-10 flex items-center gap-3 lg:hidden">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white">
                            <Icon name="sparkles" className="h-5 w-5" strokeWidth={2} />
                        </span>
                        <span className="text-lg font-semibold text-slate-900">{siteName}</span>
                    </Link>

                    {title && <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>}
                    {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}

                    <div className={title || description ? 'mt-8' : ''}>{children}</div>
                </div>
            </div>
        </div>
    );
}
