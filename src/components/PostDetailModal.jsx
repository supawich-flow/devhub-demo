import { FaTimes, FaThumbsUp, FaCommentAlt, FaShare } from "react-icons/fa";
import { useEffect } from "react";

export default function PostDetailModal({ post, onClose, like, comment }) {
  console.log("postId:", post);
  console.log("like:", like);
  console.log("comment:", comment);
  if (!post) return;

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
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-xl shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
        {/* ปุ่มปิด */}
        <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white">
          <FaTimes size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <img
            src={post.userAvatar}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold">{post.userName ? post.userName : 'USER_NAME'}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Tagged: {post.tag ? post.tag.join(', ') : ''}
            </p>
          </div>
        </div>

        <p className="text-gray-800 dark:text-gray-200 mb-4 whitespace-pre-line">
          {post.text ? post.text : ''}
        </p>

        {post.imageUrl ? <img
          src={post.imageUrl}
          alt="post"
          className="w-full rounded-lg mb-4 object-contain"
        /> : ''}

        <div className="flex items-center gap-6 mt-4 text-gray-500 dark:text-gray-300">
          <button className="flex items-center gap-2 cursor-pointer">
            <FaThumbsUp /> {like}
          </button>
          <button className="flex items-center gap-2 cursor-pointer">
            <FaCommentAlt /> {comment.length}
          </button>
          <button className="flex items-center gap-2 cursor-pointer">
            <FaShare /> Share
          </button>
        </div>
      </div>
    </div>
  );
}
