import { useState, useEffect } from 'react';

export interface BadgeCounts {
  pendingCount: number;
  unmappedBACount: number;
  newDiscoveryCount: number;
  pendingSchemaCount: number;
  pendingTermCount: number;
  staleTermCount: number;
}

const INITIAL_COUNTS: BadgeCounts = {
  pendingCount: 0,
  unmappedBACount: 0,
  newDiscoveryCount: 0,
  pendingSchemaCount: 0,
  pendingTermCount: 0,
  staleTermCount: 0,
};

export const useMenuBadges = () => {
  const [counts, setCounts] = useState<BadgeCounts>(INITIAL_COUNTS);

  const fetchCounts = async () => {
    // In a real app, this would be an API call
    // Mocking the counts for demonstration
    const mockCounts: BadgeCounts = {
      pendingCount: 5,
      unmappedBACount: 12,
      newDiscoveryCount: 3,
      pendingSchemaCount: 2,
      pendingTermCount: 8,
      staleTermCount: 4,
    };
    
    // Simulating randomness to show updates
    const randomized = {
        ...mockCounts,
        pendingCount: Math.floor(Math.random() * 10),
        newDiscoveryCount: Math.floor(Math.random() * 5),
    };

    setCounts(randomized);
  };

  useEffect(() => {
    fetchCounts();
    
    // Polling every 5 minutes as requested
    const interval = setInterval(fetchCounts, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return counts;
};
