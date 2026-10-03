# Steam-linked profiles release

This follow-up is a review draft. User review and explicit approval are required
before production deployment. No game-server changes or bot restart are needed.

1. Release the companion leaderboard API first. It adds the production-site-only
   POST `/api/ark/account-profile` endpoint and `jose` dependency. Preserve the
   existing VPS environment and owners' database credentials. Install locked
   dependencies, test on production Node, then restart only the leaderboard API.
2. Release this website. `src/lib/db.ts` contains the idempotent schema migration:
   `player_profiles`, referencing `users` with deletion cascade, a unique owner,
   random public UUID, bounded bio, fixed accent palette and opt-in publication.
   The existing database initializer applies it on first database use. No existing
   stats, account, ticket or paid-rank data is modified by that migration.
3. Verify with an authenticated owner: Discord heading matches the link, stats
   match the Steam account across available clusters, bio/color changes save,
   publishing exposes only the chosen public fields, and unpublishing returns404.
   Verify anonymous API calls fail, public markup contains no Steam/Discord IDs,
   and existing player/tribe profiles and Info navigation continue working.

The API checks the same pinned Vercel issuer, audience, project and production
environment as the existing bot bridge. Local/preview tokens cannot query it.
Local review screenshots use clearly labelled example data; fixture routes were
removed before the production build and commits. Account stats stream separately
so an unavailable game database does not delay account/link/customization controls.

Rollback: revert the site changes before removing the companion API route. Keep
the additive profile table/data for recovery; do not drop it or any game data as a
routine rollback. Compare intervening changes and use protected code backups.
