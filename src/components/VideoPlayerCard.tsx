"use client";

import { useState, useRef } from "react";
import { Volume2, VolumeX, Play, Pause, Maximize2 } from "lucide-react";

interface VideoPlayerCardProps {
  src: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  aspectRatio?: string;
  maxWidth?: string;
  autoPlay?: boolean;
}

export default function VideoPlayerCard({
  src,
  badge = "Apresentação Oficial",
  title = "Treinamento de Elite",
  subtitle = "Assista à demonstração",
  aspectRatio = "9 / 16",
  maxWidth = "340px",
  autoPlay = true,
}: VideoPlayerCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth,
        margin: "0 auto",
      }}
    >
      {/* Glowing backdrop halo */}
      <div
        style={{
          position: "absolute",
          inset: "-10px",
          background: "radial-gradient(circle, rgba(232,25,24,0.35) 0%, rgba(232,25,24,0) 70%)",
          borderRadius: "2.5rem",
          filter: "blur(20px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Video Container / Phone-frame look */}
      <div
        className="glass"
        style={{
          position: "relative",
          zIndex: 1,
          borderRadius: "2rem",
          overflow: "hidden",
          border: "2px solid rgba(232, 25, 24, 0.4)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(232, 25, 24, 0.2)",
          backgroundColor: "#000",
        }}
      >
        {/* Top Badge */}
        {badge && (
          <div
            style={{
              position: "absolute",
              top: "1rem",
              left: "1rem",
              zIndex: 10,
              backgroundColor: "rgba(15, 16, 20, 0.8)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(232, 25, 24, 0.4)",
              color: "#fff",
              padding: "0.35rem 0.75rem",
              borderRadius: "2rem",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.5px",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "var(--primary-color)",
                boxShadow: "0 0 8px var(--primary-color)",
                animation: "pulse 2s infinite",
              }}
            />
            {badge}
          </div>
        )}

        {/* Video Element */}
        <div
          onClick={togglePlay}
          style={{
            cursor: "pointer",
            position: "relative",
            width: "100%",
            aspectRatio,
            backgroundColor: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <video
            ref={videoRef}
            src={src}
            autoPlay={autoPlay}
            muted={isMuted}
            loop
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

          {/* Pause overlay indicator (shown when paused) */}
          {!isPlaying && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "opacity 0.2s",
              }}
            >
              <div
                style={{
                  width: "4rem",
                  height: "4rem",
                  borderRadius: "50%",
                  backgroundColor: "var(--primary-color)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 25px rgba(232, 25, 24, 0.6)",
                }}
              >
                <Play fill="white" color="white" size={28} style={{ marginLeft: "4px" }} />
              </div>
            </div>
          )}
        </div>

        {/* Bottom Floating Control Bar */}
        <div
          style={{
            position: "absolute",
            bottom: "1rem",
            left: "1rem",
            right: "1rem",
            zIndex: 10,
            backgroundColor: "rgba(15, 16, 20, 0.85)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "1rem",
            padding: "0.75rem 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: "0.9rem",
                fontWeight: 800,
                color: "#fff",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {subtitle}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {/* Play/Pause Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              aria-label={isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "none",
                borderRadius: "50%",
                width: "2.25rem",
                height: "2.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)")}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} fill="white" />}
            </button>

            {/* Mute/Unmute Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              title={isMuted ? "Ativar áudio" : "Silenciar áudio"}
              aria-label={isMuted ? "Ativar áudio" : "Silenciar áudio"}
              style={{
                background: isMuted ? "rgba(232, 25, 24, 0.2)" : "var(--primary-color)",
                border: "1px solid " + (isMuted ? "rgba(232, 25, 24, 0.5)" : "transparent"),
                borderRadius: "50%",
                width: "2.25rem",
                height: "2.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              title="Tela cheia"
              aria-label="Tela cheia"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "none",
                borderRadius: "50%",
                width: "2.25rem",
                height: "2.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)")}
            >
              <Maximize2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
