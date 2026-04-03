import { serve } from "bun";

const PORT = 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_api_key_here') {
  console.warn("WARNING: GEMINI_API_KEY is not set in the environment or .env file.");
}

serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    // Handle API requests
    if (req.method === "POST" && url.pathname === "/api/topics") {
      try {
        const body = await req.json();
        const { interests, location } = body;

        if (!interests || !location) {
          return new Response(JSON.stringify({ error: "Missing interests or location" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }

        if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_api_key_here') {
          return new Response(JSON.stringify({ error: "Server missing Gemini API key. Please update the .env file." }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }

        const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const prompt = `Today is ${today}. Generate a list of 5 casual conversation topics or questions based on current events or local details. 
The topics should be specifically related to the following interests: ${interests.join(', ')} 
and they should be tailored for someone in or visiting ${location}.
Use your search tool to find recent news, past/future events, or popular local spots in ${location} related to these interests.
When mentioning events or news, include specific dates whenever possible.
Make them engaging and suitable for a social setting. Output the results as a formatted HTML list without markdown code blocks, just plain HTML (e.g. <ul><li>...</li></ul>). Provide only the HTML list, nothing else.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            tools: [{ google_search: {} }],
            generationConfig: { temperature: 0.7 }
          }),
        });

        if (!response.ok) {
          const err = await response.text();
          console.error("Gemini API Error:", err);
          return new Response(JSON.stringify({ error: "Failed to generate topics from Gemini API." }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }

        const data = await response.json();
        let text = data.candidates[0].content.parts[0].text;

        // Clean up markdown block if present
        text = text.replace(/```html/g, '').replace(/```/g, '').trim();

        return new Response(JSON.stringify({ html: text }), {
          headers: { "Content-Type": "application/json" }
        });

      } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // Serve static files
    if (url.pathname === "/" || url.pathname === "/index.html") {
      const file = Bun.file("public/index.html");
      return new Response(file);
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Listening on http://localhost:${PORT}`);