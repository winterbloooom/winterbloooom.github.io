---
title:  "[ML이론] 최적화 스케줄"
excerpt: "Machine Learning 이론 정리(2): 최적화 스케줄(optimization schedule) 정리"

categories:
  - AI
  - Machine Learning
tags:
  - Machine Learning
  - Deep Learning

last_modified_at: 2022-08-26

published: false
---

# 최적화 스케줄


## 한 눈에 보기
TODO 표로 한 번에 정리

- - -

# 표준적 경사 하강법

가중치에 대한 비용함수($J(\theta)$)에 대해 가중치 $\theta$를 갱신하는 방법은 아래와 같다.

$$
\theta \leftarrow \theta - \eta \bigtriangledown_{\theta}J(\theta)
$$

일정한 step 크기만큼 조금씩 경사면을 따라 내려가기 때문에 맨 아래 도착하는 데 시간이 오래 걸리고, 일부분이 아주 작은 기울기($\bigtriangledown_{\theta}J(\theta)$)를 가진다면 속도가 느려진다. 이전 기울기(그래디언트)를 고려하지 않는다.

# 모멘텀 최적화 ?????
1964년 보리스 폴랴크(Boris Polyak)가 제안했다.

> [논문 보기](https://www.sciencedirect.com/science/article/abs/pii/0041555364901375) Polyak, Boris T. "**Some methods of speeding up the convergence of iteration methods**." Ussr computational mathematics and mathematical physics 4, no.5 (1964): 1-17.

이전 그래디언트를 사용하는 방식이다. 아래 식에서 $\mathbf{m}$은 모멘텀 벡터(momentum vector)이며 $\beta$는 모멘텀(momentum)이다.

$$
\begin{align}
\mathbf{m} &\leftarrow \beta \mathbf{m} - \eta \bigtriangledown_{\theta}J(\theta) \\
\theta &\leftarrow \theta + \mathbf{m}
\end{align}
$$

그래디언트를 속도가 아닌 가속도로 사용한다. 모멘텀 $\beta$는 마찰저항의 역할을 하여 모멘텀이 너무 커지는 것을 방지한다.

# 확률적 경사 하강법(SGD)

- - -

# References
* 실전! 파이토치 딥러닝 프로젝트
