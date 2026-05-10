import { useState } from 'react'
import Editor from "@monaco-editor/react"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import axios from 'axios'
import './App.css'

function App() {

  const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`)

  const [review, setReview] = useState("")

  async function reviewCode() {

    const response = await axios.post(
      'http://localhost:3000/ai/get-review',
      { code }
    )

    setReview(response.data)
  }

  return (
    <main>

      <div className="left">

        <div className="code">

          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value)}
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
        >
          Review
        </button>

      </div>

      <div className="right">

        <Markdown
          rehypePlugins={[rehypeHighlight]}
        >
          {review}
        </Markdown>

      </div>

    </main>
  )
}

export default App