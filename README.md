<div align="center">
  <img src="./assets/sumitapp-dark.svg" alt="SumitApp Logo" width="300" height="auto" />
  
  <h1>SumitApp</h1>
  
  <p><strong>Rapidly build modern apps with everything pre-configured and ready to use.</strong></p>
  
  <p>A monorepo pre-configured project powered by <strong>Turborepo</strong>, featuring a <strong>Next.js</strong> web app, an <strong>Expo</strong> mobile app, and <strong>Node.js</strong> Vercel serverless APIs.</p>

  <br />

  [![GitHub Stars](https://img.shields.io/github/stars/sumittttpaul/SumitApp?style=for-the-badge&logo=github&color=yellow)](https://github.com/sumittttpaul/SumitApp)
  [![GitHub Forks](https://img.shields.io/github/forks/sumittttpaul/SumitApp?style=for-the-badge&logo=github&color=blue)](https://github.com/sumittttpaul/SumitApp)
  [![License](https://img.shields.io/github/license/sumittttpaul/SumitApp?style=for-the-badge&color=green)](./LICENSE)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
  [![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/)

</div>

---

## 🚀 Quick Start

Get started with SumitApp in seconds:

```bash
npx create-sumit-app my-app
cd my-app
bun dev
```

Or install in the current directory:

```bash
npx create-sumit-app
```

## ✨ Features

### 🏗️ **Monorepo Architecture**
- **Turborepo** for blazing-fast builds and caching
- Shared packages for components, utilities, and configurations
- Optimized workspace management with Bun

### 🌐 **Multi-Platform Development**
- **Next.js 15** web application with App Router
- **Expo 54** mobile app for iOS and Android
- **Node.js** serverless APIs with Vercel deployment

### 🎨 **Modern UI/UX**
- **Tailwind CSS 4** for styling
- **Radix UI** components for accessibility
- **React Native Paper** for mobile UI
- Dark/Light theme support
- Responsive design across all platforms

### 🛠️ **Developer Experience**
- **TypeScript** for type safety
- **ESLint** and **Prettier** for code quality
- **React Compiler** for optimized builds
- Hot reload and fast refresh
- Comprehensive tooling and scripts

### 📦 **Shared Packages**
- `@packages/components` - Reusable UI components
- `@packages/hooks` - Custom React hooks
- `@packages/utils` - Utility functions
- `@packages/validations` - Zod schemas
- `@packages/types` - TypeScript definitions

## 🏛️ Project Structure

```
sumitapp/
├── 📁 assets/                    # Brand assets and logos
├── 🛠️ cli-tool/                 # create-sumit-app CLI
├── 🌐 official-site/            # Official documentation site
└── 📦 project-template/         # Main project template
    ├── 📁 packages/             # Shared packages
    │   ├── components/          # UI components
    │   ├── hooks/              # React hooks
    │   ├── utils/              # Utilities
    │   ├── validations/        # Zod schemas
    │   ├── types/              # TypeScript types
    │   ├── eslint-config/      # ESLint configuration
    │   └── typescript-config/  # TypeScript configuration
    └── 📁 projects/            # Applications
        ├── 🌐 website/         # Next.js web app
        ├── 📱 mobile/          # Expo mobile app
        └── ⚡ backend/         # Node.js API
```

## 🚀 Available Scripts

### Root Commands
```bash
bun dev          # Start all projects in development mode
bun build        # Build all projects
bun lint         # Lint all projects
bun format       # Format code with Prettier
bun check-types  # Type check all projects
bun clean        # Clean all build artifacts
```

### Individual Project Commands
```bash
# Website (Next.js)
cd projects/website
bun dev          # Start development server
bun build        # Build for production
bun start        # Start production server

# Mobile (Expo)
cd projects/mobile
bun dev          # Start Expo development server
bun android      # Run on Android device/emulator
bun ios          # Run on iOS device/simulator

# Backend (Node.js)
cd projects/backend
bun dev          # Start development server
bun build        # Build for production
```

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Motion** - Animation library
- **Lucide React** - Beautiful icons

### **Mobile**
- **Expo 54** - React Native development platform
- **React Native 0.81** - Cross-platform mobile framework
- **NativeWind** - Tailwind CSS for React Native
- **React Native Paper** - Material Design components
- **Expo Router** - File-based routing

### **Backend**
- **Node.js** - JavaScript runtime
- **Express 5** - Web framework
- **Vercel** - Serverless deployment platform
- **TypeScript** - Type-safe JavaScript

### **Development Tools**
- **Turborepo** - Monorepo build system
- **Bun** - Fast JavaScript runtime and package manager
- **TypeScript** - Static type checking
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **React Compiler** - Optimizing compiler

### **State Management & Utilities**
- **Legend State** - Fast and flexible state management
- **Zod** - TypeScript-first schema validation
- **Date-fns** - Date utility library
- **Axios** - HTTP client

## 📱 Screenshots

<div align="center">
  <img src="./official-site/public/website_desktop.png" alt="Website Desktop" width="45%" />
  <img src="./official-site/public/mobile_android.png" alt="Mobile Android" width="45%" />
</div>

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sumit Paul**
- Website: [sumitttpaul.vercel.app](https://sumitttpaul.vercel.app/)
- LinkedIn: [@sumitttpaul](https://www.linkedin.com/in/sumitttpaul/)
- GitHub: [@sumittttpaul](https://github.com/sumittttpaul)

## 🙏 Acknowledgments

- [Turborepo](https://turbo.build/) for the amazing monorepo tooling
- [Next.js](https://nextjs.org/) for the incredible React framework
- [Expo](https://expo.dev/) for simplifying mobile development
- [Vercel](https://vercel.com/) for seamless deployment
- All the open-source contributors who make this possible

---

<div align="center">
  <p>Made with ❤️ by <a href="https://sumitttpaul.vercel.app/">Sumit Paul</a></p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>