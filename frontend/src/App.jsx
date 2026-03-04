import { useState, useEffect } from "react";
import "./global_styles.css";

import Navbar          from "./components/Navbar";
import Footer          from "./components/Footer";
import HomePage        from "./pages/HomePage";
import VehicleListPage from "./pages/VehicleListPage";
import VehicleDetailPage from "./pages/VehicleDetailPage";
import SellCarPage     from "./pages/SellCarPage";
import FAQsPage        from "./pages/FAQsPage";
import ContactPage     from "./pages/ContactPage";
import AboutPage       from "./pages/AboutPage";

/**
 * Page state can be:
 *  - string: "home" | "vehicles" | "bikes" | "sell" | "faqs" | "contact" | "about"
 *  - object: { name:"vehicles", search:"...", budget:{...}, brand:"..." }
 *  - object: { name:"vehicle",  slug:"2018-toyota-..."  }
 */

export default function App() {
  const [page, setPage] = useState("home");

  // Scroll to top on page change
  useEffect(() => { window.scrollTo({ top:0, behavior:"smooth" }); }, [page]);

  // Resolve page name string for navbar active state
  const pageName = typeof page === "string" ? page : page?.name || "home";

  // ── Render page ────────────────────────────────────────────────
  const renderPage = () => {
    const name = typeof page === "string" ? page : page?.name;

    switch (name) {
      case "home":
        return <HomePage setPage={setPage} />;

      case "vehicles":
        return (
          <VehicleListPage
            setPage={setPage}
            vehicleType="car"
            initialSearch={page?.search || ""}
            initialBudget={page?.budget || null}
            initialBrand={page?.brand   || ""}
          />
        );

      case "bikes":
        return (
          <VehicleListPage
            setPage={setPage}
            vehicleType="motorcycle"
          />
        );

      case "vehicle":
        return (
          <VehicleDetailPage
            slug={page?.slug}
            setPage={setPage}
          />
        );

      case "sell":
        return <SellCarPage setPage={setPage} />;

      case "faqs":
        return <FAQsPage setPage={setPage} />;

      case "contact":
        return <ContactPage setPage={setPage} />;

      case "about":
        return <AboutPage setPage={setPage} />;

      default:
        return (
          <div className="page-wrapper" style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"70vh" }}>
            <div style={{ textAlign:"center" }}>
              <i className="bi bi-map" style={{ fontSize:64, color:"var(--border)", display:"block", marginBottom:20 }} />
              <h2 style={{ fontFamily:"var(--font-d)", marginBottom:12 }}>Page Not Found</h2>
              <p style={{ color:"var(--ink-3)", marginBottom:28 }}>The page you're looking for doesn't exist.</p>
              <button className="btn btn-dark" onClick={() => setPage("home")}>Go Home</button>
            </div>
          </div>
        );
    }
  };

  // Detail page has its own footer inside, skip global footer for it
  const showFooter = pageName !== "vehicle";

  return (
    <>
      <Navbar page={pageName} setPage={setPage} />
      <main>
        {renderPage()}
      </main>
      {showFooter && <Footer setPage={setPage} />}
    </>
  );
}