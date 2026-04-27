import { useState } from 'react';
import { Box, Button, Center, Container, Heading, HStack, Stack } from '@chakra-ui/react';
import Home from './pages/Home';
import SavedPlans from './pages/SavedPlans';
import EditPlan from './pages/EditPlan';

const tabs = [
  { id: 'home', label: 'Home' },
  { id: 'saved', label: 'Saved Plans' },
  { id: 'edit', label: 'Edit Plan' },
] as const;

type TabId = (typeof tabs)[number]['id'];

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f7fafc', paddingBottom: '3rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', paddingTop: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>Smart Itinerary Planner</h1>
            <div style={{ marginTop: '0.5rem', color: '#718096' }}>
              Plan trips faster with smart suggestions, reusable itineraries, and export-ready details.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                style={{
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.875rem',
                  backgroundColor: activeTab === tab.id ? '#3182ce' : '#e2e8f0',
                  color: activeTab === tab.id ? 'white' : '#4a5568',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'home' && <Home />}
          {activeTab === 'saved' && <SavedPlans />}
          {activeTab === 'edit' && <EditPlan onOpenSavedPlans={() => setActiveTab('saved')} />}
        </div>
      </div>
    </div>
  );
}

export default App;
