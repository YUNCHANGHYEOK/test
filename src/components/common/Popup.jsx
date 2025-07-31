/**
 * 공통 팝업 컴포넌트
 * 
 * 목적: 애플리케이션 전반에서 사용되는 알림/메시지 팝업 UI
 * 
 * 특징:
 * 1. 화면 하단 중앙에 토스트 메시지 형태로 표시
 * 2. 3초간 페이드 인/아웃 애니메이션 적용
 * 3. 검은 배경에 흰 글씨로 가독성 확보
 * 
 * 사용처:
 * - App.jsx: showPopup, popupMessage props로 제어
 * - 모든 페이지에서 에러/성공 메시지 표시용
 * 
 * 연결 구조:
 * 각 페이지 → App.jsx의 showCustomPopup 호출 → Popup 컴포넌트 렌더링
 */
import React from 'react';

/**
 * 팝업 메시지를 표시하는 컴포넌트
 * 
 * @param {Object} props
 * @param {boolean} props.showPopup - 팝업 표시 여부
 * @param {string} props.message - 표시할 메시지 내용
 * @returns {JSX.Element|null} 팝업 JSX 또는 null
 */
const Popup = ({ showPopup, message }) => {
  // 팝업을 표시하지 않을 때는 아무것도 렌더링하지 않음
  if (!showPopup) return null;

  return (
    <>
      {/* 토스트 스타일 팝업 */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in-out">
        {message}
      </div>
      
      {/* 페이드 인/아웃 애니메이션 정의 */}
      <style>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; }    /* 시작과 끝: 투명 */
          10%, 90% { opacity: 1; }    /* 중간: 불투명 */
        }
        .animate-fade-in-out {
          animation: fadeInOut 3s ease-in-out forwards;
        }
      `}</style>
    </>
  );
};

export default Popup;
