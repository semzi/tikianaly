import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface GetTeamLogoProps {
  teamId: number;
  alt: string;
  className?: string;
}

const GetTeamLogo: React.FC<GetTeamLogoProps> = ({ teamId, alt, className }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamLogo = async () => {
      setLoading(true);
      setError(null);
      try {
          const response = await axios.get(`https://tikianaly-service-backend.onrender.com/api/v1/football/teams/id/${teamId}`);
          console.log(`API Response for teamId ${teamId}:`, response.data);
          if (response.data && response.data.responseObject && response.data.responseObject.item && response.data.responseObject.item.image) {
            // Convert base64 to data URI
            const base64Image = response.data.responseObject.item.image;
            const dataUri = `data:image/png;base64,${base64Image}`;
            setLogoUrl(dataUri);
            console.log(`Setting logoUrl for teamId ${teamId}:`, dataUri);
          } else {
            setLogoUrl(null);
            console.log(`No logo found or invalid response for teamId ${teamId}.`);
          }
      } catch (err) {
        console.error(`Error fetching logo for teamId ${teamId}:`, err);
        setError('Failed to load logo');
        setLogoUrl(null);
      } finally {
        setLoading(false);
      }
    };

    if (teamId) {
      fetchTeamLogo();
    } else {
      setLogoUrl(null);
      setLoading(false);
    }
  }, [teamId]);

  if (loading) {
    return <div className={`animate-pulse bg-gray-300 rounded-full ${className}`} style={{ minWidth: '20px', minHeight: '20px' }} />;
  }

  if (error || !logoUrl) {
    return <img src={'/loading-state/shield.svg'} alt={`${alt} - No Logo`} className={className} />;
  }

  return <img src={logoUrl} alt={alt} className={className} />;
};

export default GetTeamLogo;