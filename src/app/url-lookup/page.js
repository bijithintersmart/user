"use strict";
"use client";
import { useState } from 'react';
import styles from './url-lookup.module.css';
import BackButton from '@/components/BackButton';

export default function UrlLookupPage() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUrlLookup = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Remove protocol if present for the API call as it expects domain or full URL
      const cleanUrl = url.trim();
      
      const response = await fetch(`https://api.api-ninjas.com/v1/urllookup?url=${encodeURIComponent(cleanUrl)}`, {
        headers: {
          'X-Api-Key': process.env.NEXT_PUBLIC_API_NINJA_KEY
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch URL data. Please check the URL and try again.');
      }

      const result = await response.json();
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
        <h1 className={styles.title}>URL Insights</h1>
        <p className={styles.subtitle}>
          Discover where a URL is hosted, its service provider, and geographical location.
        </p>
      </header>
      
      <div className={styles.searchContainer}>
        <form onSubmit={fetchUrlLookup} className={styles.inputGroup}>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter URL or Domain (e.g., google.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button type="submit" className={`${styles.button} ${styles.primaryButton}`} disabled={loading}>
             {loading ? 'Analyzing...' : 'Analyze'}
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
              <span className={styles.label}>Queried URL</span>
              <div className={styles.value}>{data.url}</div>
              <div className={`${styles.badge} ${data.is_valid ? styles.badgeSuccess : styles.badgeDanger}`} style={{ marginTop: '0.5rem' }}>
                {data.is_valid ? 'Valid URL' : 'Invalid URL'}
              </div>
            </div>

            <div className={styles.grid} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div className={styles.resultItem}>
                <span className={styles.label}>Country</span>
                <div className={styles.value}>{data.country} ({data.country_code})</div>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.label}>City / Region</span>
                <div className={styles.value}>{data.city}, {data.region}</div>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.label}>ISP</span>
                <div className={styles.value}>{data.isp}</div>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.label}>Timezone</span>
                <div className={styles.value}>{data.timezone}</div>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.label}>Coordinates</span>
                <div className={styles.value}>{data.lat}, {data.lon}</div>
              </div>

              <div className={styles.resultItem}>
                <span className={styles.label}>ZIP Code</span>
                <div className={styles.value}>{data.zip || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
