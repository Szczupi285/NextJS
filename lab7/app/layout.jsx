"use client";

import "./globals.css";
import { AuthProvider } from "@/app//lib/AuthContext";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null); // Track user login state
  const [loading, setLoading] = useState(true); // track loading 
  const auth = getAuth(); // Firebase auth instance
  const router = useRouter(); // For redirecting after logout

  const handleNavigation = (path) => {
    if (router.pathname !== path) {
      router.push(path); // Navigate only if not already on that page
    }
  };

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false) // Set user state
    });
    return () => unsubscribe(); // Cleanup listener
  }, [auth]);

  if (loading) {
    return <div>Loading...</div>; // You can customize this placeholder
  }
  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      router.push("/"); // Redirect to home or login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <html lang="en">
      <body>
        <div className="drawer lg:drawer-open">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col items-center justify-center">
            <AuthProvider>{children}</AuthProvider>
            <label
              htmlFor="my-drawer-2"
              className="btn btn-primary drawer-button lg:hidden"
            >
              Open drawer
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer-2"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
              {/* Sidebar content here */}
              {!user &&
              (
                <div>
                  <li>
                  <button onClick={() => handleNavigation("/public/user/register")}>Register</button>
                </li>
                <li>
                  <button onClick={() => handleNavigation("/public/user/signin")}>Login</button>
                </li>
              </div>
              )}
             
              {/* Show Logout button only when user is logged in */}
              {user && (
                <div>
                <li>
                  <button
                    onClick={handleLogout}>
                    Logout
                  </button>
                </li>
                <li>
                <button onClick={() => handleNavigation("/public/user/profile")}>Profile</button>
              </li>
              </div>
              )}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <footer className="footer bg-base-200 text-base-content p-10">
          <aside>
            <svg
              width="50"
              height="50"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fillRule="evenodd"
              clipRule="evenodd"
              className="fill-current"
            >
              <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
            </svg>
            <p>
              ACME Industries Ltd.
              <br />
              Providing reliable tech since 1992
            </p>
          </aside>
          <nav>
            <h6 className="footer-title">Services</h6>
            <a className="link link-hover">Branding</a>
            <a className="link link-hover">Design</a>
            <a className="link link-hover">Marketing</a>
            <a className="link link-hover">Advertisement</a>
          </nav>
          <nav>
            <h6 className="footer-title">Company</h6>
            <a className="link link-hover">About us</a>
            <a className="link link-hover">Contact</a>
            <a className="link link-hover">Jobs</a>
            <a className="link link-hover">Press kit</a>
          </nav>
          <nav>
            <h6 className="footer-title">Legal</h6>
            <a className="link link-hover">Terms of use</a>
            <a className="link link-hover">Privacy policy</a>
            <a className="link link-hover">Cookie policy</a>
          </nav>
        </footer>
      </body>
    </html>
  );
}
