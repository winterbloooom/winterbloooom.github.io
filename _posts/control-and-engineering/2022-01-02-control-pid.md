---
title:  "PID 제어"
excerpt: ""

categories:
  - Control, Engineering
tags:
  - Engineering
  - Control

last_modified_at: 2022-01-02

use_math: true
toc: true
tock_sticky: true
toc_label: "Contents"
---

# 🎢 1. 제어(Control)
<span style="background-color: #e9eeb6; font-weight:bold">제어(Control)</span>이란, **시스템의 상태 $$\mathrm{x}$$를 원하는 목표치 $$\mathrm{x}_d$$로 도달시키는 과정**이다. 시스템을 로봇 팔이라고 한다면 관절의 각도가 시스템의 상태가 된다. 
 
제어에서 중점사항으로 보는 것은 ① **성능(Performance)**과 ②**외란에 대한 안정성(Stability)**이다. 성능은 __시스템의 상태가 목표치에 부합한 정도__이며, 안정성은 __시스템에 외란이 가해져도 발산하지 않는 것__을 말한다.

본격적으로 내용을 전개하기 앞서, 용어 몇 가지를 정리한다. <u>‘현재 A인 값을, B를 조정해 C로 만들고자’</u>한다고 가정하자.

* <span style="background-color: #e9eeb6; font-weight:bold">설정값(SV, Set point Variable), 목표값</span>: **제어의 목표**가 되는 값이다. C에 해당한다.
* <span style="background-color: #e9eeb6; font-weight:bold">제어량</span>: 제어 대상에 대해 **제어해야 하는 양**. A에서 C로 가는 변화값이 된다.
* <span style="background-color: #e9eeb6; font-weight:bold">조작량(MV, Manipulated Variable)</span>: 제어량에 영향을 주는 것 중, **목표값에 도달하도록 이용하는 것**이다. B에 해당한다.
* <span style="background-color: #e9eeb6; font-weight:bold">측정값(PV, Process Variable)</span>: 제어가 진행중일 때 현재 측정(출력)되고 있는 값이다. A, C와 같은 단위를 가진다. 
* <span style="background-color: #e9eeb6; font-weight:bold">편차, 오차(e, error)</span>: **측정값과 설정값의 차이값**이다. A에서 C로 가는 도중 D 값이 측정되었다 하면, C와 D의 차이이다.
* <span style="background-color: #e9eeb6; font-weight:bold">외란</span>: 사람의 힘이 미치지 못하지만 제어량을 변화시키는 원인이다.

자동차의 속도 제어를 예로 들자면, 제어 대상은 자동차가 되고, 조작량은 가속 페달에 의해 조절되는 엔진의 힘, 제어량은 속도가 되며, 외란은 공기의 저항이나 노면의 상태, 경사 등이 된다.

- - -

# ➰2. 피드백 제어기와 PID 제어기
<span style="background-color: #e9eeb6; font-weight:bold">피드백 제어(Feedback Control)</span>란, 입력(Input)에 대해 특정 프로세스(Process)를 거친 출력(Output)이 다시 입력에 영향을 미치고 이것이 다시 프로세스로 들어가 출력을 내는, 반복(Loop)적인 제어 방식이다. 출력이 목표값에 도달하려면 어떻게 되어야 하는지(줄여야 할지 늘려야 할지 등) 피드백을 한다고 이해하자.

![](https://images.velog.io/images/717lumos/post/f3bde1be-4787-4705-8321-de8938f5c55b/%ED%94%BC%EB%93%9C%EB%B0%B1%20%EC%A0%9C%EC%96%B4%EA%B8%B0.png){: .align-center}

<span style="background-color: #e9eeb6; font-weight:bold">PID제어기(Proportional-Integration-Differential controller) / PID 제어(control)</span>는 피드백(feedback) 제어기의 형태를 가진다. PID 제어의 피드백 제어의 측면은 다음과 같은 특징을 가진다.

* **제어 대상의 출력(output)을 측정해 원하는 값인 설정값(set value)와 비교하여 오차(error)을 계산한다.**
* **제어에 필요한 제어량을 도출된 오차값을 이용해 계산한다.**

![](https://images.velog.io/images/717lumos/post/a8ff0dc5-b3e4-42ce-ac0d-732f59d8b2b7/%EA%B7%B8%EB%A6%BC1.png){: .align-center}

아래 사진은 PID 제어기를 활용해 출력을 조정하는 예시이다.
 
![](https://images.velog.io/images/717lumos/post/6dfa3048-b1a1-45e9-8887-22b2d8fe3db8/PID%EC%A0%9C%EC%96%B4.png){: .align-center}

- - -

# 💡3. 제어값 계산 방식
## 3-1. 제어량 계산식
시간에 따른 제어량은 다음과 같이 계산한다.

$$
\mathrm{K}_p \mathrm{e}(t) + \mathrm{K}_i\int_0^t \mathrm{e}(t)\mathrm{d}t + \mathrm{K}_d\frac{de}{dt}
$$

* $\mathrm{K}_p \mathrm{e}(t)$: <span style="background-color: #e9eeb6; font-weight:bold">비례항</span> - **편차에 비례**한다. 현재 상태에서 편차의 크기에 비례해 제어 작용을 한다.
* $\mathrm{K}_i\int_0^t \mathrm{e}(t)\mathrm{d}t$: <span style="background-color: #e9eeb6; font-weight:bold">적분항</span> - **오차값의 적분(integral)에 비례**하여, 정상 상태(steady-state) 오차를 없앤다.
* $\mathrm{K}_d\frac{de}{dt}$: <span style="background-color: #e9eeb6; font-weight:bold">미분항</span> - **오차값의 미분(derivative)에 비례**한다. 출력값의 급격한 변화를 막아 오버슈트을 줄이며 안정성을 향상시킨다.

여기서 $$\mathrm{e}(t) = \mathrm{y}_s (t) - \mathrm{y}(t)$$ = (제어량 – 목표값)으로, 편차에 해당한다.

## 3-2.이득(Gain)
위 제어량 계산식에서 <span style="background-color: #e9eeb6; font-weight:bold">$$\mathrm{K}_p , \mathrm{K}_i , \mathrm{K}_d$$</span>를 <span style="background-color: #e9eeb6; font-weight:bold">이득값(Gain, 게인)</span>이라 한다. 각각 **비례 제어, 적분 제어, 편차 제어를 조절하는 계수**가 된다.

때에 따라서는 변형 형태로서 특정 항만을 가질 수도 있다. 비례항만을 가질 때는 P제어기, 비례-미분항만을 가질 때는 PD 제어기라 하는 등의 방식이다.

- - -

# 🔧 4. 튜닝(Tuning)
<span style="background-color: #e9eeb6; font-weight:bold">튜닝(Tuning)</span>은 게인을 수학적/실험적/경험적으로 계산해 조정하는 것을 말한다. 
무작정 $$\mathrm{K}_p , \mathrm{K}_i , \mathrm{K}_d$$를 조절할 수도 있지만, 정확성이 떨어지고 시간이 매우 오래 걸린다. 
PID 제어기의 튜닝의 방식에는 **저글러-니콜스 방법** 등 여러가지가 존재한다. 이 방법은 후반에 소개한다.

- - -

# ❓ 5. 제어 매커니즘
## 5-1. P(비례) 제어
<span style="background-color: #e9eeb6; font-weight:bold">P(비례) 제어</span>는 **제어량과 목표값의 차이(편차)에 비례하여 제어하는 방법**이다. 편차가 크면 조작량을 크게, 편차가 작으면 조작량을 작게 하여 제어량을 목표값에 유연하게 도달시킨다.
 
![](https://images.velog.io/images/717lumos/post/25043e9f-c6c2-4448-a0b2-97156275c68a/P%EC%A0%9C%EC%96%B4.png){: .align-center}

**$$\mathrm{K}_p$$ 값을 크게** 하면 편차에 따른 조작량이 크므로, **상승시간이 줄어 빠르게 목표값에 도달하는 대신, 오버슈트 값이 크고 시스템에 무리를 줄 위험**이 있다.
반대로 $$\mathrm{K}_p$$을 작게 하면 상승시간은 길어져 목표값에 느리게 도달하고, 대신 오버슈트는 감소한다.
 

> ❗ <span style="background-color: yellow; font-weight:bold">오버슈트(Overshoot)와 상승시간</span>
**오버슈트**는 **목표값보다 오차가 커지는 것**을 말한다. 오버슈트 값이 과하게 커지면 시스템에 무리를 줄 수 있다. 
예를 들면, 제어하려는 대상이 전압이라면 오버슈트가 발생하면 과전압이 발생할 수 있는 것이다. 반대 개념은 언더슈트(Undershoot)이다.
**상승시간**이란 **0에서부터 처음 오버슈트가 될 때까지 걸리는 시간**이다.

> ❗ <span style="background-color: yellow; font-weight:bold">정상 상태(steady-state)와 정착시간</span>
**정상 상태**란 **목표값에 거의 가까워진 상태**이며, **정착시간**이란 **시작부터 정상상태가 될 때까지 걸리는 시간**이다. 정착시간과 $$\mathrm{K}_p$$는 관계 없는 값이다.
제어는 실질적으로 (제어량)=(목표값)이 되긴 힘들다. 따라서 목표값의 $$\pm$$ 몇 %로 일정 범위 내에 제어값이 위치한다면 이를 제어 완료로 보는데, 이때까지 걸리는 시간이 정착시간이 되기도 한다. 이 시간이 짧게 소요될수록 좋은 제어기이다.

![](https://images.velog.io/images/717lumos/post/22455820-2e3b-43f5-a636-bbc9956e0227/%EC%8B%9C%EA%B0%84.png){: .align-center}
 
P제어의 문제점은, **정상상태 오차(잔류편차)가 남는다**는 것이다. <span style="background-color: #e9eeb6; font-weight:bold">정상상태 오차</span>는 목표값의 일정 범위 내에 제어값이 들어오기는 했으나, 끝내 없어지지 않고 남아있는 오차를 말한다.
목표치에 가까워진다는 것은 편차가 작아진다는 뜻이며, 이는 곧 조작량이 너무 작아 측정오차 범위에 속하여 세밀한 제어가 힘들어질 수도 있다는 의미이다. 결국 목표치에 매우 가까운 상태로 안정되어 버리는 현상이 일어나고, 이때 목표치와의 편차가 잔류편차가 된다.
즉, **설정값에 매우 근한 상태에서 안정화되어버려 측정값과 설정값이 같아질 수가 없어진다**.

## 5-2. I(적분) 제어
P 제어에서 **정상상태 오차의 발생을 해결**하기 위한 방법으로 I 제어를 도입할 수 있다.
<span style="background-color: #e9eeb6; font-weight:bold">I(적분) 제어</span>는 **편차를 시간에 대해 누적(적분)하고, 이 누적값이 특정값이 되면 조작량을 증가시켜 편차를 없앰**으로써 목표값에 더욱 정밀하게 접근하도록 한다. 

 ![](https://images.velog.io/images/717lumos/post/1917ec67-a195-41e4-a545-9a30676ff8bb/I%EC%A0%9C%EC%96%B4.png){: .align-center}
 
**$$\mathrm{K}_i$$ 값이 크면 오버슈트가 커지고 상승시간이 약간 감소**한다. $$\mathrm{K}_i$$ 값이 작으면 그 반대가 된다.

![](https://images.velog.io/images/717lumos/post/078da425-e12d-4949-9d47-c1fc917d5e26/PI%EC%A0%9C%EC%96%B4.png){: .align-center}

I 제어의 문제점은 다음과 같다.

P 제어의 정상 상태 오차를 제어할 수 있는 대신, 그만큼 **정착시간이 추가**된다. 더구나 $$\mathrm{K}_i$$ 값이 클수록 오버슈트/언더슈트가 커지고 이에 따라 정착시간은 더 늘어난다.

**외란 발생 시 반응속도(응답시간)가 느려지는 것**도 문제이다. I 제어를 통해 편차에 대한 조작량을 작게 해두었으므로, 외란으로 인해 제어량 변화가 급작스럽게 커져도 조작량 변화는 작을 수밖에 없다. 더구나 편차를 시간 단위로 측정하므로 외란 신호를 다시 목표값 부근으로 복원시키는 데 시간이 오래 걸린다. 즉, 응답시간이 오래 걸린다.

또한 외란이나 오차의 누적이 계속된다면 $$\mathrm{K}_i$$ 값이 커져 **제어량의 발산이 유발**될 수도 있다. 누적에 의한 발산을 막기 위해 적분 값을 초기화하는 등 anti-wind up 기법을 사용하기도 한다.

## 5-3. D(미분) 제어
<span style="background-color: #e9eeb6; font-weight:bold">D(미분) 제어</span>는 **목표량과 제어량의 편차를 비교해 이와 반대되는 쪽(기울기)으로 조작하는 방식**이다. (편차)=+10이라면 (조작량)=-10이 되도록 조작 방향을 설정하는 식이다. 미용실에서 머리를 할 때, 미용사가 한 쪽으로 머리를 잡아당기면 우리는 반대쪽으로 힘을 주는 것과 같은 이치이다. 급격히 어느 한 방향으로 힘이 쏠리면 **반대방향으로 힘을 주어 그 힘을 상쇄하려는 제어**이다. 

**외란과 목표값의 편차, 혹은 이번 편차와 직전 편차를 비교해 이 크기에 따라 조작량을 결정**하며, D 제어를 통해 외란에 대한 응답성을 개선하고 안정성을 높일 수 있다.

목표값에 다가가다가, 이대로면 설정값을 초과할 것 같아 제어값의 변화에 대해 그것을 억제하는 작업으로 이해해도 좋다. 이대로 가속 페달을 밟다가는 목표 속도인 60km/h를 넘어버릴 것 같아 페달에서 발을 조금씩 떼는 식이다.

> 짧은 샘플링 시간이나 갑작스런 외란이 미분값을 급작스럽게 변화시킬 수도 있으므로 보통 앞에 저주파 필터(Low-pass filter)를 붙여 사용하기도 한다.

![](https://images.velog.io/images/717lumos/post/eaccaab2-bf19-4128-a046-463a8597404d/D%EC%A0%9C%EC%96%B4.png){: .align-center}

**$$\mathrm{K}_d$$ 값이 클수록 안정화에 걸리는 시간이 줄어들어 정착시간이 감소**된다. 다만 정상상태에서는 D 제어보다 PI 제어의 영향이 크므로 이 구간에서 정상상태 오차의 변화는 거의 없다.

P, I 제어의 경우 편차와 같은 방향으로 제어량을 조작시키므로 게인 값과 오버슈트값은 비례하고 상승 시간이 반비례했다. 그러나 D 제어는 편차와 반대 부호로 조작을 하기 때문에, **$$\mathrm{K}_d$$ 값이 클수록 오버슈트는 감소하고 오차를 빨리 교정해, 상승시간과 정착 시간이 감소**한다.

## 5-4. PID 제어

PID 제어에서 **각 제어의 역할**은 다음과 같다.

* **P 제어**: **목표값 도달 시간(B) 감소**. 목표값과 멀수록 많이, 가까울수록 적게 조작.
* **I 제어**: **정상 상태 오차(C) 감소**. 목표값에 딱맞게 주행하기 위해 미세하게 조정하여 편차 제거
* **D 제어**: **오버슈트(A) 억제**. 제어값 변화 억제. 

![](https://images.velog.io/images/717lumos/post/6c72f19c-eb33-4ae4-b165-5d9388983286/PID.png){: .align-center}

각 제어기의 조작을 위해 각 **게인 값을 잘 조절**해야 한다. 정리하면 아래와 같다.

| 게인 | 상승시간 | 오버슈트 | 정착시간 | 정상상태 오차 |
|:---:|:---:|:---:|:---:|:---:|
| $$\mathrm{K}_p$$ | 감소 | 증가 | 미세 변화 | 감소 |
| $$\mathrm{K}_i$$ | 미세 감소 | 증가 | 증가 | 제거 |
| $$\mathrm{K}_d$$ | 감소 | 감소 | 감소 | 미세 변화 |

제어기(Controller)를 거쳐 **최종적으로 변화시키는 값 $$\mathrm{u}$$**은 다음과 같이 다시 쓸 수 있다.

![](https://images.velog.io/images/717lumos/post/f3e62245-1509-4daf-af79-59a8802f3a1b/%EC%A0%9C%EC%96%B4%EA%B0%92.png){: .align-center}

각 항을 $$\mathrm{K}_p$$로 묶었을 때 나오는 $$\mathrm{T}_i$$는 Integral Time, $$\mathrm{T}_d$$는 Derivative Time이라고 한다. 맨 마지막 식을 Matlab 등의 시뮬레이션 툴에서 많이 사용한다.

- - -

# 😎 6. 프로세스 게인, 제어 게인
<span style="background-color: #e9eeb6; font-weight:bold">프로세스 게인(Process Gain)</span>은 제어 대상이 가진 전체 능력이다. 
승용차가 총 150km/h의 속도까지 낼 수 있고, 스포츠카가 300km/h까지 가능하다고 할 때, 페달을 10% 밟으면 승용차는 15km/h를, 스포츠카는 30km/h를 낼 수 있다. 이때, 속도를 내는 능력이 프로세스 게인이고 스포츠카가 승용차의 두 배가 된다.

<span style="background-color: #e9eeb6; font-weight:bold">제어 게인(Control Gain)</span>은 제어를 할 수 있는 능력으로, 제어 대상의 응답을 일정량 변화시키는 데 필요한 제어 출력의 비율이다. 
앞선 예에서는 30km/h를 내는 데 승용차보다 스포츠카가 페달을 밟는 양이 커야 하고, 이는 제어 게인이 승용차가 더 높다는 뜻이 된다.

- - -

# 🤗 7. 비례대
<span style="background-color: #e9eeb6; font-weight:bold">비례대</span>는 **조작량을 비례시키는 폭**을 말한다. 설정값을 중심으로 설정한 폭 이내로 측정값이 들어오면 그때부터 설정값과 측정값과의 편차에 비례하여 제어한다. 
**비례대 폭을 좁게 설정**하면 **제어 이득이 높이지고 감도는 올라가나 안정성이 나빠지고**, **넓게 설정**하면 **제어 이득이 낮아지고 감도는 떨어지나 안정성은 좋아진다.**

![](https://images.velog.io/images/717lumos/post/295bd029-54bc-48c0-8756-a7d959f8b203/%EB%B9%84%EB%A1%80%EB%8C%80.png){: .align-center}

일례로 50km/h를 설정값으로 하고 비례대 A는 $$\pm 30km/h$$로, 비례대 B는 $$\pm 10km/h$$로 설정되었다면, A에선 20km/h 이하에선 가속 페달을 밟고 20km/h ~ 80km/h에서는 편차에 비례해 가속한 뒤, 80km/h에서는 가속하지 않는다. B에서는 40km/h와 60km/h가 그 경계가 될 것이다. 따라서 A에서는 속도 변화가 완만하고, B에서는 급격하다.

- - -

# 🙄 8. 지글러-니콜라스 방법(Ziegler-Nichols Method)
PID 제어기의 튜닝 방법 중 하나로, 휴리스틱(경험적) 방법에 속한다. 모델에 대한 정보가 없을 때 PID 게인을 조절할 수 있는 방법이다. 물론 이 방법이 모든 상황에서 최적이란 뜻은 아니다.

* **적분 게인 $$\mathrm{K}_i$$와 미분 게인 $$\mathrm{K}_d$$를 0**으로 한다.
* P 제어기만 사용하여 **$$\mathrm{K}_p$$를 0부터 최종 게인 $$\mathrm{K}_u$$까지 올린다.**
* 여기서 <span style="background-color: #e9eeb6; font-weight:bold">$$\mathrm{K}_u$$</span>은 **제어 루프의 출력이 안정적이고 일관된 진동을 가질 때의 게인**을 말한다. 여기서의 **진동 주기는 $$mathrm{T}_u$$**이고, **진폭 비율을 M**이라 했을 때 $$\mathrm{K}_u = ^1/_M$$이다.
 
* 이후엔 사용할 컨트롤러 유형, 원하는 동작에 따라 $\mathrm{K}_p , \mathrm{K}_i , \mathrm{K}_d$$ 값을 조정한다.

| 컨트롤러 타입 | $\mathrm{K}_p$ | $\mathrm{K}_i$ | $\mathrm{K}_d$ |
|:--:|:--:|:--:|:--:|
| P | 0.5 $\mathrm{K}_u$ | - | - |
| PI | 0.45 $\mathrm{K}_u$ | 0.54 $\mathrm{K}_u/\mathrm{T}_u$ | - |
| PID | 0.6 $\mathrm{K}_u$ | 1.2 $\mathrm{K}_u/\mathrm{T}_u$ | 0.075 $\mathrm{K}_u/\mathrm{T}_u$ |


다른 PID 제어 방법은 다음의 링크를 참고하길 바란다. ([hyein’s 로봇 알고리즘 연구소 - 고전 제어의 절대 강자 PID Control(제어) A to Z - 2 편](https://hyein-robotics.tistory.com/entry/%EA%B3%A0%EC%A0%84-%EC%A0%9C%EC%96%B4%EC%9D%98-%EC%A0%88%EB%8C%80-%EA%B0%95%EC%9E%90-PID-Control%EC%A0%9C%EC%96%B4-A-to-Z-2-%ED%8E%B8?category=879031))

- - -

# 참고문헌
* 쓰지로 시메무라, “자동제어란 무엇인가,” 성안당, 1994, pp. 17–25. 
* [HARA, “PID제어,” NAVER blog](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=wjdendyd100&logNo=220855168728)
* [임장성 강사, “66. PID 제어 란 (비례, 적분, 미분) 무엇인가. (2회차),” NAVER blog](https://m.blog.naver.com/jsrhim516/222015965919)
* [임장성 강사, “60. PID 제어 란? (비례, 적분, 미분),” NAVER blog](https://blog.naver.com/jsrhim516/222102616701)
* [수박쨈, “PID제어로 공의 균형을 잡기 프로젝트(2. PID제어 알아보기),” kocoafab]( https://kocoafab.cc/make/view/418)
* [hyein14, “고전 제어의 절대 강자 PID Control(제어) A to Z - 1 편,” hyein's 로봇 알고리즘 연구소](https://hyein-robotics.tistory.com/entry/%EA%B3%A0%EC%A0%84-%EC%A0%9C%EC%96%B4%EC%9D%98-%EC%A0%88%EB%8C%80-%EA%B0%95%EC%9E%90-PID-Control%EC%A0%9C%EC%96%B4-A-to-Z-1-%ED%8E%B8)
* [“Ziegler–Nichols method,” Wikipedia](https://en.wikipedia.org/wiki/Ziegler%E2%80%93Nichols_method)

