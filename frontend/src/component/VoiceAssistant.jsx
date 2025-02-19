import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const VoiceAssistant = () => {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [response, setResponse] = useState(""); // State to hold the response from the AI

  // Check if browser supports speech recognition
  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser doesn't support speech recognition.</span>;
  }

  const processCommand = async (command) => {
    const username = localStorage.getItem('username');
    try {
      const response = await fetch("http://localhost:5000/process-command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command, username }),
      });
      const data = await response.json();

      // Set the response to state to display on the GUI
      setResponse(data.response);
      speak(data.response);

      // Open URL if the backend response includes an "action" and a "url"
      if (data.action === "open" && data.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error:", error);
      speak("Sorry, I couldn't process your command.");
    }
  };

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  };

  const handleStopListening = () => {
    processCommand(transcript);
    resetTranscript();
  };

  // Optional: Clear response when transcript changes
  useEffect(() => {
    if (transcript) {
      setResponse(""); // Reset response when new transcript is available
    }
  }, [transcript]);

  return (
    <div>
      <h1>Voice Assistant</h1>
      <p>Microphone: {listening ? "on" : "off"}</p>
      <button onClick={SpeechRecognition.startListening}>Start</button>
      <button onClick={handleStopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <p>Transcript: {transcript}</p>
      <p>Response: {response}</p> {/* Display the response from the AI */}
    </div>
  );
};

export default VoiceAssistant;
