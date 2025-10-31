import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ArrowLeft } from "lucide-react";
import { useToast } from "../contexts/ToastContext";

export function SubmitPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    image_link: "",
    website_link: "",
    description: "",
    launch_video_link: "",
    category: "AI",
    tags: [] as string[],
  });
  const [currentTag, setCurrentTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("user_suggestions").insert([
        {
          ...formData,
          user_id: null,
          user_email: "anonymous",
          status: "pending",
        },
      ]);

      if (error) throw error;

      showToast("Tool submitted successfully! We'll review it soon.", "success");
      navigate("/");
    } catch (error) {
      console.error("Error submitting tool:", error);
      showToast("Failed to submit tool. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, currentTag.trim()] });
      setCurrentTag("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  return (
    <div className="min-h-screen h-screen w-screen overflow-y-auto overflow-x-hidden bg-white dark:bg-black transition-colors duration-150">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Submit a Tool
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Share your favorite tool with the community
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tool Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tool Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
              placeholder="e.g., ChatGPT"
            />
          </div>

          {/* Logo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Logo URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              required
              value={formData.image_link}
              onChange={(e) =>
                setFormData({ ...formData, image_link: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
              placeholder="https://example.com/logo.png"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Direct link to the tool's logo image
            </p>
          </div>

          {/* Website URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Website URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              required
              value={formData.website_link}
              onChange={(e) =>
                setFormData({ ...formData, website_link: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
              placeholder="https://example.com"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
              rows={4}
              placeholder="What does this tool do? What makes it unique?"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              A brief description of the tool and its main features
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
            >
              <option>AI</option>
              <option>Video</option>
              <option>Design</option>
              <option>Marketing</option>
              <option>Productivity</option>
              <option>Developer Tools</option>
              <option>Communication</option>
              <option>Analytics</option>
              <option>Finance</option>
              <option>Education</option>
              <option>Browsers</option>
              <option>Agents</option>
              <option>No Code</option>
              <option>Coding</option>
            </select>
          </div>

          {/* Launch Video URL (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Launch Video URL{" "}
              <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <input
              type="url"
              value={formData.launch_video_link}
              onChange={(e) =>
                setFormData({ ...formData, launch_video_link: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
              placeholder="https://youtube.com/..."
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Link to a demo or launch video (YouTube, Vimeo, etc.)
            </p>
          </div>

          {/* Tags (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
                placeholder="Add a tag and press Enter"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm flex items-center gap-2 border border-gray-200 dark:border-gray-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Tool"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
