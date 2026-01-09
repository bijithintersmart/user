import Image from "next/image";
import getImage from "@/utils/utils";
import styles from "@/app/page.module.css";

export default function ViewSubmittedForm({ fromMap, onBack }) {
  function generateRandomWithType(min = 1, max = 1000) {
    const number = Math.floor(Math.random() * (max - min + 1)) + min;

    return {
      number,
      type: number % 2 === 0 ? "Even" : "Odd",
    };
  }
  const { number, type } = generateRandomWithType();
  console.log(fromMap.color);
  return (
    <div className={styles.userDetailsContainer}>
      <div
        className={styles.userHeader}
        style={{
          backgroundColor: fromMap.color + "20",
          borderLeft: `5px solid ${fromMap.color}`,
        }}
      >
        <div className={styles.avatarContainer}>
          <Image
            src={getImage({
              name: fromMap.firstName,
              flip: fromMap.age % 2 === 0,
              size: 100,
              backgroundColor: [fromMap.color.replaceAll("#", "")],
            })}
            alt={`${fromMap.firstName} ${fromMap.LastName}`}
            width={86}
            height={86}
            className={styles.avatar}
          />
        </div>
        <div className={styles.userInfo}>
          <h1
            className={styles.userName}
          >{`${fromMap.firstName} ${fromMap.LastName}`}</h1>
          <div className={styles.userContact}>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>📧</span>
              <span className={styles.contactText}>{fromMap.email}</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>🎂</span>
              <span className={styles.contactText}>Age: {fromMap.age}</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>📱</span>
              <span className={styles.contactText}>{fromMap.phone}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.userDetailsGrid}>
        <div className={styles.detailCard}>
          <h3 className={styles.detailTitle}>
            <span className={styles.detailIcon}>👤</span> Personal Information
          </h3>
          <div className={styles.detailContent}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>First Name:</span>
              <span className={styles.infoValue}>{fromMap.firstName}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Last Name:</span>
              <span className={styles.infoValue}>{fromMap.LastName}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Age:</span>
              <span className={styles.infoValue}>{fromMap.age}</span>
            </div>
          </div>
        </div>

        <div className={styles.detailCard}>
          <h3 className={styles.detailTitle}>
            <span className={styles.detailIcon}>🎨</span> Preferences
          </h3>
          <div className={styles.detailContent}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Favorite Color:</span>
              <div
                className={styles.infoValue}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: fromMap.color,
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                  }}
                />
                <span>{fromMap.color}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.detailCard}>
          <h3 className={styles.detailTitle}>
            <span className={styles.detailIcon}>📍</span> Location Details
          </h3>
          <div className={styles.detailContent}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Location:</span>
              <span className={styles.infoValue}>{fromMap.location}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Pincode:</span>
              <span className={styles.infoValue}>{fromMap.pincode}</span>
            </div>
          </div>
        </div>

        <div className={styles.detailCard}>
          <h3 className={styles.detailTitle}>
            <span className={styles.detailIcon}>✉️</span> Contact Details
          </h3>
          <div className={styles.detailContent}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Email:</span>
              <span className={styles.infoValue}>{fromMap.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button
          className={styles.buttonclass}
          onClick={onBack}
          style={{ backgroundColor: "#6b7280" }}
        >
          Submit Another Form
        </button>
      </div>
    </div>
  );
}
