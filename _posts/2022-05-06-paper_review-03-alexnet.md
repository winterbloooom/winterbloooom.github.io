---
title:  "[Paper Review] AlexNet: ImageNet Classification with Deep Convolutional Neural Networks"
excerpt: "AlexNet 모델 논문 리뷰 및 PyTorch 구현"

categories:
  - Paper Review
tags:
  - Deep Learning
  - Image Classification
  - Papaer Review
  - Computer Vision
last_modified_at: 2022-07-02
use_math: true
---

![](https://winterbloooom.github.io/assets/images/paper_review/2022-07-02-01.png){: .align-center}

# Information
* **Title**: Imagenet classification with deep convolutional neural networks
* **Authors**: Krizhevsky, Alex, Ilya Sutskever, and Geoffrey E. Hinton
* **Source**: Advances in neural information processing systems 25 (2012)

# 논문 요약

해당 논문은 2012년 ILSVRC(ImageNet Large-Scale Visual Recognition Challenge) 대회에서 1위를 한 일명 AlexNet에 대한 논문이다. Top-5 error rate를 15.3%의 수치를 기록하며 26.2%였던 2위보다 큰 폭으로 우승을 거두었다.

> Top-5 Error: 모델이 예측한 상위 5개의 class 중 정답이 없는 경우의 에러율

## Dataset

사용한 데이터셋은 ImageNet으로, 1500만 개 이상의 고해상도 이미지로 이뤄져 있으며 2만 2천 개 클래스를 가지고 있다. ILSVRC에서는 그 중 1000개의 클래스를 이용해 각 클래스 당 1000개의 이미지를 포함한다. 하여 약 120만 개의 training 이미지, 5만 개의 validation 이미지, 15만 개의 test 이미지로 구성된다.

모델에는 위 데이터를 전처리하여 사용했는데, 해상도를 256 X 256 크기로 고정하여 다운샘플 했는데, 넓이와 높이 중 짧은 쪽을 256으로 하고 중앙 부분을 기점으로 다른 쪽을 256 크기로 잘랐다. 또한, 각 이미지 픽셀에 training 데이터의 평균을 빼 normalize 했다.

## Architecture

### 전체적 구조

AlexNet의 구조는 8개의 학습 레이어로 구성되어 있으며 그 중 5개는 합성곱층(convolutional layer), 3개는 완전연결층(fully-connected layer)이다. 아래 그림(논문에서 발췌)은 전체적 구조를 나타낸 것이며, 이를 표로 정리해 보았다.

![](https://winterbloooom.github.io/assets/images/paper_review/2022-07-02-02.jpg){: .align-center}


| Layer | Input | Output | Kernel 개수 | Kernel Size | Stride | Padding | 추가 설명 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Input | 227 X 227 X 3 |  |  |  |  |  | (1) |
| Conv 1 | 227 X 227 X 3 | 55 X 55 X 96 | 96 | 11 X 11 | 4 | 0 | (2) |
| Max Pool 1 | 55 X 55 X 96 | 27 X 27 X 96 |  | 3 X 3 | 2 |  | (3) |
| Norm 1 | 27 X 27 X 96 | 27 X 27 X 96 |  |  |  |  | (4) |
| Conv 2 | 27 X 27 X 96 | 27 X 27 X 256 | 256 | 5 X 5 | 1 | 2 | (5) |
| Max Pool 2 | 27 X 27 X 256 | 13 X 13 X 256 |  | 3 X 3 | 2 |  |  |
| Norm 2 | 13 X 13 X 256 | 13 X 13 X 256 |  |  |  |  |  |
| Conv 3 | 13 X 13 X 256 | 13 X 13 X 384 | 384 | 3 X 3 | 1 | 1 | (6) |
| Conv 4 | 13 X 13 X 384 | 13 X 13 X 384 | 384 | 3 X 3 | 1 | 1 |  |
| Conv 5 | 13 X 13 X 384 | 13 X 13 X 256 | 256 | 3 X 3 | 1 | 1 |  |
| Max Pool 3 | 13 X 13 X 256 | 6 X 6 X 256 |  | 3 X 3 | 2 |  |  |
| FC 1 | 6 X 6 X 256 | 4096 |  |  |  |  | (7) |
| FC 2 | 4096 | 4096 |  |  |  |  |  |
| FC 3 (Output) | 4096 | 1000 |  |  |  |  | (8) |

1. 논문과 그림에서는 입력 이미지 크기가 224 X 224 X 3라고 했으나 실제로는 227 X 227 X 3이어야 계산이 맞다고 한다.
2. 모든 합성곱층은 ReLU를 활성화함수로 사용한다. 이에 대한 내용은 바로 다음에 설명한다.
3. Overlapping Max Pooling이다. 이에 대한 내용도 이어 설명할 것이다.
4. Local Response Normalization을 사용하는 층이다. 추후 자세한 내용을 설명한다.
5. 논문의 그림에서는 두 번째 합성곱층(Conv2)에서 3 X 3 Kernel을 사용했다고 하나, 그림의 오류라고 한다.
6. 다른 합성곱층들은 전 단계의 같은 채널의 특성맵들과만 연결되어 있으나, 세 번째 합성곱층(Conv 3)는 전 단계의 두 채널의 특성맵과 모두 연결되어 있다.
7. 6 X 6 X 256 크기의 특성맵을 flatten해서 9,216 차원의 벡터로 만드는 역할을 한다. 이를 4096개의 뉴런을 갖는 두 번째 완전연결층 FC2로 전달한다. 또한 FC1, 2 모두 ReLU로 활성화함수를 사용한다.
8. 1000 개의 클래스로 분류를 해야 하기 때문에 출력 뉴런의 수도 1000개이다. 이들 뉴런 모두 softmax 함수를 적용해 각 클래스에 속할 확률을 나타낸다.

### ReLU Nonlinearity

AlexNet에서는 활성화 함수로 ReLU를 사용했다.

saturating nonlinearity에 해당하는 다른 활성화 함수인 tanh($f(x) = \mathrm{tanh}(x)$)나 sigmoid($f(x) = (1 + e^{-x})^{-1}$)보다 non-saturating nonlinearlity인 ReLU(Rectified Linear Units)($f(x) = \mathrm{max}(0, x)$)가 월등히 빠른 속도를 보인다고 한다. 논문에서는 CIFAR-10 데이터셋으로 학습을 시켰을 때 25% training error를 보이는 데까지 tanh 뉴런과 ReLU 뉴런을 적용해 비교해보았을 때 후자에서 약 6배 빨랐다고 실험 결과를 보였다.

![](https://winterbloooom.github.io/assets/images/paper_review/2022-07-02-03.png){: .align-center}


### Training on Multiple GPUs

이 모델을 학습시킬 때 GPU를 2개로 나눠 반반씩 학습을 시켰는데(GPU Parallelization), 당시 120만 개의 데이터를 학습시키기엔 하드웨어 성능의 한계가 있었기 때문이다. 당시 사용한 GPU는 두 개의 NVIDIA GTX 580 3GP GPU 였다. 이렇게 나누어 학습을 시킨 결과 top-1 error가 1.7%, top-5 error가 1.2% 감소했다고 한다. 각각의 GPU는 독립적으로 학습을 한다.


### Local Response Normalization

tanh나 sigmoid 활성화함수의 경우, saturation 문제가 있다. 활성화함수의 어떠한 구간(좌우 끝으로 갈 수록)에서 기울기(gradient)가 0에 가까워진다면(saturated) vanishing gradient 문제가 발생한다. vanishing gradient는 번역 그대로 기울기 값이 사라지는 문제이며, 역전파를 사용해 신경망을 학습시킬 때 기울기가 사라지는 것은 앞쪽 레이어의 파라미터를 학습시키는 데 큰 문제를 야기할 수 있다.

반면 ReLU는 적어도 양수 구간에서는 이러한 문제가 일어나지 않는다. 따라서 saturating을 막기 위한 입력 normalization을 필요로 하지 않는다.

![](https://winterbloooom.github.io/assets/images/paper_review/2022-07-02-04.png){: .align-center}


다만, ReLU의 양수 구간에서 그 값을 그대로 다음 뉴런에 전달하는데, 이때 너무 큰 값이 전달된다면 주변의 낮은 값들이 뉴런에 전달되지 않을 위험도 있다. 이를 예방하기 위한 normalization 방법으로 Local Response Normalization을 사용했다.

이 아이디어는 실제 뉴런에서의 later inhibition(측면 억제)에서 영감을 받았다고 한다. 

> 신경생물학에서 later inhibition(측면 억제)는 활성화된 뉴런이 주변 이웃 뉴런들을 억누르는 현상이다. 이것을 모델링 한 것이 Local Response Normalization이다.
> 

수식은 아래와 같다.

$$
b^{i}_{x, y} = \cfrac{a^{i}_{x, y}}{\left( k + \alpha \sum\limits_{j = \max \left(0,\ i-n/2 \right)}^{\min \left(N-1,\ i+n/2 \right)} \left( a^{j}_{x, y} \right) ^2 \right) ^{\beta}}
$$

이때 $b^{i}_{x, y}$ 는 $x,\ y$ 에서 $i$ 번째 커널의 정규화 결과(response-normalized activity), $a^{i}_{x, y}$ 는  $x,\ y$ 에 적용된 $i$ 번째 커널의 활성화함수 output이며, $N$ 은 레이어의 전체 커널의 개수, $n$ 은 같은 공간적 위치에서 주변(adjacent)의 커널 맵 개수, $\alpha ,\ \beta ,\ k$ 는 하이퍼파라미터에 해당한다.

위 방법을 이용해 강하게 활성화된 뉴런의 주변 이웃 뉴런에 대해 normalization을 수행한다. 주변에 비해 특정 뉴런이 강하게 활성화되었다면 그 뉴런의 반응이 더 강조될 것이고, 강하게 활성화된 주변 뉴런도 강하게 활성화되어 있다면 Local Response Normalization 이후에 값이 다들 작아질 것이다. 이 방법으로 top-1 error를 1.4%, top-5 error를 1.2% 감소시켰다. 수렴의 속도도 빨라진다.

> AlexNet 이후 현대의 CNN에서는 Local Response Normalization 대신 Batch Normalization을 널리 쓴다고 한다.
> 

### Overlapping Pooling

CNN에서 풀링층은 같은 커널 맵에서 근방 그룹의 뉴런들의 출력을 함축적으로 표현하는 효과를 가진다. 

전통적으로는 overlap하지 않고 커널 사이즈($z$)와 스트라이드($s$)가 같다($s = z$). 반면 $s < z$가 되면 풀링이 overlap 된다. AlexNet에서는 $s = 2,\ z=3$으로 설정했다. top-1, top-5 error를 낮췄을 뿐만 아니라 오버피팅도 방지한다고 한다.

## Reducing Overfitting

AlexNet은 6천만 개의 파라미터를 가지고 있고, 이를 분류할 때 오버피팅을 피하기 위한 방법이 반드시 고안되어야 했다. 이에 저자들은 두 가지 방법을 사용했다.

### Data Augmentation

데이터의 레이블을 그대로 유지하면서 인공적으로 데이터셋의 크기(수)를 늘려 오버피팅을 방지하는 방법이다. AlexNet에서는 두 가지 augmentation을 적용했다.

첫 번째는 이동 및 수평 반전을 시킨 이미지를 생성하는 것이다(generating image translations and horizontal reflection). 256 X 256 크기의 이미지에서 랜덤하게 227 X 227 크기로 자르고 이를 수평 반전시킨다. 자를 때 중앙과 각 모서리를 이용하면 5개의 224 X 224 이미지가 나오고, 이들을 각각 수평 반전시켰으니 종합 10개의 이미지를 생성하는 셈이다.

![](https://winterbloooom.github.io/assets/images/paper_review/2022-07-02-05.png){: .align-center}

두 번째는 training set에서 RGB 채널의 intentity를 바꾸는 것이다(altering the intensities of the RGB channels in training images). 구체적으로는 RGB 픽셀 값에 대한 PCA를 적용했는데, R/G/B 각 색상에 대한 eigenvalue를 찾고 이에 랜덤 변수(평균이 0, 표준 편차가 0.1인 가우시안 분포에서)를 곱한다. 따라서 RGB 이미지의 한 픽셀의 intensity $I_{xy} = \left[ I_{xy}^R,\ I_{xy}^G,\ I_{xy}^B \right] ^T$에 다음의 수를 더해주게 된다.

$$
[\mathbf{p}_1,\ \mathbf{p}_2,\ \mathbf{p}_3][\alpha_1\lambda_1, \ \alpha_2\lambda_2, \ \alpha_3\lambda_3]^T
$$

여기서 RGB 픽셀 값의 3 X 3 공분산 행렬에 대해 $\mathbf{p}_i$는 $i$번째 eigenvector, $\lambda_i$는 $i$번째 eigenvalue이다. $\alpha_i$는 평균이 0, 표준 편차가 0.1인 가우시안 분포를 따르는 랜덤값으로, 한 이미지에서 한 번만 추출한다.

위 방법을 사용함으로써 조명에 대한 intensity와 색의 변화에 불변성을 갖게 되며, top-1 error를 감소시켰다고 한다.

### Dropout

드랍아웃은 은닉층의 몇몇 뉴런의 출력 결과를 0으로 만든다(drop). 드랍아웃된 뉴런은 순전파와 역전파에 영향을 주지 않는다. 다른 뉴런의 존재에 의존하지 않으므로, 뉴런의 co-adaptation(동조화) 현상을 감소시킬 수 있다. 이로써 다른 뉴널들의 랜덤한 subset들과 결합할 때 유용하게 작용하도록 더욱 robust한 feature를 학습할 수 있다.

AlexNet의 train에는 0.5의 확률로 dropout을 적용했고, test시에는 모든 뉴런을 사용했으나 그들의 출력에 0.5를 곱했다고 한다. 또한 두 개의 완전연결층(FC1, FC2)에만 dropout을 적용했다. Dropout을 사용하지 않으면 오버피팅이 되거나 수렴에 다다르는 데 두 배의 시간이 걸린다고 한다.

## Details of learning

구체적으로 어떻게 학습을 시켰는지 제시되었다.

AlexNet에서는 Stochastic Gradient Descent(SGD)를 사용했으며, 여기에 사용된 batch 크기는 128개, momentum은 0.9, weight decay는 0.0005였다. 이때 weight decay는 regularizer가 아닌 training error를 감소시키는 데 아주 중요한 역할을 한다. weight $w$의 업데이트는 아래의 식으로 진행한다.

![](https://winterbloooom.github.io/assets/images/paper_review/2022-07-02-06.png){: .align-center}

이때 $i$는 반복의 인덱스이고, $v$는 momentum 변수, $\epsilon$은 학습률(learning rate), $D_i$는  $i$번째 batch를 말한다.

저자들은 각 레이어에서 평균이 0이고 표준 편차가 0.01인 가우시안 분포를 사용해 weight를 초기화했다.

bias의 경우 두 번째, 네 번째, 다섯 번째 합성곱층(Conv 2, 4, 5)과 완전 연결층에서는 1로 초기화했으며, 이러한 초기화 방식이 초기 단계에서 ReLU에 양수 입력을 주기 때문에 학습을 가속화시킬 수 있다고 한다. 나머지 레이어에서는(Conv 1, 3) bias를 0으로 초기화했다.

모든 레이어에서 학습률을 똑같이 0.01로 초기화하고, training이 진행되는 동안 validation error가 개선되지 않으면 10으로 나눴다. 학습이 종료되기까지 3번에 걸쳐 학습률을 감소시켰다.

---

# PyTorch로 AlexNet 구현하기

PyTorch를 사용하여 AlexNet을 직접 구현해보고 학습을 시켜보았다. 

사용한 데이터셋은 TorchVision에서 제공하는 STL10으로, 10가지 클래스를 가지고 있는 데이터셋이다. 논문에서는 Augmentation 방식으로 horizontal filp과 random한 crop을 거치며 한 이미지 당 10개가 만들어졌는데, 여기서는 데이터 개수를 늘리지는 않고 augmentation을 진행했다.

Loss로는 CrossEntrophy를 사용하였고, batch 크기는 64로 하여 5번의 epoch을 반복했다. 

논문에서는 SGD를 사용했으나, 본인의 경우 Adam으로도 진행해보았다. 

> 전체 코드는 [GitHub](https://github.com/EunGiHan/deeplearning-study/tree/main/AlexNet_pytorch)에 있다. 여기서는 간단히 주요 내용만 표시한다.
> 

결론적으로 말하자면, Loss가 줄어들지 않고 정확도도 10% 가량으로 매우 낮았다. 직접 값을 찍어보니 한 배치 내에서 거의 똑같은 예측을 하고 있었다. 이유는 파악하지 못했다. 지난번 LeNet 구현에서도 그랬기 때문에 이번에도 ‘훈련을 적게 시키거나 레이어가 얕아서’ 이겠거니 하는 수밖에 없었다.

## AlexNet 모델

```python
class AlexNet(nn.Module):
    def __init__(self, batch, n_classes, in_channel, in_width, in_height, is_train=False):
        super().__init__()

        self.batch = batch
        self.n_classes = n_classes
        self.in_channel = in_channel
        self.in_width = in_width
        self.in_height = in_height
        self.is_train = is_train

        self.conv1 = nn.Conv2d(
            in_channels=self.in_channel, out_channels=96, kernel_size=11, stride=4, padding=0,
        )
        self.pool1 = nn.MaxPool2d(kernel_size=3, stride=2)

        self.conv2 = nn.Conv2d(
            in_channels=96, out_channels=256, kernel_size=5, stride=1, padding=2
        )
        self.pool2 = nn.MaxPool2d(kernel_size=3, stride=2)

        self.conv3 = nn.Conv2d(
            in_channels=256, out_channels=384, kernel_size=3, stride=1, padding=1
        )

        self.conv4 = nn.Conv2d(
            in_channels=384, out_channels=384, kernel_size=3, stride=1, padding=1
        )

        self.conv5 = nn.Conv2d(
            in_channels=384, out_channels=256, kernel_size=3, stride=1, padding=1
        )
        self.pool3 = nn.MaxPool2d(kernel_size=3, stride=2)

        self.fc1 = nn.Linear(in_features=(6 * 6 * 256), out_features=4096)
        self.fc2 = nn.Linear(in_features=4096, out_features=4096)
        self.fc3 = nn.Linear(in_features=4096, out_features=self.n_classes)

        self.relu = nn.ReLU(inplace=True)

        self.norm = nn.LocalResponseNorm(size=5, alpha=0.0001, beta=0.75, k=2)

        self.dropout = nn.Dropout(p=0.5)

        torch.nn.init.normal_(self.conv1.weight, mean=0, std=0.01)
        torch.nn.init.normal_(self.conv2.weight, mean=0, std=0.01)
        torch.nn.init.normal_(self.conv3.weight, mean=0, std=0.01)
        torch.nn.init.normal_(self.conv4.weight, mean=0, std=0.01)
        torch.nn.init.normal_(self.conv5.weight, mean=0, std=0.01)
        torch.nn.init.normal_(self.fc1.weight, mean=0, std=0.01)
        torch.nn.init.normal_(self.fc2.weight, mean=0, std=0.01)
        torch.nn.init.normal_(self.fc3.weight, mean=0, std=0.01)

        torch.nn.init.constant_(self.conv1.bias, 0)
        torch.nn.init.constant_(self.conv2.bias, 1)
        torch.nn.init.constant_(self.conv3.bias, 0)
        torch.nn.init.constant_(self.conv4.bias, 1)
        torch.nn.init.constant_(self.conv5.bias, 1)
        torch.nn.init.constant_(self.fc1.bias, 0)
        torch.nn.init.constant_(self.fc2.bias, 0)
        torch.nn.init.constant_(self.fc3.bias, 0)

    def forward(self, x):
        x = self.conv1(x)
        x = self.relu(x)
        x = self.norm(x)
        x = self.pool1(x)

        x = self.conv2(x)
        x = self.relu(x)
        x = self.norm(x)
        x = self.pool2(x)

        x = self.conv3(x)
        x = self.relu(x)

        x = self.conv4(x)
        x = self.relu(x)

        x = self.conv5(x)
        x = self.relu(x)
        x = self.pool3(x)

        x = x.view(-1, 256 * 6 * 6)
        # print(x.shape)

        x = self.fc1(x)
        x = self.relu(x)
        x = self.dropout(x)

        x = self.fc2(x)
        x = self.relu(x)
        x = self.dropout(x)

        x = self.fc3(x)
        # x = nn.functional.softmax(x, dim=1)

        if self.is_train is False:
            # if mode is 'test', only one answer is needed, not all probabilities for all classes
            x = torch.argmax(x, dim=1)

        # print("output shape: " + str(x.shape))
        return x
```

## Loss

```python
class STL10Loss(nn.Module):
    def __init__(self, device=torch.device("cpu")):
        super(STL10Loss, self).__init__()
        self.loss = nn.CrossEntropyLoss().to(device)

    def forward(self, out, label):
        """
        arguments:
        out     --  model's output
        label   --  ground truth
        """
        loss_val = self.loss(out, label)
        return loss_val
```

## Train

```python
def train_model(
    _model,
    device,
    train_loader,
    batch,
    n_classes,
    in_channel,
    in_width,
    in_height,
    _epoch,
    output_dir,
    torch_writer,
):
    print("\n" + "=" * 50 + " Train Model " + "=" * 50)

    model = _model(
        batch=batch,
        n_classes=n_classes,
        in_channel=in_channel,
        in_width=in_width,
        in_height=in_height,
        is_train=True,
    )
    model.to(device)
    model.train()

    # check model architecture
    print(model)
    summary(model, input_size=(3, 227, 227), batch_size=32, device=device.type)

    # check parameters initialization
    # for param in model.parameters():
    #     print(param)
    #     break

    optimizer = optim.SGD(
        model.parameters(), lr=0.001, momentum=0.9, weight_decay=0.0005
    )
    # optimizer = optim.Adam(model.parameters(), lr=1e-3, weight_decay=1e-5)

    scheduler = optim.lr_scheduler.StepLR(optimizer=optimizer, step_size=30, gamma=0.1)
    
    criterion = STL10Loss(device=device)

    epoch = _epoch
    iter = 0

    for e in range(epoch):
        total_loss = 0
        correct = 0
        img_num = 0

        for i, batch in enumerate(train_loader):
            img = batch[0]
            img = img.to(device)
            label = batch[1]
            label = label.to(device)

            out = model(img)  # shape: (batch, n_classes)
            _, pred = torch.max(out, 1) #(input Tensor, dim) -> Tuple(max, max_indices)
            # print("pred:", pred)
            # print("label: ", label)

            loss_val = criterion(out, label)
            loss_val.backward()

            optimizer.step()
            optimizer.zero_grad()

            total_loss += loss_val.item()
            correct += torch.sum(pred == label)
            img_num += len(label)

            if iter % 10 == 0:
                print(
                    "{:>2} / {:>2} epoch ({:>3.0f} %) {:>3} iter \t loss: {:>.8f} \t accuracy: {:>4} / {:>4} ({:>4.2f} %)".format(
                        e,
                        epoch,
                        100.0 * i / len(train_loader),
                        iter,
                        loss_val.item(),
                        correct.item(),
                        img_num,
                        100.0 * correct.item() / img_num,
                    )
                )

                torch_writer.add_scalar("lr", get_lr(optimizer), iter)
                torch_writer.add_scalar("total_loss", loss_val, iter)
                torch_writer.add_scalar("accuracy", 100.0 * correct / img_num, iter)

            iter += 1

        scheduler.step()

        mean_loss = total_loss / i
        mean_accuracy = correct / img_num
        print(
            "-> {:>2} / {:>2} epoch \t mean loss: {} \t mean accuracy: {}".format(
                e, epoch, mean_loss, mean_accuracy
            )
        )

        torch.save(model.state_dict(), output_dir + "/model_epoch" + str(e) + ".pt")

    print("=" * 50 + " Train End " + "=" * 50)
```

## 남아있는 의문 & 해결해보지 못한 것

- 풀링층과 normalize 층도 bias와 weight를 초기화해야 하는가?
- 입력 이미지에 대해 normalize를 적용하면 정확도가 올라가나?
- 입력 이미지는 본래 227 X 227보다 훨씬 작은 사이즈를 억지로 키운 것이다. 원래부터 큰 이미지를 사용했다면 더 나았을까?
- 한 Batch/Iter에서 같은 예측만 한다. 예를 들어 정답값은 1, 4, 5, 2, 7 인데 모델은 주구장창 3만 내놓는 것이다. 정확도가 10% 내외에서 머무르는 것도 10개의 클래스에 대해 하나의 값만 예측하므로 나온 숫자이다.
- Dropout에 `inplace=True`를 설정하니 Inplace 오류가 발생했다. 지우면 오류가 없다.
    
    ```
    Traceback (most recent call last):
      File "main.py", line 158, in <module>
        main()
      File "main.py", line 129, in main
        train_model(
      File "C:\coding\AlexNet-with-pytorch\train\train.py", line 65, in train_model
        loss_val.backward()
      File "C:\Users\lumos\anaconda3\envs\pytorch_py38\lib\site-packages\torch\_tensor.py", line 363, in backward
        torch.autograd.backward(self, gradient, retain_graph, create_graph, inputs=inputs)
      File "C:\Users\lumos\anaconda3\envs\pytorch_py38\lib\site-packages\torch\autograd\__init__.py", line 173, in backward
        Variable._execution_engine.run_backward(  # Calls into the C++ engine to run the backward pass
    RuntimeError: one of the variables needed for gradient computation has been modified by an inplace operation: [torch.FloatTensor [32, 4096]], which is output 0 of ReluBackward0, is at version 1; expected version 0 instead. Hint: enable anomaly detection to find the operation that failed to compute its gradient, with torch.autograd.set_detect_anomaly(True)
    ```
    

## Loss Graph

아래 사진은 Optimizer를 각각 Adam(푸른색)과 SGD(붉은색)로 했을 때의 Loss 결과이다. 대체적으로 큰 차이는 없이 loss가 2.3 대에서 머물렀다.

![](https://winterbloooom.github.io/assets/images/paper_review/2022-07-02-07.png){: .align-center}


---

# 출처
* Sunita Nayak, “Understanding AlexNet,” LearnOpenCV ([https://learnopencv.com/understanding-alexnet/](https://learnopencv.com/understanding-alexnet/))
* 비스카이비전, “[CNN 알고리즘들] AlexNet의 구조**,” bskyvision ([https://bskyvision.com/421](https://bskyvision.com/421))
* Steve-Lee, “[모두를 위한 cs231n] Lecture 6. Activation Functions에 대해 알아보자,” Tistory 블로그 ([https://deepinsight.tistory.com/113](https://deepinsight.tistory.com/113))
* AI꿈나무, “[논문 리뷰] AlexNet(2012) 리뷰와 파이토치 구현," Tistory 블로그([https://deep-learning-study.tistory.com/376](https://deep-learning-study.tistory.com/376))
* AI꿈나무, “[논문 구현] PyToch로 AlexNet(2012) 구현하기,” Tistory 블로그([https://deep-learning-study.tistory.com/518](https://deep-learning-study.tistory.com/518))
* poeun, “AlexNet 구조 파악 및 PyTorch로 코드 구현해보기,” GitHub 블로그([https://ingu627.github.io/code/alexnet_pytorch/](https://ingu627.github.io/code/alexnet_pytorch/))