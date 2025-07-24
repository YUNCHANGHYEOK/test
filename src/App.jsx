import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, query, orderBy, getDocs, onSnapshot } from 'firebase/firestore';

// Ensure __app_id, __firebase_config, and __initial_auth_token are defined in the environment
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Initialize Firebase outside of the component to prevent re-initialization
let app, db, auth;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// Quiz data (hardcoded for demonstration)
const quizzes = [
  {
    id: 'q1',
    type: 'multiple-choice',
    question: "'주식'이란 무엇을 의미하나요?",
    options: [
      '기업의 소유권을 나타내는 증서',
      '은행에 예치한 예금',
      '외환 거래에 사용되는 통화',
    ],
    answer: '기업의 소유권을 나타내는 증서',
    explanation: '주식을 소유하면, 해당 회사의 지분을 보유하게 되며, 주주로서 배당금이나 의결권 등의 권리를 가질 수 있습니다.',
  },
  {
    id: 'q2',
    type: 'multiple-choice',
    question: "'PER'이란 무엇을 의미하나요?",
    options: [
      '부채와 자본의 비율',
      '배당금 지급 비율',
      '주가와 기업 이익의 비율',
    ],
    answer: '주가와 기업 이익의 비율',
    explanation: "'PER'은 회사의 순이익에 대비해 주가가 얼마나 높은지를 나타내는 지표입니다.",
  },
  {
    id: 'q3',
    type: 'multiple-choice',
    question: "다음 중 인플레이션에 대한 올바른 설명은 무엇인가요?",
    options: [
      '상품과 서비스의 전반적인 가격 수준이 지속적으로 하락하는 현상',
      '화폐의 구매력이 상승하여 동일한 금액으로 더 많은 상품을 구매할 수 있는 현상',
      '상품과 서비스의 전반적인 가격 수준이 지속적으로 상승하는 현상',
    ],
    answer: '상품과 서비스의 전반적인 가격 수준이 지속적으로 상승하는 현상',
    explanation: '인플레이션은 상품과 서비스의 전반적인 가격 수준이 지속적으로 상승하는 현상을 의미합니다.',
  },
  {
    id: 'q4',
    type: 'multiple-choice',
    question: "투자 포트폴리오를 구성할 때 분산 투자의 주요 목적은 무엇인가요?",
    options: [
      '단일 자산에 집중하여 최대한의 수익을 얻기 위해',
      '다양한 자산에 투자하여 위험을 감소시키기 위해',
      '시장의 특정 트렌드를 따라 수익을 극대화하기 위해',
    ],
    answer: '다양한 자산에 투자하여 위험을 감소시키기 위해',
    explanation: '분산 투자의 주요 목적은 다양한 자산에 투자하여 위험을 감소시키고 안정적인 수익을 추구하는 것입니다.',
  },
  {
    id: 'q5',
    type: 'fill-in-the-blank',
    question: "기업이 투자자에게 이익의 일부를 나눠주기 위해 지급하는 것을 (이)라고 합니다.",
    options: [
      '금리',
      '이자',
      '지원금',
      '배당금',
    ],
    answer: '배당금',
    explanation: '배당금은 주식 투자자들에게 돌아가는 이익의 형태로, 주식의 보유 비율에 따라 지급됩니다.',
  },
];

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('splash');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userNickname, setUserNickname] = useState('');
  const [userGender, setUserGender] = useState('');
  const [userBirthdate, setUserBirthdate] = useState('');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [rankings, setRankings] = useState([]);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpTimer, setOtpTimer] = useState(180); // 3 minutes
  const [otpRunning, setOtpRunning] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  // Firebase Authentication and User Data Listener
  useEffect(() => {
    if (!auth || !db) {
      console.error("Firebase is not initialized.");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        // Attempt to sign in with custom token if available
        if (initialAuthToken && user.isAnonymous) { // Only try if anonymous and token exists
          try {
            await signInWithCustomToken(auth, initialAuthToken);
            console.log("Signed in with custom token.");
          } catch (error) {
            console.error("Error signing in with custom token:", error);
            // Fallback to anonymous if custom token fails
            await signInAnonymously(auth);
            console.log("Signed in anonymously as fallback.");
          }
        }
        setIsAuthReady(true);
      } else {
        // Sign in anonymously if no user or custom token
        try {
          await signInAnonymously(auth);
          console.log("Signed in anonymously.");
        } catch (error) {
          console.error("Error signing in anonymously:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch user profile and rankings once auth is ready
  useEffect(() => {
    if (isAuthReady && userId && db) {
      const userDocRef = doc(db, `artifacts/${appId}/users/${userId}/profile`, 'userProfile');
      const unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        } else {
          // If profile doesn't exist, create a basic one
          setDoc(userDocRef, {
            name: '',
            phone: '',
            nickname: `User_${userId.substring(0, 6)}`,
            gender: '',
            birthdate: '',
            totalAssets: 0,
            quizProgress: 0,
            quizAccuracy: 0,
            acquiredTitles: [],
            score: 0, // Add score for ranking
          });
        }
      }, (error) => {
        console.error("Error fetching user profile:", error);
      });

      const rankingsColRef = collection(db, `artifacts/${appId}/public/data/rankings`);
      const q = query(rankingsColRef); // No orderBy to avoid index issues

      const unsubscribeRankings = onSnapshot(q, (snapshot) => {
        const fetchedRankings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sort in memory to avoid Firestore orderBy issues
        fetchedRankings.sort((a, b) => (b.score || 0) - (a.score || 0));
        setRankings(fetchedRankings);
      }, (error) => {
        console.error("Error fetching rankings:", error);
      });

      return () => {
        unsubscribeProfile();
        unsubscribeRankings();
      };
    }
  }, [isAuthReady, userId, db]);

  const showCustomPopup = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      setPopupMessage('');
    }, 3000); // Popup disappears after 3 seconds
  };

  const handleNextPage = () => {
    switch (currentPage) {
      case 'splash':
        setCurrentPage('welcome');
        break;
      case 'welcome':
        setCurrentPage('onboardingName');
        break;
      case 'onboardingName':
        if (userName.trim() === '') {
          showCustomPopup('이름을 입력해주세요.');
          return;
        }
        setCurrentPage('onboardingPhone');
        break;
      case 'onboardingPhone':
        if (userPhone.trim() === '') {
          showCustomPopup('휴대폰 번호를 입력해주세요.');
          return;
        }
        setCurrentPage('terms');
        break;
      case 'terms':
        if (!termsAgreed || !privacyAgreed) {
          showCustomPopup('필수 약관에 동의해주세요.');
          return;
        }
        setCurrentPage('otp');
        startOtpTimer();
        break;
      case 'otp':
        if (otpInput === '1234') { // Simple OTP validation for demo
          setShowOtpModal(false);
          setCurrentPage('profileSetup');
        } else {
          showCustomPopup('인증번호가 올바르지 않습니다.');
        }
        break;
      case 'profileSetup':
        if (userNickname.trim() === '' || userGender.trim() === '' || userBirthdate.trim() === '') {
          showCustomPopup('모든 프로필 정보를 입력해주세요.');
          return;
        }
        saveUserProfile();
        setCurrentPage('quizIntro');
        break;
      case 'quizIntro':
        setCurrentPage('quiz');
        break;
      case 'quiz':
        if (showResult) {
          if (currentQuizIndex < quizzes.length - 1) {
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
          const currentQuiz = quizzes[currentQuizIndex];
          const correct = selectedOption === currentQuiz.answer;
          setIsCorrect(correct);
          setShowResult(true);
          if (correct) {
            setQuizScore(prevScore => prevScore + 1);
          }
        }
        break;
      case 'quizComplete':
        setCurrentPage('badgeReceive'); // After all quizzes, show "뱃지 받기" screen
        break;
      case 'badgeReceive': // After clicking "뱃지 받기", show the badge and then transition to dashboard
        setCurrentPage('dashboard'); // This will be the "퀴즈 종료" action
        break;
      case 'dashboard':
        // Handle navigation from dashboard, e.g., to quiz categories
        break;
      case 'profile':
        // Handle profile updates
        break;
      case 'ranking':
        // Handle ranking view
        break;
      default:
        setCurrentPage('splash');
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
        setOtpTimer(180);
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
      case 'quizComplete':
        setCurrentPage('quiz'); // Go back to the last quiz question
        break;
      case 'badgeReceive':
        setCurrentPage('quizComplete');
        break;
      case 'profile':
      case 'ranking':
      case 'marketSummary':
        setCurrentPage('dashboard');
        break;
      default:
        setCurrentPage('splash');
    }
  };

  const startOtpTimer = () => {
    setOtpTimer(180); // Reset to 3 minutes
    setOtpRunning(true);
  };

  useEffect(() => {
    let timer;
    if (otpRunning && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setOtpRunning(false);
      showCustomPopup('인증 시간이 만료되었습니다. 재요청해주세요.');
    }
    return () => clearInterval(timer);
  }, [otpRunning, otpTimer]);


  const saveUserProfile = async () => {
    if (!userId || !db) {
      showCustomPopup('사용자 인증 정보를 찾을 수 없습니다.');
      return;
    }
    const userDocRef = doc(db, `artifacts/${appId}/users/${userId}/profile`, 'userProfile');
    const rankingDocRef = doc(db, `artifacts/${appId}/public/data/rankings`, userId);

    try {
      await setDoc(userDocRef, {
        name: userName,
        phone: userPhone,
        nickname: userNickname,
        gender: userGender,
        birthdate: userBirthdate,
        totalAssets: userProfile?.totalAssets || 1000000, // Default starting asset
        quizProgress: quizzes.length, // Assume all quizzes completed for initial badge
        quizAccuracy: (quizScore / quizzes.length) * 100,
        acquiredTitles: userProfile?.acquiredTitles || ['첫 도전'],
        score: quizScore * 10000, // Example score calculation
      }, { merge: true }); // Use merge to update existing fields without overwriting others

      await setDoc(rankingDocRef, {
        userId: userId,
        nickname: userNickname,
        score: quizScore * 10000,
        title: '주린이', // Example title
      }, { merge: true });

      showCustomPopup('프로필이 성공적으로 저장되었습니다!');
    } catch (e) {
      console.error("Error saving profile or ranking: ", e);
      showCustomPopup('프로필 저장 중 오류가 발생했습니다.');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'splash':
        return (
          <div
            className="flex flex-col items-center justify-center min-h-screen bg-white cursor-pointer"
            onClick={handleNextPage}
          >
            {/* Whale Logo - Placeholder SVG */}
            <svg width="200" height="100" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 50C10 22.3858 32.3858 0 60 0C87.6142 0 110 22.3858 110 50C110 77.6142 87.6142 100 60 100C32.3858 100 10 77.6142 10 50Z" fill="#66B2FF"/>
              <path d="M90 50C90 22.3858 112.386 0 140 0C167.614 0 190 22.3858 190 50C190 77.6142 167.614 100 140 100C112.386 100 90 77.6142 90 50Z" fill="#3385FF"/>
              <path d="M100 40C100 17.9086 117.909 0 140 0C162.091 0 180 17.9086 180 40C180 62.0914 162.091 80 140 80C117.909 80 100 62.0914 100 40Z" fill="#0056B3"/>
            </svg>
            <p className="mt-8 text-2xl font-bold text-gray-800">화면을 터치 해주세요</p>
          </div>
        );
      case 'welcome':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
            <div className="bg-gray-100 rounded-full p-8 mb-8 shadow-lg">
              {/* Book Icon - Placeholder SVG */}
              <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6C2 4.89543 2.89543 4 4 4H12C13.1046 4 14 4.89543 14 6V18C14 19.1046 13.1046 20 12 20H4C2.89543 20 2 19.1046 2 18V6Z" fill="#66B2FF"/>
                <path d="M10 6C10 4.89543 10.8954 4 12 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H12C10.8954 20 10 19.1046 10 18V6Z" fill="#3385FF"/>
                <path d="M12 4L12 20" stroke="#0056B3" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">주린이</h1>
            <p className="text-lg text-gray-600 mb-8">금융공부를 시작해볼게요!</p>
            <button
              className="w-full max-w-sm bg-blue-600 text-white py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors"
              onClick={handleNextPage}
            >
              시작
            </button>
          </div>
        );
      case 'onboardingName':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
            <div className="w-full flex justify-start mb-8">
              <button onClick={handlePrevPage} className="text-gray-600 text-2xl font-bold">
                &lt;
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">이름을 작성해주세요</h1>
            <p className="text-md text-gray-500 mb-8">가입하는 분의 정보로 작성해주세요.</p>
            <input
              type="text"
              className="w-full max-w-md p-4 mb-8 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="윤창혁"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <button
              className="w-full max-w-sm bg-blue-600 text-white py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors"
              onClick={handleNextPage}
            >
              다음
            </button>
          </div>
        );
      case 'onboardingPhone':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
            <div className="w-full flex justify-start mb-8">
              <button onClick={handlePrevPage} className="text-gray-600 text-2xl font-bold">
                &lt;
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">휴대폰 번호를 입력해주세요</h1>
            <p className="text-md text-gray-500 mb-8">가입하는 분의 정보로 작성해주세요.</p>
            <input
              type="tel"
              className="w-full max-w-md p-4 mb-8 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="010-1234-1234"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
            />
            <button
              className="w-full max-w-sm bg-blue-600 text-white py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors"
              onClick={handleNextPage}
            >
              다음
            </button>
          </div>
        );
      case 'terms':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
            <div className="w-full flex justify-start mb-8">
              <button onClick={handlePrevPage} className="text-gray-600 text-2xl font-bold">
                &lt;
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Plain edu 약관 동의가 필요해요</h1>
            <div className="w-full max-w-md bg-gray-50 p-6 rounded-lg shadow-md">
              <label className="flex items-center mb-4 text-lg text-gray-700">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600 rounded mr-3"
                  checked={termsAgreed && privacyAgreed}
                  onChange={() => {
                    const newValue = !(termsAgreed && privacyAgreed);
                    setTermsAgreed(newValue);
                    setPrivacyAgreed(newValue);
                  }}
                />
                서비스 이용약관 전체동의
              </label>
              <label className="flex items-center mb-4 text-gray-700">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600 rounded mr-3"
                  checked={termsAgreed}
                  onChange={() => setTermsAgreed(!termsAgreed)}
                />
                Plain edu 서비스 이용약관 (필수)
                <span className="ml-auto text-blue-500">&gt;</span>
              </label>
              <label className="flex items-center mb-4 text-gray-700">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600 rounded mr-3"
                  checked={privacyAgreed}
                  onChange={() => setPrivacyAgreed(!privacyAgreed)}
                />
                개인정보 처리방침 (필수)
                <span className="ml-auto text-blue-500">&gt;</span>
              </label>
              <label className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600 rounded mr-3"
                  checked={marketingAgreed}
                  onChange={() => setMarketingAgreed(!marketingAgreed)}
                />
                마케팅 정보 수신 동의 (선택)
                <span className="ml-auto text-blue-500">&gt;</span>
              </label>
            </div>
            <button
              className="w-full max-w-sm bg-blue-600 text-white py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors mt-8"
              onClick={handleNextPage}
            >
              다음
            </button>
          </div>
        );
      case 'otp':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
            <div className="w-full flex justify-start mb-8">
              <button onClick={handlePrevPage} className="text-gray-600 text-2xl font-bold">
                &lt;
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">인증번호</h1>
            <p className="text-md text-gray-500 mb-8">인증번호를 입력해주세요</p>
            <div className="flex items-center mb-8">
              <span className="text-xl font-semibold text-gray-700 mr-4">
                {Math.floor(otpTimer / 60).toString().padStart(2, '0')}:{(otpTimer % 60).toString().padStart(2, '0')}
              </span>
              <input
                type="text"
                maxLength="4"
                className="w-32 p-4 text-center border border-gray-300 rounded-lg text-3xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
              />
              {/* Simple OTP input simulation */}
              <div className="flex ml-4 space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xl font-bold text-gray-700">
                    {otpInput[i] || ''}
                  </div>
                ))}
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-xl font-bold text-white">
                  {otpInput[3] || '7'} {/* Example last digit from design */}
                </div>
              </div>
            </div>
            <button
              className="bg-gray-200 text-gray-700 py-3 px-6 rounded-full text-lg font-semibold shadow-md hover:bg-gray-300 transition-colors mb-4"
              onClick={startOtpTimer}
              disabled={otpRunning}
            >
              재요청
            </button>
            <button
              className="w-full max-w-sm bg-blue-600 text-white py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors"
              onClick={handleNextPage}
            >
              다음
            </button>
          </div>
        );
      case 'profileSetup':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">나만의 프로필을 설정해주세요</h1>
            <div className="w-full max-w-md p-6 bg-gray-50 rounded-lg shadow-md">
              <div className="mb-4">
                <label className="block text-gray-700 text-lg font-semibold mb-2">닉네임</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="닉네임"
                  value={userNickname}
                  onChange={(e) => setUserNickname(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-lg font-semibold mb-2">성별</label>
                <div className="flex space-x-4">
                  <label className="flex items-center text-gray-700">
                    <input
                      type="radio"
                      name="gender"
                      value="남성"
                      checked={userGender === '남성'}
                      onChange={(e) => setUserGender(e.target.value)}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">남성</span>
                  </label>
                  <label className="flex items-center text-gray-700">
                    <input
                      type="radio"
                      name="gender"
                      value="여성"
                      checked={userGender === '여성'}
                      onChange={(e) => setUserGender(e.target.value)}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">여성</span>
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-lg font-semibold mb-2">생년월일</label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={userBirthdate}
                  onChange={(e) => setUserBirthdate(e.target.value)}
                />
              </div>
            </div>
            <button
              className="w-full max-w-sm bg-blue-600 text-white py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors mt-8"
              onClick={handleNextPage}
            >
              다음
            </button>
          </div>
        );
      case 'quizIntro':
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
      case 'quiz':
        const currentQuiz = quizzes[currentQuizIndex];
        return (
          <div className="flex flex-col items-center min-h-screen bg-white p-4">
            <div className="w-full flex justify-end mb-4">
              <span className="text-lg font-semibold text-gray-600">
                {currentQuizIndex + 1} / {quizzes.length}
              </span>
            </div>
            <div className="w-full max-w-md bg-gray-100 rounded-lg p-6 mb-8 shadow-lg">
              {/* Placeholder for image from page 13 */}
              <div className="w-full h-40 bg-gray-200 rounded-lg mb-6 flex items-center justify-center">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="#3385FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 15L10 12L13 15L17 9" stroke="#66B2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="9" r="2" fill="#66B2FF"/>
                  <rect x="15" y="8" width="2" height="8" fill="#0056B3"/>
                  <rect x="18" y="10" width="2" height="6" fill="#0056B3"/>
                  <rect x="12" y="12" width="2" height="4" fill="#0056B3"/>
                  <rect x="9" y="14" width="2" height="2" fill="#0056B3"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">{currentQuiz.question}</h2>
              <div className="space-y-4">
                {currentQuiz.options.map((option, index) => (
                  <button
                    key={index}
                    className={`w-full p-4 rounded-lg border text-left text-lg font-medium transition-colors
                      ${selectedOption === option
                        ? (showResult ? (isCorrect ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-500 text-red-800') : 'bg-blue-100 border-blue-500 text-blue-800')
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }
                      ${showResult && currentQuiz.answer === option ? 'border-green-500 bg-green-100 text-green-800' : ''}
                    `}
                    onClick={() => !showResult && setSelectedOption(option)}
                    disabled={showResult}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            {showResult && (
              <div className={`w-full max-w-md p-4 rounded-lg mt-4 ${isCorrect ? 'bg-green-500' : 'bg-red-500'} text-white text-center font-bold text-lg`}>
                {isCorrect ? '정답입니다' : '오답입니다'}
                {!isCorrect && <p className="text-sm mt-2">정답: {currentQuiz.answer}</p>}
                <p className="text-sm mt-2">{currentQuiz.explanation}</p>
              </div>
            )}
            <button
              className="w-full max-w-sm bg-blue-600 text-white py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors mt-8"
              onClick={handleNextPage}
            >
              다음
            </button>
          </div>
        );
      case 'quizComplete':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
            {/* Confetti Animation - Placeholder */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Simple circles/stars for confetti effect */}
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
              onClick={handleNextPage} // This button now directly leads to the dashboard
            >
              퀴즈 종료
            </button>
          </div>
        );
      case 'dashboard':
        return (
          <div className="flex flex-col min-h-screen bg-gray-100 p-4 pb-20">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">내 금융지식</h1>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <p className="text-3xl font-bold text-blue-600 mb-2">{userProfile?.totalAssets?.toLocaleString() || '1,000,000'}원</p>
              <p className="text-lg text-green-500 mb-4">일주일 전 대비 +12%</p>
              {/* Placeholder for chart */}
              <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>7일 전</span>
                <span>5일 전</span>
                <span>3일 전</span>
                <span>1일 전</span>
                <span>현재</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                className="bg-blue-600 text-white py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors"
                onClick={() => {
                  setCurrentQuizIndex(0);
                  setSelectedOption(null);
                  setShowResult(false);
                  setIsCorrect(false);
                  setCurrentPage('quiz');
                }}
              >
                퀴즈 풀기
              </button>
              <button className="bg-green-500 text-white py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-green-600 transition-colors">
                수익 실현하기
              </button>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-4">원하는 분야 퀴즈 풀기</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {['반도체', '바이오', '조선', '2차 전지'].map((sector) => (
                <button key={sector} className="bg-white border border-gray-300 py-3 rounded-lg text-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  {sector}
                </button>
              ))}
            </div>

            {/* Market Summary Section - Simplified */}
            <h2 className="text-xl font-bold text-gray-800 mb-4">오늘 장 요약</h2>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">미국 증시 마감 25.07.23</h3>
              <p className="text-gray-700">S&P500 +0.06%, 나스닥 -0.39%</p>
              <p className="text-gray-600 text-sm mt-2">기술주 자금이 경기방어주로 이동하며 혼조세</p>
              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">상승 섹터</h3>
              <p className="text-green-600">전기차 +4.17%, 헬스케어 +3.20%</p>
              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">하락 섹터</h3>
              <p className="text-red-600">양자컴퓨터 -1.55%, 반도체 -1.18%</p>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 shadow-lg">
              <button onClick={() => setCurrentPage('dashboard')} className="flex flex-col items-center text-blue-600">
                {/* Home Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                <span className="text-xs">홈</span>
              </button>
              <button onClick={() => setCurrentPage('ranking')} className="flex flex-col items-center text-gray-500 hover:text-blue-600">
                {/* Ranking Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trophy"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 11V7"/><path d="M14 11V7"/><path d="M14 15v-4"/><path d="M10 15v-4"/><path d="M8 22v-4h8v4"/><path d="M12 17v5"/><path d="M12 11h.01"/><path d="M12 15h.01"/></svg>
                <span className="text-xs">순위</span>
              </button>
              <button className="flex flex-col items-center text-gray-500 hover:text-blue-600">
                {/* Premium Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-gem"><path d="M6 2L3 6l14 16 3-4L6 2z"/><path d="M11 2L2 6l14 16 9-4L11 2z"/></svg>
                <span className="text-xs">프리미엄</span>
              </button>
              <button onClick={() => setCurrentPage('profile')} className="flex flex-col items-center text-gray-500 hover:text-blue-600">
                {/* Profile Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span className="text-xs">프로필</span>
              </button>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="flex flex-col min-h-screen bg-gray-100 p-4 pb-20">
            <div className="w-full flex justify-start mb-4">
              <button onClick={() => setCurrentPage('dashboard')} className="text-gray-600 text-2xl font-bold">
                &lt;
              </button>
            </div>
            <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-6 mb-6">
              {/* Profile Image Placeholder */}
              <div className="w-24 h-24 rounded-full bg-gray-300 mb-4 flex items-center justify-center text-gray-600 text-sm overflow-hidden">
                {/* Placeholder image for profile picture */}
                <img src="https://placehold.co/96x96/cccccc/333333?text=Profile" alt="Profile" className="w-full h-full object-cover"/>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">{userProfile?.nickname || '닉네임 없음'}</h1>
              <p className="text-md text-gray-600 mb-2">다들 성투하세요~</p>
              <p className="text-lg font-semibold text-blue-600 mb-4">주린이 현재 {(userProfile?.totalAssets - 1000000).toLocaleString() || '0'}원 수익</p>
              <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-full text-sm font-semibold hover:bg-gray-300 transition-colors">
                프로필 수정
              </button>
              <p className="text-sm text-gray-500 mt-2">User ID: {userId}</p> {/* Display userId */}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">퀴즈 진행도</h2>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="bg-blue-600 h-4 rounded-full"
                  style={{ width: `${userProfile?.quizProgress}%` }}
                ></div>
              </div>
              <p className="text-md text-gray-600 mb-4">목표까지 {100 - (userProfile?.quizProgress || 0)}% 남았어요!</p>

              <h2 className="text-xl font-bold text-gray-800 mb-4">획득 타이틀</h2>
              <div className="flex flex-wrap gap-2">
                {userProfile?.acquiredTitles?.map((title, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {title}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">총 자산</h2>
              <p className="text-2xl font-bold text-blue-600 mb-4">{userProfile?.totalAssets?.toLocaleString() || '1,000,000'}원</p>

              <h2 className="text-xl font-bold text-gray-800 mb-4">퀴즈 정답률</h2>
              <p className="text-2xl font-bold text-green-600 mb-4">{userProfile?.quizAccuracy?.toFixed(0) || '0'}%</p>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 shadow-lg">
              <button onClick={() => setCurrentPage('dashboard')} className="flex flex-col items-center text-gray-500 hover:text-blue-600">
                {/* Home Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                <span className="text-xs">홈</span>
              </button>
              <button onClick={() => setCurrentPage('ranking')} className="flex flex-col items-center text-gray-500 hover:text-blue-600">
                {/* Ranking Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trophy"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 11V7"/><path d="M14 11V7"/><path d="M14 15v-4"/><path d="M10 15v-4"/><path d="M8 22v-4h8v4"/><path d="M12 17v5"/><path d="M12 11h.01"/><path d="M12 15h.01"/></svg>
                <span className="text-xs">순위</span>
              </button>
              <button className="flex flex-col items-center text-gray-500 hover:text-blue-600">
                {/* Premium Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-gem"><path d="M6 2L3 6l14 16 3-4L6 2z"/><path d="M11 2L2 6l14 16 9-4L11 2z"/></svg>
                <span className="text-xs">프리미엄</span>
              </button>
              <button onClick={() => setCurrentPage('profile')} className="flex flex-col items-center text-blue-600">
                {/* Profile Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span className="text-xs">프로필</span>
              </button>
            </div>
          </div>
        );
      case 'ranking':
        return (
          <div className="flex flex-col min-h-screen bg-gray-100 p-4 pb-20">
            <div className="w-full flex justify-start mb-4">
              <button onClick={() => setCurrentPage('dashboard')} className="text-gray-600 text-2xl font-bold">
                &lt;
              </button>
            </div>
            <div className="flex justify-around bg-white rounded-t-lg shadow-md mb-4 p-2">
              <button className="py-2 px-4 text-blue-600 font-semibold border-b-2 border-blue-600">전체 랭킹</button>
              <button className="py-2 px-4 text-gray-600 font-semibold">친구 랭킹</button>
              <button className="py-2 px-4 text-gray-600 font-semibold">친구목록</button>
            </div>

            <div className="bg-white rounded-b-lg shadow-md p-6">
              <div className="grid grid-cols-3 font-bold text-gray-700 border-b pb-2 mb-4">
                <span>순위</span>
                <span>이름</span>
                <span>점수</span>
              </div>
              {rankings.map((rank, index) => (
                <div key={rank.id} className={`grid grid-cols-3 items-center py-3 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} rounded-lg mb-2`}>
                  <span className="text-center font-semibold">{index + 1}위</span>
                  <div className="flex items-center">
                    {/* Profile image placeholder */}
                    <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                      <img src={`https://placehold.co/40x40/cccccc/333333?text=User`} alt="User" className="w-full h-full object-cover"/>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{rank.nickname}</p>
                      <p className="text-sm text-gray-500">{rank.title}</p>
                    </div>
                  </div>
                  <span className="text-right font-semibold text-blue-600">{rank.score?.toLocaleString()}p</span>
                </div>
              ))}
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 shadow-lg">
              <button onClick={() => setCurrentPage('dashboard')} className="flex flex-col items-center text-gray-500 hover:text-blue-600">
                {/* Home Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                <span className="text-xs">홈</span>
              </button>
              <button onClick={() => setCurrentPage('ranking')} className="flex flex-col items-center text-blue-600">
                {/* Ranking Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trophy"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 11V7"/><path d="M14 11V7"/><path d="M14 15v-4"/><path d="M10 15v-4"/><path d="M8 22v-4h8v4"/><path d="M12 17v5"/><path d="M12 11h.01"/><path d="M12 15h.01"/></svg>
                <span className="text-xs">순위</span>
              </button>
              <button className="flex flex-col items-center text-gray-500 hover:text-blue-600">
                {/* Premium Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-gem"><path d="M6 2L3 6l14 16 3-4L6 2z"/><path d="M11 2L2 6l14 16 9-4L11 2z"/></svg>
                <span className="text-xs">프리미엄</span>
              </button>
              <button onClick={() => setCurrentPage('profile')} className="flex flex-col items-center text-gray-500 hover:text-blue-600">
                {/* Profile Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span className="text-xs">프로필</span>
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <h1 className="text-3xl font-bold text-gray-800">페이지를 찾을 수 없습니다.</h1>
            <button
              className="mt-8 bg-blue-600 text-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
              onClick={() => setCurrentPage('splash')}
            >
              시작 화면으로 돌아가기
            </button>
          </div>
        );
    }
  };

  return (
    <div className="App font-inter">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com"></script>
      {renderPage()}

      {/* Custom Popup Message */}
      {showPopup && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in-out">
          {popupMessage}
        </div>
      )}
      <style>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; }
          10%, 90% { opacity: 1; }
        }
        .animate-fade-in-out {
          animation: fadeInOut 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
