---
title:  "[Matplotlib] Matplotlib Tutorial"
excerpt: "<Matplotlib Tutorial - 파이썬으로 데이터 시각화하기> 정리"

categories:
  - Programming
  - Python

tags:
  - Programming
  - Python
last_modified_at: 2021-07-15


---

해당 글은 <Matplotlib Tutorial - 파이썬으로 데이터 시각화하기>를 읽은 것을 바탕으로 하였으며, 상세한 예시 및 코드, 내용은 하단 링크를 참조한다.
{: .notice--info}


# Matplotlib
* Python에서 Matlab과 유사한 그래프 표시를 하도록 돕는 Python 라이브러리
* 공식사이트 링크는 하단 참조
* ``import matplotlib.pyplot as plt``로 보통 Import 함


# Pyplot 모듈
* 아래 내용은 모두 Matplotlib 내 Pyplot 모듈을 이용함
* Matlab과 같이 명령어 스타일로 동작하는 함수의 모음


# 선그래프 그리기
> Matplotlib은 리스트 값을 y라 가정하고 x값을 자동으로 만듦

> Matplotlib은 일반적으로 numpy 배열을 이용하나, 모든 시퀀스가 내부적으로 numpy 배열로 변환됨

1. 함수 ``pyplot.plot()`` : 선 그래프를 그림
   * 첫 번째 파라미터 : y값으로, x값은 자동 부여됨
   * 두 번째 파라미터 : x값으로, y값과 순서대로 쌍을 이뤄 그래프를 그림


2. 선 그래프 꾸미기 : 파라미터 ``color``, ``marker``, ``linestyle``로 선 색, 마커 색, 선 스타일을 지정할 수 있음


3. 여러 개의 그래프 그리기 : x와 y에 대응되는 함수/리스트를 대입
    ```python
    x = np.arange(0., 5., 0.*
    plt.plot(x, x, 'r--', x, x**2, 'bs', x, x**3, 'g^')
    # y=x의 그래프가 빨간색 파선으로, y=x^2의 그래프가 파란색 네모 점으로, y=x^3의 그래프가 초록섹 세모점으로 그려짐
    ```


# 그래프 꾸미기 및 출력
1. 함수 ``pyplot.ylabel(), pyplot.xlabel()`` : 각 축의 이름을 붙임
2. 함수 ``pyplot.show()`` : 그래프를 화면에 보임
3. 함수 ``pyplot.axis()`` : ``[xmin, xmax, ymin, ymax]`` 형태로 축의 범위 지정
4. 함수 ``pyplot.grid()`` : 격자(Grid, 그리드) 설정
   * 인수를 True로 하면 그리드가 생성됨
   * 파라미터 ``axis`` : 각 축에 대해 그릴지 지정 가능
   * 파라미터 ``color``, ``alpha``, ``linestyle``로 그리드의 선색, 간격, 선스타일을 지정함
   * 파라미터 ``which``로 주눈금(major), 보조눈금(minor), 둘 다(both)에 그리드를 표시
    ```python
    plt.grid(True, axis='y', color='red', alpha=0.5, linestyle='--')
    ```
5. 함수 ``pyplot.xticks(), pyplot.yticks()`` : 눈금 표시. ``labels`` 파라미터로 각 축의 눈금을 명시적으로 지정 가능
    ```python
    plt.xticks(np.arange(0, 2, 0.*,
    labels=['Jan', '', 'Feb', '', 'Mar', '', 'May', '', 'June', '', 'July'])
    ```
6. 함수 ``pyplot.tick_params()`` : 눈금 스타일을 다양하게 설정 가능. ``axis``, ``direction``, ``length``, ``pad``, ``top/bottom/left/right`` 등 다양한 옵션 존재
7. 함수 ``pyplot.title()`` : 그래프의 제목 설정. 파라미터 ``loc``, ``pad``, ``fontdict`` 등으로 옵션 설정 가능
8. 함수 ``pyplot.axhline(), axvline()`` : 축에서 점까지 수직/수평선 그림
9. 함수 ``pyplot.hlines(), vlines()`` : 두 점 사이의 수직/수평선 그림


# 그래프 영역 채우기
1. 함수 ``pyplot.fill_between()`` : 그래프 아래로 세로로 색이 채워짐
2. 함수 ``pyplot.fill_betweenx()`` : 그래프 아래로 가로로 색이 채워짐
    ```python
    plt.fill_between(x[1:3], y[1:3], alpha=0.5)
    plt.fill_betweenx(y[2:4], x[2:4], color='pink', alpha=0.5)
    ```
3. 두 그래프 사이 영역 채우기 : 두 개의 y값 배열을 입력함
    ```python
    plt.fill_between(x[1:3], y1[1:3], y2[1:3], color='lightgray', alpha=0.5)
    ```
4. 함수 ``pyplot.fill()`` : 임의의 영역 채움
    ```python
    plt.fill([1.9, 1.9, 3.1, 3.1], [2, 5, 11, 8], color='lightgray', alpha=0.5)
    ```

# 막대그래프 그리기
1. 함수 ``pyplot.bar()`` : 막대 그래프 그리기
   * 파라미터 ``width``, ``color``, ``edgecolor``, ``tick_label`` 등으로 그래그 꾸밀 수 있음
   * 파라미터 ``align``은 tick과 막대의 위치를 조절
   * 파라미터 ``log``는 True로 설정하면 y축이 로그 스케일이 됨
   ```python
   plt.bar(x, values, width=0.6, align='edge', color="springgreen",
           edgecolor="gray", linewidth=3, tick_label=years, log=True)
   plt.show()	 
   ```
2. 함수 ``pyplot.barh()`` : 수평 막대 그래프 그리기


# 산점도(Scatter Plot) 그리기

> **산점도(Scatter Plot)** : 두 변수의 상관관계를 직교 좌표계의 평면에 점으로 표현하는 그래프

1. 함수 ``pyplot.scatter()`` : 산점도를 그림: 파라미터 ``s``는 마커의 면적, ``c``는 마커의 색, ``alpha``는 마커 색의 투명도 지정
    ```python
    plt.scatter(x, y, s=area, c=colors, alpha=0.5)
    ```
2. 3차원 산점도(3D Scatter Plot) 그리기
   * 3차원 그래프를 그리기 위해 ``from mpl_toolkits.mplot3d import Axes3D`` import. matplotlib 3.1.0 이상 버전에서는 디폴트로 포함되어 있음
   * 파라미터로 x, y, z 위치를 배열로 입력
   ```python
   plt.rcParams["figure.figsize"] = (6, 6)
   fig = plt.figure()
   ax = fig.add_subplot(111, projection='3d') # 3D축 만듦
   ax.scatter(xs, ys, zs, c=color, marker='o', s=15, cmap='Greens')
   ```


# 히스토그램(Histogram) 그리기

> **히스토그램(Histogram)** : 도수분포표를 그래프로 나타낸 것. 가로축은 계급(변수의 구간), 세로축은 도수로 나타냄

1. 함수 ``pyplot.hist()`` : 히스토그램을 그림
   * 파라미터 ``bins``는 쪼갤 영역의 개수를 설정
   * 파라미터 ``density``는 True일 경우 밀도함수로 설정되어 막대 아래 면적이 1이 됨
   * 파라미터 ``alpha``로 투명도를 설정(0~1)
   * 파라미터 ``histtype``으로 막대 스타일을 결정. step이면 막대 내부 비고, stepfilled이면 막대 내부가 채워짐
2. 여러 개의 히스토그램 그리기
    ```python
    a = 2.0 * np.random.randn(10000) + 1.0
    b = np.random.standard_normal(10000)
    c = 20.0 * np.random.rand(5000) - 10.0 #-10에서 10사이

    plt.hist(a, bins=100, density=True, alpha=0.7, histtype='step')
    plt.hist(b, bins=50, density=True, alpha=0.5, histtype='stepfilled')
    plt.hist(c, bins=100, density=True, alpha=0.9, histtype='step')
    plt.show()	 
    ```

> ``numpy.random.randn()`` : 정규분포의 난수를 추출. `(정규분포) = (표준편차) X np.random.randn(개수) + (평균)`으로 사용<br>``numpy.random.standard_normal()`` : 표준정규분포의 난수를 추출<br> ``numpy.random.rand()`` : 균일한 분포를 갖는 임의의 값을 추출


# 에러바(Error Bar) 그리기
> **에러바(Errorbar, 오차막대)** : 데이터의 편차를 표시하기 위한 그래프

1. 함수 ``pyplot.errorbar()`` : 에러바를 그림
2. 위아래 대칭 오차 에러바
    ```python
    x = [1, 2, 3, 4]
    y = [1, 4, 9, 16]
    yerr = [2.3, 3.1, 1.7, 2.5]

    plt.errorbar(x, y, yerr=yerr)
    ```
3. 비대칭 편차 에러바 : 데이터의 포인트를 기준으로 ``(2, 데이터 개수)`` 형태 배열로 편차 입력. 2는 위와 아래라는 뜻이며, 첫 번째 튜플은 아래 방향 편차, 두 번째 튜플은 위 방향 편차
    ```python
    x = [1, 2, 3, 4]
    y = [1, 4, 9, 16]
    yerr = [(2.3, 3.1, 1.7, 2.5), (1.1, 2.5, 0.9, 3.9)]

    plt.errorbar(x, y, yerr=yerr)
    ``` 
4. 파라미터 ``uplims``, ``lolims``로 상/하한 기호 표시.
    ```python
    x = np.arange(1, 5)
    y = x**2
    yerr = np.linspace(0.1, 0.4, *

    plt.errorbar(x, y + 4, yerr=yerr)
    plt.errorbar(x, y + 2, yerr=yerr, uplims=True, lolims=True)

    upperlimits = [True, False, True, False]
    lowerlimits = [False, False, True, True]
    plt.errorbar(x, y, yerr=yerr, 
    uplims=upperlimits, lolims=lowerlimits)
    ```


# 파이 차트(Pi Chart, 원 그래프) 그리기
1. 함수 ``pyplot.pie()`` : 파이 차트를 그림
   * 첫 파라미터로 각 영역의 비율을 넣음
   * 파라미터 ``labels``에 각 영역의 이름을 지정
   * 파라미터 ``autopct``에 부채꼴 안에 표시될 숫자의 형식을 지정
   * 파라미터 ``startangle``로 첫 데이터의 시작 각도 설정. 디폴트는 0도로 +x축
   * 파라미터 ``conterclock``가 False 일 때 시계방향 순서대로 부채꼴 표시
   * 파라미터 ``explode``에 중심에서 벗어나는 정도 설정
   ```python
   ratio = [34, 32, 16, 18]
   labels = ['Apple', 'Banana', 'Melon', 'Grapes']
   explode = [0, 0.10, 0, 0.10]
   plt.pie(ratio, labels=labels, autopct='%.1f%%', startangle=260, counterclock=False, explode=explode)
   ```
2. 파이 차트 꾸미기
   * 파라미터 ``shadow``를 True로 하여 그림자 나타냄
   * 파라미터 ``color``를 배열로 넣어 색 지정
   * 파라미터 ``wedgeprops``로 부채꼴 영역 스타일 지정. 딕셔너리 키로 width(부채꼴 너비), edgecolor(테두리 색), linewidth(테두리 선 너비) 설정
   
   ```python
    colors = ['#ff9999', '#ffc000', '#8fd9b6', '#d395d0']
        #또는 colors = ['silver', 'gold', 'whitesmoke', 'lightgray']
    wedgeprops={'width': 0.7, 'edgecolor': 'w', 'linewidth': 5}

    plt.pie(ratio, labels=labels, autopct='%.1f%%',
        colors=colors, wedgeprops=wedgeprops)
   ```

# 참고자료
[Matplotlib Tutorial - 파이썬으로 데이터 시각화하기](https://wikidocs.net/92071)

[Matplotlib 공식사이트](https://matplotlib.org/)