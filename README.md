# 🗣️ AI Voice Chatbot

A modern, interactive AI chatbot powered by Deno for the backend and OpenAI's API, featuring voice input, AI speech output, persistent chat history, dark mode, and basic rate limiting.

---

## ✨ Features

* **🎙️ Voice Input:** Speak to the AI using your microphone.
* **🤖 AI Speech Output:** The AI responds in natural-sounding voices (browser-dependent).
* **📜 Chat History:** Maintains conversation context for a more fluid dialogue.
* **🌙 Dark Mode:** Toggle between light and dark themes for comfortable viewing.
* **⏳ Rate Limiting:** Basic protection against excessive requests (15 requests/minute/IP).
* **✨ Clean UI:** A sleek and modern user interface.
* **☁️ Deno & OpenAI Powered:** Built with **Deno** for a secure and efficient backend, and leveraging **OpenAI's powerful language models**.

---

## 🚀 Technologies Used

* **Deno:** A secure runtime for JavaScript and TypeScript.
* **Oak:** A middleware framework for Deno's HTTP server.
* **OpenAI API:** For powerful conversational AI capabilities (e.g., GPT-3.5 Turbo, GPT-4o).
* **Web Speech API:** Browser-native speech recognition and synthesis.
* **HTML, CSS, JavaScript:** Standard web technologies for the frontend.

---

## ⚙️ Setup & Local Development

Follow these steps to get the AI Chatbot running on your local machine.

### Prerequisites

* **Deno:** Make sure you have Deno installed. If not, follow the instructions on [deno.land](https://deno.land/#install).
* **Git:** For cloning the repository.
* **OpenAI API Key:** Obtain one from your [OpenAI dashboard](https://platform.openai.com/account/api-keys).

### 1. Clone the Repository

First, clone this repository to your local machine:

```bash
git clone [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git) # Replace with your actual repo URL
cd YOUR_REPO_NAME
````

### 2\. Project Structure

Ensure your project structure looks like this:

```
your-repo-name/
├── main.ts             # Deno backend server logic
├── .env                # Environment variables (for local development only)
├── static/             # Frontend files
│   └── index.html      # Main UI and client-side JavaScript
└── .gitignore          # Tells Git to ignore sensitive files
```

### 3\. Configure OpenAI API Key (Local)

Create a file named `.env` in the root of your project (same directory as `main.ts`) and add your OpenAI API Key:

```
OPENAI_API_KEY=your_openai_api_key_here
```

**Important:** The `.env` file is only for local development. **Do not commit this file to your Git repository\!** Ensure your `.gitignore` includes the line `/.env`.

### 4\. Run the Backend Server

Navigate to the root of your project in your terminal and run the Deno server:

```bash
deno run --allow-net --allow-read --allow-env main.ts
```

  * `--allow-net`: Grants network access for `fetch` calls to OpenAI and serving HTTP.
  * `--allow-read`: Allows Deno to read static files from the `static` directory.
  * `--allow-env`: Allows Deno to read environment variables (like `OPENAI_API_KEY` from `.env`).

You should see output similar to this:

```
🚀 Server running at http://localhost:8000
💡 Now configured to use OpenAI API.
🔑 Ensure OPENAI_API_KEY is set in your .env for local testing, or as a secret in Deno Deploy.
```

### 5\. Access the Frontend

Open your web browser and go to:

[http://localhost:8000](https://www.google.com/search?q=http://localhost:8000)

You should see the AI Chatbot interface.

-----

## 🌐 Deployment to Deno Deploy

Deploying your AI Chatbot to Deno Deploy makes it accessible from anywhere in the world.

### 1\. Prepare for Deployment

  * **Git Repository:** Ensure your project is pushed to a GitHub (or GitLab/Bitbucket) repository. If you haven't already:

    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git)
    git push -u origin main
    ```

  * **`.gitignore`:** Double-check that `.env` is in your `.gitignore` to prevent sensitive data from being pushed.

### 2\. Create a Project on Deno Deploy

  * Go to [deno.com/deploy](https://deno.com/deploy).
  * Sign in with your GitHub account.
  * Click **"New Project"**.
  * Select your GitHub organization/user and choose the repository where your Deno project resides.
  * Deno Deploy will automatically detect `main.ts` as the entry point and the `static` folder.

### 3\. Set OpenAI API Key as a Secret Environment Variable

This is the most critical step for deployment. Since `.env` files aren't deployed, you must provide your API key directly to Deno Deploy:

  * On the Deno Deploy project creation page (or later, in your project's **Settings** tab), find the **"Environment Variables"** section.
  * Click **"Add Environment Variable"**.
  * **Name:** `OPENAI_API_KEY` (must match exactly)
  * **Value:** Paste your actual OpenAI API secret key here (e.g., `sk-xxxxxxxxxxxxxxxxxxxx`).
  * **Check "Secret"**: This encrypts your key for security.
  * Select the relevant **"Contexts"** (e.g., "Production" and "Development").
  * Click **"Save"** or **"Add"**.

### 4\. Deploy\!

  * After setting the environment variable, Deno Deploy will automatically trigger a new deployment.
  * Subsequent `git push`es to your linked branch (e.g., `main`) will also trigger automatic deployments.

You'll get a unique URL for your deployed AI Chatbot\!

-----

## 🎙️ How to Use

1.  **Open the Application:** Navigate to `http://localhost:8000` (locally) or your Deno Deploy URL (deployed).
2.  **Microphone Permission:** Your browser will likely ask for microphone permission. Grant it.
3.  **Choose Voice:** Select your preferred voice from the "Choose Voice" dropdown. Natural-sounding voices usually come from "Google", "Microsoft", or macOS system voices.
4.  **Start Conversation:** Click the **"Start Conversation"** button. The button will change to "Stop Listening," and the UI will indicate "Listening...".
5.  **Speak:** Speak clearly into your microphone.
6.  **Stop/Automatic Stop:**
      * Click "Stop Listening" to manually end your turn.
      * The speech recognition will automatically stop after a pause in your speech.
7.  **AI Response:** The AI will process your input, display its response in the chat log, and then speak it aloud.
8.  **Continue Conversation:** Click "Start Conversation" again to speak your next message. The AI will remember the previous context.
9.  **Clear Conversation:** Click the **"Clear Conversation"** button to start a fresh dialogue, wiping the chat history.
10. **Dark Mode:** Click the 🌙 / ☀️ icon in the top right corner to toggle the theme.

-----

## 🛠️ Troubleshooting Common Issues

  * **"No speech voices found" or Robotic Voices:**
      * Use a modern browser like **Google Chrome** or **Microsoft Edge** for better voice support.
      * Check your operating system's speech settings; some voices need to be downloaded.
      * A stable internet connection is often needed for cloud-based voices.
  * **"Microphone access denied":**
      * Check your browser settings to ensure microphone access is allowed for the website.
      * Verify your operating system's privacy settings allow applications to access the microphone.
  * **"Failed to get response from OpenAI API" / "AI service not configured":**
      * **Locally:** Double-check that your `.env` file exists and contains `OPENAI_API_KEY=your_key_here` with a valid key.
      * **Deployed:** Ensure you've correctly set `OPENAI_API_KEY` as a **secret environment variable** in your Deno Deploy project settings.
      * Verify your OpenAI API key is valid and has sufficient credits.
  * **"Too many requests" (Rate Limit):**
      * You've exceeded the allowed number of requests. Wait for the specified time (e.g., 60 seconds) and try again.

-----

## 📄 License

This project is open-source and available under the [MIT License](https://www.google.com/search?q=LICENSE).

```
