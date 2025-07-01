# KnowledgeAI: AI Chat Bot (MERN)

A full-stack AI-powered chat bot platform built with the MERN stack (MongoDB, Express, React, Node.js). Upload your knowledge base documents (PDF, DOCX, and more) and let AI provide instant, accurate answers from your own content.

---

## Features
- Upload and extract text from PDF and DOCX files
- AI-powered chat interface (OpenAI integration)
- User authentication (signup, login, logout)
- Modern, responsive UI
- Drag-and-drop or click-to-upload for knowledge base files
- Progress feedback and error handling
- Seamless integration between backend and frontend

## Tech Stack
- **Frontend:** React, Vite, TypeScript, pdfjs-dist, mammoth
- **Backend:** Node.js, Express, MongoDB, OpenAI API

## Directory Structure
```
AI-Chat-Bot-MERN/
  backend/      # Node.js/Express API, MongoDB models, controllers, routes
  frontend/     # React app (Vite, TypeScript, PDF/DOCX extraction)
  README.md     # Main project README (this file)
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm
- MongoDB (local or cloud)

### 1. Clone the Repository
```sh
git clone https://github.com/fardin-developer/KnowledgeAI-AI-Chat-Bot.git
cd KnowledgeAI-AI-Chat-Bot
```

### 2. Setup the Backend
```sh
cd backend
npm install
# Create your .env file (see backend/README.md or .env.example)
npm run dev
```
- The backend will start on [http://localhost:5001](http://localhost:5001) by default.

### 3. Setup the Frontend
```sh
cd ../frontend
npm install
npm install pdfjs-dist mammoth
# Copy the PDF.js worker file:
cp ../node_modules/pdfjs-dist/build/pdf.worker.min.mjs public/pdf.worker.min.js
npm run dev
```
- The frontend will start on [http://localhost:5173](http://localhost:5173) by default.
- See [frontend/README.md](frontend/README.md) for more details and troubleshooting.

## Usage
- Register or log in as a user.
- Upload your knowledge base files (PDF, DOCX supported).
- After upload, chat with the AI using your own content.

## Troubleshooting
- **PDF Extraction Fails / Fake Worker Warning:**
  - Ensure `frontend/public/pdf.worker.min.js` exists and is copied from `node_modules/pdfjs-dist/build/pdf.worker.min.mjs`.
  - Restart the dev server after copying.
- **DOCX Extraction Fails:**
  - Only `.docx` files are supported (not `.doc`).
  - Ensure `mammoth` is installed.
- **Other Issues:**
  - Check the browser console and backend logs for detailed error messages.

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)
