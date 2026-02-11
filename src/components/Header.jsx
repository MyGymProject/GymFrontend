import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/login"); // client-side navigation
  };

  return (
    <div className="header">
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Header;
