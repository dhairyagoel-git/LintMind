import React, { useState, useEffect } from "react";
// import "./Navbar.css";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  // const [loggedIn, setLoggedIn] = useState(false);
  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const loggedIn = !!token;
  const [theme, setTheme] = useState("dark");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleLogin = () => {
    navigate("/login");
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setMenuOpen(false);

    navigate("/");
    // window.location.reload();
  };

  return (
    <nav className="navbar">
      {/* LEFT — Brand */}
      <div
        className="navbar-brand"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        {/* <span className="brand-icon">⚡</span> */}
        <span className="brand-name">LintMind</span>
      </div>

      {/* RIGHT — Controls */}
      <div className="navbar-controls">
        {/* Theme Toggle */}
        <button
          className="navbar-btn theme-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          aria-label="Toggle theme"
        >
          <span className="theme-icon">{theme === "dark" ? "☀️" : "🌙"}</span>
          {/* <span className="btn-label">{theme === "dark" ? "Light" : "Dark"}</span> */}
        </button>

        {/* Auth Button / Profile */}
        {loggedIn ? (
          <div className="profile-wrapper">
            <button
              className="navbar-btn profile-btn"
              onClick={() => setMenuOpen((p) => !p)}
              aria-label="Profile menu"
            >
              <span className="avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
              {/* <span className="btn-label">Profile</span> */}
            </button>

            {menuOpen && (
              <div className="dropdown">
                <div className="dropdown-header">
                  <span className="avatar-lg">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>

                  <div>
                    <p className="dropdown-name">
                      {user?.name
                        .toLowerCase()
                        .split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(" ")}
                    </p>

                    <p className="dropdown-email">{user?.email}</p>
                  </div>
                </div>

                <hr className="dropdown-divider" />

                <button
                  className="dropdown-item"
                  onClick={() => {
                    navigate("/history");
                    setMenuOpen(false);
                  }}
                >
                  View History
                </button>

                <button className="dropdown-item" onClick={logout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="navbar-btn login-btn" onClick={handleLogin}>
            {/* <span>👤</span> */}
            <span className="btn-label">Login</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
