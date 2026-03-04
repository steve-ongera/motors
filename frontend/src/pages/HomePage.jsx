import { useState, useEffect } from "react";
import VehicleCard from "../components/VehicleCard";
import { SkeletonCard } from "../components/Skeleton";
import { vehiclesApi, brandsApi } from "../services/api";

const BUDGET_RANGES = [
  { label:"0 – 500K",   min:0,       max:500000   },
  { label:"500K – 1M",  min:500000,  max:1000000  },
  { label:"1M – 2M",    min:1000000, max:2000000  },
  { label:"2M – 3M",    min:2000000, max:3000000  },
  { label:"3M – 5M",    min:3000000, max:5000000  },
  { label:"5M – 10M",   min:5000000, max:10000000 },
  { label:"Above 10M",  min:10000000,max:null     },
];

export default function HomePage({ setPage }) {
  const [featured,  setFeatured]  = useState([]);
  const [stats,     setStats]     = useState(null);
  const [brands,    setBrands]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [budget,    setBudget]    = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [feat, st, br] = await Promise.all([
          vehiclesApi.featured(),
          vehiclesApi.stats(),
          brandsApi.list(),
        ]);
        setFeatured(Array.isArray(feat) ? feat : feat.results || []);
        setStats(st);
        setBrands(Array.isArray(br) ? br : br.results || []);
      } catch(e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSearch = () => {
    setPage({ name:"vehicles", search, budget });
  };

  const go = (p) => { setPage(p); window.scrollTo({ top:0 }); };

  return (
    <div className="page-wrapper">
      {/* ── Hero ── */}
      <section style={{ minHeight:"90vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"80px 5% 60px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 50% at 50% -10%, rgba(201,168,76,.1) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:"20%", left:"-5%", width:400, height:400, borderRadius:"50%", background:"rgba(201,168,76,.05)", filter:"blur(80px)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:"15%", right:"-5%", width:350, height:350, borderRadius:"50%", background:"rgba(10,124,79,.05)", filter:"blur(80px)", pointerEvents:"none" }} />

        <div className="container anim-up" style={{ position:"relative" }}>
          <div style={{ maxWidth:800, margin:"0 auto" }}>
            <div className="eyebrow" style={{ marginBottom:24, display:"inline-block" }}>Kenya's Largest Used Car Marketplace</div>
            <h1 className="d1" style={{ marginBottom:24 }}>
              Find the<br />
              <em style={{ fontStyle:"italic", color:"var(--accent)" }}>perfect car</em><br />
              for you
            </h1>
            <p style={{ fontSize:18, color:"var(--ink-2)", lineHeight:1.7, marginBottom:44, maxWidth:540, margin:"0 auto 44px" }}>
              We help you find a car that fits your personality, dream and pocket. Thousands of verified listings updated daily.
            </p>
            <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
              <button className="btn btn-dark btn-lg" onClick={() => go("vehicles")}>
                <i className="bi bi-search" /> Explore Vehicles
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => go("sell")}>
                <i className="bi bi-tag" /> Sell Your Car
              </button>
            </div>
          </div>

          {/* Hero SVG car */}
          <div style={{ marginTop:64, position:"relative" }}>
            <div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", width:"60%", height:40, background:"rgba(0,0,0,.06)", borderRadius:"50%", filter:"blur(24px)" }} />
            <svg viewBox="0 0 800 260" style={{ width:"100%", maxWidth:680, margin:"0 auto", display:"block", filter:"drop-shadow(0 20px 50px rgba(0,0,0,.15))" }}>
              <defs>
                <linearGradient id="hbody" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2a2a26"/>
                  <stop offset="100%" stopColor="#161614"/>
                </linearGradient>
                <linearGradient id="hglass" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(180,220,255,.75)"/>
                  <stop offset="100%" stopColor="rgba(100,160,220,.3)"/>
                </linearGradient>
                <linearGradient id="haccent" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c9a84c"/>
                  <stop offset="100%" stopColor="#e8c96e"/>
                </linearGradient>
              </defs>
              <path d="M55,200 L55,172 Q66,140 118,120 L195,96 Q228,68 298,60 L490,60 Q562,60 606,96 L682,120 Q730,140 745,172 L745,200 Z" fill="url(#hbody)"/>
              <path d="M195,96 Q228,68 298,60 L490,60 Q562,60 578,96 Z" fill="url(#hglass)"/>
              <path d="M210,93 L238,68 L310,63 L310,93 Z" fill="rgba(160,215,255,.85)"/>
              <path d="M320,63 L455,63 L458,93 L320,93 Z" fill="rgba(160,215,255,.85)"/>
              <path d="M468,65 L556,93 L468,93 Z" fill="rgba(160,215,255,.85)"/>
              <path d="M200,93 L204,200 M310,63 L314,200 M455,63 L458,200" stroke="rgba(255,255,255,.08)" strokeWidth="1.5"/>
              {/* Accent stripe */}
              <path d="M55,170 L745,170" stroke="url(#haccent)" strokeWidth="2.5" opacity=".5"/>
              {/* Wheels */}
              {[180,618].map(cx => (
                <g key={cx}>
                  <ellipse cx={cx} cy={202} rx={52} ry={52} fill="#111"/>
                  <ellipse cx={cx} cy={202} rx={36} ry={36} fill="#2a2a26"/>
                  <ellipse cx={cx} cy={202} rx={18} ry={18} fill="#444"/>
                  <ellipse cx={cx} cy={202} rx={7}  ry={7}  fill="#777"/>
                  {[0,60,120,180,240,300].map(deg => {
                    const r = Math.PI * deg / 180;
                    return <line key={deg} x1={cx} y1={202} x2={cx+28*Math.cos(r)} y2={202+28*Math.sin(r)} stroke="#333" strokeWidth="3"/>;
                  })}
                </g>
              ))}
              {/* Lights */}
              <ellipse cx={745} cy={162} rx={14} ry={8} fill="rgba(255,90,0,.75)"/>
              <ellipse cx={55}  cy={162} rx={14} ry={8} fill="rgba(255,255,180,.9)"/>
            </svg>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="section-dark section-sm">
        <div className="container">
          <div className="grid-4" style={{ textAlign:"center" }}>
            {[
              [stats?.total_vehicles ? `${stats.total_vehicles.toLocaleString()}+` : "3,491+","Vehicles Listed","bi-car-front"],
              [stats?.brands ? `${stats.brands}+` : "50+","Brands Available","bi-grid"],
              [stats?.cars ? `${stats.cars.toLocaleString()}+` : "3,200+","Cars Available","bi-speedometer2"],
              [stats?.motorcycles ? `${stats.motorcycles}+` : "200+","Motorcycles","bi-bicycle"],
            ].map(([num,label,icon]) => (
              <div key={label} className="anim-up">
                <i className={`bi ${icon}`} style={{ fontSize:28, color:"var(--accent)", display:"block", marginBottom:10 }} />
                <div style={{ fontFamily:"var(--font-d)", fontSize:"clamp(28px,4vw,40px)", fontWeight:800, color:"#fff", marginBottom:4 }}>{num}</div>
                <div style={{ color:"#777", fontSize:13, letterSpacing:.5 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Search ── */}
      <section className="section-sm" style={{ background:"#fff" }}>
        <div className="container-sm">
          <div style={{ textAlign:"center", marginBottom:32 }}>
            <h2 className="d2">Find what fits you</h2>
            <p style={{ color:"var(--ink-3)", marginTop:10 }}>Filter by budget, brand, year, and more</p>
          </div>

          <div style={{ background:"var(--bg)", borderRadius:"var(--r-lg)", padding:28, border:"1px solid var(--border)" }}>
            {/* Search row */}
            <div style={{ display:"flex", gap:12, marginBottom:20 }}>
              <div style={{ position:"relative", flex:1 }}>
                <i className="bi bi-search" style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"var(--ink-3)", fontSize:16, pointerEvents:"none" }} />
                <input
                  className="form-control"
                  placeholder="Search vehicle name (e.g. Fielder, Prado, X5…)"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                  style={{ paddingLeft:42 }}
                />
              </div>
              <button className="btn btn-dark" onClick={handleSearch}>Search</button>
            </div>

            {/* Budget chips */}
            <div>
              <div className="eyebrow" style={{ marginBottom:10 }}>Filter by Budget</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {BUDGET_RANGES.map(r => (
                  <button
                    key={r.label}
                    className={`chip ${budget?.label === r.label ? "active" : ""}`}
                    onClick={() => setBudget(budget?.label === r.label ? null : r)}
                  >{r.label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Brands ── */}
      {brands.length > 0 && (
        <section className="section-sm" style={{ background:"var(--bg)" }}>
          <div className="container">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, flexWrap:"wrap", gap:12 }}>
              <h2 className="d3">Browse by Brand</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => go("vehicles")}>View all <i className="bi bi-arrow-right" /></button>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
              {brands.slice(0,12).map(b => (
                <button key={b.id} className="chip" onClick={() => setPage({ name:"vehicles", brand: b.slug })} style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 18px" }}>
                  <i className="bi bi-car-front" style={{ fontSize:13 }} />
                  {b.name}
                  {b.vehicle_count > 0 && <span style={{ color:"var(--ink-3)", fontSize:11 }}>({b.vehicle_count})</span>}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Vehicles ── */}
      <section className="section" style={{ background:"#fff" }}>
        <div className="container">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:40, flexWrap:"wrap", gap:16 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom:8 }}>Hand-picked</div>
              <h2 className="d2">Featured Vehicles</h2>
            </div>
            <button className="btn btn-outline" onClick={() => go("vehicles")}>View All <i className="bi bi-arrow-right" /></button>
          </div>

          {loading ? (
            <div className="grid-auto">
              {[...Array(6)].map((_,i) => <SkeletonCard key={i} />)}
            </div>
          ) : featured.length === 0 ? (
            <EmptyState icon="bi-car-front" title="No featured vehicles" sub="Check back soon." />
          ) : (
            <div className="grid-auto">
              {featured.slice(0,6).map((v,i) => (
                <div key={v.id} className={`anim-up delay-${Math.min(i+1,6)}`}>
                  <VehicleCard vehicle={v} onClick={() => setPage({ name:"vehicle", slug:v.slug })} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section" style={{ background:"var(--bg)" }}>
        <div className="container-sm" style={{ textAlign:"center" }}>
          <div className="eyebrow" style={{ marginBottom:12 }}>Simple Process</div>
          <h2 className="d2" style={{ marginBottom:12 }}>Owning a car is as simple as</h2>
          <p style={{ color:"var(--ink-3)", marginBottom:52, fontSize:16 }}>One, Two, Three</p>
          <div className="grid-3">
            {[
              ["bi-car-front","01","Select Vehicle","Browse thousands of verified listings. Filter by brand, budget, year, and body type to find the perfect match."],
              ["bi-chat-dots","02","Enquire","Reach out directly via WhatsApp or phone. Our team answers all questions quickly and honestly."],
              ["bi-credit-card","03","Pay & Drive","Complete payment through M-Pesa, bank transfer, or financing. Drive away in your new car same day."],
            ].map(([icon,num,title,desc],i) => (
              <div key={num} className={`anim-up delay-${i+1}`} style={{ background:"#fff", borderRadius:"var(--r-lg)", padding:"40px 28px", textAlign:"center", border:"1px solid var(--border)" }}>
                <div style={{ width:60, height:60, borderRadius:"50%", background:"var(--ink)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:22 }}>
                  <i className={`bi ${icon}`} />
                </div>
                <div className="eyebrow" style={{ marginBottom:8 }}>{num}</div>
                <h3 style={{ fontFamily:"var(--font-d)", fontSize:18, fontWeight:700, marginBottom:10 }}>{title}</h3>
                <p style={{ color:"var(--ink-3)", fontSize:13.5, lineHeight:1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Motorcycles CTA ── */}
      <section className="section-sm" style={{ background:"#fff" }}>
        <div className="container">
          <div style={{ background:"var(--ink)", borderRadius:"var(--r-lg)", padding:"48px 40px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:32, flexWrap:"wrap" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom:10 }}>New Section</div>
              <h3 className="d3" style={{ color:"#fff", marginBottom:8 }}>We also sell Motorcycles!</h3>
              <p style={{ color:"#aaa", fontSize:14, maxWidth:400 }}>Browse our selection of imported and locally sourced motorbikes for commuting and adventure.</p>
            </div>
            <button className="btn btn-gold btn-lg" onClick={() => go("bikes")}>
              <i className="bi bi-bicycle" /> View Motorcycles
            </button>
          </div>
        </div>
      </section>

      {/* ── Sell CTA ── */}
      <section className="section section-dark">
        <div className="container-sm" style={{ textAlign:"center" }}>
          <div className="eyebrow" style={{ marginBottom:16 }}>Sell with us</div>
          <h2 className="d2" style={{ marginBottom:16 }}>Want to sell your car?</h2>
          <p style={{ color:"#aaa", fontSize:16, marginBottom:40, lineHeight:1.7 }}>
            List your vehicle on Kenya's largest marketplace. We handle enquiries, negotiations, and paperwork — you just collect the money.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <button className="btn btn-white btn-lg" onClick={() => go("sell")}>
              <i className="bi bi-tag" /> List My Car
            </button>
            <button className="btn btn-ghost btn-lg" style={{ color:"#aaa", border:"1.5px solid rgba(255,255,255,.15)" }} onClick={() => go("faqs")}>
              <i className="bi bi-question-circle" /> Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function EmptyState({ icon, title, sub }) {
  return (
    <div style={{ textAlign:"center", padding:"64px 0", color:"var(--ink-3)" }}>
      <i className={`bi ${icon}`} style={{ fontSize:52, display:"block", marginBottom:16, opacity:.3 }} />
      <p style={{ fontFamily:"var(--font-d)", fontSize:18, fontWeight:600, color:"var(--ink-2)", marginBottom:6 }}>{title}</p>
      <p style={{ fontSize:14 }}>{sub}</p>
    </div>
  );
}