# Kaggle 명품 패션 데이터셋 분석 (SSENSE / NET-A-PORTER / MR PORTER)

- 원본: [[7]](../references/sources.md), [[8]](../references/sources.md) (Kaggle, `justinpakzad` 업로드)
- 다운로드 시점 기준 raw CSV **3개**를 분석함. `justinpakzad/net-a-portermr-porter-fashion-dataset` 하나의 Kaggle 데이터셋 안에 `net-a-porter.csv`, `mr-porter.csv` 두 파일이 들어있어, 실제로는 SSENSE 1개 + NAP/MRP 2개 = 총 3개 raw 파일로 구성됨.
- 분석 코드: `kagglehub`로 받은 원본 CSV를 pandas로 직접 읽어 계산 (가공/병합 전 원본 기준).

## 1. 행 수 / 컬럼 / 자료형 / 결측치 비율

| 파일 | 행 수 | 컬럼 | brand dtype | description dtype | price_usd dtype | type dtype | 결측치 비율 |
|---|---|---|---|---|---|---|---|
| ssense_dataset.csv | 19,919 | brand, description, price_usd, type | object | object | int64 | object | 0.0% (전 컬럼) |
| net-a-porter.csv | 23,161 | brand, description, price_usd, type | object | object | int64 | object | 0.0% (전 컬럼) |
| mr-porter.csv | 20,347 | brand, description, price_usd, type | object | object | int64 | object | 0.0% (전 컬럼) |

세 파일 모두 컬럼 구성이 동일하고(brand/description/price_usd/type), 결측치는 전 컬럼에서 0건.

## 2. Type 컬럼 값 분포

**ssense (type = 성별, 가정 확인됨 ✅)**

| 값 | 건수 |
|---|---|
| mens | 11,771 |
| womens | 8,148 |

**net-a-porter (type = 카테고리, 가정 확인됨 ✅)**

| 값 | 건수 |
|---|---|
| clothing | 16,575 |
| shoes | 3,203 |
| bag | 1,961 |
| accessories | 1,422 |

**mr-porter (참고: 성별 아님, 카테고리임 — net-a-porter와 같은 성격)**

| 값 | 건수 |
|---|---|
| clothing | 12,112 |
| accessories | 4,257 |
| shoes | 1,936 |
| sport | 1,538 |
| watches | 504 |

## 3. net-a-porter / mr-porter를 구분하는 컬럼 존재 여부

**결론: 없음.** 두 파일은 컬럼 구성(`brand`, `description`, `price_usd`, `type`)이 완전히 동일하고, 어떤 컬럼도 두 플랫폼을 깔끔하게 나누지 못함.

- `type`: net-a-porter 4종(clothing/shoes/bag/accessories) vs mr-porter 5종(clothing/accessories/shoes/sport/watches) — `bag`/`sport`/`watches`만 한쪽에만 있지만, 공통값 3종(clothing/shoes/accessories)이 대부분을 차지해 `type`만으로는 플랫폼을 구분할 수 없음.
- `brand`: 고유 브랜드 490개(NAP) vs 434개(MRP) 중 117개가 겹침 → 브랜드로도 완전히 구분 불가.
- `description`, `price_usd`: 값 범위가 대부분 겹쳐 구분 기준으로 쓸 수 없음.

→ 두 플랫폼은 **파일 자체(어느 CSV에서 왔는지)로만** 구분됨. 지난 병합 작업에서 추가한 `source` 컬럼(파일명 기반)이 유일한 구분자이며, 데이터 안에 원래부터 있던 구분 컬럼은 아님.

## 4. 브랜드 수 / 가격 범위 (USD)

| 파일 | 브랜드 수 | 최솟값 | 중앙값 | 최댓값 |
|---|---|---|---|---|
| ssense | 631 | 20 | 350.0 | 13,000 |
| net-a-porter | 490 | 18 | 780.0 | 21,000 |
| mr-porter | 434 | 14 | 460.0 | 170,000 |

mr-porter의 최댓값(170,000)은 다른 두 파일보다 훨씬 커서 고가 이상치(워치/하이엔드 제품)가 있는 것으로 보임.

## 5. 공통 브랜드 (대소문자·공백 정규화 후 비교)

브랜드명을 `strip → lower() → 공백 1개로 정리` 방식으로 정규화한 뒤 교집합을 계산함.

| 비교 | 공통 브랜드 수 |
|---|---|
| ssense ∩ net-a-porter | 160 |
| ssense ∩ mr-porter | 152 |
| net-a-porter ∩ mr-porter | 117 |
| ssense ∩ (net-a-porter ∪ mr-porter) | 243 |

**net-a-porter ∩ mr-porter 공통 브랜드 (117개, 정규화된 이름 기준):**

acne studios, adidas originals, alanui, alex mill, alexander mcqueen, allude, ami paris, amiri, and wander, anderson's, apl athletic propulsion labs, autry, aztech mountain, balenciaga, balenciaga eyewear, balmain, birkenstock, birkenstock 1774, bode, bogner, bottega veneta, bottega veneta eyewear, brioni, brunello cucinelli, burberry, canada goose, cartier eyewear, castañer, cdlp, charvet, christian louboutin, common projects, converse, desmond & dempsey, dior eyewear, district vision, dr. barbara sturm, dries van noten, etro, fendi eyewear, ferragamo, frame, fusalp, g/fore, gabriela hearst, givenchy, givenchy eyewear, golden goose, gucci, gucci eyewear, guest in residence, hanro, hoka one one, isabel marant, jacquemus, jacques marie mage, james perse, jil sander, johnstons of elgin, jw anderson, kimeze, kjus, lanvin, les tien, loewe, loewe eyewear, loretta caponi, loro piana, lululemon, maison margiela, manolo blahnik, marni, missoni, moncler, moncler genius, moncler grenoble, métier, new balance, nike, nili lotan, off-white, oliver peoples, on, our legacy, outdoor voices, palm angels, polo ralph lauren, prada eyewear, purdey, rag & bone, ray-ban, rick owens, sacai, saint laurent, saint laurent eyewear, salomon, serapian, simone rocha, smythson, snow peak, sorel, tekla, the elder statesman, the frankie shop, the north face, the row, theory, thom browne, tod's, tom ford, tom ford eyewear, valentino garavani, valextra, veja, vetements, wales bonner, yves salomon

**ssense ∩ (net-a-porter ∪ mr-porter) 공통 브랜드 (243개, 정규화된 이름 기준):**

16arlington, 3.1 phillip lim, a.p.c., acne studios, adidas originals, aeyde, agent provocateur, agolde, airei, alaïa, alexander wang, ami paris, amina muaddi, amiri, amomento, and wander, anderson's, anine bing, ann demeulemeester, arch4, area, aton, auralee, axel arigato, balenciaga, balmain, barbour, baserange, beams plus, belstaff, birkenstock, bode, bottega veneta, brain dead, brioni, burberry, by far, by malene birger, c.p. company, calvin klein underwear, canada goose, cartier, casablanca, cdlp, cecilie bahnsen, chloé, christian louboutin, christopher esber, citizens of humanity, collina strada, comme des garçons, comme des garçons comme des garçons, comme des garçons girl, conner ives, converse, coperni, corridor, courrèges, cutler and gross, de bonne facture, deadwood, deiji studios, diemme, dime, dion lee, district vision, dolce & gabbana, drake's, dries van noten, dunhill, enfants riches déprimés, entire studios, eres, erin snow, erl, esse studios, fear of god, fear of god essentials, fendi, ferragamo, frame, gabriela hearst, ganni, gauge81, gianvito rossi, givenchy, golden goose, goldwin, greg lauren, grlfrnd, gucci, guess usa, guest in residence, haight, hatton labs, helmut lang, hommegirls, houdini, howlin's, hunza g, ienki ienki, isa boulder, isabel marant, jacquemus, jean paul gaultier, jil sander, jimmy choo, john elliott, joseph, jw anderson, kassl editions, kenzo, khaite, la perla, lacoste, lanvin, lardini, lauren manoogian, le gramme, legres, lemaire, les tien, leset, lexxola, lisa yang, loewe, louisa ballou, maap, mach & mach, mackage, magda butrym, maison kitsuné, maison margiela, manolo blahnik, marni, master-piece, mastermind world, matteau, max mara, mfpen, missoni, moncler, moncler genius, moncler grenoble, montblanc, moon boot, mugler, museum of peace & quiet, nanamica, nanushka, needles, neighborhood, nensi dojaka, neous, new balance, nike, nn07, norda, norse projects, norse projects arktisk, nudie jeans, off-white, officine générale, oliver peoples, on, our legacy, outdoor voices, palm angels, paris texas, pas normal studios, paul smith, pearls before swine, perfect moment, polo ralph lauren, pop trading company, proenza schouler, r13, raf simons, rag & bone, rains, ralph lauren purple label, ray-ban, re/done, reformation, reigning champ, remain birger christensen, rhude, rick owens, roa, rrl, róhe, sacai, saint laurent, salomon, satisfy, saturdays nyc, saucony, savette, see by chloé, simone rocha, skims, sleeper, snow peak, sophie bille brahe, sophie buhai, sporty & rich, st. agni, staud, stella mccartney, stone island, story mfg., suicoke, séfr, tekla, the attico, the elder statesman, the frankie shop, the north face, the row, theory, thisisneverthat, thom browne, tom ford, toteme, universal works, valentino, valentino garavani, versace, vetements, victoria beckham, vince, visvim, wacko maria, wales bonner, wardrobe.nyc, wolford, y-3, ymc, yves salomon, zegna, zegna x the elder statesman, zimmermann, éliou

(참고: "두 플랫폼" 기준이 명확하지 않아 가능한 조합을 모두 계산했습니다. net-a-porter와 mr-porter 비교가 필요하면 117개 표, SSENSE와 NAP/MRP 전체 비교가 필요하면 243개 표를 참고하세요.)

## 6. 상품 수 기준 상위 20개 브랜드 + 가격 중앙값 (플랫폼별)

**ssense**

| 순위 | 브랜드 | 상품 수 | 가격 중앙값(USD) |
|---|---|---|---|
| 1 | Gucci | 481 | 870.0 |
| 2 | Nike | 299 | 110.0 |
| 3 | Bottega Veneta | 296 | 1,100.0 |
| 4 | Rick Owens | 258 | 1,380.0 |
| 5 | Marni | 250 | 596.0 |
| 6 | A.P.C. | 249 | 285.0 |
| 7 | AMI Paris | 244 | 300.0 |
| 8 | Isabel Marant | 240 | 569.0 |
| 9 | rag & bone | 215 | 245.0 |
| 10 | Marc Jacobs | 196 | 295.0 |
| 11 | Givenchy | 195 | 670.0 |
| 12 | The Row | 186 | 1,390.0 |
| 13 | Jil Sander | 182 | 1,250.0 |
| 14 | Dime | 177 | 95.0 |
| 15 | Balenciaga | 175 | 585.0 |
| 16 | Valentino Garavani | 168 | 890.0 |
| 17 | Burberry | 167 | 960.0 |
| 18 | MM6 Maison Margiela | 161 | 404.0 |
| 19 | NORSE PROJECTS | 152 | 214.5 |
| 20 | nanamica | 137 | 405.0 |

**net-a-porter**

| 순위 | 브랜드 | 상품 수 | 가격 중앙값(USD) |
|---|---|---|---|
| 1 | SAINT LAURENT | 796 | 1,590.0 |
| 2 | GUCCI | 708 | 1,500.0 |
| 3 | THE ROW | 462 | 1,490.0 |
| 4 | VALENTINO GARAVANI | 430 | 2,200.0 |
| 5 | BOTTEGA VENETA | 413 | 2,400.0 |
| 6 | BALENCIAGA | 371 | 1,550.0 |
| 7 | ALAÏA | 338 | 2,130.0 |
| 8 | LORO PIANA | 329 | 2,175.0 |
| 9 | LOEWE | 328 | 1,150.0 |
| 10 | ALEXANDER MCQUEEN | 301 | 2,190.0 |
| 11 | SKIMS | 296 | 36.0 |
| 12 | CHRISTIAN LOUBOUTIN | 286 | 990.0 |
| 13 | ISABEL MARANT | 274 | 935.0 |
| 14 | BURBERRY | 246 | 1,350.0 |
| 15 | ERES | 238 | 387.5 |
| 16 | KHAITE | 238 | 1,365.0 |
| 17 | CHLOÉ | 231 | 1,690.0 |
| 18 | ZIMMERMANN | 230 | 695.0 |
| 19 | TOTEME | 215 | 480.0 |
| 20 | STELLA MCCARTNEY | 192 | 1,190.0 |

**mr-porter**

| 순위 | 브랜드 | 상품 수 | 가격 중앙값(USD) |
|---|---|---|---|
| 1 | LORO PIANA | 637 | 1,075.0 |
| 2 | TOM FORD | 589 | 990.0 |
| 3 | GUCCI | 462 | 1,150.0 |
| 4 | BRUNELLO CUCINELLI | 459 | 1,150.0 |
| 5 | CELINE HOMME | 441 | 1,150.0 |
| 6 | SAINT LAURENT | 433 | 990.0 |
| 7 | MR P. | 418 | 240.0 |
| 8 | POLO RALPH LAUREN | 380 | 145.0 |
| 9 | MONCLER | 280 | 825.0 |
| 10 | BALENCIAGA | 270 | 1,050.0 |
| 11 | BOTTEGA VENETA | 255 | 1,450.0 |
| 12 | ACNE STUDIOS | 219 | 380.0 |
| 13 | ZEGNA | 213 | 890.0 |
| 14 | PAUL SMITH | 203 | 265.0 |
| 15 | MONCLER GENIUS | 193 | 960.0 |
| 16 | NIKE | 188 | 92.5 |
| 17 | KAPITAL | 183 | 440.0 |
| 18 | LOEWE | 182 | 790.0 |
| 19 | BURBERRY | 178 | 820.0 |
| 20 | CHRISTIAN LOUBOUTIN | 163 | 945.0 |

## 7. Description 내 소재 키워드 등장 건수 (단어 경계 기준, 대소문자 무시)

| 소재 | ssense (n=19,919) | net-a-porter (n=23,161) | mr-porter (n=20,347) |
|---|---|---|---|
| leather | 500 | 4,649 | 3,069 |
| cashmere | 54 | 968 | 1,200 |
| wool | 52 | 2,077 | 2,170 |
| cotton | 16 | 3,405 | 6,439 |
| silk | 9 | 1,808 | 683 |
| nylon | 29 | 20 | 361 |

---
*모든 수치는 `kagglehub`로 받은 원본 CSV(ssense_dataset.csv, net-a-porter.csv, mr-porter.csv)를 pandas로 직접 집계한 실측값입니다.*
