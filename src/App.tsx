import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppContent } from './components/AppContent';


function App() {

 return (
 <div className="min-h-screen">
 <BrowserRouter>
 <AppContent />

 </BrowserRouter>
    </div>
  );
}

export default App;