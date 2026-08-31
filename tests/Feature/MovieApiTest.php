<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Movie;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MovieApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_gallery_can_be_filtered_by_year_and_category(): void
    {
        $category = Category::factory()->create(['name' => 'Drama', 'slug' => 'drama']);
        $otherCategory = Category::factory()->create(['name' => 'Acao', 'slug' => 'acao']);

        $wantedMovie = Movie::factory()->create([
            'category_id' => $category->id,
            'year' => 2018,
        ]);

        Movie::factory()->create([
            'category_id' => $otherCategory->id,
            'year' => 2020,
        ]);

        $response = $this->getJson("/api/movies?year=2018&category_id={$category->id}");

        $response
            ->assertOk()
            ->assertJsonCount(1, 'movies')
            ->assertJsonPath('movies.0.id', $wantedMovie->id);
    }

    public function test_movie_details_include_category_user_and_trailer(): void
    {
        $user = User::factory()->create(['name' => 'Aluno Teste']);
        $category = Category::factory()->create(['name' => 'Suspense', 'slug' => 'suspense']);
        $movie = Movie::factory()->create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'name' => 'Janela Indiscreta',
            'synopsis' => 'Um fotografo acompanha a vizinhanca pela janela e suspeita de um crime.',
            'year' => 1954,
            'youtube_trailer_link' => 'https://www.youtube.com/watch?v=m01YktiEZCw',
        ]);

        $response = $this->getJson("/api/movies/{$movie->id}");

        $response
            ->assertOk()
            ->assertJsonPath('movie.name', 'Janela Indiscreta')
            ->assertJsonPath('movie.category.name', 'Suspense')
            ->assertJsonPath('movie.user.name', 'Aluno Teste')
            ->assertJsonPath('movie.youtube_trailer_link', 'https://www.youtube.com/watch?v=m01YktiEZCw');
    }

    public function test_logged_user_can_create_movie(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $category = Category::factory()->create();

        $response = $this
            ->actingAs($user)
            ->post('/api/admin/movies', [
                'name' => 'Cidade de Deus',
                'synopsis' => 'Dois jovens seguem caminhos diferentes em uma comunidade marcada pela violencia.',
                'year' => 2002,
                'category_id' => $category->id,
                'cover_image' => UploadedFile::fake()->image('cidade.jpg'),
                'youtube_trailer_link' => 'https://www.youtube.com/watch?v=dcUOO4Itgmw',
            ], ['Accept' => 'application/json']);

        $response
            ->assertCreated()
            ->assertJsonPath('movie.user_id', $user->id)
            ->assertJsonPath('movie.category_id', $category->id);

        $this->assertDatabaseHas('movies', [
            'name' => 'Cidade de Deus',
            'user_id' => $user->id,
        ]);
    }

    public function test_logged_user_can_update_movie(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $category = Category::factory()->create();
        $newCategory = Category::factory()->create();
        $movie = Movie::factory()->create([
            'user_id' => $user->id,
            'category_id' => $category->id,
        ]);

        $response = $this
            ->actingAs($user)
            ->patch("/api/admin/movies/{$movie->id}", [
                'name' => 'Nome atualizado',
                'synopsis' => 'Sinopse atualizada com informacoes suficientes para validar.',
                'year' => 2024,
                'category_id' => $newCategory->id,
                'youtube_trailer_link' => 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
            ], ['Accept' => 'application/json']);

        $response
            ->assertOk()
            ->assertJsonPath('movie.name', 'Nome atualizado')
            ->assertJsonPath('movie.category_id', $newCategory->id);

        $this->assertDatabaseHas('movies', [
            'id' => $movie->id,
            'name' => 'Nome atualizado',
            'year' => 2024,
        ]);
    }

    public function test_logged_user_can_delete_movie(): void
    {
        $user = User::factory()->create();
        $movie = Movie::factory()->create(['user_id' => $user->id]);

        $response = $this
            ->actingAs($user)
            ->deleteJson("/api/admin/movies/{$movie->id}");

        $response->assertOk();

        $this->assertDatabaseMissing('movies', [
            'id' => $movie->id,
        ]);
    }

    public function test_guest_cannot_create_movie(): void
    {
        $response = $this->postJson('/api/admin/movies', []);

        $response->assertUnauthorized();
    }
}
