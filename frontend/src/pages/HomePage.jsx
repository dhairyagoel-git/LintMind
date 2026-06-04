import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import "../App.css";
import { useLocation } from "react-router-dom";
// import Navbar from "../components/Navbar";

function HomePage() {
  const location = useLocation();
  const [code, setCode] = useState(
    location.state?.code ||
      `#include <bits/stdc++.h>
using namespace std;

int main() {
    cout << "Hello World";
    return 0;
}`,
  );

  const [review, setReview] = useState(location.state?.review || "");
  const [inlineComments, setInlineComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reviewed, setReviewed] = useState(!!location.state?.review);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [closing, setClosing] = useState(false);
  const [output, setOutput] = useState("");
  const [loadingOutput, setLoadingOutput] = useState(false);
  const [language, setLanguage] = useState("cpp");
  const [editor, setEditor] = useState(null);
  const [monacoInstance, setMonacoInstance] = useState(null);

  const languageTemplates = {
    cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    cout << "Hello World";
    return 0;
}`,

    c: `#include <stdio.h>

int main() {
    printf("Hello World");
    return 0;
}`,

    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`,

    python: `print("Hello World")`,
  };
  useEffect(() => {
    if (!editor || !monacoInstance) return;

  
    const decorations = inlineComments.map((comment) => ({
      range: new monacoInstance.Range(comment.line, 1, comment.line, 1),

      options: {
        glyphMarginClassName:
          comment.severity === "error"
            ? "lintmind-error"
            : comment.severity === "warning"
              ? "lintmind-warning"
              : "lintmind-suggestion",

        glyphMarginHoverMessage: {
          value: comment.message,
        },
      },
    }));
    editor.deltaDecorations([], decorations);
  }, [inlineComments, editor, monacoInstance]);
  async function reviewCode() {
    try {
      setLoading(true);
      setReview("");

      const response = await axios.post(
        `${import.meta.env.VITE_APP_URL}/ai/get-review`,
        { code, language },
      );
      // console.log(response.data.summary);
      setReview(response.data.summary);
      setInlineComments(response.data.inlineComments);
      console.log("Inline comments: ", response.data.inlineComments);
      setReviewed(true);
    } catch (err) {
      setReview("Error generating review.");
    } finally {
      setLoading(false);
    }
  }
  async function saveCode() {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_APP_URL}/review/save-review`,
        {
          title,
          language,
          code,
          review,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // console.log(response.data);

      setTitle("");
      closeModal();
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  }
  function openTitleModal() {
    setShowModal(true);
    setClosing(false);
  }
  function closeModal() {
    setClosing(true);

    setTimeout(() => {
      setShowModal(false);
      setClosing(false);
    }, 300);
  }
  async function runCode() {
    try {
      // const token = localStorage.getItem("token");
      setLoadingOutput(true);
      const response = await axios.post(
        `${import.meta.env.VITE_APP_URL}/run/run-code`,
        {
          code,
          language,
        },
      );

      setOutput(response.data.stdout || response.data.stderr || "No output");
      setLoadingOutput(false);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  function handleCodeChange(value) {
    setCode(value);
    setInlineComments([]);
    setReviewed(false);
  }

  return (
    <>
      {/* <Navbar /> */}
      <main>
        <div className="left">
          <div className="editor-container">
            <div className="code">
              <Editor
                height="100%"
                language={
                  language === "cpp"
                    ? "cpp"
                    : language === "python"
                      ? "python"
                      : language === "java"
                        ? "java"
                        : "c"
                }
                theme="vs-dark"
                value={code}
                onChange={handleCodeChange}
                onMount={(editor, monaco) => {
                  setEditor(editor);
                  setMonacoInstance(monaco);
                }}
                options={{
                  glyphMargin: true,
                  fontSize: 16,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                }}
              />
            </div>

            <div className="output-panel">
              <div className="output-header">Output</div>

              <pre className="output-content">
                {loadingOutput
                  ? "Running...."
                  : output
                    ? output
                    : "Run your code to see output"}
              </pre>
            </div>
          </div>
          <select
            className="language-select"
            value={language}
            onChange={(e) => {
              const newLanguage = e.target.value;
              setLanguage(newLanguage);
              setCode(languageTemplates[newLanguage]);
            }}
          >
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
          </select>
          <button className="run-code" onClick={runCode}>
            Run Code
          </button>
          <button className="save-code" onClick={openTitleModal}>
            Save Code
          </button>
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
      {showModal && (
        <div className="modal-overlay">
          <div
            className={`save-modal ${
              closing ? "modal-slide-up" : "modal-slide-down"
            }`}
          >
            <div className="modal-header">
              <h2>Save Code</h2>

              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <label>Name of the project</label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title..."
              />

              <div className="modal-actions">
                <button onClick={saveCode}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HomePage;
