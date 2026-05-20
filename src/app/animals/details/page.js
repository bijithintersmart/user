"use strict";
"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from '../animals.module.css';
import BackButton from '@/components/BackButton';

function AnimalDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get('name');
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!name) {
      router.push('/animals');
      return;
    }

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.api-ninjas.com/v1/animals?name=${encodeURIComponent(name)}`, {
          headers: {
            'X-Api-Key': process.env.NEXT_PUBLIC_API_NINJA_KEY
          }
        });

        if (!response.ok) throw new Error('Failed to fetch animal details.');
        
        const result = await response.json();
        const animal = result.find(a => a.name.toLowerCase() === name.toLowerCase()) || result[0];
        
        if (!animal) throw new Error('Animal not found.');
        
        setData(animal);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [name, router]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error || 'Animal not found.'}</div>
        <button onClick={() => router.push('/animals')} className={`${styles.button} ${styles.primaryButton}`}>
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <div className={styles.resultsContainer}>
      <div className={styles.detailHeader}>
        <div className={styles.backToSearch} onClick={() => router.push('/animals')}>
          ← Back to Results
        </div>
      </div>

      <div className={styles.animalCard}>
        <div className={styles.animalHeader}>
          <div>
            <h2 className={styles.animalName}>{data.name}</h2>
            <p className={styles.taxonomy}>
              {data.taxonomy.scientific_name} • {data.taxonomy.class}
            </p>
          </div>
          <div className={styles.locations}>
            {data.locations.map((loc, i) => (
              <span key={i} className={styles.locationBadge}>{loc}</span>
            ))}
          </div>
        </div>

        {data.characteristics.slogan && (
          <div className={styles.slogan}>
            &quot;{data.characteristics.slogan}&quot;
          </div>
        )}

        <div className={styles.quickStats}>
          {data.characteristics.top_speed && (
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Top Speed</span>
              <div className={styles.statValue}>{data.characteristics.top_speed}</div>
            </div>
          )}
          {data.characteristics.lifespan && (
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Lifespan</span>
              <div className={styles.statValue}>{data.characteristics.lifespan}</div>
            </div>
          )}
          {data.characteristics.weight && (
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Weight</span>
              <div className={styles.statValue}>{data.characteristics.weight}</div>
            </div>
          )}
          {data.characteristics.diet && (
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Diet</span>
              <div className={styles.statValue}>{data.characteristics.diet}</div>
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Characteristics</h3>
          <div className={styles.grid}>
            {Object.entries(data.characteristics).map(([key, value]) => {
              if (['slogan', 'top_speed', 'lifespan', 'weight', 'diet'].includes(key)) return null;
              return (
                <div key={key} className={styles.resultItem}>
                  <span className={styles.label}>{key.replace(/_/g, ' ')}</span>
                  <div className={styles.value}>{value}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Taxonomy</h3>
          <div className={styles.grid}>
             {Object.entries(data.taxonomy).map(([key, value]) => (
              <div key={key} className={styles.resultItem}>
                <span className={styles.label}>{key.replace(/_/g, ' ')}</span>
                <div className={styles.value}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnimalDetailPage() {
  return (
    <div className={styles.container}>
      <Suspense fallback={
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      }>
        <AnimalDetailContent />
      </Suspense>
    </div>
  );
}
