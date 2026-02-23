"use client";
import { useState, useCallback } from "react";
import styles from "./barcode.module.css";
import BackButton from "@/components/BackButton";

const BARCODE_TYPES = [
  {
    id: "code128",
    label: "Code 128",
    description: "Any text / alphanumeric",
    placeholder: "Hello World 123",
    example: "Hello World 123",
  },
  {
    id: "code39",
    label: "Code 39",
    description: "Uppercase letters & digits",
    placeholder: "HELLO123",
    example: "HELLO123",
  },
  {
    id: "ean13",
    label: "EAN-13",
    description: "Exactly 13 digits",
    placeholder: "1234567890123",
    example: "1234567890123",
  },
  {
    id: "ean8",
    label: "EAN-8",
    description: "Exactly 8 digits",
    placeholder: "12345678",
    example: "12345678",
  },
  {
    id: "upc",
    label: "UPC-A",
    description: "Exactly 12 digits",
    placeholder: "123456789012",
    example: "123456789012",
  },
];

export default function BarcodePage() {
  const [inputText, setInputText] = useState("");
  const [barcodeType, setBarcodeType] = useState("code128");
  const [barcodeUrl, setBarcodeUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generated, setGenerated] = useState(false);

  const currentType = BARCODE_TYPES.find((t) => t.id === barcodeType);

  const handleTextChange = (e) => {
    setInputText(e.target.value);
    if (barcodeUrl) {
      URL.revokeObjectURL(barcodeUrl);
      setBarcodeUrl(null);
      setGenerated(false);
      setError(null);
    }
  };

  const handleTypeChange = (id) => {
    setBarcodeType(id);
    if (barcodeUrl) {
      URL.revokeObjectURL(barcodeUrl);
      setBarcodeUrl(null);
      setGenerated(false);
      setError(null);
    }
  };

  const generate = useCallback(async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError(null);
    setBarcodeUrl(null);

    const params = new URLSearchParams({ text: inputText.trim(), type: barcodeType });

    try {
      const res = await fetch(`/api/barcode?${params}`);
      if (!res.ok) {
        const json = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(json.error || "Failed to generate barcode");
      }
      const blob = await res.blob();
      setBarcodeUrl(URL.createObjectURL(blob));
      setGenerated(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [inputText, barcodeType]);

  const download = () => {
    if (!barcodeUrl) return;
    // Derive a clean, filesystem-safe name from the type + input text
    const slug = inputText.trim().replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40) || 'data';
    const filename = `barcode_${barcodeType}_${slug}.png`;
    const a = document.createElement('a');
    a.href = barcodeUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const loadExample = () => {
    if (barcodeUrl) {
      URL.revokeObjectURL(barcodeUrl);
      setBarcodeUrl(null);
      setGenerated(false);
    }
    setInputText(currentType.example);
    setError(null);
  };

  return (
    <div className={styles.page}>
      <BackButton />
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="1" y="4" width="2" height="16" rx="0.5" />
              <rect x="5" y="4" width="1" height="16" rx="0.5" />
              <rect x="8" y="4" width="2" height="16" rx="0.5" />
              <rect x="12" y="4" width="1" height="16" rx="0.5" />
              <rect x="15" y="4" width="3" height="16" rx="0.5" />
              <rect x="20" y="4" width="1" height="16" rx="0.5" />
              <rect x="22" y="4" width="1" height="16" rx="0.5" />
            </svg>
          </div>
          <h1 className={styles.title}>Barcode Generator</h1>
          <p className={styles.subtitle}>Generate industry-standard barcodes as PNG — free and instant</p>
        </header>

        <div className={styles.layout}>
          {/* Left — Controls */}
          <div className={styles.controls}>

            {/* Barcode Type */}
            <section className={styles.section}>
              <label className={styles.label}>Barcode Type</label>
              <div className={styles.typeGrid}>
                {BARCODE_TYPES.map((t) => (
                  <button
                    key={t.id}
                    className={`${styles.typeBtn} ${barcodeType === t.id ? styles.typeBtnActive : ""}`}
                    onClick={() => handleTypeChange(t.id)}
                  >
                    <span className={styles.typeName}>{t.label}</span>
                    <span className={styles.typeDesc}>{t.description}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Text Input */}
            <section className={styles.section}>
              <div className={styles.labelRow}>
                <label className={styles.label}>Text / Data</label>
                <button className={styles.exampleBtn} onClick={loadExample}>
                  Use example
                </button>
              </div>
              <input
                type="text"
                className={styles.input}
                placeholder={currentType.placeholder}
                value={inputText}
                onChange={handleTextChange}
              />
              <p className={styles.hint}>
                <span className={styles.hintIcon}>ℹ</span>
                {currentType.description}
              </p>
            </section>

            {/* Generate */}
            <button
              className={styles.generateBtn}
              onClick={generate}
              disabled={loading || !inputText.trim()}
            >
              {loading ? (
                <><span className={styles.spinner} /> Generating…</>
              ) : (
                <>Generate Barcode</>
              )}
            </button>
          </div>

          {/* Right — Preview */}
          <div className={styles.preview}>
            <div className={styles.previewCard}>
              {!generated && !loading && !error && (
                <div className={styles.placeholder}>
                  <div className={styles.placeholderBars}>
                    {[3, 1, 2, 1, 3, 1, 2, 1, 2, 3, 1, 2, 1, 2].map((w, i) => (
                      <div
                        key={i}
                        className={styles.placeholderBar}
                        style={{ width: `${w * 6}px`, opacity: 0.12 + (i % 3) * 0.08 }}
                      />
                    ))}
                  </div>
                  <p>Your barcode will appear here</p>
                  <span>Choose a type, enter data, and click Generate</span>
                </div>
              )}

              {loading && (
                <div className={styles.loadingState}>
                  <div className={styles.loadingRing} />
                  <p>Generating barcode…</p>
                </div>
              )}

              {error && (
                <div className={styles.errorState}>
                  <span className={styles.errorIcon}>⚠️</span>
                  <p>{error}</p>
                  <button className={styles.retryBtn} onClick={generate}>Retry</button>
                </div>
              )}

              {barcodeUrl && !loading && (
                <div className={styles.barcodeResult}>
                  <div className={styles.barcodeImageWrapper}>
                    <img
                      src={barcodeUrl}
                      alt={`${currentType.label} barcode`}
                      className={styles.barcodeImage}
                    />
                  </div>
                  <div className={styles.barcodeMeta}>
                    <span className={styles.metaBadge}>{currentType.label}</span>
                    <span className={styles.metaText}>{inputText}</span>
                  </div>
                  <button className={styles.downloadBtn} onClick={download}>
                     Download PNG
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
