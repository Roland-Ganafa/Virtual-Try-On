
import { GoogleGenAI } from "@google/genai";
import { ImageData } from "../types";

export class VTONService {
  private ai: any;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async processTryOn(person: ImageData, garment: ImageData): Promise<string> {
    try {
      // Using gemini-2.5-flash-image for high-fidelity image editing tasks
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: person.base64.split(',')[1],
                mimeType: person.mimeType,
              },
            },
            {
              inlineData: {
                data: garment.base64.split(',')[1],
                mimeType: garment.mimeType,
              },
            },
            {
              text: `Perform a high-fidelity virtual try-on. 
              Image 1 is the user portrait. Image 2 is the target garment.
              Task: Render the person from Image 1 wearing the exact garment from Image 2.
              Requirements:
              1. 100% fidelity to the brand style of the garment.
              2. Preserve intricate details: logos, text, textures (silk/denim/wool), and stitch patterns.
              3. Realistic draping over the user's body shape (DensePose alignment).
              4. Synthesize realistic lighting, shadows, and highlights that match the person's photo.
              5. Ensure studio-quality blending at neck, sleeves, and waist.`,
            },
          ],
        },
      });

      let generatedImageUrl = '';
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          generatedImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }

      if (!generatedImageUrl) {
        throw new Error("No image was generated in the response.");
      }

      return generatedImageUrl;
    } catch (error) {
      console.error("VTON Service Error:", error);
      throw error;
    }
  }
}

export const vtonService = new VTONService();
