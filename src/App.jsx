import { Routes, Route, NavLink } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CreatePage from './pages/CreatePage'
import GalleryPage from './pages/GalleryPage'
import DetailsPage from './pages/DetailsPage'
import UpdatePage from './pages/UpdatePage'
import './App.css' // Assuming we'll have some basic app-wide styles

function App() {
  return (
    <div className="App">
      {/* Basic Sidebar Navigation */}
      <nav className="sidebar">
        {/* Added a simple text logo that links home */}
        <NavLink to="/" className="sidebar-logo">JobTrack</NavLink>
        
        {/* Use NavLink for active styling */}
        <NavLink 
            to="/"
            className={({ isActive }) => isActive ? "active" : ""} // Apply active class based on route match
            end // Ensure exact match for home route
        >
            Home
        </NavLink>
        <NavLink 
            to="/create" 
            className={({ isActive }) => isActive ? "active" : ""}
        >
            Log Application
        </NavLink>
        <NavLink 
            to="/gallery" 
            className={({ isActive }) => isActive ? "active" : ""}
        >
            View Gallery
        </NavLink>
      </nav>

      {/* Main Content Area */}
      <main className="content">
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/details/:id" element={<DetailsPage />} />
          <Route path="/update/:id" element={<UpdatePage />} />
          {/* Optional: Add a 404 Not Found route */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </main>
    </div>
  )
}

export default App
