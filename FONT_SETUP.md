# 프리텐다드 폰트 설정 가이드

프리텐다드 폰트를 사용하려면 다음 단계를 따라주세요:

## 1. 폰트 다운로드

1. [Pretendard GitHub Releases](https://github.com/orioncactus/pretendard/releases)에서 최신 버전 다운로드
2. 또는 [Pretendard CDN](https://cdn.jsdelivr.net/gh/orioncactus/pretendard@public/packages/pretendard/dist/web/static/woff2/PretendardVariable.woff2)에서 직접 다운로드

## 2. 폰트 파일 배치

다운로드한 `PretendardVariable.woff2` 파일을 다음 경로에 배치하세요:

```
public/font/PretendardVariable.woff2
```

## 3. 자동 다운로드 스크립트 (선택사항)

터미널에서 다음 명령어로 자동 다운로드:

```bash
mkdir -p public/font
curl -L https://cdn.jsdelivr.net/gh/orioncactus/pretendard@public/packages/pretendard/dist/web/static/woff2/PretendardVariable.woff2 -o public/font/PretendardVariable.woff2
```

## 참고

- 폰트 파일이 없어도 fallback 폰트로 정상 작동합니다
- 폰트 파일 크기는 약 1.5MB입니다

