import { useState } from 'react';
import { loadObjectCard } from './CardSlice.ts';
import './OpenResource.css';

export function OpenResource() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');

  function handleSubmit() {
    const cleaned = input.replace('.json', '');
    loadObjectCard(cleaned).catch(console.error);
    setIsOpen(false);
    setInput('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSubmit();
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }

  if (!isOpen) {
    return (
      <span className="open-resource">
        <button onClick={() => setIsOpen(true)}>Open resource</button>
      </span>
    );
  }

  return (
    <span className="open-resource">
      <input
        placeholder="Enter ID uri or json url..."
        autoFocus
        onBlur={() => setIsOpen(false)}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSubmit}>Go</button>
    </span>
  );
}