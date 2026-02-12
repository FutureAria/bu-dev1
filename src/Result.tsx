import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, Users, Train, Clock, Store, MapPin, Send, Sparkles } from 'lucide-react';
import type { User } from '../components/Pages/Community/types';

export interface AnalysisResult {
  name: string;
  suitability: number;
  population: {
    total: string;
    mainAge: string;
    genderRatio: { male: number; female: number };
    timeSlots: number[];
  };
  market: {
    avgSales: string;
    competition: '낮음' | '보통' | '높음' | '매우 높음';
    avgRent: string;
    nearbySimilar: number;
  };
  traffic: {
    subway: string;
    bus: string;
    accessibility: '최상' | '우수' | '보통' | '불량';
  };
}

interface ResultProps {
  result: AnalysisResult | null;
  currentUser: User | null;
  onLoginRequired: () => void;
}

const Result: React.FC<ResultProps> = ({ result, currentUser, onLoginRequired }) => {
  const [tab, setTab] = useState<'pop' | 'biz' | 'env' | 'chat'>('pop');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 탭 변경 및 로그인 체크
  const handleTabChange = (newTab: 'pop' | 'biz' | 'env' | 'chat') => {
    if (newTab === 'chat' && !currentUser) {
      alert("AI 채팅 분석은 로그인 후 이용 가능합니다.");
      onLoginRequired();
      return;
    }
    setTab(newTab);
  };

  // 자동 스크롤
  useEffect(() => {
    if (tab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, tab]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5000/api/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          context: result 
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'model', text: data.reply }]);
    } catch (error) {
      console.error("채팅 에러:", error);
    } finally {
      setIsTyping(false);
    }
  };

  if (!result) {
    return (
      <div className="empty-result" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
        <BarChart3 size={48} style={{ marginBottom: '12px' }} />
        <p>지역을 선택하고 분석 버튼을 눌러주세요.</p>
      </div>
    );
  }

  return (
    <div className="result-root" style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', background: 'white' }}>
      {/* 탭 버튼 메뉴 */}
      <div style={{ display: 'flex', padding: '16px', gap: '8px', flexShrink: 0 }}>
        {(['pop', 'biz', 'env', 'chat'] as const).map((t) => (
          <button key={t} onClick={() => handleTabChange(t)} 
            style={{ 
              flex: 1, padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer',
              backgroundColor: tab === t ? '#2563eb' : '#f1f5f9',
              color: tab === t ? 'white' : '#94a3b8', fontWeight: 'bold', transition: '0.2s'
            }}>
            {t === 'pop' ? '인구' : t === 'biz' ? '상권' : t === 'env' ? '교통' : 'AI 채팅'}
          </button>
        ))}
      </div>

      {/* 스크롤 가능한 컨텐츠 영역 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
        {/* --- 인구 탭 --- */}
        {tab === 'pop' && (
          <div className="fade-in">
            <div className="score-hero" style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)', padding: '24px', borderRadius: '20px', color: 'white', textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>{result.name} 종합 적합도</div>
              <div style={{ fontSize: '48px', fontWeight: 900 }}>{result.suitability}점</div>
            </div>
            
            <div className="card" style={{ padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Users size={18} color="#2563eb" />
                <span style={{ fontWeight: 800 }}>인구 통계</span>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800 }}>{result.population.total}</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
                주요 소비층: {result.population.mainAge} <br/>
                남성 {result.population.genderRatio.male}% / 여성 {result.population.genderRatio.female}%
              </div>
            </div>

            <div className="card" style={{ padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Clock size={18} color="#2563eb" />
                <span style={{ fontWeight: 800 }}>시간대별 유동인구</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '80px', marginTop: '10px' }}>
                {result.population.timeSlots.map((v, i) => (
                  <div key={i} style={{ flex: 1, height: `${v}%`, backgroundColor: v > 80 ? '#2563eb' : '#e2e8f0', borderRadius: '4px' }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginTop: '8px', color: '#94a3b8' }}>
                <span>06시</span><span>12시</span><span>18시</span><span>24시</span>
              </div>
            </div>
          </div>
        )}

        {/* --- 상권 탭 --- */}
        {tab === 'biz' && (
          <div className="fade-in">
            <div className="card" style={{ padding: '20px', borderRadius: '16px', borderLeft: '6px solid #2563eb', background: '#f8fafc', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>상권 평균 월 매출</div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a' }}>{result.market.avgSales}</div>
            </div>

            <div className="card" style={{ padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Store size={20} color="#2563eb" />
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>주변 유사 업종 수</div>
                  <div style={{ fontSize: '18px', fontWeight: 800 }}>{result.market.nearbySimilar}개소</div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>경쟁 강도</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: result.market.competition === '매우 높음' ? '#ef4444' : '#2563eb' }}>
                {result.market.competition}
              </div>
            </div>

            <div className="card" style={{ padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>평균 임대료 수준</div>
              <div style={{ fontSize: '18px', fontWeight: 800 }}>{result.market.avgRent}</div>
            </div>
          </div>
        )}

        {/* --- 교통 탭 --- */}
        {tab === 'env' && (
          <div className="fade-in">
            <div className="card" style={{ padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Train size={20} color="#2563eb" />
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>인근 지하철역</div>
                  <div style={{ fontSize: '16px', fontWeight: 800 }}>{result.traffic.subway}</div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={20} color="#2563eb" />
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>주요 버스 노선</div>
                  <div style={{ fontSize: '16px', fontWeight: 800 }}>{result.traffic.bus}</div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '20px', background: '#eff6ff', borderRadius: '16px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#3b82f6', fontWeight: 700, marginBottom: '4px' }}>종합 접근성 등급</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#2563eb' }}>{result.traffic.accessibility}</div>
            </div>
          </div>
        )}

        {/* --- AI 채팅 탭 (레이아웃 최적화) --- */}
        {tab === 'chat' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* 고정 안내창 */}
            <div className="card" style={{ background: '#f0f9ff', border: 'none', padding: '16px', borderRadius: '16px', marginBottom: '12px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0369a1', fontSize: '13px', fontWeight: 800 }}>
                <Sparkles size={16} /> 
                AI 데이터 도우미
              </div>
              <p style={{ fontSize: '12px', color: '#334155', marginTop: '6px', lineHeight: 1.5 }}>
                {result.name}의 실시간 데이터를 분석 중입니다. <br/> 궁금한 점을 물어보세요!
              </p>
            </div>

            {/* 채팅 메시지 스크롤 영역 */}
            <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '20px' }}>
              {messages.map((m, i) => (
                <div key={i} style={{ 
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: m.role === 'user' ? '#2563eb' : '#f1f5f9',
                  color: m.role === 'user' ? 'white' : '#1e293b',
                  padding: '12px 16px', 
                  borderRadius: m.role === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                  maxWidth: '85%',
                  fontSize: '13px', 
                  marginLeft: m.role === 'user' ? 'auto' : '0',
                  lineHeight: 1.6,
                  wordBreak: 'break-word',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  {m.text}
                </div>
              ))}
              {isTyping && (
                <div style={{ alignSelf: 'flex-start', background: '#f1f5f9', padding: '10px 16px', borderRadius: '15px', fontSize: '12px', color: '#64748b' }}>
                  데이터 분석 중...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* 입력창 (하단 고정) */}
            <div style={{ flexShrink: 0, display: 'flex', gap: '8px', background: 'white', padding: '16px 0', borderTop: '1px solid #f1f5f9' }}>
              <input 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="예: 이 지역의 20대 유동인구 특징은?" 
                style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '13px' }}
              />
              <button onClick={handleSendMessage} style={{ padding: '14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: '0.2s' }}>
                <Send size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;