import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import { FileProvider } from './context/FileContext';
import { AuthProvider } from './context/AuthContext';
import { CacheProvider } from './context/CacheContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CacheProvider>
          <FileProvider>
            <Router>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/dashboard/*"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Router>
          </FileProvider>
        </CacheProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
