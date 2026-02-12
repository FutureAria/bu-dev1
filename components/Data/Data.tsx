// src/data.ts
export interface District {
    name: string;
    lat: number;
    lng: number;
    population: string;
    rent: string;
    score: number;
    suitability: number;
}

export const CATEGORIES: Record<string, string[]> = {
    '음식': ['한식', '일식', '중식', '양식', '카페/디저트', '치킨', '분식'],
    '미용': ['헤어숍', '피부관리', '네일아트', '바버샵'],
    '도/소매': ['편의점', '의류점', '꽃집', '슈퍼마켓'],
    '교육': ['입시학원', '어학원', '예체능학원'],
    '오락': ['PC방', '노래방', '당구장', '스크린골프'],
    '서비스': ['세탁소', '부동산', '사진관', '수리점']
};

export const SEOUL_DATA: District[] = [
    { name: '강남', lat: 37.4979, lng: 127.0276, population: '85.0K', rent: '520만원', score: 88, suitability: 92 },
    { name: '홍대', lat: 37.5565, lng: 126.9239, population: '72.0K', rent: '410만원', score: 82, suitability: 85 },
    { name: '명동', lat: 37.5637, lng: 126.9846, population: '95.0K', rent: '600만원', score: 91, suitability: 95 },
    { name: '이태원', lat: 37.5345, lng: 126.9941, population: '58.0K', rent: '350만원', score: 74, suitability: 79 },
    { name: '잠실', lat: 37.5133, lng: 127.1001, population: '68.0K', rent: '440만원', score: 80, suitability: 82 },
    { name: '성수', lat: 37.5446, lng: 127.0559, population: '52.0K', rent: '420만원', score: 84, suitability: 88 },
    { name: '여의도', lat: 37.5216, lng: 126.9242, population: '78.0K', rent: '480만원', score: 86, suitability: 90 },
    { name: '압구정', lat: 37.5271, lng: 127.0285, population: '65.0K', rent: '550만원', score: 89, suitability: 91 },
    { name: '가로수길', lat: 37.5209, lng: 127.0227, population: '48.0K', rent: '470만원', score: 81, suitability: 83 },
    { name: '건대입구', lat: 37.5404, lng: 127.0692, population: '70.0K', rent: '390만원', score: 79, suitability: 81 },
    { name: '신촌', lat: 37.5552, lng: 126.9369, population: '62.0K', rent: '380만원', score: 78, suitability: 80 },
    { name: '종로', lat: 37.5730, lng: 126.9794, population: '45.2K', rent: '380만원', score: 70, suitability: 75 },
    { name: '노원', lat: 37.6542, lng: 127.0608, population: '42.0K', rent: '280만원', score: 72, suitability: 68 },
    { name: '구로', lat: 37.4835, lng: 126.8924, population: '45.0K', rent: '310만원', score: 75, suitability: 72 },
    { name: '서초', lat: 37.4836, lng: 127.0327, population: '56.0K', rent: '500만원', score: 85, suitability: 87 }
];