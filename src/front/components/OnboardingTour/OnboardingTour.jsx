import React, { useEffect, useState } from 'react';
import Joyride, { EVENTS, STATUS } from 'react-joyride';
import './OnboardingTour.css';

const OnboardingTour = () => {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [showToast, setShowToast] = useState(false);

  const steps = [
    { target: '.map-container', content: 'Aquí puedes ver tu parcela en el mapa 📍', disableBeacon: true },
    { target: '.weather-container-wrapper', content: 'Este bloque te muestra el pronóstico del clima ☀️🌧️', disableBeacon: true },
    { target: '.info-panel', content: 'Este panel te muestra información detallada de tu parcela seleccionada 🌾', disableBeacon: true },
    { target: '#btn-cambiar-parcela', content: '¿Tienes varias parcelas? Usa este botón para cambiar cuál estás viendo ahora 🧭', disableBeacon: true },
    { target: '.user-info', content: 'Aquí tienes los datos de tu campo: ubicación, superficie, cultivo y más 🧾', disableBeacon: true },
    { target: '#btn-ver-informes', content: 'Desde aquí puedes acceder a todos los informes generados 📋', disableBeacon: true },
    { target: '#btn-solicitar-presupuesto', content: 'Solicita un presupuesto personalizado para tus cultivos ✉️', disableBeacon: true },
    { target: '#btn-anadir-cultivo', content: 'Añade nuevas parcelas o cultivos desde aquí 🌱', disableBeacon: true },
    { target: '#btn-gestionar-tierras', content: 'Gestiona o elimina parcelas que ya no uses 🧩', disableBeacon: true },
    { target: '#btn-ver-tour', content: '¿Quieres ver este recorrido de nuevo? Toca aquí 🚀', disableBeacon: true }
  ];

  useEffect(() => {
    const handleExternalStart = () => {
      setShowToast(false);
      setStepIndex(0);
      setRun(true);
    };

    window.addEventListener('start-tour', handleExternalStart);
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setTimeout(() => setShowToast(true), 1500);
    }

    return () => window.removeEventListener('start-tour', handleExternalStart);
  }, []);

  const startTour = () => {
    setShowToast(false);
    localStorage.setItem('hasSeenTour', 'true');
    setStepIndex(0);
    setRun(true);
  };

  const skipTour = () => {
    setShowToast(false);
    localStorage.setItem('hasSeenTour', 'true');
  };

  const handleJoyrideCallback = ({ status, type }) => {
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
      setStepIndex(0);
    }

    if (type === EVENTS.TARGET_NOT_FOUND) {
      setStepIndex((prev) => prev + 1);
    }
  };

  const Tooltip = ({
    step,
    index,
    size,
    isLastStep,
    close,
  }) => {
    const handleNext = () => {
      if (isLastStep) {
        setRun(false);
        setStepIndex(0);
        close();
      } else {
        setStepIndex(index + 1);
      }
    };

    const handleBack = () => {
      if (index > 0) {
        setStepIndex(index - 1);
      }
    };

    const handleSkip = () => {
      setRun(false);
      setStepIndex(0);
      close();
    };

    return (
      <>
        <div className="tour-tooltip">{step.content}</div>
        <div className="tour-button-group">
          <button onClick={handleSkip} className="tour-btn tour-btn-secondary">
            Saltar
          </button>
          {index > 0 && (
            <button onClick={handleBack} className="tour-btn tour-btn-secondary">
              Anterior
            </button>
          )}
          <button onClick={handleNext} className="tour-btn tour-btn-primary">
            {isLastStep ? 'Finalizar' : `Siguiente (${index + 1}/${size})`}
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="onboarding-container">
      <Joyride
        steps={steps}
        run={run}
        stepIndex={stepIndex}
        continuous={false}
        scrollToFirstStep
        showSkipButton={false}
        showProgress={false}
        disableOverlay={false}
        spotlightClicks={false}
        callback={handleJoyrideCallback}
        tooltipComponent={Tooltip}
        styles={{
          options: {
            zIndex: 10000,
            arrowColor: '#ffffff',
            primaryColor: '#f59e0b',
          }
        }}
        floaterProps={{
          disableAnimation: false,
          styles: {
            floater: {
              filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.15))'
            }
          }
        }}
      />

      {showToast && (
        <div className="tour-toast">
          <p>¿Quieres un recorrido por la plataforma?</p>
          <div className="tour-toast-buttons">
            <button onClick={skipTour} className="tour-btn tour-btn-secondary">No, gracias</button>
            <button onClick={startTour} className="tour-btn tour-btn-primary">¡Sí, mostrarme!</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingTour;
