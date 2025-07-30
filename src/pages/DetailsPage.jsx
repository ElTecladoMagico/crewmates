import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import supabase from '../config/supabaseClient';
import './DetailsPage.css'; // Import the CSS

const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        setFetchError('Could not fetch the job application');
        setApplication(null);
        console.error(error);
      } else {
        setApplication(data);
        setFetchError(null);
      }
      setLoading(false);
    };

    fetchApplication();
  }, [id]); // Removed navigate from deps unless needed for error handling

  if (loading) return <p className="center-text">Loading application details...</p>;
  if (fetchError) return <p className="error-text">{fetchError}</p>;
  if (!application) return <p className="center-text">Application not found.</p>;

  // Helper function to format date nicely, handles null/invalid dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString(undefined, { 
          year: 'numeric', month: 'long', day: 'numeric' 
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return 'Invalid Date';
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'applied': return 'status-applied';
      case 'interviewing': return 'status-interviewing';
      case 'offer': return 'status-offer';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  };

  return (
    <div className="details-page-container">
      <div className="details-content">
        <h1>{application.company_name} - {application.position}</h1>
        
        {application.job_type && (
             <div className="detail-item">
                 <span className="label">Type:</span> 
                 <span>{application.job_type}</span>
             </div>
        )}

        <div className="detail-item">
            <span className="label">Status:</span> 
            <span className={`status-badge ${getStatusClass(application.status)}`}>
               {application.status || 'N/A'}
            </span>
        </div>

        <div className="detail-item">
            <span className="label">Applied On:</span> 
            <span>{formatDate(application.application_date)}</span> 
        </div>

        {application.url && (
            <div className="detail-item">
                <span className="label">Posting URL:</span> 
                <a href={application.url} target="_blank" rel="noopener noreferrer">{application.url}</a>
            </div>
        )}

        {application.notes && (
          <div className="detail-item notes-section">
            <span className="label">Notes:</span>
            <div className="notes-content">{application.notes}</div>
          </div>
        )}

        <div className="details-actions">
            <Link to={`/update/${application.id}`} className="edit-details-button">Edit Application</Link>
        </div>

      </div>
    </div>
  );
};

export default DetailsPage; 