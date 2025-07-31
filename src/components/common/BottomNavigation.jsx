/**
 * 하단 네비게이션 바 컴포넌트
 * 
 * 목적: 메인 화면들 간의 탭 네비게이션 제공
 * 
 * 기능:
 * 1. 홈(대시보드)과 랭킹 페이지 간 이동
 * 2. 현재 활성 탭 하이라이트 표시
 * 3. 아이콘과 텍스트로 직관적인 UI 제공
 * 
 * 표시되는 페이지:
 * - dashboard: 메인 대시보드 화면
 * - ranking: 랭킹 화면
 * 
 * 사용처:
 * - App.jsx에서 dashboard, ranking 페이지일 때만 표시
 * 
 * 연결 구조:
 * BottomNavigation → setCurrentPage → App.jsx 상태 변경 → 페이지 전환
 */
import React from 'react';

/**
 * 하단 네비게이션 컴포넌트
 * 
 * @param {Object} props
 * @param {string} props.currentPage - 현재 활성 페이지
 * @param {Function} props.setCurrentPage - 페이지 변경 함수
 * @returns {JSX.Element} 하단 네비게이션 JSX
 */
const BottomNavigation = ({ currentPage, setCurrentPage }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 shadow-lg">
      {/* 홈(대시보드) 탭 */}
      <button 
        onClick={() => setCurrentPage('dashboard')} 
        className={`flex flex-col items-center ${currentPage === 'dashboard' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
      >
        {/* 홈 아이콘 (SVG) */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span className="text-xs">홈</span>
      </button>
      
      {/* 랭킹 탭 */}
      <button 
        onClick={() => setCurrentPage('ranking')} 
        className={`flex flex-col items-center ${currentPage === 'ranking' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
      >
        {/* 트로피 아이콘 (SVG) */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trophy">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
          <path d="M4 22h16"/>
          <path d="M10 11V7"/>
          <path d="M14 11V7"/>
          <path d="M14 15v-4"/>
          <path d="M10 15v-4"/>
          <path d="M8 22v-4h8v4"/>
          <path d="M12 17v5"/>
          <path d="M12 11h.01"/>
          <path d="M12 15h.01"/>
        </svg>
        <span className="text-xs">순위</span>
      </button>
      
      <button className="flex flex-col items-center text-gray-500 hover:text-blue-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-gem">
          <path d="M6 2L3 6l14 16 3-4L6 2z"/>
          <path d="M11 2L2 6l14 16 9-4L11 2z"/>
        </svg>
        <span className="text-xs">프리미엄</span>
      </button>
      
      <button 
        onClick={() => setCurrentPage('profile')} 
        className={`flex flex-col items-center ${currentPage === 'profile' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span className="text-xs">프로필</span>
      </button>
    </div>
  );
};

export default BottomNavigation;
