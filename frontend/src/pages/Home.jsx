import { useState } from "react";

import Header from "../components/Header";
import UploadScreen from "../components/UploadScreen";
import ProcessingScreen from "../components/ProcessingScreen";
import ResultView from "../components/ResultView";

function Home() {
  const [file, setFile] = useState(null);
  const [stage, setStage] = useState("upload");
  const [result, setResult] = useState(null);

  const handleFileSelected = (selectedFile) => {
    setFile(selectedFile);
  };

  const handleGenerate = async (length) => {
    setStage("processing");

    // Backend connection will be added here.
    // For now, simulate processing.

    setTimeout(() => {
      setResult({
        summary:
          "This document provides an overview of the main topic, explains the important concepts, and discusses the key findings and conclusions presented by the author.",
        keyPoints: [
          "The document introduces the main problem and its importance.",
          "Several important concepts and findings are discussed.",
          "The document presents conclusions based on the discussed information."
        ],
        suggestions: [
          "Make long paragraphs more concise.",
          "Provide additional supporting evidence where appropriate.",
          "Improve clarity in sections containing complex terminology."
        ]
      });

      setStage("results");
    }, 2500);
  };

  const resetProject = () => {
    setFile(null);
    setResult(null);
    setStage("upload");
  };

  return (
    <div className="app">

      <Header onReset={resetProject} />

      {stage === "upload" && (
        <UploadScreen
          file={file}
          onFileSelected={handleFileSelected}
          onGenerate={handleGenerate}
        />
      )}

      {stage === "processing" && (
        <ProcessingScreen file={file} />
      )}

      {stage === "results" && (
        <ResultView
          file={file}
          result={result}
          onReset={resetProject}
        />
      )}

    </div>
  );
}

export default Home;