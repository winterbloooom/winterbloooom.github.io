---
title:  "[Paper Review] DepthFormer 논문 리뷰 (Monocular Depth Estimation)"
excerpt: "DepthFormer: Exploiting Long-Range Correlation and Local Information for Accurate Monocular Depth Estimation (2022)"
categories:
  - AI
  - Computer Vision
tags:
  - Deep Learning
  - paper Review
  - Computer Vision
  - Depth Estimation
last_modified_at: 2023-02-03
---

# 들어가며

지난해 7월, 몇 편의 '단안 카메라 깊이 추정(monocular depth estimation)' 논문을 읽고 프로젝트를 진행한 바 있었다. ([[Paper Review] Monocular Depth Estimation 논문 모음](https://winterbloooom.github.io/ai/computer%20vision/2022/07/15/depth_estimation.html))

그 논문들을 자세히 다시 읽어보며 정리하였고, 오늘 포스팅은 그 중 첫 번째 정리 내용이다.

2022년 발표된 모델(프레임워크)로, 이름은 **DepthFormer**이다. 가장 큰 특징으로는, 이미지의 특징을 추출하기 위한 인코더로 **Transformer와 Convolutional Layer를 각각의 브랜치로 사용**했다는 점, 그리고 디코더로 가기 전에 **Neck 모듈을 따로 만들어 두 브랜치에서 나온 특징을 한 번 가공해 조합**했다는 점이다.

{% include inserted_box.html text="논문 원문: <a href='https://arxiv.org/abs/2203.14211'>DepthFormer: Exploiting Long-Range Correlation and Local Information for Accurate Monocular Depth Estimation</a>" %}

## Main contributions

* 이미지에서 특징을 추출하는 인코더에 2개의 브랜치를 사용했다. 하나는 long-range correlation을 추출하는 트랜스포머 브랜치, 다른 하나는 local information을 보존하는 합성곱 브랜치이다.
* HAHI 모듈을 만들었다. Element-wise interaction으로 특징(feature)을 향상시키고, set-to-set translation 방식으로 서로 다른 특징 간의 유사도를 모델링한다.
* 이렇게 디자인한 DepthFormer를 KITTI, NYU, SUN RGB-D 데이터셋에서 검증했으며, SOTA 모델을 넘어서는 좋은 성능을 보였다.


- - -

# Task 소개: Depth Estimation

먼저, 이 논문이 다루려는 주제부터 살펴보자.

하나의 표현으로 정리하면, '**monocular depth estimation**', 한국말로는 단안 카메라에서의 깊이 추정이다.

'단안 카메라'라는 표현은 그저 '이미지 한 장'이라고 봐도 무방하다. 양안 카메라의 경우 같은 시점에 촬영한 왼쪽과 오른쪽 이미지가 있기 때문에, 한 쪽을 모델의 입력용으로, 다른 쪽을 모델의 출력과 비교할 결과용으로 사용할 수 있다. 그러면 굳이 지도학습(supervised learning)이 아니어도 된다. 하지만 여기선 양안 카메라가 아닌, 지도학습을 이용한 단안 카메라에서의 깊이 추정을 다룬다.

'깊이 추정'은 RGB 이미지 각 픽셀에서의 깊이(거리)를 계산해내는 것을 말한다. 카메라로부터 카메라가 찍은 해당 픽셀 위치의 실제 공간 속 지점까지 얼마나 멀리 떨어져있느냐의 문제다.

3차원 공간을 2차원 평면으로 투영하는 기계가 카메라다. 따라서 LiDAR와 같은 센서완 다르게, 카메라는 애초에 깊이 정보가 없다. (깊이 카메라(Depth Camera)를 사용하지 않는 이상 말이다) 그 기본적 원리를 넘어서려니, 이 task가 상당히 어려운 것이다.

구체적으로 말하자면, 깊이를 추정할 만한 단서(cue)도 부족하고 크기(scale)도 모호하다. 크기가 모호하단 말은, 아래 사진처럼 2차원으로 투영되면서 서로 다른 물체도 같은 크기로 보일 수도 있는 등의 일을 말한다.

<figure>
<img src="https://user-images.githubusercontent.com/69252153/215421561-99d10aee-98a8-4305-849e-b93752f0ddd1.png" width="60%">
<figcaption>이미지 출처: <a href="http://eyehearteye.me/depth.html">Depth Estimation: Basics and Intuition</a></figcaption>
</figure>

반사(reflective)되거나 투명한(translucent) 재질이 있다면 그것도 깊이 추정이 힘들다.

- - -

# 관련 이론 및 연구

## 단안 깊이 추정 모델

이 논문에서는 같은 task를 다루는 관련 모델로 DPT(2021), Adabins(2021), Transdepth(2021)를 간단히 소개했다.

* DPT (2021) : Visual Transformer (이하 "ViT")를 인코더로 사용했으며, 대규모 깊이 추정 데이터셋으로 사전 학습(pre-train) 시켰다.
* Adabins (2021) : Adaptive bins를 입력 장면에 따라 동적으로 바뀌도록 했다. (bin은 일정한 간격으로 이해하면 된다. 그 값(범위)을 고정시키지 않고 유동적으로 하겠단 얘기다.) 또한 고해상도의 mini-ViT를 디코더 뒤에 추가했다.
* Transdepth (2021) : 트랜스포머(Transformer)가 지역적(local) 정보를 잃지 않도록 했으며, multi-level features(주로 모델의 서로 다른 층에서 나온 서로 다른 크기의 피처맵을 말함)을 합칠 수 있는 attention gate decoder를 제시했다.

## 인코더-디코더 구조

**인코더는 주로 입력 데이터에서 특징을 추출하는 과정**을 말하는데, 대표적 특징 추출기인 EfficientNet(2019), ResNet(2016), DenseNet(2017)을 이용해 표현(representations)를 학습시킨다.

디코더는 주로 연속적인 합성곱과 업샘플링 연산으로 이루어져 있어, 인코더에서 나온 특징들(features)을 합친다(aggregate). 깊이 추정의 경우, 모델을 거치는 동안 달라진 공간적 해상도(쉽게 말해 피처맵의 크기)를 입력과 같도록 복원하고, 깊이를 추정하는 단계를 포함한다.

이 논문에서는 **인코더를 두 개의 브랜치로 나누어 하나는 트랜스포머를 다른 하나는 합성곱층을 넣어두었다**. 이 인코더를 핵심적으로 다룬다. 반면 디코더는 특별한 점 없이 표준적 디코더를 사용해 깊이 추정 결과를 만들어낸다.

## Neck Module

딥러닝에서 Neck은 주로 '입력 데이터를 특성맵으로 바꾸는 단계'와 '모델의 출력을 생성하는(예측을 수행하는) 단계'의 사이에 위치하는 모듈을 일컫는다.

위 인코더-디코더 구조로 보면, **인코더 후 & 디코더 전**이라 할 수 있다. Neck에서 특징을 향상시킨다(enhance). **출력을 만들어내기에, 혹은 처리하기에 더 좋은 상태로 가공한단 말이다.**

이 논문에서 핵심적으로 제안하고 있는 또다른 요소가 이 Neck 부분이다. 뒤에서 보겠지만 HAHI라고 이름 붙인 모듈을 제안한다.

## 트랜스포머 네트워크

**어텐션 레이어**를 이용한 네트워크로, 컴퓨터 비전 분야에서 널리 쓰이는 중이다. 처음엔 자연어 처리를 위해 만들어졌으나, ViT 등을 시작으로 비전 분야에 들어오기 시작했다.

CNN은 필터가 위치한 그 부분만을 본다는 단점이 있다. 수용 영역(Receptive field)에 어쩔 수 없는 제한이 있다는 뜻이다. 반면, 트랜스포머는 self-attention을 통해 **이미지 전체를 다 보고 각 부분과의 관계를 구할 수 있다.**

이 논문에서는 인코더에 트랜스포머를 활용해 이미지 데이터에서 (픽셀 위치로) **서로 멀리 떨어진 곳과의 상관관계(long-range correlations)를 모델링**하고자 한다.

- - -

# 주요 아이디어

<figure>
<img src="https://user-images.githubusercontent.com/69252153/216499513-f6a13933-7814-4739-a1b5-11339d714e37.png" width="80%">
<figcaption>간단하게 나타낸 DepthFormer 구조</figcaption>
</figure>

## long-range correlation

이 논문의 저자들은 주장하길, 정확한 깊이 추정을 위해서는 'long-range correlation'이 필수적이라고 한다. 주구장창 나오는 이 long-range correlation이란 단어의 뜻을 조금 더 자세히 설명하겠다.

CNN의 주를 이루는 합성곱 연산(convolutional operator)은 필터(커널) 크기만큼 이미지 특정 부분을 가지고 필터와 곱해 하나의 픽셀값으로 만들어낸다. 이 필터가 이미지 전체를 돌아다니며 하나의 결과(다음 특성맵)을 만들어낸다.

여기서 합성곱층의 한계가 드러나는데, 그건 '이미지의 국소적 부분만 본다'이다. 예를 들어 필터가 9 x 9 크기라고 하면 서로 붙어있는 81개의 픽셀만 보고, 그 다음엔 또 서로 붙어있는 81개의 픽셀만 본다. 즉, 이미지의 조금씩만 떼어 보기 때문에 좌상단의 픽셀들과 우하단의 픽셀들은 서로 그 연관성을 계산해낼 수가 없다.

아래 그림으로 살펴보자. 9칸 짜리 주황색 박스는 그 다음 맵에선 한 칸으로 표시된다. 다르게 말하면, 한 칸이 보는 것은 이전 맵의 9칸 뿐이다. 맨 마지막 초록색 한 칸을 역으로 input 쪽으로 따라가보면, 저 한 칸이 이미지 전체 범위를 담기 위해서는 무려 3번의 합성곱 연산을 거쳐야한다. 

<figure>
<img src="https://user-images.githubusercontent.com/69252153/216513692-2d3b5942-c3e9-407f-9917-0fe261595b2d.png" width="80%">
<figcaption>이미지 출처: Deep Learning for Computer Vision (Michigan University, Justin Johnson)</figcaption>
</figure>

지금은 예시이니 이렇게 적은 단계이지, 실제 이미지는 몇 천 개의 픽셀을 포함하고 있다. 최종 출력맵의 각 칸이 입력 이미지의 전체적인 이미지를 보기 위해서는 모델이 매우 깊어져야 하는데, 이는 그리 현실적이진 않다.

실제로 저자들의 실험 결과를 보면, **합성곱 연산의 제한된 수용 영역(receptive fields) 때문에 몇몇 물체들의 깊이 정확도가 떨어지는 현상**이 발생한다.

![](https://user-images.githubusercontent.com/69252153/216500603-2e473b99-0ea5-423a-884e-0fedef91b7da.png)

저자들이 트랜스포머를 들여온 이유가 여기 있다. Self-attention의 경우 한 픽셀과 이미지 내 다른 모든 픽셀 간의 관계를 계산하기 때문에, **이미지에서 멀리 떨어진 픽셀까지 서로의 관계 계산이 가능**하다. 그말인 즉, 이미지 전체를 고려한단 뜻이다. Global receptive fields를 가진다고 표현할 수도 있겠다. 물체 단위로 보자면, 물체들 간의 거리적 관계 단위까지 넓게 보겠단 뜻이다.

위 사진에서 보면 Transformer 그림에서 화살표가 바깥으로 쭉쭉 뻗어나가는 것을 볼 수 있다. 이걸 Long-range correlation을 고려한다고 말하는 것이다.

## two branches in encoder

하지만 트랜스포머라고 해서 장점만 있는 건 아니다. 

국소적 정보를 본다는 CNN의 단점은 트랜스포머와는 대비되는 CNN의 장점이기도 하고, 여전히 필요하다. 예를 들다면, 한 물체의 일관성(consistency)를 보기 위해선 국소적 정보가 필요하다. 이렇게 **세세하게 보아야 하는 경우에는 합성곱 연산이 필요하다.** 

반면 **트랜스포머는 CNN과 달리 국소적 정보를 모델링하기엔 공간적 귀납 편향(inductive bias)가 부족**하다. 이 어려운 말이 무슨 말인고, 잠깐만 들여다보겠다.

딥러닝을 공부할 때, 편향(bias)는 '어떤 방향으로 움직여주는(틀어주는)' 느낌으로 다가온다. 그 느낌을 그대로 살려 '귀납 편향'은, 이 모델의 일반화 성능(보지 못한 데이터로도 좋은 결과를 내기)을 높이기 위해 '추가적 가정'을 주어 귀납적 추론을 하게 만드는 것이다.

CNN과 FCN(Fully Connective Network)를 비교해보자. FCN은 한 층의 뉴런이 다른 층의 모든 뉴런과 연결되어, 모든 입력이 모든 출력에 영향을 줄 수 있다. 그래서 '귀납 편향이 약하다'고 한다. 트랜스포머가 전체적인 관계를 보기 때문에, FCN과같이 귀납 편향이 약한 편이라 할 수 있는 것이다.

반면 CNN은 필터의 크기만큼의 픽셀들만 계산에 참여해 그들끼리는 강한 관계를 갖는다. 반대로 필터가 겹치지 않는 픽셀들 간에는 관계가 약하게 형성된다. 그래서 '귀납 편향을 갖는다'고 한다.('locality, translation invariance') 또한 그래서 가까이 있는 픽셀 간의 국소적 관계에는 CNN이 그 특징을 잘 뽑아낼 수 있다.

다시 깊이 추정으로 돌아오자. 가까이 있는 물체는 크게 보이고 질감(texture)도 잘 보인다. 트랜스포머는 이미지를 패치 단위로 자르기 때문에 이 큰 물체는 여러 개의 패치로 잘릴 것이고, 이렇게 되면 이들의 디테일이 patch-wise 연산에서 사라질 위험이 크다.

국소적 정보는 **일관적이고 날카로운(sharp, 사진상으로 깊이 추정이 모호하게 뭉개지지 않는) 추정 결과**를 얻는 데 중요하다. 아래 그림에서 보다시피, 가운데 사진에선(다른 모델) 물체의 가장자리 부분이 뭉개지는 현상이 발생한다.

<figure>
<img src="https://user-images.githubusercontent.com/69252153/216500727-55bd4c8a-5c5b-4a54-8acc-da80c4ad0e94.png" width="60%">
</figure>

따라서 이 논문에서는 **트랜스포머 브랜치만 사용하는 것이 아니라, 합성곱 브랜치(CNN)도 인코더에 사용했다. 트랜스포머로는 전역적 정보를, CNN으로는 국소적 정보를 보겠단 의도이다.**

위 사진에서 Convolution 쪽 이미지를 보면 확대한 사진 안쪽으로 화살표가 향하고 있다. 의미상 이것을 국소적 정보를 본다고 말하는 것이다.

## Neck module

인코더에서는 트랜스포머와 CNN 각각에서 나온 특징맵이 있다. **이들은 다른 브랜치에서 나왔기에 서로 종류가 다른 특징들**이며, 단순히 합해서 디코더에 넣는 건 그리 좋은 선택이 아니라 한다.(서로 집중해서 뽑은 특징이 다르니까)

그래서 인코더와 디코더 사이에 Neck 역할을 하는 HAHI(Hirarchical Aggregation and Heterogeneous Interaction) 모듈을 만들어 넣음으로써, 트랜스포머의 특징은 좀 더 잘 쓰일 수 있게 향상시키고, 합성곱에서 나온 특징은 트랜스포머 특징과 잘 어우러질 수 있게끔 만든다.

이 길고도 어려운 모듈의 이름은 뒷부분에서 자세히 풀어내겠다. 지금은 역할만 알고 있자.

- - -

# DepthFormer의 상세 구조

<figure>
<img src="https://user-images.githubusercontent.com/69252153/216500086-9cff6b8f-8949-461f-a91f-e2f71155cad5.png">
<figcaption>DepthFormer의 상세 구조</figcaption>
</figure>

- - -

# Encoder: Feature Extraction

인코더는 입력 데이터인 이미지에서 특징을 추출하는 역할을 한다. 이 논문에서는 인코더를 두 개의 브랜치로 나눴는데, 하나는 트랜스포머 브랜치(Transformer branch), 다른 하나는 합성곱 브랜치(convolutional branch)이다.

트랜스포머 브랜치는 long-range correlation을 갖기 위해 어텐션 기법을 사용해 전역적 context를 모델링한다. 다만 트랜스포머가 공간적 귀납 편향이 부족한 탓에 국소적 정보(local information)를 놓칠 수 있기에, 이를 보완하고자 합성곱 브랜치를 추가적으로 사용하는 것이다. 이렇게 두 브랜치를 사용해서 깊이 추정의 정확도를 올리고자 한다.

위 모델 그림에서 파란색 박스가 트랜스포머 브랜치, 주황색 박스가 합성곱 브랜치에 해당한다.

## Transformer Branch

구체적인 트랜스포머 브랜치의 작동 과정을 알아보겠다.

**① 패치 분할 모듈(patch partition module)을 이용해 이미지 $I$ 를 겹치지 않는 패치들로 자른다.**

이때 각 패치의 초기 특징 표현(feature representation)은 RGB 픽셀값의 concatenation인 집합의 형태다.

**② 선형 임베딩 레이어(Linear embedding layer)를 통해 첫 특징 표현을 임의의 차원으로 투영(project) 시킨다.**

이렇게 투영된 벡터가 트랜스포머의 첫 번째 레이어의 입력으로 사용된다. 즉, 트랜스포머에 넣기 위해 일정 차원으로 특징 벡터들의 차원을 조정한단 뜻이다. 이렇게 만들어진 벡터를 $\boldsymbol{z}^0$라 표기한다.

**③ $L$ 개의 트랜스포머 레이어를 거치며 특징을 뽑아낸다.**

각 레이어는 [Layer Normalization(LN) → Multi-head self-attention(MSA) 모듈 → Residual Connection] → [Layer Normalization(LN) → Mlti-layer perceptron(MLP) → Residual Connection] 의 구성으로 이루어져 있다. 따라서 특정 레이어 $l$ 의 MSA 모듈 출력인 특징 벡터를 $\hat{\boldsymbol{z}}^l$ 이라 하고, MLP의 출력 특징 벡터를  $\boldsymbol{z}^l$ 하면 그 과정을 아래 수식으로 표현할 수 있다.

$$
\begin{align}
  \hat{\boldsymbol{z}}^l &= MSA(LN(\boldsymbol{z}^{l-1})) + \boldsymbol{z}^{l-1} \\
  \boldsymbol{z}^l &= MLP(LN(\hat{\boldsymbol{z}}^{l-1})) + \hat{\boldsymbol{z}}^{l-1}
\end{align}
$$

식 (1), (2)의 두 번째 항(더해주는 항)이 residual connection에 해당한다. 또한 ${l-1}$ 첨자에서도 알 수 있듯이, 이전 레이어의 출력을 지금 레이어의 입력으로 쓰고 있음을 확인할 수 있다.

DPT의 경우 트랜스포머로 ViT를 사용한데 반해, 이 논문의 DepthFormer에서는 Swin Transformer를 사용했다. 보다 계층적 특징들을 사용해 정확도를 향상시키고, 연산 복잡도를 낮추기 위함이다. 이 논문에서 제시한 swin transformer의 특징은 아래와 같으며, 필자가 설명을 붙였다.

* local attention mechanism
  * 기존의 self-attention은 한 패치와 다른 모든 패치들과 모두 한 번씩 연산을 진행한다. 이렇게 되면 연산의 비용이 크게 증가한다.
  * 따라서 일정한 window(영역)를 정해 그 안에서의 패치들만 서로 연산을 한다.
  * 예를 들어 이미지 전체에 16개의 패치가 있고, 이미지를 4개의 윈도우로 나눈다면, 하나의 윈도우에는 4개의 패치가 있다. 그럼 1개의 패치와 다른 15개의 패치 간의 어텐션을 수행하는 게 아니라, 비교하려는 패치가 속한 윈도우에 있는 나머지 3개의 패치와의 어텐션만 수행한다.

<figure>
<img src="https://user-images.githubusercontent.com/69252153/216512803-0bb436a1-b47c-4fe2-a33d-e4975dc86fda.png" width="50%">
</figure>

* shifted window scheme
  * 윈도우 위치와 크기가 고정되어 있으면, 전체적 관계를 볼 수 있다는 어텐션의 장점이 퇴색된다. 따라서 이 윈도우를 섞어주는 과정을 추가해 각 패치들이 전역적 정보를 가질 수 있도록 만든다.

<figure>
<img src="https://user-images.githubusercontent.com/69252153/216512838-aab3a7aa-2350-4c21-a263-f12304473701.png" width="50%">
</figure>

* patch merging strategy
  * patch merging(패치를 합친다)은 사실상 patch partitioning(패치를 나눈다)과 같은 맥락이다. 매 swin transformer block 뒤에 merging 단계가 붙는데, 트랜스포머 블럭의 결과로 얻어진 피처맵을 이리저리 변환시키겠단 의미로 이해했다.
  * 기존의 이미지 $H \times W \times C$ 를 몇 개의 픽셀을 가진 패치 $H_p \times W_p \times C$ 로 분할해서 텐서를 다시 만든다($\frac{H}{H_p} \times \frac{W}{W_p} \times (H_p \cdot W_p \cdot C)$)는 뜻이다.

<figure>
<img src="https://user-images.githubusercontent.com/69252153/216512869-4128fa52-eda6-4360-9843-a681747285c6.png" width="70%">
</figure>

**④ 브랜치의 최종 출력을 생성한다.**

DPT에서 사용한 방식처럼, 이 논문에서는 N개의 트랜스포머 레이어에서 나온 피처맵을 샘플링하고 합쳐서 트랜스포머 브랜치의 최종 출력(transformaer feature) $\boldsymbol{F} = \{f^n \}^N_{n=1}$ 으로 만든다. 각 피처맵은 $f^n \in \mathbb{R}^{C_n \times H_n \times W_n}$ 형태이다.

**이 내용을 주지한 채 위 모델 그림을 다시 보자!!!**


## Convolutional Branch

합성곱 브랜치는 기본적인 ResNet 인코더를 사용한다. 그러나 특이한 점은 ResNet 전체가 아닌, 첫 번째 블럭('레이어'가 아니라, conv layer와 residual connection까지 있는 '부분')만 사용한다. 논문에 의하면, 너무 깊은 층을 쌓게 되면 합성곱 연산이 계속되며 연속적인 곱 연산을 하게 되고, 결국 저차원 특징들이 없어지기 때문이다. 물론 블럭을 하나만 쓰기 때문에 연산이 금방 끝나기도 한다.

합성곱 브랜치의 최종 출력(convolution feature)은 $\boldsymbol{G} \in \mathbb{R}^{C_g \times H_g \times W_g}$ 이다. 

- - -

# Neck: HAHI Module

인코더에서 두 개의 브랜치를 사용하는 건 좋지만, 전역적 특징과 국소적 특징 간의 연결성은 부족하다. 이를 그대로 late fusion해서 디코더에 넣는다면 디코더에서 특징을 합치기에(feature aggregation) 충분치 않다. 그래서 둘 사이의 차이를 이어주고자, 혹은 두 브랜치의 좋은 점만 사용하고자, 디코더 전에 모듈 하나를 추가했다. 그것의 이름을 Hirarchical Aggregation and Heterogeneous Interaction(HAHI) Module 이라 한다. 모델 그림에서 초록색 박스에 해당한다.

Element-wise한 상호작용(interaction)을 통해 트랜스포머에서 나온 특징을 향상시키고, 트랜스포머의 피처와 CNN의 피처 간의 affinity(유사, 친근, 유연)를 모델링한다. 이는 set-to-set translation 방식으로 이루어진다.

구체적으로, HAHI 모듈은 그 이름을 둘로 나누어 이해할 수 있고, 그대로 구조가 된다.

* **Hierarchical Aggregation** : **Self-attention Module** for **Feature Enhancement**
  * **트랜스포머 피처**의 계층적 레이어의 특징 개선(enhance)한다.
  * 트랜스포머 브랜치는 Swin Transformer를 사용해 여러 계층(multi-level) 특징맵을 얻었다. 그래서 'Hierarchical'이란 표현을 썼다. 
  * 이러한 게층적 피처맵을 합쳐서 self-attention을 수행한다. Self-attention은 데이터 내부의 것들끼리의 관계를 파악하기 때문에 논문에서 'element-wise interation' 방식라고 부른 것이다.
* **Heterogeneous Interaction** : **Cross-attention Module** for **Affinity Modeling** : 
  * 인코더에서는 두 개의 출력이 나온다. 하나는 트랜스포머 특징, 또 하나는 합성곱 특징이다. 이들은 같다고 말할 수 없는, 그러니까 이종(異種, 다른 종류)의 특징이다.
  * 따라서 이종의 특징끼리 상호작용 시켜 affinity(유사)를 모델링해서 두 특징을 보다 잘 쓰겠단 의도이다.
  * 둘을 상호작용 시키는 방식으로 Cross-attention을 수행한다. Cross-attention은 쿼리를 만든 데이터(여기서는 합성곱 브랜치의 특징)와는 다른 데이터(여기서는 트랜스포머 브랜치의 특징) 간의 관계를 계산하는 것이므로, 이를 'set-to-set translation' 방식이라 부른 것이다.

![image](https://user-images.githubusercontent.com/69252153/216501008-6a9adec0-e6db-4d90-b580-762cef052b09.png)

그림이 좀 무섭게 생기긴 했는데, 아래 설명을 읽어보면 알겠지만 그냥 행렬을 폈다 서로 곱했다 합쳤다하는 연산들이다.


어텐션(gobal attention)의 단점은, 한 픽셀과 다른 모든 픽셀을 비교하기 때문에 그 연산의 비용(메모리 차지)가 매우 크다. 따라서 이를 보완하기 위해 HAHI 모듈 내 어텐션은 Deformable-DETR에서 제시한 deformable attention 기법을 채택했다.


<figure>
<img src="https://user-images.githubusercontent.com/69252153/216510477-04157902-ca27-4dee-ab22-645be7478b6e.png" width="90%">
<figcaption>Deformable Attention의 작동 원리</figcaption>
</figure>

위 그림은 multi-head deformable attention을 간략화한 그림이다. 

간단히만 말하자면 한 픽셀과 다른 모든 픽셀들을 다 엮어보는 기존의 어텐션과는 다르게, '레퍼런스 포인트(회색 피처맵에서 주황색 네모)'로부터 '오프셋(그림 가운데의 화살표 벡터들)'만큼 떨어진 '샘플링 포인트들(레퍼런스 포인트에서 오프셋만큼 움직인 네모들)'만 보겠다는 뜻이다.

이때 레퍼런스 점에서 얼마만큼 움직일지 정하는 '샘플링 오프셋'과 뽑힌 점들에 곱해줄 '어텐션 가중치'는 쿼리 피처을 선형 모델에 태워 만들어낸다. 즉, 학습 가능한 형태(learnable)이다.

이렇게 되면 이미지의 해상도가 높아지거나 판단해야 하는 이미지가 많아질수록 기존의 어텐션보다는 확연히 적은 연산이 수행되어 부담이 줄어든다.

## Feature Enhancement

트랜스포머 브랜치에서 나온 계층적(여러 크기의) 특징맵들 $\boldsymbol{F} = \{f^n \}^N_{n=1}$ 를 향상시키고자 한다. Swin Transfomer에서 특징을 뽑아냈기 때문에 각 피처맵들은 서로 다른 크기와 채널수를 갖는다. 즉, multi-level이다.

이러한 multi-level 특징맵을 처리하기 위해 기존 방식들은 downsampling을 수행했으나, 이는 정보의 손실을 일으킬 수 있다. 그래서 본 논문에서는 아래의 방식으로 처리해 feature enhancement를 진행한다.

**① 1X1 합성곱을 통해 계층적 특성맵들을 같은 채널 $C_h$ 로 맞춘다.**

이 과정이 끝난 상태를 $\boldsymbol{F}_h = \{f^n_h \}^N_{n=1}$ 로 표기한다.

**② 특성맵을 unfold(flatten + concatenation) 해서 2차원의 행렬 $X$ 로 만든다.**

즉, X의 각 행은 특성맵들의 한 픽셀을 나타내는 $C_h$ 차원의 특징 벡터이다.

**③ $X$를 선형 투영(linear projection)해 Query, Key, Value를 만든다.**

$\boldsymbol{P}_Q, \boldsymbol{P}_K, \boldsymbol{P}_V$ 를 쿼리, 키, 밸류 각각의 선형 투영을 하는 행렬이라고 했을 때, $\boldsymbol{Q} = X\boldsymbol{P}_Q, \boldsymbol{K} = X\boldsymbol{P}_K, \boldsymbol{V} = X\boldsymbol{P}_V$ 로 쿼리와 키, 밸류를 만들 수 있다.

**④ deformable self-attention으로 피처를 향상시켜 $\hat{\boldsymbol{X}}$ 로 만든다.**

key sampling vector 몇 개로 제한해서 그것에 대해서만 어텐션을 수행하는 방식이다. 몇 개의 key 점이 그 장면의 구조를 나타내기 때문에, 깊이 추정에선 deformable attention이 유용하게 쓰일 수 있다. 

구체적인 어텐션 수식은 아래와 같다. $x_q \in \boldsymbol{Q}, x_v \in \boldsymbol{V}$ 이며, $p_q$ 는 쿼리 벡터 $x_q$ 의 위치, $A_{qk}$ 는 쿼리에서 선형 투영으로 만든 어텐션 가중치, $\triangle p_{qk}$ 는 쿼리에서 선형 투영으로 만든 k 번째 샘플링 포인트의 오프셋이다.

$$
\mathrm{DeformAttn}(x_q, x_v, p_q) = \sum \limits_{k \in \Omega_k} A_{qk} \cdot x_v (p_q + \triangle p_{qk})
$$

어떤 계층(level)에서 만들어진 특성맵인지를 표시하기 위해 hierarchical embedding을 추가했다.

{% include inserted_box.html text="Transformer, ViT 등 트랜스포머 모델에서는 패치 단위로 잘라 연산하기 때문에 위치 정보가 없다. 따라서 positional encoding으로 위치 정보를 함께 인코딩해 레이어의 입력으로 넣는다. 위 hierarchical embedding도 같은 의미로 이해하면 된다. 어떤 층에서 왔는지를 명시하기 위해 더해주는 값이라고 생각하면 된다." %}

**⑤ $\hat{\boldsymbol{X}}$ 를 fold(split + reshape) 해서 다시 원래의 해상도(크기)로 복원한다.**

아까 합쳐서 어텐션을 수행했으니, 이젠 그걸 다시 나누는 작업인 것이다. 입력과 동일한 크기로 복원한다 생각하면 된다. 이를 $\boldsymbol{F}_{enh}$ 라 표기한다.

**⑥ channel 별로 $\boldsymbol{F}_{enh}$ 와 $\boldsymbol{F}$ 를 concatenate해 합치고, 1X1 합성곱 연산을 거친다.**

이렇게 되면 진짜 최종적인 '향상된 특징' $\boldsymbol{F}_o = \{f^n_o \}^N_{n=1}$ 를 얻는다.


## Affinity Modeling

affinity modeling을 위해 합성곱 브랜치에서 만들어낸 피처맵 $\boldsymbol{G}$를 입력으로 받는다.

**① 1X1 합성곱 연산으로 $\boldsymbol{G}$ 을 $C_h$ 차원으로 투영한다.** 이를 $\boldsymbol{G}_h$ 라 표기한다.

**② $\boldsymbol{G}_h$ 를 2차원의 쿼리 행렬 $\boldsymbol{Q}$로 펼친다.** 

**③ Cross-attention을 수행해 affinity를 모델링한다.**

앞선 [트랜스포머 특징의 가공](#feature-enhancement)처럼, $\boldsymbol{K, V}$ 처럼 $\hat{X}$ 를 적용해 cross-attention을 한다. 

본인의 데이터 안에서 서로서로의 연관성을 만들어내는 self-attention과는 달리, cross-attention은 서로 다른 것끼리의 연관성을 만들어낸다. 트랜스포머 특징 가공 시에는 그래서 self-attention을 수행해 자기내들 안에서 특징을 가공했다면, affinity modeling의 목적은 트랜스포머와 CNN 브랜치에서 나온 특징들을 잘 섞는 것이기 때문에 cross-attention을 사용했다. 즉, CNN 특징을 기준으로 트랜스포머 특징과의 관계를 계산한다고 보면 된다.

여기서도 메모리 효율을 위하여 deformable attention 방식으로 진행한다. 레퍼런스 포인트 위치인 $p_q$ 가 affinity query embedding으로부터 학습 가능한 선형 투영과 시그모이드 함수를 통해 동적으로 예측된다. (가중치를 업데이트하는 신경망 하나를 거쳐 만들어낸단 소리다.) 이렇게 만들어낸 특징을 attentive representation, $\boldsymbol{G}_{att}$ 라고 적는다.

**④ $\boldsymbol{G}_{att}$ 을 원래 해상도로 reshape해 복원해놓는다.**

**⑤ $\boldsymbol{G}_{att}$ 와 $\boldsymbol{G}$ 를 채널별로(channel-wise) 합치고(concatenation), 1X1 합성곱 연산으로 최종 결과인 $\boldsymbol{G}_o$ 를 만든다.**


위와 같은 과정을 통해 HAHI 모듈의 두 번째 결과물이 만들어지는 것이다. Affinity modeling 과정을 통해 트랜스포머와 CNN 브랜치 간의 피처의 상호작용을 담아낼 수 있다.

- - -

# Decoder, Optimization

HAHI 모듈의 출력 $\boldsymbol{F}_o, \boldsymbol{G}_o$ 은 디코더로 넘어가 본격적인 깊이 추정을 해낸다. 디코더는 특별한 디자인 없이 기본적인 모델을 사용했으며, 이는 연속적인 up convolution layer로 이루어져 있다. 모델 그림에서 우측 회색 테두리 박스에 해당한다.

네트워크의 최적화를 위한 손실 함수는 아래와 같이 생겼다. 여기서 $h_i = \log \hat{d}_i - \log d_i$ 로, 예측값에서 정답값을 뺀 값을 말한다. $T$ 는 (정답이 존재하는) 픽셀의 개수이다. 상수계수는 $\lambda=0.85, \alpha=10$ 으로 설정했다.

$$
\mathcal{L}_{pixel} = \alpha \sqrt{\cfrac{1}{T} \sum \limits_i h_i^2 - \cfrac{\lambda}{T^2} \left( \sum \limits_i h_i \right)^2}
$$

식을 나름대로 해석해보자면, 오차의 제곱의 합을 평균낸 것에서, 오차의 합을 제곱해 평균낸(정확하진 않음) 느낌이다. 마치 분산($Var(X) = E[X^2] - E[X]^2$)이 떠오른다.

- - -

# Experiments

{% include inserted_box.html text="Implementation Detail은 생략하겠다. 어떤 GPU를 썼고 어떤 최적화를 썼는지는 이 논문으로 실험을 하지 않을 이상 굳이...." %}

## Dataset

실험에서는 아래와 같이 3 종류의 데이터셋을 사용했으며, 각각의 주요 특징과 이 논문에서의 사용 방향을 기술해두었다.

* **KITTI**
  * 자율주행 연구에서 빈번하게 사용되는 데이터셋이다. 양안 카메라와 3차원 라이다 데이터가 제공된다.
  * Standard Eigen training/test split 을 따라, 이 논문의 저자들은 2만 6천 개의 왼쪽 이미지(양안 카메라의 왼쪽)를 훈련에 사용했으며, 697개를 테스트에 사용했다.
  * 평가(eval) 시에는 예측된 깊이추정맵을 crop & upsampling 해 원래 사진의 해상도와 맞췄다. 이는 기존 연구 방식을 따른 것이다.
  * 온라인 벤치마크에 깊이 추정을 시험할 때는 official benchmark split을 사용했다. 7만 2천 개의 학습 데이터, 6만 개의 검증 데이터, 500개의 테스트 데이터를 사용했다.

<figure>
<img src="https://user-images.githubusercontent.com/69252153/216501684-615b231f-f90c-48bf-8d02-f6aadf1ab31a.png" width="50%">
</figure>

* **NYU-Depth-v2**
  * 야외 데이터셋인 KITTI완 다르게 실내 사진을 가진 데이터셋이다.
  * 5만 개로 학습을 진행했다.
  * 결과로 나오는 깊이추정맵은 데이터셋의 이미지 크기의 절반(640 x 480 → 320 x 240)이고 최대 10m까지만 추정이 가능하다. 이 결과를 정답과 비교하기 위해, 해상도를 정답과 맞추려 2배로 upsampling한다.
  * 평가(eval) 시에는 center-cropping한 깊이추정맵을 사용했다. 이는 기존 연구 방식을 따른 것이다.
  * 만들어낸 깊이추정맵을 가지고 다시 3차원 공간을 생성해낸 실험도 진행했다. 즉, 실제 공간과 유사할수록 깊이를 잘 추정한 것이다. (상당히 재밌는 실험인 것 같다 😆)

![image](https://user-images.githubusercontent.com/69252153/216501221-3d38729c-11ce-4c46-aa43-b987ba8907e8.png)

<figure>
<img src="https://user-images.githubusercontent.com/69252153/216501413-8d3aeaf1-6e31-40ff-8696-5d66b8b5486e.png" width="50%">
</figure>

* **SUN RGB-D**
  * 이 역시 실내 데이터셋이다. 이 논문에서는 일반화 성능을 검증하기 위해 사용했다.
  * NYU 데이터셋으로 사전 학습된 모델을 5,050 개의 이미지에 교차검증했다. 평가(eval)에만 사용하고, 모델을 학습시키는 데는 사용하지 않았다.
  * 추정할 수 있는 최대 깊이는 10m이다.

<figure>
<img src="https://user-images.githubusercontent.com/69252153/216501850-4de6a623-a0df-40e1-9234-b5b2bf5fb562.png" width="50%">
</figure>

## Metrics

깊이 추정에는 다양한 측정 방식이 존재한다. 아래엔 이 논문에서 사용한 측도들을 나타냈다. 높을수록 추정이 잘 됨을 나타내는 지표들은 ↑표시, 반대로 낮을수록 좋은 지표들은 ↓표시 하겠다.

1~6번은 NYU, KITTI Eigen Split, SUN RGB-D 에 사용했으며, 7~10번은 online KITTI benchmark 에 사용했다.

자세한 설명은 [이전 포스트](https://winterbloooom.github.io/ai/computer%20vision/2022/07/15/depth_estimation.html#evaluation-metrics)에서 찾아볼 수 있다.

* Accuracy Under the Threshold ↑ : 오차가 $thr = \alpha^{t} (t=1,2,3,\ \alpha=1.25)$ 이내인 픽셀의 비율 $\delta_1, \delta_2, \delta_3$

$$
\% \ \mathrm{of} \ y_p\ \mathrm{s.t.}\ \max(\frac{y_p}{y_p^*}, \frac{y_p^*}{y_p}) = \delta < thr
$$

* AbsRel ↓ (Mean Absolute Relative Error) : 오차의 평균. 상대 오차 파악.

$$
\frac{1}{N} \sum \limits_{i=1} ^N \frac{ \left| y_i - y_i^* \right|}{y_i^*}
$$

* SqRel ↓ (Mean Squared Relative Error) : 차이의 제곱을 평균. 상대 오차 파악.

$$
\frac{1}{N} \sum \limits_{i=1} ^N \frac{ || y_i - y_i^* || ^2}{y_i^*}
$$

* RMSE ↓ (Root Mean Squared Error) : 차이의 제곱의 평균의 제곱근

$$
\sqrt{\frac{1}{N} \sum^{N} \limits_{i=1} \left( y_i - y^*_i\right) ^2}
$$

* RMSElog ↓ (Root Mean Squared Log Error) : RMSE에 log에서 비교한 것

$$
\sqrt{\frac{1}{N} \sum^{N} \limits_{i=1} \left( \log y_i - \log y^*_i\right) ^2}
$$

* log10 ↓ (Mean log10 Error) : log 차이를 평균

$$
\log_{10} = \frac{1}{N} \sum \limits_{i=1} ^N \left| \log_{10} y_i^* - \log_{10} y_i\right|
$$

* SILog ↓ (Scale-Invariant Log-arithmic Error) : scale과 무관하게 두 점 간의 오차를 계산하기 위하여 고안됨. 

$$
\begin{aligned}
  &\alpha \left( y, y^{*} \right) = \frac{1}{n} \sum \limits_{i=1} ^N \left( \log y_i^{*} - \log y_i \right) \\
  &d_i = \log y_i - \log y_i^* \\
  &\frac{1}{2N} \sum \limits_{i=1} ^N \left( \log y_i - \log y_i^* + \alpha \left( y, y^* \right) \right) ^2 \\
  &\frac{1}{n} \sum \limits_{i=1} ^N d_i^2 - \frac{1}{n^2} \left( \sum  \limits_{i=1} ^N d_i\right) ^2
\end{aligned}
$$

* absErrorRel ↓ (Percentage of AbsRel)
* sqErrorRel ↓ (Percentage of SqRel)
* iRMSE ↓ (Root Mean Squared Error of the Inverse Depth)

## SOTA 와 비교

깊이 추정 task에서는 평가를 진행할 때 주로 깊이의 범위(range)를 나눈다. 가까운 거리의 물체와 먼 거리의 물체의 정확도를 구분해서 보겠다는 의도이다. 0-20m, 20-60m, 60-80m로 나누어두었다.

비교의 기준으로 삼는 모델은 Adabins로 했다. NYU-Depth-v2에서 Ababind보다 물체의 경계를 보다 선명하게 잡아냈고, 교차검증을 실시간 SUN RGB-D에선 매우 어두운 이미지에서도 정확한 깊이 추정을 했다고 한다.

비교 사진은 데이터셋 소개에서 이미 보였다.

## Ablation Study

NYU, KITTI 데이터셋으로 진행한 ablation study 중 몇 가지만 추려 보겠다.

* **주요 요소들의 효과 검증하기**: Resnet-50, Swin Transformer를 백본으로 삼고, 여기에 (1) HAHI 모듈과 (2) 합성곱 브랜치, (3) 더 큰 사전 학습 데이터 이 세 가지에 대해 사용 여부를 비교해가며 성능을 살펴보았다.
* **합성곱 브랜치의 구조**
  * 앞선 설명에서, 합성곱 브랜치는 층을 깊게 쌓지 않고 오직 하나의 블럭만 사용한다고 했다. 
  * Ablation study 에서 실제 실험 결과가 나오는데, 블럭을 계속 추가할수록 성능이 나빠졌다. 
  * 그 이유를 저자들이 추측하기를, CNN의 연속적인 합성곱 연산을 계속하면 저차원의 특징들이 없어지고, 공간적 해상도가 낮아지면서 세세한(fine-grained) 정보가 버려지기 때문이라고 한다.
  * 그래서 해당 논문에선 블럭을 하나만 사용함으로써 중요한 국소적 정보들은 유지하면서도 복잡도를 낮춤으로써 정확도를 최적화했다.
* **HAHI 모듈의 효과**
  * 앞서 보았듯, HAHI 모듈은 트랜스포머 특징에 deformable self-attention(DSA)를, 합성곱 특징에 deformable cross-attention(DCA)를 적용했다. 이 효과를 검증하기 위한 실험이다.
  * Multi-level DSA (계층적 피처에 대한 DSA) 가 하나의 계층만 가진 피처를 사용할 때보다 성능이 좋았다.
  * Multi-level의 DSA와 DCA를 함께 사용했을 때 성능이 좋다. 둘 모두가 있어야 이종 간의 상호작용이 일어난다. 즉, 이종의 특징 간에는 불일치(discrepancy)가 많기에, 이를 보완해주는 작업이 필요하다.

- - -

# 정리

맨 처음 main contribution 내용에 살을 붙여 정리한다. (나름의 비결이랄까.)

* 이미지에서 특징을 추출하는 인코더에 2개의 브랜치를 사용했다.
  * 하나는 long-range correlation을 추출하는 트랜스포머 브랜치이다. Swin Transformer을 사용해 여러 계층의 특징맵(multi-level features)을 얻는다(계층적(hierarchical) 특징맵)
  * 다른 하나는 local information을 보존하는 합성곱 브랜치이다. Residual block 하나만 사용해 저차원 특징을 보존하고 연산 부하를 줄인다.
* HAHI 모듈을 만들었다.
  * 두 개의 브랜치는 서로 독립되어 있어 이들을 late fusion 방식으로 합치면 디코더에서 feature aggregation하기 충분히 좋지 않다.
  * 트랜스포머 브랜치에서 나온 다층의 특징들은 self-attenton, 즉 element-wise interaction으로 향상시킨다.
  * 합성곱 브랜치에서 나온 특징들은 cross-attention, 즉 set-to-set translation 방식으로 서로 브랜치 간의  특징 유사도를 모델링한다. (이종(heterogeneous) 상호작용)
  * 모듈에 사용한 어텐션들은 deformable 방식을 사용해 연산 부하를 줄인다.
* DepthFormer를 KITTI, NYU, SUN RGB-D 데이터셋에서 검증했으며, SOTA 모델을 넘어서는 좋은 성능을 보였다.

- - -

# 추가 참고 자료

* VISION HONG, [[논문리뷰] Swin Transformer](https://visionhong.tistory.com/31)
* re-code-cord, [Inductive Bias란 무엇일까?](https://re-code-cord.tistory.com/entry/Inductive-Bias%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%BC%EA%B9%8C)
* [End-to-End Object Detection with Transformers](https://arxiv.org/abs/2005.12872)
  * Deformable Attention을 제시한 DETR 모델