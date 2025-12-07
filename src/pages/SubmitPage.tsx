import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ArrowLeft, Upload, ChevronDown } from "lucide-react";
import { useToast } from "../contexts/ToastContext";
import { uploadImage, validateImageFile, downloadAndUploadImage } from "../lib/storage";
import { Listbox } from "@headlessui/react";
import categories from "@/constants/categories";

export function SubmitPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    website_link: "",
    description: "",
    launch_video_link: "",
    category: "browsers",
    tags: [] as string[],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [currentTag, setCurrentTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      showToast(validation.error || "Invalid image file", "error");
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      let finalImageUrl = "https://via.placeholder.com/150"; // Default placeholder
      
      // Upload image if provided (file or URL)
      if (uploadMode === "file" && imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        } else {
          showToast("Failed to upload image. Using placeholder.", "error");
        }
      } else if (uploadMode === "url" && imageUrl.trim()) {
        showToast("Downloading and uploading image...", "info");
        const uploadedUrl = await downloadAndUploadImage(imageUrl.trim());
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        } else {
          showToast("Failed to download image. Using placeholder.", "error");
        }
      }

      const { error } = await supabase.from("user_suggestions").insert([
        {
          ...formData,
          image_link: finalImageUrl,
          user_id: null,
          user_email: "anonymous",
          status: "pending",
        },
      ]);

      if (error) throw error;

      showToast(
        "Tool submitted successfully! We'll review it soon.",
        "success"
      );
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
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
              placeholder="e.g., ChatGPT"
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Logo Image <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            
            {/* Toggle between File Upload and URL */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setUploadMode("file")}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
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
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  uploadMode === "url"
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                Use URL
              </button>
            </div>

            {uploadMode === "file" ? (
              <div className="flex flex-col gap-3">
                <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 transition-all bg-white dark:bg-gray-900">
                  <div className="flex flex-col items-center gap-2">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-24 h-24 object-contain rounded" />
                    ) : (
                      <Upload size={32} className="text-gray-400" />
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {imageFile ? imageFile.name : "Click to upload logo"}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-500">
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
              </div>
            ) : (
              <div>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
                  placeholder="https://example.com/logo.png"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  We'll download this image and store it permanently in our storage
                </p>
              </div>
            )}
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {uploadMode === "file" 
                ? "Upload the tool's logo image. If not provided, a placeholder will be used."
                : "Provide an image URL and we'll download and store it permanently."}
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
            <Listbox
              value={formData.category}
              onChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <div className="relative">
                <Listbox.Button className="w-full px-4 py-3 text-left border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all flex items-center justify-between">
                  <span>{formData.category}</span>
                  <ChevronDown
                    size={20}
                    className="text-gray-500 dark:text-gray-400"
                  />
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white dark:bg-gray-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {categories.map((category) => (
                    <Listbox.Option
                      key={category.value}
                      value={category.value}
                      className={({ active }) =>
                        `cursor-default select-none relative py-2 pl-10 pr-4 ${
                          active
                            ? "bg-blue-100 dark:bg-blue-900 text-black dark:text-white"
                            : "text-gray-900 dark:text-gray-200"
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {category.label}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400">
                              ✓
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
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
