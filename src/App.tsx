import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import VoiceChat from './components/VoiceChat';

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <VoiceChat />
      </Layout>
    </ThemeProvider>
  );
}

export default App;