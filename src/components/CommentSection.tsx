import React, { useState } from 'react';
import { Send, User, Clock, Heart } from 'lucide-react';
import { Comment } from '../types';
import { useWeb3 } from '../hooks/useWeb3';

interface CommentSectionProps {
  comments: Comment[];
  onComment: (content: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, onComment }) => {
  const [newComment, setNewComment] = useState('');
  const { isConnected } = useWeb3();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && isConnected) {
      onComment(newComment.trim());
      setNewComment('');
    }
  };

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
    <div className="space-y-4">
      {/* Comments List */}
      {comments.length > 0 && (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="glass-dark rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-white font-medium text-sm">
                      {formatAddress(comment.author)}
                    </span>
                    <div className="flex items-center space-x-1 text-white/50 text-xs">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(comment.timestamp)}</span>
                    </div>
                  </div>
                  <p className="text-white/80 text-sm mb-2">{comment.content}</p>
                  <button className="flex items-center space-x-1 text-white/50 hover:text-red-400 transition-colors text-xs">
                    <Heart className="w-3 h-3" />
                    <span>{comment.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comment Form */}
      {isConnected ? (
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 glass-input rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="glass-button rounded-lg px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <div className="text-center py-4">
          <p className="text-white/60 text-sm">Connect your wallet to comment</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
