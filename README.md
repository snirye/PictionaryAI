# 🎨 Pictionary AI

A modern twist on the classic pictionary game, powered by local AI. Player draw prompts while an AI model attempts to guess the word in real-time.

## 🚀 Features

- **Real-time AI Guessing**: Integrated with Ollama's vision models
- **Dynamic Word System**: Customizable word list with automatic cycling
- **Score Tracking**: Points awarded for successful AI guesses
- **Modern UI**: Clean interface with animations and feedback
- **Local Processing**: All AI processing done locally (no cloud required)

## 📦 Installation

### Prerequisites
- [Node.js v18+](https://nodejs.org/en)
- [Ollama](https://ollama.com/)

1. **Clone Repository**

```bash
git clone https://github.com/snirye/PicionaryAI.git
```

2. **Install ollama vision model**
```bash
ollama run llava  # or any other model that supports vision
```
Note: Requires at least 8GB VRAM for smooth AI operation with LLaVA models. For better performance, consider quantized models.

3. **Install `node` Dependencies**

```bash
npm run install-all
```

## 🖥️ Usage
Start the backend and frontend servers:
```bash
npm run start
```

## Play!

Draw the displayed word

AI will guess as you draw

Earn points for correct guesses

Use controls to clear/new game

🔧 Configuration
Custom Words
Edit src/utils/words.json to modify the word list:

```json
{
  "words": [
    "apple",
    "robot",
    "castle",
    // Add your custom words
  ]
}
```

## ⚙️ Settings

Configure the application through environment variables:

```properties
# Choose your Ollama vision model
OLLAMA_MODEL=llava

# Server port configuration
PORT=3001

# Toggle image saving functionality
SAVE_IMAGES=false
```

These settings can be modified in the `.env` file in the backend directory.

## 📝 Roadmap
- [ ] support more languages (my doughters asked for this one).
- [ ] support non local llm models.
- [ ] dark mode (OMG its soooooo bright :sunglasses:).
- [ ] additional game modes

Feel free to suggest more features!

📄 License
MIT License - see LICENSE for details

