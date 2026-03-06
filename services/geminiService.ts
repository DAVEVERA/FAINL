import { GoogleGenAI } from "@google/genai";
import { CouncilMember, CouncilResponse, PeerReview } from "../types";

export class GeminiChairmanService {
  private ai: GoogleGenAI;

  constructor() {
    // strict requirement: usage of process.env.API_KEY
    const apiKey = process.env.API_KEY || ""; 
    this.ai = new GoogleGenAI({ apiKey });
  }

  async synthesizeResponse(
    query: string, 
    members: CouncilMember[], 
    responses: CouncilResponse[], 
    reviews: PeerReview[]
  ): Promise<string> {
    if (!process.env.API_KEY) {
      return "Critical Error: Google API Key is missing (process.env.API_KEY). The Chairman cannot preside.";
    }

    try {
      // Construct the context for the Chairman
      let context = `User Query: "${query}"\n\n`;

      context += "--- COUNCIL RESPONSES ---\n";
      responses.forEach(r => {
        const member = members.find(m => m.id === r.memberId);
        context += `Model: ${member?.name}\nResponse: ${r.content}\n\n`;
      });

      context += "--- PEER REVIEWS ---\n";
      reviews.forEach(r => {
        const reviewer = members.find(m => m.id === r.reviewerId);
        const target = members.find(m => m.id === r.targetId);
        context += `Reviewer: ${reviewer?.name} -> Target: ${target?.name}\nCritique: ${r.content}\n\n`;
      });

      // Use Gemini 3 Pro for complex reasoning and synthesis
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: context,
        config: {
          systemInstruction: "You are the Chairman. Synthesize the provided answers into one authoritative response. Resolve conflicts and filter errors.",
          temperature: 0.7, // Slightly creative but focused
          thinkingConfig: { thinkingBudget: 1024 } // Use thinking for better synthesis
        },
      });

      return response.text || "The Chairman remained silent (No output generated).";

    } catch (error) {
      console.error("Gemini Chairman Error:", error);
      return "The Chairman encountered an error while synthesizing the council's findings.";
    }
  }
}