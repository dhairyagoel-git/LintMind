import React, { useEffect, useState,useContext } from "react";
import axios from "axios";
import "../css/ReviewPage.css";
import { useNavigate } from "react-router-dom";

const History = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_APP_URL}/review/get-all-reviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data.reviews);
        setReviews(response.data.reviews);
        setLoading(false);
        // console.log(reviews);
      })
      .catch((err) => {
        setError(err.mesage);
        setLoading(false);
      });
  }, []);
  if (loading) return <div> Loading.....</div>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  return (
    <div className="history-page">
      <div className="history-header">
        <h1>Review History</h1>
        {/* <p>Track, revisit and improve y our previous code reviews.</p> */}
      </div>{" "}
      <div className="history-grid">
        {reviews.map((review) => (
          <div className="history-card">
            <div className="history-top">
              <div className="history-info">
                <h3>{review.title}</h3>

                <p className="history-language">{review.language}</p>
              </div>

              <div className="history-arrow">
                <button
                  onClick={() =>
                    navigate("/", {
                      state: {
                        code: review.code,
                        review: review.review,
                      },
                    })
                  }
                >
                  →
                </button>
              </div>
            </div>

            <div className="history-meta">
              <span>{review.code.split("\n").length} lines</span>

              <span>{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
