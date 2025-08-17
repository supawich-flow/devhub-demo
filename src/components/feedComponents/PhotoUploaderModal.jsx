import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { updateProfile } from "firebase/auth";
import { useAuth } from "../../context/AuthContext";

export default function PhotoUploaderModal({ onClose, form, setForm }) {
  const [file,setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null);
  const { currentUser } = useAuth()

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleFileOnChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setFile(file)
    }
  };

  const handleUpload = async() => {
    if (!file) return alert('กรุณาเลือกไฟล์ก่อน');

    const { data, error } = await supabase.storage
    .from('avatars')
    .upload(`public/${file.name}`, file, {
      cacheControl: '3600',
      upsert: true,
    });

    if (error) {
      console.error('Upload Error', error)
      return alert('อัพโหลดล้มเหลว')
    }

    const { data : publicUrlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(`public/${file.name}`);

    alert('อัพโหลดสำเร็จ! URL: ' + publicUrlData.publicUrl)
    console.log('URL: ' + publicUrlData.publicUrl)
    
    const imageUrl = publicUrlData.publicUrl
    await updateProfile(currentUser, {
      photoURL: imageUrl
    })
    setForm({
      avatarURL: imageUrl
    })

  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-sm w-full p-6 relative flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl font-bold cursor-pointer"
          aria-label="Close modal"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          Upload Photo
        </h2>

        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-32 h-32 rounded-full object-cover shadow-lg mb-6"
          />
        ) : (
          <div className="w-32 h-32 rounded-full border-4 border-dashed border-gray-300 dark:border-gray-600 mb-6 flex items-center justify-center">
            <p className="text-gray-400 text-center">No photo selected</p>
          </div>
        )}

        <label
          htmlFor="file-upload"
          className="w-full cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-indigo-600 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-10 w-10 text-indigo-600 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="text-gray-600 dark:text-gray-400">Click to browse</p>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileOnChange}
          />
        </label>

        <button 
        onClick={handleUpload}
        className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl py-2 text-sm font-medium transition-colors duration-150">
          Upload
        </button>
      </div>
    </div>
  );
}
