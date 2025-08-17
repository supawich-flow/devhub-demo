import {
  FaPlus,
  FaSearch,
  FaUserCircle,
  FaImage,
  FaLink,
  FaPoll,
  FaCode,
  FaThumbsUp,
  FaCommentAlt,
  FaShare,
} from "react-icons/fa";
import { db } from "../lib/firebase";
import { formatDistanceToNow, set } from "date-fns";
import { th } from "date-fns/locale";
import toast from "react-hot-toast";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { MdArrowDropDown } from "react-icons/md";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { serverTimestamp } from "firebase/firestore";
import { query, orderBy } from "firebase/firestore";
import PostModal from "../components/feedComponents/postModal";
import PhotoUploaderModal from "../components/feedComponents/PhotoUploaderModal";
import PostDetailModal from "../components/PostDetailModal";
import useLoading from "../hooks/useLoading";
import { supabase } from "../lib/supabase";
import { addCommentToPost } from "../services/commentService";
import { handleLike } from "../services/ีlikeService";
import {
  searchPostsByText,
  searchUsersByDisplayName,
} from "../services/searchService";

export default function CommunityFeed() {
  const [openDropDown, setOpenDropDown] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [postForm, setPostForm] = useState({
    text: "",
    imageUrl: "",
    type: "",
    tag: "",
  });
  const [postsArray, setPostsArray] = useState([]);
  const { isLoading, withLoading } = useLoading();
  const [openPostMenuId, setOpenPostMenuId] = useState(null);
  const [previewPostImg, setPreviewPostImg] = useState(null);
  const [viewPostDetail, setViewPostDetail] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [file, setFile] = useState(null);
  const [toggleComment, setToggleComment] = useState(null);
  const [comment, setComment] = useState({});
  const [commentsByPosts, setCommentsByPosts] = useState({});
  const [likeCount, setLikeCount] = useState({});
  const [likeLoading, setLikeLoading] = useState({});
  const [likeUsers, setLikeUsers] = useState({});
  const [searchText, setSearchText] = useState("");
  const [postResult, setPostResult] = useState([]);
  const [userResult, setUserResult] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [sortedPost, setSortedPost] = useState([]);
  const [activeTab, setActiveTab] = useState("forYou");
  const [changingTab, setChangingTab] = useState(false);

  const handleSearch = async (e) => {
    if (!searchText.trim()) return;

    setIsSearching(true);

    setShowSearchDropdown(!showSearchDropdown);

    const posts = await searchPostsByText(searchText);
    setPostResult(posts);

    const users = await searchUsersByDisplayName(searchText);
    setUserResult(users);

    setIsSearching(false);
  };

  const handleCommentChange = (e, postId) => {
    setComment((prev) => ({
      ...prev,
      [postId]: e.target.value,
    }));
  };

  const handleAddCommentToPost = async (postId) => {
    const text = comment[postId]?.trim();
    if (!text) return alert("กรุณาเขียนความคิดเห็นก่อน");

    try {
      await addCommentToPost(postId, text, currentUser);
      setComment((prev) => ({
        ...prev,
        [postId]: "",
      }));

      const commentsCol = collection(db, "posts", postId, "comments");
      const commentsSnap = await getDocs(commentsCol);
      const result = commentsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCommentsByPosts((prev) => ({
        ...prev,
        [postId]: result,
      }));
      console.log("comment array:", commentsByPosts[postId]);
    } catch (err) {
      console.log(err.message);
    }
  };

  const openMenuId = (id) => {
    setOpenPostMenuId((prev) => (prev === id ? null : id));
  };
  const handleToggleComment = (postId) => {
    if (toggleComment === postId) {
      setToggleComment(null);
    } else {
      setToggleComment(postId);
    }
  };

  useEffect(() => {
    const fetchPostsAndCommentsAndLikes = async () => {
      try {
        const postsCol = collection(db, "posts");
        const postsQuery = query(postsCol, orderBy("createdAt", "desc"));
        const postsSnapShot = await getDocs(postsQuery);
        const postsList = postsSnapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPostsArray(postsList);
        setSortedPost(postsList);

        const commentsData = {};

        for (const post of postsList) {
          const commentsCol = collection(db, "posts", post.id, "comments");
          const commentsQuery = query(
            commentsCol,
            orderBy("createdAt", "desc")
          );
          const commentsSnap = await getDocs(commentsQuery);
          commentsData[post.id] = commentsSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        }
        setCommentsByPosts(commentsData);


        const likeCounts = {};

        for (const post of postsList) {
          const postRef = doc(db, "posts", post.id);
          const postSnap = await getDoc(postRef);

          if (postSnap.exists()) {
            const data = postSnap.data();
            likeCounts[post.id] = data.likeCount || 0;
          }
        }

        setLikeCount(likeCounts);

        const likeUsers = {};

        for (const post of postsList) {
          const likeRef = collection(db, "posts", post.id, "likes");
          const likeSnap = await getDocs(likeRef);
          likeUsers[post.id] = likeSnap.docs.map((like) => ({
            id: like.id,
            ...like.data(),
          }));
        }
        setLikeUsers(likeUsers);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchPostsAndCommentsAndLikes();
  }, []);

  const handleLikeButton = async (postId) => {
    if (likeLoading[postId]) return;

    setLikeLoading((prev) => ({ ...prev, [postId]: true }));

    const userLiked = likeUsers[postId]?.some(
      (user) => user.userId === currentUser.uid)

    setLikeCount((prev) =>({
      ...prev,
      [postId]: userLiked ? (prev[postId] || 1) - 1 : (prev[postId] || 0) + 1
    }))

    setLikeUsers((prev) => {
      const currentLikes = prev[postId] || [];
      if (userLiked) {
        return {
          ...prev,
          [postId]: currentLikes.filter(
            (user) => user.userId !== currentUser.uid)
        }
      } else {
        return {
          ...prev,
          [postId]: [...currentLikes, {
            userId: currentUser.uid,
            userName: currentUser.displayName,
            userAvatar: currentUser.photoURL || null,
            likedAt: serverTimestamp(),
            globalTimestamp: serverTimestamp(),
            type: 'like',
          }],
        }
      }
    })

    try {
      await handleLike(postId, currentUser);
      
    } catch (err) {
      console.log(err.message);
      const postRef = doc(db, "posts", postId);
      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        const newLikeCount = postSnap.data().likeCount || 0;

        setLikeCount((prev) => ({
          ...prev,
          [postId]: newLikeCount,
        }));
      }

      const likeRef = collection(db, "posts", postId, "likes");
      const likeSnap = await getDocs(likeRef);
      const updateLikeUsers = likeSnap.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setLikeUsers((prev) => ({
        ...prev,
        [postId]: updateLikeUsers,
      }));
    } finally {
      setLikeLoading((prev) => ({ ...prev, [postId]: false }));
    }
  };

  useEffect(() => {
    const fetchPostsByTab = async () => {
      setChangingTab(true);
      try {
        let postsQuery;
        const postsCol = collection(db, "posts");

        switch (activeTab) {
          case "trending":
            postsQuery = query(postsCol, orderBy("likeCount", "desc"));
            break;

          case "new":
            postsQuery = query(postsCol, orderBy("createdAt", "desc"));
            break;

          case "myPosts":
            postsQuery = query(
              postsCol,
              where("userId", "==", currentUser.uid),
              orderBy("createdAt", "desc")
            );
            break;

          case "forYou":
          default:
            postsQuery = query(postsCol, orderBy("createdAt", "desc"));
            break;
        }

        const postsSnapShot = await getDocs(postsQuery);
        const postsList = postsSnapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPostsArray(postsList);
        setSortedPost(postsList);
      } catch (err) {
        console.log("error:", err.message);
      } finally {
        setChangingTab(false);
      }
    };

    fetchPostsByTab();
  }, [activeTab]);

  const handleChange = async (e) => {
    setPostForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDeletePost = async (postId) => {
    try {
      const postRef = doc(db, "posts", postId);
      await deleteDoc(postRef);

      setPostsArray((prev) => prev.filter((post) => post.id !== postId));
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleFileOnChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewPostImg(URL.createObjectURL(file));
      setFile(file);
    }

    e.target.value = "";
  };

  const handlePostSubmit = async () => {
    if (!currentUser) return;
    if (postForm.text === "") {
      toast.error("กรุณาพิมพ์ข้อความก่อนโพสต์");
      return;
    }

    let postImage = "";
    const toastId = toast.loading("กำลังโพสต์...");

    if (file) {
      const { data, error } = await supabase.storage
        .from("postimages")
        .upload(`public/${file.name}`, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        console.error("Upload Error", error);
        return alert("อัพโหลดล้มเหลว");
      }

      const { data: publicUrlData } = supabase.storage
        .from("postimages")
        .getPublicUrl(`public/${file.name}`);

      console.log("URL: " + publicUrlData.publicUrl);
      postImage = publicUrlData.publicUrl;
      setFile(null);
      setPreviewPostImg(null);
    }

    const formattedTag = postForm.tag.split(",").map((item) => item.trim());
    const newPost = {
      ...postForm,
      likeCount: 0,
      imageUrl: postImage,
      tag: formattedTag,
      userId: currentUser.uid,
      userName: currentUser.displayName,
      userAvatar: currentUser.photoURL || null,
      createdAt: serverTimestamp(),
      globalTimestamp: serverTimestamp(),
      type: 'post',
    };

    withLoading(async () => {
      try {
        await addDoc(collection(db, "posts"), newPost);
        setPostForm({
          text: "",
          imageUrl: "",
          type: "",
          tag: "",
        });
        toast.success("โพสต์สำเร็จ!", {
          id: toastId,
        });
      } catch (err) {
        console.log(err.message);
        toast.error("โพสต์ไม่สำเร็จ!", {
          id: toastId,
        });
      }
    });
  };

  const goToDashboard = () => {
    if (!currentUser) return;

    navigate("/");
  };

  const goToProfilePage = () => {
    navigate(`/userprofile/${currentUser.uid}`);
  };

  const handleLogOut = async () => {
    const toastId = toast.loading("กำลังออกจากระบบ...");
    try {
      await logout();
      navigate("/login");
      toast.success("ออกจากระบบสำเร็จ!", {
        id: toastId,
      });
    } catch (err) {
      console.log(err.message);
      toast.error("ออกจากระบบล้มเหลว", {
        id: toastId,
      });
    }
  };

  const openPostModal = () => {
    if (!currentUser) return;

    setIsPostModalOpen(true);
  };

  const closePostModal = () => {
    setIsPostModalOpen(false);
  };

  const openPhotoModal = () => {
    if (!currentUser) return;

    setIsPhotoModalOpen(true);
  };

  const closePhotoModal = () => {
    setIsPhotoModalOpen(false);
  };

  const openViewPostModal = (postItem) => {
    console.log("ส่ง post เข้า modal:", postItem);
    setSelectedPost(postItem);
    setViewPostDetail(true);
  };

  const closeViewPostModal = () => {
    setSelectedPost(null);
    setViewPostDetail(false);
  };

  useEffect(() => {
    if (sortBy === "Top") {
      const updated = [...postsArray].sort(
        (a, b) => (b.likeCount || 0) - (a.likeCount || 0)
      );
      setSortedPost(updated);
    } else if (sortBy === "Newest") {
      const updated = [...postsArray].sort(
        (a, b) => b.createdAt?.seconds - a.createdAt?.seconds
      );
      setSortedPost(updated);
    } else {
      setSortedPost(postsArray);
    }
  }, [sortBy, postsArray]);

  useEffect(() => {
    console.log(sortedPost);
  }, [sortedPost]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {selectedPost && viewPostDetail && (
        <PostDetailModal
          post={selectedPost}
          onClose={closeViewPostModal}
          like={likeCount[selectedPost.id]}
          comment={commentsByPosts[selectedPost.id]}
        />
      )}
      {isPostModalOpen && (
        <PostModal
          onClose={closePostModal}
          isPhotoModalOpen={isPhotoModalOpen}
        />
      )}
      {isPhotoModalOpen && <PhotoUploaderModal onClose={closePhotoModal} />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-2xl sm:text-3xl text-indigo-600 font-extrabold tracking-tight">
              DevHub
            </span>{" "}
            {""}
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Community
            </span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Feed ของชุมชน — อ่าน แสดงความคิดเห็น และเชื่อมต่อกับคนอื่น
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* <button
              onClick={openPostModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border bg-white cursor-pointer dark:bg-gray-800 hover:bg-indigo-600 transition-all duration-100 ease-linear hover:border-indigo-600 hover:text-white shadow-sm text-sm font-medium"
            >
              <FaPlus /> Create Post
            </button> */}
            <div className="relative hidden sm:flex items-center gap-2">
              <input
                className="px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-sm w-56"
                placeholder="Search posts, users..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                required
              />
              <button
                onClick={handleSearch}
                className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm flex items-center gap-2 cursor-pointer "
              >
                <FaSearch /> Search
              </button>

              {showSearchDropdown && searchText.trim() !== "" && (
                <div className="absolute top-12 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg w-[300px] z-50">
                  <div className="max-h-64 overflow-y-auto py-2 text-sm">
                    {/* 🔍 User Results */}
                    {!isSearching && userResult.length > 0 && (
                      <>
                        <p className="px-4 py-2 text-gray-400">Users</p>
                        {userResult.map((user) => {
                          console.log(user);
                          return (
                            <div
                              key={user.id}
                              onClick={() =>
                                navigate(`/userprofile/${user.id}`)
                              }
                              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            >
                              👤 {user.displayName}
                            </div>
                          );
                        })}
                      </>
                    )}

                    {/* 🔍 Post Results */}
                    {!isSearching && postResult.length > 0 && (
                      <>
                        <p className="px-4 py-2 text-gray-400">Posts</p>
                        {postResult.map((post) => (
                          <div
                            key={post.id}
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          >
                            📝{" "}
                            {post.text.length > 50
                              ? post.text.slice(0, 50) + "..."
                              : post.text}
                          </div>
                        ))}
                      </>
                    )}

                    {/* ถ้าไม่เจออะไรเลย */}
                    {!isSearching &&
                      postResult.length === 0 &&
                      userResult.length === 0 && (
                        <div className="px-4 py-2 text-gray-400">
                          No results found
                        </div>
                      )}

                    {isSearching && (
                      <div className="px-4 py-2 text-gray-400">
                        Searching...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setOpenDropDown(!openDropDown)}
                className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-200 hover:bg-gray-300 transition-all duration-150 ease-linear dark:bg-gray-700 text-sm font-medium"
              >
                <div>
                  {currentUser?.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="avatar"
                      className="rounded-full w-8 h-8 object-cover"
                    />
                  ) : (
                    "N/A"
                  )}
                </div>
                <div>
                  <p>{currentUser ? currentUser.displayName : "Guest"}</p>
                  <div className="flex items-center">
                    <p className="text-xs font-normal">My account</p>
                    <MdArrowDropDown
                      className={openDropDown === true ? "rotate-180" : ""}
                    />
                  </div>
                </div>
              </button>
              {openDropDown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden z-10">
                  <button
                    onClick={goToProfilePage}
                    className="w-full text-left px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={goToDashboard}
                    className="w-full text-left px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Dashboard
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                    Settings
                  </button>
                  <button
                    onClick={handleLogOut}
                    className="w-full text-left px-4 py-2 text-sm cursor-pointer text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <main className="lg:col-span-8">
            {/* Post composer */}
            <section className="mb-6 bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {currentUser?.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="avatar"
                      className="rounded-full w-full h-full object-cover"
                    />
                  ) : (
                    "N/A"
                  )}
                </div>
                <div className="flex-1">
                  <textarea
                    onChange={handleChange}
                    name="text"
                    value={postForm.text || ""}
                    className="w-full min-h-[72px] resize-none rounded-xl border p-3 bg-transparent text-sm"
                    placeholder="Share something with the community..."
                  ></textarea>

                  {previewPostImg ? (
                    <div className="relative inline-block group rounded-xl overflow-hidden">
                      <img
                        src={previewPostImg}
                        alt=""
                        className="h-20 w-auto object-cover rounded-xl"
                      />
                      <button
                        onClick={() => setPreviewPostImg(null)}
                        className="cursor-pointer absolute inset-0 flex items-center justify-center bg-black/40 text-white text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                  <input
                    type="text"
                    name="tag"
                    value={postForm.tag || ""}
                    onChange={handleChange}
                    placeholder="พิมพ์แท็ก คั่นด้วย , เช่น react, firebase"
                    className="mt-2 block w-full border p-2 rounded-md text-sm"
                  />

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <label htmlFor="file-upload">
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileOnChange}
                        />
                        <div className="px-3 py-1 rounded-lg cursor-pointer border flex items-center gap-1 hover:bg-indigo-600 transition-all ease-linear hover:border-indigo-600 hover:text-white">
                          <FaImage /> Photo
                        </div>
                      </label>
                      <button className="px-3 py-1 rounded-lg border text-white border-gray-400 bg-gray-400 flex items-center gap-1">
                        <FaLink /> Link
                      </button>
                      <button className="px-3 py-1 rounded-lg border text-white border-gray-400 bg-gray-400 flex items-center gap-1">
                        <FaPoll /> Poll
                      </button>
                      <button className="px-3 py-1 rounded-lg border text-white border-gray-400 bg-gray-400 flex items-center gap-1">
                        <FaCode /> Code
                      </button>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={handlePostSubmit}
                        className="px-4 py-2 rounded-2xl bg-indigo-600 text-white text-sm  cursor-pointer"
                      >
                        {isLoading === true ? "Posting..." : "Post"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* Feed filters */}
            <section className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("forYou")}
                  className={`cursor-pointer px-3 py-1 rounded-full text-sm ${
                    activeTab === "forYou" ? "bg-indigo-50" : ""
                  }`}
                >
                  For You
                </button>
                <button
                  onClick={() => setActiveTab("trending")}
                  className={`cursor-pointer px-3 py-1 rounded-full text-sm ${
                    activeTab === "trending" ? "bg-indigo-50" : ""
                  }`}
                >
                  Trending
                </button>
                <button
                  onClick={() => setActiveTab("new")}
                  className={`cursor-pointer px-3 py-1 rounded-full text-sm ${
                    activeTab === "new" ? "bg-indigo-50" : ""
                  }`}
                >
                  New
                </button>
                <button
                  onClick={() => setActiveTab("myPosts")}
                  className={`cursor-pointer px-3 py-1 rounded-full text-sm ${
                    activeTab === "myPosts" ? "bg-indigo-50" : ""
                  }`}
                >
                  My Posts
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="hidden sm:inline">Sort by</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 rounded-lg border bg-white dark:bg-gray-800 text-sm"
                >
                  <option>Top</option>
                  <option>Newest</option>
                </select>
              </div>
            </section>
            {/*Post section*/}
            <section className="space-y-4">
              {changingTab && <p>Loading posts...</p>}
              {!changingTab &&
                sortedPost.map((item) => {
                  const createdAtDate = item.createdAt
                    ? item.createdAt.toDate()
                    : new Date();
                  return (
                    <article
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4"
                      key={item.id}
                    >
                      <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          {item.userAvatar ? (
                            <img
                              src={item.userAvatar}
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
                                {item.userName} ·{" "}
                                <span className="text-xs text-gray-400 dark:text-gray-400">
                                  {formatDistanceToNow(createdAtDate, {
                                    addSuffix: true,
                                    locale: th,
                                  })}
                                </span>
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                {item.text}
                              </p>
                            </div>
                            <div className="text-sm text-gray-400 relative">
                              {currentUser.uid === item.userId && (
                                <button
                                  type="button"
                                  onClick={() => openMenuId(item.id)}
                                  className="hover:text-gray-600 cursor-pointer dark:hover:text-gray-300"
                                >
                                  •••
                                </button>
                              )}
                              {openPostMenuId === item.id && (
                                <div className="absolute right-0 mt-2 w-40 rounded-xl shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                                  <div className="py-1 text-sm text-gray-700 dark:text-gray-200">
                                    <button className="block w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                                      Edit Post
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeletePost(item.id)}
                                      className="block w-full text-left px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                      Delete Post
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          {item.imageUrl ? (
                            <div
                              onClick={() => openViewPostModal(item)}
                              className="mt-3 rounded-lg overflow-hidden cursor-pointer"
                            >
                              <img
                              src={item.imageUrl} alt="" />
                            </div>
                          ) : (
                            ""
                          )}
                          <div className="mt-3 flex items-center justify-between text-sm dark:text-gray-400">
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => handleLikeButton(item.id)}
                                className={`flex items-center gap-2`}
                              >
                                <FaThumbsUp
                                  className={`cursor-pointer ${
                                    likeUsers[item.id]?.some(
                                      (user) => user.userId === currentUser.uid
                                    )
                                      ? "text-blue-600"
                                      : "text-gray-600"
                                  }`}
                                />
                                <span className="text-xs">
                                  {likeCount[item.id]}
                                </span>
                              </button>
                              <button
                                onClick={() => handleToggleComment(item.id)}
                                className="flex items-center gap-2"
                              >
                                <FaCommentAlt className="cursor-pointer text-gray-600" />
                                <span className="text-xs">
                                  {commentsByPosts[item.id]?.length}
                                </span>
                              </button>
                              <button className="flex items-center gap-2 text-gray-600">
                                <FaShare className="cursor-pointer" />
                              </button>
                            </div>
                            <div className="text-xs text-gray-400">
                              Tagged: {item.tag.join(", ")}
                            </div>
                          </div>
                        </div>
                      </div>
                      {toggleComment === item.id && (
                        <div className="mt-4 border-t pt-4 dark:border-gray-700 space-y-4">
                          {commentsByPosts[item.id]?.map((c) => {
                            const commentedAt = c.createdAt
                              ? c.createdAt.toDate()
                              : new Date();
                            return (
                              <div
                                key={c.id}
                                className="bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                              >
                                <div className="flex gap-3 items-start">
                                  <img
                                    src={c.userAvatar}
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                  <div>
                                    <p className="font-medium text-sm">
                                      {c.userName}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                      {c.text}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                      {formatDistanceToNow(commentedAt, {
                                        addSuffix: true,
                                        locale: th,
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                              {currentUser?.photoURL ? (
                                <img
                                  src={currentUser.photoURL}
                                  alt="avatar"
                                  className="w-full h-full object-cover rounded-full"
                                />
                              ) : (
                                <FaUserCircle className="text-gray-500 text-xl" />
                              )}
                            </div>
                            <div className="flex-1">
                              <textarea
                                placeholder="แสดงความคิดเห็นของคุณ..."
                                value={comment[item.id]}
                                onChange={(e) =>
                                  handleCommentChange(e, item.id)
                                }
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none placeholder-gray-400 dark:placeholder-gray-500"
                                rows={2}
                              />
                              <div className="flex justify-end mt-2">
                                <button
                                  className={`bg-indigo-600 text-white px-4 py-1.5 rounded-full text-sm hover:bg-indigo-700 transition-all ${
                                    comment[item.id]?.trim() === ""
                                      ? "opacity-50 cursor-not-allowed"
                                      : "cursor-pointer"
                                  }`}
                                  disabled={comment[item.id]?.trim() === ""}
                                  onClick={() =>
                                    handleAddCommentToPost(item.id)
                                  }
                                >
                                  ส่งความคิดเห็น
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
            </section>
          </main>
          <aside className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
              <h4 className="font-semibold">Trending Topics</h4>
              <div className="mt-3 flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300">
                <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  #react
                </button>
                <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  #firebase
                </button>
                <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  #design
                </button>
                <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  #career
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
