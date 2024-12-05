"use client";
import React, { useState } from "react";

export default function AddNewPageModal({
  newPageName,
  setNewPageName,
  pageId,
  setPageId,
  shortLivedToken,
  setShortLivedToken,
  appId,
  setAppId,
  appSecret,
  setAppSecret,
  closeModal,
  handleSavePage,
  pageOptions,
  useReferenceStatus,
  setUseReferenceStatus,
  setReferencePageId,
}) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-gray-800">Add New Page</h2>
        <div className="space-y-4 mt-4">
          <input
            type="text"
            placeholder="Page Name"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            className="w-full p-3 border rounded-lg bg-gray-50 text-gray-800 placeholder-gray-500 focus:ring focus:ring-blue-300 focus:outline-none transition"
          />
          <input
            type="text"
            placeholder="Page ID"
            value={pageId}
            onChange={(e) => setPageId(e.target.value)}
            className="w-full p-3 border rounded-lg bg-gray-50 text-gray-800 placeholder-gray-500 focus:ring focus:ring-blue-300 focus:outline-none transition"
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              id="useReferencePage"
              checked={useReferenceStatus}
              onChange={() => setUseReferenceStatus(!useReferenceStatus)}
              className="mr-2"
            />
            <label htmlFor="useReferencePage" className="text-gray-800">
              Use Reference Page
            </label>
          </div>
          <div
            className={`transition-all duration-300 ${
              useReferenceStatus
                ? "opacity-100 max-h-40"
                : "opacity-0 max-h-0 overflow-hidden"
            }`}
          >
            <select
              className="w-full p-3 border rounded-lg bg-gray-50 text-gray-800 placeholder-gray-500 focus:ring focus:ring-blue-300 focus:outline-none transition"
              onChange={(e) => setReferencePageId(e.target.value)}
            >
              <option value="">Select Reference Page</option>
              {pageOptions.map((page, index) => (
                <option key={index} value={page.page_id}>
                  {page.page_name}
                </option>
              ))}
            </select>
          </div>
          <div
            className={`transition-all duration-300 ${
              useReferenceStatus
                ? "opacity-0 max-h-0 overflow-hidden"
                : "opacity-100 max-h-40"
            }`}
          >
            <input
              type="text"
              placeholder="Short-Lived Token"
              value={shortLivedToken}
              onChange={(e) => setShortLivedToken(e.target.value)}
              className="mb-4 w-full p-3 border rounded-lg bg-gray-50 text-gray-800 placeholder-gray-500 focus:ring focus:ring-blue-300 focus:outline-none transition"
            />
            <input
              type="text"
              placeholder="App ID"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              className="mb-4 w-full p-3 border rounded-lg bg-gray-50 text-gray-800 placeholder-gray-500 focus:ring focus:ring-blue-300 focus:outline-none transition"
            />
            <input
              type="text"
              placeholder="App Secret"
              value={appSecret}
              onChange={(e) => setAppSecret(e.target.value)}
              className="w-full p-3 border rounded-lg bg-gray-50 text-gray-800 placeholder-gray-500 focus:ring focus:ring-blue-300 focus:outline-none transition"
            />
          </div>
          <div className="pt-4">
            <button
              onClick={handleSavePage}
              className="w-full px-5 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
            >
              Save Page
            </button>
            <button
              onClick={closeModal}
              className="w-full px-5 py-3 bg-red-600 text-white font-bold rounded-lg mt-2 hover:bg-red-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
