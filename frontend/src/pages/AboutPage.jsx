export default function AboutPage({ setPage }) {
  const go = (p) => { setPage(p); window.scrollTo({ top:0 }); };

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <section style={{ background:"var(--ink)", padding:"80px 0 72px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 60% at 80% 50%, rgba(201,168,76,.12) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div className="container" style={{ position:"relative" }}>
          <div style={{ maxWidth:620 }}>
            <div className="eyebrow" style={{ marginBottom:16 }}>About AutoMarket</div>
            <h1 className="d1" style={{ color:"#fff", marginBottom:20 }}>Kenya's most trusted car marketplace</h1>
            <p style={{ color:"#aaa", fontSize:17, lineHeight:1.75, maxWidth:520 }}>
              We started AutoMarket with one mission: make buying and selling cars in Kenya simple, transparent, and trustworthy. No hidden fees, no surprises.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-sm" style={{ background:"#fff" }}>
        <div className="container">
          <div className="grid-4" style={{ gap:24 }}>
            {[
              ["3,491+","Vehicles Listed","bi-car-front"],
              ["12+","Years in Business","bi-calendar-check"],
              ["15,000+","Happy Customers","bi-people"],
              ["50+","Brands Available","bi-grid"],
            ].map(([num,label,icon]) => (
              <div key={label} style={{ textAlign:"center", padding:"28px 20px", borderRadius:"var(--r-lg)", border:"1px solid var(--border)" }}>
                <i className={`bi ${icon}`} style={{ fontSize:28, color:"var(--accent)", display:"block", marginBottom:10 }} />
                <div style={{ fontFamily:"var(--font-d)", fontSize:32, fontWeight:800, marginBottom:4 }}>{num}</div>
                <div style={{ fontSize:13, color:"var(--ink-3)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom:12 }}>Our Story</div>
              <h2 className="d2" style={{ marginBottom:20 }}>Built for Kenyans, by Kenyans</h2>
              <p style={{ color:"var(--ink-2)", fontSize:15, lineHeight:1.8, marginBottom:16 }}>
                AutoMarket was founded right here in Nairobi, born out of frustration with the opaque, complicated process of buying a used car. We knew there had to be a better way.
              </p>
              <p style={{ color:"var(--ink-2)", fontSize:15, lineHeight:1.8, marginBottom:16 }}>
                Today we list thousands of verified vehicles — from affordable Kenyan-used hatchbacks to premium foreign imports — all in one professional, easy-to-navigate platform.
              </p>
              <p style={{ color:"var(--ink-2)", fontSize:15, lineHeight:1.8, marginBottom:32 }}>
                Whether you're buying your first car or selling a luxury SUV, our team is here to guide you every step of the way.
              </p>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                <button className="btn btn-dark" onClick={() => go("vehicles")}>Browse Vehicles</button>
                <button className="btn btn-outline" onClick={() => go("contact")}>Contact Us</button>
              </div>
            </div>
            <div style={{ background:"var(--tag-bg)", borderRadius:"var(--r-lg)", height:420, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16, border:"1px solid var(--border)" }}>
              <div style={{ width:100, height:100, background:"var(--ink)", borderRadius:20, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontFamily:"var(--font-d)", fontWeight:800, fontSize:42, color:"#fff" }}>A</span>
              </div>
              <div style={{ fontFamily:"var(--font-d)", fontWeight:800, fontSize:22, letterSpacing:"-.3px" }}>
                AUTO<span style={{ fontWeight:300 }}>MARKET</span>
              </div>
              <div style={{ fontSize:13, color:"var(--ink-3)" }}>Est. 2012 · Nairobi, Kenya</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background:"var(--bg)" }}>
        <div className="container">
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <div className="eyebrow" style={{ marginBottom:12 }}>What We Stand For</div>
            <h2 className="d2">Our Values</h2>
          </div>
          <div className="grid-3" style={{ gap:28 }}>
            {[
              ["bi-shield-check","Transparency","No hidden fees, no price manipulation. Every listing shows the real asking price and full vehicle history.","var(--green)"],
              ["bi-award","Quality","Every vehicle is inspected and scored. We only list cars that meet our quality standards.","var(--accent)"],
              ["bi-people","Community","We're here for the Kenyan car community — buyers, sellers, and importers alike. Your success is our success.","#1a4eb0"],
              ["bi-lightning-charge","Speed","From enquiry to keys in hand, we make the process fast. Most deals close in under 2 weeks.","var(--red)"],
              ["bi-chat-square-heart","Trust","Our team of industry veterans brings decades of combined experience to every transaction.","#7c3aed"],
              ["bi-globe","Reach","Direct import network spanning Japan, UK, UAE, and beyond. Access to vehicles not yet in Kenya.","var(--accent)"],
            ].map(([icon,title,desc,color]) => (
              <div key={title} style={{ background:"#fff", borderRadius:"var(--r-lg)", padding:"32px 24px", border:"1px solid var(--border)" }}>
                <div style={{ width:52, height:52, borderRadius:12, background:`${color}18`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
                  <i className={`bi ${icon}`} style={{ fontSize:22, color }} />
                </div>
                <h3 style={{ fontFamily:"var(--font-d)", fontSize:17, fontWeight:700, marginBottom:8 }}>{title}</h3>
                <p style={{ color:"var(--ink-3)", fontSize:13.5, lineHeight:1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-dark">
        <div className="container-sm" style={{ textAlign:"center" }}>
          <div className="eyebrow" style={{ marginBottom:16 }}>Join Thousands of Happy Customers</div>
          <h2 className="d2" style={{ marginBottom:16 }}>Ready to find your car?</h2>
          <p style={{ color:"#aaa", fontSize:15, marginBottom:36, lineHeight:1.7 }}>
            Browse our full inventory of Kenyan-used and direct-import vehicles. New listings added daily.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <button className="btn btn-white btn-lg" onClick={() => go("vehicles")}>
              <i className="bi bi-search" /> Browse Vehicles
            </button>
            <button className="btn btn-gold btn-lg" onClick={() => go("sell")}>
              <i className="bi bi-tag" /> Sell My Car
            </button>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .container > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}