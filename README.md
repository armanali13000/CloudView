# 🌤️ CloudView - Weather App

CloudView is a beautiful and responsive weather app built using **React Native** and **TypeScript**, designed to show accurate real-time weather information based on your current location or searched cities.

## 🚀 Features

- 📍 Weather by current location (using Geolocation)
- 🔍 City weather search
- 🌤️ Weather icons and background images based on conditions
- 📱 Responsive mobile UI
- ⏳ Loading indicators & ❌ error handling
- 🧭 Pull to refresh support
- 🎨 Clean design with custom app title and tagline

## 🔧 Tech Stack

- React Native (Expo)
- TypeScript
- Expo Location API
- OpenWeatherMap API

## 📸 Screenshots

| Home Screen (Sunny) | Search City |
|---------------------|-------------|
| *(Add your screenshots here)* | *(optional)* |

## 🛠️ Setup & Installation

1. **Clone the repository**

git clone https://github.com/armanali13000/CloudView.git <br>
cd CloudView


Install dependencies

npm install <br>
Start the development server

npx expo start <br>
Run on device/emulator

Scan the QR code using Expo Go on Android/iOS.

Or run in Android/iOS simulator.

🧪 Testing <br>
CloudView is currently tested on Android using Expo Go. Support for iOS may be added in the future.

📦 Build APK <br>

npx expo export <br>
npx eas build --platform android <br>
Note: You must have eas-cli installed and configured.

📁 Project Structure


.
├── assets/
├── components/
│   ├── WeatherInfo.tsx
├── utils/
│   ├── fetchWeatherData.ts
│   └── getWeatherIcon.ts
├── App.tsx
└── ...



💡 Inspiration <br>
This project was built as a hands-on practice in building real-world mobile apps with React Native and Expo.

🤝 Connect <br>
Feel free to contribute or reach out:

🔗 GitHub: armanali13000
