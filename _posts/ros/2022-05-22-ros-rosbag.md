---
title:  "rosbag 사용하기 : 토픽 녹화 및 재생"
excerpt: "rosbag을 이용한 토픽 녹화 및 재생 방법"

categories:
  - ROS
tags:
  - Robotics
  - ROS
date: 2022-05-22
last_modified_at: 2022-05-22
order: 10

use_math: true
toc: true
tock_sticky: true
toc_label: "Contents"
---

# 1. rosbag

[ROS WIKI](http://wiki.ros.org/rosbag)를 살펴보면 rosbag은 ROS topic을 저장하고 다시 재생할 수 있는 도구라 설명하고 있다.

가장 와닿는 예시를 들자면, 우리가 매번 주렁주렁 센서를 꽂고 실행하지 않아도 센서 작동 시에 토픽들을 한 번 녹화해두면 두고두고 그 내용을 사용할 수 있다. 영상 녹화와 같다.

여기서는 주로 사용하는 명령어와 기능들만 간단히 소개하겠다. 더 나아간 명령어들은 [commandline 페이지](http://wiki.ros.org/rosbag/Commandline)에서 확인할 수 있다.

# 2. 명령어
`rosbag` 명령어는 `roscore`을 실행해야 한다. 마스터를 실행한 뒤에야 토픽이 날아들 수 있으니 어쩌면 당연한 이야기다.

```bash
$ rosbag record -a

[ERROR] [1653215098.526772486]: [registerPublisher] Failed to contact master at [localhost:11311].  Retrying...
```

위와 같은 에러 메시지를 마주쳤다면 `roscore`을 실행하지 않았다고 보면 된다.

## 2.1. record
`rosbag record` 계열 명령어는 단어 그대로 토픽을 녹화해 저장한다. 파일의 경로를 지정하지 않으면 홈 디렉토리에 만들어지고, 현재 날짜와 시간의 형태로 파일명을 생성한다. 확장자는 `*.bag`이다.

📽 **특정 토픽만 저장하기**: 특정 토픽(들)만 저장하려면 명령어 뒤에 토픽 이름을 나열한다.

```bash
$ rosbag record <토픽 이름1> <토픽 이름2> <토픽 이름3> ...

(예) rosbag record /ublox_gps/fixed /scan /imu/mag /usb_cam/image_raw
```

📽 **모든 토픽 저장하기**: 현재 발행되고 있는 모든 토픽을 저장하고자 한다면 `-a` 옵션 혹은 `--all` 옵션을 준다. 

```bash
$ rosbag record -a
```

주의할 점이라 하면, 개인적으론 카메라 토픽을 녹화할 때 `-a` 옵션은 주지 않는 것을 권한다. 해보면 알겠지만 영상을 담는 bag 파일은 용량이 매우 크다. `usb_cam`의 launch file 하나만 작동시켰는데 1분 가량 녹화에 3.4GByte가 나왔다. 

단순히 계산을 해보자. 30fps라고 가정하고 해상도가 640 X 480라고 하자. 컬러 영상은 3채널이므로 0.2초에 640pixel X 480pixel X 3channel = 921,600 크기의 배열이 만들어지고 1초엔 27,648,800 크기가 된다. 그러니, 카메라를 사용한다면 가급적 꼭 필요한 토픽만 녹화하는 것을 권한다. `usb_cam/image_raw`를 주로 사용할테니 그것만 명시해서 녹화를 하는 것이다.

> 압축(compress) 하는 기능이 있다고는 하는데 굳이 더 알아보지는 않았다. ~~예쁘게 녹화된 하나를 USB에 담아 가지고 다니는 편을 택하는 귀차니즘.... 압축 푸는 과정이 더 귀찮을 것 같으므로...~~

카메라 토픽을 녹화하며  `-a`를 사용했을 때 간혹 아래와 같은 상황에 부딪힐 때가 있다. 무서운 빨간 에러의 향연. 아마 depth 토픽에서 문제가 생긴 것 같은데, 필자도 아직 원인을 찾아보지 않았다. 녹화가 안되는 것은 아니다. 

![](https://velog.velcdn.com/images/717lumos/post/1808c4f4-a07c-45fa-bdf1-ae696d8c5dc6/image.png)


📽 **bag 파일의 이름 지정해 저장하기**: 파일의 이름을 애초부터 설정해 저장할 수도 있다. `-O <이름>` 혹은 `--output-name=<이름>` 식으로 이름을 지정한다.

```bash
$ rosbag record -O my_bag_record.bag /scan /imu/mag
```


## 2.2. info
이 역시 이름에서 알 수 있듯이 해당 bag 파일의 정보를 출력한다.

```bash
$ rosbag info my_bag_record.bag 

path:        my_bag_record.bag
version:     2.0
duration:    1:03s (63s)
start:       May 22 2022 19:31:40.79 (1653215500.79)
end:         May 22 2022 19:32:43.80 (1653215563.80)
size:        3.2 GB
messages:    12945
compression: none [3692/3692 chunks]
types:       dynamic_reconfigure/Config            [958f16a05573709014982821e6822580]
             dynamic_reconfigure/ConfigDescription [757ce9d44ba8ddd801bb30bc456f946f]
             rosgraph_msgs/Log                     [acffd30cd6b6de30f120938c17c593fb]
             sensor_msgs/CameraInfo                [c9a58c1b0b154e0e6da7578cb991d214]
             sensor_msgs/CompressedImage           [8f7a12909da2c9d3332d540a0977563f]
             sensor_msgs/Image                     [060021388200f6f0f447d0fcd9c64743]
             theora_image_transport/Packet         [33ac4e14a7cff32e7e0d65f18bb410f3]
topics:      /image_view/output                                          1845 msgs    : sensor_msgs/Image                    
             /image_view/parameter_descriptions                             1 msg     : dynamic_reconfigure/ConfigDescription
             /image_view/parameter_updates                                  1 msg     : dynamic_reconfigure/Config           
             /rosout                                                     1858 msgs    : rosgraph_msgs/Log                     (3 connections)
             /rosout_agg                                                 1846 msgs    : rosgraph_msgs/Log                    
             /usb_cam/camera_info                                        1845 msgs    : sensor_msgs/CameraInfo               
             /usb_cam/image_raw                                          1846 msgs    : sensor_msgs/Image                    
(이하 생략)
```

## 2.3. play
bag 파일을 사용한다면 가장 많이 사용할 명령어가 이 `rosbag play`이다. 저장된 bag 파일을 재생하는 명령어이다.

> 당연히 옵션들은 조합이 가능하다. 본인이 필요한 옵션들을 섞어 써보자.

📽 **bag 파일 재생하기**: 해당 파일의 녹화된 내용을 단순히 재생한다.

```bash
rosbag play <bag파일 이름1> <bag파일 이름2> ...

(예) rosbag play my_bag_record.bag
```
bag 파일을 재생해보고 `rostopic list` 명령어를 통해 녹화된 토픽들이 제대로 발행되고 있는지 확인한다. `rostopic echo <토픽 이름>`으로 직접 메시지를 확인할 수도 있다.

![](https://velog.velcdn.com/images/717lumos/post/407909d6-002f-4574-891a-7494b5878948/image.png)


`rqt_graph` 명령어로 rqt 그래프도 그려보자.

![](https://velog.velcdn.com/images/717lumos/post/63ad1001-20a8-4226-9a88-ba7dc54d30bd/image.png)


📽 **반복 재생하기**: 보통 bag 파일의 녹화 시간이 끝나면 자동 종료된다. 하지만 처음부터 무한재생을 하고 싶다면 `-l` 혹은 `--loop` 옵션을 지정하면 된다. 필자는 해당 옵션을 애용한다. ~~매번 다시 키기 귀찮으니까.~~

```bash
rosbag play -l <bag 파일 이름>
```

📽 **특정 토픽만 재생하기**: 특정 토픽만 녹화할 수 있듯이, 특정 토픽만 재생할 수도 있다. `--topics` 옵션 뒤에 토픽 이름을 입력한다.

```bash
rosbag play <bag 파일 이름> --topics <토픽 이름1> <토픽 이름2> ...

(예) rosbag play my_bag_record.bag --topics /imu/mag /scan
```

# 3. Tip1: roslaunch
rosbag을 쓰려는 이유를 되짚어보자. 필자의 경우 자율주행 혹은 자율운항 알고리즘을 테스트할 때 센서 데이터를 실제값으로 적용해보기 위해 사용한다. 

센서 노드들은 일찍이 launch 파일에서 한번에 선언하고 `roslaunch` 명령어를 통해 한 줄의 코드 만으로 모든 노드를 작동한다. rosbag을 사용한다면 몇 줄의 명령어가 더 필요할까? 정답은 2줄이다. `roscore` 하나, `rosbag play` 하나.

우리는 여전히 귀찮다. 저 두 줄마저 치고싶지 않다. 그럴 때 launch 파일을 사용하자. rosbag을 사용할 때도 한 줄만으로 실행할 수 있도록, rosbag 명령어도 넣어버리자.

아래는 원래 launch 파일의 예시이다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<launch>
<!--sensors-->
    <!--LiDAR-->
	<node name="rplidarNode"          pkg="rplidar_ros"  type="rplidarNode" output="screen">
		<param name="serial_port"         type="string" value="/dev/ttyLiDAR"/>  
		<param name="serial_baudrate"     type="int"    value="256000"/>
		<param name="frame_id"            type="string" value="laser"/>
		<param name="inverted"            type="bool"   value="false"/>
		<param name="angle_compensate"    type="bool"   value="true"/>
		<param name="scan_mode"           type="string" value="Stability"/>
	</node>

	<!--GPS-->
	<include file="$(find ntrip_ros)/launch/ntrip_ros.launch"></include>

	<!--IMU-->
	<node pkg="myahrs_driver" type="myahrs_driver" name="myahrs_driver">
		<param name="port" value="/dev/ttyIMU" />
		<param name="baud_rate" value="115200" />
	</node>


<!--scripts--> <!-- 센서의 raw 데이터를 조작하는 스크립트 -->
	<node pkg="my_pkg" type="lidar_filter.py" name="lidar_filter" respawn="true" output="screen"/>
	<node pkg="my_pkg"  type="heading_calculator.py" name="headingCalculator" respawn="true"/>

	<node pkg="rviz" type="rviz" name="rviz" args="-d $(find my_pkg)/rviz/rviz_setting1.rviz" />
	<node name="rqt" pkg="rqt_graph" type="rqt_graph"/>
</launch>
```

`<!--sensors-->`에 해당하는 부분이 실제 센서를 작동시키는 노드들이다. rosbag으로 해당 값들을 녹화했다고 가정하자. 그렇다면 저 노드들은 불러올 필요가 없으니 삭제한다.

그리고 `<node>` 태그를 사용해 `rosbag` 명령어를 추가한다. rqt graph에서도 보았듯이 `rosbag play`를 하면 하나의 노드가 만들어진다. 그러니 `<node>` 태그를 사용하는 것이 이상하지 않을 것이다.

아래 명령어는 `rosbag_play`라는 노드를 만들어 녹화해둔 토픽들을 Publish하게 하는데, bag 파일의 경로는 `my_pkg`라는 패키지 폴더의 하위 폴더인 `rosbag` 아래 `my_bag_record.bag`이라는 이름이고, 무한 반복 재생하되(`-l`) `/imu/mag`와, `/scan`, `/ublox_gps/fix` 토픽만 발행하도록 한다.

```xml
<node pkg="rosbag" type="play" name="rosbag_play" required="true" args="$(find my_pkg)/rosbag/my_bag_record.bag -l --topics /imu/mag /scan /ublox_gps/fix"/>
```

명령어의 구성을 자세히 살펴보면 commandline 명령어를 그대로 옮겨놓은 것과 다름이 없다.
```bash
rosbag play /catkin_ws/my_pkg/rosbag/my_bag_record.bag -l --topics /imu/mag /scan /ublox_gps/fix
```

이제 파일 내용 전체는 아래와 같아진다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<launch>
	<node pkg="my_pkg" type="lidar_filter.py" name="lidar_filter" respawn="true" output="screen"/>
	<node pkg="my_pkg"  type="heading_calculator.py" name="headingCalculator" respawn="true"/>

	<node pkg="rviz" type="rviz" name="rviz" args="-d $(find my_pkg)/rviz/rviz_setting1.rviz" />
	<node name="rqt" pkg="rqt_graph" type="rqt_graph"/>

    <!-- NEW! -->
    <node pkg="rosbag" type="play" name="rosbag_play" required="true" args="$(find my_pkg)/rosbag/my_bag_record.bag -l --topics /imu/mag /scan /ublox_gps/fix"/>
</launch>
```

그럼 이제 launch 파일과 bag 파일을 동시에 실행시킬 수 있다.

```bash
roslaunch my_pkg practice_bag.launch
```

아래 사진은 실제 필자가 rosbag을 이용해 알고리즘을 테스트할 때의 rqt 그래프이다.

![](https://velog.velcdn.com/images/717lumos/post/a49d145e-8f32-4074-afa0-dd50c4a835fa/image.png)


- - -

# 4. Tip2: csv
필자가 rosbag을 사용하는 이유 두 번째는 특정 값들을 데이터로서 뽑고 싶기 때문이다. 가령 GPS 센서 값들을 받아 따로 지도에 궤적을 표시해본다던가, IMU 센서의 값을 그래프로 그려서 확인한다던가, 알고리즘 수행 중의 출력값들을 분석하는 등의 활동을 위해서이다.

녹화까지는 `record` 명령어를 사용해 수행한다고 하자. 그럼 파일의 확장자는 `bag`이고 우리가 이를 열어 값을 직접 뽑아올 수는 없다. 궁금하면 직접 열어보자.

데이터를 저장하는 가장 이상적인 방법은 엑셀이다. 그중에서도 csv 확장자 파일은 용량도 적고 많은 도구(python, pandas, matlab 등)에서 쉬이 불러올 수 있다. 그럼 bag 파일을 csv 파일로 변환할 수 있다면 매우 편리할 것이다. 물론 가능하니 이 포스팅을 하고 있겠지.

두 가지 방법이 있으니 본인이 편리한 쪽으로 택하면 되겠다.

📽 **오픈소스 프로그램 사용하기**

깃허브에 공개된 [rosbag_to_csv](https://github.com/AtsushiSakai/rosbag_to_csv) 패키지는 rosbag 파일을 csv로 변환해주는 프로그램이다. GUI 환경이라 직관적이며, bag 파일 내 특정 토픽만 저장할 수 있는 옵션도 제공한다.

![](https://velog.velcdn.com/images/717lumos/post/a5ec2990-23c2-4504-906f-7452d5ca795b/image.png)


📽 **명령어 사용하기**

`rostopic echo` 명령어와 출력 리다이렉션(redirection) `>`을 조합해 rosbag의 특정 토픽들을 csv 파일에 저장할 수 있다.

```bash
## 한 개의 토픽만 저장
$ rostopic echo -b [bag 파일 이름] -p [토픽 이름] > [csv파일 이름]

## 여러 개의 토픽을 저장(각기 다른 파일)
$ rostopic echo -b [bag 파일 이름] -p [토픽 이름] > [csv파일 이름] && rostopic echo -b [bag 파일 이름] -p [토픽 이름] > [csv파일 이름] ...

(예) rostopic echo -b my_bag_record -p /imu/mag > mag_data.csv
```

필자는 이렇게 센서 데이터를 수집해 각종 필터들의 성능을 분석했다. 관련 내용은 [깃허브 파일](https://github.com/winterbloooom/kalman-filter/blob/main/scripts/part1-application.ipynb)에 있다.

![](https://velog.velcdn.com/images/717lumos/post/9e227d14-1491-401e-a234-a661f4405447/image.jpg)


- - -

# 참고 자료

* [ros wiki: rosbag commandline](http://wiki.ros.org/rosbag/Commandline)
* [Gyuwon Choi, "[ROS] rosbag 을 csv 로 변환," medium 블로그](https://gyuwon-anna.medium.com/ros-rosbag-file-%EC%9D%84-csv-%EB%A1%9C-%EB%B3%80%ED%99%98-51138002eb35)