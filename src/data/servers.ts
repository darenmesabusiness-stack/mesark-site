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
      { map: "Aberration", ip: "141.98.157.231:27015" },
      { map: "Crystal Isles 1", ip: "141.98.157.231:27016" },
      { map: "Extinction 1", ip: "141.98.157.231:27017" },
      { map: "Fjordur 1", ip: "141.98.157.231:27018" },
      { map: "Ragnarok 1", ip: "141.98.157.231:27019" },
      { map: "The Center 1", ip: "141.98.157.231:27020" },
      { map: "No Build Aberration", ip: "141.98.157.231:27021" },
      { map: "Genesis", ip: "141.98.157.233:27015" },
      { map: "Genesis 2", ip: "141.98.157.233:27016" },
      { map: "Lost Island 1", ip: "141.98.157.233:27017" },
      { map: "Scorched Earth", ip: "141.98.157.233:27018" },
      { map: "The Island 1", ip: "141.98.157.233:27019" },
      { map: "Valguero 1", ip: "141.98.157.233:27020" },
      { map: "Trading Outpost", ip: "141.98.157.233:27021" },
      { map: "MESA City 1", ip: "141.98.157.27:27015" },
      { map: "Fjordur 2", ip: "141.98.157.27:27016" },
      { map: "Crystal Isles 2", ip: "141.98.157.27:27017" },
      { map: "The Island 2", ip: "141.98.157.27:27018" },
      { map: "The Center 2", ip: "141.98.157.27:27019" },
      { map: "The Center 3", ip: "141.98.157.27:27020" },
      { map: "Valguero 2", ip: "141.98.157.27:27021" },
      { map: "MESA Boss Map", ip: "141.98.157.188:27020" },
    ],
  },
  {
    name: "100x",
    servers: [
      { map: "Aberration", ip: "185.172.175.148:27015" },
      { map: "The Center", ip: "185.172.175.148:27016" },
      { map: "Crystal Isles", ip: "185.172.175.148:27017" },
      { map: "Extinction", ip: "185.172.175.148:27018" },
      { map: "Fjordur", ip: "185.172.175.148:27019" },
      { map: "Gen 2", ip: "185.172.175.148:27020" },
      { map: "Ragnarok", ip: "185.172.175.148:27022" },
      { map: "Genesis", ip: "185.172.175.253:27015" },
      { map: "Lost Island", ip: "185.172.175.253:27017" },
      { map: "Scorched Earth", ip: "185.172.175.253:27018" },
      { map: "The Island", ip: "185.172.175.253:27019" },
      { map: "Valguero", ip: "185.172.175.253:27020" },
      { map: "Trading Outpost", ip: "185.172.175.253:27021" },
      { map: "MESA City", ip: "185.172.175.253:27022" },
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
      { map: "Aberration", ip: "141.98.157.49:27015" },
      { map: "Gen 2", ip: "141.98.157.49:27016" },
      { map: "Crystal Isles", ip: "141.98.157.49:27017" },
      { map: "Fjordur", ip: "141.98.157.49:27018" },
      { map: "Gen 1", ip: "141.98.157.49:27019" },
      { map: "The Island", ip: "141.98.157.49:27020" },
      { map: "MESA City", ip: "141.98.157.49:27022" },
      { map: "Lost Island", ip: "141.98.157.72:27015" },
      { map: "Ragnarok", ip: "141.98.157.72:27016" },
      { map: "Extinction", ip: "141.98.157.72:27017" },
      { map: "Valguero", ip: "141.98.157.72:27018" },
      { map: "Trading Outpost", ip: "141.98.157.72:27019" },
      { map: "Scorched Earth", ip: "141.98.157.72:27020" },
      { map: "The Center", ip: "141.98.157.72:27021" },
      { map: "Crystal Isles #2", ip: "141.98.157.253:27015" },
      { map: "Fjordur #2", ip: "141.98.157.253:27016" },
      { map: "Gen 2 #2", ip: "141.98.157.253:27017" },
      { map: "No Build Ab", ip: "141.98.157.253:27018" },
      { map: "Ragnarok #2", ip: "141.98.157.253:27019" },
      { map: "Boss Map", ip: "141.98.157.253:27020" },
      { map: "Rare Dinos Map", ip: "141.98.157.253:27021" },
      { map: "The Center #2", ip: "141.98.157.253:27022" },
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
