import { useState, useEffect } from "react";
import { SkeletonText } from "../components/Skeleton";
import { faqsApi } from "../services/api";

export default function FAQsPage({ setPage }) {
  const [faqs,       setFaqs]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [openId,     setOpenId]     = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    faqsApi.list()
      .then(r => setFaqs(Array.isArray(r) ? r : r.results || []))
      .catch(() => setFaqs([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...new Set(faqs.map(f => f.category).filter(Boolean))];
  const filtered = activeCategory === "All" ? faqs : faqs.filter(f => f.category === activeCategory);

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <section style={{ background:"var(--ink)", padding:"64px 0 56px" }}>
        <div className="container-sm" style={{ textAlign:"center" }}>
          <div className="eyebrow" style={{ marginBottom:16 }}>Got Questions?</div>
          <h1 className="d1" style={{ color:"#fff", marginBottom:16 }}>Frequently Asked<br />Questions</h1>
          <p style={{ color:"#aaa", fontSize:16, maxWidth:440, margin:"0 auto" }}>
            Everything you need to know about buying, selling, and importing vehicles with AutoMarket.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-sm">
          {/* Category filter */}
          {categories.length > 1 && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:40, justifyContent:"center" }}>
              {categories.map(cat => (
                <button key={cat} className={`chip ${activeCategory===cat?"active":""}`} onClick={() => setActiveCategory(cat)}>
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
              {[...Array(6)].map((_,i) => <SkeletonText key={i} lines={2} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"48px 0", color:"var(--ink-3)" }}>
              <i className="bi bi-question-circle" style={{ fontSize:48, display:"block", marginBottom:16, opacity:.3 }} />
              <p>No FAQs found.</p>
            </div>
          ) : (
            <div>
              {filtered.map(faq => (
                <div className="faq-item" key={faq.id}>
                  <button className="faq-btn" onClick={() => setOpenId(openId===faq.id ? null : faq.id)}>
                    <span>{faq.question}</span>
                    <i className={`bi ${openId===faq.id ? "bi-dash-circle" : "bi-plus-circle"}`} style={{ fontSize:18, flexShrink:0, color:"var(--ink-3)" }} />
                  </button>
                  {openId === faq.id && (
                    <div className="faq-body anim-in">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Contact CTA */}
          <div style={{ marginTop:60, background:"var(--tag-bg)", borderRadius:"var(--r-lg)", padding:"36px 32px", textAlign:"center" }}>
            <i className="bi bi-headset" style={{ fontSize:36, color:"var(--accent)", display:"block", marginBottom:12 }} />
            <h3 style={{ fontFamily:"var(--font-d)", fontSize:20, fontWeight:700, marginBottom:8 }}>Still have questions?</h3>
            <p style={{ color:"var(--ink-2)", fontSize:14, marginBottom:20, lineHeight:1.7 }}>
              Our team is happy to help. Reach out via WhatsApp, call, or send us a message.
            </p>
            <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
              <a href="https://wa.me/254716770077" target="_blank" rel="noreferrer" className="btn btn-gold">
                <i className="bi bi-whatsapp" /> WhatsApp
              </a>
              <button className="btn btn-dark" onClick={() => setPage("contact")}>
                <i className="bi bi-envelope" /> Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}