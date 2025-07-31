/**
 * API 통신 유틸리티 모듈
 * 
 * 역할: 프론트엔드와 백엔드(Express 서버) 간의 모든 HTTP 통신을 담당
 * 
 * 연결 구조:
 * Frontend (React) ←→ api.js ←→ Backend (Express + MySQL)
 * 
 * 주요 기능:
 * 1. 사용자 프로필 CRUD (생성, 조회, 업데이트)
 * 2. 퀴즈 데이터 조회
 * 3. 랭킹 데이터 조회
 * 4. 에러 처리 및 응답 포맷 통일
 * 
 * 사용하는 컴포넌트:
 * - App.jsx: 전역 데이터 관리
 * - DashboardPage.jsx: 사용자 정보 표시
 * - QuizPage.jsx: 퀴즈 데이터 로드
 * - RankingPage.jsx: 랭킹 정보 표시
 * - ProfileSetupPage.jsx: 프로필 저장
 */

// 백엔드 API 기본 URL (.env 파일의 VITE_API_BASE_URL 사용)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * 사용자 프로필 조회 함수
 * 
 * @param {string} id - 사용자 ID
 * @returns {Object} { success: boolean, data: UserProfile | error: string }
 * 
 * 연결: GET /api/users/:userId/profile (백엔드 server.js)
 * 사용처: App.jsx의 loadUserProfile 함수
 */
export const fetchUserProfile = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}/profile`);
    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else if (response.status === 404) {
      console.log("User profile not found, initializing local profile.");
      return {
        success: true,
        data: {
          name: '',
          phone: '',
          nickname: `User_${id.substring(0, 6)}`,
          gender: '',
          birthdate: '',
          totalAssets: 1000000,
          quizProgress: 0,
          quizAccuracy: 0,
          acquiredTitles: [],
          score: 0,
        }
      };
    } else {
      console.error("Failed to fetch user profile:", response.statusText);
      return { success: false, error: '프로필 정보를 불러오는 데 실패했습니다.' };
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { success: false, error: '프로필 정보를 불러오는 중 네트워크 오류가 발생했습니다.' };
  }
};

// 랭킹을 백엔드에서 가져오는 함수
export const fetchRankings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/rankings`);
    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      console.error("Failed to fetch rankings:", response.statusText);
      return { success: false, error: '랭킹 정보를 불러오는 데 실패했습니다.' };
    }
  } catch (error) {
    console.error("Error fetching rankings:", error);
    return { success: false, error: '랭킹 정보를 불러오는 중 네트워크 오류가 발생했습니다.' };
  }
};

// 퀴즈 데이터를 백엔드에서 가져오는 함수
export const fetchQuizzes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/quizzes`);
    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      throw new Error(`Failed to fetch quizzes: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return { success: false, error: "퀴즈를 불러오는 데 실패했습니다." };
  }
};

// 사용자 프로필을 백엔드에 저장하는 함수
export const saveUserProfile = async (userId, profileData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (response.ok) {
      return { success: true };
    } else {
      console.error("Failed to save profile:", response.statusText);
      return { success: false, error: '프로필 저장 중 오류가 발생했습니다.' };
    }
  } catch (error) {
    console.error("Error saving profile:", error);
    return { success: false, error: '프로필 저장 중 네트워크 오류가 발생했습니다.' };
  }
};
