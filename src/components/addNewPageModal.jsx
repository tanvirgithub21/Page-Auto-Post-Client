"use clint";
import React from "react";

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
}) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-gray-800">Add New Page</h2>
        <div className="space-y-2 mt-4">
          <input
            type="text"
            placeholder="Page Name"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Page ID"
            value={pageId}
            onChange={(e) => setPageId(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Short-Lived Token"
            value={shortLivedToken}
            onChange={(e) => setShortLivedToken(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            placeholder="App ID"
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            placeholder="App Secret"
            value={appSecret}
            onChange={(e) => setAppSecret(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          <button
            onClick={handleSavePage}
            className="w-full px-5 py-3 bg-blue-600 text-white font-bold rounded-lg mt-2"
          >
            Save Page
          </button>
          <button
            onClick={closeModal}
            className="w-full px-5 py-3 bg-red-600 text-white font-bold rounded-lg mt-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
