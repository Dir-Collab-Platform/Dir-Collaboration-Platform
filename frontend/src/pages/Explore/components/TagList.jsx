import { useState } from 'react';
import { Plus, X, Check } from 'lucide-react';
import { createCustomTag, deleteCustomTag } from '../api/repoService';

// User-friendly color names mapped to hex values for the backend
const TAG_COLORS = [
  { name: "Indigo", hex: "#4f46e5" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Rose", hex: "#f43f5e" },
  { name: "Amber", hex: "#f59e0b" },
  { name: "Sky", hex: "#0ea5e9" },
  { name: "Violet", hex: "#8b5cf6" }
];

const TagList = ({ tags, setTags, selectedTag, setSelectedTag }) => {
  const [isInputMode, setIsInputMode] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim() || isProcessing) return;

    setIsProcessing(true);
    // Send name, description, and hex color to the mock API
    const res = await createCustomTag(newTagName, description, selectedColor.hex);
    
    if (res.status === "success") {
      setTags((prev) => [...prev, res.data]);
      // Reset form states
      setNewTagName("");
      setDescription("");
      setSelectedColor(TAG_COLORS[0]);
      setIsInputMode(false);
    }
    setIsProcessing(false);
  };

  const handleDelete = async (e, tagId) => {
    e.stopPropagation(); // Prevent triggering the filter toggle
    if (isProcessing) return;

    setIsProcessing(true);
    const res = await deleteCustomTag(tagId);
    if (res.status === "success") {
      setTags((prev) => prev.filter(t => (t._id || t.name) !== tagId));
      // If we deleted the active filter, clear it
      if (selectedTag === tagId) setSelectedTag("");
    }
    setIsProcessing(false);
  };

  const toggleFilter = (tagName) => {
    // If clicking the same tag, clear filter; otherwise, set new filter
    setSelectedTag(selectedTag === tagName ? "" : tagName);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-full">
        <h3 className='text-center text-(--secondary-text-color) text-[15px] mb-3 font-medium'>Topics</h3>
        <hr className='border-t border-(--main-border-color) w-full mb-3' />
      </div>

      {/* Topics List */}
      <div className="flex flex-wrap justify-center gap-x-2 gap-y-3 mb-3">
        {tags.map((tag) => {
          const tagName = tag.name || tag.label?.toLowerCase();
          const isActive = selectedTag === tagName;

          return (
            <button
              key={tag._id || tagName}
              onClick={() => toggleFilter(tagName)}
              className={`group px-4 py-1 text-sm rounded-full border transition-all flex items-center gap-2 cursor-pointer 
                ${isActive 
                  ? 'bg-(--primary-button) border-white text-white shadow-lg' 
                  : 'bg-(--meta-tag-color) border-(--main-border-color) text-(--secondary-text-color) hover:bg-(--secondary-button-hover)'
                }`}
            >
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: isActive ? "#fff" : tag.color }} 
              />
              {tag.label || tag.name}
              
              {/* Only show delete on custom tags */}
              {tag._id && (
                <X
                  size={14}
                  className="ml-1 opacity-0 group-hover:opacity-100 hover:text-red-400 transition"
                  onClick={(e) => handleDelete(e, tag._id)}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Add Tag Section */}
      {isInputMode ? (
        <div className="bg-(--card-bg-lighter) p-6 rounded-xl border border-(--main-border-color) w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold text-white">Create New Topic</h4>
            <button onClick={() => setIsInputMode(false)} className="text-gray-500 hover:text-white transition">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleAddTag} className="flex flex-col gap-4">
            {/* Name Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] uppercase tracking-wider text-(--secondary-text-color) font-bold">Topic Name</label>
              <input 
                autoFocus
                className="bg-dark-bg border border-(--main-border-color) rounded-lg px-3 py-2 text-sm outline-none text-white focus:border-(--primary-button) transition"
                placeholder="e.g. Machine Learning"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                required
              />
            </div>

            {/* Description Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] uppercase tracking-wider text-(--secondary-text-color) font-bold">Description</label>
              <textarea 
                className="bg-dark-bg border border-(--main-border-color) rounded-lg px-3 py-2 text-sm outline-none text-white focus:border-(--primary-button) resize-none h-20 transition"
                placeholder="Briefly describe this topic..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            {/* Color Picker */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] uppercase tracking-wider text-(--secondary-text-color) font-bold">Identify Color</label>
              <div className="flex gap-3 px-1">
                {TAG_COLORS.map((color) => (
                  <button
                    key={color.hex}
                    type="button"
                    title={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all 
                      ${selectedColor.hex === color.hex ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-dark-bg' : 'opacity-60 hover:opacity-100'}`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {selectedColor.hex === color.hex && <Check size={14} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isProcessing}
              className="bg-(--primary-button) hover:bg-(--primary-button-active) text-white mt-2 py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Create Topic"}
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsInputMode(true)} 
          className="w-40 h-10 px-4 text-sm rounded-lg bg-(--secondary-button) border border-(--main-border-color) flex items-center justify-center gap-2 hover:bg-(--secondary-button-hover) transition-all"
        >
          <Plus size={18} />
          <span>Custom tag</span>
        </button>
      )}
    </div>
  );
};

export default TagList;