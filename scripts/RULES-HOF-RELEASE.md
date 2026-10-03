# Rules and Hall of Fame follow-up

Draft branch: codex/rules-and-hof-tributes, stacked on PR45. Review and explicit
release approval required. This change does not retire any Discord channel.

## Behavior

Rules now use all 139 clauses from the seven public rule-channel posts retrieved
October 3. Every source clause is retained, including qualifiers, punishments and
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
season results. Exact tribe-name/cluster candidates within 45days before the 81
announcements found zero matches. No fuzzy identity matches or restored live DBs.
Private local review evidence: out/review/hof-score-candidates.json. Confirm season
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

After approval merge PR45 first, retarget this PR to main, review resulting diff,
merge and wait for successful production deployment. Verify staff draft/save/
summary/lead publish/conflict/history against a disposable nonpublic draft, real
public rule coverage, HOF public/opt-in/withdrawal state, and mobile layouts.
Do not change real rules as a test. Discord retirement remains a later explicit
cutover after reviewed website parity, preservation and working access.

Rollback by reverting approved code; preserve audit/history/newer player settings,
and compare intervening changes. Do not delete additive tables or overwrite DBs.
