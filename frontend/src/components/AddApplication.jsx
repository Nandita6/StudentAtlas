import { useState } from 'react';
import './AddApplication.css';

// Add seven calendar days to a date from the form.
function getFollowUpDate(applicationDate) {
  if (!applicationDate) return '';

  const date = new Date(applicationDate + 'T00:00:00Z');
  if (Number.isNaN(date.getTime())) return '';
  date.setUTCDate(date.getUTCDate() + 7);
  return date.toISOString().slice(0, 10);
}

function AddApplication({ onAddApplication }) {
  const [applicationData, setapplicationData] = useState({
    company: '',
    position: '',
    applicationDate: '',
    deadline: '',
    followUpDate: '',
    status: '',
    notes: '',
  });

  const [message, setMessage] = useState('');
  const [hasError, setHasError] = useState(false);
  const [saving, setSaving] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setMessage('');
    setHasError(false);

    setapplicationData((previous) => {
      const updated = { ...previous, [name]: value };

      if (name === 'applicationDate') {
        updated.followUpDate = getFollowUpDate(value);
      }

      return updated;
    });
  }

  async function saveApplication(event) {
    event.preventDefault();
    if (saving) return;
    setMessage('');
    setHasError(false);

    const { company, position, applicationDate, status } = applicationData;

    if (!company.trim() || !position.trim() || !applicationDate || !status) {
      setHasError(true);
      setMessage('Application not saved. Please fill in Company Name, Position, Application Date and Current Status.');
      return;
    }

    setSaving(true);

    try {
      await onAddApplication({
        ...applicationData,
        company: company.trim(),
        position: position.trim(),
        notes: applicationData.notes.trim(),
        deadline: applicationData.deadline || null,
        followUpDate: applicationData.followUpDate || getFollowUpDate(applicationDate),
      });

      setMessage('Application saved successfully!');

      setapplicationData({
        company: '',
        position: '',
        applicationDate: '',
        deadline: '',
        followUpDate: '',
        status: '',
        notes: '',
      });
    } catch (error) {
      setHasError(true);
      setMessage('Application not saved. ' + (error.message || 'Please try again.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="add-application" id="applications">
      <div className="add-application-box">
        <h2>Add Application</h2>

        <p className="form-description">
          Add a job/internship application to your StudentAtlas tracker.
        </p>

        <form onSubmit={saveApplication} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="company">Company Name</label>
              <input
                id="company"
                name="company"
                type="text"
                value={applicationData.company}
                onChange={updateField}
                placeholder="Enter Company Name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="position">Position</label>
              <input
                id="position"
                name="position"
                type="text"
                value={applicationData.position}
                onChange={updateField}
                placeholder="Enter Position"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="applicationDate">Application Date</label>
              <input
                id="applicationDate"
                name="applicationDate"
                type="date"
                value={applicationData.applicationDate}
                onChange={updateField}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Current Status</label>
              <select
                id="status"
                name="status"
                data-status={applicationData.status}
                value={applicationData.status}
                onChange={updateField}
                required
              >
                <option value="" disabled>
                  Select a status
                </option>
                <option value="Saved">Saved</option>
                <option value="Applied">Applied</option>
                <option value="Under Review">Under Review</option>
                <option value="Interview">Interview</option>
                <option value="Assessment">Assessment</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="deadline">Deadline (optional)</label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                value={applicationData.deadline}
                onChange={updateField}
              />
            </div>

            <div className="form-group">
              <label htmlFor="followUpDate">Follow-up Date</label>
              <input
                id="followUpDate"
                name="followUpDate"
                type="date"
                value={applicationData.followUpDate}
                onChange={updateField}
              />
              <small>Automatically set to 7 days after applying.</small>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={applicationData.notes}
              onChange={updateField}
              placeholder="Enter Important Details"
              rows="4"
            />
          </div>

          <button className="save-button" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Application"}
          </button>

          {message && <p className={hasError ? "error-message" : "success-message"} role={hasError ? "alert" : "status"}>{message}</p>}
        </form>
      </div>
    </section>
  );
}

export default AddApplication;
