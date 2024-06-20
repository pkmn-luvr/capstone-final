import React, { useEffect, useState } from 'react';
import CollectionsCard from './CollectionsCard';
import { useUser } from '../contexts/UserContext';
import ACNHAPI from '../api'; 

const CollectionsList = () => {
  const { currentUser } = useUser();
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      if (!currentUser) {
        console.log("No current user found");
        return;
      }

      console.log(`Fetching collections for user: ${currentUser.username}`);
      
      try {
        const response = await ACNHAPI.getUserCollections(currentUser.username);
        console.log("Collections fetched successfully:", response);

        // Ensure response.collections is an array
        if (Array.isArray(response.collections)) {
          setCollections(response.collections);
        } else {
          console.error('Expected an array but got:', response.collections);
          setCollections([]);
        }
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    fetchCollections();
  }, [currentUser]);

  return (
    <div className="collections-list">
      {collections.map((collection) => (
        <CollectionsCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
};

export default CollectionsList;