import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // necesario para hacer la petición
import "./FieldManagerModal.css";
import { useGlobalReducer } from "../../hooks/useGlobalReducer"; // para obtener el token

const FieldManagerModal = ({ fields, onClose, isDarkMode, onFieldDeleted }) => {
    const navigate = useNavigate();
    const { store } = useGlobalReducer();

    const handleEdit = (field) => {
        navigate("/app/plot_form", { state: { plotToEdit: field } });
    };

    const handleDelete = async (fieldId) => {
        const confirm = window.confirm("¿Estás seguro de que quieres eliminar esta tierra?");
        if (!confirm) return;

        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/fields/fields/${fieldId}`, {
                headers: {
                    Authorization: `Bearer ${store.auth.token}`,
                },
            });

            if (onFieldDeleted) {
                onFieldDeleted(fieldId); // Notifica al padre para que actualice su lista
            }
        } catch (err) {
            console.error("Error al eliminar la tierra:", err);
            alert("No se pudo eliminar la tierra.");
        }
    };

    if (!fields) return null;

    return (
        <div className="modal-overlay">
            <div className={`modal-content field-manager-modal ${isDarkMode ? "dark-mode" : ""}`}>
                <div className="modal-header">
                    <h2>🌾 Gestión de Tierras</h2>
                    <button className="close-button" onClick={onClose}>✖</button>
                </div>

                <div className="fields-list">
                    {fields.map((field) => (
                        <div key={field.id} className="field-card">
                            <p><strong>{field.name}</strong> – {field.area} Ha</p>
                            <p>{field.crop} | {field.street} {field.number}, {field.city}</p>

                            <div className="field-actions">
                                <button onClick={() => handleEdit(field)} className="edit-btn">✏️ Editar</button>
                                <button onClick={() => handleDelete(field.id)} className="delete-btn">🗑️ Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FieldManagerModal;
