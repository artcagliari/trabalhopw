import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
    return (
        <main className="min-h-screen bg-zinc-100 text-zinc-900">
            <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-12">
                <p className="text-sm font-semibold uppercase tracking-wide text-red-700">
                    Programacao Web III
                </p>

                <h1 className="mt-3 text-4xl font-bold">
                    Sistema de Gerenciamento de Filmes
                </h1>

                <p className="mt-4 max-w-2xl text-lg text-zinc-700">
                    Base inicial do projeto com Laravel no back-end, React no front-end,
                    migrations, models, relacionamentos e seeders.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded border border-zinc-200 bg-white p-4">
                        <h2 className="font-semibold">Filmes</h2>
                        <p className="mt-2 text-sm text-zinc-600">
                            Cadastro com capa, ano, sinopse, categoria e trailer.
                        </p>
                    </div>

                    <div className="rounded border border-zinc-200 bg-white p-4">
                        <h2 className="font-semibold">Categorias</h2>
                        <p className="mt-2 text-sm text-zinc-600">
                            Organizacao dos filmes por genero.
                        </p>
                    </div>

                    <div className="rounded border border-zinc-200 bg-white p-4">
                        <h2 className="font-semibold">Usuarios</h2>
                        <p className="mt-2 text-sm text-zinc-600">
                            Cada filme guarda o usuario responsavel pelo cadastro.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}

createRoot(document.getElementById('root')).render(<App />);
