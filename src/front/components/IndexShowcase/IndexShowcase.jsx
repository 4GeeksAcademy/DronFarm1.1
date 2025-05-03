import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './IndexShowcase.css';

// Importar las imágenes
import ndviImage from '../../assets/img/index-examples/NDVI2.png';
import ndreImage from '../../assets/img/index-examples/NVRE1.png';
import gndviImage from '../../assets/img/index-examples/GNDVI1.jpg';
import ndmiImage from '../../assets/img/index-examples/NDMI1.jpg';
import ndwiImage from '../../assets/img/index-examples/NDWI1.jpg';
import thermalImage from '../../assets/img/index-examples/THERMAL1.jpg';

// Datos de los índices agrícolas
const indexData = [
  {
    id: 'ndvi',
    name: 'NDVI',
    fullName: 'Índice de Vegetación de Diferencia Normalizada',
    description: 'Mide el vigor y la densidad de la vegetación. Las plantas saludables reflejan más luz infrarroja y absorben más luz roja.',
    imagePlaceholder: ndviImage,
    colorScale: [
      { color: '#E5625E', label: '0.0-0.2', description: 'Suelo desnudo o vegetación muy estresada' },
      { color: '#F29B3F', label: '0.2-0.4', description: 'Vegetación con estrés severo' },
      { color: '#F1C40F', label: '0.4-0.6', description: 'Vegetación con estrés moderado' },
      { color: '#7EBB49', label: '0.6-0.7', description: 'Vegetación saludable' },
      { color: '#438559', label: '0.7-0.9', description: 'Vegetación muy vigorosa' },
    ],
    applications: [
      'Detección temprana de problemas de salud en cultivos',
      'Identificación de áreas de bajo rendimiento',
      'Evaluación de la efectividad de irrigación y fertilización',
      'Monitoreo del desarrollo del cultivo a lo largo del tiempo'
    ],
    cultivo: 'Maíz',
    icono: '🌽'
  },
  {
    id: 'ndre',
    name: 'NDRE',
    fullName: 'Índice de Borde Rojo de Diferencia Normalizada',
    description: 'Particularmente sensible al contenido de clorofila y nitrógeno. Más eficaz que NDVI para cultivos densos y evaluación nutricional.',
    imagePlaceholder: ndreImage,
    colorScale: [
      { color: '#E5625E', label: '0.0-0.1', description: 'Deficiencia severa de nitrógeno' },
      { color: '#F29B3F', label: '0.1-0.2', description: 'Deficiencia moderada de nitrógeno' },
      { color: '#F1C40F', label: '0.2-0.3', description: 'Contenido de nitrógeno sub-óptimo' },
      { color: '#7EBB49', label: '0.3-0.4', description: 'Contenido de nitrógeno adecuado' },
      { color: '#438559', label: '0.4-0.5+', description: 'Óptimo contenido de nitrógeno' },
    ],
    applications: [
      'Optimización de aplicaciones de nitrógeno',
      'Detección temprana de deficiencias nutricionales',
      'Creación de mapas de aplicación variable de fertilizantes',
      'Evaluación de potencial de proteína en grano (cereales)'
    ],
    cultivo: 'Trigo',
    icono: '🌾'
  },
  {
    id: 'gndvi',
    name: 'GNDVI',
    fullName: 'Índice de Vegetación de Diferencia Normalizada Verde',
    description: 'Variación del NDVI que utiliza la banda verde. Más sensible a la concentración de clorofila, ideal para variaciones sutiles.',
    imagePlaceholder: gndviImage,
    colorScale: [
      { color: '#0E4C6B', label: '0.0-0.2', description: 'Suelo desnudo o estrés extremo' },
      { color: '#BED3DF', label: '0.2-0.4', description: 'Estrés severo, posible deficiencia múltiple' },
      { color: '#F1C40F', label: '0.4-0.6', description: 'Desarrollo sub-óptimo, estrés moderado' },
      { color: '#7EBB49', label: '0.6-0.7', description: 'Buen desarrollo, ligero estrés' },
      { color: '#438559', label: '0.7-0.9', description: 'Óptimo desarrollo y clorofila' },
    ],
    applications: [
      'Identificación de zonas de manejo diferenciado',
      'Detección de carencias de micronutrientes',
      'Zonificación para manejo de dosel',
      'Identificación de zonas para vendimia selectiva'
    ],
    cultivo: 'Viñedo',
    icono: '🍇'
  },
  {
    id: 'ndmi',
    name: 'NDMI',
    fullName: 'Índice de Humedad por Diferencia Normalizada',
    description: 'Mide específicamente el contenido de humedad en la vegetación. Ideal para detectar estrés hídrico en cultivos.',
    imagePlaceholder: ndmiImage,
    colorScale: [
      { color: '#E5625E', label: '-0.2-0.1', description: 'Estrés hídrico severo' },
      { color: '#F29B3F', label: '0.1-0.2', description: 'Estrés hídrico moderado' },
      { color: '#F1C40F', label: '0.2-0.3', description: 'Contenido hídrico sub-óptimo' },
      { color: '#7EBB49', label: '0.3-0.4', description: 'Contenido hídrico adecuado' },
      { color: '#438559', label: '0.4-0.6', description: 'Contenido hídrico óptimo' },
    ],
    applications: [
      'Programación precisa de riegos',
      'Detección de fallos en sistemas de riego',
      'Zonificación por necesidades hídricas',
      'Evaluación de estrategias de riego deficitario'
    ],
    cultivo: 'Almendros',
    icono: '🌰'
  },
  {
    id: 'ndwi',
    name: 'NDWI',
    fullName: 'Índice de Agua por Diferencia Normalizada',
    description: 'Diseñado para detectar agua líquida en cultivos y suelos. Ideal para cultivos de regadío y detección de encharcamientos.',
    imagePlaceholder: ndwiImage,
    colorScale: [
      { color: '#E5625E', label: '-0.5 a -0.3', description: 'Suelo seco, sin agua superficial' },
      { color: '#F29B3F', label: '-0.3 a -0.1', description: 'Humedad superficial baja' },
      { color: '#F1C40F', label: '-0.1 a 0.1', description: 'Humedad superficial moderada' },
      { color: '#7EBB49', label: '0.1 a 0.3', description: 'Alta humedad superficial' },
      { color: '#AAEEDD', label: '0.3 a 0.6', description: 'Agua libre en superficie' },
    ],
    applications: [
      'Monitoreo de inundación en cultivos como arroz',
      'Detección de áreas con problemas de nivelación',
      'Control de drenaje para cosecha',
      'Identificación de fugas en sistemas de riego'
    ],
    cultivo: 'Arroz',
    icono: '🍚'
  },
  {
    id: 'thermal',
    name: 'Térmico',
    fullName: 'Análisis Térmico',
    description: 'Captura la radiación infrarroja emitida por plantas y suelo. Crítico para detectar estrés hídrico temprano antes de síntomas visibles.',
    imagePlaceholder: thermalImage,
    colorScale: [
      { color: '#0E4C6B', label: '< 24°C', description: 'Transpiración óptima, suelo húmedo' },
      { color: '#BED3DF', label: '24-26°C', description: 'Buena transpiración, adecuado estado hídrico' },
      { color: '#7EBB49', label: '26-28°C', description: 'Transpiración moderada, inicio de estrés leve' },
      { color: '#F1C40F', label: '28-30°C', description: 'Reducción de transpiración, estrés moderado' },
      { color: '#F29B3F', label: '30-32°C', description: 'Estrés hídrico significativo' },
      { color: '#E5625E', label: '> 32°C', description: 'Estrés hídrico severo o suelo descubierto' }
    ],
    applications: [
      'Detección precoz de estrés hídrico',
      'Identificación de variabilidad en necesidades hídricas',
      'Diagnóstico de sistemas de riego',
      'Detección temprana de enfermedades vasculares'
    ],
    cultivo: 'Olivos',
    icono: '🫒'
  }
];

// Zonas de ejemplo para mostrar en la imagen
const sampleZones = [
  { id: 'A', x: 25, y: 25, description: 'Zona con vegetación óptima (NDVI: 0.85)' },
  { id: 'B', x: 50, y: 50, description: 'Zona con estrés moderado (NDVI: 0.55)' },
  { id: 'C', x: 75, y: 75, description: 'Zona con estrés severo (NDVI: 0.25)' },
];

const IndexShowcase = ({ onClose }) => {
  // Intentar usar el hook de navegación solo si está disponible
  let navigate;
  try {
    navigate = useNavigate();
  } catch (error) {
    console.warn("useNavigate no está disponible");
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showOverlay, setShowOverlay] = useState(false);
  const [activeZone, setActiveZone] = useState(null);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(true);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  // Asegurarse de que currentData nunca sea undefined
  const currentData = indexData[currentIndex] || indexData[0];

  // Deshabilitamos el auto-inicio del tour y del diálogo
  // Se mostrará solo la primera vez que se abre el componente
  useEffect(() => {
    if (!hasShownWelcome) {
      // Solo mostramos el diálogo la primera vez
      const timer = setTimeout(() => {
        setShowWelcomeDialog(true);
        setHasShownWelcome(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [hasShownWelcome]);

  const handleNextIndex = () => {
    setCurrentIndex((prev) => (prev + 1) % indexData.length);
  };

  const handlePrevIndex = () => {
    setCurrentIndex((prev) => (prev - 1 + indexData.length) % indexData.length);
  };

  const handleColorBlockHover = (description, event) => {
    const rect = event.target.getBoundingClientRect();
    setTooltipContent(description);
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleZoneClick = (zone) => {
    setActiveZone(zone);
    setShowOverlay(true);
  };

  const closeOverlay = () => {
    setShowOverlay(false);
    setActiveZone(null);
  };

  const startTour = () => {
    setShowTour(true);
    setShowWelcomeDialog(false);
    setTourStep(0);
  };

  const closeTour = () => {
    setShowTour(false);
    setTourStep(0);
  };

  const nextTourStep = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      closeTour();
    }
  };

  const prevTourStep = () => {
    if (tourStep > 0) {
      setTourStep(tourStep - 1);
    }
  };

  // Función para cerrar el diálogo de bienvenida y el modal completo
  const closeWelcomeAndModal = () => {
    setShowWelcomeDialog(false);
    if (onClose && typeof onClose === 'function') {
      onClose(); // Llamamos a la función onClose que recibimos como prop
    }
  };

  // Función para manejar la solicitud de presupuesto
  const handleRequestQuote = () => {
    if (onClose && typeof onClose === 'function') {
      onClose(); // Primero cerramos el modal
    }

    // Navegar solo si el hook está disponible
    if (navigate) {
      navigate('/app/quote'); // Luego navegamos a la página de presupuesto
    } else {
      console.warn("No se puede navegar: useNavigate no está disponible");
      window.location.href = '/app/quote'; // Alternativa si no funciona el hook
    }
  };

  // Pasos del tour
  const tourSteps = [
    {
      element: '.index-selector',
      content: 'Elige entre diferentes índices para ver cómo analizamos tu cultivo con DronFarm 🛰️',
    },
    {
      element: '.index-image-container',
      content: 'Cada imagen muestra diferentes aspectos de la salud de tu cultivo. Haz clic en las zonas marcadas para más detalles 🔍',
    },
    {
      element: '.color-scale-container',
      content: 'Los colores representan diferentes valores del índice. Pasa el cursor sobre cada color para ver su significado',
    },
    {
      element: '.applications-container',
      content: 'Descubre cómo puedes utilizar cada índice para mejorar la gestión de tus cultivos 📈',
    },
    {
      element: '.request-button',
      content: '¡Solicita un presupuesto para obtener estos análisis en tus propios cultivos! 📝',
    }
  ];

  // Obtener el elemento actual del tour
  const currentTourStep = tourSteps[tourStep];

  return (
    <div className="index-showcase-container">
      {/* Tour overlay */}
      {showTour && currentTourStep && (
        <div className="tour-overlay">
          <div className="tour-spotlight" style={{
            top: document.querySelector(currentTourStep.element)?.getBoundingClientRect().top - 10 || 0,
            left: document.querySelector(currentTourStep.element)?.getBoundingClientRect().left - 10 || 0,
            width: (document.querySelector(currentTourStep.element)?.getBoundingClientRect().width || 0) + 20,
            height: (document.querySelector(currentTourStep.element)?.getBoundingClientRect().height || 0) + 20
          }}></div>
          
          <div className="tour-tooltip-container" style={{
            top: (document.querySelector(currentTourStep.element)?.getBoundingClientRect().bottom || 0) + 20,
            left: document.querySelector(currentTourStep.element)?.getBoundingClientRect().left || 0,
          }}>
            <div className="tour-tooltip">
              {currentTourStep.content}
            </div>
            <div className="tour-button-group">
              <button onClick={closeTour} className="tour-btn tour-btn-secondary">Saltar</button>
              {tourStep > 0 && (
                <button onClick={prevTourStep} className="tour-btn tour-btn-secondary">Anterior</button>
              )}
              <button onClick={nextTourStep} className="tour-btn tour-btn-primary">
                {tourStep === tourSteps.length - 1 ? 'Finalizar' : `Siguiente (${tourStep + 1}/${tourSteps.length})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selector de índices */}
      <div className="index-selector">
        <button className="nav-button" onClick={handlePrevIndex}>&lt;</button>
        <div className="current-index">
          <h2>{currentData?.name || 'Índice'} {currentData?.icono || ''}</h2>
          <p>{currentData?.fullName || ''}</p>
          <span className="cultivo-tag">Ejemplo en: {currentData?.cultivo || 'Cultivo'}</span>
        </div>
        <button className="nav-button" onClick={handleNextIndex}>&gt;</button>
      </div>

      {/* Contenido principal */}
      <div className="index-content">
        {/* Imagen y explicación */}
        <div className="index-image-container">
          <div className="image-placeholder">
            {currentData?.imagePlaceholder ? (
              <img
                src={currentData.imagePlaceholder}
                alt={`Ejemplo de ${currentData.name || 'índice'} en cultivo de ${currentData.cultivo || 'ejemplo'}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Imagen no disponible
              </div>
            )}
            
            {/* Zonas de ejemplo */}
            {sampleZones.map((zone) => (
              <div
                key={zone.id}
                className="sample-zone"
                style={{
                  left: `${zone.x}%`,
                  top: `${zone.y}%`
                }}
                onClick={() => handleZoneClick(zone)}
              >
                {zone.id}
              </div>
            ))}
          </div>
          <div className="index-description">
            <p>{currentData?.description || 'Descripción no disponible'}</p>
          </div>
        </div>

        {/* Panel derecho */}
        <div className="right-panel">
          <div className="color-scale-container">
            <h3>Interpretación de Colores</h3>
            <div className="color-scale">
              {currentData?.colorScale?.map((item, idx) => (
                <div
                  key={idx}
                  className="color-block-container"
                  onMouseEnter={(e) => handleColorBlockHover(item.description, e)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div
                    className="color-block"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="color-label">{item.label}</span>
                </div>
              )) || <p>Escala de colores no disponible</p>}
            </div>
          </div>

          {/* Aplicaciones */}
          <div className="applications-container">
            <h3>Aplicaciones para {currentData?.cultivo || 'el cultivo'}</h3>
            <ul className="applications-list">
              {currentData?.applications?.map((app, idx) => (
                <li key={idx}>{app}</li>
              )) || <li>Aplicaciones no disponibles</li>}
            </ul>
          </div>

          {/* Botón de solicitud */}
          <div className="action-container">
            <button 
              className="request-button"
              onClick={handleRequestQuote} 
            >
              Solicitar análisis de {currentData?.name || 'índice'} para mis cultivos
            </button>
          </div>
        </div>
      </div>

      {/* Tooltip para descripción de colores */}
      {showTooltip && (
        <div
          className="color-tooltip"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          {tooltipContent}
          <div className="tooltip-arrow"></div>
        </div>
      )}

      {/* Overlay para detalles de zona */}
      {showOverlay && activeZone && (
        <div className="zone-overlay" onClick={closeOverlay}>
          <div className="zone-detail-card" onClick={(e) => e.stopPropagation()}>
            <h3>Zona {activeZone.id}</h3>
            <p>{activeZone.description}</p>
            <div className="zone-recommendations">
              <h4>Recomendaciones:</h4>
              <ul>
                {activeZone.id === 'A' && (
                  <>
                    <li>Mantener el régimen actual de manejo</li>
                    <li>Utilizar como referencia para las otras zonas</li>
                  </>
                )}
                {activeZone.id === 'B' && (
                  <>
                    <li>Considerar aplicación dirigida de fertilizantes</li>
                    <li>Ajustar programa de riego para esta zona</li>
                  </>
                )}
                {activeZone.id === 'C' && (
                  <>
                    <li>Inspección inmediata para identificar la causa</li>
                    <li>Posible necesidad de muestreo de suelo</li>
                    <li>Revisar sistema de riego en esta sección</li>
                  </>
                )}
              </ul>
            </div>
            <button className="close-overlay-button" onClick={closeOverlay}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Diálogo inicial - solo se muestra si showWelcomeDialog es true y no estamos en el tour */}
      {showWelcomeDialog && !showTour && (
        <div className="tour-toast">
          <p>¡Bienvenido a los informes de DronFarm! 🚜 🌱</p>
          <p>¿Quieres ver un recorrido sobre los distintos tipos de análisis que ofrecemos?</p>
          <div className="tour-toast-buttons">
            <button 
              onClick={closeWelcomeAndModal}
              className="tour-btn tour-btn-secondary"
            >
              No, gracias
            </button>
            <button onClick={startTour} className="tour-btn tour-btn-primary">¡Sí, muéstrame!</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndexShowcase;