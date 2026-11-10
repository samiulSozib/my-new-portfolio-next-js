// Route names from the old Laravel/Ziggy setup, mapped to Next.js URLs.
// Page routes point at pages under src/app/(dashboard); mutation routes point at JSON endpoints under src/app/api.

const routes = {
    // Pages
    login: '/login',
    'password.request': '/forgot-password',
    'password.reset': '/reset-password/{token}',
    'profile.edit': '/account',
    'admin.dashboard': '/admin',
    'admin.posts.index': '/admin/posts',
    'admin.posts.create': '/admin/posts/create',
    'admin.posts.edit': '/admin/posts/{param}/edit',
    'admin.projects.index': '/admin/projects',
    'admin.projects.create': '/admin/projects/create',
    'admin.projects.edit': '/admin/projects/{param}/edit',
    'admin.experience.index': '/admin/experience',
    'admin.experience.create': '/admin/experience/create',
    'admin.experience.edit': '/admin/experience/{param}/edit',
    'admin.resume.edit': '/admin/resume',
    'admin.site.edit': '/admin/site',
    'admin.about.edit': '/admin/about',
    'admin.subscribers.index': '/admin/subscribers',

    // JSON endpoints
    'login.store': '/api/auth/login',
    logout: '/api/auth/logout',
    'password.email': '/api/auth/forgot-password',
    'password.store': '/api/auth/reset-password',
    'password.update': '/api/auth/password',
    'profile.update': '/api/account',
    'profile.destroy': '/api/account',
    'admin.posts.store': '/api/admin/posts',
    'admin.posts.update': '/api/admin/posts/{param}',
    'admin.posts.destroy': '/api/admin/posts/{param}',
    'admin.projects.store': '/api/admin/projects',
    'admin.projects.update': '/api/admin/projects/{param}',
    'admin.projects.destroy': '/api/admin/projects/{param}',
    'admin.experience.store': '/api/admin/experience',
    'admin.experience.update': '/api/admin/experience/{param}',
    'admin.experience.destroy': '/api/admin/experience/{param}',
    'admin.resume.upload': '/api/admin/resume/upload',
    'admin.resume.cv.store': '/api/admin/resume/cv',
    'admin.resume.cv.destroy': '/api/admin/resume/cv',
    'admin.resume.photo.store': '/api/admin/resume/photo',
    'admin.resume.photo.destroy': '/api/admin/resume/photo',
    'admin.site.update': '/api/admin/site',
    'admin.about.update': '/api/admin/about',
    'admin.subscribers.destroy': '/api/admin/subscribers/{param}',
};

export function route(name, param) {
    const path = routes[name];
    if (!path) throw new Error(`Unknown route: ${name}`);
    return path.replace(/\{[a-z]+\}/, () => encodeURIComponent(String(param ?? '')));
}

// Name patterns like "admin.posts.*" for highlighting the current navigation item.
export function routeMatches(pattern, pathname) {
    if (!pathname) return false;
    if (!pattern.endsWith('.*')) return pathname === route(pattern);
    const prefix = pattern.slice(0, -2);
    const base = route(routes[`${prefix}.index`] ? `${prefix}.index` : `${prefix}.edit`);
    return pathname === base || pathname.startsWith(`${base}/`);
}
