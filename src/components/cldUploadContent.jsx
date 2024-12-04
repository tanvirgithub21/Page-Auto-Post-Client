import { CldUploadWidget } from "next-cloudinary";
import React from "react";

export default function CldUploadContent({ uploadComponentFn, preset }) {
  return (
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
  );
}
