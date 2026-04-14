import { HeroSection } from '../../components/landing/HeroSection';
import { LiveTicker } from '../../components/landing/LiveTicker';
import { FeaturesSection } from '../../components/landing/FeaturesSection';
import { LanguageShowcase } from '../../components/landing/LanguageShowcase';
import { HowItWorks } from '../../components/landing/HowItWorks';
import { InteractiveDemo } from '../../components/landing/InteractiveDemo';
import { StatsSection } from '../../components/landing/StatsSection';
import { CallToAction } from '../../components/landing/CallToAction';
import { Footer } from '../../components/landing/Footer';
import styles from './HomePage.module.css';

type Page = 'home' | 'register' | 'main';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className={styles.landing}>
      <HeroSection onNavigate={onNavigate} />
      <LiveTicker />
      <FeaturesSection />
      <LanguageShowcase />
      <HowItWorks />
      <InteractiveDemo />
      <StatsSection />
      <CallToAction onNavigate={onNavigate} />
      <Footer />
    </div>
  );
}
