import { Clapperboard, Edit3, Film, LogIn, LogOut } from 'lucide-react';
import React from 'react';

export default function Header({ user, view, setView, logout }) {
    return (
        <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 shadow-sm backdrop-blur">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <button className="flex items-center gap-2 text-left" onClick={() => setView('gallery')}>
                    <span className="flex h-11 w-11 items-center justify-center rounded bg-zinc-950 text-red-100 shadow-sm">
                        <Clapperboard size={22} />
                    </span>
                    <span>
                        <strong className="block text-xl leading-6">Cine PW</strong>
                        <span className="text-sm text-zinc-500">{user ? `Logado como ${user.name}` : 'Gerenciamento de filmes'}</span>
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
