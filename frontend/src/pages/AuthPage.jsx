import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../css/AuthPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { GoogleLogin } from "@react-oauth/google";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/");
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const endpoint = isLogin ? "/auth/login" : "/auth/signup";

      const payload = isLogin
        ? {
            email: formData.email,
            password: formData.password,
          }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          };

      const response = await axios.post(
        `${import.meta.env.VITE_APP_URL}${endpoint}`,
        payload,
      );

      const user = response.data.data;

      localStorage.setItem("token", user.token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: user._id,
          name: user.name,
          email: user.email,
        }),
      );

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Navbar /> */}

      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <h1>LintMind</h1>
            <p>AI-powered code reviews for developers</p>
          </div>

          <div className="auth-tabs">
            <button
              className={isLogin ? "active" : ""}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>

            <button
              className={!isLogin ? "active" : ""}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="input-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <label className="show-password">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword((prev) => !prev)}
              />
              Show Password
            </label>
            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading
                ? "Please wait..."
                : isLogin
                  ? "Login"
                  : "Create Account"}
            </button>
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                const res = await axios.post(
                  `${import.meta.env.VITE_APP_URL}/auth/google`,
                  {
                    credential: credentialResponse.credential,
                  },
                );

                const user = res.data.data;

                localStorage.setItem("token", user.token);

                localStorage.setItem(
                  "user",
                  JSON.stringify({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                  }),
                );

                navigate("/");
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
