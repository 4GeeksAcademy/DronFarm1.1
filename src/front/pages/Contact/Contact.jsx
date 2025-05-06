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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      console.log('Datos de contacto enviados:', formData);
      setFormData({ nombre: '', email: '', telefono: '', empresa: '', mensaje: '' });
      setEnviado(true);
      setTimeout(() => setEnviado(false), 5000);
    } catch (err) {
      setError('Hubo un problema al enviar tu mensaje. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="landing-container fade-in">
      <div className="contacto-container">
        {/* HERO */}
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

        {/* COLUMNS (CONTACTO INFO + FORM) */}
        <div className="contacto-columns">
          {/* INFO DE CONTACTO - Con dos secciones */}
          <motion.div
            className="contacto-info contacto-item"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="info-top-section">
              <h2>Información de contacto</h2>
              <div className="info-list">
                <div className="info-item">
                  <i className="fa fa-map-marker"></i>
                  <span>Av. del Bootcamp 1234, Madrid, España</span>
                </div>
                <div className="info-item">
                  <i className="fa fa-phone"></i>
                  <span>+34 912 345 678</span>
                </div>
                <div className="info-item">
                  <i className="fa fa-envelope"></i>
                  <span>info@dronfarm.com</span>
                </div>
              </div>
            </div>
            
            <div className="contact-divider"></div>
            
            <div className="info-bottom-section">
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
          </motion.div>

          {/* FORMULARIO */}
          <motion.div
            className="contacto-form-container contacto-item"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2>Envíanos un mensaje</h2>

            {enviado && <div className="mensaje-exito">¡Gracias por contactarnos!</div>}
            {error && <div className="mensaje-error">{error}</div>}

            <form onSubmit={handleSubmit} className="contacto-form">
              <div className="form-group">
                <label htmlFor="nombre">Nombre completo*</label>
                <input 
                  type="text" 
                  id="nombre" 
                  name="nombre" 
                  value={formData.nombre} 
                  onChange={handleChange} 
                  placeholder="Tu nombre"
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
                  placeholder="ejemplo@correo.com"
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
                  placeholder="912 345 678"
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
                  placeholder="Nombre de tu empresa"
                />
              </div>
              <div className="form-group full-width">
                <label htmlFor="mensaje">Mensaje*</label>
                <textarea 
                  id="mensaje" 
                  name="mensaje" 
                  value={formData.mensaje} 
                  onChange={handleChange} 
                  rows="3" 
                  placeholder="¿Cómo podemos ayudarte?"
                  required
                ></textarea>
              </div>
              <motion.button 
                type="submit" 
                className="submit-button" 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
              >
                Enviar mensaje
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;