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
    { target: '#btn-ver-ejemplos', content: '¿No sabes que contiene un informe? Aquí podrás ver uno de ejemplo', disableBeacon: true },
    { target: '#btn-solicitar-presupuesto', content: 'Solicita un presupuesto personalizado para tus cultivos ✉️', disableBeacon: true },
    { target: '#btn-anadir-cultivo', content: 'Añade nuevas parcelas o cultivos desde aquí 🌱', disableBeacon: true },
    { target: '#btn-gestionar-tierras', content: 'Gestiona o elimina parcelas que ya no uses 🧩', disableBeacon: true },
    { target: '.hamburger-icon', content: 'Aqui encontrarás cómo navegar por el resto de pantallas y volver a ver este tour', disableBeacon: true }
  ];

  useEffect(() => {
    const handleExternalStart = () => {
      setShowToast(false);
      startTour();
    };

    window.addEventListener('start-tour', handleExternalStart);

    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (hasSeenTour === 'false') {
      setTimeout(() => setShowToast(true), 1500);
    }

    return () => window.removeEventListener('start-tour', handleExternalStart);
  }, []);


  useEffect(() => {
    document.body.classList.toggle('tour-active', run);
  }, [run]);

  const startTour = () => {
    localStorage.setItem('hasSeenTour', 'true');
    setShowToast(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setStepIndex(0);
        setRun(true);
      });
    });
  };

  const skipTour = () => {
    localStorage.setItem('hasSeenTour', 'true');
    setShowToast(false);
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

  const Tooltip = ({ step, index, size, isLastStep, close }) => {
    const handleNext = () => {
      if (isLastStep) {
        setTimeout(() => {
          window.dispatchEvent(new Event("open-hamburger"));
        }, 100);
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
          <button onClick={handleSkip} className="tour-btn tour-btn-secondary">Saltar</button>
          {index > 0 && (
            <button onClick={handleBack} className="tour-btn tour-btn-secondary">Anterior</button>
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
        scrollToFirstStep={false}
        disableScrolling={true}
        showSkipButton={false}
        showProgress={false}
        disableOverlay={false}
        spotlightClicks={true}
        spotlightPadding={12}
        callback={handleJoyrideCallback}
        tooltipComponent={Tooltip}
        styles={{
          options: {
            zIndex: 10000,
            arrowColor: '#ffffff',
            primaryColor: '#f59e0b',
          },
          overlay: {
            backgroundColor: 'rgba(37, 61, 38, 0.5)',
            transition: 'none',
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            willChange: 'opacity',
          },
          spotlight: {
            borderRadius: 8,
            transition: 'none',
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.7)',
            willChange: 'transform',
          }
        }}
        floaterProps={{
          disableAnimation: true,
          styles: {
            floater: {
              transition: 'none',
              filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.15))',
            }
          }
        }}
      />

      {showToast && (
        <div className="tour-toast">
          <p>¿Eres nuevo por aquí?</p>
          <p>¿Quieres ver un recorrido rápido de tu panel principal?</p>
          <div className="tour-toast-buttons">
            <button onClick={skipTour} className="tour-btn tour-btn-secondary">No, gracias</button>
            <button onClick={startTour} className="tour-btn tour-btn-primary">Sí, quiero ver cómo funciona!</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingTour;
