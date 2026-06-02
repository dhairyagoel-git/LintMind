# LintMind

LintMind is an AI-powered code review and execution platform designed for developers who want instant feedback on their code. It combines AI-driven code analysis with an online code execution environment, allowing users to write, run, review, and save code from a single interface.

The platform leverages Large Language Models (LLMs) to identify bugs, suggest optimizations, improve code quality, and generate production-ready recommendations.

---

## Features

### AI Code Reviews

* Automated code analysis using LLMs
* Bug detection and issue identification
* Performance and optimization suggestions
* Readability and maintainability improvements
* Production-level code recommendations
* Complexity analysis and best-practice checks

### Code Execution

* Execute code directly from the editor
* Multi-language support

  * C
  * C++
  * Java
  * Python
* Real-time output console

### Code Management

* Save reviewed code snippets
* Access review history
* Retrieve previously saved reviews
* Delete saved reviews

### Authentication

* Email and password authentication
* Google OAuth login
* GitHub OAuth login
* JWT-based authorization

### Developer Experience

* Monaco Editor integration
* Syntax highlighting
* Markdown-based AI review rendering
* Responsive UI
* Dark theme interface

---

## Tech Stack

### Frontend

* React.js
* React Router
* Monaco Editor
* React Markdown
* Highlight.js
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Groq API

### External Services

* Groq LLM API
* Google OAuth
* GitHub OAuth
* Judge0 API (Code Execution)

---

## Project Structure

```bash
LintMind/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.js
│   │
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── App.jsx
│
└── README.md
```

---

# Frontend Routes

| Route              | Description                    |
| ------------------ | ------------------------------ |
| `/`                | Main editor and AI review page |
| `/history`         | Saved review history           |
| `/login`           | Authentication page            |
| `/github/callback` | GitHub OAuth callback handler  |

---

# Backend API Routes

## AI Routes

Base URL:

```http
/ai
```

| Method | Endpoint      | Description             |
| ------ | ------------- | ----------------------- |
| POST   | `/get-review` | Generate AI code review |

---

## Authentication Routes

Base URL:

```http
/auth
```

| Method | Endpoint  | Description        |
| ------ | --------- | ------------------ |
| POST   | `/signup` | Register user      |
| POST   | `/login`  | Login user         |
| POST   | `/logout` | Logout user        |
| GET    | `/getme`  | Get current user   |
| POST   | `/google` | Google OAuth login |
| POST   | `/github` | GitHub OAuth login |

---

## Review Routes

Base URL:

```http
/review
```

| Method | Endpoint                   | Protected |
| ------ | -------------------------- | --------- |
| POST   | `/save-review`             | Yes       |
| GET    | `/get-all-reviews`         | Yes       |
| GET    | `/get-review-by-id/:id`    | Yes       |
| DELETE | `/delete-review-by-id/:id` | Yes       |

---

## Code Execution Routes

Base URL:

```http
/run
```

| Method | Endpoint    | Description                    |
| ------ | ----------- | ------------------------------ |
| POST   | `/run-code` | Execute code and return output |

---

# Environment Variables

## Backend (.env)

Create a `.env` file inside the backend directory:

```env
GROQ_API_KEY=xxxxxxxxxxxxxxxx

MONGO_URI=xxxxxxxxxxxxxxxx

JWT_SECRET=1234567UYTGFDS

GOOGLE_CLIENT_ID=xxxxxxxxxxxxxxxx

GITHUB_CLIENT_ID=xxxxxxxxxxxxxxxx

GITHUB_CLIENT_SECRET=xxxxxxxxxxxxxxxx
```

---

## Frontend (.env)

Create a `.env` file inside the frontend directory:

```env
VITE_APP_URL=http://localhost:5000

VITE_GOOGLE_CLIENT_ID=xxxxxxxxxxxxxxxx

VITE_GITHUB_CLIENT_ID=xxxxxxxxxxxxxxxx
```

---

# Installation & Setup

## 1. Clone Repository

```bash
git clone https://github.com/dhairyagoel-git/LintMind.git

cd LintMind
```

---

## 2. Backend Setup

Navigate to backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create `.env` file using the variables above.

Start backend server:

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

---

## 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create `.env` file using the frontend variables above.

Start frontend server:

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

# Authentication Flow

1. User signs up or logs in.
2. Backend generates a JWT token.
3. Token is stored on the client.
4. Protected endpoints verify JWT through middleware.
5. Authorized users can save, retrieve, and delete reviews.

---

# Supported Languages

LintMind currently supports:

* C
* C++
* Java
* Python

Additional languages can be integrated through Judge0.

---

# Future Enhancements

* Repository-wide GitHub analysis
* AI follow-up chat
* Unit test generation
* Code explanation mode
* Static code analysis
* Export reviews as PDF
* Team collaboration features
* Review sharing via public links
* Custom AI review profiles
* CI/CD integration

---

# Security

* JWT Authentication
* Protected API routes
* Rate limiting using Express Rate Limit
* OAuth support with Google and GitHub
* Environment-based secret management

---

# Author

**Dhairya Goel**

GitHub: https://github.com/dhairyagoel-git

---

# License

This project is licensed under the MIT License.
