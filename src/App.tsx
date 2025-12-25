import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DashboardLayout } from './layout/DashboardLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { OrdersPage } from './pages/OrdersPage';
import { ShipmentsPage } from './pages/ShipmentsPage';
import { ClientsPage } from './pages/ClientsPage';
import { VinInventoryPage } from './pages/VinInventoryPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { SettingsPage } from './pages/SettingsPage';
import { ClientInvoicesPage } from './pages/ClientInvoicesPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="shipments" element={<ShipmentsPage />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="suppliers" element={<SuppliersPage />} />
              <Route path="companies" element={<CompaniesPage />} />
              <Route path="client-invoices" element={<ClientInvoicesPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
