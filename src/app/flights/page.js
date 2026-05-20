"use client";
import { useState, useCallback } from "react";
import styles from "./flights.module.css";
import BackButton from "@/components/BackButton";

export default function FlightTracking() {
  const [query, setQuery] = useState("");
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const searchFlights = useCallback(async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/flights?query=${encodeURIComponent(query.toUpperCase())}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch flights");
      }

      const data = await res.json();
      setFlights(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const formatTime = (timeStr) => {
    if (!timeStr) return "N/A";
    try {
      const date = new Date(timeStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return timeStr;
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "active": return styles.statusActive;
      case "scheduled": return styles.statusScheduled;
      case "landed": return styles.statusLanded;
      default: return "";
    }
  };

  return (
    <div className={styles.page}>
      <BackButton />
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </div>
          <h1 className={styles.title}>Flight Radar</h1>
          <p className={styles.subtitle}>Real-time flight status and airplane routing</p>
        </header>

        <section className={styles.searchSection}>
          <form onSubmit={searchFlights} className={styles.searchBox}>
            <input
              type="text"
              placeholder="Enter Flight Number (e.g., AA100, LH400)..."
              className={styles.searchInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className={styles.searchButton} disabled={loading}>
              {loading ? "Tracking..." : "Track Flight"}
            </button>
          </form>
        </section>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.resultsList}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Contacting control tower...</p>
            </div>
          ) : flights.length > 0 ? (
            flights.map((flight, idx) => (
              <div key={idx} className={styles.flightCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.flightIdent}>
                    <span className={styles.airlineName}>{flight.airline?.name || "Unknown Airline"}</span>
                    <span className={styles.flightNumber}>{flight.flight?.iata || flight.flight?.icao}</span>
                  </div>
                  <span className={`${styles.statusBadge} ${getStatusClass(flight.flight_status)}`}>
                    {flight.flight_status || "Unknown"}
                  </span>
                </div>

                <div className={styles.routeContainer}>
                  <div className={styles.airportBlock}>
                    <div className={styles.iataCode}>{flight.departure?.iata || "???"}</div>
                    <div className={styles.airportName}>{flight.departure?.airport || "Departure Airport"}</div>
                  </div>

                  <div className={styles.routeVisual}>
                    <svg className={styles.planeIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5s-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-1.1-.2-2.1.5-2.4 1.5-.3 1 .1 2.1 1 2.6l7.9 4.3-3.1 3.1-2.9-.5c-.5-.1-1 .1-1.4.5s-.6 1-.5 1.5l.8 3.1c.1.5.5.9 1 .9s.9-.3 1.1-.7l1.7-3.4 3.1 3.1c.5.9 1.6 1.3 2.6 1s1.7-1.3 1.5-2.4z" />
                    </svg>
                    <div className={styles.line}></div>
                  </div>

                  <div className={styles.airportBlock}>
                    <div className={styles.iataCode}>{flight.arrival?.iata || "???"}</div>
                    <div className={styles.airportName}>{flight.arrival?.airport || "Arrival Airport"}</div>
                  </div>
                </div>

                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Departure Details</span>
                    <div className={styles.timeInfo}>
                      <span className={styles.timeMain}>{formatTime(flight.departure?.estimated || flight.departure?.scheduled)}</span>
                      <span className={styles.timeSub}>Terminal {flight.departure?.terminal || "-"}, Gate {flight.departure?.gate || "-"}</span>
                    </div>
                  </div>

                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Arrival Details</span>
                    <div className={styles.timeInfo}>
                      <span className={styles.timeMain}>{formatTime(flight.arrival?.estimated || flight.arrival?.scheduled)}</span>
                      <span className={styles.timeSub}>Terminal {flight.arrival?.terminal || "-"}, Gate {flight.arrival?.gate || "-"}</span>
                    </div>
                  </div>

                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Aircraft Information</span>
                    <div className={styles.detailValue}>
                      {flight.aircraft?.registration ? (
                        <>Reg: {flight.aircraft.registration} <br/> <small style={{color: "#64748b"}}>{flight.aircraft.iata || flight.aircraft.icao}</small></>
                      ) : "N/A"}
                    </div>
                  </div>

                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Live Progress</span>
                    <div className={styles.detailValue}>
                      {flight.live ? (
                        <>Alt: {Math.round(flight.live.altitude)}m <br/> Spd: {Math.round(flight.live.speed_horizontal)}km/h</>
                      ) : "Live data unavailable"}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : searched ? (
            <div className={styles.noResults}>No active flights found for this flight number.</div>
          ) : (
            <div className={styles.noResults}>Search for a flight number to see live details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
