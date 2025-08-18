import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";
import { COLORS } from "@/config/theme";
import {
  Users,
  ListChecks,
  Clock,
  Coins,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Eye,
  Calendar,
  Shield,
} from "lucide-react";
import { toast } from "react-hot-toast";

// --- Admin Dashboard Component ---
const AdminDashboard = () => {
  const navigate = useNavigate();

  // State for admin data
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecordings: 0,
    totalTokensIssued: 0,
  });
  const [allRecordings, setAllRecordings] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordingsPerPage = 10;

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsResponse, recordingsResponse, usersResponse] =
          await Promise.all([
            axios.get("/users/admin/stats"),
            axios.get("/recordings/admin"),
            axios.get("/users/admin/users"),
          ]);

        setStats(statsResponse.data.data);
        setAllRecordings(recordingsResponse.data.data);
        setAllUsers(usersResponse.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load admin data");
        console.error("Error loading admin data:", err);

        // If unauthorized, redirect to login
        if (err.response?.status === 401 || err.response?.status === 403) {
          toast.error("Access denied. Admin privileges required.");
          navigate("/auth/signin");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  // Pagination logic
  const totalPages = Math.ceil(allRecordings.length / recordingsPerPage);
  const startIndex = (currentPage - 1) * recordingsPerPage;
  const endIndex = startIndex + recordingsPerPage;
  const currentRecordings = allRecordings.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Helper functions
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const secondsToMMSS = (seconds) => {
    if (!seconds || seconds === 0) return "0:00";
    return `${Math.floor(seconds / 60)}:${String(
      Math.round(seconds % 60)
    ).padStart(2, "0")}`;
  };

  const getUserNameById = (userId) => {
    const user = allUsers.find((u) => u._id === userId);
    return user ? user.name : "Unknown User";
  };

  const handleDeleteRecording = async (recordingId) => {
    if (!confirm("Are you sure you want to delete this recording?")) {
      return;
    }

    try {
      await axios.delete(`/recordings/admin/${recordingId}`);
      setAllRecordings(allRecordings.filter((rec) => rec._id !== recordingId));
      toast.success("Recording deleted successfully");

      // Update stats
      setStats((prev) => ({
        ...prev,
        totalRecordings: prev.totalRecordings - 1,
      }));
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to delete recording"
      );
    }
  };

  const handleEvaluateRecording = async (recordingId) => {
    try {
      await axios.post(`/recordings/admin/${recordingId}/evaluate`);
      toast.success("Recording evaluation initiated");

      // Refresh recordings to show updated status
      const recordingsResponse = await axios.get("/recordings/admin");
      setAllRecordings(recordingsResponse.data.data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to evaluate recording"
      );
    }
  };

  if (loading) {
    return (
      <div
        style={{ background: "transparent" }}
        className="min-h-screen flex items-center justify-center p-8"
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: COLORS.teaGreen }}
          ></div>
          <p style={{ color: COLORS.cadetGray }}>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{ background: "transparent" }}
        className="min-h-screen flex items-center justify-center p-8"
      >
        <div
          className="text-center max-w-md p-8 rounded-2xl"
          style={{
            background: `linear-gradient(145deg, #ff000010, #ff000005)`,
            border: `1px solid #ff000020`,
          }}
        >
          <p className="text-red-400 mb-4 font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 text-lg font-semibold rounded-full transition-all group"
            style={{ background: COLORS.teaGreen, color: COLORS.midnightGreen }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const statsArray = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: <Users size={24} />,
    },
    {
      label: "Total Recordings",
      value: stats.totalRecordings,
      icon: <ListChecks size={24} />,
    },
    {
      label: "Tokens Issued",
      value: stats.totalTokensIssued,
      icon: <Coins size={24} />,
    },
  ];

  return (
    <div
      style={{ background: "transparent" }}
      className="relative min-h-screen p-8 md:p-16 overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto my-10">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row justify-between md:items-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <h1
              className="text-5xl font-extrabold flex items-center"
              style={{ color: COLORS.nyanza }}
            >
              <Shield
                className="mr-4"
                size={48}
                style={{ color: COLORS.teaGreen }}
              />
              Admin Dashboard
            </h1>
            <p className="text-lg mt-2" style={{ color: COLORS.cadetGray }}>
              Manage users, recordings, and platform statistics.
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {statsArray.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="p-6 rounded-2xl"
              style={{
                background: `linear-gradient(145deg, ${COLORS.midnightGreen}40, #002a3580)`,
                border: `1px solid ${COLORS.cadetGray}20`,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center justify-between mb-4">
                <p
                  className="text-sm font-medium"
                  style={{ color: COLORS.cadetGray }}
                >
                  {stat.label}
                </p>
                <span style={{ color: COLORS.teaGreen }}>{stat.icon}</span>
              </div>
              <p
                className="text-4xl font-bold"
                style={{ color: COLORS.nyanza }}
              >
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* All Recordings List */}
        <motion.div
          className="p-6 md:p-8 rounded-2xl"
          style={{
            background: `linear-gradient(145deg, ${COLORS.midnightGreen}40, #002a3580)`,
            border: `1px solid ${COLORS.cadetGray}20`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: COLORS.nyanza }}
          >
            All Recordings ({allRecordings.length})
          </h2>

          {allRecordings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg mb-6" style={{ color: COLORS.cadetGray }}>
                No recordings found.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Table Header */}
              <div
                className="hidden md:grid grid-cols-8 gap-4 px-4 py-2 text-xs font-bold uppercase"
                style={{ color: COLORS.cadetGray }}
              >
                <div className="col-span-1">User</div>
                <div className="col-span-1">Domain</div>
                <div className="col-span-1">Language</div>
                <div className="col-span-1">Date</div>
                <div className="col-span-1 text-center">Duration</div>
                <div className="col-span-1 text-center">Quality</div>
                <div className="col-span-1 text-center">Actions</div>
              </div>

              {/* Table Body */}
              {currentRecordings.map((rec: any, index) => (
                <motion.div
                  key={rec._id}
                  className="grid grid-cols-2 md:grid-cols-8 gap-4 items-center p-4 rounded-lg"
                  style={{
                    background: `${COLORS.midnightGreen}30`,
                    color: COLORS.nyanza,
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.05 }}
                >
                  <div className="md:col-span-1">
                    <span
                      className="md:hidden font-bold text-xs uppercase"
                      style={{ color: COLORS.cadetGray }}
                    >
                      User:
                    </span>
                    <span className="text-sm">
                      {getUserNameById(rec.userId)}
                    </span>
                  </div>

                  <div className="md:col-span-1">
                    <span
                      className="md:hidden font-bold text-xs uppercase"
                      style={{ color: COLORS.cadetGray }}
                    >
                      Domain:
                    </span>
                    {rec.domain}
                  </div>

                  <div className="md:col-span-1">
                    <span
                      className="md:hidden font-bold text-xs uppercase"
                      style={{ color: COLORS.cadetGray }}
                    >
                      Language:
                    </span>
                    {rec.language}
                  </div>

                  <div className="md:col-span-1">
                    <span
                      className="md:hidden font-bold text-xs uppercase"
                      style={{ color: COLORS.cadetGray }}
                    >
                      Date:
                    </span>
                    {formatDate(rec.createdAt)}
                  </div>

                  <div className="md:col-span-1 text-left md:text-center">
                    <span
                      className="md:hidden font-bold text-xs uppercase"
                      style={{ color: COLORS.cadetGray }}
                    >
                      Duration:
                    </span>
                    {secondsToMMSS(rec.duration)}
                  </div>

                  <div className="md:col-span-1 text-left md:text-center">
                    <span
                      className="md:hidden font-bold text-xs uppercase"
                      style={{ color: COLORS.cadetGray }}
                    >
                      Quality:
                    </span>
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize"
                      style={{
                        background: rec.quality
                          ? rec.quality === "excellent"
                            ? `${COLORS.teaGreen}20`
                            : rec.quality === "good"
                            ? `#fbbf2420`
                            : rec.quality === "average"
                            ? `#f97316220`
                            : `#ef444420`
                          : `${COLORS.cadetGray}20`,
                        color: rec.quality
                          ? rec.quality === "excellent"
                            ? COLORS.teaGreen
                            : rec.quality === "good"
                            ? "#fbbf24"
                            : rec.quality === "average"
                            ? "#f97316"
                            : "#ef4444"
                          : COLORS.cadetGray,
                      }}
                    >
                      {rec.quality || "Pending"}
                    </span>
                  </div>

                  <div className="md:col-span-1 text-left md:text-center">
                    <div className="flex gap-2 justify-start md:justify-center">
                      {!rec.quality && (
                        <button
                          onClick={() => handleEvaluateRecording(rec._id)}
                          className="p-2 rounded-lg transition-all"
                          style={{
                            background: `${COLORS.teaGreen}20`,
                            color: COLORS.teaGreen,
                          }}
                          title="Evaluate Recording"
                        >
                          <Eye size={16} />
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteRecording(rec._id)}
                        className="p-2 rounded-lg transition-all hover:bg-red-500/20"
                        style={{
                          background: "#ef444420",
                          color: "#ef4444",
                        }}
                        title="Delete Recording"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  className="flex items-center justify-center mt-8 pt-6 border-t"
                  style={{ borderColor: `${COLORS.cadetGray}20` }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                >
                  {/* Previous Button */}
                  <button
                    onClick={goToPrevious}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-10 h-10 rounded-lg mr-3 transition-all"
                    style={{
                      background:
                        currentPage === 1
                          ? `${COLORS.midnightGreen}20`
                          : `${COLORS.teaGreen}20`,
                      color:
                        currentPage === 1 ? COLORS.cadetGray : COLORS.teaGreen,
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    }}
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className="flex items-center justify-center w-10 h-10 rounded-lg text-sm font-semibold transition-all"
                          style={{
                            background:
                              page === currentPage
                                ? COLORS.teaGreen
                                : `${COLORS.midnightGreen}20`,
                            color:
                              page === currentPage
                                ? COLORS.midnightGreen
                                : COLORS.cadetGray,
                          }}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={goToNext}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center w-10 h-10 rounded-lg ml-3 transition-all"
                    style={{
                      background:
                        currentPage === totalPages
                          ? `${COLORS.midnightGreen}20`
                          : `${COLORS.teaGreen}20`,
                      color:
                        currentPage === totalPages
                          ? COLORS.cadetGray
                          : COLORS.teaGreen,
                      cursor:
                        currentPage === totalPages ? "not-allowed" : "pointer",
                    }}
                  >
                    <ChevronRight size={18} />
                  </button>

                  {/* Page Info */}
                  <div
                    className="ml-6 text-sm"
                    style={{ color: COLORS.cadetGray }}
                  >
                    Showing {startIndex + 1}-
                    {Math.min(endIndex, allRecordings.length)} of{" "}
                    {allRecordings.length} recordings
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
