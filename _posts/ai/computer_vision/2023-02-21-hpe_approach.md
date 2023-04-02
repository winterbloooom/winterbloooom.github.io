---
title:  "[HPE] Human Pose Representations & Approaches (Models)"
excerpt: "Representations of Human Pose and Approaches of HPE"
categories:
  - AI
  - Computer Vision
tags:
  - Deep Learning
  - Computer Vision
  - Human Pose Estimation
last_modified_at: 2023-02-21
teaser: "/assets/images/teaser/teaser_hpe.jpg"
feature: true
---

{% include inserted_box.html text="HPE 시리즈는 현재 필자가 연구(공부)하는 주제로, 이와 관련된 이론 및 논문들을 소개할 예정입니다." %}


# Representations

HPE task는 곧 관절(keypoints)의 위치를 찾는 일이라고 했다. 따라서 이 관절을 표현하는 방식(representation)에 따라 HPE 모델을 구분하기도 한다. 대표적으로 'Regression based' 방식과 'Heatmap based' 방식이 존재하며, 각각 관절 좌표를 직접 추론하거나 확률분포(히트맵)을 이용해 찾는다.

## Regression based

우리의 직관처럼, 이미지 내에서 사람 관절의 좌표를 바로 찾아내는 방식이다. 특정 관절의 좌표를 𝒫_𝑖 (𝑥, 𝑦) 라고 나타내면 이 값을 사진 상에서 보이는 모든 관절에 대해 찾아낸다. 좌표의 '순서가 있는 튜플(ordered tuples)이라고 보면 된다.

모델은 예측값과 정답값(Ground Truth, 이하 'GT') 간의 차이, 즉 두 좌표 간 거리를 최소화하는 방향으로 학습한다. 

Heatmap based 방식에 비해 비교적 정확도가 낮다고 알려졌으나, 그와는 반대로 모델 중간에 미분이 불가능한 단계(non-differentiable steps)가 적고 종단간 프레임워크(end-to-end framework)에 통합하기 더 쉽다는 장점도 있다.


<figure>
<img src="https://user-images.githubusercontent.com/69252153/229352767-d56ebdd5-3069-4886-b01d-e90832ac801b.png" width="70%">
<figcaption>Fig1. Example of regression based representation</figcaption>
</figure>


## Heatmap based

하나의 관절 당 하나의 히트맵(heatmap 혹은 confidence map, probability distribution)을 만든다. 관절이 위치할 확률이 높은 픽셀일 수록 높은 값을 부여하며, 추론 시에는 히트맵에서 가장 높은 값을 같는 위치를 관절의 위치라고 예측한다.

Regression based 보다는 비교적 높은 정확도를 가진다고 알려져 있다. 반면 히트맵을 만들고 처리하는 과정에서 종종 휴리스틱한(heuristic) 처리를 사용하고, 따로 예측한 관절 정보들을 묶는(grouping) 등 추가적이거나 미분 불가능한 과정이 필요할 때가 많다. 따라서 종단간 학습에 통합하기 어려운 경우가 있다.

<figure>
<img src="https://user-images.githubusercontent.com/69252153/229352808-1f263db5-1d5f-4cf9-bd7f-db50a8232d84.png" width="70%">
<figcaption>Fig2. Example of heatmap based representation</figcaption>
</figure>

- - -

# Approaches

## Classical Approaches

초기 HPE에서는 '사람이 만들어낸(hand-crafted)' 특징(features)를 사용해왔다. 예를 들자면 edges, contours, HOG(Histogram of Oriented Gradients) 등이 있다. 또한 사람을 pictorial 구조, 즉 각 부분을 변형 가능한(deformable) 형태로 이은 구조로 나타냈다. 쉽게 말하면 어릴 적 그리던 '졸라맨' 형식이다. 머리, 몸통, 종아리, 허벅지 등을 각 부분으로 구분하고 잇는 것이다. 

하지만 단점이 많았다. 일단, 일반화 성능(generalization performances)가 낮았다. 각 파트를 정확히 인식하기에 해당 features가 적합하지 않았다. 특히 사진 상에서 사람의 신체 일부가 가려지거나(occlusion), 잘리거나(truncation), 다양한 자세로 있을 때 정확하게 자세를 추정하지 못하였다. 그렇다 보니 대규모 데이터셋에서 데이터의 다양성을 학습하기에 충분하지 못하였다.

## Deep Learning-based Approaches

다른 task들이 그렇듯, HPE 역시 딥러닝의 등장으로 새로운 국면을 맞는다. 빅데이터와 심층신경망(DNN, Deep Neural Network)의 우수한 표현력 (representation capability), 하드웨어의 성능 향상을 배경으로 딥러닝 연구가 활발히 진행되었다.

2014년에 DeepPose 모델이 HPE에서 합성곱신경망(CNN, Convolutional Neural Network)을 처음으로 채택한 뒤 딥러닝을 활용한 모델이 속속들이 발전하기 시작했다. 

연구(모델)은 크게 Single-person PE와 Multi-person PE로 나눌 수 있다. 단어 그대로 전자는 사진(혹은 영역)에 사람 한 명만 존재하여 한 명에 대해서만 PE를 수행한다. 반면 후자의 경우 여러 사람의 자세를 동시에 추정해야 하는 모델이다.

최근에는 Multi-person PE이 연구의 주를 이루며, 이 글에서도 해당 모델들을 다룰 예정이다.


<figure>
<img src="https://user-images.githubusercontent.com/69252153/229352886-d1d4cefa-3325-45e9-b68a-869bbfd6f651.png" width="70%">
<figcaption>Fig3</figcaption>
</figure>

- - -

# Multi-person Pose Estimation

Multi-person PE는 다시 Two-stage 와 Single-stage method로 나뉜다. 직관적으로, 전자는 PE를 두 단계에 걸쳐 수행하고, 후자는 한 단계만에 수행한다. Two-stage는 다시 Top-down 방식과 Bottom-up 방식으로 나뉜다. 아래선 이들의 특징과 장단점을 알아본다.

<figure>
<img src="https://user-images.githubusercontent.com/69252153/229352915-aebf746a-1277-4c2a-8971-63068f0d27fe.png">
<figcaption>Fig4. Example of heatmap based representation</figcaption>
</figure>


## Two-stage Methods

사람의 자세를 두 개의 단계에 걸쳐 추정한다. 각 단계에서 무엇을 수행하는가에 따라 Top-down과 Bottom-up 방식으로 나뉜다. 두 번의 단계를 거치기 때문에 비교적 정확도가 높다고 알려져 있다. 그러나 이는 곧 연산 시간과 비용이 높다는 단점도 된다.

### Top-down

첫 번째 단계로, 객체 탐지(object detection) 모델을 이용해 사진에서 사람을 모두 찾는다. 두 번째 단계에서 각 bounding box, 즉 각 사람 한 명 한 명에 대해 Single-person PE 모델을 적용해 자세를 추정한다.

Top-down methods는 각 사람(인스턴스)를 구분할 수 있다. 객체 인식을 통해 사람을 먼저 찾아내고, 서로 bounding box로 구분되니 당연한 이야기이다. 이것이 왜 장점인가 하면, 어떤 관절이 누구에게 속하는지가 명확하기 때문이다. (뒤에서 이야기 하겠지만, Bottom-up 방식은 여기서 문제가 발생한다.)

구현도 비교적 쉽다. Top-down은 쉽게 말하면 Object detector + Single-person PE 의 조합이다. 따라서 기존의 객체 탐지 모델과 기존의 Single-person PE 모델을 연결하면 된다.

Top-down은 정확도가 굉장히 높다고 알려져 있다. 현재 발행되는 논문의 실험 결과표를 보면 높은 정확도를 자랑하는 baselines는 Top-down 방식이 많고, 공개된 지 비교적 오래 된 모델이라 하더라도 아직까지 비교 대상이 될 정도이다.

단점도 분명 존재한다. 일단, PE의 성능이 사람 객체 탐지기의 성능에 좌우된다. Top-down은 예측한 bounding box 내에서 관절의 위치를 찾기 때문에, 사람을 제대로 탐지하지 못하면 - 예를 들면 상반신만 찾는다던가, 아예 사람을 탐지하지 못한다던가 - 당연히 그 속에서 관절도 잘 못 찾는다.

또 하나의 치명적 단점은, 연산 비용이 크고 추론 시간이 길다는 것이다. 사람 객체 탐지기가 분리되어 있을 뿐만 아니라, 사진 내 사람의 수 만큼 Single-person PE 모델을 작동해야 한다. 즉, 사람의 수에 비례해 연산의 비용과 시간이 증가한다. 따라서 Top-down 방식은 빠른 속도가 중요한 realtime 적용이 힘들고 사람이 많은 장면에 대해서는 더더욱 속도를 기대하기 힘들다.

Top-down 방식은 비교적 이른 시기(2016 ~ 2018)에 많이 제안되었다. 대표적으로 StackedHourglass(2016), RMPE(2017), Mask R-CNN(2017), CPN(2018), HRNet(2019),  SimpleBaseline(2018) 등이 있다.


### Bottom-up

Top-down과는 반대다. 첫 번째 단계에서, 사람 구분 없이 사진 내에 보이는 모든 관절을 다 찾는다. 두 번째 단계에선, 첫 번째 단계에서 찾아 둔 관절을 각 사람에게 배분(혹은 묶기(grouping)이라고도 표현함)한다. Top-down이 사람-관절 순이라면 Bottom-up은  관절-사람 순인 것이다.

장단점 또한 Top-down과는 반대다. 우선, Bottom-up은 Top-down에 비해 이미지 내 사람 수에 영향을 덜 받는다. 사람이 몇 명이든 관절의 위치만 먼저 다 찾기 때문이다. 하여 비교적 사람이 많은 이미지(crowded scenes)에서 보다 잘 작동한다. Top-down보다 속도가 빠르고 파이프라인이 단순하기도 하다.

어려운 것은 관절을 찾고 난 뒤의 단계이다. 찾아낸 관절을 각 사람에게 배분하는, 즉 그룹핑(grouping)하고 보다 정교하게 다듬는(refinement) 과정에 휴리스틱하거나 수작업을 요하는(hand-crafted) 기법이 많이 들어간다. 또한 사람이 겹쳐 있을 땐 그 과정이 더 어렵다. 앞서 1장의 Fig8처럼 사진 상으로 두 사람이 거의 겹쳐 있을 때 이 어깨가 누구의 어깨인지, 이 팔꿈치가 누구의 팔꿈치인지 구분하는 게 힘들단 뜻이다.

Bottom-up 방식은 Top-down의 느린 속도를 개선해야 한다는 의견 하에 속속 제안되었는데, 대표적으로는 OpenPose(2017), Associated Embedding(2017), PersonLab(2018), HigherHRNet(2020) 등이 있다.

## Single-stage Methods

이름에서도 알 수 있듯이 이미지로부터 한 번에 사람의 포즈를 추정하는 방식이다. Object detection task에서도 Two-stage 모델들이 - 정확은 하지만 - 느리고 구조가 복잡함을 꼬집으며 Single-stage 모델들이 생겨났다. YOLO (You Only Look Once)가 대표적일 것이다. HPE에서도 마찬가지로 Two-stage 모델들의 한계를 보완하기 위하여 Single-stage 모델들이 제안되고 있다.

일단 단계가 분할되지 않은 만큼 파이프라인은 보다 간단해졌고, 그래서 종단간 학습이 가능한 프레임워크로 구현하는 것이 더 쉬워졌다고 한다.

그러나 단계가 간소해진 만큼 정교함이 떨어질 수도 있고, 이를 보완하기 위한 후처리 방식(e.g., Non-Maximum Suppression)이 필요하기도 하다.

최근 제안되는 모델들은 거의 Single-stage methods이다. 예시로는 CenterNet(2019), SPM(2019), DirectPose(2019), Point-set Anchors(2020), FCPose(2021) 등이 있다.

- - -

# 참고: End-to-End Learning

우리말로는 '종단간 학습'이라고도 한다. 단어 그대로 '끝과 끝 간의'라는 뜻으로, 데이터의 입력부터 모델의 추론 결과 출력까지 부차 네트워크/프레임워크가 없이 한 번에 이루어지는 것을 말한다.

예를 들어, 카메라로 사람의 신분을 확인해 출입 허가 여부를 결정하는 시스템이 있다 하면, 카메라 영상에서 사람의 얼굴을 찾아내는 네트워크가 하나, 그 얼굴만 잘라 신원을 확인하는 네트워크가 하나 있다. 그렇다면 이는 네트워크가 나뉜 것이므로 종단간이 아니다. 반면 카메라 영상에서 바로 사람의 신원을 찾아낸다면 이는 종단간이라 할 수 있다.

End-to-end 방식은 사람의 선입견(preconceptions) 없이 네트워크가 자체적으로 데이터로부터 학습을 할 수 있다. 즉, '이렇게 데이터를 봐'라고 알려주지 않고, 알고리즘이 자신이 원하는 표현법을 알아서 학습하여 입력출력 매핑 함수를 찾아낸다. 예를 들어, 음성 인식에서 언어학자들이 만들어낸 음소(phonemes)라는 개념을 찾는 게 아니라, 네트워크가 알아서 특징을 찾아 학습하는 것이다. 또한 중간요소를 적게 설계해도 되기 때문에 작업 단순화가 가능해진다.

물론 단점도 분명하게 존재한다. 대표적으로는, 입력에서 바로 출력으로 가는'충분한' 데이터셋이 필요하다. 예를 들어 이미지에서 사람 얼굴을 찾는 데이터셋이 있고, 얼굴만 나오게 잘린 이미지에서 사람의 신분을 찾는 데이터셋이 따로 있다면, 이는 입력에서 바로 출력을 낼 종단간 학습에 사용하기 힘들다. 이 경우는 차라리 두 개의 네트워크로 나누어 따로 학습하는 것이 더 성능이 좋을 수 있다.

따라서, 해결하려는 문제가 무엇인지 파악하고, 입력출력의 충분한 데이터를 확보할 수 있을 때 사용하는 것이 좋다.

- - -

# References

<div id="inserted-box">
    <div class="notice-text"><p markdown="1">HPE 시리즈에서 사용하는 모든 레퍼런스는 한꺼번에 [[HPE] Human Pose Estimation References]({% link _posts/ai/computer_vision/2023-02-14-hpe_ref.md %})에 모아두었다.</p></div>
</div>

* <span style="background-color: #C5D3F6">[survey2020(1)]</span> Munea, Tewodros Legesse, et al. "The progress of human pose estimation: A survey and taxonomy of models applied in 2D human pose estimation." *IEEE Access* 8 (2020): 133330-133348.
* <span style="background-color: #C5D3F6">[survey(2022)]</span> Lan, Gongjin, et al. "Vision-Based Human Pose Estimation via Deep Learning: A Survey." *IEEE Transactions on Human-Machine Systems* (2022).
* DeepLearningAI (Andrew Ng), "[What is end-to-end deep learning? (C3W2L09)](https://www.youtube.com/watch?v=ImUoubi_t7s)"
* DeepLearningAI (Andrew Ng), "[Whether to Use End-To-End Deep Learning (C3W2L10)](https://www.youtube.com/watch?v=l_-CUyEx_x4)"