"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import styles from "./blogDetail.module.css";
import BackButton from "@/components/BackButton";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = params?.id;
    console.log("Blog ID from params:", id);
    if (id) {
      fetchBlog(String(id));
    }
  }, [params]);

  const fetchBlog = async (id) => {
    try {
      console.log("Fetching blog with ID:", id);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${API_BASE_URL}/api/blog/${id}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Failed to fetch blog: ${response.status}`);
      }

      const data = await response.json();
      console.log("Blog data received:", data);
      setBlog(data.data || data);
      setError(null);
    } catch (err) {
      console.error("Error fetching blog:", err);
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

  const renderContent = (content) => {
    if (!content) return null;

    const lines = content.split('\n');
    const elements = [];
    let inCodeBlock = false;
    let codeContent = [];
    let codeLanguage = '';
    let inTable = false;
    let tableRows = [];
    let paragraphBuffer = [];

    const flushParagraph = () => {
      if (paragraphBuffer.length > 0) {
        const text = paragraphBuffer.join(' ').trim();
        if (text) {
          elements.push(
            <p key={`p-${elements.length}`} className={styles.paragraph}>
              {renderInlineMarkdown(text)}
            </p>
          );
        }
        paragraphBuffer = [];
      }
    };

    const renderInlineMarkdown = (text) => {
      // Process inline code first
      const parts = text.split(/(`[^`]+`)/g);
      return parts.map((part, i) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={i} className={styles.inlineCode}>{part.slice(1, -1)}</code>;
        }
        // Process bold
        const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
        return boldParts.map((bp, j) => {
          if (bp.startsWith('**') && bp.endsWith('**')) {
            return <strong key={`${i}-${j}`}>{bp.slice(2, -2)}</strong>;
          }
          // Process italic
          const italicParts = bp.split(/(\*[^*]+\*)/g);
          return italicParts.map((ip, k) => {
            if (ip.startsWith('*') && ip.endsWith('*')) {
              return <em key={`${i}-${j}-${k}`}>{ip.slice(1, -1)}</em>;
            }
            return ip;
          });
        });
      });
    };

    const parseTableRow = (line) => {
      return line.split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim());
    };

    const isTableSeparator = (line) => {
      return /^\|?\s*[-:]+[-|\s:]+\s*\|?$/.test(line);
    };

    lines.forEach((line, index) => {
      // Code blocks
      if (line.startsWith('```')) {
        flushParagraph();
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.slice(3).trim();
          codeContent = [];
        } else {
          inCodeBlock = false;
          elements.push(
            <pre key={`code-${index}`} className={styles.codeBlock}>
              <code className={styles[codeLanguage] || ''}>{codeContent.join('\n')}</code>
            </pre>
          );
        }
        return;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return;
      }

      // Table handling
      if (line.trim().startsWith('|')) {
        flushParagraph();
        if (!inTable) {
          inTable = true;
          tableRows = [];
        }
        
        if (!isTableSeparator(line)) {
          tableRows.push(parseTableRow(line));
        }
        
        // Check if table ends (next line doesn't start with |)
        const nextLine = lines[index + 1];
        if (!nextLine || !nextLine.trim().startsWith('|')) {
          inTable = false;
          if (tableRows.length > 0) {
            const [headers, ...dataRows] = tableRows;
            elements.push(
              <div key={`table-${index}`} className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      {headers.map((header, i) => (
                        <th key={i}>{renderInlineMarkdown(header)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td key={j}>{renderInlineMarkdown(cell)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          tableRows = [];
        }
        return;
      }

      // Headers
      if (line.startsWith('### ')) {
        flushParagraph();
        elements.push(
          <h3 key={`h3-${index}`} className={styles.heading3}>{line.replace('### ', '').trim()}</h3>
        );
      } else if (line.startsWith('## ')) {
        flushParagraph();
        elements.push(
          <h2 key={`h2-${index}`} className={styles.heading2}>{line.replace('## ', '').trim()}</h2>
        );
      } else if (line.startsWith('# ')) {
        flushParagraph();
        elements.push(
          <h1 key={`h1-${index}`} className={styles.heading1}>{line.replace('# ', '').trim()}</h1>
        );
      }
      // Horizontal rule
      else if (line.startsWith('---')) {
        flushParagraph();
        elements.push(<hr key={`hr-${index}`} className={styles.divider} />);
      }
      // Bold list items
      else if (line.startsWith('* **')) {
        flushParagraph();
        const match = line.match(/\* \*\*(.+?)\*\*:?\s*(.*)/);
        if (match) {
          elements.push(
            <p key={`li-${index}`} className={styles.listItem}>
              <span className={styles.listBullet}>•</span>
              <span><strong>{match[1].trim()}</strong>{match[2] && `: ${renderInlineMarkdown(match[2].trim())}`}</span>
            </p>
          );
        }
      }
      // Regular list items
      else if (line.startsWith('* ') || line.startsWith('- ')) {
        flushParagraph();
        const text = line.replace(/^[\*\-]\s/, '').trim();
        if (text) {
          elements.push(
            <p key={`li-${index}`} className={styles.listItem}>
              <span className={styles.listBullet}>•</span>
              <span>{renderInlineMarkdown(text)}</span>
            </p>
          );
        }
      }
      // Empty lines - flush paragraph but don't add br
      else if (line.trim() === '') {
        flushParagraph();
      }
      // Regular text - add to paragraph buffer
      else {
        paragraphBuffer.push(line.trim());
      }
    });

    // Flush any remaining paragraph
    flushParagraph();

    return elements;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.backgroundDecoration}></div>
        <BackButton />
        <motion.div
          className={styles.loadingContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className={styles.loadingSpinner}></div>
          <p>Loading article...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className={styles.container}>
        <div className={styles.backgroundDecoration}></div>
        <BackButton />
        <motion.div
          className={styles.errorContainer}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className={styles.errorText}>{error || "Blog post not found"}</p>
          <button onClick={() => router.push("/blog")} className={styles.backButton}>
            Back to Blog
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.backgroundDecoration}></div>
      <BackButton />

      <motion.main
        className={styles.content}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <article className={styles.article}>
          {blog.coverImage && (
            <motion.div
              className={styles.heroImageWrapper}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
            >
              <img
                src={getImageUrl(blog.coverImage)}
                alt={blog.coverImage?.alternativeText || blog.title || "Blog header"}
                className={styles.heroImage}
              />
              {blog.coverImage?.caption && (
                <p className={styles.imageCaption}>{blog.coverImage.caption}</p>
              )}
            </motion.div>
          )}

          <div className={styles.articleContent}>
            <motion.header
              className={styles.articleHeader}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {blog.isFeatured && (
                <span className={styles.featuredBadge}>Featured Article</span>
              )}
              <h1 className={styles.articleTitle}>{blog.title}</h1>
              <div className={styles.articleMeta}>
                {blog.author && (
                  <span className={styles.author}>
                    <span className={styles.metaIcon}>👤</span> {blog.author}
                  </span>
                )}
                <span className={styles.publishDate}>
                  <span className={styles.metaIcon}>📅</span>{" "}
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </motion.header>

            {blog.content && (
              <motion.div
                className={styles.articleBody}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {renderContent(blog.content)}
              </motion.div>
            )}
          </div>
        </article>
      </motion.main>
    </div>
  );
}
