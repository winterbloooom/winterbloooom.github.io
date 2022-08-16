---
title:  "평균필터, 이동평균필터, 저주파통과필터: Python으로 구현하기"
excerpt: "<칼만 필터는 어렵지 않아> Chapter1: 평균필터, 이동평균필터, 저주파통과필터"

categories:
  - Control, Engineering
tags:
  - Engineering

last_modified_at: 2022-05-06

use_math: true
toc: true
tock_sticky: true
toc_label: "Contents"
---

해당 내용은 책 <span style="background-color: #12B886; color: white">**<칼만 필터는 어렵지 않아 with MATLAB Examples(김성필, 한빛아카데미)>**</span>를 참고하였습니다.
{: .notice--info}

Python으로 구현한 소스코드는 저의 [GitHub Repository](https://github.com/winterbloooom/kalman-filter)에서 확인할 수 있습니다.
{: .notice--info}

- - -
  
# Chapter1. 평균필터
## 1.1. 평균의 재귀식
배치식(batch expression)이란, 데이터를 모두 모아 한꺼번에 계산하는 형태이다. 새로운 데이터가 들어오면 처음부터 다시 계산해야 하므로 이전 결괏값을 쓸 수 없다.

배치식으로 구현한 평균은 아래와 같다.

$$
\bar{x}_k = \cfrac{x_1 + x_2 + \cdots + x_k}{k}
$$

<span style="background-color: #12B886; color: white">**재귀식(recursive expression)**</span>은 이전 결과를 다시 활용하는 형태로, 계산의 효율이 더 낫다. 이전 결괏값과 추가된 데이터, 데이터 개수 등만 저장하면 되므로 메모리 저장 공간 효율도 높다.

재귀식으로 구현한 평균은 아래와 같으며, 이를 두고 <span style="background-color: #12B886; color: white">**평균 필터(average filter)**</span>라고 한다.

$$
\begin{aligned} 
\bar{x}_k &= \cfrac{k-1}{k} \bar{x}_{k-1} + \cfrac{1}{k} x_k \\ 
&= \alpha \bar{x}_{k+1} + (1 - \alpha)x_k \quad \left( \alpha = \cfrac{k-1}{k} \right) 
\end{aligned}
$$

평균 필터는 센서 초기화에도 이용된다. 가령 영점을 맞출 때 초기값들을 모아 평균을 내 영점으로 사용한다.

```py
def AverageFilter(x, k):
    """
    (param)     x : new input data
    (return)    avg : average
                k	: number of data
    """

    k += 1    
    alpha = (k - 1) / k
    avg = alpha * prev_avg + (1 - alpha) * x
    
    return avg, k
```

![](https://velog.velcdn.com/images/717lumos/post/ed068588-7ad3-4bad-9691-40f23149b28c/image.png){: .align-center}

- - -

# Chapter2. 이동평균 필터
## 2.1. 이동평균의 재귀식

측정하는 물리량이 시간에 따라 변할 경우, 평균은 데이터의 동적 움직임을 고려하지 않으므로 데이터 수집 시작 혹은 현재로부터 오래 전의 데이터부터 평균을 취하는 것은 적절하지 않다.

<span style="background-color: #12B886; color: white">**이동평균(moving average)**</span>은 잡음을 없애면서 시스템의 동적인 변화를 고려하기 위해 고안되었다. N개의 최근 측정치를 평균하는 방법으로, 새로운 데이터가 입력된다면 이전 데이터는 버린다.

이동 평균의 배치식은 아래와 같다.

$$
\bar{x}_k = \cfrac{x_{k - n + 1} + x_{k - n + 2} + \cdots + x_k}{n}
$$

여기서 말하는 $\bar{x}_k$은 k개 데이터의 평균이 아니라, '$(k - n + 1)$번째부터 $k$번째까지 $n$개 데이터의 평균'을 말함에 주의한다.

재귀식으로 바꾸면 그것이 <span style="background-color: #12B886; color: white">**이동평균 필터(moving average filter)**</span>가 되고, 식은 아래와 같다.

$$
\bar{x}_k = \bar{x}_{k-1} + \cfrac{x_k - x_{k-n}}{n}
$$

다만 이동평균필터는 재귀식을 사용하는 이점이 덜하다. 어차피 최근 n개의 데이터가 저장되어야 함은 똑같다. n의 수가 크지 않다면 이전 데이터를 저장했다가 일반적 방법으로 평균을 구해도 나쁘지 않다.

```py
def MovingAverageFilter(prev_data, n, x):
    """
    (param)     prev_data : 이전 데이터가 저장된 배열
                n : 이동평균필터 큐의 크기
                x : 새로 들어온 데이터
    (return)    avg : 이동평균
    """

    # n개의 데이터가 모이기 전까지는 무시하는 버전
    # if len(prev_data) < n:
    #     return 0

    if len(prev_data) >= n:
        prev_data.pop(0)
    prev_data.append(x)

    return sum(prev_data) / len(prev_data)
```

> 리스트(list)의 경우 파라미터로 전달되었을 때 함수 안에서 변경하면 원 리스트도 변경되는 mutable 자료형이다.

> 해당 필터 실습에서는 책에서 제공하는 '초음파 거리계 측정값' 데이터를 활용했다. 해당 파일은 [출판사 자료실 ](https://www.hanbit.co.kr/store/books/look.php?p_code=B4956047798)에서 다운받을 수 있으며, python에서 사용하기 위해 별도의 처리를 해주었다. 깃허브의 소스코드 혹은 [맨 아래 목차](#mat-파일을-python에서-사용하는-법)를 참고하길 바란다.

![](https://velog.velcdn.com/images/717lumos/post/ec204599-a562-4c0a-a597-b483cdfaf583/image.png){: .align-center}

- - -

# chapter3. 저주파 통과 필터
<span style="background-color: #12B886; color: white">**저주파 통과 필터(low-pass filter)**</span>는 '저주파 필터'라고도 하며, 저주파 신호는 통과시키고 고주파 신호는 제거하는 필터이다. 저주파 신호를 측정하고 고주파 신호는 잡음으로서 제거할 때 주로 사용한다. 아래 내용은 1차(first order) 저주파 통과 필터이다.

## 3.1. 이동 평균의 한계
이동평균은 모든 데이터에 동일한 가중치($\cfrac{1}{n}$)을 부여하여, 가장 최근 데이터가 가장 오래된 데이터와 같은 비중(중요도)를 갖게 된다. 만약 시간에 따른 변화가 큰 데이터일 경우, 최신 측정값이 현재 정보를 더 잘 반영하므로 이전 측정값과 동일하게 취급하는 것은 안전성 및 안정성에 큰 영향을 미칠 수 있다.

## 3.2. 1차 저주파 통과 필터
오래된 데이터에는 낮은, 최근의 데이터에는 높은 가중치를 부여하기 위해, 1차 저주파 통과 필터를 알아보겠다. 1차 저주파 통과 필터는 '<span style="background-color: #12B886; color: white">**지수 가중(exponentially weighted) 이동평균 필터**</span>'라고도 한다. 오래된 데이터일수록 기하급수적으로 낮은 가중치를 부여하기 때문으로, 아래 식이 이 이름이 붙은 이유를 설명한다. $\alpha$는 $0 < \alpha < 1$의 범위를 갖는 상수이며, $\bar{x}_k$는 평균이 아닌 '<span style="background-color: #12B886; color: white">**추정값(estimated value)**</span>'라고 부른다.

$$
\bar{x}_k = \alpha \bar{x}_{k - 1} + (1-\alpha) x_k
$$

$\bar{x}_{k-1}$에 대한 식을 $\bar{x}_{k}$에 대입해보면 이전 측정치인 $\bar{x}_{k-1}$에는 $\alpha (1-\alpha)$가 계수로 붙게 됨을 알 수 있다. $\bar{x}_{k}$의 계수인 $\alpha$ 보다 작은 수치이다. 이와 같은 원리로, 이전 값일 수록 $\alpha^m (1-\alpha)$의 계수로 더더 낮은 계수를 갖게 된다. 그 말인 즉 더 낮은 가중치를 갖게 된다.

이때 결과 그래프에서도 볼 수 있듯이 $\alpha$가 클수록 잡음은 줄어들지만 지연(latency)가 늘어난다. 이전 추정치를 더 많이 반영하기 때문이다. 반대로 $\alpha$가 작을수록 잡음이 늘고 지연이 줄어든다. 새 측정치를 더 많이 반영하기 때문이다.

```py
def LowPassFilter(alpha, prev, x):
    """
    (param) alpha : weight for previous estimation
            prev : previous estimation
            x : new data
    (return) estimation
    """
    return alpha * prev + (1 - alpha) * x
```

![](https://velog.velcdn.com/images/717lumos/post/8767db45-e1c1-4ca7-b66f-770c35cd8a14/image.png){: .align-center}

- - -

# mat 파일을 Python에서 사용하는 법
```py
from scipy import io

mat_file = io.loadmat('./SonarAlt.mat')
	# mat 파일의 경로를 입력해준다.

print(mat_file)
	# mat 파일의 내용을 살펴본다.
	# {'__header__': b'MATLAB 5.0 MAT-file, Platform: PCWIN, Created on: Thu Feb 25 13:19:03 2010', 
    # '__version__': '1.0', 
    # '__globals__': [], 
    # 'sonarAlt': array([[34.25491256, 33.60223519, 33.60223519, ..., 36.55540305, 36.55540305, 36.55540305]])}

print(mat_file['sonarAlt'])
	# 사용하려는 것은 sonarAlt이므로 이를 더 확인해본다.
    # [[34.25491256 33.60223519 33.60223519 ... 36.55540305 36.55540305 36.55540305]]
        
sonar_data = np.array(mat_file['sonarAlt']).reshape(1501)
	# 필자의 경우 행렬 전환과 형태 확인을 하기 위해 numpy의 ndarray로 바꿔주었으나,
    # 단순히 불러오기만 하려면 mat_file['sonarAlt']로도 충분하다.
```
