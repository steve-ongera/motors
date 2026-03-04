import { useState, useEffect } from "react";

const LINKS = [
  { key:"home",     label:"Home"          },
  { key:"vehicles", label:"Vehicles"      },
  { key:"bikes",    label:"Bikes"         },
  { key:"sell",     label:"Sell Your Car" },
  { key:"about",    label:"About"         },
  { key:"contact",  label:"Contact"       },
  { key:"faqs",     label:"FAQ"           },
];

export default function Navbar({ page, setPage }) {
  const [scrolled,  setScrolled]  = useState(false);
  const [drawerOpen,setDrawerOpen]= useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setDrawerOpen(false); }, [page]);

  const go = (p) => { setPage(p); window.scrollTo({ top:0 }); };

  return (
    <>
      <style>{`
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 900;
          height: var(--nav-h);
          background: rgba(245,244,240,.97);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid ${scrolled ? "var(--border)" : "transparent"};
          box-shadow: ${scrolled ? "var(--shadow-sm)" : "none"};
          transition: border-color .3s, box-shadow .3s;
        }
        .navbar-inner {
          max-width: 1300px; margin: 0 auto; padding: 0 5%;
          height: 100%; display: flex; align-items: center; gap: 0;
        }
        .nav-logo { display:flex; align-items:center; gap:10px; cursor:pointer; margin-right:32px; }
        .nav-logo-mark {
          width:36px; height:36px; background:var(--ink); border-radius:8px;
          display:flex; align-items:center; justify-content:center;
        }
        .nav-logo-mark span { color:#fff; font-family:var(--font-d); font-weight:800; font-size:18px; line-height:1; }
        .nav-logo-text { font-family:var(--font-d); font-weight:800; font-size:16px; letter-spacing:-.3px; white-space:nowrap; }
        .nav-logo-text span { font-weight:300; }
        .nav-links { display:flex; align-items:center; gap:2px; flex:1; }
        .nav-link {
          background:none; border:none; cursor:pointer;
          font-family:var(--font-b); font-size:13.5px; font-weight:500;
          color:var(--ink-2); padding:7px 11px; border-radius:6px;
          transition:color var(--tr), background var(--tr);
          position:relative;
        }
        .nav-link:hover  { color:var(--ink); background:var(--tag-bg); }
        .nav-link.active { color:var(--ink); font-weight:600; }
        .nav-link.active::after {
          content:''; position:absolute; bottom:2px; left:50%; transform:translateX(-50%);
          width:18px; height:2px; background:var(--accent); border-radius:2px;
        }
        /* Mobile drawer */
        .mobile-drawer {
          position:fixed; top:0; left:0; bottom:0; width:280px;
          background:var(--surface); z-index:850;
          transform: translateX(-100%); transition: transform .3s cubic-bezier(.4,0,.2,1);
          display:flex; flex-direction:column; padding:24px 0;
          box-shadow: var(--shadow-lg);
        }
        .mobile-drawer.open { transform:translateX(0); }
        .drawer-header { display:flex; align-items:center; justify-content:space-between; padding:0 20px 24px; border-bottom:1px solid var(--border); }
        .drawer-close  { width:36px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; color:var(--ink-2); transition:background var(--tr); }
        .drawer-close:hover { background:var(--tag-bg); color:var(--ink); }
        .drawer-links  { flex:1; overflow-y:auto; padding:16px 12px; display:flex; flex-direction:column; gap:4px; }
        .drawer-link {
          display:flex; align-items:center; gap:12px;
          padding:13px 16px; border-radius:var(--r-sm);
          font-family:var(--font-d); font-size:15px; font-weight:600;
          color:var(--ink-2); transition:all var(--tr); cursor:pointer;
        }
        .drawer-link:hover  { background:var(--tag-bg); color:var(--ink); }
        .drawer-link.active { background:var(--ink); color:#fff; }
        .drawer-link i { font-size:18px; }
        .drawer-footer { padding:20px; border-top:1px solid var(--border); }
      `}</style>

      <nav className="navbar">
        <div className="navbar-inner">
          {/* Logo */}
          <div className="nav-logo" onClick={() => go("home")}>
            <div className="nav-logo-mark"><span>A</span></div>
            <span className="nav-logo-text">AUTO<span>MARKET</span></span>
          </div>

          {/* Desktop links */}
          <div className="nav-links hide-mobile">
            {LINKS.map(l => (
              <button
                key={l.key}
                className={`nav-link ${page === l.key ? "active" : ""}`}
                onClick={() => go(l.key)}
              >{l.label}</button>
            ))}
          </div>

          {/* Desktop CTA */}
          <button className="btn btn-dark btn-sm hide-mobile" onClick={() => go("sell")} style={{ marginLeft:"auto" }}>
            <i className="bi bi-car-front-fill" />
            Sell My Car
          </button>

          {/* Mobile hamburger */}
          <button
            className="show-mobile btn btn-ghost btn-icon"
            style={{ marginLeft:"auto" }}
            onClick={() => setDrawerOpen(o => !o)}
            aria-label="Open menu"
          >
            <i className={`bi ${drawerOpen ? "bi-x-lg" : "bi-list"}`} style={{ fontSize:22 }} />
          </button>
        </div>
      </nav>

      {/* Overlay */}
      <div className={`overlay ${drawerOpen ? "open" : ""}`} onClick={() => setDrawerOpen(false)} />

      {/* Mobile drawer */}
      <div className={`mobile-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <div className="nav-logo" onClick={() => go("home")} style={{ marginRight:0 }}>
            <div className="nav-logo-mark"><span>A</span></div>
            <span className="nav-logo-text">AUTO<span>MARKET</span></span>
          </div>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)}>
            <i className="bi bi-x-lg" style={{ fontSize:18 }} />
          </button>
        </div>

        <div className="drawer-links">
          {LINKS.map(l => {
            const icons = { home:"bi-house", vehicles:"bi-car-front", bikes:"bi-bicycle", sell:"bi-tag", about:"bi-info-circle", contact:"bi-envelope", faqs:"bi-question-circle" };
            return (
              <div
                key={l.key}
                className={`drawer-link ${page === l.key ? "active" : ""}`}
                onClick={() => go(l.key)}
              >
                <i className={`bi ${icons[l.key] || "bi-chevron-right"}`} />
                {l.label}
              </div>
            );
          })}
        </div>

        <div className="drawer-footer">
          <button className="btn btn-dark" style={{ width:"100%" }} onClick={() => go("sell")}>
            <i className="bi bi-plus-lg" /> List Your Car
          </button>
        </div>
      </div>
    </>
  );
}