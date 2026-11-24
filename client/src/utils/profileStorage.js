const PROFILE_STORAGE_KEY = 'trailmate_profile';

export const DEFAULT_PROFILE = {
  name: 'Explorer',
  bio: 'Exploring the world with Trail Mate',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
};

/**
 * Retrieve the traveler profile from localStorage, falling back to defaults.
 */
export const getLocalProfile = () => {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
    };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
};

/**
 * Persist traveler profile updates to localStorage and notify listeners.
 */
export const saveLocalProfile = (updates) => {
  const updated = {
    ...getLocalProfile(),
    ...updates,
  };
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('trailmate-profile-updated', { detail: updated }));
  return updated;
};
