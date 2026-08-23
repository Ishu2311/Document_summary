import {
  FileText,
  ScanText,
  Sparkles,
  CheckCircle2
} from "lucide-react";

function ProcessingScreen({ file }) {

  return (
    <main className="processing-container">

      <div className="processing-card">

        <div className="processing-animation">
          <Sparkles size={32} />
        </div>

        <span className="processing-label">
          ANALYZING DOCUMENT
        </span>

        <h1>
          Understanding your document...
        </h1>

        <p>
          {file?.name}
        </p>


        <div className="progress-bar">
          <div></div>
        </div>


        <div className="processing-steps">

          <div className="processing-step complete">

            <CheckCircle2 size={18} />

            <span>
              Document uploaded
            </span>

          </div>


          <div className="processing-step active">

            <ScanText size={18} />

            <span>
              Extracting document text
            </span>

          </div>


          <div className="processing-step">

            <Sparkles size={18} />

            <span>
              Generating AI summary
            </span>

          </div>


          <div className="processing-step">

            <FileText size={18} />

            <span>
              Preparing insights
            </span>

          </div>

        </div>

      </div>

    </main>
  );
}

export default ProcessingScreen;