import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Dash_user.css';
import MapboxParcel from '../../components/MapboxParcel/MapboxParcel';
import WeatherForecast from '../../components/WeatherForecast/WeatherForecast';
import ReportModal from "../../components/ReportModal/ReportModal";
import FieldManagerModal from "../../components/FieldManagerModal/FieldManagerModal";
import FieldSelectorModal from "../../components/FieldSelectorModal/FieldSelectorModal";
import { useGlobalReducer } from "../../hooks/useGlobalReducer";
import { showSuccessAlert, showErrorAlert } from "../../components/modal_alerts/modal_alerts";


const Dash_user = () => {
    const { store, dispatch } = useGlobalReducer();
    const [userData, setUserData] = useState(null);
    const [fieldsList, setFieldsList] = useState([]);
    const [selectedField, setSelectedField] = useState(null);
    const navigate = useNavigate();
    const [forecast, setForecast] = useState([]);
    const [reports, setReports] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState({
        user: true,
        weather: true,
        reports: true
    });
    const [initialSelectionDone, setInitialSelectionDone] = useState(false);
    const [drawInfo, setDrawInfo] = useState(null);
    const [isReportModalOpen, setReportModalOpen] = useState(false);
    const [isFieldModalOpen, setFieldModalOpen] = useState(false);
    const isDarkMode = localStorage.getItem("darkMode") === "true";


    useEffect(() => {
        const fetchData = async () => {
            const token = store.auth.token;
            const userId = store.auth.userId;

            if (!token || !userId) {
                setError("Usuario no autenticado");
                setLoading({ user: false, weather: false, reports: false });
                return;
            }

            try {
                const userRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserData(userRes.data);
                setLoading(prev => ({ ...prev, user: false }));

                const fieldRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/fields/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const userFields = Array.isArray(fieldRes.data) ? fieldRes.data : [];
                setFieldsList(userFields);

                const lastSelectedId = localStorage.getItem("selectedFieldId");
                const matchingField = userFields.find(f => f.id.toString() === lastSelectedId);

                if (matchingField) {
                    setSelectedField(matchingField);
                    dispatch({ type: "SET_SELECTED_FIELD", payload: matchingField });
                    setInitialSelectionDone(true);
                } else {
                    setSelectedField(userFields[0]);
                }
            } catch (err) {
                console.error("Error al cargar datos:", err);
                setError("Error al cargar datos del usuario o la tierra");
            } finally {
                setLoading(prev => ({ ...prev, weather: false }));
            }

            try {
                const reportsRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/report_routes/user_reports/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setReports(Array.isArray(reportsRes.data) ? reportsRes.data : []);
            } catch (err) {
                console.error('Error al cargar informes:', err);
                setReports([]);
            } finally {
                setLoading(prev => ({ ...prev, reports: false }));
            }
        };

        fetchData();
    }, [dispatch, store.auth.token, store.auth.userId]);

    useEffect(() => {
        const fetchWeatherForField = async () => {
            if (!selectedField) return;

            const [lat, lon] = selectedField.coordinates
                .split(',')
                .map(coord => parseFloat(coord.trim()));

            try {
                const forecastRes = await axios.get(
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=e3007f5e69ba980e3897f92c2c2d4750&units=metric&lang=es`
                );

                const groupedDays = forecastRes.data.list.reduce((acc, item) => {
                    const date = item.dt_txt.split(' ')[0];
                    if (!acc[date]) acc[date] = [];
                    acc[date].push(item);
                    return acc;
                }, {});

                const daily = Object.values(groupedDays).slice(0, 10).map(group => {
                    const temps = group.map(i => i.main.temp);
                    return {
                        dt: group[0].dt,
                        temp: {
                            max: Math.max(...temps),
                            min: Math.min(...temps)
                        },
                        weather: group[0].weather
                    };
                });

                setForecast(daily);
            } catch (err) {
                console.error("Error al cargar el clima:", err);
            }
        };

        fetchWeatherForField();
    }, [selectedField]);

    const handleDeleteReport = async (reportId) => {
        const confirm = window.confirm("¿Estás seguro de que quieres eliminar este informe?");
        if (!confirm) return;

        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/report_routes/delete/${reportId}`, {
                headers: {
                    Authorization: `Bearer ${store.auth.token}`
                }
            });
            setReports(prev => prev.filter(r => r.id !== reportId));
        } catch (err) {
            console.error("Error al eliminar informe:", err);
            alert("No se pudo eliminar el informe.");
        }
    };

    const filteredReports = reports.filter(
        (report) => report.field_id === selectedField?.id
    );

    const handleRequestQuote = async () => {
        try {
            const token = store.auth.token;
            const userId = store.auth.userId;
            const fieldId = selectedField?.id;

            if (!token || !userId || !fieldId) {
                showErrorAlert("Faltan datos del usuario o del cultivo.");
                return;
            }

            // Lógica para enviar email de presupuesto (como en Quote.jsx)
            const userRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const userData = userRes.data;

            const htmlBody = `
            <div style="font-family: Arial, sans-serif; color: #333; font-size: 14px;">
              <h2 style="color: #198754;">¡Hola ${userData.name}!</h2>
              <p>Gracias por confiar en <strong>DroneFarm</strong>.</p>
              <p>Adjunto encontrarás el presupuesto generado para tu parcela <strong>${selectedField.name}</strong>.</p>
              <p><strong>Total estimado:</strong> ${selectedField.area * 30} €</p>
              <p>Quedamos atentos para cualquier duda o ajuste.</p>
              <p>Un saludo,<br/>Equipo DroneFarm 🚀</p>
            </div>
          `;

            const payload = {
                email: userData.email,
                quoteDataHtml: htmlBody,
                user: userData.name,
                field: selectedField.name,
                cropType: selectedField.crop,
                hectares: selectedField.area,
                services: "fotogrametría",
                frequency: "mensual",
                pricePerHectare: 30,
                total: selectedField.area * 30,
                validUntil: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]
            };

            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/quote/enviar-presupuesto`, payload);

            showSuccessAlert("Presupuesto enviado por correo electrónico ✅", () => {
                navigate("/app/quote");
            });

        } catch (err) {
            console.error("Error al enviar el presupuesto:", err);
            showErrorAlert("No se pudo enviar el presupuesto por email.");
        }
    };


    if (error) return <div className="error-message">{error}</div>;

    return (
        <>

            {!initialSelectionDone && fieldsList.length > 1 && (
                <FieldSelectorModal
                    fields={fieldsList}
                    setSelected={(field) => {
                        setSelectedField(field);
                        dispatch({ type: "SET_SELECTED_FIELD", payload: field });
                        localStorage.setItem("selectedFieldId", field.id);
                        setInitialSelectionDone(true);
                    }}
                    onClose={() => setInitialSelectionDone(true)}
                    selected={selectedField}
                />
            )}

            <div className="dashboard-container">
                <div className="dashboard-content">
                    <div className="left-panel">
                        <div className="card card-main map-container-wrapper">
                            <div className="map-container">
                                {selectedField && selectedField.coordinates ? (() => {
                                    const coords = selectedField.coordinates.split(',');
                                    const lat = parseFloat(coords[0]?.trim());
                                    const lon = parseFloat(coords[1]?.trim());

                                    if (isNaN(lat) || isNaN(lon)) {
                                        return <div className="map-placeholder">📍 Coordenadas inválidas</div>;
                                    }

                                    return (
                                        <MapboxParcel
                                            latitude={drawInfo?.latitude || lat}
                                            longitude={drawInfo?.longitude || lon}
                                            fields={fieldsList}
                                            onFieldClick={(field) => {
                                                setSelectedField(field);
                                                localStorage.setItem("selectedFieldId", field.id);
                                            }}
                                            onDraw={(info) => {
                                                const truncate = (num, decimals = 2) => Math.floor(num * 10 ** decimals) / 10 ** decimals;
                                                setDrawInfo({ ...info, area: truncate(info.area) });
                                            }}
                                        />
                                    );
                                })() : (
                                    <div className="map-placeholder">Cargando mapa...</div>
                                )}
                            </div>
                        </div>

                        <div className="card card-main weather-container-wrapper">
                            <WeatherForecast daily={forecast} loading={loading.weather} />
                        </div>
                    </div>

                    <div className="info-panel card card-support">
                        {userData && selectedField && (
                            <>
                                <div className="user-info">
                                    <h2>{userData.name?.toUpperCase()}</h2>
                                    <button
                                        className="change-field-button"
                                        onClick={() => setInitialSelectionDone(false)}
                                    >
                                        Cambiar parcela
                                    </button>

                                    <p>{selectedField.street}, {selectedField.number}</p>
                                    <p>{selectedField.city}</p>
                                    <p><strong>{selectedField.area} Ha</strong></p>
                                    {drawInfo && (
                                        <div className="area-box">
                                            Área del polígono: {drawInfo.area} ha
                                        </div>
                                    )}
                                    <p>{selectedField.crop.toUpperCase()}</p>
                                </div>

                                <div className="reports-section">
                                    <h4>Mis Informes</h4>
                                    {loading.reports ? (
                                        <p className="loading-msg">🔄 Actualizando informes...</p>
                                    ) : (
                                        <p>{filteredReports.length} informes disponibles</p>
                                    )}
                                    <button
                                        className="request-report-button"
                                        onClick={() => setReportModalOpen(true)}
                                    >
                                        VER TODOS LOS INFORMES
                                    </button>
                                </div>

                                <button
                                    className="request-report-button"
                                    onClick={handleRequestQuote}
                                >
                                    SOLICITAR PRESUPUESTO
                                </button>


                                <button
                                    className="add-field-button"
                                    onClick={() => navigate("/app/plot_form")}
                                >
                                    AÑADIR NUEVO CULTIVO
                                </button>
                                <button
                                    onClick={() => setFieldModalOpen(true)}
                                    className="request-report-button"
                                >
                                    GESTIONAR TIERRAS
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setReportModalOpen(false)}
                reports={filteredReports}
                onDelete={handleDeleteReport}
            />

            {isFieldModalOpen && (
                <FieldManagerModal
                    fields={fieldsList}
                    onClose={() => setFieldModalOpen(false)}
                    isDarkMode={isDarkMode}
                    onFieldDeleted={(deletedId) => {
                        setFieldsList((prev) => prev.filter((f) => f.id !== deletedId));
                        if (selectedField?.id === deletedId) {
                            setSelectedField(null);
                            localStorage.removeItem("selectedFieldId");
                        }
                    }}
                />

            )}

        </>
    );
};

export default Dash_user;
