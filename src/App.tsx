import { useState } from 'react';
import './styles/globals.css';
import { HomePage } from './pages/Landing/HomePage';
import { RegistrationPage } from './pages/Registration/RegistrationPage';
import { MainPage } from './pages/Main/MainPage';

type Page = 'home' | 'register' | 'main';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [username, setUsername] = useState('Runner');

  const handleLogin = (name?: string) => {
    if (name) setUsername(name);
    setCurrentPage('main');
  };

  switch (currentPage) {
    case 'register':
      return (
        <RegistrationPage
          onBack={() => setCurrentPage('home')}
          onLogin={handleLogin}
        />
      );
    case 'main':
      return (
        <MainPage username={username} onLogout={() => setCurrentPage('home')} />
      );
    case 'home':
    default:
      return <HomePage onNavigate={setCurrentPage} />;
  }
}

export default App;
