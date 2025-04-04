/**
 * EditForm Component
 * 
 * This component displays a form for editing an existing collection.
 * 
 * @module CollectionManager/EditForm
 */
import React from 'react';

/**
 * Props for the EditForm component that handles editing of a collection
 */
interface EditFormProps {
  editName: string;
  onNameChange: (value: string) => void;
  editDescription: string;
  onDescriptionChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

/**
 * EditForm component displays a form for editing a collection
 * 
 * @param {EditFormProps} props - The component props
 * @returns {JSX.Element} The rendered EditForm component
 */
const EditForm: React.FC<EditFormProps> = ({
  editName,
  onNameChange,
  editDescription,
  onDescriptionChange,
  onSubmit,
  onCancel,
  isLoading
}) => {
  return (
    <div
      id="collection-manager-edit-form"
      data-testid="collection-manager-edit-form"
      className="mt-4 bg-gray-50 dark:bg-dark-600 p-3 rounded-md border border-gray-200 dark:border-dark-500"
    >
      {/* Title */}
      <h3
        id="collection-manager-edit-title"
        data-testid="collection-manager-edit-title"
        className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200"
      >
        Edit Collection
      </h3>
      
      {/* Name input */}
      <div
        id="collection-manager-edit-name-container"
        data-testid="collection-manager-edit-name-container"
        className="mb-3"
      >
        <label
          id="collection-manager-edit-name-label"
          data-testid="collection-manager-edit-name-label"
          htmlFor="edit-name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Collection Name *
        </label>
        <input
          id="edit-name"
          data-testid="collection-manager-edit-name-input"
          type="text"
          value={editName}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-600 text-gray-800 dark:text-gray-200"
          placeholder="Enter collection name"
          required
          aria-required="true"
          aria-label="Collection name"
        />
      </div>
      
      {/* Description input */}
      <div
        id="collection-manager-edit-description-container"
        data-testid="collection-manager-edit-description-container"
        className="mb-4"
      >
        <label
          id="collection-manager-edit-description-label"
          data-testid="collection-manager-edit-description-label"
          htmlFor="edit-description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Description (optional)
        </label>
        <textarea
          id="edit-description"
          data-testid="collection-manager-edit-description-input"
          value={editDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-600 text-gray-800 dark:text-gray-200"
          placeholder="Enter collection description"
          rows={3}
          aria-label="Collection description"
        />
      </div>
      
      {/* Form actions */}
      <div
        id="collection-manager-edit-actions"
        data-testid="collection-manager-edit-actions"
        className="flex justify-end space-x-2"
      >
        {/* Cancel button */}
        <button
          id="collection-manager-edit-cancel-button"
          data-testid="collection-manager-edit-cancel-button"
          onClick={onCancel}
          className="px-3 py-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded text-sm"
          disabled={isLoading}
          aria-label="Cancel editing collection"
        >
          Cancel
        </button>
        
        {/* Submit button */}
        <button
          id="collection-manager-edit-save-button"
          data-testid="collection-manager-edit-save-button"
          onClick={onSubmit}
          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
          disabled={!editName.trim() || isLoading}
          aria-label="Save collection changes"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default EditForm;
