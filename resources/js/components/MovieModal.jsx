import { Search, X } from 'lucide-react';
import React, { useMemo } from 'react';
import { caminhoDaImagem, estiloDoCartaz } from '../lib/api';

export default function MovieModal({ movie, close }) {
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
                    <div className={`aspect-[2/3] rounded bg-gradient-to-br ${estiloDoCartaz(movie)}`}>
                        {caminhoDaImagem(movie.cover_image) && (
                            <img alt={`Capa do filme ${movie.name}`} className="h-full w-full rounded object-cover" src={caminhoDaImagem(movie.cover_image)} />
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
