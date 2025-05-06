import React from "react";
import "./AboutUs.css";
import { motion } from "framer-motion";
import yeneseyPic from "../../../static/img/yenesey_pic.jpeg";
import ricardoPic from "../../../static/img/Fotoperfil_Riki_v1.png"; // Usa esta si lo importas igual

const AboutUs = () => {
  return (
    <div className="landing-container fade-in">
      <div className="aboutus-container">

        {/* HERO */}
        <motion.section
          className="aboutus-card aboutus-hero-card"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h1>Sobre nosotros</h1>
          <p>
            Somos una empresa de monitoreo de cultivos mediante vuelos con dron. Nuestro equipo, formado por desarrolladores
            full stack con experiencia en IT y pilotos de dron, transforma información capturada desde el aire en herramientas
            útiles para la agricultura. Combinamos tecnología web, automatización y visión geoespacial para apoyar tanto a pequeños como grandes productores.
          </p>
        </motion.section>

        {/* MISIÓN */}
        <motion.section
          className="aboutus-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h2>Nuestra misión</h2>
          <p>
            Nuestro objetivo es facilitar la vida de los agricultores, ofreciendo monitoreo agrícola con datos precisos y herramientas digitales
            que optimicen su trabajo. Apostamos por una tecnología accesible, conectada y útil para el presente y futuro del campo.
          </p>
        </motion.section>

        {/* EQUIPO */}
        <div className="team-row">
          {/* Yenesey */}
          <motion.section
            className="team-member-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <img src={yeneseyPic} alt="Yenesey" className="team-photo" />
            <div>
              <h3>Yenesey</h3>
              <p>
                Desarrolladora web full stack con enfoque en el manejo de datos y automatización de procesos.
                Su motivación principal es crear soluciones tecnológicas que le simplifiquen
                la vida a agricultores y técnicos en campo. Combina su experiencia en programación con un
                fuerte compromiso por la eficiencia y la utilidad práctica.
              </p>
            </div>
          </motion.section>

          {/* Ricardo */}
          <motion.section
            className="team-member-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <img src={ricardoPic} alt="Ricardo" className="team-photo" />
            <div>
              <h3>Ricardo</h3>
              <p>
                Desarrollador web full stack y piloto de dron certificado. Apasionado por el escaneo y modelado 3D,
                se encarga de capturar y transformar datos del terreno en información útil para el monitoreo agrícola.
                Su experiencia une tecnología, precisión y una mirada innovadora del trabajo en campo.
              </p>
            </div>
          </motion.section>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;
