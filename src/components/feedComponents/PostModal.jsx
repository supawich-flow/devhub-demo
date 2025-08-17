import { useEffect, useState } from "react";
import { FaImage, FaLink, FaPoll, FaCode } from "react-icons/fa";
import PhotoUploaderModalOutside from "./PhotoUploaderModal_Outside";

export default function PostModal({ onClose }) {
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);

  const closePhotoModal = () => {
    setIsPhotoOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      console.log("Key pressed:", e.key); // ตรวจสอบว่า console แสดงอะไร
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
      {isPhotoOpen && <PhotoUploaderModalOutside onClose={closePhotoModal} />}
      {!isPhotoOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full p-6 min-h-[200px] overflow-auto">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Create a New Post
          </h2>
          <textarea
            rows={5}
            placeholder="Share something with the community..."
            className="w-full p-3 rounded-xl border resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-4"
          />
          <input
            type="text"
            name="tag"
            placeholder="พิมพ์แท็ก คั่นด้วย , เช่น react,firebase"
            className="w-full border p-2 rounded-md text-sm mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <div className="flex items-center gap-3 mb-4 text-gray-600 dark:text-gray-300">
            <button
              onClick={() => setIsPhotoOpen(!isPhotoOpen)}
              className="flex items-center gap-1 px-3 py-1 rounded-lg border cursor-pointer border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaImage /> Photo
            </button>
            <button className="flex items-center gap-1 px-3 py-1 rounded-lg border text-white border-gray-400 bg-gray-400 dark:border-gray-600">
              <FaLink /> Link
            </button>
            <button className="flex items-center gap-1 px-3 py-1 rounded-lg border text-white border-gray-400 bg-gray-400 dark:border-gray-600">
              <FaPoll /> Poll
            </button>
            <button className="flex items-center gap-1 px-3 py-1 rounded-lg border text-white border-gray-400 bg-gray-400 dark:border-gray-600">
              <FaCode /> Code
            </button>
          </div>
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="cursor-pointer px-4 py-2 rounded-2xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
            >
              Cancel
            </button>
            <button className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm cursor-pointer">
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
