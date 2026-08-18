# HireMe AI Frontend

A modern, responsive React frontend for **HireMe AI**, an AI-powered resume intelligence and recruiter assistant.

The application provides a chat-based interface where recruiters can ask questions about a candidate's resume and receive responses generated from the candidate's verified resume information.

## Features

- 🤖 AI-powered recruiter chat interface
- 💬 Real-time streaming responses
- 📝 Markdown rendering for AI responses
- 🌙 Dark and light theme
- 💡 Suggested recruiter questions
- 📱 Responsive design for desktop and mobile
- ⌨️ Enter to send messages
- ↵ Shift + Enter for a new line
- 🔄 Auto-scrolling chat interface
- ⚡ React + Vite frontend
- 🔗 Connected to a FastAPI backend deployed on Render

## Tech Stack

- React
- Vite
- React Markdown
- JavaScript
- CSS
- FastAPI
- Groq API

## Backend

The frontend communicates with the deployed FastAPI backend:

https://hireme-ai-backend-3oyh.onrender.com/

### API Endpoint

```text
POST /chat

## Example Questions

```text
What are the candidate's strongest skills?
```

```text
Tell me about the candidate's experience.
```

```text
What projects has the candidate worked on?
```

```text
What is the candidate's Java experience?
```

```text
What AI experience does the candidate have?
```

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/ayushmahale2709/hireme-ai-frontend.git
```

### 2. Navigate to the project

```bash
cd hireme-ai-frontend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the URL provided by Vite, usually:

```text
http://localhost:5173
```

## Build for Production

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Deployment

The frontend can be deployed using Vercel.

The backend is deployed separately on Render.

```text
Recruiter
    ↓
React Frontend
    ↓
Vercel
    ↓
FastAPI Backend
    ↓
Render
    ↓
Groq API
```

## Project Structure

```text
hireme-ai-frontend/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## Author

**Ayush Mahale**

Computer Science Engineering Student

GitHub: [https://github.com/ayushmahale2709](https://github.com/ayushmahale2709)

```
```
