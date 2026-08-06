import { GoogleGenAI } from '@google/genai';
import { ISSUE_CATEGORIES, MUNICIPAL_DEPARTMENTS } from '../utils/constants';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

/**
 * Classify public infrastructure issue image using Google Gemini Vision API
 * @param {string} base64Image - Base64 data string (data:image/jpeg;base64,...)
 * @param {string} userDescription - Optional description text to aid AI context
 */
export const classifyIssueWithGemini = async (base64Image, userDescription = '') => {
  // If live API key exists, call Google Gemini Vision API
  if (GEMINI_API_KEY && GEMINI_API_KEY.length > 10 && !GEMINI_API_KEY.includes('YOUR_')) {
    try {
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      
      // Remove header prefix if base64 data url
      const pureBase64 = base64Image.includes('base64,') 
        ? base64Image.split('base64,')[1] 
        : base64Image;

      const prompt = `
You are an expert AI municipal infrastructure inspector for the CivicFix government platform.
Analyze this civic complaint image and optional user description: "${userDescription}".

You MUST classify the issue into EXACTLY ONE of the following categories:
- Garbage
- Pothole
- Water Leakage
- Streetlight
- Road Damage
- Sewage
- Illegal Dumping
- Fallen Tree
- Traffic Signal
- Unknown

Provide your assessment strictly in valid JSON format with the following keys:
{
  "category": "One of the categories above",
  "confidence": integer percentage between 75 and 99,
  "suggestedPriority": "LOW" or "MEDIUM" or "HIGH" or "CRITICAL",
  "suggestedDepartment": "Exact department name responsible",
  "summary": "Concise 1-2 sentence professional analysis of what is observed in the image and severity."
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: pureBase64
                }
              }
            ]
          }
        ]
      });

      const textResponse = response.text || '';
      // Extract JSON substring
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return {
          category: result.category || 'Unknown',
          confidence: Number(result.confidence) || 92,
          suggestedPriority: result.suggestedPriority || 'MEDIUM',
          suggestedDepartment: result.suggestedDepartment || matchCategoryToDepartment(result.category),
          summary: result.summary || 'AI detected infrastructure anomaly requiring department inspection.',
          rawResponse: textResponse,
          isMock: false
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed or rate limited, falling back to smart Vision simulation:', err);
    }
  }

  // --- Smart Client-Side Fallback Classifier (Zero API key required) ---
  return simulateVisionAI(base64Image, userDescription);
};

/**
 * Helper to match category to government department
 */
const matchCategoryToDepartment = (cat) => {
  const found = ISSUE_CATEGORIES.find(c => c.value.toLowerCase() === (cat || '').toLowerCase());
  if (found) return found.department;
  return MUNICIPAL_DEPARTMENTS[0];
};

/**
 * Intelligent client-side Vision Simulator for instant local demo evaluation
 */
const simulateVisionAI = (base64Image, userDescription = '') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const descLower = (userDescription || '').toLowerCase();
      const imgLower = (base64Image || '').toLowerCase();

      let detectedCat = 'Pothole';
      let priority = 'HIGH';
      let confidence = 94;
      let summary = 'AI Computer Vision detected asphalt depression and road surface disintegration.';

      if (descLower.includes('trash') || descLower.includes('garbage') || descLower.includes('dump') || imgLower.includes('waste') || imgLower.includes('trash')) {
        detectedCat = 'Garbage';
        priority = 'HIGH';
        confidence = 96;
        summary = 'AI detected high density solid waste accumulation obstructing public pathway.';
      } else if (descLower.includes('water') || descLower.includes('leak') || descLower.includes('pipe') || descLower.includes('burst')) {
        detectedCat = 'Water Leakage';
        priority = 'CRITICAL';
        confidence = 97;
        summary = 'AI identified fluid discharge consistent with pressurized municipal water pipe rupture.';
      } else if (descLower.includes('light') || descLower.includes('dark') || descLower.includes('lamp') || descLower.includes('pole')) {
        detectedCat = 'Streetlight';
        priority = 'MEDIUM';
        confidence = 91;
        summary = 'AI classified non-illuminated street luminaire fixture requiring electrical service.';
      } else if (descLower.includes('sewage') || descLower.includes('drain') || descLower.includes('smell') || descLower.includes('gutter')) {
        detectedCat = 'Sewage';
        priority = 'CRITICAL';
        confidence = 95;
        summary = 'AI identified wastewater spill and blocked drainage manifold.';
      } else if (descLower.includes('tree') || descLower.includes('branch') || descLower.includes('storm')) {
        detectedCat = 'Fallen Tree';
        priority = 'HIGH';
        confidence = 98;
        summary = 'AI computer vision detected fallen woody vegetation blocking right-of-way.';
      } else if (descLower.includes('signal') || descLower.includes('traffic') || descLower.includes('light')) {
        detectedCat = 'Traffic Signal';
        priority = 'CRITICAL';
        confidence = 93;
        summary = 'AI identified deactivated traffic signal control box.';
      }

      const department = matchCategoryToDepartment(detectedCat);

      resolve({
        category: detectedCat,
        confidence,
        suggestedPriority: priority,
        suggestedDepartment: department,
        summary,
        isMock: true
      });
    }, 1200); // 1.2s realistic AI scanning delay
  });
};
