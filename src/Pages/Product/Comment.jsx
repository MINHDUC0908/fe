import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Configure base URL
axios.defaults.baseURL = 'http://127.0.0.1:8000';

function CommentComponent({ productId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [parentId, setParentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch comments
  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/products/${productId}/comments`);
      setComments(response.data.comments);
      setLoading(false);
    } catch (err) {
      setError('Failed to load comments');
      setLoading(false);
    }
  };

  // Fetch comments when component mounts or productId changes
  useEffect(() => {
    fetchComments();
  }, [productId]);

  // Submit comment or reply
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/api/products/${productId}/comments`, 
        { content, parent_id: parentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add the new comment or reply to the state immediately without reloading
      const newComment = response.data.comment;

      if (parentId) {
        // Update the parent comment's replies
        setComments(prevComments => 
          prevComments.map(comment => 
            comment.id === parentId 
              ? { 
                  ...comment, 
                  replies: [...(comment.replies || []), newComment] 
                } 
              : comment
          )
        );
      } else {
        // Add the new comment to the top
        setComments(prev => [newComment, ...prev]);
      }

      // Reset form
      setContent('');
      setParentId(null);
      setError('');
    } catch (err) {
      setError('Failed to submit comment');
    }
  };

  // Render comments recursively
  const renderComments = (commentsList) => {
    if (!commentsList || commentsList.length === 0) {
      return <p className="text-gray-500 text-center">No comments yet</p>;
    }

    return (
      <ul className="space-y-6">
        {commentsList.map((comment) => (
          <li key={comment.id} className="border p-4 rounded-lg shadow-md bg-white hover:bg-gray-50 transition duration-200">
            <div className="flex justify-between items-start">
              <div>
                <strong className="text-lg font-semibold text-blue-600">{comment.author}</strong>
                <p className="text-gray-700 mt-1">{comment.content}</p>
              </div>
              <button 
                className="text-blue-500 hover:underline" 
                onClick={() => setParentId(comment.id)}
              >
                Reply
              </button>
            </div>
            {parentId === comment.id && (
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="submit" 
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none transition duration-200"
                >
                  Reply
                </button>
              </form>
            )}
            {comment.replies && comment.replies.length > 0 && (
              <ul className="mt-4 pl-6 border-l border-gray-300">
                {comment.replies.map((reply) => (
                  <li key={reply.id} className="border p-3 rounded-md shadow-sm bg-gray-100 mt-2">
                    <strong className="text-gray-800">{reply.author}</strong>: {reply.content}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Comments</h2>
      
      {loading && <p className="text-gray-500 text-center">Loading comments...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      
      {renderComments(comments)}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit" 
          className="w-full px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none transition duration-200"
        >
          Post Comment
        </button>
      </form>
    </div>
  );
}

export default CommentComponent;
