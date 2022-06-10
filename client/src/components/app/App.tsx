import React from 'react';
import { useLocalStorage } from '../../hooks';
import { Dashboard, Login } from '..';
import './App.css';
import { ContactsProvider } from '../../contexts/ContactsContext';
import { ConversationProvider } from '../../contexts/ConversationsContext';
import { SocketProvider } from '../../contexts/SocketProvider';

function App() {
  const [id, setId] = useLocalStorage<string>(
    null as unknown as string,
    null as unknown as string
  );

  return (
    <>
      {id ? (
        <SocketProvider id={id}>
          <ContactsProvider>
            <ConversationProvider id={id}>
              <Dashboard id={id} />
            </ConversationProvider>
          </ContactsProvider>
        </SocketProvider>
      ) : (
        <Login onIdSubmit={setId} />
      )}
    </>
  );
}

export default App;
