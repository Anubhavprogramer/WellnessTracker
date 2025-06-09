# 🌟 WellnessHub - Personal Wellness Tracker

A comprehensive wellness tracking application that helps users monitor their daily habits, complete challenges, and improve their overall well-being through gamification and data-driven insights.

![WellnessHub](https://img.shields.io/badge/WellnessHub-v1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6.svg?logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-Integrated-FFA611.svg?logo=firebase)

## ✨ Features

[Deploy](https://wellness-tracker-theta.vercel.app)

### 🎯 **Wellness Scoring System**

- **Comprehensive Assessment**: Track sleep, exercise, nutrition, mental health, and productivity
- **Dynamic Scoring**: Real-time calculation of wellness score (0-100) based on user inputs
- **Progress Visualization**: Beautiful charts and progress indicators
- **Level System**: Beginner → Intermediate → Advanced → Expert progression

### 🏆 **Challenge System**

- **Diverse Challenges**: Hydration, exercise, mindfulness, and productivity challenges
- **Progress Tracking**: Daily goal completion with visual feedback
- **Streak Counters**: Maintain motivation with streak tracking
- **Difficulty Levels**: Easy, medium, and hard challenges for all skill levels

### 🎖️ **Badges & Achievements**

- **Multiple Categories**: Score-based, streak-based, challenge completion, and milestone badges
- **Visual Collection**: Beautiful badge display with unlock dates
- **Achievement System**: Unlock rewards for reaching specific goals
- **Progress Motivation**: Clear goals to work towards

### 📊 **Analytics & Insights**

- **Weekly Logs**: Track progress over time with detailed weekly reports
- **Habit Breakdown**: Detailed analysis of each wellness category
- **Trend Analysis**: Identify patterns and areas for improvement
- **Personal Dashboard**: Overview of all metrics in one place

### 🔄 **Offline-First Architecture**

- **Works Everywhere**: Full functionality offline with automatic sync
- **Cloud Backup**: Firebase integration for cross-device synchronization
- **Data Safety**: Never lose your progress with robust data persistence
- **Smart Sync**: Automatic background synchronization when online

## 🛠️ Tech Stack

### **Frontend**

- **React 18** - Modern UI library with hooks and concurrent features
- **TypeScript** - Type-safe development with enhanced IDE support
- **Vite** - Lightning-fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework for rapid styling
- **Framer Motion** - Smooth animations and transitions

### **UI Components**

- **Radix UI** - Accessible, unstyled UI primitives
- **Lucide React** - Beautiful, customizable icons
- **React Hook Form** - Performant forms with easy validation
- **Recharts** - Composable charting library

### **Backend & Data**

- **Firebase Firestore** - Real-time NoSQL database
- **Firebase Auth** - Anonymous authentication for user management
- **Firebase Analytics** - Usage tracking and insights
- **Local Storage** - Offline data persistence and caching

### **Developer Experience**

- **ESLint** - Code linting and quality checks
- **Prettier** - Code formatting
- **Vitest** - Fast unit testing framework
- **React Router** - Client-side routing

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Firebase project (optional for offline-only usage)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/wellnesshub.git
   cd wellnesshub
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your Firebase configuration:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` and start your wellness journey!

## 🔧 Firebase Setup (Optional)

WellnessHub works perfectly offline, but Firebase adds cloud sync and analytics.

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Analytics (optional)

### 2. Enable Services

```bash
# Enable Firestore Database
- Go to Firestore Database
- Create database in production mode
- Set up security rules (see below)

# Enable Authentication
- Go to Authentication > Sign-in method
- Enable Anonymous authentication

# Enable Analytics (optional)
- Already enabled if selected during project creation
```

### 3. Security Rules

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Get Configuration

1. Go to Project Settings > General
2. Scroll to "Your apps" and click Web icon
3. Copy the config object to your `.env` file

## 📱 Usage Guide

### Getting Started

1. **Complete Assessment**: Fill out the initial habits assessment
2. **View Your Score**: See your personalized wellness score
3. **Join Challenges**: Browse and join challenges that interest you
4. **Track Progress**: Complete daily goals and maintain streaks
5. **Earn Badges**: Unlock achievements as you improve
6. **Analyze Trends**: Review weekly logs and identify patterns

### Key Features

#### 🎯 **Wellness Assessment**

- Multi-step form covering all wellness aspects
- Smart scoring algorithm with personalized feedback
- Progress indicators and category breakdowns
- Improvement suggestions for each area

#### 🏃 **Challenge Participation**

- Browse available challenges by category and difficulty
- Join challenges with a single click
- Track daily progress with intuitive checkboxes
- View completion percentage and streak counters

#### 📈 **Progress Tracking**

- Weekly summaries with score trends
- Badge collection with unlock history
- Achievement milestones and progress indicators
- Personal statistics and analytics

## 🏗️ Project Structure

```
wellnesshub/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Base UI component library
│   │   ├── BadgeComponent.tsx
│   │   ├── ChallengeCard.tsx
│   │   ├── HabitCard.tsx
│   │   └── ScoreDisplay.tsx
│   ├── pages/            # Route components
│   │   ├── Dashboard.tsx
│   │   ├── HabitsForm.tsx
│   │   ├── Challenges.tsx
│   │   ├── ChallengeDetail.tsx
│   │   └── Profile.tsx
│   ├── lib/              # Utilities and services
│   │   ├── firebase.ts   # Firebase configuration
│   │   ├── auth.ts       # Authentication utilities
│   │   ├── storage.ts    # Data persistence layer
│   │   ├── scoring.ts    # Wellness scoring algorithms
│   │   ├── challenges.ts # Challenge management
│   │   └── utils.ts      # General utilities
│   ├── types/            # TypeScript definitions
│   │   └── index.ts
│   ├── hooks/            # Custom React hooks
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── .env                  # Environment variables
├── package.json
└── README.md
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm i -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Deploy
npm run build
firebase deploy
```

## 🎨 Customization

### Theming

- Modify `tailwind.config.ts` for color schemes and design tokens
- Update CSS variables in `src/index.css` for global styles
- Customize component variants in `src/components/ui/`

### Scoring Algorithm

- Adjust scoring weights in `src/lib/scoring.ts`
- Modify wellness categories and their importance
- Customize level thresholds and progression

### Challenges

- Add new challenges in `src/lib/challenges.ts`
- Create custom challenge types and rules
- Implement new badge categories and achievements

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow the existing naming conventions
- Add JSDoc comments for complex functions
- Ensure responsive design for all components

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Radix UI** for accessible component primitives
- **TailwindCSS** for the utility-first CSS framework
- **Firebase** for backend infrastructure
- **Framer Motion** for beautiful animations
- **Lucide** for the comprehensive icon library

## 📞 Support

- 📧 Email: support@wellnesshub.com
- 💬 Discord: [Join our community](https://discord.gg/wellnesshub)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/wellnesshub/issues)
- 📚 Documentation: [docs.wellnesshub.com](https://docs.wellnesshub.com)

## 🗺️ Roadmap

### v1.1.0 - Enhanced Analytics

- [ ] Advanced data visualization
- [ ] Goal setting and tracking
- [ ] Social features and community
- [ ] Export data functionality

### v1.2.0 - Mobile Enhancement

- [ ] Progressive Web App (PWA)
- [ ] Push notifications
- [ ] Mobile-optimized UI
- [ ] Offline-first improvements

### v2.0.0 - AI Integration

- [ ] Personalized recommendations
- [ ] Smart goal suggestions
- [ ] Predictive analytics
- [ ] Health insights powered by AI

---

**Start your wellness journey today with WellnessHub! 🌟**

_Built with ❤️ by the WellnessHub team_
