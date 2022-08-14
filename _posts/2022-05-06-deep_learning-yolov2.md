---
title:  "[Paper Review] YOLO9000: Better, Faster, Stronger"
excerpt: "YOLOv2 모델 논문 리뷰"

categories:
  - Deep Learning
tags:
  - Deep Learning
  - Object Detection
  - Papaer Review
  - Computer Vision
last_modified_at: 2022-05-06

use_math: true
toc: true
tock_sticky: true
toc_label: "Contents"
---

# ⭐ Information

- **Title: YOLO9000: better, faster, stronger**
- **Authors:** Redmon, J., & Farhadi, A.
- **Source:**  Proceedings of the IEEE conference on computer vision and pattern recognition(2017) (pp. 7263-7271)

---

# Abstract

이 논문에서 제안하는 YOLO9000은 <span style="background-color: #fff5b1">**실시간 객체 탐지 시스템으로, 9천 개의 객체 카테고리를 탐지할 수 있다.**</span> 

향상된 모델인 YOLOv2는 PASCAL VOC와 COCO 데이터셋에 대해 표준 탐지 임무를 수행한다. <span style="background-color: #fff5b1">**객체 탐지와 분류를 위한 학습을 함께 수행하는 방식**</span>을 제안한다. YOLO9000을 COCO 탐지 테이터셋과 ImageNet 분류 데이터셋에 대해 학습시켰다.

- - -

# 1. Introduction

대부분의 객체 탐지 방법들은 발전하고 있지만 여전히 작은 객체들에 대해서는 제약을 받고 있다.

<span style="background-color: #fff5b1">**분류를 위한 대량 데이터를 이용**</span>하고 탐지 시스템의 범위를 확장하는 데 이용할 새 방식을 제안한다. 이에 <span style="background-color: #fff5b1">**서로 다른 데이터셋들을 결합하는 계층적 방식**</span>을 사용한다. 또한 객체 탐지와 분류를 학습할 학습 알고리즘을 제안한다. 

이러한 방식들을 사용해 YOLO9000을 학습시킨다. 먼저, <span style="background-color: #fff5b1">**실시간 탐지기인 YOLOv2를 제작하기 위해 YOLO 탐지 시스템을 기반으로 개선을 진행**</span>했다. 그 후엔 이 논문에서 <span style="background-color: #fff5b1">**제안된 데이터셋 결합 방식을 사용**</span>했으며, <span style="background-color: #fff5b1">**9천 개 이상의 클래스들에 대해 ImageNet과 COCO의 탐지 데이터로 모델을 학습시키기 위해**</span> 학습 알고리즘을 결합했다.

링크([https://pjreddie.com/darknet/yolo/](https://pjreddie.com/darknet/yolo/))에서 코드와 사전 훈련 모델을 볼 수 있다.

- - -

# 2. Better

<span style="background-color: #fff5b1">**기존의 YOLO는 많은 localization 에러를 가지고 있었고, 지역 제안 기반(region proposal-based)의 방법들보단 상대적으로 낮은 recall을 가졌다.**</span>

> **Region proposal** :
물체가 있을 만한 영역을 빠르게 찾는 알고리즘. 객체의 위치를 찾는 localization을 위한 알고리즘이다. Selective search, Edge boxes 등이 그 예이다. Crop과 Wrap을 적용해 region 영역을 제안한다.
> 

> **Recall (재현율)** :
실제 정답 중에 모델이 정답이라고 판단한 비율을 말한다. 수식으로는 아래와 같다.
$\mathrm{Recall = \cfrac{True Positive}{TruePositive + Fasle Nagative}}$
> 

> **Precision (정밀도)** :
모델이 정답이라고 판단한 것 중에 실제 정답의 비율을 말한다. 수식으로는 아래와 같다.
$\mathrm{Precision = \cfrac{True Positive}{TruePositive + Fasle Positive}}$
> 

신경망의 층을 깊게 쌓기보단 네트워크 구조를 단순화하고 학습을 위한 표현을 더 쉽게 만들었다.

<span style="background-color: #fff5b1">**YOLO의 성능 향상을 위한 방법들**</span>이 논문에서 제시되고 있으며 아래 표는 각 방법들을 적용한 결과를 요약한 표이다.

![image](https://user-images.githubusercontent.com/69252153/184532522-0f80feac-b4ff-489d-b0a4-269d5bbcd485.png){: .align-center}{: width="50%", height="50%"}


## **Batch Normalization (배치 정규화)**

배치 정규화는 <span style="background-color: #fff5b1">**수렴을 돕는데 상당한 효과**</span>를 보였다. <span style="background-color: #fff5b1">**YOLO의 모든 합성곱층에 배치 정규화를 추가함**</span>으로써 2% mAP의 성능 향상을 보였고, 모델을 정규화했다. 이로써 모델에서 <span style="background-color: #fff5b1">**오버피팅 없이 dropout을 제거**</span>했다.

> **Batch Normalization (배치 정규화)** : 
활성화함수 전후에 적용한다. 입력을 원점에 맞춰 정규화하고, 결괏값의 스케일 조정과 이동에 사용할 파라미터 두 개를 각각 사용한다. 기울기 소실과 폭주 문제를 막기 위한 방법으로 2015년 제안되었다.
> 

> **mAP (Mean Average Precision) :**
객체 탐지기(object detoctor)의 정확도를 측정하는 평가 지표 중 하나이다. 정밀도와 재현율을 고루 고려하기 위해 각각을 축으로 하는 그래프의 하부 면적을 Average Precision(AP)로 하고, mAP는 각 클래스(카테고리)에 대한 AP의 평균으로 구한다.
> 

## **High resolution Classifier**

이전 YOLO는 분류 신경망을 224 X 223 크기에서 훈련을 시켰고, 탐지를 위해 448로 해상도를 증가시켰다. 이는 네트워크는 학습 객체 탐지를 하면서 새로운 입력 해상도로 동시에 전환해야 함을 의미한다. - 솔직히 맞는 번역인지 모르겠다.

YOLOv2에서는 분류 네트워크를 10에폭 동안 <span style="background-color: #fff5b1">**448 X 448 해상도에서**</span> 미세하게 조정한다. 그 뒤엔 탐지에 대한 결과 네트워크를 미세하게 조정한다. 이로써 4% mAP 증가를 이루었다.

## **Convolutional With Anchor Boxes.**

<span style="background-color: #fff5b1">**완전 연결층(fully connected layer)를 YOLO에서 제거하고 바운딩 박스를 예측하기 위해 앵커 박스를 사용했다.**</span>

> 완전연결층을 사용하면 이미지의 차원 정보가 없어진다.

먼저, <span style="background-color: #fff5b1">**합성곱층의 출력을 높은 해상도로 만들기 위해 하나의 풀링층(pooling layer)를 제거했다.**</span> 또한 448 X 448가 아닌 <span style="background-color: #fff5b1">**416 X 416의 입력 이미지에 작동시키기 위해 네트워크를 줄였다.**</span> 하나의 중심 셀(cell)을 남기기 위해 <span style="background-color: #fff5b1">**특징맵(feature map)에 홀수 개의 위치(location)만 남기기 위한**</span> 조치였다. YOLO의 합성곱층은 32배의 비율로 다운샘플하여, 416 X 416의 입력 이미지에서 <span style="background-color: #fff5b1">**13 X 13 의 특징맵을 출력으로 내보낸다.**</span>

> 여기서 13 X 13이 격자(grid)로 이용된다.

앵커 박스로 이동할 때 클래스 예측 매커니즘을 공간적 위치로부터 분리하고, 대신 <span style="background-color: #fff5b1">**모든 앵커 박스에 대해 클래스와 객체 존재 여부(objectness)를 예측한다.**</span>

<span style="background-color: #fff5b1">**objectness 예측에는 ground truth와 제시된(proposed) 박스 사이의 IOU를 이용하고, 클래스 예측은 객체가 존재할 때 그 클래스의 조건부 확률을 예측한다.**</span>

앵커 박스를 이용함으로써 약간의 정확도 하락은 있다. mAP가 감소하긴 하지만 recall이 증가하므로, 여전히 개선의 여지가 있다고 한다.

## **Dimension cluster**

YOLO에 앵커 박스를 사용할 때 두 가지 문제가 있다. 첫 번째로, 박스의 차원을 직접 고른다(hand picked)는 것이다. 네트워크가 박스들을 조정하긴 하지만, 처음부터 더 나은 선택을 해 시작한다면 학습을 더 쉽게 할 수 있을 것이다. 이들을 선택(choosing priors by hand)하기보다는 <span style="background-color: #fff5b1">**k-평균 알고리즘(k-means clustering)을 학습 데이터셋의 바운딩 박스에 적용해 자동적으로 좋은 앵커 박스를 찾게 한다.**</span>

> 여기서 <span style="background-color: #fff5b1">**prior(prior box)**</span>이란 단어가 나온다. 앵커 박스와 비슷한 의미로 보면 될 것 같다. 앵커 박스 후보들을 여러 개 찾고 그 중에서 오프셋을 예측해 ground truth와 비교해나가는 과정이므로, ‘사전에’나 ‘이전에’의 의미를 갖는 prior은 실제 바운딩 박스를 예측하기 전에 사용되는 박스의 개념으로 보는 것이다. 네트워크가 학습을 해 나가며 prior, 즉 앵커 박스보다 더 객체 크기에 꼭 맞는 위치와 크기를 갖게 된다. (ground truth에 맞게 앵커 박스의 크기가 조정된다)

유클리드 거리로 표준 k평균을 사용하게 되면 큰 박스는 작은 박스보다 큰 에러를 낸다. 그러나 우리가 원하는 prior은 박스 크기에 독립적으로 좋은 IOU 점수를 내는 prior이다. 따라서 여기서의 측정법(metric)은 아래와 같은 수식을 이용한다.

$$
d(\mathrm{box, centroid}) = 1 - \mathrm{IOU(box, centroid)}
$$

여러 개의 k(클러스터의 개수)를 사용해 k 평균을 수행해 평균 IOU를 그려보았을 때 다음과 같은 결과를 얻었다.

실험 결과로는 k=5에서 모델의 복잡도와 recall 사이의 균형이 좋았다. 오른쪽 상자는 VOC와 COCO 데이터셋에서 상대적인 클러스터의 중심점(centroid)를 나타낸 것인데, hand-picked 일 때보다 더 좁고 길거나 넓고 짧았다.

![image](https://user-images.githubusercontent.com/69252153/184532561-e3fee7d1-bd0c-422e-9453-af4cdf53b9b6.png){: .align-center}

박스를 만드는 방법 별로 평균 IOU를 비교해 보았을 때, <span style="background-color: #fff5b1">**클러스터링을 쓰는 것이 hand-picked보다 좋은 prior을 만들어 더 빠른 학습을 하게 했다.**</span>

## Direct location prediction

앵커 박스를 사용할 때 마주할 수 있는 두 번째 문제점은, 모델의 불안정성(특히 초기 반복 단계에서)이다. 대부분의 <span style="background-color: #fff5b1">**불안정성은 박스의 위치(x, y)를 예측하는 데서 온다.**</span>

지역 제안(region proposal) 네트워크는 $t_x$와 $t_y$를 예측하고, 그리드의 중심인 (x, y) 위치는 아래와 같이 계산된다.

$$
x = (t_x * w_a) - x_a \\ y = (t_y * h_a) - y_a
$$

t 값만큼 앵커 박스의 가로/세로 길이에 대해 박스를 이동시킨다. 이 공식으로 박스 예측 위치와 관계 없이 박스는 이미지 내 어느 곳이든지 위치할 수 있다. 모델을 랜덤 초기화하면 정교한 오프셋을 예측하기 위한 안정성에 도달하기까지 오랜 시간이 걸린다.

오프셋을 예측하는 것 대신, <span style="background-color: #fff5b1">**YOLO에서는 격자칸에 상대적인 좌표를 예측하는 것**</span>을 택했다. 이는 ground truth를 [0, 1]의 범위가 되게 한다. 로지스틱 활성화를 사용해 네트워크의 예측도 이 범위로 떨어지게 했다.

네트워크는 출력 특징맵에서 <span style="background-color: #fff5b1">**각 칸마다 5개의 바운딩 박스를 예측**</span>한다. 모델의 출력으로서 <span style="background-color: #fff5b1">**각 바운딩 박스에서는 5개의 좌표를 예측하는데, 그것은 $t_x, t_y, t_w, t_h, t_o$**</span>이다. 격자칸이 <span style="background-color: #fff5b1">**왼쪽 상단으로부터 $(c_x, c_y)$만큼 떨어져 있고(offset), 바운딩 박스 prior이 $p_w, p_h$의 너비와 높이**</span>를 가지고 있다고 할 때 예측은 아래 공식으로 이루어진다.

$$
b_x = \sigma(t_x) + c_x \\ b_y = \sigma(t_y) + c_y \\ b_w = p_w e^{t_w} \\ b_h = p_h e^{t_h}
$$

$$
Pr(\mathrm{object}) * IOU(b, \mathrm{object}) = \sigma (t_o)
$$

![image](https://user-images.githubusercontent.com/69252153/184532572-255dd154-c94a-45aa-86d0-cf265969596b.png){: .align-center}{: width="80%", height="80%"}

> $\sigma()$는 활성화함수인 시그모이드 함수로 [0, 1] 사이의 범위로 정규화를 시킨다.

위치 예측을 제한하기 때문에 파라미터화는 학습에 더 쉬워지고 네트워크를 안정적이게 만든다. 직접적으로 바운딩 박스 중심 위치를 예측하고 그와 동시에 차원 클러스터를 함께 사용하는 것은 YOLO를 앵커 박스를 사용하는 버전보다 5% 정도 향상되게 했다.

> 정리하자면, 앵커 박스의 중심으로부터의 오프셋값으로 박스의 너비와 높이를 예측하고, 박스의 중심 위치는 시그모이드 함수를 사용해 예측한다.

## Fine-Grained Features

이 개선된 YOLO는 탐지 예측을 13 x 13 특성맵에서 실시한다. 이것은 큰 객체에 대해서는 문제가 없으나, <span style="background-color: #fff5b1">**작은 객체의 위치를 예측할 때는 더 작게 나누어진(fine-grained) 특성맵이 유리할 것이다.**</span>

YOLO에서는 <span style="background-color: #fff5b1">**통과 레이어(passthrough layer)를 추가해 26 x 26 크기의 이전 레이어를 가져오는 식**</span>으로 접근했다.

<span style="background-color: #fff5b1">**passthrough layer은 높은 해상도의 피처(레이어)를 낮은 해상도의 피처와 결합(concatenate)하는데, 이때 인접 피처를 다른 채널로 쌓는(stack) 방식을 사용한다.**</span> 이로서 26 x 26 x 512 특성맵이 13 x 13 x 2048 크기로 변환되고, 이로써 원본 피처와 결합(concatenate)될 수도 있다. 탐지기(detector)는 이 확장된 특성맵에서 작동해 더 정교한 피처에 접근할 수 있게 된다.

![image](https://user-images.githubusercontent.com/69252153/184532605-2ce37d4b-76c3-468d-b6e4-d7235e9818b2.png){: .align-center}


## Multi-Scale Training

이전 YOLO는 448 x 448 크기의 해상도를 사용했고, 앵커 박스를 더함으로서 416 x 416으로 변경했다. 그러나 이 모델은 합성곱과 풀링층만 사용하기 때문에 그때 그때 사이즈를 변경할 수 있다. 

<span style="background-color: #fff5b1">**다른 입력 사이즈에 대해서도 잘 작동하게 하기 위해 모델에 학습**</span>을 시켜줬는데, 매 10 배치마다 이미지의 차원을 랜덤하게 선택했다. 다운샘플링이 32의 배수로 일어나므로 32의 배수만큼(320, 352, ... , 608) 차원 수 변경을 진행했다. 따라서 최소 크기는 320 x 320, 최대 크기는 608 x 608이다.

이로써 <span style="background-color: #fff5b1">**같은 네트워크에서도 다른 해상도의 이미지로 탐지 예측을 가능케 했다.**</span> 작은 사이즈의 이미지를 사용하면 더 빠르고, 큰 사이즈를 사용해도 여전히 실시간 탐지를 할 정도로 속도가 빨랐다.

- - -

# 3. Faster(가속시키는 법)

로보틱스나 자율주행 분야에서는 낮은 지연(low latency)가 요구된다.

대부분의 탐지 프레임워크들은 기본 특징 추출기로 VGG-16을 사용한다. VGG-16은 매우 강력하고 분류를 정확히 수행하나 매우 복잡하다. YOLO에서는 GoogLeNet에 기반한 커스텀 네트워크를 사용했었는데 이는 VGG-16보단 빠르지만 정확도는 더 낮았다.

## Darknet-19

해당 논문에서는 <span style="background-color: #fff5b1">**YOLOv2의 베이스로 사용할 새로운 분류 모델인 Darknet-19를 제안했다.**</span>

VGG 모델과 유사하게, <span style="background-color: #fff5b1">**대부분 3 x 3 필터를 사용했고, 풀링층 다음엔 채널 수를 2배로 증가시켰다.**</span>

Network In Network(NIN)처럼 <span style="background-color: #fff5b1">**global average pooling(전역 평균 풀링)을 사용했으며, 특징맵을 압축하려 3 x 3 합성곱층 사이에 1 x 1 필터를 사용했다.**</span>

<span style="background-color: #fff5b1">**배치 정규화**</span>를 사용해 학습을 안정화시키고 수렴을 빠르게 했으며 모델을 정규화시켰다.

Darknet-19는 <span style="background-color: #fff5b1">**19개의 합성곱층과 5개의 맥스 풀링층을 가지고 있다.**</span>

![image](https://user-images.githubusercontent.com/69252153/184532630-d258518b-5dea-45fc-8b56-be8f43cf4bdd.png){: .align-center}{: width="50%", height="50%"}


## Training for classification

- 데이터셋: standard ImageNet 1000 class classification dataset
- 160 에폭
- stochastic gradient descent
- 시작 학습률 0.1
- 4의 제곱으로 polynominal rate decay
- 0.0005로 weight decay
- 모멘텀 0.9
- data augmentation : random crops & rotations, hue & saturation & exposure 변경

## Trainig for detection

탐지를 위해 모델을 변경했다. <span style="background-color: #fff5b1">**마지막 합성곱층을 없애고, 대신 세 개의 3 x 3 x 1024 합성곱 레이어를 추가했으며, 그 뒤로 마지막 1 x 1 x (box수 * (class수 + 1 + 4))합성곱층을 추가해 탐지에 필요한 클래스 개수만큼의 출력을 내도록 했다.**</span> VOC 데이터셋에 대해서 <span style="background-color: #fff5b1">**5개의 박스에 5개씩 좌표를 예측하고, 각 박스 당 20개의 클래스를 판단하므로 총 125개의 필터가 생긴다.**</span>

> 한 박스 당 ‘5개 좌표 + 20개 클래스 = 25개 예측’이므로 5개 박스면 → (5개 박스 x 25개 예측) = 125개 이다.

> 인터넷에 흔히 보이는 아래 사진을 보면 이해가 쉽다. $p_o$는 objectiveness 확률이고, $p_1, p_2, \cdots, p_c$는 각 클래스에 속할 확률이다.

![image](https://user-images.githubusercontent.com/69252153/184532653-38b91a8e-7aa1-46f5-a751-0ee58f12ac1b.png){: .align-center}


<span style="background-color: #fff5b1">**최종 3 x 3 x 512 레이어에 의한 passthrough 층을 마지막에서 두 번째의 3 x 3 x 1024 레이어의 출력과 concat한다.**</span>

- - -

# 4. Stronger

학습을 할 때 <span style="background-color: #fff5b1">**분류용과 탐지용 데이터셋을 모두 사용한다.**</span> 분류용 데이터셋을 다룰 때는 손실을 모델의 분류 파트(classification-specific)에만 전파한다. 그러나 이 접근에는 문제가 있다. <span style="background-color: #fff5b1">**탐지용 데이터셋은 일반적인(common, general) 객체와 라벨들만 있는 반면, 분류용 데이터셋의 라벨은 더 광범위하고 깊다.**</span> 가령 탐지용에서는 ‘개’ 일 뿐인 것이, 분류용에서는 ‘요크셔 테리어’, ‘베들링턴 테리어’ 등으로 구분한다. <span style="background-color: #fff5b1">**두 종류의 데이터셋을 훈련시키려면, 이 라벨들을 합쳐야 한다.**</span>

분류에서는 대부분 소프트맥스 층을 사용해 각 카테고리에 대한 최종 확률 분포를 계산한다. 소프트맥스를 사용하기 위해서는 각 클래스들이 상호 배타적인(mutually exclusive)하다는 전제가 필요하다. 그러나 분류용과 탐지용 데이터셋의 경우에는 ‘요크셔 테리어’와 ‘개’가 상호 배타적인 관계가 아니므로 단순히 결합할 수는 없다.

따라서 저자들은 다중 라벨 모델(multi-label model)을 사용해 데이터셋을 결합하였는데, 이로써 데이터의 구조를 무시할 수 있게 되었다.

## Hierarchical classification (계층적 분류)

ImageNet의 라벨들은 WordNet에서 나왔는데, <span style="background-color: #fff5b1">**WordNet은 언어 데이터셋으로서 개념과 그들이 관련성을 구조화하고 있다.**</span> WordNet은 언어가 복잡하게 이루어짐을 감안해 트리(tree)가 아닌 유향 그래프(directed graph)로 구조화되었다. YOLO에서는 전체 그래프 구조를 다 사용하기보다는, ImageNet의 컨셉에서 기인해 <span style="background-color: #fff5b1">**계층적 트리(hierarchical tree)를 사용해 문제를 단순화시켰다.**</span>

트리를 만들기 위해 <span style="background-color: #fff5b1">**시각적 명사(visual noun)들을 시험했고, WordNet 그래프에서 루트 노드(’physical object’)까지 경로를 살펴보았다.**</span> 많은 유의어 집합(synset)들이 그래프에서 하나의 경로만 가졌고, 저자들은 그들의 트리에 그 경로를 추가했다. 그리고는 반복적으로 남은 개념(concept, 단어라는 뜻일 듯)들을 탐색하며 <span style="background-color: #fff5b1">**최대한 작은 트리가 만들어지도록 경로를 추가했다.**</span> 한 노드에서 루트로 가는 여러 경로가 있다면 가장 짧은 경로를 택하는 식이다.

<span style="background-color: #fff5b1">**최종 결과는 WordTree**</span>로, 시각적 단어(visual concept)들의 계층적 모델이다. WordTree로 분류를 수행하기 위해 모든 노드에서 <span style="background-color: #fff5b1">**조건부 확률을 예측했다. 이 확률은 주어진 유의어 집합의 각 하의어(hyponym)의 확률이다.**</span> 예를 들자면 아래와 같다.

$$
Pr(\mathrm{Norfolk \ terrior | terrier}) \\ Pr(\mathrm{Yorkshire \ terrior | terrier}) \\ Pr(\mathrm{Bedlington \ terrior | terrier}) \\ \cdots
$$

특정 노드에서의 절대적 확률(absolute probability)를 구하고자 한다면, <span style="background-color: #fff5b1">**루트 노드까지 경로를 따라가며 조건부 확률을 곱한다.**</span>

$$
\begin{aligned}
    Pr(\mathrm{Norfolk \ terrior}) & = Pr(\mathrm{Norfolk \ terrior \ | \ terrier}) \\
      & * Pr(\mathrm{terrior \ | \ hunting \ dog}) \\
      & * \ \cdots \ * \\ 
      & * Pr(\mathrm{mammal \ | \ animal}) \\
      & * Pr(\mathrm{animal \ | \ physical \ object}) \\
\end{aligned}
$$

분류 문제에서는 이미지가 객체를 가졌을 확률을 1로 가정한다. 즉 $Pr(\mathrm{physical \ object}) = 1$이고 이 때만 바운딩 박스를 예측할 수 있다.

이 방식을 검증하기 위해 1,000개 클래스의 ImageNet을 사용해 만든 WordTree에 Darknet-19 모델을  학습시켰다. WordTree1k를 만들기 위해 모든 중간(intermediate) 노드들을 추가해 라벨 공간이 1,000에서 1,369로 증가되었다. 학습을 하는 동안 ground truth 라벨을 트리까지 전파했다. 요크셔테리어로 라벨 된다면 개, 포유류 등에도 라벨이 되는 것이다. <span style="background-color: #fff5b1">**조건부 확률을 계산하기 위해, 모델은 1,369 크기의 벡터의 값을 예측하고 같은 개념(concept)의 하의어인 유의어 집합 전체에 대해 소프트맥스를 적용한다.**</span>

> 그림을 보면, ImageNet에서는 확률 분포를 예측하기 위해 커다란 하나의 소프트맥스를 사용한다. 즉, 라벨을 flat 구조로 보는 것이다. 반면 WordTree1k에서는 함께 속한 하의어들끼리(co-hyponyms, 동일한 상위어를 공유하는 말) 다중 소프트맥스 연산이 된다.

![image](https://user-images.githubusercontent.com/69252153/184532667-193c3cdb-7143-431e-b6c7-435528918b5a.png){: .align-center}


369개의 개념을 추가하고 네트워크가 추정을 진행하도록 했을 때, 정확도는 약간만 떨어졌다. 이 방식의 분류는 몇 가지 이점이 있다. 보통 새로운 개체나 혹은 알 수 없는 분류의 개체가 입력되었을 때 성능이 저하된다. 이 방식을 사용한다면, 만약 개 사진을 보고 품종은 불확실할 경우, 높은 신뢰도(confidence)로 개임을 예측하나, 하의어들 가운데서는 낮은 신뢰도를 갖는다.

> 이 부분은 완전히 의역이다. 사실 여기 문장이 잘 이어지지 않아서, 좋다는 얘길 하는 건지 나쁘다는 얘길 하는 건지 이해가 안 간다.

해당 방식은 <span style="background-color: #fff5b1">**탐지**</span>에서도 사용되는데, 분류 문제에서처럼 모든 이미지에 객체가 있다고 가정을 하는 대신, YOLOv2의 <span style="background-color: #fff5b1">**objectiveness detector를 사용해 $Pr(\mathrm{physical \ object})$값으로 쓴다.**</span> detector는 바운딩박스와 확률들의 트리를 예측한다. <span style="background-color: #fff5b1">**트리를 순회하면서 각 분기(split)별로 가장 높은 신뢰도의 경로를 택하며, 이 과정은 특정 임계값(threshold)에 도달하거나 해당 객체의 클래스를 예측할 때까지 반복한다.**</span>

## Dataset combination with WordTree

<span style="background-color: #fff5b1">**WordTree를 다수 개의 데이터셋을 합치는 데 사용했다. 데이터셋의 카테고리들을 트리의 하의어 집합에 맵핑시켰다.**</span> 이들은 ImageNet과 COCO를 합쳤으며 그 예는 그림과 같다.

WordNet은 매우 다양해서 이 기술을 대부분의 데이터셋에 사용할 수 있다.

## Joint classification and detection

거대한 스케일의 탐지기를 만들기 위해 COCO 탐지 데이터셋과 ImageNet의 full release 클래스들을 사용해 데이터셋을 합쳤으며, 아직 포함되지 않은 ImageNet 탐지 챌린지에서도 클래스들을 더해 가져왔다. 이렇게 만들어진 WordTree는 9,418개의 클래스를 가진다. ImageNet은 COCO 데이터셋보다 훨씬 크기 때문에 COCO를 오버샘플링해 데이터셋의 균형을 맞춰 ImageNet과 4:1의 비율을 갖는다.

해당 데이터셋을 사용해 YOLO9000을 학습시켰다. YOLO9000은 YOLOv2를 기반으로 하되, prior을 5개가 아닌 3개로 제한해 출력 크기를 낮췄다. 탐지 이미지를 보고 정상적으로 손실을 역전파한다. 분류 손실의 경우, 해당하는 라벨의 수준까지만(at or above) 전파한다. 개라고 라벨이 되었으면 그 이상으로는 정보가 없기에, 그것이 골든 리트리버인지 저먼 셰퍼드인지까지는 트리에서 더 내려가지 않는단 뜻이다.

<span style="background-color: #fff5b1">**분류 이미지를 볼 때는 분류 손실만 역전파**</span>를 한다. 이를 위해 단순히 <span style="background-color: #fff5b1">**해당 클래스의 가장 높은 확률을 예측한 바운딩 박스를 찾고, 그것의 예측된 트리에서 손실을 계산한다.**</span> 또한 <span style="background-color: #fff5b1">**예측된 박스가 ground truth 라벨의 최소한 0.3 IOU를 덮는다(overlap)고 가정하고, 이 가정 하에 objectness 손실을 역전파한다.**</span>

이러한 결합된(joint) 학습으로써, YOLO9000은 COCO의 탐지 데이터를 이용해 이미지에서 객체를 찾도록 학습하고, ImageNet의 데이터를 이용해 매우 다양한 객체들을 분류하도록 학습한다.

ImageNet 탐지 기능(task)에 대해 YOLO9000을 평가했다. 해당 탐지 기능은 44개의 객체 클래스를 COCO와 공유하며, 이는 곧 YOLO9000이 탐지 데이터가 아닌 테스트 데이터에 대해 분류 데이터만 보았단 뜻이다. <span style="background-color: #fff5b1">**탐지 데이터로 한 번도 접하지 않은 클래스들에 대해서 16.0mAP의 성능**</span>을 보였으며, DPM보다 높은 수치이나, 여기서 YOLO9000은 오직 부분적 지도(supervision) 하에(weakly supervised classes) 다른 데이터셋으로 학습되었다는 차이가 있다. 또한 <span style="background-color: #fff5b1">**9천 개의 서로 다른 객체 카테고리를 분류함과 동시에 이를 실시간(real-time)으로 수행할 수 있다.**</span>

YOLO9000은 새로운 종의 동물에 대해서는 잘 학습을 하지만 의류나 기구에 대해서는 고전을 하는데, 이는 COCO 데이터셋에 동물의 objectiveness 예측은 잘 이루어지나 사람이 아닌 의류의 타입에 대해서는 바운딩 박스 라벨이 없기 때문이다.

- - -

# 5. Conclusion

해당 논문에서는 실시간 탐지 시스템인 YOLOv2와 YOLO9000을 소개했다. YOLOv2는 다양한 이미지 크기에 대해 작동할 수 있고, 속도와 정확성에 균형을 잡고 있다(smooth tradeoff).

YOLO9000은 9천 개 이상의 객체 카테고리를 탐지할 수 있는 실시간 프레임워크로, 탐지와 분류를 결합해 최적화한다. ImageNet과 COCO에 대해 동시에 학습을 진행하기 위해 다양한 출처의 데이터와 최적화 기술을 결합할 때 WordTree를 사용했다.

ImageNet의 WordTree 표현은 이미지 분류를 위한 더 풍부하고 정교한 출력 공간을 제공한다. 계층적 분류를 사용한 데이터셋 조합(combination)은 분류와 분할(segmentation) 분야에서 유용하다.

- - -

# 📜 References

- 논문 원문 : [YOLO9000: Better, Faster, Stronger](https://arxiv.org/abs/1612.08242)
- Region Proposal : ["[AI/딥러닝] 진정한 딥러닝을 위한 3가지 분류 (Classification, Object Detection, Image Segmentation 2탄," rubber-tree.tistory.com](https://rubber-tree.tistory.com/133)
- YOLOv2 논문 리뷰 : ["YOLO v2," songminkee.github.io](https://songminkee.github.io/studyblog/object%20detection/2020/10/15/YOLOv2.html)
- mAP : ["[Object Detection] mAP(mean Average Precision)을 이해하고 파이토치로 구현하기," deep-learning-study.tistory.com](https://deep-learning-study.tistory.com/407)