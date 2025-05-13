# DailyFive [![Netlify Status](https://api.netlify.com/api/v1/badges/ccc25ab1-d5c7-4673-95c5-d3d19ede108b/deploy-status)](https://app.netlify.com/sites/dailyfive/deploys) ![ts](https://flat.badgen.net/badge/Built%20With/TypeScript/blue)

DailyFive is a beautiful, mindful journaling app inspired by Song Hye-kyo's daily gratitude practice. Each day, users record five things they're grateful for, fostering positivity and mindfulness in their daily lives.

## Demo Site
dailyfive.netlify.app

## Features

- 📝 Daily gratitude journaling
- 📅 History view with calendar navigation
- 📊 Progress tracking
- 🌓 Light/dark mode support
- 🌐 Multi-language support (English & Traditional Chinese)
- 🔔 Daily reminder notifications
- 📱 Responsive design for all devices
- 💾 Local storage persistence
- 📤 Export entries to CSV

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Jessili8/daily-five.git
cd daily-five
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will open in your default browser at `http://localhost:8081`.

## Development

This project is built with:

- [Expo](https://expo.dev/) - React Native framework
- [Expo Router](https://docs.expo.dev/router/introduction/) - File-based routing
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) - Smooth animations
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) - Local data persistence
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) - Push notifications

### Project Structure

```
daily-five/
├── app/                   # Application routes
│   ├── (tabs)/           # Tab-based navigation
│   └── _layout.tsx       # Root layout
├── components/           # Reusable components
├── constants/           # Theme, translations, and configuration
├── context/            # React Context providers
├── hooks/              # Custom React hooks
└── types/              # TypeScript definitions
```

### Features

#### Multi-language Support
The app supports both English and Traditional Chinese. Language settings can be changed in the Settings tab and are persisted across sessions.

#### Notifications
Daily reminders can be enabled to help maintain your gratitude practice. Notifications are scheduled for 8:00 PM daily and work on both web and mobile platforms.

#### Data Export
All entries can be exported to CSV format for backup or analysis. The export includes dates and entries in a format suitable for spreadsheet applications.

### Building for Production

To create a production build:

```bash
npm run build:web
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
