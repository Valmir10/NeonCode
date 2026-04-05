import { useState } from 'react';
import './styles/globals.css';
import { HomePage } from './pages/Landing/HomePage';
import { RegistrationPage } from './pages/Registration/RegistrationPage';

type Page = 'home' | 'register' | 'main';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  switch (currentPage) {
    case 'register':
      return (
        <RegistrationPage
          onBack={() => setCurrentPage('home')}
          onLogin={() => setCurrentPage('main')}
        />
      );
    case 'main':
      return <div>Main Page - Coming soon</div>;
    case 'home':
    default:
      return <HomePage onNavigate={setCurrentPage} />;
  }
}

export default App;
