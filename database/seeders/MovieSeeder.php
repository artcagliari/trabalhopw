<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Movie;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MovieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            ['name' => 'Administrador', 'password' => 'password'],
        );

        $movies = [
            [
                'category' => 'Ficcao Cientifica',
                'name' => 'Interestelar',
                'synopsis' => 'Um grupo de exploradores viaja por um buraco de minhoca em busca de um novo lar para a humanidade.',
                'year' => 2014,
                'cover_image' => 'covers/interestelar.jpg',
                'youtube_trailer_link' => 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
            ],
            [
                'category' => 'Drama',
                'name' => 'Central do Brasil',
                'synopsis' => 'Uma ex-professora que escreve cartas para analfabetos se aproxima de um menino em busca do pai.',
                'year' => 1998,
                'cover_image' => 'covers/central-do-brasil.jpg',
                'youtube_trailer_link' => 'https://www.youtube.com/watch?v=JSWgOhRjJmo',
            ],
            [
                'category' => 'Animacao',
                'name' => 'Homem-Aranha no Aranhaverso',
                'synopsis' => 'Miles Morales descobre seus poderes e encontra herois de outras dimensoes para proteger sua cidade.',
                'year' => 2018,
                'cover_image' => 'covers/aranhaverso.jpg',
                'youtube_trailer_link' => 'https://www.youtube.com/watch?v=g4Hbz2jLxvQ',
            ],
        ];

        foreach ($movies as $movie) {
            $category = Category::where('name', $movie['category'])->firstOrFail();

            Movie::updateOrCreate(
                ['name' => $movie['name'], 'year' => $movie['year']],
                [
                    'user_id' => $user->id,
                    'category_id' => $category->id,
                    'synopsis' => $movie['synopsis'],
                    'cover_image' => $movie['cover_image'],
                    'youtube_trailer_link' => $movie['youtube_trailer_link'],
                ],
            );
        }
    }
}
