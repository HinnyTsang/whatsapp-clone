import React from 'react';
import { OpenConversation, Sidebar } from '..';
import { useConversations } from '../../contexts/ConversationsContext';

const Dashboard = ({ id }: { id: string }) => {
  const { selectedConversation } = useConversations();

  return (
    <div className="d-flex" style={{ height: '100vh' }}>
      <Sidebar id={id} />
      {selectedConversation && <OpenConversation id={id} />}
    </div>
  );
};

export default Dashboard;
