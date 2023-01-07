---
title:  "[Paper Review] Social GAN: Socially Acceptable Trajectories with Generative Adversarial Networks"
excerpt: "Social GAN 모델 논문 리뷰"

categories:
  - AI
  - Deep Learning
tags:
  - Prediction
  - Papaer Review
  - Autonomous Driving
  - Machine Learning
  - Deep Learning
last_modified_at: 2022-07-24


---

💡 단어 뒤 🔗 아이콘은 [Further Study](#further-study)(개념 추가 조사) 부분에 추가 설명을 해두었다는 표시이다.
{: .notice--info}

# Information

* **Title:** Social GAN: Socially Acceptable Trajectories with Generative Adversarial Networks
* **Authors:** Gupta, A., Johnson, J., Fei-Fei, L., Savarese, S., & Alahi, A.
* **Source:** Proceedings of the IEEE conference on computer vision and pattern recognition (2018)
* **Keyword:** motion prediction, trajectory prediction, multi-modal, GAN, collision avoidance, pedestrain, socially acceptable

이 논문은 사람의 예측 경로를 생성하는 데 GAN을 사용하기 시작한 첫 번째 논문이다. 자율주행에서 올바른 판단을 내리기 위하여 보행자의 사회적으로 그럴 듯한(가능한) 미래 경로를 예측한다.

---

# 0. Abstract

사람의 행동(motion behavior)을 예측하는 것은 자율주행차 등의 이동체가 사람 중심의 환경(human-centric envrionments)에서 작동할 때 매우 중요하다. 

그러나 <span style="background-color: #fff5b1"><b>사람의 행동은 multi-modal</b></span>(🔗)하기 때문에 해당 문제를 해결하기 어렵다. 지나온 경로 경로(path)가 주어졌을 때, 사회적으로 가능한 여러 개의 미래 경로 계획들이 존재할 수 있다.

논문의 저자들은 이 문제를 해결하기 위하여 <span style="background-color: #fff5b1"><b>sequence prediction(🔗)과 GAN(Generative Adversarial network)(🔗)를 결합함으로써 해결하려 했다.</b></span> 재귀적 sequence-to-sequence 모델이 지난 행동들(motion histories)를 관찰하고 미래 행동(future behavior)을 예측한다. 이때 이 논문에서 새로 제시된 풀링(pooling)을 사용해 사람들 간의 정보를 정합(aggregate)한다. <span style="background-color: #fff5b1"><b>재귀적 discriminator에 대응하여 적대적으로(adversarially) 학습시키고  variety loss로 다양한 예측을 하게 시킴으로써, 사회적으로 용인 가능한(socially plausible) 미래들을 예측하게 한다.</b></span>

몇 개의 데이터셋에 대하여 실험을 하고, 이를 통해 기존 연구들에 비해 정확도(accuracy)와 다양성(variety), 충돌 방지(collision avoidance), 연산 복잡도(computational complexity)에서 우수함을 입증했다.

# 1. Introduction

😮 <b><u>보행자 행동 예측의 필요성 및 목표</u></b>

자율주행자동차와 같이 사람과 같은 환경을 공유하는 자율 이동체 플랫폼에게 보행자(pedestrians)의 행동을 예측하는 것은 필수적이다. 사람의 경우, 복잡한 사회적 상호작용을 효과적으로 판단해 결정할 수 있고, 기계도 그렇게 되어야 한다. 따라서 <span style="background-color: #fff5b1"><b>관찰된 보행자의 행동 경로(motion trajectories)(🔗)가 주어졌을 때 가능한 모든 미래 경로를 예측할 수 있어야 한다.</b></span>

여러 개의 회피 경로가 가능한 예

😰 <b><u>보행자 행동 예측의 어려움과 이를 해결하려 했던 지난 연구들</u></b>

그러나 아래와 같이 군중이 있는 장면에서(crowded scenes) 사람의 행동(motion)이 가진 내재적 특성 몇 가지 때문에 사람의 행동을 예측하는 데는 어려움이 따른다.

- <span style="background-color: #fff5b1"><b>Interpersonal</b></span>(대인간의, 對人間): 각자의 행동은 주변인들에 영향을 받는다. 사람은 군중 사이를 지날 때(naviagte) 다른 이들의 행동을 읽는 선천적 능력이 있다. 이러한 의존성(dependencies)을 결합적으로 모델링하는 것(jointly modeling)이 어렵다. → 그간은 인위적으로 만든(hand-crafted) features에 기반한 방식을 사용해왔다.
- <span style="background-color: #fff5b1"><b>Socially Acceptable</b></span>(사회적으로 용인 가능한): 몇 경로들은 물리적으론 가능하지만 사회적으로는 부적합하다. 선행권(right-of-way)를 양보한다던지 사람 간 간격을 생각하는 등 사회적 규범에 따라서 움직이는데, 이들을 공식화(formalize)하는 것도 중요하다. → 최근 들어 RNN(Recurrent Nerual Networks)를 기반으로 한 data-driven 기술들이 사용되고 있다.
- <span style="background-color: #fff5b1"><b>Multi-modal</b></span>: 부분적 기록(history, ‘지난 경로’로 해석)이 주어졌을 때, 꼭 하나의 미래 예측만 나오란 법은 없다. 여러 개의 경로가 도출 가능하고 사회적으로도 용인될 수도 있다. → 정적인 장면이 주어졌을 때 경로 선택(route choices)의 맥락에서 접근하고 있다.

🤓 <b><u>선행 연구들의 한계 2가지</u></b>

- 연산 효율성 측면에서, 한 장면 내 모든 사람들 간의 상호작용을 모델링할 수 없다.
- 평균적 행동(average behavior)을 학습하려는 경향이 있다. 흔히 사용되는 손실 함수는 정답(ground truth)과 예측값(forecasted outputs) 간의 유클리드 거리를 최소화하도록 설계되었기 때문이다.

이 논문에서는 <span style="background-color: #fff5b1"><b>여러 개의 사회적으로 가능한 경로들(multiple socially acceptable trajectories)을 학습하도록 한다.</b></span>

🤗 <b><u>이 논문에서 제시하는 방법: GAN을 활용하자</u></b>

저자들은 <span style="background-color: #fff5b1"><b>GAN을 이용해 지난 관측 결과가 주어졌을 때 여러 개의 사회적 용인 가능한 경로들을 생성하고자 했다.</b></span> Generator 네트워크에서는 후보들을 생성하고, Discriminator 네트워크에서는 그들을 평가한다. Adversarial Loss는 (1) 예측 모델이 L2 손실의 한계를 극복하게 하고, (2) discriminator를 속일 만큼 좋은 행동(사회적 용인 가능한 경로, socially-accepted motion trajectories in crowed scenes)의 분포를 학습하게 한다.

저자들이 제시하는 GAN은 <span style="background-color: #fff5b1"><b>RNN Encoder-Decoder generator와 RNN 기반 encoder discriminator를 가지고 있다.</b></span> 모델에 관한 주요한 특징은 두 가지가 있다.

- <span style="background-color: #fff5b1"><b>Variety Loss</b></span>를 제시한다. 이는 GAN의 생성 네트워크(generator)로 하여금, 분포를 넓히고 가능한 경로들의 공간을 다룰 수 있게 한다.
- <span style="background-color: #fff5b1"><b>새로운 풀링 매커니즘</b></span>을 제안한다. 이는 장면 내 포함된 모든 사람들의 미묘한 cues까지도 복호화(encode)하는 global pooling vector를 학습한다.

위와 같이 설계한 모델을 <span style="background-color: #fff5b1"><b>Social GAN</b></span>이라고 명명했다.

---

# 2. Related Work

✂️ <b><u>사람의 행동을 예측하는 task의 분류</u></b>

사람의 행동을 예측하는 문제는 아래 두 가지를 배우는 것으로 나눌 수 있다.

- Human-Space Interactions: scene-specific 행동 패턴을 학습한다.
- <span style="background-color: #fff5b1"><b>Human-Human Interactions</b></span>: 어떻게 보행자가 다른 이들과 상호작용하는지 scenes의 동적 내용(dynamic content)을 모델링한다. 이 논문은 여기에 해당한다.

## Human-Human Interaction

사람의 행동은 두 가지 관점에서 연구되고 있다.

- macroscopic models: 군중의 관점에서
- microsocpic models: 개개인의 관점에서. 이 논문이 해당한다.

microsocpic 방식에 대한 몇몇 연구가 진행되었으나, 이들은 상대적 거리나 특정 규칙들 때문에 어느 정도의 인위적 작업이 꽤 필요하다. 반면 <span style="background-color: #fff5b1"><b>RNNs 기반의 data-driven 방식은 이전 연구들보다 더 나은 성능을 보이고 있다.</b></span>

## RNNs for Sequence Prediction

♻️ <b><u>RNN의 개념 및 단점</u></b>

Recurrent Neural Network(RNN)은 시퀀스를 생성할 때(sequence generation) 순전파(feedforward networks)를 확장한 동적 모델로, 음성인식이나 기계 번역, 이미지 캡셔닝 등에 사용되고 있다. 그러나 RNN은 high-level, spatio-temporal 구조가 부족하다.

😅 <b><u>복잡한 상호작용 예측에 모델 사용하기</u></b>

여러 개의 네트워크를 사용해 복잡한 상호작용을 예측하려는 연구들이 있었다. Alahi 등은 [1]에서 근방의 보행자들을 모델링하는 social pooling layer를 사용했다. 이 논문에서는 <span style="background-color: #fff5b1"><b>Multi-Layer Perceptron(MLP)와 max pooling을 사용하는 것이 연산 측면에서 더 효율적이고 social pooling 방식보다 작동을 잘 한다는 점을 밝힌다.</b></span>

Lee 등은 논문 ‘Desire: Distant future prediction in dynamic scenes with interacting agents(2017)’에서 RNN의 Encoder-Decoder 프레임워크를 사용했는데, 이들은 군중 내에서의 human-human interactions을 분석하는 모델은 아니었다.

## Generative Modeling

생성 모델(Genreative model)은 훈련 데이터의 가능도(우도, likelihood)의 하한(하계, lower bound)를 최대화하며 훈련된다. Goodfellow 등은 다른 방식으로 접근해 Generative Adversarial Network(GAN)을 제안했다 [2]. <span style="background-color: #fff5b1"><b>GAN은 생성 모델(generative model)과 판별 모델(discriminative model) 사이의 minimax game(🔗)으로 훈련을 한다.</b></span>

그러나 생성 모델을 자연어 처리와 같은 시퀀스 생성 문제에 적용하는 것은 더딘 편인데, 생성 결과를 discriminator에게 입력하기 위해 샘플링하는 것이 미분 불가능한(non-differentiable) 연산이기 때문이다.

---

# 3. Method

🚶 <b><u>사람의 경로 예측 방식과 모델링의 어려움</u></b>

사람은 본능적으로 주변인들을 파악하며 군중 내에서 이동(navigate)하는 법을 알고 있다. 갈 곳을 염두한 채로 그와 동시에 주변 사람들의 행동 방향과 속도 등을 고려한다. 그런 상황에서 가능한 선택지들은 여러 개가 발생할 수 있다.

따라서, 이러한 사람 간 상호작용을 고려할 뿐만 아니라 다양한 옵션들을 알아낼 수 있는 모델이 필요하다. 현재의 접근법들은 미래 경로에 대한 ground truth(GT)로부터의  L2거리를 최소화하는 평균 경로(average future trajectory)를 예측한다. 그러나 저자들은 <span style="background-color: #fff5b1"><b>평균 예측 경로가 아니라 ‘여러 개의 사회적으로 용인되는 경로들’을 예측하고자 한다.</b></span>

## 3.1. Problem Definition

- 목표: <span style="background-color: #fff5b1"><b>scene 내에 존재하는 모든 agents의 미래 경로를 결합적으로(jointly) 추론하고 예측하기</b></span>
- 입력(Input): 사람들의 모든 경로($\mathbf{X} = X_1, X_2, \cdots, X_n$)
    - $i$번째 사람의 입력 경로: $X_i = (x_i^t, y_i^t)$ → 시간은 $t = 1, \cdots, t_{obs}$ (obs = observed를 의미하는 듯하다.)
- 예측(Prediction): 모든 사람들의 경로를 동시적으로 예측($\mathbf{\hat{Y}} = \hat{Y}_1, \hat{Y}_2, \cdots, \hat{Y}_n$)
- 실제 미래 경로(GT): $Y_i = (x_i^t, y_i^t)$ → 시간은 $t = t_{obs} + 1, \cdots, t_{pred}$

## 3.2. Generative Adversarial Networks

GAN은 두 개의 신경망으로 구성되어 각각 적대적으로(adversarially) 훈련된다. 

- 생성 모델(generative model) G: 데이터 분포를 파악한다. 잠재 변수(latent variable)(🔗) $z$를 입력으로 받아, 샘플인 $G(z)$를 반환한다.
- 판별 모델(discriminative model) D: 훈련 데이터에서 어떠한 샘플이 나올 확률을 추정한다. 샘플 $x$를 입력으로 받아 그것이 진짜(real)일 확률 $D(x)$를 반환한다.

훈련 과정은 두 개의 플레이어가 min-max 게임을 하는 것과 비슷하며, 아래의 목적 함수(object functino)을 따른다.

$$
\min_G \max_{D} V(G, D) = \mathbb{E}_{x \sim p_{data}}[\log D(x)] + \mathbb{E}_{z \sim p_{(z)}}[\log (1-D(G(z)))]
$$

GAN은 $c$항을 추가하여 conditional model에도 쓰일 수 있다. 이 경우 $G(z, c)$와 $D(x, c)$의 결과를 내놓게 된다.

## 3.3. Socially-Aware GAN

🙋 <b><u>SGAN의 제안</u></b>

경로 예측은 multi-modal 문제에 해당한다. 생성 모델은 시계열 데이터에 사용되어 가능성 있는 미래들을 시뮬레이션할 수 있다. 이 점을 GAN을 이용하여 <span style="background-color: #fff5b1"><b>해당 문제의 multi-modality를 푸는 데 이용하는 SGAN을 제안했다.</b></span> 모델은 사진과 같다.

![image](https://user-images.githubusercontent.com/69252153/184533225-05f96f58-dea4-45c4-b999-d68150283915.png){: .align-center}

모델은 크게 세 가지 주요 요소로 구성되어 있다.

- <span style="background-color: #fff5b1"><b>Generator (G, 생성자)</b></span>: encoder-decoder 프레임워크 기반으로, PM을 통해 encoder와 decoder 간의 은닉 상태(hidden states)를 연결한다. 입력으로 $X_i$ 를 받아 출력으로 예측 경로인 $\hat{Y}_i$ 을 내보낸다.
- <span style="background-color: #fff5b1"><b>Pooling Module (PM, 풀링 모듈)</b></span>
- <span style="background-color: #fff5b1"><b>Discriminator (D, 구별자)</b></span>: 입력으로 전체 시퀀스(입력 경로 $X_i$ 와 예측 경로 $\hat{Y}_i$ )를 받고, 그들을 진짜와 가짜로 구분한다.

### Generator

🖌️ <b><u>Embedding, Encoder</u></b>

하나의 레이어로 이루어진 MLP를 사용하여  각 사람들의 위치를 임베드하여 고정된 길이의 벡터 $e_i^t$ 를 얻는다. 이 임베딩 결과들은 시점 t에서의 엔코더의 LSTM의 입력으로 사용된다. 여기서 아래와 같은 재귀(recurrence)가 나온다.  

$$
e_i^t = \phi (x_i^t,\ y_i^t;\ W_{ee}) \\
h_{ei}^t = LSTM(h_{ei}^{t-1},\ e_i^t;\ W_{encoder})
$$

위 식에서 함수 $\phi (\cdot)$ 는 비선형성 ReLU를 가진 임베딩 함수(embedding function)이다. $W_{ee}$는 임베딩 가중치이다. $W_{encoder}$는 LSTM 가중치로, 장면 내 모든 사람들 간에 공유되는 값이다.

🖌️ <b><u>Pooling Module</u></b>

각 인물 별로 하나의 LSTM을 사용하는 naïve한 방법은 사람 간의 상호작용을 파악하는 데 실패한다. Encoder는 한 사람의 상태를 학습하고, 지난 행동들(history of motion)을 저장한다. 그러나 여기서 필요한 것은 압축된 표현(compact representation)으로, 다른 encoders의 정보를 합쳐서(combine) 효과적으로 사회적 상호작용을 추론할 수 있는 표현이다. 

논문에서는 사람 간 상호작용을 Pooling Module(PM)을 통해 모델링한다. 관찰된 마지막 시점(입력의 끝) $t_{obs}$ 시점 이후에는 장면 내 모든 사람들의 은닉 상태를 pool하여 각 사람들의 pool된 행렬(pooled tensor) $P_i$를 얻는다.

🖌️ <b><u>Initialize Decoder state</u></b>

전통적으로, GAN은 입력 노이즈를 이용해 샘플을 만들어낸다. 이 논문에서의 목표는 과거와 일관된(consistent) 예측 시나리오를 만드는 것이므로, 출력 경로들의 생성에 decoder의 은닉 계층을 초기화하는 조건을 걸었다. 그 식은 아래와 같다.

$$
\begin{align*}
c_i^t &= \gamma (P_i,\ h_{ei}^t;\ W_c) \\
h_{di}^t &= [c_i^t,\ z]
\end{align*}
$$

위 식에서 $\gamma(\cdot)$ 함수는 ReLU가 있는 MLP이고, $W_c$는 임베딩 가중치이다.

저자들은 두 가지 측면에서 선행 연구들과 다른 선택을 했다.

- Alahi 등은 [1]에서 은닉 상태를 이용해 이변수 가우시안 분포(bivariate Gaussian distribution)의 파라미터를 예측한다. 그러나, 이 방식은 훈련 과정에서 미분 불가능한 샘플링 과정을 통한 역전파라는 점에서 어려움이 발생한다. 이를 피하기 위하여 이 논문의 저자들은 직접적으로 좌표 $(\hat{x}_i^t,\ \hat{y}_i^t)$ 를 추론한다.
- 사회적(social) 맥락(context)은 보통 LSTM의 입력으로 제공된다. 그 대신, 저자들은 pooled context를 한 번만 decoder의 입력으로 전달한다. 이로써 특정 시각에서의 어떤 pool을 선택할지 정할 수 있고, [1]의 S-LSTM보다 16배 빠른 속도를 보인다.

🖌️ <b><u>Predict(Decoder)</u></b>

 이렇게 decoder의 상태를 초기화한 뒤에는, 예측값을 아래와 같은 수식으로 얻는다.

$$
\begin{align*}
e_i^t &= \phi (x_i^{t-1},\ y_i^{t-1};\ W_{ed}) \\
P_i &= PM(d_{d1}^{t-1}, \cdots, h_{dn}^{t}) \\
h_{di}^t &= LSTM(\gamma (P_i,\ h_{di}^{t-1}),\ e_i^t;\ W_{encoder}) \\
(\hat{x}_i^t,\ \hat{y}_i^t) &= \gamma (h_{di}^t)
\end{align*}
$$

위 식에서 함수 $\phi (\cdot)$ 는 비선형성 ReLU를 가진 임베딩 함수(embedding function)이다. $W_{ed}$는 임베딩 가중치이다. $W_{decoder}$는 LSTM 가중치,  $\gamma$는 MLP이다.

### Descriminator

판별자는 encoder들로 이루어져있다. 판별자는 입력으로 $T_{real} = [X_i, Y_i]$ 나 $T_{fake} = [X_i, \hat{Y}_i]$ 를 받아, 그들을 진짜와 가짜로 구분한다. 저자들은 MLP를 encoder의 마지막 은닉 상태에 적용해 분류 점수(classification score)를 얻는다. 이상적으로, 판별자는 미세한 사회적 상호작용 규범들을 학습하고, 사회적으로 용인되지 않는 경로들을 ‘가짜’로 분류한다.

### Losses

Adversarial Loss와 더불어 저자들은 L2 loss를 예측된 경로에 적용했다. L2 loss는 실제 GT와 생성된 샘플이 얼마나 차이가 나는지 측정한다.

## 3.4. Pooling Module

🏃 <b><u>다수의 사람들에 대한 추론의 어려움</u></b>

여러 사람들에 대해 결합적으로(jointly) 추론을 진행하기 위하여, LSTMs에 정보를 공유하는 매커니즘이 필요하다. 그러나 몇 가지 어려움이 존재한다.

- 한 장면 내에 다양하고 많은 수의 사람들이 존재한다. 그 모든 사람들의 정보를 결합하는 단순한 표현이 필요하다.
- 사람 간 상호작용이 흩어져있다(scattered). 지역적 정보(local information)은 항상 충분하지는 않다. 멀리 떨어져 있는 보행자들도 서로 영향을 준다. 그러므로, 네트워크는 전역적인(global) 형태(구성, configuration)도 모델링할 수 있어야 한다.

🤷 <b><u>Social Pooling과 제안 방식의 차이</u></b>

[1]의 social pooling은 위의 첫 번째 문제를 격자 방식(grid base)의 풀링 방식으로 해결하려 했다. 그러나 이 수작업의 방식은 느리고 전역적 맥락을 파악하기 어렵다. [37]에서 Qi 등은 상기 속성들은 입력된 포인트들에 대한 변형된 요소들(transformed elements)에 대한 학습된 대칭 함수(symmetric fucntion)를 적용함으로서 해결될 수 있다고 했다. 

이는 입력 좌표들을 MLP와 대칭함수를 넘겨줌으로써 구현할 수 있다. 본 논문에서는 대칭함수로 Max-Pooling을 사용했다. Pooled vector인 $P_i$ 는 한 사람이 의사결정을 하기 위한 모든 정보가 요약되어야 한다. 따라서 저자들은 <span style="background-color: #fff5b1"><b>상대 좌표(relative coordinates)를 사용해</b></span> 병진 대칭(translation invariance)을 한다. 병진 대칭은 한 사람 $i$에 대한 각 사람들의 상대적 위치에 대해 입력을 풀링 모듈에 증강(augment)한다.

> 사실 대칭 함수나 병진 대칭에 대한 내용은 이해를 하지 못했다. 추후 더 공부해봐야겠다.
> 

아래 그림을 보자. 빨간 사람에 대하여, 빨간 점선은 논문에서 제안한 풀링 매커니즘이고, 빨간 실선은 Social Pooling이다. 논문의 방식으로는 빨간 사람과 다른 이들 간의 상대적 위치를 계산한다. 이 위치들은 각 사람들의 은닉 상태를 concatenate하고, MLP로 독립적으로 처리한 뒤, 빨간 사람의 풀링 벡터인 $P_1$을 계산하기 위해 요소별로(elementwise)로 풀링한다. 반면 <span style="background-color: #fff5b1"><b>Social Pooling은 그리드 안의 사람들만 고려하고, 모든 사람들과의 상호작용을 모델링하지 못한다.</b></span>

![image](https://user-images.githubusercontent.com/69252153/184533231-7618a2cf-5bdd-46d1-8283-6cf995bab184.png){: .align-center}

## 3.5. Encouraging Diverse Sample Generation

😕 <b><u>기존의 경로 예측법의 문제</u></b>

경로 예측은 매우 어려운 작업인데, 한정된 과거 기록(history)에 대해 모델은 다수의 가능한 출력들을 추론해야 하기 때문이다. 지금까지의 방법들은 좋은 예측을 내놓았었으나, 이러한 예측들은 여러 개의 출력을 낼 수 있는 케이스에서도 ‘평균적인’ 예측을 만든다. 저자들은 이런 출력들이 노이즈가 있는 변화에 민감하지 못하고 매우 비슷한 예측을 내놓는다고 꼬집었다.

😁 <b><u>새로운 Loss의 제안</u></b>

저자들은 네트워크가 <span style="background-color: #fff5b1"><b>다양한 샘플을 만들기 위한 ‘Variety Loss function’을 제안했다.</b></span> 각 장면에 대해, $\mathcal{N} (0, 1)$ 을 따르는 샘플 $z$ 를 랜덤으로 샘플링하여 $k$ 개의 가능한 예측값을 생성하고, 예측에 대해 L2의 방식(아래 식)을 이용해 최선의 예측을 고른다. 아래 식에서 $k$는 하이퍼 파라미터이다.

$$
\mathcal{L}_{variety} = \min_k \lVert Y_i - \hat{Y}_i^{(k)} \rVert_2
$$

오직 하나의 가장 좋은 경로만을 고려할 때, 위 손실은 네트워크로 하여금 위험을 방지하고 과거 경로를 따르는 출력 공간을 포함하게 한다. 위 손실은 구조적으로 Minimum over N(MoN) loss와 비슷하나, 생성된 샘플의 다양성을 증대시키는데 GAN의 맥락에서 사용된 바는 없다.

즉, 이 논문에 사용된 Loss들은 세 가지이다.

- Adversarial loss: 전형적 GAN 손실로, 진짜와 가짜 경로를 구별하는 데 쓰인다.
- L2 loss: GT 경로와 예측 경로 간 거리를 구하며, 실제 경로와 샘플링된 것이 얼마나 먼지 측정한다.
- Variety loss: 여러 개의 서로 다른 경로를 만드는 데 도움을 준다. L2 값이 최소인 가장 좋은 경로를 선택하게 한다.

## 3.6. Implementation Details

저자들은 모델의 <span style="background-color: #fff5b1"><b>RNN으로서 endoder와 decoder 둘 다 LSTM을 사용했다.</b></span> 은닉 상태의 차원은 encoder에서 16개이고, decoder에서는 32개이다. 입력 좌표들을 16차원의 벡터로 임베드했다. 생성자와 판별자를 반복적으로 학습시킬 때, 초기 학습률 0.001의 Adam을 사용했으며, 배치사이즈는 64, 200 epochs을 돌렸다.

---

# 4. Experiments

🗃️ <b><u>데이터셋과 평가</u></b>

저자들은 공개된 데이터셋인 ETH와 UCY를 이용해 제안 방식을 평가한다. 이 데이터셋들은 사람 간의 상호작용 시나리오들이 많은 실제 경로들로 이루어져있다. 매 0.4초마다 값을 얻기 위하여 이 데이터를 전부 실제 좌표로 바꾸고 보간한다(interpolate). 전체적으로는 ETH 2개, UCY 3개인 5개의 데이터셋으로 이루어져있고, 이들은 1536명의 보행자들이 군중 속에 있는 4개의 서로 다른 장면이 있다. 여기엔 어려운 시나리오들이 있는데, 그 예로 <span style="background-color: #fff5b1"><b>단체 행동(group behavior), 서로를 교차하는 행동, 충돌 회피, 단체 형성(forming)과 흩어짐(dispersing)이 있다.</b></span>

🧮 <b><u>Evaluation Metrics</u></b>

- <span style="background-color: #fff5b1"><b>Average Displacement Error (ADE)</b></span>: 모든 예측된 시간에 대해 GT와 예측 간 L2 거리를 평균한다.
- <span style="background-color: #fff5b1"><b>Final Displacement Error (FDE)</b></span>: 예측 시간(period) $T_{pred}$ 의 마지막에서 실제 목적지와 예측된 최종 목적지 간의 거리 차이이다.

🚩 <b><u>Baselines</u></b>

3가지 기준 모델(baselines)(🔗)에 대해 비교를 진행했다.

- Linear: 선형 파라미터(linear parameters)를 예측함으로써 최소제곱오차(least square error)를 최소화하는 선형 회귀(linear regressor)이다.
- LSTM: 풀링을 사용하지 않는 단순한 LSTM
- S-LSTM: [1]에서 제안한 방식으로, 각 사람은 각 시점에 social pooling 레이어로 풀링되는 은닉 상태들로 이루어진 LSTM을 통해 모델링된다.

또한 서로 다른 control setting으로 ablation study도 진행했다. 논문의 방식을 <span style="background-color: #fff5b1"><b>SGAN-$k$VP-$N$</b></span>으로 정의하는데, 여기서 $k$V 는 $k$의 variety loss를 사용해 훈련했음을 의미하고 P는 여기서 제안한 풀링 모듈을 사용했는지를 나타낸다. 테스트에서 모델로부터 여러 개의 시점을 샘플링하고, 정량 평가(quantitative evaluation)를 통한 L2 방식으로 최선의 예측값을 선택한다. $N$은 테스트 중 모델에서 샘플링된 시점 번호를 말한다.

📊 <b><u>평가 방법론</u></b>

[1]과 비슷한 방법론을 채택하며, leave-one-out 접근법을 사용해 4개의 훈련 세트로 훈련하고 남은 데이터셋에 대해 테스트를 한다. <span style="background-color: #fff5b1"><b>8개 시점(3.2초)마다 경로를 예측하고 8개 혹은 12개(4.8초) 시점마다 예측 결과를 보여준다.</b></span>

## 4.1. 정량 평가

다른 기준 모델과 ADE, FDE로 현 모델을 평가한 결과는 표와 같다. $t_{pred}$=8 와 $t_{pred}$=12를 각각 평가했으며, 적을 수록 좋은 성능을 보인다는 뜻이다. <span style="background-color: #fff5b1"><b>SGAN 모델이 최신 S-LSTM보다 좋은 성능을 보이며, 특히 긴 시간(long term)에 대해 좋은 예측 결과를 보였다.</b></span>

Linear model은 직선 경로만 예측 가능했으며, 긴 시간의 예측에서는 특히 나쁜 결과를 보였다.

LSTM과 S-LSTM은 linear model 보다 나은 성능을 보였으며, 복잡한 경로도 모델링할 수 있었다. 그러나 이번 실험에서 S-LSTM은 LSTM보다 좋은 성능을 보이진 못했다. [1]에서는 합성(synthetic) 데이터에 모델을 훈련시키고 실제 데이터에 fine tuning 시켰다. 그러나 여기서는 훈련에 합성 데이터를 사용하지 않아 다소 낮은 수행 결과를 보였다.

SGAN-1V-1(variety loss 쓰지 않음 & 풀링을 사용하지 않음 & 1 time step)은 LSTM 보다 성능이 낮았는데, 각 예측된 샘플이 그 어떤 다수의 미래 경로든 될 수 있기 때문이다. 모델이 생성한 조건적 출력(conditional output)은 타당한 미래 예측 중 하나를 나타내며, 이는 GT와 다를 수도 있다.

다수의 샘플을 고려한다면, SGAN 모델은 다른 기준 방식들보다 우수한데, 문제의 multi-modal 속성을 반영하기 때문이다. 

GAN은 mode collapse(🔗) 문제가 있는데, 이는 생성자가 판별자가 높은 확률을 할당하게 하는 몇 개의 샘플들만 생성하는 것이다. <span style="background-color: #fff5b1"><b>SGAN-1V-1이 생성한 샘플들은 모든 가능한 시나리오들을 포착하지 못하는 반면, SGAN-20V-20은 variety loss가 네트워크를 다양항 샘플들을 생성하게 하며 다른 모델들에 비해 굉장히 높은 성능을 보였다.</b></span>

여기서 제안한 풀링 레이어를 사용한 full 모델은 약간의 성능 저하를 보였으나, <span style="background-color: #fff5b1"><b>풀링층은 모델이 더 사회적으로 그럴듯한 경로를 만들게 한다.</b></span>

🚀 <b><u>Speed</u></b>

보행자의 행동을 정확하게 예측해야 하는 자율주행과 같은 실상황에서는 속도가 매우 중요하다.

단순한 LSTM은 속도는 가장 빨랐으나, 충돌을 피하지 못하거나 multi-modal한 정확한 예측을 하진 못했다.

SGAN 모델은 S-LSTM보다 16배 빨랐다. 이런 속도의 향상은 각 시점마다 풀링을 적용하지 않았기 때문이었다. S-LSTM은 각 보행자들의 점유 그리드(occupancy grid)를 계산해야 하는 반면, 여기서의 풀링 매커니즘은 단순한 MLP와 max pooling을 쓰기 때문이기도 하다. 실세계 적용 시에 같은 시간에 S-LSTM이 한 개의 예측을 할 때 SGAN가 20개의 샘플을 생성했다.

🌈 <b><u>다양성의 효과(Effect of Diversity) 검증</u></b>

Variety loss를 쓰지 않고 모델에서 많은 샘플들을 만들어내면 어떻게 될지 실험해본다. SGAN-1V-N과 SGAN-NV-N을 비교했을 때 그 결과는 아래 그래프에서 볼 수 있다.

![image](https://user-images.githubusercontent.com/69252153/184533253-805f2445-f627-4c7d-aa25-1d2e3e573e90.png)

단순히 많은 샘플을 뽑는다고 해서 variety loss를 사용하지 않는 모델이 더 좋은 성능을 보이지는 않는다는 것을 알 수 있다. 대신, <span style="background-color: #fff5b1"><b>$k$를 증가시킬수록 모델이 훨씬 더 좋은 성능을 보였으며</b></span>, $k$=100일 때는 33% 더 좋았다.

## 4.2. 정성 평가

다수 agent가 있는 시나리오에서는, 한 사람의 행동이 다른 사람들의 행동들에 어떻게 영향을 미칠지 모델링하는 것이 매우 중요하다.

활동 예측과 사람의 경로 예측에 대한 기존의 방식은 수작업의 인위적 방식을 써야했고 복잡한 상호작용을 모델링하지 못했다. 이에 반해, <span style="background-color: #fff5b1"><b>저자들은 순수하게 data-driven 방식을 사용하여 사람 간 상호작용을 새 풀링 매커니즘을 통해 모델링한다.</b></span>

정성 평가의 측면에서 살펴볼 것은 두 가지이다.

- 풀링 레이어의 효과를 검증하기
- 3가지 사회적 상호작용 시나리오에 대하여 네트워크에서 만들어진 예측을 분석하기

SGAN 모델이 한 장면 내 모든 사람들에 대한 결합적(joint) 예측을 하긴 하지만, 여기서는 단순함을 위하여 부분적(subset)으로 예측 결과를 보였다. 20개 time step에 대하여 $k$=20으로 설정하고, 풀링을 사용하는 모델은 SGAN-P로, 사용하지 않은 모델은 SGAN으로 표기한다. 

### 4.2.1. Pooling Vs No-Pooling

정량 평가에서는 풀링을 사용하지 않았을 때 조금 더 좋은 성능을 보였다. 그러나 정성적인 측면에서 보자면 <span style="background-color: #fff5b1"><b>풀링은 global coherency를 강화하고 사회 규범을 따르도록 한다.</b></span> 4개의 시나리오에 대해 이를 검증해본다. 각 설정에서 300개의 샘플을 만들고 평균적 경로 예측을 따라 경로의 근사적 분포(approximate distribution)를 나타냈다.

![image](https://user-images.githubusercontent.com/69252153/184533262-bdec56b2-d3e4-486f-91b7-08b5d630896d.png){: .align-center}

시나리오 1과 2에선 방향 전환을 통한 충돌 회피 능력을 시험한다. 두 명의 사람이 같은 방향을 향하고 있을 때, 풀링은 모델이 오른쪽으로 통행 우선권을 양보하는 방향으로 사회적으로 허용 가능한 경로를 예측하게 한다. 그러나 SGAN은 충돌하는 예측을 하는 반면, 시나리오 2에서 SGAN-P는 그룹 행동을 모델링할 수 있고, 두 사람이 같이 걷고 있다는 개념을 인지하면서 회피를 예측할 수 있다.

시나리오 3은 한 사람(G)이 다른 사람(B)의 뒤에서 더 빠르게 걷고 있는 상황이다. 사람은 충돌을 방지하려 걸음 속도를 조절하는 경향이 있다. 모델에서는 G가 B를 추월하는 예측을 하는데, SGAN에서는 사회적으로 허용 가능한 예측을 하지 못했다. 시나리오 4에서 모델이 B가 속도를 늦춰 G에게 양보한다는 예측을 한다.

### 4.2.2. Pooling in Action

충돌을 회피하기 위하여 코스를 변경하는 3가지 시나리오를 고려해본다.

![image](https://user-images.githubusercontent.com/69252153/184533264-1cd78500-7e6c-4d18-b3b7-149d8350aa07.png){: .align-center}

👣 <b><u>People Merging (1열)</u></b>

복도나 길에서 서로 다른 방향에서 오는 사람들끼리 합쳐져 동일한 목적지로 가는 경우가 있다. 한 사람이 속도를 늦추거나, 약간 코스를 바꾸거나, 그 둘을 합쳐 사용하는 등이다.

이 모델은 사람의 속도와 방향 모두에 대해 다양한 예측을 할 수 있어, 효과적으로 길을 찾아나간다. 특히 1행의 4열을 보면 전역적으로 일관적 예측을 함을 알 수도 있다.

👣 <b><u>Group Avoiding (2열)</u></b>

서로 다른 방향으로 움직이는 사람들이 서로를 피하는 상황이다. 이 모델에서는 사람들이 그룹으로 움직이고 있음을 인지하고, 그룹의 행동을 모델링한다. 열 3, 4를 보면 모델은 충돌을 회피하는 방향으로 각 그룹의 방향의 전환을 예측한다.

👣 <b><u>Person Following (3열)</u></b>

사람이 다른 사람 뒤를 따라가는 상황이다. 지금의 속도를 유지하거나, 앞선 사람을 추월할 수도 있다. 현실에서는 각자의 시야(field of fiew)에 제한되어 의사 결정을 할 수밖에 없으나, 이 모델은 풀링의 단계에서 장면에 포함된 모든 사람들의 GT 위치에 접근할 수 있다.

## 4.3. Structure in Latent Space

잠재 공간(latent space)(🔗) $z$의 주변환경(landscape)을 이해하는지 실험한다. 학습된 다양성(manifold) 속 통행은 다양한 샘플을 어떻게 생성할 수 있을지에 대한 직관을 제공한다. 이상적으로, 네트워크는 잠재 공간에서 어떠한 몇몇 구조를 부과한다. 잠재 공간에서 특정 방향은 방향과 속도와 관련되어 있음을 발견하였다. 

![image](https://user-images.githubusercontent.com/69252153/184533275-58746fd9-e937-4495-86ec-3f03fdee3b98.png){: .align-center}

위 그림에서 보면, latent manifold에서 특정 방향은 방향에 관련이 있고(좌측 그림) 속도에도 관련이 있다(우측 그림). 같은 과거이지만 입력 $z$은 다양한 관측은 모델이 평균에 대하여 왼쪽/오른쪽 혹은 빠르게/느리게 가는 경로를 예측하도록 한다.

---

# 5. Conclusion

💡 <b><u>연구의 목적</u></b>: 사람 간 상호작용을 모델링하고 한 장면 내 모든 사람들의 경로를 결합적으로 예측하고자 했다.

🗝️ <b><u>제안 사항</u></b>

- 경로를 예측하는 GAN 기반의 encoder-decoder 프레임워크를 제안하여 미래 예측 문제의 multi-modality를 포착하도록 했다.
- 새로운 풀링 매커니즘을 도입해 네트워크가 오직 데이터만 사용하여(purely data-driven) 사회적 규범을 학습하도록 했다.
- 예측 샘플의 다양성을 높이기 위해 풀링 레이어가 결합된 간단한 variety loss를 제안하였다. 이는 네트워크가 전역적으로 일관적이고(coherent) 사회적으로 용인할 만한 다양한 샘플을 만들게 한다.

---

# Further Study

💡 논문을 읽으며 알지 못했던 개념들을 추가 조사한 내용이다.
{: .notice--info}

⭐ <b><u>Sequence Prediction</u></b>

머신러닝 작업 중 하나로, 이전의 관측된 심볼(숫자, 단어, 사건, 객체 등)의 시퀀스를 기반으로 다음 심볼을 예측하는 문제이다. 예측을 하고 모델 훈련 시 반드시 데이터의 순서를 유지시켜야 한다.

다음 값을 예측하거나(시계열 예측, 상품 추천 등), 클래스 레이블을 예측하거나(텍스트 범주화, 이상치 탐지, 게놈 연구 등), 순서를 예측하는(seq2seq 처럼 한 시퀀스를 보고 다른 시퀀스를 예측. 기계 번역, 이미지 캡션 생성 등)의 예시가 있다.

⭐ <b><u>GAN</u></b>

생성 모델(generative model)은 실존하지는 않으나 그럴 듯한 이미지를 생성하는 모델로, 원래 이미지의 분포를 잘 모델링 할수록 좋은 모델이다. 그 대표적 예가 GAN이다.

Generative Adversarial Networks의 약어인 GAN은 생성자(Generator, G)와 판별자(Discriminator, D) 두 개의 네트워크로 구성되어 있으며, G는 최소화하고 D는 최대화하는 방향으로 학습을 한다. 즉, 생성자는 그럴 듯하게 만들어내고, 판별자는 진짜와 가짜를 구별하지 못하게 한다.

⭐ <b><u>Trajectory vs Path</u></b>

Path는 단순한 경로를, trajectory는 속도나 시간을 포함한 경로 혹은 그 경로를 함수 등으로 표현한 것을 말한다. 

⭐ <b><u>Minimax Game</u></b>

최악(max)을 가정했을 때 손실을 최소화(min)하는 것을 말한다. GAN 최악의 상황은 판별자가 아주 잘 학습되어 진짜와 가짜를 잘 구분하는 것이고, 최고의 상황은 생성자가 아주 잘 학습되어 완벽한 가짜를 만들 수 있는 것이다. GAN에서는 판별자가 진짜와 가짜를 정확하게 예측할 확률을 높이는 동시에 생성자가 만든 샘플이 판별자를 헷갈리도록 학습시킨다. 

GAN의 논문에서 Loss 식을 살펴보면

$$
\min_G \max_{D} V(G, D) = \mathbb{E}_{x \sim p_{data}}[\log D(x)] + \mathbb{E}_{z \sim p_{(z)}}[\log (1-D(G(z)))]
$$

판별자가 잘 판별하는 경우를 1라 하면, 우변의 첫 항은 판별자가 실제 입력 데이터에 대해 진위를 잘 판단하도록 maximize 시킨다. 두 번째 항은 생성자가 만들어낸 샘플을 판별자에게 판별하라고 시켰을 때 판별자가 헷갈리게, 즉 가짜에도 1을 내놓도록 하여 1-D 값을 minimize 한다. 그렇기 때문에 minimax game이다.

![image](https://user-images.githubusercontent.com/69252153/184533282-0e36a50b-402d-48e5-917b-e8c1df8c7ae1.png){: .align-center}

⭐ <b><u>Latent Variable</u></b>

번역하자면 ‘잠재 변수’로, 직접적으로 관찰되거나 측정 되지 않는 변수를 말한다. 따라서 관측할 수 있는 변수(observed variable)을 사용해 간접적으로 측정하거나 모델링해야 한다. latent variable은 데이터의 차원을 줄일 수 있는 이점이 있어, 많은 관측 가능 변수를 모델에 통합해 데이터의 이해를 돕는다.

⭐ <b><u>Baseline (model)</u></b>

주로 모델의 성능을 비교할 때 기준으로 삼을 모델을 말한다.

⭐ <b><u>Multi-modal과 Mode Collapse</u></b>

GAN의 문제점이 몇 가지 있다.

- 판별자를 신뢰할 수 없음: Minimax Game은 최대 손실의 상황에서 손실을 최소화하는 것으로, GAN에서의 최악의 상황은 판별자가 실제 데이터의 분포를 완벽히 학습하는 것이다. 그러나 학습이 종료되기 전까지는 판별자가 완벽해지지 않기에 GAN의 매커니즘에 모순이 생기고, 모델의 수렴이나 진동의 위험이 있다.
- 진동: GAN에서 판별자와 생성자를 번갈아 학습시키는데, 서로의 학습이 서로를 상쇄하는, 즉 서로가 서로를 속이며 양쪽이 모두 전역해로 수렴하지 못하는 진동(oscillation)이 발생할 수도 있다.
- mode collapse: 생성자가 하나의 샘플만 생성하는 현상이다. 앞선 GAN의 문제들(판별자가 완벽하지 않거나, 모델이 진동)이 복합적으로 작용해 나타난다.

Mode는 통계학에서 ‘최빈값’을 일컬으며, 데이터의 확률밀도함수에서 밀도가 가장 높은 부분(가장 높은 봉우리)를 가리킨다. Multi-modal 분포는 mode가 여러 개인 분포로, MNIST 데이터셋으로 친다면 0~9까지 10개가 mode이다. Mode collapse 문제는 이러한 multi-modal 상황에서 많이 발생한다.

생성자는 랜덤한 노이즈의 확률 분포로부터 데이터의 확률분포로 샘플링을 하는데($G(z)$), mode collapse는  생성자가 여러 mode 중 하나로만 치우쳐 변환하는 현상이다. MNIST로 치자면 하나의 숫자, 예를 들면 1만 생성하는 것이다.

생성자의 경우 어떤 모드로 샘플링하든 판별자만 속이면 되고, 판별자는 진위 판단만 하면 되기 때문에 개별적 입장에서는 문제가 없어 보인다. 그러나 실제로는 생성자가 결국 학습 데이터 전체의 분포가 아닌 그 일부만 학습할 밖에 없다.

⭐ <b><u>Latent Space</u></b>

번역하자면 ‘잠재 공간’이다. GAN에서 생성자가 입력으로 받는 랜덤 벡터 $z$가 존재하는 공간이다. $z$는 데이터 분포에서 무작위로 추출된 값으로, 생성자는 이를 생성하려는 대상의 복잡한 분포로 mapping한다. 잠재 공간은 나타낼 대상의 정보를 담을 수 있을만큼 충분히 크기가 큰 것이 좋다.

---

# References

## Original Paper

***[Agrim Gupta, Justin Johnson, Li Fei-Fei, Silvio Savarese, Alexandre Alahi](https://openaccess.thecvf.com/content_cvpr_2018/html/Gupta_Social_GAN_Socially_CVPR_2018_paper.html)***; Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (CVPR), 2018, pp. 2255-2264

## References in the Paper

[1] ***[Alexandre Alahi, Kratarth Goel, Vignesh Ramanathan, Alexandre Robicquet, Li Fei-Fei, Silvio Savarese](https://openaccess.thecvf.com/content_cvpr_2016/html/Alahi_Social_LSTM_Human_CVPR_2016_paper.html)***; Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (CVPR), 2016, pp. 961-971

## Further Study

- Sequence Prediction: **[3 Types of Sequence Prediction Problems](https://jinglescode.github.io/2020/05/21/three-types-sequence-prediction-problems/)**
- GAN
    - **[GAN: Generative Adversarial Networks (꼼꼼한 딥러닝 논문 리뷰와 코드 실습)](https://www.youtube.com/watch?v=AVvlDmhHgC4&list=PLRx0vPvlEmdADpce8aoBhNnDaaHQN1Typ&index=10)**
    - [**Generative Adversarial Networks (논문 원문)**](https://arxiv.org/abs/1406.2661)
- Path vs Trajectory: [**Path, Trajectory 그리고 Motion Planning**](https://blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=nswve&logNo=221573703005)
- Minimax Game: **[속고 속이는 게임 - Minimax Game](https://learnai.tistory.com/1)**
- Latent Variable: **[[ML] Latent Factor(Variable) 에 대하여](https://velog.io/@soyoun9798/ML-Latent-FactorVariable-%EC%97%90-%EB%8C%80%ED%95%98%EC%97%AC)**
- Baseline (model): [**딥러닝에서 바닐라 모델(Vanilla Model)과 베이스라인 모델(Baseline Model) [설명/요약/정리]**](https://lv99.tistory.com/30)
- Multi-modal과 Mode Collapse: **[[GAN] GAN이 풀어야 할 과제들](http://dl-ai.blogspot.com/2017/08/gan-problems.html)**
- Latent space: **[쉽게 씌어진 GAN](https://dreamgonfly.github.io/blog/gan-explained/)**