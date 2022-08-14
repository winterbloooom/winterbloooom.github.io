---
title:  "[Rviz] Rviz 시각화하기: Marker"
excerpt: "Rviz 기초 사용법 및 Marker를 통한 시각화"

categories:
  - ROS
tags:
  - Robotics
  - ROS
date: 2022-03-12
last_modified_at: 2022-03-12
order: 9

use_math: true
toc: true
tock_sticky: true
toc_label: "Contents"
---

# Rviz
Rviz는 ROS에서 사용되는 3차원 시각화 도구이다. ROS를 설치할 때 보통 함께 설치하는 것이 일반적이다. `roscore` 명령어로 마스터 노드를 실행시킨 뒤, 터미널 창에 아래와 같은 명령어를 치면 실행된다.

```bash
$ rviz rviz 또는 rviz
```

![](https://images.velog.io/images/717lumos/post/50b44f66-b780-4342-b183-a5a5d5916ae4/2022-03-13-14-59-43.png)

위와 같은 3차원 공간에 각종 개체들을 띄워 시각화할 수 있다.

- - -

# Rviz 실행 및 화면 구성

필자가 자주 사용하는 기능들만 간단히 소개하겠다.

**① Frame 설정**

![](https://images.velog.io/images/717lumos/post/72d82235-5f81-41a2-93b0-139f2d34d87f/2022-03-13-15-03-12.png)

좌측 Display 탭의 맨 첫번째 보이는 Global Options 하에 'Fixed Frame'이 있다. 초기에는 'map'이라 되어 있다. 표시하는 개체 등마다 저 프레임을 바꿔줄 수 있다. 일례로 LiDAR 포스팅에서 실제로 구동시켜볼 때, 저 프레임 이름을 확인하면 map이 아니라 'laser'로 되어 있을 것이다. 간혹 개체를 분명 추가했음에도 보이지 않거나, 아래와 같은 경고창이 뜬다면 이 프레임을 잘못 설정하고 있다는 뜻이다.

![](https://images.velog.io/images/717lumos/post/86506cd8-3137-41f1-bfde-c4f791ac71a7/2022-03-13-15-02-40.png)

그럴 때는 'map'이라 적힌 곳에 바로 프레임 이름을 타이핑해 바꾸면 된다.

**② Add로 개체 추가하기**

스크립트 등으로 개체를 만들어 Publish하고 있는데 rviz를 실행시켜도 화면에 아무것도 보이지 않는다면 가장 먼저 '내가 개체를 보이도록 추가했나?'를 의심해야 한다. 

좌측 Display 창에는 초기 화면에는 당연히 아무것도 없다. 하단에 있는 Add 버튼을 눌러 표시할 객체를 추가해야 한다.

![](https://images.velog.io/images/717lumos/post/cd88513b-2c44-406e-8520-6ace487e1e02/2022-03-13-15-05-36.png)

버튼을 누르면 창이 뜨고 탭이 두 개가 나온다. 하나는 display type, 즉 보여지는 개체의 종류에 따라 선택을 할 수 있고, 또 하나는 topic, 즉 Rviz가 받고 있는 토픽의 이름에 따라 추가를 할 수 있다. 원하는 것이 있다면 선택하여 OK를 누르면 된다.

![](https://images.velog.io/images/717lumos/post/eef19e92-c53f-4055-a368-0059829c0528/2022-03-13-15-06-27.png)![](https://images.velog.io/images/717lumos/post/8b882c37-d163-452d-a08f-3dea5a5e22b4/2022-03-13-15-06-37.png)

특히 첫 번째 사진에서 Marker, 혹은 MarkerArray라고 써 있는 개체 종류가 우리가 오늘 사용법을 알아볼 개체이다.

개체를 추가하면 Display에 추가한 개체가 보이고, 토글을 눌러 펼쳐보면 상세한 설정이 나온다. 아래 화면은 Axes를 추가했을 때다. 빨간 색이x축, 초록색이 y축, 파란색이 z축이다.

![](https://images.velog.io/images/717lumos/post/8294908f-7145-4fdb-ade9-39a08e3dc539/2022-03-13-15-08-36.png)

추가한 개체를 삭제하고 싶다면 Display 창에서 해당 개체를 선택하고 Add 버튼 옆옆에 있는 'Remove'버튼을 누른다. 개체의 이름을 변경하고 싶다면 'Rename'누르고, 복제하고 싶다면 'Duplicate'를 누른다. 상당히 직관적이라 별 어려울 것도 없다.

**③ 화면 이동시키기**

사실 아무것도 쓸 말이 없다. 가운데 창에서 마우스로 이리저리 드래그를 하면 각도가 바뀌며 요리조리 볼 수 있다.

**④ 초점(Focal Point) 변경하기**

마우스 드래그와 휠로 보는 각도와 크기를 조정할 수는 있지만 저 귀퉁이에 있는 것을 보기가 힘들 수가 있다. 예를 들어 (5, 5)에서 작업이 이루어지는데, 아무리 마우스를 움직여 노력해봐도 (5, 5)는 언제나 화면 귀퉁이에서 벗어날 수가 없다.

그럴 때는 초점을 조정한다. 현재는 (0, 0, 0)을 기준으로 화면이 회전하고 있다. 좌측 Views 창에서 Focal Point 항목을 찾는다. 토글을 열어보면 X, Y, Z 값을 설정해 초점을 변경할 수 있다.

![](https://images.velog.io/images/717lumos/post/710eb699-ccaf-4199-b098-287da29ab824/2022-03-13-15-15-38.png)

아래 사진은 전후를 비교한 것이다.

![](https://images.velog.io/images/717lumos/post/12e5375b-ba9e-474f-9337-219702c787bc/2022-03-13-15-15-00.png)![](https://images.velog.io/images/717lumos/post/6764aee1-4639-4120-847c-5597896bd3d7/2022-03-13-15-15-24.png)

>초기 격자 설정은 x, y축으로 각각 -5 ~ 5까지이고, 한 칸에 1m씩이다.

**⑤ 이미지 저장하기**

상단 메뉴바에서 File - Save Image 를 클릭하면 Rviz 창 혹은 현재 보여지고 있는 시각화 창을 이미지로 저장할 수 있다. 일일히 캡쳐할 필요가 없는 것이다.

![](https://images.velog.io/images/717lumos/post/9bc9f211-6943-47f4-972f-940f5aff20c0/2022-03-13-15-16-45.png)

**⑥ 기타**

* Views 창에서 Invert Z Axis를 누르면 z축 위아래가 반전된다. 우리가 흔히 z축은 +가 상방인데 여기는 +가 하방이다. 헷갈리면 바꿔놓는 것도 좋다.
* Rviz 창을 한 번 닫으면 우리가 지금까지 추가하고 변경했던 화면 설정들이 싹 사라진다. 이를 `*.rviz` 확장자로 저장해 두고두고 다시 불러올 수도 있다. File - Save Config (As) 를 눌러 저장하면 된다. 불러올 때는 File - Open Config이다.
* Views 창에서 Focal Point 위에 Yaw, Pitch가 있다. 마우스로 요리조리 움직이면 이 값이 바뀌는 것이 보인다. 화면 기울기를 설정하는데, rad 단위이다. 3.14면 180도, 1.57이면 90도이다. x, y만 있는 평면 직교 좌표계로 보고 싶다면 Yaw를 4.71, Pitch를 1.57 정도로 설정하면 된다.

![](https://images.velog.io/images/717lumos/post/8370ff8e-ccde-4502-8986-eb7ce306479f/2022-03-13-15-23-06.png)

>사실 백날 얘기해봐야 직접 이것저것 만져보기 전까지는 모른다. 노는 셈 치고 '이건 뭔가...'하고 눌러보자.

- - -

# Marker

Marker는 Rviz에서 시각화를 위해 쓸 수 있는 개체 종류 중 하나이다. 점, 선, 화살표 등 다양한 하위 종류를 가지고 있고 스크립트에 바로 입력해 Publish 할 수 있어 간단하게 무언가를 그리고 싶을 때는 이용하면 좋다.

Marker 하나가 Rviz 상에서 나타나는 개체 하나이다. 아래는 [ROS Wiki에 소개된 Marker들의 종류](http://wiki.ros.org/rviz/DisplayTypes/Marker)이다. 링크에 들어가면 어떻게 사용해야 하는지 예제도 있다.

![](https://images.velog.io/images/717lumos/post/69c7f2d0-69d6-473b-b158-b04257d4a5aa/(%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EC%BA%A1%EC%B3%90).png)

이런 Marker 하나하나를 리스트 형태로 담아 묶은 것이 MarkerArray이다.

- - -

# 토픽 및 메시지 타입
노드들에서 Marker 혹은 MarkerArray 타입으로 토픽을 Publish하면 rviz 실행 시 화면에 나타난다. 

[Marker](http://docs.ros.org/en/noetic/api/visualization_msgs/html/msg/Marker.html), [MarkerArray 메시지 파일](http://docs.ros.org/en/noetic/api/visualization_msgs/html/msg/MarkerArray.html)은 visualization_msgs에 있다. 따라서 `from visualization_msgs.msg import Marker, MarkerArray`로 불러와 사용해야 한다.

먼저 Marker의 메시지 타입을 자세히 살펴본다.

```
uint8 ARROW=0
uint8 CUBE=1
uint8 SPHERE=2
uint8 CYLINDER=3
uint8 LINE_STRIP=4
uint8 LINE_LIST=5
uint8 CUBE_LIST=6
uint8 SPHERE_LIST=7
uint8 POINTS=8
uint8 TEXT_VIEW_FACING=9
uint8 MESH_RESOURCE=10
uint8 TRIANGLE_LIST=11

uint8 ADD=0
uint8 MODIFY=0
uint8 DELETE=2
uint8 DELETEALL=3

std_msgs/Header header
string ns
int32 id
int32 type
int32 action
geometry_msgs/Pose pose
geometry_msgs/Vector3 scale
std_msgs/ColorRGBA color
duration lifetime
bool frame_locked

geometry_msgs/Point[] points
std_msgs/ColorRGBA[] colors

string text

string mesh_resource
bool mesh_use_embedded_materials
```

상단 'ARROW'부터'TRIANGLE_LIST'까지는 중간 즈음에서 보이는 `type`에 들어갈 값들이다. C++에서의 `#define ARROW 0`과 비슷한 의미라고 보면 된다. 같은 원리로 `action`에는 'ADD'부터 'DELETEALL'까지 들어갈 수 있다. 이들은 저 글자로 입력해도 되고 숫자로 직접 입력해도 된다.

`header`는 다른 메시지들에도 있는 말 그대로 '헤더' 데이터이다. 꼭 넣어야 하는 값은 `frame_id`로, 아래에서 더 자세히 살펴볼 것이다.

`ns`는 namespace로, 해당 마커의 이름을 지정한다. `id`는 마커의 ID 값으로, 실행되고 있는 Rviz 마커들 중 고유의 번호를 받아야 한다. 즉, 겹치면 안된다. `ns`는 겹쳐도 된다.

`type`은 Marker의 모양을 지정한다. 앞에서 본 바와 같이 이미 지정된 모양들이 있는데, 이름이 매우 직관적이라 따로 설명할 것은 없다. 'LINE_STRIP'과 'LINE_LIST'의 차이는 뒤에서 볼 것이며, 'TEXT_VIEW_FACING'는 그저 텍스트를 말한다.

`action`은 마커를 어떻게 할지를 지정한다. 가장 많이 쓰는 'ADD'는 해당 Marker를 화면에 표시하겠다는 뜻이다. 당연히 'DELETE'는 지우겠단 뜻이 된다.

`pose`는 Marker의 위치를, `scale`은 Marker의 크기를, `color`는 Marker의 색을 지정한다.

`points`, `colors`, `text` 등은 특정 Marker type에서만 지정하는 것들로, 점들의 집합, 색의 집합, 텍스트 데이터를 말한다.

MarkerArray 타입은 간단하다.
```
visualization_msgs/Marker[] markers
```
즉, 위에서 본 하나의 Marker 들을 리스트(배열)로 모은 것이다. 잘 와닿지 않는다면 맨 아래 순서 'MarkerArray 사용'에서 다시 다룰 것이니 그곳을 보면 된다.

- - -
# ROS 패키지 제작 및 스크립트 구조 작성
## ROS 패키지 제작
자신이 가진 catkin workspace에서(보통은 'catkin_ws'의 이름일 것이다) src 폴더 하에 새 패키지를 만들자. 필자는 'rviz_marker'의 이름의 패키지를 만들었다.
```bash
$ cd ~catkin_ws/src
$ catkin_create_pkg rviz_marker std_msgs rospy
```

만든 패키지의 src 폴더 하에 스크립트 파일을 만들어 넣자. 이름은 'rviz_marker.py'로 하겠다.

## 스크립트 구조 작성
스크립트 내용을 채워놓는다. 파이썬으로 ROS, Rviz 프로그래밍을 하기 위한 기본 틀을 갖춰놓는다.

```py
#!/usr/bin/env python
#-*- coding:utf-8 -*-

import rospy
from visualization_msgs.msg import Marker
        # Marker 메시지를 써야하므로 이를 선언함

rospy.init_node("rviz_marker")
marker_pub = rospy.Publisher("marker", Marker, queue_size=1)
    # Rviz에게 보낼 Marker 토픽. 변수 및 토픽 이름은 아래서 바꿀 예정임

while not rospy.is_shutdown():
    ### 실행 내용이 들어갈 부분 ###
    maker_pub.publish(###마커 객체###)
```

## 스크립트 파일 권한 부여
```bash
$ cd src        # 전체 경로: ~catkin_ws/src/rviz_marker/src
$ chmod +x rviz_marker.py
```

## launch 파일 작성
~~어디 넣어야 할지 몰라 일단 여기 넣는다~~
우리가 작성한 파일을 실행시키기 위해서는 터미널이 최소 3개가 필요하다. 마스터 노드를 구동시킬 `roscore`용 하나, 스크립트를 구동시킬 `rosrun`용 하나, 그리고 rviz를 작동시킬 `rviz`용 하나이다.

```bash
$ roscore   # 터미널1
$ rosrun rviz_marker rviz_marker.py # 터미널2
$ rviz  # 터미널3
```

터미널을 여러 개 켜는 것부터가 귀찮다. 이럴 때 필요한 건, lauch 파일이다. 패키지 내에 launch 폴더를 만들고 그 안에 `rviz_marker.launch` 파일을 만든다.

```bash
<launch>
    <node name="rviz_visualizer" pkg="rviz" type="rviz" required="true" args="-d $(find rviz_marker)/rviz/rviz_visualizer.rviz"/>
    <node name="rviz_marker" pkg="rviz_marker" type="rviz_marker.py" output="screen" />
</launch>
```
스크립트 실행 노드 부분은 알테니 각설하고, rviz만 보자. rviz 역시 하나의 노드이므로 첫 줄처럼 `<node>` 태그로 선언할 수 있다. 

노드 이름은 알아서 짓고, 패키지를 지정하는 `pkg`에는 `rviz` 패키지를 넣는다. 우리가 ROS를 설치할 때 함께 설치된 패키지이다. `arg`에는 rviz 설정 파일을 넣어주면 되는데, rviz 패키지와 다른 폴더에 있다면 위와 같이 경로를 지정해주면 된다. 

`$(find rviz_marker)`는 리눅스 명령어의 형태 중 하나로, `rviz_marker`라는 패키지를 찾아 해당 경로를 그 자리에 넣는다. 따라서 위 선언문은 `rviz_marker` 패키지 디렉터리 내 `rviz` 디렉터리에 있는 `rviz_visualizer.rviz` 파일을 불러오겠단 뜻이다. 

rviz 환경설정 파일은 확장명이 `*.rviz`로 끝나는데, rviz 실행 시에 보이는 화면 구성 전체를 저 파일이 저장하고 있다. 창의 크기, 띄워놓은 객체들과 그 상태, 카메라 뷰, focal point 등 모든 상태를 담고 있다.

해당 파일은 현재 만들어져있지 않다. 이 부분은 실습 첫 번째 부분에서 다시 설명하겠다.

- - -

## 메시지 작성
아래에서부터는 실행 내용, 즉 메시지 작성 부분을 넣는 법을 보겠다.

### 공통 부분
지금은 공통 부분을 먼저 설명한다. 아래 예시들은 이해를 위한 설명이므로 따라하지는 말고, 읽고 넘어가면 된다.
가장 먼저, 토픽에 담아 보낼 Marker 객체를 생성해야 한다.
```python
my_marker = Marker()
```

이제 메시지 내용을 채워볼 것이다. Marker의 `type`에 따라 달라지는 값들을 제외하고, 위에서 본 Marker.msg의 윗줄부터 순차적으로 채워본다.

가장 먼저, `header`이다. [std_msgs/Header.msg](http://docs.ros.org/en/api/std_msgs/html/msg/Header.html)에서 해당 메시지형에 대한 더 자세한 내용을 참고할 수 있다.
```
uint32 seq
time stamp
string frame_id
```
Header형에는 메시지마다 순차적으로 증가하는 `seq`와 메시지를 보낸 시각을 담을 `stamp`가 있는데, 적어도 지금은 안 쓰인다. 비워두고 Publish해도 문제가 없으므로 생략한다.

Rviz를 사용할 때 꼭 채워야 할 것은 `frame_id`이다. Marker가 보여질 프레임의 이름을 지정하는데, Rviz를 켜자마자 보이는 frame은 '/map'이었다. 이곳의 이름을 다른 것으로 바꾼다면 Rviz를 실행했을 때 좌측 창에서 frame 부분에 해당하는 이름을 입력하여 바꿔야 marker가 제대로 보인다.

할당은 아래와 같이 해준다.
```python
my_marker.header.frame_id = "/my_frame"
```

또는 이렇게도 할 수 있다. 물론 이렇게 쓰려면 `from std_msgs.msg import Header`로 메시지형을 불러와야 한다.
```python
header = Header()
header.frame_id = "/my_frame"
my_marker.header = header.
```

다음으론 `ns`와 `id`를 지정한다. `ns`는 Marker의 이름이니 본인이 알아볼 수 있는 이름으로 짓고, `id`는 겹치지만 않게 설정하면 된다.
```python
my_marker.ns = my_marker
my_marker.id = 1
```

`type`은 Marker의 종류(타입)을 지정한다. 이미 해당 타입이 어떻게 생겼는지는 위에서 본 바가 있다. 또한 ARROW부터 TRIANGLE_LIST 까지 숫자를 문자로 선언해주기도 했었다. 이를 활용해 할당하면 된다. `action`은 화면에 Marker을 '어떻게' 할 지를 결정한다. 위에서 보았듯 할당할 수 있는 값들은 미리 지정되어 있다.

여기서는 POINT 형을 ADD하는 것으로 해보겠다.

```python
my_marker.type = Marker.POINTS # 또는 my_marker.type = 8
my_marker.action = Marker.ADD # 또는 my_marker.action = 0
```

`pose`은 아래에서 더 자세히 보도록 하고, 다음 `scale` 부터 보자. 말 그대로 크기를 지정하는 부분으로, 자료형 [geometry_msgs/Vector3.msg](http://docs.ros.org/en/noetic/api/geometry_msgs/html/msg/Vector3.html)는 아래와 같이 생겼다.

```
float64 x
float64 y
float64 z
```

기본값은 (1, 1, 1)로 설정되어 있으며 단위계는 m이다. 참고로 Rviz 초기화면의 grid 격자가 1m 단위이다. `scale` 값의 설정은 type마다 다르다. 따라서 자세한 설정은 다음에 이어지는 예에서 보겠다.

`color`의 자료형인 `std_msgs/ColorRGBA`은 아래와 같은 형태를 띄고 있다. 공식 정의는 [std_msgs/ColorRGBA.msg](http://docs.ros.org/en/api/std_msgs/html/msg/ColorRGBA.html)을 본다. ~~사실 아래 내용이 전부라 볼 것도 없긴 하나, 경험하는 측면에서~~

```
float32 r
float32 g
float32 b
float32 a
```

빛의 삼원색인 RGB의 R, G, B 각각을 0 - 1 사이의 수로 할당한다. r=1, g=1, b=1이면 흰색이다. 지정하지 않으면 자동으로 0으로 여긴다. a는 alpha로 투명도를 의미한다. 지정이 되지 않으면 경고가 생기고 화면상에 보이지 않는다. 이 역시 0 - 1 사이의 수로 할당하며, 1로 갈수록 불투명해진다.

아래 예에서는 노란색을 할당해보겠다.

```python
my_marker.color.r, my_marker.color.g, my_marker.color.b = 1, 1, 0
my_marker.color.a = 1
```

또는 이렇게 선언할 수도 있다. 이 말도 지겹겠지만(~~이정도면 지겨워야 정상이다~~) 이렇게 쓰려면 `from std_msgs.msg import ColorRGBA`로 메시지형을 불러와야 한다.
```py
my_marker.color = ColorRGBA(1, 1, 0, 1)
```

다시 `pose`로 돌아간다. 해당 메시지형은 `geometry_msgs/Pose`로 되어 있으며, 공식 페이지 [geometry_msgs/Pose.msg](http://docs.ros.org/en/noetic/api/geometry_msgs/html/msg/Pose.html)에서 볼 수 있다.

```
geometry_msgs/Point position
geometry_msgs/Quaternion orientation
```

위와 같이 해당 메시지는 다시 `geometry_msgs/Point` 형의 `position`과 `geometry_msgs/Quaternion` 형의 `orientation`으로 이루어져 있다. [geometry_msgs/Point](http://docs.ros.org/en/noetic/api/geometry_msgs/html/msg/Point.html)는 ROS 코딩을 하다 보면 많이 보인다. 단순히 (x, y, z)형태로 위치 정보를 나타내는 한 점을 표시할 때 쓴다. [geometry_msgs/Quaternion](http://docs.ros.org/en/noetic/api/geometry_msgs/html/msg/Quaternion.html)은 x, y, z 축에 대한 회전운동(상태)을 표시할 때 쓰는 쿼터니언 식 표시이다. (x, y, z, w) 식으로 표시된다.

```
### geometry_msgs/Point.msg
float64 x
float64 y
float64 z

### geometry_msgs/Quaternion.msg
float64 x
float64 y
float64 z
float64 w
```

둘의 의미를 끼워맞추자면 `geometry_msgs/Pose`형인 `pose`는 Marker의 위치와 기울어진 정도를 담고 있다고 보면 되겠다. `scale`처럼 Marker type에 따라 어떻게 값을 할당하는지가 다르므로 할당은 일단 넘어가겠다.

이제부터는 Marker 몇 가지를 직접 만들어보겠다. Marker의 `type` 마다 달라지는 것에는 `type`, `pose`, `scale`, `points` 등이 있다. 이 값들을 채우는 방법을 볼 것이다.

### Marker: points
가장 먼저, 제일 쉬운 형태를 그려보겠다. POINTS는 말 그대로 '점'이다. 자료형이 배열로 되어 있으므로 0개 이상의 점들을 넣을 수 있다. 화면에 표시될 때는 작은 직육면체로 나온다.

Marker이름은 `rviz_points`로 하고 실습하겠다. 

```python
rviz_points = Marker()
rviz_points.header.frame_id = "/my_frame"
rviz_points.ns = points
rviz_points.id = 1

rviz_points.type = Marker.POINTS   #Marker.POINTS
rviz_points.action = Marker.ADD    #Marker.ADD

rviz_points.color = ColorRGBA(1, 1, 0, 1)
```

POINTS형에서의 `pose`는 제일 마지막에 설명하고 여기선 일단 넘어가겠다.

`scale`은 점의 크기를 지정한다. 점이 직육면체 형상으로 나온다고 했으니 x, y, z는 각 축으로의 크기를 말한다. Rviz 격자의 한 칸이 1m이므로 이를 감안해 크기를 지정한다.

```py
### 한 번에 할당하기: Vector3의 import 필요
rviz_points.scale = Vector3(0.2, 0.2, 0)

### 나누어 할당하기: 0으로 들어갈 값은 선언 안 해줘도 됨
rviz_points.scale.x = 0.2
rviz_points.scale.y = 0.2
rviz_points.scale.z = 0.0
```

POINTS 형에는 메시지 내용 중 `points`가 할당되어야 한다. 본인이 표시할 점(들)(의 위치)을 지정한다. 자료형이 `geometry_msgs/Point[]`이므로 `geometry_msgs/Point`형태의 점들을 담고 있는 리스트란 뜻이다. 해당 자료형은 위에서 본 바가 있으니 설명은 생략한다. 파이썬에서 리스트에 자료를 추가하는 방법과 동일하게 할당하면 된다. (1, 1, 0)에 점을 찍고 싶다면 아래와 같이 한다. Point의 import가 사전에 필요하다.(`from geometry_msgs.msg import Point`)

```py
### 한 번에 할당하기
rviz_points.points.append(Point(1, 1, 0))

### 나누어 할당하기: 0으로 들어갈 값은 선언 안 해줘도 됨
p = Point()
p.x = 1
p.y = 1
p.z = 0
rviz_points.points.append(p)
```

한 개가 아니라 여러 개를 동시에 넣을 수도 있다고 했으므로, 다른 점들을 넣고 싶다면 아래와 같이 한다. 여기 예에서는 (0, 0)에서부터 (5, 5)까지 넣어보겠다.

```py
### 한 번에 할당하기
for i in range(6):
    rviz_points.points.append(Point(i, i, 0))

### 나누어 할당하기: 0으로 들어갈 값(여기 예에서는 z)은 선언 안 해줘도 됨
for i in range(6):
    p = Point()
    p.x = i
    p.y = i
    #p.z = 0
    rviz_points.points.append(p)
```
여기서 주의할 것은, 파이썬의 객체 선언 및 작동 방식이다. 위 예에서 Point()의 선언을 반복할 때마다 다시 했는데, 반복문 밖에서 한 번 수행하고 안에서는 값만 바꾸면 되는 것 아닌가 할 수 있겠으나, 그렇게 되면 (0, 0), (1, 1), ... , (5, 5)이 들어가는 게 아니라 (5, 5), (5, 5), ..., (5, 5)이 들어간다. 값을 업데이트하는 대로 이미 리스트 내에 있는 값들까지 바뀌는 것이다.

아래는 잘못된 선언과 그 결과이다.
```py
#### 잘못된 선언
p = Point()
for i in range(0, 6):
    p.x = i
    p.y = i
    p.z = 0
    rviz_points.points.append(p)

#### 각 점을 확인하기 위한 print 구문
print("points: ")
for i in range(5):
    print("{0} point: [{1}, {2}, {3}]".format(i, rviz_points.points[0].x, rviz_points.points[0].y, rviz_points.points[0].z))
```

```
points: 
0 point: [5, 5, 0]
1 point: [5, 5, 0]
2 point: [5, 5, 0]
3 point: [5, 5, 0]
4 point: [5, 5, 0]
```

![](https://images.velog.io/images/717lumos/post/b16a170e-017c-432c-a30a-d54360fd7326/2022-03-12-20-37-43.png)

이제 완성된 메시지를 토픽에 넣어 publish 해보고 결과를 확인한다.
```py
marker_pub.publish(rviz_points)
```

아래는 이렇게 완성된 `rviz_marker.py` 전체 코드이다.
```py
#!/usr/bin/env python
#-*- coding:utf-8 -*-

import rospy
from visualization_msgs.msg import Marker
from std_msgs.msg import ColorRGBA
from geometry_msgs.msg import Point
from tf.transformations import quaternion_from_euler

rospy.init_node("rviz_marker")
marker_pub = rospy.Publisher("marker", Marker, queue_size=1)
text_pub = rospy.Publisher("text", Marker, queue_size=1)

while not rospy.is_shutdown():
    rviz_points = Marker()

    rviz_points.header.frame_id = "/my_frame"
    rviz_points.ns = "points"
    rviz_points.id = 1

    rviz_points.type = Marker.POINTS
    rviz_points.action = Marker.ADD

    rviz_points.color = ColorRGBA(1, 1, 0, 1)
    rviz_points.scale = Vector3(0.2, 0.2, 0)

    # rviz_points.points.append(Point(1, 1, 0))     # 점 하나만 넣기

    for i in range(0, 5):
        rviz_points.points.append(Point(i, i, 0))

    marker_pub.publish(rviz_points)
```

실행을 할 때는 일단 launch 파일 대신 하나하나 실행을 하도록 하겠다. 처음엔 어차피 rviz 파일이 없으니 이렇게 해야 한다. ~~제발 반드시~~ 각각의 3개의 창에서 아래의 명령어를 실행하자.

```bash
$ roscore   # 터미널1
$ rosrun rviz_marker rviz_marker.py # 터미널2
$ rviz  # 터미널3
```

![](https://images.velog.io/images/717lumos/post/bdf70a02-7e89-49f0-9d22-bab35e4b3a1f/2022-03-12-20-39-44.png)

Rviz가 잘 보인다. 이리저리 돌려가며 구경을 한 뒤에는 'File - Save Config As'를 눌러 우리가 만든 패키지 폴더 rviz_marker 안에 rviz라는 폴더를 만들고 그 안에 'rviz_visulizer.rviz'의 파일 명으로 저장한다.

![](https://images.velog.io/images/717lumos/post/31b75ad3-6c64-4dcf-8e17-9cf291c3a0fd/2022-03-12-21-19-14.png)

원래는 파일명과 경로를 이렇게 설정한 뒤에 launch 파일에 넣는 것인데, 이걸 먼저 하나 저걸 먼저 하나 잘 들어가기면 하면 된 것이다.

이제부터는 창 세 개를 켜지 않아도 된다. 모두 종료하고 아래 명령어를 실행해보자.
```bash
$ roslaunch rviz_marker rviz_marker.launch
```

그러면 아까 저장을 했던 바로 그 상태 그대로 rviz가 자동으로 실행이 되어 보인다.

이제 위에서 생략했던 `pose` 부분을 설명하겠다. 필수 지정이 아니라서 생략했었다.

`pose.position`은 points 의 시작점을 나타낸다. 

![](https://images.velog.io/images/717lumos/post/f8f8e459-4351-4a1a-b91f-77b74678143f/2022-03-12-20-02-53.png)

위 그림은 `pose.position`을 설정하지 않았을 때의 그림이다. 우리가 처음에 공부했던 대로 (0, 0)에서부터 (5, 5)까지 그대로 찍고 있다.

하지만 아래 코드를 하나 추가하고 다시 실행했을 때의 화면을 보자.

```py
rviz_points.pose.position = Point(-5, 0, 0)
```

![](https://images.velog.io/images/717lumos/post/0d0791a0-df0b-42a5-a427-0c5c59d27c4e/2022-03-12-20-04-47.png)

x, y가 1씩 증가하면서 점을 찍고는 있지만 시작점이 (0, 0)이 아니라 (-5, 0)이 되었다.

`pose.orientation`은 점의 자세상태를 나타낸다. 물리나 역학을 배우면 알겠지만 자세를 나타낼 때는 Roll, Pitch, Yaw로 각각 x, y, z 축의 자세를 표현할 수 있다. 이를 지정하는 것이다.

![](https://images.velog.io/images/717lumos/post/81bd1b6b-3f1c-412b-8a7c-efcbad84532d/2022-03-12-21-35-00.png)

![](https://images.velog.io/images/717lumos/post/1960786c-10a9-46b6-a920-7888d9879354/2022-03-12-20-23-10.png)

위 그림을 보면 알겠지만, (0, 0) ~ (5, 5)를 찍고 있던 점들이 Roll을 90도로 했더니, 즉 x축을 기준으로 90도를 돌렸더니 그대로 점이 돌아가 있다.

앞서 보았듯 해당 자료형은 쿼터니언 형식이다. 우리 머리로는 쿼터니언 값 x, y, z, w를 계산할 수 없다. 대신 매우 익숙한 Roll, Pitch, Yaw 형식은 쉽다. 따라서 아래처럼 변환 함수를 이용할 수 있다.

```py
### 상단에 추가적으로 선언
from geometry_msgs.msg import Quaternion
from tf.transformations import quaternion_from_euler

### 메시지 부분에 추가
q = quaternion_from_euler(1.57,0,0) # Roll 90도
rviz_points.pose.orientation = Quaternion(q[0], q[1], q[2], q[3])
```

`quaternion_from_euler`라는 함수는 rad 단위의 Roll, Pitch, Yaw 값을 받아 쿼터니언 형식으로 변환해 (0, 4) 형태의 리스트를 반환한다. 이 값은 차례대로 (x, y, z, w)이므로 Quaternion에 넣으면 된다.

### Marker: line strip, line list
다음으로 쉬운 자료형은 LINE_STRIP과 LINE_LIST이다. LINE_STRIP은 점들을 할당해주면 그 점들을 이은 하나의 선분을 그리고, LINE_LIST는 첫점과 끝점끼리 잇는 선분을 그린다. (0, 0), (1, 1), (2, 2), (3, 3), (4, 4), (5, 5)라고 하면 LINE_STRIP은 (0, 0)부터 (5, 5)까지 한 직선으로 점들을 이어 그리고, LINE_LIST은 (0, 0)과 (1, 1)을 잇는 선분 하나, (2, 2)과 (3, 3)을 잇는 선분 하나, 그리고 (4, 4)과 (5, 5)을 잇는 선분 하나 총 3개의 선분을 그린다.

POINT 쪽에서 필수 선언 부분은 어떻게 채워야 하는지 보았으니, 여기서는 필요한 부분만 발췌해 소개하겠다.

Marker가 2개이므로 publisher도 하나 더 선언해줘야 한다.
```py
marker_pub1 = rospy.Publisher("marker1", Marker, queue_size=1)
marker_pub2 = rospy.Publisher("marker2", Marker, queue_size=1)
```

```py
# LINE_STRIP
rviz_linestrip = Marker()

rviz_linestrip.header.frame_id = "/my_frame"
rviz_linestrip.ns = "linestrip"
rviz_linestrip.id = 2

rviz_linestrip.type = Marker.LINE_STRIP

rviz_linestrip.color.r = 1
rviz_linestrip.color.a = 1

# LINE_LIST
rviz_linelist = Marker()

rviz_linelist.header.frame_id = "/my_frame"
rviz_linelist.ns = "linelist"
rviz_linelist.id = 3

rviz_linelist.type = Marker.LINE_LIST

rviz_linelist.color.g = 1
rviz_linelist.color.a = 1
```

둘 모두 `scale`에서는 `scale.x`만 지정해주면 된다. 여기서는 선의 너비를 뜻한다.

```py
rviz_linestrip.scale.x = 0.2
rviz_linelist.scale.x = 0.2
```

사용될 점의 추가는 위에서 본 POINTS와 똑같은 방식으로 한다. (0, 0, 0)부터 (3, 3, 3)까지 해보겠다.

```py
for i in range(4):
    rviz_linestrip.points.append(Point(i, i, i))
    rviz_linelist.points.append(Point(i, i, i))
```

이제 publish해보자. 하나는 주석을 걸고 하나는 풀어가며 보거나, Rviz 좌측의 Marker의 체크박스를 풀고 체크해가면서 봐도 좋다.

![](https://images.velog.io/images/717lumos/post/2c0db840-ab86-4c6f-ade4-bfa99d4708dd/2022-03-12-21-06-01.png)

```py
marker_pub1.publish(rviz_linestrip)
marker_pub2.publish(rviz_linelist)
```

아래는 전체 코드이다. 본인은 색 지정을 한 번에 했다.
```py
#!/usr/bin/env python
#-*- coding:utf-8 -*-

import rospy
from visualization_msgs.msg import Marker
from std_msgs.msg import ColorRGBA
from geometry_msgs.msg import Point

rospy.init_node("rviz_marker")
marker_pub1 = rospy.Publisher("marker1", Marker, queue_size=1)
marker_pub2 = rospy.Publisher("marker2", Marker, queue_size=1)

while not rospy.is_shutdown():
    rviz_linestrip = Marker()

    rviz_linestrip.header.frame_id = "/my_frame"
    rviz_linestrip.ns = "linestrip"
    rviz_linestrip.id = 2

    rviz_linestrip.type = Marker.LINE_STRIP
    rviz_linestrip.action = Marker.ADD

    rviz_linestrip.color = ColorRGBA(1, 0, 0, 1)
    rviz_linestrip.scale.x = 0.2
    
    for i in range(4):
        rviz_linestrip.points.append(Point(i, i, i))

    rviz_linelist = Marker()

    rviz_linelist.header.frame_id = "/my_frame"
    rviz_linelist.ns = "linelist"
    rviz_linelist.id = 3

    rviz_linelist.type = Marker.LINE_LIST
    rviz_linelist.action = Marker.ADD

    rviz_linelist.color = ColorRGBA(0, 1, 0, 1)
    rviz_linelist.scale.x = 0.2

    for i in range(4):
        rviz_linelist.points.append(Point(i, i, i))

    marker_pub1.publish(rviz_linestrip)
    marker_pub2.publish(rviz_linelist)
```

![](https://images.velog.io/images/717lumos/post/a4af6bcd-76f2-4701-8c16-c4e418db9208/2022-03-12-20-53-56.png)

![](https://images.velog.io/images/717lumos/post/7a68adcb-811d-4720-9ee7-790f83789521/2022-03-12-21-01-13.png)

둘을 비교해보면 LINE_STRIP은 하나로, LINE_LIST는 두 개 씩 쌍으로 선을 그리는 것을 볼 수 있다.

방금 둘을 띄웠을 때, 위 rviz 메뉴 사진과 같이 Warn 상태를 띄운다. 오류 내용을 보면 `quaternion`을 초기화하지 않았다고 한다. `pose.orientation`이 지정되지 않았다고 말하는 내용이다. 사실 그리는 자체에는 상관이 없으나 저 색이 맘에 안드니 선언 까짓거 해주자.

```py
### 방법1: w를 1로 둔다.
객체.pose.orientation.w = 1

### 방법2: Roll, Pitch, Yaw를 직접 지정해 넣는다.
q = quaternion_from_euler(0,0,0)
객체.pose.orientation = Quaternion(q[0], q[1], q[2], q[3])
```
![](https://images.velog.io/images/717lumos/post/6c6f033a-64d8-4677-8c27-dd1977471a51/2022-03-12-21-03-59.png)

### Marker: text
'TEXT_VIEW_FACING'이라는 이름의 타입이지만 특별할 것 없이 그냥 글자를 출력하는 Marker 이다.

앞에서는 ColorRGBA를 쓰지 않고 일일히 지정했으나, 여기서는 r, g, b를 모두 써야 하는 흰색을 지정하기 위해 ColorRGBA를 import해 쓰겠다.

```python
rviz_text = Marker()
## 공통부분은 생략 ##
rviz_text.type = TEXT_VIEW_FACING
rviz_text.color = ColorRGBA(1, 1, 1, 1)
```

TEXT_VIEW_FACING의 크기로는 `scale.z`만 지정하면 된다. 글자 세로 크기를 말한다. 위치는 `pose.position`으로 한다. 글자의 가운데 위치이다.

```py
rviz_text.scale.z = 0.5
rviz_text.text = "Hello Rviz!"
rviz_text.pose.position = Point(2, 1, 0)
```

바로 전체 소스코드로 넘어가겠다.
```py
#!/usr/bin/env python
#-*- coding:utf-8 -*-

import rospy
from visualization_msgs.msg import Marker
from std_msgs.msg import ColorRGBA
from geometry_msgs.msg import Point

rospy.init_node("rviz_marker")
text_pub = rospy.Publisher("text", Marker, queue_size=1)

while not rospy.is_shutdown():
    text = Marker()
    text.header.frame_id = "/my_frame"
    text.ns = "text"
    text.id = 4

    text.type = Marker.TEXT_VIEW_FACING
    text.action = Marker.ADD

    text.color = ColorRGBA(1, 1, 1, 1)
    text.scale.z = 0.5
    text.text = "Hello Rviz!"
    text.pose.position = Point(2, 1, 0)

    text_pub.publish(text)
```

![](https://images.velog.io/images/717lumos/post/7ec0c663-20d1-463a-8e88-2437ce5401c0/2022-03-12-21-12-43.png)

### Marker: arrow
말 그대로 화살표를 말한다. 3D이므로 원통형의 화살표가 나온다. 

> 사실 인터넷에 Rviz에 대한 자료와 예시 코드가 잘 없어서 일일히 하나하나 바꿔보고 알게 된 내용이다... 가장 고생을 많이 한 녀석이 ARROW이다.

```python
## 공통부분은 생략 ##
rviz_arrow = Marker()
rviz_arrow.ns = "arrow"
rviz_arrow.id = 5
rviz_arrow.type = Marker.ARROW
```

벡터의 개념을 떠올리면, 화살표를 그리는 방법을 두 가지로 표현할 수 있음을 알게 된다.

* ① 첫 점과 끝 점 지정하기
* ② 시작점과 방향 지정하기

①의 경우에는 벡터의 두 좌표만 잡아주면 알아서 방향과 크기가 나온다. 무엇이 시작이고 무엇이 끝인지만 알려주면 된다. ②의 경우에는 벡터가 크기와 방향이 있다는 성질 중 '방향'에 집중한다. 각 축으로 얼마나 돌아가있나를 알려주면 된다.

이처럼 Rviz 상에서도 화살표의 크기와 방향을 지정하는 방법이 두 가지가 있다.

**① 화살표의 첫 점과 끝 점 지정하기**

화살표에는 시작점과 끝점이 있고, 끝점에는 화살표 머리가 존재한다. 시작점과 끝점은 `points`에 차례대로 입력한다. 즉, `points`의 0번 인덱스가 시작점, 1번 인덱스가 끝점을 가리킨다. 이렇게 되면 화살표의 크기와 방향이 동시에 지정된 셈이다.

```py
rviz_arrow.points.append(Point(0, 0, 0)) ### 시작점
rviz_arrow.points.append(Point(3, 0, 3)) ### 끝점
```

우리는 3D 그래픽 상으로 볼 것이므로 화살표 머리의 크기과 몸통의 굵기도 지정할 수 있다. 이들은 `scale`에서 지정한다. `scale`의 자료형은 Vector3로 (x, y, z) 형태로 나타난다. 각각이 무엇을 뜻하는지 알기 위해 극단적인 상황을 예로 들었다. Rviz 상의 격자가 1m 단위임을 상기하고 아래 그림을 보자.

![](https://images.velog.io/images/717lumos/post/44da45fb-eb68-4381-a8a8-50949e7670d5/2022-03-13-09-00-31.png)

대번에 알 수 있듯, x는 화살표 몸통의 굵기, y는 화살표 머리의 지름, z는 화살표 머리의 길이이다.

```py
rviz_arrow.scale.x = 몸통 굵기
rviz_arrow.scale.y = 머리 지름
rviz_arrow.scale.z = 머리 길이
```

z는 0이어도 자동 지정되지만 x나, y가 0이면 당연히 모양이 기괴해지면서 Rviz도 Warn(`Scale contains 0.0 in x, y or z.`)을 띄운다.

![](https://images.velog.io/images/717lumos/post/f65426d6-81b5-4a81-ae4b-fbd05b0844ee/2022-03-13-09-01-21.png)![](https://images.velog.io/images/717lumos/post/30558195-72c8-4a60-a3ba-d6d87c955d34/2022-03-13-08-49-11.png)![](https://images.velog.io/images/717lumos/post/a1bd4534-c736-477a-b961-5eeb5fd3b666/2022-03-13-08-50-59.png)

이제는 감을 다 잡았겠지만 다시 알려주면, scale의 선언 방식은 두 가지로 할 수 있다. 자료형을 import해서 쓰거나 일일히 할당하거나.

```py
### 한 번에 할당하기: Vector3의 import 필요
rviz_arrow.scale = Vector3(0.2, 0.4, 0)

### 나누어 할당하기: 0인 값은 할당하지 않아도 됨
rviz_arrow.scale.x = 0.2
rviz_arrow.scale.y = 0.4
# rviz_arrow.scale.z = 0
```

다만 이 때도 LINE들처럼 orientation을 지정하지 않으면 Warn을 발생시키는데, 그때와 마찬가지로 w를 0으로 주거나 아예 roll, pitch, yaw를 지정하고 넣어줘도 된다.

또한 POINTS에서 보았듯이 `pose.position`에서 (x, y, z) 좌표를 지정해주면 화살표의 시작점이 움직인다. `pose.position`=(1, 1, 0)이고 화살표의 첫 점과 끝 점이 각각 (0, 0, 0), (2, 2, 0)이었다면 실제 화살표는 (1, 1, 0)에서 (3, 3, 0)으로 간다.

![](https://images.velog.io/images/717lumos/post/702ffde6-96dd-4cdc-99cf-3c58f2de7297/2022-03-13-09-58-31.png)

또한 POINTS에서와 마찬가지로 `pose.orientation`으로 화살표를 돌릴 수도 있다. 원리는 같다. 첫 점과 끝 점이 각각 (0, 0, 0), (2, 2, 0)일 때 Roll=90으로 하면 x축을 기준으로 90도 돌아간 화살표를 그린다.

![](https://images.velog.io/images/717lumos/post/0ecad096-fa83-4f5a-a3b1-b3e526713f9d/2022-03-13-10-00-19.png)

근데 이럴거면 point를 두 개 지정하는 의미가 잘 없어서 굳이 position과 orientation을 쓰지는 않을 것 같다.

**② 화살표의 시작점과 방향 지정하기**
벡터의 경우 크기와 방향이 있고, 우리는 시작점까지 추가로 필요하다. 시작점은 POINTS의 경우에서처럼 `pose.position`에서 지정한다. 크기는 `scale`에서 지정한다. 방향도 POINTS에서처럼 `pose.orientation`에서 표현한다.

가장 간단하게 넣을 수 있는 시작점부터 지정해보자. 변화를 잘 알아보기 위해 시작점을 (1, 1, 0)으로 하겠다.

```py
rviz_arrow.pose.position = Point(1, 1, 0)
```

그 다음으로는 화살표의 크기이다. 여기서는 화살표 머리의 크기 역시 함께 지정한다. ①에서도 화살표 크기에 관해 지정할 때 `scale`을 썼는데 거기서와는 의미하는 바가 각각 다르다. ~~이런...~~ 역시 극단적인 상황을 가정하고 알아보자.

![](https://images.velog.io/images/717lumos/post/0ada5e93-29a5-4bf9-81e3-dd2253dfd288/2022-03-13-09-10-17.png)![](https://images.velog.io/images/717lumos/post/0bad5c5d-d4c9-49bb-a9b1-a238bfdbd0ec/2022-03-13-09-13-54.png)

정리하자면, `scale` Vector3형의 x는 머리를 포함한 화살표 전체 길이, y는 화살표의 너비(가로 지름), z는 화살표의 높이(세로 지름)을 뜻한다. 반지름이 아닌 지름이다!

```py
### 한 번에 할당하기: Vector3의 import 필요
rviz_arrow.scale = Vector3(2, 1, 1)

### 나누어 할당하기
rviz_arrow.scale.x = 2
rviz_arrow.scale.y = 1
rviz_arrow.scale.z = 1
```

이제 마지막으로 화살표의 방향을 나타낼 `pose.orientation`이다. POINTS에서도 봤지만 해당 자료형인 Quaternion은 개체의 자세 정보를 담고 있으며 쿼터니안 형식이다. 그 말인 즉 위에서처럼 변환 함수를 쓰는 게 속 편하다.

```py
### 상단에 추가적으로 선언
from geometry_msgs.msg import Quaternion
from tf.transformations import quaternion_from_euler

### 메시지 부분에 추가
q = quaternion_from_euler(Roll값, Pitch값, Yaw값)
rviz_arrow.pose.orientation = Quaternion(q[0], q[1], q[2], q[3])
```

화살표의 길이 방향이 `pose.orientation`의 x축이다. 따라서 roll은 화살표의 길이 방향으로 돌돌 회전시킨다. pitch는 머리를 y축을 중심으로 돌린다. 우리가 아는 z축은 +를 해주면 상방향으로 돌아가야 하지만, Rviz에서는 아래쪽으로 돌아간다. yaw는 머리를 z축을 중심으로 돌린다. 각각을 90도씩 돌려본 그림은 아래와 같다.

![](https://images.velog.io/images/717lumos/post/190b891b-aea7-467b-85c4-b10984ec0a4b/2022-03-13-09-18-33.png)![](https://images.velog.io/images/717lumos/post/e41309be-7028-4591-b25b-24fc7ed1f04a/2022-03-13-09-20-16.png)![](https://images.velog.io/images/717lumos/post/0826ea5d-2f8f-4491-8ce0-0df604b51154/2022-03-13-09-21-11.png)

보면 알겠지만, 아예 화살표의 입력 값부터 자세 정보로 들어오지 않는 이상 point 두 개를 쓰는 게 편하다. 그 방식으로 전체 코드를 아래와 같이 구성할 수 있다.

```py
#!/usr/bin/env python
#-*- coding:utf-8 -*-

import rospy
from visualization_msgs.msg import Marker
from std_msgs.msg import ColorRGBA
from geometry_msgs.msg import Point, Vector3

rospy.init_node("rviz_marker")
marker_pub = rospy.Publisher("marker", Marker, queue_size=1)

while not rospy.is_shutdown():
    rviz_arrow = Marker()

    rviz_arrow.header.frame_id = "/my_frame"
    rviz_arrow.ns = "arrow"
    rviz_arrow.id = 5

    rviz_arrow.type = Marker.ARROW
    rviz_arrow.action = Marker.ADD

    rviz_arrow.color = ColorRGBA(0, 0, 1, 1)
    rviz_arrow.scale = Vector3(0.2, 0.4, 0)

    rviz_arrow.pose.orientation.w = 1

    rviz_arrow.points.append(Point(0, 0, 0))
    rviz_arrow.points.append(Point(3, 2, -1))   # z 축이 (-)여야 위로 간다.

    marker_pub.publish(rviz_arrow)
```

![](https://images.velog.io/images/717lumos/post/e27600a0-9101-4492-b0f2-53d57d843903/2022-03-13-10-04-15.png)

- - -

# 여러 Marker 사용하기

위에서는 Marker 하나하나를 보았다. 여러 Marker 들을 한 번에 publish해서 한 화면에 보겠다.

난수를 추출해 점 10개를 찍고, 첫 점과 끝점을 이은 선분 하나와, 그 두 점의 순서를 표시하는 텍스트, 그리고 원점에서부터 각각 그 두 점까지 화살표를 그린다.

![](https://images.velog.io/images/717lumos/post/8c5f448f-f20a-4133-a6f8-9ec61e94999e/2022-03-13-10-50-23.png)

```py
#!/usr/bin/env python
#-*- coding:utf-8 -*-

import rospy, random
from visualization_msgs.msg import Marker
from std_msgs.msg import ColorRGBA
from geometry_msgs.msg import Point, Vector3

rospy.init_node("rviz_marker")
points_pub = rospy.Publisher("points", Marker, queue_size=1)
arrow1_pub = rospy.Publisher("arrow1", Marker, queue_size=1)
arrow2_pub = rospy.Publisher("arrow2", Marker, queue_size=1)
linestrip_pub = rospy.Publisher("linestrip", Marker, queue_size=1)
text1_pub = rospy.Publisher("text1", Marker, queue_size=1)
text2_pub = rospy.Publisher("text2", Marker, queue_size=1)

points = Marker()

points.header.frame_id = "/my_frame"
points.ns = "points"
points.id = 1

points.type = Marker.POINTS
points.action = Marker.ADD

points.color = ColorRGBA(1, 1, 0, 1)
points.scale = Vector3(0.2, 0.2, 0)

for i in range(0, 10):
    x = random.randint(-5, 5)
    y = random.randint(0, 5)
    points.points.append(Point(x, y, 0))


linestrip = Marker()

linestrip.header.frame_id = "/my_frame"
linestrip.ns = "linestrip"
linestrip.id = 2

linestrip.type = Marker.LINE_STRIP
linestrip.action = Marker.ADD

linestrip.color = ColorRGBA(1, 0, 0, 1)
linestrip.scale.x = 0.2

linestrip.pose.orientation.w = 1

linestrip.points.append(points.points[0])
linestrip.points.append(points.points[9])


text1 = Marker()
text2 = Marker()

text1.header.frame_id = "/my_frame"
text2.header.frame_id = "/my_frame"

text1.ns = "text1"
text2.ns = "text1"

text1.id = 3
text2.id = 4

text1.type = Marker.TEXT_VIEW_FACING
text2.type = Marker.TEXT_VIEW_FACING

text1.action = Marker.ADD
text2.action = Marker.ADD

text1.color = ColorRGBA(1, 1, 1, 1)
text2.color = ColorRGBA(1, 1, 1, 1)

text1.scale.z = 0.4
text2.scale.z = 0.4

text1.text = "1st"
text2.text = "10th"

text1.pose.position = Vector3(points.points[0].x, points.points[0].y + 0.3, 0)
text2.pose.position = Vector3(points.points[9].x, points.points[9].y + 0.3, 0)
    

arrow1 = Marker()
arrow2 = Marker()

arrow1.header.frame_id = "/my_frame"
arrow2.header.frame_id = "/my_frame"

arrow1.ns = "arrow1"
arrow2.ns = "arrow2"

arrow1.id = 5
arrow2.id = 6

arrow1.type = Marker.ARROW
arrow2.type = Marker.ARROW

arrow1.action = Marker.ADD
arrow2.action = Marker.ADD

arrow1.color = ColorRGBA(0, 0, 1, 1)
arrow2.color = ColorRGBA(0, 1, 0, 1)

arrow1.scale = Vector3(0.2, 0.4, 0.5)
arrow2.scale = Vector3(0.2, 0.4, 0.5)

arrow1.pose.orientation.w = 1
arrow2.pose.orientation.w = 1

arrow1.points.append(Point(0, 0, 0))
arrow1.points.append(points.points[0])

arrow2.points.append(Point(0, 0, 0))
arrow2.points.append(points.points[9])

while not rospy.is_shutdown():
    points_pub.publish(points)
    linestrip_pub.publish(linestrip)
    text1_pub.publish(text1)
    text2_pub.publish(text2)
    arrow1_pub.publish(arrow1)
    arrow2_pub.publish(arrow2)
```
- - -

# MarkerArray 사용하기
위에서는 각 Marker 하나 당 Publisher를 하나를 썼다. Marker의 수가 적다면 상관이 없겠지만 6개만 되어도 Publisher가 6개가 되어 복잡하다 느낄 수 있다. 하여 Marker 들을 하나로 묶은 MarkerArray를 쓰는 법을 소개한다.

이해가 쉽도록 예를 들겠다. 한 팀에는 3명의 팀원이 있고, 각자는 국어, 영어, 수학 점수를 가지고 있다고 하자. `이름 = [국어 점수, 영어 점수, 수학 점수]`로 한 사람을 표기한다고 할 때 한 팀은 `팀 = [갑, 을, 병]` 형태가 될 것이다.

Marker 역시 동일하다. ARROW 3개를 엮는다고 하면 `마커 배열 = [화살표1, 화살표2, 화살표3]` 형태이고, 각기 다른 Marker를 엮는다고 하면 `마커 배열 = [포인트1, 포인트2, 화살표1, 라인리스트1, 화살표2, ...]` 식이 된다.

위에서 보았듯이 MarkerArray 형에는 markers라는 이름의 Marker들의 배열이 있다. 그렇다면 선언은 `MarkerArray_Name.markers.append(Marker_Name)`식으로 하면 된다.

퍼블리셔 선언은 `Publisher_Name = rospy.Publisher('Topic_Name', MarkerArray)`의 형태가 되며, 퍼블리시는 `Publisher_Name.publish(MarkerArray_Name)`이 된다.

```py
#!/usr/bin/env python
#-*- coding:utf-8 -*-

import rospy
from visualization_msgs.msg import Marker, MarkerArray
        # Marker, MarkerArray 메시지를 써야하므로 이를 선언함

MarkerArray_publisher = rospy.Publisher("marker", MarkerArray, queue_size=1)
    # Rviz에게 보낼 Marker 토픽

MarkerArray_name = MarkerArray()

### 실행 내용이 들어갈 부분

MarkerArray_name.markers.append(Marker_Name)    #Marker를 배열에 추가

MarkerArray_publisher.publish(MarkerArray_name)
```

앞서 사용했던 전체 코드에서 POINTS는 Marker 하나로 두고, LINE_LIST와 ARROW들을 한 MarkerArray로, TEXT들도 한 MarkerArray로 바꿔보겠다. 중복된 부분은 생략한다.

```py
### MarkerArray 메시지 import 추가
from visualization_msgs.msg import Marker, MarkerArray

### publisher 수정
points_pub = rospy.Publisher("points", Marker, queue_size=1)
line_arrow_pub = rospy.Publisher("line_arrow", MarkerArray, queue_size=1)
text_pub = rospy.Publisher("text", MarkerArray, queue_size=1)

### Marker 및 MarkerArray 선언
points = Marker()
line_arrow = MarkerArray()
text = MarkerArray()

### Marker 선언은 완전히 동일

### MarkerArray에 Marker를 추가함
line_arrow.markers.append(linestrip)
line_arrow.markers.append(arrow1)
line_arrow.markers.append(arrow2)
text.markers.append(text1)
text.markers.append(text2)

while not rospy.is_shutdown():
    ### Publish
    points_pub.publish(points)
    line_arrow_pub.publish(line_arrow)
    text_pub.publish(text)
```

실행을 해보면, Marker 형이 아닌 MarkerArray 형으로 토픽을 받고 있으며, namespace에 여러 개의 Marker들이 들어가 있는 것을 볼 수 있다.

![](https://images.velog.io/images/717lumos/post/e1ff7561-4831-4ca3-8688-8a4d8e778d28/2022-03-13-14-49-19.png) ![](https://images.velog.io/images/717lumos/post/0cd1179e-7074-4553-8a2b-90529dbe153f/2022-03-13-14-48-16.png)

- - -

# 후기

Marker의 처음부터 끝까지 소개하느라 글이 길었다. 더군다나 Marker 하나 당 설정해줘야 하는 값이 너무 많아 코드도 길었다.

필자는 이렇게 길어지는 것이 싫어 아예 Python 모듈 스크립트를 하나 만들어두고 Rviz Marker 하나를 클래스로 선언했다. 그리고 쓸 때는 모듈을 import해서 쓰고 있다. 기회가 된다면 해당 코드 역시 올려 리뷰하도록 하겠다.