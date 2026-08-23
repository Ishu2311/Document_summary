import { useRef, useState } from "react";

import {
  UploadCloud,
  FileText,
  Image,
  Sparkles
} from "lucide-react";

function UploadScreen({
  file,
  onFileSelected,
  onGenerate
}) {

  const inputRef = useRef(null);

  const [dragging, setDragging] = useState(false);

  const [summaryLength, setSummaryLength] =
    useState("medium");

  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg"
  ];

  const selectFile = (selectedFile) => {

    if (!selectedFile) return;

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Please upload a PDF, JPG, or PNG file.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10 MB.");
      return;
    }

    onFileSelected(selectedFile);
  };

  const handleDrop = (event) => {

    event.preventDefault();

    setDragging(false);

    selectFile(event.dataTransfer.files[0]);
  };

  return (
    <main className="main-container">

      <section className="page-heading">

        <span className="eyebrow">
          DOCUMENT SUMMARY ASSISTANT
        </span>

        <h1>
          Turn your documents into
          <span> clear insights.</span>
        </h1>

        <p>
          Upload a PDF or image and get an AI-generated
          summary, key points, and improvement suggestions.
        </p>

      </section>


      {!file ? (

        <div
          className={`upload-area ${
            dragging ? "dragging" : ""
          }`}

          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}

          onDragLeave={() =>
            setDragging(false)
          }

          onDrop={handleDrop}

          onClick={() =>
            inputRef.current.click()
          }
        >

          <div className="upload-icon-large">
            <UploadCloud size={34} />
          </div>

          <h2>
            Upload your document
          </h2>

          <p>
            Drag & drop your file here or
            <strong> browse files</strong>
          </p>

          <div className="file-types">

            <span>
              <FileText size={14} />
              PDF
            </span>

            <span>
              <Image size={14} />
              JPG
            </span>

            <span>
              <Image size={14} />
              PNG
            </span>

          </div>

          <small>
            Maximum file size: 10 MB
          </small>

          <input
            ref={inputRef}
            type="file"
            hidden
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(event) =>
              selectFile(event.target.files[0])
            }
          />

        </div>

      ) : (

        <section className="document-workspace">

          <div className="document-card">

            <div className="document-card-header">

              <div className="document-title">

                <div className="document-icon">
                  <FileText size={22} />
                </div>

                <div>
                  <strong>{file.name}</strong>

                  <small>
                    {(file.size / 1024 / 1024).toFixed(2)}
                    {" "}MB
                  </small>
                </div>

              </div>

              <span className="ready-badge">
                ✓ Ready
              </span>

            </div>


            <div className="document-preview">

              <FileText size={50} />

              <p>
                Document ready for analysis
              </p>

              <small>
                PDF / Image processing will be handled
                by the backend.
              </small>

            </div>

          </div>


          <div className="settings-card">

            <div className="settings-header">

              <div>
                <span className="settings-label">
                  ANALYSIS SETTINGS
                </span>

                <h2>
                  Summary preferences
                </h2>
              </div>

              <Sparkles size={22} />

            </div>


            <div className="setting-group">

              <label>
                Summary length
              </label>

              <div className="length-options">

                {["short", "medium", "long"].map(
                  (length) => (

                    <button
                      key={length}

                      className={
                        summaryLength === length
                          ? "length-option active"
                          : "length-option"
                      }

                      onClick={() =>
                        setSummaryLength(length)
                      }
                    >
                      {length}
                    </button>

                  )
                )}

              </div>

            </div>


            <div className="analysis-options">

              <label>
                <input
                  type="checkbox"
                  defaultChecked
                />

                Key points
              </label>

              <label>
                <input
                  type="checkbox"
                  defaultChecked
                />

                Main ideas
              </label>

              <label>
                <input
                  type="checkbox"
                  defaultChecked
                />

                Improvement suggestions
              </label>

            </div>


            <button
              className="generate-button"
              onClick={() =>
                onGenerate(summaryLength)
              }
            >

              <Sparkles size={18} />

              Generate Summary

            </button>

          </div>

        </section>

      )}

    </main>
  );
}

export default UploadScreen;