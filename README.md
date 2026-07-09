# 🎬 Movie Review API

A RESTful Movie Review API built using **Node.js**, **Express.js**, **MongoDB**, **Mongoose**, **JWT Authentication**, and **bcrypt**. This project demonstrates authentication, authorization, CRUD operations, relationships between collections, and protected APIs.

---

# 🚀 Tech Stack

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcryptjs
* dotenv
* CORS

---

# 📁 Project Modules

### 1. Authentication

* Register User
* Login User
* Get Profile

### 2. Genre

* Create Genre
* Get Genres

### 3. Movie

* Create Movie
* Get All Movies
* Get Movie By ID
* Update Movie
* Delete Movie

### 4. Review

* Add Review
* Get Reviews
* Update Review
* Delete Review

### 5. Favorites

* Add Favorite
* Get Favorites
* Remove Favorite

---

# 🔗 Module Dependency

```text
Authentication
        │
        ▼
Genre
        │
        ▼
Movie
        │
        ▼
Review
        │
        ▼
Favorites
```

---

# ⚙️ Installation

## Clone the Repository

```bash
git clone <repository-url>
```

```bash
cd movie-review-api
```

---

## Install Dependencies

```bash
npm install
```

---

## Create Environment File

Create a `.env` file in the project root.

```env
PORT=5000

MONGO_URI=YOUR_MONGODB_CONNECTION_STRING

JWT_SECRET=YOUR_SECRET_KEY
```

---

## Run the Application

Development Mode

```bash
npm run dev
```

Production Mode

```bash
npm start
```

---

# 📮 API Execution Order

Follow the APIs in this sequence.

## 1. Register User

**POST**

```http
/api/auth/register
```

Body

```json
{
    "name": "priya",
    "email": "priya@gmail.com",
    "password": "priya123"
}
```

Copy the generated JWT Token.

---

## 2. Login

**POST**

```http
/api/auth/login
```

Body

```json
{
    "email": "priya@gmail.com",
    "password": "priya123"
}
```

Copy the Login Token.

---

## 3. Get Profile

**GET**

```http
/api/auth/profile
```

Authorization

```text
Bearer <LOGIN_TOKEN>
```

---

# 🎭 Genre Module

## Create Genre

**POST**

```http
/api/genres
```

Authorization

```text
Bearer <ADMIN_LOGIN_TOKEN>
```

Body

```json
{
    "name": "Sci-Fi",
    "description": "Sci-Fi Movies"
}
```

Copy the generated Genre ID.

---

## Get Genres

**GET**

```http
/api/genres
```

Copy the Genre ID.

---

# 🎬 Movie Module

> Use the Genre ID from the Genre module.

## Create Movie

**POST**

```http
/api/movies
```

Authorization

```text
Bearer <ADMIN_LOGIN_TOKEN>
```

Body

```json
{
    "title": "Interstellar",
    "description": "A team of explorers travel through a wormhole in space.",
    "releaseYear": 2014,
    "duration": 169,
    "language": "English",
    "director": "Christopher Nolan",
    "cast": [
        "Matthew McConaughey",
        "Anne Hathaway",
        "Jessica Chastain"
    ],
    "genre": [
        "GENRE_ID"
    ],
    "poster": "https://example.com/interstellar.jpg",
    "trailer": "https://youtube.com/example"
}
```

Copy the generated Movie ID.

---

## Get All Movies

**GET**

```http
/api/movies
```

---

## Get Movie By ID

**GET**

```http
/api/movies/:movieId
```

---

## Update Movie

**PUT**

```http
/api/movies/:movieId
```

Authorization

```text
Bearer <ADMIN_LOGIN_TOKEN>
```

---

## Delete Movie

**DELETE**

```http
/api/movies/:movieId
```

Authorization

```text
Bearer <ADMIN_LOGIN_TOKEN>
```

---

# ⭐ Review Module

> Use the Movie ID from the Movie module.

## Add Review

**POST**

```http
/api/reviews
```

Authorization

```text
Bearer <USER_LOGIN_TOKEN>
```

Body

```json
{
    "movie": "MOVIE_ID",
    "rating": 5,
    "review": "Outstanding movie with excellent visuals."
}
```

---

## Get Reviews

**GET**

```http
/api/reviews
```

Copy the Review ID.

---

## Update Review

**PUT**

```http
/api/reviews/:reviewId
```

Authorization

```text
Bearer <USER_LOGIN_TOKEN>
```

Body

```json
{
    "rating": 4,
    "review": "Good movie with excellent visuals."
}
```

---

## Delete Review

**DELETE**

```http
/api/reviews/:reviewId
```

Authorization

```text
Bearer <USER_LOGIN_TOKEN>
```

---

# ❤️ Favorites Module

> Use the Movie ID from the Movie module.

## Add Favorite

**POST**

```http
/api/favorites
```

Authorization

```text
Bearer <USER_LOGIN_TOKEN>
```

Body

```json
{
    "movie": "MOVIE_ID"
}
```

---

## Get Favorites

**GET**

```http
/api/favorites
```

Authorization

```text
Bearer <USER_LOGIN_TOKEN>
```

---

## Remove Favorite

**DELETE**

```http
/api/favorites/:movieId
```

Authorization

```text
Bearer <USER_LOGIN_TOKEN>
```

---

# 🔐 Authorization

| API             | Token Required |
| --------------- | -------------- |
| Register        | ❌ No           |
| Login           | ❌ No           |
| Profile         | ✅ Login Token  |
| Create Genre    | ✅ Admin Token  |
| Get Genres      | ❌ No           |
| Create Movie    | ✅ Admin Token  |
| Get Movies      | ❌ No           |
| Update Movie    | ✅ Admin Token  |
| Delete Movie    | ✅ Admin Token  |
| Add Review      | ✅ User Token   |
| Update Review   | ✅ User Token   |
| Delete Review   | ✅ User Token   |
| Add Favorite    | ✅ User Token   |
| Get Favorites   | ✅ User Token   |
| Remove Favorite | ✅ User Token   |

---

# 📌 API Flow

```text
Register User
      ↓
Login
      ↓
Get Profile
      ↓
Create Genre
      ↓
Get Genres
      ↓
Create Movie
      ↓
Get Movies
      ↓
Update/Delete Movie
      ↓
Add Review
      ↓
Get Reviews
      ↓
Update/Delete Review
      ↓
Add Favorite
      ↓
Get Favorites
      ↓
Remove Favorite
```

---

# 👨‍💻 Developed For

This project is designed for learning:

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* REST APIs
* CRUD Operations
* MongoDB Relationships
* Backend Development Best Practices
