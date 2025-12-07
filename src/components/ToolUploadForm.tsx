import { useState } from "react";
import { supabase } from "../lib/supabase";
import type { Tool } from "../lib/supabase";
import { Upload } from "lucide-react";
import { uploadImage, validateImageFile, downloadAndUploadImage } from "../lib/storage";

interface ToolUploadFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function ToolUploadForm({ onSuccess, onCancel }: ToolUploadFormProps) {
  const [formData, setFormData] = useState<Partial<Tool>>({
    name: "",
    description: "",
    website_link: "",
    launch_video_link: "",
    tags: [],
    category: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid image file");
      return;
    }

    setImageFile(file);
    setError(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!formData.name || (!imageFile && uploadMode === "file") || (!imageUrl.trim() && uploadMode === "url") || !formData.description || !formData.website_link || !formData.category) {
      setError("Please fill in all required fields and provide an image");
      setLoading(false);
      return;
    }

    try {
      // Upload image first
      let finalImageUrl: string | null = null;
      
      if (uploadMode === "file" && imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      } else if (uploadMode === "url" && imageUrl.trim()) {
        finalImageUrl = await downloadAndUploadImage(imageUrl.trim());
      }
      
      if (!finalImageUrl) {
        throw new Error("Failed to upload image");
      }

      const { error: insertError } = await supabase.from("tools").insert([
        {
          name: formData.name,
          image_link: finalImageUrl,
          description: formData.description,
          website_link: formData.website_link,
          launch_video_link: formData.launch_video_link || null,
          tags: formData.tags && formData.tags.length > 0 ? formData.tags : null,
          category: formData.category,
        },
      ]);

      if (insertError) throw insertError;

      onSuccess();
    } catch (err) {
      console.error("Error uploading tool:", err);
      setError(err instanceof Error ? err.message : "Failed to upload tool");
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t) => t !== tag),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-black rounded-xl p-6 max-w-lg w-full my-8 shadow-xl border border-gray-200 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upload New Tool</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 rounded-full hover:bg-gray-100 transition-all"
          >
            x
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tool Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Figma"
              required
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Logo Image <span className="text-red-500">*</span>
            </label>
            
            {/* Toggle between File Upload and URL */}
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setUploadMode("file")}
                className={`flex-1 px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
                  uploadMode === "file"
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setUploadMode("url")}
                className={`flex-1 px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
                  uploadMode === "url"
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                Use URL
              </button>
            </div>

            {uploadMode === "file" ? (
              <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 transition-all">
                <div className="flex flex-col items-center gap-2">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-24 h-24 object-contain rounded" />
                  ) : (
                    <Upload size={32} className="text-gray-400" />
                  )}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {imageFile ? imageFile.name : "Click to upload logo"}
                  </span>
                  <span className="text-xs text-gray-500">
                    PNG, JPG, GIF, WebP, SVG (max 5MB)
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm"
                  placeholder="https://example.com/logo.png"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  We'll download and store this image permanently
                </p>
              </div>
            )}
          </div>

          {/* Website Link */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Website URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={formData.website_link}
              onChange={(e) => setFormData({ ...formData, website_link: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="A brief description of the tool..."
              rows={3}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a category</option>
              <option value="browsers">browsers</option>
              <option value="ai">ai</option>
              <option value="no code">no code</option>
              <option value="design">design</option>
              <option value="coding">coding</option>
              <option value="video">video</option>
              <option value="tools">tools</option>
              <option value="development tools">development tools</option>
              <option value="social">social</option>
              <option value="finance">finance</option>
              <option value="health">health</option>
              <option value="education">education</option>
              <option value="sports">sports</option>
              <option value="travel">travel</option>
              <option value="food">food</option>
              <option value="music">music</option>
              <option value="gaming">gaming</option>
            </select>
          </div>

          {/* Launch Video Link (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Launch Video URL <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <input
              type="url"
              value={formData.launch_video_link}
              onChange={(e) => setFormData({ ...formData, launch_video_link: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          {/* Tags (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tags <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a tag and press Enter"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
              >
                Add
              </button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Upload Tool"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
