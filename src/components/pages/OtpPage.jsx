import React from 'react';

const OtpPage = ({ 
  otpInput, 
  setOtpInput, 
  otpTimer, 
  otpRunning, 
  startOtpTimer, 
  onNext, 
  onPrev,
  showPopup 
}) => {
  const handleNext = () => {
    if (otpInput === '1234') {
      onNext();
    } else {
      showPopup('인증번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full flex justify-start mb-8">
        <button onClick={onPrev} className="text-gray-600 text-2xl font-bold">
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
            {otpInput[3] || '7'}
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
        onClick={handleNext}
      >
        다음
      </button>
    </div>
  );
};

export default OtpPage;
