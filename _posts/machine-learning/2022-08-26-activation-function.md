---
title:  "[ML이론] 활성화 함수"
excerpt: "Machine Learning 이론 정리(1): 활성화 함수(activation function) 정리"

categories:
  - Machine Learning
tags:
  - Machine Learning
  - Deep Learning

last_modified_at: 2022-08-26

published: false
---

# 활성화 함수의 개념
활성화 함수(activation function)은 신경망에 비선형성을 추가하여 신경망의 깊은 계층의 작동을 가능하게 한다.

## 한 눈에 보기
TODO 표로 한 번에 정리

# 시그모이드(Sigmoid)
## 정의
시그모이드(sigmoid) 혹은 로지스틱(logistic) 함수로 불린다.

$$
y = f(x) = \cfrac{1}{e+e^{-x}}
$$

![sigmoid](https://user-images.githubusercontent.com/69252153/186851262-f4bfdaf7-047b-4b1f-83c1-64f4f7239615.png){: .align-center}

식과 그래프에서 볼 수 있듯, 출력 범위가 (0, 1)이다.

## 특징

## 사용처

- - -

# 쌍곡선 탄젠트(tanh)
쌍곡선 탄젠트(Hyperbolic Tangent, tanh) 함수는 아래와 같은 식을 가진다.

$$
y = f(x) = \cfrac{e^x - e^{-x}}{e^x + e^{-x}}
$$

![tanh](https://user-images.githubusercontent.com/69252153/186851835-5390efce-9aae-4a41-bb8e-ebb2eb5c17ae.png){: .align-center}

출력 범위가 (-1, 1)로, 양수와 음수 출력이 모두 필요할 때 유용하다.

- - -

# ReLU
우리말로 번역하면 '정류 활성화 유닛'이라고 부르는 ReLU(Rectified Linear Unit) 함수이다. 

$$
y = f(x) = \max (0, x)
$$

![relu](https://user-images.githubusercontent.com/69252153/186852746-2e9b6550-3b3f-49d0-9674-07035f65a604.png){: .align-center}

시그모이드나 tanh의 경우, 입력값이 클 수록 경사가 0으로 감소하는 경향을 보이는데, ReLU는 이 문제점을 해소할 수 있다. 단, 입력이 음수일 경우 출력도 0, 경사도 0임에 유의한다.

- - -

# Leaky ReLU

$$
y = f(x) = \max (kx, x)
$$

![leaky-relu](https://user-images.githubusercontent.com/69252153/186853413-127dfcb2-92cd-4413-a0af-efee3865652f.png){: .align-center}

위 그래프는 k=0.1로 설정했을 때의 값이다.

입력이 음수일 때도 이를 처리해야 한다면, ReLU는 음수 입력을 모두 0으로 만들기 때문에 부적합하다. 이럴 때는 ReLU보단 LeakyReLU를 사용하는 것이 좋다.

- - -

# References
* 실전! 파이토치 딥러닝 프로젝트