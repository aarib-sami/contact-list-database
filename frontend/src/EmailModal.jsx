import React, { useState, useEffect, useRef } from "react";
import "./EmailModal.css"; // Ensure this path is correct

function EmailModal({ selectedContacts, closeEmailModal }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const modalRef = useRef(null);

  const handleSendEmail = async () => {
    if (!subject.trim() || !body.trim()) {
      setError("Subject and body are required.");
      return;
    }

    const emailData = {
      subject,
      body,
      recipients: selectedContacts.map(contact => contact.email)
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        throw new Error("Failed to send email.");
      }

      setSuccess("Email sent successfully!");
      setError(null);
      setSubject("");
      setBody("");
      closeEmailModal();
      alert("Email sent!")

    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeEmailModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeEmailModal]);

  return (
    <div className="modal" role="dialog" aria-labelledby="email-modal-title" aria-hidden="true">
      <div className="modal-content" ref={modalRef}>
        <span className="close" role="button" aria-label="Close" onClick={closeEmailModal}>
          &times;
        </span>
        <h2 id="email-modal-title">Send Email</h2>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label htmlFor="body">Body:</label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="textarea-field"
            />
          </div>
          <div>
            <h3>Recipients:</h3>
            <ul>
              {selectedContacts.map(contact => (
                <li key={contact.id}>
                  {contact.name ? contact.name : contact.email}
                </li>
              ))}
            </ul>
          </div>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <button className="button send-button" onClick={handleSendEmail}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmailModal;
