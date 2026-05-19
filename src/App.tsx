import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { VehicleProvider } from './context/VehicleContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ReportProvider } from './context/ReportContext';
import { MaintenanceProvider } from './context/MaintenanceContext';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import VehicleInventory from './views/VehicleInventory';
import AddVehicleForm from './views/AddVehicleForm';
import EditVehicleForm from './views/EditVehicleForm';
import ChecklistForm from './views/ChecklistForm';
import MaintenanceControl from './views/MaintenanceControl';
import RevisionsControl from './views/RevisionsControl';
import AuditLogs from './views/AuditLogs';
import Login from './views/Login';
import MilitarManagement from './views/MilitarManagement';
import AddMilitarForm from './views/AddMilitarForm';
import EditMilitarForm from './views/EditMilitarForm';
import SettingsView from './views/Settings';
import ChatView from './views/Chat';
import { ChatProvider } from './context/ChatContext';
import { UserRole } from './types';
import LoadMaps from './views/LoadMaps';
import ChecklistCargaForm from './views/ChecklistCargaForm';
import { LoadChecklistProvider } from './context/LoadChecklistContext';
import LoadReports from './views/LoadReports';
import Home from './views/Home';


function AppContent() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading && !isAuthenticated) {
    // Show a loading screen while checking initial session or during login
    return (
      <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Iniciando Sistema...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const isOperacional = user?.role === UserRole.OPERACIONAL;
  const isCBU = user?.role === UserRole.CBU;
  const canAccessMaintenanceAndRevisions = user?.role === UserRole.ADMINISTRADOR || user?.role === UserRole.CIA_OP;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Página Inicial comum a todos os perfis pós-login */}
          <Route index element={<Home />} />

          {isOperacional ? (
            <>
              <Route path="checklist" element={<ChecklistForm />} />
              <Route path="checklist-carga" element={<ChecklistCargaForm />} />
              <Route path="mapacarga" element={<LoadMaps />} />
              <Route path="chat" element={<ChatView />} />
              <Route path="configuracoes" element={<SettingsView />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              {/* O Painel Analítico / Dashboard foi movido de / para /painel */}
              <Route path="painel" element={<Dashboard />} />
              <Route path="viaturas" element={<VehicleInventory />} />
              {!isCBU && (
                <>
                  <Route path="viaturas/novo" element={<AddVehicleForm />} />
                  <Route path="viaturas/editar/:id" element={<EditVehicleForm />} />
                </>
              )}
              <Route path="militares" element={<MilitarManagement />} />
              <Route path="militares/novo" element={<AddMilitarForm />} />
              <Route path="militares/editar/:id" element={<EditMilitarForm />} />
              <Route path="checklist" element={<ChecklistForm />} />
              <Route path="checklist-carga" element={<ChecklistCargaForm />} />
              <Route path="mapacarga" element={<LoadMaps />} />
              <Route path="chat" element={<ChatView />} />
              {canAccessMaintenanceAndRevisions && (
                <>
                  <Route path="manutencao" element={<MaintenanceControl />} />
                  <Route path="revisoes" element={<RevisionsControl />} />
                </>
              )}
              <Route path="relatorios" element={<AuditLogs />} />
              <Route path="relatorios-carga" element={<LoadReports />} />
              <Route path="configuracoes" element={<SettingsView />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Route>
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <VehicleProvider>
        <ReportProvider>
          <LoadChecklistProvider>
            <MaintenanceProvider>
              <ChatProvider>
                <AppContent />
              </ChatProvider>
            </MaintenanceProvider>
          </LoadChecklistProvider>
        </ReportProvider>
      </VehicleProvider>
    </AuthProvider>
  );
}

