"use client";

import { useState, useEffect } from "react";
import styles from "@/app/page.module.css";
import BackButton from "@/components/BackButton";

// Custom hook to detect client-side
function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

export default function RiddlesPage() {
  const isClient = useIsClient();
  const [riddle, setRiddle] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState("");
  const [lives, setLives] = useState(3);
  const [loading, setLoading] = useState(!isClient); // Loading while not client
  const [error, setError] = useState(null);

  const fetchRiddle = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://api.api-ninjas.com/v1/riddles", {
        headers: {
          'X-Api-Key': process.env.NEXT_PUBLIC_API_NINJA_KEY
        }
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        setRiddle(data[0]); // Get the first riddle from the response
        setUserAnswer("");
        setResult("");
        setLives(3);
      } else {
        setError("No riddles available");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching riddle:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = () => {
    if (!riddle) return;
    
    if (userAnswer.toLowerCase().trim() === riddle.answer.toLowerCase().trim()) {
      setResult("Correct! Well done!");
      setTimeout(() => {
        fetchRiddle(); // Move to next riddle after a delay
      }, 1500);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      
      if (newLives <= 0) {
        setResult(`Game Over! The answer was: ${riddle.answer}`);
        setTimeout(() => {
          fetchRiddle(); // Reset game with new riddle
        }, 2000);
      } else {
        setResult(`Incorrect! You have ${newLives} life(s) left.`);
      }
    }
  };

  useEffect(() => {
    if (isClient) {
      fetchRiddle(); // Fetch a riddle when the component mounts on client
    }
  }, [isClient]);

  return (
    <div className={styles.page}>
      <BackButton />
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Riddle Challenge</h1>
          <p>Test your wits with a random riddle. You have 3 lives!</p>
        </div>
        
        {!isClient ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading...</p>
          </div>
        ) : (
          <div className={styles.riddleContainer}>
            {loading && (
              <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Thinking of a challenging riddle...</p>
              </div>
            )}
            
            {error && (
              <div className={styles.errorMessage}>
                <p>Error: {error}</p>
                <button onClick={fetchRiddle} className={styles.refreshButton}>
                  Try Again
                </button>
              </div>
            )}
            
            {riddle && !loading && !error && (
              <div className={styles.riddleCard}>
                <div className={styles.riddleContent}>
                  <h2 className={styles.riddleQuestion}>{riddle.question}</h2>
                  
                  <div className={styles.livesContainer}>
                    <p>Lives: {lives}</p>
                    <div className={styles.livesDisplay}>
                      {[...Array(3)].map((_, index) => (
                        <span 
                          key={index} 
                          className={`${styles.lifeIndicator} ${index < lives ? styles.lifeActive : styles.lifeInactive}`}
                        >
                          {index < lives ? '❤️' : '💔'}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className={styles.answerSection}>
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Enter your answer..."
                      className={styles.answerInput}
                      disabled={lives <= 0}
                    />
                    
                    <button 
                      onClick={checkAnswer}
                      disabled={!userAnswer.trim() || lives <= 0}
                      className={styles.submitButton}
                    >
                      Submit Answer
                    </button>
                  </div>
                  
                  {result && (
                    <div className={`${styles.resultMessage} ${result.includes("Correct") ? styles.correctResult : result.includes("Game Over") ? styles.gameOverResult : styles.incorrectResult}`}>
                      <p>{result}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <button 
              onClick={fetchRiddle} 
              disabled={loading}
              className={styles.refreshButton}
            >
              {loading ? (
                <>
                  <span className={styles.buttonSpinner}></span> Loading...
                </>
              ) : "New Riddle"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}