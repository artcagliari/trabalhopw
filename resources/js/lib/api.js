const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

export async function api(url, options = {}) {
    const response = await fetch(url, {
        headers: {
            Accept: 'application/json',
            'X-CSRF-TOKEN': csrfToken,
            ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
            ...options.headers,
        },
        credentials: 'same-origin',
        ...options,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const errors = Object.values(data.errors || {}).flat();
        throw new Error(data.message || errors.join(' ') || 'Nao foi possivel concluir.');
    }

    return data;
}

export function caminhoDaImagem(path) {
    if (!path) {
        return null;
    }

    return path.startsWith('http') ? path : `/storage/${path}`;
}

export function estiloDoCartaz(movie) {
    const cores = [
        'from-red-800 via-zinc-900 to-yellow-600',
        'from-emerald-800 via-zinc-900 to-cyan-700',
        'from-zinc-800 via-red-950 to-stone-700',
        'from-sky-900 via-zinc-950 to-red-700',
    ];

    return cores[movie.id % cores.length];
}
