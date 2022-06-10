import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useLocalStorage } from '../hooks';
import { useContacts } from './ContactsContext';
import { useSocket, SendMessageInterface } from './SocketProvider';

/**
 * types
 */
export type RecipientId = string;

export type RecipientIds = Array<RecipientId>;

export type ConversationsType = Array<ConversationInterface>;

/**
 * interfaces.
 */

export interface MessageInterface {
  sender: string;
  text: string;
  fromMe: boolean;
}

interface MessageAddInterface {
  sender: string;
  text: string;
  recipientIds: RecipientIds;
}

export interface ConversationInterface {
  selected: boolean;
  recipientIds: RecipientIds;
  messages: Array<MessageInterface>;
}

export interface ConversationsInterface {
  conversations: ConversationsType;
  selectedConversationIndex: (index: number) => void;
  selectedConversation: ConversationInterface;
  createConversation: (recipients: RecipientIds) => void;
  sendMessage: (recipientIds: RecipientIds, text: string) => void;
}

interface ConversationProviderProps {
  id: string;
  children: React.ReactNode;
}

/**
 * 1. The Context
 * The Context for the contacts imformation.
 */
export const ConversationContext =
  createContext<ConversationsInterface>({} as ConversationsInterface);

/**
 * 2. Hook to use the Context
 */
export const useConversations = () => {
  return useContext<ConversationsInterface>(ConversationContext);
};

/**
 * 3. Wrapper.
 * @param param0
 * @returns
 */
export const ConversationProvider = ({
  id,
  children,
}: ConversationProviderProps) => {
  // storing all conversations value
  const [conversations, setConversations] =
    useLocalStorage<ConversationsType>('conversations', []);

  // storing the selected index
  const [selectedConversationIndex, setSelectedConversationIndex] =
    useState<number>(0);

  // read the contact book
  const { contacts } = useContacts();

  // use the Socket
  const socket = useSocket();

  // append a new convrsation to the end of the conversation array
  const createConversation = (recipients: RecipientIds) => {
    setConversations((prevConversations: ConversationsType) => {
      return [
        ...prevConversations,
        { selected: true, recipientIds: recipients, messages: [] },
      ];
    });
  };

  /**
   * Function to add message to the conversation.
   * @param recipients
   * @param text
   * @param sender
   */
  const addMessageToConversation = useCallback(
    ({ recipientIds, text, sender }: MessageAddInterface) => {
      setConversations((prevConversations: ConversationsType) => {
        // determine if any conversation in the stroage change.
        // if no, create a new conversation
        let madeChange = false;

        // class for the new message.
        const newMessage: MessageInterface = {
          sender,
          text,
          fromMe: true,
        };

        // determine if the recipients & messages identical,
        // if yes, modify the conversation and set madChange = true
        const newConversations = prevConversations.map(
          (conversation) => {
            if (
              arrayEquality(conversation.recipientIds, recipientIds)
            ) {
              madeChange = true;
              return {
                ...conversation,
                messages: [...conversation.messages, newMessage],
              };
            }
            return conversation;
          }
        );

        if (madeChange) {
          return newConversations;
        } else {
          return [
            ...prevConversations,
            {
              recipientIds,
              messages: [newMessage],
            },
          ];
        }
      });
    },
    [setConversations]
  );

  /**
   * Use effect to check rather message received.
   */
  useEffect(() => {
    if (socket === null) return;

    socket.on('receive-message', addMessageToConversation);
    console.log('receive-message');
    return () => {
      socket.off('receive-message');
    };
  }, [socket, addMessageToConversation]);

  const sendMessage = (recipientIds: RecipientIds, text: string) => {
    console.log('send-message to', recipientIds, text, 'from', id);
    socket.emit('send-message', {
      recipientIds,
      text,
    });
    addMessageToConversation({ recipientIds, text, sender: id });
  };

  const formattedConversations = conversations.map(
    (conversation, index) => {
      // format recipients
      console.log('converssation is', conversation);
      const recipients = conversation.recipientIds.map(
        (recipientId) => {
          // find if the recipientId in the contact.
          const contact = contacts.find((contact) => {
            return contact.id === recipientId;
          });

          // if added to contact, use the name in contact, otherwise use the id.
          const name = (contact && contact.name) || recipientId;

          return { id: recipientId, name };
        }
      );

      // format messages.
      const messages = conversation.messages.map((message) => {
        const sender = contacts.find((contact) => {
          return contact.id === message.sender;
        });
        // find if the sender in the contact.
        const name = (sender && sender.name) || message.sender;
        const fromMe = id === message.sender;

        return { ...message, sender: name, fromMe: fromMe };
      });

      const selected = index === selectedConversationIndex;
      return { ...conversation, recipients, selected, messages };
    }
  );

  const value: ConversationsInterface = {
    conversations: formattedConversations,
    selectedConversation:
      formattedConversations[selectedConversationIndex],
    selectedConversationIndex: setSelectedConversationIndex,
    createConversation: createConversation,
    sendMessage: sendMessage,
  };
  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};

/**
 * Compare if the two array is identical
 * @param a Array with type T
 * @param b Array with type T
 * @returns True if two arrays equal
 */
const arrayEquality = <T,>(a: Array<T>, b: Array<T>): boolean => {
  if (a.length !== b.length) return false;

  a.sort();
  b.sort();

  return a.every((item: T, index: number) => {
    return item === b[index];
  });
};
