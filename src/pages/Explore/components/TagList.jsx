import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { createCustomTag, deleteCustomTag } from '../api/repoService';

const TagList = ({ tags, setTags }) => {
  const [isInputMode, setIsInputMode] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim() || isProcessing) return;

    setIsProcessing(true);
    const res = await createCustomTag(newTagName);
    
    if (res.status === "success") {
      // Update the parent state with the new tag
      setTags((prev) => [...prev, res.data]);
      setNewTagName("");
      setIsInputMode(false);
    }
    setIsProcessing(false);
  };

  const handleDelete = async (e, tagId) => {
    e.stopPropagation(); // Prevent button click behavior
    if (isProcessing) return;

    setIsProcessing(true);
    const res = await deleteCustomTag(tagId);
    
    if (res.status === "success") {
      // Remove tag from local UI state
      setTags((prev) => prev.filter(t => (t._id || t.name) !== tagId));
    }
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div>
        <h3 className='text-center text-(--secondary-text-color) text-[15px] mb-3'>Tags</h3>
        <hr className='border-t border-(--main-border-color) w-100 mb-3'></hr>
      </div>

      <div className="flex flex-wrap justify-center gap-x-2 gap-y-3 mb-3">
        {tags.map((tag) => (
          <button
            key={tag._id || tag.name}
            className="group px-4 py-1 text-sm rounded-full bg-(--meta-tag-color) border border-(--main-border-color) hover:bg-(--secondary-button-hover) cursor-pointer transition flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }}></div>
            {tag.label}

            {/* Show delete icon only for custom tags */}
            {tag._id && (
              <X
                size={14}
                className="text-(--secondary-text-color) hover:text-red-400 ml-1 opacity-0 group-hover:opacity-100 transition"
                onClick={(e) => handleDelete(e, tag._id)}
              />
            )}
          </button>
        ))}
      </div>

      {isInputMode ? (
        <form onSubmit={handleAddTag} className="flex gap-2">
          <input 
            autoFocus
            className="bg-(--card-bg-lighter) border border-(--main-border-color) rounded-lg px-3 py-1 text-sm outline-none text-white w-40"
            placeholder="Tag name..."
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            disabled={isProcessing}
          />
          <button 
            type="submit"
            className="bg-(--primary-button) text-white px-3 py-1 rounded-lg text-xs"
            disabled={isProcessing}
          >
            {isProcessing ? "..." : "Add"}
          </button>
          <button 
            type="button"
            onClick={() => setIsInputMode(false)}
            className="text-(--secondary-text-color) px-2"
          >
            <X size={18} />
          </button>
        </form>
      ) : (
        <button 
          onClick={() => setIsInputMode(true)}
          className="w-40 h-10 px-4 text-sm rounded-lg bg-(--secondary-button) border border-(--main-border-color) flex items-center justify-center gap-2 transition hover:bg-(--secondary-button-hover)"
        >
          <Plus size={18} />
          <span>Custom tag</span>
        </button>
      )}
    </div>
  );
};

export default TagList;