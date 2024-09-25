// components/ChatBot.js
import React, { useState } from 'react';
import { FaRobot, FaUser } from 'react-icons/fa';

const ChatBot = ({ books }) => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const greetings = [
    "Hello! I'm Libr-AI-nian, your virtual librarian. How can I help you today?",
    "Hi there! Looking for a book? Just ask me!",
    "Welcome! What book are you interested in today?",
  ];

  const noBooksFoundResponses = [
    "Sorry, I couldn't find any books matching your query. Could you try asking something else?",
    "Hmm, no matches found. Want to ask about a different book or author?",
    "I couldn't locate any books related to that. Try asking about another title or author!",
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    const userMessage = userInput;
    setChatHistory((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setUserInput('');
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      if (chatHistory.length === 0) {
        // If first message, send a greeting
        const greeting = greetings[Math.floor(Math.random() * greetings.length)];
        setChatHistory((prev) => [...prev, { sender: 'bot', text: greeting }]);
      } else {
        const matchingBooks = books.filter(book =>
          book.title.toLowerCase().includes(userMessage.toLowerCase()) ||
          book.author.toLowerCase().includes(userMessage.toLowerCase())
        );

        if (matchingBooks.length > 0) {
          const response = `Here are the books I found:`;
          setChatHistory((prev) => [...prev, { sender: 'bot', text: response }]);
          matchingBooks.forEach(book => {
            setChatHistory((prev) => [...prev, { sender: 'bot', text: `${book.title} by ${book.author}`, bookLink: book.amazonLink }]);
          });
          // Follow-up question
          setChatHistory((prev) => [...prev, { sender: 'bot', text: "Would you like to know more about another book?" }]);
        } else {
          const response = noBooksFoundResponses[Math.floor(Math.random() * noBooksFoundResponses.length)];
          setChatHistory((prev) => [...prev, { sender: 'bot', text: response }]);
        }
      }

      setIsTyping(false);
    }, 1000); // Simulate a delay for the bot response
  };

  const handleBookClick = (link) => {
    window.open(link, '_blank'); // Open the book link in a new tab
  };

  return (
    <section className="fixed bottom-5 right-5 chatbot-container p-6 max-w-sm w-full shadow-lg rounded-xl">
      <h2 className="text-2xl font-extrabold mb-4">Libr-AI-nian</h2>
      <div className="chat-area mb-4 h-80 overflow-y-auto rounded-lg p-4">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`mb-2 p-2 rounded-lg ${msg.sender === 'bot' ? 'bot-message' : 'user-message'} flex items-center`}>
            {msg.sender === 'bot' ? <FaRobot className="mr-2" /> : <FaUser className="mr-2" />}
            <span>{msg.text}</span>
            {msg.bookLink && (
              <button
                onClick={() => handleBookClick(msg.bookLink)}
                className="ml-2 px-2 py-1 button hover:bg-blue-500 rounded transition-colors"
              >
                Buy Here
              </button>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center mb-2 p-2 rounded-lg bg-neutral-600 text-white">
            <FaRobot className="mr-2" />
            <span>Typing...</span>
          </div>
        )}
      </div>
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          placeholder="Ask about a book..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="flex-grow px-3 py-2 rounded-lg bg-neutral-700 text-base focus:outline-none focus:ring focus:ring-blue-300 transition-all"
        />
        <button type="submit" className="button px-4 py-2 rounded-lg text-base hover:bg-blue-500 transition-colors">
          Send
        </button>
      </form>
    </section>
  );
};

export default ChatBot;
