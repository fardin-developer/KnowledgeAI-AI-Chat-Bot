import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import * as mammoth from "mammoth";
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const UploadKnowledge = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractedTexts, setExtractedTexts] = useState<{[key: string]: string}>({});
  const [processingFiles, setProcessingFiles] = useState<{[key: string]: boolean}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      return fullText.trim();
    } catch (error: any) {
      console.error('Error extracting text from PDF:', error);
      alert('Failed to extract text from PDF: ' + (error?.message || error));
      return 'Error extracting text from PDF';
    }
  };

  const extractTextFromDocx = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const { value } = await mammoth.extractRawText({ arrayBuffer });
      return value.trim();
    } catch (error: any) {
      console.error('Error extracting text from DOCX:', error);
      alert('Failed to extract text from DOCX: ' + (error?.message || error));
      return 'Error extracting text from DOCX';
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
    
    // Extract text from PDF files
    for (const file of selectedFiles) {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        console.log(`Processing PDF: ${file.name}`);
        setProcessingFiles(prev => ({ ...prev, [file.name]: true }));
        
        const extractedText = await extractTextFromPDF(file);
        setExtractedTexts(prev => ({
          ...prev,
          [file.name]: extractedText
        }));
        setProcessingFiles(prev => ({ ...prev, [file.name]: false }));
        console.log(`Extracted text from ${file.name}:`, extractedText);
      } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.name.toLowerCase().endsWith('.docx')
      ) {
        setProcessingFiles(prev => ({ ...prev, [file.name]: true }));
        const extractedText = await extractTextFromDocx(file);
        setExtractedTexts(prev => ({
          ...prev,
          [file.name]: extractedText
        }));
        setProcessingFiles(prev => ({ ...prev, [file.name]: false }));
        console.log(`Extracted text from ${file.name}:`, extractedText);
      }
    }
  };

  const removeFile = (index: number) => {
    const fileToRemove = files[index];
    setFiles(prev => prev.filter((_, i) => i !== index));
    setExtractedTexts(prev => {
      const newTexts = { ...prev };
      delete newTexts[fileToRemove.name];
      return newTexts;
    });
    setProcessingFiles(prev => {
      const newProcessing = { ...prev };
      delete newProcessing[fileToRemove.name];
      return newProcessing;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    // Log all extracted texts before upload
    console.log('=== ALL EXTRACTED TEXTS SUMMARY ===');
    Object.keys(extractedTexts).forEach(fileName => {
      console.log(`\n--- ${fileName} ---`);
      console.log(extractedTexts[fileName]);
      console.log(`--- END OF ${fileName} ---\n`);
    });
    console.log('=== END OF SUMMARY ===');

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          // Navigate to chat after successful upload
          setTimeout(() => {
            navigate('/chat');
          }, 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Here you would typically upload files to your backend
    // For now, we'll just simulate the upload
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'txt':
        return '📃';
      case 'csv':
        return '📊';
      case 'xlsx':
      case 'xls':
        return '📈';
      default:
        return '📁';
    }
  };

  return (
    <div className="upload-page">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .upload-page {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 20px;
          position: relative;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
        }

        .header h1 {
          color: #333;
          font-size: 2.5rem;
          margin-bottom: 10px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header p {
          color: #666;
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .upload-area {
          border: 3px dashed #667eea;
          border-radius: 15px;
          padding: 60px 20px;
          text-align: center;
          background: rgba(102, 126, 234, 0.05);
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 30px;
        }

        .upload-area:hover {
          border-color: #764ba2;
          background: rgba(118, 75, 162, 0.05);
          transform: translateY(-2px);
        }

        .upload-area.dragover {
          border-color: #4ecdc4;
          background: rgba(78, 205, 196, 0.1);
        }

        .upload-icon {
          font-size: 4rem;
          margin-bottom: 20px;
          color: #667eea;
        }

        .upload-text {
          font-size: 1.3rem;
          color: #333;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .upload-subtext {
          color: #666;
          font-size: 1rem;
        }

        .file-input {
          display: none;
        }

        .supported-formats {
          background: rgba(102, 126, 234, 0.1);
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 30px;
        }

        .supported-formats h3 {
          color: #333;
          margin-bottom: 15px;
          font-size: 1.2rem;
        }

        .format-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .format-tag {
          background: #667eea;
          color: white;
          padding: 5px 12px;
          border-radius: 15px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .file-list {
          margin-bottom: 30px;
        }

        .file-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8f9fa;
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 10px;
          border: 1px solid #e9ecef;
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .file-icon {
          font-size: 2rem;
        }

        .file-details h4 {
          color: #333;
          margin-bottom: 5px;
          font-size: 1rem;
        }

        .file-details p {
          color: #666;
          font-size: 0.9rem;
        }

        .remove-btn {
          background: #ff6b6b;
          color: white;
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .remove-btn:hover {
          background: #ff5252;
          transform: scale(1.1);
        }

        .upload-btn {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 30px;
          padding: 15px 40px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          position: relative;
          overflow: hidden;
        }

        .upload-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }

        .upload-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 4px;
          background: rgba(255, 255, 255, 0.3);
          transition: width 0.3s ease;
        }

        .progress-fill {
          height: 100%;
          background: #4ecdc4;
          transition: width 0.3s ease;
        }

        .back-btn {
          background: transparent;
          color: #667eea;
          border: 2px solid #667eea;
          border-radius: 25px;
          padding: 10px 25px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .back-btn:hover {
          background: #667eea;
          color: white;
        }

        .success-message {
          text-align: center;
          color: #4ecdc4;
          font-size: 1.1rem;
          font-weight: 600;
          margin-top: 20px;
        }

        @media (max-width: 768px) {
          .container {
            padding: 20px;
            margin: 10px;
          }

          .header h1 {
            font-size: 2rem;
          }

          .upload-area {
            padding: 40px 20px;
          }

          .upload-icon {
            font-size: 3rem;
          }

          .file-item {
            flex-direction: column;
            gap: 10px;
            text-align: center;
          }

          .file-info {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>

      <div className="container">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>

        <div className="header">
          <h1>Upload Your Knowledge Base</h1>
          <p>
            Upload your FAQ documents, manuals, training materials, or any text-based files. 
            Our AI will learn from your content to provide accurate, contextual responses.
          </p>
        </div>

        <div className="supported-formats">
          <h3>Supported File Formats</h3>
          <div className="format-list">
            <span className="format-tag">PDF</span>
            <span className="format-tag">DOC/DOCX</span>
            <span className="format-tag">TXT</span>
            <span className="format-tag">CSV</span>
            <span className="format-tag">XLSX/XLS</span>
          </div>
        </div>

        <div 
          className={`upload-area ${files.length > 0 ? 'has-files' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add('dragover');
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('dragover');
          }}
          onDrop={async (e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('dragover');
            const droppedFiles = Array.from(e.dataTransfer.files);
            setFiles(prev => [...prev, ...droppedFiles]);
            
            // Extract text from PDF files
            for (const file of droppedFiles) {
              if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
                console.log(`Processing dropped PDF: ${file.name}`);
                setProcessingFiles(prev => ({ ...prev, [file.name]: true }));
                
                const extractedText = await extractTextFromPDF(file);
                setExtractedTexts(prev => ({
                  ...prev,
                  [file.name]: extractedText
                }));
                setProcessingFiles(prev => ({ ...prev, [file.name]: false }));
                console.log(`Extracted text from dropped ${file.name}:`, extractedText);
              } else if (
                file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                file.name.toLowerCase().endsWith('.docx')
              ) {
                setProcessingFiles(prev => ({ ...prev, [file.name]: true }));
                const extractedText = await extractTextFromDocx(file);
                setExtractedTexts(prev => ({
                  ...prev,
                  [file.name]: extractedText
                }));
                setProcessingFiles(prev => ({ ...prev, [file.name]: false }));
                console.log(`Extracted text from dropped ${file.name}:`, extractedText);
              }
            }
          }}
        >
          <div className="upload-icon">📁</div>
          <div className="upload-text">Drop files here or click to browse</div>
          <div className="upload-subtext">
            Upload multiple files to build a comprehensive knowledge base
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="file-input"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
        />

        {files.length > 0 && (
          <div className="file-list">
            <h3 style={{ marginBottom: '15px', color: '#333' }}>
              Selected Files ({files.length})
            </h3>
                         {files.map((file, index) => (
               <div key={index} className="file-item">
                 <div className="file-info">
                   <div className="file-icon">{getFileIcon(file.name)}</div>
                   <div className="file-details">
                     <h4>{file.name}</h4>
                     <p>{formatFileSize(file.size)}</p>
                     {processingFiles[file.name] && (
                       <p style={{ color: '#667eea', fontSize: '0.8rem' }}>
                         🔄 Processing PDF...
                       </p>
                     )}
                     {extractedTexts[file.name] && !processingFiles[file.name] && (
                       <div>
                         <p style={{ color: '#4ecdc4', fontSize: '0.8rem' }}>
                           ✅ Text extracted ({extractedTexts[file.name].length} characters)
                         </p>
                         <button 
                           onClick={() => {
                             console.log(`=== EXTRACTED TEXT FROM ${file.name} ===`);
                             console.log(extractedTexts[file.name]);
                             console.log(`=== END OF ${file.name} ===`);
                           }}
                           style={{
                             background: 'transparent',
                             border: '1px solid #4ecdc4',
                             color: '#4ecdc4',
                             borderRadius: '5px',
                             padding: '2px 8px',
                             fontSize: '0.7rem',
                             cursor: 'pointer',
                             marginTop: '5px'
                           }}
                         >
                           View in Console
                         </button>
                       </div>
                     )}
                   </div>
                 </div>
                 <button 
                   className="remove-btn" 
                   onClick={() => removeFile(index)}
                   title="Remove file"
                 >
                   ×
                 </button>
               </div>
             ))}
          </div>
        )}

        <button 
          className="upload-btn" 
          onClick={handleUpload}
          disabled={files.length === 0 || uploading}
        >
          {uploading ? (
            <>
              Uploading... {uploadProgress}%
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </>
          ) : (
            'Upload Knowledge Base'
          )}
        </button>

        {uploadProgress === 100 && (
          <div className="success-message">
            ✅ Knowledge base uploaded successfully! Redirecting to chat...
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadKnowledge; 