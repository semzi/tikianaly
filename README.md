# TikiAnaly

TikiAnaly is a modern web application built with React and Tailwind CSS, featuring authentication pages, a dashboard, a beautiful mobile navigation bar, and a clean, responsive UI. This project uses React Router for navigation and is structured for scalability and maintainability.

---

## 🚀 Features

- **Authentication:** Login, Signup, Forgot Password, and Reset Password pages.
- **Dashboard:** Main user dashboard after authentication.
- **Mobile Navigation Bar:** Bottom navigation with animated active state and icon swapping (solid/outline).
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
│   │   └── Navigation.tsx   # Mobile navigation bar
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

## 📱 Mobile Navigation Bar

The mobile navigation bar is implemented in [`src/components/dasboardelements/Navigation.tsx`](src/components/dasboardelements/Navigation.tsx) and provides quick access to the main sections of the app:

- **Home**
- **Leagues**
- **News**
- **Favourite**
- **Profile**

### Icon Behavior
- **Active State:**
  - When a navigation link is active, its icon switches to the solid version and the text color changes to your brand primary color (`text-brand-primary`).
  - A highlight bar (`<span className="absolute top-[-10px] h-[2px] w-10 bg-brand-primary"></span>`) appears above the active icon.
- **Inactive State:**
  - Inactive links display the outline version of the icon and default text color.

### Icon Imports
The navigation uses [Heroicons](https://heroicons.com/) for all icons. Both solid and outline versions are imported and swapped based on the active state:

```js
import { HomeIcon as HomeIconSolid } from "@heroicons/react/20/solid";
import { HomeIcon as HomeIconOutline } from "@heroicons/react/24/outline";
import { TrophyIcon as TrophyIconSolid } from "@heroicons/react/24/solid";
import { TrophyIcon as TrophyIconOutline } from "@heroicons/react/24/outline";
import { BookOpenIcon as BookOpenIconSolid } from "@heroicons/react/24/solid";
import { BookOpenIcon as BookOpenIconOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { UserCircleIcon as UserCircleIconSolid } from "@heroicons/react/24/solid";
import { UserCircleIcon as UserCircleIconOutline } from "@heroicons/react/24/outline";
```

### Customization
- **Add/Remove Items:** Edit the `Navigation.tsx` file to add or remove navigation items.
- **Change Icons:** Swap out Heroicons for any other icon from the [Heroicons library](https://heroicons.com/).
- **Active Bar Style:** Adjust the highlight bar by editing the `<span>` element and its classes.
- **Colors:** Change the `text-brand-primary` and `bg-brand-primary` classes in your Tailwind config or CSS.

### Example Usage
```jsx
<NavLink to="/news" className={({ isActive }) => `flex items-center flex-col relative${isActive ? ' text-brand-primary' : ''}` }>
  {({ isActive }) => (
    <>
      {isActive && <span className="absolute top-[-10px] h-[2px] w-10 bg-brand-primary"></span>}
      {isActive ? <BookOpenIconSolid className="h-7 w-7" /> : <BookOpenIconOutline className="h-7 w-7" />}
      <p className="text-xs">News</p>
    </>
  )}
</NavLink>
```

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
- [Heroicons](https://heroicons.com/)
- [Vite](https://vitejs.dev/)

---

> Made with ❤️ by the TikiAnaly Team
