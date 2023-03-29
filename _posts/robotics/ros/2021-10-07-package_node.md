---
title:  "[Tutorial] 패키지 빌드와 노드 작성"
excerpt: "ROS Tutorial 4: ROS Package 만들기 및 Node를 Python/C++로 작성해보기"

categories:
  - Robotics
  - ROS
tags:
  - Roboticmake
  - ROS
date: 2021-10-07
last_modified_at: 2021-10-07
order: 4

---


# 👏 들어가기 전에
본격적인 실습에 들어갈 것이다. 갖춰진 실습 환경에서 직접 하나하나 따라해보길 바란다.
본 포스팅에서는 <span style="color: green; font-weight:bold">Python과 C++ 두 가지 버전</span> 모두를 다루고 있으니, 본인이 원하는 언어의 스크립트로 보면 된다.

본문에 나오는 개념, 단어들이 생소하다면 앞선 포스팅들을 보면서 따라오자!

- - -

# ✅ ROS의 빌드 시스템
<span style="background-color: #e9eeb6; font-weight:bold">Catkin(캐킨)</span>은 ROS의 **빌드 시스템**이다.
<span style="color: green; font-weight:bold">CMake(Cross Platform Make)를 기본적으로 이용하여, 패키지 폴더에 `CMakeList.txt`라는 파일에 빌드 환경을 기술해야 한다.</span> ROS에서는 CMake를 ROS에 맞게 수정해 특화된 캐킨 빌드 시스템을 만들었으며, ROS관련 빌드, 패키지 관리, 패키지 간 의존관계 등을 편리하게 사용할 수 있게 되었다.

- - -

# 🔧 패키지 빌드 과정
1. 패키지 생성
2. 패키지 설정 파일(package.xml) 수정
3. 빌드 설정 파일(CMakeList.txt) 수정
4. 메시지 파일 작성
5. 소스 코드 작성
6. 빌드 전 처리
7. 노드 실행

- - -

## 1. 패키지 생성
가장 먼저 패키지를 생성한다. 도시락을 만들기 위해 도시락 통을 준비하는 것과 마찬가지라 보면 된다.

터미널을 켜고, `/catkin_ws/src`로 이동한 뒤 명령어를 입력한다. `catkin_create_pkg [패키지 이름] [의존성 패키지]`
```
catkin_create_pkg test_pkg std_msgs rospy roscpp
```

![](https://images.velog.io/images/717lumos/post/71447e17-d42e-4433-a2db-f1318534c7bc/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202022-01-06%2023-03-46.png)

* 의존생 패키지는 해당 패키지에서 사용할 의존성을 기술한다. 여기서는 `std_msgs`(주고 받을 메시지 타입 위함), `rospy`(python 사용 위함), `roscpp`(C++ 사용 위함)
* 의존성 패키지는 여러 개를 동시선언할 수 있고, 추후에 package.xml에서 추가/변경할 수 있다
* 위와 같이 사용자가 패키지 작성 시, 캐킨 빌드 시스템에 필요한 `CMakeList.txt`, `package.xml`, 관련 폴더를 생성한다.
* 패키지 이름에는 공백이 있어선 안 되며, 소문자를 사용하고, 언더바(`_`)를 사용해 단어를 붙인다

해당 명령 직후 `~/catkin_ws/src/패키지명` 폴더 내에 생성되는 파일 및 폴더는 아래와 같다. 추후 사용자의 필요에 따라 `/launch`, `/msg` 등의 폴더를 추가적으로 생성할 수 있다. launch는 [추후 이어질 포스팅](https://winterbloooom.github.io/robotics/ros/2021/10/11/roslaunch.html)에서 다룬다.


| 폴더, 파일 | 설명 |
|:----------|:----------|
| /include | 헤더 파일 |
| /src | 코드 소스 파일 |
| CMakeList.txt | 빌드 설정 파일 |
| package.xml | 패키지 설정 파일 |

![](https://images.velog.io/images/717lumos/post/6dae196a-b02b-4bca-a04c-06ce10f72bcf/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202022-01-06%2023-04-07.png)
- - -

## 2. 패키지 설정 파일(package.xml) 수정
<span style="color: green; font-weight:bold">`package.xml` 는 패키지의 이름, 저작사, 라이선스, 의존성 패키지 등을 기술하고 있는 파일로, ROS의 필수 설정 파일의 하나</span>이다.

패키지 폴더에서 `package.xml`파일을 찾아 연다면 아래와 같은 내용을 볼 수 있을 것이다.

![](https://images.velog.io/images/717lumos/post/9c14e05e-d9af-4827-932f-ce041c58239b/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202022-01-06%2022-45-40.png)

주 내용은 다음과 같다.
* 기본 구조
  * `<?xml>`: 문서 문법을 정의하는 문구. xml 버전을 나타냄
  * `<package>`: 해당 태그로 감싼 부분이 ROS 패키지 설정 부분임
* 패키지 정보
  * `<name>`: 패키지의 이름. 패키지 생성시 입력한 이름이 적용되며, 사용자의 임의 변경이 가능함
  * `<version>`: 패키지 버전으로, 자유로운 지정이 가능하다,
  * `<description>`: 패키지에 대한 설명으로, 2-3문장으로 입력한다.
  * `<maintainer>`: 패키지 관리자의 이름과 메일 주소(태그의 옵션 email을 이용)를 입력한다.
  * `<license>`: 라이선스를 기재한다.(e.g. GPL, BSD, ASL)
  * `<url>`: 패키지를 설명하는 웹페이지, 버그 관리, 저장소 등의 주소
  * `<author>`: 패키지 개발에 참여한 개발자의 이름과 이메일 주소를 적는다. 여러 명의 개발자의 경우 바로 다음줄에 해당 태그를 추가하며 입력한다.
* 의존 패키지(Dependency)
  * `<buildtool_depend>`: 빌드 시스템의 의존성이며, Catkin 빌드 시스템을 이용한다면 `catkin`을 입력한다.
  * `<build_depend>`: 패키지를 빌드할 때 의존하는 패키지 이름을 입력한다.
  * `<run_depend>`: 패키지를 실행할 때 의존하는 패키지 이름을 입력한다.
  * `<test_depend>`: 패키지를 테스트할 때 의존하는 패키지 이름을 입력한다.
* 메타패키지(Metapacakge)
  * `<export>`: ROS에서 명시하지 않은 태그명을 사용할 때 주로 쓰인다.
  * `<metapackage>`: export 태그 안에서 사용하는 공식적인 태그 중 하나로, 현재 패키지가 메타패키지일 경우 선언한다.
  
해당 내용을 맞게 바꾸어준다. 주석과 당장 필요 없는 부분을 지운다. 패키지 생성 당시 의존성으로 `std_msgs`, `rospy`, `roscpp`를 입력해주었으므로 자동적으로 `<build_depend>`, `<build_export_depend>`, `<exec_depend>`가 채워져 있다. <span style="color: green; font-weight:bold">만약 패키지 생성 당시 명령어 옵션으로 추가하지 못했거나 추후 추가한다하면 해당 의존성 패키지를 이 파일에 입력해주면 된다.</span>

아래 코드는 필자의 예시이며, 이메일 주소 등은 본인의 것으로 바꿔보자. 이메일 주소, 라이선스 등은 패키지를 공개/배포할 경우 필요하며, 그렇지 않다면 굳이 바꿀 필요는 없다.


```xml
<?xml version="1.0"?>
<package format="2">
  <name>my_example_pkg</name>
  <version>0.0.0</version>
  <description>The my_example_pkg package</description>

  <maintainer email="717lumos@gmail.com">Han EunGi</maintainer>

  <license>BSD</license>

  <url type="website">https://github.com/EunGiHan</url>
  <url type="website">https://velog.io/@717lumos</url>

  <author email="717lumos@gmail.com">Han EunGi</author>

  <buildtool_depend>catkin</buildtool_depend>
  <build_depend>roscpp</build_depend>
  <build_depend>rospy</build_depend>
  <build_depend>std_msgs</build_depend>
  <build_export_depend>roscpp</build_export_depend>
  <build_export_depend>rospy</build_export_depend>
  <build_export_depend>std_msgs</build_export_depend>
  <exec_depend>roscpp</exec_depend>
  <exec_depend>rospy</exec_depend>
  <exec_depend>std_msgs</exec_depend>

  <export>

  </export>
</package>
```
  
- - -

## 3. 빌드 설정 파일(CMakeList.txt) 수정
<span style="color: green; font-weight:bold">`CMakeList.txt` 는 빌드 환경을 기술하고 있는 파일로, 실행 파일 생성과 의존성 패키지 우선 빌드, 링크 생성 등을 설정할 수 있다.</span>

처음 보이는 CMakeList.txt 파일은 아래와 같다. 매우 긴 주석이 있으며, 패키지 생성 당시 파라미터로 넣었던 의존성 패키지에 따른 내용이 들어가 있다.

![](https://images.velog.io/images/717lumos/post/85473243-30e2-463c-a68f-ec8138a996d9/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202022-01-06%2022-47-38.png)

코드의 주석을 일부는 삭제하고 일부는 풀어 각각이 의미하는 바를 아래에 적어두었다. 지금 바로 외울 필요는 없다. 필요한 경우 찾아서 추가하는 식으로 진행하는 것이 좋다. ~~속 편하다는 쪽이 가까울 듯~~

```cmake
# 운영체제에 설치된 cmake의 최소 요구 버전
cmake_minimum_required(VERSION 3.0.2)

# 패키지의 이름으로, package.xml에서 입력한 패키지 이름을 그대로 사용
project(test_pkg)

# 캐킨 빌드할 시 요구되는 구성 요소 패키지. 사용자가 만든 패키지가 의존하는 다른 패키지를 먼저 설치하는 옵션
find_package(catkin REQUIRED COMPONENTS
  roscpp
  rospy
  std_msgs
)

# ROS 이외의 패키지를 사용하는 예: Boost를 사용할 때 system 패키지를 설치하도록 함
find_package(Boost REQUIRED COMPONENTS system)

# 파이썬을 이용하기 위해 rospy를 사용할 때 설정하는 옵션. 파이썬 설치 프로세스인 setup.py를 부르는 역할
catkin_python_setup()

# 메시지 파일을 추가
# FILES: 현재 패키지 폴더의 msg 폴더 안의 .msg 파일들을 참조해 헤더 파일(.h)를 자동으로 생성한다는 의미
# 만약 새 메시지를 만든다면 msg 폴더를 만든 뒤 그 안에 있는 메시지 파일 이름을 입력함. 여기에서는 MyMessage1.msg 등이 그 예.
add_message_files(
  FILES 
  MyMessage1.msg
  MyMessage2.msg
)

# 사용하는 서비스 파일을 추가. 방식은 메시지 파일과 같으며, 사용하려면 srv 폴더를 만든 뒤 해당 파일 이름을 입력해둬야 한다.
add_service_files(
  FILES
  MyService.srv
)

# 사용하는 서비스 파일을 추가. 방식은 메시지, 서비스 파일과 같다.
add_action_files(
  FILES
  Action1.action
  Action2.action
)

# 의존하는 메시지를 설정
# DEPENDENCIES: 아래에 해당하는 메시지 패키지를 사용한다는 의미
# std_msgs, sensor_msgs가 그 예시
generate_messages(
  std_msgs 
  sensor_msgs
)

# 캐킨 빌드 옵션
## INCLUDE: 뒤에 설정한 패키지 내부 폴더인 include의 헤더 파일을 사용함
## LIBRARIES: 뒤에 설정한 패키지의 라이브러리를 사용함
## CATKIN_DEPENDS: 의존하는 패키지 지정
## DEPENDS: 시스템 의존 패키지
catkin_package(
#  INCLUDE_DIRS include
#  LIBRARIES test_pkg
#  CATKIN_DEPENDS roscpp rospy std_msgs
#  DEPENDS system_lib
)

# include 폴더 지정
include_directories(
  ${catkin_INCLUDE_DIRS} # 각 패키지 내의 include 폴더를 의미. 이 안의 헤더파일을 이용할 것. 
  # 사용자가 추가할 때는 이 밑의 공간 이용
)

# 빌드 후 생성할 라이브러리. C++을 사용할 경우!
add_library(${PROJECT_NAME}
  src/${PROJECT_NAME}/test_pkg.cpp
)

# 해당 라이브러리 및 실행파일을 빌드하기 전, 생성해야 할 의존성이 있는 메시지와 dynamic reconfigure이 있다면 우선으로 수행하도록 함
add_dependencies(${PROJECT_NAME} ${${PROJECT_NAME}_EXPORTED_TARGETS} ${catkin_EXPORTED_TARGETS})

# 빌드 후 생성할 실행파일에 대한 옵션 지정
## `__실행 파일 이름__` `__참조할 파일__` 순서대로 기재
## 복수 개의 참조 .cpp 파일이 있을 경우 한 괄호 뒤에 연속적으로 기재
## 생성할 실행파일이 2개 이상일 경우 add_executable 항목을 추가함
add_executable(${PROJECT_NAME}_node src/test_pkg_node.cpp)

# 지정 실행 파일을 생성하기 전, 링크해야 하는 라이브러리와 실행파일을 링크함
target_link_libraries(${PROJECT_NAME}_node
  ${catkin_LIBRARIES}
)
```

- - -

## 4. 메시지 파일 작성
새로운 메시지 파일(`.msg`)를 만들고 이를 사용해 노드를 이용한 통신을 해보자. 커스텀 메시지를 만드는 자세한 내용은 [추후 이어질 포스팅](https://velog.io/@717lumos/ROS-msg%EB%A9%94%EC%8B%9C%EC%A7%80-%EB%A7%8C%EB%93%A4%EA%B8%B0)에서 다루게 될 것이나, 오늘은 패키지를 어떻게 수정하는 가를 볼 것이므로 따라만 와 보자.

* 우선, 패키지 폴더 내 msg 폴더(`~/test_pkg/msg`)를 만든다.
* 텍스트 편집기 혹은 VS Code 등을 열어 아래 내용을 입력한다.

```
time stamp
int32 data
```

* 이 파일을 msg 폴더에 메시지 파일(`test_msg.msg`)로 저장한다. 확장자를 반드시 `.msg`까지 입력해 저장해야 한다.

![](https://images.velog.io/images/717lumos/post/52762d99-9078-49cb-a196-5c22cb87ded1/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202022-01-06%2023-07-11.png)

![](https://images.velog.io/images/717lumos/post/979a0dc6-64ca-4563-a3bd-9dce7515b113/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202022-01-06%2023-07-06.png)

> ❗️ <span style="background-color: yellow; font-weight:bold">메시지 타입의 대표적 예</span>
메시지 기본 타입: `time`, `int32`, `bool`, `int8`, `int16`, `float32`, `string`, `duration` 등
ROS 사용 빈도 많은 메시지를 모아둔 타입: `common_msgs` 등


- - -

## 5. 소스 코드 작성
해당 메시지를 이용하여 <span style="color: green; font-weight:bold">토픽을 송신하는 **Publisher(퍼블리셔) 노드**와 토픽을 수신하는 **Subscribe(서브스크라이버) 노드**</span>를 각각 만들어보자.

필자는 처음 ROS를 공부할 때 python 파일로만 소스 코드를 작성했다. 그러나 C/C++를 바탕으로 한 소스코드가 GitHub 등에 많이 나와있고, 각종 센서나 라이브러리도 그를 기반으로 하는 경우가 많으므로, C++ 코드 역시 공부해두어 나쁠 건 없다고 생각한다.

### C++ 버전
* 패키지 폴더 내 src 폴더(`~/test_pkg/src`)에 퍼블리셔의 .cpp 파일(`talker.cpp`)을 추가한 뒤 내용을 입력한다. 또는 내용을 입력한 뒤 저장을 `/src` 폴더에 해도 된다. ~~모로 가도 한양만 가면 된다.~~

  ```cpp
  #include "ros/ros.h"			// ROS 기본 헤더 파일
  #include "test_pkg/test_msg.h"		// 메시지 파일의 헤더. 빌드 후 자동 생성됨

  int main(int argc, char **argv)
  {
    ros::init(argc, argv, "talker");     // 노드 이름 초기화
    ros::NodeHandle nh;                  // ROS 시스템과 통신을 위한 노드 핸들
    
    // 퍼블리셔 선언
    //// test_pkg에 정의된 test_msg 메시지 메시지 파일을 이용함
    //// 만약 표준 메시지를 사용한다면 그에 맞게 사용해야 함. (예) <std_msgs::String>
    //// 토픽 이름: chatter, 큐 사이즈: 100개
    ros::Publisher chatter_pub = nh.advertise<test_pkg::test_msg>("/chatter", 100);

    // 루프 주기를 10hz로 설정. 1초에 10번 루프를 돌며 메시지를 송신함.
    ros::Rate loop_rate(10);


    test_pkg::test_msg msg;		// 메시지 변수 선언
    int count = 0;			// 코드 내에서 사용할 변수 선언

    while (ros::ok())			// 종료 전까지 계속 반복 수행함
    {
      msg.stamp = ros::Time::now();	// 메시지 내 stamp 메시지에 현 시각 입력
      msg.data  = count;			// 메시지 내 data 메시지에 count 변수값 입력

      ROS_INFO("send time(sec) = %d", msg.stamp.sec);
      ROS_INFO("send msg = %d", msg.data);

      chatter_pub.publish(msg);	// 메시지를 퍼블리시함(토픽으로 전송)

      loop_rate.sleep();		// 정해준 주기만큼 일시정지(sleep)

      ++count;
    }

    return 0;
  }
  ```

* 같은 방법으로 서브스크라이버 .cpp 파일(`/listener.cpp`) 역시 작성한다.

  ```cpp
  #include "ros/ros.h"
  #include "test_pkg/test_msg.h" 

  // 메시지 콜백 함수 선언
  //// 처리할 메시지를 포인터로서 파라미터로 전달. 포인터의 자료형은 메시지의 타입을 명시
  void chatterCallback(const test_pkg::test_msg::ConstPtr& msg)
  {
    ROS_INFO("recieve time(sec) = %d", msg->stamp.sec);
    ROS_INFO("recieve msg = %d", msg->data);
  }

  int main(int argc, char **argv)
  {
    ros::init(argc, argv, "listener");		// 노드 이름 초기화

    ros::NodeHandle nh;

    // 서브스크라이버 선언
    //// 토픽 이름: chatter(publish 노드에서 주는 토픽), 큐 사이즈: 100개
    //// 콜백 함수 이름: chatterCallback(위에서 정의함, 여기서 받은 토픽을 처리함)
    ros::Subscriber sub = nh.subscribe("/chatter", 100, chatterCallback);

    ros::spin();		// 큐에 요청된 콜백함수를 처리하며, 프로그램 종료시까지 반복함

    return 0;
  }
  ```

### Python 버전
* 패키지 폴더 내 src 폴더(`~/test_pkg/src`)에 퍼블리셔의 .py 파일(`talker_py.py`)을 추가한 뒤 내용을 입력한다.

  ```python
  #!/usr/bin/env python	# 파이썬을 쓴다면 반드시 달아주자
  #-*- coding:utf-8 -*-	# 한글 주석을 달기 위해 사용한다.

  import rospy				# ROS 라이브러리
  from test_pkg.msg import test_msg	# 패키지의 메시지 파일

  def main():
      # 퍼블리시 노드 초기화
      ## 노드 이름 talker
      rospy.init_node('talker', anonymous=True)
      
      # 퍼블리셔 변수
      ## 퍼블리시 토픽 이름 chatter, 메시지 타입 test_msg
      pub = rospy.Publisher('chatter', test_msg, queue_size=10)
      
      # 10헤르츠마다 반복(변수=rate)
      rate = rospy.Rate(10) # 10hz

      msg = test_msg()	# 메시지 변수 선언
      count = 0		# 코드에서 사용할 변수 선언

      # 중단되거나 사용자가 강제종료(ctrl+C) 전까지 계속 실행
      while not rospy.is_shutdown():
          msg.stamp = rospy.Time.now()	#현재 시각 담음
          msg.data = count		# count 변수 값 담음

          # 터미널에 출력
          rospy.loginfo("send time(sec) = %d", msg.stamp.secmake)
          rospy.loginfo("send msg = %d", msg.data)
          
          # 메시지를 퍼블리시
          pub.publish(msg)
          
          # 정해둔 주기(hz)만큼 일시중단
          rate.sleep()

          count += 1

  if __name__ == '__main__':
      try:
          main()
      except rospy.ROSInterruptException:
          pass
  ```

* 패키지 폴더 내 src 폴더(`~/test_pkg/src`)에 서브스크라이버의 .py 파일(`listener_py.py`)을 추가한 뒤 내용을 입력한다.

  ```python
  #!/usr/bin/env python
  #-*- coding:utf-8 -*- 

  import rospy
  from test_pkg.msg import test_msg

  # 퍼블리셔 노드로부터 토픽을 받아들이는 콜백 함수
  def callback(data):
      # 받은 내용(data)를 터미널에 출력
      rospy.loginfo("recieve time(sec) = %d", data.stamp.secmake)
      rospy.loginfo("recieve msg = %d", data.data)
      
  def main():
      # 노드 초기화. 이름은 listener
      rospy.init_node('listener', anonymous=True)

      # 특정 토픽(chatter)를 callback이라는 이름의 함수로 받아들이며, 메시지 타입은 test_msg
      rospy.Subscriber("chatter", test_msg, callback)

      rospy.spin()

  if __name__ == '__main__':
      main()
  ```

- - -

## 6. 빌드 전 처리
### C++ 버전
* `package.xml` 파일 속 다음 부분을 추가한다.

  ```xml
    <build_depend>message_generation</build_depend>
    <!--<run_depend>message_runtime</run_depend>-->
        <!--빌드 시 <exec_depend>가 에러 난다면 <run_depend>로-->
    <exec_depend>message_runtime</exec_depend>
  ```
> 만약 다른 패키지의 메시지 파일을 쓴다면 `<build_depend>메시지 파일이 있는 패키지 이름</build_depend>`, `<run_depend>메시지 파일이 있는 패키지 이름</run_depend>`도 추가해야 한다.

* `CMakeList.txt` 파일 속 다음 부분을 수정한다.

  ```cmake
  ### 1. find_package에 [essage_generation] 추가
  find_package(catkin REQUIRED COMPONENTS
    roscpp
    rospy
    std_msgs
    message_generation
  )

  ### 2. add_message_files의 주석 풀고, 예시문은 지운 뒤 만들어둔 메시지 파일 이름으로 변경
  add_message_files(
    FILES
    test_msg.msg
  )

  ### 3. generate_messages 주석 풀기
  generate_messages(
    DEPENDENCIES
    std_msgs
  )

  ### 4. catkin_package 주석 풀기 & [message_runtime]추가
  catkin_package(
    CATKIN_DEPENDS roscpp rospy std_msgs message_runtime
  )

  ### 5. include_directories 주석 풀기
  include_directories(
    include
    ${catkin_INCLUDE_DIRS}
  )

  ### 6. add_executable 추가. src폴더에 있는 talker.cpp, listener.cpp를 talker, listener이라는 실행파일로 한다는 이야기.
  add_executable(talker src/talker.cpp)
  target_link_libraries(talker
    ${catkin_LIBRARIES}
  )
  add_executable(listener src/listener.cpp)
  target_link_libraries(listener
    ${catkin_LIBRARIES}
  )
  ```

* 수정 사항을 포함해 패키지를 빌드한다.

  ```bash
  $ catkin_make		#예약어를 설정해놓았다면 cm
  ```

빌드한 결과물의 생성 위치와 내용은 다음과 같다.
- `~/catkin_ws/build`: 캐킨 빌드에서 사용된 설정 내용
- `~/catkin_ws/devel/lib/test_pkg`: 실행 파일
- `~/catkin_ws/devel/include/test_pkg`: 메시지 파일로부터 자동 생성된 메시지 헤더 파일

### Python 버전
* `package.xml` 파일 속 다음 부분을 추가한다.

  ```xml
    <build_depend>message_generation</build_depend>
    <exec_depend>message_runtime</exec_depend>
  ```

* `CMakeList.txt` 파일 속 다음 부분을 주석을 풀거나 수정한다.

  ```cmake
  # message_generation을 추가한다.
  find_package(catkin REQUIRED COMPONENTS
    roscpp
    rospy
    std_msgs
    message_generation
  )

  # add_message_files의 주석을 풀고 수정한다.
  add_message_files(
    FILES
    test_msg.msg
  )

  # generate_messages의 주석을 푼다.
  generate_messages(
    DEPENDENCIES
    std_msgs
  )

  # LIBRARIES, CATKIN_DEPENDS의 주석을 풀고, message_runtime을 추가한다.
  catkin_package(
  #  INCLUDE_DIRS include
    LIBRARIES test_pkg
    CATKIN_DEPENDS roscpp rospy std_msgs message_runtime
  #  DEPENDS system_lib
  )

  # 주석을 풀고 스크립트 이름을 입력한다. talker_py.py, listener.py를 파이썬으로 사용한다는 이야기
  catkin_install_python(PROGRAMS
    src/talker_py.py
    src/listener_py.py
    DESTINATION ${CATKIN_PACKAGE_BIN_DESTINATION}
  )
  ```

* 수정 사항을 포함해 패키지를 빌드한다.

  ```bash
  $ catkin_make		#예약어를 설정해놓았다면 cm
  ```
* 파이썬 스크립트 두 개 각각에 대해 권한을 허용한다.

  ```shell
  $ chmod +x talker_py.py
  $ chmod +x listener_py.py
  ```

- - -

## 7. 노드 실행
한 터미널에 `roscore`를 실행해두고 다른 터미널 각각에 다음의 명령어를 실행한다. subscribe를 먼저 켜는 것이 낫다.
```python
$ rosrun test_pkg listener
	#python이라면 $ rosrun test_pkg listener_py.py

$ rosrun test_pkg talker
	#python이라면 $ rosrun test_pkg talker_py.py
```

![](https://images.velog.io/images/717lumos/post/3f87a207-3b90-4865-a309-b68497b85335/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202022-01-07%2001-01-13.png)

현재 퍼블리시 중인 토픽의 목록을 확인하려면 `rostopic list`를, 특정 토픽의 내용(메시지)를 확인하려면 `rostopic echo /토픽 이름`을 다른 터미널 창에 입력하면 된다.
또한 통신 상태를 확인하려면, `rqt_graph` 명령어를 수행해 시각화가 가능하다

![](https://images.velog.io/images/717lumos/post/3e5b5b3b-e6fc-4e3c-8e9a-816eb44b278e/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202022-01-07%2000-36-37.png)
- - -

# 참고 문헌
* [CMakeLists, "ROS Wiki"](<http://wiki.ros.org/catkin/CMakeLists.txt/>)
* [Creating Msg And Srv, "ROS Wiki"](http://wiki.ros.org/ROS/Tutorials/CreatingMsgAndSrv#Creating_a_msg)
* [WritingPublisherSubscriber(C++), "ROS Wiki"](http://wiki.ros.org/ROS/Tutorials/WritingPublisherSubscriber%28c%2B%2B%29#roscpp_tutorials.2FTutorials.2FWritingPublisherSubscriber.Building_your_nodes)
* [Writing Publisher Subscriber(python), "ROS Wiki"](http://wiki.ros.org/ROS/Tutorials/WritingPublisherSubscriber%28python%29)
* 표윤석, 조한철, 정려운, 임태훈. ROS 로봇 프로그래밍. 루비페이퍼