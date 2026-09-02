import { LogIn, UserPlus } from 'lucide-react';
import React, { useState } from 'react';

export default function AuthForms({ handleAuth }) {
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
