import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { TheoryPage } from './pages/TheoryPage';
import { TestPage } from './pages/TestPage';
import { MyTicketPage } from './pages/MyTicketPage';
import { PracticePage } from './pages/PracticePage';
import { PracticeCategoryPage } from './pages/PracticeCategoryPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  const { init, loaded } = useAppStore();

  useEffect(() => {
    void init();
  }, [init]);

  if (!loaded) {
    return <div className="loader">Загрузка...</div>;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/theory" element={<TheoryPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/my-ticket" element={<MyTicketPage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/practice/:id" element={<PracticeCategoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
