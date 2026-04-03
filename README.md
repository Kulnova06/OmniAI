# Omni AI

Omni AI is a modern, responsive web application that leverages advanced generative models to create stunning AI images and conversational text. Built using React and Vite, the platform features a premium, glassmorphism-inspired UI with rich micro-interactions and ambient backgrounds.

## Features

- **Multi-Modal Generation:** Seamlessly toggle between "Image" and "Text" generation modes.
- **Image Generation:** Powered by `stabilityai/stable-diffusion-xl-base-1.0` to render high-quality imagery from your creative prompts.
- **Text Generation:** Powered by `meta-llama/Meta-Llama-3-8B-Instruct` (via Hugging Face's OpenAI-compatible completions API) for conversational, story-generation, and intelligent text responses.
- **Premium Aesthetics:** Beautiful UI overhaul featuring custom glassmorphism overlays, ambient background glowing orbs, and native-feeling hover scale effects.
- **Easy Setup:** Plugs straight into your standard Hugging Face account tokens without massive local dependencies.

## Setup Instructions

### 1. Installation

Clone this project or navigate to the directory, then install the dependencies via NPM:

```bash
npm install
```

### 2. Environment Variables

Omni AI expects access to the Hugging Face Inference ecosystem. You will need to create a local environment variables file to safely store your API keys.

1. Copy `.env.example` to a new `.env` file.
2. Provide your Hugging Face Access Token with Inference Permissions.

```env
VITE_HF_API_KEY=your_huggingface_api_key_here

# (Optional) If you wish to use a separate token/account for text generation models:
# VITE_HF_TEXT_API_KEY=your_separte_text_token_here
```

### 3. Running Development Server

Start the development web server with Vite hot-reloading:

```bash
npm run dev
```

Open up your browser to the URL output in your terminal (typically `http://localhost:5173`) to view and interact with the application.

## Core Technologies

- **ReactJS**: Component framework and state management.
- **Vite**: Rapid, modern frontend bundling.
- **Vanilla CSS**: Styled utilizing highly tailored CSS variables, flexbox, and complex `backdrop-filter` rules for standard native rendering.
- **Hugging Face Router API**: Securely bridging standard HTTP requests directly into major Llama and Stable Diffusion transformer models on the cloud.
