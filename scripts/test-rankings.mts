import assert from "node:assert/strict";
import { getRankings, rankingHref, rankingQuery } from "../src/lib/rankings";
import { steamAvatar } from "../src/lib/steamAvatar";

const originalFetch = globalThis.fetch;
let requested = "";
let response: unknown = {
  ranking_data: [
    {
      PlayerName: "A survivor",
      rank: 21,
      PlayerKills: 17,
      DeathByPlayer: 2,
      DinoKills: 4,
      PlayTime: 120,
      SteamID: "76561190000000000",
      privateEvidence: "must not render",
    },
    { PlayerName: "76561190000000000", rank: 22 },
    { PlayerName: "N1gg3r", rank: 23 },
  ],
  pagination: { total_pages: 4 },
};
globalThis.fetch = async (url) => {
  requested = String(url);
  return Response.json(response);
};
try {
  const query = rankingQuery({
    cluster: "SOLO",
    sort: "Kills",
    page: "1",
    q: " A survivor ",
  });
  const players = await getRankings(query);
  assert.equal(
    players?.rows.length,
    2,
    "in-game names are preserved; Steam identifiers never become public names",
  );
  assert.equal(
    players?.rows[0].rank,
    21,
    "upstream rank survives pagination/search",
  );
  assert.equal(players?.rows[0].playTime, 120);
  assert.equal(players?.rows[0].avatar, null);
  assert.equal(steamAvatar(`https://avatars.steamstatic.com/${"a".repeat(40)}_full.jpg`) !== null, true);
  assert.equal(steamAvatar("https://evil.example/avatar.jpg"), null);
  assert.equal(steamAvatar("https://steamcommunity.com/profiles/76561190000000000"), null);
  assert.equal(players?.pages, 4);
  assert.equal(JSON.stringify(players).includes("76561190000000000"), false);
  assert.equal(JSON.stringify(players).includes("privateEvidence"), false);
  const url = new URL(requested);
  assert.equal(url.pathname, "/api/ark/player_rankings");
  assert.equal(url.searchParams.get("search"), "A survivor");
  assert.equal(url.searchParams.get("page"), "1");
  assert.equal(
    new URL(rankingHref(query), "https://mesark.net").origin,
    "https://mesark.net",
  );

  response = {
    ranking_data: [
      {
        TribeName: "A tribe",
        TribeID: 42,
        rank: 1,
        DamageScore: 135,
        TotalKills: "8",
        TotalDeaths: "4",
        TotalTameKills: "2",
        TotalPlayTime: "300",
      },
    ],
    pagination: { total_pages: 1 },
  };
  const tribes = await getRankings(
    rankingQuery({ view: "tribes", cluster: "DUO", sort: "Tribe Score" }),
  );
  assert.equal(new URL(requested).pathname, "/api/ark/tribe_rankings");
  assert.equal(tribes?.rows[0].tribeId, 42);
  assert.equal(tribes?.rows[0].kills, 8);
  assert.equal(tribes?.rows[0].score, 135);
  await getRankings(rankingQuery({}));
  assert.equal(new URL(requested).pathname, "/api/ark/player_rankings/all");
  assert.equal(
    rankingQuery({ cluster: "bad", sort: "bad", page: "-1" }).cluster,
    "ALL",
  );
  assert.equal(
    rankingQuery({ view: "tribes", cluster: "ALL" }).cluster,
    "SOLO",
  );
  assert.equal(rankingQuery({ page: "Infinity" }).page, 0);
  assert.equal(rankingQuery({ page: "9999" }).page, 1000);
  response = {
    ranking_data: [
      { PlayerName: "N1gg3r", rank: 1, PlayerKills: 134, avatar: `https://avatars.steamstatic.com/${"a".repeat(40)}_full.jpg` },
      { PlayerName: "Second survivor", rank: 2, PlayerKills: 121 },
      { PlayerName: "Third survivor", rank: 3, PlayerKills: 116 },
    ], pagination: { total_pages: 1 },
  };
  const initial = await getRankings(rankingQuery({}));
  const explicit = await getRankings(rankingQuery({view:"players",cluster:"ALL",sort:"Kills"}));
  assert.deepEqual(initial, explicit, "initial and explicit settings must preserve the same podium");
  assert.deepEqual(initial?.rows.map(row=>row.rank), [1,2,3]);
  assert.equal(initial?.rows[0].name, "N1gg3r", "the original in-game name must remain unchanged");
  assert.equal(initial?.rows[0].nameHidden, false);
  assert.ok(initial?.rows[0].avatar, "ordinary in-game names retain their Steam avatars");
  response = {ranking_data:[{TribeName:"76561190000000000",TribeID:42,rank:1,DamageScore:200}],pagination:{total_pages:1}};
  const hiddenTribe = await getRankings(rankingQuery({view:"tribes"}));
  assert.equal(hiddenTribe?.rows[0].rank,1);
  assert.equal(hiddenTribe?.rows[0].tribeId,null,"a hidden identity must not get a tribe link");
  assert.equal(JSON.stringify(hiddenTribe).includes("76561190000000000"),false);
  assert.equal(
    rankingQuery({ sort: ["Kills", "Deaths"], q: ["a", "b"] }).search,
    "",
  );
  response = { ranking_data: {}, pagination: {} };
  assert.equal(
    await getRankings(query),
    null,
    "malformed upstream degrades cleanly",
  );
  globalThis.fetch = async () => {
    throw new Error("API offline");
  };
  assert.equal(
    await getRankings(query),
    null,
    "unavailable upstream degrades cleanly",
  );
  console.log(
    "Rankings: pagination, filter routing, public DTOs, name filtering and unavailable API checks passed.",
  );
} finally {
  globalThis.fetch = originalFetch;
}
