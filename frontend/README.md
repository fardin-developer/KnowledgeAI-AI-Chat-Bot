# KnowledgeAI Frontend

A modern React-based frontend for the KnowledgeAI platform. Upload your knowledge base documents (PDF, DOCX, and more) and let AI provide instant, accurate answers from your own content.

## Features
- Upload PDF and DOCX files (with text extraction)
- Beautiful, responsive UI
- Drag-and-drop or click-to-upload
- Progress feedback and error handling
- Seamless integration with backend chat and authentication

## Supported File Types
- PDF (`.pdf`)
- Microsoft Word (`.docx`)
- (Easily extendable for TXT, CSV, XLSX, etc.)

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm

### Installation

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Install PDF and DOCX extraction libraries:**
   ```sh
   npm install pdfjs-dist mammoth
   ```

3. **Copy the PDF.js worker file:**
   ```sh
   cp ../node_modules/pdfjs-dist/build/pdf.worker.min.mjs public/pdf.worker.min.js
   ```
   > If you get errors about the worker, make sure the file exists in `public/` and matches the path in the code.

4. **Start the development server:**
   ```sh
   npm run dev
   ```

5. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

## Usage
- Click or drag files into the upload area.
- Supported: PDF and DOCX (Word) files.
- After upload, extracted text is shown in the console for debugging.
- On successful upload, you are redirected to the chat page.

## Troubleshooting
- **PDF Extraction Fails / Fake Worker Warning:**
  - Ensure `public/pdf.worker.min.js` exists and is copied from `node_modules/pdfjs-dist/build/pdf.worker.min.mjs`.
  - Restart the dev server after copying.
- **DOCX Extraction Fails:**
  - Only `.docx` files are supported (not `.doc`).
  - Ensure `mammoth` is installed.
- **Other Issues:**
  - Check the browser console for detailed error messages.

## Dependencies
- [React](https://reactjs.org/)
- [pdfjs-dist](https://github.com/mozilla/pdf.js) (for PDF extraction)
- [mammoth](https://github.com/mwilliamson/mammoth.js) (for DOCX extraction)
- [react-router-dom](https://reactrouter.com/)

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](../LICENSE)
