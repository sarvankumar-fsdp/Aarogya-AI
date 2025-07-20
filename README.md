# Aarogya AI – Your AI Health Companion

**Built at Suprathon for Bharat**

Aarogya AI is a comprehensive AI-powered health assistant platform designed for India. It simplifies healthcare access through intelligent technology — available via web browsers and mobile devices, with support for multiple languages. Whether it's sleep health, dermatological concerns, medication guidance, or emergency care, Aarogya AI provides reliable support.

---

## Core Features

### AI Health Chatbot

- An intelligent assistant capable of addressing basic health queries.
- Personalized medicine usage guidance.
- Powered by LLaMA and Gemini APIs.
- Dark mode supported, featuring a clean chat interface.
- Upcoming: Image-to-chat capabilities and prescription uploads.

---

## Health Analysis Modules

### Skin Issues Analyzer

- Upload or capture a photo to analyze skin conditions.
- Provides AI-driven insights on:
  - Condition identification (e.g., acne, eczema).
  - Severity assessment.
  - Care advice and treatment suggestions.
- Backed by custom machine learning models.

---

### Sleep Pattern Analyzer

- Track sleep by inputting the past 7 days of sleep hours.
- Visual dashboards displaying:
  - Trends and patterns via interactive charts.
  - AI-generated insights on sleep quality.
- Daily input prompts available via a dedicated endpoint.
- Data is securely stored using Supabase.

---

### Medicine Reminder & Tracker

- Chatbot-guided medicine usage information.
- Capability to remind users about medication schedules.
- Upcoming enhancements include customizable medication schedules.
- Suggests medications based on disease input through both manual entry and AI recommendations.

---

### AI Health Input via Camera

- Allows direct photo uploads or camera capture within the web app.
- Designed for identifying skin and visual symptoms.
- Planned extensions to support analysis of wounds, rashes, and fever-related scans.

---

### Prescription Vault (Coming Soon)

- Securely upload and store medical prescriptions.
- Optical Character Recognition (OCR) for reading prescriptions.
- Enables querying prescriptions via the health chatbot.
- Facilitates long-term chronic care tracking.

---

### Voice Mode (Planned)

- Initial voice-to-text input support, now being re-envisioned.
- Future accessibility features planned, including multilingual support in Hindi, Telugu, and more.

---

## Technology Stack

| Frontend   | Backend            | AI/ML & APIs | Database   |
| ---------- | ------------------ | ------------ | ---------- |
| Next.js    | Node.js, Next API   | LLaMA, Gemini APIs, Custom ML Models | Supabase   |
| Tailwind CSS | REST APIs, Edge Functions | Google Maps API | PostgreSQL |
| Chart.js   | TypeScript         |              |            |

---

## Vision

Aarogya AI is built with a mission to make healthcare in India accessible, proactive, and intelligent. The platform aims to serve rural populations, students, senior citizens, and frontline personnel by providing tech-enabled healthcare solutions that are both user-friendly and effective.

---

## Roadmap

- Progressive Web App (PWA) for Android.
- Prescription upload with OCR support.
- Multilingual voice assistant integration.
- Collaboration with government healthcare initiatives.

---

## Developed By

**Team Code Hawk**  
**Sarvan Kumar** – Team Lead and Developer

---

## Getting Started

To run the project locally:

```bash
git clone https://github.com/your-username/aarogya-ai
cd aarogya
npm install
npm run dev
```
