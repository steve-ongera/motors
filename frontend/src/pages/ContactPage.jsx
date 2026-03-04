import { useState } from "react";
import Toast from "../components/Toast";
import { formsApi } from "../services/api";

export default function ContactPage() {
  const [toast,   setToast]   = useState(null);
  const [sending, setSending] = useState(false);
  const [done,    setDone]    = useState(false);
  const [form,    setForm]    = useState({ full_name:"", email:"", phone:"", subject:"", message:"" });
  const [errors,  setErrors]  = useState({});

  const upd = (k, v) => { setForm(f => ({ ...f, [k]:v })); setErrors(e => ({ ...e, [k]:undefined })); };

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = "Required";
    if (!form.email.trim())     e.email     = "Required";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.subject.trim())   e.subject   = "Required";
    if (!form.message.trim())   e.message   = "Required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSending(true);
    try {
      await formsApi.contact(form);
      setDone(true);
      setToast({ message:"Message sent! We'll respond within 24 hours.", type:"success" });
    } catch {
      setToast({ message:"Failed to send. Please try WhatsApp.", type:"error" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="page-wrapper">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Hero */}
      <section style={{ background:"var(--ink)", padding:"64px 0 56px" }}>
        <div className="container-sm" style={{ textAlign:"center" }}>
          <div className="eyebrow" style={{ marginBottom:16 }}>Get In Touch</div>
          <h1 className="d1" style={{ color:"#fff", marginBottom:16 }}>Contact Us</h1>
          <p style={{ color:"#aaa", fontSize:16, maxWidth:440, margin:"0 auto" }}>
            Have a question, a vehicle to sell, or just want to say hello? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 400px", gap:56 }}>

            {/* Form */}
            <div>
              {done ? (
                <div style={{ textAlign:"center", padding:"60px 20px" }}>
                  <div style={{ width:80, height:80, borderRadius:"50%", background:"#d8f5ea", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}>
                    <i className="bi bi-check-lg" style={{ fontSize:36, color:"var(--green)" }} />
                  </div>
                  <h2 style={{ fontFamily:"var(--font-d)", fontSize:28, fontWeight:800, marginBottom:12 }}>Message Sent!</h2>
                  <p style={{ color:"var(--ink-2)", marginBottom:28 }}>We'll get back to you within 24 hours.</p>
                  <button className="btn btn-outline" onClick={() => { setDone(false); setForm({ full_name:"",email:"",phone:"",subject:"",message:"" }); }}>
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
                  <h2 className="d3" style={{ marginBottom:4 }}>Send a Message</h2>
                  <p style={{ color:"var(--ink-3)", fontSize:14, marginBottom:8 }}>We typically respond within a few hours during business days.</p>

                  <div className="grid-2" style={{ gap:14 }}>
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input className="form-control" placeholder="Your name" value={form.full_name} onChange={e => upd("full_name",e.target.value)} />
                      {errors.full_name && <span className="form-error">{errors.full_name}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input className="form-control" placeholder="07XX XXX XXX" value={form.phone} onChange={e => upd("phone",e.target.value)} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input className="form-control" type="email" placeholder="you@email.com" value={form.email} onChange={e => upd("email",e.target.value)} />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject *</label>
                    <input className="form-control" placeholder="How can we help?" value={form.subject} onChange={e => upd("subject",e.target.value)} />
                    {errors.subject && <span className="form-error">{errors.subject}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea className="form-control" placeholder="Write your message here…" value={form.message} onChange={e => upd("message",e.target.value)} style={{ minHeight:140 }} />
                    {errors.message && <span className="form-error">{errors.message}</span>}
                  </div>

                  <button className="btn btn-dark btn-lg" type="submit" disabled={sending} style={{ justifyContent:"center" }}>
                    {sending ? <><i className="bi bi-arrow-repeat" style={{ animation:"spin 1s linear infinite" }} /> Sending…</> : <><i className="bi bi-send" /> Send Message</>}
                  </button>
                </form>
              )}
            </div>

            {/* Info sidebar */}
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <div className="card" style={{ padding:28 }}>
                <h3 style={{ fontFamily:"var(--font-d)", fontWeight:700, fontSize:17, marginBottom:20 }}>Find Us</h3>
                {[
                  ["bi-geo-alt-fill","Address","Diamond Plaza II, 4th Avenue Parklands, 3rd Floor (Parking Section), Nairobi, Kenya"],
                  ["bi-telephone-fill","Phone","0716 770 077"],
                  ["bi-envelope-fill","Email","info@automarket.co.ke"],
                  ["bi-clock-fill","Hours","Mon – Sat: 8:00 AM – 6:00 PM\nSunday: 10:00 AM – 4:00 PM"],
                ].map(([icon,label,value]) => (
                  <div key={label} style={{ display:"flex", gap:14, marginBottom:18 }}>
                    <div style={{ width:38, height:38, background:"var(--tag-bg)", borderRadius:"var(--r-sm)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <i className={`bi ${icon}`} style={{ color:"var(--accent)", fontSize:16 }} />
                    </div>
                    <div>
                      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:"var(--ink-3)", marginBottom:3 }}>{label}</div>
                      <div style={{ fontSize:13.5, color:"var(--ink-2)", lineHeight:1.6, whiteSpace:"pre-line" }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick contact */}
              <div className="card" style={{ padding:24 }}>
                <h4 style={{ fontFamily:"var(--font-d)", fontWeight:700, marginBottom:14 }}>Quick Contact</h4>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <a href="https://wa.me/254716770077" target="_blank" rel="noreferrer" className="btn btn-gold" style={{ justifyContent:"center" }}>
                    <i className="bi bi-whatsapp" /> Chat on WhatsApp
                  </a>
                  <a href="tel:+254716770077" className="btn btn-dark" style={{ justifyContent:"center" }}>
                    <i className="bi bi-telephone" /> Call 0716 770 077
                  </a>
                </div>
              </div>

              {/* Map embed placeholder */}
              <div style={{ borderRadius:"var(--r-lg)", overflow:"hidden", height:220, background:"var(--tag-bg)", border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:8 }}>
                <i className="bi bi-map" style={{ fontSize:40, color:"var(--ink-3)", opacity:.4 }} />
                <span style={{ fontSize:13, color:"var(--ink-3)" }}>Diamond Plaza II, Parklands</span>
                <a href="https://maps.google.com/?q=Diamond+Plaza+II+Parklands+Nairobi" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ marginTop:4 }}>
                  <i className="bi bi-box-arrow-up-right" /> Open in Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <style>{`
        @keyframes spin { to { transform:rotate(360deg); } }
        @media (max-width:900px) {
          .container > div:first-of-type { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}