/* 👆 🤟🏼 ❇️ Riki for the group success 17 Abril 👊 */

import React, { useState } from 'react';
import './Contact.css';
import { motion } from 'framer-motion';


const Contact = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    mensaje: ''
  });

  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Validación seria del token
  const token = localStorage.getItem('token');
  const isLoggedIn =
    token &&
    token !== 'undefined' &&
    token !== 'null' &&
    token.trim() !== '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      console.log('Datos de contacto enviados:', formData);

      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        empresa: '',
        mensaje: ''
      });

      setEnviado(true);

      setTimeout(() => {
        setEnviado(false);
      }, 5000);
    } catch (err) {
      console.error('Error al enviar formulario:', err);
      setError('Hubo un problema al enviar tu mensaje. Por favor, intenta nuevamente.');
    }
  };

  return (
    <>
      <div className="contacto-container">
        {/* 🎬 Hero con animación */}
        <motion.section
          className="contacto-hero"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h1>Contáctanos</h1>
          <p>Estamos aquí para responder a tus preguntas y ayudarte a transformar tu agricultura</p>
        </motion.section>

        <div className="contacto-content">
          {/* 🎬 Info animada desde la izquierda */}
          <motion.div
            className="contacto-info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Información de contacto</h2>
            <div className="info-item">
              <i className="icon-map">📍</i>
              <p>Av. del Bootcamp 1234, Madrid, España</p>
            </div>
            <div className="info-item">
              <i className="icon-phone">📞</i>
              <p>+34 912 345 678</p>
            </div>
            <div className="info-item">
              <i className="icon-email">✉️</i>
              <p>info@dronfarm.com</p>
            </div>

            <div className="contacto-social">
              <h3>Síguenos</h3>
              <div className="social-icons">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <i className="icon-facebook">📘</i>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <i className="icon-twitter">🐦</i>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <i className="icon-linkedin">💼</i>
                </a>
              </div>
            </div>
          </motion.div>

          {/* 🎬 Formulario animado desde la derecha */}
          <motion.div
            className="contacto-form-container"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2>Envíanos un mensaje</h2>

            {enviado && (
              <div className="mensaje-exito">
                ¡Gracias por contactarnos! Te responderemos a la brevedad.
              </div>
            )}

            {error && (
              <div className="mensaje-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="contacto-form">
              <div className="form-group">
                <label htmlFor="nombre">Nombre completo*</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo electrónico*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="empresa">Empresa/Organización</label>
                <input
                  type="text"
                  id="empresa"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="mensaje">Mensaje*</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  rows="5"
                  required
                ></textarea>
              </div>

              {/* 🎬 Botón animado */}
              <motion.button
                type="submit"
                className="submit-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Enviar mensaje
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Contact;
