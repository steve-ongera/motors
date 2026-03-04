export function SkeletonCard() {
  return (
    <div className="card" style={{ overflow:"hidden" }}>
      <div className="skeleton" style={{ height:200 }} />
      <div style={{ padding:"18px 18px 20px", display:"flex", flexDirection:"column", gap:10 }}>
        <div className="skeleton" style={{ height:18, width:"70%" }} />
        <div style={{ display:"flex", gap:8 }}>
          <div className="skeleton" style={{ height:22, width:70, borderRadius:6 }} />
          <div className="skeleton" style={{ height:22, width:70, borderRadius:6 }} />
          <div className="skeleton" style={{ height:22, width:80, borderRadius:6 }} />
        </div>
        <div className="skeleton" style={{ height:13, width:"90%" }} />
        <div className="skeleton" style={{ height:13, width:"75%" }} />
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
          <div className="skeleton" style={{ height:22, width:130 }} />
          <div className="skeleton" style={{ height:22, width:60, borderRadius:5 }} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 400px", gap:48, padding:"40px 0" }}>
      <div>
        <div className="skeleton" style={{ height:420, borderRadius:"var(--r-lg)" }} />
        <div style={{ display:"flex", gap:10, marginTop:12 }}>
          {[...Array(5)].map((_,i) => <div key={i} className="skeleton" style={{ height:72, flex:1, borderRadius:10 }} />)}
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        <div className="skeleton" style={{ height:14, width:"40%" }} />
        <div className="skeleton" style={{ height:36, width:"85%" }} />
        <div className="skeleton" style={{ height:80 }} />
        <div className="skeleton" style={{ height:44, borderRadius:8 }} />
        <div className="skeleton" style={{ height:44, borderRadius:8 }} />
        <div className="skeleton" style={{ height:200, borderRadius:"var(--r-md)" }} />
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {[...Array(lines)].map((_,i) => (
        <div key={i} className="skeleton" style={{ height:14, width: i === lines-1 ? "60%" : "100%" }} />
      ))}
    </div>
  );
}