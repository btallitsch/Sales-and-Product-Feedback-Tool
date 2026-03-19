import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import DashboardPage from '@/pages/DashboardPage';
import CapturePage from '@/pages/CapturePage';
import InsightsPage from '@/pages/InsightsPage';
import BoardPage from '@/pages/BoardPage';
import { loadFeedback } from '@/services/storage';

type Page = 'dashboard' | 'capture' | 'insights' | 'board';

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const feedbackCount = loadFeedback().length;

  return (
    <>
      <Sidebar activePage={page} onNavigate={setPage} feedbackCount={feedbackCount} />
      {page === 'dashboard' && <DashboardPage />}
      {page === 'capture' && <CapturePage />}
      {page === 'insights' && <InsightsPage />}
      {page === 'board' && <BoardPage />}
    </>
  );
}
