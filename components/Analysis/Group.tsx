import React, { useState } from 'react';

// App.tsx에서 넘겨주는 Props 이름과 정확히 일치시켜야 합니다.
interface GroupProps {
    categories: Record<string, string[]>;
  selectedDistrictName: string | null; // selectedDistrict -> selectedDistrictName으로 변경
    onAnalyze: (main: string, sub: string) => void;
}

const Group: React.FC<GroupProps> = ({ categories, selectedDistrictName, onAnalyze }) => {
    const [mainCat, setMainCat] = useState('음식');
    const [subCat, setSubCat] = useState('카페/디저트');

    return (
    <section className="filter-section">
        <div style={{ flex: 1 }}>
        <label className="label-text"> 선택된 지역</label>
        {/* App에서 받아온 selectedDistrictName을 출력 */}
        <div className="selected-area-display">
            {selectedDistrictName || "마커를 클릭하세요"}
        </div>
        </div>

        <div className="category-group" style={{ display: 'flex', gap: '12px', flex: 1.5 }}>
        <div style={{ flex: 1 }}>
            <label className="label-text">대분류</label>
            <select 
            className="select-box"
            value={mainCat}
            onChange={(e) => {
                const selectedMain = e.target.value;
                setMainCat(selectedMain);
              // 대분류가 바뀌면 해당 분류의 첫 번째 소분류로 자동 설정
                setSubCat(categories[selectedMain][0]);
            }}>
            {Object.keys(categories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
        </div>
        <div style={{ flex: 1 }}>
            <label className="label-text">희망 업종</label>
            <select 
            className="select-box" 
            value={subCat} 
            onChange={(e) => setSubCat(e.target.value)}>
            {/* 선택된 대분류(mainCat)에 해당하는 소분류 목록만 출력 */}
            {categories[mainCat] && categories[mainCat].map(sub => (
                <option key={sub} value={sub}>{sub}</option>
            ))}
            </select>
        </div>
        </div>

        <button className="analyze-button" onClick={() => onAnalyze(mainCat, subCat)}>
        분석하기
        </button>
    </section>
    );
};

export default Group;