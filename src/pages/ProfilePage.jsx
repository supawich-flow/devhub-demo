import { useParams } from "react-router-dom";
import { useUserProfileById } from "../hooks/useUserProfile";
import { useAuth } from "../context/AuthContext";
import { usePostsByUserId } from "../hooks/usePostsByUserId";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";
import { FaThumbsUp, FaCommentAlt, FaShare } from "react-icons/fa";
import { useState } from "react";

export default function ProfilePage() {
  const { userId } = useParams();
  const { profile, error, isLoading } = useUserProfileById(userId);
  const { posts, loading } = usePostsByUserId(userId);
  const { currentUser } = useAuth();
  const [toggleMenu, setToggleMenu] = useState(null);

  const selectedPost = (postId) => {
    if (toggleMenu == null) {
      setToggleMenu(postId);
    } else {
      setToggleMenu(null);
    }
  };

  if (isLoading) return <p>Loading Profile...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
        {/* Avatar */}
        <img
          src={profile?.avatarURL}
          alt="username"
          className="w-28 h-28 rounded-full object-cover border-2 border-white shadow-md"
        />

        {/* User Info */}
        <div className="text-center sm:text-left">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {profile?.displayName}
            </h1>
            {currentUser.uid === userId && (
              <button className="mt-4 sm:mt-2 px-4 py-2 text-sm rounded-full font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition">
                Follow
              </button>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-md">
            {profile?.bio}
          </p>

          {/* Social Links */}
          <div className="flex justify-center sm:justify-start gap-4 mt-3 text-sm text-blue-500">
            <a href="#" className="hover:underline">
              Twitter
            </a>
            <a href="#" className="hover:underline">
              GitHub
            </a>
            <a href="#" className="hover:underline">
              Website
            </a>
          </div>

          {/* Metadata */}
          <p className="text-xs text-gray-400 mt-2">
            Joined:{" "}
            {profile?.creationTime
              ? new Date(profile.creationTime).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-200 dark:border-gray-700 mb-6" />

      {/* Section Title */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Recent Posts
      </h2>

      {/* No Posts */}
      {/* <p className="text-gray-500 dark:text-gray-400">This user hasn’t posted anything yet.</p> */}

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((post) => {
          const createdAtDate = post.createdAt
            ? post.createdAt.toDate()
            : new Date();
          return (
            <article
              className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 cursor-pointer"
              key={post.id}
            >
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {post.userAvatar ? (
                    <img
                      src={post.userAvatar}
                      alt="avatar"
                      className="rounded-full w-full h-full object-cover"
                    />
                  ) : (
                    "N/A"
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {post.userName} ·{" "}
                        <span className="text-xs text-gray-400 dark:text-gray-400">
                          {formatDistanceToNow(createdAtDate, {
                            addSuffix: true,
                            locale: th,
                          })}
                        </span>
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {post.text}
                      </p>
                      {post.type ? (
                        <pre className="mt-2 bg-gray-100 dark:bg-gray-900 text-xs p-3 rounded-lg overflow-x-auto"></pre>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="text-sm text-gray-400 relative">
                      {currentUser.uid === post.userId && (
                        <button
                          type="button"
                          onClick={() => selectedPost(post.id)}
                          className="hover:text-gray-600 cursor-pointer dark:hover:text-gray-300"
                        >
                          •••
                        </button>
                      )}
                      {toggleMenu === post.id && (
                        <div className="absolute right-0 mt-2 w-40 rounded-xl shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                          <div className="py-1 text-sm text-gray-700 dark:text-gray-200">
                            <button className="block w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                              Edit Post
                            </button>
                            <button
                              type="button"
                              className="block w-full text-left px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              Delete Post
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {post.imageUrl ? (
                    <div className="mt-3 rounded-lg overflow-hidden">
                      <img src={post.imageUrl} alt="" />
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="mt-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2">
                        <FaThumbsUp className="cursor-pointer" />
                        <span className="text-xs">0</span>
                      </button>
                      <button className="flex items-center gap-2">
                        <FaCommentAlt className="cursor-pointer" />
                        <span className="text-xs">0</span>
                      </button>
                      <button className="flex items-center gap-2">
                        <FaShare className="cursor-pointer" />
                      </button>
                    </div>
                    <div className="text-xs text-gray-400">
                      Tagged: {post.tag.join(", ")}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
