'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Trash2, Search, MessageSquare } from 'lucide-react';

export default function AdminRatings() {
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const token = localStorage.getItem('snaplink_token');
      if (!token) {
        router.push('/login');
        return;
      }
      
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://snaplink-x8i6.onrender.com";
      const res = await fetch(`${backendUrl}/api/admin/ratings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) router.push('/');
        throw new Error('Failed to fetch ratings');
      }
      
      const data = await res.json();
      setRatings(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteRating = async (id: number) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;
    
    try {
      const token = localStorage.getItem('snaplink_token');
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://snaplink-x8i6.onrender.com";
      const res = await fetch(`${backendUrl}/api/admin/ratings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error('Failed to delete rating');
      setRatings(ratings.filter(r => r.id !== id));
    } catch (e: any) {
      alert(e.message);
    }
  };

  const averageRating = ratings.length > 0 
    ? (ratings.reduce((acc, r) => acc + r.stars, 0) / ratings.length).toFixed(1)
    : '0.0';

  if (loading) return <div className="p-8 text-center text-gray-500 font-bold animate-pulse">Loading ratings...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">User Feedback</h1>
          <p className="text-gray-600 mt-1">Review ratings and feedback submitted through the site widget.</p>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl font-bold mb-8 border border-red-100">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Average Rating</div>
          <div className="text-4xl font-black text-gray-900 flex items-center gap-2">
            {averageRating} <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Total Submissions</div>
          <div className="text-4xl font-black text-[#1557b0]">{ratings.length}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">With Written Feedback</div>
          <div className="text-4xl font-black text-purple-600">
            {ratings.filter(r => r.feedback && r.feedback.trim().length > 0).length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-bold text-gray-700 text-sm uppercase">Rating</th>
                <th className="p-4 font-bold text-gray-700 text-sm uppercase">Feedback</th>
                <th className="p-4 font-bold text-gray-700 text-sm uppercase">Date</th>
                <th className="p-4 font-bold text-gray-700 text-sm uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ratings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500 font-medium">No ratings collected yet.</td>
                </tr>
              ) : (
                ratings.map(rating => (
                  <tr key={rating.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className={i < rating.stars ? "fill-yellow-400" : "text-gray-300"} />
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      {rating.feedback ? (
                        <div className="flex items-start gap-2 text-gray-800 text-sm font-medium bg-gray-50 p-3 rounded-xl border border-gray-100 max-w-lg">
                          <MessageSquare size={16} className="shrink-0 text-blue-500 mt-0.5" />
                          <span className="italic">"{rating.feedback}"</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm italic">No written feedback</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-500 font-medium">
                      {new Date(rating.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => deleteRating(rating.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="Delete Feedback"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
