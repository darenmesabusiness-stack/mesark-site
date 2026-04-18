export interface Server {
  map: string;
  ip: string;
}

export interface ClusterLink {
  label: string;
  url: string;
}

export interface Cluster {
  name: string;
  servers: Server[];
  links?: ClusterLink[];
}

export const clusters: Cluster[] = [
  {
    name: "3/6 Man",
    servers: [
      { map: "Aberration", ip: "185.172.175.43:27015" },
      { map: "The Center", ip: "185.172.175.43:27016" },
      { map: "Lost Island", ip: "185.172.175.11:27017" },
      { map: "Extinction", ip: "185.172.175.11:27018" },
      { map: "Gen 2", ip: "185.172.175.43:27019" },
      { map: "Fjordur", ip: "185.172.175.43:27020" },
      { map: "Crystal Isles", ip: "185.172.175.43:27021" },
      { map: "Genesis", ip: "185.172.175.43:27024" },
      { map: "The Island", ip: "185.172.175.11:27016" },
      { map: "Ragnarok", ip: "185.172.175.11:27021" },
      { map: "Scorched Earth", ip: "185.172.175.11:27019" },
      { map: "Valguero", ip: "185.172.175.11:27020" },
      { map: "Trade Map", ip: "185.172.175.11:27022" },
      { map: "MESA City", ip: "185.172.175.11:27023" },
      { map: "The Center #2", ip: "185.172.175.101:27015" },
      { map: "Fjordur #2", ip: "185.172.175.101:27016" },
      { map: "Gen 2 #2", ip: "185.172.175.101:27017" },
      { map: "No Build AB", ip: "185.172.175.101:27018" },
      { map: "Crystal Isles #2", ip: "185.172.175.101:27019" },
      { map: "Boss Map", ip: "185.172.175.101:27020" },
      { map: "Rare Dinos Map", ip: "185.172.175.101:27021" },
      { map: "Ragnarok #2", ip: "185.172.175.101:27023" },
    ],
  },
  {
    name: "100x",
    servers: [
      { map: "Aberration", ip: "185.172.175.148:7777" },
      { map: "Crystal Isles", ip: "185.172.175.148:7779" },
      { map: "Extinction", ip: "185.172.175.148:7781" },
      { map: "Fjordur", ip: "185.172.175.148:7783" },
      { map: "Genesis 1", ip: "185.172.175.148:7785" },
      { map: "Genesis 2", ip: "185.172.175.148:7787" },
      { map: "Lost Island", ip: "185.172.175.253:7777" },
      { map: "Ragnarok", ip: "185.172.175.253:7779" },
      { map: "Scorched Earth", ip: "185.172.175.253:7781" },
      { map: "The Center", ip: "185.172.175.253:7783" },
      { map: "The Island", ip: "185.172.175.253:7785" },
      { map: "Valguero", ip: "185.172.175.253:7787" },
      { map: "MESA City", ip: "185.172.175.253:7789" },
      { map: "Trading Outpost", ip: "185.172.175.253:7791" },
    ],
  },
  {
    name: "Duo",
    servers: [
      { map: "Aberration", ip: "185.172.175.43:27015" },
      { map: "The Center", ip: "185.172.175.43:27016" },
      { map: "Lost Island", ip: "185.172.175.11:27017" },
      { map: "Extinction", ip: "185.172.175.11:27018" },
      { map: "Gen 2", ip: "185.172.175.43:27019" },
      { map: "Fjordur", ip: "185.172.175.43:27020" },
      { map: "Crystal Isles", ip: "185.172.175.43:27021" },
      { map: "Genesis", ip: "185.172.175.43:27024" },
      { map: "The Island", ip: "185.172.175.11:27016" },
      { map: "Ragnarok", ip: "185.172.175.11:27021" },
      { map: "Scorched Earth", ip: "185.172.175.11:27019" },
      { map: "Valguero", ip: "185.172.175.11:27020" },
      { map: "Trade Map", ip: "185.172.175.11:27022" },
      { map: "MESA City", ip: "185.172.175.11:27023" },
      { map: "The Center #2", ip: "185.172.175.101:27015" },
      { map: "Fjordur #2", ip: "185.172.175.101:27016" },
      { map: "Gen 2 #2", ip: "185.172.175.101:27017" },
      { map: "No Build AB", ip: "185.172.175.101:27018" },
      { map: "Crystal Isles #2", ip: "185.172.175.101:27019" },
      { map: "Boss Map", ip: "185.172.175.101:27020" },
      { map: "Rare Dinos Map", ip: "185.172.175.101:27021" },
      { map: "Ragnarok #2", ip: "185.172.175.101:27023" },
    ],
  },
  {
    name: "Solo",
    servers: [
      { map: "Aberration", ip: "141.98.157.49:7777" },
      { map: "Crystal Isles", ip: "141.98.157.49:7779" },
      { map: "Crystal Isles 2", ip: "141.98.157.49:7781" },
      { map: "Extinction", ip: "141.98.157.49:7783" },
      { map: "Fjordur", ip: "141.98.157.49:7785" },
      { map: "Fjordur 2", ip: "141.98.157.72:7777" },
      { map: "Genesis 1", ip: "141.98.157.72:7779" },
      { map: "Genesis 2", ip: "141.98.157.72:7781" },
      { map: "Genesis 2 (2)", ip: "141.98.157.72:7783" },
      { map: "Lost Island", ip: "141.98.157.72:7785" },
      { map: "Ragnarok", ip: "141.98.157.253:7777" },
      { map: "Ragnarok 2", ip: "141.98.157.253:7779" },
      { map: "Scorched Earth", ip: "141.98.157.253:7781" },
      { map: "The Center", ip: "141.98.157.253:7783" },
      { map: "The Center 2", ip: "141.98.157.253:7785" },
      { map: "The Island", ip: "141.98.157.253:7787" },
      { map: "Valguero", ip: "141.98.157.253:7789" },
      { map: "No Build Ab", ip: "141.98.157.253:7791" },
      { map: "No Build Scorched", ip: "141.98.157.253:7793" },
      { map: "Rare Dinos Map", ip: "141.98.157.253:7795" },
      { map: "Trade Map", ip: "141.98.157.253:7797" },
      { map: "MESA City", ip: "141.98.157.253:7799" },
    ],
  },
  {
    name: "Golem Event",
    servers: [
      { map: "MESA Arena", ip: "185.172.175.43:27022" },
    ],
    links: [
      { label: "Arena Discord", url: "https://discord.gg/njRSCXjhSk" },
      { label: "Mod Pack", url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3310464269" },
    ],
  },
];
