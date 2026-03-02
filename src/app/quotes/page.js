"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./quotes.module.css";
import BackButton from "@/components/BackButton";

const ALL_CATEGORIES = [
  "age", "alone", "amazing", "anger", "architecture", "art", "attitude", "beauty", 
  "best", "birthday", "business", "car", "change", "communication", "computers", 
  "cool", "courage", "dad", "dating", "death", "design", "dreams", "education", 
  "excellent", "equality", "experience", "failure", "faith", "family", "famous", 
  "fear", "fitness", "food", "forgiveness", "freedom", "friendship", "funny", 
  "future", "god", "good", "government", "graduation", "great", "happiness", 
  "health", "history", "home", "hope", "humor", "imagination", "inspirational", 
  "intelligence", "jealousy", "knowledge", "leadership", "learning", "legal", "life", 
  "love", "marriage", "medical", "men", "mom", "money", "morning", "movies", 
  "success", "wisdom"
];

const FALLBACK_WORDS = [
  "Ambition", "Wisdom", "Courage", "Clarity", "Presence", "Balance", "Growth", 
  "Purpose", "Harmony", "Vision", "Resilience", "Stillness", "Legacy", 
  "Kindness", "Focus", "Gratitude", "Authenticity", "Strength", "Freedom", "Love"
];

export default function QuotesPage() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [words, setWords] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [discoveryWords, setDiscoveryWords] = useState([]);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const [isDiscoveryMode, setIsDiscoveryMode] = useState(false);
  const [key, setKey] = useState(0);

  const fetchQuote = async () => {
    setLoading(true);
    setError(null);
    setWords([]);
    setIsDiscoveryMode(false);
    
    try {
      // Removing category filter to ensure the request is successful on the free tier
      const response = await fetch(`https://api.api-ninjas.com/v1/quotes`, {
        headers: {
          'X-Api-Key': process.env.NEXT_PUBLIC_API_NINJA_KEY
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        const selectedQuote = data[0];
        
        if (!selectedQuote || !selectedQuote.quote) {
          throw new Error("No quote text found in the response.");
        }

        setQuote(selectedQuote);
        const allWords = selectedQuote.quote.split(/\s+/);
        setWords(allWords);
        
        // Extract meaningful keywords
        const extracted = [...new Set(allWords
          .map(w => w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase())
          .filter(w => w.length > 4))]
          .slice(0, 8);
        
        setKeywords(extracted);
        setKey(prev => prev + 1);
      } else {
        setError("No quotes available right now.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startDiscovery = useCallback(() => {
    setIsDiscoveryMode(true);
    // Shuffle and pick 10 words from keywords or fallback
    const source = keywords.length > 3 ? keywords : FALLBACK_WORDS;
    const shuffled = [...source].sort(() => 0.5 - Math.random()).slice(0, 10);
    setDiscoveryWords(shuffled);
    setActiveWordIndex(0);
    setKey(prev => prev + 1);
  }, [keywords]);

  useEffect(() => {
    fetchQuote();
  }, []);

  useEffect(() => {
    if (isDiscoveryMode && activeWordIndex < discoveryWords.length && activeWordIndex !== -1) {
      const timer = setTimeout(() => {
        if (activeWordIndex < discoveryWords.length - 1) {
          setActiveWordIndex(prev => prev + 1);
        } else {
          // Stay on the last word or reset? Let's just stay.
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isDiscoveryMode, activeWordIndex, discoveryWords]);

  return (
    <div className={styles.container}>
      <div className={styles.backgroundDecoration}></div>
      <BackButton />
      
      <main className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>Universal Wisdom</h1>
          <p className={styles.subtitle}>Random insights and words to live by.</p>
        </header>

        <div className={styles.quoteCard}>
          {loading && (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Gathering thoughts...</p>
            </div>
          )}

          {error && !loading && (
            <div className={styles.errorContainer}>
              <p style={{ color: '#ef4444' }}>{error}</p>
              <button onClick={fetchQuote} className={styles.refreshButton} style={{ marginTop: '1rem' }}>
                Try Again
              </button>
            </div>
          )}

          {quote && !loading && !error && (
            <div key={key}>
              {!isDiscoveryMode ? (
                <>
                  <div className={styles.quoteTextContainer}>
                    {words.map((word, index) => (
                      <span 
                        key={index} 
                        className={styles.word}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                  <div className={styles.footerInfo}>
                    <div className={styles.author}>— {quote.author}</div>
                    <div className={styles.categoryBadge}>{quote.category}</div>
                  </div>
                </>
              ) : (
                <div className={styles.discoveryLayer}>
                  <p className={styles.discoveryLabel}>RANDOMIZED STREAM</p>
                  <div className={styles.activeDiscoveryWord}>
                    {discoveryWords[activeWordIndex]}
                  </div>
                  <div className={styles.progressDots}>
                    {discoveryWords.map((_, i) => (
                      <div 
                        key={i} 
                        className={`${styles.dot} ${i === activeWordIndex ? styles.activeDot : ''} ${i < activeWordIndex ? styles.passedDot : ''}`}
                      />
                    ))}
                  </div>
                  {activeWordIndex === discoveryWords.length - 1 && (
                    <button className={styles.miniRefresh} onClick={startDiscovery}>
                      Restart Stream
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {!loading && (
          <div className={styles.controls}>
            {!isDiscoveryMode ? (
              <button onClick={startDiscovery} className={styles.secondaryButton} style={{ marginRight: '1rem' }}>
                Randomize Words
              </button>
            ) : (
              <button onClick={() => setIsDiscoveryMode(false)} className={styles.secondaryButton} style={{ marginRight: '1rem' }}>
                View Quote
              </button>
            )}
            <button onClick={fetchQuote} className={styles.refreshButton}>
              Next Insight
            </button>
          </div>
        )}
      </main>
    </div>
  );
}