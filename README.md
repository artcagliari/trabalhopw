# Sistema de Gerenciamento de Filmes

Projeto desenvolvido para a disciplina de Programacao Web III.

## Tecnologias

- PHP
- Laravel
- Composer
- React
- Tailwind CSS
- SQLite

## Funcionalidades planejadas

- Cadastro, edição, listagem e exclusão de filmes.
- Vinculo entre filme, categoria e usuario responsavel pelo cadastro.
- Galeria de filmes para usuarios.
- Filtros por ano e categoria.
- Pagina de detalhes com sinopse, capa e trailer.

## Como rodar

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm run dev
php artisan serve
```
