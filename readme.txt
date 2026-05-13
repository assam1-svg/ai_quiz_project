# AI Quiz Generator

## Features
- User signup and signin
- Password encryption using Node.js crypto
- MongoDB database storage
- AI quiz generation using Google Gemini API
- Session management

## Tech Stack
- Node.js, Express, EJS
- MongoDB (Atlas)
- Google Gemini API

## Database Schema
**users:** name, email, password, salt

## How to Run
1. Clone the repo
2. Run `npm install`
3. Create `.env` with ATLAS_URI, GEMINI_API_KEY, SESSION_SECRET, PORT
4. Run `npm start`

## API
Google Gemini API (`gemini-2.0-flash`)