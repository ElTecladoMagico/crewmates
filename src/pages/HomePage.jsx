import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Import CSS

const HomePage = () => {
  return (
    <div className="home-page-container">
      <header className="home-header">
        <h1>Welcome to JobTrack!</h1>
        <p className="subtitle">
          Your personal dashboard for managing job applications efficiently.
        </p>
      </header>

      <section className="home-content">
        <p>
          Never lose track of an application again. Log companies, positions, 
          application dates, statuses, and important notes all in one place.
        </p>
        
        <div className="home-actions">
          <Link to="/create" className="home-button primary">
            Log New Application
          </Link>
          <Link to="/gallery" className="home-button secondary">
            View Application Gallery
          </Link>
        </div>
      </section>

      {/* Optional: Add an image or illustration later */}
      {/* <div className="home-illustration">
          <img src="/path/to/your/image.svg" alt="Job Tracking Illustration" />
      </div> */}

    </div>
  );
};

export default HomePage; 