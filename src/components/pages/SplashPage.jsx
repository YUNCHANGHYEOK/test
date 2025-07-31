/**
 * 스플래시(시작) 화면 컴포넌트
 * 
 * 목적: 앱 시작 시 첫 번째로 보여지는 로딩/인트로 화면
 * 
 * 기능:
 * 1. 앱 로고(고래 모양) 표시
 * 2. 화면 터치 시 다음 단계(welcome)로 이동
 * 3. 브랜드 인식을 위한 시각적 임팩트 제공
 * 
 * 사용자 플로우:
 * SplashPage → (터치) → WelcomePage
 * 
 * 연결:
 * - App.jsx에서 currentPage === 'splash'일 때 렌더링
 * - onNext 함수로 welcome 페이지로 전환
 */
import React from 'react';

/**
 * 스플래시 스크린 컴포넌트
 * 
 * @param {Object} props
 * @param {Function} props.onNext - 다음 화면으로 이동하는 함수
 * @returns {JSX.Element} 스플래시 화면 JSX
 */
const SplashPage = ({ onNext }) => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-white cursor-pointer"
      onClick={onNext}  // 화면 전체가 클릭 가능
    >
      {/* 앱 로고 - 고래 모양 SVG */}
      <svg width="200" height="100" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 50C10 22.3858 32.3858 0 60 0C87.6142 0 110 22.3858 110 50C110 77.6142 87.6142 100 60 100C32.3858 100 10 77.6142 10 50Z" fill="#66B2FF"/>
        <path d="M90 50C90 22.3858 112.386 0 140 0C167.614 0 190 22.3858 190 50C190 77.6142 167.614 100 140 100C112.386 100 90 77.6142 90 50Z" fill="#3385FF"/>
        <path d="M100 40C100 17.9086 117.909 0 140 0C162.091 0 180 17.9086 180 40C180 62.0914 162.091 80 140 80C117.909 80 100 62.0914 100 40Z" fill="#0056B3"/>
      </svg>
      
      {/* 사용자 안내 메시지 */}
      <p className="mt-8 text-2xl font-bold text-gray-800">화면을 터치 해주세요</p>
    </div>
  );
};

export default SplashPage;
