import React from "react";
import "./AboutUs.css";
import { motion } from "framer-motion";
import yeneseyPic from "../../../static/img/yenesey_pic.jpeg";
import ricardoPic from "../../../static/img/anonimo.jpg"; // Usa esta si lo importas igual

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
            Somos un equipo de expertos en IT y científicos de datos con experiencia en procesamiento de big data desde 2014.
            Esta trayectoria nos ha permitido lanzar este potente proyecto de análisis satelital y meteorológico orientado a la agricultura.
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
            Nuestro objetivo es proporcionar datos climáticos históricos, actuales y futuros para cualquier punto del planeta,
            así como acceso a la API Agro para desarrolladores y empresas agrícolas.
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
                Especialista en inteligencia artificial aplicada a la agricultura. Su experiencia en visión por computadora y sistemas de análisis multiespectral permite interpretar datos desde el dron hasta el agricultor.
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
                Ingeniero de datos con más de 10 años de experiencia en big data y visualización geoespacial. Diseña la infraestructura que hace posible DronFarm.
              </p>
            </div>
          </motion.section>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;
