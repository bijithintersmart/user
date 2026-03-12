"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./blog.module.css";
import BackButton from "@/components/BackButton";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/blog`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch blogs: ${response.status}`);
      }

      const data = await response.json();
      setBlogs(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.url && image.url.startsWith('/')) {
      return `${API_BASE_URL}${image.url}`;
    }
    return image.url || image.formats?.medium?.url 
      ? `${API_BASE_URL}${image.formats.medium.url || image.url}`
      : null;
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    const plainText = text.replace(/[#*_~`]/g, '').split('\n').filter(line => line.trim()).slice(0, 3).join(' ');
    return plainText.length > maxLength ? plainText.substring(0, maxLength) + "..." : plainText;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundDecoration}></div>
      <BackButton />

      <main className={styles.content}>
        <header className={styles.header}>
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Latest Insights
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Discover stories, tips, and ideas from our team
          </motion.p>
        </header>

        {loading && (
          <motion.div
            className={styles.loadingContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className={styles.loadingSpinner}></div>
            <p>Fetching articles...</p>
          </motion.div>
        )}

        {error && !loading && (
          <motion.div
            className={styles.errorContainer}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className={styles.errorText}>{error}</p>
            <button onClick={fetchBlogs} className={styles.retryButton}>
              Try Again
            </button>
          </motion.div>
        )}

        {!loading && !error && blogs.length === 0 && (
          <motion.div
            className={styles.emptyState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>No blog posts available yet.</p>
          </motion.div>
        )}

        {!loading && !error && blogs.length > 0 && (
          <motion.div
            className={styles.blogGrid}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {blogs.map((blog, index) => {
              const imageUrl = getImageUrl(blog.coverImage);
              const excerpt = truncateText(blog.content, 120);
              
              return (
                <motion.div
                  key={blog.id || index}
                  className={styles.blogCard}
                  variants={itemVariants}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    transition: { duration: 0.3 },
                  }}
                >
                  <Link href={`/blog/${blog.id}`} className={styles.cardLink}>
                    {imageUrl && (
                      <div className={styles.cardImageWrapper}>
                        <img
                          src={imageUrl}
                          alt={blog.coverImage?.alternativeText || blog.title || "Blog image"}
                          className={styles.cardImage}
                        />
                      </div>
                    )}
                    <div className={styles.cardContent}>
                      <h3 className={styles.cardTitle}>{blog.title}</h3>
                      <p className={styles.cardExcerpt}>{excerpt}</p>
                      <div className={styles.cardFooter}>
                        {blog.isFeatured && (
                          <span className={styles.featuredBadge}>Featured</span>
                        )}
                        <span className={styles.cardDate}>
                          {new Date(blog.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </main>
    </div>
  );
}
