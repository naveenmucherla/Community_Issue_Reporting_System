# CivicFix – AI-Powered Community Issue Reporting Platform 🏙️🤖

![CivicFix Banner](https://img.shields.io/badge/CivicFix-v1.0.0-1677FF?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-MIT-success?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/AI-Google%20Gemini%20Vision-722ED1?style=for-the-badge)

**CivicFix** is a full-stack, enterprise-grade, production-ready web platform that empowers citizens to report public infrastructure issues (*potholes, garbage overflow, water leakage, broken streetlights, sewage, fallen trees*) directly to responsible municipal government departments with automated AI image classification, real-time dispatch map tracking, SLA resolution timelines, and executive analytics.

---

## 🌟 Key Features

- **🤖 Google Gemini Vision AI Integration**: Automatically classifies uploaded complaint photos into categories (*Pothole, Garbage, Water Leakage, Streetlight, Sewage, Road Damage, Illegal Dumping*), calculates confidence score, assigns priority, and routes to responsible municipal departments. Includes a smart client-side Vision fallback for zero-setup demo mode.
- **🗺️ Interactive City Dispatch Map (`react-leaflet`)**: Real-time Leaflet map displaying status-coded markers (Yellow = Pending, Blue = In Progress, Green = Resolved, Red = Rejected) with clickable issue drawers and GPS location pinning.
- **👥 Role-Based Portals & Dashboards**:
  - **Citizen Portal**: Report issues, track status, upvote community reports (with duplicate vote prevention & confetti animations), edit/delete complaints, bookmark issues.
  - **Department Officer Portal**: Department dispatch queue (*PWD, Sanitation, Water Board, Electrical, Traffic*), update status, upload resolution proof photos, set estimated completion dates, log work notes.
  - **Municipal Administrator Portal**: Recharts data visualizations (Monthly trends area chart, category pie chart, department workload bar chart, resolution SLA rate gauge), user management, department provisioner, CSV report export.
- **💬 Real-Time Discussion & Sharing**: Verified officer badges, QR Code sharing modal, printable official PDF report generator, dark/light mode toggle, and quick demo persona switcher.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, ES2023 JavaScript, Ant Design, React Router v7, Framer Motion, TanStack Query, Day.js, Canvas Confetti.
- **Mapping & Charts**: React Leaflet, OpenStreetMap, Recharts.
- **AI**: Google Gemini Vision API (`@google/genai`).
- **Backend & PDF**: Firebase (Auth, Firestore, Storage), jsPDF, html2canvas.

---

## ⚡ Quick Start & Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/naveenmucherla/Community_Issue_Reporting_System.git
   cd Community_Issue_Reporting_System
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables** (Optional):
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GEMINI_API_KEY=your_google_gemini_api_key
   ```
   *(Note: The platform features an automated sandbox mode with pre-populated municipal datasets and client-side vision AI, so it runs seamlessly out of the box even without external API keys!)*

4. **Run Local Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🔒 Security Rules

- `firestore.rules`: Enterprise Firestore collection-level access rules for `users`, `issues`, `comments`, `notifications`, and `departments`.
- `storage.rules`: Image format and size limit validation rules.

---

## 📄 License

Distributed under the MIT License.
