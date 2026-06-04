import { Layout } from '@/components/layout/Layout';

export default function TermsPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
          Terms of <span className="gradient-text">Service</span>
        </h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: June 4, 2026</p>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">1. Agreement</h2>
            <p>By using FitConnect you agree to these Terms. If you do not agree, please do not use the platform.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">2. Your account</h2>
            <p>You are responsible for safeguarding your sign-in method and embedded wallet. Keep your recovery factors safe — losing them may mean losing access to funds.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">3. Bookings and payments</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Payments are settled in USDC on Avalanche. Local-currency amounts are estimates.</li>
              <li>Trainer sessions use an escrow with an 85/15 split on completion; the platform retains a 15% commission.</li>
              <li>Cancellations and refunds follow the policy shown at checkout for each booking or order.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">4. Trainers and vendors</h2>
            <p>Service providers are independent professionals, not employees of FitConnect. You must provide accurate information, hold any required licenses, and deliver the services or goods you list.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">5. Acceptable use</h2>
            <p>Do not use FitConnect to harass others, list illegal goods or services, attempt to bypass security, or interact with the platform in a way that disrupts other users.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">6. Disclaimer</h2>
            <p>Fitness activities carry inherent risk. FitConnect does not provide medical advice. Consult a qualified professional before starting any program. The platform is provided "as is" without warranties of any kind.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">7. Limitation of liability</h2>
            <p>To the maximum extent permitted by law, FitConnect is not liable for indirect or consequential damages arising from your use of the platform, third-party services, or on-chain transactions.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">8. Contact</h2>
            <p>Questions? Reach us at <a href="mailto:support@fitconnect.app" className="text-primary">support@fitconnect.app</a>.</p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
