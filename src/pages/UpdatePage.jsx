import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../config/supabaseClient.js';
import './UpdatePage.css'; // Import the CSS

const UpdatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [applicationDate, setApplicationDate] = useState('');
  const [status, setStatus] = useState(''); // Don't default status here, fetch it
  const [jobType, setJobType] = useState(''); // Add state
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  
  const [formError, setFormError] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true);
      setFetchError(null); // Reset fetch error on new fetch
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        setFetchError('Could not fetch the application data.');
        console.error(error);
        // Optionally navigate if not found
        if (error.code === 'PGRST116') { // Code for no rows found
            navigate('/gallery', { replace: true, state: { error: "Application not found." } });
        }
      } else {
        // Populate form state
        setCompanyName(data.company_name);
        setPosition(data.position);
        // Format date for input type="date" (YYYY-MM-DD)
        const formattedDate = data.application_date ? data.application_date.split('T')[0] : '';
        setApplicationDate(formattedDate);
        setStatus(data.status);
        setJobType(data.job_type || ''); // Populate jobType
        setUrl(data.url || ''); // Handle null URL
        setNotes(data.notes || ''); // Handle null notes
        setFetchError(null);
      }
      setLoading(false);
    };

    fetchApplication();
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!companyName || !position || !status) {
      setFormError('Please fill in Company Name, Position, and Status.');
      return;
    }

    const { data, error } = await supabase
      .from('job_applications')
      .update({ 
        company_name: companyName, 
        position, 
        application_date: applicationDate || null, 
        status, 
        job_type: jobType || null, // Add job_type to update
        url: url || null, 
        notes: notes || null
      })
      .eq('id', id) // Specify which row to update
      .select(); // Get the updated row back

    if (error) {
      console.error('Error updating data:', error);
      setFormError(`Error updating application: ${error.message}`);
    } else {
      console.log('Data updated:', data);
      setFormError(null);
      // Navigate back to the details page for this application
      navigate(`/details/${id}`, { state: { message: "Application updated successfully!" } }); 
    }
  };

  const handleDelete = async () => {
    // Confirmation dialog
    if (window.confirm('Are you sure you want to delete this application entry?')) {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id); // Specify which row to delete

      if (error) {
        console.error('Error deleting data:', error);
        setFormError(`Error deleting application: ${error.message}`);
      } else {
        setFormError(null);
        console.log('Application deleted successfully');
        // Navigate back to the gallery page after deletion
        navigate('/gallery', { state: { message: "Application deleted." } }); 
      }
    }
  };

  if (loading) return <p className="center-text">Loading application data...</p>;
  // Display fetch error prominently if it occurs during loading
  if (fetchError) return <p className="error-text">{fetchError}</p>;

  return (
    <div className="update-page-container">
      {/* Use the same form structure as CreatePage but with different class and handler */} 
      <form onSubmit={handleUpdate} className="update-form create-form"> 
        <h1>Update Application</h1>
        {/* Display current info briefly? Optional */}
        {/* <p>Current Info: {initialData...} </p> */}

        <label htmlFor="companyName">Company Name:*</label>
        <input
          type="text"
          id="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />

        <label htmlFor="position">Position:*</label>
        <input
          type="text"
          id="position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />

        <label htmlFor="applicationDate">Application Date:</label>
        <input
          type="date"
          id="applicationDate"
          value={applicationDate}
          onChange={(e) => setApplicationDate(e.target.value)}
        />

        {/* Job Type Dropdown */}
        <label htmlFor="jobType">Job Type:</label>
        <select 
            id="jobType"
            value={jobType} 
            onChange={(e) => setJobType(e.target.value)}
        >
            {/* Keep placeholder optional here maybe? */}
            {/* <option value="" disabled>Select a type...</option> */}
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
            <option value="Temporary">Temporary</option>
            <option value="Volunteer">Volunteer</option>
            <option value="Other">Other</option>
            {/* Handle case where existing value might be null/empty */}
            {jobType === '' && <option value="" disabled>Select a type...</option>} 
        </select>

        <label>Status:*</label>
        <div className="radio-group">
          {['Applied', 'Interviewing', 'Offer', 'Rejected'].map((s) => (
            <label key={s} className="radio-label">
              <input 
                type="radio" 
                name="status" 
                value={s} 
                checked={status === s}
                onChange={(e) => setStatus(e.target.value)} 
              />
              {s}
            </label>
          ))}
        </div>

        <label htmlFor="url">Job Posting URL:</label>
        <input
          type="url"
          id="url"
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <label htmlFor="notes">Notes:</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        
        {/* Display form errors within the form, above actions */}
        {formError && <p className="form-error">{formError}</p>}

        <div className="update-actions">
          <button type="submit" className="update-button">Update Application</button>
          <button type="button" onClick={handleDelete} className="delete-button">Delete Application</button>
        </div>

      </form>
    </div>
  );
};

export default UpdatePage; 