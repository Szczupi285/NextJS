"use client";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import React, { useState, useEffect } from "react";

export default function profilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photoURL, setPhotoURL] = useState(""); // Initially empty; updated after user fetch

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setPhotoURL(user.photoURL || ""); // Set initial photoURL
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    setPhotoURL(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("No user is logged in!");
      return;
    }

    try {
      const auth = getAuth();
      await updateProfile(auth.currentUser, { photoURL });
      alert("Profile photo updated successfully!");
      setUser({ ...auth.currentUser }); // Update user state to reflect changes
    } catch (error) {
      console.error("Error updating profile photo:", error);
      alert("Failed to update profile photo.");
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
        <input
          type="text"
          value={photoURL}
          onChange={handleInputChange}
          placeholder="Enter Photo URL"
          
        />
        <button type="submit" >
          Submit
        </button>
      </form>
    </div>
  );
}
