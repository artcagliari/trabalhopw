<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Movie;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Movie>
 */
class MovieFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'category_id' => Category::factory(),
            'name' => fake()->sentence(3),
            'synopsis' => fake()->paragraph(4),
            'year' => fake()->numberBetween(1980, 2026),
            'cover_image' => 'covers/filme-exemplo.jpg',
            'youtube_trailer_link' => 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
        ];
    }
}
