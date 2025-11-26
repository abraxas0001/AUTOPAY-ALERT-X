# AutoPay Alert X: Next-Gen Task & Subscription Manager

<div align="center">
  <img src="https://img.shields.io/badge/React-19.2.0-blue.svg" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9.3-blue.svg" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-7.2.5-646CFF.svg" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.1.17-38B2AC.svg" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Firebase-12.6.0-FFCA28.svg" alt="Firebase" />
  <img src="https://img.shields.io/badge/Gemini_AI-2.5--flash--preview--09--2025-4285F4.svg" alt="Gemini AI" />
</div>

<br />

<div align="center">
  <h3>⚡ Mission Control for Your Tasks & Finances ⚡</h3>
  <p><em>A sleek, anime-inspired productivity app that combines task management with intelligent subscription alerts.</em></p>
</div>

---

## 🌟 Overview

**AutoPay Alert X** is a cutting-edge web application designed for modern warriors of productivity. Inspired by cyberpunk aesthetics and manga culture, it seamlessly integrates task management with automated subscription monitoring, powered by AI-driven insights.

### 🎯 Key Features

- **🗂️ Advanced Task Management**
  - Create, organize, and track tasks with priority levels
  - Timeline operations with due date scheduling
  - Status tracking: Todo → In-Progress → Done
  - AI-enhanced task planning with Gemini integration

- **💳 Intelligent Subscription Alerts**
  - Auto-pay monitoring with customizable billing cycles
  - High-priority alarm system for critical payments
  - Payment history tracking
  - AI-powered subscription analysis and cost-saving recommendations

- **📅 Dynamic Calendar View**
  - Visual task scheduling
  - Interactive date selection for new tasks
  - Seamless integration with task management

- **🤖 AI-Powered Intelligence**
  - Gemini 2.5 Flash AI for task enhancement and briefing generation
  - Automated daily reports and strategic insights
  - Smart subscription value analysis

- **🎨 Immersive UI/UX**
  - Manga-inspired cyberpunk design
  - Responsive, mobile-first interface
  - Customizable user profiles with avatar support
  - Sound notifications and alarm systems

- **☁️ Cloud-Powered Backend**
  - Real-time data synchronization with Firebase
  - Anonymous authentication for instant access
  - Cross-device data persistence

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abraxas0001/AUTOPAY-ALERT-X.git
   cd autopay-alert-x-next-todo
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Configure Environment**
   - Update API keys in `src/App.tsx`:
     - Gemini API Key
     - Firebase configuration

4. **Start Development Server**
   ```bash
   pnpm run dev
   # or
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
pnpm run build
# or
npm run build
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling with advanced features
- **Vite** - Lightning-fast build tool with Rolldown
- **Lucide React** - Beautiful, customizable icons

### Backend & Services
- **Firebase** - Real-time database and authentication
- **Google Gemini AI** - Advanced AI for task enhancement and analysis

### Development Tools
- **ESLint** - Code linting and quality assurance
- **PostCSS** - CSS processing with Tailwind integration

## 📁 Project Structure

```
autopay-alert-x-next-todo/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images and media
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   ├── index.css          # Global styles with Tailwind
│   └── App.css            # Component-specific styles
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## 🎮 Usage Guide

### Task Management
1. Click the floating action button (+) to create new tasks
2. Set priority levels: Low, Medium, High
3. Assign due dates using the calendar view
4. Use AI enhancement for detailed task planning
5. Track progress through status updates

### Subscription Monitoring
1. Add subscriptions with billing cycles and costs
2. Set priority levels for payment alerts
3. Receive automated notifications before due dates
4. Track payment history and analyze spending patterns
5. Get AI recommendations for cost optimization

### Daily Briefing
- Access the "DAILY BRIEFING" section for AI-generated strategic insights
- Review pending tasks and upcoming financial obligations
- Receive personalized productivity recommendations

## 🔧 Configuration

### Firebase Setup
Replace the Firebase config in `src/App.tsx` with your project credentials:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // ... other config
};
```

### Gemini AI Integration
Update the API key in `src/App.tsx`:

```typescript
const apiKey = "your-gemini-api-key";
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the incredible framework
- **Vercel** for Vite and the developer experience
- **Tailwind Labs** for the styling system
- **Google** for Firebase and Gemini AI
- **Manga/Cyberpunk Community** for the aesthetic inspiration

---

<div align="center">
  <p><strong>Built with ❤️ for productivity enthusiasts</strong></p>
  <p>⚡ Stay organized, stay ahead ⚡</p>
</div>
