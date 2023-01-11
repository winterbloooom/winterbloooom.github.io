---
title:  "[Tutorial] ROS 기본 개념"
excerpt: "ROS Tutorial 1: ROS 기본 개념"

categories:
  - Robotics
  - ROS
tags:
  - Robotics
  - ROS
date: 2021-12-26
last_modified_at: 2021-12-26
order: 1


---

새로 알게되거나 보충할 부분을 찾아 계속 업데이트할 예정입니다.
{: .notice--info}

# 🤔0. ROS를 공부하기에 앞서
“ROS”를 ‘로스’라고 읽어야 할지, ‘알오에스’라고 읽어야 할지 헷갈렸던 것이 채 1년도 되지 않았다. 그러니 ROS를 공부한 지가 아직 1년이 되지 않았단 뜻이다. 알고 있는 것도 많거나 깊지 않고 기초 개념도 부족한, 아직 배워가는 학생이다.
당장 ROS를 사용해야 했기에 마구잡이로 배운 경향이 있어, 다시 개념을 정립하는 겸 포스팅을 한다. ROS를 처음 배우는 사람이라면 일주일, 아니면 한 달쯤 뒤에 이 글을 다시 읽길 권한다. 또한 ROS를 이미 접한 사람이라도 한 번쯤 읽어보는 것도 나쁘지 않다 생각한다. 처음엔 낯설어서 무슨 소리인지 그냥 넘겼던 단어들이 차츰 눈에 들어오기 시작할 것이다. 어지러웠던 머릿속이 정리되는 것이 공부의 큰 발전이라 생각한다.

# 💻1. 로봇 소프트웨어 플랫폼
기계는 하드웨어와 이를 움직이는 소프트웨어로 구성되어 있고, 로봇을 구동하는 데에도 당연히 둘이 다 필요하다. **로봇 소프트웨어 플랫폼**은 로봇 응용프로그램의 개발을 위한 하드웨어 추상화, 하위 디바이스 제어와 센싱 및 인식, 위치 추정, 내비게이션 등의 기능, 패키지 관리, 라이브러리, 개발 도구와 디버깅 도구 등을 포함한다.
로봇 소프트웨어는 다양하다. 하드웨어 역시 제조사마다 다르다. 이러한 복잡성과 다양성을 해결하기 위해 로봇 소프트웨어 플랫폼이 만들어져, 여러 연구자들이 협업하도록 한다.

> **하드웨어 추상화**
위키피디아의 첫 줄 설명을 직역하자면 ‘프로그래밍 인터페이스를 통해 하드웨어 리소스에 접근할 수 있는 프로그램을 제공하는 소프트웨어 속 루틴의 집합’이다. (sets of routines in software that provide programs with access to hardware resources through programming interfaces). 
단순히 하면, 하드웨어에 상관없이(독립적으로) 프로그래밍하게 돕는다는 뜻이다. 키보드도 여러 종류와 제품이 있는데 이런 하드웨어 하나하나마다 따로 프로그래밍하는 것이 아니라 ‘키보드’ 자체에 대해서만 프로그래밍할 수 있도록 말이다.

이러한 로봇 소프트웨어 플랫폼에는 OpenRTM, OROCOS, OPRoS 등 여러 종류가 있으며 그 중 하나가 ROS이다.
로봇 소프트웨어 플랫폼, 특히 ROS의 필요성은 다음과 같다.
* **프로그램의 재사용성**: 개발할 부분만 개발을 하고, 다른 기능들은 필요한 패키지를 다운 받아 사용할 수 있으며, 공유가 가능하다
* **통신 기반 프로그램**: 하나의 서비스를 위해 하드웨어 드라이버, 센싱, 인식, 동작 등을 각각의 프로세서의 목적에 따라 작게 나누고(**노드화** 또는 **컴포넌트화**), 이 최소 실행 단위인 **노드**는 데이터를 플랫폼 상에서 주고받는다. 따라서 하드웨어 의존성을 낮출 수 있으며, 이러한 네트워크 프로그래밍은 원격 제어를 용이하게 하고, 노드로 나누어진 덕분에 작은 단위로 디버깅할 수 있다.
* **개발 도구 지원**: 디버깅, GUI(예: rqt), 3차원 시각화 도구(예: Rviz)를 지원한다. 정해진 메시지 형식에 맞추기만 하면 된다.
* **커뮤니티**: 자발적으로 많은 패키지들이 개발 및 공유되고 있고, 사용법이 설명된 Wiki 페이지들이 있다. 많은 개발자 및 사용자들이 원활하게 소통하고 있다.
* **로봇 생태계 구성**: 하드웨어 기술을 통합할 운영체제가 필요하다. 다양한 소프트웨어가 필요하고, 사용자도 잘 사용해야 한다. 모두가 따로 논다면 발전이 매우 더딜 것이다. 플랫폼은 개발 및 사용의 생태계를 갖출 수 있도록 한다. 
스마트폰의 하드웨어가 어떻게 구성되었는지 알지 못해도 수많은 개발자들은, 심지어 중고등학생들도 어플리케이션을 잘만 개발한다. 같은 원리이다. 로봇 소프트웨어 플랫폼을 이용하면 로봇 하드웨어가 각각 달라도 프로그래밍이 가능하다.

- - -

# 🛠2. ROS란?
## 2-1. ROS 
**Robot Operating System**의 약자로, 오픈 로보틱스(Open Robotics, 구 OSRF)에서 개발하고 있다. 거북이(Turtle)를 심볼로 사용한다.
ROS의 사용법과 관련 패키지에 관한 설명 및 튜토리얼을 담고 있는 **ROS Wiki**에서는, ROS를 아래와 같이 설명하고 있다.

> ROS is an open-source, meta-operating system for your robot. It provides the services you would expect from an operating system, including hardware abstraction, low-level device control, implementation of commonly-used functionality, message-passing between processes, and package management. It also provides tools and libraries for obtaining, building, writing, and running code across multiple computers.

대강 위에 설명한 것과 일치하는 내용이다. 간추리자면, **기존의 전통적 운영체제를 이용 + 하드웨어 추상화+ 이기종(heterogeneous computing) 하드웨어 적용 + 로봇 특화 개발환경 제공**을 하는 로봇 소프트웨어 플랫폼이다.

## 2-2. 메타 운영체제
위 설명에서 **메타 운영체제(Meta-Operating System)**이라는 단어가 나온다. 메타 인지, 메타버스 등의 단어에서 ‘메타’라는 단어가 종종 쓰인다. ‘사이에, 넘어서, 위에’ 등의 뜻으로 이해하는 것이 편리하다. 
운영체제(Operating System, OS)는 컴퓨터로 따지면 윈도우(Windows), 맥(Mac OS), 리눅스(Linux) 등이 있고, 스마트폰으로 따지면 iOS, 안드로이드(Android) 등이 있다.
메타 운영체제는 전통적인 운영체제 위에 설치되어, 어플리케이션과 분산 컴퓨팅 자원 간의 가상화 레이어로 스케줄링, 로드, 에러 처리 등을 지원한다. (정확한 정의는 없다.) 
ROS는 주로 리눅스 배포판 중 하나인 우분투(Ubuntu) 위에 설치되어, 프로세스 관리 시스템, 파일 시스템, 유저 인터페이스, 프로그램 유틸리티(컴파일러, 스레드 모델) 등 전통적 운영체제에서 제공하는 기능을 사용한다. 뿐만 아니라 로봇 응용프로그램에 필요한 기능 – 이기종 하드웨어 간 데이터 통신, 스케줄링, 에러 처리 등 – 을 라이브러리 형태로 제공한다.([미들웨어(Middelware)](https://en.wikipedia.org/wiki/Middleware) 또는 [소프트웨어 프레임워크(Software Framework)](https://en.wikipedia.org/wiki/Software_framework))
또한 다른 운영체제, 하드웨어, 프로그램 간 통신도 가능하다. 따라서 우분투와 아두이노, 안드로이드, 또다른 우분투 등의 데이터 송수신이 가능한 것이다.

> **리눅스(Linux), 우분투(Ubuntu)**
리눅스는 1991년 리누스 토발즈가 개발한 유닉스 계열의 오픈소스 운영체제 계열이다. 펭귄 마스코트를 떠올리면 된다.(턱스) 
**리눅스 배포판**은 리눅스를 기반으로 한 운영체제를 말한다. 리눅스 커널, GNU 소프트웨어, 프리 소프트웨어 등으로 구성된다. 유명한 배포판에는 우분투, 수세 리눅스, 데비안, 페도라 등이 있다.
우분투는 기업 차원에서 개발 및 배포되는 운영체제이다. 데비안 리눅스에 기반하며, 개인 데스크탑과 노트북에 가장 인기 있는 배포판이다. 2021년 12월 기준 20.04 버전이 가장 최신이다.

## 2-3. 주요 특징
이제부턴 로봇 소프트웨어 플랫폼 개념보다는 ROS 특징 자체를 알아보자.
* **분산 프로세스**: 위에서도 밝힌 바와 같이, ROS는 최소 단위의 실행 가능한 프로세스인 **노드(Node)** 형태로 프로그래밍한다. 이들이 독립적으로 실행되면서도 유기적으로 얽혀 통신한다.
* **패키지 단위 관리**: 패키지란 단어 그대로 어떤 뭉치라 생각하면 된다. 같은 목적의 여러 개의 프로세스를 묶어놓은 것이며, 패키지 단위로 개발, 사용, 공유 및 수정, 재배포가 이루어져 편리하다.
* 패키지는 깃허브 등의 **공개 레포지토리**에 공개되어야 하며 라이선스를 밝혀야 한다.
* 프로그램 개발 시 **[API](http://blog.wishket.com/api%EB%9E%80-%EC%89%BD%EA%B2%8C-%EC%84%A4%EB%AA%85-%EA%B7%B8%EB%A6%B0%ED%81%B4%EB%9D%BC%EC%9D%B4%EC%96%B8%ED%8A%B8/)**를 불러와 사용하던 코드에 삽입할 수 있다.
* C++, Python, JAVA 등 **다양한 프로그래밍 언어**를 사용할 수 있으며 이를 위해 클라이언트 라이브러리를 제공한다.

## 2-4. ROS의 구성
* **클라이언트 라이브러리**: 다양한 프로그래밍 언어를 지원하는 소프트웨어 모듈. 각각의 노드를 다른 언어로 작성할 수 있고, 노드 간의 통신을 통해 정보를 교환하기 위해 사용. (ex. `roscpp`(C++), `rospy`(Python), `roslisp`(LISP) 등)
* **로보틱스 어플리케이션 프레임워크**: 로보틱스 응용프로그래밍 용 (ex. tf, robot localization, dynamic reconfigure, laser pipeline 등)
* **로보틱스 어플리케이션**: 위 프레임워크를 기반으로 한 서비스용 응용프로그래밍 (ex. navigation, Movelt! 등)
* **커뮤니케이션 레이어**: 데이터 통신 (ex. common `msg`s, `rosbag`, `rostopic`, `rosnode`, `roslaunch`, `rosparam`, `rosmaster`, `rosout` 등)
* **하드웨어 인터페이스 레이어**: 하드웨어 제어 (ex. 카메라 드라이버, GPS/IMU 드라이버, rosserial 등)
* **소프트웨어 개발 도구**:  (ex. RViz, rqt, rospack, catkin, rosdep)
* **시뮬레이션**: 가상공간에서 로봇 제어 (ex. gazebo ros pkgs, stage ros 등)

## 2-5. 버전
ROS는 우분투나 안드로이드처럼 각 버전의 첫 글자를 알파벳 순서로 짓는다.(1.0 버전은 제외) Kinetic Kame 버전은 K이므로 11번째 버전이자 공식적 릴리즈로는 10번째인 것이다. 각 버전마다 거북이 아이콘도 달라진다.
원래는 ROS가 공식적으로 지원하는 운영체제인 우분투의 새 버전 공개 주기와 동일하게 연 2회 4월, 10월에 업데이트를 했으나, 2013년부터는 우분투 버전 xx.04을 공개된 뒤 한 달 뒤인 5월에 연 1회 업데이트한다.
> 5월 23일은 세계 거북이의 날이라고 한다. ROS의 상징이 거북이인 것을 상기하자.

보통 공개 후 2년이 서포트 기간이며, 우분투 LTS(Long Term Support, 2년에 한 번 공개되는 버전)에 맞춘 버전의 ROS는 5년간 서포트를 지원한다. 개발팀에서는 우분투 LTS 버전에 맞춰 테스트, 릴리즈하므로 되도록 ROS를 설치할 우분투 역시 해당 버전을 사용하길 권장한다.

- - -

# 🔌3. ROS의 설치
ROS는 ROS2도 나와있는 상황이나 필자는 아직 ROS1을 사용하며, 18.04 버전을 사용한다. 사용하는 기기들이 호환되는 버전으로 사용해야 한다!
자세한 설치 방법은 이어지는 포스트에서 진행한다.

- - -

# 😀4. 주요 용어 및 컨셉
다양한 용어와 컨셉이 있으나, 여기서는 필자가 주로 사용하는 것들(자율운항보트)을 위주로 간단하게만 설명한다.

> 이 글을 볼 트라이캣 팀 파이팅….!

## 4-1. 마스터(master)
**노드 사이를 연결하고, 메시지 통신을 위한 네임 서버 역할**을 한다. 전체를 관장하는 관리센터 정도로 생각하자.
뒤의 개념이긴 하지만 조금 자세히 보자면, 노드를 구동 하면 마스터에 노드 이름과, 퍼블리셔/서브스크라이버 등에서 사용할 토픽 이름, 메시지 형태, URI 주소, 포트 등을 등록해야 하는 것이다. 이 이름을 바탕으로 통신한다.
ROS 마스터는 `roscore` 명령어로 실행된다. 보통은 같은 네트워크에서 하나만 구동하며, 같은 네트워크 내에선 다른 컴퓨터에서 실행해도 된다. `roslaunch`가 아니라면 `roscore`를 가장 먼저 실행하여, 노드들이 등록되어 작동하고 서로 통신할 수 있도록 해야 한다. 

> 사용자가 설정한 `ROS_MASTER_URI` 변수에 담긴 URI 주소와 포트로 ROS가 구동된다. 미설정 시 현재 로컬 IP를 URI주소로 사용하고, 11311 포트를 사용한다.

## 4-2. 노드(node)
**실행 가능한, 최소 단위 프로세서**이다. 값을 받아들이거나 내보내거나, 둘 다를 하는 프로그램이라 해도 좋다. (보통 값을 '쏜다' 라고 표현한다) 하나의 로봇을 작동하는 데 여러 개의 노드가 작게 세분화되어 운영되며, 주로 하나의 목적에 하나의 노드를 쓴다. 분업화의 개념처럼 생각하면 좋다.
예를 들면 GPS에서 정보를 내보내는 노드 하나, 그 정보를 받아들여 최단 경로를 계산하고 다음 이동할 위치를 내보내는 노드 하나, 또 그 정보를 받아 바퀴를 얼만큼 움직일지 알려주는 노드 하나인 식이다.
아래 그림은 추후 설명할 rqt 그래프인데, 여기서 원으로 표시된 것이 노드이다. 한쪽으로만 화살표가 연결되는 것을 확인할 수 있다.

![](https://images.velog.io/images/717lumos/post/03dfe9aa-cf8c-47ae-8369-4b50cd45078e/Docking.png)

## 4-3. 패키지(package)
**ROS를 구성하는 기본 단위이자 개발 단위**이다. 하나 이상의 노드를 포함하고 있으며, 다른 패키지의 노드를 실행하기 위한 설정 파일, 프로세스들을 실행할 ROS 의존성 라이브러리, 데이터셋 등을 가진다. 
깃허브 등에서 자료를 찾으면 대부분 패키지 단위로 업로드 된다.

![](https://images.velog.io/images/717lumos/post/20c6251a-7f75-48f6-9788-fcfeca4be0d9/20211226_210118.jpg)

> **의존성**
B에서 사용하는 개념이 A에서 왔다고 하자. 그럼 B는 A와 의존관계에 있는 것이다. 서로 다른 모듈 간에, 하나가 다른 하나를 어떤 용도로 사용하는 것이다.
의존성 라이브러리라면 어떤 기능을 사용하기 위해 필요한 라이브러리라고 이해하면 될 것이다.

## 4-4. 통신
### 메시지(message)
**노드가 데이터를 주고 받을 때 사용하는 데이터의 형태**이다. 프로그래밍을 배울 때, 각 언어마다 지원하는 변수에 자료형이 있듯이, 메시지도 변수로서 integer(int16, int32등), float(float32, float64 등), boolean(bool), string, time 등이 있고, 배열(리스트) 형(unit8[], Point32[] 등)으로 메시지 안에 메시지를 담을 수도 있다. std_msgs/Header처럼 헤더도 메시지로 사용할 수 있다.
ROS Documentation에서는 제공되고 있는 다양한 메시지 타입을 아래와 같이 기술하고 있으니, 필요하거나 궁금한 메시지 타입이 있으면 구글링을 통해 바로바로 찾아볼 수 있다.
![](https://images.velog.io/images/717lumos/post/2ef35d1d-1792-4d8b-b1e2-7626ccb920a7/20211226_210713.jpg)
메시지 파일은 다양한 자료형을 포함한 새로운 자료형으로도 만들어질 수 있으며, 토픽에 사용되는 메시지는 `.msg` 파일에 그 형태가 기술된다. 당연히 만들어 사용도 가능하다.


### 토픽(topic)
메시지를 편지봉투, 혹은 편지지라고 하면 토픽은 그 안에 담기는 편지 ‘내용’이다. 즉, **메시지 안에 담기는 내용**이다. 토픽은 **비동기식, 단방향, 연속적 메시지 송수신**이 가능하므로 센서 데이터에 적합하다. 예를 들자면 IMU에서 그때그때 인식한 센서값을 노드에서 토픽으로 계속 쏴주는 식인 것이다.

### 토픽, 서비스, 액션의 차이
노드 간의 통신 방식에는 3가지가 있다. 단방향이란 노드에서 다른 노드로 일방통행 식으로 메시지를 쏜다는 뜻이다. 양방향은 서로 쏠 수 있다는 것이다. 더 자세한 내용은 생략하고 차이점만 정리한다.

| 종류 | 방식 | 방향 | 설명 |
|---|---|---|-----------|
| 토픽 | 비동기 | 단방향 | 연속적으로 데이터 송수신할 때 |
| 서비스 | 동기 | 양방향 | 한 번만 데이터 송수신. 요청 처리가 현재 순간만일 때 |
| 액션 | 비동기 | 양방향 | 요청 후 응답까지 시간 걸리거나, 중간 피드백 필요할 때 |

> **동기/비동기식**
* 동기(synchronous, 동시에 일어나는): 입력과 출력, 요청과 응답이 동시에 일어난다.
* 비동기(asynchronous, 동시에 일어나지 않는): 입력이나 요청이 있다 해서 출력이나 응답이 바로 나타나지 않는다. 특정 신호가 있어야 결과가 나타나는 등으로 조작한다.

### 퍼블리시(publish) & 서브스크라이브(subscribe)
영어 단어에서 떠올릴 수 있듯, 퍼블리시는 **무언가를 공표/발표하는 것**이다. 그 일을 하는 주체는 퍼블리셔(publisher) 노드이다. 반대로 서브스크라이브는 **무언가를 구독/읽는 것**이고, 노드는 서브스크라이버(subscriber) 노드라 한다.
**퍼블리셔 노드**는 토픽과 자신의 정보를 마스터에 등록하고, 서브스크라이브 노드에 메시지를 보낸다. 퍼블리셔는 이 일을 하는 개체로, 노드에서 선언하며 복수 개 선언이 가능하다.
**서브스크라이브 노드**는 토픽과 자신의 정보를 마스터에 등록하고, 받고자 하는 토픽을 주고 있는 퍼블리셔 노드의 정보를 받는다. 마찬가지로 서브스크라이버를 노드에서 선언하고 복수 개가 가능하다.
이렇게 **둘은 마스터에 등록되고 정보를 주고 받은 뒤 직접적으로 서로 연결되어 비동기식 통신**을 한다. 가장 간략한 순서는 이렇다.

1. 마스터 구동
2. 서브스크라이버 노드 구동
3. 퍼블리셔 노드 구동
4. 퍼블리셔 정보 알림
5. 서브스크라이버 노드의 접속 요청 및 퍼블리셔 노드의 접속 응답
6. 메시지 송수신

노드, 토픽, 퍼블리셔, 서브스크리이브의 관계는 그래프(graph)로 표현하기 쉽다. 보통 `rqt_graph` 패키지의 rqt_graph 노드를 다른 터미널에서 실행시켜 확인 가능하다

```
rqt_graph 또는 rosrun rqt_graph rqt_graph
```

## 4-5. 파라미터(parameter)
**노드에서 사용되는 파라미터**이다. 미리 지정되거나 할당할 수 있는 어떠한 값이라 보면 된다. 보통 소스코드에서도 할당이 가능하나, 따로 파일로 빼 두어 값들을 모아두거나 손쉽게 조정할 수 있도록 할 수 있다. 윈도우 프로그램에서 `.ini` 설정 파일과 비슷하다.
디폴트 값이 지정되어 있고, 필요에 따라 읽고 쓸 수 있다. 실제 활용에서는 USB 포트 번호, 캘리브레이션 값, 최대/최솟값 등의 변경에 유용하게 쓰인다.
![](https://images.velog.io/images/717lumos/post/7a914f82-9cbe-4a5f-b189-121ef9e712c6/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202021-12-26%2021-42-54.png)

## 4-6. 캐킨(catkin) & CMakeList.txt
Catkin은 **ROS의 빌드 시스템**이다. **CMake(Cross Platform Make)**를 기본적으로 이용하여, 패키지 폴더에 `CMakeList.txt`라는 파일에 빌드 환경을 기술해야 한다. ROS에서는 CMake를 ROS에 맞게 수정해 특화된 캐킨 빌드 시스템을 만들었으며, ROS관련 빌드, 패키지 관리, 패키지 간 의존관계 등을 편리하게 사용할 수 있게 되었다.
> **빌드(Build)**
우리가 작성한 소스코드를 기계가 이해할 수 있도록 실행 가능한 파일로 만드는 과정이다. 실행파일(`.exe` 등)은 기계어로 되어 있어 컴퓨터가 이해할 수 있게 만들어져 있다. 즉, 1과 0으로 된 기계어인 것이다.

## 4-7. 실행
### rosrun
`rosrun`은 **ROS의 기본 실행 명령어**로, 패키지에서 **‘하나의 노드’를 실행**한다. 노드가 실행중인 컴퓨터에 저장된 `ROS_HOSTNAME` 환경 변수 값을 URI 주소로, 임의의 고윳값을 포트로 설정한다. `rosrun` 실행 전에 다른 터미널 창에 `roscore`을 실행해두어야 한다.

> **터미널(terminal)**
일명 '까만 창'이다. 영화나 드라마에서 보면 각종 명령어를 까만창에 입력하면 색색의 글자들이 와르르 쏟아지는 그곳.
사람이 명령어를 입력하면 그 명령대로 컴퓨터는 작업을 수행하고 결과를 보여준다. 그 공간이 바로 터미널이다. 특히 리눅스는 CLI(Command Line Interface)로 주로 움직이므로 터미널에서 사용되는 리눅스 명령어와 그 사용에 익숙해져야 한다.

### roslaunch
rosrun과는 달리 `roscore` 없이도 **여러 개의 노드를 실행할 수 있는 명령어**가 `roslaunch`이다. 또한 패키지 파라미터와 노드 이름 변경, 노드 네임스페이스 설정, ROS_ROOT 및 ROSPACKAGE_PATH 설정, 환경 변수 설정 등 옵션을 줄 수 있다. 
작동은 `.launch` 파일을 통한다. 해당 파일은 태그별 옵션을 제공하는 XML기반이며, 파일은 패키지 폴더 내 `launch` 폴더 안에 있어야 한다.
roslaunch 관련 사항은 따로 포스팅을 해 두었다. [[ROS] roslaunch의 사용법 및 XML](https://velog.io/@717lumos/roslaunch%EC%9D%98-%EC%82%AC%EC%9A%A9%EB%B2%95-%EB%B0%8F-XML)

> **XML(Extensible Markup Language)**
다목적 마크업 언어로, 태그 등을 이용해 데이터의 구조를 표시하는 언어 중 하나다. (HTML을 사용해본 사람이라면 태그 형식을 잘 이해할 수 있을 것이다. 인터넷 창에서 `F12`키를 눌러보자.) 
XML은 `.launch`나 `package.xml` 등에서 사용된다.

### package.xml
**패키지의 정보(패키지의 이름, 저작자, 라이선스, 의존성 패키지 등)를 기술하고 있는 XML 파일**이다. 
![](https://images.velog.io/images/717lumos/post/4241b4c7-3441-4067-93b4-e50ac48682b7/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202021-12-26%2021-45-32.png)

## 4-9. bag
ROS에서 **주고받는 메시지 데이터를 저장하는 파일 포맷**으로, `.bag` 확장자를 가진다. 이 기능을 활용하면 화면녹화 혹은 음성녹음처럼 이전 상황을 재현할 수 있다. 
예를 들어 배를 움직이며 GPS좌표를 `rosbag` 시키면 지난 경로의 좌표를 기록할 수 있고, 필요한 경우 센서값을 반복해 사용할 수 있으며, `.csv`파일로 변환도 가능하다.

## 4-10. 네임(name)
노드, 파라미터, 토픽, 서비스에 모두 이름, 즉 네임이 있다. 마스터에 등록하면 이 이름을 이용하여 검색 및 메시지 송수신이 이뤄진다. 실행 시 변경도 가능하고, 중복도 가능하다.

- - -

# 📁5. 파일 시스템
‘설치 폴더’와 ‘사용자 작업 폴더’로 구분된다.
**설치 폴더**는 ROS 데스크탑 버전을 설치하면 `/opt` 폴더 내에 `/ros/버전 이름`으로 생성된다. 내부에는 roscore를 포함한 핵심 유틸리티, rqt, RViz, 기타 라이브러리, 시뮬레이션, 내비게이션 등이 설치된다.

|파일|내용|
|---|----------|
| `/bin` | 바이너리 파일 |
| `/etc` | ROS, 캐킨 관련 설정 파일 |
| `/include` | 헤더 파일 |
| `/lib` | 라이브러리 파일 |
| `/share` | ROS 패키지 |
| `env.*` , `setup.*` | 환경설정 파일 |

**사용자 작업 폴더**는 사용자가 작성한 패키지 및 다른 개발자의 공개된 패키지를 저장하고 빌드하는 공간이며, 대부분의 작업을 여기서 한다. 사용자가 원하는 곳에 생성할 수 있으나 보통 `/home/사용자명/catkin_ws/`에 생성한다. 그래야 빌드하기 쉽다. `~catkin_ws/`하의 세부 파일은 다음과 같다.

|파일|내용|
|---|----------|
| `/build` | 빌드 관련 파일. `catkin_make` 후에 생성됨 |
| `/devel` | msg, srv 헤더 파일, 사용자 패키지 라이브러리, 실행파일. `catkin_make` 후에 생성됨 |
| `/src` | 사용자 패키지. 사용자 소스 코드의 공간. |

특히 `/src` 폴더는 패키지가 저장되고 사용되는 공간으로 주로 이 폴더 안에서 작업이 이뤄지므로 하위 폴더 구성을 알아둘 필요가 있다.

|파일|내용|
|---|----------|
| `/include` | 헤더 파일 |
| `/launch` | roslaunch에 사용되는 `.launch` 파일 |
| `/node` | rospy용 스크립트 |
| `/msg` | 메시지 파일 |
| `/src` | 코드 소스 파일 |
| `/srv` | 서비스 파일 |
| `CMakeList.txt` | 빌드 설정 파일 |
| `package.xml` | 패키지 설정 파일 |

- - -

# 참고자료
* 표윤석, 조한철, 정려운, 임태훈. 2017. ROS 로봇 프로그래밍. 루비페이퍼.
* [ROS Wiki](http://wiki.ros.org/ROS/Introduction)
* [프로그래밍 언어와 빌드 과정 [Build Process]](https://st-lab.tistory.com/176)
