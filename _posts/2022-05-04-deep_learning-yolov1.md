---
title:  "[Paper Review] You Only Look Once: Unified, Real-Time Object Detection"
excerpt: "YOLOv1 모델 논문 리뷰"

categories:
  - Deep Learning
tags:
  - Deep Learning
  - Object Detection
  - Papaer Review
  - Computer Vision
last_modified_at: 2022-05-04

use_math: true
toc: true
tock_sticky: true
toc_label: "Contents"
---

개인적인 공부를 위해 정리한 글입니다. 오류 및 오역과 의역, 생략이 많을 수 있습니다.
{: .notice--info}

# 📑Information

- **Title**: <span style="background-color: #fff5b1">**You Only Look Once: Unified, Real-Time Object Detection**</span>
- **Authors**: Joseph Redmon, Santosh Divvala, Ross Girshickfj, Ali Farhadi
- **Source**: Proceedings of the IEEE conference on computer vision and pattern recognition(2016)(pp. 779-788)

---

# Abstract

기존의 객체 탐지(Object Detection)들은 분류기와 탐지기가 따로였으나, <span style="background-color: #fff5b1">**YOLO는 하나의 신경망이 이미지 전체에서 한 번의 검증(evaluation)으로 바운딩박스와 클래스 확률을 바로 예측한다.**</span>

이 YOLO의 통합 아키텍쳐(unified architecture)는 매우 빨라 45fps를 기록했다.

여타 최신 객체 탐지 시스템과 비교했을 때 <span style="background-color: #fff5b1">**localization 에러가 더 많았는데, 이는 배경에서 false positive(객체가 아닌 것을 객체라고 함)을 예측하기 때문이다.**</span>

<span style="background-color: #fff5b1">**객체의 매우 일반적인 표현(general representation)을 학습한다.**</span> 이는 다른 탐지 방식보다 더 뛰어난 성능을 보인다.

# 1. Introduction

현 객체 탐지 시스템은 탐지(detection)을 위해 분류기(classifier)를 변경해 사용해(repurpose), 해당 객체에 대해 다양한 위치(location)와 크기(scale)에 대해 평가(evaluate)한다. 대표적으로 DPM, R-CNN 등이 있다. 이들의 <span style="background-color: #fff5b1">**복잡한 파이프라인은 느리고 최적화가 힘들다. 각각의 요소(component)들이 따로 학습되어야 하기 때문이다.**</span>

저자들은 <span style="background-color: #fff5b1">**객체 탐지를 하나의 회귀 문제(single regression problem)으로 생각하고, 이미지 픽셀에서 바로 바운딩 박스(boudning box)의 위치(coordinate)와 클래스에 속할 확률(class probability)를 얻도록 했다.**</span> 이미지를 <span style="background-color: #fff5b1">**오직 한 번만 보고(You Only Look Once) 어떤 객체가 있고 어디에 있는지 알 수 있다.**</span>

YOLO는 매우 단순한 시스템을 가지고 있다. 

1. 이미지 resize
2. 이미지를 하나의 합성곱 신경망에 입력시켜 학습
3. 모델의 confidence에 맞게 탐지 결과를 threshold한다. 

여기서 <span style="background-color: #fff5b1">**‘하나의 합성곱 신경망’이 여러 개의 바운딩 박스와 그들에 대한 클래스 확률을 동시에 예측한다. 전체 이미지를 학습하고 바로 탐지 성능을 최적화(optimize)한다.**</span>

YOLO가 <span style="background-color: #fff5b1">**통합 모델(unified model)**</span>이라 타 객체 탐지기에 비해 갖는 이점은 아래와 같다.

1. <span style="background-color: #fff5b1">**매우 빠르다.**</span> 탐지를 회귀 문제로 보기 때문에 복잡한 파이프라인이 필요 없다. Titan X GPU 환경에서 배치 없이 수행했을 때 45FPS를 기록했다. 이는 스트리밍 비디오에서 25ms 이하의 지연(latency)를 가질 수 있다는 의미이며, 타 실시간 시스템들에 비해 평균 두 배 정도의 성능이다.
2. <span style="background-color: #fff5b1">**추론을 이미지의 전체적으로(globally) 수행한다.**</span> 학습과 테스트에서 이미지 전체를 보기 때문에 내부적으로(implicitly) 클래스와 외관(appearance)의 문맥적인(contextual) 정보를 해독한다. 슬라이딩 윈도우나 지역 제안 기반(region proposal-based) 기술과의 차이점이다.
3. <span style="background-color: #fff5b1">**객체의 일반적인 표현(representation)을 학습한다.**</span>

다른 객체 탐지 시스템에 비해 정확도는 낮다. 빠른 대신 몇몇 객체(작은 객체 등)을 놓칠 수 있다.

# 2. Unified Detection

전체 이미지에서 얻은 피처(feature)들을 이용해 각 바운딩 박스를 예측하며 전체 클래스에 대해 모든 바운딩 박스를 동시에 예측한다. 즉, 이 신경망은 이미지를 전체적으로(globally) 추론한다. YOLO는 end-to-end 학습과 실시간성, 높은 정밀도(precision)을 가능하게 한다.

<span style="background-color: #fff5b1">**입력 이미지를 S X S 격자로 분할한다.**</span> 객체의 중심이 해당 격자 칸 안에 들어온다면 그 간이 해당 객체를 탐지할 수 있다.

<span style="background-color: #fff5b1">**각 격자칸은 B개의 바운딩박스와 신뢰점수(confidence score)를 예측**</span>한다. 이때 <span style="background-color: #fff5b1">**신뢰도는 $\mathrm{Pr(Object) * IOU^{truth\ pred}}$**</span> 로 한다. 예측한 박스와 실제(ground truth) 간의 IOU(Intersection Over Unit)가 같게(1로) 하는 것이 목표이다.

<span style="background-color: #fff5b1">**각 바운딩박스는 5개의 예측을 한다. x, y, w, h, confidence이다.**</span> (x, y)는 격자칸에 맞는 바운딩박스의 중심점이다. w, h는 각각 전체 이미지에 대한 바운딩박스의 너비와 높이를 말한다. 예측된 박스와 ground truth 박스 간 IOU가 confidence 값이 된다.

<span style="background-color: #fff5b1">**각 격자칸은 C 개의 클래스 조건부 확률을 예측하는데, 이는 $\mathrm{Pr(Class}_i \mathrm{ | Object)}$ 로 표기한다.**</span> 이 확률은 객체를 가진 격자칸에 대한 조건부 확률이다. 바운딩 박스 개수인 B에 관계 없이 <span style="background-color: #fff5b1">**한 격자칸에서는 한 세트의 클래스 확률만 예측**</span>한다.

즉, 예측의 결과로서  $S \times S \times (B \times 5 + C)$ 크기의 행렬(tensor)를 얻을 수 있다.

테스트 모드에서는 <span style="background-color: #fff5b1">**클래스에 대한 조건부확률과 각 박스의 confidence 예측을 곱한다.**</span> 이는 각 박스에 대한 각 클래스의(class-specific) confidence 점수를 준다. 이는 곧 <span style="background-color: #fff5b1">**박스 안에 그 클래스 객체가 있을 확률과 얼마나 그 객체에 딱 맞게(fit) 박스가 예측되고 있는지**</span>를 알려준다.

$$
\mathrm{Pr(Class} _i \mathrm{|Object)} * \mathrm{Pr(Object)} * \mathrm{IOU^{truth\ pred}} = \mathrm{Pr(Class} _i) * \mathrm{IOU^{truth\ pred}}
$$

![image](https://user-images.githubusercontent.com/69252153/184531817-e6990306-67c2-4d6e-a99c-b08c9aa20628.png){: .align-center}


## 2.1. Network Design

이 모델은 <span style="background-color: #fff5b1">**합성곱 신경망을 사용**</span>하며, PASCAL VOC 탐지 테이터셋을 사용해 평가하였다.

**<u>PASCAL Visual Object Classes Challenge(VOC)</u>** : <br>
객체 탐지(object detection)와, 영상 분할(semantic segmentation), 분류(classification) 문제에서 벤치마크로 사용되는 데이터셋이다. PASCAL VOC 2012에는 20개의 카테고리가 있어 교통수단, 사람, 사물, 동물 등을 포함한다.
{: .notice--info}


초기 <span style="background-color: #fff5b1">**합성곱층들은 이미지에서 피처를 뽑고, 완전연결층(fully connected layer)은 확률과 좌표 결과를 예측**</span>한다.

해당 모델은 이미지 분류를 위한 <span style="background-color: #fff5b1">**GoogLeNet 모델에서 영감을 얻었다.**</span> <span style="background-color: #fff5b1">**24개의 합성곱층과 2개의 완전연결층을 사용**</span>하며, GooLeNet과는 다르게 3 X 3 합성곱층 다음에 <span style="background-color: #fff5b1">**1 X 1의 reduction층을 사용**</span>했다. 이는 이전 레이어에서 피처 차원을 축소시킨다. 최종 결과로는 7 X 7 X 30 크기의 텐서를 얻는다.

**<u>Reduction layer</u>** :<br>
합성곱 신경망에서 필터(커널)의 개수를 입력의 차원보다 작게 설정하여 차원 축소의 효과를 얻는다.
{: .notice--info}

![image](https://user-images.githubusercontent.com/69252153/184531881-99213100-b443-4678-8788-b31d9b23fb18.png){: .align-center}


## 2.2. Training

<span style="background-color: #fff5b1">**ImageNet 1000-class competition 데이터셋을 사용**</span>해 20개의 합성곱층과 1개의 평균 풀링층, 1개의 완전연결층을 미리 학습했다(pretrain). 그 후 모델을 탐지를 하도록 전환했다. 임의로 초기화된 가중치들을 가진 4개의 합성곱층과 2개의 완전연결층을 더했으며, 이미지의 크기를 키웠다.

마지막으론 클래스 확률과 바운딩박스 위치를 예측했다. <span style="background-color: #fff5b1">**바운딩박스의 가로와 세로 크기를 이미지 전체의 가로와 세로 길이에 대해 정규화(normalize)하여 결과가 [0, 1]의 범위를 갖게 했으며, 박스의 중점 역시 격자칸의 위치의 오프셋으로 매개변수화(parametrize)하여 [0, 1]의 값을 갖게 했다.**</span>

<span style="background-color: #fff5b1">**마지막 레이어에는 선형 활성화함수를 썼으며, 그 외에는 LeakyReLU 함수를 사용**</span>했다. 

<span style="background-color: #fff5b1">**최적화에는 SSE(Sum of Squared Error)을 사용**</span>했다. 그러나 이는 문제가 있는데, <span style="background-color: #fff5b1">**분류 에러와 위치(localization) 에러가 같지 않은데 같게 가중치를 두어 취급**</span>한다. 또한 많은 격자칸에서 <span style="background-color: #fff5b1">**아예 객체가 없는 경우가 매우 많은데, 이 경우 confidence는 거의 0에 가깝다.**</span> 이 경우 SSE는 <span style="background-color: #fff5b1">**기울기를 매우 급격하게**</span> 하여 모델의 불안정성을 유도하여 학습이 이른 수렴에 이르게 한다. 

**<u>Sum of Squared Error(SSE)</u>** : <br>
주로 회귀에서 사용하는 계산으로, 실제 데이터와 예측값의 차이를 제곱해 모두 더하는 것이다.
$\mathrm{SSE} = \sum^{n}\limits_{i=1} (y_i - \hat{y_i})^2$로 나타낼 수 있다.
{: .notice--info}

해결을 위해 <span style="background-color: #fff5b1">**두 개의 파라미터인 $\lambda_{coor}$와 $\lambda_{no\ obj}$를 정의**</span>했는데, 각각 바운딩박스 좌표 예측에 대한 파라미터, 아무 객체도 가지고 있지 않은 박스의 confidence 예측에 대한 파라미터이다. 전자는 높이고 후자는 낮추기 위해 각각 5와 0.5로 설정했다.

SSE가 <span style="background-color: #fff5b1">**큰 박스와 작은 박스를 똑같이 취급함을 해결**</span>하기 위해, 에러 행렬에서 큰 박스의 미분값을 작게 인식하도록 해야 한다. 따라서 <span style="background-color: #fff5b1">**바운딩박스의 너비와 높이를 그냥 사용하기 보다는 제곱근을 씌워 예측**</span>했다.

YOLO는 한 격자칸 당 여러 개의 바운딩 박스를 예측하나, 우리는 하나의 바운딩박스만 원한다. 따라서 predictor을 도입해 ground truth에 대해 <span style="background-color: #fff5b1">**IOU가 가장 높은 박스를 택하도록**</span> 한다.

최적화에서 <span style="background-color: #fff5b1">**손실 함수**</span>는 여러 개의 파트로 나뉜다.

![image](https://user-images.githubusercontent.com/69252153/184531911-b2ba4326-3c69-4346-9722-0b81d967caa0.png){: .align-center}

$\mathbb{l}\_{i}^{\mathrm{obj}}$은 i번째 칸에 물체가 나타났는지를 의미하고, $\mathbb{l}^{\mathrm{obj}}_{ij}$은 $i$번째 칸의 $j$번째 바운딩박스 예측기가 해당 예측에 대해 responsible한지를 나타낸다.

손실 함수는 오직 개체가 해당 격자칸에 있을 때만 분류 에러에 대해 패널티를 부과하며, 바운딩박스의 분류기가 그 ground truth 박스에 대해서 responsible할 때만 좌표 에러에 패널티를 부과한다.

저자들은 135 에폭으로 학습을 시켰으며 PASAL VOC 2007과 2012 데이터셋을 활용했다. 배치 사이즈는 64, 모멘텀은 0.9, decay는 0.0005였다.

학습률 스케쥴링의 경우, 첫번째 에폭에서는 천천히 학습률을 $10^{-3}$에서 $10^{-2}$까지 올렸는데, 만약 높은 학습률로 시작하게 되면 모델이 불안정한 기울기 때문에 발산할 수도 있기 때문이다. 이후 75 에폭은 $10^{-2}$로, 그 후 30 에폭은 $10^{-3}$으로, 그리고 마지막 30에폭은 $10^{-4}$로 하였다.

<span style="background-color: #fff5b1">**오버피팅을 피하기 위해 dropout과 데이터 증강(augmentation)**</span>을 진행했다. Dropout층의 경우 0.5의 비율로 첫번째 연결 레이어 뒤에 위치해 레이어 간의 <span style="background-color: #fff5b1">**co-adaptation 문제를 방지**</span>했다. 또한 데이터 augmentation에서는 원 이미지의 20%까지의 랜덤하게 <span style="background-color: #fff5b1">**scaling(크기 조정)과 translation(수직/수평 방향으로 이동)**</span>을 진행했으며, HSV 색공간에서 1.5배까지 랜덤하게 <span style="background-color: #fff5b1">**노출값(exposure)과 포화도(saturation)을 조정**</span>했다.

**<u>상호 적응(co-adaptation)</u>** : <br>
신경망이 학습을 하고 있을 때, 어느 순간 같은 층의 두 개 이상의 노드가 입력과 출력 강도가 같아져 학습을 반복해도 두 노드는 같은 일을 할 뿐, 불필요한 중복 연산이 계속되는 현상이다.<br>
dropout으로 이 문제를 해결한다. 임의로 선택한 노드들을 다음 층으로 전파하길 생략하기 때문에 상호적응이 일어난 노드들이 분리될 수 있다.
{: .notice--info}


## 2.3. Inference

학습 때와 마찬가지로 추론 역시 하나의 신경망에서 이루어진다. PASCAL VOC에서는 1개의 이미지 당 98개의 바운딩 박스들과 각 박스에서의 클래스 확률들을 예측한다.

YOLO에서 차용한 격자 방식은 바운딩 박스 예측에 있어 공간적 다변성을 가능케 하는데, 개체가 속하는 격자칸이 무엇인지 확실히 알 수 있고, 신경망은 한 개의 개체 당 오직 하나의 박스만 예측한다.

하지만 <span style="background-color: #fff5b1">**큰 물체나 격자 경계에 있는 개체들은 여러 개의 격자칸에서 검출될 수 있다(localized)**</span>. 이러한 <span style="background-color: #fff5b1">**다중 검출(multiple detection) 문제를 해결하기 위해 비최대억제(Non-maximal suppression)을 도입**</span>했다.

![image](https://user-images.githubusercontent.com/69252153/184532159-010dc447-f31b-4dcb-8063-23ebec49e9a8.png){: .align-center}

**<u>비최대억제(NMS, Non-Maximal Suppression)</u>** : <br>
한 객체에 대해 여러 개의 후보 지역(candidate region)을 낼 때 이들 중 하나를 택할 때 사용한다. B개의 바운딩 박스, 그에 대응하는 S개의 신뢰도(confidence), 경곗값(threshold) N이 입력으로 주어지면, 필터링된 값 D를 반환하는 알고리즘이다.
{: .notice--info}

## 2.4. Limitations of YOLO

각 격자칸이 두 개의 박스만 예측하고 하나의 클래스만 갖기 때문에 YOLO는 바운딩 박스 예측에 대한 공간적 제약을 갖는다. 이는 <span style="background-color: #fff5b1">**예측 가능한 근방의 개체들의 개수에도 제한**</span>을 주게 된다. 새 떼들처럼 <span style="background-color: #fff5b1">**작은 개체들의 그룹을 예측하는 게 힘들다**</span>는 뜻이 된다.

데이터로부터 바운딩 박스를 배우기 때문에, 새롭거나 자주 등장하지 않는 비율 등의 개체들을 일반화시키는 것에도 어려움이 있다. 또한 <span style="background-color: #fff5b1">**입력 이미지에 대해 여러 번의 다운샘플링(downsampling)을 하기 때문에 비교적 거친(coarse) - 아마도 해상도가 낮다는 뜻일 것 같다 - 특징들을 이용**</span>하게 된다.

**<u>다운샘플링(Downsampling)</u>** : <br>
샘플(데이터)의 개수를 줄이는 것. 풀링(Pooling)이 대표적이며, 원 이미지에서 요약 & 생략된 출력 데이터를 만들어낸다.
{: .notice--info}

<span style="background-color: #fff5b1">**손실 함수에서 작은 바운딩 박스와 큰 바운딩 박스의 에러를 똑같이 취급**</span>하고 있는 것도 문제이다. 작은 박스의 작은 에러에 대해서는 IOU에 큰 영향을 끼친다. <span style="background-color: #fff5b1">**YOLO의 주된 에러 원인도 부정확한 localization이다.**</span>


# 3. Comparison to Other Detection Systems

객체 탐지 파이프라인은 대체적으로 이렇다. 먼저, <span style="background-color: #fff5b1">**입력 데이터로부터 확실한(robust) - 사전적으론 ‘굳건한’, ‘단단한’ - 특징들을 뽑아낸다**</span>. <span style="background-color: #fff5b1">**분류기(classifier)와 로컬라이저(localizer) - 위치 표시기 정도로 해석한다 - 가 특징 공간(feature space) 내에서 객체를 식별한다.**</span> 이들은 슬라이딩 윈도우(sliding window)을 쓰거나 이미지 내 지역(region) - 또는 ‘부분’ - 을 나눠 진행한다.

여타 탐지 프레임워크들과 YOLO의 공통점과 차이점을 비교해본다.

- Deformable Parts Models(DRM)
    - 이들은 슬라이딩 윈도우를 사용한다.
    - 정적(static) 특징을 추출하고 지역(region)을 분류하고, 높은 점수의 지역에서 바운딩 박스를 예측하는 등을 모두 각각의 파이프라인에서 수행한다.
    - YOLO가 이 모든 것을 하나의 신경망에서 처리하며 정적 특징 대신 in-line 에서 특징을 추출하는 것, 최적화를 수행하는 것 등이 차이이며, YOLO가 보다 좋은 성능을 보인다.
- R-CNN
    - 지역 제안법(region proposal)을 사용해 객체를 탐지한다.
    - 선택적 탐색(selective search)은 가능성이 높은(potential) 바운딩 박스들을 만들어내고, 합성곱 신경망은 특징을 뽑아내며, SVM은 박스들에 점수를 부과하고, 선형 모델은 바운딩 박스들을 조정(adjust)하고, 비최대억제가 중복된 탐지들을 제거한다.
    - 각 단계의 복잡한 파이프라인은 정확하게 작동하도록 돕지만 매우 느리다.
    - YOLO가 R-CNN과 비슷한 점은, 합성곱 신경망을 이용해 격자칸에서 바운딩박스들과 그 점수를 제시한다는 것이다.
    - 그러나 차이점도 몇 가지 있다. 일단, 각 셀에서 제시할 수 있는 바운딩 박스의 공간적 제약이 있어 같은 객체를 중복해서 탐지하는 것을 방지한다.
    - 또한 더 적은 수의 바운딩 박스를 사용하며, 각 단계들을 하나의 최적화된 모델에 합치고 있다.
    - Fast R-CNN, Faster R-CNN은 연산을 공유하고 선택적 탐색을 사용하는 대신 신경망이 지역을 제안하도록 하고 있으나 여전히 속도는 느리다.
- OverFeat
    - 탐지를 위한 위치 찾기(localization)과 로컬라이저 조정(adapt)에 합성곱 신경망을 사용한다.
    - 슬라이딩 윈도우 탐지를 잘 사용한다.
    - 그러나 여전히 YOLO와 달리 분리된(disjoint) 시스템이다.
    - OverFeat은 탐지 성능이 아닌 위치에 대해서 최적화를 수행한다. 전체적인 문맥(context)를 추론하지 못해서 일관된(coherent) 탐지를 수행하기 위해서는 상당한 양의 후처리가 필요하다.
- MultiGrasp
    - YOLO가 바운딩 박스를 예측하기 위해 채택한 격자 방식은 MultiGrasp 시스템에 기반했다.
    - MultiGrasp은 하나의 객체만 존재하는 이미지에서 붙잡을 수 있는(graspable) 하나의 지역(region)만 예측한다. 크기나 위치, 경계, 클래스를 예측하지 않는다.
    - 이에 반해 YOLO는 여러 클래스를 가지는 여러 객체의 바운딩 박스와 클래스 확률을 예측한다.

# 4. Experiments

<span style="background-color: #fff5b1">**PASCAL VOC 2007 데이터셋을 사용해 타 실시간 객체 탐지 시스템과 YOLO를 비교**</span>했다. R-CNN과의 비교를 위해 에러를 측정했으며, 배경의 false positive의 오류를 R-CNN보다 더 줄일 수 있음을 확인했다. 또한 최신 방법들과 YOLO를 VOC 2012를 사용해 mAP를 비교했다.

자세한 비교 내용은 생략한다.

# 5. Real-Time Detection In the Wild

웹캠에 YOLO를 연결해 실시간 성능을 측정했다.

![image](https://user-images.githubusercontent.com/69252153/184532207-5d2824ee-f871-40cb-827f-85cce1a68aed.png){: .align-center}


# 6. Conclusion

객체 탐지의 <span style="background-color: #fff5b1">**통합(unified) 모델**</span>로서 YOLO가 소개되었으며, 이 모델은 <span style="background-color: #fff5b1">**구현하기 간단하고 전체 이미지를 바로 학습**</span>시킬 수 있다. <span style="background-color: #fff5b1">**탐지 성능에 대응되는 손실 함수로 훈련**</span>되며, 모델 전체는 분리된 요소가 아닌 전체적으로 <span style="background-color: #fff5b1">**한꺼번에(jointly)**</span> 훈련된다.

- - -

# 📜 Further Study
해당 논문은 YOLO의 첫 번째 모델인 YOLOv1이다. 이후 나올 YOLOv2, YOLOv3 논문도 리뷰할 계획이며, 모델의 구현은 YOLOv3의 것으로 진행할 것이다.

- - -

# References
* 논문 원문: [You Only Look Once: Unified, Real-Time Object Detection](https://arxiv.org/abs/1506.02640)
* Co-adaptation: [Hyeonnii, "[개념정리] co-adaptation이란?"](https://hyeonnii.tistory.com/254)
* Non-Maximum Suppression: ["[Object Detection] 비-최대 억제(NMS, Non-maximum Suppression)를 이해하고 파이토치로 구현하기"](https://deep-learning-study.tistory.com/403)