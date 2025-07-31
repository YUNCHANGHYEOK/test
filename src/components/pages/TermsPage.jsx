import React from 'react';

const TermsPage = ({ 
  termsAgreed, 
  setTermsAgreed, 
  privacyAgreed, 
  setPrivacyAgreed, 
  marketingAgreed, 
  setMarketingAgreed, 
  onNext, 
  onPrev,
  showPopup 
}) => {
  const handleNext = () => {
    if (!termsAgreed || !privacyAgreed) {
      showPopup('필수 약관에 동의해주세요.');
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
        onClick={handleNext}
      >
        다음
      </button>
    </div>
  );
};

export default TermsPage;
