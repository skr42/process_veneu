import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import Work from './pages/Work';
import Links from './pages/Links';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="main-content">
            <div className="container">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
                <Route path="/skills" element={
                  <PrivateRoute>
                    <Skills />
                  </PrivateRoute>
                } />
                <Route path="/projects" element={
                  <PrivateRoute>
                    <Projects />
                  </PrivateRoute>
                } />
                <Route path="/work" element={
                  <PrivateRoute>
                    <Work />
                  </PrivateRoute>
                } />
                <Route path="/links" element={
                  <PrivateRoute>
                    <Links />
                  </PrivateRoute>
                } />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
