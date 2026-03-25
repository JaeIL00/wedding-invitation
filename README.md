# Wedding Invitation

밝고 따뜻한 분위기의 모바일 청첩장 v1입니다.

Next.js App Router, PostgreSQL, Prisma, Yarn Berry 기준으로 구성되어 있습니다.

## Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- PostgreSQL 16
- Prisma 6
- Yarn Berry 4

## Local Setup

1. 환경 파일을 준비합니다.

```bash
cp .env.example .env
```

2. PostgreSQL 컨테이너를 실행합니다.

```bash
yarn db:up
```

3. 스키마와 기본 데이터를 반영합니다.

```bash
yarn db:migrate --name init
yarn db:generate
yarn db:seed
```

4. 개발 서버를 실행합니다.

```bash
yarn dev
```

5. 브라우저에서 확인합니다.

```text
http://localhost:3000
```

## Scripts

- `yarn dev`: 개발 서버 실행
- `yarn build`: 프로덕션 빌드
- `yarn start`: 빌드 결과 실행
- `yarn lint`: ESLint 검사
- `yarn db:up`: PostgreSQL 컨테이너 실행
- `yarn db:down`: PostgreSQL 컨테이너 종료
- `yarn db:migrate --name <name>`: Prisma 마이그레이션 생성 및 적용
- `yarn db:generate`: Prisma Client 재생성
- `yarn db:seed`: 기본 청첩장 데이터 시드

## Current Scope

- 공개형 모바일 청첩장 단일 페이지
- RSVP 저장
- 외부 지도 앱 링크
- 사진 placeholder 레이아웃
- 축의 계좌 및 FAQ 안내

## Photo Placeholders

현재 갤러리와 히어로 영역은 실제 사진 대신 다음 정보만 표시합니다.

- 이미지 레이아웃 비율
- 컷 분위기 설명
- 교체할 사진에 대한 가이드 문구

사진 파일을 추가할 때는 현재 placeholder 슬롯을 그대로 교체하면 됩니다.
