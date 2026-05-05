# 📋 Placify AI — Changelog & Recent Changes Documentation

> **Last Updated:** 2026-04-29  
> **Commit:** `ace0ca4` — *feat: integrate placement readiness flow, modernize learning path, and enhance platform security*  
> **Branch:** `main`  
> **Author:** Jatin

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication & Security](#1-authentication--security)
3. [Frontend — App Shell & Sidebar](#2-frontend--app-shell--sidebar)
4. [Frontend — Login Page](#3-frontend--login-page)
5. [Frontend — Milestone / Learning Path](#4-frontend--milestone--learning-path)
6. [Frontend — Gap Visualizer](#5-frontend--gap-visualizer)
7. [Frontend — Mock Test](#6-frontend--mock-test)
8. [Frontend — Profile View](#7-frontend--profile-view)
9. [Frontend — Resume Analyzer](#8-frontend--resume-analyzer)
10. [Backend — API Endpoints](#9-backend--api-endpoints)
11. [Placement Readiness Flowchart](#10-placement-readiness-flowchart)
12. [Data Layer](#11-data-layer)
13. [Dependencies & Config](#12-dependencies--config)
14. [Files Changed Summary](#13-files-changed-summary)

---

## Overview

This release (`ace0ca4`) is the **largest feature update** to the Placify AI platform to date. It touched **24 files**, added **7,275 lines**, and removed **590 lines**. The key themes are:

| Theme | Description |
|---|---|
| 🔐 Security | JWT-style token sessions, password hashing (SHA-256), per-student password enforcement |
| 🎬 Learning Path | Rebuilt into a video-first milestone roadmap with live YouTube API integration |
| 📊 Gap Visualizer | New Competency Heatmap component, Test Performance breakdown chart, Trending Skills section |
| 🔑 Authentication | Full student registration+login flow, separate admin portal with credential validation |
| 📈 Readiness Flow | New interactive HTML flowchart and PNG asset added to the platform |
| 📡 Backend | 6 new API endpoints, YouTube search, DSA dynamic problem fetching, test result persistence |

---

## 1. Authentication & Security

### Files: `backend/main.py`, `frontend/src/components/LoginView.js`

### What Changed

#### Backend Security Hardening
- **Password Hashing:** All passwords (both admin and student) are now stored as **SHA-256 hashes**. Plain-text passwords are never stored or compared.
- **Session Tokens:** Introduced an in-memory `SESSION_TOKENS` set. On successful login, a `secrets.token_hex(32)` token is generated and returned to the client.
- **Admin Users DB:** A hardcoded `ADMIN_USERS` dictionary maps admin usernames to their SHA-256 hashed passwords. Includes users: `jatin`, `trilok`, `akshar`, `bhavya`.
- **Token Validation Middleware:** A `get_current_user()` FastAPI dependency now guards all admin-only routes (`/admin/skill_gaps`, `/admin/at_risk_students`, `/api/students`). It reads the `Authorization: Bearer <token>` header and validates against the session store.

#### Student Login Flow (New)
- **New endpoint:** `POST /api/students/login`
  - Accepts: `roll_no`, `password`, `name` (optional), `email`, `mobile`
  - If a student exists → validates password hash
  - If the student is **new** → registers them automatically with hashed password
  - Legacy accounts without a password get one set on first login ("transition" mode)
  - Returns safe student data (no password hash) + a session token
- Token is stored client-side in `localStorage` as `placify_token` and sent with all subsequent API calls.

#### Login UI Overhaul
- Two-portal switcher: **Student Portal** (indigo) vs **Administrator** (rose) with animated active state
- Password visibility toggle (`Eye`/`EyeOff` icons) on all password fields
- Student registration fields: Full Name, Roll No, Password, Email (optional)
- Admin fields: Institutional ID, Access Key
- Error display with animated rose-red banner
- Loading spinner (`Loader2`) during async auth
- Dark background with blurred radial gradients and a dot-grid overlay pattern

---

## 2. Frontend — App Shell & Sidebar

### File: `frontend/src/App.js`

### What Changed

- **Collapsible Sidebar:** Toggle button (`ChevronLeft`/`ChevronRight`) at the right edge of the sidebar. Collapses from `w-72` to `w-20`. All labels hide in collapsed mode; only icons remain.
- **Workspace Badge:** When expanded, a panel shows "Student Workspace" or "Institution Console" depending on role.
- **Dark / Light Mode Toggle:** A pill-shaped toggle button in the sidebar with animated slider. Shows `Sun`/`Moon` icons. Labels only visible when sidebar is expanded.
- **User Role Indicator:** Avatar at the bottom of the sidebar shows initials `SJ` with a role badge (🎓 green for student, 🛡 amber for admin).
- **Logout Button:** Clears `placify_token` from localStorage and resets authentication state.
- **Role Switch:** One-click switch between Student and Admin views without a full logout.
- **Token-Authenticated Fetches:** All backend data fetches in `useEffect` now include the `Authorization` header if a token is present in localStorage.
- **Local Gap Report Fallback:** `buildLocalGapReportFromTest()` computes a gap report client-side from test scores when the backend is unavailable.
- **Student Sections:** Dashboard, Mock Assessments, Gap Visualizer, Milestone Path, DSA Coding Lab, Resume Analyzer, Profile Settings
- **Admin Sections:** Admin Dashboard, Manage Students

---

## 3. Frontend — Login Page

### File: `frontend/src/components/LoginView.js`

### What Changed

The login page was completely rebuilt from scratch:

- **Full-page dark background** with radial gradient blobs (`sky-900/30`, `indigo-900/20`) and a subtle dot-grid pattern
- **Left panel** (desktop only): Placify AI branding, tagline, and three feature cards (Readiness Score, Resume Intelligence, Admin Monitoring)
- **Right panel:** Auth card with glassmorphism style (`backdrop-blur-3xl`, `bg-[#0d1728]/88`)
- **Portal switcher** between Student and Admin
- **Animated entry fields** with `animate-in fade-in slide-in-from-top-4`
- Auto-registration for new students on first login
- Version label: *"Placify AI Secure Authentication Layer v4.0.1"*

---

## 4. Frontend — Milestone / Learning Path

### File: `frontend/src/components/LearningPathView.js`

### What Changed

The Learning Path was rebuilt from a static list into a **video-first milestone roadmap**.

#### New Architecture
- **`SkillMilestone` Component:** Each missing skill renders as a timeline milestone card with:
  - Numbered milestone badge (colored rose for priority gaps, indigo for standard)
  - Estimated completion hours (from `getEstimatedHours()` mapping)
  - "Priority Gap" badge with pulse animation for test-detected deficits
  - Quick-access resource links (GfG, LeetCode, Udemy, etc.) via `getLearningLinks()`
  - **YouTube Video Panel:** Fetches from `/api/youtube/search?query=<skill>`, shows thumbnail, title, channel, view count. Falls back to Unsplash placeholder images when no API key is configured.

#### Key Data Functions
- `getEstimatedHours(skill)` — maps skill IDs to study hour ranges
- `getLearningLinks(skill)` — curated, color-coded resource buttons per skill (Python, SQL, React, Git, DSA, Algorithms)

#### Empty State
- When all skills are mastered, shows a trophy card: *"Roadmap Converged"* with a "Proceed to Interview Simulation" CTA button.

#### Layout
- Timeline vertical line with gradient (`from-indigo-500 to-transparent`)
- Hover animations: card lifts, thumbnail zooms, play icon fades in
- Responsive 2-column video grid per milestone

---

## 5. Frontend — Gap Visualizer

### File: `frontend/src/components/GapAnalysisView.js`

### What Changed — Three new sections added:

#### 5a. Competency Heatmap (`CompetencyHeatmap` component)
A 6-column visual grid covering all technical domains:
- **Domains:** Core CS, Engineering, Frontend, Backend, Data Science, Aptitude
- Each domain shows a 2×2 grid of skill cells
- Cell color logic:
  - 🟢 **Emerald** — skill is in `current_skills` (Mastered)
  - 🔴 **Rose** — skill is in `missing_skills` (Gap)
  - ⬜ **Slate** — skill is a market target (not yet assessed)
- Hover tooltip shows exact skill name
- Icons: `ShieldCheck` for mastered, `Zap` for missing

#### 5b. Test Performance Breakdown (`TestPerformanceSection` component)
- Renders a **horizontal bar chart** (Recharts `BarChart`) showing per-category scores from the latest test
- Category labels: Quantitative Aptitude, English Proficiency, Logical Reasoning, Computer Science, DSA Challenge Pool
- Each bar has a unique color from `SECTION_META`
- Shows overall test score badge (green/amber/rose based on threshold)
- Shows total tests taken
- "Weak Areas Detected" amber warning panel if `test_gaps` exist

#### 5c. Trending Skills in Industry (`TrendingSkillsSection` component)
- Renders trending skill tags from `gapReport.trending_recommendations`
- Indigo gradient background with `Activity` icon badges

#### Auto-Refresh
- `GapAnalysisView` now calls `onRefresh()` on mount and whenever `selectedStudent` or `dashboardTrack` changes (via `useEffect`).

---

## 6. Frontend — Mock Test

### File: `frontend/src/components/MockTestView.js`

### What Changed

- **253 lines modified** (major refactor)
- After test completion, calls `POST /api/submit_test_result` to persist scores to the backend
- Passes `{ testData, scores }` to `onTestSubmitted` callback, which triggers `refreshGapReport` in App.js
- The `refreshGapReport` function in `App.js` first updates the gap report locally (from the test data), then tries to sync with the backend — ensuring the UI is never left in a stale state even if the backend is unreachable.

---

## 7. Frontend — Profile View

### File: `frontend/src/components/ProfileView.js`

### What Changed

- **212 lines modified** (major refactor)
- Displays student's profile pulled from the backend (name, roll no, department, semester, CGPA)
- Shows readiness score gauge
- History timeline of past tests
- Lists current skills from `gapReport`

---

## 8. Frontend — Resume Analyzer

### File: `frontend/src/components/ResumeUploadView.js`

### What Changed

- Added missing `import { SKILL_KEYWORDS } from '../data/skillData'` (the hotfix from commit `273b833`)
- Hybrid resume parsing: UI lets user toggle between Regex-only and Regex+LLM parsing
- Skill confidence badges and extraction-method labels (`Regex Engine`, `Hybrid Engine (Mistral-7B + Regex)`, `Mistral-7B (Semantic)`)

---

## 9. Backend — API Endpoints

### File: `backend/main.py` (~344 lines modified, 1060 lines total)

### New & Updated Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/login` | Admin authentication, returns session token | No |
| `POST` | `/api/students/login` | Student login & auto-registration | No |
| `GET` | `/api/youtube/search?query=<skill>` | Fetch YouTube tutorial videos for a skill | No |
| `POST` | `/api/submit_test_result` | Persist test scores to `test_history.json` & update student skills | No |
| `GET` | `/api/test_history/{student_id}` | Get all past test results for a student | No |
| `POST` | `/api/students/update` | Update student name, email, or target role | No |
| `GET` | `/api/dsa/dynamic/{skill}` | Fetch a random LeetCode problem for a given skill | No |
| `GET` | `/admin/skill_gaps` | Aggregate missing skill frequencies across all students | ✅ Token |
| `GET` | `/admin/at_risk_students` | List students with stagnant/declining scores in last 30 days | ✅ Token |
| `GET` | `/api/students` | List all students | ✅ Token |

### `POST /api/submit_test_result` — Skill Promotion Logic
When a student scores ≥70% in a section, backend automatically adds skills to their profile:

| Section | Skills Unlocked |
|---|---|
| `quantitative` ≥70% | `statistics` |
| `english` ≥70% | `Business Communication` |
| `reasoning` ≥70% | `Logical Reasoning` |
| `computer_science` ≥70% | `python`, `sql`, `linux`, `rest-api` |
| `dsa_random_pool` ≥70% | `data-structures`, `algorithms`, `git` |

### `GET /api/youtube/search` — Mock Fallback
When `YOUTUBE_API_KEY` env variable is not set, returns two mock videos with Unsplash thumbnails so the UI always renders correctly during development.

### `GET /admin/at_risk_students` — Risk Detection Logic
A student is marked **at-risk** if they:
1. Took ≥2 tests in the last 30 days
2. Improved by less than 5 readiness points between their first and last test

Status: `"Stagnant"` (improvement ≥ 0) or `"Declining"` (improvement < 0).

---

## 10. Placement Readiness Flowchart

### Files: `flowchart placify ai.html`, `frontend/src/assets/flowchart.png`

### What Changed

- Added a standalone **interactive HTML flowchart** (`flowchart placify ai.html`) showing the end-to-end Placify AI student journey:
  - Resume Upload → Skill Analysis → Gap Report → Mock Test → Learning Path → Readiness Score → Placement Ready
- A static `flowchart.png` (120 KB) added as an embeddable image asset in the frontend

---

## 11. Data Layer

### Files: `backend/data/student_data.json`, `backend/data/test_history.json`

### What Changed

- **`student_data.json`:** Updated with 91-line expanded sample dataset. Students now include `password` (hashed), `email`, `mobile`, `cgpa`, and `placementStatus` fields.
- **`test_history.json`:** New file (66 lines) storing historical test results per student. Schema:
  ```json
  {
    "student_id": "S001",
    "test_id": "T1001",
    "test_date": "2026-04-15",
    "readiness_score": 72,
    "category_scores": { "quantitative": { "score": 4, "total": 5 } }
  }
  ```

### `frontend/src/data/skillData.js`
- 33-line update: Added `SKILL_KEYWORDS` export for use in `ResumeUploadView`

---

## 12. Dependencies & Config

### `requirements.txt`
Added:
- `httpx` — for async HTTP calls to YouTube API from the FastAPI backend

### `frontend/tailwind.config.js`
- 3-line update enabling dark mode support across all Tailwind utility classes

### `frontend/src/index.css`
- 9 lines added: global utility classes for dark mode overrides and custom animations

### `.gitignore`
- Updated to exclude sensitive student data files from version control

---

## 13. Files Changed Summary

| File | Status | Lines Changed |
|---|---|---|
| `backend/main.py` | Modified | ~344 |
| `backend/data/student_data.json` | Added | 91 |
| `backend/data/test_history.json` | Added | 66 |
| `frontend/src/App.js` | Modified | ~67 |
| `frontend/src/components/LoginView.js` | Modified | ~324 |
| `frontend/src/components/LearningPathView.js` | Modified | ~319 |
| `frontend/src/components/MockTestView.js` | Modified | ~253 |
| `frontend/src/components/ProfileView.js` | Modified | ~212 |
| `frontend/src/components/GapAnalysisView.js` | Modified | ~34 |
| `frontend/src/components/CodeEditorView.js` | Modified | ~41 |
| `frontend/src/components/Common.js` | Modified | ~22 |
| `frontend/src/components/DashboardView.js` | Modified | ~38 |
| `frontend/src/components/ManageStudentsView.js` | Modified | ~3 |
| `frontend/src/components/ResumeUploadView.js` | Modified | ~39 |
| `frontend/src/data/skillData.js` | Modified | ~33 |
| `frontend/src/index.css` | Modified | +9 |
| `frontend/src/assets/flowchart.png` | Added | Binary (120 KB) |
| `frontend/tailwind.config.js` | Modified | +3 |
| `flowchart placify ai.html` | Added | 172 |
| `SECURITY_REPORT.md` | Added | 244 |
| `requirements.txt` | Modified | +6 |
| `.gitignore` | Modified | Updated |

---

> 📌 **Previous Commit:** `273b833` — *fix: import SKILL_KEYWORDS in ResumeUploadView* (single line fix)  
> 📌 **Commit before that:** `e77d039` — *feat: integrate dynamic milestone roadmap and hybrid resume analysis engine*
