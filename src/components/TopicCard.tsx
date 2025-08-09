import React, { useState } from 'react';
import { Heart, MessageCircle, Clock, User } from 'lucide-react';
import { Topic } from '../types';
import CommentSection from './CommentSection';

interface TopicCardProps {
  topic: Topic;
  onLike: (topicId: string) => void;
  onComment: (topicId: string, content: string) => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, onLike, onComment }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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

  return (
    <div className="glass rounded-2xl p-6 hover:shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-medium">{formatAddress(topic.author)}</p>
            <div className="flex items-center space-x-2 text-white/60 text-sm">
              <Clock className="w-4 h-4" />
              <span>{formatTime(topic.timestamp)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-3">{topic.title}</h3>
        <p className="text-white/80 leading-relaxed">{topic.content}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onLike(topic.id)}
            className="flex items-center space-x-2 glass-button rounded-lg px-4 py-2 text-white/70 hover:text-red-400 transition-colors"
          >
            <Heart className="w-5 h-5" />
            <span>{topic.likes}</span>
          </button>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 glass-button rounded-lg px-4 py-2 text-white/70 hover:text-blue-400 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{topic.comments.length}</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-white/20">
          <CommentSection
            comments={topic.comments}
            onComment={(content) => onComment(topic.id, content)}
          />
        </div>
      )}
    </div>
  );
};

export default TopicCard;
