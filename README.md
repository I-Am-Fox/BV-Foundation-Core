# 🕷️ BLACK VEIL FOUNDATION // SECURE INTEL ARCHIVE

**CLEARANCE LEVEL REQUIRED: OCTANE-5**  
Unauthorized access will trigger immediate countermeasures.

---

## 🧭 Overview

**Black Veil Archive** is a secure, modern knowledgebase for classified dossiers, asset logs, and anomalous events—built with Next.js, Supabase, and Netlify.

The system now uses a **secure submission form** for all dossier and entry contributions, features robust user authentication (with Discord OAuth support), and routes all submissions through an admin-approval queue for review before anything goes live.

---

## 🚀 Quickstart

```bash
npm install
npm run dev

Site runs at: http://localhost:3000
```

---

## 🛡️ Authentication

- **Supabase** authentication (email/password or Discord)
- On first login, **username onboarding** is enforced (unique username required)
- Usernames are managed in a dedicated `profiles` table (synced with display names)
- **Admin access** is based on email whitelist (see environment variable)
- **Profile pages**: `/profile/[username]` for all users (with edit, history, password, and delete support)

---

## 📝 Submissions & Workflow

**All new content is submitted through a secure form:**

1. **User logs in** (Supabase or Discord)
2. **Navigates to submission page**
3. **Fills out required fields:**
   - Classification (e.g. OCTANE, DELTA, FIELD AGENT)
   - Asset Name (e.g. "Corvus")
   - Entry Title (e.g. "dossier", "addendum-1", "incident-a")
   - Entry content (markdown/MDX)
4. **Form auto-generates a unique filename** based on your inputs:

[CLASS]\_[ASSETNAME]-[ENTRYTITLE].mdx

_Example_: `OCTANE_Corvus-dossier.mdx`, `DELTA_Corvus-addendum-1.mdx` 5. **Duplicate filenames are rejected**—all entries must have unique names per asset/title 6. **Submission goes to a secure queue for admin approval** 7. **Admins review, approve (push to main repo), or deny (discard) submissions via the `/admin-panel`**

> **There is no file upload or direct MDX file push by users—everything is done through the web form.**

---

## 🗃️ Asset Structure & Lore Index

- All entries are **MDX files** stored under a `content/` directory, grouped by classification and asset.
- Classification folders (OCTANE, DELTA, FIELD AGENT, etc.) are **expandable and color-coded**.
- **Sidebar navigation** allows quick access by classification and asset.
- **Entries support embedded React components** for rich formatting.

### MDX Frontmatter Format

```mdx
---
title: Corvus Dossier
classification: OCTANE
asset: Corvus
date: 2025-04-14
tags: [containment, octane, operative]
---
```

---

## 🌍 Special Features

- **Dynamic Wireframe World Map:** Clickable sites/blacksites, reveals asset or location data
- **Live Containment Monitor:** Randomly displays current status of an asset from MDX entries
- **Profile System:** Every user has a customizable profile page (username change, password change, login history)
- **Field Agent Classification:** Field agents are now their own top-level classification, with separate folder color and handling
- **Admin Panel:** `/admin-panel` route for submission queue management (approve/deny; GitHub push integration for approvals)
- **Discord Integration:** OAuth login, future Discord webhooks for approvals/denials (planned)
- **Unclassified/Index:** Special "must read" section at the top of the lore index

---

## 🔒 Security & Deployment

- **No user can overwrite an existing asset entry by default**
- **All file writes are handled via server-side logic**; no direct file system access for users

---

## 🛠️ Development Notes

- **Requires:** Next.js 13.5+ and Node 18+
- **Run locally:**
  ```bash
  npm run dev
  ```

---

## 🤖 Maintainers & Contact

- Maintained by **BLACK VEIL Foundation devs**
- For security issues, contact via the encrypted email in this repo
- Breach, downtime, or access issues: escalate using email.

---

## 💀 Disclaimer

This archive is a **fictional, classified knowledgebase** built for creative storytelling and world-building purposes.  
**Do not share confidential access keys or admin details outside secure channels.**

**End of transmission.**
