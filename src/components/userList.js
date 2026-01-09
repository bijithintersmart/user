"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "@/app/page.module.css";
import Link from "next/link";
import getImage from "@/utils/utils";
import generateRandomHexColor from "@/utils/RandomColor";

export default function UserList() {
  const [imageType, setImageType] = useState("Identicon");
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);

  const myBlurDataURL =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAwDdDFKbAAAAAElFTkSuQmCC";

  useEffect(() => {
    // Get image type from localStorage
    const savedImageType = localStorage.getItem("imageType") || "Identicon";
    setImageType(savedImageType);

    // Fetch user data
    async function fetchUsers() {
      try {
        const data = await fetch("https://randomuser.me/api/?results=50");
        const result = await data.json();
        setUserList(result.results);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  // Update image type when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedImageType = localStorage.getItem("imageType") || "Identicon";
      setImageType(savedImageType);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (loading) {
    return (
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
    );
  }

  return (
    <ul className={styles.userList}>
      {userList.map((post) => (
        <li key={post.login.uuid} className={styles.userListItem}>
          <Link
            href={`/${post.login.uuid}`}
            style={{ textDecoration: "none", width: "100%" }}
          >
            <div className={styles.userItem}>
              <Image
                src={getImage({
                  name: post.name.first,
                  flip: post.dob.age % 2 === 0,
                  size: 100,
                  backgroundColor: [
                    generateRandomHexColor().replaceAll("#", ""),
                  ],
                  imageType: imageType,
                })}
                alt={`${post.name.first} ${post.name.last}`}
                width={56}
                height={56}
                placeholder="blur"
                blurDataURL={myBlurDataURL}
                className={styles.avatar}
              />
              <div className={styles.userInfo}>
                <span className={styles.userName}>
                  {post.name.title}. {post.name.first} {post.name.last}
                </span>
                <span className={styles.userEmail}>{post.email}</span>
              </div>
              <Image
                src="/phone.svg"
                alt="Phone icon"
                width={20}
                height={20}
                className={styles.phoneIcon}
              />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
