<div align="center">

# EcoTrack

**A Modern Waste-Sorting Web App built with React, TypeScript, Vite, and Firebase**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-222222?style=for-the-badge&logo=githubpages)](https://pages.github.com)

เว็บแอปช่วยคัดแยกขยะที่เน้นความเร็วและใช้งานง่าย พร้อมระบบสะสมแต้ม, streak และ league ranking

</div>

---

## App Preview

![Uploading image.png…]()


---

## Live Demo

ทดลองใช้งานได้ที่นี่: <a href="https://dparamet.github.io/Bin-Scan-Better/" target="_blank"><strong>EcoTrack - Live Preview</strong></a>

---

## Key Features

- **Smart Scan Flow**: จำลองการสแกนวัตถุและวิเคราะห์ประเภทขยะในหน้าใช้งานที่ลื่นไหล
- **Waste Sorting Guide**: คู่มือคัดแยกขยะ 4 กลุ่มหลัก (Recyclable, Organic, General, Hazardous)
- **Gamification System**: ระบบคะแนน, streak และลีก เพื่อกระตุ้นการใช้งานต่อเนื่อง
- **Dashboard & Activity Log**: ดูสถิติการใช้งานและประวัติการคัดแยกล่าสุด
- **Bilingual UI**: รองรับทั้งภาษาไทยและอังกฤษ
- **Mobile-first Experience**: ออกแบบให้ใช้งานง่ายทั้งมือถือและเดสก์ท็อป

---

## Tech Stack

### Frontend

- **React 19**
- **TypeScript**
- **Vite 6**
- **Tailwind CSS 4**
- **motion** (animations)
- **Lucide React** (icons)

### Backend Services / Data

- **Firebase Auth**
- **Cloud Firestore**

### Deployment

- **GitHub Pages**

---

## Local Development

### Prerequisites

1. Node.js 20+
2. npm 10+

### Setup

```bash
git clone https://github.com/Dparamet/Bin-Scan-Better.git
cd Bin-Scan-Better
npm install
```

### Run Dev Server

```bash
npm run dev
```

### Build Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## Project Structure

```text
src/
  App.tsx
  main.tsx
  index.css
  translations.ts
  firebase.ts
  lib/
    utils.ts
```

---

## License

This project is open-source and available under the MIT License.
