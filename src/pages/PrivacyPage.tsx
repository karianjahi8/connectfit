import { Layout } from '@/components/layout/Layout';

export default function PrivacyPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl prose prose-invert">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
          Privacy <span className="gradient-text">Policy</span>
        </h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: June 4, 2026</p>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">1. Who we are</h2>
            <p>FitConnect ("we", "us") is a global platform connecting fitness trainers, clubs, and merchants with people who want to train, shop, and book sessions. This policy explains what data we collect and how we use it.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">2. Data we collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-foreground">Account identity:</strong> email, Google/Apple ID, phone, or wallet address provided via Privy at sign-in.</li>
              <li><strong className="text-foreground">Profile:</strong> name, bio, country, city, fitness goals, and (for trainers) rate, specialties, and experience.</li>
              <li><strong className="text-foreground">Location:</strong> approximate coordinates derived from your city/country to power "trainers near me". You can leave location blank.</li>
              <li><strong className="text-foreground">Commerce data:</strong> cart items, orders, shipping address, and phone for fulfillment.</li>
              <li><strong className="text-foreground">On-chain activity:</strong> public wallet address and USDC transaction hashes recorded on Avalanche.</li>
              <li><strong className="text-foreground">Support chats:</strong> messages you send to FitBot, our in-app assistant.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">3. How we use your data</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Operate your account, bookings, payments, and orders.</li>
              <li>Show you trainers, clubs, and products relevant to your country.</li>
              <li>Process payments in USDC and display local-currency estimates.</li>
              <li>Improve safety, prevent fraud, and respond to support requests.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">4. How data is stored and protected</h2>
            <p>Your data lives in Lovable Cloud (managed Postgres) with row-level security so only you (and the trainer/vendor you transact with) can read your private records. Sensitive fields (email, phone, wallet, coordinates) are never exposed in public listings — public profile views are served through restricted views that omit them. Edge functions verify your Privy session token before writing on your behalf.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">5. Third parties</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-foreground">Privy</strong> – authentication and embedded wallets.</li>
              <li><strong className="text-foreground">Avalanche / USDC</strong> – on-chain payments (public ledger).</li>
              <li><strong className="text-foreground">Google Maps</strong> – maps and geocoding for trainer discovery.</li>
              <li><strong className="text-foreground">Lovable AI Gateway</strong> – powers the FitBot assistant.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">6. Your rights</h2>
            <p>You may view, edit, or delete your profile at any time from the Profile page. To request full account deletion or a copy of your data, contact us at <a href="mailto:privacy@fitconnect.app" className="text-primary">privacy@fitconnect.app</a>. Note that on-chain transactions cannot be erased from public blockchains.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">7. Children</h2>
            <p>FitConnect is not intended for users under 16. If you believe a minor has signed up, contact us and we will remove the account.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">8. Changes</h2>
            <p>We will update this page when our practices change and revise the "Last updated" date above.</p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
