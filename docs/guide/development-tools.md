# 개발 도구 설정 가이드

이 문서는 프로젝트에 설정된 개발 도구(ESLint, Prettier, Husky, lint-staged)의 사용 방법을 설명합니다.

## 📦 설치된 도구

- **ESLint 9**: JavaScript/TypeScript 코드 분석 도구
- **Prettier 3**: 자동 코드 포매터
- **TypeScript**: 정적 타입 체크
- **Husky 9**: Git 훅 자동화
- **lint-staged**: staged 파일 자동 처리
- **EditorConfig**: 에디터 설정 통일

---

## 🚀 주요 명령어

### 린트 검사

```bash
# 코드 린트 검사만 (수정하지 않음)
npm run lint

# 코드 자동 수정 (ESLint)
npm run lint:fix
```

### 코드 포매팅

```bash
# 전체 코드 자동 포매팅
npm run format

# 포매팅 필요 여부 검사만
npm run format:check
```

### 타입 체크

```bash
# TypeScript 타입 검사
npm run type-check
```

### 통합 검사

```bash
# 모든 검사 실행 (타입 체크 → 린트 → 포맷 검사)
npm run check

# 모든 검사 실행 및 자동 수정 (권장)
npm run check:fix
```

---

## 🪝 Git 훅 자동화

### Pre-commit 훅

**언제 실행되나?** `git commit` 실행 시 자동 실행

**수행 작업:**
1. TypeScript 타입 검사
2. ESLint 자동 수정
3. Prettier 자동 포매팅

```bash
# 예시
git add .
git commit -m "새 기능 추가"
# → 자동으로 타입 체크, 린트 수정, 포매팅 실행
```

### 훅 스킵하기 (권장하지 않음)

```bash
# pre-commit 훅을 무시하고 커밋 (긴급 상황용)
git commit -m "메시지" --no-verify
```

---

## ⚙️ 설정 파일 설명

### `.eslintrc.js` - ESLint 설정

```javascript
// 주요 규칙
- no-var: 모든 var 사용 금지
- no-console: console.log 경고
- @typescript-eslint/no-explicit-any: any 타입 금지
- react-hooks/rules-of-hooks: React Hooks 규칙 강제
```

**커스터마이징:**
```javascript
// eslint.config.js에서 rules 수정
rules: {
  'your-rule-name': 'error', // 에러
  'your-rule-name': 'warn',  // 경고
  'your-rule-name': 'off',   // 비활성화
}
```

### `.prettierrc.json` - Prettier 설정

```json
{
  "semi": true,                    // 세미콜론 필수
  "singleQuote": true,            // 작은 따옴표 사용
  "printWidth": 100,              // 한 줄 최대 길이
  "tabWidth": 2,                  // 들여쓰기 2칸
  "trailingComma": "es5",         // 후행 쉼표 (ES5 호환)
  "endOfLine": "lf"               // 라인 끝 LF
}
```

**예시 포매팅:**
```typescript
// Before
const obj={a:1,b:2,c:3}

// After (prettier 적용)
const obj = { a: 1, b: 2, c: 3 };
```

### `.lintstagedrc.json` - lint-staged 설정

```json
{
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",      // ESLint 자동 수정
    "prettier --write"   // Prettier 포매팅
  ],
  "*.{json,css,md}": [
    "prettier --write"   // JSON, CSS, Markdown 포매팅
  ]
}
```

**동작:**
- `git add` 후 `git commit` 시
- staged 파일들에 대해 자동으로 린트 & 포매팅 실행
- 수정된 파일들이 자동으로 추가되고 커밋됨

### `.husky/pre-commit` - Git 훅 스크립트

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run check:fix  # 실행될 명령어
```

### `.editorconfig` - 에디터 설정

```
# VS Code, WebStorm 등 모든 에디터에서 동일한 설정 적용
- charset: UTF-8
- end_of_line: LF
- indent_size: 2 spaces
- trim_trailing_whitespace: true
```

**설정하기:**
- VS Code: `EditorConfig for VS Code` 확장 설치
- WebStorm: 기본 내장
- Vim: `editorconfig-vim` 플러그인

---

## 📋 에디터 설정 (VS Code 추천)

### 필수 확장 프로그램

```json
// .vscode/extensions.json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",           // ESLint
    "esbenp.prettier-vscode",           // Prettier
    "EditorConfig.EditorConfig",        // EditorConfig
    "bradlc.vscode-tailwindcss",        // Tailwind CSS
    "ms-typescript.vscode-typescript-vue" // TypeScript
  ]
}
```

### VS Code 설정 (.vscode/settings.json)

```json
{
  // 저장 시 자동 포매팅
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  
  // 저장 시 자동 린트 수정
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  
  // Prettier 설정
  "prettier.printWidth": 100,
  "prettier.singleQuote": true,
  
  // TypeScript
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

## ✅ 일반적인 작업 흐름

### 1. 새 기능 개발

```bash
# 1. 브랜치 생성
git checkout -b feature/새-기능

# 2. 코드 개발
# (계속 개발...)

# 3. 변경사항 스테이징
git add .

# 4. 커밋 (자동으로 lint & format 실행)
git commit -m "새 기능: 사용자 인증 추가"
# → pre-commit 훅 자동 실행

# 5. 푸시
git push origin feature/새-기능
```

### 2. 자동 수정이 필요한 경우

```bash
# 모든 검사 및 자동 수정 실행
npm run check:fix

# 또는 개별적으로
npm run lint:fix
npm run format
```

### 3. PR 전 최종 검사

```bash
# 최종 검사 실행
npm run check

# 모든 검사가 통과하면 PR 생성
git push origin feature/새-기능
```

---

## 🐛 문제 해결

### 린트 에러 무시하고 싶을 때

```typescript
// 특정 라인 무시
// eslint-disable-next-line no-console
console.log('디버깅');

// 여러 라인 무시
/* eslint-disable no-console */
console.log('1');
console.log('2');
/* eslint-enable no-console */
```

### Prettier와 ESLint 충돌

문제: 같은 규칙에 대해 두 도구가 다르게 동작

해결: 이미 설정됨!
- `eslint-config-prettier`: ESLint에서 포매팅 규칙 비활성화
- `eslint-plugin-prettier`: Prettier 규칙을 ESLint 규칙으로 사용

### Git 훅이 실행되지 않음

```bash
# 훅 권한 확인
ls -la .husky/

# 훅 파일이 실행 권한이 있는지 확인
chmod +x .husky/pre-commit

# Husky 다시 설치
npm run prepare
```

### 포매팅이 계속 실패함

```bash
# Prettier 설정 확인
npm run format:check

# 강제 포매팅
npm run format

# 캐시 제거 후 다시 실행
rm -rf node_modules/.cache
npm run format
```

---

## 📊 CI/CD 통합

### GitHub Actions

`.github/workflows/ci.yml`에서 자동으로:
- Node.js 의존성 설치
- 타입 체크 실행
- ESLint 검사
- 포매팅 검사
- 빌드 테스트

**PR 머지 전 조건:**
✅ 모든 CI 검사 통과 필수

---

## 💡 팁과 트릭

### 1. 빠른 수정

```bash
# 자주 사용: 모든 검사 및 수정
npm run check:fix

# 약자로 설정 가능 (이건 선택사항)
# package.json에 추가: "cf": "npm run check:fix"
npm run cf
```

### 2. Staged 파일만 린트

```bash
# 자동으로 staged 파일만 처리
# (git add 후 자동 실행되므로 따로 할 필요 없음)
npx lint-staged
```

### 3. 특정 파일만 검사

```bash
# 특정 디렉토리만 린트
npm run lint -- src/components

# 특정 파일 포매팅
npx prettier --write src/components/Button.tsx
```

### 4. ESLint 규칙 확인

```bash
# 어떤 규칙이 적용되었는지 확인
npm run lint -- --debug

# 특정 파일의 규칙 확인
npm run lint -- src/components/Button.tsx --format json | head -20
```

---

## 📚 참고 자료

- [ESLint 문서](https://eslint.org/docs/latest/)
- [Prettier 문서](https://prettier.io/docs/)
- [Husky 문서](https://typicode.github.io/husky/)
- [lint-staged 문서](https://github.com/lint-staged/lint-staged)
- [EditorConfig](https://editorconfig.org/)

---

## 🎯 체크리스트

처음 셋업할 때:

- [ ] 에디터에 ESLint 확장 설치
- [ ] 에디터에 Prettier 확장 설치
- [ ] 에디터에 EditorConfig 확장 설치
- [ ] VS Code 설정 파일 추가
- [ ] `npm install` 실행 (Husky 자동 설정됨)
- [ ] `npm run check` 실행해서 전체 검사 확인
- [ ] 첫 커밋 시 훅 자동 실행 확인

개발할 때:

- [ ] 주기적으로 `npm run check:fix` 실행
- [ ] 커밋 전에 변경사항 검토
- [ ] CI 검사 결과 확인
- [ ] PR 리뷰 시 코드 스타일 검토 불필요 (자동 처리됨)
