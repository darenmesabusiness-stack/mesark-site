export interface HofTier {
  name: string;
  wins: number;
  reward: string;
  /** Tailwind text color for the tier name */
  color: string;
  /** Hex used for glows / ladder bars */
  hex: string;
}

export const hofTiers: HofTier[] = [
  { name: "Silver", wins: 1, reward: "$25 store credit", color: "text-zinc-300", hex: "#c9ccd1" },
  { name: "Gold", wins: 3, reward: "$50 store credit", color: "text-yellow-500", hex: "#eab308" },
  { name: "Platinum", wins: 6, reward: "$75 store credit", color: "text-cyan-400", hex: "#22d3ee" },
  { name: "Emerald", wins: 9, reward: "$100 store credit", color: "text-emerald-400", hex: "#34d399" },
  { name: "Diamond", wins: 12, reward: "$50 PayPal + $150 store credit", color: "text-blue-400", hex: "#60a5fa" },
  { name: "Champion", wins: 15, reward: "$100 PayPal + $250 store credit", color: "text-red-400", hex: "#f87171" },
  { name: "Prestige", wins: 18, reward: "$200 PayPal + $500 store credit", color: "text-purple-400", hex: "#c084fc" },
];
