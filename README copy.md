# Next Ticket

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Status](https://img.shields.io/badge/status-active-brightgreen)
![Built With](https://img.shields.io/badge/built%20with-HTML%2FJS-orange)
![Cloudflare Workers](https://img.shields.io/badge/platform-Cloudflare%20Workers-yellow)

**Next Ticket** is a fully custom-built ticketing system written in **HTML**, **CSS**, and **JavaScript**, without relying on frontend frameworks. It runs entirely on **Cloudflare Workers** and uses **D1** as its lightweight SQL database. Designed to be minimal, secure, and developer-friendly, it’s ideal for small to medium-scale projects requiring support or internal ticket tracking.

---

## ✨ Features

* 🧾 Create, view, and reply to support tickets
* 🔐 Secure JWT-based authentication
* 🧑‍💼 Separate dashboards for users and admins
* 📬 Optional email notifications via [Resend](https://resend.com/)
* 🧩 Modular and extendable route-based architecture
* ⚡ Server-side HTML rendering using Cloudflare Workers
* 💾 Backed by D1 (Cloudflare's SQLite-compatible database)
* 💡 Written entirely without frontend frameworks

---

## 🚀 Getting Started

### ✅ Prerequisites

* A Cloudflare account with access to Workers and D1
* [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
* Node.js (optional, for local development)
* A [Resend API Key](https://resend.com/) (optional, for email features)

---

### 📦 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/nextcodetwo/next-ticket.git
   cd next-ticket
   ```

2. **Install Wrangler (if not installed):**

   ```bash
   npm install -g wrangler
   ```

3. **Configure your environment:**

   Create a `.dev.vars` file or configure secrets:

   ```
   JWT_SECRET=your_super_secret_jwt_key
   RESEND_API_KEY=your_resend_api_key (optional)
   ```

4. **Deploy to Cloudflare:**

   ```bash
   wrangler publish
   ```

---

## 📁 Project Structure

```
/
├── public/               # Static assets (CSS, icons, etc.)
├── src/
│   ├── handlers/         # Route handlers (GET/POST)
│   ├── templates/        # HTML templates
│   ├── auth.js           # JWT logic
│   ├── db.js             # D1 database functions
│   └── index.js          # Main Worker entry point
├── wrangler.toml         # Cloudflare configuration
└── README.md
```

---

## 🛠 Usage

* Users can sign up and create tickets from the `/user` dashboard.
* Admins can manage and respond to tickets from the `/admin` dashboard.
* Replies are stored and displayed in a threaded format.
* All data is persisted in a D1 database.
* Emails (if configured) notify users and admins of new messages.

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 🙌 Credits

Built with ❤️ by the team at [Next Code Two](https://www.nextcodetwo.be)

---

## 🔗 Related Projects

* [Resend](https://resend.com/) – for email notifications
* [Cloudflare Workers](https://developers.cloudflare.com/workers/)
* [Cloudflare D1](https://developers.cloudflare.com/d1/)

---
<p>© 2025 Next Code Two. Licensed under the <a href="https://www.gnu.org/licenses/gpl-3.0.html">GNU General Public License v3.0</a></p>
