import React from "react";

const StorageCheck = ({ storageData }) => {
  // Extract and parse the data
  const usedStorage = parseFloat(storageData.used_storage); // Convert to number
  const totalStorage = parseFloat(storageData.total_torage); // Convert to number
  const percentageUsed = ((usedStorage / totalStorage) * 100).toFixed(2); // Calculate percentage

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center text-gray-800">
        Storage Check
      </h1>
      <div className="mt-4 text-gray-700">
        <p>
          Used Storage: <span className="font-semibold">{usedStorage} GB</span>
        </p>
        <p>
          Total Storage:
          <span className="font-semibold">{totalStorage} GB</span>
        </p>
        <p>
          Used Percentage:
          <span className="font-semibold">
            {percentageUsed === "NaN" ? 100 : percentageUsed}%
          </span>
        </p>
      </div>
      <div className="mt-4 h-4 w-full bg-gray-200 rounded-full">
        <div
          className={`h-full rounded-full ${
            percentageUsed <= 60 && "bg-green-500"
          } ${
            percentageUsed >= 61 && percentageUsed <= 80 && "bg-yellow-500"
          }  ${
            (percentageUsed >= 81 || percentageUsed === "NaN") && "bg-red-500"
          }`}
          style={{ width: `${percentageUsed}%` }}
        />
      </div>
    </div>
  );
};

export default StorageCheck;
