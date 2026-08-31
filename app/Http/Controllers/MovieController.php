<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Movie;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class MovieController extends Controller
{
    public function categories(): JsonResponse
    {
        return response()->json([
            'categories' => Category::orderBy('name')->get(),
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $movies = Movie::query()
            ->with(['category', 'user'])
            ->when($request->filled('year'), fn ($query) => $query->where('year', $request->integer('year')))
            ->when($request->filled('category_id'), fn ($query) => $query->where('category_id', $request->integer('category_id')))
            ->latest()
            ->get();

        return response()->json([
            'movies' => $movies,
            'years' => Movie::query()->select('year')->distinct()->orderByDesc('year')->pluck('year'),
        ]);
    }

    public function adminIndex(): JsonResponse
    {
        return response()->json([
            'movies' => Movie::with(['category', 'user'])->latest()->get(),
        ]);
    }

    public function show(Movie $movie): JsonResponse
    {
        return response()->json([
            'movie' => $movie->load(['category', 'user']),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validateMovie($request);
        $data['user_id'] = $request->user()->id;
        $data['cover_image'] = $request->file('cover_image')->store('covers', 'public');

        $movie = Movie::create($data);

        return response()->json([
            'message' => 'Filme cadastrado com sucesso.',
            'movie' => $movie->load(['category', 'user']),
        ], 201);
    }

    public function update(Request $request, Movie $movie): JsonResponse
    {
        $data = $this->validateMovie($request, false);

        if ($request->hasFile('cover_image')) {
            if ($movie->cover_image && Storage::disk('public')->exists($movie->cover_image)) {
                Storage::disk('public')->delete($movie->cover_image);
            }

            $data['cover_image'] = $request->file('cover_image')->store('covers', 'public');
        }

        $movie->update($data);

        return response()->json([
            'message' => 'Filme atualizado com sucesso.',
            'movie' => $movie->load(['category', 'user']),
        ]);
    }

    public function destroy(Movie $movie): JsonResponse
    {
        if ($movie->cover_image && Storage::disk('public')->exists($movie->cover_image)) {
            Storage::disk('public')->delete($movie->cover_image);
        }

        $movie->delete();

        return response()->json([
            'message' => 'Filme excluido com sucesso.',
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function validateMovie(Request $request, bool $creating = true): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'synopsis' => ['required', 'string', 'min:10'],
            'year' => ['required', 'integer', 'min:1888', 'max:' . now()->year],
            'category_id' => ['required', Rule::exists('categories', 'id')],
            'cover_image' => [$creating ? 'required' : 'nullable', 'image', 'max:2048'],
            'youtube_trailer_link' => ['nullable', 'url', 'max:255'],
        ]);
    }
}
