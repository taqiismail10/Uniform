---

# UniForm Frontend Setup - Your Personal Steps (Exact Sequence)

This document outlines the successful setup process for the UniForm frontend application, using the precise sequence of commands and actions you performed. (Install all the dependencies in `--legacy-peer-deps` mode)

## 1. Project Initialization & Core Dependencies

1.  **Create Vite React Application:**

    -   Executed the command to create the initial project:
        ```cmd
        npm create vite@latest
        ```
    -   Project name: student
    -   Framework: react
    -   Typescript + swe

2.  **Navigate into Project Directory:**
    ```cmd
    cd student
    ```
3.  **Install Initial Project Dependencies:**
    ```cmd
    npm install
    ```

## 2. Tailwind CSS & Shadcn/ui Integration

1.  **Followed Official Shadcn/ui Vite Installation Guide:**
    -   Referred to the instructions provided in the link: [https://ui.shadcn.com/docs/installation/vite](https://ui.shadcn.com/docs/installation/vite)
    -   _(Based on the link, this implicitly involved installing Tailwind CSS and running `npx shadcn-ui@latest init`, and potentially `npx shadcn-ui@latest add button`.)_

## 3. Additional Dependencies

1.  **Install Axios:**
    ```cmd
    npm install axios
    ```
2.  **Install React Router DOM:**
    ```cmd
    npm install react-router-dom
    ```

## 4. Environment Variables Configuration

1.  **Create `.env` file:**

    -   Executed the command to create the `.env` file:
        ```cmd
        fsutil file createnew .env 0
        ```
    -   Added the following content to `frontend/student/.env`:

        ```bash
        # frontend/student/.env

        # Base URL for your UniForm Backend API
        # Ensure this matches the port your backend is running on (default 5000)
        VITE_API_BASE_URL=http://localhost:5000/
        ```

## 5. Main Application Component (`App.tsx`)

1.  **Modified `src/App.tsx`:

-   Replaced the content of `frontend/student/src/App.tsx` with the following code:

    ```tsx
    // frontend/student/src/App.tsx

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
    			.catch((err: any) => {
    				console.error("Error fetching DB status:", err);
    				setDbStatus(
    					`Database check failed: ${
    						err.response?.data?.message || err.message
    					}`
    				);
    			});
    	}, []); // Empty dependency array means this runs once on mount

    	return (
    		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
    			<header className="text-center mb-8">
    				<h1 className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-4">
    					UniForm Frontend
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
    ```

## 6. Install Lucide-react [Lucide-React](https://lucide.dev/guide/packages/lucide-react)

1.  **Start Frontend Development Server:**
    ```cmd
    npm install lucide-react
    ```

## 7. Running the Development Server

1.  **Start Frontend Development Server:**
    ```cmd
    npm run dev
    ```
---
