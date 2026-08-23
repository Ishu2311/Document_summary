import { useRef, useState, useMemo } from "react";


import {
  UploadCloud,
  FileText,
  Image,
  Sparkles,
  ShieldCheck,
  Zap,
  ScanText,
  ArrowRight,
  Check,
  X,
} from "lucide-react";

import API from "./services/api";
import "./App.css";

function App() {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [summaryLength, setSummaryLength] = useState("Medium");
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState(null);
  const [loadingText, setLoadingText] = useState("Preparing...");

  const pdfUrl = useMemo(() => {
  if (file && file.type === "application/pdf") {
    return URL.createObjectURL(file);
  }
  return null;
}, [file]);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    const allowed = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    if (!allowed.includes(selectedFile.type)) {
      alert("Please upload PDF, JPG or PNG.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("File size must be under 10 MB.");
      return;
    }

    setFile(selectedFile);
    setShowWorkspace(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const resetApp = () => {
    setFile(null);
    setResult(null);
    setShowWorkspace(false);
    setShowResults(false);
    setProcessing(false);
    setSummaryLength("Medium");
  };

  const generateSummary = async () => {
  if (!file) return;

  setProcessing(true);
  setLoadingText("Extracting text...");

  try {
    const formData = new FormData();
    formData.append("file", file);

    setLoadingText("Generating AI summary...");

    const response = await API.post("/api/analyze", formData);

    setResult(response.data);
    setShowResults(true);

  } catch (err) {
    console.error(err);
    alert("Analysis failed.");
  } finally {
    setProcessing(false);
  }
};

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="brand">
          <div className="brand-mark">
            <FileText size={20} />
          </div>

          <div className="brand-name">
            DocuLens<span>AI</span>
          </div>
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
        </div>

        <button
          className="nav-button"
          onClick={() => fileInputRef.current?.click()}
        >
          New Document
        </button>
      </nav>

      {/* HOME */}
      {!showWorkspace && !showResults && (
        <>
          <main className="hero">
            <div className="hero-badge">
              <span className="status-dot"></span>
              AI-POWERED DOCUMENT ANALYSIS
            </div>

            <h1>
              Turn complex documents into
              <span> clear insights.</span>
            </h1>

            <p className="hero-description">
              Upload a document and instantly receive AI-generated summaries,
              key points and actionable suggestions.
            </p>

            <div
              className={`upload-box ${dragging ? "upload-dragging" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="upload-icon">
                <UploadCloud size={32} />
              </div>

              <h2>Drop your document here</h2>

              <p>
                or <strong>browse files</strong>
              </p>

              <div className="supported-files">
                <span><FileText size={14}/>PDF</span>
                <span><Image size={14}/>JPG</span>
                <span><Image size={14}/>PNG</span>
              </div>

              <small>Maximum 10 MB</small>

              <input
                hidden
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>

            <div className="trust-row">
              <div><ShieldCheck size={16}/>Secure</div>
              <div><ScanText size={16}/>OCR</div>
              <div><Zap size={16}/>Fast AI</div>
            </div>
          </main>

          <section className="features" id="features">
            <div className="section-heading">
              <span>FEATURES</span>
              <h2>Built for smarter document understanding.</h2>
            </div>

            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon"><ScanText size={20}/></div>
                <h3>OCR Support</h3>
                <p>Read scanned PDFs and images using Tesseract OCR.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon"><Sparkles size={20}/></div>
                <h3>AI Summary</h3>
                <p>Generate concise summaries instantly.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon"><Zap size={20}/></div>
                <h3>Actionable Insights</h3>
                <p>Key points and recommendations automatically extracted.</p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* WORKSPACE */}
      {showWorkspace && !showResults && (
        <main className="workspace">
          <div className="workspace-top">
            <div>
              <button className="back-button" onClick={resetApp}>
                ← Upload another document
              </button>

              <h1>Analyze your document</h1>

              <p>Choose your preferences before AI analysis.</p>
            </div>

            <div className="ready-pill">
              <Check size={14}/>Ready
            </div>
          </div>

          <div className="workspace-grid">

            {/* Preview */}
            <section className="preview-card">

              <div className="card-header">

                <div className="file-info">
                  <div className="file-icon">
                    <FileText size={20}/>
                  </div>

                  <div>
                    <strong>{file?.name}</strong>
                    <span>{(file?.size/1024/1024).toFixed(2)} MB</span>
                  </div>
                </div>

                <button className="remove-button" onClick={resetApp}>
                  <X size={18}/>
                </button>

              </div>

             <div className="document-preview">

  {file?.type === "application/pdf" ? (
    <iframe
      src={pdfUrl}
      title="PDF Preview"
      className="pdf-preview"
    />
  ) : (
    <img
      src={URL.createObjectURL(file)}
      alt="Preview"
      className="image-preview"
    />
  )}

  <p>
    {file?.type === "application/pdf"
      ? "PDF Preview"
      : "Image Preview"}
  </p>

</div>

            </section>

            {/* Settings */}
            <section className="settings-card">

              <div className="settings-heading">
                <div className="settings-icon">
                  <Sparkles size={18}/>
                </div>

                <div>
                  <span>AI ANALYSIS</span>
                  <h2>Summary Settings</h2>
                </div>
              </div>

              <div className="setting-section">
                <label>Summary Length</label>

                <div className="summary-options">
                  {["Short","Medium","Long"].map(option=>(
                    <button
                      key={option}
                      className={
                        summaryLength===option
                          ? "summary-option selected"
                          : "summary-option"
                      }
                      onClick={()=>setSummaryLength(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="ai-note">
                <Sparkles size={16}/>
                <p>
                  AI will generate a summary, key points and suggestions.
                </p>
              </div>

              <button
  className="generate-button"
  onClick={generateSummary}
  disabled={processing}
>
  {processing ? (
    <>
      <span className="spinner"></span>
      {loadingText}
    </>
  ) : (
    <>
      Generate Summary
      <ArrowRight size={17} />
    </>
  )}
</button>

            </section>

          </div>
        </main>
      )}

      {/* RESULTS */}
      {showResults && (
        <ResultsView
          file={file}
          result={result}
          onNewAnalysis={resetApp}
        />
      )}

      <footer>
        <div className="footer-brand">
          <div className="brand-mark small">
            <FileText size={16}/>
          </div>
          <span>DocuLens AI</span>
        </div>
      </footer>
    </div>
  );
}

function ResultsView({ file, result, onNewAnalysis }) {
  return (
    <main className="results-page">

      <div className="results-header">

        <div>

          <div className="completed-badge">
            <Check size={14}/>
            ANALYSIS COMPLETE
          </div>

          <h1>Document Insights</h1>

          <div className="result-file">
            <div className="result-file-icon">
              <FileText size={18}/>
            </div>

            <div>
              <strong>{file?.name}</strong>
              <span>AI analysis completed successfully.</span>
            </div>
          </div>

        </div>

        <button className="primary-button" onClick={onNewAnalysis}>
          New Analysis
        </button>

      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple"><FileText size={18}/></div>
          <div><span>STATUS</span><strong>Success</strong></div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue"><Sparkles size={18}/></div>
          <div><span>AI</span><strong>Gemini</strong></div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green"><Check size={18}/></div>
          <div><span>OCR</span><strong>Enabled</strong></div>
        </div>
      </div>

      <div className="results-grid">

        <section className="result-content">

          {/* Summary */}
          <div className="result-card">

            <div className="result-card-heading">
              <div className="heading-icon">
                <FileText size={18}/>
              </div>

              <div>
                <span>OVERVIEW</span>
                <h2>Document Summary</h2>
              </div>
            </div>

            <p className="summary-text">
              {result?.summary}
            </p>

          </div>

          {/* Key Points */}
          <div className="result-card">

            <div className="result-card-heading">
              <div className="heading-icon">
                <Check size={18}/>
              </div>

              <div>
                <span>IMPORTANT FINDINGS</span>
                <h2>Key Points</h2>
              </div>
            </div>

            <div className="key-points">
              {result?.key_points?.map((point,index)=>(
                <div className="key-point" key={index}>
                  <div className="point-number">
                    {String(index+1).padStart(2,"0")}
                  </div>

                  <div>
                    <strong>{point}</strong>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Suggestions */}
          <div className="result-card">

            <div className="result-card-heading">
              <div className="heading-icon suggestion">
                <Sparkles size={18}/>
              </div>

              <div>
                <span>AI RECOMMENDATIONS</span>
                <h2>Suggestions</h2>
              </div>
            </div>

            <div className="suggestions">
              {result?.suggestions?.map((item,index)=>(
                <div className="suggestion-item" key={index}>
                  <div className="suggestion-number">
                    {String(index+1).padStart(2,"0")}
                  </div>

                  <div>
                    <strong>{item}</strong>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </section>

        <aside className="results-sidebar">

          <div className="side-card">

            <div className="side-card-title">
              <Sparkles size={17}/>
              Analysis Overview
            </div>

            <div className="analysis-status">
              <div className="success-circle">
                <Check size={20}/>
              </div>

              <strong>Successfully analyzed</strong>

              <span>
                Your document has been processed using OCR and Gemini AI.
              </span>
            </div>

            <div className="side-divider"></div>

            <div className="side-stat">
              <span>Summary</span>
              <strong>Generated</strong>
            </div>

            <div className="side-stat">
              <span>Key Points</span>
              <strong>{result?.key_points?.length || 0}</strong>
            </div>

            <div className="side-stat">
              <span>Suggestions</span>
              <strong>{result?.suggestions?.length || 0}</strong>
            </div>

          </div>

        </aside>

      </div>

    </main>
  );
}

export default App;