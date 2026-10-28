import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { TripProvider } from './context/TripContext';

import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Trips from './pages/Trips';
import TripDetail from './pages/TripDetail';
import ItineraryPage from './pages/ItineraryPage';
import BudgetPage from './pages/BudgetPage';
import PlacesPage from './pages/PlacesPage';
import ProfilePage from './pages/ProfilePage';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar toggleSidebar={() => setSidebarOpen(prev => !prev)} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/trips/:id" element={<TripDetail />} />
            <Route path="/itinerary" element={<ItineraryPage />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/places" element={<PlacesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TripProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected App Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/*" element={<AppLayout />} />
              </Route>
            </Routes>
          </Router>
        </TripProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
