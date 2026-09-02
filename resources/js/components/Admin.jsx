import { Edit3, Plus, Trash2, X } from 'lucide-react';
import React from 'react';
import EmptyState from './EmptyState';

export default function Admin({ movies, categories, editingMovie, setEditingMovie, saveMovie, deleteMovie }) {
    const formKey = editingMovie ? editingMovie.id : 'new';

    return (
        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
            <section className="panel p-5">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <p className="page-label">Administracao</p>
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
                                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
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

            <section className="panel overflow-hidden">
                <div className="border-b border-zinc-200 p-5">
                    <h2 className="text-xl font-bold">Filmes cadastrados</h2>
                </div>

                {movies.length === 0 ? (
                    <EmptyState text="Nenhum filme cadastrado." />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left text-sm">
                            <thead className="table-header">
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
                                    <tr key={movie.id} className="table-row">
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
