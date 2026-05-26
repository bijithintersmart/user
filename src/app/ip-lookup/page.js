"use strict";
"use client";
import { useState } from 'react';
import styles from './ip-lookup.module.css';
import BackButton from '@/components/BackButton';

export default function IpLookupPage() {
  const [ip, setIp] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchIpDetails = async (e) => {
    e.preventDefault();
    if (!ip.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`/api/ip-lookup?ip=${encodeURIComponent(ip.trim())}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch IP details.');
      }

      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <BackButton />
      <header className={styles.header}>
        <h1 className={styles.title}>IP Insights</h1>
        <p className={styles.subtitle}>
          Get detailed geographical and network information for any IP address.
        </p>
      </header>
      
      <div className={styles.searchContainer}>
        <form onSubmit={fetchIpDetails} className={styles.inputGroup}>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter IP Address (e.g., 8.8.8.8)"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            required
          />
          <button type="submit" className={`${styles.button} ${styles.primaryButton}`} disabled={loading}>
             {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
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
          <div className={styles.mainCard}>
            <div className={styles.resultItem}>
              <span className={styles.label}>IP Address</span>
              <div className={styles.value}>{data.ip}</div>
              <div style={{ marginTop: '0.5rem' }}>
                <span className={styles.badge} style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                  {data.type}
                </span>
              </div>
            </div>

            <div className={styles.grid}>
              <div className={styles.resultItem}>
                <span className={styles.label}>Location</span>
                <div className={styles.value}>
                  {data.location?.country_flag && (
                    <img 
                      src={data.location.country_flag} 
                      alt={data.country_name} 
                      className={styles.flag} 
                    />
                  )}
                  {data.city}, {data.region_name}, {data.country_name}
                </div>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.label}>Continent</span>
                <div className={styles.value}>{data.continent_name} ({data.continent_code})</div>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.label}>Coordinates</span>
                <div className={styles.value}>{data.latitude}, {data.longitude}</div>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.label}>Zip Code</span>
                <div className={styles.value}>{data.zip || 'N/A'}</div>
              </div>

              {data.location?.languages && (
                <div className={styles.resultItem}>
                  <span className={styles.label}>Languages</span>
                  <div className={styles.value}>
                    {data.location.languages.map(lang => lang.name).join(', ')}
                  </div>
                </div>
              )}

              <div className={styles.resultItem}>
                <span className={styles.label}>Calling Code</span>
                <div className={styles.value}>+{data.location?.calling_code}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
