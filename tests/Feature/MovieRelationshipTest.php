<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Movie;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MovieRelationshipTest extends TestCase
{
    use RefreshDatabase;

    public function test_movie_belongs_to_user_and_category(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        $movie = Movie::factory()->create([
            'user_id' => $user->id,
            'category_id' => $category->id,
        ]);

        $this->assertTrue($movie->user->is($user));
        $this->assertTrue($movie->category->is($category));
    }

    public function test_user_and_category_list_their_movies(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        $movie = Movie::factory()->create([
            'user_id' => $user->id,
            'category_id' => $category->id,
        ]);

        $this->assertTrue($user->movies->contains($movie));
        $this->assertTrue($category->movies->contains($movie));
    }
}
