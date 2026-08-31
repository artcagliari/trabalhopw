import '../css/app.css';

import {
    Clapperboard,
    Edit3,
    Eye,
    Film,
    FilterX,
    LogIn,
    LogOut,
    Plus,
    Search,
    Trash2,
    UserPlus,
    X,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';

const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

async function api(path, options = {}) {
    const response = await fetch(path, {
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
        const message = data.message || Object.values(data.errors || {}).flat().join(' ');
        throw new Error(message || 'Nao foi possivel concluir a operacao.');
    }

    return data;
}

function imageUrl(path) {
    if (!path) {
        return null;
    }

    return path.startsWith('http') ? path : `/storage/${path}`;
}

function posterStyle(movie) {
    const palettes = [
        'from-red-800 via-zinc-900 to-yellow-600',
        'from-emerald-800 via-zinc-900 to-cyan-700',
        'from-zinc-800 via-red-950 to-stone-700',
        'from-sky-900 via-zinc-950 to-red-700',
    ];

    return palettes[movie.id % palettes.length];
}

function App() {
    const [view, setView] = useState('gallery');
    const [user, setUser] = useState(null);
    const [movies, setMovies] = useState([]);
    const [adminMovies, setAdminMovies] = useState([]);
    const [categories, setCategories] = useState([]);
    const [years, setYears] = useState([]);
    const [filters, setFilters] = useState({ year: '', category_id: '' });
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [editingMovie, setEditingMovie] = useState(null);
    const [loadingMovies, setLoadingMovies] = useState(true);
    const [notice, setNotice] = useState('');
    const [error, setError] = useState('');

    async function loadBase() {
        const [meData, categoriesData] = await Promise.all([
            api('/api/me'),
            api('/api/categories'),
        ]);

        setUser(meData.user);
        setCategories(categoriesData.categories);
    }

    async function loadMovies(nextFilters = filters) {
        const params = new URLSearchParams();
        setLoadingMovies(true);

        Object.entries(nextFilters).forEach(([key, value]) => {
            if (value) {
                params.append(key, value);
            }
        });

        try {
            const data = await api(`/api/movies?${params}`);
            setMovies(data.movies);
            setYears(data.years);
        } finally {
            setLoadingMovies(false);
        }
    }

    async function loadAdminMovies() {
        if (!user) {
            setAdminMovies([]);
            return;
        }

        const data = await api('/api/admin/movies');
        setAdminMovies(data.movies);
    }

    useEffect(() => {
        loadBase()
            .then(() => loadMovies())
            .catch((err) => setError(err.message));
    }, []);

    useEffect(() => {
        loadAdminMovies().catch(() => setAdminMovies([]));
    }, [user]);

    async function refreshAll(message = '') {
        await Promise.all([loadMovies(), loadAdminMovies()]);
        setNotice(message);
        setError('');
    }

    async function handleAuth(event, mode) {
        event.preventDefault();
        const body = Object.fromEntries(new FormData(event.currentTarget).entries());

        try {
            const data = await api(`/api/${mode}`, {
                method: 'POST',
                body: JSON.stringify(body),
            });

            setUser(data.user);
            setView('admin');
            setNotice(mode === 'login' ? 'Login realizado com sucesso.' : 'Conta criada com sucesso.');
            setError('');
        } catch (err) {
            setError(err.message);
            setNotice('');
        }
    }

    async function logout() {
        await api('/api/logout', { method: 'POST' });
        setUser(null);
        setView('gallery');
        setNotice('Sessao encerrada.');
    }

    async function saveMovie(event) {
        event.preventDefault();
        const formElement = event.currentTarget;
        const isEditing = Boolean(editingMovie);
        const form = new FormData(formElement);

        if (isEditing) {
            form.append('_method', 'PATCH');
        }

        try {
            await api(isEditing ? `/api/admin/movies/${editingMovie.id}` : '/api/admin/movies', {
                method: 'POST',
                body: form,
            });

            formElement.reset();
            setEditingMovie(null);
            await refreshAll(isEditing ? 'Filme atualizado.' : 'Filme cadastrado.');
        } catch (err) {
            setError(err.message);
            setNotice('');
        }
    }

    async function deleteMovie(movie) {
        if (!window.confirm(`Excluir ${movie.name}?`)) {
            return;
        }

        try {
            await api(`/api/admin/movies/${movie.id}`, { method: 'DELETE' });
            await refreshAll('Filme excluido.');
        } catch (err) {
            setError(err.message);
            setNotice('');
        }
    }

    async function openMovie(movie) {
        const data = await api(`/api/movies/${movie.id}`);
        setSelectedMovie(data.movie);
    }

    function updateFilters(next) {
        const updated = { ...filters, ...next };
        setFilters(updated);
        loadMovies(updated).catch((err) => setError(err.message));
    }

    function clearFilters() {
        const emptyFilters = { year: '', category_id: '' };
        setFilters(emptyFilters);
        loadMovies(emptyFilters).catch((err) => setError(err.message));
    }

    return (
        <main className="min-h-screen bg-zinc-100 text-zinc-950">
            <Header user={user} view={view} setView={setView} logout={logout} />

            <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {(notice || error) && (
                    <div className={`mb-4 rounded border px-4 py-3 text-sm ${error ? 'border-red-300 bg-red-50 text-red-800' : 'border-emerald-300 bg-emerald-50 text-emerald-800'}`}>
                        {error || notice}
                    </div>
                )}

                {view === 'gallery' && (
                    <Gallery
                        movies={movies}
                        categories={categories}
                        years={years}
                        filters={filters}
                        loading={loadingMovies}
                        updateFilters={updateFilters}
                        clearFilters={clearFilters}
                        openMovie={openMovie}
                    />
                )}

                {view === 'admin' && (
                    user ? (
                        <Admin
                            movies={adminMovies}
                            categories={categories}
                            editingMovie={editingMovie}
                            setEditingMovie={setEditingMovie}
                            saveMovie={saveMovie}
                            deleteMovie={deleteMovie}
                        />
                    ) : (
                        <AuthForms handleAuth={handleAuth} />
                    )
                )}
            </section>

            {selectedMovie && <MovieModal movie={selectedMovie} close={() => setSelectedMovie(null)} />}
        </main>
    );
}

function Header({ user, view, setView, logout }) {
    return (
        <header className="border-b border-zinc-200 bg-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <button className="flex items-center gap-2 text-left" onClick={() => setView('gallery')}>
                    <span className="flex h-10 w-10 items-center justify-center rounded bg-red-700 text-white">
                        <Clapperboard size={22} />
                    </span>
                    <span>
                        <strong className="block text-lg">Cine PW</strong>
                        <span className="text-sm text-zinc-500">Gerenciamento de filmes</span>
                    </span>
                </button>

                <nav className="flex flex-wrap items-center gap-2">
                    <button className={view === 'gallery' ? 'btn-primary' : 'btn-muted'} onClick={() => setView('gallery')}>
                        <Film size={17} />
                        Galeria
                    </button>
                    <button className={view === 'admin' ? 'btn-primary' : 'btn-muted'} onClick={() => setView('admin')}>
                        <Edit3 size={17} />
                        Administracao
                    </button>
                    {user ? (
                        <button className="btn-muted" onClick={logout}>
                            <LogOut size={17} />
                            Sair
                        </button>
                    ) : (
                        <button className="btn-muted" onClick={() => setView('admin')}>
                            <LogIn size={17} />
                            Entrar
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
}

function Gallery({ movies, categories, years, filters, loading, updateFilters, clearFilters, openMovie }) {
    const hasFilters = Boolean(filters.year || filters.category_id);

    return (
        <>
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-red-700">Galeria</p>
                    <h1 className="mt-1 text-3xl font-bold">Filmes cadastrados</h1>
                    <p className="mt-2 text-sm text-zinc-600">
                        {movies.length} {movies.length === 1 ? 'filme encontrado' : 'filmes encontrados'}
                    </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-[160px_200px_auto]">
                    <label className="field">
                        <span>Ano</span>
                        <select value={filters.year} onChange={(event) => updateFilters({ year: event.target.value })}>
                            <option value="">Todos</option>
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </label>

                    <label className="field">
                        <span>Categoria</span>
                        <select value={filters.category_id} onChange={(event) => updateFilters({ category_id: event.target.value })}>
                            <option value="">Todas</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </label>

                    <button className="btn-muted self-end" disabled={!hasFilters} onClick={clearFilters}>
                        <FilterX size={17} />
                        Limpar
                    </button>
                </div>
            </div>

            {loading ? (
                <EmptyState text="Carregando filmes..." />
            ) : movies.length === 0 ? (
                <EmptyState text="Nenhum filme encontrado." />
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} openMovie={openMovie} />
                    ))}
                </div>
            )}
        </>
    );
}

function MovieCard({ movie, openMovie }) {
    const src = imageUrl(movie.cover_image);

    return (
        <article
            className="group overflow-hidden rounded border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            role="button"
            tabIndex="0"
            onClick={() => openMovie(movie)}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openMovie(movie);
                }
            }}
        >
            <div className={`flex aspect-[2/3] items-center justify-center bg-gradient-to-br ${posterStyle(movie)} text-center text-white`}>
                {src ? (
                    <img
                        alt={`Capa do filme ${movie.name}`}
                        className="h-full w-full object-cover"
                        src={src}
                        onError={(event) => {
                            event.currentTarget.style.display = 'none';
                        }}
                    />
                ) : (
                    <Film size={42} />
                )}
            </div>
            <div className="p-4">
                <h2 className="line-clamp-2 min-h-12 text-lg font-semibold group-hover:text-red-700">{movie.name}</h2>
                <p className="mt-1 text-sm text-zinc-600">
                    {movie.year} | {movie.category?.name}
                </p>
                <button
                    className="btn-primary mt-4 w-full justify-center"
                    onClick={(event) => {
                        event.stopPropagation();
                        openMovie(movie);
                    }}
                >
                    <Eye size={17} />
                    Ver detalhes
                </button>
            </div>
        </article>
    );
}

function AuthForms({ handleAuth }) {
    const [mode, setMode] = useState('login');

    return (
        <div className="mx-auto max-w-md rounded border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex rounded bg-zinc-100 p-1">
                <button className={tabClass(mode === 'login')} onClick={() => setMode('login')}>Entrar</button>
                <button className={tabClass(mode === 'register')} onClick={() => setMode('register')}>Criar conta</button>
            </div>

            <form className="space-y-4" onSubmit={(event) => handleAuth(event, mode)}>
                {mode === 'register' && (
                    <label className="field">
                        <span>Nome</span>
                        <input name="name" required type="text" />
                    </label>
                )}

                <label className="field">
                    <span>E-mail</span>
                    <input name="email" required type="email" defaultValue={mode === 'login' ? 'admin@example.com' : ''} />
                </label>

                <label className="field">
                    <span>Senha</span>
                    <input name="password" required type="password" defaultValue={mode === 'login' ? 'password' : ''} />
                </label>

                <button className="btn-primary w-full justify-center" type="submit">
                    {mode === 'login' ? <LogIn size={17} /> : <UserPlus size={17} />}
                    {mode === 'login' ? 'Entrar' : 'Cadastrar'}
                </button>
            </form>
        </div>
    );
}

function tabClass(active) {
    return `flex-1 rounded px-3 py-2 text-sm font-semibold ${active ? 'bg-white text-red-700 shadow-sm' : 'text-zinc-600'}`;
}

function Admin({ movies, categories, editingMovie, setEditingMovie, saveMovie, deleteMovie }) {
    const formKey = editingMovie ? editingMovie.id : 'new';

    return (
        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
            <section className="rounded border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-red-700">Administracao</p>
                        <h1 className="mt-1 text-2xl font-bold">{editingMovie ? 'Editar filme' : 'Novo filme'}</h1>
                    </div>
                    {editingMovie && (
                        <button className="btn-icon" title="Cancelar edicao" onClick={() => setEditingMovie(null)}>
                            <X size={18} />
                        </button>
                    )}
                </div>

                <form key={formKey} className="space-y-4" onSubmit={saveMovie}>
                    <label className="field">
                        <span>Nome</span>
                        <input name="name" required type="text" defaultValue={editingMovie?.name || ''} />
                    </label>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="field">
                            <span>Ano</span>
                            <input name="year" required type="number" min="1888" max={new Date().getFullYear()} defaultValue={editingMovie?.year || ''} />
                        </label>

                        <label className="field">
                            <span>Categoria</span>
                            <select name="category_id" required defaultValue={editingMovie?.category_id || ''}>
                                <option value="" disabled>Selecione</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <label className="field">
                        <span>Sinopse</span>
                        <textarea name="synopsis" required rows="5" defaultValue={editingMovie?.synopsis || ''} />
                    </label>

                    <label className="field">
                        <span>Capa</span>
                        <input name="cover_image" type="file" accept="image/*" required={!editingMovie} />
                    </label>

                    <label className="field">
                        <span>Trailer no YouTube</span>
                        <input name="youtube_trailer_link" type="url" defaultValue={editingMovie?.youtube_trailer_link || ''} />
                    </label>

                    <button className="btn-primary w-full justify-center" type="submit">
                        <Plus size={17} />
                        {editingMovie ? 'Salvar alteracoes' : 'Cadastrar filme'}
                    </button>
                </form>
            </section>

            <section className="rounded border border-zinc-200 bg-white shadow-sm">
                <div className="border-b border-zinc-200 p-5">
                    <h2 className="text-xl font-bold">Filmes cadastrados</h2>
                </div>

                {movies.length === 0 ? (
                    <EmptyState text="Nenhum filme cadastrado." />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left text-sm">
                            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                                <tr>
                                    <th className="px-4 py-3">Filme</th>
                                    <th className="px-4 py-3">Ano</th>
                                    <th className="px-4 py-3">Categoria</th>
                                    <th className="px-4 py-3">Usuario</th>
                                    <th className="px-4 py-3 text-right">Acoes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200">
                                {movies.map((movie) => (
                                    <tr key={movie.id}>
                                        <td className="px-4 py-3 font-medium">{movie.name}</td>
                                        <td className="px-4 py-3">{movie.year}</td>
                                        <td className="px-4 py-3">{movie.category?.name}</td>
                                        <td className="px-4 py-3">{movie.user?.name}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <button className="btn-icon" title="Editar" onClick={() => setEditingMovie(movie)}>
                                                    <Edit3 size={17} />
                                                </button>
                                                <button className="btn-icon-danger" title="Excluir" onClick={() => deleteMovie(movie)}>
                                                    <Trash2 size={17} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

function MovieModal({ movie, close }) {
    const trailerEmbed = useMemo(() => {
        if (!movie.youtube_trailer_link) {
            return null;
        }

        const match = movie.youtube_trailer_link.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
        return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    }, [movie.youtube_trailer_link]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <article className="max-h-[92vh] w-full max-w-4xl overflow-auto rounded bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
                    <h2 className="text-xl font-bold">{movie.name}</h2>
                    <button className="btn-icon" title="Fechar" onClick={close}>
                        <X size={18} />
                    </button>
                </div>

                <div className="grid gap-6 p-5 md:grid-cols-[260px_1fr]">
                    <div className={`aspect-[2/3] rounded bg-gradient-to-br ${posterStyle(movie)}`}>
                        {imageUrl(movie.cover_image) && (
                            <img alt={`Capa do filme ${movie.name}`} className="h-full w-full rounded object-cover" src={imageUrl(movie.cover_image)} />
                        )}
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-red-700">
                            {movie.year} | {movie.category?.name}
                        </p>
                        <p className="mt-3 leading-7 text-zinc-700">{movie.synopsis}</p>
                        <p className="mt-4 text-sm text-zinc-500">
                            Cadastrado por {movie.user?.name}
                        </p>

                        {trailerEmbed ? (
                            <iframe
                                className="mt-5 aspect-video w-full rounded border border-zinc-200"
                                src={trailerEmbed}
                                title={`Trailer de ${movie.name}`}
                                allowFullScreen
                            />
                        ) : movie.youtube_trailer_link ? (
                            <a className="btn-primary mt-5 inline-flex" href={movie.youtube_trailer_link} target="_blank" rel="noreferrer">
                                <Search size={17} />
                                Abrir trailer
                            </a>
                        ) : null}
                    </div>
                </div>
            </article>
        </div>
    );
}

function EmptyState({ text }) {
    return (
        <div className="rounded border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-500">
            {text}
        </div>
    );
}

createRoot(document.getElementById('root')).render(<App />);
