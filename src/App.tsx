import './App.css'
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import { LaunchesPage } from './pages/LaunchesPage/LaunchesPage'
import {LaunchDetails} from './pages/LaunchDetails/LaunchDetails'

function App() {

  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/launches">Launches</Link>
      </nav>

      <Routes>
        <Route path="/" element={<h1>Home - SpaceX Info</h1>} />
        <Route path="/launches" element={<LaunchesPage/>} />
        <Route path="/launch/:id" element={<LaunchDetails/>}/>
        <Route path="*" element={<h1>404 - Not Found</h1>} />
      </Routes>
    </Router>
  )
}

export default App
