# Movie Review API

A REST API for managing movie genres, movies, user reviews, and favorites. Built as a MERN-stack backend minor project with **Node.js**, **Express.js**, **MongoDB Atlas**, and **Mongoose**. Authentication uses JWT and bcryptjs; role-based authorization restricts administrative operations.

## Features

- User registration, login, and authenticated profile access
- Full CRUD for **Genres**, **Movies**, and **Reviews**
- Movie title search, genre filter, rating/date sorting, and pagination
- Movie-to-Genre, Movie-to-User, Review-to-Movie, and Review-to-User relationships using Mongoose references
- Movie average rating recalculated when reviews are created, edited, or removed
- Personal favorites and an admin dashboard
- Input validation, ObjectId validation, standard HTTP status codes, and centralized error middleware

## Tech stack

Node.js · Express.js · MongoDB Atlas · Mongoose · JSON Web Tokens (`jsonwebtoken`) · `bcryptjs` · `dotenv` · `cors` · Nodemon · Postman

## Installation and execution

Prerequisites: Node.js/npm, a MongoDB Atlas database, and access to the project source.

```bash
npm install
```

Create a `.env` file in the project root (never commit it):

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_jwt_signing_secret
```

Start the development server:

```bash
npm run dev
```

Or start normally:

```bash
npm start
```

Base URL: `http://localhost:5000`. `GET /` returns the project welcome message. A successful connection requires valid Atlas credentials and suitable network access settings.

## Authentication and authorization

Register using `POST /api/auth/register`; login using `POST /api/auth/login`. Both responses include a JWT under `token`. For protected requests, provide:

```http
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

Newly registered accounts have the `user` role. Creating, editing, or deleting genres and movies and accessing the dashboard requires `admin`. The project does **not** expose a public admin-promotion endpoint; any test administrator should be provisioned securely in the database by the developer. Users can create reviews and manage their own reviews and favorites.

## API endpoint reference

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register | Public |
| POST | `/api/auth/login` | Login / obtain JWT | Public |
| GET | `/api/auth/profile` | Current user profile | Authenticated |
| POST | `/api/genres` | Create genre | Admin |
| GET | `/api/genres` | List genres | Public |
| GET | `/api/genres/:id` | Get genre | Public |
| PUT | `/api/genres/:id` | Update genre | Admin |
| DELETE | `/api/genres/:id` | Delete genre | Admin |
| POST | `/api/movies` | Create movie | Admin |
| GET | `/api/movies` | List/search/filter/sort/paginate movies | Public |
| GET | `/api/movies/:id` | Get movie | Public |
| PUT | `/api/movies/:id` | Update movie | Admin |
| DELETE | `/api/movies/:id` | Delete movie | Admin |
| POST | `/api/reviews` | Create review | Authenticated |
| GET | `/api/reviews` | List reviews | Public |
| GET | `/api/reviews/:id` | Get review | Public |
| PUT | `/api/reviews/:id` | Update own review | Review owner |
| DELETE | `/api/reviews/:id` | Delete own review | Review owner |
| POST | `/api/favorites` | Add movie to favorites | Authenticated |
| GET | `/api/favorites` | List own favorites | Authenticated |
| DELETE | `/api/favorites/:movieId` | Remove favorite by movie ID | Authenticated |
| GET | `/api/dashboard` | Counts, latest and top-rated movies | Admin |

### Movie listing query parameters

```http
GET /api/movies?search=Interstellar&sort=rating&page=1&limit=5
GET /api/movies?genre=YOUR_GENRE_ID
```

- `search`: case-insensitive title search
- `genre`: filter by a MongoDB Genre ObjectId
- `sort`: `latest`, `oldest`, or `rating`
- `page`: positive integer, default `1`
- `limit`: positive integer, default `5`, maximum `100`

## Example requests

### Register a user

`POST /api/auth/register`

```json
{
  "name": "Example User",
  "email": "example.user@example.com",
  "password": "choose-a-strong-test-password"
}
```

### Create a genre (admin)

`POST /api/genres`

```json
{
  "name": "Sci-Fi",
  "description": "Science fiction movies"
}
```

### Create a movie (admin)

`POST /api/movies`

```json
{
  "title": "Interstellar",
  "description": "Explorers travel through a wormhole in space.",
  "releaseYear": 2014,
  "duration": 169,
  "language": "English",
  "director": "Christopher Nolan",
  "cast": ["Matthew McConaughey", "Anne Hathaway"],
  "genre": ["YOUR_EXISTING_GENRE_ID"],
  "poster": "https://example.com/movie.jpg",
  "trailer": "https://example.com/trailer"
}
```

### Add a review (authenticated)

`POST /api/reviews`

```json
{
  "movie": "YOUR_EXISTING_MOVIE_ID",
  "rating": 5,
  "review": "Excellent science fiction movie."
}
```

### Update a review (owner)

`PUT /api/reviews/YOUR_REVIEW_ID`

```json
{
  "rating": 4,
  "review": "Still a great film."
}
```

### Add a favorite (authenticated)

`POST /api/favorites`

```json
{
  "movie": "YOUR_EXISTING_MOVIE_ID"
}
```

## Database schemas and relationships

| Collection | Principal fields | References |
|---|---|---|
| `users` | `name`, `email` (unique), `password` (hashed), `role` (`user`/`admin`), `profileImage`, `bio` | — |
| `genres` | `name` (unique), `description` | — |
| `movies` | `title`, `description`, `releaseYear`, `duration`, `language`, `director`, `cast`, `poster`, `trailer`, `averageRating` | `genre[] → Genre`, `createdBy → User` |
| `reviews` | `rating` (1–5), `review` | `movie → Movie`, `user → User` |
| `favorites` | user/movie pair, unique together | `movie → Movie`, `user → User` |

All models define Mongoose timestamps (`createdAt`, `updatedAt`). MongoDB generates `_id` identifiers.

```text
Genre  <──────── Movie ────────> User (creator)
                   │
                   │
                   ▼
                 Review ────────> User (reviewer)
                   │
Movie <──────── Favorite ───────> User (owner)
```

One movie can have several genre references, reviews, and users who have favorited it. Each review belongs to one movie and one user. Favorites have a unique compound index on the movie/user combination.

## Responses and validation

Successful reads normally use HTTP `200`; creation uses `201`. Error responses use the project structure:

```json
{
  "success": false,
  "message": "Invalid movie ID"
}
```

Relevant status codes: `400` for invalid input or malformed IDs, `401` for missing/invalid JWTs, `403` for insufficient permission, `404` for missing resources/routes, `409` for duplicate-key database conflicts where handled, and `500` for unexpected server errors.

The server includes `middleware/validateMovie.js`, `validateReview.js`, `validateObjectId.js`, and `errorMiddleware.js`. Movie body validation enforces required string/number fields and validates genre ObjectId formats; it does not by itself guarantee every referenced genre exists in the database.

## Postman testing

Import `Movie_Review_API_Cleaned.postman_collection.json` using **Postman → Import**. Configure the collection's local/current variables:

- `baseUrl`: `http://localhost:5000`
- `email`, `password`: test user login details (keep local/private)
- `token`: current JWT returned by login (keep local/private)
- `genreId`, `movieId`, `reviewId`: IDs of existing records

The collection includes positive CRUD requests, movie query tests, invalid ObjectId checks, invalid input checks, and HTTP status assertions. Database IDs and test data must be adjusted for your Atlas records. A successful collection import is not proof that every test has executed successfully; run and inspect the relevant requests in Postman. Run destructive DELETE requests only on disposable test records.

Recommended smoke-test sequence: login → get profile → list genres → create genre (admin) → create movie (admin) → add review → get movie and inspect averageRating → update/delete review → favorites → validation/authorization tests. For repeatable runs, use distinct test data or reset disposable records.

## Project structure

```text
movie-review-api/
├── app.js
├── server.js
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── package.json
├── README.md
└── Movie_Review_API_Cleaned.postman_collection.json
```

## Security and submission notes

- Do not submit `.env`, `node_modules`, real JWTs, database passwords, or real account passwords.
- Add `.env` and `node_modules/` to `.gitignore`.
- Rotate any JWT secret or test credentials previously shared outside your machine.
- Confirm the final local source contains all recent fixes before producing the final ZIP or pushing to GitHub.
- Confirm with your instructor that **Movie Review API** is an accepted topic if the approved list specifies **Movie Booking API**.

## Known implementation limitations

This project is a learning-oriented backend, not a production-ready service. Its behavior depends on the latest local code. Before submission, verify that the authentication middleware rejects tokens for deleted users, all async controllers forward unexpected errors centrally, invalid filters/sorts are handled consistently, and deleting a movie does not leave unwanted orphan reviews/favorites.
