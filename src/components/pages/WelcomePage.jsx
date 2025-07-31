import React from 'react';

const WelcomePage = ({ onNext }) => {
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
        onClick={onNext}
      >
        시작
      </button>
    </div>
  );
};

export default WelcomePage;
