import { FC } from 'react';
import { Gavel, Scale, FileText, Zap, Users, AlertTriangle } from 'lucide-react';

export const TermsOfServicePage: FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-24 animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 p-8 md:p-16 shadow-[24px_24px_0px_0px_rgba(0,0,0,1)] dark:shadow-[24px_24px_0px_1px_rgba(255,255,255,0.1)]">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16 pb-16 border-b-4 border-black/5 dark:border-white/5">
          <div className="w-24 h-24 bg-black dark:bg-white rounded flex items-center justify-center shrink-0 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[12px_12px_0px_1px_rgba(255,255,255,0.05)]">
            <Gavel className="text-white dark:text-black w-12 h-12" />
          </div>
          <div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight mb-4 text-black dark:text-white">Algemene Voorwaarden</h1>
            <p className="text-black/40 dark:text-white/40 font-bold uppercase text-xs md:text-sm tracking-[0.3em]">Operationeel Bestuur & Gebruiksstandaarden • Versie 1.0.0</p>
          </div>
        </div>

        <div className="prose prose-xl max-w-none prose-headings:uppercase prose-headings:font-black prose-headings:tracking-tighter prose-p:text-black/70 dark:prose-p:text-white/70 prose-strong:text-black dark:prose-strong:text-white prose-li:text-black/70 dark:prose-li:text-white/70 leading-relaxed space-y-16">
          
          <section>
            <div className="flex items-center gap-4 mb-6 text-black dark:text-white">
              <Zap className="w-8 h-8" />
              <h2 className="text-3xl m-0">01. Neurale Autorisatie</h2>
            </div>
            <p>
              Door toegang te krijgen tot de FAINL terminal, wordt je een beperkte, niet-exclusieve licentie verleend om neurale missies te orkestreren. 
              Deze autorisatie is afhankelijk van je naleving van de hierin beschreven protocolstandaarden. 
              FAINL is een autonoom netwerk; orkestratie wordt uitgevoerd naar eigen goeddunken en risico van de gebruiker.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6 text-black dark:text-white">
              <Users className="w-8 h-8" />
              <h2 className="text-3xl m-0">02. Raad van Beraadslaging</h2>
            </div>
            <p>
              FAINL maakt gebruik van een multi-node consensusmechanisme voor beraadslaging. 
            </p>
            <ul>
              <li>**Non-Deterministic Output**: Neurale oordelen worden gegenereerd door autonome agenten en kunnen per sessie variëren.</li>
              <li>**No Human Mediation**: De beraadslagingen zijn volledig autonoom. Het onderhoudspersoneel van FAINL interfereert niet met de logica van de raad.</li>
              <li>**Responsibility of Verdict**: De gebruiker erkent dat oordelen adviserend zijn en geen professioneel, juridisch of financieel advies vormen.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6 text-black dark:text-white">
              <Scale className="w-8 h-8" />
              <h2 className="text-3xl m-0">03. Gebruiksbeperkingen & Credits</h2>
            </div>
            <p>
              Toegang tot het netwerk wordt geregeld door neurale toegangsniveaus. 
            </p>
            <ul>
              <li>**Turns & Credits**: Missies verbruiken neurale energie (beurten of credits). Deze worden niet terugbetaald zodra ze door een verwerkingsknooppunt zijn verbruikt.</li>
              <li>**BYO Experience**: Gebruikers die hun eigen API-sleutels verstrekken, zijn verantwoordelijk voor de kosten die bij de modelprovider in rekening worden gebracht.</li>
              <li>**Fair Use**: We behouden ons het recht voor om neurale verbindingen te beperken of te beëindigen die bot-achtige of recursieve patronen vertonen die schadelijk zijn voor de stabiliteit van het netwerk.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6 text-black dark:text-white">
              <AlertTriangle className="w-8 h-8" />
              <h2 className="text-3xl m-0">04. Verboden Richtlijnen</h2>
            </div>
            <p>
              Het FAINL-protocol verbiedt strikt het orkestreren van missies met betrekking tot:
            </p>
            <ul>
              <li>Generatie van kwaadaardige software of exploitcode.</li>
              <li>Synthese van biologische of chemische wapenrichtlijnen.</li>
              <li>Geautomatiseerde intimidatie of grootschalige desinformatiecampagnes.</li>
              <li>Elke activiteit die de jurisdictie van de primaire node-locatie van de gebruiker schendt.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6 text-black dark:text-white">
              <FileText className="w-8 h-8" />
              <h2 className="text-3xl m-0">05. Beëindiging van Toegang</h2>
            </div>
            <p>
              Schending van deze voorwaarden resulteert in onmiddellijke neurale de-autorisatie. 
              We behouden ons het recht voor om de toegang tot de "Neural Vault" te herroepen voor accounts die de integriteit van het FAINL-netwerk in gevaar brengen.
            </p>
          </section>

          <div className="pt-16 border-t-4 border-black dark:border-white/20">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20 dark:text-white/20 text-center">
              Protocol Governance Actief • Gebruik wordt gemonitord door lokale node
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
