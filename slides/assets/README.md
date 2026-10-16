슬라이드에 쓰이는 이미지, 아이콘, 폰트 파일을 이 폴더에 넣어주세요.

## 폴더 구조
- `css/style.css` — 디자인 토큰 + 레이아웃
- `js/charts.js` — 네이티브 SVG 차트(라인/바/스파크라인) + 카운트업 유틸
- `js/main.js` — 슬라이드 네비게이션 + 애니메이션 트리거
- `vendor/anime.min.js` — anime.js v3.2.2 (오프라인 동작을 위해 로컬 보관)
- `charts/*.png` — `analysis/charts/`의 matplotlib 차트 복사본 (부록 슬라이드용)
- `img/` — 아래 포토 플레이스홀더 4종 (아직 파일 없음, Google Flow로 생성해 채워 넣기)

## 포토 플레이스홀더 (Google Flow 생성 대상)

이미지가 없어도 `index.html`은 CSS 그라디언트로 대체되어 레이아웃이 깨지지 않습니다.
아래 파일명 그대로 이 폴더(`img/`)에 저장하면 자동으로 연결됩니다. 모두 **16:9**, 텍스트/로고/워터마크 없이, 사진(에디토리얼·다큐멘터리 톤) 스타일로 생성하세요. 슬라이드 하단에 흰 글씨가 올라가므로 **이미지 하단은 어둡게/저채도로** 구성되는 편이 좋습니다.

| 파일명 | 사용 슬라이드 | Google Flow 프롬프트(안) |
|---|---|---|
| `cover.jpg` | 01 표지 | "Editorial documentary photograph for a fashion-economics presentation cover. A minimalist clothing rack with a few neatly hung garments in muted blue and burnt-orange tones, soft directional daylight from the left, shallow depth of field, slightly desaturated. Bottom third of the frame falls into soft shadow for text overlay. No text, no logos, no people, no watermark. 16:9 widescreen." |
| `news-section.jpg` | 07 뉴스/원인 해석 섹션 | "Editorial photograph of a quiet fashion retail store interior, price tags visible on a few garments, moody blue-toned lighting, documentary photojournalism style, slightly cool color grade, bottom of frame dark and underexposed for text overlay. No text, no logos, no visible brand names, no people's faces in focus. 16:9 widescreen." |
| `conclusion.jpg` | 08 종합 해석 | "Editorial still-life photograph symbolizing mindful, resale-oriented fashion consumption: a few carefully folded secondhand garments and a small reusable tote on a neutral linen surface, warm burnt-orange accent light, soft shadows, documentary styling (not a product ad). Bottom of frame dark for white text overlay. No text, no logos, no price tags with visible brand names. 16:9 widescreen." |
| `closing.jpg` | 11 마무리 | "Minimal editorial photograph of an empty, calm fashion design studio at dusk — a single garment on a mannequin silhouette, blue-to-near-black gradient lighting, soft film grain, documentary tone. Entire frame slightly underexposed for white text overlay throughout. No text, no logos, no people. 16:9 widescreen." |

생성한 이미지는 가로 1920px 이상 권장(실제 발표 해상도 대응), JPG로 저장.

## 적용 현황 (2026-10-16)

Google Flow로 4종 모두 생성 완료, `img/`에 적용됨. 슬롯마다 2개씩 받은 변형 중 하나를 골라 채우고, 나머지는 `img/alt/`에 백업으로 보관(파일명 끝에 `-alt`). 다른 느낌을 원하면 `img/alt/`의 파일을 해당 슬롯 파일명으로 교체하면 됨.
