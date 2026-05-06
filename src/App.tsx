import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PartnerDashboard from "./pages/PartnerDashboard";
import Register from  "./pages/Register";
// import Heatmap from "./pages/Heatmap";
import LinkPartner from "./pages/LinkPartner";
import "./app.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );
  const [view, setView] = useState<"main" | "partner" | "link">("main");
  
  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

const [authView, setAuthView] = useState<"login" | "register">("login");

if (!isLoggedIn) {
  return authView === "login" ? (
    <Login
      onLogin={() => setIsLoggedIn(true)}
      onSwitch={() => setAuthView("register")}
    />
  ) : (
    <Register
      onLogin={() => setIsLoggedIn(true)}
      onSwitch={() => setAuthView("login")}
    />
  );
}

  return (
    <div>

      {/* NAVBAR */}
      <nav className="app-navbar">
        <span className="app-navbar-brand">
          🕌 Prayer Tracker
        </span>

        <div className="app-navbar-links">
          <button
            className={`app-nav-btn ${view === "main" ? "active" : ""}`}
            onClick={() => setView("main")}
          >
            Dashboard
          </button>

          <button
            className={`app-nav-btn ${view === "partner" ? "active" : ""}`}
            onClick={() => setView("partner")}
          >
            ❤️ Our Journey
          </button>
          <button
            className={`app-nav-btn ${view === "link" ? "active" : ""}`}
            onClick={() => setView("link")}
          >
            🤝 Link Partner
          </button>


          <button className="app-nav-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      {view === "main"    && <Dashboard />}
      {view === "partner" && <PartnerDashboard />}
      {view === "link" && <LinkPartner />}
      
      {/* {view === "heatmap" && <Heatmap />} */}

    </div>
  );
}

export default App;
