import React from 'react';

const OnboardingNamePage = ({ userName, setUserName, onNext, onPrev, showPopup }) => {
  const handleNext = () => {
    if (userName.trim() === '') {
      showPopup('이름을 입력해주세요.');
      return;
    }
    onNext();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full flex justify-start mb-8">
        <button onClick={onPrev} className="text-gray-600 text-2xl font-bold">
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
        onClick={handleNext}
      >
        다음
      </button>
    </div>
  );
};

export default OnboardingNamePage;
