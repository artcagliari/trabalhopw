import { Search, X } from 'lucide-react';
import React, { useMemo } from 'react';
import { caminhoDaImagem, estiloDoCartaz, linkDoTrailer } from '../lib/api';

export default function MovieModal({ movie, close }) {
    const trailerEmbed = useMemo(() => {
        return linkDoTrailer(movie.youtube_trailer_link);
    }, [movie.youtube_trailer_link]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <article className="max-h-[92vh] w-full max-w-4xl overflow-auto rounded bg-white shadow-2xl ring-1 ring-black/10">
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

                        <div className="mt-5">
                            <h3 className="mb-2 text-base font-semibold text-zinc-900">Trailer</h3>

                            {trailerEmbed ? (
                                <iframe
                                    className="aspect-video w-full rounded border border-zinc-200 bg-zinc-950 shadow-sm"
                                    src={trailerEmbed}
                                    title={`Trailer de ${movie.name}`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                            ) : movie.youtube_trailer_link ? (
                                <a className="btn-primary inline-flex" href={movie.youtube_trailer_link} target="_blank" rel="noreferrer">
                                    <Search size={17} />
                                    Abrir trailer
                                </a>
                            ) : (
                                <p className="rounded border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500">
                                    Este filme ainda nao tem trailer cadastrado.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}
