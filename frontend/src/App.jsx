import { useState, useEffect } from "react";
import ContactList from "./ContactList";
import "./App.css";
import ContactForm from "./ContactForm";
import EmailModal from "./EmailModal";

function App() {
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState({});
  const [selectedContacts, setSelectedContacts] = useState([]);

  useEffect(() => {
    fetchContacts()
  }, []);

  const fetchContacts = async () => {
    const response = await fetch("http://127.0.0.1:5000/contacts");
    const data = await response.json();
    setContacts(data.contacts);
  };

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentContact({})
  }

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true)
  }

  const openEditModal = (contact) => {
    if (isModalOpen) return
    setCurrentContact(contact)
    setIsModalOpen(true)
  }

  const onUpdate = () => {
    closeModal()
    fetchContacts()
  }
  
  const handleSelection = (selected) => {
    setSelectedContacts(selected);
  };

  const openEmailModal = () => {
    if (selectedContacts.length > 0) setIsEmailModalOpen(true);
  };

  const closeEmailModal = () => {
    setIsEmailModalOpen(false);
  };

  return (
    <>
      <ContactList
        contacts={contacts}
        updateContact={openEditModal}
        updateCallback={onUpdate}
        handleSelection={handleSelection}
      />
      <button className="button create-button" onClick={openCreateModal}>
        Create New Contact
      </button>
      <button className="button email-button" onClick={openEmailModal}>
        Send Email
      </button>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <ContactForm existingContact={currentContact} updateCallback={onUpdate} />
          </div>
        </div>
      )}
      {isEmailModalOpen && (
        <EmailModal
          selectedContacts={contacts.filter(contact => selectedContacts.includes(contact.id))}
          closeEmailModal={closeEmailModal}
        />
      )}
    </>
  );
}

export default App;