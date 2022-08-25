---
title:  "[GPS] ublox ZED-F9P GPS, RTK 사용법"
excerpt: "ublox C099-F9P application board, 드라이버 설치, RTK 사용법(ntrip client)"

categories:
  - Perception
tags:
  - Perception
  - GPS
  - Localization
last_modified_at: 2022-01-11

use_math: true
toc: true
tock_sticky: true
toc_label: "Contents"
---

> 📌 <span style="background-color: #12B886; color: white">**사용 환경 및 장비**</span>
Ubuntu 18.04 LTS / ROS Melodic / [ublox C099-F9P application board](https://www.u-blox.com/en/product/c099-f9p-application-board)


# 👋 ublox C099-F9P 기기 특징
해당 제품은 <span style="color: green">**ublox의 GNSS 모듈인 ublox ZED-F9P를 사용하기 위한 도구(board)**</span>이다. 패키지에는 C099-F9P 보드와 함께 안테나, USB 커넥트 케이블, 수신기 등이 들어있다. GPS, GNSS, 그리고 이후에 나올 RTK 등에 대한 자세한 설명은 [[GPS] GPS 이론: GNSS, RTK 등
](https://velog.io/@717lumos/GPS-GPS-%EC%9D%B4%EB%A1%A0-GNSS-RTK-%EB%93%B1)를 참고한다.

ublox는 ucenter라는 서비스를 제공하는데, 이는 윈도우 전용일 뿐더러 우리는 Ubuntu의 ROS 상에서 기기를 사용할 것이므로 ucenter는 다루지 않는다.

![](https://images.velog.io/images/717lumos/post/cbb88c5c-9226-434b-8dee-0f5ffd564321/%EA%B7%B8%EB%A6%BC1.png)

* 보드 중앙부에 GNSS 모듈인 ZED-F9P가 있다.
* 보드에 <span style="color: green">**전력을 공급해주기 위해 PC와 5핀-USB 케이블로 연결해준다.**</span> 혹은 DC 잭으로 전원을 공급하거나 배터리를 연결하는 단자도 있다.
* USB 포트 옆 <span style="color: green">**LED 3개는 TP(Time Pulse, 파란색 점등), RTK(노란색 점등) 등의 정보**</span>를 표시한다.
* 특히 <span style="color: green">**RTCM 메시지가 수신되어 정상 사용될 수 있을 때 RTK LED가 노란색으로 반짝거린다.**</span> RTK fixed 모드가 있어 이것이 활성화되었다면 LED는 계속 켜져 있다.
* ZED-RF 커넥터는 <span style="color: green">**GNSS 수신기(안테나)를 연결하는 부분**</span>이 있다. 혹은 와이파이/블루투스 안테나를 연결하는 부분도 있다.

- - -

# 🔨 ublox ZED-F9P board 설치 및 설정

~~며칠, 몇 시간여의 삽질 끝에 터득하게 된 설치 과정이다.~~

## (1) 보드 연결
<span style="background-color: #12B886; color: white">**[ 1 ]**</span> 가장 먼저, **USB-5핀 케이블로 PC와 보드를 연결한다.**
<span style="background-color: #12B886; color: white">**[ 2 ]**</span> 기기에 **할당된 이름을 확인**한다. USB 허브 없이 바로 연결했다면 보통 `ttyACM0`로 나올 것이다. 필자는 이 이름으로 실습을 진행하겠다.
<span style="background-color: #12B886; color: white">**[ 3 ]**</span> 기기에 **실행 권한을 부여**한다.

```bash
$ ls /dev/tty*
$ sudo chmod 777 /dev/tty*
```

## (2) 드라이버 설치
다음으로는 <span style="color: green">**보드를 사용하기 위한 드라이버를 설치**</span>한다.

<span style="background-color: #12B886; color: white">**[ 1 ]**</span> **`/catkin_ws/src`로 이동한다**.
<span style="background-color: #12B886; color: white">**[ 2 ]**</span> 깃허브에서 **드라이버 소스 코드를 복사(clone)** 해온다. 드라이버 패키지는 `ublox_f9p`(https://github.com/ros-agriculture/ublox_f9p)를 사용한다.
<span style="background-color: #12B886; color: white">**[ 3 ]**</span> `catkin_make`로 **빌드**해주고 이상이 없음을 확인한다.

```bash
$ cd /catkin_ws/src
$ git clone https://github.com/ros-agriculture/ublox_f9p
$ catkin_make (또는 cm)
```

해당 `ublox_f9p` 패키지는 (최종적으로는) ROS Wiki에도 패키지로 등록되어 있는 [ublox](http://wiki.ros.org/ublox)의 [패키지 소스](https://github.com/KumarRobotics/ublox)를 기반으로 몇 가지 작은 수정을 거친 만들어진 패키지이다. 처음에는 `ublox` 패키지를 사용하려 했으나, 이후 소개할 RTK를 사용하는 과정에서 파라미터 값 할당에 문제가 생겨 위에 소개한 `ublox_f9p` 패키지를 사용하게 되었다.

![](https://images.velog.io/images/717lumos/post/826026b9-f0a9-4a03-8303-2d1057a03b7c/20220111_152351.jpg)

패키지를 다운받게 되면 내부에 폴더가 꽤 많다. <span style="color: green">**우리가 주로 사용할 것은 `ublox_gps`이다.**</span> 이 폴더 내부에 <span style="color: green">**`/config/zed-f9p.yaml` 파일에는 사용할 파라미터/설정(configuration) 값들이 있고, `/launch/ublox_device.launch` 파일은 주로 실행할 launch 파일이며, `/src/node.cpp`는 노드를 만들어 토픽을 subscribe하고 publish하는 소스 코드를 담고 있다.**</span>

## (3) 파라미터 파일 수정
우리가 사용할 설정에 맞게 변경해주기 위해 <span style="color: green">**파라미터 파일인 `/ublox_gps/config/zed-f9p.yaml` 를 수정**</span>해야 한다. 다른 부분은 특별히 건드릴 것 없이, <span style="color: green">**기기의 포트 이름에 유의**</span>하자. 앞서 조회했던 이름 - 필자는 `ttyACM0` - 가 `device` 값과 맞게 입력되어있는지 확인하고, 다르다면 맞게 바꾸어준다.

```yaml
# Configuration Settings for ZED-F9P device

debug: 1                    # Range 0-4 (0 means no debug statements will print)

device: /dev/ttyACM0
frame_id: gps

uart1:
  baudrate: 460800

# Enable u-blox message publishers
publish:
  all: false
  nav:
    all: true
    relposned: true
    posllh: true
    posecef: true
```

> 🛑 **CAUTION!**
만약 이 부분이 제대로 되지 않는다면 launch 파일 실행 시 아래와 같은 오류가 발생한다. 필자의 경우 `ttyUSB0`로 포트 이름을 오인하여 설정했더니 발생했다.
```bash
[ INFO] [1641861952.381455918]: U-Blox: Opened serial port /dev/ttyUSB0
terminate called after throwing an instance of 'std::runtime_error'
  what():  Failed to poll MonVER & set relevant settings
[ublox_gps-2] process has died [pid 8275, exit code -6, cmd /home/lumos/catkin_ws/devel/lib/ublox_gps/ublox_gps __name:=ublox_gps __log:=/home/lumos/.ros/log/d375d716-7277-11ec-ac96-a0c5893998c9/ublox_gps-2.log].
log file: /home/lumos/.ros/log/d375d716-7277-11ec-ac96-a0c5893998c9/ublox_gps-2*.log
```
만약 같은 오류가 났는데 포트 이름도 잘 연결되었으면 아래의 링크를 참고하자.
* [GitHub - "Cannot open /dev/ttyUSB0: Permission denied #26"](https://github.com/esp8266/source-code-examples/issues/26)
* [GitHub - "Unable to Poll Monver issue #127"](https://github.com/KumarRobotics/ublox/issues/127)

## (4) 패키지 launch 파일 수정
기기를 가동시키기 위해 <span style="color: green">**`/ublox_gps/launch/ublox_device.launch`을 사용할 것이므로, 해당 파일에서 부족한 부분을 수정**</span>해줘야 한다.

다른 곳은 대부분 건드릴 필요 없이 다 채워져 있으나, <span style="color: green">**파라미터 파일을 지정하는 `<arg name="param_file_name">` 태그의 값을 우리가 사용할 파일로 바꿔줘야**</span> 한다. 우리는 `/config/zed-f9p.yaml` 파일을 사용할 것이므로 해당 태그의 옵션 `doc`을 `zed-f9p`로 수정한다.

```xml
<arg name="param_file_name" value="zed-f9p"/>
```

launch 파일 전체 내용은 아래와 같다.

```xml
<!-- 원본 -->
<?xml version="1.0" encoding="UTF-8"?>

<launch>
  <arg name="node_name" />
  <arg name="param_file_name" doc="name of param file, e.g. rover" />
  <arg name="output" default="screen" />
  <arg name="respawn" default="true" />
  <arg name="respawn_delay" default="30" />
  <arg name="clear_params" default="true" />

  <node pkg="ublox_gps" type="ublox_gps" name="$(arg node_name)"
        output="$(arg output)" 
        clear_params="$(arg clear_params)"
        respawn="$(arg respawn)" 
        respawn_delay="$(arg respawn_delay)">
    <rosparam command="load" 
              file="$(find ublox_gps)/config/$(arg param_file_name).yaml" />
  </node>
</launch>


<!-- 수정 후 -->

<?xml version="1.0" encoding="UTF-8"?>

<launch>
  <arg name="node_name" value="ublox_gps"/>
	    <arg name="param_file_name" value="zed-f9p"/>
	    <arg name="output" value="screen"/>
	    <arg name="respawn" value="true"/>
	    <arg name="respawn_delay" value="30"/>
	    <arg name="clear_params" value="false"/>

  <node pkg="ublox_gps" type="ublox_gps" name="$(arg node_name)"
        output="$(arg output)" 
        clear_params="$(arg clear_params)"
        respawn="$(arg respawn)" 
        respawn_delay="$(arg respawn_delay)">
    <rosparam command="load" 
              file="$(find ublox_gps)/config/$(arg param_file_name).yaml" />
  </node>
</launch>
```

- - -
  
# 🎉 ublox ZED-F9P board 기기 실행
수정 사항이 많았으니 <span style="color: green">**빌드를 다시 한 번 해주고 launch 파일을 실행**</span>해보자.

```bash
$ catkin_make (또는 cm)
$ roslaunch ublox_gps ublox_device.launch
```

![](https://images.velog.io/images/717lumos/post/7b39dc29-5c43-421b-8981-51a0d458a5a4/ublox_device%20%EB%9F%B0%EC%B9%98_cr.png)

다른 터미널에 `rqt_graph` 명령어를 입력하여 rqt 그래프를 그려보면 <span style="color: green">**`/ublox_gps` 노드가 하나 생성**</span>된 것을 볼 수 있을 것이다.

- - -

# 🎯 RTK 사용

<span style="color: green">**보다 정확한 위치 측정을 하기 위해 RTK 기법을 활용할 수 있다**</span>. 이를 위해선 몇 가지 준비가 좀 ~~많이~~ 더 필요하다.

## (1) 국토지리정보원 회원가입
우리나라에서 RTK 신호를 사용하기 위해서는 <span style="color: green">**국토지리정보원의 국토정보플랫폼을 이용**</span>해야 한다.
<span style="background-color: #12B886; color: white">**[ 1 ]**</span> 국토지리정보원 홈페이지(http://www.ngii.go.kr/)에서 <u>회원가입</u>을 한다.
<span style="background-color: #12B886; color: white">**[ 2 ]**</span> <u>네트워크 RTK 회원가입</u>을 하기 위해 [국토정보플랫폼의 네트워크 RTK 서비스](http://map.ngii.go.kr/ms/mesrInfo/gnss/vrsUserView.do)에 접속한다. 방금 생성한 계정으로 로그인한 뒤, VRS ID 란에 아이디를 생성한다. 비밀번호는 입력하지 않는다. 보다 자세한 절차는 링크(http://koseco.co.kr/ngii_rtk/)를 참고하자.

## (2) ntrip client 패키지 설치
RTK 신호를 사용하려면 <span style="color: green">**ntrip client를 지원하는 패키지 설치**</span>가 선행되어야 한다.

> 🧭 <span style="background-color: #12B886; color: white">**NTRIP(Networked Transport of RTCM via Internet Protocol)**</span> <br>
  직역하자면 '<span style="color: green">**인터넷 프로토콜을 통한 네트워크 전송 RTCM**</span>'이다. RTK 보정 전송 프로토콜로 사용한다. 
  중파신호 매체를 통해 GPS 위치 오차 보정신호를 전송하던 기존 DGPS와는 다르게, 지역기반보정시스템(LBAS, Local Based Augmentation System)인 NTRIP은 인터넷 망을 통해 GPS 보정 신호를 전송하는 방식이다. 하이퍼텍스트(HyperText) 전송 프로토콜인 HTTP(Hypertext Transfer Protocol)을 기반으로 한다.
  NTRIP 서버(server)는 HTTP 서버로서 NTRIP 소스 데이터를 전송하는 주체이며, <span style="color: green">**NTRIP 클라이언트(client)는 인터넷 접속이 가능한 단말기로 DGPS 데이터를 수신하는 주체**</span>이다.

> 🧭 <span style="background-color: #12B886; color: white">**DGPS(Differential GPS)**</span><br>
지상기반보정시스템(GBAS, Ground Based Augmentation System) 중 하나로, 대한민국이나 미국 등의 국가에서 쓰인다.

> 🧭 <span style="background-color: #12B886; color: white">**RTCM(Radio Technical Committee for Maritime Service)**</span><br>
<span style="color: green">**GPS 보정신호를 전송하는 데이터 포맷**</span>이다.

간단히 하자면, 우리가 사용할 ntrip client는 <span style="color: green">**RTCM 스트림을 ROS 토픽으로 받아주는 역할**</span>을 하게 될 것이다.

원래 필자는 ROS Wiki에 패키지로 등록된 `ntrip_client` [패키지](https://index.ros.org/p/ntrip_client/github-LORD-MicroStrain-ntrip_client/)를 사용하려 했으나, 메시지 타입(mavros_msgs) 등의 문제로 GitHub에서 다른 유사한 패키지를 사용하였다. 사실상 이제 소개할 패키지가 가장 많이 쓰이는 듯하다.

<span style="background-color: #12B886; color: white">**[ 1 ]**</span> 드라이버 설치와 똑같이 **GitHub의 패키지 코드를 다운 받는다.** 위치는 `/catkin_ws/src` 내라면 딱히 상관이 없으나 GPS 패키지를 알아보기 쉽게 하기 위해 `ublox_f9p` 내부에 다운받았다.

```bash
$ cd /catkin_ws/src/ublox_f9p
$ git clone https://github.com/ros-agriculture/ntrip_ros
```

<span style="background-color: #12B886; color: white">**[ 2 ]**</span> **노드가 퍼블리시할 토픽(RTCM 메시지)의 메시지 타입이 필요**하여 이 역시 **다운 받는다**. 해당 패키지는 `Message.msg` 만 사용하도록 된, 그저 메시지 파일만 담은 패키지이다. 다운이 끝나면 빌드해준다.

```bash
$ cd /catkin_ws/src/ublox_f9p
$ git clone https://github.com/tilk/rtcm_msgs
$ catkin_make (또는 cm)
```

메시지 파일은 아래와 같이 간단히 구성되었다. ~~원래는 [mavros_msgs/RTCM.msg](https://github.com/mavlink/mavros/blob/ros2/mavros_msgs/msg/RTCM.msg)의 형태이나, 해당 메시지 파일 및 잡다한 것을 다운받으려면 일이 좀 많이 귀찮으므로 위 패키지를 받아 사용한 것이다.~~

```yaml
# A message representing a single RTCM message.
Header header

uint8[] message
```

## (3) ublox 스크립트 수정
  이전에 설치한 <span style="color: green">**`ublox_f9p` 패키지의 `/ublox/src/node.cpp` 파일**</span>에는 RTK 보정신호인 RTCM을 받기 위한 부분이 존재한다. 이때 <span style="color: green">**ntrip client 노드에서 퍼블리시 하는 토픽의 이름 & 메시지 타입과 ublox 노드가 서브스크라이브하는 것이 같아야**</span> 하므로 이에 대한 수정이 필요하다.

> 🛑 **CAUTION!**
만약 ntrip client 패키지나 ublox 드라이버를 다른 것을 사용했다면 아래 내용과 상이할 수 있음에 주의하자!

<span style="color: green">**토픽의 이름은 `/ublox_gps/rtcm`**</span>으로 할 것이며, 메시지 타입은 바로 직전에 다운받은 `rtcm_msgs/Message`이다. 

<span style="background-color: #12B886; color: white">**[ 1 ]**</span> **`/ublox/src/node.cpp` 스크립트에 토픽 이름을 수정**하자. 1861번째 줄을 아래와 같이 수정하고 저장한다.

```cpp
//// 수정 전
param_nh.param("rtcm_topic", rtcm_topic, std::string("rtcm"));

//// 수정 후
param_nh.param("/ublox_gps/rtcm", rtcm_topic, std::string("rtcm"));
```

<span style="background-color: #12B886; color: white">**[ 2 ]**</span> **패키지를 다시 빌드**한다. 파이썬 파일(.py)와는 다르게 C++파일(.cpp)는 수정 후 반드시 빌드를 해줘야 그 사항이 반영된다.

## (4) ntrip launch 파일 수정-1
<span style="color: green">**`ntrip_ros/launch/ntrip_ros.launch` 파일의 빈 곳을 수정하여 RTK 신호를 받을 수 있게**</span> 하자.

* `rtcm_topic`의 value를 아까 설정한 토픽 이름 `/ublox_gps/rtcm`으로 바꾼다.
* `ntrip_server`의 value를 국토정보플랫폼의 접속경로로 변경한다. 
* `ntrip_user`의 value를 네트워크 RTK의 ID로 한다. 개인정보이므로 아래 코드에서는 ####로 처리했다.
* `ntrip_pass`의 value를 네트워크 RTK의 비밀번호로 한다. 본디 따로 설정하지 않고 ngii로 통일되었으므로 `ngii`라고만 입력해도 된다.
* `ntrip_stream`의 value를 `VRS-RTCM31`로 한다. RTCM3 포맷으로 출력한다는 뜻이다.
* `nmea_gga`의 value를 설정한다. NMEA 프로토콜 Sentence이므로 장치 등 GNSS를 사용하기 위한 다양한 정보를 담고 있다. 자세한 사항은 [이 링크](https://techlog.gurucat.net/239)를 확인하고 입력하자.

![](https://images.velog.io/images/717lumos/post/7c04493d-4271-4b4a-bc7b-e9604bf52143/20220111_170646.jpg)

```xml
<!-- 원본 -->

<?xml version="1.0" encoding="UTF-8"?>

<launch>
  <node pkg="ntrip_ros" type="ntripclient.py" name="ntrip_ros" output="screen">
 	 <param name="rtcm_topic" value="/rtcm"/>
 	 <param name="ntrip_server" value="URL:PORT"/>
 	 <param name="ntrip_user" value="USER"/>
 	 <param name="ntrip_pass" value="PASS"/>
 	 <param name="ntrip_stream" value="MOUNTPOINT"/>
 	 <param name="nmea_gga" value="$GPGGA,..."/>
  </node>
</launch>

<!-- 수정 -->
<?xml version="1.0" encoding="UTF-8"?>

<launch>
 <node pkg="ntrip_ros" type="ntripclient.py" name="ntrip_ros" output="screen">
 	 <param name="rtcm_topic" value="/ublox_gps/rtcm"/>
 	 <param name="ntrip_server" value="vrs3.ngii.go.kr:2101"/>
 	 <param name="ntrip_user" value="####"/>
 	 <param name="ntrip_pass" value="ngii"/>
 	 <param name="ntrip_stream" value="VRS-RTCM31"/>
 	 <param name="nmea_gga" value="$GPGGA,024539.902,3725.1148,N,12641.1118,E,1,12,1.0,0.0,M,0.0,M,,*60"/>
  </node>
</launch>
```

## (5) ntrip + ublox 실행-1
이제 각각의 launch 파일을 실행하여 RTK 신호를 이용한 GNSS 신호를 받아보자. 터미널 각각에 아래의 명령어를 입력해 실행하자.

```bash
$ roslaunch ntrip_ros ntrip_ros.launch

$ roslaunch ublox_gps ublox_device.launch
```

## (6) ntrip launch 파일 수정-2
사실 RTK를 사용하려 두 개의 launch 파일을 켜는 것은 좀 불편하고 성가시다. ~~터미널을 두 개 켜야 하는 것부터 귀찮다.~~

그래서 <span style="color: green">**`ntrip_ros.launch`에 `ublox_device.launch`를 불러와(`<include>` 태그 이용) 하나만 실행해도 동시 실행되도록**</span> 해보자.

```xml
<?xml version="1.0" encoding="UTF-8"?>

<launch>
  <include file="$(find ublox_gps)/launch/ublox_device.launch">
  </include>

  <node pkg="ntrip_ros" type="ntripclient.py" name="ntrip_ros" output="screen">
    <param name="rtcm_topic" value="/ublox_gps/rtcm"/>
    <param name="ntrip_server" value="vrs3.ngii.go.kr:2101"/>
    <param name="ntrip_user" value="####"/>
    <param name="ntrip_pass" value="ngii"/>
    <param name="ntrip_stream" value="VRS-RTCM31"/>
    <param name="nmea_gga" value="$GPGGA,024539.902,3723.004,N,12639.255,E,1,12,1.0,0.0,M,0.0,M,,*60"/>
  </node>
</launch>
```

## (7) ntrip + ublox 실행-2
<span style="background-color: #12B886; color: white">**[ 1 ]**</span> 이제는 <span style="color: green">**터미널 창에서 `ntrip_ros.launch`만 실행해도 ublox 보드까지 함께 실행**</span>된다.

```bash
$ roslaunch ntrip_ros ntrip_ros.launch
```

![](https://images.velog.io/images/717lumos/post/76cb034e-482b-469e-9c62-cbf80101f71e/%EA%B7%B8%EB%A6%BC11.png)

<span style="background-color: #12B886; color: white">**[ 2 ]**</span> <span style="color: green">**발행되는 토픽들을 확인**</span>하자. `ntrip_ros` 노드와 `ublox_f9p`사이에 주고받기로 한 `/ublox_gps/rtcm` 토픽이 있음을 확인할 수 있다 

```
$ rostopic list
```

![](https://images.velog.io/images/717lumos/post/b71bb82d-0d1b-4034-970c-118417f6a5c2/rostopic%20list_cr.png)

<span style="background-color: #12B886; color: white">**[ 3 ]**</span> 이번엔 <span style="color: green">**`rqt_graph`로 노드와 토픽 사이의 관계를 확인**</span>해보자. 각각 `Dead sinks`를 체크한 것과 체크하지 않은 것이다.

```bash
$ rqt_graph
```

![](https://images.velog.io/images/717lumos/post/c26a6579-bdfb-4742-8d1d-7a33c5374482/rqt%20dead%20sinks_cr.png)

![](https://images.velog.io/images/717lumos/post/bf2b2542-3098-49e0-9744-697d1fc2af02/rqt_graph%20%EC%A0%84%EC%B2%B4_cr.png)

<span style="background-color: #12B886; color: white">**[ 4 ]**</span> <span style="color: green">**각 토픽의 메시지들을 확인**</span>해보자. 토픽에 대한 설명은 [ublox 원본 패키지](https://github.com/KumarRobotics/ublox)를 참고하자.

```bash
$ rostopic echo /ublox_gps/fix
$ rostopic echo /ublox_gps/rtcm
```

![](https://images.velog.io/images/717lumos/post/3b7ee5bc-129d-409d-bad5-3477d11c8451/0111195212603724.jpg)

![](https://images.velog.io/images/717lumos/post/38d500ce-4b2d-4f1a-bf5c-8d2b9a94937f/0111195238209868.jpg)

참고로 <span style="color: green">**`/ublox_gps/fix`의 자료형은 [sensor_msgs/NavSatFix](http://docs.ros.org/en/api/sensor_msgs/html/msg/NavSatFix.html)으로, 위도와 경도, 고도 등의 값을 담고 있다**</span>(Navigation Satellite fix).

* std_msgs/Header `header`: 시간, 프레임 ID 등 헤더값
* [sensor_msgs/NavSatStatus](http://docs.ros.org/en/api/sensor_msgs/html/msg/NavSatStatus.html) `status`: 위성 fix 상태값
* float64 `latitude`: 도(degrees) 단위의 위도값. 북쪽이 (+)이고 남쪽이 (-)이다.
* float64 `longitude`: 도(degrees) 단위의 경도값. 본초 좌오선의 동쪽이 (+)이고 서쪽이 (-)이다.
* float64 `altitude`: 미터(m) 단위의 고도. WGS84형 타원체의 위쪽이 (+) 값
* float64[9] `position_covariance`: 접평면에 대한 제곱 미터($\mathrm{m}^{2}$) 단위의 자세 공분산. 행 우선(row-major order)으로 한 ENU(East, North, Up) 구성요소로 되어 있다.
* uint8 `position_covariance_type`

- - -

# 참고 문헌
* C099-F9P Application board (rev. E), ODIN-W2 Mbed<sup>TM</sup> firmware User guide
* [ublox c099-f9p-application-board](https://www.u-blox.com/en/product/c099-f9p-application-board)
* [Petrus, "[Ublox] C099-F9P(GNSS) & C94M8P(GPS) ROS bulid up하기," NAVER blog](https://blog.naver.com/PostView.nhn?isHttpsRedirect=true&blogId=tinz6461&logNo=221868681278&categoryNo=0&parentCategoryNo=0&viewDate=&currentPage=1&postListTopCurrentPage=1&from=postView&userTopListOpen=true&userTopListCount=5&userTopListManageOpen=false&userTopListCurrentPage=1)
* [다이브김, "인공위성의 종류," NAVER blog](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=kim_changsu&logNo=221208788133)
* ["Networked_Transport_of_RTCM_via_Internet_Protocol," Wikipedia](https://en.wikipedia.org/wiki/Networked_Transport_of_RTCM_via_Internet_Protocol)
* [SSu_KaNu, "ROS 에서 Ublox F9p 모듈, RTK(NTRIP, RTCM) 사용," tistory](https://ssukanu.tistory.com/2)
* [zlzon, "ROS에서 Ublox F9P 모듈 RTK(ntrip,rtcm)기능 사용," tistory](https://zl-zon.tistory.com/8)
* [ㅎㅎㅎ, "GPS 고정신호 (좌표 보정) 받는 로직," NAVER blog](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=immai&logNo=220575338214)
* [하얀쿠아, "[GPS 이야기] NMEA-0183 형식, NMEA Sentence Format," 하얀쿠아의 이것저것 만들기 Blog](https://techlog.gurucat.net/239)
