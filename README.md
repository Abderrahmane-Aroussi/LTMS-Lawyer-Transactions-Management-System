# LTMS - Lawyer Transactions Management System
### (نظام إدارة معاملات المحامين)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Technology](https://img.shields.io/badge/stack-HTML5%20%7C%20CSS3%20%7C%20JS-orange.svg)
![RTL Support](https://img.shields.io/badge/RTL-Supported-success.svg)

**LTMS** is a production-ready, Single Page Application (SPA) designed to streamline financial transaction management between legal firms and freelance lawyers. Built with pure Vanilla JavaScript, HTML5, and CSS3, it requires no backend setup and offers persistent data management via local storage.

The system is fully localized for Arabic users (RTL) and features a modern, responsive design with built-in dark mode.

---

## 📸 Screenshots

| Dashboard (Light) | Dark Mode |
|:---:|:---:|
| ![Dashboard Light]![Uploading image.png…]()
 | ![Dark Mode](https://via.placeholder.com/400x200?text=Dark+Mode+UI) |

---

## ✨ Key Features

### 📊 Dashboard & Analytics
* **Real-time Statistics:** Instant calculation of total transactions, paid vs. unpaid amounts.
* **Visual Charts:** Progress bars and activity indicators.
* **Top Rankings:** Algorithm to track top-performing lawyers based on transaction volume.

### ⚖️ Legal Management
* **Lawyer CRUD:** Full Create, Read, Update, Delete functionality for lawyer profiles.
* **Transaction Tracking:** Record document counts, fees, and dates.
* **Smart Filtering:** Filter data by date range (custom/monthly), payment status, or search by name.
* **Debt Management:** Visual highlighting of unpaid transactions (Yellow rows).

### 📑 Reporting
* **Professional Reports:** Generate A4-optimized printable reports.
* **One-Click Settlement:** Feature to bulk-settle all debts for a specific lawyer within a date range.
* **Data Export:** Capability to export system data (if configured via settings).

### 🎨 UI/UX Design
* **Native Dark Mode:** Seamless toggle between Light and Dark themes with preference persistence.
* **RTL First:** Built from the ground up for Arabic language support.
* **Responsive:** Fully functional on Desktops, Tablets, and Mobile devices.
* **Toast Notifications:** Non-intrusive alerts for user actions (success/error).

---

## 🛠️ Technical Architecture

The project follows a modular architecture without external dependencies:

```text
ltms-project/
├── css/
│   └── style.css       # CSS Variables, Dark mode, RTL, Print styles
├── js/
│   ├── app.js          # Controller: Init, Global Events, Error Handling
│   ├── storage.js      # Model: LocalStorage Wrapper, CRUD Logic
│   └── ui.js           # View: DOM Manipulation, Theme, Notifications
├── index.html          # Dashboard
├── lawyers.html        # Lawyer Management
├── transactions.html   # Transaction Logs
├── reports.html        # Report Generator
└── settings.html       # Data Backup & Restore
