import { useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";

export default function Header({ city, setCity, fetchWeather, user }) {
    const handleSearch = (e) => {
        if (e.key === "Enter" && city.trim()) {
            fetchWeather(city);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Google Sign-In Error:", error.message);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout Error:", error.message);
        }
    };

    return (
        <header className="w-full p-4 bg-opacity-30 bg-gray-800 backdrop-blur-md shadow-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-wide">Weatherly</h1>
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        className="p-2 rounded-md text-white bg-gray-700 bg-opacity-50 outline-none border border-gray-400 focus:ring-2 focus:ring-blue-400 transition-all w-64"
                        placeholder="Enter city..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                    {user ? (
                        <>
                            <span className="text-sm">Hi, {user.displayName}!</span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 transition-all"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleGoogleLogin}
                            className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-all"
                        >
                            Login with Google
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}