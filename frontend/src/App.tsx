import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Navigator from './pages/Navigator';
import Schemes from './pages/Schemes';
import Calculator from './pages/Calculator';
import Partners from './pages/Partners';
import Documents from './pages/Documents';
import Report from './pages/Report';
import Journey from './pages/Journey';
import Admin from './pages/Admin';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import AdminRoute from './components/auth/AdminRoute';
import LanguageModal from './components/ui/LanguageModal';

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <BrowserRouter>
          <LanguageModal />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Landing />} />
              <Route path="ai-talk" element={<Navigator />} />
              <Route path="navigator" element={<Navigator />} />
              <Route path="schemes" element={<Schemes />} />
              <Route path="calculator" element={<Calculator />} />
              <Route path="partners" element={<Partners />} />
              <Route path="documents" element={<Documents />} />
              <Route path="report" element={<Report />} />
              <Route path="journey" element={<Journey />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="admin" element={<AdminRoute><Admin /></AdminRoute>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
