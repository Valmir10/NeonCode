import { useState, useCallback } from 'react';

export interface Friend {
  id: string;
  username: string;
  rank: string;
  xp: number;
  status: 'online' | 'offline' | 'coding';
  addedAt: number;
}

// Simulated friends for demo purposes
const DEMO_FRIENDS: Friend[] = [
  { id: 'f1', username: 'zeroDay', rank: 'Netrunner', xp: 2450, status: 'online', addedAt: Date.now() - 86400000 * 3 },
  { id: 'f2', username: 'nullByte', rank: 'Code Monkey', xp: 870, status: 'coding', addedAt: Date.now() - 86400000 * 7 },
  { id: 'f3', username: 'pixelDrift', rank: 'Script Kiddie', xp: 320, status: 'offline', addedAt: Date.now() - 86400000 * 14 },
  { id: 'f4', username: 'synthWave', rank: 'Cyber Ghost', xp: 5200, status: 'online', addedAt: Date.now() - 86400000 * 2 },
  { id: 'f5', username: 'dataFlux', rank: 'Code Monkey', xp: 1100, status: 'offline', addedAt: Date.now() - 86400000 * 5 },
];

export function useFriendsStore() {
  const [friends, setFriends] = useState<Friend[]>(DEMO_FRIENDS);
  const [pendingRequests] = useState<string[]>([]);

  const addFriend = useCallback((username: string) => {
    const trimmed = username.trim();
    if (!trimmed) return false;

    // Check if already a friend
    if (friends.some((f) => f.username.toLowerCase() === trimmed.toLowerCase())) {
      return false;
    }

    // Check if already pending
    if (pendingRequests.includes(trimmed.toLowerCase())) {
      return false;
    }

    // Simulate adding - in a real app this would be an API call
    const newFriend: Friend = {
      id: `f-${Date.now()}`,
      username: trimmed,
      rank: 'Script Kiddie',
      xp: Math.floor(Math.random() * 500),
      status: Math.random() > 0.5 ? 'online' : 'offline',
      addedAt: Date.now(),
    };

    setFriends((prev) => [newFriend, ...prev]);
    return true;
  }, [friends, pendingRequests]);

  const removeFriend = useCallback((friendId: string) => {
    setFriends((prev) => prev.filter((f) => f.id !== friendId));
  }, []);

  const onlineFriends = friends.filter((f) => f.status !== 'offline');
  const offlineFriends = friends.filter((f) => f.status === 'offline');

  return {
    friends,
    onlineFriends,
    offlineFriends,
    pendingRequests,
    addFriend,
    removeFriend,
  };
}
