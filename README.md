# History Roleplay Chatbot

An interactive educational chatbot that transforms any historical topic into an immersive roleplaying experience. Built with Next.js and powered by Gemma 3n running locally via Ollama.

## Features

- **Offline-First**: Runs entirely on your local machine using Ollama
- **Interactive Roleplay**: Transforms historical topics into first-person adventures
- **Educational**: Seamlessly weaves historical facts into engaging narratives
- **Responsive Design**: Clean, modern UI that works on all devices

## Prerequisites

Before running this application, you need to:

1. **Install Ollama**: Download and install from [ollama.ai](https://ollama.ai)
2. **Pull Gemma 3n Model**: Run the following command:
   ```bash
   ollama pull gemma3n:e2b
   ```

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm run dev
   ```

3. **Open Your Browser**: Navigate to [http://localhost:3000](http://localhost:3000)

## How It Works

1. **Enter a Topic**: Type any historical topic (e.g., "The Indus Valley Civilization", "The Mughal Empire")
2. **Get Immersed**: The AI creates a first-person scenario where you become a character in that historical period
3. **Make Choices**: Respond to the scenario and continue the interactive story
4. **Learn History**: Historical facts and details are seamlessly woven into the narrative

## Technology Stack

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS
- **AI Model**: Gemma 3n (e2b variant) via Ollama
- **API**: Next.js API Routes

## Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts    # API endpoint for chat
│   ├── page.tsx             # Main chat interface
│   ├── prompt.ts            # System prompt for roleplay
│   └── layout.tsx           # App layout
```

## Development

- **Lint**: `npm run lint`
- **Build**: `npm run build`
- **Start Production**: `npm start`

## Troubleshooting

1. **Ollama Not Running**: Make sure Ollama is running with `ollama serve`
2. **Model Not Found**: Ensure you've pulled the model with `ollama pull gemma3n:e2b`
3. **API Errors**: Check that the Ollama API is accessible at `http://localhost:11434`

## Competition Context

This project is designed for the **Google Gemma 3n Impact Challenge** and targets **The Ollama Prize** for the best project running Gemma 3n locally using Ollama.
