---
title:  "Algorithms 2장: Divide and Conquer"
excerpt: "분할정복법"

categories:
  - Programming
  - Algorithm
tags:
  - Algorithm
last_modified_at: 2023-03-04
---

{% include inserted_box.html text="이 내용은 책 <a href='http://algorithmics.lsi.upc.edu/docs/Dasgupta-Papadimitriou-Vazirani.pdf'>Algorithms(Sanjoy Dasgupta et al.)</a>을 기반으로 하고 있습니다." %}

# Divide and Conquer (분할정복법)

이름에서도 알 수 있듯이, 문제를 작은 문제로 '분할'해서 해결하는 방식이다.

1. 같은 유형의 더 작은 부분문제(sub-problem)으로 분할한다.
2. 재귀적으로 부분문제를 해결한다. 부분문제가 해결 가능할 때 해결하며, 이는 주로 재귀의 끝이 된다.
3. 부분문제들의 해답을 적절히 결합한다.

- - -

# 2.1. 곱셈

$n$ 비트 정수인 $x, y$를 곱하는 문제를 푼다고 하자. 주요 아이디어는, $n$ 비트를 $n/2$ 비트의 두 개의 수로 나누어 곱한다는 것이다.

<figure>
<img src="https://user-images.githubusercontent.com/69252153/222937737-7b0d812a-d301-42ab-bae5-24e5cacfc134.png">
<figcaption>곱셈 알고리즘</figcaption>
</figure>

- 2의 거듭제곱 곱셈(파란 원): 왼쪽 shift 연산 ➡ 선형시간
- 덧셈(초록 원): 선형시간
- $n/2$ 비트 곱셈 4개(주황 사각형): 4번의 재귀호출이 필요한 또다른 곱샘. 즉, 더 작은 문제에 해당

우리가 해결해야 할 것은 주황 사각형인 $n/2$ 비트 곱셈 4개이다. 따라서 $n$ 비트의 입력에 대해 수행시간은

$$
T(n) = \underbrace{4 T \left( \frac{n}{2} \right)}_{\text{4번의 재귀호출}} + \underbrace{O(n)}_{\text{합치기(덧셈, 곱셈)}}
$$

위의 방식대로이면 작은 문제인 작은 곱셈을 총 4번 수행해야 한다. 하지만 아래와 같은 '가우스 방법'을 이용하면 3개로 줄일 수 있다.

$$
x_L y_R + x_R y_L = (x_L + x_R)(y_L + y_R) - x_L y_L - x_R y_R
$$

그럼 곱셈 (A) 식은

$$
2^n {\color{Orange}x_L y_L} + 2^{\frac{n}{2}} \left \lbrace {\color{Orange} (x_L + x_R)(y_L + y_R)} - x_L y_L - {\color{Orange} x_R y_R} \right \rbrace + x_R y_R 
$$

위처럼 주황색으로 표시된 3개 부분만 곱하면 된다. 따라서 상수 인자가 4에서 3으로 개선되는 아래와 같은 시간이 걸린다.

$$
T(n) = \underbrace{3 T \left( \frac{n}{2} \right)}_{\text{3번의 재귀호출}} + \underbrace{O(n)}_{\text{합치기(덧셈, 곱셈)}}
$$

<figure>
<img src="https://user-images.githubusercontent.com/69252153/222937869-1fc9e98d-4c7b-460e-8401-bbb6df2cb53c.png" width="70%">
<figcaption>곱셈 알고리즘</figcaption>
</figure>

분할 정복 문제는 트리로 나타낼 수있다.

<figure>
<img src="https://user-images.githubusercontent.com/69252153/222937994-32ef429e-7be1-426b-9672-d5eba0656451.png" width="70%">
<figcaption>재귀 트리</figcaption>
</figure>

- 초기 크기인 size $n$ 의 문제를 0단계
- 분기 계수(branching factor): 나뉘는 작은 문제의 개수. 여기선 3개의 곱셈 재귀로 나뉘므로, 분기 계수가 3
- 한 단계가 내려갈 때마다(분할) 문제의 크기가 $1/2$ 씩 줄어든다.
- 트리의 높이(level)인 $\log _2 n$ 번째에서(잎) 부분문제의 크기가 1이 되며 재귀가 종료된다.
- 깊이가 $k$ 에서
  - 부분 문제의 크기: $\cfrac{n}{2^k}$
  - 부분 문제의 개수: $3^k$
  - 소비되는 시간: $3^k \cdot O \left( \cfrac{n}{2^k} \right) = \left(\cfrac{3}{2} \right)^k \cdot O(n)$
- 전체 수행시간: 약 $O(n^{\log _2 3}) = O(n^{1.59})$

- - -

# 2.2. 분할정복의 점화식

## 문제 해결 방식
분할정복 문제를 일반화하면 아래와 같다.

- 크기가 $n$ 인 문제를 풀 때,
- 크기가 $n/b$ 인 $a$ 개('분기 계수')의 부분문제를 재귀적으로 풀고(부분 문제의 크기가 재귀의 각 단계에서 $1/b$로 줄어듦),
- 이들의 해답을 $O(n^d)$ 시간으로 결합해 해결한다.

## 재귀 트리

앞서 살펴본 듯이, 분할정복법은 재귀트리로 나타낼 수 있으며, 아래 그림은 그 일반화 버전이다.

![image](https://user-images.githubusercontent.com/69252153/222906840-59ade3f3-fec3-4fdf-8987-8ac6211f7334.png)

- $\log _b n$ 단계가 잎이다. 이때 기저 조건(base case)에 도달하며, 이것이 재귀 트리의 높이이다.
- $k$ 번째 단계에서 크기가 $\cfrac{n}{b^k}$ 인 $a^k$ 개의 부분 문재가 존재한다.
- 따라서 전체 작업은 $a^k \times O \left(\cfrac{n}{b^k} \right) = O(n^d) \left( \cfrac{a}{b^d} \right)^k$ 이다.

## 시간복잡도

전체 작업이 $a^k \times O \left(\cfrac{n}{b^k} \right) = O(n^d) \left( \cfrac{a}{b^d} \right)^k$ 라는 점에서 케이스 별로 정리가 가능하다.

$k$ 가 루트인 0에서 $\log _b n$으로 가며 $r = \cfrac{a}{b^d}$ 의 등비급수를 이룬다. Big-O 표기법에서 급수의 합을 구할 수 있으며, 공비 $r$에 따라 아래와 같은 경우의 수를 나눌 수 있다.

| $r < 1$ | 급수 ⬆ | 급수의 합 = 첫 번째 항 $O(n^d)$ |
| $r > 1$ | 급수 ⬇ | 급수의 합 = 마지막 항 $O(n^{\log _b a})$ (🌱)|
| $r = 1$ |  | 모든 $O(log n)$항은 $O(n^d)$와 같음 |

(🌱) $n^d \left( \cfrac{a}{b^d} \right)^{\log _b n} = n^d \cfrac{a^{\log _b n}}{(b^{\log _b n})^d} = a^{\log _b n} = a^{(\log _a n)(\log _b a)} = n^{\log _b a}$ 

## 수행시간

앞서 '문제 해결 방식'에서 정의한 내용을 바탕으로 수행 시간은 아래와 같이 일반화할 수 있다.

$$
T(n) = a T \left( \left \lceil \frac{n}{2} \right \rceil \right) + O(n^d)
$$

예를 들면 곱셈 알고리즘과 이진 탐색을 아래와 같이 정리할 수 있다.

| 알고리즘 | a | b | d | 시간 |
|---|---|---|---|---|
|곱셈 알고리즘|3|2|1|$T(n) = 3 \cdot T \left( \left \lceil \frac{n}{2} \right \rceil \right) + O(n)$|
|이진탐색|1|2|0|$T(n) = 1 \cdot T \left( \left \lceil \frac{n}{2} \right \rceil \right) + O(1) = O(\log n)$|

수행 시간을 쉽게 구할 수 있는 방법을 '마스터 정리'라고 한다.

<div id="def-box">
<div class="def-title">마스터 정리</div>
<p>

$a \gt 0, b \gt 1, d \ge 0$ 이고, $T(n) = a T \left( \left \lceil \frac{n}{2} \right \rceil \right) + O(n^d)$ 이면,

$$
T(n) =
\begin{cases}
    O \left( n^d \right) & \text{if }d > \log _b a \\
    O \left( n^d \log n \right) & \text{if }d = \log _b a \\
    O \left( n^{\log_b a} \right) & \text{if }d < \log _b a
\end{cases}
$$

</p>
</div>

위 정리에 따르면 이진 탐색은 두 번째, 곱셈은 세 번째 식에 해당한다.

- - -

# 2.3. Merge Sort (병합 정렬)

병합 정렬(`mergesort`)은, '절반씩 나누어 재귀적으로 정렬하고 병합(`merge`)하는' 알고리즘이다.

<figure>
<img src="https://user-images.githubusercontent.com/69252153/222908244-6508cf4c-8fc1-4352-a2e9-99eded86a7db.png">
<figcaption>mergesort 알고리즘</figcaption>
</figure>

<figure>
<img src="https://user-images.githubusercontent.com/69252153/222908487-ace4dada-7ef8-4fd6-83cc-de019efb99fa.png">
<figcaption>mergesort 알고리즘 예시</figcaption>
</figure>


여기서 병합(`merge`)은 정렬된 두 배열이 있을 때 `x`과 `y` 요소 중 앞에서부터 작은 것을 먼저 택하고, 남은 것들 중에서 다시 택하는 과정을 반복한다. 따라서 앞에서부터 차근차근 하나씩 보기 때문에, 선형 수행시간이 걸린다.

<figure>
<img src="https://user-images.githubusercontent.com/69252153/222908274-6dde19b0-b407-4098-9ae3-3cbc35fec89e.png">
<figcaption>merge 알고리즘</figcaption>
</figure>

위 의사코드와 예시 사진 등에서 볼 수 있듯이, 재귀는 원소가 하나가 될 때까지 시작하지 않는다. 이때 `mergesort`를 아래와 같이 queue를 사용해 구현이 가능하다.

<figure>
<img src="https://user-images.githubusercontent.com/69252153/222908544-7cc79ba4-dfdb-4cec-b077-257e3cd0d1c6.png">
<figcaption>iterative-mergesort 알고리즘</figcaption>
</figure>

TODO 그림

## 정렬의 하한 $n \log n$

<figure>
<img src="https://user-images.githubusercontent.com/69252153/222908900-9dfbd1cb-10ef-4435-8c5f-16d419ae6db1.png">
<figcaption>세 개의 수를 정렬하는 예시</figcaption>
</figure>

정렬을 이진트리로 나타내면, 잎의 개수는 $n!$ 개이다. 이는 n개의 숫자를 일렬로 나열하는 순열의 개수이기 때문이다. 따라서 $\Omega (n \log n)$ 만큼의 비교가 필요하다.

트리의 깊이는 최악의 시간복잡도이다. 깊이가 $d$ 인 이진 트리의 잎은 $2^d$ 개이고, 깊이는 최소 $\log (n!)$ 이다.

$\log(n!) \ge c \cdot n \log n$ 임이 알려져 있다. ($\because n! \ge (n/2)^{n/2}$). 따라서 병합정렬의 경우 $O(n \log n)$ 복잡도가 최적임을 알 수 있다.

- - -

# 2.4. Median (중앙값)

## 중앙값 찾기와 선택 문제

중앙값은 원소의 50번째 백분위수로, 원소들 중 절반은 중앙값보다 작고 절반은 중앙값보다 크다.

중앙값을 찾기 위해 '모든 원소를 정렬해' 찾아도 되긴 하지만, 실질적으로 중앙값만 구한다고 하면 이는 $O(n \log n)$ 만 걸려 관심 없는 원소까지 굳이 정렬까지 하는 셈이 된다. 따라서, 중앙값 찾기는 '정렬(sorting)'이 아닌 '선택(selection)' 문제로 접근하는 게 낫다.

선택 문제를 일반화 하면 아래와 같다.

- Input: 숫자 리스트 $S$, 정수 $k$
- Output: $S$ 에서 $k$ 번째로 작은 원소

## 선택을 위한 무작위 분할정복 알고리즘

임의의 숫자 $v$ 에 대해

$$
S = \underbrace{S_L}_{\text{v보다 작음}} + \underbrace{S_V}_{\text{v와 같음}} + \underbrace{S_R}_{\text{v보다 큼}}
$$

로 나타낸다면, $S$를 $S_L, S_V, S_R$ 로 나누는 데 선형 시간이 걸린다. 

여기서는 $v = 5, \vert S_L \vert = 3, \vert S_V \vert = 2$ 일 때 8번째로 작은 원소를 찾는다고 해보자. 그럼 앞의 5개는 이미 작기 때문에 $S_R$ 에서 3번째로 작은 원소를 찾으면 그것이 8번째로 작은 값이다. 즉 $\mathrm{selection}(S, 8) = \mathrm{selection}(S_R, 3)$

이를 정리하면, 선택 문제는 아래와 같이 작은 문제로 나눌 수 있다.

$$
\mathrm{selection}(S, k) = 
\begin{cases}
    \mathrm{selection}(S_L, k) & k \le \vert S_L \vert \\
    v & \vert S_L \vert \lt k \le (\vert S_L \vert + \vert S_V \vert) \\
    \mathrm{selection}(S_R, k - \vert S_L \vert - \vert S_V \vert) & k \gt (\vert S_L \vert + \vert S_V \vert) \\
\end{cases}
$$

부분 리스트에서 재귀를 수행한단 뜻이다. 이렇게 문제를 해결할 때, 살펴야 하는 원소의 개수는 $\vert S \vert$ 에서 $\max \{\vert S_L \vert , \vert S_R \vert\}$ 로 줄어든다!

## 시간 복잡도

- 최악: 가장 크거나 가장 작은 $v$를 선택
  - $\vert S_R \vert = 0$ 또는 $\vert S_L \vert = 0$ 가 됨
  - 매번 재귀를 할 때마다 문제의 크기가 1씩만 줄어듦
  - $n + (n-1) + \cdots + \frac{n}{2} = O(n^2)$
- 최선: 중앙값인 $v$를 선택
  - $\vert S_R \vert, \vert S_L \vert \approx \vert S \vert$
  - 따라서 선형 시간이 걸림. $T(n) = T(n/2) + O(n) \rightarrow O(n)$

되도록이면 $v$가 25~75분위수일 때가 좋다. 이 경우 $\vert S_R \vert, \vert S_L \vert$ 이 많아야 3/4 크기이기 때문에 배열이 크게 감소한다. 50%의 비율로 좋은 시간 복잡도를 가질 수 있다. 평균적으로, 2번을 연산했을 때 3/4로 문제가 줄어든다.

따라서 점화식은 아래와 같다.

$$
T(n) \le \underbrace{T \left( \cfrac{3}{4} n \right)}_{\text{크기가 } \frac{3}{4} n \text{인 문제}} + \underbrace{O(n)}_{\text{크기를 } \frac{3}{4} n \text{ 이하로 줄이는 시간}}
$$

최종적으로 선형시간인 $O(n)$ 이 걸린다.

- - -

# 2.5. 행렬의 곱셈

기본적으로 행렬 곱을 하려면 $X_{n \times n} \times Y_{n \times n} = Z_{n \times n}$ 일 때, 계산할 항목이 $n^2$ 개이고 각 계산은 $O(n)$ 시간이 걸리므로, 총 $O(n^3)$ 이 걸린다.

위 문제를 분할정복법을 이용해 해결해볼 수 있다. 각 배열을 $n/2 \times n/2$ 크기의 작은 배열로 나눈다.

$$
XY = 
\begin{bmatrix}
    A & B \\ C & D
\end{bmatrix}
\begin{bmatrix}
    E & F \\ G & H
\end{bmatrix}
=
\begin{bmatrix}
    AE + BG & AF + BH \\ CE + DG & CF + DH
\end{bmatrix}
$$

이렇게 되면, 시간 복잡도는 $T(n) = 8T(n/2) + O(n^3)$으로, 여전히 $O(n^3)$ 으로 발전이 없어 보인다. 하지만 아래와 같은 방식을 사용하면, 부분문제를 8개가 아닌 7개로 줄일 수 있다.

<figure>
<img src="https://user-images.githubusercontent.com/69252153/222915644-cb8838cb-dd68-48b9-b101-c684940117c2.png" width="60%">
<figcaption>세 개의 수를 정렬하는 예시</figcaption>
</figure>

그럼 시간은

$$
T(n) = 7T(n/2) + O(n^2) \rightarrow O(n^{log _2 7 \approx 2.81})
$$