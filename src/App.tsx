import React, { useState, useEffect } from 'react';
import Map from './Map';
import Group from './Group';
import Result from './Result'; 
import { Community } from '../components/Pages/Community/Community';
import Info from '../components/Pages/Info/Info';
import Login from '../components/Pages/Auth/Login';
import Register from '../components/Pages/Auth/Register';
import type { User } from '../components/Pages/Community/types';
import type { AnalysisResult } from './Result'; 
import { SEOUL_DATA, CATEGORIES } from './Data';
import type { District } from './Data';
import './App.css';

export default function App() {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'community' | 'info'>('map');

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<'login' | 'register' | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      try {
        // setCurrentUser(JSON.parse(savedUser)); // 실제 연동 시 주석 해제
      } catch {
        localStorage.removeItem('current_user');
      }
    }
  }, []);

  // 로그인/로그아웃 핸들러
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setShowAuthModal(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('current_user');
    localStorage.removeItem('loginedUser');
  };

  const handleAnalyze = async (main: string, sub: string) => {
  if (!selectedDistrict) {
    alert("지도의 마커를 먼저 선택해주세요!");
    return;
  }

    console.log(`[분석 시작] 지역: ${selectedDistrict.name} / 분류: ${main} / 업종: ${sub}`);

  try {
    const response = await fetch('http://localhost:5000/api/analyze-business', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        districtData: selectedDistrict, // SEOUL_DATA의 로우 데이터
        categoryMain: main,
        categorySub: sub
      })
    });

    if (!response.ok) throw new Error('분석 요청 실패');

    const data: AnalysisResult = await response.json();
    
    // 👈 AI가 가공한 데이터로 결과창 업데이트
    setAnalysisResult(data);
    
  } catch (error) {
    console.error("분석 오류:", error);
    alert("AI 분석 중 오류가 발생했습니다.");
  }


  //   const requestPayload = {
  //     districtName: selectedDistrict.name,
  //     latitude: selectedDistrict.lat,
  //     longitude: selectedDistrict.lng,
  //     categoryMain: main,
  //     categorySub: sub
  //   };

  //   try {
  //     console.log("[백엔드 전송 데이터]:", requestPayload);

  //     // 4. 실제 백엔드 API 호출 (URL은 실제 서버 주소로 변경하세요)
  //     const response = await fetch('http://your-backend-server.com/api/analysis', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(requestPayload),
  //     });

  //     if (!response.ok) {
  //       throw new Error('서버 분석 요청에 실패했습니다.');
  //     }

  //     // 5. 서버에서 가공된 분석 결과 받기
  //     const data: AnalysisResult = await response.json();
      
  //     // 6. 상태 업데이트 (Result 컴포넌트에 전달됨)
  //     setAnalysisResult(data);
  //     alert(`${selectedDistrict.name} 분석이 성공적으로 완료되었습니다.`);

  //   } catch (error) {
  //     console.error("분석 오류:", error);
  //     alert("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
  //   } finally {
  //     // 7. 로딩 종료
  //     setIsLoading(false);
  //   }
  // };

    // const mockData: AnalysisResult = {
    //   name: selectedDistrict.name, 
    //   suitability: selectedDistrict.suitability,
    //   population: { 
    //     total: selectedDistrict.population, 
    //     mainAge: "2030세대 (42%)",
    //     genderRatio: { male: 48, female: 52 },
    //     timeSlots: [20, 45, 85, 100, 70, 40] 
    //   },
    //   market: { 
    //     avgRent: selectedDistrict.rent, 
    //     avgSales: "4,500만원", 
    //     competition: selectedDistrict.suitability > 85 ? '보통' : '높음',
    //     nearbySimilar: 14
    //   },
    //   traffic: { 
    //     subway: `${selectedDistrict.name}역 도보 5분`,
    //     bus: "인근 정류장 8개소",
    //     accessibility: "우수"
    //   }
    // };

    // setAnalysisResult(mockData);
  };

  const handleTabChange = (tab: 'map' | 'community' | 'info') => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentTab = () => {
    switch (activeTab) {
      case 'map':
        return (
          <>
            <Group 
              categories={CATEGORIES} 
              selectedDistrictName={selectedDistrict?.name || null} 
              onAnalyze={handleAnalyze} 
            />
            <div className="dashboard-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(12, 1fr)', 
              gap: '24px', 
              height: '650px', 
              marginTop: '24px' 
            }}>
              <div className="map-container" style={{ 
                gridColumn: 'span 8', 
                borderRadius: '40px', 
                border: '1px solid #e2e8f0', 
                overflow: 'hidden', 
                position: 'relative' 
              }}>
                <Map districts={SEOUL_DATA} onSelectDistrict={setSelectedDistrict} />
              </div>
              <aside className="analysis-sidebar" style={{ 
                gridColumn: 'span 4', 
                borderRadius: '40px', 
                border: '1px solid #e2e8f0', 
                overflow: 'hidden', 
                backgroundColor: 'white' 
              }}>
                <Result result={analysisResult}
                currentUser={currentUser} 
            onLoginRequired={() => setShowAuthModal('login')} />
              </aside>
            </div>
          </>
        );
      case 'community':
        return <Community currentUser={currentUser} session={null} onLoginRequired={() => setShowAuthModal('login')} />;
      case 'info':
        return <Info />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="logo-box" style={{ cursor: 'pointer' }} onClick={() => handleTabChange('map')}>
          <img src="/oneway.png" alt="상권분석 로고" style={{ width: '82px', height: '42px' }} />
        </div>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 900 }}>AI 상권분석 시스템</h1>
        </div>
        <div className="buttons-container" style={{
          marginLeft: 'auto', 
          alignItems: 'center', 
          gap: '12px', 
          display: 'flex', 
          fontSize: '12px'
        }}>
          <button 
            className={`header-button ${activeTab === 'map' ? 'active' : ''}`}
            onClick={() => handleTabChange('map')}
          >
            지도 (맵)
          </button>
          <button 
            className={`header-button ${activeTab === 'community' ? 'active' : ''}`}
            onClick={() => handleTabChange('community')}
          >
            커뮤니티
          </button>
          <button 
            className={`header-button ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => handleTabChange('info')}
          >
            지원사업
          </button>
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: '600', color: '#1f2937' }}>{currentUser.name}님</span>
              <button 
                onClick={handleLogout}
                className="header-button"
                style={{ background: '#ef4444', color: 'white', padding: '8px 16px' }}
              >
                로그아웃
              </button>
            </div>
          ) : (
            <button 
              className="header-button"
              onClick={() => setShowAuthModal('login')}
              style={{ padding: '8px 16px' }}
            >
              로그인
            </button>
          )}
        </div>
      </header>
      <main>{renderCurrentTab()}</main>

      {showAuthModal === 'login' && (
        <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && setShowAuthModal(null)}>
          <Login 
            onLogin={handleLogin}
            onClose={() => setShowAuthModal(null)}
            onSwitchToRegister={() => setShowAuthModal('register')}
          />
        </div>
      )}

      {showAuthModal === 'register' && (
        <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && setShowAuthModal(null)}>
          <Register 
            onRegister={handleLogin}
            onClose={() => setShowAuthModal(null)}
            onSwitchToLogin={() => setShowAuthModal('login')}
          />
        </div>
      )}
    </div>
  );
}


