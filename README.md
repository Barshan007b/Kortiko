<div align="center">
  <h1>🛕 KORTIKO INDIA</h1>
  <h3><em>Curated Choices, Delivered with Royal Care.</em></h3>
  <br/>
  <img src="https://img.shields.io/badge/India-Premium%20Platform-C5A059?style=for-the-badge&logo=google-cloud&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Cloud%20Run-Deployed-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
  <br/><br/>
  <strong>🔗 Live Demo:</strong> <a href="https://kortiko-platform-925858370178.us-central1.run.app">https://kortiko-platform-925858370178.us-central1.run.app</a>
</div>

---

## 🇮🇳 About Kortiko India

**Kortiko** is a **luxury food and grocery curation platform** designed for the discerning Indian consumer. It offers a dual-commerce model — curating both **chef-crafted gourmet meals** (Dum Biryani, Galouti Kebabs) and **premium lifestyle groceries** (Devgad Alphonso Mangoes, Kashmiri Mogra Saffron, A2 Gir Cow Ghee) — all under one premium editorial experience.

The platform is built with an **editorial magazine aesthetic** — obsidian black, champagne gold, and royal serif typography — reflecting the prestige of India's finest culinary heritage.

---

## ✨ Core Features

| Feature | Description | Status |
|---|---|---|
| 🍽️ **Dual Commerce** | Seamlessly order gourmet meals + artisanal groceries in a single cart | ✅ Live |
| 🤖 **AI Concierge** | Keyword-based AI that understands Biryani, Saffron, Ghee, Ayurveda queries | ✅ Live |
| ⭐ **Priority Tiers** | Elite, Preferred, Standard — with free Express Dispatch for Elite members | ✅ Live |
| 💳 **Order & Checkout** | Full cart system, INR currency, product images in checkout, order submission | ✅ Live |
| 📬 **Contact Concierge** | Form submission to backend, saved to database | ✅ Live |
| 🔍 **Product Filtering** | Filter by Food, Grocery, or Featured Only | ✅ Live |
| 🥗 **Dietary Badges** | Visual Veg/Non-Veg indicators for all food and grocery items | ✅ Live |
| 🎨 **Premium UI** | Luxurious dark background, glassmorphism, separated food & grocery sections | ✅ Live |
| 📱 **Responsive Design** | Fully adaptive for mobile, tablet, and desktop | ✅ Live |
| ☁️ **Cloud Deployed** | Containerized and running on Google Cloud Run | ✅ Live |

---

## 🏗️ System Architecture

```
Kortiko/
│
├── backend/                  # Python FastAPI Application
│   ├── main.py               # API routes + Static file serving
│   ├── models.py             # SQLAlchemy ORM models
│   ├── schemas.py            # Pydantic request/response schemas
│   ├── database.py           # DB engine, session management
│   ├── seed_data.py          # Indian product catalog seeder
│   └── ai_engine.py          # Keyword-based AI Concierge engine
│
├── frontend/                 # Vanilla HTML/CSS/JS Frontend
│   ├── index.html            # Main storefront (hero, products, filters)
│   ├── checkout.html         # Cart review + order placement
│   ├── contact.html          # Concierge inquiry form
│   ├── about.html            # Brand story + philosophy
│   ├── styles/
│   │   └── main.css          # Full design system (tokens, animations)
│   └── js/
│       └── main.js           # Product fetch, cart, AI chat, filters
│
├── Dockerfile                # Production container definition
├── requirements.txt          # Python dependencies
└── README.md                 # You are here
```

---

## 🗃️ Data Models

### Product
| Field | Type | Description |
|---|---|---|
| `id` | Integer | Primary key |
| `name` | String | Product display name |
| `description` | Text | Editorial description |
| `price` | Float | Price in INR (₹) |
| `image_url` | String | Unsplash image URL |
| `category` | String | `Food` or `Grocery` |
| `subcategory` | String | Chef Specials, Pantry, etc. |
| `is_featured` | Boolean | Featured on homepage |

### User (Priority Tier System)
| Field | Type | Description |
|---|---|---|
| `email` | String | User email |
| `full_name` | String | Display name |
| `priority_tier` | String | `Elite`, `Preferred`, `Standard` |
| `rfm_score` | Float | Recency-Frequency-Monetary score (0–10) |

### Order & OrderItem
Linked many-to-one. Each order has a `priority` level (1=Elite) for dispatch queue management.

---

## 🛍️ Curated Indian Catalog (Seeded)

### 🍽️ Gourmet Food
- **Saffron Infused Dum Biryani** — ₹1,250 *(Chef Special, Featured)*
- **Truffle Malai Broccoli** — ₹650 *(Gourmet Meals, Featured)*
- **Jackfruit Galouti Kebab** — ₹550 *(Starters)*

### 🌿 Lifestyle Grocery
- **A+ Grade Alphonso Mangoes** (Devgad) — ₹1,800 *(Featured)*
- **Kashmiri Mogra Saffron 1g** — ₹450 *(Featured)*
- **Single-Origin Araku Valley Coffee** — ₹850
- **Cold-Pressed A2 Gir Cow Ghee** — ₹1,500

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Python 3.9+
- pip

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Initialize & Seed the Database
```bash
python -m backend.seed_data
```
> This populates the SQLite DB (`kortiko.db`) with the full Indian product catalog and a demo Elite user (`Arjun Malhotra`).

### 3. Run the Backend Server
```bash
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
> The backend now **also serves the frontend**. Navigate to `http://127.0.0.1:8000` to see the full app.

### 4. (Optional) Standalone Frontend Server
If you prefer to use VS Code Live Server or a separate static server:
```bash
# From inside the frontend/ directory
python -m http.server 8080
```
Then open `http://localhost:8080`

### API Documentation
```
http://127.0.0.1:8000/docs
```
Interactive Swagger UI is auto-generated by FastAPI.

---

## ☁️ Cloud Deployment (Google Cloud Run)

The platform is containerized with Docker and deployed to Cloud Run.

### Re-deploy (after any changes)
```bash
gcloud run deploy kortiko-platform \
  --source . \
  --project gfg-x-gdg-1 \
  --region us-central1 \
  --allow-unauthenticated
```

### Architecture on Cloud Run
```
[User Browser]
      │
      ▼
[Cloud Run: kortiko-platform]
      │
      ├── GET /               → Serves frontend/index.html
      ├── GET /styles/**      → Serves frontend/styles/
      ├── GET /js/**          → Serves frontend/js/
      ├── GET /{page}.html    → Serves frontend/{page}.html
      │
      ├── GET  /products      → FastAPI: Returns product list
      ├── POST /orders        → FastAPI: Creates order in SQLite
      ├── POST /chat          → FastAPI: AI Concierge response
      └── POST /contact-submit→ FastAPI: Saves contact inquiry
```

> **Note:** The current deployment uses **SQLite** which resets on new container revision. For production persistence, migrate to **Cloud SQL (PostgreSQL)** — this is a planned future enhancement.

---

## 🤖 AI Concierge — How It Works

The AI engine is a keyword-based intent classifier (no external API required).

| Your Query | Intent Detected | Response Type |
|---|---|---|
| *"biryani"*, *"desi food"* | `food` | Recommends gourmet meal catalog |
| *"mango"*, *"saffron"*, *"ghee"* | `grocery` | Recommends specific Indian items |
| *"wellness"*, *"ayurveda"* | `both` | Recommends A2 Ghee + organic items |
| *"dinner"* | `food` | Suggests Dum Biryani for tonight |
| *"breakfast"* | `food` | Suggests modern Indian breakfast items |
| *(anything else)* | `general` | Shows featured items |

**Future Enhancement:** Replace with Gemini API for true natural language understanding.

---

## 🗺️ Roadmap — Future Enhancements

- [ ] 🔐 **User Authentication** — JWT-based login/signup with OTP (Indian mobile)
- [ ] 🧠 **Gemini AI Integration** — Replace keyword AI with Gemini Pro for conversational shopping
- [ ] 🗺️ **Live Delivery Tracking** — Real-time map tracking for Elite dispatches
- [ ] 💳 **Razorpay/UPI Integration** — Indian payment gateway support
- [ ] 🗄️ **Cloud SQL Migration** — Persistent PostgreSQL instead of SQLite
- [ ] 📊 **Admin Dashboard** — Order management, inventory, RFM analytics
- [ ] 📱 **PWA Support** — Install as a mobile app
- [ ] 🌐 **Multi-language** — Hindi and regional language support
- [ ] 🎁 **Subscription Boxes** — Weekly curated grocery/meal boxes
- [ ] ⭐ **Reviews & Ratings** — User feedback system per product

---

## 🐛 Known Issues & Troubleshooting

### Products not loading on homepage
- **Cause:** Backend server not running.
- **Fix:** Run `uvicorn backend.main:app --host 127.0.0.1 --port 8000`

### `Database already seeded` but products are old
- **Cause:** Old `kortiko.db` file from previous build.
- **Fix:** Delete `kortiko.db` and re-run `python -m backend.seed_data`

### Cloud deployment shows unstyled page
- **Cause:** Static asset paths not being served correctly.
- **Fix:** The backend mounts `/styles`, `/js`, `/assets` separately. Ensure `frontend/` folder is present in the Docker build context.

### `sqlite3` import error in requirements.txt
- **Cause:** `sqlite3` is a built-in Python module, not a pip package.
- **Fix:** Remove it from `requirements.txt` (already corrected in this version).

---

## 💬 Found an Issue? Want to Contribute?

This project is actively being developed. If you find a bug or have an idea:

1. **Open an Issue** on GitHub describing the problem
2. **Fork the repo**, make your changes, and open a **Pull Request**
3. **Contact the Concierge** at `elite@kortiko.in` for business inquiries

All contributions — big or small — are welcome! 🙏

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, Vanilla CSS3, Vanilla JavaScript (ES6+) |
| **Backend** | FastAPI (Python 3.9+) |
| **ORM** | SQLAlchemy |
| **Database** | SQLite (local) → Cloud SQL PostgreSQL (planned) |
| **Container** | Docker |
| **Cloud** | Google Cloud Run |
| **AI Engine** | Keyword Intent Classifier (Gemini integration planned) |
| **Typography** | Playfair Display + Outfit (Google Fonts) |
| **Design System** | Obsidian (#0A0A0A), Champagne Gold (#C5A059) |

---

<div align="center">
  <br/>
  <strong>Built with 🧡 for India's premium lifestyle consumer.</strong>
  <br/>
  <em>KORTIKO — Where Curation Meets Care.</em>
  <br/><br/>
  <img src="https://img.shields.io/badge/Made%20in-India%20🇮🇳-FF9933?style=flat-square" />
</div>
