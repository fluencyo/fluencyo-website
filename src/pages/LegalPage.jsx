import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "https://api.fluencyo.com/api";

export default function LegalPage({ slug: slugProp }) {
  const slug = slugProp;
  const [page, setPage] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setPage(null);
    setNotFound(false);
    fetch(`${API_URL}/pages/${slug}`)
      .then((r) => { if (r.status === 404) { setNotFound(true); return null; } return r.json(); })
      .then((data) => { if (data) setPage(data.page); })
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div style={styles.wrap}>
        <div style={styles.container}>
          <p>Page not found. <Link to="/">Back home</Link></p>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div style={styles.wrap}>
        <div style={styles.container}>Loading…</div>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.container}>
        <Link to="/" style={styles.back}>← Back to home</Link>
        <h1 style={styles.title}>{page.title}</h1>
        <div style={styles.updated}>Last updated {new Date(page.updated_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
        <div style={styles.content} dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight: "100vh", background: "#F7F5FF", padding: "60px 20px" },
  container: { maxWidth: 760, margin: "0 auto", background: "#fff", borderRadius: 20, padding: "48px 52px", boxShadow: "0 4px 24px rgba(74,34,224,.06)" },
  back: { display: "inline-block", marginBottom: 24, fontSize: 13, fontWeight: 700, color: "#4A22CC", textDecoration: "none" },
  title: { fontFamily: "var(--font-display, sans-serif)", fontSize: 30, fontWeight: 900, color: "#150636", marginBottom: 8 },
  updated: { fontSize: 12.5, color: "#9C93B5", marginBottom: 32, paddingBottom: 24, borderBottom: "1.5px solid #ECE7F8" },
  content: { fontSize: 14.5, lineHeight: 1.8, color: "#3E3A52" },
};