import type { Post, User } from './types';
import './community.css';

interface PostDetailProps {
  post: Post;
  currentUser: User | null;
  onBack: () => void;
  onPostDeleted?: () => void;
}

export function PostDetail({ post, currentUser,  onBack, onPostDeleted }: PostDetailProps) {
  const deletePost = () => {
    if (confirm('삭제하시겠어요?')) {
      try {
        const storedPosts = JSON.parse(localStorage.getItem('community_posts') || '[]');
        const updatedPosts = storedPosts.filter((p: Post) => p.id !== post.id);  // 👈 post.id!
        localStorage.setItem('community_posts', JSON.stringify(updatedPosts));
        
        if (onPostDeleted) {
          onPostDeleted();
        }
        onBack();
      } catch (error) {
        console.error('삭제 실패:', error);
        alert('삭제 실패!');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto z-10 relative">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
        style={{ zIndex: 100 }}
      >
        ← 목록으로
      </button>

      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

      <div className="mb-6">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          post.category === 'Free' ? 'bg-blue-100 text-blue-800' :
          post.category === 'Question' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {post.category}
          <p></p>
        </span>
      </div>

      <div className="prose max-w-none mb-8 whitespace-pre-wrap">
        {post.content}
      </div>

      <div className="border-t pt-6 text-sm text-gray-500 flex justify-between items-center">
        <div>
          <p>작성자: {post.author_name}</p>
          <p>작성일: {new Date(post.created_at).toLocaleDateString()}</p>
        </div>
        
        {/* 👈 삭제 버튼 추가! */}
        {currentUser && currentUser.id === post.author_id && (
          <button
            onClick={deletePost}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            삭제하기
          </button>
        )}
      </div>
    </div>
  );
}
