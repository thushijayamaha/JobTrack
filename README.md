# JobTrack

JobTrack is a full-stack job application tracking system with an Angular frontend and a Laravel API backend.

## Project Structure

```text
JobTrack/
	frontend/   # Angular application
	backend/    # Laravel API
	README.md
```

## Requirements

- Node.js and npm
- PHP 8.2 or later
- Composer
- A database supported by Laravel

## Backend Setup

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

The Laravel API runs at `http://127.0.0.1:8000` by default.

For the first setup, the Laravel project also provides this command:

```bash
composer run setup
```

Before running migrations, configure the database connection in `backend/.env`.

## Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
npm start
```

The Angular application runs at `http://localhost:4200` by default.

## Useful Commands

### Frontend

```bash
cd frontend
npm run build
npm test
```

### Backend

```bash
cd backend
php artisan test
php artisan migrate:fresh --seed
```

## GitHub

The project is hosted at [github.com/thushijayamaha/JobTrack](https://github.com/thushijayamaha/JobTrack).