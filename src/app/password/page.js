"use client";

import { useState } from "react";
import styles from "../page.module.css";
import BackButton from "@/components/BackButton";

const API_KEY = "mPBHtlkYvykIAyCEhkuP0UsPXNoWYJv8S1QRRbrz";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({
    length: 12,
    uppercase: true,
    lowercase: true,
    numbers: true,
    special: true,
  });

  const generatePassword = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        length: options.length.toString(),
        uppercase: options.uppercase.toString(),
        lowercase: options.lowercase.toString(),
        numbers: options.numbers.toString(),
        special: options.special.toString(),
      });

      const response = await fetch(
        `https://api.api-ninjas.com/v1/passwordgenerator?${params}`,
        {
          method: "GET",
          headers: {
            "X-Api-Key": API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate password");
      }

      const data = await response.json();
      setPassword(data.random_password);
    } catch (error) {
      console.error("Error generating password:", error);
      setPassword("Error generating password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
    }
  };

  const handleOptionChange = (key, value) => {
    setOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <BackButton />
        <div className={styles.intro}>
          <h1>Password Generator</h1>
          <p>
            Generate secure, random passwords using the API-Ninjas Password
            Generator API. Customize the length and character types to create
            strong passwords.
          </p>
        </div>

        <div className={styles.formSection}>
          <div className={styles.formField}>
            <label>Password Length: {options.length}</label>
            <input
              type="range"
              min="6"
              max="30"
              value={options.length}
              onChange={(e) =>
                handleOptionChange("length", parseInt(e.target.value))
              }
              style={{ width: "100%" }}
            />
          </div>

          <div className={styles.formField}>
            <label>Character Types</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "normal" }}>
                <input
                  type="checkbox"
                  checked={options.uppercase}
                  onChange={(e) => handleOptionChange("uppercase", e.target.checked)}
                />
                Uppercase (A-Z)
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "normal" }}>
                <input
                  type="checkbox"
                  checked={options.lowercase}
                  onChange={(e) => handleOptionChange("lowercase", e.target.checked)}
                />
                Lowercase (a-z)
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "normal" }}>
                <input
                  type="checkbox"
                  checked={options.numbers}
                  onChange={(e) => handleOptionChange("numbers", e.target.checked)}
                />
                Numbers (0-9)
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "normal" }}>
                <input
                  type="checkbox"
                  checked={options.special}
                  onChange={(e) => handleOptionChange("special", e.target.checked)}
                />
                Special Characters (!@#$%^&*)
              </label>
            </div>
          </div>

          <button
            onClick={generatePassword}
            disabled={loading || (!options.uppercase && !options.lowercase && !options.numbers && !options.special)}
            style={{
              marginTop: "20px",
              padding: "16px 20px",
              backgroundColor: loading || (!options.uppercase && !options.lowercase && !options.numbers && !options.special) ? "#9ca3af" : "var(--primary)",
              color: "var(--primary-foreground)",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading || (!options.uppercase && !options.lowercase && !options.numbers && !options.special) ? "not-allowed" : "pointer",
              transition: "background-color 0.2s ease, transform 0.2s ease",
            }}
          >
            {loading ? "Generating..." : "Generate Password"}
          </button>

          {password && (
            <div className={styles.passwordResult}>
              <label className={styles.passwordLabel}>Generated Password</label>
              <div className={styles.passwordContainer}>
                <code className={styles.passwordCode}>{password}</code>
                <button onClick={copyToClipboard} className={styles.copyButton}>
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
