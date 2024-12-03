"use client";
import React, { useState, useEffect, useRef } from "react";
import { CldUploadWidget } from "next-cloudinary";
import axiosInstance from "../../axiosConfig";
import { toast } from "sonner";
import axios from "axios";

export default function Home() {
  // Netowark requst call
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/v1/page/all"
        );
        setPages(response.data);
        setPageOptions(response?.data);
        set_page_id(response?.data[0]?.page_id || "No Page Found");
        toast.success("Pages fetched successfully!");
      } catch (error) {
        console.error("Error fetching pages:", error);
        const errorMessage =
          error.response?.data?.message || "Failed to fetch pages";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;

  // State for page name options and selected values
  const [pageOptions, setPageOptions] = useState([]);
  const [page_id, set_page_id] = useState("");
  const [content_type, set_content_type] = useState("reel");
  const [description, set_description] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // State for the modal input fields
  const [newPageName, setNewPageName] = useState("");
  const [pageId, setPageId] = useState("");
  const [shortLivedToken, setShortLivedToken] = useState("");
  const [appId, setAppId] = useState("");
  const [appSecret, setAppSecret] = useState("");

  // Use a ref to store the latest content_type value
  const contentTypeRef = useRef(content_type);
  const pageIdRef = useRef(page_id);
  const pageDescription = useRef(description);

  useEffect(() => {
    contentTypeRef.current = content_type;
  }, [content_type]);

  useEffect(() => {
    pageIdRef.current = page_id;
  }, [page_id]);

  useEffect(() => {
    pageDescription.current = description;
  }, [description]);

  if (!cloudName)
    return <p>Error: Cloudinary Cloud Name is not set in the environment.</p>;
  if (!preset)
    return <p>Error: Cloudinary Preset Name is not set in the environment.</p>;

  const saveContent = async (data) => {
    try {
      const response = await axiosInstance.post("/content/add", data);
      toast.success(response.data.message, { position: "top-center" });
    } catch (error) {
      console.error(error);
      toast.error("Error saving reel data", { position: "top-center" });
    }
  };

  const uploadComponentFn = (results) => {
    const { event, info } = results || {};
    if (event !== "success") {
      console.log("Something is wrong! Upload failed.");
      return;
    }

    const { public_id, playback_url, secure_url, thumbnail_url, duration } =
      info || {};
    const data = {
      page_id: pageIdRef.current,
      content_type: contentTypeRef.current,
      description: pageDescription.current,
      public_id,
      playback_url,
      secure_url,
      thumbnail_url,
      duration,
    };
    saveContent(data);
    console.log(data);
  };

  // Function to open modal
  const handleAddPage = () => {
    setModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setModalOpen(false);
  };

  // Handle new page add form submission
  const handleSavePage = async () => {
    const pageData = {
      page_name: newPageName,
      page_id: pageId,
      short_lived_token: shortLivedToken,
      app_id: appId,
      app_secret: appSecret,
    };
    console.log("Saving new page data:", pageData);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/page/add",
        pageData
      );
      console.log("Response:", response);

      // Show success toast if needed
      toast.success("Token created successfully!");
    } catch (error) {
      // Handle errors properly
      if (error.response) {
        // Server responded with an error
        const errorMessage =
          error.response.data.message || "Something went wrong";
        toast.error(`Error: ${errorMessage}`);
      } else if (error.request) {
        // No response was received
        toast.error("No response from server.");
      } else {
        // Other errors (config issues, etc.)
        toast.error(`Error: ${error.message}`);
      }
    }
    closeModal(); // Close modal after saving
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg space-y-6">
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

        {/* Upload Section */}
        <div className="space-y-4">
          <p className="text-xl font-semibold text-gray-800 text-center">
            Upload Page
          </p>
          <CldUploadWidget uploadPreset={preset} onSuccess={uploadComponentFn}>
            {({ open }) => (
              <button
                onClick={() => open()}
                className="w-full px-5 py-3 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Upload Image
              </button>
            )}
          </CldUploadWidget>
        </div>

        {/* Add Page Button */}
        <div className="space-y-4 text-center">
          <button
            onClick={handleAddPage}
            className="w-full px-5 py-3 bg-green-600 text-white font-bold text-lg rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Add Page
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold text-gray-800">
              Add New Page
            </h2>
            <div className="space-y-2 mt-4">
              <input
                type="text"
                placeholder="Page Name"
                className="w-full p-3 border border-gray-400 rounded-lg text-gray-700"
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Page ID"
                className="w-full p-3 border border-gray-400 rounded-lg text-gray-700"
                value={pageId}
                onChange={(e) => setPageId(e.target.value)}
              />
              <input
                type="text"
                placeholder="Short-Lived Token"
                className="w-full p-3 border border-gray-400 rounded-lg text-gray-700"
                value={shortLivedToken}
                onChange={(e) => setShortLivedToken(e.target.value)}
              />
              <input
                type="text"
                placeholder="App ID"
                className="w-full p-3 border border-gray-400 rounded-lg text-gray-700"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
              />
              <input
                type="text"
                placeholder="App Secret"
                className="w-full p-3 border border-gray-400 rounded-lg text-gray-700"
                value={appSecret}
                onChange={(e) => setAppSecret(e.target.value)}
              />

              <button
                onClick={handleSavePage}
                className="w-full px-5 py-3 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 mt-2"
              >
                Save Page
              </button>
              <button
                onClick={closeModal}
                className="w-full px-5 py-3 bg-red-600 text-white font-bold text-lg rounded-lg hover:bg-red-700 mt-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
