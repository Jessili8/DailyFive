# DailyFive

DailyFive is a beautiful, mindful journaling app inspired by Song Hye-kyo's daily gratitude practice. Each day, users record five things they're grateful for, fostering positivity and mindfulness in their daily lives.

## Features

- 📝 Daily gratitude journaling
- 📅 History view of past entries
- 📊 Progress tracking
- 🌓 Light/dark mode support
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
git clone https://github.com/yourusername/daily-five.git
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

### Project Structure

```
daily-five/
├── app/                   # Application routes
│   ├── (tabs)/           # Tab-based navigation
│   └── _layout.tsx       # Root layout
├── components/           # Reusable components
├── constants/           # Theme and configuration
├── context/            # React Context providers
├── hooks/              # Custom React hooks
└── types/              # TypeScript definitions
```

### Building for Production

To create a production build:

```bash
npm run build:web
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.