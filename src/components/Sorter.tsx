import { useEffect, useRef, useState } from "react";
import { SORT_BY, type Sorter } from "../types"
import iconSort from "../assets/icon-sort.svg";

type SorterProps = {
  sorter: Sorter,
  setSorter: React.Dispatch<React.SetStateAction<Sorter>>,
  disabled?: boolean
}

export default function Sorter({ sorter, setSorter, disabled = false }: SorterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
  <>
    <img
      className="w-8 inline-block select-none invert"
      title={disabled ? "Sorting disabled while filtering by search" : sorter.isDESC ? "Descending" : "Ascending"}
      src={iconSort}
      style={{
        transform: sorter.isDESC ? "scaleY(-1)" : "scaleY(1)",
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onClick={() => {
        if (disabled) {
          return;
        }
        setSorter(prev => ({ ...prev, isDESC: !prev.isDESC }));
      }}
    />
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        className="px-4 py-2 bg-gray-700 text-gray-100 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        type="button"
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
          }
        }}
        disabled={disabled}
      >
        {sorter.sortBy}
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && !disabled && (
        <ul className="absolute top-full mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg min-w-full z-10">
          {Object.values(SORT_BY).map(sortBy => (
            <li key={sortBy}>
              <button
                className="w-full text-left px-4 py-2 text-gray-100 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
                onClick={() => {
                  if (!disabled) {
                    setSorter(prev => ({ ...prev, sortBy: sortBy }));
                    setIsOpen(false);
                  }
                }}
                disabled={disabled}
              >
                {sortBy}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  </>
  )
}