import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useContacts } from '../../contexts/ContactsContext';
import { useConversations } from '../../contexts/ConversationsContext';

interface Props {
  closeModal: () => void;
}

const NewConversationModal = ({ closeModal }: Props) => {
  const { contacts } = useContacts();
  const { createConversation } = useConversations();

  const [selectedContactIds, setSelectedContactIds] = useState<
    Array<string>
  >([]);

  const handleCheckboxChange = (contactId: string) => {
    setSelectedContactIds((prevContactId: Array<string>) =>
      prevContactId.includes(contactId)
        ? prevContactId.filter((prevId: string) => {
            return contactId !== prevId;
          })
        : [...prevContactId, contactId]
    );
  };

  const handleSubmit: React.FormEventHandler = (
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    createConversation(selectedContactIds);
    closeModal();
  };

  return (
    <>
      <Modal.Header closeButton>Create Conversation</Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {contacts.map((contact) => (
            <Form.Group controlId={contact.id} key={contact.id}>
              <Form.Check
                type="checkbox"
                value={
                  selectedContactIds.includes(contact.id) ? 'T' : 'F'
                }
                label={contact.name}
                onChange={() => handleCheckboxChange(contact.id)}
              ></Form.Check>
            </Form.Group>
          ))}
          <Button type="submit">Create</Button>
        </Form>
      </Modal.Body>
    </>
  );
};

export default NewConversationModal;
