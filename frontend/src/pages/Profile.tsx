import { useState, useEffect } from "react";
import { MotionCard } from "../components/MotionProvider";
import axios from "../config/axios.ts"; // Adjust the path based on your file structure

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  // Form states
  const [updateForm, setUpdateForm] = useState({
    name: "",
    email: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Loading states for forms
  const [updateLoading, setUpdateLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Success/Error messages
  const [updateMessage, setUpdateMessage] = useState({ type: "", text: "" });
  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });
  const [logoutMessage, setLogoutMessage] = useState({ type: "", text: "" });

  // Confirmation dialogs
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get("/users/current");
      const userData = response.data.data;

      setUser(userData);
      setUpdateForm({
        name: userData.name || "",
        email: userData.email || "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile");
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout - FIXED VERSION
  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      setLogoutMessage({ type: "", text: "" });

      // Make logout request to backend
      const response = await axios.post("/users/logout");

      console.log("Logout successful:", response.data);

      // Clear any local storage data
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Clear session storage as well
      sessionStorage.clear();

      // Show success message briefly before redirect
      setLogoutMessage({ type: "success", text: "Logged out successfully!" });

      // Small delay to show success message, then redirect
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (err) {
      console.error("Logout error:", err);

      // Show error message
      setLogoutMessage({
        type: "error",
        text: err.response?.data?.message || "Logout failed. Please try again.",
      });

      // Even if logout fails on server, we should still clear local data and redirect
      // This ensures user is logged out on frontend even if backend fails
      setTimeout(() => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/";
      }, 2000);
    } finally {
      setLogoutLoading(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE MY ACCOUNT") {
      alert('Please type "DELETE MY ACCOUNT" to confirm deletion');
      return;
    }

    try {
      setDeleteLoading(true);

      await axios.delete("/users/delete-account");

      // Clear any stored data
      localStorage.clear();
      sessionStorage.clear();

      // Show success message and redirect
      alert("Your account has been successfully deleted.");
      window.location.href = "/";
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to delete account. Please try again."
      );
      console.error("Delete account error:", err);
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
      setDeleteConfirmText("");
    }
  };

  // Handle account details update
  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateMessage({ type: "", text: "" });

    try {
      const response = await axios.put("/users/update-account", updateForm);

      setUpdateMessage({
        type: "success",
        text: response.data.message || "Account updated successfully!",
      });

      // Update local user state
      setUser((prev) => ({ ...prev, ...updateForm }));
    } catch (err) {
      setUpdateMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update account",
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage({ type: "", text: "" });

    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "New passwords do not match",
      });
      setPasswordLoading(false);
      return;
    }

    // Validate password strength
    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "New password must be at least 6 characters long",
      });
      setPasswordLoading(false);
      return;
    }

    try {
      const response = await axios.post("/users/change-password", {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });

      setPasswordMessage({
        type: "success",
        text: response.data.message || "Password changed successfully!",
      });

      // Reset form
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to change password",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle form input changes
  const handleUpdateFormChange = (e) => {
    setUpdateForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordFormChange = (e) => {
    setPasswordForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white py-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-white py-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">⚠️</div>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchUserProfile}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white py-24">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Profile</h1>
          <p className="text-slate-300">
            Manage your account settings and preferences.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "profile"
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Profile Details
          </button>
          <button
            onClick={() => setActiveTab("account")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "account"
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Update Account
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "password"
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Change Password
          </button>
        </div>

        {/* Profile Details Tab */}
        {activeTab === "profile" && (
          <MotionCard className="bg-slate-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Full Name
                </label>
                <p className="text-lg font-semibold">
                  {user?.name || "Not provided"}
                </p>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Email Address
                </label>
                <p className="text-lg font-semibold">
                  {user?.email || "Not provided"}
                </p>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Member Since
                </label>
                <p className="text-lg font-semibold">
                  {user?.createdAt
                    ? formatDate(user.createdAt)
                    : "Not available"}
                </p>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Account Status
                </label>
                <span className="inline-block px-3 py-1 rounded-full text-sm bg-green-500/10 text-green-400">
                  Active
                </span>
              </div>
            </div>
          </MotionCard>
        )}

        {/* Update Account Tab */}
        {activeTab === "account" && (
          <MotionCard className="bg-slate-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Update Account Details</h2>

            {updateMessage.text && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  updateMessage.type === "success"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {updateMessage.text}
              </div>
            )}

            <form onSubmit={handleUpdateAccount} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={updateForm.name}
                  onChange={handleUpdateFormChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={updateForm.email}
                  onChange={handleUpdateFormChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={updateLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {updateLoading ? "Updating..." : "Update Account"}
              </button>
            </form>
          </MotionCard>
        )}

        {/* Change Password Tab */}
        {activeTab === "password" && (
          <MotionCard className="bg-slate-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Change Password</h2>

            {passwordMessage.text && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  passwordMessage.type === "success"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {passwordMessage.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <label
                  htmlFor="oldPassword"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  id="oldPassword"
                  name="oldPassword"
                  value={passwordForm.oldPassword}
                  onChange={handlePasswordFormChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your current password"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordFormChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your new password"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordFormChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm your new password"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {passwordLoading ? "Changing Password..." : "Change Password"}
              </button>
            </form>
          </MotionCard>
        )}

        {/* Account Actions - Logout and Delete Account */}
        <div className="mt-12 space-y-4">
          {/* Logout Button */}
          <MotionCard className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Logout</h3>
                <p className="text-slate-400 text-sm">
                  Sign out of your account on this device.
                </p>
              </div>
              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="px-6 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {logoutLoading ? "Logging out..." : "Logout"}
              </button>
            </div>

            {/* Logout Message */}
            {logoutMessage.text && (
              <div
                className={`mt-4 p-3 rounded-lg ${
                  logoutMessage.type === "success"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {logoutMessage.text}
              </div>
            )}
          </MotionCard>

          {/* Delete Account Section */}
          <MotionCard className="bg-slate-800 rounded-xl p-6 border border-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-red-400">
                  Danger Zone
                </h3>
                <p className="text-slate-400 text-sm">
                  Permanently delete your account and all associated data.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </MotionCard>
        </div>

        {/* Delete Account Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl p-8 max-w-md w-full border border-red-500/20">
              <div className="text-center mb-6">
                <div className="text-red-400 text-4xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-red-400 mb-2">
                  Delete Account
                </h3>
                <p className="text-slate-300 text-sm">
                  This action cannot be undone. This will permanently delete
                  your account and remove all associated data.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Type{" "}
                  <span className="font-bold text-red-400">
                    "DELETE MY ACCOUNT"
                  </span>{" "}
                  to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="DELETE MY ACCOUNT"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText("");
                  }}
                  className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={
                    deleteLoading || deleteConfirmText !== "DELETE MY ACCOUNT"
                  }
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
