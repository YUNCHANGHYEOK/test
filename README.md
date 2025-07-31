# Plain edu - Financial Education App

주린이를 위한 금융 교육 및 퀴즈 앱입니다.

## 프로젝트 구조

```
my-financial-app/
├── src/                    # Frontend (React + Vite)
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── ...
├── back/                   # Backend (Node.js + MySQL)
│   ├── .env.example       # 백엔드 환경설정 예시
│   ├── .gitignore         # 백엔드 전용 gitignore
│   └── ...
└── ...
```

## 개발 환경 설정

### Frontend
```bash
npm install
npm run dev
```

### Backend  
```bash
cd back
cp .env.example .env
# .env 파일에 실제 데이터베이스 정보 입력
npm install
npm start
```

## 데이터베이스

- **Database**: `plaindb` (MySQL)
- **Tables**: 사용자, 퀴즈, 랭킹 등

## 기술 스택

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express, MySQL2
- **Database**: MySQL (`plaindb`)

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

test입니다.