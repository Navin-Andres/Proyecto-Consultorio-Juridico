import Navbar from './components/Navbar/Navbar'
import StepForm from './components/StepForm/StepForm'
import Footer from './components/Footer/Footer'
import CapacityDashboard from './components/CapacityDashboard/CapacityDashboard'
import AdminLogin from './components/Admin/AdminLogin'
import AdminDashboard from './components/Admin/AdminDashboard'
import './App.css'

function App() {
  // Simple check for path until router is installed
  const path = window.location.pathname;

  if (path === '/admin') {
    return <AdminLogin />;
  }

  if (path === '/admin-dashboard') {
    return <AdminDashboard />;
  }

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <main className="main-left">
          <StepForm />
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
