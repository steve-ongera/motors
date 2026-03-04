# AutoMarket KE — Full Stack Car Marketplace

**Frontend**: React 18 + Vite · Bootstrap Icons · Custom CSS  
**Backend**: Django 4 + Django REST Framework

---

## 📁 Project Structure

```
automarket/
├── backend/               ← Django REST API
│   ├── automarket/        ← Project settings, urls, wsgi
│   └── vehicles/          ← Main app: models, views, serializers, admin
│
automarket-frontend/       ← React SPA
├── src/
│   ├── App.jsx            ← Main router (page state machine)
│   ├── global_styles.css  ← All styles + Bootstrap Icons import
│   ├── services/
│   │   └── api.js         ← All API calls to Django backend
│   ├── hooks/
│   │   └── useFetch.js    ← Custom data fetching hooks
│   ├── components/
│   │   ├── Navbar.jsx     ← Responsive nav + mobile drawer
│   │   ├── Footer.jsx     ← Footer with links
│   │   ├── VehicleCard.jsx← Reusable vehicle card
│   │   ├── Toast.jsx      ← Notification toast
│   │   └── Skeleton.jsx   ← Loading skeletons
│   └── pages/
│       ├── HomePage.jsx        ← Hero, featured, search, stats
│       ├── VehicleListPage.jsx ← Listing with filters + sidebar
│       ├── VehicleDetailPage.jsx← Full vehicle detail + enquiry form
│       ├── SellCarPage.jsx     ← Sell request form
│       ├── FAQsPage.jsx        ← Accordion FAQs from backend
│       ├── ContactPage.jsx     ← Contact form + info
│       └── AboutPage.jsx       ← About / values
```

---

## 🚀 Backend Setup

```bash
cd automarket/backend

# 1. Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install django djangorestframework django-cors-headers \
            pillow python-slugify django-filter

# 3. Run migrations
python manage.py makemigrations vehicles
python manage.py migrate

# 4. Create superuser
python manage.py createsuperuser

# 5. Seed sample data (brands, models, FAQs)
python manage.py seed_data

# 6. Run server
python manage.py runserver
```

Backend runs at: **http://localhost:8000**  
Admin panel: **http://localhost:8000/admin**

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vehicles/` | List vehicles (filterable) |
| GET | `/api/vehicles/{slug}/` | Vehicle detail |
| GET | `/api/vehicles/featured/` | Featured vehicles |
| GET | `/api/vehicles/{slug}/similar/` | Similar vehicles |
| GET | `/api/vehicles/stats/` | Platform stats |
| GET | `/api/brands/` | All brands |
| GET | `/api/brands/{slug}/models/` | Models for a brand |
| GET | `/api/vehicle-models/` | All models |
| GET | `/api/faqs/` | FAQ list |
| POST| `/api/enquiries/` | Submit vehicle enquiry |
| POST| `/api/sell-requests/` | Submit sell request |
| POST| `/api/contact/` | Send contact message |

### Vehicle Filters (query params)

```
?vehicle_type=car           # car | motorcycle
?brand_slug=toyota
?model_slug=toyota-fielder
?condition=kenyan_used      # kenyan_used | foreign_used | new
?transmission=automatic     # automatic | manual
?min_price=1000000
?max_price=5000000
?min_year=2015
?max_year=2022
?search=fielder             # full-text search
?ordering=-price            # sort field
?page=1                     # pagination
```

---

## 🎨 Frontend Setup

```bash
cd automarket-frontend

# 1. Install dependencies
npm install

# 2. Configure API URL
cp .env.example .env
# Edit .env → VITE_API_URL=http://localhost:8000/api

# 3. Start dev server
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 📱 Features

- ✅ Responsive on all screen sizes (mobile, tablet, desktop)
- ✅ Mobile slide-in sidebar drawer with all filters
- ✅ Real-time search with debounce
- ✅ Filter by: brand, model, budget, year, condition, transmission
- ✅ Pagination
- ✅ Enquiry form → saved to Django backend
- ✅ Sell car form → saved to Django backend
- ✅ Contact form → saved to Django backend
- ✅ FAQs loaded from backend with accordion
- ✅ Featured vehicles from backend
- ✅ Vehicle stats (total, brands, etc.) from backend
- ✅ Similar vehicles per listing
- ✅ Bootstrap Icons throughout
- ✅ Skeleton loaders during fetch
- ✅ Toast notifications
- ✅ SEO-ready (meta tags, structured data, slugs)
- ✅ Django Admin for full content management

---

## 🛠 Adding Vehicles

1. Go to **http://localhost:8000/admin**
2. Log in with your superuser credentials
3. Under **Vehicles → Vehicles**, click **Add Vehicle**
4. Upload images, set all specs, mark as featured if needed
5. The vehicle will immediately appear on the frontend

---

## 🌍 SEO Slugs

All vehicles use SEO-friendly slugs:
- `/api/vehicles/2018-toyota-land-cruiser-200series/`
- Auto-generated from brand + model + year
- Unique collision handling built-in