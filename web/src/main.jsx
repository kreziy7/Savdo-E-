import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <div className="flex h-screen w-full items-center justify-center bg-gray-50 p-6">
            <div className="max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Savdo-(E)</h1>
                <p className="text-gray-600 mb-6 font-medium">
                    Modern full-stack e-commerce project skeleton is successfully set up!
                </p>
                <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm text-green-600 font-semibold bg-green-50 p-3 rounded-lg border border-green-200">
                        <span>✓ Backend API (Express)</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-blue-600 font-semibold bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <span>✓ Web Frontend (React)</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-purple-600 font-semibold bg-purple-50 p-3 rounded-lg border border-purple-200">
                        <span>✓ Mobile Application (Expo)</span>
                    </div>
                </div>
            </div>
        </div>
    </React.StrictMode>
)
