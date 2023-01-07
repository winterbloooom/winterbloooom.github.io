---
title:  "최대/최솟값, Pointer, Vector, 참조자(&), 순열, 1LL"
excerpt: "C++ 문법 간단 정리 (1)"

categories:
  - Programming
  - C++

tags:
  - Programming
  - Python
last_modified_at: 2022-02-17


---

코딩테스트 문제풀이를 하며 찾아보았던 내용을 정리했다.
{: .notice--info}

# 🥝 min(), max() 함수
표준 라이브러리 `<algorithm>`에는 `min()`, `max()` 함수가 있어 <span style="background-color: #12B886; color: white">**주어진 두 수 중 최솟값과 최댓값을 리턴한다.**</span>
```cpp
int a = 1;
int b = 2;
int result = min(a, b);  // 2 반환
```

# 🥥 포인터

* <span style="background-color: #12B886; color: white">**포인터 선언**</span>: `자료형* 포인터명 = 할당값`
  * <span style="background-color: #12B886; color: white">**특정 변수의 주소**</span>는 `&변수명`이므로 이를 가리키려면 `할당값`에 `&변수명`으로 사용
  * <span style="background-color: #12B886; color: white">**포인터의 주소**</span> 역시 `&포인터명`으로 얻을 수 있음
* <span style="background-color: #12B886; color: white">**포인터가 가리키고 있는 변수의 값**</span>: `*포인터명`으로 역참조

```cpp
int num = 1;
int* numPtr = &num;

cout << "num: " << num << endl;
cout << "&num: " << &num << endl;
cout << "numPtr: " << numPtr << endl;
cout << "&numPtr: " << &numPtr << endl;
cout << "*numPtr: " << *numPtr << endl;

// num: 1
// &num: 005AF868
// numPtr: 005AF868
// &numPtr: 005AF85C
// *numPtr: 1  
```

# 🍇 &의 쓰임
기존에 알고 있던 `&` 비트 연산, 조건 식에서 `&&`으로 AND 의미, 그리고 메모리의 주소 값을 가리키는 `&변수` 쓰임 말고도 하나가 더 있다.

`&`는 <span style="background-color: #12B886; color: white">**변수의 참조자**</span>, 즉 별명을 붙이는 기능을 한다. `자료형& 별명 = 변수명`으로 할당하면 해당 변수를 앞으로는 '별명'으로 부르겠다는 이야기이다.

```cpp
int a;
int& b = a;
b = 3;
cout << "a: " << a << ", b: " << b << endl;  // a: 3, b: 3 출력
```

# Vector
## 🍈 2차원 벡터의 선언
미리 <span style="background-color: #12B886; color: white">**벡터의 크기를 지정하거나, 특정 값으로 선언과 동시에 초기화**</span>하고 싶다면 `vector<자료형> 벡터명(크기, 값)`으로 선언한다. 

만약 `값` 부분을 생략하고 `크기`만 입력한다면 0으로 초기화된다. 초기화 없이 개수만 지정하려면 `vector<자료형> 벡터명[크기]`로 선언할 수 있다.

2차원 벡터를 크기 지정해 선언하려면, 한 행이 한 벡터가 되므로 초기화 하는 값으로서 안쪽 벡터를 넣어주면 된다.

```cpp
int width = 5;
int height = 3;
vector<string> row(width, "*");
vector<vector<string>> vec(height, row);

for (vector<string> row : vec)
{
    for (string elem : row)
        cout << elem << " ";
    cout << endl;
}

/* 

출력결과----------------------
* * * * *
* * * * *
* * * * *

*/
```

## 🍉 벡터의 for문
벡터의 요소 하나하나를 보고 싶다면 인덱스로 `vec[1]`처럼 보는 방법 말고도, 파이썬처럼 <span style="background-color: #12B886; color: white">**범위 기반 for 문 형태**</span>를 사용할 수 있다. 단 이때는 요소 값을 직접 변경할 수는 없다. `for(자료형 요소이름 : 벡터명)`으로 쓴다. 벡터의 요소 하나하나를 `요소이름`으로 한다는 뜻이다.
```cpp
vector<int> vec = {0, 1, 2, 3};
for(int elem : vec)
    cout << elem << " ";  // 0 1 2 3 출력
```

다른 방법으로는 <span style="background-color: #12B886; color: white">**iterator(이터레이터, 반복자)를 이용**</span>할 수도 있다. <span style="background-color: #12B886; color: white">**반복자의 값을 참조**</span>할 때는 `*`을 사용한다. 이렇게는 값을 변경할 수 있다.
```cpp
vector<int> vec = {0, 1, 2, 3};
for (int iter = vec.begin(); iter != vec.end(); iter++) { 
    cout << *iter << " ";
}
```

## 🍊 벡터의 정렬
기본적으로  `sort(시작 반복자, 끝 반복자)`로 정렬 가능하다.
2차원의 경우에 `sort(행 벡터의 시작 반복자, 행 벡터의 끝 반복자)`로 각 행(큰 벡터의 요소)에 대해 반복하면 된다.
```cpp
// 1차원 벡터
vector<int> vec1 = {4, 2, 1, 5};
sort(vec1.begin(), dungeons.end());

// 2차원 벡터
vector<vector<int>> vec2D(4, vector<int> vec1D(3));
for (int i = 0; i < vec2D.size(); i++)
{
    sort(vec2D[i].begin(), vec2D[i].end());
}
```

# 🍋 Python과 C++에서 삼항 연산자 차이
  * Python: `[True일 때 값] if [조건] else [False일 때 값]`
  * C++: `[조건] ? [True일 때 값] : [False일 때 값]`

# 🍌 순열 next_permutation
<span style="background-color: #12B886; color: white">**순열(permutation)**</span>은 서로 다른 n개에서 r개를 뽑아 줄을 세웠을 때 가능한 모든 경우의 수를 말하는데, 표준 라이브러리 `<algorithm>`에는 `next_permutation`으로 <span style="background-color: #12B886; color: white">**다음 순열을 반환하는 기능**</span>을 지원한다. 원형은 아래와 같다.

```cpp
bool next_permutation (BidirectionalIterator first, BidirectionalIterator last);
```

즉, 배열이나 벡터 등의 컨테이너의 시작 반복자와 끝 반복자를 각각 인자로 넣어준다. 다음 순열이 있다면 그 컨테이너의 순서를 해당 순열의 순서로 바꾸고 true를 반환하며, 순열이 없다면 false를 반환한다.

이때 주의할 것은 `next_permutation`은 컨테이너가 오름차순으로 정렬된 값을 가져야 하고 오름차순으로 순열을 생성하며, 중복을 제외하고 순열을 만든다는 것이다.

# 🍍 1LL
숫자 계산의 결과가 해당 자료형의 표현 가능 범위를 벗어나면 Overflow가 발생한다. 
정수형인 `int`는 $-2^{31} + 1$ 부터 $2^{31} - 1$까지의 범위를 표현할 수 있으므로 100,000 X 100,000을 계산하면 오버플로우가 발생한다.

이를 해결하기 위해 <span style="background-color: #12B886; color: white">**더 큰 범위의 자료형을 곱해**</span>주면 그 범위의 계산으로 이루어진다. 서로 다른 자료형을 연산할 때는 더 큰 범위를 가지는 자료형을 기준으로 계산되기 때문이다.
`1LL` 중 `LL`은 `long long int`의 준말로 `1LL`은 <span style="background-color: #12B886; color: white">**1을 long long int의 자료형으로 나타낸다**</span>는 의미이다. 따라서 `1LL * 100,000 * 100,000`을 하면 int가 아니라 long long의 범위로 계산이 이루어져 오버플로우가 일어나지 않는다. 단, 연산은 좌에서 우로 이루어지므로 `100,000 * 100,000 * 1LL`이면 앞서 int 범위 내에서 여전히 오버플로우가 발생하므로 순서에 주의한다.

- - -

# in progress

`<stack>` 라이브러리
`queue<pair<pair<int, int>, int>>`
queue는 q.front()로 맨 앞 원소
  ```
  int curR = q.front().first.first;  // 큐의 맨 앞 위치의 행 값
        int curC = q.front().first.second;  // 큐의 맨 앞 위치의 열 값
        int cnt = q.front().second; // 큐의 맨 앞 위치까지 걸리는 횟수
  ```
 ``` 
   BFS 경주로 문제
  answer = *min_element(cost[n - 1][n - 1], cost[n - 1][n - 1] + 4);
  ```

  
   파이썬 PriorityQueue, heapq
  C++ queue의 priority_queue

- - -

# 참고 문헌
* 포인터: https://jhnyang.tistory.com/100
* &의 쓰임: http://andyader.blogspot.com/2013/08/c-c.html
* 2차원 벡터의 선언: https://coding-factory.tistory.com/596
* 벡터의 for문: https://life-with-coding.tistory.com/285
* 벡터의 정렬: https://learncom1234.tistory.com/6
* 순열 next_permutation: https://mjmjmj98.tistory.com/38
* 1LL: https://hyuncpp.tistory.com/entry/C-1ll1LL%EC%9D%B4%EB%9E%80