import React, { useEffect } from 'react';

export default function Toast({ message, onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed bottom-6 right-6 bg-indigo-600 text-white px-6 py-4 rounded-lg shadow-lg animate-fadeIn">
      {message}
    </div>
  );
}