'use client';

import { useState } from 'react';

type DaycareData = {
  name: string;
  address: string;
  rating: string | number;
  phone: string;
  website: string;
  hours: string[];
  error?: string;
};

type MapData = {
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  daycares: DaycareData[];
  error?: string;
};

export default function MapTest() {
  const [map, setMap] = useState<MapData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMapByLocation = async () => {
    setLoading(true);
    
    if (!navigator.geolocation) {
      setMap({ error: 'Geolocation is not supported by this browser' } as MapData);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        try {
          const response = await fetch(`/api/map?lat=${lat}&lng=${lng}`);
          const data = await response.json();
          setMap(data);
        } catch (error) {
          setMap({ error: ` ${error}, Failed to fetch daycare data` } as MapData);
        }
        setLoading(false);
      },
      (error) => {
        setMap({ error: ` ${error}, Unable to get your location. Please allow location access.` } as MapData);
        setLoading(false);
      }
    );
  };

  return (
    <div>
      <h1>Daycare Finder</h1>
      
      <button onClick={fetchMapByLocation} disabled={loading}>
        {loading ? 'Finding Daycares...' : 'Find Daycares Near Me'}
      </button>
      
      {map && !map.error && (
        <div>
          <h2>Daycares near your location</h2>
          <p>Location: {map.city}</p>
          {map.daycares.map((daycare, index) => (
            <div key={index} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
              <h3>{daycare.name}</h3>
              <p>Address: {daycare.address}</p>
              <p>Rating: {daycare.rating}</p>
              <p>Phone: {daycare.phone}</p>
              <p>Website: {daycare.website}</p>
              <div>
                <p>Hours:</p>
                <ul>
                  {daycare.hours.map((hour, i) => (
                    <li key={i}>{hour}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {map?.error && (
        <p>Error: {map.error}</p>
      )}
    </div>
  );
}