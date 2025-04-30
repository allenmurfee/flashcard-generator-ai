# Flashcard AI Generator

A Next.js web application that generates flashcards from lecture notes using Google's Gemini 1.5 Pro model. This is a perfect app for students looking to create effective study materials quickly!

## Features

- Paste lecture notes and generate flashcards automatically
- Clean, modern interface with educational icons
- Responsive design that works on all devices
- Powered by Gemini for high-quality flashcard generation

## Prerequisites

- Node.js 18+ installed
- Gemini API key

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd flashcard-generator-ai
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your Gemini API key:

```
NEXT_PUBLIC_GOOGLE_API_KEY=your-api-key-here
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Paste your lecture notes into the text area
2. Click "Generate Flashcards"
3. Review the generated flashcards
4. Study and learn!

## Technologies Used

- Next.js 14
- React
- TypeScript
- Bootstrap
- Gemini 1.5 Pro
- Heroicons
