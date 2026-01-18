import { CyberCard } from "@/components/CyberCard";
import { Navbar } from "@/components/Navbar";
import { AlertTriangle, FileText } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 py-8">
        <CyberCard className="max-w-4xl mx-auto p-8">
          <div className="flex items-center gap-4 mb-8 border-b border-primary/20 pb-4">
            <FileText className="w-10 h-10 text-primary" />
            <h1 className="text-3xl font-bold text-primary uppercase tracking-tighter italic">Terms of Service</h1>
          </div>
          
          <div className="space-y-6 text-muted-foreground font-mono text-sm leading-relaxed">
            <section>
              <h2 className="text-primary font-bold uppercase mb-2">1. Acceptance of Terms</h2>
              <p>By accessing TWH OSINT, you agree to comply with all local and international laws regarding digital intelligence and data access.</p>
            </section>
            
            <section>
              <h2 className="text-primary font-bold uppercase mb-2">2. Credit System</h2>
              <p>Credits are non-refundable. Service availability depends on upstream API providers. We aim for 99.9% uptime.</p>
            </section>

            <section>
              <h2 className="text-primary font-bold uppercase mb-2">3. Prohibited Use</h2>
              <p>Automated scraping, bulk querying, or attempting to breach our security infrastructure will result in immediate permanent account termination without refund.</p>
            </section>
          </div>
        </CyberCard>
      </main>
    </div>
  );
}
