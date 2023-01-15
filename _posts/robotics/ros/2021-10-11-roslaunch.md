---
title:  "[Tutorial] roslaunch의 사용법 및 XML"
excerpt: "ROS Tutorial 5: XML 간단 문법과 roslaunch 사용"

categories:
  - Robotics
  - ROS
tags:
  - Robotics
  - ROS
date: 2021-10-11
last_modified_at: 2021-10-11
order: 5


---


이번 포스팅에서는 <span style="color: green">**한 번의 명령으로 여러 개의 노드를 동시에 실행**</span>할 수 있는 roslaunch 명령과, 그 명령을 수행하는 `.launch` 파일의 작성을 알아본다.

실제 응용 시에는 사용하는 센서들의 launch 파일이나 노드를 하나의 launch 파일에 포함시켜놓고, 그 하나만 실행시켜도 센서부터 알고리즘까지 한번에 실행될 수 있도록 한다. `main_node.launch` 하나만 실행시킴으로써 GPS, IMU, LiDAR와 이에 관한 스크립트 모두를 실행시키는 것이다.

- - -

# 💻 명령어 roslaunch
* `rosrun`
  * <span style="color: green">**하나의 노드**</span>를 실행시킨다.
  * <span style="color: green">**`roscore` 명령어를 실행한 뒤**</span>에 다른 터미널에서 따로 실행해야 한다.
* `roslaunch`
  * <span style="color: green">**`roscore` 없이 하나 이상의 정해진 노드**</span>를 실행시킨다.
  * 패키지 파라미터, 노드 이름을 변경시킬 수 있거나, 노드 네임스페이스 설정, ROS_ROOT 및 ROSPACKAGE_PATH 설정, 환경 변수 설정 등 옵션을 줄 수 있다
* <span style="color: green">**태그별 옵션을 제공하는 XML기반의 `.launch`파일**</span>을 통한다. 해당 파일은 <span style="color: green">**패키지 폴더 내 `launch` 폴더 안**</span>에 있어야 한다.
* 실행 명령어: `roslaunch [패키지 이름] [roslaunch 파일명]`

> 📌 <span style="background-color: #12B886; color: white"> **namespace(네임스페이스)**</span>
**변수 등이 정의된 공간이라 볼 수 있다.** 예를 들어 정수형 값을 가지는 `a`라는 변수가 `namespace AAA`에도 있고 `namespace BBB`에도 있으면 두 변수는 각각 다른 변수로 취급한다. 일종의 '소속'이다.

> 📌 <span style="background-color: #12B886; color: white">**요소(Element)와 태그(Tag), 속성(Atribute)과 변수(Argument)**</span> <br>
XML 뿐만 아니라, 웹페이지를 만드는 HTML도 대표적 태그 사용 언어이다. 사용되는 개념이 동일하므로 알아두면 좋다.<br>
<span style="color: green">**태그(Tag)**</span>는 꺽쇠(`<`, `>`)로 둘러싸인 것을 말하며, 시작태그와 종료태그로 구성되어 있다. 예를 들어 HTML에서 문단을 나누는 `<p>` 태그는 시작 태그, 끝 태그는 `/`가 붙은 `</p>` 태그이다. 일부 태그 중에는 줄바꿈 태그 `<br>` 처럼 종료 태그가 없는 것도 있다.<br>
<span style="color: green">**요소(Element)**</span>란 시작 태그부터 종료 태그까지 포함된 명령어 전부를 말한다. `<p> 내용입니다 </p>` 전체가 요소인 것이다.<br>
<span style="color: green">**속성(Attribute)**</span>란 시작 태그 안에서 사용되어 구체적인 명령을 말한다. 예를 들어 시작 태그가 `<p align="center">`라면 정렬을 의미하는 `align`이 속성이 되는 것이다.<br>
<span style="color: green">**변수(Argument)**</span>는 속성에 부여되는 구체적인 값이다. 앞선 예에서 `center`에 해당한다. 정렬 속성의 값을 중앙정렬로 한다는 뜻이 된다.


- - -

# 📝 launch 파일의 예시
본격적으로 launch 파일을 작성해보기 전에, 예시 하나를 보며 익혀보자.
아래는 [`darknet_ros` 패키지](https://github.com/leggedrobotics/darknet_ros)의 `darknet_ros.launch` 예시이다. 각 코드에 관한 설명은 차후 찬찬히 이어질 예정이다.

```xml
<?xml version="1.0" encoding="utf-8"?>

<launch>
  <!-- Console launch prefix -->
  <arg name="launch_prefix" default=""/>
  <arg name="image" default="/camera/rgb/image_raw" />

  <!-- Config and weights folder. -->
  <arg name="yolo_weights_path"          default="$(find darknet_ros)/yolo_network_config/weights"/>
  <arg name="yolo_config_path"           default="$(find darknet_ros)/yolo_network_config/cfg"/>

  <!-- ROS and network parameter files -->
  <arg name="ros_param_file"             default="$(find darknet_ros)/config/ros.yaml"/>
  <arg name="network_param_file"         default="$(find darknet_ros)/config/yolov2-tiny.yaml"/>

  <!-- Load parameters -->
  <rosparam command="load" ns="darknet_ros" file="$(arg ros_param_file)"/>
  <rosparam command="load" ns="darknet_ros" file="$(arg network_param_file)"/>

  <!-- Start darknet and ros wrapper -->
  <node pkg="darknet_ros" type="darknet_ros" name="darknet_ros" output="screen" launch-prefix="$(arg launch_prefix)">
    <param name="weights_path"          value="$(arg yolo_weights_path)" />
    <param name="config_path"           value="$(arg yolo_config_path)" />
    <remap from="camera/rgb/image_raw"  to="$(arg image)" />
  </node>

</launch>
```

> 📌 <span style="background-color: #12B886; color: white"> **<?xml version="1.0" encoding="utf-8"?\>**</span>
**XML 선언부(XML Declaration)**로, 파일의 내용이 XML 문서라는 뜻이다. 필수 요소는 아니나, 인코딩(encoding)을 위해 해당 내용을 넣어주는 것이 권고된다.

> XML에서 주석은 `<!--` 와 `-->` 내부에 작성한다

- - -

# 🔖 roslaunch XML 파일 속 태그


## <launch\> 태그
* <span style="color:green">**파일 내용은 기본적으로 `<launch> ~ </launch>` 태그 내에 작성**</span>한다. 
* `<node>`, `<param>`, `<remap>`, `<machine>`, `<rosparam>`, `<include>`, `<env>`, `<test>`, `<arg>`, `<group>`의 요소를 포함할 수 있다.

## <node\> 태그
* <span style="color:green">**실행해야 할 노드는 `<node>` 태그 내에 작성**</span>한다. 
* <node/> 태그 안에 들어갈 수 있는 태그들 예시
  * `<env>` 태그: 노드의 환경변수 설정
  * `<remap>` 태그: 노드의 remapping 인자 설정
  * `<rosparam>`과 `<param>` 태그
    * 본디 `<node>` 태그 바깥에 사용되나, private name으로 사용 시에는 `<node>` 안쪽에서 사용 가능하다.
     * `<rosparam>` 태그: 해당 노드의 `~/local namespace`에 rosparam 파일을 로드한다.
     * `<param>` 태그: 해당 노드의 `~/local namespace`에 파라미터를 설정한다.
* 아래는 `<node>` 태그의 속성의 대표적 예이다.

  | 속성명 | 내용 |
  |:----------:|:----------|
  | pkg | (필수) <span style="color:green">**패키지 이름**</span> |
  | type | (필수) <span style="color:green">**실행할 노드 이름 또는 실행 파일**</span> |
  | name | (필수) <span style="color:green">**노드의 실행 이름**</span>. 일반적으로는 type과 같음 |
  | args | <span style="color:green">**노드에 인자를 전달**</span> |
  | respawn | 기본은 `False`. `True`로 설정 시 노드가 꺼졌을 때 자동으로 다시 실행됨 |
  | output | stdout/stderr를 내보내는 방법. 기본은 `log`로, `$ROS_HOME/log`에 작성. screen으로 설정 시 스크린(터미널)에 출력 |
  | launch-prefix | 노드의 시작 인수 앞에 추가할 명령이나 인수 |

* 예시: 주석으로 설명을 달아두었으며, 위에서 본 `darnet_ros` 패키지 부분도 들어있다.

  ```xml
  <node name="listener1" pkg="rospy_tutorials" type="listener.py" args="--test" respawn="true" />
    <!-- listener1이라는 이름의 노드를 실행함. -->
    <!-- rospy_toturials 패키지에서 listner.py라는 실행파일을 이용함. -->
    <!-- command-line 인자로 test를 추가함. 노드가 중단되었을 때 바로 재시작함 -->

  <node pkg="darknet_ros" type="darknet_ros" name="darknet_ros" output="screen" launch-prefix="$(arg launch_prefix)">
    <!-- darknet_ros 패키지에서 darknet_ros이라는 이름의 노드를 실행함. -->
    <!-- 터미널 창에 출력을 표시하고 -->
    <!-- 다른 곳에 정의한 launch_prefix arg를 launch-prefix로 함 -->
  ```

## <param\> 태그
* 파라미터 서버에 <span style="color:green">**파라미터를 정의**</span>한다.
* 파라미터의 값을 설정 시, 특정 값(value)를 직접 써넣을 수도 있고, 파일(textfile, binfile)이나 명령(command)을 사용할 수 있다.
* `<node>` 태그 내부에 사용할 시, 해당 파라미터는 private 파라미터로서 다뤄진다
* `<param>` 태그의 속성(Attributes)

  | 속성명 | 내용 |
  |:----------:|:----------|
  | name | (필수) <span style="color: green">**파라미터 이름**</span>. namespace/name 형태로도 사용 가능함 |
  | value | <span style="color: green">**파라미터의 값**</span>을 설정함. 이 속성 생략 시, binfile/textfile/command 중 하나가 반드시 쓰여야 함 |
  | type | 파라미터의 타입을 설정함. 미설정 시 roslaunch가 알아서 할당 |
  | textfile | 내용을 string의 형태로 읽고 저장함 |
  | command | 내용을 string의 형태로 읽고 저장함 |
* 예
  ```xml
  <param name="publish_frequency" type="double" value="10.0" />
    <!-- 이름은 publish_frequency로 하고, 그 값을 double 타입의 10.0으로 한다 -->
  <param name="weights_path"          value="$(arg yolo_weights_path)" />
    <!-- 이름은 weights_path로 하고, -->
    <!-- 그 값을 yolo_weights_path의 이름을 가진 <arg> 태그의 값(value)로 함 -->
  ```

## <rosparam\> 태그
* 간단히 하면, `<param>` 태그와 마찬가지로 <span style="color: green">**파라미터의 이름, 타입, 값을 설정**</span>한다.
* <span style="color: green">**rosparam YAML 파일**</span>을 이용해 ROS Param Server로부터 파라미터를 로드하서나 덤핑할 수 있다. 삭제도 가능하다.
* `<node>` 태그 내부에 사용할 시, 해당 파라미터는 private 파라미터로서 다뤄진다
* `<rosparam>` 태그의 속성(Attributes)

  | 속성명 | 내용 |
  |:----------:|:----------|
  | param | (필수) <span style="color: green">**파라미터 이름**</span> |
  | command | rosparam의 command. 디폴트는 load. dump, delete 등의 다른 옵션이 있음 |
  | file | load, dump를 사용할 때 필요. rosparam 파일의 이름 |
  | ns | 특정 네임스페이스 |

* 예시
  ```xml
  <rosparam command="load" ns="darknet_ros" file="$(arg ros_param_file)"/>
    <!-- ros_param_file이라는 arg 태그에 지정된 파일 경로에서 불러옴(load) -->
    <!-- darknet_ros 의 네임스페이스를 이용함 --> 
  ```

## <include\> 태그
* <span style="color: green">**다른 roslaunch XML 파일을 현 파일로 불러올 수 있게**</span> 한다.
* 예를 들어 센서 실행 전용 launch 파일 `sensors.launch` 안에 LiDAR, GPS, IMU 각각의 launch 파일 `rplidar_ros/rplidar.launch`, `ublox_gps/ublox_device.launch`, `myahrs_driver/myahrs_driver.launch`을 include 시켜 함께 실행되는 것이다.
* `<include>`의 속성

  | 속성명 | 내용 |
  |:----------:|:----------|
  | file | (필수) <span style="color: green">**불러올 파일의 이름**</span> |
  | ns | 해당 네임스페이스와 관련한 파일을 불러옴 |
  | clear_params, pass_all_args | 둘 모두 기본은 false임. 자세 사항은 문서 참조 |
* 예
  ```xml
  <include file="$(find ublox_gps)/launch/ublox_device.launch"/>
    <!-- ublox_gps 패키지에서 ublox_device.launch 파일을 불러와 함께 실행하라 -->
  ```

## <remap\> 태그
* 노드에서 사용 중인 ROS 변수 요소(노드, 토픽 등)의 이름을 변경한다. 
* 속성
  * `from` 속성: 뒤에 원래 이름을 넣는다.
  * `to` 속성: 뒤에 바꿀 이름을 넣는다.
* 예
  ```xml
  <remap from="chatter" to="hello"/>
    <!-- 노드에 hello로써 chatter 토픽을 연결함 -->
  ```

## <env\> 태그
* 노드에 환경 변수(경로, IP 등)를 설정한다. 
* `<launch>`, `<include>`, `<name>` 등의 태그에도 들어갈 수 있는 태그이다.
* `<env>` 태그의 속성: `name`, `value`

## <group\> 태그
* <span style="color: green">**노드의 그룹을 묶어**</span> 설정을 편리하게 할 수 있다.
* `ns` 속성을 이용해 각각의 네임스페이스로 나눠 노드를 그룹으로 만들 수 있다.
* `<remap>` 태그를 활용해 각 그룹에 설정을 적용할 수도 있다.
* `<launch>` 태그 안에만 있다면 어떤 태그든 `<group>` 태그 안에 넣을 수 있다. (예: `<node>`, `<param>`, `<include>`, `<arg>` 등)
* `<group>` 태그의 속성

  | 속성명 | 내용 |
  |:----------:|:----------|
  | ns | 노드 그룹에 할당할 네임스페이스. global(권장 안함)/relative 가능 |
  | clear_params | launch 하기 전에 그룹의 네임스페이스의 파라미터들을 모두 삭제함. 매우 위험! |

## <arg\> 태그
* `command`를 통해 전달되는 <span style="color: green">**값을 미리 지정**</span>해 놓을 수 있다.
* global(전역)하지 않음에 주의한다. 단일 launch 파일에서만 유효하다.
* `<arg>` 태그의 속성

  | 속성명 | 내용 |
  |:----------:|:----------|
  | name | (필수) <span style="color: green">**인수의 이름**</span> |
  | default | <span style="color: green">**인수의 기본값**</span>. value 속성과 함께 사용할 수 없음 |
  | value | <span style="color: green">**인수의 값**</span>. default 속성과 함께 사용할 수 없음 | 
* 예
  ```xml
  <!-- 전달할 인수들을 선언해놓고 -->
  <arg name="hoge" value="fuga" />
  <arg name="image" default="/camera/rgb/image_raw" />

  <!-- 정의해 놓은 인수를 읽어다 사용함 -->
  <param name="param" value="$(arg hoge)"/>
    <!-- param이라는 이름의 파라미터에 인수 hoge의 값으로 지정해놓은 fuga를 할당함 -->
  <remap from="camera/rgb/image_raw"  to="$(arg image)" />
  ```

- - -

# 🔎 파라미터 확장 / 인수 치환

<span style="background-color: #12B886; color: white"> **인수 치환 (Arguements Substitution) 혹은 파라미터 확장 (Parameter expansion)**</span>의 개념이 있다. 리눅스에서 <span style="color: green">**`${이름}`은 중괄호 안에 있는 변수로 바꾸라**</span>는 뜻이다. 예를 들어 `USER`라는 환경변수가 있고 그 값이 `lumos` 일 때 `my name is ${USER}`의 괄호 안의 값이 바뀌어 `my name is lumos`가 되는 것이다. 

launch 파일을 작성할 때도 파라미터 확장이 곧잘 쓰인다. 앞서 본 예시들에서 언뜻 보았을 것이다. '~~의 값을 ~~로 한다'로 설명해두었는데, 그 말이 이 말이었다. <span style="color: green">**roslaunch가 노드를 시작하기 전에, 태그 속성에서 대체할 인수를 가져올 수 있게 된다.**</span>

사용되는 형태를 살펴보자.
* `$(env 환경변수값)` : 입력해준 값으로 환경변수로 하여 그 값을 대체한다. env를 사용하면 <env> 태그에서 오버라이드가 불가하다.
* `$(find pkg 패키지명)` : 입력해준 이름에 해당하는 패키지를 찾아서 그 값으로 대체한다. package-relative path로 기술한다.
* `$(arg 인자이름)` : `<arg>` 태그에 정의되어 있는 해당 인자 이름의 값을 찾서 value로 그 값을 대체한다.

구체적인 사용 예시는 다음과 같다.

```xml
<arg name="my_foo" value="abc">
<param name="foo" value="$(arg foo)" />
  <!-- my_foo 라는 이름을 가진 arg 태그를 찾아가 그 값(abc)를 foo라는 파라미터의 값으로 사용한다. -->

<arg name="yolo_weights_path" default="$(find darknet_ros)/yolo_network_config/weights"/>
  <!-- darknet_ros 라는 패키지를 찾아 그 경로를 쓴다. -->
  <!-- 예를 들어 그 위치가 /home/catkin_ws/src/darknet_ros라고 하면 -->
  <!-- 결론적으로 yolo_weights_path라는 인자를 말하는 <arg> 태그의 default의 값은 -->
  <!-- /home/catkin_ws/src/darknet_ros/yolo_network_config/weights 인 것이다.--> 
```

- - -
  
# 참고 문헌

* ["roslaunch/XML," ROS Wiki](http://wiki.ros.org/roslaunch/XML)
* [leggedrobotics, "Darknet ROS," GitHub](https://github.com/leggedrobotics/darknet_ros/blob/master/darknet_ros/launch/darknet_ros.launch)
* 표윤석, 조한철, 정려운, 임태훈. ROS 로봇 프로그래밍. 루비페이퍼
* ["HTML의 구성요소 태그(Tag), 요소(Element), 속성(Attribute), 변수(Arguments)," homejjang.com](http://www.homejjang.com/03/Tag_element_attribute.php)