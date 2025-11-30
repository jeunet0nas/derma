# DermaScan AI - Complete Setup Guide

# Last updated: 2025-11-30

## Project Structure

```
derma/
├── backend/          # Express TypeScript API
├── mobile/           # Expo React Native App
└── README.md         # This file
```

---

## 📋 Prerequisites

### Required Software

- **Node.js**: 18.x or higher ([Download](https://nodejs.org/))
- **npm**: 9.x or higher (comes with Node.js)
- **Git**: Latest version ([Download](https://git-scm.com/))

### For Mobile Development

- **Expo CLI**: Installed globally
- **Expo Go App**: On your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- **Android Studio** (optional): For Android emulator
- **Xcode** (optional, Mac only): For iOS simulator

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/jeunet0nas/derma.git
cd derma
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Environment Configuration

```bash
# Copy example environment file
cp .env.example .env

# Edit .env and add your API keys
# Required: GEMINI_API_KEY
nano .env  # or use your preferred editor
```

**Get Gemini API Key:**

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Click "Create API Key"
3. Copy the key to `GEMINI_API_KEY` in `.env`

#### Start Backend Server

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Mobile Setup

#### Install Dependencies

```bash
cd ../mobile
npm install
```

#### Environment Configuration

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your backend URL
nano .env
```

**Configure API URL:**

- **iOS Simulator**: `EXPO_PUBLIC_API_URL=http://localhost:5000/api`
- **Android Emulator**: `EXPO_PUBLIC_API_URL=http://10.0.2.2:5000/api`
- **Physical Device**: `EXPO_PUBLIC_API_URL=http://YOUR_IP:5000/api`
  - Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
  - Example: `http://192.168.1.100:5000/api`

#### Start Expo Server

```bash
npm start
```

#### Run on Device/Emulator

- **iOS Simulator**: Press `i` in terminal
- **Android Emulator**: Press `a` in terminal
- **Physical Device**: Scan QR code with Expo Go app

---

## 🔑 Environment Variables

### Backend (.env)

**Required:**

```env
GEMINI_API_KEY=your_key_here              # Google AI Studio API Key
FIREBASE_PROJECT_ID=your_project_id       # Firebase Project ID
FIREBASE_CLIENT_EMAIL=your_email          # Firebase Service Account Email
FIREBASE_PRIVATE_KEY="-----BEGIN..."     # Firebase Private Key
```

**Optional:**

```env
PORT=5000                                 # Server port
NODE_ENV=development                      # Environment
ALLOWED_ORIGINS=http://localhost:3000     # CORS origins
RATE_LIMIT_MAX_REQUESTS=100              # Rate limit
```

### Mobile (.env)

**Required:**

```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api  # Backend URL
```

**Optional:**

```env
EXPO_PUBLIC_API_TIMEOUT=30000                   # Request timeout (ms)
EXPO_PUBLIC_MAX_IMAGE_SIZE_MB=10               # Max image size
EXPO_PUBLIC_APP_ENV=development                # Environment
```

---

## 🛠️ Development

### Backend Commands

```bash
cd backend

npm run dev          # Start dev server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start            # Start production server
npm run lint         # Run ESLint
npm test             # Run tests (if configured)
```

### Mobile Commands

```bash
cd mobile

npm start            # Start Expo dev server
npm run android      # Run on Android
npm run ios          # Run on iOS
npm run web          # Run in browser
npm run lint         # Run ESLint
```

---

## 📱 Features

### Current Features

- ✅ Skin analysis with AI (Gemini 2.0 Flash)
- ✅ Image upload from camera/gallery
- ✅ Analysis results with zones and recommendations
- ✅ Chat with AI skincare assistant
- ✅ Account management (UI ready)

### Upcoming Features

- ⏳ Firebase Authentication
- ⏳ Analysis history storage
- ⏳ Advanced analysis with heatmap
- ⏳ Push notifications
- ⏳ Offline mode

---

## 🏗️ Architecture

### Backend Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **AI**: Google Gemini 2.0 Flash Thinking
- **Auth**: Firebase Admin SDK
- **Storage**: Firebase Storage (for images)
- **Validation**: Zod schemas
- **Logging**: Winston

### Mobile Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Navigation**: Expo Router
- **Styling**: NativeWind (Tailwind CSS)
- **State**: React Hooks (Context API planned)
- **HTTP**: Axios

### API Endpoints

**Analysis:**

- `POST /api/analysis/skin` - Analyze skin image
- `POST /api/analysis/heatmap` - Generate heatmap
- `POST /api/analysis/advanced` - Advanced analysis (auth required)

**Chatbot:**

- `POST /api/chatbot/chat` - Chat with AI assistant

**Skincare:**

- `POST /api/skincare/recommend` - Get product recommendations
- `POST /api/skincare/routine` - Generate skincare routine

---

## 🧪 Testing

### Backend Testing

```bash
cd backend

# Test health endpoint
curl http://localhost:5000/api/health

# Test analysis endpoint (requires image)
curl -X POST http://localhost:5000/api/analysis/skin \
  -H "Content-Type: application/json" \
  -d '{"image":"data:image/jpeg;base64,..."}'
```

### Mobile Testing

1. Open Expo Go app
2. Scan QR code from terminal
3. Navigate to "Phân tích da" tab
4. Upload/capture image
5. Click "Phân tích ngay"

---

## 🐛 Troubleshooting

### Backend Issues

**"Missing required environment variables"**

- Check `.env` file exists
- Verify `GEMINI_API_KEY` is set
- Ensure no extra spaces around values

**"Port 5000 already in use"**

```bash
# Change PORT in .env
PORT=5001

# Or kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Mobile Issues

**"Network request failed"**

- Check backend is running (`http://localhost:5000/api/health`)
- Verify `EXPO_PUBLIC_API_URL` in mobile `.env`
- Android emulator: use `10.0.2.2` instead of `localhost`
- Physical device: must be on same WiFi as computer

**"Cannot connect to Metro"**

```bash
# Clear Expo cache
npx expo start -c

# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**"Image picker not working"**

- Android: Grant storage permissions
- iOS: Add privacy descriptions in `app.json`

---

## 📦 Deployment

### Backend Deployment (Railway/Render)

1. Create account on [Railway](https://railway.app) or [Render](https://render.com)
2. Connect GitHub repository
3. Add environment variables in dashboard
4. Deploy from `main` branch

### Mobile Deployment (EAS Build)

```bash
cd mobile

# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS (Mac required)
eas build --platform ios
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is for educational purposes (NT118.Q14 - UIT).

---

## 👥 Team

- **Developer**: jeunet0nas
- **Course**: NT118.Q14 - Mobile Development
- **University**: University of Information Technology (UIT)

---

## 📞 Support

- **GitHub Issues**: [Report bugs](https://github.com/jeunet0nas/derma/issues)
- **Documentation**: See `/docs` folder (coming soon)
- **Email**: Contact via GitHub profile

---

## ⚡ Performance Tips

### Backend

- Enable caching (`ENABLE_CACHE=true`)
- Adjust rate limits based on usage
- Monitor Gemini API quota (60 req/min free tier)

### Mobile

- Compress images before upload (quality: 0.8)
- Use smaller aspect ratio for analysis (1:1)
- Enable offline mode for cached results

---

## 🔐 Security Notes

### Production Checklist

- [ ] Change `JWT_SECRET` to random 32-byte string
- [ ] Set `NODE_ENV=production`
- [ ] Disable `ENABLE_DETAILED_ERRORS`
- [ ] Add your production domain to `ALLOWED_ORIGINS`
- [ ] Use HTTPS for API (not HTTP)
- [ ] Rotate Firebase service account keys regularly
- [ ] Set up Firebase Security Rules
- [ ] Enable rate limiting on production

### Never Commit

- `.env` files (add to `.gitignore`)
- API keys or secrets
- Firebase service account JSON
- Private keys

---

**Last Updated**: November 30, 2025  
**Version**: 1.0.0  
**Status**: ✅ Active Development
