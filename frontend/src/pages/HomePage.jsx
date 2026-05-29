import { useState } from "react";
import Editor from "@monaco-editor/react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import "../App.css";
import Navbar from "../components/Navbar";

function HomePage() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`);

  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  async function reviewCode() {
    try {
      setLoading(true);
      setReview("");

      const response = await axios.post(
        `${import.meta.env.VITE_APP_URL}/ai/get-review`,
        { code },
      );

      setReview(response.data);

      setReviewed(true);
    } catch (err) {
      setReview("Error generating review.");
    } finally {
      setLoading(false);
    }
  }

  function handleCodeChange(value) {
    setCode(value);

    setReviewed(false);
  }

  return (
    <>
      <Navbar />
      <main>
        <div className="left">
          <div className="code">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={handleCodeChange}
              options={{
                fontSize: 16,
                minimap: { enabled: false },
                automaticLayout: true,
                scrollBeyondLastLine: false,
                wordWrap: "on",
              }}
            />
          </div>

          <button
            onClick={reviewCode}
            className="review"
            disabled={reviewed || loading}
          >
            {loading ? "Reviewing..." : reviewed ? "Reviewed" : "Review"}
          </button>
        </div>

        <div className="right">
          {loading ? (
            <div className="loading">
              <h2>Analyzing Code...</h2>
              <p>LintMind AI is reviewing your code.</p>
            </div>
          ) : (
            <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
          )}
        </div>
      </main>
    </>
  );
}

export default HomePage;
