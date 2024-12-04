import React from "react";

export default function UplodeContentConfiguration({
  page_id,
  set_page_id,
  pageOptions,
  content_type,
  set_content_type,
  description,
  set_description,
}) {
  return (
    <div>
      {/* Page Name Selector */}
      <div className="space-y-2">
        <label
          htmlFor="pageName"
          className="block text-lg font-bold text-gray-800"
        >
          Select Page Name
        </label>
        <select
          id="pageName"
          value={page_id}
          onChange={(e) => set_page_id(e.target.value)}
          className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 text-gray-700"
        >
          {pageOptions.map((option) => (
            <option key={option._id} value={option.page_id}>
              {option.page_name}
            </option>
          ))}
        </select>
      </div>

      {/* Content Type Selector */}
      <div className="space-y-2">
        <label
          htmlFor="contentType"
          className="block text-lg font-bold text-gray-800"
        >
          Select Content Type
        </label>
        <select
          id="contentType"
          value={content_type}
          onChange={(e) => set_content_type(e.target.value)}
          className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 text-gray-700"
        >
          <option value="reel">Reel</option>
          <option value="video">Video</option>
          <option value="photo">Photo</option>
          <option value="story">Story</option>
        </select>
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-lg font-bold text-gray-800"
        >
          Add Content Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => set_description(e.target.value)}
          className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 text-gray-700"
          placeholder="Write a description for your content..."
          rows="4"
        ></textarea>
      </div>
    </div>
  );
}
