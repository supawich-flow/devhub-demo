import { usePostsByUserId } from "../hooks/usePostsByUserId";
import {
  FiBell,
  FiClock,
  FiBarChart2,
  FiPlus,
  FiSettings,
  FiSpeaker,
} from "react-icons/fi";
import { FaUserCircle, FaUsers, FaMedal, FaFolderOpen } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { fetchRecentActivities } from "../services/userRecentActivitiesService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { posts } = usePostsByUserId(currentUser.uid);
  const totalLikes = posts.reduce(
    (sum, post) => sum + (post.likeCount || 0),
    0
  );
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const getRecentActs = async () => {
      setLoading(true);
      const result = await fetchRecentActivities(currentUser.uid);
      setRecentActivities(result);
      setLoading(false);
    };

    if (currentUser) {
      getRecentActs();
    }
  }, [currentUser]);

  console.log("recentActivities", recentActivities);
  return (
    <main className="flex-1 p-6 md:p-12 overflow-auto bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all">
      {/* Welcome Section */}
      <section className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">
          👋 ยินดีต้อนรับกลับ,{" "}
          <span className="text-indigo-600 dark:text-indigo-400">
            {currentUser?.displayName || "ผู้ใช้"}
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          พร้อมจะเรียนรู้ แชร์ และเติบโตไปด้วยกันใน DevHub!
        </p>
      </section>

      {/* Announcement Card */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md mb-10">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
          <FiSpeaker className="text-indigo-500" /> ประกาศจากทีมงาน
        </h2>
        <ul className="space-y-4 text-sm">
          <li className="border-l-4 border-indigo-500 pl-4">
            <p className="font-medium text-gray-900 dark:text-gray-100">
              <FiSettings className="inline mr-2" />
              คอมมูนิตี้ “Devhub” พร้อมใช้งานแล้ว!
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              แชร์เรื่องราวหรือโปรเจกต์ของคุณกับเพื่อนในชุมชนได้ทันที!
            </p>
          </li>
        </ul>
      </section>

      {/* Grid Info Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Profile */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FaUserCircle className="text-indigo-500" /> โปรไฟล์ของคุณ
          </h2>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p>
              ระดับ:{" "}
              <span className="text-indigo-600 font-bold">Member</span>
            </p>
            <p>
              แต้มสะสม: <span className="font-bold">0</span>
            </p>
            <p>
              Badges: -
              {/* <FaMedal className="inline text-yellow-500 text-xl mx-1" />
              <FaMedal className="inline text-pink-500 text-xl mx-1" />
              <FaMedal className="inline text-blue-500 text-xl mx-1" /> */}
            </p>
          </div>
        </section>

        {/* Activities */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md xl:col-span-2">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <FiClock className="text-indigo-500" /> กิจกรรมล่าสุดของคุณ
          </h2>
          <ul className="space-y-4 text-sm">
            {recentActivities.map((act,i) => (
              <li 
              key={act.key}
              className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                {act.type === "comment" && <>💬 คุณแสดงความคิดเห็นในโพสต์ของใครซักคนว่า </>}
                {act.type === "like" && <>👍🏻 คุณไลก์โพสต์ของใครซักคน </>}
                {act.type === "post" && <>📝 คุณโพสต์ข้อความใหม่ว่า </>}
                <span className="text-indigo-500">{act.type !== 'like' ? `''${act.text}''` : ''}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-sm text-gray-600 dark:text-gray-300">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <FaUsers className="text-indigo-500" /> กลุ่มของคุณ
          </h3>
          <ul className="space-y-1">
            <p>คุณไม่มีกลุ่ม</p>
            {/* <li>💻 React Devs Club</li>
            <li>🎮 Game Dev Weekly</li>
            <li>🧠 AI Explorers</li> */}
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <FiBarChart2 className="text-indigo-500" /> สถิติการใช้งาน
          </h3>
          <ul className="space-y-1">
            <li>โพสต์ทั้งหมด: {posts.length}</li>
            <li>ไลก์ที่ได้รับทั้งหมด: {totalLikes}</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <FaMedal className="text-yellow-500" /> Badge ล่าสุด
          </h3>
          {/* <div className="text-2xl flex gap-2 mt-2">
            <FaMedal className="text-yellow-500" />
            <FaMedal className="text-pink-500" />
            <FaMedal className="text-blue-500" />
          </div> */}
          <p className="text-xs text-gray-500 mt-2">
            เล่นต่อเพื่อปลดล็อก badge ใหม่!
          </p>
        </div>
      </div>

      {/* Floating Post Button */}
      <button
        onClick={() => navigate('/communityfeed')}
        className="cursor-pointer fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 hover:scale-110 text-white p-4 rounded-full shadow-lg transition-all duration-300 text-2xl"
        title="สร้างโพสต์"
      >
        <FiPlus />
      </button>
    </main>
  );
}
