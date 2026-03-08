import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext' 
import { Navbar } from './components/Navbar/Navbar'
import { HomePage } from './pages/Home/HomePage'
import { LaunchesPage } from './pages/LaunchesPage/LaunchesPage'
import { LaunchDetails } from './pages/LaunchDetails/LaunchDetails'
import { ShipsPage } from './pages/ShipsPage/ShipsPage'
import { ShipDetails } from './pages/ShipDetailsPage/ShipDetails'
import { NotFound } from './pages/NotFound/NotFoundPage'

function App() {
  return (
    <ThemeProvider> 
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/launches" element={<LaunchesPage />} />
            <Route path="/launch/:id" element={<LaunchDetails />} />
            <Route path="/ships" element={<ShipsPage />} />
            <Route path="/ship/:id" element={<ShipDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </Router>
    </ThemeProvider>
  );
}

export default App;