"use client"

import type React from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

// --- Reusable Components ---

// Modal Component
export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100] p-4">
      <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:bg-gray-200 bg-gray-400 dark:hover:bg-gray-700 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer"
          aria-label="Close modal"
        >
          <span className="text-2xl leading-none">×</span>
        </button>
        <h3 className="text-xl font-semibold font-inter mb-4 text-center text-dark-gray dark:text-light-gray">
          {title}
        </h3>
        {children}
      </div>
    </div>
  )
}
