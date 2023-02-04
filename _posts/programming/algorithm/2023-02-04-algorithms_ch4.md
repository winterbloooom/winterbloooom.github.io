---
title:  "Algorithms 4장: Paths in graphs"
excerpt: "그래프에서 최단경로 찾기, BFS, Dijkstra's algorithm, Priority Queue"

categories:
  - Programming
  - Algorithm
tags:
  - Algorithm
last_modified_at: 2023-02-04
---

{% include inserted_box.html text="이 내용은 책 <a href='http://algorithmics.lsi.upc.edu/docs/Dasgupta-Papadimitriou-Vazirani.pdf'>Algorithms(Sanjoy Dasgupta et al.)</a>을 기반으로 하고 있습니다." %}


# 4.1. 거리(Distances)

DFS로는 (1) 특정 시작점으로부터 닿을 수 있는 모든 노드를 구하기 (2) 그 노드들의 경로(path) 구하기(search tree로 나타낼 수 있음) 가 가능했다. 그러나 이렇게 구한 경로는 가장 경제적인, 쉽게 말해 최단경로는 아니다.

이번 4장에서는 주로 그래프에서 최단 경로(shortest path)를 찾는 방법을 알아본다.

경로의 **길이(lengths)**는 그래프에서 서로 다른 노드가 얼마나 떨어져있는지를 의미하는 양이다. 두 노드 간의 **거리(distance)**는 그 중에서도 가장 짧은 경로의 길이를 말한다.

- - -

# 4.2. 너비 우선 탐색(Breadth-first search)

## BFS 알고리즘

특정 노드 s를 레이어 1번, s로부터 거리가 2인 노드들을 레이어 2번, ... 라고 한다면, 이를 활용해 s에서 다른 노드들까지의 거리를 계산할 땐 레이어 단위로 진행할 수 있다. 즉, 어떤 특정 시간에 d번 레이어의 노드들을 모두 알고 있다면 d+1번 레이어는 d번 레이어의 이웃(연결된 노드)를 조사함으로써 알 수 있다.

<figure>
<img src="https://user-images.githubusercontent.com/69252153/216764130-cd32d2d6-7b2d-4d2d-b3db-6242279a568b.png" width="60%">
<figcaption>Fig. 1 맨 위부터 1, 2, 3번 레이어로 나눌 수 있다.</figcaption>
</figure>

**BFS(Breadth-first search, 너비 우선 탐색)**은 이런 원리를 이용한 그래프 탐색법이다. 같은 거리의, 즉 같은 깊이의 노드들을 우선적으로 탐색한다. 

* 시작 노드 s를 거리 0으로 해서 큐 Q에 넣는다. (큐 초기화)
* 거리 d = 1, 2, 3, ...에 대해 큐 Q가 오직 거리가 d인 노드들(시작 노드로부터 그들의 거리가 d로 모두 같은)만 가지고 있을 때가 있다. 즉, 큐 안에는 하나의 레이어에 속한 노드들만 존재한다.
* 이 노드들이 큐의 front에서 꺼내져 처리될 때, 아직 탐색하지 못한 이웃 노드들(거리가 d+1. 다음 레이어에 속한 노드들)이 큐의 end로 삽입된다.

<figure>
<img src="https://user-images.githubusercontent.com/69252153/216764182-b65665d7-2290-43fc-a8ec-54492465907c.png" width="90%">
<figcaption>Fig. 2 BFS</figcaption>
</figure>

위 의사코드에서 볼 수 있듯이 처음에는 모든 거리를 무한으로 초기화한 뒤, 시작 노드를 거리 0으로 초기화하고, 큐에 넣는다. 반복문 안에서는 큐의 요소 하나를 뽑아(거리가 d라 하면), 그와 연결되었으며 아직 탐색되지 않은 모든 노드들(바로 연결되어 있으니 거리가 d+1일 것임)을 큐에 넣고, 그들의 거리를 업데이트한다.

<figure>
<img src="https://user-images.githubusercontent.com/69252153/216764407-9d71fcd3-9e2a-44db-88e9-a1b0be4220ee.png" width="60%">
<figcaption>Fig. 3 BFS 예시</figcaption>
</figure>

BFS로 만들어진 트리는 위 사진과 같은데, 각 층은 시작노드로부터 거리가 같고 이는 최단 거리에 해당한다. 즉, 이 트리는 **최단 경로 트리(shortest path tree)**이다.

## BFS의 정확도 검증(correctness)

각 거리 d = 0, 1, 2, ...에 대해 다음과 같은 세 가지가 만족되는 순간이 존재해야 BFS가 정확히 작동한 것이다.

* 시작 노드로부터 거리 d 이하의 모든 노드는 본인들의 올바른 거리가 계산되어 있다
* 그 외의 모든 노드들은 거리가 ∞로 설정되어 있다.
* 큐 안에는 거리가 d인 노드들만 있다.

계속 언급했지만, 위와 같은 순간은 '이전 레이어와 바로 연결된(이웃) 모든 노드들이 전부 큐에 들어가 있는' 상태로, 이제부터 큐에서 노드들을 꺼내 알고리즘을 다시 반복한다면 그때부턴 d+1 번째 레이어가 된다.

## BFS의 효율성(efficiency)

DFS와 같은 이유로 BFS도 선형 시간 $O(\vert V \vert + \vert E \vert)$ 을 갖는다.

각 노드는 큐에 한 번만 들어갔다가 나오므로 $2 \vert V \vert$ 번의 큐 연산을 하고, 반복문을 돌며 각 간선은 대해 무향 그래프는 한 번, 유향 그래프는 두 번씩 사용되어 $O(\vert E \vert)$ 시간이 걸리기 때문이다.

## DFS vs BFS

|DFS|BFS|
|---|---|
|깊이 우선 탐색|너비 우선 탐색|
|stack 이용| queue 이용|
|deeper & narrow|broader & shallow|
|실제로 가까운 두 노드가 DFS 결과 멀리 돌아갈 수도 있음|두 노드 간의 최단거리를 찾음. 거리가 가까운 순서대로 방문함|
|더이상 방문할 노드가 없을 때 뒤로 다시 돌아감. Connected component를 다 돌았으면 다른 노드에서 재시작. | 다시 시작 안함. 시작 노드로부터 닿지 않는 노드는 무시|

- - -

# 4.3. 간선의 길이(length)

지금까지는 간선의 길이가 모두 동일하다고 가정했으나, 실제 문제들은 그렇지 않은 경우가 더 많으며 심지어는 음수 길이의 간선도 존재한다.

간선 $e \in E$ 의 길이를 $l_e$ 라고 표현하며, 다르게는 간선 $e=(u, v)$ 일 때 그 길이를 $l(u, v)$ 혹은 $l_{uv}$ 라고도 할 수 있다.

간선의 길이는 물리적 길이라기 보단, 상황에 따라 어떠한 양이 부과된다고 본다. (e.g. 도시 간 이동하는 데 드는 비용)

- - -

# 4.4. 다익스트라 알고리즘(Dijkstra's algorithm)

## BFS의 변형

### 간선의 길이까지 고려하는 BFS

간선의 길이가 양의 정수라고 가정하자. 다양한 길이의 간선으로 이루어진 그래프 G를 손쉽게 처리하기 위한 방법이 있다. 각 간선을 단위 길이만큼으로 자르고 그 사이에 dummy node를 넣어 새 그래프 G'을 만드는 것이다. 마치 4km 떨어진 지점까지 1km마다 휴게소를 설치하는 느낌이라 보면 된다.

즉 새로운 그래프 G'은 모든 간선 $e=(u, v) \in E$ 을 길이가 1인 간선 $l_e$로 바꾸고 $u, v$ 사이에 dummy node $l_e - 1$ 개를 넣어 만든다. 그럼 이제부턴 G'에 위에서 본 BFS를 그대로 적용해 거리들을 계산할 수 있게 된다.

<figure>
<img src="https://user-images.githubusercontent.com/69252153/216766069-1024767f-4f78-4f60-9f11-9d0835f99532.png" width="60%">
<figcaption>Fig. 4 dummy node를 사용해 G' 만들기</figcaption>
</figure>

### Alarm clock algorithm

그러나 역시 문제는 발생한다. 만약 간선이 매우 길어서 두 노드 사이에 dummy node가 매우 많아진다면, 쓸데없는 dummy node를 거쳐가는데 많은 시간을 쏟게 된다. 그래서 **알람 시계 알고리즘** 을 고안했다. '진짜 노드'에 도착할 때마다 알람을 켜고 경우에 따라 그 거리를 갱신하는 것이다.

* 시작 노드 s의 알람 시계 시간을 0으로 설정한다.
* 더 알람이 울리지 않을 때까지(모든 노드를 방문할 때까지) 아래 과정을 반복한다. 어떤 노드 u가 시간 $T$에 알람이 울렸다고(도착했다고) 하면
  * s부터 u까지 거리는 $T$이다.
  * u와 바로 연결된(이웃) 노드 v 각각에 대하여
    * v의 알람이 아직 울리지 않았다면(아직 방문 전이라면) v의 시간을 $T+l(u, v)$로 설정한다. 이 말인 즉, s와 v가 직접적으로 연결되어 있지 않거나, 다른 노드들을 거쳐 s와 경로가 나오더라도 이미 이것이 최단경로라는 뜻이다. 최단경로가 아니었다면 $T$ 이전에 v에 도착해알람이 울렸을테니 말이다.
    * v의 알람이 $T+l(u, v)$보다 늦게 울린다면 더 작은 수인 $T+l(u, v)$ 로 그대로 둔다. 위와 같은 원리로, 다른 경로로도 v에 닿을 수는 있지만 그건 더 돌아가는 길이라 최단 경로는 아니란 뜻이다.

<figure>
<img src="https://user-images.githubusercontent.com/69252153/216766202-ea64ef08-c617-475e-83bd-cfe9d0c0bb78.png" width="60%">
<figcaption>Fig. 5 alarm clock algorithm example</figcaption>
</figure>

Fig 5를 예를 들어보자. 시작 노드를 S라 하면, 

1. S의 시간은 0이다.
2. 그 다음으론 가장 먼저 A가 울린다. A의 시간은 100이다.
3. 다음엔 A와 연결된 B가 울린다. B의 시간은 100 (A가 울린 시간) + 50 (A에서 B까지 거리) = 150이다.
4. 이후에 S에서 출발한 신호가 B에 도착해 시간 200에 알람이 울려도 150보다 늦다. 그러니 최단 경로는 S-B가 아니라 S-A-B이다.


### 다익스트라 알고리즘

**다익스트라 알고리즘**은, 위의 알람 시계 알고리즘을 적용하되 그 데이터 구조로 우선순위 큐(priority queue)을 사용하는 최단 경로 찾기 알고리즘이다.

우선순위 큐는 보통 heap(힙)으로 구현되며, 다익스트라 알고리즘에서 아래와 같은 조건을 만족한다.

* 저마다의 키 값(알람 시간)을 가진 노드들을 가지고 있다.
* 다음 4가지 연산을 지원한다.
  * Insert: 큐에 요소 추가. 알람을 설정하는 역할
  * Decrease-key: 특정 요소의 키 값을 감소시킴. 이 역시 알람을 설정하는 역할.
  * Delete-min: 키 값이 최소인 요소를 리턴하고 큐에서 삭제. 다음에 어느 알람이 울릴지 결정. (알람이 울린다 = 큐에서 나간다)
  * Make-queue: 키 값이 있는 주어진 요소들에 대해 우선순위 큐를 만듦. 

<figure>
<img src="https://user-images.githubusercontent.com/69252153/216767144-77963fe8-a785-45b3-b21e-de75faca297a.png" width="70%">
<figcaption>Fig. 6 Dijkstra's Algorithm</figcaption>
</figure>

위 의사코드를 자세히 살펴보자.

`dist(u)` 는 노드 u의 알람 시간을 설정한다. 초기에는 모두 ∞으로한다. 이는 아직 결정된 시간이 없음(노드 간 거리 모름)을 의미한다.

최소 거리를 갱신하는 조건으로는 `dist(v) > dist(u) + l(u, v)` 인데, 이는 이전에 알람 시계 알고리즘에서 보았듯이 v까지 오는데 '내가 이전에 알고 있던 경로보다, u를 거쳐 가는 것이 더 빠른 경로'임을 말한다.

`prev` 라는 특별한 배열이 존재하는데, 이는 각 노드의 직전 노드를 저장하고 있다. 각 노드 간의 최단 경로를 발견할 때마다 `prev`를 갱신하며, 최종적인 `prev`를 거꾸로 따라 올라가다보면(back-pointers) 최단 경로를 얻을 수 있다.

이렇게 보면 알겠지만, 다익스트라 알고리즘은 일반 큐가 아닌 우선순위 큐를 사용해서 간선의 길이를 고려한다는 점을 빼면 그냥 BFS다.

<figure>
<img src="https://user-images.githubusercontent.com/69252153/216768476-2d547560-21c9-4ca9-a137-79e7c792d60f.jpg" width="80%">
<figcaption>Fig. 7 Dijkstra's Algorithm Example</figcaption>
</figure>

- - -

## 최단경로를 계산하는 다른 형태

최단경로를 계산하기 위해 이러한 전략을 세운다. '시작 노드 s에서부터 인접한 노드들로 영역 R을 확장해나간다. R 내부의 노드들은 거리와 최단경로를 알고 있다.'

시작 노드로부터 현재 위치한 노드까지 최단경로는 하나의 간선(single edge)를 계속 연장해나간 형태라 볼 수 있는데, 같은 원리로 현재 노드에서 인접한 노드로 이 간선을 연장해 계속해서 최단경로를 찾을 수 있다.

<figure>
<img src="https://user-images.githubusercontent.com/69252153/216769339-b63f1ece-826e-4718-9411-9a24afeff26d.png" width="60%">
<figcaption>Fig. 8 Single-edge extensions of known shortest paths</figcaption>
</figure>

이를 의사코드로 나타내면 아래와 같다.

<figure>
<img src="https://user-images.githubusercontent.com/69252153/216769398-804c43ae-5192-4131-9062-ff4406c0277e.png" width="70%">
<figcaption>Fig. 9 The shortest path</figcaption>
</figure>

Fig 7의 예시를 적용해보면, R은 {A}, {A, C}, {A, C, B}, {A, C, B, D}, {A, C, B, D, E}로 확장된다. 위 알고리즘에 우선순위 큐 연산을 포함하면 결국 또다시 다익스트라 알고리즘이 된다.

귀납법(induction)으로 위 알고리즘을 증명하자. while문의 끝에선 매번 다음의 조건을 만족한다.

* 영역 R의 모든 노드들은 시작 노드 s로부터 거리가 d 이하이고, R 밖의 노드들은 d 이상이다.
* 모든 노드 u에 대해 `dist(u)`는 s로부터 u까지의 최단 경로의 길이를 말하며, 중간 노드들은 R에 있어야 한다.

- - -

## Running time

다익스트라는 BFS와 구조적으로 동일하지만, 다익스트라에 사용되는 우선순위 큐 연산이 BFS에 사용되는 큐 연산보다 더 오랜 시간이 걸린다. $\vert V \vert$ 번의 `deletemin`과 $\vert V \vert + \vert E \vert$ 번의 `insert`, `decresekey` 연산이 필요하다.

이러한 소요 시간들은 어떻게 구현하는가에 따라 달라진다. 구체적으로는 우선순위 큐를 배열, binary heap, $d$-ary heap, Fibonacci heap 등 어떤 힙으로 만드느냐가 중요해진다. 