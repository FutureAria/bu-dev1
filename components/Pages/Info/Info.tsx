// Info.tsx
import React from 'react';

const Info = () => {
  // 지원사업 데이터 배열
  const supportProgram = [
    {
      title: "소상공인시장진흥공단 지원사업",
      description: "정책자금, 창업 교육, 경영 컨설팅 등 소상공인을 위한 종합 지원 정책을 확인하세요.",
      link: "https://www.semas.or.kr/web/main/index.kmd",
      tag: "종합지원",
      
    },
    {
      title: "서울시 소상공인 종합지원",
      description: "서울시 거주 소상공인을 위한 임대료 지원, 무이자 융자 및 경영 환경 개선 사업입니다.",
      link: "https://www.seoulsbdc.or.kr/",
      tag: "지자체",
      
    },
    {
      title: "소상공인 마당 (창업기상도)",
      description: "전국 상권 정보와 유동 인구 분석 등 예비 창업자를 위한 필수 데이터를 제공합니다.",
      link: "https://www.sbiz.or.kr/",
      tag: "정보제공",
      
    },
    {
      title: "중소벤처기업부 정책포털",
      description: "신규 고용 지원금, 디지털 전환 지원 등 중기부의 최신 소상공인 정책 정보를 안내합니다.",
      link: "https://www.mss.go.kr/",
      tag: "정부정책",
      
    }
  ];

  return (
    <div style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Pretendard, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 style={{ fontSize: '38px', fontWeight: '900', color: '#1e293b', marginBottom: '16px' }}>
          소상공인 지원사업 안내
        </h2>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '24px' 
      }}>
        {supportProgram.map((program, index) => (
          <a 
            key={index} 
            href={program.link} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              textDecoration: 'none',
              color: 'inherit',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              display: 'flex'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
            }}
          >
            <div style={{ 
              background: 'white', 
              padding: '32px', 
              borderRadius: '24px', 
              border: '1px solid #e2e8f0',
              boxShadow: 'inherit', 
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ 
                  display: 'inline-block', 
                  padding: '4px 12px', 
                  borderRadius: '100px', 
                  fontSize: '12px', 
                  fontWeight: '700', 
                  marginBottom: '16px'
                }}>
                  {program.tag}
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px', color: '#0f172a', lineHeight: '1.4' }}>
                  {program.title}
                </h3>
                <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '15px', marginBottom: '24px' }}>
                  {program.description}
                </p>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: '#2563eb', 
                fontSize: '14px', 
                fontWeight: '600' 
              }}>
                바로가기 
                <span style={{ marginLeft: '4px' }}>→</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Info;