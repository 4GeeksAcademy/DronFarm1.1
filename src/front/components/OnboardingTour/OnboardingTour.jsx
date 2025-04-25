import React, { useEffect, useState } from 'react';
import Joyride from 'react-joyride';

const OnboardingTour = () => {
    const [run, setRun] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const steps = [
        {
            target: '.map-container',
            content: 'Aquí puedes ver tu parcela en el mapa 📍',
            disableBeacon: true,
        },
        {
            target: '.weather-container-wrapper',
            content: 'Este bloque te muestra el pronóstico del clima ☀️🌧️',
            disableBeacon: true,
        },
        {
            target: '.info-panel',
            content: 'Este panel te muestra información detallada de tu parcela seleccionada 🌾',
            disableBeacon: true,
        },
        {
            target: '#btn-cambiar-parcela',
            content: '¿Tienes varias parcelas? Usa este botón para cambiar cuál estás viendo ahora 🧭',
            disableBeacon: true,
        },
        {
            target: '.user-info',
            content: 'Aquí tienes los datos de tu campo: ubicación, superficie, cultivo y más 🧾',
            disableBeacon: true,
        },
        {
            target: '#btn-ver-informes',
            content: 'Desde aquí puedes acceder a todos los informes generados 📋',
            disableBeacon: true,
        },
        {
            target: '#btn-solicitar-presupuesto',
            content: 'Solicita un presupuesto personalizado para tus cultivos ✉️',
            disableBeacon: true,
        },
        {
            target: '#btn-anadir-cultivo',
            content: 'Añade nuevas parcelas o cultivos desde aquí 🌱',
            disableBeacon: true,
        },
        {
            target: '#btn-gestionar-tierras',
            content: 'Gestiona o elimina parcelas que ya no uses 🧩',
            disableBeacon: true,
        },
        {
            target: '#btn-ver-tour',
            content: '¿Quieres ver este recorrido de nuevo? Toca aquí 🚀',
            disableBeacon: true,
        }
    ];

    useEffect(() => {
        // Check if user has seen the tour before
        const hasSeenTour = localStorage.getItem('hasSeenTour');
        if (!hasSeenTour) {
            // Show toast after a short delay for better UX
            setTimeout(() => {
                setShowToast(true);
            }, 1500);
        }
    }, []);

    const startTour = () => {
        setShowToast(false);
        localStorage.setItem('hasSeenTour', 'true');
        // Small delay to ensure smooth transition
        setTimeout(() => setRun(true), 300);
    };

    const skipTour = () => {
        setShowToast(false);
        localStorage.setItem('hasSeenTour', 'true');
    };

    const handleJoyrideCallback = (data) => {
        const { status } = data;
        if (status === 'finished' || status === 'skipped') {
            setRun(false);
        }
    };

    return (
        <div className="onboarding-container">
            <Joyride
                steps={steps}
                run={run}
                continuous
                showSkipButton
                showProgress
                scrollToFirstStep={false}
                spotlightClicks={true}
                disableOverlay={false}
                callback={handleJoyrideCallback}
                styles={{
                    options: {
                        zIndex: 10000,
                    },
                    spotlight: {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    },
                    tooltip: {
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.16)',
                        padding: '20px',
                    },
                    tooltipContainer: {
                        textAlign: 'left',
                    },
                    tooltipTitle: {
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        marginBottom: '8px',
                    },
                    tooltipContent: {
                        fontSize: '16px',
                        color: '#4b5563',
                        lineHeight: 1.5,
                    },
                    buttonNext: {
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        fontSize: '14px',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                    },
                    buttonBack: {
                        color: '#6b7280',
                        fontSize: '14px',
                        fontWeight: '500',
                        marginRight: '10px',
                    },
                    buttonSkip: {
                        color: '#6b7280',
                        fontSize: '14px',
                        fontWeight: '500',
                    }
                }}
                locale={{
                    back: 'Anterior',
                    close: 'Cerrar',
                    last: 'Finalizar',
                    next: 'Siguiente',
                    skip: 'Saltar'
                }}
            />

            {showToast && (
                <div className="fixed bottom-6 right-6 max-w-sm bg-white rounded-xl shadow-lg overflow-hidden z-50 border border-gray-100 animate-fadeIn">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-amber-100 rounded-full p-3">
                                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-base font-medium text-gray-800">¡Bienvenido a AgroCampo!</p>
                                <p className="mt-1 text-sm text-gray-600">¿Te gustaría un recorrido rápido por la plataforma?</p>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end space-x-3">
                            <button
                                onClick={skipTour}
                                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            >
                                Saltar
                            </button>
                            <button
                                onClick={startTour}
                                className="px-3 py-1.5 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-md transition-colors"
                            >
                                Comenzar tour
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Restart Tour Button - Only shown if tour has been viewed before */}
            {!showToast && !run && (
                <button
                    id="btn-ver-tour"
                    onClick={startTour}
                    className="fixed bottom-6 right-6 bg-amber-500 text-white p-3 rounded-full shadow-lg hover:bg-amber-600 transition-colors z-40"
                    aria-label="Ver recorrido de ayuda"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </button>
            )}

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
        </div>
    );
};

export default OnboardingTour;