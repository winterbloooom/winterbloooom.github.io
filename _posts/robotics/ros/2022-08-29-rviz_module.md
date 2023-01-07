---
title:  "[Rviz] Rviz 시각화하기: 시각화 모듈 개발"
excerpt: "Rviz 간단 사용을 위한 시각화 모듈 개발"

categories:
  - Robotics
  - ROS
tags:
  - Robotics
  - ROS

last_modified_at: 2022-08-29T19:10:00-05:00
order: 11
feature: true
---

Rviz의 기본적 사용법 및 다양한 Marker의 종류는 [이전 포스팅](https://winterbloooom.github.io/ros/ros-rviz_marker/)에서 볼 수 있습니다. 해당 내용을 먼저 보길 권합니다.
{: .notice--info}

# 모듈 개발의 배경
<strong>Rviz는 ROS 프로그래밍에 굉장히 유용한 도구</strong>로, 3D 시각화를 쉽게 하기 위하여 개발되었다. 사용법이 간단하고 다양한 marker들이 구비되어 있어 필자 역시 애용했다.

다만 마커 하나를 만드는 데 많은 인수를 일일히 전달해야 하고, 그렇게 되면 코드가 매우 길어지는 문제가 있었다. 이에 마커를 만드는 모듈을 만들어 한두 줄의 코드로도 간단히 마커를 만들어 사용할 수 있게 하였다. <strong>2차원 시각화를 중심으로 개발했으며, 간단한 변경으로 3차원 활용도 가능하다.</strong>

# 소스코드 및 사용법
모듈의 소스코드는 필자의 GitHub Repository [rviz_template](https://github.com/winterbloooom/rviz_template)에 있다.

ROS melodic (18.04)와 Python 2.7 버전을 사용했다.
{: .notice--info}

## Module
모듈은 `src/rviz_visualizer.py`에 구현되어 있다. 해당 내용을 간단히 살펴보자.

```py
def basic_setting(name, id, color_r, color_g, color_b, color_a=255):
    """make Marker object with basic settings
    Args:
        * name (str) : Marker name. It can share same name with others. (마커의 이름이며, 다른 마커와 중복될 수 있음.)
        * id (int) : Marker id. It should be unique. (마커의 아이디이며, 각 마커마다 고유한 숫자가 부여되어야 함.)
        * color_r, color_g, color_b (int) : Marker color in RGB format (0 ~ 255) (마커의 RGB 색을 0~255 범위로 표현함.)
        * color_a (int) : Transparency (0 ~ 255) (마커의 투명도를 0~255 범위로 표현함.)
    Returns:
        marker (Marker): Marker object with basic settings (기본 설정을 담은 마커를 만들어 반환함.)
    Notes:
        * set frame_id, namespace, id, action, color, orientation (기본 설정에는 프레임 아이디, 이름, 마커 아이디, 동작, 색, 위치를 포함함.)
        * ColorRGBA는 0~1사이 값을 사용하므로 편의상 0~255 단위로 입력받아 여기서 255로 나누어줌
    """
    marker = Marker()
    marker.header.frame_id = "/map"
    marker.ns = name
    marker.id = id
    marker.action = Marker.ADD
    marker.color = ColorRGBA(color_r / 255.0, color_g / 255.0, color_b / 255.0, color_a / 255.0)
    marker.pose.orientation.w = 1.0

    return marker
```

위 함수 `basic_setting()`은 모든 마커가 공통값으로 가지는 값(fram id, namespace, id, action, color, orientation)과, 반드시 포함되어야 하는 동일한 인자(color)의 내용을 설정한다. 기본 동작은 `ADD`로, 해당 마커를 화면에 표시한다. 만약 동일한 id를 가진 마커를 삭제하고 싶다면, 구현되어 있는 또다른 함수 `del_mark()`를 사용한다.


마커를 만드는 함수는 마커의 종류별로 구현되어 있다. 
* POINT형: `point_rviz()`, `points_rviz()`
* ARROW형: `arrow_rviz()`
* TEXT_VIEW_FACING형: `text_rviz()`
* LINE_LIST: `linelist_rviz()`
* CYLINDER: `cylinder_rviz()`

대표적으로 `linelist_rviz()`의 구현은 아래와 같다.

```py
def linelist_rviz(name, id, lines, color_r=0, color_g=0, color_b=0, color_a=255, scale=0.05):
    """make a Line List Marker (라인 리스트 마커를 만들어 반환함)
    Args:
        name (str) : Marker name. It can share same name with others
        id (int) : Marker id. It should be unique.
        lines (list) : set of lines' each end positions. [[begin_x, begin_y], [end_x, end_y], [begin_x, begin_y], [end_x, end_y], ...]
        color_r, color_g, color_b (int) : Marker color in RGB format (0 ~ 255)
        color_a (int) : Transparency (0 ~ 255)
        scale (float) : thickness of Line List in meter
    Returns:
        marker (Marker): Line List Marker object
    """
    marker = basic_setting(name, id, color_r, color_g, color_b, color_a)
    marker.type = Marker.LINE_LIST
    marker.scale.x = scale
    for line in lines:
        marker.points.append(Point(line[0], line[1], 0))

    return marker
```

모든 마커 생성 함수에서 마커의 이름(`name`)과 ID(`id`), 색(`color_r`, `color_g`, `color_b`, `color_a`)을 기본적으로 지정해야 하며, 마커마다 필요한 정보(점의 목록, 두께, 크기 등)을 인자로 전달한다. 각 함수는 Marker 형의 한 마커를 반환한다.


만들어진 마커를 하나의 MarkerArray로 만들거나(`marker_array_rviz()`), 이미 만들어진 MarkerArray에 새 마커를 추가하는 함수(`marker_array_append_rviz()`)도 있으니 참고한다.


## Example
해당 모듈을 사용하는 예시를 `src/usage_example.py`에 나타냈다.

MarkerArray 형으로 publish를 하면 각 marker를 일일히 publish하는 것보다 간단해진다. 따라서 예시에서도 하나의 MarkerArray에 담아 한 번에 publish한다. 이를 위하여 Publisher를 정의했다.

```py
rviz_pub = rospy.Publisher("/visual_rviz", MarkerArray, queue_size=0)
```

모듈의 함수를 사용하여 마커를 만드는 예시를 보자. 아래는 위에서 보였던 `linelist_rviz()`를 사용하여 Line List를 만든다. 이름과 ID를 부여하고, Line List로 만들 위치와 색상, 크기값을 부여했다.

```py
line_points = [[-1, -1], [-2, -2], [-3, -3], [-4, -3], [-5, -3], [-6, -3]]
linelist = visual.linelist_rviz(
    name="linelist",
    id=ids.pop(),
    lines=line_points,
    color_r=203,
    color_g=33,
    color_b=237,
    scale=0.2,
)
```

만들어진 각 마커들(여기서는 `point`, `linelist`, `cylinder` 등으로 마커 인스턴스의 이름을 지었다)을 하나의 리스트에 담아 MarkerArray로 만들었다.

```py
all_markers = visual.marker_array_rviz([point, points, arrow, text, linelist, cylinder])
```

그리고 해당 MarkerArray를 publish 한다.

```py
rviz_pub.publish(all_markers)
```

더 자세한 구현은 코드를 직접 참고하고, 예제를 직접 수정/실행해보길 바란다.

## Run
해당 예제를 실행해보는 방법은 두 가지가 있다.

### 1. roslaunch 사용

`launch/example.launch` 파일은 마커를 생성하는 노드(`visual_rviz_node`)와 이를 subscribe해 시각화를 하는 rviz 노드(`rviz_node`)를 실행하고, 노드 관계를 표현하는 rqt graph를 작동시킨다. 한 번에 작동하고 싶다면 해당 launch 파일을 사용하며, 다른 프로젝트에 이용할 때도 참고하면 좋다.

해당 launch 파일에는 rviz 설정파일(`rviz/rviz_config.rviz`)을 불러와 실행하는 내용도 포함하고 있다. 

> 본인만의 rviz 설정파일을 만들고 실행시켜보길 바란다. 매 실행시마다 환경설정을 새로 하는 번거로움을 줄여준다

```
roslaunch rviz_template example.launch
```

### 2. rosrun 사용

rosrun을 사용해 각 노드를 따로 작동시킬 수도 있다. 

> roslaunch는 아래 명령어들을 xml 형식으로 바꾼 것일 뿐임을 상기하자. 

아래 명령어 각각을 서로 다른 터미널에서 실행하자.

```
roscore
rosrun rviz_template usage_example.py
rviz -d [rviz 파일 경로]/rviz_config.rviz
```

아래 사진은 `src/usage_example.py`를 실행했을 때의 Rviz 화면과 rqt graph이다.

![rviz_example](https://user-images.githubusercontent.com/69252153/187183749-7a044d91-f22b-47e3-98ec-a88bfe73281f.jpg)

![rqt_graph](https://user-images.githubusercontent.com/69252153/187183845-54d20af6-a02b-4c0b-bcd7-150df54a9251.jpg)
