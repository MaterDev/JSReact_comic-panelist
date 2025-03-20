import React, { useState, useEffect } from 'react';

interface Collection {
  id: number;
  name: string;
  description?: string;
}

const CollectionManager: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/collections');
        if (!response.ok) {
          throw new Error('Failed to fetch collections');
        }
        const data = await response.json();
        setCollections(data);
        if (data.length > 0) {
          setSelectedCollection(data[0].id);
        }
      } catch (err) {
        setError('Error loading collections. Please try again later.');
        console.error('Error fetching collections:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCollection(Number(e.target.value));
  };

  return (
    <div className="p-4 bg-white dark:bg-dark-700 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Collection Manager</h2>
      
      {loading ? (
        <p className="text-gray-600 dark:text-gray-400">Loading collections...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : collections.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No collections found.</p>
      ) : (
        <div>
          <div className="mb-4">
            <label htmlFor="collection-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Collection
            </label>
            <select
              id="collection-select"
              value={selectedCollection || ''}
              onChange={handleCollectionChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-600 text-gray-800 dark:text-gray-200"
            >
              {collections.map(collection => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>
          
          {selectedCollection && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                {collections.find(c => c.id === selectedCollection)?.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {collections.find(c => c.id === selectedCollection)?.description || 'No description available.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CollectionManager;
