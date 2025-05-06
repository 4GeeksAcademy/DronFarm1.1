import React from "react";
import { Link } from 'react-router-dom';
import "./Landing.css";
import mavicImage from "../../assets/img/Mavic 3 volando.png";

const Landing = () => {
  return (
    <div className="landing-container fade-in">

      <div className="cards-container">
        <div className="card card-main">
          <h1>Plataforma integral de monitoreo agrícola</h1>
          <h4>Decisiones inteligentes con datos reales</h4>

          {/* Contenedor para la imagen (antes estaba en card-terms) */}
          <div className="main-image-container">
            <img src={mavicImage} alt="Drone Mavic 3 volando" />
          </div>
        </div>

        <div className="card card-support">
          <div className="cta-container">
            <div className="cta-icon">
              <i className="fas fa-search-dollar"></i>
            </div>
            <h3 className="cta-title">Optimiza tu cultivo hoy, invierte en precisión</h3>
            <p className="cta-description">DronFarm mejora la rentabilidad gracias a decisiones basadas en datos precisos</p>
            <Link to="/signup" className="cta-button">¡Comienza ahora!</Link>
          </div>
        </div>


        <div className="card card-terms">
          <h2>Síguenos</h2>
          <div className="social-links-contact">
            <a href="#" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="social-item">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="social-item">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="social-item">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" aria-label="X (Twitter)" target="_blank" rel="noopener noreferrer" className="social-item">
              <i className="fab fa-x-twitter"></i>
            </a>
          </div>
        </div>


        {/* Sustituimos el contenido de la caja de Síguenos por Qué detectamos */}
        <div className="card card-social">
          <h2>Qué detectamos</h2>
          <div className="services-grid">
            <div className="service-item">
              <i className="fas fa-tint-slash"></i>
              <h3>Estrés hídrico</h3>
              <p>Identificamos áreas con déficit o exceso de agua</p>
            </div>
            <div className="service-item">
              <i className="fas fa-disease"></i>
              <h3>Plagas y enfermedades</h3>
              <p>Detección temprana de problemas fitosanitarios</p>
            </div>
            <div className="service-item">
              <i className="fas fa-seedling"></i>
              <h3>Vigor del cultivo</h3>
              <p>Análisis del estado de salud de tus plantaciones</p>
            </div>
            <div className="service-item">
              <i className="fas fa-flask"></i>
              <h3>Deficiencias nutricionales</h3>
              <p>Carencias de nutrientes en tiempo real</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;