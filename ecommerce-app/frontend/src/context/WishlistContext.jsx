import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { getUserWishlist, addToWishlist as addToWishlistAPI, removeByUserAndProduct } from '../api/wishlistService';
import toast from 'react-hot-toast';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setWishlist([]);
        }
    }, [user]);

    const fetchWishlist = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const data = await getUserWishlist(user.id);
            setWishlist(data);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = async (productId) => {
        if (!user) {
            toast.error('Please login to add to wishlist');
            return false;
        }

        try {
            const newItem = await addToWishlistAPI(user.id, productId);
            setWishlist([...wishlist, newItem]);
            toast.success('Added to wishlist');
            return true;
        } catch (error) {
            if (error.response?.status === 400) {
                toast.error('Already in wishlist');
            } else {
                toast.error('Failed to add to wishlist');
            }
            return false;
        }
    };

    const removeFromWishlist = async (productId) => {
        if (!user) return;

        try {
            await removeByUserAndProduct(user.id, productId);
            setWishlist(wishlist.filter(item => item.productId !== productId));
            toast.success('Removed from wishlist');
        } catch (error) {
            toast.error('Failed to remove from wishlist');
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.productId === productId);
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            loading,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            fetchWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};
