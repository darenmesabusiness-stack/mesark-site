# Account ownership

The site's initial owner setup is complete. `/api/staff/claim` permanently returns
410, including if the database is empty or has no owners. New accounts always
start as players. Do not restore automatic ownership based on account age or the
absence of owners.

An existing owner can appoint another owner on `/staff/team`, then step down or
delete their own account. Deletion and role changes serialize on PostgreSQL
transaction advisory lock `(1296388929, 1)`. The authorization/count check and
mutation run in a separate statement after the lock under READ COMMITTED, so a
waiting request sees the preceding commit. All application code that removes
accounts or changes roles must use this transaction path.

If every owner is lost through an out-of-band database operation, recovery needs
an authorized operator with database access: verify the intended person's Steam
account independently, take a recoverable database backup, and assign that exact
existing account the owner role in a transaction using the same advisory lock.
Check the owner count and the person's staff access afterward. A fresh test/site
database requires the same explicit owner provisioning. Never reopen public setup
or select an owner solely because their account is oldest.

Validation:

- `npx tsx scripts/test-auth.mts` checks authentication, staff permissions, closed
  setup, session retention after blocked deletion, and successful deletion.
- `scripts/test-owner-concurrency.mts` requires a disposable local PostgreSQL
  database named `mesa_owner_test` via `OWNER_TEST_DATABASE_URL`. It creates and
  drops only its own uniquely named schema. CI runs seven forced multi-connection
  races and a rollback check. PGlite alone cannot prove cross-connection locking.

This release needs no schema migration. Rolling back to an older application
version reintroduces the public setup claim and nontransactional ownership checks;
prefer a forward fix if a deployment problem occurs.
