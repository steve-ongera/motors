export default function Footer({ setPage }) {
  const go = (p) => { setPage(p); window.scrollTo({ top:0 }); };

  return (
    <footer style={{ background:"var(--ink)", color:"#fff", padding:"64px 0 32px" }}>
      <div className="container">
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1.4fr", gap:48, marginBottom:48 }}>
          {/* Brand */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <div style={{ width:38, height:38, background:"#fff", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:"var(--ink)", fontFamily:"var(--font-d)", fontWeight:800, fontSize:18 }}>A</span>
              </div>
              <span style={{ fontFamily:"var(--font-d)", fontWeight:800, fontSize:17, letterSpacing:"-.3px" }}>
                AUTO<span style={{ fontWeight:300 }}>MARKET</span>
              </span>
            </div>
            <p style={{ color:"#aaa", fontSize:13.5, lineHeight:1.75, maxWidth:260, marginBottom:20 }}>
              Kenya's premier car marketplace. Buy, sell, and import vehicles with confidence. Over 3,000 verified listings.
            </p>
            <div style={{ display:"flex", gap:10 }}>
              {[["bi-twitter-x","https://x.com"],["bi-instagram","https://instagram.com"],["bi-youtube","https://youtube.com"],["bi-whatsapp","https://wa.me/254716770077"]].map(([icon, href]) => (
                <a key={icon} href={href} target="_blank" rel="noreferrer"
                  style={{ width:36, height:36, background:"rgba(255,255,255,.1)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", color:"#aaa", transition:"all var(--tr)", fontSize:16 }}
                  onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,.2)"; e.currentTarget.style.color="#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,.1)"; e.currentTarget.style.color="#aaa"; }}>
                  <i className={`bi ${icon}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontFamily:"var(--font-d)", fontWeight:700, fontSize:13, letterSpacing:2, textTransform:"uppercase", color:"#666", marginBottom:16 }}>Company</h4>
            <ul style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[["about","About Us"],["vehicles","Browse Cars"],["bikes","Motorcycles"],["sell","Sell Your Car"]].map(([key,label]) => (
                <li key={key}>
                  <button onClick={() => go(key)} style={{ color:"#aaa", fontSize:14, transition:"color var(--tr)", background:"none", border:"none", cursor:"pointer", textAlign:"left", padding:0 }}
                    onMouseEnter={e => e.currentTarget.style.color="#fff"}
                    onMouseLeave={e => e.currentTarget.style.color="#aaa"}>
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontFamily:"var(--font-d)", fontWeight:700, fontSize:13, letterSpacing:2, textTransform:"uppercase", color:"#666", marginBottom:16 }}>Support</h4>
            <ul style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[["faqs","FAQ"],["contact","Contact Us"],["sell","Sell on Behalf T&C"]].map(([key,label]) => (
                <li key={key}>
                  <button onClick={() => go(key)} style={{ color:"#aaa", fontSize:14, transition:"color var(--tr)", background:"none", border:"none", cursor:"pointer", textAlign:"left", padding:0 }}
                    onMouseEnter={e => e.currentTarget.style.color="#fff"}
                    onMouseLeave={e => e.currentTarget.style.color="#aaa"}>
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Location */}
          <div>
            <h4 style={{ fontFamily:"var(--font-d)", fontWeight:700, fontSize:13, letterSpacing:2, textTransform:"uppercase", color:"#666", marginBottom:16 }}>Location</h4>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[
                ["bi-geo-alt","Diamond Plaza II, 4th Avenue Parklands, 3rd Floor (Parking Section), Nairobi"],
                ["bi-telephone","0716 770 077"],
                ["bi-envelope","info@automarket.co.ke"],
                ["bi-clock","Mon–Sat: 8am – 6pm"],
              ].map(([icon, text]) => (
                <div key={icon} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <i className={`bi ${icon}`} style={{ color:"var(--accent)", fontSize:14, marginTop:3, flexShrink:0 }} />
                  <span style={{ color:"#aaa", fontSize:13.5, lineHeight:1.55 }}>{text}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop:16 }}>
              <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:"var(--green)", color:"#fff", borderRadius:20, padding:"5px 14px", fontSize:11, fontWeight:700, letterSpacing:1 }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:"#6effc0", display:"inline-block" }} />
                Now Open
              </span>
            </div>
          </div>
        </div>

        <div style={{ borderTop:"1px solid rgba(255,255,255,.08)", paddingTop:24, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <span style={{ color:"#555", fontSize:13 }}>© {new Date().getFullYear()} AutoMarket KE. All rights reserved.</span>
          <span style={{ color:"#444", fontSize:12 }}>Built with ❤ in Nairobi</span>
        </div>
      </div>

      {/* Responsive footer */}
      <style>{`
        @media (max-width: 900px) {
          footer > .container > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 560px) {
          footer > .container > div:first-child {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </footer>
  );
}