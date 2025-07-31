/**
 * 메인 App 컴포넌트 - 애플리케이션의 핵심 라우터 역할
 * 
 * 주요 기능:
 * 1. 페이지 라우팅 관리 (splash → welcome → onboarding → dashboard 등)
 * 2. 전역 상태 관리 (사용자 정보, 퀴즈 데이터, 랭킹 등)
 * 3. 백엔드 API와의 데이터 통신 조율
 * 4. 사용자 인증 및 프로필 관리
 * 
 * 연결되는 컴포넌트들:
 * - pages/: 각 화면별 페이지 컴포넌트들
 * - common/: 공통으로 사용되는 UI 컴포넌트들
 * - hooks/: 재사용 가능한 로직 (팝업, OTP 타이머)
 * - utils/api.js: 백엔드 서버와의 통신
 */
import React, { useState, useEffect, useCallback } from 'react';

// 백엔드 API 통신 함수들 (utils/api.js에서 가져옴)
import { fetchUserProfile, fetchRankings, fetchQuizzes, saveUserProfile as saveProfileAPI } from './utils/api';

// 재사용 가능한 로직을 담은 커스텀 훅들
import { usePopup } from './hooks/usePopup';        // 팝업 상태 관리
import { useOtpTimer } from './hooks/useOtpTimer';  // OTP 타이머 관리

// 각 화면을 담당하는 페이지 컴포넌트들
import SplashPage from './components/pages/SplashPage';           // 시작 화면
import WelcomePage from './components/pages/WelcomePage';         // 환영 화면
import OnboardingNamePage from './components/pages/OnboardingNamePage';     // 이름 입력
import OnboardingPhonePage from './components/pages/OnboardingPhonePage';   // 전화번호 입력
import TermsPage from './components/pages/TermsPage';             // 약관 동의
import OtpPage from './components/pages/OtpPage';                 // OTP 인증
import ProfileSetupPage from './components/pages/ProfileSetupPage';         // 프로필 설정
import DashboardPage from './components/pages/DashboardPage';     // 메인 대시보드
import QuizPage from './components/pages/QuizPage';               // 퀴즈 화면
import RankingPage from './components/pages/RankingPage';         // 랭킹 화면

// 여러 페이지에서 공통으로 사용되는 UI 컴포넌트들
import Popup from './components/common/Popup';                    // 알림/확인 팝업

/**
 * 메인 App 컴포넌트
 * 전체 애플리케이션의 상태와 페이지 전환을 관리
 */
const App = () => {
  // ========== 페이지 라우팅 상태 ==========
  const [currentPage, setCurrentPage] = useState('splash');  // 현재 표시할 페이지
  
  // ========== 사용자 정보 상태 ==========
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userNickname, setUserNickname] = useState('');
  const [userGender, setUserGender] = useState('');
  const [userBirthdate, setUserBirthdate] = useState('');
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  
  // 퀴즈 관련 상태
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [fetchedQuizzes, setFetchedQuizzes] = useState([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(true);
  const [quizFetchError, setQuizFetchError] = useState(null);
  
  // 기타 상태
  const [rankings, setRankings] = useState([]);
  const [otpInput, setOtpInput] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);

  // 커스텀 훅 사용
  const { showPopup, popupMessage, showCustomPopup } = usePopup();
  const { otpTimer, otpRunning, setOtpRunning, startOtpTimer } = useOtpTimer();

  // 사용자 프로필을 가져오는 함수
  const fetchUserProfileData = useCallback(async (id) => {
    const result = await fetchUserProfile(id);
    if (result.success) {
      setUserProfile(result.data);
    } else {
      showCustomPopup(result.error);
    }
  }, [showCustomPopup]);

  // 랭킹을 가져오는 함수
  const fetchRankingsData = useCallback(async () => {
    const result = await fetchRankings();
    if (result.success) {
      setRankings(result.data);
    } else {
      showCustomPopup(result.error);
    }
  }, [showCustomPopup]);

  // 사용자 ID 초기화
  useEffect(() => {
    let storedUserId = localStorage.getItem('plainEduUserId');
    if (!storedUserId) {
      storedUserId = crypto.randomUUID();
      localStorage.setItem('plainEduUserId', storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  // userId가 설정되면 사용자 프로필 및 랭킹을 가져옴
  useEffect(() => {
    if (userId) {
      fetchUserProfileData(userId);
      fetchRankingsData();
    }
  }, [userId, fetchUserProfileData, fetchRankingsData]);

  // 퀴즈 데이터 가져오기
  useEffect(() => {
    const fetchAllQuizzes = async () => {
      setIsLoadingQuizzes(true);
      setQuizFetchError(null);
      const result = await fetchQuizzes();
      if (result.success) {
        setFetchedQuizzes(result.data);
      } else {
        setQuizFetchError(result.error);
      }
      setIsLoadingQuizzes(false);
    };
    fetchAllQuizzes();
  }, []);

  // OTP 타이머 만료 처리
  useEffect(() => {
    if (otpTimer === 0 && otpRunning) {
      setOtpRunning(false);
      showCustomPopup('인증 시간이 만료되었습니다. 재요청해주세요.');
    }
  }, [otpTimer, otpRunning, setOtpRunning, showCustomPopup]);

  // 사용자 프로필 저장
  const saveUserProfile = async () => {
    if (!userId) {
      showCustomPopup('사용자 인증 정보를 찾을 수 없습니다.');
      return;
    }

    const profileData = {
      name: userName,
      phone: userPhone,
      nickname: userNickname,
      gender: userGender,
      birthdate: userBirthdate,
      totalAssets: userProfile?.totalAssets || 1000000,
      quizProgress: fetchedQuizzes.length,
      quizAccuracy: (quizScore / fetchedQuizzes.length) * 100,
      acquiredTitles: userProfile?.acquiredTitles || ['첫 도전'],
      score: quizScore * 10000,
    };

    const result = await saveProfileAPI(userId, profileData);
    if (result.success) {
      showCustomPopup('프로필이 성공적으로 저장되었습니다!');
      fetchUserProfileData(userId);
      fetchRankingsData();
    } else {
      showCustomPopup(result.error);
    }
  };

  // 페이지 네비게이션 핸들러
  const handleNextPage = () => {
    switch (currentPage) {
      case 'splash':
        setCurrentPage('welcome');
        break;
      case 'welcome':
        setCurrentPage('onboardingName');
        break;
      case 'onboardingName':
        setCurrentPage('onboardingPhone');
        break;
      case 'onboardingPhone':
        setCurrentPage('terms');
        break;
      case 'terms':
        setCurrentPage('otp');
        startOtpTimer();
        break;
      case 'otp':
        setCurrentPage('profileSetup');
        break;
      case 'profileSetup':
        saveUserProfile();
        setCurrentPage('quizIntro');
        break;
      case 'quizIntro':
        if (isLoadingQuizzes || quizFetchError) {
          showCustomPopup(quizFetchError || '퀴즈 데이터를 불러오는 중입니다. 잠시만 기다려 주세요.');
          return;
        }
        setCurrentPage('quiz');
        break;
      case 'quiz':
        if (showResult) {
          if (currentQuizIndex < fetchedQuizzes.length - 1) {
            setCurrentQuizIndex(currentQuizIndex + 1);
            setSelectedOption(null);
            setShowResult(false);
            setIsCorrect(false);
          } else {
            setCurrentPage('quizComplete');
          }
        } else {
          if (selectedOption === null) {
            showCustomPopup('답변을 선택해주세요.');
            return;
          }
          const currentQuiz = fetchedQuizzes[currentQuizIndex];
          const correct = selectedOption === currentQuiz.answer;
          setIsCorrect(correct);
          setShowResult(true);
          if (correct) {
            setQuizScore(prevScore => prevScore + 1);
          }
        }
        break;
      case 'quizComplete':
        setCurrentPage('badgeReceive');
        break;
      case 'badgeReceive':
        setCurrentPage('dashboard');
        break;
      default:
        setCurrentPage('dashboard');
    }
  };

  const handlePrevPage = () => {
    switch (currentPage) {
      case 'onboardingPhone':
        setCurrentPage('onboardingName');
        break;
      case 'terms':
        setCurrentPage('onboardingPhone');
        break;
      case 'otp':
        setCurrentPage('terms');
        setOtpRunning(false);
        break;
      case 'profileSetup':
        setCurrentPage('otp');
        break;
      case 'quizIntro':
        setCurrentPage('profileSetup');
        break;
      case 'quiz':
        if (currentQuizIndex > 0) {
          setCurrentQuizIndex(currentQuizIndex - 1);
          setSelectedOption(null);
          setShowResult(false);
          setIsCorrect(false);
        } else {
          setCurrentPage('quizIntro');
        }
        break;
      default:
        setCurrentPage('dashboard');
    }
  };

  // 페이지 렌더링
  const renderPage = () => {
    switch (currentPage) {
      case 'splash':
        return <SplashPage onNext={handleNextPage} />;
      
      case 'welcome':
        return <WelcomePage onNext={handleNextPage} />;
      
      case 'onboardingName':
        return (
          <OnboardingNamePage
            userName={userName}
            setUserName={setUserName}
            onNext={handleNextPage}
            onPrev={handlePrevPage}
            showPopup={showCustomPopup}
          />
        );
      
      case 'onboardingPhone':
        return (
          <OnboardingPhonePage
            userPhone={userPhone}
            setUserPhone={setUserPhone}
            onNext={handleNextPage}
            onPrev={handlePrevPage}
            showPopup={showCustomPopup}
          />
        );
      
      case 'terms':
        return (
          <TermsPage
            termsAgreed={termsAgreed}
            setTermsAgreed={setTermsAgreed}
            privacyAgreed={privacyAgreed}
            setPrivacyAgreed={setPrivacyAgreed}
            marketingAgreed={marketingAgreed}
            setMarketingAgreed={setMarketingAgreed}
            onNext={handleNextPage}
            onPrev={handlePrevPage}
            showPopup={showCustomPopup}
          />
        );
      
      case 'otp':
        return (
          <OtpPage
            otpInput={otpInput}
            setOtpInput={setOtpInput}
            otpTimer={otpTimer}
            otpRunning={otpRunning}
            startOtpTimer={startOtpTimer}
            onNext={handleNextPage}
            onPrev={handlePrevPage}
            showPopup={showCustomPopup}
          />
        );
      
      case 'profileSetup':
        return (
          <ProfileSetupPage
            userNickname={userNickname}
            setUserNickname={setUserNickname}
            userGender={userGender}
            setUserGender={setUserGender}
            userBirthdate={userBirthdate}
            setUserBirthdate={setUserBirthdate}
            onNext={handleNextPage}
            showPopup={showCustomPopup}
          />
        );

      case 'quizIntro':
        if (isLoadingQuizzes) {
          return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
              <p className="text-xl font-semibold text-gray-700">퀴즈 데이터를 불러오는 중...</p>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mt-4"></div>
            </div>
          );
        }
        if (quizFetchError) {
          return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
              <p className="text-xl font-semibold text-red-600">{quizFetchError}</p>
              <button
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-full"
                onClick={() => window.location.reload()}
              >
                다시 시도
              </button>
            </div>
          );
        }
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{userProfile?.nickname || userName}님의 금융지식을</h1>
            <p className="text-xl text-gray-600 mb-8">체크해볼게요!</p>
            <button
              className="w-full max-w-sm bg-blue-600 text-white py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors"
              onClick={handleNextPage}
            >
              다음
            </button>
          </div>
        );
      
      case 'dashboard':
        return (
          <DashboardPage
            userProfile={userProfile}
            setCurrentPage={setCurrentPage}
            setCurrentQuizIndex={setCurrentQuizIndex}
            setSelectedOption={setSelectedOption}
            setShowResult={setShowResult}
            setIsCorrect={setIsCorrect}
          />
        );
      
      case 'quiz':
        return (
          <QuizPage
            fetchedQuizzes={fetchedQuizzes}
            currentQuizIndex={currentQuizIndex}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            showResult={showResult}
            isCorrect={isCorrect}
            onNext={handleNextPage}
            showPopup={showCustomPopup}
          />
        );
      
      case 'ranking':
        return (
          <RankingPage
            rankings={rankings}
            setCurrentPage={setCurrentPage}
          />
        );

      case 'quizComplete':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 50 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-blue-400 rounded-full opacity-70"
                  style={{
                    width: `${Math.random() * 10 + 5}px`,
                    height: `${Math.random() * 10 + 5}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `fall ${Math.random() * 3 + 2}s linear infinite`,
                    animationDelay: `-${Math.random() * 5}s`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                  }}
                />
              ))}
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4 z-10">문제를 모두 풀었어요!</h1>
            <p className="text-xl text-gray-600 mb-8 z-10">도전 뱃지를 드릴게요~</p>
            <button
              className="w-full max-w-sm bg-blue-600 text-white py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors z-10"
              onClick={handleNextPage}
            >
              뱃지 받기
            </button>
            <style>{`
              @keyframes fall {
                0% { transform: translateY(-100px) rotate(0deg); opacity: 0; }
                20% { opacity: 1; }
                100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
              }
            `}</style>
          </div>
        );

      case 'badgeReceive':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">첫 도전</h1>
            <p className="text-xl text-gray-600 mb-8">금융공부를 시작했어요</p>
            <button
              className="w-full max-w-sm bg-blue-600 text-white py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors"
              onClick={handleNextPage}
            >
              퀴즈 종료
            </button>
          </div>
        );
      
      // 여기에 다른 페이지들도 추가할 수 있습니다 (terms, otp, profileSetup 등)
      
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <h1 className="text-3xl font-bold text-gray-800">개발 중인 페이지입니다</h1>
            <p className="text-lg text-gray-600 mt-4">현재 페이지: {currentPage}</p>
            <button
              className="mt-8 bg-blue-600 text-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
              onClick={() => setCurrentPage('dashboard')}
            >
              대시보드로 이동
            </button>
          </div>
        );
    }
  };

  return (
    <div className="App font-inter">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      {renderPage()}
      <Popup showPopup={showPopup} message={popupMessage} />
    </div>
  );
};

export default App;
