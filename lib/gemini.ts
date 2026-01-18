
import { GoogleGenAI } from "@google/genai";

export const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export async function generateComicScenario(prompt: string) {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `基于以下内容，创作一个富有诗意的、适合改编成漫剧的10分钟生活片段场景描述：${prompt}. 返回一段简短动人的文字。`,
    });
    return response.text;
  } catch (e) {
    console.error("Scenario generation failed", e);
    return undefined;
  }
}

export async function generateComicImage(scenario: string) {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `A cinematic, minimalist watercolor style illustration of this scene: ${scenario}. Muted earthy tones, focus on atmosphere and light.` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
  } catch (e) {
    console.error("Image generation failed", e);
  }
  return null;
}
