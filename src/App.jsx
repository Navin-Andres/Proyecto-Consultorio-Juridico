import { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import StepForm from './components/StepForm/StepForm'
import Footer from './components/Footer/Footer'
import CapacityDashboard from './components/CapacityDashboard/CapacityDashboard'
import AdminLogin from './components/Admin/AdminLogin/AdminLogin'
import AdminDashboard from './components/Admin/AdminDashboard/AdminDashboard'
import SuccessScreen from './components/SuccessScreen/SuccessScreen'
import ConsultaEstudiantes from './components/Cosultas_estudiantes/ConsultaEstudiantes'
import Reglamento from './components/Reglamento/Reglamento'
import Ayuda from './components/Ayuda/Ayuda'
import './App.css'

function App() {
  const [successData, setSuccessData] = useState(null);
  // Simple check for path until router is installed
  const path = window.location.pathname;

  if (path === '/admin') {
    return <AdminLogin />;
  }

  if (path === '/admin-dashboard') {
    return <AdminDashboard />;
  }

  if (path === '/consultar-inscripciones') {
    return (
      <div className="app-container">
        <Navbar showInscripciones={true} />
        <div className="main-content" style={{ justifyContent: 'center', marginTop: '40px', padding: '0 20px' }}>
          <ConsultaEstudiantes />
        </div>
        <Footer />
      </div>
    );
  }

  if (path === '/reglamento') {
    return (
      <div className="app-container">
        <Navbar />
        <div className="main-content" style={{ justifyContent: 'center', marginTop: '40px', padding: '0 20px' }}>
          <Reglamento />
        </div>
        <Footer />
      </div>
    );
  }

  if (path === '/ayuda') {
    return (
      <div className="app-container">
        <Navbar />
        <div className="main-content" style={{ justifyContent: 'center', marginTop: '40px', padding: '0 20px' }}>
          <Ayuda />
        </div>
        <Footer />
      </div>
    );
  }

  if (successData) {
    return (
      <div className="app-container">
        <div className="main-content" style={{ justifyContent: 'center', marginTop: '0', paddingTop: '10px' }}>
          <SuccessScreen formData={successData} />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <main className="main-left">
          <StepForm onSuccess={(data) => setSuccessData(data)} />
        </main>
        <div className="main-right">
          <CapacityDashboard />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default App
