import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks';

/**
 * Interfaces
 */
export interface ContactInterface {
  id: string;
  name: string;
}
export interface ContactsInterface {
  contacts: ContactsType;
  createContact: (id: string, name: string) => void;
}
export interface ContactsProviderProps {
  children: React.ReactNode;
}

export type ContactsType = Array<ContactInterface>;

/**
 * 1. The Context
 * The Context for the contacts imformation.
 */
export const ContactsContext = createContext<ContactsInterface>(
  {} as ContactsInterface
);

/**
 * 2. Use the Context
 * Hooks to use the contact's context.
 */
export const useContacts = () => {
  return useContext<ContactsInterface>(ContactsContext);
};

/**
 * 3. Provider of the Context
 * Context provider to wrap on the app.
 */

export const ContactsProvider = ({
  children,
}: ContactsProviderProps) => {
  const [contacts, setContacts] = useLocalStorage<ContactsType>(
    'contacts',
    [] as ContactsType
  );

  const createContact: ContactsInterface['createContact'] = (
    id,
    name
  ) => {
    // add new items to the contacts.
    setContacts((contact: ContactsType) => [
      ...contact,
      { id, name },
    ]);
  };

  // data to be propagate.
  const value: ContactsInterface = {
    contacts,
    createContact,
  };

  return (
    <ContactsContext.Provider value={value}>
      {children}
    </ContactsContext.Provider>
  );
};
