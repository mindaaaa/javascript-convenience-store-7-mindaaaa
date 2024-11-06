# 편의점(Convenience)

이 프로젝트는 우아한테크코스 프리코스 4주차 과제인 `구매자의 할인 혜택과 재고 상황을 고려하여 최종 결제 금액을 계산하고 안내`하는 **편의점**을 다루고 있습니다.

## 🎮 실행 결과 예시

![편의점 실행 결과 예시]()

# 🚀 기능 요구 사항

- 구매자의 할인 혜택과 재고 상황을 고려하여 **최종 결제 금액을 계산하고 안내하는** `결제 시스템`을 구현한다.
- 사용자가 입력한 상품의 `가격과 수량`을 기반으로 **최종 결제 금액**을 계산한다.
  | | 총 구매액 | 최종 결제 금액 |
  |---|---------|-------------|
  | 산출 |상품별 가격 x 수량|프로모션 및 멤버심 할인 정채 반영|
- 구매 내역과 산출한 금액 정보를 `영수증`으로 출력한다.
  - 영수증 출력 후 `추가 구매`를 선택할 수 있다.

## 기능 목록

### 재고 관리

- 재고 수량을 고려해 `결제 가능 여부` 확인
- 상품을 구매할 때마다 `결제 수량`만큼 재고에서 차감해 **수량을 관리**
- 다음 고객이 구매할 때 **정확한 재고 정보**를 제공하기 위해 `최신 재고 상태`를 유지

### 프로모션 할인

- `오늘 날짜`가 **프로모션 기간에 포함된 경우**만 할인 적용
- 동일 상품에 여러 프로모션이 `적용되지 않음`
  - 1+1 또는 2+1 프로모션이 각각 지정된 상품에 적용됨
- 프로모션 기간이라면 프로모션 재고를 `우선적으로 차감`하며, 부족한 경우 `일반 재고`를 사용
- **프로모션 메뉴얼**
  ||프로모션보다 적게 가져온 경우|프로모션 재고가 부족한 경우|
  |:------:|:----------------------:|:-------------------:|
  |안내사항 |필요한 수량을 가져오면 혜택을 받을 수 있음|일부 수량은 정가로 결제하게 됨|
  |선택지|추가 / 미추가|일부 수량 정가로 계산|

### 멤버십 할인

- 멤버십 회원은 프로모션에 `해당하지 않는 상품에 한해 30%` 할인
- 프로모션 적용 후 `남은 금액`에 대해 멤버십 할인 적용
- 멤버십 할인의 최대 한도는 `8,000원`
- **상황 예시**  
  |프로모션|멤버십 할인| 항목 |
  |:-----:|:------:|-----|
  | 2+1 |미해당 |콜라|
  | |해당 | 에너지바|
  |1+1|미해당|오렌지주스

### 영수증 출력

- 영수증은 고객의 `구매 내역과 할인`을 **요약**하여 출력
- 영수증 항목
  | 항목 | 내용 |
  |:-----:|----|
  |구매 상품|구매한 상품명, 수량, 가격|
  |증정 상품|프로모션에 따라 무료로 제공된 증정 상품 목록|
  |금액 정보|**총구매액**: 구매한 상품의 총 수량과 총 금액<br>**행사할인**: 프로모션에 의해 할인된 금액<br>**멤버십할인**: 멤버십에 의해 추가로 할인된 금액<br>**내실돈**: 최종 결제 금액|
  - 영수증의 구성 요소를 _보기 좋게 정렬_

### [ERROR]

- 사용자가 잘못된 값을 입력하면 _[ERROR]_ 메시지와 함께 `Error`를 발생시키고 **해당 지점부터 다시 입력**받는다.

---

## 입출력 요구 사항

### 입력

- 구현에 필요한 상품 목록과 행사 목록을 **파일 입출력**을 통해 불러온다.
  - `public/products.md`
  - `public/promotions.md`
  - 내용의 형식을 유지한다면 `값은 수정` 가능
- 구매할 상품과 수량을 **형식에 맞춰** 입력

```bash
[콜라-10],[사이다-3]
```

- 안내상황
  |상황|선택사항|선택지|
  |---|-----|:-----:|
  |프로모션 적용이 가능한데 적게 가져온 경우|추가 여부 선택|Y/N|
  |프로모션 재고가 부족해 일부 수량을 프로모션 혜택 없이 결제|일부 수량 정가 계산 선택|Y/N|
  |멤버십 할인|적용 여부 선택|Y/N|
  |추가 구매|추가 구매 여부 선택|Y/N|
  - 프로모션 재고가 부족한 상황에서 `N`을 누르면 **정가로 결제해야하는 수량만큼 제외 후** 결제 진행
  - 추가 구매 여부에서 `Y`를 선택한 경우 **업데이트된 상품 목록 확인 후** 구매 진행
  ```bash
  현재 {상품명}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)
  ```
  ```bash
  현재 {상품명} {수량}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)
  ```
  ```bash
  멤버십 할인을 받으시겠습니까? (Y/N)
  ```

### 출력

- 환영 인사와 함께 `상품명, 가격, 프로모션 이름, 재고`를 안내
- 재고가 0개라면 `재고 없음`을 출력

```bash
안녕하세요. W편의점입니다.
현재 보유하고 있는 상품입니다.

- 콜라 1,000원 10개 탄산2+1
- 콜라 1,000원 10개
- 사이다 1,000원 8개 탄산2+1
- 사이다 1,000원 7개
- 오렌지주스 1,800원 9개 MD추천상품
- 오렌지주스 1,800원 재고 없음
- 탄산수 1,200원 5개 탄산2+1
- 탄산수 1,200원 재고 없음
- 물 500원 10개
- 비타민워터 1,500원 6개
- 감자칩 1,500원 5개 반짝할인
- 감자칩 1,500원 5개
- 초코바 1,200원 5개 MD추천상품
- 초코바 1,200원 5개
- 에너지바 2,000원 5개
- 정식도시락 6,400원 8개
- 컵라면 1,700원 1개 MD추천상품
- 컵라면 1,700원 10개

구매하실 상품명과 수량을 입력해 주세요.
```

#### 프로모션 적용이 가능한 상품에 대해 고객이 해당 수량만큼 가져오지 않았을 경우

```bash
현재 {상품명}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)
```

#### 프로모션 재고가 부족하여 일부 수량을 프로모션 혜택 없이 결제해야 하는 경우

```bash
현재 {상품명} {수량}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)
```

#### 멤버십 할인 적용 여부를 확인하기 위해 안내 문구

```bash
멤버십 할인을 받으시겠습니까? (Y/N)
```

#### 영수증

- `구매 상품 내역, 증정 상품 내역, 금액 정보`를 출력

```bash
===========W 편의점=============
상품명		수량	금액
콜라		3 	3,000
에너지바 		5 	10,000
===========증	정=============
콜라		1
==============================
총구매액		8	13,000
행사할인			-1,000
멤버십할인			-3,000
내실돈			 9,000
```

#### 추가 구매 여부 확인 안내 문구

```bash
감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)
```

#### [ERROR] 메시지

- 사용자가 잘못된 값을 입력했을 때,`[ERROR]`로 시작하는 오류 메시지와 상황에 맞는 안내를 출력
- **구매할 상품과 수량 형식이 올바르지 않은 경우**

```bash
[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.
```

- **존재하지 않는 상품을 입력한 경우**

```bash
[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.
```

- **구매 수량이 재고 수량을 초과한 경우**

```bash
[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.
```

- **기타 잘못된 입력의 경우**

```bash
[ERROR] 잘못된 입력입니다. 다시 입력해 주세요.
```

### 실행 결과 예시

```bash
안녕하세요. W편의점입니다.
현재 보유하고 있는 상품입니다.

- 콜라 1,000원 10개 탄산2+1
- 콜라 1,000원 10개
- 사이다 1,000원 8개 탄산2+1
- 사이다 1,000원 7개
- 오렌지주스 1,800원 9개 MD추천상품
- 오렌지주스 1,800원 재고 없음
- 탄산수 1,200원 5개 탄산2+1
- 탄산수 1,200원 재고 없음
- 물 500원 10개
- 비타민워터 1,500원 6개
- 감자칩 1,500원 5개 반짝할인
- 감자칩 1,500원 5개
- 초코바 1,200원 5개 MD추천상품
- 초코바 1,200원 5개
- 에너지바 2,000원 5개
- 정식도시락 6,400원 8개
- 컵라면 1,700원 1개 MD추천상품
- 컵라면 1,700원 10개

구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])
[콜라-3],[에너지바-5]

멤버십 할인을 받으시겠습니까? (Y/N)
Y

===========W 편의점=============
상품명		수량	금액
콜라		3 	3,000
에너지바 		5 	10,000
===========증	정=============
콜라		1
==============================
총구매액		8	13,000
행사할인			-1,000
멤버십할인			-3,000
내실돈			 9,000

감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)
Y

안녕하세요. W편의점입니다.
현재 보유하고 있는 상품입니다.

- 콜라 1,000원 7개 탄산2+1
- 콜라 1,000원 10개
- 사이다 1,000원 8개 탄산2+1
- 사이다 1,000원 7개
- 오렌지주스 1,800원 9개 MD추천상품
- 오렌지주스 1,800원 재고 없음
- 탄산수 1,200원 5개 탄산2+1
- 탄산수 1,200원 재고 없음
- 물 500원 10개
- 비타민워터 1,500원 6개
- 감자칩 1,500원 5개 반짝할인
- 감자칩 1,500원 5개
- 초코바 1,200원 5개 MD추천상품
- 초코바 1,200원 5개
- 에너지바 2,000원 재고 없음
- 정식도시락 6,400원 8개
- 컵라면 1,700원 1개 MD추천상품
- 컵라면 1,700원 10개

구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])
[콜라-10]

현재 콜라 4개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)
Y

멤버십 할인을 받으시겠습니까? (Y/N)
N

===========W 편의점=============
상품명		수량	금액
콜라		10 	10,000
===========증	정=============
콜라		2
==============================
총구매액		10	10,000
행사할인			-2,000
멤버십할인			-0
내실돈			 8,000

감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)
Y

안녕하세요. W편의점입니다.
현재 보유하고 있는 상품입니다.

- 콜라 1,000원 재고 없음 탄산2+1
- 콜라 1,000원 7개
- 사이다 1,000원 8개 탄산2+1
- 사이다 1,000원 7개
- 오렌지주스 1,800원 9개 MD추천상품
- 오렌지주스 1,800원 재고 없음
- 탄산수 1,200원 5개 탄산2+1
- 탄산수 1,200원 재고 없음
- 물 500원 10개
- 비타민워터 1,500원 6개
- 감자칩 1,500원 5개 반짝할인
- 감자칩 1,500원 5개
- 초코바 1,200원 5개 MD추천상품
- 초코바 1,200원 5개
- 에너지바 2,000원 재고 없음
- 정식도시락 6,400원 8개
- 컵라면 1,700원 1개 MD추천상품
- 컵라면 1,700원 10개

구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])
[오렌지주스-1]

현재 오렌지주스은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)
Y

멤버십 할인을 받으시겠습니까? (Y/N)
Y

===========W 편의점=============
상품명		수량	금액
오렌지주스		2 	3,600
===========증	정=============
오렌지주스		1
==============================
총구매액		2	3,600
행사할인			-1,800
멤버십할인			-0
내실돈			 1,800

감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)
N
```

---

## 🛠️ 구현 상세

###

###### 모듈 구조

###

###

###

###

###

## 📄 테스트(Testing)

- 단위 테스트(Unit Testing)를 통해 예외 상황과 함수 동작을 검증했습니다.
- 테스트는 `Jest`를 사용했으며, 다음과 같은 **주요 함수**를 테스트했습니다.

### 주요 테스트 기능
