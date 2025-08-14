"use client";
import { useState, useEffect } from "react";
import { RetellWebClient } from "retell-client-js-sdk";

export default function RetellButton() {
  const [inCall, setInCall] = useState(false);
  const [sdk, setSdk] = useState<RetellWebClient | null>(null);
  const [audioPermission, setAudioPermission] = useState<boolean | null>(null);

  // Check audio permissions on component mount
  useEffect(() => {
    const checkAudioPermissions = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setAudioPermission(true);
        console.log("Audio permission granted");
      } catch (err) {
        setAudioPermission(false);
        console.error("Audio permission denied:", err);
      }
    };

    checkAudioPermissions();
  }, []);

  const handleClick = async () => {
    try {
      if (!inCall) {
        // Fetch token from your API route
        const res = await fetch("/api/create-call");
        if (!res.ok) throw new Error("Failed to create call");

        const token = await res.json(); // Should be the access token string
        if (!token) throw new Error("No token returned");

        // Start Retell call
        const retellWebClient = new RetellWebClient();
        setSdk(retellWebClient);

        await retellWebClient.startCall({ accessToken: token });
        setInCall(true);
      } else {
        // End call
        if (sdk) {
          sdk.stopCall();
        }
        setInCall(false);
      }
    } catch (err) {
      console.error("Error handling call:", err);
      setInCall(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <button
        disabled={audioPermission === false}
        onClick={handleClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.animation = "pulse 1.2s infinite";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.animation = "none";
        }}
        style={{
          width: "80px",
          height: "80px",
          border: "none",
          borderRadius: "24px",
          background: inCall
            ? "linear-gradient(135deg, #ff0044, #aa0000)"
            : "linear-gradient(135deg, #5f0fff, #ff00aa)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 12px rgba(255, 0, 128, 0.5)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          cursor: "pointer",
        }}
      >
        <img
          src={
            inCall
              ? "https://img.icons8.com/ios-filled/50/ffffff/end-call.png"
              : "https://img.icons8.com/ios-filled/50/ffffff/microphone.png"
          }
          alt="Mic"
          style={{ width: "30px", height: "30px" }}
        />
      </button>

      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
          }
          50% {
            transform: scale(1.08);
            box-shadow: 0 0 16px rgba(255, 255, 255, 0.4);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
          }
        }
      `}</style>
    </div>
  );
}
