import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/supabaseClient'; // Adjust path if needed
import './CreatePage.css'; // Import the CSS file

const CreatePage = () => {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [applicationDate, setApplicationDate] = useState('');
  const [status, setStatus] = useState('Applied'); // Default status
  const [jobType, setJobType] = useState(''); // Add state for job type
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!companyName || !position || !status) {
      setFormError('Please fill in Company Name, Position, and Status.');
      return;
    }

    const { data, error } = await supabase
      .from('job_applications')
      .insert([{ 
        company_name: companyName, 
        position, 
        application_date: applicationDate || null, // Handle empty date
        status, 
        job_type: jobType || null, // Add job_type to insert
        url: url || null,              // Handle empty URL
        notes: notes || null             // Handle empty notes
      }])
      .select(); // .select() returns the inserted data if needed, also helps confirm success

    if (error) {
      console.error('Error inserting data:', error);
      setFormError(`Error submitting application: ${error.message}`);
    }
    if (data) {
      console.log('Data inserted:', data);
      setFormError(null);
      // Clear form fields (optional)
      setCompanyName('');
      setPosition('');
      setApplicationDate('');
      setStatus('Applied');
      setJobType(''); // Clear job type
      setUrl('');
      setNotes('');
      // Navigate to gallery page
      navigate('/gallery', { state: { message: "Application logged successfully!" } }); 
    }
  };

  return (
    <div className="create-page-container">
      <h1>Log a New Application</h1>
      <form onSubmit={handleSubmit} className="create-form">
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

        <label htmlFor="jobType">Job Type:</label>
        <select 
            id="jobType"
            value={jobType} 
            onChange={(e) => setJobType(e.target.value)}
        >
            <option value="" disabled>Select a type...</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
            <option value="Temporary">Temporary</option>
            <option value="Volunteer">Volunteer</option>
            <option value="Other">Other</option>
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

        <button type="submit">Add Application</button>

        {formError && <p className="form-error">{formError}</p>}
      </form>
    </div>
  );
};

export default CreatePage; 