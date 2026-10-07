import { createContext } from 'react';
import { useApi } from '../hooks/useApi';
import { getProfile } from '../services/portfolioService';

export const ProfileContext = createContext(null);

/** Loads the profile once and shares it with every page. */
export function ProfileProvider({ children }) {
  const profileState = useApi((signal) => getProfile(signal), [], { cacheKey: 'profile' });
  return <ProfileContext.Provider value={profileState}>{children}</ProfileContext.Provider>;
}