import React from 'react';

const QuizPage = ({ 
  fetchedQuizzes,
  currentQuizIndex,
  selectedOption,
  setSelectedOption,
  showResult,
  isCorrect,
  onNext,
  showPopup 
}) => {
  if (!fetchedQuizzes || fetchedQuizzes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
        <p className="text-xl font-semibold text-gray-700">퀴즈 데이터를 불러오는 중...</p>
      </div>
    );
  }

  const currentQuiz = fetchedQuizzes[currentQuizIndex];
  
  const handleNext = () => {
    if (!showResult && selectedOption === null) {
      showPopup('답변을 선택해주세요.');
      return;
    }
    onNext();
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white p-4">
      <div className="w-full flex justify-end mb-4">
        <span className="text-lg font-semibold text-gray-600">
          {currentQuizIndex + 1} / {fetchedQuizzes.length}
        </span>
      </div>
      <div className="w-full max-w-md bg-gray-100 rounded-lg p-6 mb-8 shadow-lg">
        {/* Placeholder for image */}
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
        onClick={handleNext}
      >
        다음
      </button>
    </div>
  );
};

export default QuizPage;
