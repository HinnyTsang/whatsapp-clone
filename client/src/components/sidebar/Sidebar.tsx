import { useState } from 'react';
import { Tab, Nav, Button, Modal } from 'react-bootstrap';
import {
  Contacts,
  Conversations,
  NewContactModal,
  NewConversationModal,
} from '..';

const CONVERSATIONS_KEY: string = 'conversations';
const CONTACTS_KEY: string = 'contacts';

const Sidebar = ({ id }: { id: string }) => {
  const [activeKey, setActiveKey] = useState(CONVERSATIONS_KEY);
  const [modalOpen, setModalOpen] = useState(false);
  const conversationsOpen = activeKey === CONVERSATIONS_KEY;

  const closeModal = () => {
    setModalOpen(false);
  };
  return (
    <div style={{ width: '250px' }} className="d-flex flex-column">
      <Tab.Container
        activeKey={activeKey}
        onSelect={(eventKey, e) => eventKey && setActiveKey(eventKey)}
      >
        <Nav variant="tabs" className="justify-content-center">
          <Nav.Item>
            <Nav.Link eventKey={CONVERSATIONS_KEY}>
              Conversations
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={CONTACTS_KEY}>Contacts</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content className="border border-top-0 border-bottom-0 border-left-0 overflow-auto flex-grow-1">
          <Tab.Pane eventKey={CONVERSATIONS_KEY}>
            <Conversations />
          </Tab.Pane>
          <Tab.Pane eventKey={CONTACTS_KEY}>
            <Contacts />
          </Tab.Pane>
        </Tab.Content>
        <div className="p-2 border border-bottom-0 border-left-0 small w-100">
          Your id: <span className="text-muted">{id}</span>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="rounded-0"
        >
          New {conversationsOpen ? 'Conversation' : 'Contact'}
        </Button>
      </Tab.Container>
      <Modal show={modalOpen}>
        {conversationsOpen ? (
          <NewConversationModal closeModal={closeModal} />
        ) : (
          <NewContactModal closeModal={closeModal} />
        )}
      </Modal>
    </div>
  );
};

export default Sidebar;
