import { useState } from 'react';
import { loadConcept } from './skos';
import './OpenConcept.css';

export function OpenConcept() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');

  function handleSubmit() {
    const cleaned = input.replace('.json', '');
    loadConcept(cleaned).catch(console.error);
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
      <span className="open-concept">
        <button onClick={() => setIsOpen(true)}>Open concept</button>
      </span>
    );
  }

  return (
    <span className="open-concept">
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