import React from 'react';
import BottomNavigation from '../common/BottomNavigation';

const DashboardPage = ({ 
  userProfile, 
  setCurrentPage, 
  setCurrentQuizIndex, 
  setSelectedOption, 
  setShowResult, 
  setIsCorrect 
}) => {
  const handleQuizStart = () => {
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setIsCorrect(false);
    setCurrentPage('quiz');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4 pb-20">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">내 금융지식</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <p className="text-3xl font-bold text-blue-600 mb-2">{userProfile?.totalAssets?.toLocaleString() || '1,000,000'}원</p>
        <p className="text-lg text-green-500 mb-4">일주일 전 대비 +12%</p>
        {/* 차트용 자리 표시자 */}
        <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
          <img src="https://placehold.co/300x128/e0e0e0/888888?text=Chart" alt="Chart Placeholder" className="w-full h-full object-cover rounded-lg"/>
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
          onClick={handleQuizStart}
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

      <BottomNavigation currentPage="dashboard" setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default DashboardPage;
