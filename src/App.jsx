import Navbar from './components/Navbar'
import StepForm from './components/StepForm'
import Footer from './components/Footer'
import CapacityDashboard from './components/CapacityDashboard'
import './App.css'

function App() {
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
