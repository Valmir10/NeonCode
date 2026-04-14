import { useState } from 'react';
import type { Friend } from '../../../stores/useFriendsStore';
import styles from './FriendsView.module.css';

interface FriendsViewProps {
  friends: Friend[];
  onlineFriends: Friend[];
  offlineFriends: Friend[];
  onAddFriend: (username: string) => boolean;
  onRemoveFriend: (friendId: string) => void;
}

const STATUS_LABELS: Record<Friend['status'], string> = {
  online: 'Online',
  coding: 'Coding',
  offline: 'Offline',
};

export function FriendsView({
  friends,
  onlineFriends,
  offlineFriends,
  onAddFriend,
  onRemoveFriend,
}: FriendsViewProps) {
  const [addInput, setAddInput] = useState('');
  const [addMessage, setAddMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleAdd = () => {
    if (!addInput.trim()) return;
    const success = onAddFriend(addInput);
    if (success) {
      setAddMessage({ text: `${addInput} added as friend!`, type: 'success' });
      setAddInput('');
    } else {
      setAddMessage({ text: 'Already in your friends list.', type: 'error' });
    }
    setTimeout(() => setAddMessage(null), 3000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className={styles.friends}>
      <div className={styles.header}>
        <h2 className={styles.title}>Friends</h2>
        <p className={styles.subtitle}>
          {onlineFriends.length} online · {friends.length} total
        </p>
      </div>

      {/* Add Friend */}
      <div className={styles.addSection}>
        <div className={styles.addRow}>
          <input
            type="text"
            className={styles.addInput}
            placeholder="Enter username..."
            value={addInput}
            onChange={(e) => setAddInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className={styles.addBtn} onClick={handleAdd}>
            Add
          </button>
        </div>
        {addMessage && (
          <p className={`${styles.addMessage} ${styles[`msg_${addMessage.type}`]}`}>
            {addMessage.text}
          </p>
        )}
      </div>

      {/* Online Friends */}
      {onlineFriends.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            Online ({onlineFriends.length})
          </h3>
          <div className={styles.friendList}>
            {onlineFriends.map((friend) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onRemove={onRemoveFriend}
              />
            ))}
          </div>
        </div>
      )}

      {/* Offline Friends */}
      {offlineFriends.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            Offline ({offlineFriends.length})
          </h3>
          <div className={styles.friendList}>
            {offlineFriends.map((friend) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onRemove={onRemoveFriend}
              />
            ))}
          </div>
        </div>
      )}

      {friends.length === 0 && (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>No friends yet</p>
          <p className={styles.emptyDesc}>
            Add friends by entering their username above.
          </p>
        </div>
      )}
    </div>
  );
}

function FriendCard({
  friend,
  onRemove,
}: {
  friend: Friend;
  onRemove: (id: string) => void;
}) {
  const initials = friend.username.slice(0, 2).toUpperCase();

  return (
    <div className={styles.friendCard}>
      <div className={styles.friendAvatar}>{initials}</div>
      <div className={styles.friendInfo}>
        <div className={styles.friendName}>{friend.username}</div>
        <div className={styles.friendMeta}>
          <span className={styles.friendRank}>{friend.rank}</span>
          <span className={styles.friendXp}>{friend.xp.toLocaleString()} XP</span>
        </div>
      </div>
      <div className={styles.friendRight}>
        <span className={`${styles.statusDot} ${styles[`status_${friend.status}`]}`} />
        <span className={styles.statusText}>{STATUS_LABELS[friend.status]}</span>
      </div>
      <button
        className={styles.removeBtn}
        onClick={() => onRemove(friend.id)}
        title="Remove friend"
      >
        ×
      </button>
    </div>
  );
}
