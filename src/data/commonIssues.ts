export const commonIssues = [
  {
    id: "join",
    title: "I can’t find or join a MESA server",
    keywords: "connection timeout favorites version aquatica branch joining",
    steps: [
      "Use ARK: Survival Evolved on Steam. MESA uses ASE, not ARK: Survival Ascended.",
      "In Steam, open ARK → Properties → Betas → Beta Participation and select preaquatica – ASE: Pre-Aquatica. Let the download finish before launching.",
      "Choose your cluster and map on the Servers page. Check its status, then use its join button or copy the listed address into Steam’s server favorites.",
      "Let all game and Workshop downloads finish. If the server is restarting or wiping, wait until it is back online before trying again.",
    ],
    evidence:
      "If it still fails, send the exact error, cluster, map, time with timezone, and whether other MESA maps work.",
    href: "/servers",
    link: "Check servers & join",
  },
  {
    id: "mods",
    title: "Mod mismatch or a stuck Workshop download",
    keywords: "mod version mismatch update download workshop subscribing",
    steps: [
      "Close ARK and check Steam’s Downloads page for pending game or Workshop updates.",
      "Open the MESA Steam Collection linked below and check that you are subscribed to its mods. Allow every download to finish.",
      "Restart Steam if Workshop updates are not starting, then launch ARK and let it finish installing mods before joining.",
      "If the same error remains, use the detailed Mod Mismatch guide below. Keep the error message so staff can identify the affected mod.",
    ],
    evidence:
      "Include the mod name or ID from the error, a screenshot, and the cluster and map. Don’t delete your entire ARK installation as a first fix.",
    href: "https://steamcommunity.com/sharedfiles/filedetails/?id=3282623549",
    link: "MESA Steam Collection",
  },
  {
    id: "crash",
    title: "ARK crashes, textures are missing, or a map won’t load",
    keywords:
      "crash fatal error missing map dlc crystal isles textures corrupt",
    steps: [
      "Close ARK. In Steam, open ARK → Properties → Installed Files → Verify integrity of game files.",
      "Let verification and any replacement downloads finish. Check that the required map DLC is installed in ARK’s DLC settings.",
      "If the problem started after changing an INI preset, restore the backup you made before editing and try again.",
      "Record whether the crash happens before the menu, while joining, or only in one location. That helps distinguish a local installation issue from a server issue.",
    ],
    evidence:
      "Attach the crash error or screenshot, map, time with timezone, and the steps that reproduce it. Keep saves and config backups before considering a reinstall.",
    href: "https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB",
    link: "Steam’s file verification guide",
  },
  {
    id: "performance",
    title: "Low FPS, stuttering, or an INI preset looks wrong",
    keywords: "fps lag stutter performance ini graphics settings invisible",
    steps: [
      "Check whether the problem is low frame rate on your PC or a delayed server response. Include that distinction in a ticket.",
      "Lower demanding graphics options in ARK and compare the same location before and after each change.",
      "Use the PvP INI presets below if you want a MESA-supported preset. Close ARK and back up BaseDeviceProfiles.ini before replacing it.",
      "If a preset causes missing visuals or a new crash, restore your original file and restart ARK. Change one thing at a time so you can tell what helped.",
    ],
    evidence:
      "Send your map, approximate FPS, what was happening, and whether nearby players saw the same delay. Put any base coordinates in a private ticket.",
    href: "#detailed-guides",
    link: "INI presets & detailed guides",
  },
  {
    id: "account",
    title: "I can’t open a ticket or link my Discord",
    keywords:
      "steam login sign in discord verification link account support ticket",
    steps: [
      "Sign in to the website with the Steam account you use to play on MESA.",
      "Open Your Account and follow the Discord linking instructions shown there. Use your own Discord account and keep the verification code private.",
      "Return to Support after linking. If a code expires, start a new linking attempt instead of reusing the old code.",
      "If login or linking is unavailable, use the support Discord linked in the footer and include the exact error. Never share your Steam password, login cookies, or recovery codes.",
    ],
    evidence:
      "A screenshot of the error and the step that failed are enough to start. Hide any verification code in the screenshot.",
    href: "/account",
    link: "Your Account",
  },
  {
    id: "purchase",
    title: "A rank, points purchase, or store item is missing",
    keywords:
      "store rank points payment purchase delivery subscription gift card refund",
    steps: [
      "Check the receipt or order status and confirm the Steam account, selected server, product, and purchase type.",
      "Confirm whether you bought a one-time rank or a recurring subscription. Keep the order reference so staff can identify the purchase.",
      "If delivery is missing or the selection was wrong, open a store support ticket and explain what you bought and what arrived.",
      "Keep receipts in the private ticket. Hide full card numbers, billing addresses, and unrelated transactions. Don’t purchase again just to retry delivery.",
    ],
    evidence:
      "Include the order reference, purchase time with timezone, selected server, and a redacted receipt. Staff will check the order before deciding the next step.",
    href: "/support",
    link: "Open player support",
  },
  {
    id: "gameplay",
    title: "A character, tribe, transfer, or item is missing",
    keywords:
      "character lost tribe transfer upload download rollback missing inventory dinosaur dino",
    steps: [
      "Confirm the cluster, map, and Steam account you last played on. Check whether a wipe or maintenance happened in Changelog and Settings.",
      "If a transfer failed, record the origin map, destination map, and the last successful step. Avoid repeating the transfer while the result is uncertain.",
      "Open a private support ticket with your player and tribe names, the time with timezone, and a clear before-and-after description.",
      "If staff need your location, use the CCC guide below and paste coordinates only in the private ticket. Include screenshots or a short clip if available.",
    ],
    evidence:
      "Report what is missing and when you last saw it. Staff need to investigate; a report does not automatically guarantee a replacement or rollback.",
    href: "/support",
    link: "Open player support",
  },
  {
    id: "report",
    title: "I need to report cheating or appeal a ban",
    keywords: "cheater cheating ban appeal staff report evidence exploit rules",
    steps: [
      "Read the relevant rule, then choose the appropriate support category: cheater report, ban appeal, or staff report.",
      "State the cluster, map, time with timezone, and player or tribe names. Explain what happened without relying on a name alone as proof.",
      "Keep original clips and screenshots. For a longer video, include the timestamps staff should review.",
      "Send evidence through private support. Keep live player locations, Steam identifiers, and staff-only information out of public posts.",
    ],
    evidence:
      "For an appeal, include the ban reason you saw and your explanation. For a report, include the behavior and evidence that supports it.",
    href: "/rules",
    link: "Read MESA rules",
  },
] as const;
