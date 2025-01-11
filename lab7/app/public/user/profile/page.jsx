"use client";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import React, { useState, useEffect } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photoURL, setPhotoURL] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    zipCode: "",
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setPhotoURL(user.photoURL || "");

        // Fetch address from Firestore
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAddress(docSnap.data().address || {});
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "photoURL") {
      setPhotoURL(value);
    } else {
      setAddress({
        ...address,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("No user is logged in!");
      return;
    }

    try {
      const auth = getAuth();
      // Update photo URL
      await updateProfile(auth.currentUser, { photoURL });

      // Update address in Firestore
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, { address }, { merge: true });

      alert("Profile updated successfully!");
      setUser({ ...auth.currentUser }); // Update user state to reflect changes
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Not authenticated</div>;
  }

  const email = user.email;
  const username = email.split("@")[0];

  return (
    <div className="card card-side bg-base-100 shadow-xl">
      <figure>
        <img
          style={{ width: "150px", height: "150px", objectFit: "cover" }}
          src={photoURL || "https://via.placeholder.com/150"}
          alt="Profile picture"
        />
      </figure>
      <div className="card-body">
        <div className="card-actions justify-end">
          <p>Username: {username}</p>
          <p>Email: {email}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Photo URL:
            <input
              type="text"
              name="photoURL"
              value={photoURL}
              onChange={handleInputChange}
              placeholder="Enter Photo URL"
            />
          </label>
        </div>
        <div>
          <label>
            Street:
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={handleInputChange}
              placeholder="Enter Street"
            />
          </label>
        </div>
        <div>
          <label>
            City:
            <input
              type="text"
              name="city"
              value={address.city}
              onChange={handleInputChange}
              placeholder="Enter City"
            />
          </label>
        </div>
        <div>
          <label>
            Zip Code:
            <input
              type="text"
              name="zipCode"
              value={address.zipCode}
              onChange={handleInputChange}
              placeholder="Enter Zip Code"
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
