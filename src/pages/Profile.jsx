import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FiMail, FiUser, FiCalendar, FiEdit3 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { saveUserProfile, getUserProfile } from "../services/profileService";
import useLoading from "../hooks/useLoading";
import PhotoUploaderModal from "../components/feedComponents/PhotoUploaderModal";

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { loading, withLoading } = useLoading();
  const [form, setForm] = useState({
    displayName: "",
    bio: "",
    interests: "",
    website: "",
    socialGitHub: "",
    socialTwitter: "",
    socialLinkedIn: "",
    skills: "",
  });
  const [isOpenPhotoModal, setIsPhotoModalOpen] = useState(false);

  const handleOpenPhotoModal = () => {
    setIsPhotoModalOpen(!isOpenPhotoModal);
  };

  const handleClosePhotoModal = () => {
    setIsPhotoModalOpen(false);
  };

  useEffect(() => {
    if (!currentUser) return;

    withLoading(() =>
      getUserProfile(currentUser.uid).then((profileData) => {
        if (profileData)
          setForm({
            displayName: profileData.displayName || "",
            bio: profileData.bio || "",
            interests: profileData.interests || "",
            website: profileData.website || "",
            socialGitHub: profileData.socialGitHub || "",
            socialTwitter: profileData.socialTwitter || "",
            socialLinkedIn: profileData.socialLinkedIn || "",
            skills: profileData.skills || "",
            creationTime: currentUser.metadata.creationTime,
          });
      })
    );
  }, [currentUser]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert("User not logged in");

    try {
      await saveUserProfile(currentUser.uid, form);
      alert("✅ บันทึกข้อมูลสำเร็จ!");
    } catch (err) {
      alert("❌ บันทึกข้อมูลล้มเหลว: " + err.message);
    }
  };

  function goBackButton() {
    navigate("/");
  }

  if (loading)
    return <div className="p-6 text-center">กำลังโหลดข้อมูลโปรไฟล์...</div>;

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto">
      {isOpenPhotoModal && <PhotoUploaderModal onClose={handleClosePhotoModal} form={form} setForm={setForm} />}
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900 dark:text-gray-100 tracking-tight">
        <FiUser className="inline-block mr-2" />
        โปรไฟล์ของคุณ
      </h1>

      {/* ข้อมูลผู้ใช้ */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md mb-10 flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar */}
        <div className="relative group w-24 h-24 cursor-pointer" onClick={handleOpenPhotoModal}>
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <img
              src={currentUser.photoURL ? currentUser.photoURL : "https://api.dicebear.com/7.x/initials/svg?seed=User"}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-sm font-medium">Edit</span>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2 w-full">
          <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-lg">
            <FiMail /> {currentUser.email}
          </p>
          <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
            <FiCalendar /> เข้าร่วมเมื่อ: Jan 2024{" "}
            {/* TODO: ดึงวันที่จริง */}
          </p>
          <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
            <FiUser /> Role:{" "}
            <span className="font-semibold text-indigo-500">Member</span>
          </p>
        </div>
      </div>

      {/* แก้ไขโปรไฟล์ */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md space-y-6"
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <FiEdit3 /> แก้ไขข้อมูลส่วนตัว
        </h2>

        {/* Display Name */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            ชื่อเล่น
          </label>
          <input
            type="text"
            name="displayName"
            value={form.displayName}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            แนะนำตัวเอง
          </label>
          <textarea
            name="bio"
            rows={4}
            value={form.bio}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          ></textarea>
        </div>

        {/* Interests */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            ความสนใจ (เช่น React, AI, GameDev)
          </label>
          <input
            type="text"
            name="interests"
            value={form.interests}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Website */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            เว็บไซต์ส่วนตัว
          </label>
          <input
            type="url"
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="https://example.com"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Social GitHub */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            GitHub URL
          </label>
          <input
            type="url"
            name="socialGitHub"
            value={form.socialGitHub}
            onChange={handleChange}
            placeholder="https://github.com/username"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Social Twitter */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Twitter URL
          </label>
          <input
            type="url"
            name="socialTwitter"
            value={form.socialTwitter}
            onChange={handleChange}
            placeholder="https://twitter.com/username"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Social LinkedIn */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            LinkedIn URL
          </label>
          <input
            type="url"
            name="socialLinkedIn"
            value={form.socialLinkedIn}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            ทักษะ (คั่นด้วย comma เช่น JavaScript, React, Node.js)
          </label>
          <input
            type="text"
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="JavaScript, React, Node.js"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={goBackButton}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all cursor-pointer"
          >
            ย้อนกลับ
          </button>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all cursor-pointer"
          >
            บันทึกข้อมูล
          </button>
        </div>
      </form>
    </div>
  );
}