/**
 * OTP 타이머 관리 커스텀 훅
 * 
 * 목적: OTP(일회용 비밀번호) 인증 시 제한 시간을 관리
 * 
 * 기능:
 * 1. 3분(180초) 카운트다운 타이머
 * 2. 타이머 시작/중지 제어
 * 3. 타이머 종료 시 자동 상태 업데이트
 * 
 * 사용하는 컴포넌트:
 * - App.jsx: 전역 OTP 타이머 상태 관리
 * - components/pages/OtpPage.jsx: OTP 입력 화면에서 남은 시간 표시
 * 
 * 연결 흐름:
 * OnboardingPhonePage → OtpPage (타이머 시작) → 3분 후 만료
 */
import { useState, useEffect } from 'react';

/**
 * OTP 타이머 상태와 제어 함수를 제공하는 훅
 * 
 * @returns {Object} 타이머 상태와 제어 함수들
 * - otpTimer: 남은 시간 (초 단위)
 * - otpRunning: 타이머 동작 여부
 * - setOtpRunning: 타이머 상태 직접 설정
 * - startOtpTimer: 타이머 시작 함수
 */
export const useOtpTimer = () => {
  const [otpTimer, setOtpTimer] = useState(180);     // 남은 시간 (3분 = 180초)
  const [otpRunning, setOtpRunning] = useState(false); // 타이머 실행 상태

  /**
   * OTP 타이머를 시작하는 함수
   * 180초(3분)로 초기화하고 타이머 시작
   */
  const startOtpTimer = () => {
    setOtpTimer(180);      // 3분으로 리셋
    setOtpRunning(true);   // 타이머 시작
  };

  /**
   * 타이머 실행 로직
   * 1초마다 시간을 1씩 감소시키고, 0이 되면 타이머 종료
   */
  useEffect(() => {
    let timer;
    if (otpRunning && otpTimer > 0) {
      // 타이머가 실행 중이고 시간이 남았으면 1초마다 감소
      timer = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      // 시간이 다 되면 타이머 종료
      setOtpRunning(false);
    }
    
    // 컴포넌트 언마운트 또는 의존성 변경 시 타이머 정리
    return () => clearInterval(timer);
  }, [otpRunning, otpTimer]);

  return {
    otpTimer,        // 남은 시간 (초)
    otpRunning,      // 타이머 실행 여부
    setOtpRunning,   // 타이머 상태 설정
    startOtpTimer    // 타이머 시작 함수
  };
};
