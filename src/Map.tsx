import React, { useEffect, useRef } from 'react';
import type { District } from './Data';


interface KakaoLatLng {
    getLat(): number;
    getLng(): number;
}

interface KakaoMap {
    panTo(latlng: KakaoLatLng): void;
    relayout(): void;
    addOverlayMapTypeId(type: number): void;
}

interface KakaoMarker {
    setMap(map: KakaoMap | null): void;
}


declare global {
    interface Window {
    kakao: {
        maps: {
        load: (callback: () => void) => void;
        LatLng: new (lat: number, lng: number) => KakaoLatLng;
        Map: new (container: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMap;
        Marker: new (options: { position: KakaoLatLng; map: KakaoMap }) => KakaoMarker;
        CustomOverlay: new (options: { position: KakaoLatLng; content: string | HTMLElement; yAnchor: number }) => { setMap(map: KakaoMap | null): void };
        MapTypeId: {
            TRAFFIC: number;
        };
        event: {
            addListener: (target: unknown, type: string, callback: () => void) => void;
        };
        };
    };
    }
}

interface MapProps {
    districts: District[];
    onSelectDistrict: (district: District) => void;
}

const Map: React.FC<MapProps> = ({ districts, onSelectDistrict }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<KakaoMap | null>(null); 

    useEffect(() => {
    if (!window.kakao || !mapRef.current) return;

    window.kakao.maps.load(() => {
        
        if (mapInstance.current) return;

        const kakaoMaps = window.kakao.maps;
        const centerPos = new kakaoMaps.LatLng(37.5665, 126.9780);
        const options = {
        center: centerPos,
        level: 8,
        };
        
        const map = new kakaoMaps.Map(mapRef.current!, options);
        mapInstance.current = map;

        map.addOverlayMapTypeId(kakaoMaps.MapTypeId.TRAFFIC);

        districts.forEach((d) => {
        const position = new kakaoMaps.LatLng(d.lat, d.lng);

            const content = document.createElement('div');
            content.className = 'marker-label'; // CSS 파일에 정의한 클래스명
            content.innerHTML = d.name;
            
            


            content.onclick = () => {
                const allLabels = document.querySelectorAll('.marker-label');
                allLabels.forEach((label) => {
                    label.classList.remove('active');
                });
                content.classList.add('active');
                onSelectDistrict(d); 
                map.panTo(position); 
            };

            const overlay = new kakaoMaps.CustomOverlay({
                position: position,
                content: content,
                yAnchor: 1,
                
            });
            overlay.setMap(map);


        
        });
        
    });
    }, [districts, onSelectDistrict]);

    return (
    <div 
    ref={mapRef} 
    className="map-element"
    style={{ 
        width: '100%', 
        height: '100%', 
        position: 'absolute', 
        top: 0,
        left: 0
    }} />
);
};

export default Map;