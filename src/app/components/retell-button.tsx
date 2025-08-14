"use client";
import { useState, useEffect } from "react";
import { RetellWebClient } from "retell-client-js-sdk";
import { Commet } from "react-loading-indicators";

export default function RetellButton() {
  const [inCall, setInCall] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
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
      if (!inCall && !isConnecting) {
        setIsConnecting(true);
        // Fetch token from your API route
        const res = await fetch("/api/create-call");
        if (!res.ok) throw new Error("Failed to create call");
        const token = await res.json(); // Should be the access token string
        if (!token) throw new Error("No token returned");

        // Start Retell call
        const retellWebClient = new RetellWebClient();
        setSdk(retellWebClient);
        await retellWebClient.startCall({ accessToken: token });
        setIsConnecting(false);
        setInCall(true);
      } else if (inCall) {
        // End call
        if (sdk) {
          sdk.stopCall();
        }
        setInCall(false);
      }
    } catch (err) {
      console.error("Error handling call:", err);
      setIsConnecting(false);
      setInCall(false);
    }
  };

  const getButtonContent = () => {
    if (isConnecting) {
      return (
        <div style={{ transform: "scale(0.6)" }}>
          <Commet color="#ffffff" size="small" text="" textColor="" />
        </div>
      );
    }
    return (
      <img
        src={
          inCall
            ? "https://img.icons8.com/ios-filled/50/ffffff/end-call.png"
            : "https://img.icons8.com/ios-filled/50/ffffff/microphone.png"
        }
        alt={inCall ? "End Call" : "Start Call"}
        style={{ width: "30px", height: "30px" }}
      />
    );
  };

  const getButtonBackground = () => {
    if (isConnecting) {
      return "linear-gradient(135deg, #6366f1, #8b5cf6)";
    }
    return inCall
      ? "linear-gradient(135deg, #ff0044, #aa0000)"
      : "linear-gradient(135deg, #5f0fff, #ff00aa)";
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
        disabled={audioPermission === false || isConnecting}
        onClick={handleClick}
        onMouseEnter={(e) => {
          if (!isConnecting) {
            e.currentTarget.style.animation = "pulse 1.2s infinite";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.animation = "none";
        }}
        style={{
          width: "80px",
          height: "80px",
          border: "none",
          borderRadius: "24px",
          background: getButtonBackground(),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 12px rgba(255, 0, 128, 0.5)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          cursor: isConnecting ? "not-allowed" : "pointer",
          opacity: isConnecting ? 0.8 : 1,
        }}
      >
        {getButtonContent()}
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
