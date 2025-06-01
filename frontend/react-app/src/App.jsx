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
          <Route path="/report" element={<ReportView />} />
          <Route path="/routes" element={<RouteManager />} />
          <Route path="/history" element={<RouteHistory />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;