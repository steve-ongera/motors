import { useState, useEffect } from "react";
import VehicleCard from "../components/VehicleCard";
import { SkeletonDetail } from "../components/Skeleton";
import Toast from "../components/Toast";
import { vehiclesApi, formsApi } from "../services/api";

const fmt = (p, c="KES") => `${c} ${Number(p).toLocaleString()}`;
const stars = (n) => "★".repeat(Math.min(n,5)) + "☆".repeat(Math.max(0,5-n));

export default function VehicleDetailPage({ slug, setPage }) {
  const [vehicle,  setVehicle]  = useState(null);
  const [similar,  setSimilar]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selImg,   setSelImg]   = useState(0);
  const [toast,    setToast]    = useState(null);
  const [sending,  setSending]  = useState(false);
  const [form,     setForm]     = useState({ full_name:"", email:"", phone:"", message:"" });
  const [errors,   setErrors]   = useState({});

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [v, sim] = await Promise.all([
          vehiclesApi.detail(slug),
          vehiclesApi.similar(slug).catch(() => []),
        ]);
        setVehicle(v);
        setSimilar(Array.isArray(sim) ? sim : sim.results || []);
      } catch(e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    return e;
  };

  const handleEnquire = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSending(true);
    try {
      await formsApi.enquire({ ...form, vehicle: vehicle.id });
      setToast({ message:"Enquiry sent! We'll contact you soon.", type:"success" });
      setForm({ full_name:"", email:"", phone:"", message:"" });
      setErrors({});
    } catch(err) {
      setToast({ message:"Failed to send. Please try WhatsApp.", type:"error" });
    } finally {
      setSending(false);
    }
  };

  const go = (p) => { setPage(p); window.scrollTo({ top:0 }); };

  if (loading) return (
    <div className="page-wrapper">
      <div className="container"><SkeletonDetail /></div>
    </div>
  );

  if (!vehicle) return (
    <div className="page-wrapper" style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh" }}>
      <div style={{ textAlign:"center" }}>
        <i className="bi bi-exclamation-triangle" style={{ fontSize:48, color:"var(--ink-3)", display:"block", marginBottom:16 }} />
        <h2 style={{ fontFamily:"var(--font-d)" }}>Vehicle not found</h2>
        <button className="btn btn-dark" style={{ marginTop:24 }} onClick={() => go("vehicles")}>Back to Listings</button>
      </div>
    </div>
  );

  const images = vehicle.images || [];
  const currentImg = images[selImg]?.image || null;

  return (
    <div className="page-wrapper">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Breadcrumb */}
      <div style={{ background:"var(--bg)", borderBottom:"1px solid var(--border)", padding:"12px 0" }}>
        <div className="container">
          <nav className="breadcrumb">
            <button onClick={() => go("home")}>Home</button>
            <i className="bi bi-chevron-right" style={{ fontSize:10 }} />
            <button onClick={() => go("vehicles")}>Vehicles</button>
            <i className="bi bi-chevron-right" style={{ fontSize:10 }} />
            <span className="active">{vehicle.brand_name} {vehicle.model_name}</span>
          </nav>
        </div>
      </div>

      <div className="container" style={{ padding:"40px 5%" }}>
        {/* ── Main grid ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 400px", gap:48 }}>

          {/* Left: images + specs */}
          <div>
            {/* Main image */}
            <div style={{ borderRadius:"var(--r-lg)", overflow:"hidden", height:420, background:"var(--tag-bg)", marginBottom:12, position:"relative" }}>
              {currentImg ? (
                <img src={currentImg} alt={vehicle.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              ) : (
                <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                  <i className="bi bi-car-front-fill" style={{ fontSize:80, color:"var(--border)" }} />
                  <span style={{ color:"var(--ink-3)", fontSize:14, marginTop:12 }}>No image available</span>
                </div>
              )}
              {/* Availability */}
              <span className="badge-available">{vehicle.availability}</span>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display:"flex", gap:8, marginBottom:32, overflowX:"auto", paddingBottom:4 }}>
                {images.map((img, i) => (
                  <div key={i} onClick={() => setSelImg(i)}
                    style={{ width:90, height:66, borderRadius:10, overflow:"hidden", flexShrink:0, cursor:"pointer", border:`2px solid ${selImg===i?"var(--ink)":"var(--border)"}`, transition:"border var(--tr)" }}>
                    <img src={img.image} alt={`View ${i+1}`} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  </div>
                ))}
              </div>
            )}

            {/* Specs */}
            <div className="card" style={{ padding:28, marginBottom:28 }}>
              <h3 style={{ fontFamily:"var(--font-d)", fontSize:17, fontWeight:700, marginBottom:20, display:"flex", alignItems:"center", gap:8 }}>
                <i className="bi bi-list-columns" /> Vehicle Details
              </h3>
              <div>
                {[
                  ["Year of Manufacture", vehicle.year],
                  ["Current Location",    vehicle.location],
                  ["Availability",        <span style={{ color:vehicle.availability==="available"?"var(--green)":"var(--red)", fontWeight:700 }}>{vehicle.availability}</span>],
                  ["Drive",               vehicle.drive || "N/A"],
                  ["Mileage",             vehicle.mileage ? `${Number(vehicle.mileage).toLocaleString()} km` : "N/A"],
                  ["Engine Size",         vehicle.engine_size ? `${vehicle.engine_size} CC` : "N/A"],
                  ["Fuel Type",           vehicle.fuel_display || vehicle.fuel_type || "N/A"],
                  ["Horse Power",         vehicle.horse_power ? `${vehicle.horse_power} Hp` : "N/A"],
                  ["Transmission",        vehicle.transmission],
                  ["Torque",              vehicle.torque ? `${vehicle.torque} Nm` : "N/A"],
                  ["Acceleration 0–100",  vehicle.acceleration ? `${vehicle.acceleration} secs` : "N/A"],
                  ["Condition",           vehicle.condition_display],
                  ["Listing Type",        vehicle.listing_type === "private_seller" ? "Private Seller" : "Direct Import"],
                ].map(([key, val]) => (
                  <div className="spec-row" key={key}>
                    <span className="spec-key">{key}</span>
                    <span className="spec-val">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            {vehicle.features_list?.length > 0 && (
              <div className="card" style={{ padding:28 }}>
                <h3 style={{ fontFamily:"var(--font-d)", fontSize:17, fontWeight:700, marginBottom:16 }}>
                  <i className="bi bi-stars" style={{ marginRight:8 }} />Features
                </h3>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {vehicle.features_list.map((f, i) => (
                    <span key={i} className="tag tag-green"><i className="bi bi-check-circle-fill" style={{ fontSize:10 }} />{f}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: info + enquiry */}
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            {/* Title & price */}
            <div className="card" style={{ padding:28 }}>
              <div className="eyebrow" style={{ marginBottom:10 }}>
                {vehicle.year} · {vehicle.condition_display}
              </div>
              <h1 style={{ fontFamily:"var(--font-d)", fontSize:"clamp(22px,3vw,28px)", fontWeight:800, marginBottom:12, lineHeight:1.2 }}>
                {vehicle.title || `${vehicle.brand_name} ${vehicle.model_name}`}
              </h1>

              {/* Tags */}
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
                <span className="tag"><i className="bi bi-gear" style={{ fontSize:10 }} />{vehicle.transmission}</span>
                {vehicle.engine_size && <span className="tag"><i className="bi bi-speedometer2" style={{ fontSize:10 }} />{vehicle.engine_size} CC</span>}
                {vehicle.fuel_type && <span className="tag"><i className="bi bi-fuel-pump" style={{ fontSize:10 }} />{vehicle.fuel_display}</span>}
                {vehicle.drive && <span className="tag tag-blue"><i className="bi bi-arrows-move" style={{ fontSize:10 }} />{vehicle.drive}</span>}
              </div>

              {/* Condition score */}
              {vehicle.condition_score && (
                <div style={{ marginBottom:16 }}>
                  <span className="stars">{stars(vehicle.condition_score)}</span>
                  <span style={{ fontSize:12, color:"var(--ink-3)", marginLeft:6 }}>Condition ({vehicle.condition_score}/5)</span>
                </div>
              )}

              <p style={{ color:"var(--ink-2)", fontSize:14, lineHeight:1.75, marginBottom:20 }}>{vehicle.description}</p>

              {/* Price */}
              <div style={{ background:"var(--tag-bg)", borderRadius:"var(--r-md)", padding:"18px 20px", marginBottom:20 }}>
                <div style={{ fontSize:12, color:"var(--ink-3)", marginBottom:4, textTransform:"uppercase", letterSpacing:1 }}>Asking Price</div>
                <div className="price price-lg">{fmt(vehicle.price, vehicle.currency)}</div>
              </div>

              {/* CTAs */}
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <a
                  href={`https://wa.me/254716770077?text=Hi, I'm interested in the ${vehicle.title} listed at ${fmt(vehicle.price, vehicle.currency)}`}
                  target="_blank" rel="noreferrer"
                  className="btn btn-gold btn-lg"
                  style={{ justifyContent:"center", textDecoration:"none" }}>
                  <i className="bi bi-whatsapp" /> Enquire via WhatsApp
                </a>
                <a href="tel:+254716770077" className="btn btn-dark btn-lg" style={{ justifyContent:"center", textDecoration:"none" }}>
                  <i className="bi bi-telephone" /> Call Now
                </a>
              </div>

              {/* Share */}
              <div style={{ marginTop:20, paddingTop:16, borderTop:"1px solid var(--border)" }}>
                <span style={{ fontSize:12, color:"var(--ink-3)", marginRight:10 }}>Share:</span>
                {[["bi-whatsapp","https://wa.me/?text="],["bi-facebook","https://facebook.com/sharer?u="],["bi-twitter-x","https://twitter.com/intent/tweet?url="]].map(([icon,base]) => (
                  <a key={icon} href={`${base}${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer"
                    className="btn btn-ghost btn-icon" style={{ display:"inline-flex", marginRight:4 }}>
                    <i className={`bi ${icon}`} />
                  </a>
                ))}
              </div>
            </div>

            {/* Enquiry form */}
            <div className="card" style={{ padding:24 }}>
              <h3 style={{ fontFamily:"var(--font-d)", fontSize:16, fontWeight:700, marginBottom:16, display:"flex", alignItems:"center", gap:8 }}>
                <i className="bi bi-envelope" /> Send Enquiry
              </h3>
              <form onSubmit={handleEnquire} style={{ display:"flex", flexDirection:"column", gap:12 }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-control" placeholder="Your name" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name:e.target.value }))} />
                  {errors.full_name && <span className="form-error">{errors.full_name}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input className="form-control" placeholder="07XX XXX XXX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone:e.target.value }))} />
                  {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-control" type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email:e.target.value }))} />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea className="form-control" placeholder="I'm interested in this vehicle..." value={form.message} onChange={e => setForm(f => ({ ...f, message:e.target.value }))} style={{ minHeight:80 }} />
                </div>
                <button className="btn btn-dark" type="submit" disabled={sending} style={{ width:"100%", justifyContent:"center", marginTop:4 }}>
                  {sending ? <><i className="bi bi-arrow-repeat" style={{ animation:"spin 1s linear infinite" }} /> Sending…</> : <><i className="bi bi-send" /> Send Enquiry</>}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Similar vehicles */}
        {similar.length > 0 && (
          <div style={{ marginTop:64 }}>
            <h2 className="d3" style={{ marginBottom:8 }}>Similar Vehicles</h2>
            <p style={{ color:"var(--ink-3)", fontSize:14, marginBottom:28 }}>People who viewed this also consider</p>
            <div className="grid-auto">
              {similar.slice(0,4).map(v => (
                <VehicleCard key={v.id} vehicle={v} onClick={() => { setPage({ name:"vehicle", slug:v.slug }); window.scrollTo({ top:0 }); }} />
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .container > div:first-of-type {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}