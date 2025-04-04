import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

// 💡 Token público provisional (reemplázalo cuando tengas el tuyo)
mapboxgl.accessToken = 'TU_TOKEN_PUBLICO_DE_MAPBOX';

const MapComponent = ({ fields }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);

    useEffect(() => {
        if (!Array.isArray(fields) || fields.length === 0) return;

        const validField = fields.find(f => f.coordinates);
        if (!validField) return;

        const [lat, lon] = validField.coordinates.split(',').map(coord => parseFloat(coord.trim()));
        if (isNaN(lat) || isNaN(lon)) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lon, lat],
            zoom: 12,
        });

        fields.forEach(field => {
            if (!field.coordinates) return;
            const [lat, lon] = field.coordinates.split(',').map(coord => parseFloat(coord.trim()));
            if (isNaN(lat) || isNaN(lon)) return;

            new mapboxgl.Marker()
                .setLngLat([lon, lat])
                .setPopup(new mapboxgl.Popup().setHTML(`<strong>${field.name}</strong><br/>Crop: ${field.crop}`))
                .addTo(map.current);
        });

        return () => map.current?.remove();
    }, [fields]);


    return (
        <div className="h-96 w-full border rounded-lg overflow-hidden shadow" ref={mapContainer} />
    );
};

export default MapComponent;
