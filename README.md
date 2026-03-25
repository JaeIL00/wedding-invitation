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

## Vercel Deployment

이 프로젝트는 Vercel에 올릴 때 `Docker Compose`를 사용하지 않습니다.
앱은 Vercel에 배포하고, PostgreSQL은 별도 매니지드 DB를 연결하는 방식이 기준입니다.

### Recommended Setup

- App: Vercel
- Database: Vercel Postgres, Neon, Supabase, Railway PostgreSQL 중 하나
- Prisma: `DATABASE_URL` + `DIRECT_URL` 사용

### Environment Variables

Vercel 프로젝트 환경변수에 아래 값을 넣어야 합니다.

```bash
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
POSTGRES_DB=wedding_invitation
POSTGRES_USER=wedding_app
POSTGRES_PASSWORD=wedding_app
```

메모:

- `DATABASE_URL`: 앱 런타임에서 사용하는 연결 문자열
- `DIRECT_URL`: Prisma migration용 직접 연결 문자열
- 로컬 Docker를 쓰지 않는 경우 `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`는 필수는 아니지만, `.env.example`과 로컬 개발 흐름을 맞추기 위해 유지할 수 있습니다.

### Deploy Steps

1. PostgreSQL 데이터베이스를 준비합니다.
2. Vercel에 GitHub 저장소를 연결합니다.
3. 환경변수 `DATABASE_URL`, `DIRECT_URL`를 등록합니다.
4. 첫 배포 전에 production DB에 migration을 반영합니다.

```bash
yarn db:migrate:deploy
```

5. 배포 후 필요하면 기본 데이터를 넣습니다.

```bash
yarn db:seed
```

### Notes

- `postinstall`에서 `prisma generate`가 실행되므로 Vercel 빌드 시 Prisma Client가 자동 생성됩니다.
- 첫 공개 전에 `public/hero-main.jpg`와 `public/gallery/*` 이미지를 채워야 실제 모바일 청첩장 화면이 완성됩니다.
- RSVP를 사용하려면 Vercel Preview 환경과 Production 환경이 같은 DB를 공유하지 않게 분리하는 편이 안전합니다.
