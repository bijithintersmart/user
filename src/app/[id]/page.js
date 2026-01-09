import Image from "next/image";
import styles from "@/app/page.module.css";
import generateRandomHexColor from "@/utils/RandomColor";
import getImage from "@/utils/utils";

export default async function UserDetailsPage({ params }) {
  const { id } = await params;

  const response = await fetch(`https://randomuser.me/api/?uuid=${id}`);
  const data = await response.json();

  const user = data.results && data.results.length > 0 ? data.results[0] : null;

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
                  name: user.name.first,
                  flip: user.dob.age % 2 === 0,
                  size: 100,
                  backgroundColor: [
                    generateRandomHexColor().replaceAll("#", ""),
                  ],
                })}
                alt={`${user.name.first} ${user.name.last}`}
                width={180}
                height={180}
                className={styles.avatar}
              />
            </div>
            <div className={styles.userInfo}>
              <h1 className={styles.userName}>
                {user.name.title}. {user.name.first} {user.name.last}
              </h1>
              <div className={styles.userContact}>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>📧</span>
                  <span className={styles.contactText}>{user.email}</span>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>📞</span>
                  <span className={styles.contactText}>{user.phone}</span>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>📱</span>
                  <span className={styles.contactText}>{user.cell}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.userDetailsGrid}>
            <div className={styles.detailCard}>
              <h3 className={styles.detailTitle}>
                <span className={styles.detailIcon}>📍</span> Location
              </h3>
              <div className={styles.detailContent}>
                <p>
                  {user.location.street.number} {user.location.street.name}
                </p>
                <p>
                  {user.location.city}, {user.location.state}{" "}
                  {user.location.postcode}
                </p>
                <p>{user.location.country}</p>
              </div>
            </div>

            <div className={styles.detailCard}>
              <h3 className={styles.detailTitle}>
                <span className={styles.detailIcon}>👤</span> Personal Info
              </h3>
              <div className={styles.detailContent}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Gender:</span>
                  <span className={styles.infoValue}>{user.gender}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Age:</span>
                  <span className={styles.infoValue}>{user.dob.age}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Birth Date:</span>
                  <span className={styles.infoValue}>
                    {new Date(user.dob.date).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Registered:</span>
                  <span className={styles.infoValue}>
                    {new Date(user.registered.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.detailCard}>
              <h3 className={styles.detailTitle}>
                <span className={styles.detailIcon}>💼</span> Additional Details
              </h3>
              <div className={styles.detailContent}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Nationality:</span>
                  <span className={styles.infoValue}>{user.nat}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Username:</span>
                  <span className={styles.infoValue}>
                    {user.login.username}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Timezone:</span>
                  <span className={styles.infoValue}>
                    {user.location.timezone.description}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
