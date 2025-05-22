"use client"

interface NumericKeypadProps {
  onKeyPress: (key: string) => void
}

export function NumericKeypad({ onKeyPress }: NumericKeypadProps) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "backspace"]

  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      {keys.map((key, index) => (
        <button
          key={index}
          type="button"
          className={`h-16 rounded-full flex items-center justify-center text-xl font-medium ${
            key ? "bg-gray-200 text-black hover:bg-gray-300" : "cursor-default bg-transparent"
          }`}
          onClick={() => key && onKeyPress(key)}
          disabled={!key}
        >
          {key === "backspace" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
              <line x1="18" y1="9" x2="12" y2="15" />
              <line x1="12" y1="9" x2="18" y2="15" />
            </svg>
          ) : (
            key
          )}
        </button>
      ))}
    </div>
  )
}
