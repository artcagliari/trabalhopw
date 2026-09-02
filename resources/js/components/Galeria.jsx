import { Eye, Film, FilterX } from 'lucide-react';
import React from 'react';
import EmptyState from './EmptyState';
import { caminhoDaImagem, estiloDoCartaz } from '../lib/api';

export default function Galeria({ movies, categories, years, filters, loading, updateFilters, clearFilters, openMovie }) {
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
                            {years.map((year) => <option key={year} value={year}>{year}</option>)}
                        </select>
                    </label>

                    <label className="field">
                        <span>Categoria</span>
                        <select value={filters.category_id} onChange={(event) => updateFilters({ category_id: event.target.value })}>
                            <option value="">Todas</option>
                            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
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
                    {movies.map((movie) => <MovieCard key={movie.id} movie={movie} openMovie={openMovie} />)}
                </div>
            )}
        </>
    );
}

function MovieCard({ movie, openMovie }) {
    const src = caminhoDaImagem(movie.cover_image);

    function abrirPeloTeclado(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openMovie(movie);
        }
    }

    return (
        <article
            className="group overflow-hidden rounded border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            role="button"
            tabIndex="0"
            onClick={() => openMovie(movie)}
            onKeyDown={abrirPeloTeclado}
        >
            <div className={`flex aspect-[2/3] items-center justify-center bg-gradient-to-br ${estiloDoCartaz(movie)} text-center text-white`}>
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
