import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/img/Logo_DronFarm_Iconocolor_sinmarco.png";
import logoDark from "../../assets/img/Logo_DronFarm_IconoBlanco_sinmarco.png";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  // Detectar scroll
  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detectar modo oscuro en body
  // Detectar modo oscuro en body
  useEffect(() => {
    const root = document.body;
    const observer = new MutationObserver(() => {
      setIsDarkMode(root.classList.contains("dark-mode"));
    });
    setIsDarkMode(root.classList.contains("dark-mode"));
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Detectar si hay token válido en localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const isValid =
      token && token !== "undefined" && token !== "null" && token.trim().length > 10;
    setIsLoggedIn(isValid);
  }, []);

  // Detectar si hay token válido en localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const isValid =
      token && token !== "undefined" && token !== "null" && token.trim().length > 10;
    setIsLoggedIn(isValid);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const goTo = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.body.classList.toggle("dark-mode", newMode);
    localStorage.setItem("darkMode", newMode);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setIsLoggedIn(false);
    navigate("/");
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-content">
        <img
          src={isDarkMode ? logoDark : logo}
          alt="Logo DronFarm"
          className="logo-navbar"
          onClick={() => navigate("/")}
        />

        <div className="navbar-right">
          <div className={`hamburger-menu-container ${menuOpen ? "active" : ""}`}>
            <div className="hamburger-icon" onClick={toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className={`dropdown-menu ${menuOpen ? "show" : ""}`}>
              <a onClick={() => goTo("/")}>Inicio</a>
              <a onClick={() => goTo("/servicios")}>Servicios</a>
              <a onClick={() => goTo("/nosotros")}>Nosotros</a>
              <a onClick={() => goTo("/contacto")}>Contacto</a>
              <a onClick={toggleDarkMode} className="dark-toggle-link">
                {isDarkMode ? "Modo claro ☀️" : "Modo oscuro 🌙"}
              </a>
            </div>
          </div>

          <div className="nav-buttons">
            {isLoggedIn ? (
              <>
                <button className="panel-btn" onClick={() => goTo("/app/dashboard")}>
                  Mi Panel
                </button>
                <button className="logout-btn" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <button className="login-btn" onClick={() => goTo("/login")}>
                  Iniciar Sesión
                </button>
                <button className="signup-btn" onClick={() => goTo("/signup")}>
                  Registrarse
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
