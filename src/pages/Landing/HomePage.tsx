import { HackerIntro } from '../../components/landing/HackerIntro';
import { HeroSection } from '../../components/landing/HeroSection';
import { LiveTicker } from '../../components/landing/LiveTicker';
import { InteractiveDemo } from '../../components/landing/InteractiveDemo';
import { Footer } from '../../components/landing/Footer';
import styles from './HomePage.module.css';

export function HomePage() {
  return (
    <div className={styles.landing}>
      <HackerIntro />
      <HeroSection />
      <LiveTicker />
      <InteractiveDemo />
      <Footer />
    </div>
  );
}
