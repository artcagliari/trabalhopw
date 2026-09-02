import '../css/app.css';

import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Admin from './components/Admin';
import AuthForms from './components/AuthForms';
import Galeria from './components/Galeria';
import Header from './components/Header';
import MovieModal from './components/MovieModal';
import { api } from './lib/api';

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
        const meData = await api('/api/me');
        const categoriesData = await api('/api/categories');

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

    async function loadAdminMovies(currentUser = user) {
        if (!currentUser) {
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
        await loadMovies();
        await loadAdminMovies();
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
        <main className="min-h-screen text-zinc-950">
            <Header user={user} view={view} setView={setView} logout={logout} />

            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {(notice || error) && (
                    <div className={`mb-5 rounded border px-4 py-3 text-sm shadow-sm ${error ? 'border-red-300 bg-red-50 text-red-800' : 'border-emerald-300 bg-emerald-50 text-emerald-800'}`}>
                        {error || notice}
                    </div>
                )}

                {view === 'gallery' && (
                    <Galeria
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

createRoot(document.getElementById('root')).render(<App />);
