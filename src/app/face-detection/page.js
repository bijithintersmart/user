"use strict";
"use client";
import { useState, useRef, useEffect } from 'react';
import styles from './face-detection.module.css';
import BackButton from '@/components/BackButton';

export default function FaceDetectionPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [faces, setFaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState({ x: 1, y: 1 });
  
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setFaces([]);
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
      setFaces([]);
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

  const detectFaces = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    setFaces([]);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('https://api.api-ninjas.com/v1/facedetect', {
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
      setFaces(result);
      
      // Calculate scale immediately after detection
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
    setFaces([]);
    setError(null);
  };

  return (
    <div className={styles.container}>
      <BackButton />
      <header className={styles.header}>
        <h1 className={styles.title}>AI Face Detector</h1>
        <p className={styles.subtitle}>
          Upload an image to identify human faces using advanced AI recognition technology.
        </p>
      </header>

      <div className={styles.uploadSection}>
        {!previewUrl ? (
          <div 
            className={styles.dropZone}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <div className={styles.icon}>📷</div>
            <p>Drag & drop or click to upload image</p>
            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>JPG, PNG or JPEG</span>
          </div>
        ) : (
          <div className={styles.previewContainer}>
            <img 
              ref={imageRef}
              src={previewUrl} 
              alt="Preview" 
              className={styles.imagePreview}
              onLoad={calculateScale}
            />
            {faces.map((f, i) => (
              <div 
                key={i} 
                className={styles.faceMarker}
                style={{
                  left: `${f.x * scale.x}px`,
                  top: `${f.y * scale.y}px`,
                  width: `${f.width * scale.x}px`,
                  height: `${f.height * scale.y}px`,
                }}
              />
            ))}
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
              {faces.length === 0 && (
                <button className={`${styles.button} ${styles.primaryButton}`} onClick={detectFaces}>
                  Detect Faces
                </button>
              )}
              <button className={`${styles.button} ${styles.secondaryButton}`} onClick={reset}>
                Remove Image
              </button>
            </>
          )}
          {loading && (
            <button className={`${styles.button} ${styles.primaryButton}`} disabled>
              <div className={styles.spinner}></div> Analyzing...
            </button>
          )}
        </div>
      </div>

      {faces.length > 0 && (
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{faces.length}</span>
            <span className={styles.statLabel}>Faces Detected</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>V1.0</span>
            <span className={styles.statLabel}>AI Model</span>
          </div>
        </div>
      )}
    </div>
  );
}
