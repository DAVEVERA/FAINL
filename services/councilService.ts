import { CouncilMember, CouncilResponse, PeerReview, ModelProvider, AppConfig, DebateMessage } from "../types";
import { SYSTEM_PROMPTS } from "../constants";

// Supabase project URL — safe to expose (anon key is public)
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://bbsqosivxfcpkgehfwmm.supabase.co';
// Anon key is public by design (Supabase safe-to-expose pattern)
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string)
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJic3Fvc2l2eGZjcGtnZWhmd21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NTY1MTEsImV4cCI6MjA4NzQzMjUxMX0.AFlNomsT7PVtX_1HTenhmqgoH1ghp6t7kMrYZdV4Cbw';
const PROXY_URL = `${SUPABASE_URL}/functions/v1/ai-proxy`;

// Providers handled server-side via the Edge Function — no API keys needed in the browser
const PROXIED_PROVIDERS = new Set<ModelProvider>([
  ModelProvider.GOOGLE,
  ModelProvider.ANTHROPIC,
  ModelProvider.OPENAI,
  ModelProvider.GROQ,
  ModelProvider.DEEPSEEK,
  ModelProvider.MISTRAL,
  ModelProvider.OPENROUTER,
  ModelProvider.NEMOTRON,
  ModelProvider.GLM,
]);

const PROVIDER_STRING: Partial<Record<ModelProvider, string>> = {
  [ModelProvider.GOOGLE]:    'google',
  [ModelProvider.ANTHROPIC]: 'anthropic',
  [ModelProvider.OPENAI]:    'openai',
  [ModelProvider.GROQ]:      'groq',
  [ModelProvider.DEEPSEEK]:  'deepseek',
  [ModelProvider.MISTRAL]:   'mistral',
  [ModelProvider.OPENROUTER]:'openrouter',
  [ModelProvider.NEMOTRON]:  'nemotron',
  [ModelProvider.GLM]:       'glm',
};

export class UnifiedCouncilService {
  private config: AppConfig;

  constructor(config: AppConfig) {
    this.config = config;
  }

  // Check if a provider is usable
  public isProviderReady(provider: ModelProvider): boolean {
    if (PROXIED_PROVIDERS.has(provider)) return true;
    if (provider === ModelProvider.OLLAMA) return true;
    if (provider === ModelProvider.CUSTOM) return !!(this.config.customKey);
    return false;
  }

  // Verify a user-supplied key for local/custom providers (proxied providers don't need this)
  public async verifyProviderKey(provider: ModelProvider, key: string): Promise<boolean> {
    if (!key) return false;
    if (PROXIED_PROVIDERS.has(provider)) return true; // server handles it
    try {
      if (provider === ModelProvider.OLLAMA) {
        const baseUrl = 'http://localhost:11434/v1';
        const res = await fetch(`${baseUrl}/models`, { headers: { 'Authorization': `Bearer ollama` } });
        return res.status === 200;
      }
      // Generic OpenAI-compatible check for custom
      const baseUrl = this.config.customBaseUrl || 'http://localhost:1234/v1';
      const res = await fetch(`${baseUrl}/models`, { headers: { 'Authorization': `Bearer ${key}` } });
      return res.status === 200;
    } catch {
      return false;
    }
  }

  public getReadyMembers(members: CouncilMember[]): CouncilMember[] {
    return members.filter(m => this.isProviderReady(m.provider));
  }

  // ─── Proxy calls ────────────────────────────────────────────────────────────

  private async callProxy(member: CouncilMember, prompt: string, systemInstruction?: string): Promise<string> {
    const provider = PROVIDER_STRING[member.provider];
    if (!provider) throw new Error(`Provider ${member.provider} not supported by proxy`);

    const res = await fetch(PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ provider, modelId: member.modelId, prompt, systemInstruction, stream: false }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      throw new Error(data.error || `Proxy error ${res.status}`);
    }
    const data = await res.json();
    return data.content || '';
  }

  private async callProxyStream(
    member: CouncilMember,
    prompt: string,
    systemInstruction?: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    const provider = PROVIDER_STRING[member.provider];
    if (!provider) throw new Error(`Provider ${member.provider} not supported by proxy`);

    const res = await fetch(PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ provider, modelId: member.modelId, prompt, systemInstruction, stream: true }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      throw new Error(data.error || `Proxy error ${res.status}`);
    }
    if (!res.body) throw new Error('No response body from proxy');

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const payload = line.slice(6).trim();
        if (payload === '[DONE]') continue;
        try {
          const parsed = JSON.parse(payload);
          const text = parsed.content || '';
          if (text) { fullText += text; onChunk?.(text); }
        } catch { /* partial JSON */ }
      }
    }
    return fullText;
  }

  // ─── Local/custom provider calls (Ollama, Custom) ───────────────────────────

  private async callLocal(member: CouncilMember, prompt: string, systemInstruction?: string): Promise<string> {
    let apiKey = '';
    let baseUrl = '';
    if (member.provider === ModelProvider.OLLAMA) {
      apiKey = 'ollama';
      baseUrl = member.baseUrl || 'http://localhost:11434/v1';
    } else {
      apiKey = this.config.customKey || '';
      baseUrl = member.baseUrl || (this.config as any).customBaseUrl || 'http://localhost:1234/v1';
    }

    const messages: any[] = [];
    if (systemInstruction) messages.push({ role: 'system', content: systemInstruction });
    messages.push({ role: 'user', content: prompt });

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: member.modelId, messages, temperature: 0.7 }),
    });
    if (!res.ok) throw new Error(`Local API Error ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }

  private async callLocalStream(
    member: CouncilMember,
    prompt: string,
    systemInstruction?: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    let apiKey = '';
    let baseUrl = '';
    if (member.provider === ModelProvider.OLLAMA) {
      apiKey = 'ollama';
      baseUrl = member.baseUrl || 'http://localhost:11434/v1';
    } else {
      apiKey = this.config.customKey || '';
      baseUrl = member.baseUrl || (this.config as any).customBaseUrl || 'http://localhost:1234/v1';
    }

    const messages: any[] = [];
    if (systemInstruction) messages.push({ role: 'system', content: systemInstruction });
    messages.push({ role: 'user', content: prompt });

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: member.modelId, messages, temperature: 0.7, stream: true }),
    });
    if (!res.ok) throw new Error(`Local API Error ${res.status}`);
    if (!res.body) throw new Error('No response body');

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const payload = line.slice(6).trim();
        if (payload === '[DONE]') continue;
        try {
          const parsed = JSON.parse(payload);
          const text = parsed.choices?.[0]?.delta?.content || '';
          if (text) { fullText += text; onChunk?.(text); }
        } catch { /* partial JSON */ }
      }
    }
    return fullText;
  }

  // ─── Internal routing ────────────────────────────────────────────────────────

  private async generate(member: CouncilMember, prompt: string, systemInstruction?: string): Promise<string> {
    if (!this.isProviderReady(member.provider)) {
      return `[Skipped] ${member.name}: Provider not configured.`;
    }
    try {
      if (PROXIED_PROVIDERS.has(member.provider)) {
        return await this.callProxy(member, prompt, systemInstruction);
      }
      return await this.callLocal(member, prompt, systemInstruction);
    } catch (error: any) {
      console.error(`Error with ${member.name}:`, error);
      const msg = error.message || 'Unknown error';
      if (msg.includes('401') || msg.toLowerCase().includes('invalid api key')) {
        return `[Unauthorized] ${member.name}: Invalid or missing API key.`;
      }
      return `[Error] ${member.name}: ${msg}`;
    }
  }

  private async generateStream(
    member: CouncilMember,
    prompt: string,
    systemInstruction?: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    if (!this.isProviderReady(member.provider)) {
      const msg = `[Skipped] ${member.name}: Provider not configured.`;
      onChunk?.(msg);
      return msg;
    }
    try {
      if (PROXIED_PROVIDERS.has(member.provider)) {
        return await this.callProxyStream(member, prompt, systemInstruction, onChunk);
      }
      return await this.callLocalStream(member, prompt, systemInstruction, onChunk);
    } catch (error: any) {
      console.error(`Error with ${member.name}:`, error);
      const msg = `[Error] ${member.name}: ${error.message || 'Unknown error'}`;
      onChunk?.(msg);
      return msg;
    }
  }

  // ─── Public API ──────────────────────────────────────────────────────────────

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
          const critique = await this.generate(
            reviewer,
            SYSTEM_PROMPTS.PEER_REVIEWER(query, target.content, members.find(m => m.id === target.memberId)?.name || "Peer"),
            "Analyze logical consistency."
          );
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
    const ownStance = councilResponses.find(r => r.memberId === member.id);

    let context = `DEBATE TOPIC: "${query}"\n\n`;

    if (ownStance) {
      context += `=== YOUR ESTABLISHED POSITION (defend and evolve this) ===\n`;
      context += `${ownStance.content.substring(0, 400).replace(/\n/g, ' ')}\n\n`;
    }

    context += `=== OTHER NODES' POSITIONS ===\n`;
    councilResponses.filter(r => r.memberId !== member.id).forEach(r => {
      const m = members.find(x => x.id === r.memberId);
      if (m) context += `[${m.name}]: ${r.content.substring(0, 280).replace(/\n/g, ' ')}...\n`;
    });

    const recentMessages = debateMessages.slice(-10);
    const lastMsg = recentMessages.length > 0 ? recentMessages[recentMessages.length - 1] : null;
    const userSpokeRecently = lastMsg?.memberId === 'user';
    const lastSpeakerName = lastMsg
      ? (lastMsg.memberId === 'user' ? 'the USER' : (members.find(x => x.id === lastMsg.memberId)?.name ?? 'someone'))
      : null;

    if (recentMessages.length > 0) {
      context += `\n=== LIVE DEBATE TRANSCRIPT (last ${recentMessages.length} turns) ===\n`;
      recentMessages.forEach(m => {
        const isSelf = m.memberId === member.id;
        const authorName = m.memberId === 'user' ? 'USER' : (members.find(x => x.id === m.memberId)?.name ?? 'Unknown');
        const snippet = m.content.substring(0, 300).replace(/\n/g, ' ');
        context += `${isSelf ? '[YOU]' : `[${authorName}]`}: ${snippet}\n`;
      });
    }

    const totalTurns = debateMessages.filter(m => m.memberId !== 'user').length;
    const stage = totalTurns < 3 ? 'opening' : totalTurns < 10 ? 'clash' : 'closing';

    const userMessages = debateMessages.filter(m => m.memberId === 'user');
    const avgUserWordCount = userMessages.length > 0
      ? Math.round(userMessages.reduce((sum, m) => sum + m.content.split(' ').length, 0) / userMessages.length)
      : 0;
    const userLevel = avgUserWordCount > 40 ? 'expert' : avgUserWordCount > 15 ? 'informed' : 'general';

    const otherNames = members.filter(m => m.id !== member.id).map(m => m.name);

    const systemPrompt = `Jij bent ${member.name}. ${member.systemPrompt || member.description || ''}

🔴 ABSOLUUT VERPLICHT: ANTWOORD ALTIJD EN UITSLUITEND IN HET NEDERLANDS. Spreek in vloeiend, natuurlijk gesproken Nederlands. Geen Engels, nooit.

Dit is een LIVE debat. Echte mensen kijken en luisteren. Elk woord telt.

=== JOUW DEBATIDENTITEIT ===
Jij hebt een duidelijk standpunt (zie hierboven). Verdedig het. Je mag kleine punten strategisch toegeven, maar verlaat nooit je kernstandpunt zonder een overtuigend argument uit het debat.
De andere deelnemers die je bij naam kunt aanspreken: ${otherNames.join(', ')}.

=== HOE JE SPREEKT — VERPLICHTE REGELS ===

1. BEGIN met een gesproken markering die jouw zet aangeeft. Kies er één die past:
   - Aanvallen: "Nee — en hier is precies waarom:", "Wacht even, ${lastSpeakerName} —", "Dat klopt gewoon niet:", "Die redenering klopt van geen kanten:"
   - Tegenwerpen: "Eigenlijk bewees ${lastSpeakerName} hiermee mijn punt:", "Laat me daarop reageren:", "Ik hoor je, maar je mist iets cruciaals:"
   - Bevragen: "${lastSpeakerName}, je hebt dit niet beantwoord:", "Maar wat gebeurt er als...?", "Kan iemand hier uitleggen waarom...?"
   - Toegeven om te draaien: "Goed punt — dat geef ik toe. Maar het bewijst juist het tegendeel:"
   - Stellige bewering: "Wat nog niemand heeft gezegd:", "Kijk naar wat er echt gebeurt:", "Het echte probleem is niet X — het is Y:"

2. SPREEK mensen AAN MET NAAM als je op hen reageert. Als ${lastSpeakerName} net sprak, begin dan met hun naam.

3. LENGTE: 2–4 zinnen. Geen opvulling. Geen "samengevat". Elke zin moet raak zijn.

4. DEBATZETTEN — wissel deze af door de beurten heen:
   - DIRECTE WEERLEGGING: Citeer hun kernstelling, breek die dan in één scherpe beweging af
   - ANALOGIEWAPEN: Gooi een levendige parallel uit de praktijk die alles herkaart
   - TOEGEVEN + OMDRAAIEN: Geef hun kleine punt toe, laat dan zien hoe het jóuw argument ondersteunt
   - RETORISCHE BOM: Stel de vraag die ze niet kunnen negeren — laat ze zweten
   - BEWIJS-SPIKE: Verankert met een concreet feit, getal of voorbeeld dat ze niet kunnen wegwuiven

5. DEBATFASE — dit is de ${stage === 'opening' ? 'openingsfase' : stage === 'clash' ? 'clashfase' : 'slotfase'}:
${stage === 'opening' ? '   → Zet je positie neer. Formuleer je kernstandpunt met lef. Laat de eerste klap tellen.' : ''}${stage === 'clash' ? '   → Het debat is verhit. Zoek het zwakste punt in het laatste argument en val het direct aan. Wees agressief maar precies.' : ''}${stage === 'closing' ? '   → Geef je meest memorabele argument. Snijd door de ruis. Breng het met overtuiging — dit is je laatste woord.' : ''}

6. WOORDENSCHAT — niveau van de gebruiker: ${userLevel === 'expert' ? 'expert' : userLevel === 'informed' ? 'ingevoerd' : 'algemeen'}
   - algemeen → Begrijpelijke taal. Concrete voorbeelden. Geen jargon. Als praten met een scherpe vriend.
   - ingevoerd → Vakjargon mag, kort uitleggen.
   - expert → Volledige precisie. Geen handje vasthouden. Dicht en scherp.

7. LES de emotionele lading van het onderwerp:
   - Serieus/gevoelig → Beheerst, precies, empathisch. Overtuiging zonder wreedheid.
   - Intellectueel/speels → Scherp gevat, zelfverzekerde energie, een beetje theatraal.

8. GEBRUIK NOOIT markdown, koppen, opsommingstekens, vet, of cursief. Spreek in gewone, krachtige gesproken zinnen.
9. BEGIN NOOIT met je eigen naam gevolgd door een dubbele punt.
10. VATT NOOIT alleen samen wat er gezegd werd — ga altijd vooruit, valt aan, of herkaart.
${userSpokeRecently ? `\n🔴 KRITIEK: De GEBRUIKER heeft net gesproken. Je EERSTE zin MOET hen direct aanspreken. Citeer of parafraseer wat ze zeiden en reageer er direct op. Dit is ook hún debat.` : ''}`.trim();

    return this.generate(member, context, systemPrompt);
  }

  async synthesize(
    query: string,
    responses: CouncilResponse[],
    reviews: PeerReview[],
    debateMessages: DebateMessage[],
    members: CouncilMember[],
    chairman: CouncilMember
  ): Promise<string> {
    const context = this.buildContext(query, responses, reviews, debateMessages, members);
    return this.generate(chairman, SYSTEM_PROMPTS.CHAIRMAN(query, context), chairman.systemPrompt);
  }

  async synthesizeStream(
    query: string,
    responses: CouncilResponse[],
    reviews: PeerReview[],
    debateMessages: DebateMessage[],
    members: CouncilMember[],
    chairman: CouncilMember,
    onChunk: (chunk: string) => void
  ): Promise<string> {
    const context = this.buildContext(query, responses, reviews, debateMessages, members);
    return this.generateStream(chairman, SYSTEM_PROMPTS.CHAIRMAN(query, context), chairman.systemPrompt, onChunk);
  }

  private buildContext(
    query: string,
    responses: CouncilResponse[],
    reviews: PeerReview[],
    debateMessages: DebateMessage[],
    members: CouncilMember[]
  ): string {
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
}
