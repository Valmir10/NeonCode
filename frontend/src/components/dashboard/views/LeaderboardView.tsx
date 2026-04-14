import { useMemo } from 'react';
import { getRank } from '../../../stores/usePlayerStore';
import styles from './LeaderboardView.module.css';

interface Runner {
  name: string;
  xp: number;
}

const FAKE_RUNNERS: Runner[] = [
  { name: 'ZeroCool', xp: 15200 },
  { name: 'Ph4nt0m', xp: 12800 },
  { name: 'CrashOverride', xp: 9500 },
  { name: 'AcidBurn', xp: 8200 },
  { name: 'N3oTok', xp: 7100 },
  { name: 'ByteStorm', xp: 5800 },
  { name: 'DarkSignal', xp: 4300 },
  { name: 'GlitchQueen', xp: 3600 },
  { name: 'VoidWalker', xp: 2900 },
  { name: 'PixelDrift', xp: 2100 },
  { name: 'ShadowByte', xp: 1500 },
  { name: 'NullPointer', xp: 900 },
  { name: 'LoopBreak', xp: 600 },
  { name: 'StackTrace', xp: 300 },
  { name: 'BugHunter', xp: 100 },
];

interface LeaderboardViewProps {
  playerUsername: string;
  playerXp: number;
}

export function LeaderboardView({
  playerUsername,
  playerXp,
}: LeaderboardViewProps) {
  const { entries, playerPosition } = useMemo(() => {
    const all = [...FAKE_RUNNERS, { name: playerUsername, xp: playerXp }].sort(
      (a, b) => b.xp - a.xp,
    );

    const pos = all.findIndex((r) => r.name === playerUsername) + 1;
    return { entries: all, playerPosition: pos };
  }, [playerUsername, playerXp]);

  return (
    <div className={styles.view}>
      <p className={styles.label}>Global Rankings</p>
      <h2 className={styles.title}>Leaderboard</h2>

      <div className={styles.positionBanner}>
        <p className={styles.positionLabel}>Your Position</p>
        <div className={styles.positionNumber}>#{playerPosition}</div>
        <p className={styles.positionRank}>
          {getRank(playerXp)} — {playerXp.toLocaleString()} XP
        </p>
      </div>

      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th className={styles.headerCell}>#</th>
            <th className={styles.headerCell}>Runner</th>
            <th className={styles.headerCellRight}>XP</th>
            <th className={styles.headerCellRight}>Rank</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((runner, i) => {
            const isPlayer = runner.name === playerUsername;
            const pos = i + 1;
            const posClass =
              pos === 1
                ? styles.gold
                : pos === 2
                  ? styles.silver
                  : pos === 3
                    ? styles.bronze
                    : '';
            return (
              <tr
                key={runner.name}
                className={isPlayer ? styles.rowPlayer : styles.row}
              >
                <td className={`${styles.posCell} ${posClass}`}>{pos}</td>
                <td
                  className={isPlayer ? styles.nameCellPlayer : styles.nameCell}
                >
                  {runner.name}
                  {isPlayer && <span className={styles.youTag}>You</span>}
                </td>
                <td className={styles.xpCell}>{runner.xp.toLocaleString()}</td>
                <td className={styles.rankCell}>{getRank(runner.xp)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
