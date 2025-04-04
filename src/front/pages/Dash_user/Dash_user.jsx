import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MapComponent from '../../components/MapComponent';
import WeatherWidget from '../../components/WeatherWidget';
import { useNavigate } from 'react-router-dom';

const Dash_user = () => {
    const [userData, setUserData] = useState(null);
    const [fields, setFields] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserAndFields = async () => {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('user_id');

            if (!token || !userId) {
                setError("User not authenticated");
                return;
            }

            try {
                const userRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserData(userRes.data);

                const fieldsRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/field/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const receivedFields = Array.isArray(fieldsRes.data) ? fieldsRes.data : [];
                console.log("Received fields:", receivedFields); // para depuración

                setFields(receivedFields);

            } catch (err) {
                console.error('Error fetching data:', err);
                setError("Could not load user or fields");
            }
        };

        fetchUserAndFields();
    }, []);

    if (error) return <div className="text-red-600 p-4">{error}</div>;
    if (!userData) return <div className="p-4">Loading user...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">User Dashboard</h2>
                <div className="text-right">
                    <p className="font-semibold">{userData.name}</p>
                    <p className="text-sm text-gray-600">{userData.email}</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MapComponent fields={fields} />
                <WeatherWidget fields={fields} />
            </div>

            {/* Actions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Placeholder for reports */}
                <div className="p-4 border rounded-lg shadow bg-white">
                    <h3 className="text-lg font-bold mb-4">Reports</h3>
                    <p className="text-sm text-gray-500">Coming soon...</p>
                </div>

                <div className="p-4 border rounded-lg shadow bg-white">
                    <h3 className="text-lg font-bold mb-4">Need a quote?</h3>
                    <button
                        onClick={() => navigate('/solicitar-presupuesto')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                        Request Quote
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dash_user;
