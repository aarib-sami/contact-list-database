// ContactList.jsx
import React, { useState } from "react";
import "./App.css"; // Ensure this path is correct

const ContactList = ({ contacts, updateContact, updateCallback, handleSelection }) => {
  const [selectedContacts, setSelectedContacts] = useState([]);

  const onDelete = async (id) => {
    try {
      const options = {
        method: "DELETE"
      };
      const response = await fetch(`http://127.0.0.1:5000/delete_contact/${id}`, options);
      if (response.status === 200) {
        updateCallback();
      } else {
        console.error("Failed to delete");
      }
    } catch (error) {
      alert(error);
    }
  };

  const handleCheckboxChange = (contactId, isChecked) => {
    let updatedSelectedContacts;
    if (isChecked) {
      updatedSelectedContacts = [...selectedContacts, contactId];
    } else {
      updatedSelectedContacts = selectedContacts.filter(id => id !== contactId);
    }
    setSelectedContacts(updatedSelectedContacts);
    handleSelection(updatedSelectedContacts);
  };

  return (
    <div className="contact-list">
      <h2>Contacts</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Send To</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td>
                <input
                  type="checkbox"
                  className="checkbox" // Apply the CSS class
                  checked={selectedContacts.includes(contact.id)}
                  onChange={(e) => handleCheckboxChange(contact.id, e.target.checked)}
                />
              </td>
              <td>{contact.firstName}</td>
              <td>{contact.lastName}</td>
              <td>{contact.email}</td>
              <td>
                <button className="button update-button" onClick={() => updateContact(contact)}>Update</button>
                <button className="button delete-button" onClick={() => onDelete(contact.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactList;
