/**
 * 팝업 관리 커스텀 훅
 * 
 * 목적: 애플리케이션 전반에서 사용되는 알림 팝업의 상태를 관리
 * 
 * 기능:
 * 1. 팝업 표시/숨김 상태 관리
 * 2. 팝업 메시지 내용 관리
 * 3. 자동 숨김 타이머 (3초 후 자동 사라짐)
 * 
 * 사용하는 컴포넌트:
 * - App.jsx: 전역 팝업 상태 관리
 * - 모든 페이지 컴포넌트들: 에러 메시지, 성공 메시지 표시
 * 
 * 연결되는 컴포넌트:
 * - components/common/Popup.jsx: 실제 팝업 UI 렌더링
 */
import { useState, useCallback } from 'react';

/**
 * 팝업 상태와 제어 함수를 제공하는 훅
 * 
 * @returns {Object} 팝업 상태와 제어 함수들
 * - showPopup: 팝업 표시 여부
 * - popupMessage: 팝업에 표시할 메시지
 * - showCustomPopup: 팝업을 표시하는 함수
 */
export const usePopup = () => {
  const [showPopup, setShowPopup] = useState(false);      // 팝업 표시 상태
  const [popupMessage, setPopupMessage] = useState('');   // 팝업 메시지 내용

  /**
   * 팝업을 표시하는 함수
   * 3초 후 자동으로 팝업을 숨김
   * 
   * @param {string} message - 표시할 메시지
   */
  const showCustomPopup = useCallback((message) => {
    setPopupMessage(message);
    setShowPopup(true);
    
    // 3초 후 자동으로 팝업 숨김
    setTimeout(() => {
      setShowPopup(false);
      setPopupMessage('');
    }, 3000);
  }, []);

  return {
    showPopup,        // 팝업 표시 여부
    popupMessage,     // 팝업 메시지
    showCustomPopup   // 팝업 표시 함수
  };
};
