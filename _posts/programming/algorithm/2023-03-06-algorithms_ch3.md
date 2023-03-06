---
title:  "Algorithms 3장: Decompositions of graphs"
excerpt: "Introduction of Graph, DFS, Strongly Connected Components"

categories:
  - Programming
  - Algorithm
tags:
  - Algorithm
last_modified_at: 2023-03-06
---

# 3.1. Graph

그래프와 그 요소를 표기하는 방식은 아래와 같다.

- 그래프 $G = (V, E)$ : $V$는 노드(정점(Vetrices)), $E$는 노드들을 잇는 에지(간선(edges))
- 무향 간선 $e = \{x, y\}$, 유향 간선 $e = (x, y)$ 혹은 $x \rightarrow y$

그래프를 표현하는 방식은 두 가지가 있다.

- <span style="color: #1565C0; background: #BBDEFB">**인접행렬(Adjacency matrix)**</span>
  - 무향 그래프라면 symmetric matrix이다.
  - $$a_{ij}=\begin{cases}1 & (v_i \text{ 와 } v_j \text{간 간선 존재}) \\ 0 & (\text{otherwise}) \end{cases}$$
  - 한 번의 메모리 접근으로 간선 존재 유무를 파악할 수 있다. 배열 [x, y] 혹은 [y, x]를 보면 되기 때문이다.
  - $O(n^2)$ 공간이 필요한데, 그래프 내 간선이 적다면 공간의 낭비가 크다. 행렬이 대부분이 0으로 채워진다.
- <span style="color: #1565C0; background: #BBDEFB">**인접리스트**</span>
  - 리스트의 크기는 간선 수에 비례한다
  - $\vert V \vert$ 개의 연결리스트가 존재한다. 따라서 전체 공간은 $O(\vert E \vert)$ 이다.
  - 간선의 조사는 상수 시간이 걸리지 않는다.
  - 대신 이웃 순환은 쉽다. 한 노드에 연결된 리스트 요소 따라가면 되니까.
  - 무향 그래프라면 대칭 구조다. $u$ 리스트에 $v$가 있고, 그 반대도 마찬가지.

![image](https://user-images.githubusercontent.com/69252153/223089447-80d25b65-f2ea-414c-9865-3f4b07ad0e19.png)

그래프의 상황에 따라 표현법을 선택하는 게 좋다.

- Dense Graph: $\vert E \vert \fallingdotseq \vert V \vert ^2$
- Sparse Graph: $\vert E \vert \fallingdotseq \vert V \vert$

- - -

# 3.2. 무향 그래프의 DFS

`explore(G, v)` 함수는 특정 노드로부터 닿을 수 있는 모든 노드를 탐색한다. 이는 스택이나 재귀로 구현 가능하다.

<figure>
<img src="https://user-images.githubusercontent.com/69252153/223090186-d2c75785-d3f4-4776-98f7-9747788b36e5.png" width="80%">
<figcaption>explore() 알고리즘</figcaption>
</figure>

`explore` 의 방문 결과를 아래와 같이 트리로 나타낼 수 있다.

<figure>
<img src="https://user-images.githubusercontent.com/69252153/223092318-82152763-8b86-4b97-9f2a-332d7c7813f8.png" width="70%">
<figcaption>방문 결과 트리</figcaption>
</figure>

## Depth First Search

<span style="color: #1565C0; background: #BBDEFB">**깊이 우선 탐색(Depth First Search, DFS)**</span>는 전체 그래프를 순회할 때까지 `explore(G, v)`를 반복한다. 이는 트리가 여러 개 모인 forest를 형성한다.

<figure>
<img src="https://user-images.githubusercontent.com/69252153/223094549-5549e090-a28f-4007-95ab-3b566c77a0a2.png" width="60%">
<figcaption>DFS</figcaption>
</figure>

한 정점 당 아래의 복잡도를 가진다.

- $O(\vert V \vert)$: 방문 지점을 표시하고(`visited(v)`) `previsit(v)`, `postvisit(v)` 하기
- $O(\vert E \vert)$: 인접 간선의 루프를 찾는다. 간선 당 2번이다. $e = \{x, y\}$ 에서 $x \rightarrow y$ 한 번, $y \rightarrow x$ 한 번.

따라서 $O(\vert V \vert + \vert E \vert)$ 이다.

## 무향그래프에서 Connectivity

- <span style="color: #1565C0; background: #BBDEFB">**연결(Connected)**</span>: 무향 그래프에선 모든 노드 쌍의 경로가 있을 때를 말한다.
- <span style="color: #1565C0; background: #BBDEFB">**연결 영역(connected components, subgraph)**</span>: `explore()`가 되는 부분을 말한다.

따라서 DFS로 그래프의 연결 여부를 검사할 수 있다. 각 노드 $v$에 `explore` 호출 시마다 `ccum[v]` 정수를 할당해 연결 성분이 있는지 표시한다.

```
procedure previsit(v)
------------------------
ccnum[v] = cc
```

## 카운터(Clock)

처음 해당 노드를 발견했을 때(`previsit`)와 마지막으로 떠나갈 때(`postvisit`) 순서(시점)을 기록한다.

```
procedure previsit(v)
------------------------
pre[v] = clock
clock = clock + 1
```

```
procedure postvisit(v)
------------------------
post[v] = clock
clock = clock + 1
```

[pre, post]는 해당 정점이 스택에 들어오고 나간 시간, 즉 머문 시간이고, 스택은 First In Last Out (선입후출) 구조이다. 때문에 두 간격 [ pre (u), post (u)]와 [ pre (v), post (v)]는 서로 독립되어 있거나, 하나가 다른 하나를 포함한다. 

- - -

# 3.3. 유향그래프의 DFS

특별하게 사용되는 용어들을 정리한다.

- root: 트리의 시작 지점
- desendent: 어떤 노드로부터 뻗어나온 노드들
- ancestor: 해당 노드가 기원한 노드들
- parent: 해당 노드의 바로 직전 노드 (내가 기원한 노드)
- child: 해당 노드의 바로 직후 노드 (나로부터 뻗어나간 노드)

<figure>
<img src="https://user-images.githubusercontent.com/69252153/223099788-9adc941c-1306-481b-ba48-9dacc6bcaed1.png" width="50%">
<figcaption>DFS Tree</figcaption>
</figure>

- Tree edge: DFS forest의 일부
- Forward edge: 자식이 아닌 자손에게 이어짐
- Back edge: 부모가 아닌 조상에게 이어짐
- Cross edge: 자손도 조상도 아닌 노드에게 이어짐

## Directed Acyclic Graph

유향 그래프는 DFS가 back edge가 있을 때만 순환(cycle)을 갖는다.

<span style="color: #1565C0; background: #BBDEFB">**유향 비순환 그래프(Directed Acyclic Graph, DAG)**</span>는 

- 한 번의 DFS로 선형 시간에 acyclicity를 조사할 수 있다.
- 선형화(linearize)(또는 위상정렬(topologically sort, 순서대로 배열))이 가능하다.
  - `post` 숫자가 감소하도록 정렬하면 된다.
  - 가장 높은 `post`('source')에서 가장 낮은 `post`('sink') 순으로.
- 즉 모든 간선은 가장 낮은 `post`의 노드로 이어진다.

- - -

# 3.4. Strongly Connected Components
## 유향 그래프의 연결성(Connectivity)

유향 그래프의 경우, 양 방향으로 path가 있어야 두 노드가 연결되었다(connected)고 한다.

<span style="color: #1565C0; background: #BBDEFB">**Strongly Connected Components(강한 연결 성분)**</span>는 meta node로 줄일 수 있다. <span style="color: #1565C0; background: #BBDEFB">**Meta graph**</span>는 DAG이다.

따라서 모든 유향 그래프는 유향 그래프의 강한 성분들의 DAG이다. 

<figure>
<img src="https://user-images.githubusercontent.com/69252153/223101365-2706f2a1-d72d-4150-80ae-c32f064abed0.png" width="80%">
<figcaption>(a) 강한 연결 성분, (b) Meta graph</figcaption>
</figure>

그래서 유향 그래프의 연결구조를 두 계층으로 나눌 수 있다. 최상위 DAG가 하나 있고, DAG의 노드 하나하나는 완전한(full fledged) 강한 연결성분이다.

## 유향 그래프를 강한 연결 성분으로 분해하기

DFS를 이용해 선형시간에 유향 그래프를 강한 연결 성분으로 분해할 수 있다.

- `explore`의 서브루틴이 $u$에서 시작할 때, $u$에서 갈 수 있는 모든 노드를 방문하면 서브루틴이 종료된다.
  - e.g., 메타 그래프의 끝점(=강한 연결 성분의 끝점) 내 노드에서 호출하면 meta node를 순회하고 종료한다.
- DFS에서 가장 높은 `post`의 노드는 메타 그래프의 끝점(=강한 연결 성분의 끝점)의 source이다.
- $C$, $C'$ 이 메타 그래프의 끝점(=강한 연결 성분의 끝점)이고, $C$ 내의 노드에서 $C'$ 내의 노드로 간선이 있다면, $C$ 내 가장 높은 `post` >  $C'$ 내 가장 높은 `post`
  - 메타 그래프의 끝점(=강한 연결 성분의 끝점)의 가장 높은 `post`를 감소시키는 순서로 배열하면, 강한 연결 성분을 선형화시킬 수 있다.