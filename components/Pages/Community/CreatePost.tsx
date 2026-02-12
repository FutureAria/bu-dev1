  import { useState } from 'react';
  import type { User, Post, Category } from './types';  // Post 추가!
  //import axios from 'axios'; // 나중에 MariaDB 연동시 필요
  import './community.css';

  interface CreatePostProps {
    currentUser: User;
    onBack: () => void;
    onPostCreated: (post: Post) => void;  // unknown → Post
  }

  export function CreatePost({ currentUser, onBack, onPostCreated }: CreatePostProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState<Category>('Free');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (submitting) return;
      
      setSubmitting(true);

      try {
        // 더미 데이터 테스트
        const newPost: Post = {
        id: Date.now(),
        title,
        content,
        category,
        author_id: currentUser.id,
        author_name: currentUser.name,
        created_at: new Date().toISOString(),
        views: 0
      };
        
        // // ✅ 1. 실제 MariaDB API 호출
        // const response = await axios.post('/api/create_post.php', {
        //   title,
        //   content,
        //   category,
        //   author_id: currentUser.id,
        //   author_name: currentUser.name
        // });

        // const newPost: Post = response.data;  // 서버에서 완전한 Post 반환
        
        // ✅ 2. 즉시 목록 최상단에 추가 (최적화)
        onPostCreated(newPost);
        
        // ✅ 3. 폼 초기화
        setTitle('');
        setContent('');
        setCategory('Free');
        
      } catch (error) {
        console.error('글 작성 실패:', error);
        alert('글 작성 실패! 콘솔 확인하세요.');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">새 글 작성</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">* 제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="제목을 입력하세요"
              required
              disabled={submitting}
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">* 카테고리</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
              <option value="Free">자유게시판</option>
              <option value="Q&A">질문/답변</option>
              <option value="Review">리뷰</option>
            </select>
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">* 내용</label>
            <textarea
              rows={15}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical font-medium"
              placeholder="내용을 입력하세요"
              required
              disabled={submitting}
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !title.trim() || !content.trim()}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            {submitting ? '📝 작성중...' : '✅ 작성 완료'}
          </button>
          <button 
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            취소
          </button>
        </form>
      </div>
    );
  }
