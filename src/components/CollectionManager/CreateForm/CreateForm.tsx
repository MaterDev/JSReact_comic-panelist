/**
 * CollectionManager CreateForm Component
 * 
 * This component displays a form for creating a new collection.
 * 
 * @module CollectionManager/CreateForm
 */
import React from 'react';

/**
 * Props for the CreateForm component that handles the creation of a new collection
 */
interface CreateFormProps {
  newName: string;
  onNameChange: (value: string) => void;
  newDescription: string;
  onDescriptionChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

/**
 * CreateForm component displays a form for creating a new collection
 * 
 * @param {CreateFormProps} props - The component props
 * @returns {JSX.Element} The rendered CreateForm component
 */
const CreateForm: React.FC<CreateFormProps> = ({
  newName,
  onNameChange,
  newDescription,
  onDescriptionChange,
  onSubmit,
  onCancel,
  isLoading
}) => {
  return (
    <div
      id="collection-manager-create-form"
      data-testid="collection-manager-create-form"
      className="bg-gray-50 dark:bg-dark-600 p-3 rounded-md border border-gray-200 dark:border-dark-500"
    >
      {/* Title */}
      <h3
        id="collection-manager-create-title"
        data-testid="collection-manager-create-title"
        className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200"
      >
        Create New Collection
      </h3>
      
      {/* Name input */}
      <div
        id="collection-manager-create-name-container"
        data-testid="collection-manager-create-name-container"
        className="mb-3"
      >
        <label
          id="collection-manager-create-name-label"
          data-testid="collection-manager-create-name-label"
          htmlFor="new-name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Collection Name *
        </label>
        <input
          id="new-name"
          data-testid="collection-manager-create-name-input"
          type="text"
          value={newName}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-600 text-gray-800 dark:text-gray-200"
          placeholder="Enter collection name"
          required
          aria-required="true"
          aria-label="New collection name"
        />
      </div>
      
      {/* Description input */}
      <div
        id="collection-manager-create-description-container"
        data-testid="collection-manager-create-description-container"
        className="mb-4"
      >
        <label
          id="collection-manager-create-description-label"
          data-testid="collection-manager-create-description-label"
          htmlFor="new-description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Description (optional)
        </label>
        <textarea
          id="new-description"
          data-testid="collection-manager-create-description-input"
          value={newDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-600 text-gray-800 dark:text-gray-200"
          placeholder="Enter collection description"
          rows={3}
          aria-label="New collection description"
        />
      </div>
      
      {/* Form actions */}
      <div
        id="collection-manager-create-actions"
        data-testid="collection-manager-create-actions"
        className="flex justify-end space-x-2"
      >
        {/* Cancel button */}
        <button
          id="collection-manager-create-cancel-button"
          data-testid="collection-manager-create-cancel-button"
          onClick={onCancel}
          className="px-3 py-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded text-sm"
          disabled={isLoading}
          aria-label="Cancel creating collection"
        >
          Cancel
        </button>
        {/* Submit button */}
        <button
          id="collection-manager-create-submit-button"
          data-testid="collection-manager-create-submit-button"
          onClick={onSubmit}
          className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
          disabled={!newName.trim() || isLoading}
          aria-label="Create new collection"
        >
          {isLoading ? 'Creating...' : 'Create Collection'}
        </button>
      </div>
    </div>
  );
};

export default CreateForm;
