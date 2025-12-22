import React from "react";
import Header from "@/app/(presentation-generator)/dashboard/components/Header";

export const APIKeyWarning: React.FC = () => {
  return (
    <div className="min-h-screen font-roboto bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <div className="flex items-center justify-center aspect-video mx-auto px-6">
        <div className="text-center space-y-2 my-6 bg-white p-10 rounded-lg shadow-lg">
          <h1 className="text-xl font-bold text-gray-900">
            Please configure your LLM settings to enable template creation via AI.
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This feature requires a valid LLM configuration. Configure your API key and settings in the .env file or via the settings page.
          </p>
        </div>
      </div>
    </div>
  );
}; 