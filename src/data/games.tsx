const gamesData = [
  {
    league: {
      name: "Ligue 1",
      icon: "/assets/icons/Football/League/Rectangle 6-1.png",
    },
    games: [
      {
        status: "live",
        time: "34'",
        home: { name: "Barcelona", icon: "/assets/icons/Football/Team/Manchester City.png", score: 8 },
        away: { name: "Real Madrid CF", icon: "/assets/icons/Football/Team/Arsenal.png", score: 3 },
      },
      {
        status: "live",
        time: "41'",
        home: { name: "Marseille", icon: "/assets/icons/Football/Team/Manchester City.png", score: 1 },
        away: { name: "Monaco", icon: "/assets/icons/Football/Team/Arsenal.png", score: 2 },
      },
      {
        status: "upcoming",
        time: "08:30 PM",
        home: { name: "Nice", icon: "/assets/icons/Football/Team/Manchester City.png" },
        away: { name: "Rennes", icon: "/assets/icons/Football/Team/Arsenal.png" },
      },
      {
        status: "upcoming",
        time: "09:45 PM",
        home: { name: "Lille", icon: "/assets/icons/Football/Team/Manchester City.png" },
        away: { name: "Nantes", icon: "/assets/icons/Football/Team/Arsenal.png" },
      },
    ],
  },
  {
    league: {
      name: "Eredivisie",
      icon: "/assets/icons/Football/League/Rectangle 6-2.png",
    },
    games: [
      {
        status: "live",
        time: "22'",
        home: { name: "Ajax", icon: "/assets/icons/Football/Team/Manchester City.png", score: 1 },
        away: { name: "PSV", icon: "/assets/icons/Football/Team/Arsenal.png", score: 0 },
      },
      {
        status: "live",
        time: "38'",
        home: { name: "Feyenoord", icon: "/assets/icons/Football/Team/Manchester City.png", score: 2 },
        away: { name: "AZ Alkmaar", icon: "/assets/icons/Football/Team/Arsenal.png", score: 2 },
      },
      {
        status: "upcoming",
        time: "07:30 PM",
        home: { name: "Utrecht", icon: "/assets/icons/Football/Team/Manchester City.png" },
        away: { name: "Groningen", icon: "/assets/icons/Football/Team/Arsenal.png" },
      },
      {
        status: "upcoming",
        time: "09:00 PM",
        home: { name: "Twente", icon: "/assets/icons/Football/Team/Manchester City.png" },
        away: { name: "Heerenveen", icon: "/assets/icons/Football/Team/Arsenal.png" },
      },
      {
        status: "upcoming",
        time: "10:15 PM",
        home: { name: "Sparta", icon: "/assets/icons/Football/Team/Manchester City.png" },
        away: { name: "Willem II", icon: "/assets/icons/Football/Team/Arsenal.png" },
      },
    ],
  },
  {
    league: {
      name: "Portuguese Liga",
      icon: "/assets/icons/Football/League/Rectangle 6-3.png",
    },
    games: [
      {
        status: "live",
        time: "40'",
        home: { name: "Porto", icon: "/assets/icons/Football/Team/Manchester City.png", score: 1 },
        away: { name: "Benfica", icon: "/assets/icons/Football/Team/Arsenal.png", score: 2 },
      },
      {
        status: "live",
        time: "51'",
        home: { name: "Sporting", icon: "/assets/icons/Football/Team/Manchester City.png", score: 0 },
        away: { name: "Braga", icon: "/assets/icons/Football/Team/Arsenal.png", score: 1 },
      },
      {
        status: "upcoming",
        time: "08:00 PM",
        home: { name: "Guimaraes", icon: "/assets/icons/Football/Team/Manchester City.png" },
        away: { name: "Boavista", icon: "/assets/icons/Football/Team/Arsenal.png" },
      },
      {
        status: "upcoming",
        time: "09:30 PM",
        home: { name: "Maritimo", icon: "/assets/icons/Football/Team/Manchester City.png" },
        away: { name: "Rio Ave", icon: "/assets/icons/Football/Team/Arsenal.png" },
      },
      {
        status: "upcoming",
        time: "10:45 PM",
        home: { name: "Arouca", icon: "/assets/icons/Football/Team/Manchester City.png" },
        away: { name: "Estoril", icon: "/assets/icons/Football/Team/Arsenal.png" },
      },
      {
        status: "upcoming",
        time: "11:30 PM",
        home: { name: "Vizela", icon: "/assets/icons/Football/Team/Manchester City.png" },
        away: { name: "Famalicao", icon: "/assets/icons/Football/Team/Arsenal.png" },
      },
    ],
  },
  {
    league: {
      name: "Turkish Super Lig",
      icon: "/assets/icons/Football/League/Rectangle 6.png",
    },
    games: [
      {
        status: "live",
        time: "15'",
        home: { name: "Galatasaray", icon: "/assets/icons/Football/Team/Manchester City.png", score: 0 },
        away: { name: "Fenerbahce", icon: "/assets/icons/Football/Team/Arsenal.png", score: 1 },
      },
      {
        status: "live",
        time: "29'",
        home: { name: "Besiktas", icon: "/assets/icons/Football/Team/Manchester City.png", score: 1 },
        away: { name: "Trabzonspor", icon: "/assets/icons/Football/Team/Arsenal.png", score: 1 },
      },
      {
        status: "upcoming",
        time: "06:30 PM",
        home: { name: "Basaksehir", icon: "/assets/icons/Football/Team/Manchester City.png" },
        away: { name: "Sivasspor", icon: "/assets/icons/Football/Team/Arsenal.png" },
      },
      {
        status: "upcoming",
        time: "08:00 PM",
        home: { name: "Antalyaspor", icon: "/assets/icons/Football/Team/Manchester City.png" },
        away: { name: "Alanyaspor", icon: "/assets/icons/Football/Team/Arsenal.png" },
      },
      {
        status: "upcoming",
        time: "09:30 PM",
        home: { name: "Konyaspor", icon: "/assets/icons/Football/Team/Manchester City.png" },
        away: { name: "Kayserispor", icon: "/assets/icons/Football/Team/Arsenal.png" },
      },
    ],
  },
  {
    league: {
      name: "Turkish Super Lig",
      icon: "/assets/icons/Football/League/Rectangle 6.png",
    },
    games: [
      {
        status: "live",
        time: "15'",
        home: { name: "Galatasaray", icon: "/assets/icons/Football/Team/Manchester City.png", score: 0 },
        away: { name: "Fenerbahce", icon: "/assets/icons/Football/Team/Arsenal.png", score: 1 },
      },
      {
        status: "live",
        time: "29'",
        home: { name: "Besiktas", icon: "/assets/icons/Football/Team/Manchester City.png", score: 1 },
        away: { name: "Trabzonspor", icon: "/assets/icons/Football/Team/Arsenal.png", score: 1 },
      },
      {
        status: "upcoming",
        time: "06:30 PM",
        home: { name: "Basaksehir", icon: "/assets/icons/Football/Team/Manchester City.png" },
        away: { name: "Sivasspor", icon: "/assets/icons/Football/Team/Arsenal.png" },
      },
      {
        status: "upcoming",
        time: "08:00 PM",
        home: { name: "Antalyaspor", icon: "/assets/icons/Football/Team/Manchester City.png" },
        away: { name: "Alanyaspor", icon: "/assets/icons/Football/Team/Arsenal.png" },
      },
      {
        status: "upcoming",
        time: "09:30 PM",
        home: { name: "Konyaspor", icon: "/assets/icons/Football/Team/Manchester City.png" },
        away: { name: "Kayserispor", icon: "/assets/icons/Football/Team/Arsenal.png" },
      },
    ],
  },
  {
    league: {
      name: "Turkish Super Lig",
      icon: "/assets/icons/Football/League/Rectangle 6.png",
    },
    games: [
      {
        status: "live",
        time: "15'",
        home: { name: "Galatasaray", icon: "/assets/icons/Football/Team/Manchester City.png", score: 0 },
        away: { name: "Fenerbahce", icon: "/assets/icons/Football/Team/Arsenal.png", score: 1 },
      },
      {
        status: "live",
        time: "29'",
        home: { name: "Besiktas", icon: "/assets/icons/Football/Team/Manchester City.png", score: 1 },
        away: { name: "Trabzonspor", icon: "/assets/icons/Football/Team/Arsenal.png", score: 1 },
      },
      {
        status: "upcoming",
        time: "06:30 PM",
        home: { name: "Basaksehir", icon: "/assets/icons/Football/Team/Manchester City.png" },
        away: { name: "Sivasspor", icon: "/assets/icons/Football/Team/Arsenal.png" },
      },
      {
        status: "upcoming",
        time: "08:00 PM",
        home: { name: "Antalyaspor", icon: "/assets/icons/Football/Team/Manchester City.png" },
        away: { name: "Alanyaspor", icon: "/assets/icons/Football/Team/Arsenal.png" },
      },
      {
        status: "upcoming",
        time: "09:30 PM",
        home: { name: "Konyaspor", icon: "/assets/icons/Football/Team/Manchester City.png" },
        away: { name: "Kayserispor", icon: "/assets/icons/Football/Team/Arsenal.png" },
      },
    ],
  },
  {
    league: {
      name: "Turkish Super Lig",
      icon: "/assets/icons/Football/League/Rectangle 6.png",
    },
    games: [
      {
        status: "live",
        time: "15'",
        home: { name: "Galatasaray", icon: "/assets/icons/Football/Team/Manchester City.png", score: 0 },
        away: { name: "Fenerbahce", icon: "/assets/icons/Football/Team/Arsenal.png", score: 1 },
      },
      {
        status: "live",
        time: "29'",
        home: { name: "Besiktas", icon: "/assets/icons/Football/Team/Manchester City.png", score: 1 },
        away: { name: "Trabzonspor", icon: "/assets/icons/Football/Team/Arsenal.png", score: 1 },
      },
      {
        status: "upcoming",
        time: "06:30 PM",
        home: { name: "Basaksehir", icon: "/assets/icons/Football/Team/Manchester City.png" },
        away: { name: "Sivasspor", icon: "/assets/icons/Football/Team/Arsenal.png" },
      },
      {
        status: "upcoming",
        time: "08:00 PM",
        home: { name: "Antalyaspor", icon: "/assets/icons/Football/Team/Manchester City.png" },
        away: { name: "Alanyaspor", icon: "/assets/icons/Football/Team/Arsenal.png" },
      },
      {
        status: "upcoming",
        time: "09:30 PM",
        home: { name: "Konyaspor", icon: "/assets/icons/Football/Team/Manchester City.png" },
        away: { name: "Kayserispor", icon: "/assets/icons/Football/Team/Arsenal.png" },
      },
    ],
  },
];

export default gamesData;