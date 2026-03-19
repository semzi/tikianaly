import apiClient from "../axios";

export const getTennisLiveMatches = async () => {
  const endpoint = "/api/v1/tennis/live";
  const response = await apiClient.get(endpoint);
  return response.data;
};

export const getTennisMatchesByDayOffset = async (dayOffset: number) => {
  const endpoint = "/api/v1/tennis/matches";
  const response = await apiClient.get(endpoint, {
    params: { dayOffset },
  });
  return response.data;
};

export const getTennisLeagues = async () => {
  const endpoint = "/api/v1/tennis/leagues";
  const response = await apiClient.get(endpoint);
  return response.data;
};
