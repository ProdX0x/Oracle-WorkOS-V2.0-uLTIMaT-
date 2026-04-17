# 🏗️ Oracle WorkOS V2.0 - Fortress Edition

> **Status:** Version 2.0 (Prototype Phase)  
> **Codename:** "Auto-Evolution"  
> **Designer:** S. Stéphane SAULNIER

**Oracle WorkOS** is an immersive, high-fidelity collaboration platform designed for closed teams. It transitions from a local prototype (V1.4) to a cloud-native SaaS architecture (V2.0), featuring a "Glassmorphism" UI, strict security, and AI-driven strategic analysis.

---

## 🌟 Core Concepts

### 1. The "Oracle Glass" UI
A deep, immersive aesthetic based on dark mode and glassmorphism.
*   **Background:** Deep Black (`#000000`) with ambient gradients.
*   **Surfaces:** Translucent layers (`backdrop-blur-xl`) providing depth and context.
*   **Adaptive:** A 100% mobile-first layout that adapts UI patterns (TabBar vs Sidebar) based on the device.

### 2. "Fortress" Security Architecture
Unlike traditional SaaS, Oracle WorkOS has **no public sign-up**.
*   **Invite-Only:** Users can only be created by an Admin.
*   **RBAC System:**
    *   **Yoda (Super Admin):** Has the power of creation and destruction.
    *   **Jedi (Admin):** Manages operations and sectors.
    *   **Padawan (Member):** Focuses on production.
    *   **Observer (Visitor):** Read-only access.

### 3. Oracle Intelligence (AI)
Powered by **Google Gemini Pro**, the system doesn't just store tasks; it understands them.
*   **Strategic Scoring:** AI analyzes tasks to assign an **Impact Score (0-100)** and **Effort Score (0-10)**.
*   **Rationale:** The AI provides a justification for its scoring.
*   **Smart Command:** A natural language interface (`Cmd+K`) to control the OS.

---

## 🛠️ Tech Stack

*   **Frontend:** React 19, TypeScript, Vite.
*   **Styling:** Tailwind CSS (Custom Configuration).
*   **State Management:** React Context + Hooks.
*   **AI Engine:** `@google/genai` (Gemini 2.5 Flash).
*   **Backend (Target):** Google Firebase (Auth, Firestore, Functions).
    *   *Note:* This version currently uses `services/mockDatabase.ts` to simulate the BaaS layer for rapid prototyping.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   A Google Gemini API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-repo/oracle-workos-v2.git
    cd oracle-workos-v2
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    API_KEY=your_google_gemini_api_key_here
    ```

4.  **Run the application**
    ```bash
    npm run dev
    ```

---

## 🧬 The "First Run" Protocol

When deploying the application for the first time (empty database), the system triggers the **Installation Wizard**:

1.  **Initialization:** The app detects a fresh install.
2.  **Yoda Creation:** You will be asked to define the **Super Admin** email.
3.  **Auto-Evolution:** The system generates `SYSTEM_TASKS` (e.g., "Setup Firestore", "Secure API").
4.  **Lockdown:** Once initialized, the "Register" route is destroyed. Access is now restricted to existing users only.

---

## 📂 Project Structure

```
/
├── index.html           # Entry point & Tailwind Config
├── src/
│   ├── components/      # UI Blocks (Layout, Kanban, SmartCommand)
│   ├── services/        # Logic Layer (Gemini, MockDB)
│   ├── App.tsx          # Main Router & First Run Logic
│   ├── constants.ts     # Styling, Seed Data, Config
│   └── types.ts         # TypeScript Interfaces (Domain Model)
└── metadata.json        # Project capabilities
```

---

## 🔮 Roadmap (Auto-Evolution)

The application tracks its own development via the **System Tasks** in the Kanban board:

*   [x] **Phase 1:** Core UI & "First Run" Protocol.
*   [x] **Phase 2:** Kanban Board with SOS System.
*   [ ] **Phase 3:** Real-time Firebase Integration (Replacing MockDB).
*   [ ] **Phase 4:** Advanced Strategy Module (Visual Matrix).
*   [ ] **Phase 5:** Video Rooms (Jitsi Integration).

---

## 📄 License

Proprietary Software. Design by S. Stéphane SAULNIER.
