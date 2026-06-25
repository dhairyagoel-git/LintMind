import { useState, useEffect, useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import "../App.css";
import { useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
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
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [problemDescription, setProblemDescription] = useState("");
  const [mobileTab, setMobileTab] = useState("editor");

  const [leftFlex, setLeftFlex] = useState(1.5  );
  // outputHeight in px; null means CSS default (180px)
  const [outputHeight, setOutputHeight] = useState(180);

  const mainRef = useRef(null);
  const isDraggingH = useRef(false); // horizontal divider (left↔right)
  const isDraggingV = useRef(false); // vertical divider (editor↔output)

  const onMouseDownH = useCallback((e) => {
    e.preventDefault();
    isDraggingH.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const onMouseDownV = useCallback((e) => {
    e.preventDefault();
    isDraggingV.current = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (isDraggingH.current && mainRef.current) {
        const rect = mainRef.current.getBoundingClientRect();
        const totalWidth = rect.width - 8; // subtract divider width
        const leftWidth = e.clientX - rect.left;
        const clampedLeft = Math.max(
          300,
          Math.min(leftWidth, totalWidth - 280),
        );
        // Convert px widths to flex ratio (total flex = 2.5 baseline)
        const ratio = clampedLeft / totalWidth;
        // left flex goes 0→2.5, right = 2.5 - leftFlex
        setLeftFlex(ratio * 2.5);
      }

      if (isDraggingV.current) {
        // Find the editor-container element
        const container = document.querySelector(".editor-container");
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const totalHeight = rect.height;
        const fromBottom = rect.bottom - e.clientY;
        const clampedOutput = Math.max(
          80,
          Math.min(fromBottom, totalHeight - 100),
        );
        setOutputHeight(clampedOutput);
      }
    };

    const onMouseUp = () => {
      if (isDraggingH.current || isDraggingV.current) {
        isDraggingH.current = false;
        isDraggingV.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        // Tell Monaco to recalculate its layout
        if (editor) {
          setTimeout(() => editor.layout(), 0);
        }
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [editor]);

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

  async function generateReview() {
    try {
      setLoading(true);
      setReview("");

      const token = localStorage.getItem("token");
      setShowReviewModal(false);
      const response = await axios.post(
        `${import.meta.env.VITE_APP_URL}/ai/get-review`,
        {
          code,
          language,
          problemDescription,
        },
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        },
      );

      setReview(response.data.summary);
      setInlineComments(response.data.inlineComments);
      setReviewed(true);

      setProblemDescription("");
      setShowReviewModal(false);
    } catch (error) {
      if (
        error.response?.data?.message ===
        "Guest limit reached. Please login to continue."
      ) {
        toast.error("Free limit reached. Login for unlimited reviews.");
      }
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

      setTitle("");
      closeModal();
      toast.success("Code saved successfully!");
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  }

  function openReviewModal() {
    setShowReviewModal(true);
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
      setLoadingOutput(true);
      const response = await axios.post(
        `${import.meta.env.VITE_APP_URL}/run/run-code`,
        {
          code,
          language,
        },
      );
      setOutput(
        response.data.stdout ||
          response.data.stderr ||
          response.data.description + "\n" + response.data.compile_output ||
          "No output",
      );
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

  const rightFlex = 2.5 - leftFlex;

  return (
    <>
      {/* <Navbar /> */}
      <main
        ref={mainRef}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {/* LEFT PANEL */}
        <div
          className="left"
          style={{
            flex: leftFlex,
            display: mobileTab === "review" ? "none" : undefined,
          }}
        >
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

            <div
              className="resize-handle-v"
              onMouseDown={onMouseDownV}
              title="Drag to resize output"
            />

            <div className="output-panel" style={{ height: outputHeight }}>
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
            onClick={openReviewModal}
            className="review"
            disabled={reviewed || loading}
          >
            {loading ? "Reviewing..." : reviewed ? "Reviewed" : "Review"}
          </button>
        </div>

        {/* ── Horizontal drag handle (left ↔ right) ── */}
        <div
          className="resize-handle-h"
          onMouseDown={onMouseDownH}
          style={{
            display: mobileTab !== "editor" ? "none" : undefined,
          }}
          title="Drag to resize panels"
        />

        <div
          className="right"
          style={{
            flex: rightFlex,
            display: mobileTab === "editor" ? "none" : undefined,
          }}
        >
          {loading ? (
            <div className="loading">
              <h2>Analyzing Code...</h2>
              <p>LintMind AI is reviewing your code.</p>
            </div>
          ) : review ? (
            <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
          ) : (
            <div className="review-empty">
              <h2>No review yet</h2>
              <p>
                Click the <strong>Review</strong> button to get an AI-powered
                analysis of your code.
              </p>
            </div>
          )}
        </div>
      </main>

      <div className="mobile-tab-bar">
        <button
          className={`mobile-tab ${mobileTab === "editor" ? "active" : ""}`}
          onClick={() => setMobileTab("editor")}
        >
          Editor
        </button>
        <button
          className={`mobile-tab ${mobileTab === "review" ? "active" : ""}`}
          onClick={() => setMobileTab("review")}
        >
          Review {review && !loading ? "●" : ""}
        </button>
      </div>

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

      {showReviewModal && (
        <div className="modal-overlay">
          <div
            className={`review-modal ${
              closing ? "modal-slide-up" : "modal-slide-down"
            }`}
          >
            <div className="modal-header">
              <h2>AI Review</h2>
              <button
                className="close-btn"
                onClick={() => setShowReviewModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <label>Problem Title / Description (Optional)</label>
              <textarea
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="Example:

  Two Sum

  or

  Leetcode 238 Product of Array Except Self

  or paste the full problem statement..."
              />
              <div className="modal-actions">
                <button onClick={generateReview}>Generate Review</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toaster position="bottom-right" />
    </>
  );
}

export default HomePage;
