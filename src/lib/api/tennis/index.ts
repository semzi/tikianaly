import axios from "axios";

// Goalserve tennis endpoints running on local backend (http://localhost:7824)
const TENNIS_BASE_URL = "http://localhost:7824";
const tennisClient = axios.create({
  baseURL: TENNIS_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getTennisLiveMatches = async () => {
  // Today's live & finished matches
  const response = await tennisClient.get("/api/tennis_scores/home?json=1");
  return response.data;
};

export const getTennisMatchesByDayOffset = async (dayOffset: number) => {
  // By day: 0=today, -1=yesterday, 1=tomorrow, range: d-7 to d7
  const endpoint =
    dayOffset === 0
      ? "/api/tennis_scores/home?json=1"
      : `/api/tennis_scores/d${dayOffset}?json=1`;
  const response = await tennisClient.get(endpoint);
  return response.data;
};

export const getTennisLeagues = async () => {
  // Tournaments list
  const response = await tennisClient.get("/api/tennis_scores/leagues?json=1");
  return response.data;
};
