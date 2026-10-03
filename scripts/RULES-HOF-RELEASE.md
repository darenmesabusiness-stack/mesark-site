# Rules and Hall of Fame follow-up

Draft branch: codex/rules-and-hof-tributes, stacked on PR45. Review and explicit
release approval required. This change does not retire any Discord channel.

## Behavior

Rules now retain all 139 clauses from seven public rule-channel posts retrieved
October 3, plus five later HOF eligibility/transfer updates from the HOF channel. Every source clause is retained, including qualifiers, punishments and
later exceptions. HOF application instructions point to website support. Existing
website-only unban price examples and promised turnaround are excluded because
these public source posts do not establish them. Review that discrepancy before
release; no payment/ban behavior changes.

Staff can add a rule or edit the full document, prepare an immutable draft and
review a generated extractive overview, complete additions/removals and full text.
This is deterministic formatting/extraction, not an AI policy rewrite. A lead or
owner publishes with a fresh role check and expected-live-version comparison.
History allows reviewed restoration. Database read errors do not silently return
superseded rules. Additive tables: rules_revisions, rules_live, rules_publish_audit.

HOF cards have stable tribe accents/initials, recognition dates, their own original
film titles, related roster wins, dedicated tribe tributes and MESA member pages.
The member page resolves only a verified Discord connection with an opt-in public
MESA account and shared links; otherwise it displays the public honors archive.
Public profiles can opt into Steam/Discord links and HOF legacy. Defaults remain
private. Steam IDs are absent from MESA markup/URLs; the explicitly shared external
Steam link redirects to Steam's own profile URL. Public profiles and member pages
retain noindex behavior. Unpublishing stops discovery and external link access.

Leads can record each tribe's own headline/story and optional final score, raids,
kills and defenses. Numeric zero is distinct from unavailable. Result evidence is
required, saved separately in the private HOF audit and omitted from public data.
New player_profiles.share_links and hof_audit.evidence columns are additive.

## Sources and remaining curation

HOF seed retains all 398 source honorees and 81 announcement rosters. Public film
titles are imported from the official announcement embeds, filtered for unsafe
names/Steam IDs. No claims from private videos, live player locations, or invented
accomplishments were added. Personal stories/results require actual evidence.

Read-only leaderboard filesystem inventory found no SQL history dumps. Existing
bot/off-host backup manifests begin October3; preserved intel leaderboard_events
has 19,308 score observations across roughly six months, not guaranteed final
season results. The initial typed-field search found no matches because the old collector
never populated score/tribe-ID fields. Follow-up parsing of preserved public
leaderboard tables recovered18,835snapshots/188,350rows, with exact-name/cluster
review candidates for62announcements in the45days before recognition. This is
not a final-season identity match. Leads see safe date/score/rank candidates in
the editor; no raw messages, names or internal event IDs are shipped there. No fuzzy identity matches or restored live DBs.
Private local review evidence: out/review/hof-recovered-candidates.json and
hof-history-review.md. Parser _scripts/recover_hof_score_history.py is read-only;
five offline shape/truncation/privacy/zero/grouping tests pass. Confirm season
boundaries and tribe identity before importing any old scores. Capture future
verified final results and their source/time through the editor; the immutable
audit retains each submission. No duplicate collector or backup job was added.

## Validation and approved release

Run scripts/test-rules-tributes.mts, test-account-profile.mts, test-support.mts,
audit-rules.mts and audit-hof.mts (audits need the ignored local source exports).
Run scoped ESLint and npm run build. Local browser: MESA member archive, tribute
navigation, actual source cards; 390px rules/tribute/editor widths stay380px.
Editor browser fixture was clearly synthetic, never submitted, then removed.
Screenshots are in ignored out/review/. No authentication bypass or production
record edit was used for these previews.

PR45 was explicitly approved and merged as8b057806 onOctober3 at17:42UTC.
Production deployment FZx1S9qAAjUbcjYCaimpBBaZ9re2 succeeded. This draft is now
retargeted to main and incorporates that release without changing its tested tree.
After separate approval for this rules/tribute draft, review the resulting diff,
merge and wait for successful production deployment. Verify staff draft/save/
summary/lead publish/conflict/history against a disposable nonpublic draft, real
public rule coverage, HOF public/opt-in/withdrawal state, and mobile layouts.
Do not change real rules as a test. Discord retirement remains a later explicit
cutover after reviewed website parity, preservation and working access.

Rollback by reverting approved code; preserve audit/history/newer player settings,
and compare intervening changes. Do not delete additive tables or overwrite DBs.

Land-base policy needs lead/user clarification before release: rules channel
says individually approved land locations; July17HOF announcement permits land
bases except named exclusions. Existing cave/request wording stays until resolved.
Other later updates are source-backed and carry their actual effective qualifiers.
