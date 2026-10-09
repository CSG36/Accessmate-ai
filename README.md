# AccessMate AI — Accessibility Copilot

> **PS02: Intelligent Personal / Professional Copilot**
> *“AccessMate AI turns complex visual information into simple, multilingual, actionable instructions and helps users act on them with their approval.”*

AccessMate AI is an AI-powered Accessibility Copilot that helps people with visual, reading, cognitive, or language difficulties understand and act on complex documents, notices, bills, forms, menus, and signs.

---

## 🎯 Problem Statement Addressed (PS02)

Traditional AI tools provide a single, passive text response to user inputs. PS02 requires an AI copilot that:
1. **Understands Unstructured Inputs:** Ingests dense, messy visual documents (e.g., landlord notices, fasting instructions, transit detour signs, tax assessments).
2. **Reasons Across Modalities:** Uses multimodal reasoning (Gemma 4 / Gemini) to extract meaning, urgency, and implications.
3. **Structured Outputs:** Automatically extracts deadlines, dates, financial amounts, physical addresses, required identification documents, and phone contacts.
4. **Tool Usage:** Recommends concrete actions (e.g., scheduling calendar reminders, drafting confirmation replies, verifying checklists).
5. **Human-in-the-Loop Approval:** Strictly requests human confirmation before executing any calendar event, reminder, or communication.
6. **Accessible Multimodal Experience:** Features large print scaling (100%–175%), high contrast clinical modes (Yellow on Black, Dark High Contrast, Cream Comfort), dyslexia-friendly typography (Lexend/Atkinson Hyperlegible), interactive document magnifying lens, and Web Speech API audio readouts.

---

## 🌟 Key Features

### 1. Multimodal Document Understanding
- Drag-and-drop or snapshot camera capture for letters, forms, invoices, and signs.
- Pre-loaded real-world sample documents for instant testing:
  - *Lease Renewal & Annual Safety Inspection Notice* (complex landlord deadline)
  - *Hospital Pre-Procedure & Fasting Instructions* (time-critical NPO guidance)
  - *Subway Line Disruption & Shuttle Alert* (public transit navigation)
  - *County Property Assessment & Senior Homestead Exemption* (tax savings form)

### 2. Plain-Language & ESL Simplification
- Unpacks dense legal, medical, and administrative jargon into clear 4th–5th grade plain English.
- Explains **what the document is**, **why it matters**, and **what happens if no action is taken**.

### 3. Multilingual Translation
- Instant translation into 18+ languages, including Spanish, Hindi, French, Mandarin, Arabic, Bengali, Portuguese, German, Japanese, Vietnamese, and Tagalog.

### 4. Interactive Visual Document Inspector
- **Interactive Magnifier Lens:** Hover over small print and contract footnotes with 2.5x magnification.
- **High-Contrast Inversion Filter:** Instant contrast boosting for low-vision and cataract accommodation.
- **Image Rotation & Zoom Controls:** Easy handling for photos taken at angles.

### 5. Copilot Tool Actions with Human-in-the-Loop
- Step-by-step prioritized action cards with urgency chips.
- Integrated `create_reminder` and `add_calendar_event` tools generating standard **.ics calendar files**.
- Human-in-the-Loop Approval Modal allows reviewing and modifying dates, titles, and alert notes before anything is scheduled.

---

## 🏗️ Architecture

```
accessmate-ai/
├── server.ts                  # Express full-stack backend with @google/genai SDK
├── src/
│   ├── components/
│   │   ├── UploadBox.tsx       # Drag/drop, camera capture & sample picker
│   │   ├── DocumentPreview.tsx # Visual inspector with magnifier & high contrast
│   │   ├── AnalysisResult.tsx  # Plain speech breakdown, entities & audio reader
│   │   ├── ActionCard.tsx      # Step-by-step action card with execution status
│   │   ├── ApprovalModal.tsx   # Human-in-the-loop approval gatekeeper
│   │   └── LanguageSelector.tsx# Accessible language picker
│   ├── pages/
│   │   ├── Home.tsx            # Main copilot workflow
│   │   ├── History.tsx         # Audit history of analyzed documents & reminders
│   │   └── Settings.tsx        # Accessibility & contrast preferences
│   ├── services/
│   │   └── api.ts              # API client
│   ├── data/
│   │   └── sampleDocuments.ts  # Rich real-world sample documents
│   ├── types.ts                # TypeScript domain models
│   ├── App.tsx                 # Root layout with accessibility bar
│   └── main.tsx                # React 19 bootstrap
└── metadata.json               # Capabilities & permissions
```

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view AccessMate AI.
