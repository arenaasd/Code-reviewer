import './App.css'
import { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor'
import "prismjs/themes/prism-tomorrow.css";
import prism from "prismjs";
import MarkDown from 'react-markdown'
import rehypeHightlist from 'rehype-highlight'
import "highlight.js/styles/github-dark.css";
import axios from 'axios';

function App() {
  const [code, setCode] = useState(`Your Code Here...`)
  const [review, setReview] = useState(``)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    prism.highlightAll()
  })

  async function reviewCode() {
    setLoading(true);
    try {
      const response = await axios.post('https://review-backend-beta.vercel.app/ai/get-review', { code });
      setReview(response.data);
    } catch (error) {
      setReview("Error fetching review. Please try again.");
    }
    setLoading(false);
  }

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={(newCode) => setCode(newCode)}
              highlight={(code) => Prism.highlight(code, Prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira Code", monospace',
                fontSize: 14,
                color: "white",
                borderRadius: "8px",
                backgroundColor: " #16161f",
              }}
            />
          </div>
          <div onClick={!loading ? reviewCode : null} className="review">
            {loading ? <div className="spinner"></div> : "Review"}
          </div>


        </div>
        <div className="right">
          <MarkDown
            rehypePlugins={[rehypeHightlist]}
          >
            {review}</MarkDown>
        </div>
      </main>
    </>
  )
}

export default App
