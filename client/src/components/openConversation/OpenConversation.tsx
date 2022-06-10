import React, { useCallback, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useConversations } from '../../contexts/ConversationsContext';

const OpenConversation = ({ id }: { id: string }) => {
  const [text, setText] = useState<string>('');

  const setRef = useCallback((node: HTMLDivElement) => {
    if (node) {
      node.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, []);

  const { sendMessage, selectedConversation } = useConversations();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(selectedConversation.recipientIds, text);
    // clear the typing room.
    setText('');
  };

  return (
    <div className="d-flex flex-column flex-grow-1">
      <div className="flex-grow-1 overflow-auto">
        <div className="h-100 d-flex flex-column align-items-start justify-content-end px-3">
          {selectedConversation.messages.map((message, index) => {
            const lastMessage =
              selectedConversation.messages.length - 1 === index;

            return (
              <div
                ref={lastMessage ? setRef : null}
                key={index}
                className={`my-1 d-flex flex-column ${
                  message.sender === id ? 'align-self-end' : ''
                }`}
              >
                <div
                  className={`rounded px-2 py-1 ${
                    message.sender === id
                      ? 'bg-primary text-white'
                      : 'border'
                  }`}
                >
                  {message.text}
                </div>
                <div
                  className={`text-muted small ${
                    message.sender === id ? 'text-end' : ' '
                  }`}
                >
                  {message.sender === id ? 'You' : message.sender}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="m-2">
          <InputGroup>
            <Form.Control
              as="textarea"
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ height: '75px', resize: 'none' }}
            />
            <Button type="submit">Send</Button>
          </InputGroup>
        </Form.Group>
      </Form>
    </div>
  );
};

export default OpenConversation;
