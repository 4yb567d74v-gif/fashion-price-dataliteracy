# 브리프

## 목표
(이 슬라이드덱의 목적을 적어주세요 — 예: 어떤 발표/강의/대상 행사인지)

## 대상 독자
(예: 비전공 대학생, 데이터 입문자, 사내 교육 등)

## 핵심 메시지
-
-

## 톤 / 스타일
(예: 캐주얼한지 격식있는지, 참고하고 싶은 색감·디자인, 분량 등)

## 진행 로그
- 2026-10-16: 프로젝트 폴더 구조 세팅
- 2026-10-16: KOSIS API로 의류·신발 CPI(2016~2025, DT_1J22001)와 가구당 월평균 의류·신발 지출(2019~2025, DT_1L9U101)을 받아 `data/kosis/`에 CSV로 저장. 가계지출 쪽은 1인이상가구 기준 시계열이 2019년부터만 존재(2019년 이전은 2인이상가구 기준 별도 표 DT_1L9N002로 분리됨, 정의가 달라 단순 연결은 보류).
- 2026-10-16: Firecrawl로 의류 가격·패션 소비 관련 뉴스 4건(2025.12~2026.09)을 수집해 `data/news/fashion_price_news_2025_2026.csv`로 정리, `references/sources.md`에 3~6번으로 기록.
- 2026-10-16: Kaggle에서 SSENSE(19,919행), NET-A-PORTER(23,161행), MR PORTER(20,347행) 명품 패션 상품 데이터셋(브랜드·설명·가격(USD)·타입)을 kagglehub로 다운로드, `source` 컬럼을 추가해 `data/kaggle/luxury_fashion_prices_merged.csv`(총 63,427행)로 통합. `references/sources.md` 7~8번 상태를 수집됨으로 갱신.
- 2026-10-16: KOSIS·뉴스 데이터를 종합해 `analysis/report.md` 분석 보고서 작성 (①전체물가 vs 의류물가 ②가계지출 중 의류 비중 ③코로나 전후 ④뉴스 기반 원인 해석, 의류학과 관점). 차트 3종은 `analysis/charts/`에 matplotlib PNG로 저장. 비교용 원자료(전체 CPI, 가구 전체 소비지출)는 `data/kosis/cpi_total_2016_2025.csv`, `data/kosis/household_total_consumption_2019_2025.csv`로 추가.
- 2026-10-16: Kaggle 원본 raw CSV 3개(ssense_dataset.csv, net-a-porter.csv, mr-porter.csv)를 pandas로 직접 분석해 `analysis/data_summary.md` 작성 (행수/컬럼/dtype/결측치, type 분포, 브랜드 수·가격 범위, 정규화 후 공통 브랜드, 상위 20개 브랜드별 가격 중앙값, description 소재 키워드 빈도). 확인된 점: net-a-porter.csv와 mr-porter.csv는 컬럼이 완전히 동일해 데이터 자체에는 두 플랫폼을 구분하는 컬럼이 없음(파일명으로만 구분 가능) — 이전에 병합 시 추가한 `source` 컬럼이 유일한 구분자임.
- 2026-10-16: `analysis/report.md`를 바탕으로 `slides/index.html` HTML 슬라이드덱 완성 (11장). CSS/SVG 일러스트 + anime.js(숫자 카운트업, SVG 라인차트 드로잉, 막대차트 성장, 스파크라인)로 전 슬라이드에 시각 요소를 넣고, 부록 슬라이드에는 `analysis/charts/`의 matplotlib PNG 3종을 재사용. `slides/assets/{css,js,vendor,charts}`에 자산 배치, anime.js는 `vendor/anime.min.js`로 로컬 보관(오프라인 동작). Playwright 헤드리스 브라우저로 11장 전체 스크린샷 + 콘솔 에러 검증(4개 포토 플레이스홀더 404 외 에러 없음, 좁은 뷰포트에서도 가로 스크롤 없음) — 깨끗할 때까지 반복하는 검증 루프 통과. 사진이 필요한 4장(표지/뉴스섹션/결론/마무리)은 `slides/assets/img/{cover,news-section,conclusion,closing}.jpg` 플레이스홀더로 비워두고(없어도 CSS 그라디언트로 대체돼 레이아웃 안 깨짐), Google Flow용 프롬프트를 `slides/assets/README.md`에 정리. `references/sources.md` 1~6번 상태를 인용됨으로 갱신.
- 2026-10-16: 중간고사 과제용 별도 슬라이드덱 `slides/midterm.html` 신규 작성 (8장, "럭셔리 디자이너 브랜드는 어떻게 가격을 매기나 — SSENSE와 Net-a-Porter로 본 브랜드 포지셔닝", 발표자 부산대 의류학과 3학년 황수아). 분석 "결과"가 아닌 "계획"이 핵심인 과제라 주제 배경·연구질문 3개·데이터 소개·지표 정의·분석 절차(4단계: 브랜드명 정리/통합→집계→가격 티어 분류→시각화)·한계·기말 확장 계획으로 구성. 7번 슬라이드 차트는 `analysis/data_summary.md` 기반 실측값(SSENSE·Net-a-Porter 공통 브랜드 중 상품수 상위 10개의 플랫폼별 가격 중앙값, Chart.js 막대그래프)만 사용. 단일 파일, Pretendard+Noto Serif KR, 키보드 방향키/클릭 네비게이션, 패션매거진풍(흰 배경·검정 세리프·버건디 포인트 컬러) 디자인. 기존 `slides/index.html`(물가·가계소비 덱)과는 별개 파일로 분리 — 사용자 확인 후 결정.
- 2026-10-16: `slides/index.html`용 Google Flow 이미지 4종(각 2개 변형)을 사용자가 `slides/assets/`에 투입 → 슬롯별로 하나씩 골라 `slides/assets/img/{cover,news-section,conclusion,closing}.jpg`로 배치, 나머지 변형은 `img/alt/`에 백업. Playwright로 재검증: 콘솔 에러 0건, 4장 전부 이미지 정상 로드. 검증 중 closing.jpg의 밝은 청록색 재단대가 본문 텍스트 라인과 겹쳐 대비가 약한 지점을 발견해 `.photo-overlay` 그라디언트를 전반적으로 더 어둡게(상단 0.15→0.24, 하단 0.78→0.86) 조정하고 재스크린샷으로 확인 완료.
- 2026-10-16: 프로젝트를 git 저장소로 초기화(`git init`, `.gitignore`에 `.env` 패턴 포함 — push 전 `git status`로 `.env` 미포함 재확인)하고 `gh repo create`로 공개 저장소 `4yb567d74v-gif/fashion-price-dataliteracy` 생성·push. `.github/workflows/pages.yml`(GitHub Actions 기반, `slides/` 폴더를 아티팩트로 업로드)로 GitHub Pages 배포, `gh api .../pages -f build_type=workflow`로 Pages 활성화. 배포 주소: https://4yb567d74v-gif.github.io/fashion-price-dataliteracy/ (index.html=물가·가계소비 덱, midterm.html=중간고사 덱 모두 200 OK 확인).
