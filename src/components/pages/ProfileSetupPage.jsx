import React from 'react';

const ProfileSetupPage = ({ 
  userNickname, 
  setUserNickname, 
  userGender, 
  setUserGender, 
  userBirthdate, 
  setUserBirthdate, 
  onNext,
  showPopup 
}) => {
  const handleNext = () => {
    if (userNickname.trim() === '' || userGender.trim() === '' || userBirthdate.trim() === '') {
      showPopup('모든 프로필 정보를 입력해주세요.');
      return;
    }
    onNext();
  };

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
        onClick={handleNext}
      >
        다음
      </button>
    </div>
  );
};

export default ProfileSetupPage;
