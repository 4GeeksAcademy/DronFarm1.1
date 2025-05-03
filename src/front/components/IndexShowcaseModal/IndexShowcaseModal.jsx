import React, { useEffect } from 'react';
import IndexShowcase from '../IndexShowcase/IndexShowcase';
import './IndexShowcaseModal.css';

const IndexShowcaseModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    // Prevenir scroll del body cuando el modal está abierto
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="index-showcase-modal-overlay" onClick={onClose}>
      <div className="index-showcase-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="index-showcase-modal-close" onClick={onClose}>&times;</button>
        <IndexShowcase onClose={onClose} /> {/* Pasamos la función onClose como prop */}
      </div>
    </div>
  );
};

export default IndexShowcaseModal;