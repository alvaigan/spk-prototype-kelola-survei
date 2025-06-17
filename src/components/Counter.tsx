'use client'

import { useCounterStore } from '@/store/counterStore'

export default function Counter() {
  const { count, increment, decrement, reset } = useCounterStore()

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800">Counter Example</h2>
      <div className="text-4xl font-mono text-blue-600">{count}</div>
      <div className="flex gap-2">
        <button
          onClick={increment}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          +
        </button>
        <button
          onClick={decrement}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          -
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  )
} 