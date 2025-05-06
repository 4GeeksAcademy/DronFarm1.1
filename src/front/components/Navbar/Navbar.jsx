import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/img/Logo_DronFarm_Iconocolor_sinmarcoDEF.png";
import logoDark from "../../assets/img/Logo_DronFarm_IconoBlanco_sinmarco.png";
import { showSuccessAlert } from '../../components/modal_alerts/modal_alerts';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detectar modo oscuro
  useEffect(() => {
    const root = document.body;
    const observer = new MutationObserver(() => {
      setIsDarkMode(root.classList.contains("dark-mode"));
    });
    setIsDarkMode(root.classList.contains("dark-mode"));
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Detectar si hay token válido
  useEffect(() => {
    const token = localStorage.getItem("token");
    const isValid =
      token && token !== "undefined" && token !== "null" && token.trim().length > 10;
    setIsLoggedIn(isValid);
  }, []);

  // Cerrar el menú si se hace clic fuera de la hamburguesa o el menú
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && !menuRef.current.contains(e.target) && !hamburgerRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

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

  const handleGoToPanel = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("user_id");

      if (!token || !userId) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/fields/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });

      const fields = await response.json();

      if (Array.isArray(fields) && fields.length > 0) {
        navigate("/app/dashboard");
      } else {
        showSuccessAlert("¡Bienvenido! Aún no has registrado tu primer cultivo 🌱", () => {
          navigate("/app/plot_form");
        });
      }

      setMenuOpen(false);
    } catch (error) {
      console.error("Error al verificar campos del usuario:", error);
      navigate("/login"); // Fallback
    }
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
          <div className={`hamburger-menu-container ${menuOpen ? "active" : ""}`} ref={hamburgerRef}>
            <div className="hamburger-icon" id="hamburger-icon" onClick={toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className={`dropdown-menu ${menuOpen ? "show" : ""}`} ref={menuRef}>
              <a onClick={() => goTo("/")}>Inicio</a>
              <a onClick={() => goTo("/servicios")}>Servicios</a>
              <a onClick={() => goTo("/nosotros")}>Nosotros</a>
              <a onClick={() => goTo("/why-us")}>¿Por qué DronFarm?</a>
              <a onClick={() => goTo("/contacto")}>Contacto</a>
              <a onClick={toggleDarkMode} className="dark-toggle-link">
                {isDarkMode ? "Modo claro ☀️" : "Modo oscuro 🌙"}
              </a>
              <a onClick={() => {
                setMenuOpen(false);
                window.dispatchEvent(new CustomEvent('start-tour'));
              }}>
                Ver tour 🚀
              </a>
            </div>
          </div>

          <div className="nav-buttons">
            {isLoggedIn ? (
              <>
                <button className="panel-btn" onClick={handleGoToPanel}>
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
