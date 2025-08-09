import React, { useState } from 'react';
import { X, Plus, Megaphone, MessageSquare } from 'lucide-react';
import { CategoryType } from '../types';

interface CreateTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string, category: CategoryType, priority?: 'high' | 'medium' | 'low', isPinned?: boolean) => void;
  defaultCategory?: CategoryType;
}

const CreateTopicModal: React.FC<CreateTopicModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultCategory = 'topics'
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<CategoryType>(defaultCategory);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [isPinned, setIsPinned] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onSubmit(
        title.trim(), 
        content.trim(), 
        category,
        category === 'announcement' ? priority : undefined,
        category === 'announcement' ? isPinned : undefined
      );
      setTitle('');
      setContent('');
      setPriority('medium');
      setIsPinned(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  const getCategoryIcon = (cat: CategoryType) => {
    switch (cat) {
      case 'announcement':
        return <Megaphone className="w-4 h-4" />;
      case 'topics':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Plus className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (cat: CategoryType) => {
    switch (cat) {
      case 'announcement':
        return 'from-red-500 to-pink-500';
      case 'topics':
        return 'from-blue-500 to-purple-500';
      case 'chat':
        return 'from-green-500 to-teal-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            {getCategoryIcon(category)}
            <span>Create {category === 'announcement' ? 'Announcement' : 'Topic'}</span>
          </h2>
          <button
            onClick={onClose}
            className="glass-button rounded-lg p-2 text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-white font-medium mb-3">Category</label>
            <div className="grid grid-cols-2 gap-3">
              {(['announcement', 'topics'] as CategoryType[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`glass-button rounded-lg p-4 text-left transition-all ${
                    category === cat ? 'ring-2 ring-white/30' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getCategoryColor(cat)} flex items-center justify-center mb-2`}>
                    {getCategoryIcon(cat)}
                  </div>
                  <p className="text-white font-medium capitalize">{cat}</p>
                  <p className="text-white/60 text-sm">
                    {cat === 'announcement' ? 'Important updates' : 'Discussion topics'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Announcement Options */}
          {category === 'announcement' && (
            <div className="space-y-4">
              {/* Priority */}
              <div>
                <label className="block text-white font-medium mb-2">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                  className="glass-input rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/30 w-full"
                >
                  <option value="high" className="bg-gray-800">High Priority</option>
                  <option value="medium" className="bg-gray-800">Medium Priority</option>
                  <option value="low" className="bg-gray-800">Low Priority</option>
                </select>
              </div>

              {/* Pin Option */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="pinned"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-transparent border-white/30 rounded focus:ring-blue-500"
                />
                <label htmlFor="pinned" className="text-white font-medium">
                  Pin this announcement
                </label>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-white font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Enter ${category} title...`}
              className="glass-input rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 w-full"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-white font-medium mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Write your ${category} content...`}
              rows={6}
              className="glass-input rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 w-full resize-none"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 glass-button rounded-lg px-6 py-3 text-white/70 hover:text-white font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !content.trim()}
              className="flex-1 glass-button rounded-lg px-6 py-3 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
            >
              Create {category === 'announcement' ? 'Announcement' : 'Topic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTopicModal;
