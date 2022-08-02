import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

function Category() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  const params = useParams();
  const perPage = 10;
  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get Reference
        const listingsRef = collection(db, 'listings');

        // Create a query
        const q = query(
          listingsRef,
          where('type', '==', params.categoryName),
          orderBy('timestamp', 'desc'),
          // We want to get one additional element to check if it exists
          limit(perPage + 1)
        );

        // Execute query
        const querySnap = await getDocs(q);

        const lastVisible = querySnap.docs[perPage]
          ? querySnap.docs[querySnap.docs.length - 2]
          : null;
        setLastFetchedListing(lastVisible);

        const listing = [];

        querySnap.forEach((doc) => {
          return listing.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        querySnap.docs.length > perPage && listing.pop();
        setListings(listing);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error('Could not fetch listings');
      }
    };
    fetchListings();
  }, [params.categoryName]);

  // Pagination / Load more
  const onFetchMoreListings = async () => {
    try {
      // Get Reference
      const listingsRef = collection(db, 'listings');

      // Create a query
      const q = query(
        listingsRef,
        where('type', '==', params.categoryName),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(perPage + 1)
      );

      // Execute query
      const querySnap = await getDocs(q);

      const lastVisible = querySnap.docs[perPage]
        ? querySnap.docs[querySnap.docs.length - 2]
        : null;
      setLastFetchedListing(lastVisible);
      const listing = [];

      querySnap.forEach((doc) => {
        return listing.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      querySnap.docs.length > perPage && listing.pop();
      setListings((prevState) => [...prevState, ...listing]);
      setLoading(false);
    } catch (error) {
      toast.error('Could not fetch listings');
    }
  };

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {params.categoryName === 'rent'
            ? 'Places for rent'
            : 'Places for sale'}
        </p>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>

          <br />
          <br />
          {lastFetchedListing && (
            <p className="loadMore" onClick={onFetchMoreListings}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>No listings for {params.categoryName}</p>
      )}
    </div>
  );
}

export default Category;
