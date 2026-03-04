import { useState, useEffect, useCallback } from "react";
import VehicleCard from "../components/VehicleCard";
import { SkeletonCard } from "../components/Skeleton";
import { vehiclesApi, brandsApi, modelsApi } from "../services/api";

const BUDGET_RANGES = [
  { label:"0 – 500K",   min:0,       max:500000   },
  { label:"500K – 1M",  min:500000,  max:1000000  },
  { label:"1M – 2M",    min:1000000, max:2000000  },
  { label:"2M – 3M",    min:2000000, max:3000000  },
  { label:"3M – 5M",    min:3000000, max:5000000  },
  { label:"5M – 10M",   min:5000000, max:10000000 },
  { label:"Above 10M",  min:10000000,max:null     },
];

export default function VehicleListPage({ setPage, vehicleType = "car", initialSearch, initialBudget, initialBrand }) {
  const [vehicles,    setVehicles]    = useState([]);
  const [brands,      setBrands]      = useState([]);
  const [models,      setModels]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [total,       setTotal]       = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filters
  const [search,      setSearch]      = useState(initialSearch || "");
  const [draftSearch, setDraftSearch] = useState(initialSearch || "");
  const [brand,       setBrand]       = useState(initialBrand || "");
  const [model,       setModel]       = useState("");
  const [condition,   setCondition]   = useState("");
  const [transmission,setTransmission]= useState("");
  const [stockTab,    setStockTab]    = useState("both");
  const [budget,      setBudget]      = useState(initialBudget || null);
  const [minYear,     setMinYear]     = useState("");
  const [maxYear,     setMaxYear]     = useState("");
  const [sort,        setSort]        = useState("-created_at");

  // Load brands
  useEffect(() => {
    brandsApi.list().then(r => setBrands(Array.isArray(r) ? r : r.results || [])).catch(() => {});
  }, []);

  // Load models when brand changes
  useEffect(() => {
    if (!brand) { setModels([]); setModel(""); return; }
    modelsApi.list(brand).then(r => setModels(Array.isArray(r) ? r : r.results || [])).catch(() => {});
    setModel("");
  }, [brand]);

  const buildParams = useCallback(() => {
    const p = { vehicle_type: vehicleType, ordering: sort, page: currentPage };
    if (search) p.search = search;
    if (brand)  p.brand_slug = brand;
    if (model)  p.model_slug = model;
    if (condition) p.condition = condition;
    if (transmission) p.transmission = transmission;
    if (budget?.min != null) p.min_price = budget.min;
    if (budget?.max != null) p.max_price = budget.max;
    if (minYear) p.min_year = minYear;
    if (maxYear) p.max_year = maxYear;
    if (stockTab === "kenya")  p.condition = "kenyan_used";
    if (stockTab === "import") p.condition = "foreign_used";
    return p;
  }, [vehicleType, sort, currentPage, search, brand, model, condition, transmission, budget, minYear, maxYear, stockTab]);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await vehiclesApi.list(buildParams());
      setVehicles(data.results || data || []);
      setTotal(data.count || (Array.isArray(data) ? data.length : 0));
    } catch(e) {
      console.error(e);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  const applySearch = () => { setSearch(draftSearch); setCurrentPage(1); };
  const clearFilters = () => {
    setSearch(""); setDraftSearch(""); setBrand(""); setModel("");
    setCondition(""); setTransmission(""); setBudget(null);
    setMinYear(""); setMaxYear(""); setSort("-created_at");
    setStockTab("both"); setCurrentPage(1);
  };

  const totalPages = Math.ceil(total / 25);
  const title = vehicleType === "motorcycle" ? "Motorcycles" : "Vehicles";

  return (
    <div className="page-wrapper">
      {/* Page header */}
      <div style={{ background:"var(--ink)", padding:"44px 0 36px" }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom:8 }}>{total} listings</div>
          <h1 className="d2" style={{ color:"#fff", marginBottom:16 }}>{title}</h1>

          {/* Stock tabs (cars only) */}
          {vehicleType === "car" && (
            <div style={{ display:"flex", gap:4, background:"rgba(255,255,255,.08)", borderRadius:10, padding:4, width:"fit-content", flexWrap:"wrap" }}>
              {[["both","Both"],["kenya","Available in Kenya"],["import","Direct Import / International"]].map(([key,label]) => (
                <button key={key}
                  onClick={() => { setStockTab(key); setCurrentPage(1); }}
                  style={{ background:stockTab===key?"#fff":"transparent", color:stockTab===key?"var(--ink)":"#aaa", border:"none", borderRadius:8, padding:"8px 16px", fontSize:12.5, fontWeight:600, cursor:"pointer", transition:"all var(--tr)", whiteSpace:"nowrap" }}>
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ padding:"32px 5%", display:"flex", gap:36, alignItems:"flex-start" }}>

        {/* ── Sidebar overlay (mobile) ── */}
        <div className={`overlay ${sidebarOpen ? "open" : ""}`} onClick={() => setSidebarOpen(false)} />

        {/* ── Filter sidebar ── */}
        <aside style={{
          width:268, flexShrink:0,
          position:"sticky", top:"calc(var(--nav-h) + 16px)",
          maxHeight:"calc(100vh - var(--nav-h) - 32px)",
          overflowY:"auto",
          // Mobile: drawer
          ...(window.innerWidth <= 768 ? {
            position:"fixed", top:0, left:0, bottom:0, width:290, zIndex:850, overflowY:"auto",
            background:"var(--surface)", transform:sidebarOpen?"translateX(0)":"translateX(-100%)",
            transition:"transform .3s cubic-bezier(.4,0,.2,1)",
            boxShadow:"var(--shadow-lg)", padding:"72px 0 24px",
          } : {}),
        }}>
          <div style={{ padding: window.innerWidth <= 768 ? "0 20px" : 0 }}>
            {/* Mobile close */}
            {window.innerWidth <= 768 && (
              <button className="btn btn-ghost" style={{ marginBottom:16, width:"100%", justifyContent:"flex-end" }} onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-x-lg" /> Close
              </button>
            )}

            <div style={{ background:"var(--surface)", borderRadius:"var(--r-lg)", border:"1px solid var(--border)", padding:20, display:"flex", flexDirection:"column", gap:18 }}>
              {/* Search */}
              <div>
                <div className="eyebrow" style={{ marginBottom:8 }}>Search Vehicle</div>
                <p style={{ fontSize:12, color:"var(--ink-3)", marginBottom:8 }}>Write vehicle name and press search</p>
                <div style={{ display:"flex", gap:8 }}>
                  <input className="form-control" placeholder="e.g. Fielder, Prado" value={draftSearch} onChange={e => setDraftSearch(e.target.value)} onKeyDown={e => e.key==="Enter" && applySearch()} style={{ fontSize:13 }} />
                  <button className="btn btn-dark btn-icon" onClick={applySearch}><i className="bi bi-search" /></button>
                </div>
              </div>

              <div style={{ height:1, background:"var(--border)" }} />

              {/* Budget */}
              <div>
                <div className="eyebrow" style={{ marginBottom:8 }}>Filter by Budget</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {BUDGET_RANGES.map(r => (
                    <button key={r.label} className={`chip ${budget?.label===r.label?"active":""}`} style={{ fontSize:11.5, padding:"5px 10px" }}
                      onClick={() => { setBudget(budget?.label===r.label?null:r); setCurrentPage(1); }}>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ height:1, background:"var(--border)" }} />

              {/* Brand */}
              <div className="form-group">
                <label className="form-label"><i className="bi bi-grid" style={{ marginRight:6 }} />Brand</label>
                <select className="form-control" value={brand} onChange={e => { setBrand(e.target.value); setCurrentPage(1); }}>
                  <option value="">All Brands</option>
                  {brands.map(b => <option key={b.id} value={b.slug}>{b.name}</option>)}
                </select>
              </div>

              {/* Model (shows only when brand selected) */}
              {models.length > 0 && (
                <div className="form-group">
                  <label className="form-label"><i className="bi bi-diagram-3" style={{ marginRight:6 }} />Model</label>
                  <select className="form-control" value={model} onChange={e => { setModel(e.target.value); setCurrentPage(1); }}>
                    <option value="">All Models</option>
                    {models.map(m => <option key={m.id} value={m.slug}>{m.name}</option>)}
                  </select>
                </div>
              )}

              {/* Year */}
              <div>
                <label className="form-label"><i className="bi bi-calendar3" style={{ marginRight:6 }} />Year of Manufacture</label>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:6 }}>
                  <input className="form-control" placeholder="Min" type="number" min="1990" max="2025" value={minYear} onChange={e => { setMinYear(e.target.value); setCurrentPage(1); }} />
                  <input className="form-control" placeholder="Max" type="number" min="1990" max="2025" value={maxYear} onChange={e => { setMaxYear(e.target.value); setCurrentPage(1); }} />
                </div>
              </div>

              {/* Price range */}
              <div>
                <label className="form-label"><i className="bi bi-currency-dollar" style={{ marginRight:6 }} />Price & Currency</label>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:6 }}>
                  <input className="form-control" placeholder="Min Price" type="number" value={budget?.min || ""} readOnly style={{ fontSize:12 }} />
                  <input className="form-control" placeholder="Max Price" type="number" value={budget?.max || ""} readOnly style={{ fontSize:12 }} />
                </div>
              </div>

              {/* Condition */}
              <div className="form-group">
                <label className="form-label"><i className="bi bi-patch-check" style={{ marginRight:6 }} />Condition</label>
                <select className="form-control" value={condition} onChange={e => { setCondition(e.target.value); setCurrentPage(1); }}>
                  <option value="">All Conditions</option>
                  <option value="kenyan_used">Kenyan Used</option>
                  <option value="foreign_used">Foreign Used</option>
                  <option value="new">New</option>
                </select>
              </div>

              {/* Transmission */}
              <div className="form-group">
                <label className="form-label"><i className="bi bi-gear" style={{ marginRight:6 }} />Transmission</label>
                <select className="form-control" value={transmission} onChange={e => { setTransmission(e.target.value); setCurrentPage(1); }}>
                  <option value="">All</option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>

              <button className="btn btn-dark" style={{ width:"100%" }} onClick={fetchVehicles}>
                <i className="bi bi-search" /> Search
              </button>
              <button className="btn btn-ghost" style={{ width:"100%", fontSize:13 }} onClick={clearFilters}>
                <i className="bi bi-x-circle" /> Clear Filters
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div style={{ flex:1, minWidth:0 }}>
          {/* Toolbar */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:12 }}>
            <span style={{ fontSize:14, color:"var(--ink-2)" }}>
              Showing <strong style={{ color:"var(--ink)" }}>{vehicles.length}</strong>
              {total > 0 && ` of ${total.toLocaleString()}`} {title.toLowerCase()}
            </span>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              {/* Mobile filter trigger */}
              <button className="btn btn-outline btn-sm show-mobile" onClick={() => setSidebarOpen(true)}>
                <i className="bi bi-sliders" /> Filters
              </button>
              <select className="form-control" value={sort} onChange={e => { setSort(e.target.value); setCurrentPage(1); }} style={{ width:"auto", padding:"8px 32px 8px 12px", fontSize:13 }}>
                <option value="-created_at">Newest First</option>
                <option value="price">Price: Low → High</option>
                <option value="-price">Price: High → Low</option>
                <option value="-year">Year: Newest</option>
                <option value="year">Year: Oldest</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid-auto">
              {[...Array(8)].map((_,i) => <SkeletonCard key={i} />)}
            </div>
          ) : vehicles.length === 0 ? (
            <div style={{ textAlign:"center", padding:"80px 0", color:"var(--ink-3)" }}>
              <i className="bi bi-search" style={{ fontSize:52, display:"block", marginBottom:16, opacity:.3 }} />
              <p style={{ fontFamily:"var(--font-d)", fontSize:18, fontWeight:600, color:"var(--ink-2)", marginBottom:6 }}>No vehicles found</p>
              <p style={{ fontSize:14 }}>Try adjusting your filters or search term</p>
              <button className="btn btn-outline" style={{ marginTop:20 }} onClick={clearFilters}>Clear all filters</button>
            </div>
          ) : (
            <div className="grid-auto">
              {vehicles.map((v,i) => (
                <div key={v.id} className={`anim-up delay-${Math.min(i%6+1,6)}`}>
                  <VehicleCard vehicle={v} onClick={() => setPage({ name:"vehicle", slug:v.slug })} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:40, flexWrap:"wrap" }}>
              <button className="btn btn-outline btn-sm" disabled={currentPage===1} onClick={() => setCurrentPage(p => p-1)}>
                <i className="bi bi-chevron-left" />
              </button>
              {[...Array(Math.min(totalPages,7))].map((_,i) => {
                const p = i + 1;
                return (
                  <button key={p} className={`btn btn-sm ${currentPage===p?"btn-dark":"btn-outline"}`} onClick={() => setCurrentPage(p)}>
                    {p}
                  </button>
                );
              })}
              {totalPages > 7 && <span style={{ alignSelf:"center", color:"var(--ink-3)" }}>… {totalPages}</span>}
              <button className="btn btn-outline btn-sm" disabled={currentPage===totalPages} onClick={() => setCurrentPage(p => p+1)}>
                <i className="bi bi-chevron-right" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}