import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Gaming from '@/pages/Gaming';
import Esports from '@/pages/Esports';
import Social from '@/pages/Social';
import Contact from '@/pages/Contact';
import Support from '@/pages/Support';
import Archive from '@/pages/Archive';
import Admin from '@/pages/Admin';
import AdminLogin from '@/pages/AdminLogin';
import ProtectedRoute from '@/components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/gaming" element={<Gaming />} />
            <Route path="/esports" element={<Esports />} />
            <Route path="/social" element={<Social />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/support" element={<Support />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/admin-login" element={<AdminLogin />} />
          </Route>
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;