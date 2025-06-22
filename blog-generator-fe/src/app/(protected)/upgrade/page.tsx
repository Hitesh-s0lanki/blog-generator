import { StarIcon } from "lucide-react";
import React from "react";

const UpgradePage: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-20 px-4">
      <div className="text-center p-5 bg-white rounded-md shadow-lg w-full md:w-1/2 lg:w-1/2 h-[300px] flex flex-col justify-center items-center gap-4">
        <StarIcon className=" size-24 text-orange-400" />
        <h1 className="text-2xl font-semibold text-gray-800">
          Upgrade Feature
        </h1>
        <p className="text-lg text-gray-600 mb-6">Will be coming soon!</p>
      </div>
    </div>
  );
};

export default UpgradePage;
