import React, { useState } from 'react';
import { BarChart3, Users, DollarSign } from 'lucide-react'; // TrendingUp 제거

interface AnalysisResult {
    suitability: number;
    population: { total: string; peakTime: string; mainAge: string; };
    market: { avgRent: string; avgSales: string; competition: string; };
}

const Result: React.FC<{ result: AnalysisResult | null }> = ({ result }) => {
    const [activeTab, setActiveTab] = useState<'total' | 'flow' | 'market'>('total');

    if (!result) {
    return (
        <div className="empty-result" style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', color:'#cbd5e1'}}>
        <BarChart3 size={48} />
        <p>분석 버튼을 눌러주세요.</p>
        </div>
    );
    }

    return (
    <div className="result-container flex flex-col h-full">
        <div className="tab-menu" style={{display:'flex', padding:'8px', backgroundColor:'#f1f5f9', margin:'24px', borderRadius:'16px'}}>
        <button onClick={() => setActiveTab('total')} style={{flex:1, padding:'10px', borderRadius:'12px', border:'none', backgroundColor: activeTab === 'total' ? 'white' : 'transparent', fontWeight:'bold', cursor:'pointer'}}>종합</button>
        <button onClick={() => setActiveTab('flow')} style={{flex:1, padding:'10px', borderRadius:'12px', border:'none', backgroundColor: activeTab === 'flow' ? 'white' : 'transparent', fontWeight:'bold', cursor:'pointer'}}>인구</button>
        <button onClick={() => setActiveTab('market')} style={{flex:1, padding:'10px', borderRadius:'12px', border:'none', backgroundColor: activeTab === 'market' ? 'white' : 'transparent', fontWeight:'bold', cursor:'pointer'}}>시세</button>
        </div>

        <div className="tab-content" style={{padding:'0 32px 32px 32px'}}>
        {activeTab === 'total' && (
            <div className="score-card">
            <h3 style={{fontSize:'64px', margin:0, fontWeight:900, color:'#2563eb'}}>{result.suitability}<span style={{fontSize:'20px'}}>점</span></h3>
            </div>
        )}
        {activeTab === 'flow' && (
            <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
            <Users size={20} />
            <p><strong>총 유동인구:</strong> {result.population.total}</p>
            </div>
        )}
        {activeTab === 'market' && (
            <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
            <DollarSign size={20} />
            <p><strong>평균 임대료:</strong> {result.market.avgRent}</p>
            </div>
        )}
        </div>
    </div>
    );
};

export default Result;