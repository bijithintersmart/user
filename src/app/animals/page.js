"use strict";
"use client";
import { useState } from 'react';
import styles from './animals.module.css';
import BackButton from '@/components/BackButton';
import Link from 'next/link';

export default function AnimalsPage() {
  const [animalName, setAnimalName] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnimals = async (e) => {
    e.preventDefault();
    if (!animalName.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`https://api.api-ninjas.com/v1/animals?name=${encodeURIComponent(animalName.trim())}`, {
        headers: {
          'X-Api-Key': process.env.NEXT_PUBLIC_API_NINJA_KEY
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch animal data. Please try again.');
      }

      const result = await response.json();
      if (result.length === 0) {
        throw new Error('No animals found with that name.');
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
        <h1 className={styles.title}>Animal Explorer</h1>
        <p className={styles.subtitle}>
          Search for an animal to see basic info, then click to view full details.
        </p>
      </header>
      
      <div className={styles.searchContainer}>
        <form onSubmit={fetchAnimals} className={styles.inputGroup}>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter animal name (e.g., Cheetah)"
            value={animalName}
            onChange={(e) => setAnimalName(e.target.value)}
            required
          />
          <button type="submit" className={`${styles.button} ${styles.primaryButton}`} disabled={loading}>
             {loading ? 'Searching...' : 'Explore'}
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
        <div className={styles.tilesGrid}>
          {data.map((animal, index) => (
            <Link 
              key={index} 
              href={`/animals/details?name=${encodeURIComponent(animal.name)}`}
              className={styles.animalTile}
            >
              <div className={styles.tileHeader}>
                <h2 className={styles.tileName}>{animal.name}</h2>
                <div className={styles.tileScientific}>{animal.taxonomy.scientific_name}</div>
              </div>
              
              {animal.characteristics.slogan && (
                <div className={styles.tileSlogan}>
                  {animal.characteristics.slogan.length > 80 
                    ? `${animal.characteristics.slogan.substring(0, 80)}...` 
                    : animal.characteristics.slogan}
                </div>
              )}

              <div className={styles.tileFooter}>
                <div className={styles.locationBadge}>
                  {animal.taxonomy.class}
                </div>
                <div className={styles.viewDetailBtn}>
                  View Details →
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
