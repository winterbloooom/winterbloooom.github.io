---
title:  "[Paper Review] M2I: From Factored Marginal Trajectory Prediction to Interactive Prediction"
excerpt: "M2I 모델 논문 리뷰"

categories:
  - Prediction
tags:
  - Papaer Review
  - Machine Learning
  - Deep Learning
  - Prediction
  - Autonomous Driving
last_modified_at: 2022-08-04

use_math: true
toc: true
tock_sticky: true
toc_label: "Contents"
---

단어 뒤 🔍 아이콘은 [Further Study](#further-study)(개념 추가 조사) 부분에 레퍼런스 링크를 추가해 두었다.
{: .notice--info}

# Abstract
현재 존재하는 모델(model)들은 행위자(agent)가 각각에 대해(single) 주변(marginal) 경로(trajectory)를 잘 예측하고 있으나, 다수의 행위자에 대한 ‘장면 기반 경로’(scene compliant trajectories)를 함께 예측하는(jointly predict) 것은 여전히 해결해야 할 문제이다.

> 제목에도 나와있듯이 ‘marginal’은 논문에서 매우 자주 쓰이고 중요한 단어이다. ‘margin’은 ‘여유’, ‘가장자리’, ‘주변부’라는 뜻이 있으며, ‘marginal’은 ‘주변적인’이라는 뜻이 있다. 밑에서 다시 짚어보겠지만, 주변 확률(‘marginal probability’)를 도입해 경로를 예측하는 논문의 내용으로 미루어 보아, ‘margin’을 ‘주변 확률로 구한 무언가’에 붙인다고 추측할 수 있다.

> 논문의 키워드 중 하나는 ‘<span style="background-color: #fff5b1"><b>scene compliant trajectory</b></span>’ 이다. 필자가 해석한 바로는 ‘scene’은 ‘장면’이라는 단어 뜻처럼, 말 그대로 그때그때의 주변 환경을 말한다. ‘compliant’는 사전적으로는 ‘순응하는’, ‘따르는’이라는 의미가 있다. 따라서 특정 시점에서의 장면에 ‘따르는’ 혹은 ‘기반하는’ 이라고 해석했다. 그러므로 ‘scene compliant trajectory’를 ‘장면 기반 경로’라고 번역했다.

> 또 다른 키워드는 ‘<span style="background-color: #fff5b1"><b>jointly predict</b></span>’ 등 ‘jointly’가 나온다. ‘jointly’는 사전적으로 ‘합동해서’, ‘공동으로’라는 의미가 있고, 해당 논문의 주요 개념 중 하나가 ‘두 agents을 모두 고려해 경로를 생성한다’는 점을 미루어 보아, ‘jointly’는 ‘함께 고려한’ 혹은 ‘동시에 따져’라는 의미를 내포한다고 본다.

해당 논문에서는 <span style="background-color: #fff5b1"><b>도로에서 상호작용(interacting)하는 agents의 관계를 분석하고, 결합 예측을 하는 문제(joint prediction problem)를 주변 예측(marginal prediction)을 하는 문제로 분리한다.</b></span>

여기서 제시하는 방법의 이름은 <span style="background-color: #fff5b1"><b>M2I</b></span>이고, 이 접근 방식은 아래와 같은 특징을 갖는다.

1. <span style="background-color: #fff5b1"><b>상호작용하는 agents을 유도자(influencers)와 반응자(reactors)의 쌍으로 분류한다.</b></span>
2. <span style="background-color: #fff5b1"><b>주변 예측 모델(marginal prediction model)과 조건부 예측 모델(conditional prediction model)을 이용해 influencer와 reactor로 분류가 된 각 agents에 대해 경로를 예측한다.</b></span>
3. 조합 가능도(joint likelihoods(🔍))를 바탕으로 위에서 구한 예측들을 결합하고 선별한다.

이 접근 방식은 <span style="background-color: #fff5b1"><b>Waymo Open Motion Dataset</b></span>의 상호작용 예측(interactive prediction) 벤치마크를 사용해 평가했을 때 우수한 성능을 보였다.

- - -

# 1. Introduction

## 기존 방식들의 문제점

자율주행에서 경로 예측은 주변 agents의 미래 움직임을 예측하고 발생할 수 있는 위험한 상황(scenario)을 찾아내 안전하게 주행하도록 한다. 최근에는 실제 주행 사례들을 학습해 정확한 경로를 예측하는 많은 기법들이 나오기 시작했다. 

그러나 이 방법들은 개별적인 agents에 대해서만 경로의 marginal 예측 샘플을 만들고, agents의 미래 상호작용에 대한 예측은 하지 않는다. 이렇게 되면 다수의 agents의 예측 샘플들은 서로 경로가 겹치거나(overlap) 최적이 아닌(sub-optimal) 성능을 보인다.

아래 사진은 기존의 marginal 예측기의 joint 예측을 나타냈다. <span style="background-color: #fff5b1"><b>상호작용을 고려하지 않아 충돌(collide)하거나, 비현실적인(unrealistic) 예측 결과를 내놓는 등 scene inconsistent한 경로 예측을 한다.</b></span>

![image](https://user-images.githubusercontent.com/69252153/184533557-6411a06f-6e05-4103-83ca-49fa03ff44bd.png){: .align-center}

반면 <span style="background-color: #fff5b1"><b>이 논문에서는 서로 상호작용하는  agents를 둘로 나눠 marginal 예측기에서 예측 샘플들을 각각 만든다.</b></span> 아래 사진은 M2I를 사용한 joint 예측 결과로, <span style="background-color: #fff5b1"><b>scene compliant 경로를 예측함으로써 influencer-reactor 쌍을 만들고 influencer의 marginal 경로를 예측한 뒤 이에 따라 reactor의 reactive 경로를 예측한다.</b></span> 기존 방법보다 더 나은 정확도를 보이는 것이다.

![image](https://user-images.githubusercontent.com/69252153/184533611-b90c6476-8803-4ac2-b3c8-8acf404134aa.png){: .align-center}

## Multiple Agent의 경우에서 문제점

scene compliant 경로를 생성하기 위해서는 joint 예측기가 다수의 agents가 있는 joint 공간에서 경로를 예측해야 하는데, agents의 수가 증가함에 따라 연산 공간은 기하급수적으로 증가한다. 이에 대응하기 위해 충돌하는 경우들을 제거(pruning)하는 marginal 예측 샘플의 후처리(post-process) 과정을 도입할 수 있으나, 이러한 ad-hoc(애드혹, 특정한 문제 해결을 위해) 방식은 미래의 agent의 상호작용을 고려하지 않거나 휴리스틱에 의해 제거될 수 없는 다른 충돌을 무시할 수도 있다. 충돌하지 않을 상황임에도 불구하고 상대 차와 거리를 유지하기 위해 속도를 늦추는 등의 상황이 그 예가 된다.

## M2I의 작동 과정

해당 논문에서 제시하는 <span style="background-color: #fff5b1"><b>M2I는 marinal 경로 예측과 conditional 경로 예측을 둘 다 이용해 다수의 agent의 scene compliant 경로를 예측한다. 이 과정에서 주변 분포(marginal distribution)과 조건부 분포(conditional distribution)의 곱(product)로 joint distribution을 구한다.</b></span>

이 분해(factorization)은 <span style="background-color: #fff5b1"><b>influencer과 reactor라는 두 타입의 agent를 가정한다.</b></span>

- <span style="background-color: #fff5b1"><b>influencer</b></span>: 다른 agent를 고려하지 않으며 독립적(independent)한 행동을 한다. influencer의 예측 샘플을 생성할 때는 standard marginal predictor을 사용한다.
- <span style="background-color: #fff5b1"><b>reactor</b></span>: influencer의 동작에 대해 반응(reactor)한다. reactor의 예측 샘플을 생성할 때는, influencer의 미래 경로에 따라(conditioned) 조건부 예측(conditioner predictor)을 한다.

<span style="background-color: #fff5b1"><b>휴리스틱(huristic)에 기반해 influencer-reactor 관계를 미리 라벨링하고(pre-label),  추론(inference) 시에는 관계 예측기(relation predictor)가 이러한 상호작용 관계를 분류하도록 한다.</b></span>

## M2I의 이점

M2I를 사용함으로써 아래와 같은 이점을 얻을 수 있다고 한다.

- 정확하고 scene compliant한 다수의 agent의 경로를 얻을 수 있는 단순하고 효과적인 프레임워크이다. marginal과 conditional 예측기를 함께 사용하며, 예측기의 구조를 특정하고 있지 않기 때문에 예측 모델에 다양한 backbone(🔍)을 적용할 수 있다.
- 예측 공간(prediction space)를 나눌 수 있도록, 상호작용하는 agents 간의 관계를 추론하는 relation predictor가 있다.
- goal-conditioned(출력되길 원하는 결과를 이용하는) 예측 모델을 사용하여 프레임워크를 검증했다. 성능 검증에는 Waymo Open Motion Dataset interactive prediction benchmark를 사용했다.

> **Backbone과 Head**<br>
backbone은 입력값을 출력값 혹은 feature map으로 변형시킨다. 이미지에서 객체를 검출하는 detector에서는 VGG16, ResNet-50 등이다.
head는 backbone에서 나온 출력을 바탕으로 클래스를 예측하거나 바운딩박스 위치를 찾는 등의 역할을 한다.
> 

> ‘goal-conditioned’ 혹은 ‘goal space’라는 단어도 심심치 않게 보이는데, 도달하거나 출력되길 원하는 결과를 ‘goal’이라고 표현하는 것 같다.
>

- - -

# 2. Related Work

사람의 의도는 불확실성을 띄기 때문에 미래 궤적은 확률론적(probabilistic)이고 multi-modal하다. 이런 문제(multi-modality problem)를 해결하기 위해 다양한 방식들이 제안되어왔다.

> **Multi-modal**:<br>
단어를 분해하면 multi + mode + -al이다. multi는 ‘다수의’, mode는 ‘방식, 양상, 모드’의 뜻을 가지고 있다. 따라서 multi-modal은 ‘다양한, 다(多)모드의’라는 뜻을 갖는다. multi-modality는 ‘복합성’, 혹은 ‘복합 양식성’이라 번역한다. 반대로 Uni-modal은 하나의(single, uni-) 모드만 갖는다는 의미가 된다.
> 

GMM(Gaussian mixture model)은 행동 예측 결과를 도출할 때 각 mixture의 요소가 하나의 양식(modality)을 만든다. GAN(Generative Adversarial Model)이나 VAE(Variational Autoencoder)등의 생성 모델(generative models)은 예측의 분포를 파라미터화(parameterizing)하는 대신 분포 공간(distribution space)을 근사화(approximate)해 궤적 샘플을 생성한다. 그러나 이러한 생성 모델은 샘플 비효율적(sample inefficiency)이어서, 다양한 주행 시나리오에 대응하기 위해서는 매우 많은 샘플들이 필요하다는 문제가 있다.

최근에는 low-level 궤적(사용자들의 의도에 영향을 받음)을 예측하기 전에, high-level 의도(goal targets, 추종해야 할 차선, maneuver actions 등)를 먼저 예측해 정확도(accuracy)와 적용범위(coverage)를 개선하고 있다. 개별적인 agents에 대해서는 정확한 궤적을 예측하는 데 좋은 성과를 보이고 있다.

M2I에서는 예측 모델을 선택할 수 있기 때문에(의역. 원문은 ‘arbitrary prediction model’), 성능 향상을 위해서 anchor-free한 goal-based 예측기를 선택할 수 있다.

## 2.1. Interactive Trajectory Prediction

다수의 agents의 scene compliant 경로를 예측하는 것은 그 복잡성 때문에 아직 해결되지 않은 문제로 남아있다. 초기 연구들은 수동으로 만들어진(hand-crafted) 상호작용 모델(interactive model)을 사용했다. 이들은 수동적으로 튜닝을 해줘야 하고 매우 복잡하고 비선형적인 상호작용을 모델링하기 어렵다. 반면, learning-based 방식들은 실제적 주행 데이터로부터 상호작용을 학습함으로써 더 나은 정확도를 보였다. <span style="background-color: #fff5b1"><b>Social pooling 매커니즘이나 GNN, attention과 transformer 매커니즘 등을 사용했다.</b></span>

이 논문에서는 directed edges를 가지는 sparse graph를 만들어 agent 노드 간의 의존성(dependencies)을 나타낸다. 기존 그래프 기반 모델과의 차이점은 아래와 같다.

- <span style="background-color: #fff5b1"><b>influencer-reactor 관계를 분명하게(explicit) 정하고(adopt)</b></span>, agent 상호작용에서 더 나은 해석력(interpretability)을 가진다.
- <span style="background-color: #fff5b1"><b>marginal하고 conditional한 예측기</b></span>를 통해 scene compliant 경로를 예측하여, 더 나은 컴퓨팅 효율을 제공한다.
- <span style="background-color: #fff5b1"><b>influencer agents의 미래 경로를 사용하여 reactors의 조건적 행동을 더 좋은 정확도로 예측한다.</b></span> 이는 influencer의 경로를 다양하게 만듦으로써 시뮬레이션 환경에서 역사실적 추론(counterfactual reasoning, 사실과 반대가 되는 상황애 대해 가설적으로 생각하는 능력)을 할 수 있게 한다.

저자들은 agent 관계를 influencers와 reactors로 명확히 밝혀 scene compliant predictions를 하는데 집중한다.

## 2.2. Conditional Trajectory Prediction

<span style="background-color: #fff5b1"><b>조건적 예측(Conditional prediction) 방법은 다른 에이전트의 미래 경로에 대해 조건적으로 경로를 예측함</b></span>으로써 에이전트들의 미래 경로들 간의 상관관계를 학습한다. 저자들은 다른 에이전트의 미래 경로를 조건화함으로써 기존 방식을 발전시켰다.

- - -

# 3. Approach

## 3.1. Problem Formulation

각 scene의 모든 에이전트의 map 상태 M과 관찰된 상태 S에 대하여 상태 $X = (M, S)$가 주어졌을 때, 상호작용하는 에이전트 Y의 미래 상태를 유한한 시야(horizon) T까지 추측해야 한다. 상호작용하는 에이전트들이 미리 라벨링되어 있다고 가정한다. 

Y에 대한 분포가 다수의 에이전트들에 대해결합적 분포를 가지고 있기에, 그것을 주변 분포와 조건적 분포의 분해(factorization)로 근사화한다. 그 식은 아래와 같다.

$$
P(Y|X) = P(Y_I, Y_R | X) \approx P(Y_I|X)P(Y_R|X, Y_I)
$$

우선, <span style="background-color: #fff5b1"><b>상호작용하는 에이전트들이 influencer $Y_I$와 reactor $Y_R$로 할당한다. 그리고 결합적 분포를 influencer에 대한 주변적 분포와 reactor에 대한 조건적 분포로 분해한다.</b></span> 이러한 분해 과정은 결합적 분포의 복잡성을 낮추도록 해 다루기 쉬운(tractable) 분포로 학습하도록 돕는다. 만약 상호작용하지 않는 두 에이전트의 경우에는 각 에이전트 간의 조건적 의존성이 없기 때문에 위 식이 $P(Y\|X) \approx P(Y_I\|X)P(Y_R\|X)$ 로 단순화된다.

저자들은 이 논문에서 상호작용하는 두 에이전트들에 집중하여 한 쌍으로(pairwise) 상호작용하는 경로 예측 문제를 해결한다. 만약 둘 이상의 상호작용하는 에이전트가 있는 시나리오에서는, 이 접근법이 모든 에이전트들의 관계를 예측하도록 수정될 수 있고, 다수의 주변적이고 조건적인 분포를 함께 연결한다. 그 식은 아래와 같다. $N$은 상호작용하는 에이전트의 수이고, $Y_i^{\inf}$는 relation predictor에 의해 예측되는 $i$ 번째 에이전트에 영향을 주는 influencer 에이전트의 집합을 말한다.

$$
P_{N>2}(Y|X) \approx \prod_{i=1}^N P(Y_i | X, Y_i^{\inf})
$$

## 3.2. Model Overview

M2I는 아래 그림과 같은 구조를 가지고 있다. 

![image](https://user-images.githubusercontent.com/69252153/184533564-903cbf34-b569-43c3-8aca-bf0ae18533c5.png){: .align-center}

- <span style="background-color: #fff5b1"><b>Relation predictor</b></span>: 한 장면에서 influencer와 reactor의 관계를 예측함
- <span style="background-color: #fff5b1"><b>Marginal predictor</b></span>: influcencer의 미래 경로를 예측
- <span style="background-color: #fff5b1"><b>Conditional predictor</b></span>: influencer의 미래 경로를 조건으로 하는 reactor의 미래 경로들을 예측함. 증강된 장면의 context 입력을 받아들인다. 이 입력은 influcencer의 미래 경로를 포함하여, reactor의 반응 행동을 학습한다.
- <span style="background-color: #fff5b1"><b>Sample selector</b></span>: 결합적 예측 샘플들의 표현의 집합을 샘플링함

M2I가 서로 다른 학습 모델을 포함하지만, <span style="background-color: #fff5b1"><b>그들은 같은 encoder-decoder 구조를 공유하고, context 정보를 학습하는 같은 context encoder를 적용한다.</b></span>

![image](https://user-images.githubusercontent.com/69252153/184533636-8b66c622-0d2f-4efa-8531-4f30127fcefd.png){: .align-center}

## 3.3. Relation Predictor

<span style="background-color: #fff5b1"><b>두 에이전트 간의 pass yield(이동하고 양보하는) 관계에 기반하여 influencer 인지 reactor인지 분류하는 모델이다.</b></span>

**🎁 관계의 정의 및 방법**

pass yield 관계를 3가지로 분류하는데, 그는 <span style="background-color: #fff5b1"><b>PASS, YIELD, NONE이다. 그리고 휴리스틱으로 그 관계를 결정한다.</b></span> T 시간에 두 에이전트의 미래 경로가 $y_1$, $y_2$라고 할 때, 두 에이전트 간의 가장 가까운 공간적 거리(closest spatial distance)를 계산하고 pass yield 관계가 있는지 조사한다. 관계를 결정하는 휴리스틱 수식은 아래와 같다.

$$
d_I = \min_{\tau_1=1}^T \min_{\tau_2=1}^T \lVert y_1^{\tau_1} - y_2^{\tau_2} \rVert_2
$$

$$
t_1 = \arg \min_{\tau_1=1}^T \min_{\tau_2=1}^T \lVert y_1^{\tau_1} - y_2^{\tau_2} \rVert_2 \\ t_2 = \arg \min_{\tau_2=1}^T \min_{\tau_1=1}^T \lVert y_1^{\tau_1} - y_2^{\tau_2} \rVert_2
$$

- <span style="background-color: #fff5b1"><b>NONE</b></span>: $d_I > \epsilon_d$ 일 때($\epsilon_d$는 에이전트 크기에 따른 동적 threshold)이다. 이때 에이전트는 서로 가까워지지 않는다.
- <span style="background-color: #fff5b1"><b>YIELD</b></span>: $t_1 > t_2$일 때 에이전트1이 에이전트2에게 양보를 한다. 상호작용 지점(interaction point)에 에이전트1이 도달하는 데 더 오랜 시간이 걸리기 때문이다.
- <span style="background-color: #fff5b1"><b>PASS</b></span>: $t_1 > t_2$일 때 에이전트2가 에이전트1을 지나친다(pass).

**🎁 학습**

상호작용 타입을 넣어 학습 데이터를 라벨링한 뒤에는, <span style="background-color: #fff5b1"><b>encoder-decoder 기반 모델을 제안해 입력 시나리오를 이 세 타입의 분포로 분류한다.</b></span>

Relation predictor 모델의 context encoder는 상호작용하거나 근처에 있는 에이전트들의 관측 상태와, 지도 좌표들을 포함한 context 정보를 은닉 벡터(hidden vector)로 추출한다. <span style="background-color: #fff5b1"><b>Relation prediction head는 각 관계의 종류의 확률을 출력한다.</b></span>

<span style="background-color: #fff5b1"><b>M2I는 모듈러 디자인을 가지고 있으므로 다른 context encoder를 이용할 수 있다.</b></span> Relation prediction head는 다층 레이어 퍼셉트론(MLP)의 하나의 레이어로 구성되어 있어 각 관계에 대해 확률적 logit을 출력한다.

**🎁 Loss**

Relation predictor를 학습시키는 loss는 아래 식으로 정의된다.

$$
\mathcal{L}_{\mathrm{relation}} = \mathcal{L}_{ce} (R, \hat{R})
$$

$\mathcal{L}_{ce}$는 cross entropy 손실을 말하고, $R$과 $\hat{R}$은 각각 예측된 관계 분포와 ground truth 관계를 일컫는다.

**🎁 분포 결과에 따른 역할 분배**

예측한 관계가 주어졌을 때, 각 에이전트를 influencer과 reactor로 분류한다. 

- <span style="background-color: #fff5b1"><b>NONE 관계</b></span>: 두 에이전트가 다 influencer로 미래 행동이 서로 독립적임.
- <span style="background-color: #fff5b1"><b>YIELD 관계</b></span>: 에이전트1이 2에게 양보한다면, 에이전트1을 reactor로, 에이전트2를 influencer로 삼음
- <span style="background-color: #fff5b1"><b>PASS 관계</b></span>: 에이전트1이 2를 지나친다면, 에이전트1을 influencer로, 에이전트2를 reactor로 삼음

## 3.4. Marginal Trajectory Predictor

<span style="background-color: #fff5b1"><b>Influencer에 대하여는 Marginal Trajectory Predictor를 제안하였는데</b></span>, 이는 encoder-decoder 기반의 구조를 가지고 있으며, 많은 경로 예측 논문에서 차용되는 방법이다. 이 예측기는 Relation Predictor와 같은 context encoder를 사용하여 예측 샘플의 집합을 생성한다. 예측 샘플은 trajectory prediction head를 사용해 구한 confidence score를 가진다. <span style="background-color: #fff5b1"><b>경로 예측 벤치마크에서 anchor-free goal-based prediction head가 좋은 성능을 보이기 때문에 저자들은 이 방법을 사용했다.</b></span>

## 3.5. Conditional Trajectory Predictor

3.4절의 Marginal Predictor가 influencer의 예측을 한다면, <span style="background-color: #fff5b1"><b>Conditional Predictor는 influencer의 행동에 대응하는 reactor의 예측을 담당한다.</b></span> Marginal Predictor와 유사하게 작동하나, influencer의 미래 경로를 포함하는 증강된 scene context를 사용한다는 점이 다르다. Influencer의 미래 경로의 특징을 추출하고 학습하며, 장면의 특징이 인코딩된 것은 trajectory prediction head로 사용되어 Marginal Predictor와 같은 모델을 공유할 수 있게 한다. 또한 이로써 <span style="background-color: #fff5b1"><b>multi-modal한 예측 샘플을 생성할 수도 있다.</b></span>

## 3.6. Sample Selector

Influencer과 reactor의 예측된 관계가 주어졌을 때, influencer에 대해서는 3.4절의 Marginal Predictor로 confidence scores(혹은 확률)과 함께 N개의 샘플을 예측하고, 각 influencer 샘플마다 각 reactor에 대해서는 3.5절의 Conditional Predictor로 N개의 샘플을 예측한다. 따라서 <span style="background-color: #fff5b1"><b>결합적 샘플의 개수는 $N^2$개가 되고, 각 결합적 샘플의 확률은 marginal probability와 conditional probability의 곱(product)가 된다.</b></span>

후속 작업(downstream task)에서 각 예측 샘플을 평가하기 위하여 <span style="background-color: #fff5b1"><b>결합적 샘플들을 $N^2$개에서 결합적 가능도(joint likelihoods) 상위 $K$개로 줄인다.</b></span>

## 3.7. Inference

추론 단계에서는 아래의 순서대로 결합적 예측을 생성한다. 

1. <span style="background-color: #fff5b1"><b>Relation Predictor</b></span>를 호출하고, 예측 결과 가장 높은 확률을 보이는 상호작용 관계(relation)을 선택한다.
2. <span style="background-color: #fff5b1"><b>Marginal Predictor</b></span>를 사용해 N개의 경로 샘플을 생성한다.
3. 각 influencer 샘플에 대해, <span style="background-color: #fff5b1"><b>Conditional Predictor</b></span>를 사용해 예측된 reactor의 N개의  샘플을 생성한다.
4. $N^2$개의 후보들에서 <span style="background-color: #fff5b1"><b>$K$개의 표현 샘플을 선택한다.</b></span>

만약 과정 1에서 예측된 관계가 NONE이라면 양 에이전트에 대해 다 Marginal Predictor를 사용해 $N^2$ 경로 쌍을 얻고, 동일하게 샘플 선택 과정을 거친다.

- - -

# 4. Experiments

## 4.1. Dataset

<span style="background-color: #fff5b1"><b>Waymo Open Motion Dataset(WOMD)를 사용해 훈련 및 검증을 진행했다.</b></span> 해당 데이터셋은 실제적인 교통 시나리오를 담고 있는 대규모 데이터셋이다. 데이터셋은 어떤 에이전트가 상호작용하는지 라벨을 제공하나, 어떻게 상호작용하는지는 알려주지 않는다. 훈련은 YIELD, PASS, NONE 관계를 미리 라벨링한 뒤 진행했다.

<span style="background-color: #fff5b1"><b>1.1초의 에이전트 상태가 11개의 타임스텝이 주어졌을 때, 다음 8초간 80번의 타임스텝에서 두 상호작용하는 에이전트들의 결합적 미래 경로를 예측한다.</b></span>

## 4.2. Metrics

- <span style="background-color: #fff5b1"><b>minADE</b></span>: GT와 $K=6$의 결합적 샘플 중 가장 GT와 근접한 예측 샘플 간의 ADE(Average Displacement Error)를 측정한다. Multi-modal 분포에서 예측 오차를 측정하기 위하여 널리 사용되는 방법이다.
- <span style="background-color: #fff5b1"><b>minFDE</b></span>: GT와 K개 결합적 경로의 예측된 끝 지점(end position) 중 GT에 가장 가까운 것 간의 FDE(Final Displacement Error)를 측정한다.
- <span style="background-color: #fff5b1"><b>MR (Miss Rate)</b></span>: K개의 결합적 예측 샘플 중 NONE의 개수의 비율을 측정한다.
- <span style="background-color: #fff5b1"><b>OR (Overlap rate)</b></span>: scene compliance의 정도를 측정하는 지표이다. 한 에이전트가 다른 에이전트의 예측 경로를 overlap하고 있는 비율로 측정한다. OR이 작을 수록 예측이 scene compliant 함을 의미한다. WOMD의 벤치마크 방식에서 조금 변경한 방식을 사용한다.
- <span style="background-color: #fff5b1"><b>mAP (Mean Average Precision)</b></span>: 예측 샘플의 confidence score이 주어졌을 때 precision-recall curve의 아래 면적을 말한다. 점수에 상관 없이 최선(best)의 샘플만 측정하는 minADE나 minFDE와는 달리, mAP는 confidence score의 질을 판단하고 False Positive 예측에 패널티를 적용한다. mAP는 WOMD의 공식적 순위 결정 방식이다.

## 4.3. Model Details

### 4.3.1. Context Encoder

**🎁 Vectorized & Rasterized Representation**

<span style="background-color: #fff5b1"><b>교통 맥락을 인코딩하기 위하여 context encoder는 벡터화 및 래스터화(rasterized, 텍스트나 이미지를 프린트 가능한 형태로 전환함)된 표현을 이용한다.</b></span> 벡터화한 표현은 관측된 에이전트들의 상태와 지도 상태를 포함하여 교통 맥락을 벡터로 표현하며, 넓은 공간을 커버할 때 효과적이다. 래스터화된 표현은 하나의 이미지에서 다채널로 교통 맥락을 파악하고 기하학적(geometrical) 정보를 파악하는 데 뛰어나다.

Context encoder의 출력은 벡터화 특징과 래스터화 특징의 결합(concatenation)이다.

**🎁 vector encoder**

VectorNet를 vector encoder로 삼는다. 관측된 에이전트의 경로와 차선 부분(lane segments)를 폴리라인(polyline)의 집합으로 만든다. 각 폴리라인은 벡터의 집합으로, 이웃한 점을 잇고 있다. 각 폴리라인에 대해, MLP를 사용해 폴리라인으로 벡터의 특징을 인코딩하고, 그래프 신경망으로 그들의 의존성을 인코딩한다. 그 후에는 모든 벡터의 특징을 요약하기 위해 max-pooling 레이어로 이어진다.

폴리라인 특징(polyline features)에는 에이전트의 폴리라인 특징(agent polyline features)과 지도의 폴리라인 특징(map polyline features)이 함께 있으며, 이들은 cross attention으로 처리되어 최종 에이전트 특징을 얻는다. 이 결과에는 지도와 근처 에이전트에 대한 정보가 포함되어 있다.

**🎁 rasterized encoder**

두 번째 인코더는 래스터화된 표현에서 특징을 학습한다. 우선, 입력 상태를 60개 채널의 이미지로 래스터화 한다. 여기에는 각 과거 프레임의 에이전트의 위치가 맵 정보와 함께 있다. 이미지의 크기는 224X224이고, 각 픽셀은 1mX1m 크기를 나타낸다. 사전 학습된 VGG16으로 인코더로 사용해 래스터화된 특징을 얻는다. 

**🎁 Conditional Context Encoder**

Conditional trajectory predictor에서의 context encoder는 추가적인 influencer의 미래 경로를 처리한다. 우선, VectorNet을 가동할 시 벡터화된 표현에 추가 벡터로 미래 경로를 더한다. 동시에, 래스터화 표현에 추가적 80 채널을 생성하고 다음 8초에서 80번의 시간동안 $(x, y)$ 위치를 얻는다.

사전 학습된 VGG16 모델을 사용해 증강된 이미지를 인코딩하고, 최종 출력으로써 벡터화 특징을 출력 특징과 합친다.

### 4.3.2. Relation Prediction Head

MLP의 레이어 하나로서, 분류를 위한 하나의 완전 연결층이다. MLP는 크기 128의 은닉층을 가지고 있고, 정규화 레이어와 ReLU 활성화 함수로 이어진다. 출력은 관계의 3가지 종류에 대한 logits이다.

### 4.3.3. Trajectory Prediction Head

Trajectory Prediction Head는 DenseTNT를 적용해 multi-modal한 미래 경로를 생성한다.

1. 히트맵으로 에이전트의 목표점의 분포를 예측한다. 여기엔 아래 3가지 모듈을 사용한다.
    * 따라갈 것으로 예상되는 lane을 파악하는 lane scoring module
    * 어텐션 매커니즘을 사용해 목표점과 lane간의 특징을 추출하는 feature encoding module
    * 목표점의 가능도를 예측하는 probability estimation module
2. Prediction head가 목표점을 조건으로 하여(conditioned) 예측 horizon에 대하여 전체 경로들을 회귀한다.
3. Prediction Head는 context encoder와 결합되고 end-to-end로 학습된다.

### 4.3.4. Training Details

relation predictor와 marginal predictor, conditional predictor을 각각 학습시킨다. 각 모델은 WOMD 훈련 데이터셋에서 훈련되며, 랜덤 batch에 배치 사이즈 64로 30에폭동안 RTX 3080 GPU에서 학습했다. Adam optimizer를 사용하며, 초기 학습율 1e-3에서부터 각 5에폭마다 30%씩 학습률을 감소시키는 learning rate scheduler를 썼다. 특별한 지정이 없으면 모델의 은닉 크기는 128이다. Conditional predictor를 학습할 때는 influencer 에이전트의 미래 경로 GT를 제공함으로써 teacher forcing technique( 🔍)을 사용했다.

## 4.4. 정량 평가

다른 모델과(baseline) 비교를 진행했다.

- Waymo LSTM Baseline: WOMD 벤치마크의 공식 비교 모델이다. LSTM 인코더를 이용해 관측된 에이전트의 경로를 인코딩하고, MLP 기반의 prediction head를 사용해 다수의 샘플을 생성한다.
- Waymo Full Baseline: Waymo LSTM Baseline의 확장 버전으로, context 정보를 인코딩하기 위하여 auxiliary 인코더들을 사용한다.
- Scene Transformer: 트랜스포머 기반의 모델로, 어텐션을 사용해 도로 그래프와 에이전트 상호작용을 시간적 & 공간적 모두에 대해 그 특징을 종합한다. 이 모델은 WOMD 벤치마크에서 marginal 예측 작업과 상호작용 예측 작업 모두에서 가장 좋은 성능을 보이고 있다.
- HeatRm4: 유향 특징 그래프(directed edge feature graph)로 에이전트의 상호작용을 모델링하고, 어텐션 네트워크로 상호작용 특징을 추출한다. 2021 WOMD 챌린지의 우승 모델이다.
- $\mathrm{AIR^2}$: 래스터(raster) 표현을 사용한 marginal anchor 기반 모델이다. 이 모델은 각 에이전트로부터 marginal 예측을 결합함으로써 결합적 예측을 생성한다. WOMD 챌린지에서 상위 성능을 달성했다.
- Baseline Marginal: 이 논문의 모델인 M2I와 같은 marignal predictor를 사용하는 모델이다. 두 에이전트에 대해 N 개의 marginal 예측 샘플을 생성한다. 이때 이들의 미래 상호작용을 고려하진 않는다. Marginal 예측을 결합적 예측에 합칠 때, 저자들은 결합적 확률(marginal 확률의 곱)이 주어진 $N^2$개의 선택지 중 상위 K개의 marginal 쌍을 선택한다.
- Baseline Joint: 상호작용하는 두 에이전트에 대해 목적지와 경로를 결합적으로 예측하는 모델이다. M2I와 같은 context encoder와 trajectory prediction head를 사용한다.

![image](https://user-images.githubusercontent.com/69252153/184533653-448c5189-41db-4f2b-8b0a-9613b5e5af11.png){: .align-center}

모델이 confidence score 예측을 사용해 더 정확한 분포를 생성하고, 더 적은 False Positive 예측을 만든다. M2I 모델은 특정한 예측 모델을 가정하지 않으므로, context encoder로 SceneTransformer을 사용할 수도 있다. 이럴 경우 minFDE 수치가 개선될 수 있다. M2I 는 margin이 큰 경우에 mAP가 더 개선되는 경향을 보인다.

## 4.5. Ablation Study

Relation Predictor과 conditional predictor, 그리고 다른 예측기에 대한 일반화(generalizing) 각각의 효과를 검증했다.

## 4.6. 정성평가

![image](https://user-images.githubusercontent.com/69252153/184533660-eb1a5fb7-c09c-4bdf-85cf-9e70a5d262d4.png){: .align-center}

어려운 시나리오들에 대해 정성 평가를 진행했다. 위 사진은 Marginal Baseline과 M2I를 각각 비교한 결과 중 하나로, 빨간색 에이전트가 U턴을 하려는 파란색 에이전트에게 양보를 하는 상황이다. Marginal Baseline의 경우, marginal predictor는 상호작용을 포착하고 겹치는 경로를 예측하는 데 실패한다. 반면 M2I는 상호작용 관계를 잘 파악하고 정확한 경로를 예측했다. 즉, <span style="background-color: #fff5b1"><b>M2I는 더 나은 예측 정확도와 scene compliance를 보인다.</b></span>

- - -

# 5. Conclusion

- M2I의 특징
    - 결합적 예측 프레임워크(Joint Predicion framework)이다.
    - Marginal predictors과 Conditional predictors를 사용한다.
    - 상호작용하는 에이전트 간의 factorized relations를 탐색한다.
    - 모듈러 인코더-디코더 아키텍처와 prediction head를 사용한다.
- WOMD 벤치마크에 대해 실험을 진행했으며, 최신 성능을 보임을 보였다.
- Ablation study에서 프레임워크의 generalization이 다른 예측 모델에도 쓰일 수 있음을 증명했다.
- 한계점
    - minFDE 지표의 측면에서, 다른 SOTA 모델에 비해 낮은 값을 보였다. M2I가 모듈러 디자인을 가지므로 SceneTransforemr를 context encoder로 사용하는 등의 방법으로 개선이 가능하다.
    - M2I의 성능이 훈련 데이터의 사이즈에 크게 좌우된다. 특히 Relation predictor와 Conditional trajectory predictor를 훈련시킬 때 그렇다.
    - M2I는 결합적인 에이전트 분포를 marginal & conditional 분포로 분해하는 데 mutual 영향(둘 이상의 에이전트)를 가정하지 않는다. Mutual한 영향을 가지는 더 복합한 시나리오에서의 예측은 더 연구되어야 할 부분이다.

- - -

# References
## Original Paper
* Q. Sun, X. Huang, J. Gu, B. C. Williams, and H. Zhao, “[**M2I: From Factored Marginal Trajectory Prediction to Interactive Prediction**](https://arxiv.org/pdf/2202.11884v2.pdf),” in Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition, 2022, pp. 6543–6552.
* [**공식 홈페이지**](https://tsinghua-mars-lab.github.io/M2I/)

## Further Study
* 🔍 **Likelihood (가능도)**
    * [**StatQuest, "Probability is not Likelihood. Find out why!!!"**](https://www.youtube.com/watch?v=pYxNSUDSFH4)
    * [**Mr.jjong, "확률과 가능도 그리고 최대우도추정"**](https://ddangjiwon.tistory.com/103)
* 🔍 **Backbone과 Head**
    * [**땅지원, "Backbone(백본)에 대해"**](https://ddangjiwon.tistory.com/103)
    * [**What does backbone mean in a neural network?**](https://stackoverflow.com/questions/59868132/what-does-backbone-mean-in-a-neural-network)
* 🔍 [**Teacher Forcing**](https://blog.naver.com/PostView.naver?blogId=sooftware&logNo=221790750668)