import { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import StepForm from './components/StepForm/StepForm'
import Footer from './components/Footer/Footer'
import CapacityDashboard from './components/CapacityDashboard/CapacityDashboard'
import AdminLogin from './components/Admin/AdminLogin'
import AdminDashboard from './components/Admin/AdminDashboard'
import SuccessScreen from './components/SuccessScreen/SuccessScreen'
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
