const fmt = (p, c = "KES") => `${c} ${Number(p).toLocaleString()}`;
const stars = (n) => "★".repeat(Math.min(n, 5)) + "☆".repeat(Math.max(0, 5 - n));

export default function VehicleCard({ vehicle: v, onClick }) {
  const badge = v.availability === "available" ? "badge-available" : v.availability === "sold" ? "badge-available badge-sold" : "badge-available badge-reserved";
  const condTag = v.condition === "kenyan_used" ? "tag tag-gold" : v.condition === "foreign_used" ? "tag tag-blue" : "tag tag-green";
  const imgSrc = v.primary_image || null;

  return (
    <div className="card card-hover" onClick={onClick} style={{ display:"flex", flexDirection:"column" }}>
      {/* Image */}
      <div style={{ height:200, position:"relative", overflow:"hidden", background:"var(--tag-bg)", flexShrink:0 }}>
        {imgSrc ? (
          <img src={imgSrc} alt={v.title} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform .4s ease" }}
            onMouseEnter={e => e.currentTarget.style.transform="scale(1.04)"}
            onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
          />
        ) : (
          <PlaceholderCar brand={v.brand_name} type={v.vehicle_type} />
        )}
        <span className={badge} style={{ textTransform:"capitalize" }}>{v.availability}</span>
        <span style={{ position:"absolute", top:12, left:12, background:"rgba(255,255,255,.92)", borderRadius:6, padding:"3px 9px", fontSize:11, fontWeight:700, color:"var(--ink)" }}>{v.year}</span>
      </div>

      {/* Body */}
      <div style={{ padding:"18px 18px 20px", display:"flex", flexDirection:"column", flex:1 }}>
        <h3 style={{ fontFamily:"var(--font-d)", fontSize:15, fontWeight:700, marginBottom:10, lineHeight:1.3 }}>
          {v.brand_name} {v.model_name}
        </h3>

        <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:10 }}>
          <span className="tag"><i className="bi bi-gear" style={{ fontSize:10 }} />{v.transmission}</span>
          {v.engine_size && <span className="tag"><i className="bi bi-speedometer2" style={{ fontSize:10 }} />{v.engine_size} CC</span>}
          <span className={condTag}>{v.condition_display}</span>
        </div>

        <p style={{ fontSize:12.5, color:"var(--ink-3)", lineHeight:1.5, marginBottom:14, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden", flex:1 }}>
          {v.description}
        </p>

        {v.condition_score && (
          <div style={{ marginBottom:12 }}>
            <span className="stars" style={{ fontSize:11 }}>{stars(v.condition_score)}</span>
          </div>
        )}

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:12, borderTop:"1px solid var(--tag-bg)" }}>
          <span className="price">{fmt(v.price, v.currency)}</span>
          <span style={{ fontSize:10.5, background:"var(--tag-bg)", color:"var(--ink-2)", borderRadius:5, padding:"3px 9px", fontWeight:600, textTransform:"uppercase", letterSpacing:.5 }}>
            {v.listing_type === "private_seller" ? "Private" : "Import"}
          </span>
        </div>
      </div>
    </div>
  );
}

function PlaceholderCar({ brand, type }) {
  const colors = {
    Toyota:"#eb0a1e","Mercedes-Benz":"#00adef",BMW:"#0166b1","Land Rover":"#005a2b",
    Subaru:"#003399",Mazda:"#c00000",Volkswagen:"#001e50",Audi:"#bb0a14",
    Peugeot:"#003189",Honda:"#cc0000",
  };
  const c = colors[brand] || "#333";

  if (type === "motorcycle") return (
    <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:`linear-gradient(135deg,${c}12,${c}25)` }}>
      <i className="bi bi-bicycle" style={{ fontSize:60, color:c, opacity:.6 }} />
      <span style={{ fontSize:11, fontWeight:700, color:c, opacity:.7, marginTop:8, letterSpacing:1 }}>{brand}</span>
    </div>
  );

  return (
    <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:`linear-gradient(135deg,${c}12,${c}25)`, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(circle at 30% 40%,${c}18 0%,transparent 55%)` }} />
      <i className="bi bi-car-front-fill" style={{ fontSize:64, color:c, opacity:.55 }} />
      <span style={{ fontSize:11, fontWeight:700, color:c, opacity:.8, marginTop:8, letterSpacing:1 }}>{brand}</span>
    </div>
  );
}