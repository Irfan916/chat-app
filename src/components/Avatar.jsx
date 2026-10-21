import { useState, useEffect } from 'react';

export default function Avatar({ src, name, size = "w-10 h-10" }) {
  const [hasError, setHasError] = useState(false);

  // If the image URL changes (e.g., a new message from a different user), reset the error state
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasError(false);
  }, [src]);

  // If there's an error OR no src, show initials
  if (hasError || !src) {
    const initials = name
      ? name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
      : '?';

    return (
      <div className={`${size} rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0`}>
        {initials}
      </div>
    );
  }

  // Otherwise, show the image
  return (
    <img
      src={src}
      alt={name}
      onError={() => setHasError(true)} // If the image fails, trigger the fallback
      className={`${size} rounded-full object-cover shrink-0 bg-slate-700`}
    />
  );
}