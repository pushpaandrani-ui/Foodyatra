import React, { useState } from 'react';
import { Sparkles, X, Send, Loader2 } from 'lucide-react';
import { getFoodRecommendation } from '../services/geminiService';
import { Restaurant, Dish } from '../types';

interface AiAssistantProps {
  onClose: () => void;
  restaurants: Restaurant[];
  onDishSelect: (dish: Dish, restaurant: Restaurant) => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ onClose, restaurants, onDishSelect }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<{
    dish: Dish;
    restaurant: Restaurant;
    reason: string;
  } | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setRecommendation(null);

    try {
      const result = await getFoodRecommendation(query);
      if (result) {
        const restaurant = restaurants.find(r => r.id === result.restaurantId);
        const dish = restaurant?.dishes.find(d => d.id === result.dishId);
        
        if (restaurant && dish) {
          setRecommendation({ restaurant, dish, reason: result.reason });
        } else {
          setError("Could not find that item locally.");
        }
      } else {
        setError("I couldn't decide! Try asking differently.");
      }
    } catch (e) {
      setError("Connection issue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="animate-pulse" />
            <h2 className="font-bold text-xl">Food Assistant</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {!recommendation ? (
            <>
              <p className="text-gray-600 text-lg mb-6">
                Not sure what to eat? Tell me what you feel like!
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Spicy Food', 'Something Sweet', 'Light Snack', 'Full Dinner'].map(suggestion => (
                  <button 
                    key={suggestion}
                    onClick={() => setQuery(suggestion)}
                    className="px-3 py-2 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-transparent hover:border-indigo-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-indigo-600 font-medium mb-4 bg-indigo-50 p-3 rounded-lg">
                 ✨ {recommendation.reason}
              </p>
              
              <div className="border rounded-xl p-4 mb-4 shadow-sm">
                <img 
                  src={recommendation.dish.image} 
                  alt={recommendation.dish.name} 
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                <h3 className="font-bold text-xl text-gray-800">{recommendation.dish.name}</h3>
                <p className="text-gray-500 mb-2">{recommendation.restaurant.name}</p>
                <p className="font-bold text-lg text-green-600">₹{recommendation.dish.price}</p>
              </div>

              <button
                onClick={() => onDishSelect(recommendation.dish, recommendation.restaurant)}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-green-700"
              >
                Order This Now
              </button>
            </div>
          )}

          {error && (
             <p className="text-red-500 text-center bg-red-50 p-3 rounded-lg mt-4">{error}</p>
          )}
        </div>

        {/* Footer Input */}
        {!recommendation && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., I want spicy potato..."
                className="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                onClick={handleSearch}
                disabled={loading || !query}
                className="bg-indigo-600 text-white p-3 rounded-xl disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Send />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};