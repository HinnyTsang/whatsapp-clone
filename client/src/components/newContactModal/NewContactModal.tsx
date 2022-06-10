import React, { useRef } from 'react';
import { MutableRefObject } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useContacts } from '../../contexts/ContactsContext';

interface Props {
  closeModal: () => void;
}

const NewContactModal = ({ closeModal }: Props) => {
  const idRef = useRef() as MutableRefObject<HTMLInputElement>;
  const nameRef = useRef() as MutableRefObject<HTMLInputElement>;
  const { createContact } = useContacts();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (
    event: React.MouseEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    createContact(
      (idRef.current as HTMLInputElement).value,
      (nameRef.current as HTMLInputElement).value
    );

    closeModal();
  };

  return (
    <>
      <Modal.Header closeButton>Create Contact</Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Id</Form.Label>
            <Form.Control
              type="text"
              ref={idRef}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              ref={nameRef}
              required
            ></Form.Control>
          </Form.Group>
          <Button type="submit">Create</Button>
        </Form>
      </Modal.Body>
    </>
  );
};

export default NewContactModal;
