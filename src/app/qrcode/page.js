"use client";
import { useState, useCallback, useRef } from "react";
import styles from "./qrcode.module.css";
import BackButton from "@/components/BackButton";

const PRESETS = [
  { label: "Classic", fg: "000000", bg: "ffffff" },
  { label: "Indigo", fg: "4f46e5", bg: "eef2ff" },
  { label: "Emerald", fg: "059669", bg: "ecfdf5" },
  { label: "Rose", fg: "e11d48", bg: "fff1f2" },
  { label: "Amber", fg: "d97706", bg: "fffbeb" },
  { label: "Slate", fg: "334155", bg: "f8fafc" },
  { label: "Night", fg: "e2e8f0", bg: "0f172a" },
  { label: "Ocean", fg: "0ea5e9", bg: "0c4a6e" },
];

const SIZE_OPTIONS = [100, 150, 200, 250, 300, 400, 500];

export default function QRCodePage() {
  const [inputData, setInputData] = useState("");
  const [fgColor, setFgColor] = useState("000000");
  const [bgColor, setBgColor] = useState("ffffff");
  const [size, setSize] = useState(250);
  const [qrUrl, setQrUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generated, setGenerated] = useState(false);
  const imgRef = useRef(null);

  const generate = useCallback(async () => {
    if (!inputData.trim()) return;
    setLoading(true);
    setError(null);
    setQrUrl(null);

    const params = new URLSearchParams({
      data: inputData.trim(),
      format: "png",
      fg_color: fgColor,
      bg_color: bgColor,
    });

    try {
      const res = await fetch(`/api/qrcode?${params}`);
      if (!res.ok) {
        const json = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(json.error || "Failed to generate QR code");
      }
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      setQrUrl(objectUrl);
      setGenerated(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [inputData, fgColor, bgColor, size]);

  const download = () => {
    if (!qrUrl) return;
    // Derive a clean, filesystem-safe name from the input data
    const slug = inputData.trim().replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40) || 'qrcode';
    const filename = `qrcode_${slug}.png`;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const applyPreset = (preset) => {
    setFgColor(preset.fg);
    setBgColor(preset.bg);
  };

  return (
    <div className={styles.page}>
      <BackButton />
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none" />
              <rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none" />
              <rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none" />
              <path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <h1 className={styles.title}>QR Code Generator</h1>
          <p className={styles.subtitle}>Generate custom QR codes with live color customization</p>
        </header>

        <div className={styles.layout}>
          {/* Left Column – Controls */}
          <div className={styles.controls}>
            {/* Input */}
            <section className={styles.section}>
              <label className={styles.label}>URL</label>
              <textarea
                className={styles.textarea}
                placeholder="Enter a URL, text, contact, or anything…"
                value={inputData}
                onChange={(e) => {
                  setInputData(e.target.value);
                  if (qrUrl) {
                    URL.revokeObjectURL(qrUrl);
                    setQrUrl(null);
                    setGenerated(false);
                    setError(null);
                  }
                }}
                rows={3}
              />
            </section>

            {/* Size */}
            <section className={styles.section}>
              <label className={styles.label}>Size: <strong>{size}px</strong></label>
              <div className={styles.sizeGrid}>
                {SIZE_OPTIONS.map((s) => (
                  <button
                    key={s}
                    className={`${styles.sizeBtn} ${size === s ? styles.sizeBtnActive : ""}`}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </section>

            {/* Color Presets */}
            <section className={styles.section}>
              <label className={styles.label}>Color Presets</label>
              <div className={styles.presetGrid}>
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    className={`${styles.presetBtn} ${fgColor === p.fg && bgColor === p.bg ? styles.presetBtnActive : ""}`}
                    onClick={() => applyPreset(p)}
                    title={p.label}
                  >
                    <span
                      className={styles.presetSwatch}
                      style={{ background: `#${p.bg}`, border: `3px solid #${p.fg}` }}
                    />
                    <div
                      className={styles.presetDot}
                      style={{ background: `#${p.fg}` }}
                    />
                    <span className={styles.presetLabel}>{p.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Custom Colors */}
            <section className={styles.section}>
              <label className={styles.label}>Custom Colors</label>
              <div className={styles.colorRow}>
                <div className={styles.colorPicker}>
                  <span className={styles.colorPickerLabel}>Foreground</span>
                  <div className={styles.colorInputWrapper}>
                    <input
                      type="color"
                      className={styles.colorWheel}
                      value={`#${fgColor}`}
                      onChange={(e) => setFgColor(e.target.value.replace("#", ""))}
                    />
                    <input
                      type="text"
                      className={styles.hexInput}
                      value={`#${fgColor}`}
                      onChange={(e) => {
                        const val = e.target.value.replace("#", "");
                        if (/^[0-9a-fA-F]{0,6}$/.test(val)) setFgColor(val);
                      }}
                      maxLength={7}
                    />
                  </div>
                </div>
                <div className={styles.colorPicker}>
                  <span className={styles.colorPickerLabel}>Background</span>
                  <div className={styles.colorInputWrapper}>
                    <input
                      type="color"
                      className={styles.colorWheel}
                      value={`#${bgColor}`}
                      onChange={(e) => setBgColor(e.target.value.replace("#", ""))}
                    />
                    <input
                      type="text"
                      className={styles.hexInput}
                      value={`#${bgColor}`}
                      onChange={(e) => {
                        const val = e.target.value.replace("#", "");
                        if (/^[0-9a-fA-F]{0,6}$/.test(val)) setBgColor(val);
                      }}
                      maxLength={7}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Generate Button */}
            <button
              className={styles.generateBtn}
              onClick={generate}
              disabled={loading || !inputData.trim()}
            >
              {loading ? (
                <><span className={styles.spinner} /> Generating…</>
              ) : (
                <>Generate</>
              )}
            </button>
          </div>

          {/* Right Column – Preview */}
          <div className={styles.preview}>
            <div className={styles.previewCard}>
              {!generated && !loading && !error && (
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>
                    <svg viewBox="0 0 80 80" fill="none">
                      <rect x="8" y="8" width="24" height="24" rx="3" stroke="currentColor" strokeWidth="3" />
                      <rect x="48" y="8" width="24" height="24" rx="3" stroke="currentColor" strokeWidth="3" />
                      <rect x="8" y="48" width="24" height="24" rx="3" stroke="currentColor" strokeWidth="3" />
                      <rect x="14" y="14" width="12" height="12" fill="currentColor" rx="1" />
                      <rect x="54" y="14" width="12" height="12" fill="currentColor" rx="1" />
                      <rect x="14" y="54" width="12" height="12" fill="currentColor" rx="1" />
                      <rect x="48" y="48" width="6" height="6" fill="currentColor" rx="1" />
                      <rect x="58" y="48" width="6" height="6" fill="currentColor" rx="1" />
                      <rect x="48" y="58" width="6" height="6" fill="currentColor" rx="1" />
                      <rect x="58" y="58" width="6" height="6" fill="currentColor" rx="1" />
                    </svg>
                  </div>
                  <p>Your QR code will appear here</p>
                  <span>Enter data and click Generate</span>
                </div>
              )}

              {loading && (
                <div className={styles.loadingState}>
                  <div className={styles.loadingRing} />
                  <p>Generating your QR code…</p>
                </div>
              )}

              {error && (
                <div className={styles.errorState}>
                  <span className={styles.errorIcon}>⚠️</span>
                  <p>{error}</p>
                </div>
              )}

              {qrUrl && !loading && (
                <div className={styles.qrResult}>
                  <div
                    className={styles.qrImageWrapper}
                    style={{ background: `#${bgColor}` }}
                  >
                    <img
                      ref={imgRef}
                      src={qrUrl}
                      alt="Generated QR Code"
                      className={styles.qrImage}
                      style={{ width: Math.min(size, 320), height: Math.min(size, 320) }}
                    />
                  </div>
                  <div className={styles.qrMeta}>
                    <span>{size} × {size} px</span>
                    <span>PNG</span>
                    <span style={{ color: `#${fgColor}` }}>●</span>
                    <span style={{ color: `#${bgColor}`, textShadow: "0 0 1px #888" }}>●</span>
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
