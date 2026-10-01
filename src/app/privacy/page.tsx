import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ContentSection, RuleItem } from "@/components/ContentSection";

export const metadata: Metadata = {
  title: "Privacy Policy — MESA ARK",
  description: "What MESA ARK collects on its website, Discord and game servers, why, who it is shared with, and how to ask for it to be deleted.",
};

const UPDATED = "1 October 2026";
const SUPPORT = "https://discord.gg/jkax9Nk46x";

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        title="Privacy Policy"
        subtitle="What we collect, why we collect it, and how to get it removed. Plain words, no tricks."
        image="/art/ark/ashfield.jpg"
        focus="object-[70%_40%]"
        kicker={`Last updated ${UPDATED}`}
      />

      <div className="max-w-4xl mx-auto px-4 pb-20 space-y-4">
        <ContentSection title="Who we are" defaultOpen>
          <p>
            MESA ARK (&ldquo;MESA&rdquo;, &ldquo;we&rdquo;) runs ARK: Survival Evolved PvP servers, this website
            (mesark.net), the leaderboards (leaderboards.mesark.net), the store (store.mesark.net) and the MESA
            Discord servers. This policy covers all of them. MESA is not affiliated with Studio Wildcard.
          </p>
        </ContentSection>

        <ContentSection title="This website" defaultOpen>
          <RuleItem text="Signing in is optional. If you sign in through Steam, you log in on Steam's own site and Steam confirms your Steam ID to us. We store that ID with your public Steam name and avatar, when you joined and when you last signed in. Your password only ever goes to Steam." />
          <RuleItem text="Signing in sets one cookie that keeps you signed in for up to 30 days. We use no advertising or tracking cookies." />
          <RuleItem text="Your Steam ID is never shown publicly. You can sign out or delete your account on the Account page at any time." />
          <RuleItem text="Player and tribe profile pages show the same public stats as the leaderboards. They are not listed in search engines." />
          <RuleItem text="We use Vercel Web Analytics to count page views. It does not use cookies; it records the page, referrer, country, browser and device type, and counts visitors without identifying them." />
          <RuleItem text="Our host (Vercel) keeps standard server logs, such as IP address and request time, to run and protect the site." />
          <RuleItem text="Pages embed YouTube videos. YouTube may set its own cookies when you play one; that is covered by Google's privacy policy." />
        </ContentSection>

        <ContentSection title="Our game servers" defaultOpen>
          <p>When you play on a MESA server, the server and our admin tools record:</p>
          <RuleItem text="Your Steam ID, Steam name, character name and tribe." />
          <RuleItem text="Which server you joined and when, and in-game events such as kills, purchases with in-game points, and admin actions." />
          <RuleItem text="Your IP address and a hardware ID, used only to enforce bans and stop ban evasion, cheating and alt abuse." />
          <p>
            We use this to run the servers, enforce the rules, investigate reports and build the public leaderboards.
            The leaderboards show character names, tribe names and in-game stats, never Steam IDs or IP addresses.
          </p>
        </ContentSection>

        <ContentSection title="Discord and our support bot" defaultOpen>
          <RuleItem text="Our Discord bot answers questions and handles support tickets. It stores ticket transcripts and the questions you ask it." />
          <RuleItem text="It reads messages in our public community channels to spot common questions, measure how the community feels about updates and write weekly reports for staff. Messages are stored with your Discord user ID." />
          <RuleItem text="Message text is sent to Anthropic (the Claude AI model) to write answers and classify topics and sentiment. Anthropic processes it for us and does not use it to train its models." warning />
          <RuleItem text="If you link your Discord to your Steam ID, we keep that link so staff can help you faster." />
          <RuleItem text="The bot may send you a direct message, for example about a ticket or to welcome you back after time away." />
        </ContentSection>

        <ContentSection title="Purchases" defaultOpen>
          <p>
            Store payments are processed by Tip4Serv and its payment providers. We never see or store your card
            details. Tip4Serv shares the order with us (what you bought, the amount, the date and the Steam or
            in-game identifier needed to deliver it), and we keep those records for delivery, support, refunds,
            chargeback disputes and our accounts. The rules on purchases are in the Terms, linked in the footer
            of <a href="https://store.mesark.net/" className="text-accent hover:underline">store.mesark.net</a>.
          </p>
        </ContentSection>

        <ContentSection title="Who we share it with" defaultOpen>
          <p>We do not sell your data. We only share it with services that run MESA for us:</p>
          <RuleItem text="Vercel (website hosting and analytics) and Neon (the database behind website accounts)." />
          <RuleItem text="Our game server and bot hosting providers." />
          <RuleItem text="Discord (the platform our community and bot run on)." />
          <RuleItem text="Anthropic (AI processing for the support bot)." />
          <RuleItem text="Tip4Serv and its payment providers (store purchases)." />
          <p>We may also share information when the law requires it, or to deal with fraud or chargebacks.</p>
        </ContentSection>

        <ContentSection title="How long we keep it" defaultOpen>
          <RuleItem text="Ban and enforcement records are kept for as long as the ban applies." />
          <RuleItem text="Purchase records are kept as long as we need them for support, disputes and our accounts." />
          <RuleItem text="Website accounts are kept until you delete them; sign-ins expire after 30 days." />
          <RuleItem text="Bot and server databases are backed up daily; backups are kept for 30 days." />
          <RuleItem text="Everything else is kept only as long as it is useful for running MESA, and deleted on request where we can." />
        </ContentSection>

        <ContentSection title="Your choices" defaultOpen>
          <p>
            You can ask us what we hold about you, or ask us to correct or delete it, by opening a ticket in the{" "}
            <a href={SUPPORT} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              MESA Support Discord
            </a>
            . We may keep records we need for active bans, fraud prevention or the law. MESA is not meant for
            children under 13.
          </p>
          <p>
            If this policy changes, we will update the date at the top of this page and post the change in our
            Discord.
          </p>
        </ContentSection>
      </div>
    </>
  );
}
