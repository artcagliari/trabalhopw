import { Clapperboard, Edit3, Film, LogIn, LogOut } from 'lucide-react';
import React from 'react';

export default function Header({ user, view, setView, logout }) {
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
