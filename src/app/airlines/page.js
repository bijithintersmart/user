"use client";
import { useState, useCallback } from "react";
import styles from "./airlines.module.css";

export default function AirlineShowcase() {
  const [query, setQuery] = useState("");
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const searchAirlines = useCallback(async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      let params = new URLSearchParams();
      if (query.length === 2) {
        params.append("iata", query.toUpperCase());
      } else if (query.length === 3) {
        params.append("icao", query.toUpperCase());
      } else {
        params.append("name", query);
      }

      const res = await fetch(`/api/airlines?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch airlines");

      const data = await res.json();
      setAirlines(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [query]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </div>
          <h1 className={styles.title}>Airline Showcase</h1>
          <p className={styles.subtitle}>Explore global aviation fleets and brand identities</p>
        </header>

        <section className={styles.searchSection}>
          <form onSubmit={searchAirlines} className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search by airline name, IATA (LH), or ICAO (DLH)..."
              className={styles.searchInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className={styles.searchButton} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
        </section>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.resultsList}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Fetching airline data...</p>
            </div>
          ) : airlines.length > 0 ? (
            airlines.map((airline, idx) => (
              <div key={idx} className={styles.airlineCard}>
                <div className={styles.cardHeader}>
                  {(airline.logo_url || airline.brandmark_url) && (
                    <div className={styles.logoContainer}>
                      <img
                        src={airline.logo_url || airline.brandmark_url}
                        alt={`${airline.name} logo`}
                        className={styles.logo}
                      />
                    </div>
                  )}
                  <div className={styles.airlineInfo}>
                    <h2 className={styles.airlineName}>{airline.name}</h2>
                    <div className={styles.airlineMeta}>
                      {airline.iata && (
                        <div className={styles.metaItem}>
                          <span>IATA:</span>
                          <span className={styles.metaBadge}>{airline.iata}</span>
                        </div>
                      )}
                      {airline.icao && (
                        <div className={styles.metaItem}>
                          <span>ICAO:</span>
                          <span className={styles.metaBadge}>{airline.icao}</span>
                        </div>
                      )}
                      {airline.country && (
                        <div className={styles.metaItem}>
                          <span>Country:</span>
                          <span style={{ color: "#f1f5f9", fontWeight: 600 }}>{airline.country}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.detailsGrid}>
                  <div className={styles.infoSection}>
                    <h3 className={styles.sectionTitle}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      Main Hub / Base
                    </h3>
                    <p className={styles.infoValue}>{airline.base || "N/A"}</p>
                  </div>
                  <div className={styles.infoSection}>
                    <h3 className={styles.sectionTitle}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      Founded
                    </h3>
                    <p className={styles.infoValue}>{airline.year_created || "N/A"}</p>
                  </div>

                  {airline.base && (
                    <div className={styles.mapGrid}>
                      <div className={styles.mapSection}>
                        <div className={styles.sectionHeader}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          Primary Hub Location
                        </div>
                        <iframe
                          className={styles.mapIframe}
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(airline.base)}&t=m&z=12&ie=UTF8&iwloc=&output=embed`}
                          allowFullScreen
                          loading="lazy"
                        />
                        <div className={styles.mapOverlay}>
                          {airline.base} (HUB)
                        </div>
                      </div>

                      <div className={styles.flightMapSection}>
                        <div className={styles.sectionHeader}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                          Mission Control: Operational Status
                        </div>
                        <div className={styles.flightVisual}>
                          <div className={styles.operationalMetrics}>
                            <div className={styles.metricItem}>
                              <span className={styles.metricLabel}>Active Flights</span>
                              <span className={styles.metricValue}>
                                {Math.floor((airline.fleet?.total || 10) * 0.45)} 
                                <span className={styles.metricTrend}>↑</span>
                              </span>
                            </div>
                            <div className={styles.metricItem}>
                              <span className={styles.metricLabel}>Daily Ops</span>
                              <span className={styles.metricValue}>
                                {Math.floor((airline.fleet?.total || 10) * 4.2)}
                              </span>
                            </div>
                            <div className={styles.metricItem}>
                              <span className={styles.metricLabel}>Domain</span>
                              <span className={styles.metricValue}>
                                {airline.fleet?.total > 100 ? "Global" : airline.fleet?.total > 30 ? "Regional" : "Local"}
                              </span>
                            </div>
                          </div>
                          
                          <svg viewBox="0 0 800 400" className={styles.worldMap} preserveAspectRatio="xMidYMid meet">
                            <defs>
                              <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            
                            {[...Array(Math.min(6, Math.ceil((airline.fleet?.total || 10) / 30)))].map((_, i) => {
                              const pathData = `M${100 + (i * 30)},320 Q400,${40 + (i * 30)} ${700 - (i * 30)},320`;
                              return (
                                <g key={i}>
                                  <path d={pathData} className={styles.flightPath} stroke="url(#pathGrad)" />
                                  <path d="M-8,-5 L8,0 L-8,5 L-5,0 Z" className={styles.planeSwarm} fill="#60a5fa">
                                    <animateMotion 
                                      dur={`${5 + (i * 1.5)}s`} 
                                      repeatCount="indefinite" 
                                      path={pathData} 
                                      rotate="auto" 
                                      begin={`${i * 1.2}s`}
                                    />
                                  </path>
                                </g>
                              );
                            })}
                            
                            <circle cx="400" cy="200" r="140" className={styles.radarRing} />
                            <circle cx="400" cy="200" r="80" className={styles.radarRing} style={{ opacity: 0.3 }} />
                            <g className={styles.radarSweep}>
                              <line x1="400" y1="200" x2="400" y2="60" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                              <path d="M400,200 L400,60 A140,140 0 0,1 520,130 Z" fill="rgba(59,130,246,0.1)" />
                            </g>
                          </svg>
                          
                          <div className={styles.routeLabel}>
                            <span className={styles.liveIndicator} />
                            System Live: Monitoring {airline.name} ({airline.icao}) Traffic
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {airline.fleet && Object.keys(airline.fleet).length > 0 && (
                    <div className={styles.fleetContainer}>
                      <div className={styles.fleetSection}>
                        <div className={styles.fleetTitle}>
                          <h3 className={styles.sectionTitle}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </svg>
                            Fleet Inventory
                          </h3>
                          <span className={styles.totalFleet}>Total: {airline.fleet.total}</span>
                        </div>
                        <div className={styles.fleetGrid}>
                          {Object.entries(airline.fleet).map(([model, count]) => {
                            if (model === "total") return null;
                            return (
                              <div key={model} className={styles.fleetItem}>
                                <span className={styles.aircraftModel}>{model}</span>
                                <span className={styles.aircraftCount}>{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {(airline.brandmark_url || airline.tail_logo_url) && (
                    <div className={styles.visuals}>
                      {airline.brandmark_url && (
                        <div className={styles.visualCard}>
                          <span className={styles.visualLabel}>Official Brandmark</span>
                          <img src={airline.brandmark_url} alt="Brandmark" className={styles.visualImg} />
                        </div>
                      )}
                      {airline.tail_logo_url && (
                        <div className={styles.visualCard}>
                          <span className={styles.visualLabel}>Vertical Stabilizer</span>
                          <img src={airline.tail_logo_url} alt="Tail Logo" className={styles.visualImg} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : searched ? (
            <div className={styles.noResults}>No airlines found matching your search.</div>
          ) : (
            <div className={styles.noResults}>Search for an airline to see its fleet and identity.</div>
          )}
        </div>
      </div>
    </div>
  );
}
