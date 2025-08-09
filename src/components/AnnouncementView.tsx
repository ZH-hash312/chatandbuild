import React, { useState } from 'react';
import { Megaphone, Pin, Clock, User, Heart, MessageCircle, Plus } from 'lucide-react';
import { Topic } from '../types';
import { useWeb3 } from '../hooks/useWeb3';
import CommentSection from './CommentSection';

interface AnnouncementViewProps {
  announcements: Topic[];
  onLike: (topicId: string) => void;
  onComment: (topicId: string, content: string) => void;
  onCreateAnnouncement: () => void;
}

const AnnouncementView: React.FC<AnnouncementViewProps> = ({
  announcements,
  onLike,
  onComment,
  onCreateAnnouncement
}) => {
  const [expandedAnnouncement, setExpandedAnnouncement] = useState<string | null>(null);
  const { isConnected } = useWeb3();

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'from-red-500 to-pink-500';
      case 'medium':
        return 'from-yellow-500 to-orange-500';
      case 'low':
        return 'from-blue-500 to-purple-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Megaphone className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Announcements</h1>
            <p className="text-white/70">Important updates and news</p>
          </div>
        </div>
        {isConnected && (
          <button
            onClick={onCreateAnnouncement}
            className="glass-button rounded-lg px-4 py-2 text-white font-medium flex items-center space-x-2 hover:scale-105 transition-transform"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Announcement</span>
          </button>
        )}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Megaphone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No announcements yet</h3>
            <p className="text-white/70 mb-6">
              Important updates and news will appear here.
            </p>
            {isConnected && (
              <button
                onClick={onCreateAnnouncement}
                className="glass-button rounded-lg px-6 py-3 text-white font-medium"
              >
                Create First Announcement
              </button>
            )}
          </div>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.id} className="glass rounded-2xl p-6 hover:shadow-2xl transition-all duration-300">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{formatAddress(announcement.author)}</p>
                    <div className="flex items-center space-x-2 text-white/60 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(announcement.timestamp)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {announcement.isPinned && (
                    <div className="glass-dark rounded-full p-2">
                      <Pin className="w-4 h-4 text-yellow-400" />
                    </div>
                  )}
                  {announcement.priority && (
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getPriorityColor(announcement.priority)}`} />
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center space-x-2">
                  <Megaphone className="w-5 h-5 text-red-400" />
                  <span>{announcement.title}</span>
                </h3>
                <p className="text-white/80 leading-relaxed">{announcement.content}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => onLike(announcement.id)}
                    className="flex items-center space-x-2 glass-button rounded-lg px-4 py-2 text-white/70 hover:text-red-400 transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                    <span>{announcement.likes}</span>
                  </button>
                  
                  <button
                    onClick={() => setExpandedAnnouncement(
                      expandedAnnouncement === announcement.id ? null : announcement.id
                    )}
                    className="flex items-center space-x-2 glass-button rounded-lg px-4 py-2 text-white/70 hover:text-blue-400 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>{announcement.comments.length}</span>
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              {expandedAnnouncement === announcement.id && (
                <div className="mt-6 pt-6 border-t border-white/20">
                  <CommentSection
                    comments={announcement.comments}
                    onComment={(content) => onComment(announcement.id, content)}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AnnouncementView;
