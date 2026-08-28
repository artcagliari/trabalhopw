<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect([
            'Acao',
            'Animacao',
            'Aventura',
            'Comedia',
            'Drama',
            'Ficcao Cientifica',
            'Suspense',
        ])->each(fn (string $name) => Category::firstOrCreate(
            ['slug' => Str::slug($name)],
            ['name' => $name],
        ));
    }
}
