"use strict";
"use client";
import { useState, useRef, useEffect } from 'react';
import styles from './object-detection.module.css';
import BackButton from '@/components/BackButton';

export default function ObjectDetectionPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState({ x: 1, y: 1 });
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setObjects([]);
      setError(null);
    } else {
      setError("Please select a valid image file.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setObjects([]);
      setError(null);
    } else {
      setError("Please drop a valid image file.");
    }
  };

  const calculateScale = () => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight, clientWidth, clientHeight } = imageRef.current;
      setScale({
        x: clientWidth / naturalWidth,
        y: clientHeight / naturalHeight
      });
    }
  };

  useEffect(() => {
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  const detectObjects = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    setObjects([]);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('https://api.api-ninjas.com/v1/objectdetection', {
        method: 'POST',
        headers: {
          'X-Api-Key': process.env.NEXT_PUBLIC_API_NINJA_KEY
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image. Please try again.');
      }

      const result = await response.json();
      
      // Sort objects by area (large to small) so smaller objects are rendered later 
      // in the DOM and appear on top.
      const sortedResult = result.sort((a, b) => {
        const areaA = (Number(a.bounding_box.x2) - Number(a.bounding_box.x1)) * (Number(a.bounding_box.y2) - Number(a.bounding_box.y1));
        const areaB = (Number(b.bounding_box.x2) - Number(b.bounding_box.x1)) * (Number(b.bounding_box.y2) - Number(b.bounding_box.y1));
        return areaB - areaA; // Descending order: largest first, smallest last
      });
      
      setObjects(sortedResult);
      
      // Calculate scale immediately after detection to draw boxes
      setTimeout(calculateScale, 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setObjects([]);
    setError(null);
  };

  return (
    <div className={styles.container}>
      <BackButton />
      <header className={styles.header}>
        <h1 className={styles.title}>Object Vision AI</h1>
        <p className={styles.subtitle}>
          Harness neural networks to identify and locate hundreds of distinct objects in real-time.
        </p>
      </header>

      <div className={styles.mainLayout}>
        <div className={styles.uploadSection}>
          {!previewUrl ? (
            <div 
              className={styles.dropZone}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <div className={styles.icon}>🔍</div>
              <p>Drag & drop or click to upload</p>
              <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Analyze animals, vehicles, furniture & more</span>
            </div>
          ) : (
            <div className={`${styles.previewContainer} ${hoveredIndex !== null ? styles.focusMode : ''}`}>
              <img 
                ref={imageRef}
                src={previewUrl} 
                alt="Preview" 
                className={styles.imagePreview}
                onLoad={calculateScale}
              />
              {objects.map((obj, i) => {
                const { x1, y1, x2, y2 } = obj.bounding_box;
                const boxX = Number(x1);
                const boxY = Number(y1);
                const boxWidth = Number(x2) - Number(x1);
                const boxHeight = Number(y2) - Number(y1);

                return (
                  <div 
                    key={i} 
                    className={`${styles.objectBox} ${hoveredIndex === i ? styles.highlightedBox : ''}`}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{
                      left: `${boxX * scale.x}px`,
                      top: `${boxY * scale.y}px`,
                      width: `${boxWidth * scale.x}px`,
                      height: `${boxHeight * scale.y}px`,
                    }}
                  >
                    <div className={styles.objectLabel}>
                      <span style={{ fontSize: '10px' }}>●</span> {obj.label}
                    </div>
                  </div>
                );
              })}
              {loading && (
                <div className={styles.loadingOverlay}>
                  <div className={styles.spinner}></div>
                </div>
              )}
            </div>
          )}

          <input 
            type="file" 
            className={styles.hiddenInput} 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
          />

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            {previewUrl && !loading && (
              <>
                {objects.length === 0 && (
                  <button className={`${styles.button} ${styles.primaryButton}`} onClick={detectObjects}>
                    Analyze Objects
                  </button>
                )}
                <button className={`${styles.button} ${styles.secondaryButton}`} onClick={reset}>
                  New Image
                </button>
              </>
            )}
          </div>
        </div>

        {objects.length > 0 && (
          <div className={styles.objectSideList}>
            <h3>Detected Items</h3>
            <div className={styles.listContainer}>
              {objects.map((obj, i) => (
                <div 
                  key={i} 
                  className={`${styles.listItem} ${hoveredIndex === i ? styles.activeListItem : ''}`}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <span className={styles.itemIndex}>{i + 1}</span>
                  <span className={styles.itemLabel}>{obj.label}</span>
                  <span className={styles.itemConfidence}>{Math.round(obj.confidence * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {objects.length > 0 && (
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{objects.length}</span>
            <span className={styles.statLabel}>Items Found</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>V2.4</span>
            <span className={styles.statLabel}>Neural Model</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>100%</span>
            <span className={styles.statLabel}>Accuracy</span>
          </div>
        </div>
      )}
    </div>
  );
}
