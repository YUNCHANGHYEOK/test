import React from 'react';
import BottomNavigation from '../common/BottomNavigation';

const RankingPage = ({ rankings, setCurrentPage }) => {
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
          <div key={rank.userId} className={`grid grid-cols-3 items-center py-3 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} rounded-lg mb-2`}>
            <span className="text-center font-semibold">{index + 1}위</span>
            <div className="flex items-center">
              {/* Profile image placeholder */}
              <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                <img src={`https://placehold.co/40x40/cccccc/333333?text=User`} alt="User" className="w-full h-full object-cover"/>
              </div>
              <div>
                <p className="font-semibold text-gray-800">{rank.nickname}</p>
                <p className="text-sm text-gray-500">{rank.title || (rank.acquired_titles && rank.acquired_titles.length > 0 ? rank.acquired_titles[0] : '주린이')}</p>
              </div>
            </div>
            <span className="text-right font-semibold text-blue-600">{rank.score?.toLocaleString()}p</span>
          </div>
        ))}
      </div>

      <BottomNavigation currentPage="ranking" setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default RankingPage;
