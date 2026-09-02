import React from 'react';

export default function EmptyState({ text }) {
    return (
        <div className="rounded border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-500">
            {text}
        </div>
    );
}
