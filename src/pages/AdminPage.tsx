import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, isAdmin } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { Tool } from "../lib/supabase";
import { ToolUploadForm } from "../components/ToolUploadForm";
import { useToast } from "../contexts/ToastContext";

interface UserSuggestion {
  id: string;
  name: string;
  image_link: string;
  website_link: string;
  description: string;
  launch_video_link?: string;
  category: string;
  tags: string[];
  user_id: string;
  user_email: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

interface AdminEmail {
  id: string;
  email: string;
  added_by: string;
  created_at: string;
}

export function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [tools, setTools] = useState<Tool[]>([]);
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [stats, setStats] = useState({ totalTools: 0, totalUsers: 0 });
  const [selectedToolForTOTD, setSelectedToolForTOTD] = useState<string>("");
  const [editingSuggestion, setEditingSuggestion] = useState<UserSuggestion | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<UserSuggestion>>({});
  const [editTagInput, setEditTagInput] = useState("");
  const [adminEmails, setAdminEmails] = useState<AdminEmail[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [toolSearchQuery, setToolSearchQuery] = useState("");
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [editToolFormData, setEditToolFormData] = useState<Partial<Tool>>({});
  const [editToolTagInput, setEditToolTagInput] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Filter tools based on search query
  const filteredTools = useMemo(() => {
    if (!toolSearchQuery.trim()) return tools;
    
    const query = toolSearchQuery.toLowerCase();
    return tools.filter(tool =>
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.category.toLowerCase().includes(query) ||
      (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  }, [tools, toolSearchQuery]);

  const fetchData = async () => {
    // Fetch tools
    const { data: toolsData } = await supabase
      .from("tools")
      .select("*")
      .order("created_at", { ascending: false });

    if (toolsData) {
      setTools(toolsData);
      setStats((prev) => ({ ...prev, totalTools: toolsData.length }));
    }

    // Fetch user suggestions
    const { data: suggestionsData } = await supabase
      .from("user_suggestions")
      .select("*")
      .order("created_at", { ascending: false });

    if (suggestionsData) {
      setSuggestions(suggestionsData);
    }

    // Fetch admin emails
    const { data: adminEmailsData } = await supabase
      .from("admin_emails")
      .select("*")
      .order("created_at", { ascending: false });

    if (adminEmailsData) {
      setAdminEmails(adminEmailsData);
    }
  };

  useEffect(() => {
    let isInitialLoad = true;

    // Check if user is authenticated and is admin
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || !(await isAdmin(user.email))) {
        setUnauthorized(true);
        setLoading(false);
        setTimeout(() => navigate("/"), 1500);
        return;
      }

      setUser(user);
      setLoading(false);
      fetchData();
      isInitialLoad = false;
    };

    init();

    // Listen for auth changes (but skip on initial load)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (isInitialLoad) return; // Skip the initial SIGNED_IN event
      
      if (!session || !(await isAdmin(session.user.email))) {
        navigate("/");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const addAdminEmail = async () => {
    if (!newAdminEmail.trim()) {
      showToast("Please enter an email", "error");
      return;
    }

    const email = newAdminEmail.trim().toLowerCase();
    
    // Check if email already exists
    if (adminEmails.some(admin => admin.email === email)) {
      showToast("This email is already an admin", "error");
      return;
    }

    try {
      const { error } = await supabase.from("admin_emails").insert([
        {
          email: email,
          added_by: user?.email,
        },
      ]);

      if (error) throw error;

      showToast("Admin email added successfully!", "success");
      setNewAdminEmail("");
      fetchData();
    } catch (error) {
      console.error("Error adding admin email:", error);
      showToast("Failed to add admin email. Please try again.", "error");
    }
  };

  const removeAdminEmail = async (id: string, email: string) => {
    if (email === user?.email) {
      showToast("You cannot remove yourself as an admin", "error");
      return;
    }

    if (!confirm(`Remove ${email} from admin list?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("admin_emails")
        .delete()
        .eq("id", id);

      if (error) throw error;

      showToast("Admin email removed successfully!", "success");
      fetchData();
    } catch (error) {
      console.error("Error removing admin email:", error);
      showToast("Failed to remove admin email", "error");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleUploadSuccess = () => {
    setShowUploadForm(false);
    fetchData();
  };

  const setToolOfTheDay = async () => {
    if (!selectedToolForTOTD) return;

    try {
      const today = new Date().toISOString().split("T")[0];

      // Delete existing TOTD for today
      await supabase.from("tool_of_the_day").delete().eq("date", today);

      // Insert new TOTD
      const { error } = await supabase.from("tool_of_the_day").insert([
        {
          tool_id: selectedToolForTOTD,
          date: today,
        },
      ]);

      if (error) throw error;

      showToast("Tool of the Day set successfully!", "success");
      setSelectedToolForTOTD("");
    } catch (error) {
      console.error("Error setting TOTD:", error);
      showToast("Failed to set Tool of the Day", "error");
    }
  };

  const approveSuggestion = async (suggestion: UserSuggestion) => {
    try {
      // Insert into tools table
      const { error: insertError } = await supabase.from("tools").insert([
        {
          name: suggestion.name,
          image_link: suggestion.image_link,
          website_link: suggestion.website_link,
          description: suggestion.description,
          launch_video_link: suggestion.launch_video_link || null,
          category: suggestion.category,
          tags: suggestion.tags,
        },
      ]);

      if (insertError) throw insertError;

      // Update suggestion status
      const { error: updateError } = await supabase
        .from("user_suggestions")
        .update({ status: "approved" })
        .eq("id", suggestion.id);

      if (updateError) throw updateError;

      showToast("Suggestion approved and added to tools!", "success");
      fetchData();
    } catch (error) {
      console.error("Error approving suggestion:", error);
      showToast("Failed to approve suggestion", "error");
    }
  };

  const handleEditTool = (tool: Tool) => {
    setEditingTool(tool);
    setEditToolFormData({
      name: tool.name,
      image_link: tool.image_link,
      website_link: tool.website_link,
      description: tool.description,
      launch_video_link: tool.launch_video_link || "",
      category: tool.category,
      tags: tool.tags || [],
    });
  };

  const handleEditToolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTool) return;

    try {
      // Validation
      if (!editToolFormData.name || !editToolFormData.image_link || !editToolFormData.description || !editToolFormData.website_link || !editToolFormData.category) {
        showToast("Please fill in all required fields", "error");
        return;
      }

      // Update tool in database
      const { error } = await supabase
        .from("tools")
        .update({
          name: editToolFormData.name,
          image_link: editToolFormData.image_link,
          website_link: editToolFormData.website_link,
          description: editToolFormData.description,
          launch_video_link: editToolFormData.launch_video_link || null,
          category: editToolFormData.category,
          tags: editToolFormData.tags && editToolFormData.tags.length > 0 ? editToolFormData.tags : null,
        })
        .eq("id", editingTool.id);

      if (error) throw error;

      showToast("Tool updated successfully!", "success");
      setEditingTool(null);
      setEditToolFormData({});
      fetchData();
    } catch (error) {
      console.error("Error updating tool:", error);
      showToast("Failed to update tool. Please try again.", "error");
    }
  };

  const handleAddToolTag = () => {
    if (editToolTagInput.trim() && editToolFormData.tags) {
      setEditToolFormData({
        ...editToolFormData,
        tags: [...editToolFormData.tags, editToolTagInput.trim()],
      });
      setEditToolTagInput("");
    }
  };

  const handleRemoveToolTag = (tagToRemove: string) => {
    if (editToolFormData.tags) {
      setEditToolFormData({
        ...editToolFormData,
        tags: editToolFormData.tags.filter((tag) => tag !== tagToRemove),
      });
    }
  };

  const handleEditSuggestion = (suggestion: UserSuggestion) => {
    setEditingSuggestion(suggestion);
    setEditFormData({
      name: suggestion.name,
      image_link: suggestion.image_link,
      website_link: suggestion.website_link,
      description: suggestion.description,
      launch_video_link: suggestion.launch_video_link || "",
      category: suggestion.category,
      tags: suggestion.tags || [],
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSuggestion) return;

    try {
      // Validation
      if (!editFormData.name || !editFormData.image_link || !editFormData.description || !editFormData.website_link || !editFormData.category) {
        showToast("Please fill in all required fields", "error");
        return;
      }

      // Insert into tools table with edited data
      const { error: insertError } = await supabase.from("tools").insert([
        {
          name: editFormData.name,
          image_link: editFormData.image_link,
          website_link: editFormData.website_link,
          description: editFormData.description,
          launch_video_link: editFormData.launch_video_link || null,
          category: editFormData.category,
          tags: editFormData.tags && editFormData.tags.length > 0 ? editFormData.tags : null,
        },
      ]);

      if (insertError) throw insertError;

      // Update suggestion status
      const { error: updateError } = await supabase
        .from("user_suggestions")
        .update({ status: "approved" })
        .eq("id", editingSuggestion.id);

      if (updateError) throw updateError;

      showToast("Tool edited and approved successfully!", "success");
      setEditingSuggestion(null);
      setEditFormData({});
      fetchData();
    } catch (error) {
      console.error("Error editing and approving suggestion:", error);
      showToast("Failed to edit and approve suggestion", "error");
    }
  };

  const addEditTag = () => {
    if (editTagInput.trim() && !editFormData.tags?.includes(editTagInput.trim())) {
      setEditFormData({
        ...editFormData,
        tags: [...(editFormData.tags || []), editTagInput.trim()],
      });
      setEditTagInput("");
    }
  };

  const removeEditTag = (tag: string) => {
    setEditFormData({
      ...editFormData,
      tags: editFormData.tags?.filter((t) => t !== tag),
    });
  };

  const rejectSuggestion = async (id: string) => {
    try {
      const { error } = await supabase
        .from("user_suggestions")
        .update({ status: "rejected" })
        .eq("id", id);

      if (error) throw error;

      showToast("Suggestion rejected", "info");
      fetchData();
    } catch (error) {
      console.error("Error rejecting suggestion:", error);
      showToast("Failed to reject suggestion", "error");
    }
  };

  const deleteSuggestion = async (id: string) => {
    try {
      const { error } = await supabase
        .from("user_suggestions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      showToast("Suggestion deleted", "success");
      fetchData();
    } catch (error) {
      console.error("Error deleting suggestion:", error);
      showToast("Failed to delete suggestion", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </div>
          <div className="text-gray-600 dark:text-gray-400 mb-4">
            You don't have permission to access this page.
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-500">
            Redirecting to home...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen bg-[#FAFAFA] dark:bg-black transition-colors duration-150 overflow-y-auto">
      {/* Top Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black sticky top-0 z-10 backdrop-blur-xl bg-white/80 dark:bg-black/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-150"
              >
                ← Back to Home
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm bg-black dark:bg-white dark:text-black text-white hover:bg-gray-800 dark:hover:bg-gray-100 rounded-md transition-all duration-150 shadow-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Tools</p>
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">{stats.totalTools}</p>
          </div>
          <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pending Submissions</p>
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">
              {suggestions.filter(s => s.status === "pending").length}
            </p>
          </div>
          <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Users</p>
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">{stats.totalUsers}</p>
          </div>
        </div>

        {/* Tool of the Day Selector */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tool of the Day
          </h2>
          <div className="flex gap-3">
            <select
              value={selectedToolForTOTD}
              onChange={(e) => setSelectedToolForTOTD(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm"
            >
              <option value="">Select a tool...</option>
              {tools.map((tool) => (
                <option key={tool.id} value={tool.id}>
                  {tool.name} ({tool.category})
                </option>
              ))}
            </select>
            <button
              onClick={setToolOfTheDay}
              disabled={!selectedToolForTOTD}
              className="px-6 py-2 bg-black dark:bg-white dark:text-black text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              Set as TOTD
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setShowUploadForm(true)}
              className="px-4 py-2 bg-black dark:bg-white dark:text-black text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              + Add New Tool
            </button>
          </div>
        </div>

        {/* Admin Management */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Admin Management
          </h2>
          
          {/* Add New Admin */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Add New Admin Email
            </label>
            <div className="flex gap-3">
              <input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="admin@example.com"
                className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm"
              />
              <button
                onClick={addAdminEmail}
                className="px-6 py-2 bg-black dark:bg-white dark:text-black text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Add Admin
              </button>
            </div>
          </div>

          {/* Admin List */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Current Admins ({adminEmails.length})
            </h3>
            <div className="space-y-2">
              {adminEmails.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8 text-sm">
                  No admin emails in database. Add them here!
                </p>
              ) : (
                adminEmails.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {admin.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Added by: {admin.added_by} • {new Date(admin.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeAdminEmail(admin.id, admin.email)}
                      disabled={admin.email === user?.email}
                      className="px-3 py-1.5 text-xs border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* All Tools with Search */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              All Tools ({filteredTools.length})
            </h2>
          </div>
          
          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search tools by name, description, category, or tags..."
              value={toolSearchQuery}
              onChange={(e) => setToolSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredTools.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-12 text-sm">
                {toolSearchQuery ? "No tools found matching your search" : "No tools yet"}
              </p>
            ) : (
              filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-800"
                >
                  <img
                    src={tool.image_link}
                    alt={tool.name}
                    className="w-10 h-10 object-contain rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate">{tool.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{tool.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditTool(tool)}
                      className="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium"
                    >
                      Edit
                    </button>
                    <a
                      href={tool.website_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xs font-medium"
                    >
                      Visit →
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* User Suggestions */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            User Submissions
            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
              ({suggestions.filter(s => s.status === "pending").length} pending)
            </span>
          </h2>
          <div className="space-y-3">
            {suggestions.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-12 text-sm">No submissions yet</p>
            ) : (
              suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={suggestion.image_link}
                      alt={suggestion.name}
                      className="w-12 h-12 object-contain rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                            {suggestion.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {suggestion.user_email}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                            suggestion.status === "pending"
                              ? "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800"
                              : suggestion.status === "approved"
                              ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                              : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                          }`}
                        >
                          {suggestion.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                        {suggestion.description}
                      </p>
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-300">
                          {suggestion.category}
                        </span>
                        {suggestion.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 rounded text-xs border border-gray-200 dark:border-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <a
                          href={suggestion.website_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-3 py-1 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 dark:text-gray-300 rounded transition-colors"
                        >
                          Visit
                        </a>
                        {suggestion.launch_video_link && (
                          <a
                            href={suggestion.launch_video_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-3 py-1 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 dark:text-gray-300 rounded transition-colors"
                          >
                            Video
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {suggestion.status === "pending" && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                      <button
                        onClick={() => handleEditSuggestion(suggestion)}
                        className="flex-1 px-3 py-2 bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 text-white rounded-lg transition-colors text-xs font-medium"
                      >
                        Edit & Approve
                      </button>
                      <button
                        onClick={() => approveSuggestion(suggestion)}
                        className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-900 dark:text-white rounded-lg transition-colors text-xs font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectSuggestion(suggestion.id)}
                        className="px-3 py-2 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg transition-colors text-xs font-medium"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {suggestion.status !== "pending" && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                      <button
                        onClick={() => deleteSuggestion(suggestion.id)}
                        className="px-3 py-2 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-400 rounded-lg transition-colors text-xs font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <ToolUploadForm
          onSuccess={handleUploadSuccess}
          onCancel={() => setShowUploadForm(false)}
        />
      )}

      {/* Edit Tool Modal */}
      {editingTool && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-black rounded-xl p-6 max-w-lg w-full my-8 shadow-xl border border-gray-200 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Tool</h2>
              <button
                onClick={() => {
                  setEditingTool(null);
                  setEditToolFormData({});
                }}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl w-8 h-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-150"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleEditToolSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tool Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editToolFormData.name || ""}
                  onChange={(e) => setEditToolFormData({ ...editToolFormData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 transition-all duration-150"
                  placeholder="Enter tool name"
                  required
                />
              </div>

              {/* Image Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={editToolFormData.image_link || ""}
                  onChange={(e) => setEditToolFormData({ ...editToolFormData, image_link: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 transition-all duration-150"
                  placeholder="https://example.com/image.png"
                  required
                />
              </div>

              {/* Website Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={editToolFormData.website_link || ""}
                  onChange={(e) => setEditToolFormData({ ...editToolFormData, website_link: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 transition-all duration-150"
                  placeholder="https://example.com"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={editToolFormData.description || ""}
                  onChange={(e) => setEditToolFormData({ ...editToolFormData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 resize-none transition-all duration-150"
                  placeholder="Enter tool description"
                  rows={3}
                  required
                />
              </div>

              {/* Launch Video Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Launch Video URL (Optional)
                </label>
                <input
                  type="url"
                  value={editToolFormData.launch_video_link || ""}
                  onChange={(e) => setEditToolFormData({ ...editToolFormData, launch_video_link: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 transition-all duration-150"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={editToolFormData.category || ""}
                  onChange={(e) => setEditToolFormData({ ...editToolFormData, category: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-black text-gray-900 dark:text-white transition-all duration-150"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Design">Design</option>
                  <option value="Development">Development</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Analytics">Analytics</option>
                  <option value="Communication">Communication</option>
                  <option value="Finance">Finance</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editToolTagInput}
                    onChange={(e) => setEditToolTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddToolTag())}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 transition-all duration-150"
                    placeholder="Add a tag"
                  />
                  <button
                    type="button"
                    onClick={handleAddToolTag}
                    className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-900 dark:text-white rounded-md transition-all duration-150 font-medium"
                  >
                    Add
                  </button>
                </div>
                {editToolFormData.tags && editToolFormData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {editToolFormData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white rounded-md text-xs font-medium border border-gray-200 dark:border-gray-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveToolTag(tag)}
                          className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors duration-150"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Tool info */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Tool ID: <span className="font-medium text-gray-900 dark:text-white font-mono">{editingTool.id}</span>
                </p>
                {editingTool.created_at && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Created: <span className="font-medium text-gray-900 dark:text-white">{new Date(editingTool.created_at).toLocaleDateString()}</span>
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingTool(null);
                    setEditToolFormData({});
                  }}
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-900 dark:text-white rounded-md transition-all duration-150 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-sm bg-black dark:bg-white dark:text-black text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-150 font-medium shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Suggestion Modal */}
      {editingSuggestion && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-black rounded-xl p-6 max-w-lg w-full my-8 shadow-xl border border-gray-200 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit & Approve Tool</h2>
              <button
                onClick={() => {
                  setEditingSuggestion(null);
                  setEditFormData({});
                }}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl w-8 h-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-150"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tool Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editFormData.name || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 transition-all duration-150"
                  placeholder="Enter tool name"
                  required
                />
              </div>

              {/* Image Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={editFormData.image_link || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, image_link: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 transition-all duration-150"
                  placeholder="https://example.com/image.png"
                  required
                />
              </div>

              {/* Website Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={editFormData.website_link || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, website_link: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 transition-all duration-150"
                  placeholder="https://example.com"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={editFormData.description || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 resize-none transition-all duration-150"
                  placeholder="Enter tool description"
                  rows={3}
                  required
                />
              </div>

              {/* Launch Video Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Launch Video URL (Optional)
                </label>
                <input
                  type="url"
                  value={editFormData.launch_video_link || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, launch_video_link: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 transition-all duration-150"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={editFormData.category || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-black text-gray-900 dark:text-white transition-all duration-150"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Design">Design</option>
                  <option value="Development">Development</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Analytics">Analytics</option>
                  <option value="Communication">Communication</option>
                  <option value="Finance">Finance</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editTagInput}
                    onChange={(e) => setEditTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addEditTag())}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 transition-all duration-150"
                    placeholder="Add a tag"
                  />
                  <button
                    type="button"
                    onClick={addEditTag}
                    className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-900 dark:text-white rounded-md transition-all duration-150 font-medium"
                  >
                    Add
                  </button>
                </div>
                {editFormData.tags && editFormData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {editFormData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white rounded-md text-xs font-medium border border-gray-200 dark:border-gray-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeEditTag(tag)}
                          className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors duration-150"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Submitted by info */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Submitted by: <span className="font-medium text-gray-900 dark:text-white">{editingSuggestion.user_email}</span>
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Submitted on: <span className="font-medium text-gray-900 dark:text-white">{new Date(editingSuggestion.created_at).toLocaleDateString()}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingSuggestion(null);
                    setEditFormData({});
                  }}
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-900 dark:text-white rounded-md transition-all duration-150 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-sm bg-black dark:bg-white dark:text-black text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-150 font-medium shadow-sm"
                >
                  Save & Approve
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
