import { useState } from "react";
import Toast from "../components/Toast";
import { formsApi } from "../services/api";

const YEARS = Array.from({ length: 36 }, (_, i) => 2025 - i);

export default function SellCarPage({ setPage }) {
  const [toast,   setToast]   = useState(null);
  const [sending, setSending] = useState(false);
  const [done,    setDone]    = useState(false);
  const [form,    setForm]    = useState({
    full_name:"", email:"", phone:"",
    brand:"", model:"", year:"", mileage:"",
    condition:"kenyan_used", asking_price:"", currency:"KES", description:"",
  });
  const [errors, setErrors] = useState({});

  const upd = (k, v) => { setForm(f => ({ ...f, [k]:v })); setErrors(e => ({ ...e, [k]:undefined })); };

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = "Required";
    if (!form.phone.trim())     e.phone     = "Required";
    if (!form.brand.trim())     e.brand     = "Required";
    if (!form.model.trim())     e.model     = "Required";
    if (!form.year)             e.year      = "Required";
    if (!form.mileage)          e.mileage   = "Required";
    if (!form.asking_price)     e.asking_price = "Required";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSending(true);
    try {
      await formsApi.sellCar({ ...form, year: Number(form.year), mileage: Number(form.mileage), asking_price: Number(form.asking_price) });
      setDone(true);
      setToast({ message:"Request received! We'll contact you within 24 hours.", type:"success" });
    } catch(err) {
      setToast({ message:"Submission failed. Please try WhatsApp or call us.", type:"error" });
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
          <div className="eyebrow" style={{ marginBottom:16 }}>We sell on your behalf</div>
          <h1 className="d1" style={{ color:"#fff", marginBottom:16 }}>Sell Your Car</h1>
          <p style={{ color:"#aaa", fontSize:16, lineHeight:1.7, maxWidth:500, margin:"0 auto" }}>
            List your vehicle on Kenya's largest marketplace. We handle all buyer enquiries, negotiations, and paperwork — you just collect the money.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="section-sm" style={{ background:"var(--bg)" }}>
        <div className="container">
          <div className="grid-4" style={{ gap:20 }}>
            {[
              ["bi-clipboard-check","01. Submit Details","Fill in your vehicle information below — it takes less than 3 minutes."],
              ["bi-search","02. Inspection","Our team contacts you to schedule a quick inspection at our Parklands office."],
              ["bi-megaphone","03. We List It","We create a professional listing and market it to thousands of buyers."],
              ["bi-cash-coin","04. You Get Paid","Once sold, we process payment directly to you. Transparent, fast, secure."],
            ].map(([icon,title,desc],i) => (
              <div key={i} style={{ background:"#fff", borderRadius:"var(--r-md)", padding:"24px 20px", border:"1px solid var(--border)", textAlign:"center" }}>
                <i className={`bi ${icon}`} style={{ fontSize:28, color:"var(--accent)", display:"block", marginBottom:12 }} />
                <div style={{ fontFamily:"var(--font-d)", fontSize:14, fontWeight:700, marginBottom:8 }}>{title}</div>
                <p style={{ fontSize:12.5, color:"var(--ink-3)", lineHeight:1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section" style={{ background:"#fff" }}>
        <div className="container-sm">
          {done ? (
            <div style={{ textAlign:"center", padding:"60px 20px" }}>
              <div style={{ width:80, height:80, borderRadius:"50%", background:"#d8f5ea", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}>
                <i className="bi bi-check-lg" style={{ fontSize:36, color:"var(--green)" }} />
              </div>
              <h2 style={{ fontFamily:"var(--font-d)", fontSize:28, fontWeight:800, marginBottom:12 }}>Request Received!</h2>
              <p style={{ color:"var(--ink-2)", marginBottom:32, lineHeight:1.7 }}>
                Thank you! Our team will contact you within 24 hours to schedule an inspection and get your car listed.
              </p>
              <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
                <button className="btn btn-dark" onClick={() => setPage("vehicles")}>Browse Vehicles</button>
                <button className="btn btn-outline" onClick={() => { setDone(false); setForm({ full_name:"",email:"",phone:"",brand:"",model:"",year:"",mileage:"",condition:"kenyan_used",asking_price:"",currency:"KES",description:"" }); }}>
                  Submit Another
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:48 }}>
              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:20 }}>
                <h2 className="d3" style={{ marginBottom:4 }}>Vehicle Details</h2>
                <p style={{ color:"var(--ink-3)", fontSize:14 }}>Fill in as much detail as possible for a faster listing.</p>

                {/* Contact */}
                <fieldset style={{ border:"none", padding:0 }}>
                  <legend style={{ fontFamily:"var(--font-d)", fontWeight:700, fontSize:14, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
                    <i className="bi bi-person-circle" /> Your Contact Info
                  </legend>
                  <div className="grid-2" style={{ gap:14 }}>
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input className="form-control" placeholder="John Kamau" value={form.full_name} onChange={e => upd("full_name",e.target.value)} />
                      {errors.full_name && <span className="form-error">{errors.full_name}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone *</label>
                      <input className="form-control" placeholder="07XX XXX XXX" value={form.phone} onChange={e => upd("phone",e.target.value)} />
                      {errors.phone && <span className="form-error">{errors.phone}</span>}
                    </div>
                  </div>
                  <div className="form-group" style={{ marginTop:14 }}>
                    <label className="form-label">Email Address</label>
                    <input className="form-control" type="email" placeholder="you@email.com" value={form.email} onChange={e => upd("email",e.target.value)} />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>
                </fieldset>

                <div style={{ height:1, background:"var(--border)" }} />

                {/* Vehicle info */}
                <fieldset style={{ border:"none", padding:0 }}>
                  <legend style={{ fontFamily:"var(--font-d)", fontWeight:700, fontSize:14, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
                    <i className="bi bi-car-front" /> Vehicle Information
                  </legend>
                  <div className="grid-2" style={{ gap:14 }}>
                    <div className="form-group">
                      <label className="form-label">Brand / Make *</label>
                      <input className="form-control" placeholder="e.g. Toyota" value={form.brand} onChange={e => upd("brand",e.target.value)} />
                      {errors.brand && <span className="form-error">{errors.brand}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Model *</label>
                      <input className="form-control" placeholder="e.g. Fielder" value={form.model} onChange={e => upd("model",e.target.value)} />
                      {errors.model && <span className="form-error">{errors.model}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Year *</label>
                      <select className="form-control" value={form.year} onChange={e => upd("year",e.target.value)}>
                        <option value="">Select Year</option>
                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                      {errors.year && <span className="form-error">{errors.year}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Mileage (km) *</label>
                      <input className="form-control" type="number" placeholder="e.g. 85000" value={form.mileage} onChange={e => upd("mileage",e.target.value)} />
                      {errors.mileage && <span className="form-error">{errors.mileage}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Condition</label>
                      <select className="form-control" value={form.condition} onChange={e => upd("condition",e.target.value)}>
                        <option value="kenyan_used">Kenyan Used</option>
                        <option value="foreign_used">Foreign Used</option>
                        <option value="new">New / Unregistered</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Asking Price *</label>
                      <div style={{ display:"flex", gap:8 }}>
                        <select className="form-control" value={form.currency} onChange={e => upd("currency",e.target.value)} style={{ width:90, flexShrink:0 }}>
                          <option>KES</option><option>USD</option><option>EUR</option>
                        </select>
                        <input className="form-control" type="number" placeholder="e.g. 1500000" value={form.asking_price} onChange={e => upd("asking_price",e.target.value)} />
                      </div>
                      {errors.asking_price && <span className="form-error">{errors.asking_price}</span>}
                    </div>
                  </div>
                  <div className="form-group" style={{ marginTop:14 }}>
                    <label className="form-label">Additional Notes</label>
                    <textarea className="form-control" placeholder="Any extra info: service history, modifications, faults, extras included…" value={form.description} onChange={e => upd("description",e.target.value)} />
                  </div>
                </fieldset>

                <button className="btn btn-dark btn-lg" type="submit" disabled={sending} style={{ justifyContent:"center" }}>
                  {sending ? <><i className="bi bi-arrow-repeat" style={{ animation:"spin 1s linear infinite" }} /> Submitting…</> : <><i className="bi bi-send" /> Submit Your Car</>}
                </button>
              </form>

              {/* Sidebar info */}
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div className="card" style={{ padding:24 }}>
                  <h4 style={{ fontFamily:"var(--font-d)", fontWeight:700, marginBottom:14 }}>Why Sell with Us?</h4>
                  {[
                    ["bi-people","Massive reach — 3,000+ active buyers"],
                    ["bi-shield-check","Verified buyer screening"],
                    ["bi-currency-exchange","Best price guarantee"],
                    ["bi-file-text","We handle all paperwork"],
                    ["bi-clock","Average 14 days to sell"],
                  ].map(([icon,text]) => (
                    <div key={icon} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:12 }}>
                      <i className={`bi ${icon}`} style={{ color:"var(--green)", fontSize:16, flexShrink:0, marginTop:2 }} />
                      <span style={{ fontSize:13.5, color:"var(--ink-2)", lineHeight:1.5 }}>{text}</span>
                    </div>
                  ))}
                </div>

                <div className="card" style={{ padding:24, background:"var(--tag-bg)", border:"none" }}>
                  <h4 style={{ fontFamily:"var(--font-d)", fontWeight:700, marginBottom:12 }}>Or reach us directly</h4>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    <a href="https://wa.me/254716770077" target="_blank" rel="noreferrer" className="btn btn-gold" style={{ justifyContent:"center" }}>
                      <i className="bi bi-whatsapp" /> WhatsApp Us
                    </a>
                    <a href="tel:+254716770077" className="btn btn-dark" style={{ justifyContent:"center" }}>
                      <i className="bi bi-telephone" /> 0716 770 077
                    </a>
                  </div>
                  <p style={{ fontSize:12, color:"var(--ink-3)", marginTop:12, textAlign:"center" }}>
                    Diamond Plaza II, 4th Ave Parklands<br />3rd Floor, Nairobi
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <style>{`
        @keyframes spin { to { transform:rotate(360deg); } }
        @media (max-width: 860px) {
          .container-sm > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}