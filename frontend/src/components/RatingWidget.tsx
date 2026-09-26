"use client";

import { useState } from 'react';
import { Star } from 'lucide-react';

export default function RatingWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://snaplink-x8i6.onrender.com";
      await fetch(`${backendUrl}/api/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stars: rating, feedback })
      });
      setSubmitted(true);
      setTimeout(() => setIsOpen(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen && !submitted) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 bg-white border border-gray-200 shadow-xl rounded-full px-4 py-2 flex items-center gap-2 text-sm font-bold text-gray-700 hover:bg-gray-50 z-[100] transition-all"
      >
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        Rate Us
      </button>
    );
  }

  if (submitted) {
    return (
      <div className="fixed bottom-6 left-6 bg-white border border-gray-200 shadow-xl rounded-2xl p-4 z-[100] animate-in slide-in-from-bottom-5">
        <p className="text-green-600 font-bold flex items-center gap-2">
          <Star className="w-5 h-5 fill-green-600" />
          Thank you!
        </p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 bg-white border border-gray-200 shadow-2xl rounded-2xl p-5 z-[100] w-72 animate-in slide-in-from-bottom-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-800">Enjoying SnapLink?</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">&times;</button>
      </div>
      
      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star 
              className={`w-8 h-8 ${
                (hoverRating || rating) >= star 
                  ? "text-yellow-400 fill-yellow-400" 
                  : "text-gray-200"
              }`} 
            />
          </button>
        ))}
      </div>

      <textarea
        placeholder="Tell us what you think! (optional)"
        className="w-full text-sm border border-gray-200 rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        rows={2}
      />

      <button
        onClick={handleSubmit}
        disabled={rating === 0}
        className="w-full bg-[#1a73e8] text-white font-bold py-2.5 rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors"
      >
        Submit Rating
      </button>
    </div>
  );
}
