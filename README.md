# 🗣️ Gemini Language Roleplay

A lightweight, single-page web application that uses **Google's Gemini 1.5 Flash AI** and the browser's built-in **Web Speech API** to create immersive, voice-interactive language learning scenarios. Practice ordering street food in Bangkok or buying coffee in Tokyo with a responsive AI character.

## ✨ Features

* **Zero Setup:** No Node.js, no build steps, and no backend required. It's just one HTML file.
* **Voice In, Voice Out:** Hold the mic button to speak in your target language, and hear the AI respond with native browser text-to-speech voices.
* **Contextual Roleplay:** The Gemini AI stays in character, refuses to speak English, and evaluates your request.
* **Goal-Oriented:** Each scenario has a specific "win condition" (e.g., successfully ordering both pork and sticky rice). When you achieve it, the AI triggers a success state.
* **Extensible:** Easily add your own scenarios, languages, and win conditions by modifying a single JavaScript object.

## 🚀 Getting Started

### Prerequisites

You need a **Google Gemini API Key** to run this app.

1. Go to [Google AI Studio](https://aistudio.google.com/?utm_source=gemini).
2. Create a new API key.

### Installation

1. Clone this repository or download the `index.html` file directly.

```bash
git clone https://github.com/yourusername/gemini-language-roleplay.git

```

2. Open `index.html` in a modern web browser (Google Chrome or Microsoft Edge are highly recommended for optimal Web Speech API support).

### Usage

1. Paste your Gemini API Key into the input field at the top of the app.
2. Select a scenario from the dropdown (e.g., "Bangkok Street Food").
3. Click **Start Scenario**.
4. Click and hold the **🎤 Mic** button to speak, or type your response in the text box and click **Send**.
5. Converse with the AI until you successfully complete the scenario's objective!

## 🛠️ Customizing and Adding Scenarios

You can easily add new scenarios by editing the `scenarios` object inside the `<script>` tag of the `index.html` file.

Here is an example of how to add a Spanish taxi scenario:

```javascript
const scenarios = {
    // ... existing scenarios ...
    madrid: {
        lang: 'es-ES',
        voiceLang: 'es-ES',
        prompt: `You are a taxi driver in Madrid, Spain. The user needs to practice Spanish by asking to go to the Prado Museum. 
        Rules:
        1. Only speak in Spanish. Use local Madrid slang if appropriate.
        2. Do not provide English translations. 
        3. If the user successfully asks to go to the Prado Museum, reply with the estimated time of arrival, and end your message with exactly "[SUCCESS]".`
    }
};

```

*Note: Don't forget to add a matching `<option>` to the HTML `<select id="scenario-select">` dropdown!*

## ⚠️ Limitations & Browser Support

* **Microphone Support:** The Speech-to-Text feature relies on `webkitSpeechRecognition`, which is currently best supported on Chrome, Edge, and Safari. Firefox users may need to enable specific flags or use text input.
* **Voice Output:** The Text-to-Speech voices depend on the operating system and browser. If a specific language voice sounds robotic, ensure your OS has the native language pack installed.
* **Security:** This is a client-side only application. You must enter your API key manually each time you refresh. **Never** hardcode your API key into the source code and upload it to a public repository.

## 📄 License

This project is open-source and available under the [MIT License](https://www.google.com/search?q=LICENSE&utm_source=gemini). Feel free to fork, modify, and build upon it!
