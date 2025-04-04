/**
 * DeleteConfirmationModal Component
 * 
 * This component displays a modal dialog to confirm deletion of a layout.
 * 
 * @module DeleteConfirmationModal
 */
import React from 'react';

/**
 * Props for the DeleteConfirmationModal component
 */
interface DeleteConfirmationModalProps {
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

/**
 * DeleteConfirmationModal component displays a confirmation dialog for deleting a layout
 * 
 * @param {DeleteConfirmationModalProps} props - The component props
 * @returns {JSX.Element} The rendered DeleteConfirmationModal component
 */
const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  onConfirm,
  onCancel
}) => {
  return (
    <div 
      id="delete-modal-overlay" 
      data-testid="delete-modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div 
        id="delete-modal-container" 
        data-testid="delete-modal-container"
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full"
      >
        {/* Modal title */}
        <h3 
          id="delete-modal-title"
          data-testid="delete-modal-title"
          className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4"
        >
          Confirm Delete
        </h3>
        
        {/* Modal message */}
        <p 
          id="delete-modal-message"
          data-testid="delete-modal-message"
          className="text-gray-700 dark:text-gray-300 mb-6"
        >
          Are you sure you want to delete this page? This action cannot be undone.
        </p>
        
        {/* Modal action buttons */}
        <div 
          id="delete-modal-actions"
          data-testid="delete-modal-actions"
          className="flex justify-end space-x-3"
        >
          <button 
            id="delete-modal-cancel-button"
            data-testid="delete-modal-cancel-button"
            aria-label="Cancel delete"
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            id="delete-modal-confirm-button"
            data-testid="delete-modal-confirm-button"
            aria-label="Confirm delete"
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
