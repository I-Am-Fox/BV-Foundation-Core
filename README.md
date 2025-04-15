# 🕷️ BLACK VEIL FOUNDATION // SECURE INTEL ARCHIVE

**CLEARANCE LEVEL REQUIRED: OCTANE-5**  
Unauthorized access will trigger immediate countermeasures.

---

## 🔧 Initialization Protocol

```bash
npm install
npm run dev
```

> Console uplink: [http://localhost:3000](http://localhost:3000)

---

## 🧬 Overview

BLACK VEIL ARCHIVE is an encrypted repository of classified intel, asset dossiers, and incident reports. Engineered using **Next.js**, **MDX**, and **Netlify**, it emulates a secured intranet for operatives and analysts.

Key functions include:
- 🗂️ Live-folder rendering of asset classifications
- 🔐 Login-console simulation before access
- 📄 Structured MDX reports with embedded component support
- 💡 Dynamic rendering of tags, incident headers, and warnings

---

## 🧾 Asset Entry Format

All classified entries must follow strict metadata formatting:

```mdx
---
title: CV-07 Corvus Dossier
classification: OCTANE
asset: CV-07
date: 2025-04-14
tags: [containment, octane, operative]
---
```

File naming convention:
```
CLASS_asset-name.mdx
Example: OCTANE_cv-07-dossier.mdx
```

MDX components allowed:
- `<HeaderSection />`
- `<DossierTagList tags={['field', 'containment']} />`
- `<WarningBox />`

---

## 🧪 Deployment

> ⚠️ Ensure Next.js is version 13.5.0 or higher

```bash
npm run build
```

Deployments authorized through **Netlify CLI** or GitHub-integrated workflows. Plugin `@netlify/plugin-nextjs` required.

---

## 🔒 Field Directive

> "Sanity is a luxury we abandoned long ago."

This repository is a sealed archive within the Black Veil Universe. Redistribution or derivation without direct clearance will result in silent protocol engagement.

---

## 🧠 Maintainers

Maintained under directive by the BLACK VEIL development team.
For contact, breach recovery, or operational code access, engage through secure comms only.

**End of transmission.**
