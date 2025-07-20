# 🏥 Aarogya AI – Your AI Health Companion

**Built at Suprathon for Bharat**

Aarogya AI is a comprehensive AI-powered health assistant platform tailored for _Bharat_. It aims to simplify healthcare access using smart technology – available in your browser, on your mobile, and in your language. Be it sleep, skin, medicine, or emergency care – _Aarogya has your back_.

---

## 🌟 Core Features

### 🧠 AI Health Chatbot

- Intelligent assistant for basic health queries
- Personalized answers for medicine usage
- Uses LLaMA / Gemini APIs behind the scenes
- Dark mode friendly, chat-style UI
- **Coming soon**: Image-to-chat + prescription uploads

---

## 🧪 Health Analysis Modules

### 📷 Skin Issues Analyzer

- Upload or **click a photo** of your skin issue
- Get AI-generated:
  - 🩺 Condition (e.g., acne, eczema)
  - 📉 Severity level
  - 🧴 Care tips & treatment suggestions
- Powered by: Custom ML Models

---

### 🌙 Sleep Pattern Analyzer

- Input your **last 7 days** of sleep hours
- Dashboard shows:
  - 📊 Graph (Chart.js)
  - 📈 Trends (improvement, decline)
  - 🤖 AI Insights on sleep quality
- Prompts user **daily** via `/sleep-details`
- Stores securely in **Supabase** (`sleep-analyzer` table)

---

### 💊 Medicine Reminder & Tracker

- Chatbot-powered usage guide
- Reminds users to take medicines
- Customizable schedule coming soon
- Based on disease input → suggests medicine (manual + AI)

---

### 📸 AI Health Input via Camera

- Users can **upload** or **click** a photo
- Use camera directly in web app
- Designed for skin & visual symptoms
- Will extend to wounds, rashes, fever scans, etc.

---

### 📂 Prescription Vault (Coming Soon)

- Upload & store all your prescriptions
- Read via OCR → Query via Chatbot
- Helps in long-term chronic care tracking

---

### 👀 Voice Mode (Coming Soon)

- Initially had **voice-to-text input**
- Currently replaced with **image upload & camera input**
- May return as part of accessibility suite (Hindi, Telugu, etc.)

---

## 🧠 Powered By

| Frontend          | Backend             | AI/ML & APIs      | Database   |
| ----------------- | ------------------- | ----------------- | ---------- |
| Next.js (App Dir) | Node.js + Next API  | ML Models, LLaMA | Supabase   |
| Tailwind CSS      | REST APIs + Edge FN | Google Maps API,  | PostgreSQL |
| Chart.js          | TypeScript          |                   |            |

---

## 🎯 Vision

India's healthcare should be accessible, proactive, and intelligent.  
_Aarogya.me_ is built to assist **rural families, students, senior citizens, and even jawans** with tech-driven healthcare — all in a click.

---

## 🔮 Roadmap

- [ ] 📱 PWA Android App
- [ ] 🧾 Prescription Upload + OCR
- [ ] 🔊 Multilingual Voice Assistant
- [ ] 📚 Integration with Government Health Schemes

---

## 🙌 Built By

👨‍💻 **Team Code Hawk**

- **Sarvan Kumar** – Team Lead (Solo Participant 😅)

---

## 📦 Run Locally

```bash
git clone https://github.com/your-username/aarogya.me.git
cd aarogya
npm install
npm run dev
```
