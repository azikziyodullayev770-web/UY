const API_KEY = "[ENCRYPTION_KEY]"; // To be updated by user
const MODEL_NAME = "gemini-1.5-flash";

export interface ModerationResult {
  status: "Approved" | "Rejected";
  reason: string;
  riskLevel: "Low" | "Medium" | "High";
  notes: string;
}

export async function moderateProperty(propertyData: {
  title: string;
  description: string;
  price: string;
  address: string;
  imageUrls: string[];
}): Promise<ModerationResult> {
  const prompt = `
    You are a professional Real Estate Content Moderator. 
    Analyze the following property listing for validity, realism, and safety.
    
    Property Data:
    - Title: ${propertyData.title}
    - Description: ${propertyData.description}
    - Price: ${propertyData.price}
    - Address: ${propertyData.address}
    
    Tasks:
    1. Check if the description is realistic and not spam.
    2. Identify if the price is realistic for the context.
    3. Check for misleading or clickbait content.
    
    RESPONSE FORMAT (Strict JSON):
    {
      "status": "Approved" or "Rejected",
      "reason": "Detailed explanation of your decision",
      "riskLevel": "Low", "Medium", or "High",
      "notes": "Internal notes for the admin"
    }
  `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            response_mime_type: "application/json",
          },
        }),
      }
    );

    const data = await response.json();
    const textResponse = data.candidates[0].content.parts[0].text;
    return JSON.parse(textResponse) as ModerationResult;
  } catch (error) {
    console.error("Moderation AI error:", error);
    return {
      status: "Rejected",
      reason: "AI Moderation failed to process the request.",
      riskLevel: "High",
      notes: "System error during AI analysis.",
    };
  }
}
