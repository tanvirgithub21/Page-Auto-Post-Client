"use client";
import React, { useState, useEffect, useRef } from "react";
import { CldUploadWidget } from "next-cloudinary";
import axios from "axios";
import axiosInstance from "../../axiosConfig";
import { toast } from "sonner";

export default function Home() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;

  // State for page name options and selected values
  const [pageOptions, setPageOptions] = useState([]);
  const [page_name, set_page_name] = useState("");
  const [content_type, set_content_type] = useState("reel");

  // Use a ref to store the latest content_type value
  const contentTypeRef = useRef(content_type);
  // Use a ref to store the latest page_name value
  const pageNameRef = useRef(page_name);

  // Update the ref value whenever content_type changes
  useEffect(() => {
    contentTypeRef.current = content_type;
  }, [content_type]);

  // Update the ref value whenever page_name changes
  useEffect(() => {
    pageNameRef.current = page_name;
  }, [page_name]);

  // Simulate fetching data from a server
  useEffect(() => {
    const fetchPageOptions = async () => {
      const options = [
        { value: "page1", label: "Page1" },
        { value: "page2", label: "Page2" },
        { value: "page3", label: "Page3" },
      ];
      setPageOptions(options);
      set_page_name(options[0]?.value || ""); // Set default pageName
    };

    fetchPageOptions();
  }, []);

  if (!cloudName) {
    return <p>Error: Cloudinary Cloud Name is not set in the environment.</p>;
  }
  if (!preset) {
    return <p>Error: Cloudinary Preset Name is not set in the environment.</p>;
  }


  const saveContent = async (data) => {
    try {
      const response = await axiosInstance.post('/save-content', data); // Use the base URL from axiosInstance
      
      toast.success(response.data.message, {
        position: 'top-center',
      })// Show success message
    } catch (error) {
      console.error(error); // Log the error for debugging\
      toast.error('Error saving reel data', {
        position: 'top-center',
      })// Show error message
    }
  };



  const uploadCompliteFn = (results) => {
    const { event, info } = results || {};
    if (event !== "success") {
      console.log("Something is wrong! Upload failed.");
      return;
    }

    const { public_id, playback_url, secure_url, thumbnail_url, duration } =
      info || {};

    const data = {
      page_name: pageNameRef.current, // Get the latest page_name from the ref
      content_type: contentTypeRef.current, // Get the latest content_type from the ref
      public_id,
      playback_url,
      secure_url,
      thumbnail_url,
      duration,
    };
    saveContent(data)
    console.log(data);
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
            পেজের নাম নির্বাচন করুন
          </label>
          <select
            id="pageName"
            value={page_name}
            onChange={(e) => set_page_name(e.target.value)}
            className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 text-gray-700"
          >
            {pageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
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
            কন্টেন্টের ধরন নির্বাচন করুন
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

        {/* Upload Section */}
        <div className="space-y-4">
          <p className="text-xl font-semibold text-gray-800 text-center">
            আপলোড পেজ
          </p>
          <CldUploadWidget uploadPreset={preset} onSuccess={uploadCompliteFn}>
            {({ open }) => (
              <button
                onClick={() => open()}
                className="w-full px-5 py-3 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                ছবি আপলোড করুন
              </button>
            )}
          </CldUploadWidget>
        </div>
      </div>
    </div>
  );
}
