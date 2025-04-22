import React from "react";
import "./ReportModal.css";

const ReportModal = ({ isOpen, onClose, reports, onDelete }) => {
    if (!isOpen) return null;

    const handleOutsideClick = (e) => {
        if (e.target.classList.contains("modal-overlay")) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOutsideClick}>
            <div className="modal-content report-modal">
                <button className="close-button" onClick={onClose}>✖</button>
                <div className="modal-header">
                    <h2>Mis Informes</h2>
                </div>

                {reports.length === 0 ? (
                    <p className="no-reports">No hay informes disponibles.</p>
                ) : (
                    <ul className="report-modal-list">
                        {reports.map((r, i) => (
                            <li key={i} className="report-card">
                                <div className="report-meta">
                                    <h4 className="report-title">{r.title || 'Sin título'}</h4>
                                    <p className="report-date">{new Date(r.date).toLocaleDateString('es-ES')} - {r.file_name}</p>
                                    {r.description && (
                                        <p className="report-description">{r.description}</p>
                                    )}
                                </div>

                                <div className="report-actions">
                                    <a
                                        href={`${import.meta.env.VITE_BACKEND_URL}${r.url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="download-report-button"
                                    >
                                        Abrir
                                    </a>

                                    <a
                                        href={`${import.meta.env.VITE_BACKEND_URL}/download/${r.file_name}`}
                                        className="download-report-button secondary"
                                    >
                                        Descargar
                                    </a>

                                    <button
                                        onClick={() => onDelete(r.id)}
                                        className="delete-report-button"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ReportModal;
