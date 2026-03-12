#!/bin/bash
# 새 블로그 포스트 생성 스크립트
# 사용법: ./scripts/new-post.sh <slug> <title> <tag> <description> <reading-time>
# 예시: ./scripts/new-post.sh spring-security-oauth2 "Spring Security OAuth2 완벽 가이드" "Spring Boot" "OAuth2 인증 구현 방법" "12분 읽기"

set -e

SLUG="${1:?슬러그를 입력하세요 (예: spring-security-oauth2)}"
TITLE="${2:?제목을 입력하세요}"
TAG="${3:?태그를 입력하세요 (예: Spring Boot, Flutter, DevOps)}"
DESC="${4:?설명을 입력하세요}"
READING_TIME="${5:-10분 읽기}"
DATE=$(date +%Y.%m.%d)
DATE_ISO=$(date +%Y-%m-%d)

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
POST_FILE="$ROOT_DIR/posts/${SLUG}.html"

if [ -f "$POST_FILE" ]; then
  echo "오류: $POST_FILE 이미 존재합니다."
  exit 1
fi

cat > "$POST_FILE" << POSTEOF
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${DESC}">
  <meta name="keywords" content="${TAG}, 개발, 프로그래밍">
  <meta name="google-adsense-account" content="ca-pub-6529673634044767">

  <meta property="og:title" content="${TITLE}">
  <meta property="og:description" content="${DESC}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://jaeseong90.github.io/posts/${SLUG}.html">
  <link rel="canonical" href="https://jaeseong90.github.io/posts/${SLUG}.html">
  <link rel="icon" type="image/svg+xml" href="../favicon.svg">

  <title>${TITLE} | 재성의 개발 블로그</title>

  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6529673634044767" crossorigin="anonymous"></script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <header>
    <div class="container">
      <a href="../index.html" class="logo">
        <span>&lt;/&gt;</span> DevLog
      </a>
      <button class="menu-toggle" onclick="toggleMenu()">&#9776;</button>
      <nav id="nav">
        <a href="../index.html">홈</a>
        <a href="../about.html">소개</a>
        <a href="../contact.html">연락처</a>
      </nav>
    </div>
  </header>

  <div class="post-header">
    <div class="container">
      <span class="post-tag">${TAG}</span>
      <h1>${TITLE}</h1>
      <div class="post-meta">
        <span>${DATE}</span>
        <span>${READING_TIME}</span>
      </div>
    </div>
  </div>

  <main class="container">
    <div class="ad-container"></div>

    <article class="post-content">
      <h2>첫 번째 섹션</h2>
      <p>여기에 내용을 작성하세요.</p>

      <h2>두 번째 섹션</h2>
      <p>여기에 내용을 작성하세요.</p>

      <h2>마무리</h2>
      <p>여기에 마무리 내용을 작성하세요.</p>

      <div class="post-nav">
        <a href="../index.html">&larr; 목록으로</a>
      </div>
    </article>

    <div class="ad-container"></div>
  </main>

  <footer>
    <div class="container">
      <div class="footer-content">
        <div class="footer-links">
          <a href="../about.html">소개</a>
          <a href="../privacy.html">개인정보처리방침</a>
          <a href="../terms.html">이용약관</a>
          <a href="../contact.html">연락처</a>
        </div>
        <p class="copyright">&copy; 2025 재성의 개발 블로그. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <script src="../js/main.js"></script>
</body>
</html>
POSTEOF

echo "포스트 생성 완료: $POST_FILE"
echo ""
echo "다음 작업을 수행하세요:"
echo "1. $POST_FILE 내용 작성"
echo "2. index.html에 포스트 카드 추가"
echo "3. sitemap.xml에 URL 추가"
echo "4. git add, commit, push"
