---
title:  "[IMU] myAHRS+ IMU 사용법"
excerpt: "AHRS, myAHRS와 ROS 패키지 사용법"

categories:
  - Robotics
  - Perception
tags:
  - Perception
  - IMU
  - Localization
  - ROS
last_modified_at: 2022-01-10
teaser: "https://user-images.githubusercontent.com/69252153/228567504-8c18fb49-7c81-42f4-8c27-38f000f2ee25.png"
---
# 🌒 AHRS
<span style="background-color: #12B886; color: white">**AHRS**</span>는 <span style="color: green">**Attitude and Heading Reference System의 약자**</span>로, 세 축으로 나타낼 수 있는 센서로 이루어져 있어 <span style="color: green">**Roll, Pitch, Yaw의 정보**</span>를 수집하는 센서이다. 이는 각각 3축의 <span style="color: green">**자이로스코프(각속도계), 가속도계, 자기계 센서**</span>가 MEMS(microelectromechanical systems)로 실리콘 기판 위에 집적화된 것이다.

IMU와 AHRS의 차이점은, 단순히 자세(attitude)와 방위(heading) 만 측정해 센싱 데이터를 전달하는 IMU와는 다르게, AHRS는 on-board 프로세싱 과정을 거쳐 전달해준다. 세 개의 센서로부터의 <span style="color: green">**출력 데이터를 필터 등으로 필터링/융합한 뒤 데이터가 전달**</span>되므로 일반 IMU보다 고가이다.

- - -

# 🌓 myARHS+ 기기 특징
<span style="color:green">**3축 gyroscope(16bit), 3축 acclerometer(16bit), 3축 magnetometer(13bit)로 이루어진 AHRS**</span>로, USB 포트에 꽂아 사용한다.

해당 기기는 축으로 NED 타입을 사용하여, IMU에선 자북에 대해 x(north), y(east), z(down)으로 표기한다. 

![](https://images.velog.io/images/717lumos/post/45683c9d-6830-4251-bc60-004d93cb6e0b/myahrs_plus_axes.png)

ROS를 지원하지 않는 오리지널 소스는 GitHub에서 확인할 수 있으며(https://github.com/withrobot/myAHRS_plus), 3D 시각화 도구도 포함되어 있다.

![](https://images.velog.io/images/717lumos/post/a4e6249a-1384-4e07-96dd-a5c0e5e977c9/ezgif.com-gif-maker.gif)

- - -

# 🌔 ROS용 myahrs 드라이버 패키지
ROS에서 myAHRS+를 사용할 수 있도록 만들어진 드라이버 패키지가 있다.

이 패키지는 ROS에서 사용되는 ENU 좌표계(오른손 법칙 따름)로 변환한 뒤 메시지를 퍼블리시한다. IMU에서 사용되는 ENU 좌표계는 자북을 기준으로 x(east, forward), y(north, left), z(up)이다.

## (1) 설치
GitHub에서 myAHRS의 드라이버 패키지를 내려받아 설치한다.
```bash
$ cd ~/catkin_ws/src
$ git clone https://github.com/robotpilot/myahrs_driver.git
$ catkin_make
```

## (2) 작동
<span style="background-color: #12B886; color: white">**[ 1 ]**</span> **USB로 기기를 컴퓨터에 연결한다.**
<span style="background-color: #12B886; color: white">**[ 2 ]**</span> **USB 포트 이름을 확인한다.** 보통 허브 없이 바로 USB-5pin 케이블로 컴퓨터에 연결하면 `ttyACM0`로 뜬다.
```bash
$ ls /dev/tty*
```

<span style="background-color: #12B886; color: white">**[ 3 ]**</span> **기기에 실행 권한을 부여한다.**
```bash
$ sudo chmod 777 /dev/tty*
```
<span style="background-color: #12B886; color: white">**[ 4 ]**</span> **기기를 작동시킨다.** 만약 포트 관련 에러가 난다면 `myahrs_driver.launch` 파일의 파라미터에서 포트 이름을 위에서 조회한 이름(`ttyACM1` 등)으로 변경해주어야 한다.
```bash
$ roslaunch myahrs_driver myahrs_driver.launch
	# lauch 파일로, Rviz도 함께 실행된다.
```

![](https://images.velog.io/images/717lumos/post/63bc20a7-40c4-4e22-b662-4ffe7c932368/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202022-01-12%2010-45-29_cr.png)

<span style="background-color: #12B886; color: white">**[ 5 ]**</span> **Rviz로 축을 확인한다.** Rviz는 launch 파일 실행과 동시에 함께 켜질 것이다. 좌측에서 `Axes`, `Imu`의 체크박스를 각각 선택하면 아래 사진처럼 크게 분홍색 화살표가 보일 것이다. 현재 IMU가 가리키고 있는 방향이다.

![](https://images.velog.io/images/717lumos/post/2bb5c716-f6c9-4755-8fc5-24f5116ef675/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202022-01-12%2010-45-51_cr.png)

IMU화살표가 너무 커서 축이 잘 보이지 않는다. `Imu`의 옵션에서 `Alpha` 값을 0.3 정도로 조정하면 축이 보일 것이다.

![](https://images.velog.io/images/717lumos/post/705f547c-d657-48d4-8efb-0d00f090ef67/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202022-01-12%2010-46-14_cr.png)

- - -

# 🌕 노드(Node)
위 패키지로 실행하는 노드는 `/myahrs_driver`이다.

## (1) 토픽(Topic)
노드에서 퍼블리시하는 토픽은 아래와 같다.

|토픽|자료형|내용|
|:---|:---|:---|
|imu/data_raw|sensor_msgs/Imu|각속도와 가속도에 대한 raw 데이터|
|imu/data|sensor_msgs/Imu|orientation, 각속도, 가속도 데이터|
|imu/mag|sensor_msgs/MagneticField|지자기계 데이터|
|imu/temperature|std_msgs/Float64|온도 데이터|

### 토픽 /imu/data
우선 가장 많이 쓰일 `/imu/data`의 값을 살펴보자. 해당 토픽은 IMU의 <span style="color: green">**각속도 센서와 가속도 센서로부터 받아오는 값이다.**</span> 

자료형은 **[sensor_msgs/Imu](http://docs.ros.org/en/melodic/api/sensor_msgs/html/msg/Imu.html)**으로, 토픽 `/imu/data_raw`도 동일한 형식이다.
* **Header `header`**
  * 자료형 [std_msgs/Header Message](http://docs.ros.org/en/noetic/api/std_msgs/html/msg/Header.html)
  * 헤더값으로, 메시지 순서(seq)와 시간(stamp), 프레임 아이디(frame_id)를 담고 있다.
* **geometry_msgs/Quaternion `orientation`**
  * 자료형 [geometry_msgs/Quaternion](http://docs.ros.org/en/melodic/api/geometry_msgs/html/msg/Quaternion.html) : float64 `x`, `y`, `z`, `w`
  * 자세방향?????????????
* **float64[9] `orientation_covariance`**
  * 자료형 float64[9] : float64형의 숫자 9개로 이루어진 배열이다.
  * x, y, z 축에 대한 행우선(row major) orientation 공분산 행렬이다.
* **geometry_msgs/Vector3 `angular_velocity`**
  * 자료형 [geometry_msgs/Vector3](http://docs.ros.org/en/melodic/api/geometry_msgs/html/msg/Vector3.html) : float64 `x`, `y`, `z`
  * x, y, z 축에 대한 각속도 값 [$$\mathrm{rad}/\mathrm{s}$$]
* **float64[9] `angular_velocity_covariance`**
  * 자료형 float64[9] : float64형의 숫자 9개로 이루어진 배열이다.
  * x, y, z 축에 대한 행우선(row major) 각속도의 공분산 행렬이다.
* **geometry_msgs/Vector3 `linear_acceleration`**
  * 자료형 geometry_msgs/Vector3 : float64 `x`, `y`, `z`
  * x, y, z 축에 대한 선가속도 값 [$$\mathrm{m}/\mathrm{s}^{2}$$]
* **float64[9] `linear_acceleration_covariance`**
  * 자료형 float64[9] : float64형의 숫자 9개로 이루어진 배열이다.
  * x, y, z 축에 대한 행우선(row major) 선가속도의 공분산 행렬이다.
* 공분산 첫 번째 요소가 -1이라면 해당 측정은 버린다.

해당 토픽 메시지 예시는 다음과 같다.

```
header:
  seq: 41812
  stamp:  
    secs: 1637586719
    nsecs: 256241647
  frame_id: "imu_link"

orientation: 
  x: -0.808913316208
  y: -0.435244439802
  z: 0.232719446609
  w: 0.319473290984

orientation_covariance: [4.592449e-06, 0.0, 0.0, 0.0, 4.592449e-06, 0.0, 0.0, 0.0, 4.592449e-06]

angular_velocity: 
  x: 0.0127835633439
  y: 0.00745707887733
  z: 0.00639178167193

angular_velocity_covariance: [5.895184e-06, 0.0, 0.0, 0.0, 5.895184e-06, 0.0, 0.0, 0.0, 5.895184e-06]

linear_acceleration: 
  x: -0.97686408796
  y: -7.06311058604
  z: -6.97212800034

linear_acceleration_covariance: [0.0007199025610000001, 0.0, 0.0, 0.0, 0.0007199025610000001, 0.0, 0.0, 0.0, 0.0007199025610000001]
```


### 토픽 /imu/mag
이 토픽은 <span style="color: green">**지자기 센서로부터 받아오는 값이다.**</span> `/imu/data`의 메시지 타입은 **[sensor_msgs/MagneticField](http://docs.ros.org/en/api/sensor_msgs/html/msg/MagneticField.html)**이다.
* **Header `header`**
  * 자료형 [std_msgs/Header Message](http://docs.ros.org/en/noetic/api/std_msgs/html/msg/Header.html)
  * 헤더값으로, 메시지 순서(seq)와 시간(stamp), 프레임 아이디(frame_id)를 담고 있다.
* **geometry_msgs/Vector3 `magnetic_field`**
  * 자료형 geometry_msgs/Vector3 : float64 `x`, `y`, `z`
  * 지자기 센서로부터 받은 값을 Tesla(T) 단위로 하여 x, y, z 축에 대해 나타낸다.
* **float64[9] `magnetic_field_covariance`**
  * 자료형 float64[9] : float64형의 숫자 9개로 이루어진 배열이다.
  * x, y, z 축에 대한 행우선(row major) 지자기 센싱 데이터의 공분산 행렬이다. 0이라면 알 수 없음(variance unknown)이다.
  
아래는 토픽의 예시값이다.
```
header: 
  seq: 109509
  stamp: 
    secs: 1637587396
    nsecs: 451413832
  frame_id: "imu_link"
magnetic_field: 
  x: 0.000173223052979
  y: 0.0003
  z: -2.22205276489e-05
magnetic_field_covariance: [1.07247080196e-11, 0.0, 0.0, 0.0, 1.07247080196e-11, 0.0, 0.0, 0.0, 1.07247080196e-11]
```

## (2) 토픽 및 메시지 확인
그럼 직접 해당 사항들을 살펴보자.

launch 파일이 실행중인 터미널은 그대로 두고, 다른 터미널을 하나 더 열어 rqt 그래프부터 확인하자. 아래 사진은 각각 `Dead sinks`를 체크하지 않은 모습이다.
```bash
$ rqt_graph
```

![](https://images.velog.io/images/717lumos/post/c0365304-7e1a-4978-957a-be67824ce611/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202022-01-12%2010-45-09_cr.png)

또한 토픽들의 메시지 내용을 `rostopic echo` 명령어를 통해 알아보자. 출력 종료는 `ctrl` + `C`이다.
```bash
$ rostopic echo /imu/data
$ rostopic echo /imu/mag
```

## (3) 파라미터

런치 파일에 정의된 파라미터들이다. 특별히 따로 설정해야 할 부분은 없고, 단지 IMU가 연결된 포트 이름인 `port`만 신경써서 변경해주면 된다. 


|파라미터|자료형|default값|설명|
|:---|:---|:---|:---|
|port|string|default|/dev/ttyACM0|IMU를 실행할 포트|
|baud_rate|int|115200|시리얼 기기의 보 레이트(baud rate)|
|frame_id|string|imu_link|출력 메시지의 frame ID|
|parent_frame_id_|string|base_link| tf를 사용하는 frame_id의 부모 frame ID|
|linear_acceleration_stddev|double|0.026831|$$\mathrm{m}/\mathrm{s}^{2}$$ 단위의 선가속도 공분산 대각 요소의 제곱근|
|angular_velocity_stddev|double|0.002428|$$\mathrm{rad}/\mathrm{s}$$ 단위의 각속도 공분산 대각 요소의 제곱근|
|magnetic_field_stddev|double|0.00000327486| T(Tesla) 단위의 지자기계 공분산 대각 요소의 제곱근|
|orientation_stddev|double|0.002143| 라디안 단위의 자세 방향 공분산 대각 요소의 제곱근|


- - -

# 🧭 캘리브레이션(Calibration)
자기계(compass)는 AHRS의 yaw 각도를 측정하는 데 사용되는데, 이때 기기의 캘리브레이션(calibration)이 필요하다.

자기계의 측정은 왜곡에 영향을 받는데, 이 왜곡에는 hard iron 왜곡과 soft iron 왜곡이 있다. hard iron 에러는 주변에 자석, 전선 등 자기장이 있을 경우 발생하고, 이는 측정 오프셋 에러(measurement offset error)를 일으킨다. soft iron 에러는 주변에 강자성 물체(ferromagnetic materials)가 있어 지구 자기장의 밀도를 왜곡시키고, 이는 스케일링 오프셋 에러(scaling offset errors)를 일으킨다.

myAHRS+ 제조사에서 제공하는 프로그램에 따라 캘리브레이션을 수행하는 방법은 [YouTube 영상](https://youtu.be/d_jPEczPehw)에서 확인할 수 있다.

- - -

# 참고 문헌
* [GitHub myAHRS_plus](https://github.com/withrobot/myAHRS_plus)
* ["myahrs_driver," ROS Wiki](http://wiki.ros.org/myahrs_driver)
* [WITHROBOT myAHRS+](http://withrobot.com/sensor/myahrsplus/)
* [GitHub myahrs_driver](https://github.com/robotpilot/myahrs_driver)
* ["Attitude and heading reference system," Wikipedia](https://en.wikipedia.org/wiki/Attitude_and_heading_reference_system)