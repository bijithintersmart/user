"use client";

import { useState, useEffect } from "react";
import styles from "@/app/page.module.css";

export default function QuotesPage() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuote = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://api.api-ninjas.com/v2/quotes?categories=success,wisdom", {
        headers: {
          'X-Api-Key': process.env.NEXT_PUBLIC_API_NINJA_KEY
        }
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        setQuote(data[0]); // Get the first quote from the response
      } else {
        setError("No quotes available");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching quote:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote(); // Fetch a quote when the component mounts
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Inspirational Quotes</h1>
          <p>Get inspired with a random quote on success and wisdom.</p>
        </div>
        
        <div className={styles.quoteContainer}>
          {loading && (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>Searching for inspiration...</p>
            </div>
          )}
          
          {error && (
            <div className={styles.errorMessage}>
              <p>Error: {error}</p>
              <button onClick={fetchQuote} className={styles.refreshButton}>
                Try Again
              </button>
            </div>
          )}
          
          {quote && !loading && !error && (
            <div className={styles.quoteCard}>
              <div className={styles.quoteContent}>
                <span className={styles.quoteMark}>“</span>
                <blockquote className={styles.quoteText}>
                  {quote.quote}
                </blockquote>
                <span className={styles.quoteMark}>”</span>
              </div>
              <div className={styles.quoteFooter}>
                <p className={styles.quoteAuthor}>— {quote.author}</p>
                <p className={styles.quoteCategory}>Category: {quote.category}</p>
              </div>
            </div>
          )}
          
          <button 
            onClick={fetchQuote} 
            disabled={loading}
            className={styles.refreshButton}
          >
            {loading ? (
              <>
                <span className={styles.buttonSpinner}></span> Loading...
              </>
            ) : "New Quote"}
          </button>
        </div>
      </main>
    </div>
  );
}