import React from "react";
import "./FieldSelectorModal.css";

const FieldSelectorModal = ({ fields, setSelected, onClose, selected }) => {
    const handleOutsideClick = (e) => {
        if (e.target.classList.contains("modal-overlay")) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOutsideClick}>
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>✖</button>
                <h2>Selecciona la parcela</h2>

                <div className="field-button-grid">
                    {fields.map((field) => (
                        <button
                            key={field.id}
                            className={`field-button ${selected?.id === field.id ? "selected" : ""}`}
                            onClick={() => {
                                setSelected(field);
                                localStorage.setItem("selectedField", JSON.stringify(field));
                                onClose();
                            }}
                        >
                            <span className="field-name">{field.name}</span>
                            <span className="field-location">{field.city}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FieldSelectorModal;
