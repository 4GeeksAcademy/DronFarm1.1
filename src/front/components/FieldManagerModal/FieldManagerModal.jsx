import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./FieldManagerModal.css";
import { useGlobalReducer } from "../../hooks/useGlobalReducer";
import { showErrorAlert, showConfirmationAlert } from "../modal_alerts/modal_alerts"; // Asegúrate de que la ruta esté bien

const FieldManagerModal = ({ fields, onClose, isDarkMode, onFieldDeleted }) => {
    const navigate = useNavigate();
    const { store } = useGlobalReducer();

    const handleOutsideClick = (e) => {
        if (e.target.classList.contains("modal-overlay")) {
            onClose();
        }
    };

    const handleEdit = (field) => {
        navigate("/app/plot_form", { state: { plotToEdit: field } });
    };

    const handleDelete = (fieldId) => {
        showConfirmationAlert(
            "¿Eliminar tierra?",
            "¿Estás seguro de que quieres eliminar esta tierra?",
            async () => {
                try {
                    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/fields/fields/${fieldId}`, {
                        headers: {
                            Authorization: `Bearer ${store.auth.token}`,
                        },
                    });

                    if (onFieldDeleted) {
                        onFieldDeleted(fieldId);
                    }
                } catch (err) {
                    console.error("Error al eliminar la tierra:", err);
                    showErrorAlert("No se pudo eliminar la tierra.");
                }
            }
        );
    };

    if (!fields) return null;

    return (
        <div className="modal-overlay" onClick={handleOutsideClick}>
            <div className={`modal-content ${isDarkMode ? "dark-mode" : ""}`}>
                <button className="close-button" onClick={onClose}>✖</button>
                <div className="modal-header">
                    <h2>Gestión de Tierras</h2>
                </div>

                <div className="fields-list">
                    {fields.map((field) => (
                        <div key={field.id} className="field-card">
                            <p><strong>{field.name}</strong> – {field.area} Ha</p>
                            <p>{field.crop} | {field.street} {field.number}, {field.city}</p>

                            <div className="field-actions">
                                <button onClick={() => handleEdit(field)} className="edit-btn">Editar</button>
                                <button onClick={() => handleDelete(field.id)} className="delete-btn">Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FieldManagerModal;
