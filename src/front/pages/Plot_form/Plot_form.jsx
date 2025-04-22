import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./Plot_form.css";
import {
  showSuccessAlert,
  showErrorAlert,
  showConfirmationAlert
} from "../../components/modal_alerts/modal_alerts";
import { useGlobalReducer } from "../../hooks/useGlobalReducer";
import MapPicker from "../../components/MapPicker/MapPicker";
import debounce from "lodash.debounce";
import Swal from 'sweetalert2';


const CROP_OPTIONS = {
  "Cereales y Cultivos Extensivos": ["Trigo", "Cebada", "Avena", "Maíz", "Arroz", "Girasol", "Algodón"],
  "Frutales de Clima Templado": ["Manzano", "Peral", "Membrillero", "Melocotonero", "Nectarina", "Cerezo", "Ciruelo", "Albaricoquero"],
  "Frutales Subtropicales": ["Aguacate", "Mango", "Chirimoya", "Níspero", "Caqui"],
  "Cítricos": ["Naranjo", "Mandarina", "Limonero", "Pomelo", "Clementina"],
  "Frutos Secos": ["Almendro", "Nogal", "Avellano", "Pistacho"],
  "Viñedo y Olivar": ["Viñedo (Vino)", "Viñedo (Mesa)", "Olivar (Aceite)", "Olivar (Aceituna Mesa)"],
  "Hortalizas": ["Tomate", "Pimiento", "Pepino", "Calabacín", "Berenjena", "Sandía", "Melón", "Fresa", "Frambuesa", "Arándano"],
  "Cultivos Especiales": ["Kiwi (Asturias/Galicia)", "Té (Galicia)", "Aloe Vera (Canarias)", "Platanera (Canarias)", "Papaya (Canarias)"]
};

const PlotForm = () => {
  const { store } = useGlobalReducer();
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(true);
  const location = useLocation();
  const plotToEdit = location?.state?.plotToEdit || null;



  const [plotData, setPlotData] = useState(() => {
    if (plotToEdit) {
      return {
        name: plotToEdit.name || "",
        area: plotToEdit.area || "",
        cropType: plotToEdit.crop || "",
        street: plotToEdit.street || "",
        number: plotToEdit.number || "",
        postalCode: plotToEdit.postal_code || "",
        city: plotToEdit.city || "",
        coordinates: plotToEdit.coordinates || ""
      };
    }

    return {
      name: "",
      area: "",
      cropType: "",
      street: "",
      number: "",
      postalCode: "",
      city: "",
      coordinates: ""
    };
  });


  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlotData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const { street, number, city, postalCode } = plotData;

    if (!street || !number || !city || !postalCode) return;

    const fetchCoordinates = debounce(async () => {
      try {
        const encodedAddress = encodeURIComponent(`${street} ${number}, ${postalCode} ${city}`);
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=pk.eyJ1IjoiZXF1aXBvMiIsImEiOiJjbTk3Z3EyeWgwN2pzMnJzYWh0ejd0bHNuIn0.xV1fX4yZB6W1JhpxlJ0Dsg`
        );
        const data = await res.json();

        if (data.features?.length > 0) {
          const [lon, lat] = data.features[0].center;
          setPlotData(prev => ({ ...prev, coordinates: `${lat.toFixed(6)}, ${lon.toFixed(6)}` }));
        }
      } catch (err) {
        console.error("❌ Error geocodificando dirección:", err);
      }
    }, 1000);

    fetchCoordinates();

    return () => fetchCoordinates.cancel();
  }, [plotData.street, plotData.number, plotData.city, plotData.postalCode]);

  const validateCoordinates = (coords) => {
    if (!coords) return true;
    const regex = /^-?\d{1,3}\.\d+,\s*-?\d{1,3}\.\d+$/;
    return regex.test(coords);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPlotData(prev => ({
            ...prev,
            coordinates: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          }));
          showSuccessAlert("Ubicación obtenida correctamente");
        },
        (error) => {
          showErrorAlert("No se pudo obtener la ubicación: " + error.message);
        }
      );
    } else {
      showErrorAlert("Geolocalización no soportada por tu navegador");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (plotData.coordinates && !validateCoordinates(plotData.coordinates)) {
      showErrorAlert("Formato de coordenadas inválido. Use: latitud,longitud");
      return;
    }

    try {
      const token = store.auth.token;

      const url = plotToEdit
        ? `${import.meta.env.VITE_BACKEND_URL}/fields/fields/${plotToEdit.id}`
        : `${import.meta.env.VITE_BACKEND_URL}/fields/fields`;

      const method = plotToEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: plotData.name,
          area: parseFloat(plotData.area),
          crop: plotData.cropType,
          street: plotData.street,
          number: plotData.number,
          postal_code: plotData.postalCode,
          city: plotData.city,
          coordinates: plotData.coordinates || "",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const successMsg = plotToEdit
          ? "Parcela actualizada correctamente"
          : "Parcela registrada correctamente";

        if (plotToEdit) {
          showSuccessAlert(successMsg, () => navigate("/app/dashboard"));
        } else {
          // Mostrar éxito sin botón
          await Swal.fire({
            title: "¡Éxito!",
            text: successMsg,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            background: "#f8f9fa",
          });

          // Luego preguntar
          Swal.fire({
            title: "¿Desea registrar otra parcela?",
            text: "Puede registrar múltiples parcelas de forma consecutiva.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, registrar otra",
            cancelButtonText: "No, volver al dashboard",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#aaa",
            background: "#f8f9fa",
          }).then((result) => {
            if (result.isConfirmed) {
              setPlotData({
                name: "",
                area: "",
                cropType: "",
                street: "",
                number: "",
                postalCode: "",
                city: "",
                coordinates: "",
              });
              setShowTooltip(true);
            } else {
              navigate("/app/dashboard");
            }
          });
        }
      } else {
        showErrorAlert(data.error || "Error al guardar la parcela");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
      console.error(err);
    }
  };


  const handleAddAnother = async () => {
    setError(null);

    const requiredFields = ["name", "area", "cropType", "street", "number", "postalCode", "city"];
    const isIncomplete = requiredFields.some(field => !plotData[field]?.trim());

    if (isIncomplete) {
      showErrorAlert("Por favor completa todos los campos obligatorios.");
      return;
    }

    if (plotData.coordinates && !validateCoordinates(plotData.coordinates)) {
      showErrorAlert("Formato de coordenadas inválido. Use: latitud,longitud");
      return;
    }

    try {
      const token = store.auth.token;
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/fields/fields`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: plotData.name,
          area: parseFloat(plotData.area),
          crop: plotData.cropType,
          street: plotData.street,
          number: plotData.number,
          postal_code: plotData.postalCode,
          city: plotData.city,
          coordinates: plotData.coordinates || ""
        })
      });

      const data = await response.json();

      if (response.ok) {
        showSuccessAlert("Parcela registrada correctamente");
        setPlotData({
          name: "",
          area: "",
          cropType: "",
          street: "",
          number: "",
          postalCode: "",
          city: "",
          coordinates: ""
        });
      } else {
        showErrorAlert(data.error || "Error al registrar la parcela");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
      console.error(err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="plot-form-container">
      <div className="plot-form-grid">
        {/* Columna Izquierda */}
        <div className="plot-form-left">
          <div className="form-section">
            <h3 className="section-title">Información básica</h3>
            <div className="form-group">
              <label htmlFor="name">Nombre de parcela*</label>
              <input type="text" id="name" name="name" value={plotData.name} onChange={handleChange} required className="form-input" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="area">Nº de hectáreas*</label>
                <input type="number" id="area" name="area" value={plotData.area} onChange={handleChange} step="0.01" min="0.1" required className="form-input" />
              </div>

              <div className="form-group">
                <label htmlFor="cropType">Tipo de Cultivo*</label>
                <select id="cropType" name="cropType" value={plotData.cropType} onChange={handleChange} required className="form-input">
                  <option value="">Seleccione...</option>
                  {Object.entries(CROP_OPTIONS).map(([group, crops]) => (
                    <optgroup label={group} key={group}>
                      {crops.map(crop => (
                        <option value={crop} key={crop}>{crop}</option>
                      ))}
                    </optgroup>
                  ))}
                  <option value="Otro">Otro (Especificar en observaciones)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mapa */}
          <div className="map-section">
            <MapPicker
              initialCoordinates={plotData.coordinates}
              onCoordinatesChange={(coords) =>
                setPlotData((prev) => ({ ...prev, coordinates: coords }))
              }
            />
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="plot-form-right">
          <div className="form-section">
            <h3 className="section-title">Ubicación</h3>

            <div className="form-group">
              <label htmlFor="street">Calle*</label>
              <input type="text" id="street" name="street" value={plotData.street} onChange={handleChange} required className="form-input" />
            </div>

            <div className="form-group">
              <label htmlFor="number">Número*</label>
              <input type="text" id="number" name="number" value={plotData.number} onChange={handleChange} required className="form-input" />
            </div>

            <div className="form-group">
              <label htmlFor="postalCode">Código Postal*</label>
              <input type="text" id="postalCode" name="postalCode" value={plotData.postalCode} onChange={handleChange} required className="form-input" />
            </div>

            <div className="form-group">
              <label htmlFor="city">Ciudad*</label>
              <input type="text" id="city" name="city" value={plotData.city} onChange={handleChange} required className="form-input" />
            </div>

            <div className="form-group">
              <label htmlFor="coordinates">Coordenadas (opcional)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" id="coordinates" name="coordinates" value={plotData.coordinates} onChange={handleChange} placeholder="Ej: 40.4168, -3.7038" className="form-input" style={{ flex: 1 }} />
                <div className="location-button-wrapper">
                  <button type="button" onClick={handleGetLocation} className="location-button">📍</button>
                  <span className="tooltip-initial">Establecer ubicación actual</span>
                </div>
              </div>
              <div className="button-row">
                {plotToEdit ? (
                  <>
                    <button type="submit" className="btn btn-save">Guardar</button>
                    <button type="button" className="btn btn-cancel" onClick={() => navigate("/app/dashboard")}>Cancelar</button>
                  </>
                ) : (
                  <button type="submit" className="btn btn-register">Registrar Parcela</button>
                )}
              </div>
            </div>
          </div>



          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );

};

export default PlotForm;