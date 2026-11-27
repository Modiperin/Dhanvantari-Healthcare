import React, { useState } from "react";

const voice = () => {
  const [text, setText] = useState("");
  const [audioSrc, setAudioSrc] = useState("");

  const handleSpeak = async () => {
    if (!text.trim()) return;

    const response = await fetch("http://localhost:5000/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: text,
        lang: "gu",
      }),
    });

    // Blob response from API
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    setAudioSrc(url);
  };
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Text-to-Speech</h2>
      <textarea
        className="border rounded p-2 w-full"
        rows="4"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type text here..."
      />
      <button
        onClick={handleSpeak}
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
      >
        Convert & Stream
      </button>

      {audioSrc && (
        <audio controls autoPlay className="mt-4 w-full" src={audioSrc} />
      )}
    </div>
  );
};

export default voice;
