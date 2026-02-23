"use strict";
"use client";
import { useState, useEffect, useCallback } from 'react';
import styles from './air-quality.module.css';
import BackButton from '@/components/BackButton';

export default function AirQualityPage() {
  const [city, setCity] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState('');

  const fetchAirQuality = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      let query = '';
      if (params.city) {
        query = `city=${params.city}`;
        setLocationName(params.city);
      } else if (params.lat && params.lon) {
        query = `lat=${params.lat}&lon=${params.lon}`;
        setLocationName(`Lat: ${params.lat.toFixed(2)}, Lon: ${params.lon.toFixed(2)}`);
      }

      const response = await fetch(`https://api.api-ninjas.com/v1/airquality?${query}`, {
        headers: {
          'X-Api-Key': process.env.NEXT_PUBLIC_API_NINJA_KEY
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch air quality data. Please check the city name.');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchAirQuality({ city: city.trim() });
    }
  };

  const handleCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      // If geolocation is not supported, we just stay on the search screen (which is default)
      // We can optionally set a mild error or just let the user search.
      return;
    }

    setLoading(true);
    setLocationName('Locating...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchAirQuality({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (err) => {
        // If user denies or error occurs, stop loading. 
        // We don't necessarily need to show a big red error if it's just the auto-load failing;
        // The user can still use the search box.
        setLoading(false);
        setLocationName('');
      }
    );
  }, [fetchAirQuality]);

  // Try to get location on mount
  useEffect(() => {
    handleCurrentLocation();
  }, [handleCurrentLocation]);

  const getAQIStatus = (aqi) => {
    if (aqi <= 50) return { label: 'Good', color: '#10b981', class: 'good' };
    if (aqi <= 100) return { label: 'Moderate', color: '#f59e0b', class: 'moderate' };
    if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', color: '#f97316', class: 'unhealthySensitive' };
    if (aqi <= 200) return { label: 'Unhealthy', color: '#ef4444', class: 'unhealthy' };
    if (aqi <= 300) return { label: 'Very Unhealthy', color: '#8b5cf6', class: 'veryUnhealthy' };
    return { label: 'Hazardous', color: '#7f1d1d', class: 'hazardous' };
  };

  return (
    <div className={styles.container}>
      <BackButton />
      <header className={styles.header}>
        <h1 className={styles.title}>Air Quality Dashboard</h1>
        <p className={styles.subtitle}>Real-time air pollution data and pollution levels for your location.</p>
      </header>
      
      <div className={styles.searchContainer}>
        <form onSubmit={handleSearch} className={styles.inputGroup} style={{ display: 'flex', gap: '10px', width: '100%' }}>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter city name (e.g., London)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit" className={`${styles.button} ${styles.primaryButton}`}>
             Search
          </button>
        </form>
        <button onClick={handleCurrentLocation} className={`${styles.button} ${styles.secondaryButton}`}>
           Use Current Location
        </button>
      </div>

      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {data && !loading && (
        <div className={styles.resultsContainer}>
          <div className={styles.mainCard} style={{ borderLeftColor: getAQIStatus(data.overall_aqi).color }}>
            <div className={styles.aqiInfo}>
              <h2>Overall AQI</h2>
              <div 
                className={styles.aqiValue} 
                style={{ color: getAQIStatus(data.overall_aqi).color }}
              >
                {data.overall_aqi}
              </div>
              <div 
                className={styles.aqiStatus} 
                style={{ backgroundColor: getAQIStatus(data.overall_aqi).color }}
              >
                {getAQIStatus(data.overall_aqi).label}
              </div>
            </div>
            <div className={styles.locationInfo}>
              <div className={styles.locationName}>{locationName}</div>
              <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Real-time Air Quality Index</p>
            </div>
          </div>

          <div className={styles.grid}>
            {Object.entries(data).map(([key, value]) => {
              if (key === 'overall_aqi') return null;
              // Safety check: ensure the value is an object with concentration
              if (!value || typeof value !== 'object' || !value.concentration) return null;
              
              const pollutantMeta = {
                'CO': { name: 'Carbon Monoxide', unit: 'µg/m³' },
                'NO2': { name: 'Nitrogen Dioxide', unit: 'ppb' },
                'O3': { name: 'Ozone', unit: 'ppb' },
                'SO2': { name: 'Sulfur Dioxide', unit: 'ppb' },
                'PM2.5': { name: 'Particulate Matter 2.5', unit: 'µg/m³' },
                'PM10': { name: 'Particulate Matter 10', unit: 'µg/m³' }
              };

              const meta = pollutantMeta[key] || { name: key, unit: 'µg/m³' };
              const status = getAQIStatus(value.aqi);
              
              return (
                <div key={key} className={styles.pollutantCard} style={{ borderTopColor: status.color }}>
                  <div className={styles.pollutantHeader}>
                    <span className={styles.pollutantName}>{meta.name}</span>
                    <span className={styles.pollutantValue}>{value.concentration} {meta.unit}</span>
                  </div>
                  <div className={styles.pollutantAqi} style={{ color: status.color }}>
                    {value.aqi}
                  </div>
                  <div className={styles.pollutantLabel}>AQI ({status.label})</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
