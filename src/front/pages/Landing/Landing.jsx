import React from "react";
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
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                <circle cx="18" cy="6" r="3"></circle>
                <circle cx="6" cy="18" r="3"></circle>
              </svg>
            </div>
            <h3 className="cta-title">Optimiza tu cultivo hoy, invierte en precisión</h3>
            <p className="cta-description">Los agricultores que utilizan DronFarm mejoran su rentabilidad gracias a decisiones basadas en datos precisos</p>
            <button className="cta-button">¡Comienza ahora!</button>
          </div>
        </div>

        <div className="card card-terms">
          {/* Contenido que estaba en card-support */}
          <h2>Soporte</h2>
          <p>
            ¿Tienes preguntas? Contacta con nuestro equipo o visita
            el centro de ayuda.
          </p>
          <p>
            <br />
            <strong>+34 911 23 45 67</strong><br />
            <a href="mailto:soporte@dronfarm.com">soporte@dronfarm.com</a>
          </p>
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