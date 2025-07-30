import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import supabase from '../config/supabaseClient';
import './GalleryPage.css'; // Import the CSS

// Helper to get status badge class
const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'applied': return 'status-applied';
    case 'interviewing': return 'status-interviewing';
    case 'offer': return 'status-offer';
    case 'rejected': return 'status-rejected';
    default: return ''; // Default or unknown status
  }
};

// Optional: Create a separate component for the card later
const JobApplicationCard = ({ application }) => {
  const isActive = application.status === 'Interviewing' || application.status === 'Offer';
  const cardClasses = `job-card ${isActive ? 'active-application' : ''}`;

  return (
    <div className={cardClasses}>
      <h3>{application.company_name}</h3>
      <p><strong>Position:</strong> {application.position}</p>
      <p>
        <strong>Status:</strong> 
        <span className={`status-badge ${getStatusClass(application.status)}`}>
          {application.status || 'N/A'}
        </span>
      </p>
      {/* Optionally display date: {application.application_date} */}
      <div className="card-actions">
        <Link to={`/details/${application.id}`} className="card-button view-button">View Details</Link>
        <Link to={`/update/${application.id}`} className="card-button edit-button">Edit</Link>
      </div>
    </div>
  );
};

const GalleryPage = () => {
  const location = useLocation(); // Get location to read state messages
  const navigate = useNavigate(); // Although not used directly, often useful here

  const [fetchError, setFetchError] = useState(null);
  const [applications, setApplications] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(location.state?.message || null); // Get message from navigation state
  const [errorMessage, setErrorMessage] = useState(location.state?.error || null);

  // Clear message after a few seconds
  useEffect(() => {
    if (message || errorMessage) {
      const timer = setTimeout(() => {
        setMessage(null);
        setErrorMessage(null);
        // Optional: Clear the location state as well if desired
        // navigate(location.pathname, { replace: true, state: {} }); 
      }, 5000); // Display for 5 seconds
      return () => clearTimeout(timer);
    }
  }, [message, errorMessage, location.pathname, navigate]);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setFetchError(null); // Clear previous errors
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setFetchError('Could not fetch job applications');
        setApplications(null);
        console.error(error);
      } else {
        setApplications(data);
        setFetchError(null);
      }
      setLoading(false);
    };

    fetchApplications();
  }, []); // Fetch only on initial mount

  // Calculate Statistics
  const statistics = useMemo(() => {
    if (!applications) return null;

    const total = applications.length;
    const counts = {
      Applied: 0,
      Interviewing: 0,
      Offer: 0,
      Rejected: 0,
    };

    applications.forEach(app => {
      if (app.status in counts) {
        counts[app.status]++;
      }
    });

    return { total, counts };
  }, [applications]); // Recalculate only when applications change

  return (
    <div className="gallery-page-container">
      <h1>Application Gallery</h1>
      
      {/* Display Success/Error Messages */} 
      {message && <div className="alert alert-success">{message}</div>}
      {errorMessage && <div className="alert alert-error">{errorMessage}</div>}

      {/* Statistics Section */} 
      {statistics && statistics.total > 0 && (
        <section className="statistics-section">
          <h2>Summary</h2>
          <div className="stats-grid">
            <div className="stat-item"> 
                <span className="stat-value">{statistics.total}</span>
                <span className="stat-label">Total Applications</span>
            </div>
            {Object.entries(statistics.counts).map(([status, count]) => (
                <div className="stat-item" key={status}>
                    <span className={`stat-value status-${status.toLowerCase()}`}>{count}</span>
                    <span className="stat-label">{status}</span>
                </div>
            ))}
          </div>
        </section>
      )}

      {loading && <p className="center-text">Loading applications...</p>}
      {fetchError && <p className="error-text">{fetchError}</p>}
      {!loading && !fetchError && applications && applications.length === 0 && (
        <div className="center-text">
            <p>You haven't logged any applications yet!</p>
            <Link to="/create" className="create-link-button">
              Log your first one!
            </Link>
        </div>
      )}
      {applications && applications.length > 0 && (
        <div className="gallery-grid">
          {applications.map(app => (
            <JobApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryPage; 