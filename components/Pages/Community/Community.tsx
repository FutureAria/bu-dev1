import { useState, useEffect } from 'react';
import { PostList } from './PostList';
import { PostDetail } from './PostDetail';
import { CreatePost } from './CreatePost';
import type { User, Post, Category, View } from './types';
import axios from 'axios';
import './community.css';  // 또는 공통 CSS 파일에 합치기


interface CommunityProps {
  currentUser: User | null;
  session: string | null;
  onLoginRequired: () => void;
}

export function Community({ currentUser, session, onLoginRequired }: CommunityProps) {
  const [currentView, setCurrentView] = useState<View>('List');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // 페이징 선언
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 8;

   // 페이징 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // 페이지 변경
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });  // 상단 스크롤
  };

  useEffect(() => {
    setCurrentPage(1); 
    loadPosts();
  }, [selectedCategory]);

  const loadPosts = async () => {
  // 👈 로컬 백업 우선 로드
  try {
    const localPosts = JSON.parse(localStorage.getItem('community_posts') || '[]');
    setPosts(localPosts);
    setTotalPosts(localPosts.length);
    console.log('💾 로컬 백업 로드:', localPosts.length, '개');
  } catch (error) {
    console.error('로컬 백업 실패:', error);
  }

  setLoading(true);
  setPosts([]);

   try {
    const categoryParam = selectedCategory !== 'All' ? `?category=${selectedCategory}` : '';
    const response = await axios.get(`/api/get_posts.php${categoryParam}`);
    const apiPosts = Array.isArray(response.data) ? response.data : [];

    // 더미 데이터 (게시글)
    const allDummyPosts: Post[] = [
      {
    id: 101,
    title: '자유1', 
    content: '자유게시판 테스트 글입니다...', 
    category: 'Free' as Category, 
    author_id: 1,      // 👈 추가!
    author_name: '테스트유저A', 
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),  // 2시간 전
    views: 25          // 👈 추가!
  },
  {
    id: 102,
    title: '자유2', 
    content: '창업 아이디어 공유합니다...', 
    category: 'Free' as Category, 
    author_id: 2, 
    author_name: '창업러A', 
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),  // 1시간 전
    views: 12
  },
  {
    id: 201,
    title: 'Q&A1 - 카페 창업 문의', 
    content: '강남에서 카페 창업하려는데 추천 지역 있을까요?', 
    category: 'Q&A' as Category, 
    author_id: 3, 
    author_name: '초보창업자', 
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),  // 1일 전
    views: 45
  },
  {
    id: 202,
    title: 'Q&A2 - 답변입니다', 
    content: '강남역 근처 추천합니다. 유동인구 많아요!', 
    category: 'Q&A' as Category, 
    author_id: 4, 
    author_name: '전문가B', 
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
    views: 38
  },
  {
    id: 301,
    title: '리뷰1 - 홍대 PC방', 
    content: '최고예요! 24시간 운영 추천합니다', 
    category: 'Review' as Category, 
    author_id: 5, 
    author_name: '리뷰어C', 
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    views: 67
  },
  {
    id: 302,
    title: '리뷰2 - 신촌 치킨집', 
    content: '맛은 좋았으나 배달 느림', 
    category: 'Review' as Category, 
    author_id: 6, 
    author_name: '고객D', 
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    views: 23
  },
  {
    id: 303,
    title: '리뷰3 - 이태원 베이커리', 
    content: '빵맛 최고! 매일 줄섬', 
    category: 'Review' as Category, 
    author_id: 7, 
    author_name: '맛집탐방E', 
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    views: 89
  },
  {
    id: 304,
    title: '리뷰4 - 연남동 카페', 
    content: '분위기 좋음. 가격대 합리적', 
    category: 'Review' as Category, 
    author_id: 8, 
    author_name: '카페마스터', 
    created_at: new Date().toISOString(),
    views: 5
  },
  {
    id: 305,
    title: '리뷰5 - 합정역 피자', 
    content: '치즈 듬뿍! 가족 추천', 
    category: 'Review' as Category, 
    author_id: 9, 
    author_name: '가족파파', 
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
    views: 34
  }
    ];

    const filteredDummy = selectedCategory === 'All' 
      ? allDummyPosts 
      : allDummyPosts.filter(p => p.category === selectedCategory);

    const allPosts = [...filteredDummy, ...apiPosts];
    setPosts(allPosts);
    setTotalPosts(allPosts.length);

  } catch (error) {
    console.error('API 실패:', error);
    
    // catch에서 다시 선언
    const allDummyPosts: Post[] = 
    [
      {
        id: 101,
        title: '자유1', 
        content: '자유게시판 테스트 글입니다...', 
        category: 'Free' as Category, 
        author_id: 1,   
        author_name: '테스트유저A', 
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),  // 2시간 전
        views: 25         
      },
    
      {
        id: 102,
        title: '자유2', 
        content: '창업 아이디어 공유합니다...', 
        category: 'Free' as Category, 
        author_id: 2, 
        author_name: '창업러A', 
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),  // 1시간 전
        views: 12
      },
    
      { 
        id: 201,
        title: 'Q&A1 - 카페 창업 문의', 
        content: '강남에서 카페 창업하려는데 추천 지역 있을까요?', 
        category: 'Q&A' as Category, 
        author_id: 3, 
        author_name: '초보창업자', 
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),  // 1일 전
        views: 45
      },
    
      {
        id: 202,
        title: 'Q&A2 - 답변입니다', 
        content: '강남역 근처 추천합니다. 유동인구 많아요!', 
        category: 'Q&A' as Category, 
        author_id: 4, 
        author_name: '전문가B', 
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
        views: 38
      },
  
      {
        id: 301,
        title: '리뷰1 - 홍대 PC방', 
        content: '최고예요! 24시간 운영 추천합니다', 
        category: 'Review' as Category, 
        author_id: 5, 
        author_name: '리뷰어C', 
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        views: 67
      },
    
      {
        id: 302,
        title: '리뷰2 - 신촌 치킨집', 
        content: '맛은 좋았으나 배달 느림', 
        category: 'Review' as Category, 
        author_id: 6, 
        author_name: '고객D', 
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        views: 23
      },
    
      {
        id: 303,
        title: '리뷰3 - 이태원 베이커리', 
        content: '빵맛 최고! 매일 줄섬', 
        category: 'Review' as Category, 
        author_id: 7, 
        author_name: '맛집탐방E', 
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
        views: 89
      },
  
      {
        id: 304,
        title: '리뷰4 - 연남동 카페', 
        content: '분위기 좋음. 가격대 합리적', 
        category: 'Review' as Category, 
        author_id: 8, 
        author_name: '카페마스터', 
        created_at: new Date().toISOString(),
        views: 5
      },
  
      {
        id: 305,
        title: '리뷰5 - 합정역 피자', 
        content: '치즈 듬뿍! 가족 추천', 
        category: 'Review' as Category, 
        author_id: 9, 
        author_name: '가족파파', 
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
        views: 34
      }
    ];

    const filteredDummy = selectedCategory === 'All' 
      ? allDummyPosts 
      : allDummyPosts.filter(p => p.category === selectedCategory);
      
    setPosts(filteredDummy);
    setTotalPosts(filteredDummy.length);
    } finally {
    setLoading(false);
  }
};

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setCurrentView('Detail');
  };
  

  const handleCreateClick = () => {
    if (!currentUser) {
      console.log('로그인 필요!');  // alert 대체
      onLoginRequired();
      return;
    }
    setCurrentView('Create');
  };

  const handlePostCreated = async (post: Post) => {
    try {
      setPosts(prevPosts => [post, ...prevPosts]);
      setCurrentView('List');
      setSelectedPost(null);
    } catch (error) {
      console.error('포스트 생성 후 처리 오류:', error);
    }
  };

  const handlePostDeleted = () => {
    //console.log('삭제 후 새로고침');
    setCurrentPage(1);
    setCurrentView('List');
    loadPosts();  // 데이터 새로고침
  };

  return (
    <div className="community-container">
      <header className="community-header">
        <div className="header-content">
          <div className="title-section">
            <h2>커뮤니티</h2>
            <p>창업 경험과 정보를 공유하세요</p>
          </div>
          <button className={`write-button ${!currentUser ? 'disabled' : ''}`} 
          onClick={handleCreateClick}
          >
            {currentUser ? '글 쓰기' : '로그인 후 작성'}
          </button>
        </div>

        <div className="category-filter">
          {[
            { key: 'All' as Category, label: '전체' },
            { key: 'Free' as Category, label: '자유게시판' },
            { key: 'Q&A' as Category, label: '질문/답변' },
            { key: 'Review' as Category, label: '리뷰' }
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`category-btn ${selectedCategory === key ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // console.log('탭 클릭:', key, '→ 목록으로!');
        
                setSelectedCategory(key);   
                setCurrentPage(1);            
                setCurrentView('List');       
                loadPosts();                  
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <main className="community-main">
        {currentView === 'List' && (
          <PostList 
            posts={posts}
            currentPosts={currentPosts}
            loading={loading}
            onPostClick={handlePostClick}
            currentUser={currentUser}
            category={selectedCategory === 'All' ? undefined : selectedCategory}  
            session={session}  
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
          />
        )}

        {currentView === 'Detail' && selectedPost && (
          <PostDetail
            post={selectedPost}
            currentUser={currentUser}  
            onBack={() => setCurrentView('List')}
            onPostDeleted={handlePostDeleted}
          />
        )}

        {currentView === 'Create' && currentUser && (
          <CreatePost
            currentUser={currentUser}
            onBack={() => setCurrentView('List')}
            onPostCreated={handlePostCreated}
          />
        )}
      </main>
    </div>
  );
}
