"use client";
import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../axiosConfig";
import { toast } from "sonner";
import AddNewPageModal from "@/components/addNewPageModal";
import CldUploadContent from "@/components/cldUploadContent";
import UplodeContentConfiguration from "@/components/uplodeContentConfiguration";
import StorageCheck from "@/components/storageCheck";

export default function Home() {
  // Netowark requst call
  const [loading, setLoading] = useState(true);
  const [noPageFound, setNoPageFound] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/page/all");
        setPageOptions(response?.data);

        set_page_id(response?.data[0]?.page_id || "No Page Found");
        setNoPageFound(response?.data[0]?.page_id && false);
        toast.success("Pages fetched successfully!");
      } catch (error) {
        if (error.status === 404) {
          setNoPageFound(true);
        } else {
          setNoPageFound(false);
        }
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

  // cloudinary
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;

  // cloudinary storage chack
  const [storage, setStorage] = useState({
    used_storage: "0.00",
    total_torage: "0.00",
  });

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
  const [useReferenceStatus, setUseReferenceStatus] = useState(false);
  const [referencePageId, setReferencePageId] = useState(String);

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
  const storageCheck = async () => {
    try {
      const response = await axiosInstance.get("/content/check-storage");
      if (response?.data) {
        setStorage(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error saving reel data", { position: "top-center" });
    }
  };

  useEffect(() => {
    storageCheck();
  }, []);

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
      reference_page_id: referencePageId,
      reference_status: useReferenceStatus,
    };
    console.log("Saving new page data:", pageData);
    try {
      const response = await axiosInstance.post("/page/add", pageData);
      console.log("Response:", response);

      // Show success toast
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
        <StorageCheck storageData={storage} />

        {!noPageFound && (
          <UplodeContentConfiguration
            page_id={page_id}
            set_page_id={set_page_id}
            pageOptions={pageOptions}
            content_type={content_type}
            set_content_type={set_content_type}
            description={description}
            set_description={set_description}
          />
        )}

        {/* Upload Section */}
        {!noPageFound && (
          <CldUploadContent
            uploadComponentFn={uploadComponentFn}
            preset={preset}
          />
        )}

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
        <AddNewPageModal
          newPageName={newPageName}
          setNewPageName={setNewPageName}
          pageId={pageId}
          setPageId={setPageId}
          shortLivedToken={shortLivedToken}
          setShortLivedToken={setShortLivedToken}
          appId={appId}
          setAppId={setAppId}
          appSecret={appSecret}
          setAppSecret={setAppSecret}
          closeModal={closeModal}
          handleSavePage={handleSavePage}
          pageOptions={pageOptions}
          useReferenceStatus={useReferenceStatus}
          setUseReferenceStatus={setUseReferenceStatus}
          setReferencePageId={setReferencePageId}
        />
      )}
    </div>
  );
}
