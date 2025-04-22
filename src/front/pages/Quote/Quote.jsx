import React, { useEffect, useState } from "react";
import LogoDronFarmColor from "../../assets/img/Logo_DronFarm_Iconocolor_sinmarco.png";
import "./Quote.css";
import { showSuccessAlert, showErrorAlert } from "../../components/modal_alerts/modal_alerts";
import { useGlobalReducer } from "../../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

const Quote = () => {
  const [userData, setUserData] = useState(null);
  const [fieldData, setFieldData] = useState(null);
  const [frequency, setFrequency] = useState("Mensual");
  const [services, setServices] = useState(["fotogrametria"]);
  const [pricePerHectare, setPricePerHectare] = useState(30);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [validUntil, setValidUntil] = useState(getDefaultValidDate());
  const [isPdfReady, setIsPdfReady] = useState(false);
  const [additionalEmail, setAdditionalEmail] = useState("");
  const [isSendingToAdditional, setIsSendingToAdditional] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const { store } = useGlobalReducer();
  const navigate = useNavigate();

  const token = store.auth.token;
  const userId = store.auth.userId;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  function getDefaultValidDate() {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  }

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const capitalize = (text) => {
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
  };

  useEffect(() => {
    if (!store.selectedField) {
      const storedField = localStorage.getItem("selectedField");
      if (storedField) {
        const parsedField = JSON.parse(storedField);
        setFieldData(parsedField);
      }
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/user/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUserData(data);
        setUserEmail(data.email || "");
      } catch (err) {
        showErrorAlert("Error al obtener datos del usuario.");
      } finally {
        setIsLoading(false);
        setIsPdfReady(true);
      }
    };

    if (token && userId && store.selectedField) {
      setFieldData(store.selectedField);
      fetchUserData();
    } else if (!store.selectedField) {
      showErrorAlert("No hay ninguna parcela seleccionada.");
      setIsLoading(false);
    }
  }, [token, userId, store.selectedField]);

  const totalPrice = () => {
    if (!fieldData?.area || !frequency) return 0;
    const multiplier = { Mensual: 1, Trimestral: 3, Semestral: 6, Anual: 12 }[frequency] || 1;
    return (fieldData.area * pricePerHectare * multiplier).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user_id: parseInt(userId),
      field_id: fieldData.id,
      hectares: parseFloat(fieldData.area),
      cropType: fieldData.crop,
      services,
      frequency: frequency.toLowerCase(),
    };

    try {
      const res = await fetch(`${BACKEND_URL}/quote/presupuesto`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        showSuccessAlert(
          "Gracias por confiar en DronFarm, en breves contactaremos contigo para gestionar el vuelo.",
          () => navigate("/app/dashboard"),
          true
        );
      } else {
        showErrorAlert(data.error || "Error al enviar presupuesto");
      }
    } catch (err) {
      showErrorAlert("Error al conectar con el servidor");
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/quote/descargar-pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: userData?.name,
          field: fieldData?.name,
          cropType: capitalize(fieldData?.crop),
          hectares: fieldData?.area,
          services: services.join(', '),
          frequency: capitalize(frequency),
          price_per_hectare: pricePerHectare,
          total: totalPrice(),
          valid_until: validUntil,
        }),
      });

      if (!res.ok) throw new Error("Error al generar PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `presupuesto_${userData?.name?.replace(/\s+/g, '_').toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      showErrorAlert("No se pudo generar el PDF.");
    }
  };

  const handleSendToOther = async () => {
    if (!additionalEmail.includes("@")) {
      showErrorAlert("Correo electrónico no válido.");
      return;
    }
    if (!recipientName.trim()) {
      showErrorAlert("Falta el nombre del destinatario.");
      return;
    }

    const htmlBody = `
      <div style="font-family: Arial, sans-serif;">
        <h2 style="color: #198754;">¡Hola ${recipientName.trim()}!</h2>
        <p>${userData?.name} ha compartido este presupuesto de DroneFarm.</p>
        <p><strong>Total estimado:</strong> ${totalPrice()} €</p>
        <p><strong>Válido hasta:</strong> ${formatDate(validUntil)}</p>
        <p>Un saludo,<br/>Equipo DroneFarm 🚀</p>
      </div>
    `;

    const payload = {
      email: additionalEmail,
      quoteDataHtml: htmlBody,
      user: userData?.name,
      field: fieldData?.name,
      cropType: capitalize(fieldData?.crop),
      hectares: fieldData?.area,
      services: services.join(', '),
      frequency: capitalize(frequency),
      pricePerHectare,
      total: totalPrice(),
      validUntil,
    };

    setIsSendingToAdditional(true);
    try {
      const res = await fetch(`${BACKEND_URL}/quote/enviar-presupuesto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showSuccessAlert("Presupuesto enviado correctamente.");
        setAdditionalEmail("");
        setRecipientName("");
      } else {
        const errData = await res.json();
        showErrorAlert("Error al enviar el correo: " + errData.error);
      }
    } catch (err) {
      showErrorAlert("Error al conectar con el servidor.");
    } finally {
      setIsSendingToAdditional(false);
    }
  };

  if (isLoading) return <p className="quote-loading">Cargando datos...</p>;

  return (
    <div className="quote-page-wrapper">
      <div className="quote-background-wrapper">
        <div className="quote-editor-container">
          <h2 className="editor-title">Vista Previa del Presupuesto</h2>
  
          <div className="quote-preview-container">
            <div className="quote-preview">
              <div className="quote-preview-header">
                <div className="logo-container">
                  <img src={LogoDronFarmColor} alt="DronFarm Logo" />
                  <h2>Presupuesto de Servicios Agrícolas</h2>
                </div>
                <div className="quote-preview-date">
                  <p><strong>Fecha:</strong> {new Date().toLocaleDateString('es-ES')}</p>
                  <p><strong>Válido hasta:</strong> {formatDate(validUntil)}</p>
                </div>
              </div>
  
              <div className="quote-preview-section">
                <h3>CLIENTE</h3>
                <table className="quote-preview-table">
                  <tbody>
                    <tr><td>Cliente:</td><td>{userData?.name}</td></tr>
                    <tr><td>Parcela:</td><td>{fieldData?.name}</td></tr>
                    <tr><td>Cultivo:</td><td>{capitalize(fieldData?.crop)}</td></tr>
                    <tr><td>Hectáreas:</td><td>{fieldData?.area} ha</td></tr>
                  </tbody>
                </table>
              </div>
  
              <div className="quote-preview-section">
                <h3>SERVICIOS</h3>
                <table className="quote-preview-table">
                  <tbody>
                    <tr><td>Servicios incluidos:</td><td>{services.join(', ')}</td></tr>
                    <tr><td>Periodicidad:</td><td>{capitalize(frequency)}</td></tr>
                  </tbody>
                </table>
              </div>
  
              <div className="quote-preview-section">
                <h3>DETALLES ECONÓMICOS</h3>
                <table className="quote-preview-table">
                  <tbody>
                    <tr><td>Precio por hectárea:</td><td>{pricePerHectare} €</td></tr>
                    <tr><td>Hectáreas:</td><td>{fieldData?.area}</td></tr>
                    <tr className="quote-preview-total"><td><strong>TOTAL:</strong></td><td><strong>{totalPrice()} €</strong></td></tr>
                  </tbody>
                </table>
              </div>
  
              <div className="quote-preview-footer">
                <p>* Este presupuesto no incluye IVA</p>
                <p>* Los servicios se realizarán según las condiciones meteorológicas</p>
                <p>* DronFarm se reserva el derecho a modificar el servicio en caso de condiciones adversas</p>
              </div>
            </div>
          </div>
  
          <div className="quote-email-forward">
            <div className="quote-email-forward-header">
              <i className="fas fa-paper-plane forward-icon"></i>
              <h3>Enviar a otra persona</h3>
            </div>
            <p className="quote-email-forward-text">¿Quieres compartir este presupuesto?</p>
  
            <form className="forward-form" onSubmit={(e) => { e.preventDefault(); handleSendToOther(); }}>
              <input
                type="text"
                placeholder="Nombre del destinatario"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Correo del destinatario"
                value={additionalEmail}
                onChange={(e) => setAdditionalEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={isSendingToAdditional}>
                {isSendingToAdditional ? "Enviando..." : "Enviar presupuesto"}
              </button>
            </form>
          </div>
  
          <div className="footer-actions">
            {isPdfReady && (
              <button onClick={handleDownloadPDF} className="action-button orange-button">
                Descargar PDF
              </button>
            )}
            <button onClick={handleSubmit} className="action-button green-button">
              Aceptar Presupuesto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default Quote;
