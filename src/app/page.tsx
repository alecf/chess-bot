"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const startGame = () => {
    // Generate a random seed for the game
    const seed = Math.random().toString(36).substring(2, 15);
    router.push(`/game/${seed}`);
  };

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
      style={{
        background:
          "linear-gradient(to bottom right, var(--background), var(--background))",
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
          style={{
            backgroundColor: "var(--accent-blue)",
          }}
        ></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
          style={{
            backgroundColor: "var(--accent-purple)",
          }}
        ></div>
        <div
          className="absolute top-40 left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"
          style={{
            backgroundColor: "var(--accent-pink)",
          }}
        ></div>
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-6xl md:text-7xl font-bold mb-4"
            style={{
              background:
                "linear-gradient(to right, var(--accent-blue), var(--accent-purple), var(--accent-pink))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Chess Bot
          </h1>
          <p
            className="text-xl max-w-2xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Challenge our AI opponent in a game of chess. Choose your color and
            test your strategic thinking!
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-6xl w-full">
          <div
            className="backdrop-blur-sm rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--card-border)",
            }}
          >
            <div className="text-3xl mb-4">🎯</div>
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Smart AI
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              Neural network trained with advanced chess algorithms
            </p>
          </div>

          <div
            className="backdrop-blur-sm rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--card-border)",
            }}
          >
            <div className="text-3xl mb-4">⚡</div>
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Fast & Responsive
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              Real-time move generation with instant feedback
            </p>
          </div>

          <div
            className="backdrop-blur-sm rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--card-border)",
            }}
          >
            <div className="text-3xl mb-4">🎨</div>
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Beautiful Design
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              Modern interface with dark/light theme support
            </p>
          </div>
        </div>

        {/* Start Game Button */}
        <div className="text-center">
          <button
            onClick={startGame}
            className="font-bold py-4 px-12 rounded-xl text-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            style={{
              background:
                "linear-gradient(to right, var(--accent-blue), var(--accent-purple))",
              color: "white",
            }}
          >
            Start New Game
          </button>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 text-center">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Built with Next.js, FastAPI, and PyTorch
          </p>
        </div>
      </div>
    </main>
  );
}
