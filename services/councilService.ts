import { GoogleGenAI } from "@google/genai";
import { CouncilMember, CouncilResponse, PeerReview, ModelProvider, AppConfig, DebateMessage } from "../types";
import { SYSTEM_PROMPTS } from "../constants";

export class UnifiedCouncilService {
  private config: AppConfig;
  private googleClient: GoogleGenAI | null = null;

  constructor(config: AppConfig) {
    this.config = config;
    
    // Initialize Google Client
    const gKey = config.googleKey || process.env.API_KEY;
    if (gKey) {
      this.googleClient = new GoogleGenAI({ apiKey: gKey });
    }
  }

  // Check if a specific provider has a key configured
  public isProviderReady(provider: ModelProvider): boolean {
    const c = this.config;
    switch (provider) {
      case ModelProvider.GOOGLE: return !!(c.googleKey || process.env.API_KEY);
      case ModelProvider.OPENAI: return !!c.openaiKey;
      case ModelProvider.ANTHROPIC: return !!c.anthropicKey;
      case ModelProvider.GROQ: return !!c.groqKey;
      case ModelProvider.DEEPSEEK: return !!c.deepseekKey;
      case ModelProvider.MISTRAL: return !!c.mistralKey;
      case ModelProvider.OPENROUTER: return !!c.openRouterKey;
      case ModelProvider.NEMOTRON: return !!c.nemotronKey;
      case ModelProvider.GLM: return !!c.glmKey;
      case ModelProvider.MIMO: return !!c.mimoKey;
      case ModelProvider.DEVSTRAL: return !!c.devstralKey;
      case ModelProvider.KAT: return !!c.katKey;
      case ModelProvider.OLMO: return !!c.olmoKey;
      case ModelProvider.GEMMA: return !!c.gemmaKey;
      case ModelProvider.OLLAMA:
      case ModelProvider.CUSTOM: return true; // Usually local or custom baseUrl handles it
      default: return false;
    }
  }

  // Filter council to only include members with valid keys
  public getReadyMembers(members: CouncilMember[]): CouncilMember[] {
    return members.filter(m => this.isProviderReady(m.provider));
  }

  private async generate(member: CouncilMember, prompt: string, systemInstruction?: string): Promise<string> {
    if (!this.isProviderReady(member.provider)) {
      return `[Skipped] ${member.name}: Provider not configured.`;
    }

    try {
      switch (member.provider) {
        case ModelProvider.GOOGLE:
          return this.callGoogle(member, prompt, systemInstruction);
        case ModelProvider.ANTHROPIC:
          return this.callAnthropic(member, prompt, systemInstruction);
        default:
          return this.callGeneric(member, prompt, systemInstruction);
      }
    } catch (error: any) {
      console.error(`Error with ${member.name}:`, error);
      const msg = error.message || "Unknown error";
      if (msg.includes("401") || msg.toLowerCase().includes("invalid api key")) {
        return `[Unauthorized] ${member.name}: Invalid or missing API key.`;
      }
      return `[Error] ${member.name}: ${msg}`;
    }
  }

  private async callGoogle(member: CouncilMember, prompt: string, systemInstruction?: string): Promise<string> {
    if (!this.googleClient) throw new Error("Google API Key missing.");
    const response = await this.googleClient.models.generateContent({
      model: member.modelId,
      contents: prompt,
      config: { systemInstruction, temperature: 0.7 }
    });
    return response.text || "";
  }

  private async callAnthropic(member: CouncilMember, prompt: string, systemInstruction?: string): Promise<string> {
    const apiKey = this.config.anthropicKey;
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
        "dangerously-allow-browser": "true" 
      },
      body: JSON.stringify({
        model: member.modelId,
        max_tokens: 1024,
        system: systemInstruction,
        messages: [{ role: "user", content: prompt }]
      })
    });
    if (!response.ok) throw new Error(`Anthropic Error ${response.status}`);
    const data = await response.json();
    return data.content?.[0]?.text || "";
  }

  private async callGeneric(member: CouncilMember, prompt: string, systemInstruction?: string): Promise<string> {
    let apiKey = "";
    let baseUrl = "";

    switch (member.provider) {
      case ModelProvider.OPENAI: apiKey = this.config.openaiKey; baseUrl = "https://api.openai.com/v1"; break;
      case ModelProvider.GROQ: apiKey = this.config.groqKey; baseUrl = member.baseUrl || "https://api.groq.com/openai/v1"; break;
      case ModelProvider.DEEPSEEK: apiKey = this.config.deepseekKey; baseUrl = member.baseUrl || "https://api.deepseek.com"; break;
      case ModelProvider.MISTRAL: apiKey = this.config.mistralKey; baseUrl = "https://api.mistral.ai/v1"; break;
      case ModelProvider.OPENROUTER: apiKey = this.config.openRouterKey; baseUrl = "https://openrouter.ai/api/v1"; break;
      case ModelProvider.OLLAMA: apiKey = "ollama"; baseUrl = member.baseUrl || "http://localhost:11434/v1"; break;
      case ModelProvider.NEMOTRON: apiKey = this.config.nemotronKey; baseUrl = member.baseUrl || "https://integrate.api.nvidia.com/v1"; break;
      case ModelProvider.GLM: apiKey = this.config.glmKey; baseUrl = member.baseUrl || "https://open.bigmodel.cn/api/paas/v4"; break;
      default: apiKey = this.config.customKey; baseUrl = member.baseUrl || "http://localhost:1234/v1";
    }

    if (!apiKey && member.provider !== ModelProvider.OLLAMA) throw new Error("Missing Key");

    const messages = [];
    if (systemInstruction) messages.push({ role: "system", content: systemInstruction });
    messages.push({ role: "user", content: prompt });

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: member.modelId, messages, temperature: 0.7 })
    });
    if (!response.ok) throw new Error(`API Error ${response.status}`);
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  }

  async getCouncilResponses(query: string, members: CouncilMember[]): Promise<CouncilResponse[]> {
    const promises = members.map(async (member) => ({
      memberId: member.id,
      content: await this.generate(member, query, member.systemPrompt || SYSTEM_PROMPTS.COUNCIL_MEMBER(query, member.description)),
      timestamp: Date.now()
    }));
    return Promise.all(promises);
  }

  async getPeerReviews(query: string, members: CouncilMember[], responses: CouncilResponse[]): Promise<PeerReview[]> {
    const activeResponses = responses.filter(r => !r.content.startsWith("[Skipped]") && !r.content.startsWith("[Unauthorized]"));
    const reviewPromises: Promise<PeerReview | null>[] = [];

    members.forEach(reviewer => {
      activeResponses.forEach(target => {
        if (target.memberId === reviewer.id) return;
        reviewPromises.push((async () => {
          const critique = await this.generate(reviewer, SYSTEM_PROMPTS.PEER_REVIEWER(query, target.content, members.find(m => m.id === target.memberId)?.name || "Peer"), "Analyze logical consistency.");
          if (critique.startsWith("[Skipped]") || critique.startsWith("[Unauthorized]")) return null;
          const scoreMatch = critique.match(/Score:\s*(\d+)/i);
          return { reviewerId: reviewer.id, targetId: target.memberId, content: critique, score: scoreMatch ? parseInt(scoreMatch[1], 10) : 5 };
        })());
      });
    });

    const results = await Promise.all(reviewPromises);
    return results.filter((r): r is PeerReview => r !== null);
  }

  async generateDebateResponse(
    query: string,
    member: CouncilMember,
    councilResponses: CouncilResponse[],
    debateMessages: DebateMessage[],
    members: CouncilMember[]
  ): Promise<string> {
    let context = `ORIGINAL DIRECTIVE: "${query}"\n\n`;
    context += "INITIAL POSITIONS:\n";
    councilResponses.forEach(r => {
      context += `[${members.find(m => m.id === r.memberId)?.name}]: ${r.content}\n\n`;
    });
    
    if (debateMessages.length > 0) {
      context += "DEBATE HISTORY:\n";
      debateMessages.forEach(m => {
        const authorName = m.memberId === 'user' ? 'User' : members.find(x => x.id === m.memberId)?.name || 'Unknown';
        context += `[${authorName}]: ${m.content}\n\n`;
      });
    }

    const prompt = `
      ROLE: ${member.name}
      ${member.systemPrompt || ''}
      
      You are participating in a fast-paced, live debate with other AI agents and the user. 
      Review the original directive, the initial positions, and the debate history.

      TONE INSTRUCTION:
      First, quickly evaluate the seriousness of the ORIGINAL DIRECTIVE.
      - If it is a lighthearted, subjective, or theoretical topic (e.g., "Rust vs Go", "Pineapple on pizza", "Chicken or egg"), make your response highly entertaining, passionate, and "popcorn-worthy". Use rhetorical questions, sharp wit, and strong rebuttals. Don't hold back, make it a spectacle.
      - If it is a serious, sensitive, deeply personal, or critical topic (e.g., medical, legal, emotional distress, serious financial decisions), maintain a highly respectful, empathetic, and professional tone. Focus on nuanced, thoughtful analysis.

      Provide a concise, compelling argument defending your position, critiquing another's, or responding to the user.
      Keep it under 80 words for maximum punchiness. Respond directly as your persona. Do not use prefixes like "${member.name}:".
    `;

    return this.generate(member, prompt, "You are in a live debate. Be concise, persuasive, context-aware, and stay in character.");
  }

  async synthesize(query: string, responses: CouncilResponse[], reviews: PeerReview[], debateMessages: DebateMessage[], members: CouncilMember[], chairman: CouncilMember): Promise<string> {
    const context = this.buildContext(query, responses, reviews, debateMessages, members);
    return this.generate(chairman, SYSTEM_PROMPTS.CHAIRMAN(query, context), chairman.systemPrompt);
  }

  async synthesizeStream(query: string, responses: CouncilResponse[], reviews: PeerReview[], debateMessages: DebateMessage[], members: CouncilMember[], chairman: CouncilMember, onChunk: (chunk: string) => void): Promise<string> {
    const context = this.buildContext(query, responses, reviews, debateMessages, members);
    return this.generateStream(chairman, SYSTEM_PROMPTS.CHAIRMAN(query, context), chairman.systemPrompt, onChunk);
  }

  private buildContext(query: string, responses: CouncilResponse[], reviews: PeerReview[], debateMessages: DebateMessage[], members: CouncilMember[]): string {
    let context = "--- COUNCIL FINDINGS ---\n";
    responses.filter(r => !r.content.startsWith("[")).forEach(r => {
      context += `\n[${members.find(x => x.id === r.memberId)?.name}]: ${r.content}\n`;
    });
    
    if (reviews && reviews.length > 0) {
      context += "\n--- PEER REVIEWS ---\n";
      reviews.forEach(r => {
        context += `\n[${members.find(m => m.id === r.reviewerId)?.name} reviewing ${members.find(m => m.id === r.targetId)?.name}]: ${r.content}\n`;
      });
    }

    if (debateMessages && debateMessages.length > 0) {
      context += "\n--- DEBATE TRANSCRIPT ---\n";
      debateMessages.forEach(m => {
        const authorName = m.memberId === 'user' ? 'User' : members.find(x => x.id === m.memberId)?.name || 'Unknown';
        context += `\n[${authorName}]: ${m.content}\n`;
      });
    }

    return context;
  }

  private async generateStream(member: CouncilMember, prompt: string, systemInstruction?: string, onChunk?: (chunk: string) => void): Promise<string> {
    if (!this.isProviderReady(member.provider)) {
      const msg = `[Skipped] ${member.name}: Provider not configured.`;
      onChunk?.(msg);
      return msg;
    }

    try {
      switch (member.provider) {
        case ModelProvider.GOOGLE:
          return this.callGoogleStream(member, prompt, systemInstruction, onChunk);
        case ModelProvider.ANTHROPIC:
          return this.callAnthropicStream(member, prompt, systemInstruction, onChunk);
        default:
          return this.callGenericStream(member, prompt, systemInstruction, onChunk);
      }
    } catch (error: any) {
      console.error(`Error with ${member.name}:`, error);
      const msg = error.message || "Unknown error";
      const errorMsg = `[Error] ${member.name}: ${msg}`;
      onChunk?.(errorMsg);
      return errorMsg;
    }
  }

  private async callGoogleStream(member: CouncilMember, prompt: string, systemInstruction?: string, onChunk?: (chunk: string) => void): Promise<string> {
    if (!this.googleClient) throw new Error("Google API Key missing.");
    const response = await this.googleClient.models.generateContentStream({
      model: member.modelId,
      contents: prompt,
      config: { systemInstruction, temperature: 0.7 }
    });

    let fullText = "";
    for await (const chunk of response) {
      const text = chunk.text || "";
      fullText += text;
      onChunk?.(text);
    }
    return fullText;
  }

  private async callAnthropicStream(member: CouncilMember, prompt: string, systemInstruction?: string, onChunk?: (chunk: string) => void): Promise<string> {
    const apiKey = this.config.anthropicKey;
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
        "dangerously-allow-browser": "true" 
      },
      body: JSON.stringify({
        model: member.modelId,
        max_tokens: 1024,
        system: systemInstruction,
        messages: [{ role: "user", content: prompt }],
        stream: true
      })
    });

    if (!response.ok) throw new Error(`Anthropic Error ${response.status}`);
    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
              const text = parsed.delta.text;
              fullText += text;
              onChunk?.(text);
            }
          } catch (e) {
            // Ignore parse errors for partial chunks
          }
        }
      }
    }
    return fullText;
  }

  private async callGenericStream(member: CouncilMember, prompt: string, systemInstruction?: string, onChunk?: (chunk: string) => void): Promise<string> {
    let apiKey = "";
    let baseUrl = "";

    switch (member.provider) {
      case ModelProvider.OPENAI: apiKey = this.config.openaiKey; baseUrl = "https://api.openai.com/v1"; break;
      case ModelProvider.GROQ: apiKey = this.config.groqKey; baseUrl = member.baseUrl || "https://api.groq.com/openai/v1"; break;
      case ModelProvider.DEEPSEEK: apiKey = this.config.deepseekKey; baseUrl = member.baseUrl || "https://api.deepseek.com"; break;
      case ModelProvider.MISTRAL: apiKey = this.config.mistralKey; baseUrl = "https://api.mistral.ai/v1"; break;
      case ModelProvider.OPENROUTER: apiKey = this.config.openRouterKey; baseUrl = "https://openrouter.ai/api/v1"; break;
      case ModelProvider.OLLAMA: apiKey = "ollama"; baseUrl = member.baseUrl || "http://localhost:11434/v1"; break;
      case ModelProvider.NEMOTRON: apiKey = this.config.nemotronKey; baseUrl = member.baseUrl || "https://integrate.api.nvidia.com/v1"; break;
      case ModelProvider.GLM: apiKey = this.config.glmKey; baseUrl = member.baseUrl || "https://open.bigmodel.cn/api/paas/v4"; break;
      default: apiKey = this.config.customKey; baseUrl = member.baseUrl || "http://localhost:1234/v1";
    }

    if (!apiKey && member.provider !== ModelProvider.OLLAMA) throw new Error("Missing Key");

    const messages = [];
    if (systemInstruction) messages.push({ role: "system", content: systemInstruction });
    messages.push({ role: "user", content: prompt });

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: member.modelId, messages, temperature: 0.7, stream: true })
    });

    if (!response.ok) throw new Error(`API Error ${response.status}`);
    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const text = parsed.choices?.[0]?.delta?.content || "";
            if (text) {
              fullText += text;
              onChunk?.(text);
            }
          } catch (e) {
            // Ignore parse errors for partial chunks
          }
        }
      }
    }
    return fullText;
  }
}