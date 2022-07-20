---
title:  "[Paper Review] Monocular Depth Estimation 논문 모음"
excerpt: "Monocular Depth Estimation Task 개념 및 관련 논문 간단 리뷰"

categories:
  - Paper Review
tags:
  - Deep Learning
  - Papaer Review
  - Computer Vision
last_modified_at: 2022-07-15
use_math: true
---

> 프로그래머스 자율주행 데브코스 3기 최종 프로젝트 'Monocular Depth Estimation and Evaluation with LiDAR (단일 이미지로부터의 깊이 추정과 LiDAR 데이터를 이용한 평가)'를 위하여 선행연구를 조사한 내용이다.

> 해당 프로젝트는 [GitHub Repository](https://github.com/winterbloooom/depth-estimation-with-lidar)에서 소스코드와 상세 보고서를 볼 수 있다.

# Monocular Depth Estimation

## 개요
단일 이미지 깊이 추정(Monocular depth estimation)은 하나의 이미지에서 각 픽셀 위치에서의 깊이(거리, depth)를 정확히 추정하는 문제이다. 컴퓨터 비전에서 오랜 기간 연구되어 왔으며, 자율주행 자동차와 로보틱스 등에 적용되고 있다. 

그러나 몇 가지 어려움이 존재하여 여전히 풀기 어려운 문제로 거론되고 있다. 무한하게 많은 3차원 이미지가 2차원으로 투영될 수 있기 때문에 깊이를 정확히 하나로 추정하기에 까다롭다. 사람의 경우, 다양한 조명 환경에서의 질감(texture)이나 시점(perspective), 알고 있는 객체에 대한 상대적 크기 등의 local cue와 장면 내 전체적 모양과 레이아웃 등의 global context를 적절히 활용하여 자연스럽게 깊이를 추정할 수 있다. 그러나 이 작업을 수행하는 컴퓨터 비전 기능을 만들기에는 단일 이미지 내 사용할 수 있는 단서(cue)가 부족하고, scale ambiguity 문제가 존재하며, 재질이 반투명하거나 반사되는 성질이 있다면 깊이 추정의 정확도가 크게 하락할 수 있다.

이미지에서 깊이를 추정하는 것은 곧 3차원 공간 정보를 복원하는 기술로 볼 수 있다. 전통적으로는 인간의 두 눈(Stereo vision)이 사물을 보고 판단하는 방식에 영감을 받은 다중 시점 매칭 알고리즘을 만들고 이를 기반으로 깊이 정보를 예측하였다. Saxena 등이 2005년 최초로 DNN 방식을 적용한 것을 시작으로, 최근에는 심층학습 기반(learning based)의 깊이 추정 방식들이 주를 이뤄 연구되고 있다. Learning based depth estimation 기법들은 크게 supervised, semi-supervised, unsupervised(self-supervised) learning 방식으로 다시 나눌 수 있다.

## 분류
Supervised learning 방식에서는 이미지의 각 픽셀(pixel-wise)에 대응되는 깊이 정보가 ground truth로서 주어져야 한다. 깊이 정보는 RGB-D 카메라나 다채널 레이저 스캐너의 point cloud data로부터 얻을 수 있다. Eigen 등이 2015년 합성곱(convolution) 아키텍처를 도입한 이후로 대부분의 후속 연구들이 Deep CNN 방식을 채택한 supervised learning 방식을 사용하고 있다. 

최근에는 encoder-decoder 방식을 추가하여 큰 성능 향상을 이루고 있기도 하다. Encoder는 주로 이미지 분류 네트워크인 VGG, ResNet, DenseNet 등의 심층신경망을 사용하여 이미지에서 특징(features)를 추출한다. Backbone이라고도 불리며, 합성곱(convolution) 연산과 풀링(pooling) 연산을 수행한다. 

Decoder는 encoder에서 출력한 features를 정합(aggregate)하고, encoder에서 줄어들었던 해상도(resolution)를 복원하며, 최종적으로 픽셀별로의 깊이를 추정한다. Decoder는 주로 합성곱 연산과 up-sampling 연산이 연속적으로 이루어져 있는 구조이다. 

최근에는 자연어 처리(Natural Language Processing, NLP)에 성공적으로 적용되었던 Attention Mechanism을 도입하며 Transformer를 단일 이미지의 깊이 추정 작업에 적용하는 사례가 많아지고 있다. 아래에서 간단히 소개할 BTS, DPT, AdaBins, DepthFormer 등이 supervised learning 방식의 모델에 해당한다.

Semi-supervised learning 방식은 weakly supervised learning 방식으로도 불린다. 상대적 깊이를 사용하거나, LiDAR 데이터를 추가적으로 이용하는 등의 연구가 진행된 바 있다.

Unsupervised learning, 혹은 self-supervised learning 방식은 ground truth의 깊이 정보를 사용하지 않고, 보정(rectified)된 stereo image 쌍만을 이용하여 깊이 추정 모델을 훈련(train)시킨다. Godard 등은 2017년 MonoDepth 모델을 제안하여, 깊이 추정 문제를 이미지 복원(reconstruct) 문제로 전환하여 깊이를 추정한다.

# Works
위 주제에 대한 몇 가지 논문들을 읽으며 간단히 각 모델들의 특징을 정리했다. 모델을 선정한 기준은 다음과 같다.

* Supervised learning 기반 모델과 unsupervised learning 기반 모델을 모두 포함하기
* 타 모델과의 두드러지는 차별점을 가졌거나 후속 연구들에서 자주 언급되는 연구
* [Monocular Depth Estimation on KITTI Eigen split benchmark](https://paperswithcode.com/sota/monocular-depth-estimation-on-kitti-eigen)에서 좋은 성능을 보였던 연구

벤치마크로 KITTI Eigen Split를 선택한 이유는, 해당 내용이 자율주행을 공부하는 프로젝트의 일부로서 진행된 조사였고, 그렇기 때문에 실내보다는 다양한 실외 상황에서 강건하게 작동하는지 알아보고자 했기 때문이다. 실외의 경우, 실내보다 depth 값의 범위가 크고 다양하며, 하늘 등 깊이를 추정하기 어려운 요소들이 매우 많다.

## BTS

Lee 등이 논문 'From big to small: Multi-scale local planar guidance for monocular depth estimation'에서 제시한 모델 BTS는 Encoder-Decoder 구조를 갖는 supervised learning 모델이다. Encoder backbone으로 Dense Feature Extractor를 사용하여 feature map을 생성하며, 이 결과를 ASPP(Atrous Spatial Pyramid Pooling) 레이어에 전달해 contextual information을 추출한다. Decoding 단계에서 각 multiple stages에 LPG(Local Planar Guidance) 레이어를 사용해 large scale variation을 파악하고, 해상도를 입력 이미지 크기로 다시 복원한다. Decoder의 각 레이어들은 4차원 평면 coefficients를 각각 학습하고 그 출력을 비선형적으로 결합하여 최종 깊이 추정치를 반환한다.

![](https://winterbloooom.github.io/assets/images/paper_reivew/2022-07-15-01.jpg){: .align-center}

## DPT

Ranftl 등이 논문 'Vision transformers for dense prediction'에서 제안한 DPT 모델은 Encoder-Decoder 구조를 갖는 supervised learning 모델이다. Dense Prediction Transformer (DPT)를 제안하여 Encoder backbone으로 Vision Transformer(ViT)를 사용한다. 모델의 아키텍처는 크게 4 단계로 이루어져 있다.

* 입력 이미지를 토큰(token)으로 바꾸는 embed 단계
* 여러 개의 stages에서 특징을 추출하는 Transformers
* 여러 해상도에서 서로 다른 stages의 토큰을 합쳐 이미지 형상의 feature maps를 만드는 Rsassemble
* residual convolution units를 활용해 feature maps를 합치고 up-sampling하여 최종 깊이 추정치를 반환하는 Fusion 단계

모든 stages에서 global receptive field를 가지고 있어 globally coherent한 깊이를 예측할 수 있으며, 해당 모델로 monocular depth estimation 뿐만 아니라 semantic segmentation도 수행할 수 있다.

![](https://winterbloooom.github.io/assets/images/paper_reivew/2022-07-15-02.jpg){: .align-center}

## AdaBins

Bhat 등이 논문 'Adabins: Depth estimation using adaptive bins'에서 제안하였다. BTS나 DPT 모델처럼 Encoder-Decoder 구조를 갖는 supervised learning 모델에 해당하나, 기존 연구들이 monocular depth estimation을 회귀(regression) 문제로 해결한 것과는 달리, 저자들은 이를 분류(classification) 문제로 접근하였다. 표준적인 Encoder-Decoder의 결과를 입력으로 받는 AdaBins(Adaptive Bin-width Estimator) 모듈은 Mini-ViT를 사용해 bin width $\mathbf{b}$ 와 Range-Attention Maps $\mathcal{R}$을 계산하고, 각 scene의 features에 따라 bins를 적응적으로 바꾼다. 또한 classification을 수행함으로써 깊이 값들을 이산화(discretization)한다. Bin centers의 선형 결합으로 최종적인 깊이의 예측값을 생성한다.

![](https://winterbloooom.github.io/assets/images/paper_reivew/2022-07-15-03.jpg){: .align-center}

## GLPDepth

TBD...

## DepthFormer

DepthFormer 역시 Encoder-Decoder 구조를 갖는 supervised learning 모델이며, Li 등이 논문 'DepthFormer: Exploiting Long-Range Correlation and Local Information for Accurate Monocular Depth Estimation'에서 제안하였다. 해당 모델의 큰 특징 두 가지는 (1) Transformer branch와 Convolution branch로 구성된 encoder 구조와 (2) 두 branch를 정합(aggregate)하기 위한 HAHI(Hierarchical Aggregation and Heterogeneous Interaction) 모듈이다.

합성곱(convolution) 연산만을 사용하는 기존 모델들은 spatial inductive bias가 부족하여 global한 객체 간 관계를 놓치거나 원거리 객체의 깊이 정보를 정확히 추정하지 못하는 등의 문제가 발생했다. 이를 보완하기 위하여 Transformer와 Convolution branch로 각각 나누어 모델의 학습을 진행하여, local 정보를 탐색할 뿐만 아니라 long-range correlation도 파악할 수 있게 된다. 또한 Encoder의 ViT로 Swin Transformer를 사용함으로써 계층적 특징(hierarchical features)를 추출하고 연산의 복잡도를 개선했다. Swin Transformer는 논문 'Swin transformer: Hierarchical vision transformer using shifted windows'에서 제안되었다.

DepthFormer는 이러한 두 branch를 단순한 late fusion이 아닌 HAHI 모듈을 사용해 정합함으로써 feature을 향상시킬 뿐만 아니라 model affinity도 향상시킨다. 그림은 DepthFormer의 아키텍처를 간단히 나타낸 그림이다.

![](https://winterbloooom.github.io/assets/images/paper_reivew/2022-07-15-04.jpg){: .align-center}


## MonoDepth

앞서 살펴본 네 모델과는 다르게 unsupervised learning 방식을 가진다. Godard 등이 논문 'Unsupervised monocular depth estimation with left-right consistency'에서 처음으로 제안한 모델이다. 저자들은 supervised learning 방식이 각 이미지 픽셀에 일일이 대응하는 ground truth 정보가 필요하고 데이터셋 구축에 따른 비용이 매우 크다고 지적하였다. MonoDepth의 큰 특징은 binocular stereo camera로 얻은 stereo 이미지 쌍이 주어졌을 때, 왼쪽 이미지에서 추정한 깊이 정보를 바탕으로 오른쪽 이미지를 복원하고, 이때 양 이미지 간의 시차(disparity)를 모델의 학습에 이용한다는 것이다. 또한 새로운 학습 loss를 제안하여, 추정한 depth maps 간 지속성(consistency)를 강화했다. 현재는 MonoDepth2가 나온 상태이다.

![](https://winterbloooom.github.io/assets/images/paper_reivew/2022-07-15-05.jpg){: .align-center}

# Reference
[1] Jin Han Lee, Myung-Kyu Han, Dong Wook Ko, and Il Hong Suh. From big to small: Multi-scale local planar guidance for monocular depth estimation. arXiv preprint arXiv:1907.10326, 2019.

[2] Zhenyu Li, Zehui Chen, Xianming Liu, and Junjun Jiang. Depth- former: Exploiting long-range correlation and local informa- tion for accurate monocular depth estimation. arXiv preprint arXiv:2203.14211, 2022.

[3]    Seong-Hun Im.  인공지능   기반   3 차원   공간   복원   최신   기술   동향. Broadcasting  and  Media  Magazine, 25(2):17–26, 2020.

[4] Ashutosh Saxena, Sung Chung, and Andrew Ng. Learning depth from single monocular images. Advances in neural information processing systems, 18, 2005.

[5] Clement Godard, Oisin Mac Aodha, and Gabriel J Brostow. Unsu- ´ pervised monocular depth estimation with left-right consistency. In Proceedings of the IEEE conference on computer vision and pattern recognition, pages 270–279, 2017.

[6] David Eigen and Rob Fergus. Predicting depth, surface normals and semantic labels with a common multi-scale convolutional architecture. In Proceedings of the IEEE international conference on computer vision, pages 2650–2658, 2015.

[7] Rene Ranftl, Alexey Bochkovskiy, and Vladlen Koltun. Vision ´ transformers for dense prediction. In Proceedings of the IEEE/CVF International Conference on Computer Vision, pages 12179–12188,


[8] Weifeng Chen, Zhao Fu, Dawei Yang, and Jia Deng. Single-image depth perception in the wild. Advances in neural information pro- cessing systems, 29, 2016.

[9] Yevhen Kuznietsov, Jorg Stuckler, and Bastian Leibe. Semi- supervised deep learning for monocular depth map prediction. In Proceedings of the IEEE conference on computer vision and pattern recognition, pages 6647–6655, 2017.

[10] Shariq Farooq Bhat, Ibraheem Alhashim, and Peter Wonka. Ad- abins: Depth estimation using adaptive bins. In Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition, pages 4009–4018, 2021.

[11] Ze Liu, Yutong Lin, Yue Cao, Han Hu, Yixuan Wei, Zheng Zhang, Stephen Lin, and Baining Guo. Swin transformer: Hierarchical vision transformer using shifted windows. In Proceedings of the IEEE/CVF International Conference on Computer Vision, pages 10012–10022, 2021.


[12] Andreas Geiger, Philip Lenz, Christoph Stiller, and Raquel Urtasun. Vision meets robotics: The kitti dataset. The International Journal of Robotics Research, 32(11):1231–1237, 2013.

[13] Ze Liu, Han Hu, Yutong Lin, Zhuliang Yao, Zhenda Xie, Yixuan Wei, Jia Ning, Yue Cao, Zheng Zhang, Li Dong, et al. Swin transformer v2: Scaling up capacity and resolution. In Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition, pages 12009–12019, 2022.

[14] David Eigen, Christian Puhrsch, and Rob Fergus. Depth map predic- tion from a single image using a multi-scale deep network. Advances in neural information processing systems, 27, 2014.