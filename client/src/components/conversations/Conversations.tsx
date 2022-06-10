import React from 'react';
import { ListGroup } from 'react-bootstrap';
import {
  RecipientId,
  useConversations,
} from '../../contexts/ConversationsContext';

const Conversations = () => {
  const { conversations, selectedConversationIndex } =
    useConversations();
  return (
    <ListGroup variant="flush">
      {conversations.map((conversation, index) => (
        <ListGroup.Item
          key={index}
          action
          onClick={() => selectedConversationIndex(index)}
          active={conversation.selected}
        >
          {conversation.recipientIds
            .map((recipientId: RecipientId) => recipientId)
            .join(' ')}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default Conversations;
