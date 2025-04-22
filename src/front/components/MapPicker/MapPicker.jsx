import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./MapPicker.css";

mapboxgl.accessToken = "pk.eyJ1IjoiZXF1aXBvMiIsImEiOiJjbTk3Z3EyeWgwN2pzMnJzYWh0ejd0bHNuIn0.xV1fX4yZB6W1JhpxlJ0Dsg";

const MapPicker = ({ initialCoordinates, onCoordinatesChange }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const markerRef = useRef(null);
    const [showFlyMessage, setShowFlyMessage] = useState(false);
    const hideMessageTimeout = useRef(null);
    const isProgrammaticMove = useRef(false);
    const userInteracted = useRef(false);

    useEffect(() => {
        const [defaultLat, defaultLon] =
            initialCoordinates && /^-?\d+\.\d+,-?\d+\.\d+$/.test(initialCoordinates)
                ? initialCoordinates.split(",").map(coord => parseFloat(coord.trim()))
                : [0, 0];

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/satellite-streets-v12",
            center: [defaultLon, defaultLat],
            zoom: 2
        });

        map.current._requestManager._transformRequest = (url) => {
            if (url.includes("events.mapbox.com")) {
                return { url: "about:blank" };
            }
            return { url };
        };

        const marker = new mapboxgl.Marker({ draggable: true })
            .setLngLat([defaultLon, defaultLat])
            .addTo(map.current);

        markerRef.current = marker;

        const updateCoords = () => {
            const { lng, lat } = marker.getLngLat();
            onCoordinatesChange(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        };

        marker.on("dragstart", () => userInteracted.current = true);
        marker.on("dragend", updateCoords);

        map.current.on("click", (e) => {
            userInteracted.current = true;
            marker.setLngLat(e.lngLat);
            updateCoords();
        });

        map.current.on("mousedown", () => userInteracted.current = true);
        map.current.on("wheel", () => userInteracted.current = true);
        map.current.on("touchstart", () => userInteracted.current = true);

        map.current.on("movestart", () => {
            if (isProgrammaticMove.current && !userInteracted.current) {
                clearTimeout(hideMessageTimeout.current);
                setShowFlyMessage(true);
            }
        });

        map.current.on("moveend", () => {
            if (isProgrammaticMove.current && !userInteracted.current) {
                hideMessageTimeout.current = setTimeout(() => {
                    setShowFlyMessage(false);
                    isProgrammaticMove.current = false;
                }, 500);
            }
            userInteracted.current = false; // reset after move
        });

        return () => {
            map.current.remove();
            clearTimeout(hideMessageTimeout.current);
        };
    }, []);

    useEffect(() => {
        if (!map.current || !initialCoordinates || !/^[-\d.]+,\s*[-\d.]+$/.test(initialCoordinates)) return;

        const [lat, lon] = initialCoordinates.split(",").map(coord => parseFloat(coord.trim()));
        const lngLat = [lon, lat];

        isProgrammaticMove.current = true;
        map.current.flyTo({ center: lngLat, zoom: 15, essential: true });

        if (markerRef.current) {
            markerRef.current.setLngLat(lngLat);
        }
    }, [initialCoordinates]);

    return (
        <div className="map-picker-wrapper">
            <div className="map-picker-container" ref={mapContainer} />
            {showFlyMessage && (
                <div className="map-fly-overlay-blur">
                    📍 ¡Seleccione la ubicación exacta en el mapa!
                </div>
            )}
        </div>
    );
};

export default MapPicker;
