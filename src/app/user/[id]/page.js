"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "@/app/page.module.css";
import generateRandomHexColor from "@/utils/RandomColor";
import getImage from "@/utils/utils";

export default function UserDetailsPage({ params }) {
  const { id } = React.use(params);
  const [user, setUser] = useState(null);
  const [imageType, setImageType] = useState("Identicon");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedImageType = localStorage.getItem("imageType") || "Identicon";
    setImageType(savedImageType);
    
    async function fetchUser() {
      try {
        console.log('API Key in detail page:', process.env.NEXT_PUBLIC_API_NINJA_KEY); // Debugging
        // Fetch a single user from the API
        const response = await fetch('https://api.api-ninjas.com/v2/randomuser?count=1', {
          headers: {
            'X-Api-Key': process.env.NEXT_PUBLIC_API_NINJA_KEY
          }
        });
        console.log('Response status in detail page:', response.status); // Debugging
        const data = await response.json();
        console.log('API Response in detail page:', data); // Debugging
        
        // Get the first user from the response
        let userData = null;
        if (Array.isArray(data) && data.length > 0) {
          userData = data[0];
        }
        
        // If no user found, we'll still show the ID in the URL as a fallback
        if (!userData) {
          // Create a mock user object with just the ID
          userData = { id: id };
        }
        
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [id]);

  useEffect(() => {
    const handleStorageChange = () => {
      const savedImageType = localStorage.getItem("imageType") || "Identicon";
      setImageType(savedImageType);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (loading) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px',
            padding: '40px 0'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: '4px solid rgba(59, 130, 246, 0.2)',
              borderTop: '4px solid #3b82f6',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.intro}>
            <h2>User not found</h2>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.userDetailsContainer}>
          <div className={styles.userHeader}>
            <div className={styles.avatarContainer}>
              <Image
                src={getImage({
                  name: user.name || user.full_name || user.first_name || "Unknown",
                  flip: (user.age || 0) % 2 === 0,
                  size: 100,
                  backgroundColor: [
                    generateRandomHexColor().replaceAll("#", ""),
                  ],
                  imageType: imageType,
                })}
                alt={`${user.name || user.full_name || user.first_name || "Unknown"} ${user.last_name || ""}`}
                width={180}
                height={180}
                className={styles.avatar}
              />
            </div>
            <div className={styles.userInfo}>
              <h1 className={styles.userName}>
                {(user.prefix || "Mr")}. {(user.name || user.full_name || user.first_name || "Unknown")} {(user.last_name || "User")}
              </h1>
              <div className={styles.userContact}>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>📧</span>
                  <span className={styles.contactText}>{user.email || "N/A"}</span>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>📞</span>
                  <span className={styles.contactText}>{user.phone || "N/A"}</span>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>📱</span>
                  <span className={styles.contactText}>{user.cell || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.userDetailsGrid}>
            <div className={styles.detailCard}>
              <h3 className={styles.detailTitle}>
                <span >📍</span> Location
              </h3>
              <div className={styles.detailContent}>
                <p>{user.street_address || "N/A"}</p>
                <p>{user.city || "N/A"}, {user.state || "N/A"} {user.postal_code || "N/A"}</p>
                <p>{user.country || "N/A"}</p>
              </div>
            </div>

            <div className={styles.detailCard}>
              <h3 className={styles.detailTitle}>
                <span >👤</span> Personal Info
              </h3>
              <div className={styles.detailContent}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Gender:</span>
                  <span className={styles.infoValue}>{user.gender || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Age:</span>
                  <span className={styles.infoValue}>{user.age || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Birth Date:</span>
                  <span className={styles.infoValue}>
                    {user.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Prefix/Suffix:</span>
                  <span className={styles.infoValue}>{user.prefix || "N/A"} / {user.suffix || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className={styles.detailCard}>
              <h3 className={styles.detailTitle}>
                <span >💼</span> Professional Details
              </h3>
              <div className={styles.detailContent}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Job:</span>
                  <span className={styles.infoValue}>{user.job || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Company:</span>
                  <span className={styles.infoValue}>{user.company || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Company Email:</span>
                  <span className={styles.infoValue}>{user.company_email || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className={styles.detailCard}>
              <h3 className={styles.detailTitle}>
                <span >💳</span> Financial Details
              </h3>
              <div className={styles.detailContent}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Credit Card:</span>
                  <span className={styles.infoValue}>{user.credit_card || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Credit Card Provider:</span>
                  <span className={styles.infoValue}>{user.credit_card_provider || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>IBAN:</span>
                  <span className={styles.infoValue}>{user.iban || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className={styles.detailCard}>
              <h3 className={styles.detailTitle}>
                <span >🌐</span> Digital Identity
              </h3>
              <div className={styles.detailContent}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Username:</span>
                  <span className={styles.infoValue}>{user.username || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>UUID:</span>
                  <span className={styles.infoValue}>{user.uuid || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>IPv4:</span>
                  <span className={styles.infoValue}>{user.ipv4 || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>IPv6:</span>
                  <span className={styles.infoValue}>{user.ipv6 || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>MAC Address:</span>
                  <span className={styles.infoValue}>{user.mac_address || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>User Agent:</span>
                  <span className={styles.infoValue}>{user.user_agent || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className={styles.detailCard}>
              <h3 className={styles.detailTitle}>
                <span >🌍</span> Geographic Details
              </h3>
              <div className={styles.detailContent}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Latitude:</span>
                  <span className={styles.infoValue}>{user.latitude || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Longitude:</span>
                  <span className={styles.infoValue}>{user.longitude || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Timezone:</span>
                  <span className={styles.infoValue}>{user.timezone || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>URL:</span>
                  <span className={styles.infoValue}>{user.url || "N/A"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Domain:</span>
                  <span className={styles.infoValue}>{user.domain || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
