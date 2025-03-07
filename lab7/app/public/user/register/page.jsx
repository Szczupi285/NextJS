"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// Popup component for errors or success messages
const NotificationPopup = ({ message, type, onClose }) => {
  const bgColor = type === "error" ? "bg-red-500" : "bg-green-500";
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`p-6 rounded-lg shadow-xl text-center text-white ${bgColor}`}>
        <p className="mb-4 font-semibold">{message}</p>
        <button onClick={onClose} className="btn btn-primary">
          Close
        </button>
      </div>
    </div>
  );
};

export default function RegisterForm() {
  const auth = getAuth(); // Firebase authentication instance
  const router = useRouter(); // Next.js router for redirection
  const [notification, setNotification] = useState(null); // State for showing popups

  // Form submission handler
  const onSubmit = async (e) => {
    e.preventDefault();

    // Extract email and password from form inputs
    const email = e.target["email"].value;
    const password = e.target["password"].value;
    const confirmPassword = e.target["confirm-password"].value;

    if (password !== confirmPassword) {
      setNotification({ type: "error", message: "Passwords don't match" });
      return;
    }

    try {
      // Create a new user with Firebase Authentication
      await createUserWithEmailAndPassword(auth, email, password);
      setNotification({
        type: "success",
        message: "Account created successfully! Redirecting...",
      });

      // Redirect to login page or dashboard after successful registration
      setTimeout(() => {
        router.push("/public/user/profile");
      }, 2000);
    } catch (error) {
      console.error("Registration failed:", error.message);
      setNotification({
        type: "error",
        message: error.message || "Registration failed. Please try again.",
      });
    }
  };

  return (
    <div>
      {/* Render notification popup if there's a message */}
      {notification && (
        <NotificationPopup
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)} // Close popup
        />
      )}

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-4 max-w-md mx-auto p-4"
      >
        {/* Email Input */}
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input
            type="email"
            name="email"
            className="grow"
            placeholder="Email"
            required
          />
        </label>

        {/* Password Input */}
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="password"
            name="password"
            className="grow"
            placeholder="Password"
            required
          />
        </label>

        {/* Confirm password */}
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="password"
            name="confirm-password"
            className="grow"
            placeholder="Confirm Password"
            required
          />
        </label>

        {/* Submit Button */}
        <input type="submit" value="Register" className="btn btn-primary" />
      </form>
    </div>
  );
}
