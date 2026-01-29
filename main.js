import { Conversation } from "@unith-ai/core-client";

// CREDENTIALS
const CONFIG = {
  orgId: "Fufule-733",
  headId: "miatutordedesarollo-23922",
  apiKey: "4363e63338c94f5d899f3f4dc5559454",
};

let conversation = null;
let isAiSpeaking = false;
let microphoneStatus = "OFF";

// Logging
function log(message, type = "info") {
  const logDiv = document.getElementById("log");
  const entry = document.createElement("div");
  entry.className = `log-entry log-${type}`;
  entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  logDiv.appendChild(entry);
  logDiv.scrollTop = logDiv.scrollHeight;
  console.log(message);
}

//  Update microphone status in UI
function updateMicrophoneStatus(status) {
  microphoneStatus = status;

  const statusDiv = document.getElementById("mic-status");
  const micBtn = document.getElementById("mic-btn");

  // Update status display
  statusDiv.textContent = `Microphone: ${status}`;
  statusDiv.className = `mic-status ${status.toLowerCase()}`;

  // Update microphone button
  if (status === "ON") {
    micBtn.textContent = " Stop Listening";
    micBtn.classList.add("listening");
  } else if (status === "PROCESSING") {
    micBtn.textContent = " Processing...";
    micBtn.classList.add("listening");
  } else {
    // OFF
    micBtn.textContent = " Start Listening";
    micBtn.classList.remove("listening");
  }

  log(` Microphone: ${status}`, "info");
}

//  Show transcript preview
function showTranscriptPreview(transcript) {
  const previewDiv = document.getElementById("transcript-preview");
  previewDiv.textContent = `"${transcript}"`;
  previewDiv.style.color = "#333";
}

//  Clear transcript preview
function clearTranscriptPreview() {
  const previewDiv = document.getElementById("transcript-preview");
  previewDiv.textContent = "";
  previewDiv.style.color = "#666";
}

// Add conversation message to UI
function addConversationMessage(sender, text, visible) {
  const conversationDiv = document.getElementById("conversation");
  const messageDiv = document.createElement("div");
  messageDiv.className = `conversation-message ${sender}-message`;

  // Create message content
  const textSpan = document.createElement("div");
  textSpan.textContent = text;

  // Create metadata (timestamp and status)
  const metaSpan = document.createElement("div");
  metaSpan.className = "message-meta";
  const time = new Date().toLocaleTimeString();
  metaSpan.textContent = time;

  // If message is not visible yet
  if (!visible && sender === "ai") {
    const waitingSpan = document.createElement("span");
    waitingSpan.className = "message-waiting";
    waitingSpan.textContent = " (preparing response...)";
    metaSpan.appendChild(waitingSpan);
  }

  messageDiv.appendChild(textSpan);
  messageDiv.appendChild(metaSpan);

  conversationDiv.appendChild(messageDiv);

  // Auto-scroll to bottom
  conversationDiv.scrollTop = conversationDiv.scrollHeight;
}

// Button const
const connectBtn = document.getElementById("connect-btn");
const startBtn = document.getElementById("start-btn");
const disconnectBtn = document.getElementById("disconnect-btn");
const micBtn = document.getElementById("mic-btn");

micBtn.addEventListener("click", () => {
  if (!conversation) {
    log(" Please connect and start session first", "error");
    return;
  }

  // Toggle the microphone
  conversation.toggleMicrophone();
  log(` Toggling microphone...`, "info");
});

// Message input references
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");

// 1: Connect to the digital human
connectBtn.addEventListener("click", async () => {
  try {
    log(" Connecting to UNITH...", "info");
    connectBtn.disabled = true;

    conversation = await Conversation.startDigitalHuman({
      orgId: CONFIG.orgId,
      headId: CONFIG.headId,
      apiKey: CONFIG.apiKey,
      element: document.getElementById("video-container"),
      allowWakeLock: true,
      microphoneProvider: "azure",

      // callbacks
      microphoneOptions: {
        // Called when speech is recognized
        onMicrophoneSpeechRecognitionResult: ({ transcript }) => {
          log(` Recognized: "${transcript}"`, "message");
          showTranscriptPreview(transcript);

          // IMPORTANT: Manually send the transcript
          conversation.sendMessage(transcript);

          // Clear preview after sending
          setTimeout(() => {
            clearTranscriptPreview();
          }, 2000);
        },

        // Called when microphone status changes
        onMicrophoneStatusChange: ({ status }) => {
          updateMicrophoneStatus(status);
        },

        // Called when there's a microphone error
        onMicrophoneError: ({ message }) => {
          log(` Microphone error: ${message}`, "error");
          updateMicrophoneStatus("OFF");
        },
      },
      //onConnect STATUS
      onConnect: ({ userId, headInfo, microphoneAccess }) => {
        log(" CONNECTED!", "success");
        log(`User ID: ${userId}`, "info");
        log(`Head Name: ${headInfo.name}`, "info");
        log(`Language: ${headInfo.language}`, "info");
        log(`Head Phrases: ${headInfo.phrases}`, "info");
        log(` Microphone: ${microphoneAccess ? "Granted" : "Denied"}`, "info");

        //agent-name
        document.querySelector(".agent-name").textContent = headInfo.name;

        // Enable next step
        startBtn.disabled = false;
        disconnectBtn.disabled = false;
      },

      onStatusChange: ({ status }) => {
        log(` Status changed: ${status}`, "info");
      },

      // Listen to messages
      onMessage: ({ timestamp, sender, text, visible }) => {
        log(
          ` ${sender}: ${text} ${visible ? "" : "(not visible yet)"}`,
          "message",
        );

        // Add message to conversation UI
        addConversationMessage(sender, text, visible);
      },

      //  Track when AI starts speaking
      onSpeakingStart: () => {
        log(" AI started speaking", "info");
      },

      // Track when AI finishes speaking
      onSpeakingEnd: () => {
        log(" AI finished speaking", "info");
      },

      onError: ({ message, type }) => {
        log(` Error (${type}): ${message}`, "error");
      },
    });
  } catch (error) {
    log(` Connection failed: ${error.message}`, "error");
    connectBtn.disabled = false;
  }
});

// 2: Start the session (audio/video playback)
startBtn.addEventListener("click", async () => {
  try {
    log(" Starting session...", "info");
    await conversation.startSession();
    log(" Session started! Audio/video playback enabled", "success");

    // Enable messaging
    messageInput.disabled = false;
    sendBtn.disabled = false;
    messageInput.focus();

    //  Enable microphone button
    document.getElementById("mic-btn").disabled = false;
  } catch (error) {
    log(` Failed to start session: ${error.message}`, "error");
  }
});

//  Send message when button is clicked
sendBtn.addEventListener("click", () => {
  const message = messageInput.value.trim();

  // Check if there's a message and conversation is active
  if (!message) {
    log(" Please type a message first", "error");
    return;
  }

  if (!conversation) {
    log(" Not connected. Please connect first", "error");
    return;
  }

  // Send the message
  conversation.sendMessage(message);
  log(`Sent: "${message}"`, "info");

  // Clear the input
  messageInput.value = "";
  messageInput.focus();
});

// Send message when Enter key is pressed
messageInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    sendBtn.click();
  }
});

// 3: Disconnect
disconnectBtn.addEventListener("click", async () => {
  try {
    log(" Disconnecting...", "info");
    await conversation.endSession();
    log(" Disconnected successfully", "success");

    // Reset buttons
    connectBtn.disabled = false;
    startBtn.disabled = true;
    disconnectBtn.disabled = true;

    // Disable messaging
    messageInput.disabled = true;
    sendBtn.disabled = true;
    messageInput.value = "";

    //  Disable and reset microphone
    micBtn.disabled = true;
    updateMicrophoneStatus("OFF");
    clearTranscriptPreview();

    conversation = null;
  } catch (error) {
    log(` Disconnect failed: ${error.message}`, "error");
  }
});

//other things
// Listen for spacebar press on the entire document
document.addEventListener("keydown", (event) => {
  // Check if spacebar was pressed
  if (event.code === "Space" || event.key === " ") {
    // Make sure conversation exists
    if (conversation) {
      event.preventDefault(); // Prevent page scroll
      conversation.stopCurrentResponse();
      log(" Response stopped by spacebar", "info");
    }
  }
});
