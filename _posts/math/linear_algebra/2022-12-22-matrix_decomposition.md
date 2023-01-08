---
title:  "[선형대수학] 다양한 행렬 분해 정리 (Matrix Decompositions/factorization)"
excerpt: "LU, QR, SVD 등 matrix decompositions(factorization) 정리 / 행렬 분해 조건 / 예시"

categories:
  - Math
  - Linear Algebra
tags:
  - Linear Algebra

last_modified_at: 2022-12-22

published: false
---

딥러닝, 컴퓨터 비전을 공부하며 선형대수가 정말 많이 등장하는데 그때마다 공부할 필요성을 절실히 느꼈다. 마침 대학 학부 강의가 열려서 지난 학기 수강신청을 했고, 열심히 들었다. 과목의 필요성을 느끼고 수강신청을 한 건 처음인데, 그래서인지 이해나 활용처 등이 잘 떠올라 배우기 좋았다. 어느 개념이 많이 쓰이는지도 알고 있기에 더더욱 그러했다.

이번 포스팅에서는 다양한 행렬 분해를 다루며, 각 분해가 가능한 조건과 활용처, 파이썬 구현코드도 포함하고 있다.

TODO 약속
분해할 대상 행렬(앞으론 모두 A라 하겠다)의 크기엔 제한이 없다.
행렬(matrix)는 mat.으로 표기한다.
벡터(vector)는 vec.
col.
행의 크기를 m, 열의 크기를 n이라 한다.


> 동치인 연립선형방정식을 만드는 행 연산은 3가지가 있다.
> 1) 행 교환: 한 행과 다른 행의 위치를 바꾸기
> 2) 스칼라(scalar) 곱: 한 행에 0이 아닌 스칼라를 곱하기
> 3) 스칼라 곱 & 행 덧셈: 한 행에 상수배를 곱한 뒤, 다른 행에 더하기

기본 행렬(elementary mat.) : 정사각 행렬이며, 항등행렬(identity mat.)에서 하나의 행 연산을 통해 만들어질 수 있다.

- - -

# LU 분해
## 개요
$$ A=LU $$

L행렬과 U행렬 둘로 쪼개지는 행렬 분해로, L은 하삼각행렬(Low triangular mat.)을 뜻하고 U는 상삼각행렬(Upper triangular mat.)이다. 분해 결과는 유일(unique)하지 않으며, 다른 분해 결과나 나올 수도 있다.

## 조건
A는 임의의 크기 가역 행렬(invertible mat.)이어야 한다. 보통 예시는 정방행렬(square mat.)로 든다.

또한, A가 행 교환 없이도 상삼각행렬이 되어야 한다. 즉, 행 연산 중 (2), (3)만 사용하여 U를 만들 수 있어야 하는 것이다. 어떤 책은 기약행사다리꼴(Row Reduced Echelon Form, RREF)로 만들어야 한다고도 하는데, RREF도 어찌되었는 U의 형태이기 때문에 같은 말이다. 이를 수식으로 나타내보자. 

n번(행렬의 크기가 아님! 그냥 임의의 수)의 행 연산을 거쳐 A가 U가 된다고 할 때 이는 곧 기본행렬(elementary mat.)의 곱으로 나타낼 수 있다.

$$
E_n E_{n-1} \cdots E_2 E_1 A = U
$$

로 나타낼 수 있다. 모든 기본행렬은 가역행렬이므로

$$
A = E_1^{-1} E_2^{-1} \cdots E_{n-1}^{-1} E_{n}^{-1} U = LU
$$

로 변형이 가능하고, $E_n^{-1} E_{n-1}^{-1} \cdots E_2^{-1} E_1^{-1}$은 하삼각행렬 L이 되므로 $A=LU$꼴이 완성된다.


## 방법

$$
A = 
\begin{bmatrix}
1 & 2 & 3 \\
1 & 3 & 5 \\
1 & 5 & 12
\end{bmatrix}
=
\begin{bmatrix}
1 & 0 & 0 \\
1 & 1 & 0 \\
1 & 3 & 1
\end{bmatrix}
\begin{bmatrix}
1 & 2 & 3 \\
0 & 1 & 2 \\
0 & 0 & 3
\end{bmatrix}
$$

### 방법1: 기본행렬 구하기

위 설명을 그대로 적용하는 방식이다. A를 행 연산으로 U로 만들어본다.

$$
\begin{bmatrix}
1 & 2 & 3 \\
1 & 3 & 5 \\
1 & 5 & 12
\end{bmatrix}
\xrightarrow[E_1]{R_2 \leftarrow R_2 - R_1}
\begin{bmatrix}
1 & 2 & 3 \\
0 & 1 & 2 \\
1 & 5 & 12
\end{bmatrix}
\xrightarrow[E_2]{R_3 \leftarrow R_3 - R_1}
\begin{bmatrix}
1 & 2 & 3 \\
0 & 1 & 2 \\
0 & 3 & 9
\end{bmatrix}
\xrightarrow[E_3]{R_3 \leftarrow R_3 - 3R_2}
\begin{bmatrix}
1 & 2 & 3 \\
0 & 1 & 2 \\
0 & 0 & 3
\end{bmatrix}
$$

위 연산에 따라 $E_n E_{n-1} \cdots E_2 E_1 A = U$ 이므로,

$$
U = 
\begin{bmatrix}
1 & 2 & 3 \\
0 & 1 & 2 \\
0 & 0 & 3
\end{bmatrix},
\qquad
E_1 = 
\begin{bmatrix}
1 & 0 & 0 \\
-1 & 1 & 0 \\
0 & 0 & 1
\end{bmatrix}
\quad
E_2 = 
\begin{bmatrix}
1 & 0 & 0 \\
0 & 1 & 0 \\
-1 & 0 & 1
\end{bmatrix}
\quad
E_3 = 
\begin{bmatrix}
1 & 0 & 0 \\
0 & 1 & 0 \\
0 & -3 & 1
\end{bmatrix}
$$

$$
L = E_1^{-1} E_2^{-1} E_3^{-1} = 
\begin{bmatrix}
1 & 0 & 0 \\
1 & 1 & 0 \\
0 & 0 & 1
\end{bmatrix}
\begin{bmatrix}
1 & 0 & 0 \\
0 & 1 & 0 \\
1 & 0 & 1
\end{bmatrix}
\begin{bmatrix}
1 & 0 & 0 \\
0 & 1 & 0 \\
0 & 3 & 1
\end{bmatrix}
=
\begin{bmatrix}
1 & 0 & 0 \\
1 & 1 & 0 \\
1 & 3 & 1
\end{bmatrix}
$$

### 방법2: Dolittle's Decomposition Method
두리틀의 알고리즘이라 부른다. 이 알고리즘을 적용할 수 있는 추가적 조건이 있는데, (1) A가 정방행렬이어야 하며, (2) 행 교환 없이도 분해가 가능해야 한다. 또한 아래 식에서 볼 수 있듯이 분모가 0이 되지 않도록 (3) $u_{jj} \ne 0$이어야 한다.

A의 원소를 $a_{ij}$, L은 $l_{ij}$ U은 $u_{ij}$로 원소를 나타낸다고 하자. 각 위치에서의 원소값은 아래와 같이 구한다.

$$
\begin{matrix}
i > j  & l_{ij}  = \cfrac{a_{ij} - \sum\limits_{k=1}^{j-1}l_{ik}u_{kj}}{u_{jj}} \\
\\
i \le j & u_{ij} = a_{ij} - \sum\limits_{k=1}^{i-1}l_{ik}u_{kj}
\end{matrix}
$$

만약 행 순서를 바꿔야만 풀리는 경우라면, 순열 행렬(permutation mat.)를 이용해 분해할 수도 있다.

$$
PA = LU
$$

TODO

### 방법3: Some Tricks
사실 방법 1은 기본행렬과 행 연산 과정에서 실수할 가능성이 높다. 두리틀 알고리즘은 공식을 기억하는 게 귀찮다. 그래서 직접적으로 아래와 같이 구할 수도 있다.

L의 주대각성분을 1이라고 하면,

$$
\begin{bmatrix}
1 & 2 & 3 \\
1 & 3 & 5 \\
1 & 5 & 12
\end{bmatrix}
= 
\begin{bmatrix}
1 & 0 & 0 \\
l_{21} & 1 & 0 \\
l_{31} & l_{32} & 1
\end{bmatrix}
\begin{bmatrix}
u_{11} & u_{12} & u_{13} \\
0 & u_{22} & u_{23} \\
0 & 0 & u_{33}
\end{bmatrix}
$$

이라고 할 때, L의 1행과 U의 1열 연산에서 $1 \cdot u_{11} + 0 + 0 = 1$에서 $u_{11}$을 구할 수 있다. L의 1행과 U의 2열 연산에서 $1 \cdot u_{12} + 0 + 0 = 2$에서 $u_{12}$을 구할 수 있다. 이런 식으로 직접 연산을 전개하면 하나씩 구할 수 있다.

### LDU 분해
TODO 

## 활용
### 선형 방정식의 풀이

역행렬 구하기
- - -

# QR 분해

$$ A = QR $$

Q는 정규직교인 열벡터들로 구성된 행렬, R은 상삼각행렬이다. 직교행렬(Orthogonal mat.)의 영문 표현 $O$와 유사한 글자인 Q, 상삼각행렬의 또다른 표현 우삼각행렬(Right triangluar mat.)의 영문 표현 $R$에서 비롯된 표기법이다.

## 조건
A는 임의의 크기의 행렬이 가능하다. 단, 열벡터(col. vec.)가 선형독립이어야 한다. 따라서 $m \le n$의 관계를 가져야 한다. 이는 행렬 분해 형태를 보면 자명한 이야기인데, Q 자체가 정규 직교인 열벡터로 구성된 행렬이기 때문이다.

## 방법
먼저, A로부터 Q를 구한다. 그람-슈미트 과정(Gram-Schmidt process)를 이용하면 된다.

$\{ x_1, x_2, \cdots, x_n \}$이 선형 독립인 벡터이고, $A = [x_1 \ x_2 \ \cdots \ x_n]$로 A가 구성되었다고 하면(위에서 말한 조건대로), 아래와 같이 그람-슈미트 과정을 거쳐 정규직교기저 $\{ u_1, u_2, \cdots, u_n \}$를 구해보자.

$$
\begin{align*}
v_1 &= x_1 \\
v_2 &= x_2 - \cfrac{x_2 \cdot v_1}{v_1 \cdot v_1} v_1 \\
\vdots \\
v_n &= x_n - \cfrac{x_n \cdot v_1}{v_1 \cdot v_1} v_1 - \cfrac{x_n \cdot v_2}{v_2 \cdot v_2} v_2 - \cdots - \cfrac{x_n \cdot v_{n-1}}{v_{n-1} \cdot v_{n-1}} v_{n-1}\\
\\
u_i &= \cfrac{v_i}{\lVert v_i \rVert}
\end{align*}
$$

이렇게 구한 $\{ u_1, u_2, \cdots, u_n \}$를 바탕으로 Q는 $Q = [ u_1 \ u_2 \ \cdots \ u_n ]$이다. Q는 각 열이 모두 직교 벡터이며 단위 벡터이므로, $Q^{-1} = Q^T$가 성립한다. 따라서 $
R = Q^{-1}A = Q^T A$로 정리된다.

이를 직접 수로 이해해보자.

$$
A=
\begin{bmatrix}
1 & 0 & 0 \\
1 & 1 & 0 \\
1 & 1 & 1
\end{bmatrix}
$$

라고 하자.

$$
\begin{align*}
v_1 &= x_1 = \begin{bmatrix} 1 \\ 1 \\  0 \end{bmatrix} \rightarrow u_1 = \cfrac{1}{\sqrt{3}}\begin{bmatrix} 1 \\ 1 \\  1 \end{bmatrix} \\\\
v_2 &= x_2 - \mathrm{proj}_{v_1}x_2 = \begin{bmatrix} 0 \\ 1 \\  1 \end{bmatrix} - \cfrac{2}{3}\begin{bmatrix} 1 \\ 1 \\  1 \end{bmatrix} \rightarrow u_2 = \begin{bmatrix} \cfrac{-2}{\sqrt{6}} \\ \cfrac{1}{\sqrt{6}} \\  \cfrac{1}{\sqrt{6}} \end{bmatrix}\\\\

\end{align*}
$$

- - -

# 고윳값 분해

Q는 고유벡터의 집합이며, $\Lambda$는 대각성분이 고윳값이고 나머지는 0인 대각행렬이다.

## 조건
A는 정방행렬(square mat.)이어야 한다.
- - -

# 특잇값 분해(Singular Value Decomposition)

- - -
행렬분해 해주는 사이트 소개

