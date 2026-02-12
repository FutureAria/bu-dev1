import React, { useState } from 'react';

interface GroupProps {
    categories: Record<string, string[]>;
    selectedDistrictName: string | null;
    onAnalyze: (main: string, sub: string) => void;
}

const Group: React.FC<GroupProps> = ({ categories, selectedDistrictName, onAnalyze }) => {
    const [mainCat, setMainCat] = useState('음식');
    const [subCat, setSubCat] = useState('카페/디저트');

    return (
    <section className="filter-container">
      {/* 1. 지역 선택 정보 */}
        <div className="filter-item">
            <label className="filter-label">선택된 지역</label>
            <div className="selected-display">
                {selectedDistrictName || "지도의 마커를 클릭하세요"}
            </div>
        </div>

      {/* 2. 대분류 선택 */}
        <div className="filter-item">
        <label className="filter-label">대분류</label>
        <select 
            className="select-input"
            value={mainCat}
            onChange={(e) => {
            const selectedMain = e.target.value;
            setMainCat(selectedMain);
            setSubCat(categories[selectedMain][0]);
            }}>
            {Object.keys(categories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        </div>

      {/* 3. 소분류 선택 */}
        <div className="filter-item">
        <label className="filter-label">희망 업종</label>
        <select 
            className="select-input" 
            value={subCat} 
            onChange={(e) => setSubCat(e.target.value)}>
            {categories[mainCat]?.map(sub => (
            <option key={sub} value={sub}>{sub}</option>
            ))}
        </select>
        </div>

      {/* 4. 분석 버튼 */}
        <button className="analyze-btn" onClick={() => onAnalyze(mainCat, subCat)}>
            분석하기
        </button>
    </section>
    );
};

export default Group;