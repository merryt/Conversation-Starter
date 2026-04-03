# Conversation Starter

A web-based application that generates personalized, grounded conversation starters using Google's Gemini API.

## Features

- **Interest Selection:** Choose from various categories like Hobbies, News, Tech, Food, and specific sports (Football, Basketball, Hockey, Golf).
- **Location Context:** Tailors conversation topics to a specific location (currently supporting Denver, Colorado).
- **AI-Powered Grounding:** Uses Gemini 2.5 Flash with Google Search grounding to find real-world news, upcoming events, and popular local spots related to your interests.
- **Dynamic Content:** Generates 5 fresh, casual topics with specific dates for events or news when possible.

## Prerequisites

- [Bun](https://bun.sh/) installed on your machine.
- A Google Gemini API Key.

## Setup

1.  **Clone the repository.**
2.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add your Gemini API key:
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

## Starting the Project

To start the server, run:

```bash
bun start
```

The application will be available at `http://localhost:3000`.

## How it Works

1.  The frontend (`public/index.html`) captures user interests and the selected location.
2.  A POST request is sent to the `/api/topics` endpoint in `server.ts`.
3.  The server constructs a prompt for the Gemini API, including the current date and instructions to use Google Search for grounding.
4.  Gemini returns a list of conversation topics as an HTML list, which is then displayed to the user.
