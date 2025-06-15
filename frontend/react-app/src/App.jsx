import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import LoginForm from './components/LoginForm.jsx';
import Dashboard from './components/Dashboard.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import OperatorPanel from './components/OperatorPanel.jsx';
import AnalystPanel from './components/AnalystPanel.jsx';
import RouteManager from './components/RouteManager.jsx';
import ReportView from './components/ReportView.jsx';
import RouteHistory from './components/RouteHistory.jsx';
import AdminAnalytics from './components/AdminAnalytics.jsx'
import FlightPlans from './components/FlightPlans.jsx';
import FlightManagementPanel from './components/FlightManagementPanel.jsx'
import DroneManager from './components/DroneManager.jsx'
import React from 'react';
import 'leaflet/dist/leaflet.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<AdminPanel />} />
          <Route path="/operator" element={<OperatorPanel />} />
          <Route path="/reports" element={<ReportView />} />
          <Route path="/routes" element={<RouteManager />} />
          <Route path="/history" element={<RouteHistory />} />
          <Route path="/logging" element={<AdminAnalytics />} />
          <Route path="/flights" element={<FlightPlans />} />
          <Route path="/analyst" element={<AnalystPanel />} />
          <Route path="/flightplans" element={<FlightManagementPanel />} />
          <Route path="/drone" element={<DroneManager />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;