import React from 'react';
import { X } from 'lucide-react';

interface CancelButtonProps {
  onClick: () => void;
  visible: boolean;
}

export const CancelButton: React.FC<CancelButtonProps> = ({ onClick, visible }) => {
  if (!visible) return null;

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded hover:bg-red-600 transition-colors border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
      aria-label="Cancel AI request"
    >
      <X className="w-3 h-3" />
      Cancel
    </button>
  );
};
