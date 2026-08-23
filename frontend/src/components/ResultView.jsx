import {
  FileText,
  CheckCircle2,
  Lightbulb,
  Download
} from "lucide-react";

function ResultView({
  file,
  result,
  onReset
}) {

  return (
    <main className="results-container">

      <div className="results-header">

        <div>

          <span className="result-label">
            ANALYSIS COMPLETE
          </span>

          <h1>
            {file?.name}
          </h1>

          <p>
            Your document has been successfully analyzed.
          </p>

        </div>


        <button
          className="download-button"
        >
          <Download size={17} />
          Download Summary
        </button>

      </div>


      <div className="results-layout">

        <section className="result-main">

          <div className="result-tabs">

            <button className="active">
              Summary
            </button>

            <button>
              Key Points
            </button>

            <button>
              Insights
            </button>

          </div>


          <div className="summary-section">

            <div className="result-section-heading">

              <div>
                <span>AI SUMMARY</span>
                <h2>Document Overview</h2>
              </div>

            </div>


            <p className="summary-text">
              {result?.summary}
            </p>

          </div>


          <div className="result-divider"></div>


          <div className="summary-section">

            <div className="result-section-heading">

              <div>
                <span>IMPORTANT INFORMATION</span>
                <h2>Key Points</h2>
              </div>

              <CheckCircle2 />

            </div>


            <div className="key-points">

              {result?.keyPoints?.map(
                (point, index) => (

                  <div
                    className="key-point"
                    key={index}
                  >

                    <CheckCircle2 size={19} />

                    <p>{point}</p>

                  </div>

                )
              )}

            </div>

          </div>


          <div className="result-divider"></div>


          <div className="summary-section">

            <div className="result-section-heading">

              <div>
                <span>DOCUMENT ANALYSIS</span>
                <h2>
                  Improvement Suggestions
                </h2>
              </div>

              <Lightbulb />

            </div>


            <div className="suggestions">

              {result?.suggestions?.map(
                (suggestion, index) => (

                  <div
                    className="suggestion"
                    key={index}
                  >

                    <Lightbulb size={18} />

                    <p>{suggestion}</p>

                  </div>

                )
              )}

            </div>

          </div>

        </section>


        <aside className="result-sidebar">

          <div className="sidebar-card">

            <span>
              DOCUMENT
            </span>

            <div className="sidebar-document">

              <div className="document-icon">
                <FileText size={20} />
              </div>

              <div>
                <strong>
                  {file?.name}
                </strong>

                <small>
                  Successfully analyzed
                </small>
              </div>

            </div>

          </div>


          <div className="sidebar-card">

            <span>
              ANALYSIS
            </span>

            <div className="analysis-stat">
              <strong>3</strong>
              <small>Key points identified</small>
            </div>

            <div className="analysis-stat">
              <strong>3</strong>
              <small>Suggestions generated</small>
            </div>

          </div>


          <button
            className="new-document-button"
            onClick={onReset}
          >
            Analyze another document
          </button>

        </aside>

      </div>

    </main>
  );
}

export default ResultView;