---
title:  "2차원 리스트, heapq 모듈"
excerpt: "Python 문법 간단 정리 (1)"

categories:
  - Python
tags:
  - Programming
  - Python
last_modified_at: 2022-02-17

use_math: true
toc: true
tock_sticky: true
toc_label: "Contents"
---

코딩테스트 문제풀이를 하며 찾아보았던 내용을 정리했다.
{: .notice--info}

# 🥭 2차원 리스트의 선언
2차원 리스트를 선언하는 방법 중 두 가지가 있는데, 한 예로 0으로 초기화된 5 X 5 리스트를 만든다고 하자.
  * [방법1] `arr1 = [[0] * 5] * 5`
  * [방법2] `arr2 = [[0 for i in range(5)] for j in range(5)]`
  
둘 모두 아래와 같은 모양을 가진다.

```python
[0, 0, 0, 0, 0], 
[0, 0, 0, 0, 0],
[0, 0, 0, 0, 0],
[0, 0, 0, 0, 0],
[0, 0, 0, 0, 0]
```

여기서 (1, 2)의 값을 1로 바꾼다고 하자. 이때 결과는 아래와 같이 달라진다.

```python
# 방법1
[0, 0, 1, 0, 0]
[0, 0, 1, 0, 0]
[0, 0, 1, 0, 0]
[0, 0, 1, 0, 0]
[0, 0, 1, 0, 0]

# 방법2
[0, 0, 0, 0, 0]
[0, 0, 1, 0, 0]
[0, 0, 0, 0, 0]
[0, 0, 0, 0, 0]
[0, 0, 0, 0, 0]
```

이는 [방법1]의 경우 <span style="background-color: #12B886; color: white">**얕은 복사가 되기 때문**</span>이다. 자세한 원리는 아래 참고문헌 링크를 참조한다.

# 🍎 heapq 모듈
  * <span style="background-color: #12B886; color: white">**최소 힙(min heap)**</span>으로 작동하는 힙을 제공한다.
  * 힙은 리스트로 만들어지므로 heapq 모듈로 만들 힙은 리스트로 선언한다.
  * 힙에 원소 추가: `heapq.heappush(힙 리스트, 요소값)`
  * 힙에서 원소 삭제 후 리턴: `heapq.heappop()`
  * 최소힙으므로 가장 첫번째 원소가 최솟값이다. `힙리스트[0]`인 것이다.
  * 기존 리스트를 힙으로 변환: `heapq.heapify(리스트)`


# 빈 리스트
파이썬은 빈 리스트를 False로 인식한다.

# or 연산자
A or B이면 A가 True일 때 A를, False일 때 B를 택한다.

```python
#문제: 리스트 L 내에서, 원소 x 가 발견되는 모든 인덱스를 구하여 이 인덱스들로 이루어진 리스트를 반환
# L = [64, 72, 83, 72, 54] 이고 x = 83 인 경우의 올바른 리턴 값은 [2] 입니다.
# 없으면 [-1] 반환
answer = [i for i in range(len(L)) if L[i] == x]
return answer or [-1] 
#만약 answer의 길이가 0이라면 answer = False가 됨
# answer이 False이면 다음 것.
```


# None과의 비교
None과 비교할 때는 `==`나 `!=`보단 `is`, `not`을 씀
https://stackoverflow.com/questions/14247373/python-none-comparison-should-i-use-is-or

- - -

# 참고 문헌
* 2차원 리스트의 선언: https://earthteacher.tistory.com/77
* heapq 모듈: https://www.daleseo.com/python-heapq/