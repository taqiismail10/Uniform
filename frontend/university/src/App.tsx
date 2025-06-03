// uniform/university/src/App.tsx

import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Keep this for any custom app-wide CSS, though Tailwind handles most
import { Button } from "@/components/ui/button"; // Import a Shadcn component

function App() {
  const [backendMessage, setBackendMessage] = useState<string>(
    "Connecting to backend..."
  );
  const [dbStatus, setDbStatus] = useState<string>(
    "Checking database..."
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Test basic backend connection
    axios
      .get(import.meta.env.VITE_API_BASE_URL)
      .then((response) => {
        setBackendMessage(response.data);
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((err: any) => {
        // Use 'any' for error type or refine with specific error types
        console.error("Error fetching backend root:", err);
        setError(
          "Error connecting to backend API. Is the backend server running?"
        );
        setBackendMessage("Backend not reachable.");
      });

    // Test database connection endpoint
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}test-db`)
      .then((response) => {
        setDbStatus(response.data.message);
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((err: any) => {
        console.error("Error fetching DB status:", err);
        setDbStatus(
          `Database check failed: ${err.response?.data?.message || err.message
          }`
        );
      });
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <header className="text-center mb-8">
        <h1 className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-4">
          UniForm University
        </h1>
        <p className="text-lg">
          React + TypeScript + Tailwind CSS + Shadcn/ui
        </p>
      </header>

      <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4">
          Backend Status
        </h2>
        <p className="mb-2">
          Backend API Message:{" "}
          <strong className="text-green-600 dark:text-green-400">
            {backendMessage}
          </strong>
        </p>
        <p>
          Database Status:{" "}
          <strong className="text-purple-600 dark:text-purple-400">
            {dbStatus}
          </strong>
        </p>
        {error && (
          <p className="text-red-500 mt-4">Error: {error}</p>
        )}
      </section>

      <div className="mt-8">
        <Button onClick={() => alert("Shadcn Button Clicked!")}>
          Test Shadcn Button
        </Button>
      </div>

      <footer className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        <p>Edit `src/App.tsx` and save to test HMR</p>
      </footer>
    </div>
  );
}

export default App;
