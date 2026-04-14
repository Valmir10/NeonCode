import { useState } from 'react';
import styles from './BlackMarketView.module.css';

interface MarketItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  category: string;
}

const ITEMS: MarketItem[] = [
  {
    id: 'theme-purple',
    name: 'Midnight Purple',
    description: 'Deep purple editor theme',
    icon: '🟣',
    price: 200,
    category: 'Editor Themes',
  },
  {
    id: 'theme-red',
    name: 'Blood Red',
    description: 'Dark crimson code view',
    icon: '🔴',
    price: 300,
    category: 'Editor Themes',
  },
  {
    id: 'theme-green',
    name: 'Matrix Green',
    description: 'Classic hacker green-on-black',
    icon: '🟢',
    price: 250,
    category: 'Editor Themes',
  },
  {
    id: 'theme-solar',
    name: 'Solar Flare',
    description: 'Blazing orange highlights',
    icon: '🌅',
    price: 500,
    category: 'Editor Themes',
  },
  {
    id: 'badge-skull',
    name: 'Skull Badge',
    description: 'Show you mean business',
    icon: '💀',
    price: 150,
    category: 'Profile Badges',
  },
  {
    id: 'badge-lightning',
    name: 'Lightning Badge',
    description: 'Speed runner certified',
    icon: '⚡',
    price: 150,
    category: 'Profile Badges',
  },
  {
    id: 'badge-crown',
    name: 'Crown Badge',
    description: 'Royalty of the net',
    icon: '👑',
    price: 400,
    category: 'Profile Badges',
  },
  {
    id: 'badge-diamond',
    name: 'Diamond Badge',
    description: 'Unbreakable code, unbreakable you',
    icon: '💎',
    price: 600,
    category: 'Profile Badges',
  },
  {
    id: 'neon-pink',
    name: 'Pink Neon',
    description: 'Hot pink accent glow',
    icon: '💗',
    price: 100,
    category: 'Neon Colors',
  },
  {
    id: 'neon-gold',
    name: 'Gold Neon',
    description: 'Luxury gold highlights',
    icon: '✨',
    price: 200,
    category: 'Neon Colors',
  },
  {
    id: 'neon-ice',
    name: 'Ice Blue',
    description: 'Frozen cold blue accents',
    icon: '🧊',
    price: 100,
    category: 'Neon Colors',
  },
  {
    id: 'neon-toxic',
    name: 'Toxic Green',
    description: 'Radioactive green glow',
    icon: '☢️',
    price: 150,
    category: 'Neon Colors',
  },
];

const CATEGORIES = ['Editor Themes', 'Profile Badges', 'Neon Colors'];

interface BlackMarketViewProps {
  credits: number;
  onPurchase: (cost: number) => boolean;
}

export function BlackMarketView({ credits, onPurchase }: BlackMarketViewProps) {
  const [owned, setOwned] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const handleBuy = (item: MarketItem) => {
    setError(null);
    const success = onPurchase(item.price);
    if (success) {
      setOwned((prev) => new Set([...prev, item.id]));
    } else {
      setError('Not enough credits. Earn more by completing challenges.');
    }
  };

  return (
    <div className={styles.view}>
      <div className={styles.header}>
        <p className={styles.label}>Black Market</p>
        <h2 className={styles.title}>Cosmetic Store</h2>
        <div className={styles.creditsBar}>
          <span className={styles.creditsLabel}>Credits:</span>
          <span className={styles.creditsValue}>
            {credits.toLocaleString()}
          </span>
        </div>
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}

      {CATEGORIES.map((cat) => (
        <div key={cat} className={styles.category}>
          <h3 className={styles.categoryTitle}>{cat}</h3>
          <div className={styles.grid}>
            {ITEMS.filter((i) => i.category === cat).map((item) => {
              const isOwned = owned.has(item.id);
              return (
                <div
                  key={item.id}
                  className={isOwned ? styles.cardOwned : styles.card}
                >
                  <span className={styles.cardIcon}>{item.icon}</span>
                  <span className={styles.cardName}>{item.name}</span>
                  <span className={styles.cardDesc}>{item.description}</span>
                  <div className={styles.cardFooter}>
                    <span className={styles.price}>{item.price} cr</span>
                    {isOwned ? (
                      <span className={styles.ownedTag}>Owned</span>
                    ) : (
                      <button
                        className={styles.buyBtn}
                        disabled={credits < item.price}
                        onClick={() => handleBuy(item)}
                      >
                        Buy
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
