---
title:  "[Paper Review] SoPhie: An Attentive GAN for Predicting Paths Compliant to Social and Physical Constraints"
excerpt: "SoPhie 모델 논문 리뷰"

categories:
  - Prediction
tags:
  - Papaer Review
  - Machine Learning
  - Deep Learning
  - Prediction
  - Autonomous Driving
last_modified_at: 2022-08-03

use_math: true
toc: true
tock_sticky: true
toc_label: "Contents"
---

단어 뒤 🔍 아이콘은 [Further Study](#further-study)(개념 추가 조사) 부분에 레퍼런스 링크를 추가해 두었다.
{: .notice--info}

# Abstract

- 이 논문에서 풀려는 문제: <span style="background-color: #fff5b1"><b>Path prediction for multiple interacting agents in a scene</b></span> (한 장면 내의 상호작용하는 다수의 에이전트들의 미래 경로 예측하기)
- 소개할 모델: <span style="background-color: #fff5b1"><b>SoPhie
    - GAN 기반의 해석 가능한 프레임워크
    - (1) 장면 내 모든 에이전트의 path history와 (2) 그 장면의 이미지를 사용한 scene context 정보를 이용함
    - <span style="background-color: #fff5b1"><b>사회적으로도 물리적으로도 그럴듯한(plausible) 경로를 만들어 예측함</b></span>
- 주요 특징1: <span style="background-color: #fff5b1"><b>물리적 정보(physical information)과 사회적 정보(social information) 모두 이용되어야 함</b></span>
    - Social attention 매커니즘과 Physical attention 매커니즘을 혼합해 사용함
    - 모델이 큰 장면 내에서 어딜 더 집중해야 할지 학습하고, 이미지에서 중요한(salient) 부분을 추출하게 함
- 주요 특징2: <span style="background-color: #fff5b1"><b>GAN 사용</b></span>
    - 더욱 실제적인(realistic) 샘플을 만듦
    - 미래 경로의 불확실성의 분포를 모델링하여 포착함

- - -

# SoPhie

![SoPhie의 아키텍처](https://user-images.githubusercontent.com/69252153/184533342-3700ea9e-7cea-4130-aa68-a1a3b3caf2d1.png){: .align-center}

SoPhie 아키텍처는 세 가지 주요 모듈로 이루어져 있다.

- Feature Extractor Module (a)
- Attention Module (b)
- LSTM based GAN Module (c)

## Problem Definition

- 표기법
    - $[N] = \{ 1, \cdots , N \}$
    - $X_{1:N}^{\cdot}$ : 모든 N명의 에이전트의 상태의 모음
    - $X_{1:N \backslash i}^{\cdot}$ : 타겟 에이전트 $i$를 제외하고 모든 N명의 에이전트의 상태의 모음
    - $Y^\tau$ : 시각 $t + \tau$에서 미래 상태의 표현
    - $Y_i^{1:T}$ : 시각 $t + 1$부터 $t + T$까지의 미래 GT
    - $\hat{Y}_i^{1:T}$ : 시각 $t + 1$부터 $t + T$까지의 예측된 상태
- 입력으로서 장면에 대한 정보와 에이전트들의 과거 상태가 주어진다.
    - <span style="background-color: #fff5b1"><b>장면에 대한 정보는 이미지 $I^t$로 주어진다.</b></span> Top-view가 될 수도, Angle-view가 될 수도 있다.
    - <span style="background-color: #fff5b1"><b>에이전트의 상태는 그들의 위치로 나타낼 수 있다.</b></span> 2차원 좌표 $\left( x_i^t , y_i^t \right) \in \mathbb{R}^2$를 사용하는 식이다.
    
    $$
    X_i^{1:t} = \{ (x_i^\tau , y_i^\tau) | \tau = 1, \cdots , t \} \qquad \forall i \in [N] 
    $$
    
- GT은 아래와 같다.
    
    $$
    Y_i^{1:T} = \{ (x_i^\tau , y_i^\tau) | \tau = t+1, \cdots , t+T \} \qquad \forall i \in [N] 
    $$
    
- 미래 상태를 예측하기 위하여 모델의 파라미터 $W^*$를 학습한다.
    
    $$
    \hat{Y}_i^{1:T} = f \left( I^t , X_i^{1:t} , X_{1:N \backslash i}^{1:t} ; W^* \right)
    $$
    
    - 오차역전파와 SGD(Stochastic Gradient Descent)를 사용해 $\mathcal{L}_{GAN}$ 손실을 최소화함으로써 end-to-end 방식으로 가중치를 훈련시킨다.

## 모듈1: Feature Extractor Module

- CNN을 사용해 <span style="background-color: #fff5b1"><b>현재 이미지 $I^t$로부터 시각적 특징 $V_{Ph}^t$을 추출한다.</b></span>
    - 해당 논문에서는 CNN으로 VGGnet-19를 사용했다.
    - $W_{cnn}$은 ImageNet에 사전 훈련된 값으로 초기화하고, fine-tunning을 진행한 가중치이다.
    - 이 연산은 <span style="background-color: #fff5b1"><b>Physical feature $V_{Ph}^t$을 얻고, 두 번째 모듈인 Attention Module의 Physical Attention 매커니즘에 사용된다.</b></span>
    
    $$
    V_{Ph}^t = CNN(I^t ; W_{cnn})
    $$
    
- LSTM encoder를 사용해 <span style="background-color: #fff5b1"><b>각 에이전트 $X_i^{1:t}$와 다른 에이전트들 $X_{1:N\backslash i}^{1:t}$ 간의 결합적(joint) 특징을 추출한다.</b></span>
    - 에이전트 $i$의 모든 상태(state) 간의 시간적(temporal) 의존성(dependency)를 포착하기 위해 LSTM을 사용한다. 그들을 시간 $t$에 대해 고차원의 특징 표현으로 인코딩한다.
    - $h_{en}^t (i)$는 에이전트 $i$의 시간 $t$에서 LSTM 인코더의 은닉 상태를 말한다.
    
    $$
    V_{en}^t (i) = LSTM_{en} \left(  X_i^t, h_{en}^t (i) ; W_{en} \right)
    $$
    
    - 모든 에이전트들의 인코딩된 특징 $V_{en}^t (\cdot)$을 결합적 특징으로 추출해야 하므로 추가적 과정이 더 필요하다. 단순한 결합이 아닌, 에이전트의 index의 순열 불변하는(permutation invariant)(🔍) 결합적 특징을 만들어야 한다. *max* 함수는 여러 문제점이 있으므로 다른 방식을 제안했다.
    - 그 결과, 일관적인(consistent) ordering sturcture을 정의했다. 각 타겟 에이전트 $i$의 결합적 특징은 $i$로부터 다른 에이전트들이 떨어진 거리로 정렬(*sort*)되어 만들어진다.
        - *sort*는 *max* 외에 또다른 permutation invariant function으로, *max*에서 잃어버리는 입력의 고유성을 그대로 가져갈 수 있다는 장점이 있다.
        - $\pi_j$는 거리에 따라 정렬된 다른 에이전트의 index를 말한다.
        - 이 방법으로, 에이전트들은 각자 고유한 (social) 특징 벡터를 갖게 된다.
        - 이 연산은 <span style="background-color: #fff5b1"><b>Social feature $V_{So}^t$을 얻고, 두 번째 모듈인 Attention Module의 Social Attention 매커니즘에 사용된다.</b></span>
    
    $$
    V_{So}^t (i) = \left( V_{en}^t (\pi_j) - V_{en}^t(i) \big| \forall \pi_j \in [N] \backslash i \right)
    $$
    

## 모듈2: Attention Module

- <span style="background-color: #fff5b1"><b>Feature Extractor Module에서 받아 입력된 특징 중에서 가장 중요한 정보를 추출해 다음 모듈에 전달한다.</b></span>
- Attention이라는 단어에서 알 수 있듯이 ‘중요한 정보’란 <span style="background-color: #fff5b1"><b>각 장면에서 더 중요한 부분이나, 미래 상태를 예측할 때 더 관련이 깊은 다른 에이전트에 집중하도록 한다.</b></span>
- 두 개의 soft attention 모듈로 이루어졌다.
    - <span style="background-color: #fff5b1"><b>Physical Attention</b></span>
        - 공간적(물리적)인 제약사항을 학습하고, 물리적으로 실현 가능한 경로들에 집중한다.
        - 입력은 (1) GAN 모듈의 디코더 LSTM의 은닉 상태 $h_{dec}^t(\cdot)$과 (2) 이미지에서 추출한 시각적 특징 $V_{Ph}^t$이다. 특히 $h_{dec}^t(\cdot)$는 미래 경로 예측에 필요한 정보를 가진다.
        - 출력은 physical context vector인 $C_{Ph}^t$로, <span style="background-color: #fff5b1"><b>각 에이전트의 실현 가능한(feasible) 경로에 집중하고 있다.</b></span>
        - $W_{Ph}$는 해당 모듈의 파라미터를 말한다.
        
        $$
        C_{Ph}^t (i) = ATT_{Ph} \left( V_{Ph}^t , h_{dec}^t(i) ; W_{Ph}\right)
        $$
        
    - <span style="background-color: #fff5b1"><b>Social Attention</b></span>
        - 에이전트들 간의 상호작용과 그것이 미래 경로에 미칠 영향을 고려한다.
        - 입력은 (1) GAN 모듈의 디코더 LSTM의 은닉 상태 $h_{dec}^t(\cdot)$과 (2) 이미지에서 추출한 결합적 특징 벡터 $V_{So}^t$이다.
        - 출력은 social context vector인 $C_{So}^t$로, <span style="background-color: #fff5b1"><b>각 에이전트의 경로를 예측하는데 다른 어떤 에이전트가 가장 중요하게 고려되어야 하는지를 나타낸다.</b></span>
        - $W_{So}$는 해당 모듈의 파라미터를 말한다.
        
        $$
        C_{So}^t (i) = ATT_{So} \left( V_{So}^t , h_{dec}^t(i) ; W_{So}\right)
        $$
        
- 두 attention은 포함된 모든 에이전트와 물리적 공간을 망라하는 정보를 통합한다(aggregate).
    - 군중이 있는 공간에서 모든 에이전트의 상호작용을 모델링하는 것은 복잡하기 때문이다.
    - 이로써 예측 결과를 조금 더 해석 가능하게(interpretability) 만든다.
    - 입력 데이터의 중복(redundancy)을 억제함으로써 예측 모델이 중요한 특징에만 더 집중할 수 있도록 한다.

## 모듈3: LSTM based GAN Module

- Attention Module에서 받은 중요 정보들을 바탕으로 <span style="background-color: #fff5b1"><b>그럴듯하고 실현 가능한 미래 경로의 시퀀스($\hat{Y}_i^{1:T}$)를 각 에이전트마다 LSTM decoder가 생성한다.</b></span> GAN처럼 판별자(discriminator)가 실제 경로와 생성 경로를 비교함으로써 생성자(generator)의 성능을 향상시킨다.
- 모듈의 입력: 각 에이전트 $i$에 대한 <span style="background-color: #fff5b1"><b>social context vector $C_{So}^t$와 physical context vector $C_{Ph}^t$
- 모듈의 출력: <span style="background-color: #fff5b1"><b>사회적, 물리적 제약을 따르는 미래 상태들의 후보들</b></span>
- L2 norm의 문제점이 있어 그 대신 GAN 모델을 사용해 모든 실현 가능한 미래 경로들의 분포를 학습하고 예측한다. 생성자와 판별자 각각 LSTM을 사용해 시간 의존적인(temporally dependent) 미래 상태를 추정한다.
- <span style="background-color: #fff5b1"><b>Generator(G)</b></span>
    - decoder LSTM인 $LSTM_{dec}(\cdot)$이다.
    
    $$
    \hat{Y}_i^t = LSTM_{dec} \left( C_G^t (i), h_{dec}^{\tau} (i) ; W_{dec} \right)
    $$
    
    - Conditional GAN과 유사하게, 이 생성자의 입력엔 백색 소음 벡터 $z$가 쓰인다. $z$는 다변수 정규 분포(multivariate normal distribution)에서 샘플링되며, 이때 physical & social context vector가 그 조건(condition)이 된다.
    - 소음 벡터 $z$와 두 context vectors를 concat하여 최종적으로 $C_G^t (i) = \left[ C_{So}^t (i), C_{Ph}^t (i), z \right]$의 형태로 입력한다.
    - <span style="background-color: #fff5b1"><b>모듈의 출력 $\hat{Y}_i^t$는 각 에이전트에 대한 $\tau^{th}$ 번째로 생성된 미래 상태의 샘플이다.</b></span>
- <span style="background-color: #fff5b1"><b>Discriminator(D)</b></span>
    - classifier LSTM인 $LSTM_{dis}(\cdot)$이다.
    
    $$
    \hat{L}_i^\tau = LSTM_{dis} \left( T_i^\tau, h_{dis}^{\tau} (i) ; W_{dis} \right)
    $$
    
    - 모듈의 입력: 각 에이전트에 대하여 $\tau^{th}$ 번째 시점까지의 GT 혹은 예측 미래 경로로부터 랜덤하게 선택된 경로 샘플 $T_i^{1:\tau} \sim p \left( \hat{Y}_i^{1:\tau} , Y_i^{1:\tau} \right)$
    - 모듈의 출력: <span style="background-color: #fff5b1"><b>선택된 경로 샘플이 GT(실제) $Y_i^{1:\tau}$ 혹은 예측(가짜) $\hat{Y}_i^{1:\tau}$인지 판별자가 예측한 라벨이다. Truth 라벨은 각각 $\hat{L}_i^\tau = 1$과 $\hat{L}_i^\tau = 0$이다.</b></span>
    - 판별자는 생성자가 더 그럴듯한 상태를 만들도록 돕는다.
- <span style="background-color: #fff5b1"><b>Losses</b></span>
    
    $$
    W^* = \underset{W}{\arg \min} \ \mathbb{E}_{i, \tau} \left[ \mathcal{L}_{GAN} \left( \hat{L}_i^t , L_i^t \right) + \lambda \mathcal{L}_{L2} \left( \hat{Y}_i^{1:\tau} , Y_i^{1:\tau} \right) \right]
    $$
    
    - $W$ : 모델의 모든 네트워크의 가중치 모음
    - $\lambda$ : 두 loss 간의 regularizer
    - $\mathcal{L}_{GAN}(\cdot, \cdot)$ : Adversarial Loss
        
        $$
        \begin{aligned}
        & \mathcal{L}_{GAN}\left( \hat{L}_i^t , L_i^t \right) \\
        & = \underset{G}{\min} \underset{D}{\max} \quad \mathbb{E}_{T_i^{1:\tau} \sim p \left(Y_i^{1:\tau} \right)} \left[ {L}_i^\tau \log \hat{L}_i^\tau \right] + 
        \mathbb{E}_{T_i^{1:\tau} \sim p \left(\hat{Y}_i^{1:\tau} \right)} \left[(1- {L}_i^\tau) \log (1-\hat{L}_i^\tau ) \right]
        \end{aligned}
        $$
        
    - $L_i^t(\cdot, \cdot)$ : L2 loss로, $\mathcal{L}_{L2} \left( \hat{Y}_i^{\tau} , Y_i^{\tau} \right) = \lVert \hat{Y}_i^{\tau} - Y_i^{\tau} \rVert _2^2$

- - -

# Experiments

🥕 **실행하는 실험 3가지**

- SoPhie에 사용되는 방식과 타 baselines들을 <span style="background-color: #fff5b1"><b>데이터셋 ETH와 UCY</b></span>에서 평가한다. 또한 최신 대형 데이터셋인 <span style="background-color: #fff5b1"><b>Stanford drone dataset(SDD)</b></span>에서도 평가한다.
- 정성 분석을 통해 어텐션 매커니즘의 효과를 검증한다.
- 어떻게 GAN 기반 접근법이 에이전트 경로의 이동 가능성(traversability)의 좋은 예측을 제공하는지 정성평가를 한다.

🥕 **Implementation details**

- 생성자와 판별자 모델을 Adam optimizer를 사용해 64 크기의 미니 배치와 0.001 학습률을 사용해 반복적으로 학습한다. 200 에폭동안 훈련한다.
- 인코더는 단일 레이어 MLP를 사용해 경로를 인코딩한다. 임베딩 차원은 16개이다.
    - 생성자에서는 이 값이 LSTM으로 크기 32의 은닉 차원으로 입력된다.
    - 판별자에서는 은닉 차원의 크기가 64인 것만 다르고 생성자와 동일하게 작동한다.
- 생성자의 디코더는 단일 레이어 MLP를 사용하며, 16개의 임베딩 차원으로 에이전트의 위치를 인코딩한다. 또한 32개의 은닉 차원을 가지는 LSTM도 사용한다.
- Social Attention module
    - 어텐션 가중치는 인코더의 출력과 디코더의 context를 다층 MLP로 넘김으로써 얻을 수 있다.
    - MLP의 레이어는 각각 64, 128, 64, 1의 크기를 가지며, 그 사이에 ReLU 활성화 함수가 있다(intersperse).
    - 마지막 레이어는 Softmax 레이어로 이어진다.
- 최대 32명의 주변 에이전트의 상호작용을 고려한다($N_{max} = 32$).
- Physical Attention module은 512 채널의 VGG 특징을 받아 CNN으로 그들을 투영하며(project), 단일 MLP로 16개 임베딩 차원으로 임베딩한다.
- 판별자는 어텐션 모듈이나 디코더 네트워크를 사용하지 않는다.
- 훈련 시, 한 에이전트의 8개 타임스탬프를 관측하고 그 다음 12개 타임스탬프를 예측한다.
- data augmentation의 이점
    - scene orientation에 모델이 더 강인하도록 데이터 증강을 실시한다.
    - 장면을 뒤집고(flip) 회전(rotate)하거나, 에이전트들의 위치를 정규화(normalization)한다.
    - 데이터 증강은 훈련된 모델을 더 일반적으로 만드는 데 도움이 된다(conducive). 이는 검증 예시에 대해 지금껏 보지 못한 케이스나 로터리(roundabout) 같이 기존과 다른 장면 기하학적 구조에서 모델이 잘 동작하게 한다.

🥕 **Baselines & Evaluation**

- ETH, UCY 데이터셋에서
    - Linear Regressor (*Lin*): 최소 제곱 오차를 최소화하는 방향으로 선형 파라미터를 추산함
    - S-LSTM: social pooling layer와 LSTM이 결합된 예측 모델
    - S-GAN, S-GAN-P: Social LSTM 모델에 생성 모델을 적용한 모델
- SDD 데이터셋에서
    - **Linear Regressor**: 위와 동일
    - **S-LSTM**: 위와 동일
    - **Social Forces**: K. Yamaguchi 등의 논문 Social Forces의 적용 <br>(K. Yamaguchi, A. C. Berg, L. E. Ortiz and T. L. Berg, "Who are you with and where are you going?," *CVPR 2011*, 2011, pp. 1345-1352.)
    - **DESIRE**: 생성 모델을 사용하는 IOC(Inverse Optimal Control) 모델
    - **CAR-Net**: A. Sadeghian 등의 논문에서 제안한 물리적 어텐션 모델<br>(A. Sadeghian, F. Legros, M. Voisin, R. Vesel, A. Alahi, and S. Savarese, “CAR-Net: Clairvoyant Attentive Recurrent Network,” Sep. 2018.)
- 모든 데이터셋에 대하여 SoPhie의 실험 버전
    - $\mathrm{T_A}$ : Social Features과 Social attention 만 사용함
    - $\mathrm{T_O + I_O}$ : 어텐션 없이 Visual & Social Features만 사용함
    - $\mathrm{T_O + I_A}$ : Visual attention만 사용하며, Visual & Social Features을 사용함
    - $\mathrm{T_A + I_O}$ : Social attention만 사용하며, Visual & Social Features을 사용함
    - $\mathrm{T_A + I_A}$ : 모든 모듈을 포함한 완전한 Sophie 모듈
- 평가지표
    - ADE (Average Displacement Error): GT와 보행자 경로 사이의 평균 L2 거리
    - FDE (Final Displacement Error)
- 평가 작업
    - <span style="background-color: #fff5b1"><b>8초간 평가를 수행한다. 입력으로 처음 3.2초의 8개 위치를 사용하고, 남은 4.8초는 12개의 위치를 예측한다.</b></span>
    - ETH, UCY 데이터셋은 leave-one-out 교차 검증 점책을 사용하여 Social GAN과 비슷한 방식으로 평가한다. 4개 장면들을 훈련하고 남은 하나를 검증으로 쓴다. *m* 단위계를 사용한다.
    - SDD 데이터셋은 standard split을 사용하고, *m* 단위계에서 픽셀 공간으로 변환해 결과를 얻는다.

## 정량 평가

🥕 **ETH, UCY**

![ETH, UCY에서 평가](https://user-images.githubusercontent.com/69252153/184533458-d6ee5853-ed5c-40a4-bd18-e54e55583f44.png){: .align-center}

- Linear Model: 가장 저조한 성능을 보인다. 다른 사람과의 복잡한 사회적 상호작용이나, 사람과 물리적 공간 사이의 상호작용을 모델링할 수 없다.
- S-LSTM: Social pooling 레이어를 사용하므로 선형 모델보다는 나은 성능이다.
- S-GAN: 생성적 관점(standpoint)에서 접근함으로써 S-LSTM보다 더 발전되었다.
- Sophie
    - $\mathrm{T_A}$ : 특징 추출 전략과 어텐션 모듈이 더 좋기 때문에 평균적으로 S-GAN보다는 약간 성능이 더 낫다. Social contex는 모델이 더 나은 예측을 하도록 돕긴 하지만, 그것만 사용하기엔 장면 내 상호작용을 모두 이해하는데 부족하다.
    - $\mathrm{T_O + I_O}$ : 이 경우엔 물리적 장면에서 어텐션 없이 보행자 경로와 특징 모두를 사용하는데, 이러한 추가적 특징에 대한 contex의 부족은 어떤 요소가 가장 중요한지를 학습하지 못하게 한다. 따라서 $\mathrm{T_A}$와 유사한 성능을 보인다.
    - $\mathrm{T_O + I_A}$ : physical context를 이미지 특징에 적용한다. 상호작용의 중요한 측면을 학습한다. $\mathrm{T_A + I_O}$보다 조금 더 나은 성능을 보인다. <span style="background-color: #fff5b1"><b>물리적 맥락이 조금 더 경로 예측에 도움이 되기 때문이다.</b></span>
    - $\mathrm{T_A + I_O}$ : social context를 경로 특징에 적용한다. $\mathrm{T_O + I_A}$와 마찬가지로 상호작용의 중요한 측면을 학습하기 때문에, 첫 번째와 두 번째 모듈보다 더 나은 성능을 보인다.
    - $\mathrm{T_A + I_A}$ : <span style="background-color: #fff5b1"><b>둘 모두의 어텐션을 결합하는 것이 강인한 모델 예측을 가능하게 한다. 따라서 가장 좋은 성능을 보인다.</b></span>

🥕 **SDD**

![image](https://user-images.githubusercontent.com/69252153/184533474-fb06d453-3e75-484d-bdeb-d62b8c0bfea2.png){: .align-center}

- 선형 모델은 가장 낮은 성능을, S-LSTM과 S-GAN은 그보단 나은 성능을 보인다.
- CAR-Net: physical attention을 사용하기 때문에 앞선 모델보다 더 좋은 정확도를 낸다. SDD 데이터셋의 특성과도 연관이 있는데, 보행자들의 움직임이 길의 곡률에 기반하고 있어 장면의 버드아이뷰로부터 움직임을 추론(extrapolate)할 수 있기 때문이다.
- DESIRE: 기준 모델 중에는 가장 좋은 성능을 보였다.
- Sophie: $\mathrm{T_A}$와  $\mathrm{T_A + I_A}$ 는 굉장한 모델 개선을 가져오는데, <span style="background-color: #fff5b1"><b>경로 예측 문제를 다룰 때 physical & social 어텐션 모듈이 다 중요함을 암시한다.</b></span>

🥕 **Social & Physical 제약의 영향**
사회적으로 용인 가능한 경로를 예측하기 위해, 또다른 평가 지표를 사용해 근거리 충돌(near-collisions)(두 보행자가 0.10 *m* 임계값보다 더 가까워지는 경우)의 비율을 측정한다. 각 BIWI/ETH 장면의 모든 프레임을 관통하는 보행자의 근거리 충돌 평균 비율을 계산한다.

또한 SDD의 검증 데이터셋을 물리적으로 Simple 혹은 Complex한 경우 둘로 나눴다. ADE를 픽셀 단위로 나타냈다. 이 결과를 보면 <span style="background-color: #fff5b1"><b>Sophie가 physical attention을 사용한 것이 성공적으로 물리적이고 사회적으로 용인 가능한 경로를 잘 생성하도록 돕는다는 점을 알 수 있다.</b></span>

## 정성 평가

사회적, 물리적 상호작용이 어떻게 미래 경로 예측에 적용되는지 입증한다. 

🥕 **각 Attention의 효과**

![어텐션 효과 검증](https://user-images.githubusercontent.com/69252153/184533488-6350a814-57d6-4bd9-8b5b-642ca4584595.png){: .align-center}

위 사진은 어텐션이 잘못된(erroneous) 예측을 고칠 수 있는지를 보여준다. 세 가지 시나리오를 시각화하여 S-GAN과 이 모델을 비교한다.

- 시나리오 A: physical attention이 초록색 보행자의 경로가 도로의 곡률을 따라가도록 한다.
- 시나리오 B: 초록색 보행자에 대한 social attention이 파란색 보행자가 다른 보행자와 부딪히지 않도록 한다.
- 시나리오 C: physical attention은 빨간 보행자가 길 안쪽에 머무르도록 하고, social attention은 파란색 보행자가 빨간색 보행자와 충돌하지 않도록 한다.

위 결과로 미루어 보아, <span style="background-color: #fff5b1"><b>두 개의 어텐션의 도입은 모델의 해석가능성(interpretability)를 향상시키고 scene constraints에 예측이 더 잘 정합되도록 한다.</b></span>

🥕 **생성 모델의 효과**

![생성모델 효과 검증](https://user-images.githubusercontent.com/69252153/184533506-f34a0b78-dc17-4bbd-bf86-6c459ddb7d54.png){: .align-center}

Sophie는 생성 모델을 사용함으로써 장면 내 어떤 부분이 이동 가능한지(traversable) 이해하도록 돕는다. 위 사진에서 히트맵은 이동 가능한 영역을 나타내고, 파랑색 가위표는 샘플의 시작 지점을 보여준다.

- Nexus 6: 이동 가능 영역을 도로 중앙/측면으로 통하는 길(side path, 교차로에서 뻗어나가는 길)을 발견할 수 있다.
- Little 1: 보행자가 걷고 있는 주된 인도를 파악할 수 있으며, 보행자가 회피하는 올바르게 무시할 수 있다.
- Huang 1: 교차지점과 교차로에서 뻗어나가는 길을 올바르게 파악할 수 있다.

또한 생성 네트워크는 작은 수의 샘플이라고 하더라도 <span style="background-color: #fff5b1"><b>이동 가능한 영역을 성공적으로 탐색할 수 있음을 발견했다.</b></span>

- - -

# References

## Original Paper

A. Sadeghian, V. Kosaraju, A. Sadeghian, N. Hirose, H. Rezatofighi, and S. Savarese, “[**Sophie: An attentive gan for predicting paths compliant to social and physical constraints**](https://openaccess.thecvf.com/content_CVPR_2019/html/Sadeghian_SoPhie_An_Attentive_GAN_for_Predicting_Paths_Compliant_to_Social_CVPR_2019_paper.html),” in *Proceedings of the IEEE/CVF conference on computer vision and pattern recognition*, 2019, pp. 1349–1358.

## Further Study

🔍 [**Permutation Invariant**](https://blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=qbxlvnf11&logNo=221659870504)