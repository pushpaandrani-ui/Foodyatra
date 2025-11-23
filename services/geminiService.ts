import { GoogleGenAI, Type } from "@google/genai";
import { RESTAURANTS } from "../constants";
import { Restaurant, Dish } from "../types";

// Helper to avoid TypeScript errors if @types/node is missing
declare const process: { env: { API_KEY: string } };

// Initialize with process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelId = "gemini-2.5-flash";

interface RecommendationResult {
  restaurantId: string;
  dishId: string;
  reason: string;
}

export interface LocationResult {
  address: string;
  mapLink?: string;
}

export async function getFoodRecommendation(userQuery: string): Promise<RecommendationResult | null> {
  try {
    // Construct context from available data
    const menuContext = RESTAURANTS.map(r => ({
      id: r.id,
      name: r.name,
      dishes: r.dishes.map(d => ({ id: d.id, name: d.name, description: d.description }))
    }));

    const prompt = `
      You are a friendly local food guide for Vadnagar. 
      The user asks: "${userQuery}".
      
      Here is the available menu data: ${JSON.stringify(menuContext)}.
      
      Select the single best dish that matches their request.
      Return JSON only.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            restaurantId: { type: Type.STRING },
            dishId: { type: Type.STRING },
            reason: { type: Type.STRING, description: "A short, exciting reason why to eat this in simple English" }
          },
          required: ["restaurantId", "dishId", "reason"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    
    return JSON.parse(text) as RecommendationResult;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
}

export async function getAddressFromCoordinates(lat: number, lng: number): Promise<LocationResult> {
  try {
    const prompt = `Find the precise street address for coordinates ${lat}, ${lng}. Return ONLY the full address string in a single line, including street, area, and city.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      }
    });

    const address = response.text?.trim() || `Lat: ${lat}, Long: ${lng}`;
    
    let mapLink: string | undefined;
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      for (const chunk of chunks as any[]) {
        if (chunk.maps?.uri) {
          mapLink = chunk.maps.uri;
          break;
        }
      }
    }

    return { address, mapLink };
  } catch (error) {
    console.error("Gemini Location Error:", error);
    return { address: `Lat: ${lat}, Long: ${lng}` };
  }
}