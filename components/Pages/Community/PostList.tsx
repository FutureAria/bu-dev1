import type { Post, User, Category } from './types';
import './community.css';

// PostList.tsx 상단
interface PostListProps {
  posts: Post[];
  currentPosts: Post[];
  loading: boolean;
  onPostClick: (post: Post) => void;
  currentUser?: User | null;
  category?: Category | undefined;  // ← 추가 (types.ts Category 사용)
  session?: string | null;          // ← 추가
  currentPage: number;  
  totalPages: number;
  paginate: (page: number) => void;
}


  export function PostList({
    posts, currentPosts, loading, onPostClick, currentPage, totalPages, paginate }: PostListProps) {
      
  // 🔒 안전 체크 추가
  if (loading) {
    return <div className="text-center py-12">로딩중...</div>;
  }

  // 🔒 배열 체크 필수!
  if (!Array.isArray(posts) || posts.length === 0) {
    return (
      <div className="text-center py-20 p-8 bg-white rounded-xl shadow-sm">
        <div className="text-4xl mb-4">📭</div>
        <h2 className="text-2xl font-bold text-gray-600 mb-2">게시글이 없습니다</h2>
        <p className="text-gray-500">첫 번째 글을 작성해보세요!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-[70vh] overflow-y-auto space-y-4 p-4">
      {currentPosts.map((post) => (
        <div
          key={post.id}
          className="p-6 border border-gray-200 rounded-xl hover:shadow-lg cursor-pointer hover:bg-gray-50 transition-all group"
          onClick={() => onPostClick(post)}
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {post.title}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              post.category === 'Free' ? 'bg-blue-100 text-blue-800' :
              post.category === 'Question' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {post.category}
            </span>
          </div>
          <p className="text-gray-600 line-clamp-2 mb-3 leading-relaxed">{post.content}</p>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-base text-gray-900">
              {post.author_name || '익명'}
            </span>
            <span className="text-gray-400">·</span>
            <span>
              {new Date(post.created_at).toLocaleDateString('ko-KR')}
            </span>
          </div>
        </div>
      ))}

      {/* 페이징 */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 bg-white pt-8 pb-12 px-4 mt-auto shrink-0">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
          >
            ← 이전
          </button>

          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-2 text-sm font-medium rounded-lg border disabled:opacity-50 ${
                currentPage === number
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700'
              }`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음 →
          </button>
        </div>
      )}
    </div>
  );
}
