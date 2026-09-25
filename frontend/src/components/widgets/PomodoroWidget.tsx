"use client";
import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function PomodoroWidget() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsActive(!isActive);
  };

  const reset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const secs = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <div className="flex flex-col h-full items-center justify-center">
      <div className="text-4xl md:text-5xl font-light text-gray-800 tracking-tight mb-4 font-mono">
        {mins}:{secs}
      </div>
      <div className="flex gap-4">
        <button
          onClick={toggle}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors shadow-sm"
        >
          {isActive ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
        </button>
        <button
          onClick={reset}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"
        >
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
}
