# TikiAnaly

TikiAnaly is a modern web application built with React and Tailwind CSS, featuring authentication pages, a dashboard, and a clean, responsive UI. This project uses React Router for navigation and is structured for scalability and maintainability.

---

## 🚀 Features

- **Authentication:** Login, Signup, Forgot Password, and Reset Password pages.
- **Dashboard:** Main user dashboard after authentication.
- **Responsive Design:** Built with Tailwind CSS for mobile and desktop.
- **Modern Routing:** Uses React Router v6 for seamless navigation.
- **Reusable Components:** Form inputs, buttons, and layout elements.
- **Custom Theming:** Easily change colors and fonts via Tailwind and CSS variables.

---

## 📁 Project Structure

```
src/
│
├── components/
│   ├── dasboardelements/
│   └── formelements/
│
├── pages/
│   ├── dashboard.tsx
│   ├── forgot_password.tsx
│   ├── login.tsx
│   ├── reset_password.tsx
│   └── signup.tsx
│
├── App.tsx
└── index.css
```

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/semzi/tikianaly.git
   cd tikianaly
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser:**
   ```
   http://localhost:5173
   ```
   (Port may vary depending on your setup.)

---

## 🌐 Routing Overview

| Path                | Component         | Description                |
|---------------------|------------------|----------------------------|
| `/`                 | `Login`          | Login page                 |
| `/signup`           | `Signup`         | Signup/registration page   |
| `/dashboard`        | `Dashboard`      | Main dashboard             |
| `/forgot-password`  | `Forgot`         | Forgot password page       |
| `/reset-password`   | `Reset`          | Reset password page        |

All routes are defined in [`src/App.tsx`](src/App.tsx).

---

## 🎨 Customization

- **Theming:** Edit `src/index.css` to change colors, fonts, and other design tokens.
- **Assets:** Place your images/icons in the `public/assets` directory for easy reference.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgements

- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Vite](https://vitejs.dev/)

---

> Made with ❤️ by the TikiAnaly Team
