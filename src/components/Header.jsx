// src/components/Header.jsx
import React from "react";
import "./Header.css"; // optional if you want separate styles

function Header() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    window.location.href = "/login"; // or use React Router's navigate
  };

  return (
    <div className="header">
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Header;
