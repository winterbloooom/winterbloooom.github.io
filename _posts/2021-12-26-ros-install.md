---
title:  "[Tutorial] Ubuntu 18.04 LTS 및 ROS melodic 설치"
excerpt: "ROS Tutorial 2: Ubuntu 18.04 LTS 및 ROS melodic 설치 방법, 추가적 설치 팁"

categories:
  - ROS
tags:
  - Robotics
  - ROS
date: 2021-12-27
last_modified_at: 2021-12-27

use_math: true
toc: true
tock_sticky: true
toc_label: "Contents"
---

새로 알게되거나 보충할 부분을 찾아 계속 업데이트할 예정입니다.
{: .notice--info}

# 🧐0. 설치 환경 및 버전
* ROS Melodic Morenia 배포판
* Ubuntu Artful(17.10), Bionic (18.04 LTS), Debian Strech 등에 설치 권장

- - -

# 🧰1. 우분투 설치
1. **우분투 설치 iso 파일 다운로드 / 멀티 OS를 위한 파티션 분할 / BIOS 옵션 변경**
[참고 링크 | 내 PC에 리눅스 설치하기(멀티OS, Ubuntu, 우분투) 1/2 - 꿈디](https://dreamdeveloper403.tistory.com/27)

> ❗ 위 링크의 블로그에서는 20.04 버전으로 다운로드하지만, 아직(특히 트라이캣 팀은) **18.04을 사용**해주세요.

> ❗ 본격적인 설치를 하게 되면 컴퓨터를 쓰지 못하므로, 태블릿PC 혹은 휴대폰으로 링크를 타고 들어가 설치를 진행해야 한다.

2. **우분투 설치**: 아래 링크 중 하나를 참고한다. 본인이 보기 편한 것으로 보자.
   * [택1: 내 PC에 리눅스 설치하기 (멀티OS, Ubuntu, 우분투) 2/2](https://dreamdeveloper403.tistory.com/28)
   * [택2: 우분투 18.04 설치 USB 만들기 및 설치 - NeoPgmr.](https://neoprogrammer.tistory.com/6)
   * [택3: 우분투 설치 가이드 ubuntu 18.04 or 16.04 기준 - 도라가이드](https://dora-guide.com/ubuntu-download/)

> ❗ 터미널을 켜는 단축키는 `ctrl` + `alt` + `T`

> ❗ 원래 터미널 창에서 비밀번호를 입력할 때는 아무것도 안 뜬다. 입력이 안된다고 당황하지 말자!

3. **한글 입력기**
언어 설정을 한국어로 해도 안되고, 한글은 나오는데 키보드가 한글로 되지 않을 때가 있다. 아래의 링크들에서 소개된 방법을 참고한다.
   * [ibus 설치](https://omnil.tistory.com/155)
   * [fcitx 한글 입력기 설치](https://driz2le.tistory.com/253)

> ❗ 터미널 창에서는 `Ctrl` + `Shift` + `C` , `V`를 해야 복사/붙여넣기가 가능하다.

- - -

# 💾2. ROS 설치
> ❗ 참고로 OpenCV를 설치하기 위해서는 ROS보다 먼저 설치가 되어야 한다!

> ❗ 이제부터 이어지는 코드에서 명령어 맨 앞에 붙은 `$`은 명령어를 입력한다는 뜻이다. 터미널을 켜보면 앞에 붙어있는 문자말이다. 
그러니 복사/붙여넣기 과정에서 `$`는 생략하고 붙여넣기 하고, 서로 다른 줄에 $가 있다면, 앞에 명령을 먼저 실행한 뒤에 뒤의 것을 실행해야 한다.

> ❗ 잘못 입력했는데 하나하나 지우기엔 귀찮다면 `ctrl` + `C`로 빠져나올 수 있다. 강제종료 단축키다. 터미널을 켜는 단축키만큼 자주 사용하게 되니 필시 알아두자.

## 2-1. **터미널 실행**
다시 한 번 기억하자. 단축키는 `ctrl` + `alt` + `T`

## 2-2. sources.list 설정
`ros-latest.list`에 ROS 저장소를 추가하는 과정이다. 
```
$ sudo sh -c 'echo "deb http://packages.ros.org/ros/ubuntu $(lsb_release -sc) main" > /etc/apt/sources.list.d/ros-latest.list'
```

> ❓ **sudo 명령어**
리눅스에서는 특정한 명령을 실행하거나 파일에 접근하려면 루트(root) 권한이 필요할 때가 있다. 일반 사용자가 root 권환을 획득하려면 `su` 또는 `sudo` 명령어를 쓴다.
`sudo`는 'superuser do'의 약자로, `sudo` 다음에 원하는 명령어를 입력하면 현재 계정에서 root 권한으로 명령어를 실행한다. 명령어를 입력하면 실행 전 사용자의 비밀번호를 묻는다.

## 2-3. 키 설정
ROS 저장소로부터 패키지를 내려받기 위해 공개키를 추가한다.
```
$ sudo apt install curl
$ curl -s https://raw.githubusercontent.com/ros/rosdistro/master/ros.asc | sudo apt-key add -
```

## 2-4. 우분투 패키지 업데이트
```
$ sudo apt-get update && sudo apt-get upgrade -y
```

## 2-5. 데스크탑용 ROS 패키지 설치
ROS, rqt, Rviz, 로봇 관련 라이브러리, 2D/3D 시뮬레이터 등이 포함된다. 
`[y/n]`가 나오면 `y`를 입력한다.
```
$ sudo apt install ros-melodic-desktop-full
```

## 2-6. rqt 패키지 설치
혹시 설치가 안 되었을 경우를 대비하기 위함이다.
```
$ sudo apt-get install ros-melodic-rqt*
```

## 2-7. 환경설정 파일 불러오기
해당 파일에는 `ROS_ROOT`, `ROS_PACKAGE_PATH` 등의 환경변수들이 정의되어 있다. 
새로운 쉘이 실행될 때마다 bash에 자동적으로 ROS 환경변수가 추가되도록 하기 위해 아래의 명령을 입력한다.

```
$ echo "source /opt/ros/melodic/setup.bash" >> ~/.bashrc
$ source ~/.bashrc
```

현재 쉘에서만 환경변수를 바꾸고 싶다면 아래 명령 한 줄만 입력
```
$ source /opt/ros/melodic/setup.bash
```

> ❓ **환경변수**
변수는 변수이나, 흔히 프로그래밍할 때 어떠한 계산 값을 담는 데 사용하는 변수가 아니라, 컴퓨터 혹은 운영체제, 프로그램이라는 '환경'에서 그 프로그램이 동작할 때 필요한 값을 담고 있는 변수이다.
가장 대표적인 리눅스 환경변수 중 하나가 `HOME`이다. 사용자의 홈디렉토리 경로를 담고 있는 변수이다. `USER`는 사용자의 이름을 담고 있으며, `PATH`는 명령어나 파일을 찾는 위치를 담고 있는 실행파일 탐색 경로이다.
나중에 설명하겠지만, 환경변수도 사용자가 임의로 할당하고 해제할 수 있으며, 설정 명령어는 `export`이고 할당 방법도 `=`을 사용해 `export 변수명=값`으로 한다.

> ❓ **쉘(Shell)과 bash**
**쉘(Shell)**은 리눅스에서 명령어와 프로그램을 실행할 때 사용하는 것(인터페이스, 프로그램)이다. 커널(Kernel)과 사용자 사이에서, 사용자의 명령을 해석하고 실행한다. 
깊게 들어가지 않을 사람들은 그저 터미널이라 이해해도 무방하다. 
셀에는 여러 종류가 있고, 우리는 **bash 쉘**을 쓰고 있다. Bash(Bourne Again Shell)는 현재 리눅스의 표준 쉘(Shell)이다.

## 2-8. 기타 도구 및 의존성 설치
ROS를 사용할 때 유용한 도구와 의존성 등을 설치한다.
먼저, **rosinstall 등을 설치**한다. ROS 패키지들을 빌드하는데 필요한 의존성과 도구들이다.
```
sudo apt install python-rosdep python-rosinstall python-rosinstall-generator python-wstool build-essential
```

다음으로는 **rosdep을 초기화**한다.
```
$ sudo apt install python-rosdep
$ sudo rosdep init
$ rosdep update
```
> **rosdep**
ros의 핵심 컴포넌트들을 사용하고 컴파일할 때 의존성 패키지를 쉽게 설치해 사용자 편의성을 높여주는 기능이다.

## 2-9. 작업 폴더 생성 및 초기화
ROS에서는 ROS 전용 빌드 시스템으로 **catkin(캐킨)**을 사용하므로, 이를 위해 catkin 작업 폴더를 생성하고 초기화해야 한다. 
```
$ mkdir -p ~/catkin_ws/src
$ cd ~/catkin_ws/
$ catkin_make
```
모든 작업은 `catkin_ws` 디렉토리에서 이루어진다.
`catkin_make` 명령어는 catkin 빌드 명령어이다. 해당 명령어를 입력한 뒤 `ls`로 파일 리스트를 출력해보면, 빌드를 했으므로, 기존에 있던 `/src` 폴더와 `CMakeList.txt` 외에도 `/build`, `/devel` 폴더가 추가적으로 생성되어 있을 것이다.

## 2-10. bash 저장
2-7번 [환경설정 파일 불러오기]에서 `source /opt/ros/melodic/setup.bash`으로 명령어를 작성했다면, 아래의 코드로 수정된 스크립트 파일을 바로 적용하기 위해 다음의 명령어를 추가적으로 입력한다.
```
$ source devel/setup.bash
```

## 2-11. 정상 설치 점검
모든 터미널 창을 닫고 다시 하나를 열어 아래의 명령어를 입력하고 결과를 확인한다.
```
$ roscore
```
![](https://images.velog.io/images/717lumos/post/787c964e-788e-4a5d-8b6d-ebc6ad27a6c3/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202021-12-28%2019-19-22.png)

- - -

# ⚡3. ROS 작업환경 설정
## 3-1. bashrc 파일 편집
터미널 창을 실행할 때마다 환경설정파일을 불러오려 매번 2-7의 코드를 실행하기엔 번거롭다. 
따라서 새로운 터미널 창을 열 때마다 정해진 환경설정 파일을 읽어오고, ROS 네트워크를 설정하며, 자주 사용하는 명령어를 단축 명령어로 만드는 등의 일을 하기 위해 `bashrc` 파일을 편집한다.

우선 `bashrc` 파일을 연다.
```
$ gedit ~/.bashrc
```
![](https://images.velog.io/images/717lumos/post/582796db-7ca6-46c0-b6e7-1fc3b889d834/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202021-12-28%2019-25-40.png)

이미 설정되어 있는 것들은 건드리지 않고, 맨 아래에 다음 내용을 붙여넣기 한다. 
아래 내용은 변수 할당 및 명령어 설정이므로 특히 더 띄어쓰기에 민감하다. `=` 앞뒤로는 반드시 띄어쓰기가 없어야 한다.
```
# ROS 환경설정 파일
source /opt/ros/melodic/setup.bash
source ~/catkin_ws/devel/setup.bash

# ROS 네트워크 설정 (이 내용은 ‘3-2. ROS 네트워크 설정’을 참고)
export ROS_HOSTNAME=localhost
export ROS_MASTER_URI=http://localhost:11311

# ROS alias 명령어 설정 (이 내용은 ‘3-3. 단축 명령어 설정’을 참고)
alias cw='cd ~/catkin_ws'
alias cs='cd ~/catkin_ws/src'
alias cm='cd ~/catkin_ws && catkin_make'
```

해당 변경사항을 저장하고 나면 다시 터미널 창으로 돌아와 아래의 명령을 입력해주어야 적용이 된다. 터미널을 껐다가 다시 켜면 위에서 설정한 예약어(명령어)들이 잘 실행될 것이다.
```bash
$ source ~/.bashrc
```

> ❓**bashrc**
bash는 다섯 개의 설정 파일을 가지고 있다. `/etc`에 속한 두 파일은 전역적 파일이고, 나머지는 각 사용자의 설정 파일이므로 그 파일의 주인인 사용자에게만 영향을 주며, 그 사용자의 홈디렉토리에서 숨김파일로 주로 찾아볼 수 있다.
이 중 `bashrc`는 bash에서 작업할 때마다 수행되는 파일이다. 일종의 환경변수의 개념처럼 작동하여, 예를 들어 `python`이라고만 해도 python3.x 버전으로 연결해준다. 이런 설정을 모든 사용자에게 적용하고 싶다면 `etc/profile`에 선언하면 되는 것이다.
* `/etc/profile`
* `/etc/bashrc`
* `~/.bash_profile`
* `~/.bashrc`
* `~/.bash_logout`

> ❓**gedit(지 에디트)**
Windows로 따지자면 메모장 격이다. 텍스트 편집기 프로그램 중 하나이며, 우분투 LTS18 기준으로 우분투 데스크탑의 공식 텍스트 편집기이다.
터미널에 `gedit`를 쓰고 파일명을 입력하면 그 파일을 gedit으로 편집할테니 gedit으로 열라는 뜻이다.

> * 파일명 앞에 붙은 `.`은 숨긴파일이라는 표시이다.
> * `#`은 주석 표시이다.

## 3-2. ROS 네트워크 설정
ROS는 네트워크를 이용해 노드 간 메시지 통신을 하므로 네트워크 설정이 필요하다. 
하나의 PC에서 모든 ROS 패키지를 실행한다면 IP 지정이 필요가 없고, 3-1의 코드처럼 localhost로 설정하면 된다. 
마스터 PC가 따로 있고 호스트 PC를 로봇이 사용할 때, 이를 구분해 지정해주기만 하면 된다. 아래는 그 예.
```
export ROS_HOSTNAME=192.168.1.100
export ROS_MASTER_URI=http://${ROS_HOSTNAME}:11311
```
본인의 IP 정보는 터미널에서 `ifconfig` 명령어로 확인할 수 있다. 필자는 와이파이로 네트워크에 연결한 상태에며, 개인의 네트워크 상황에 따라 화면은 다르게 보일 수 있다.

![](https://images.velog.io/images/717lumos/post/519507c5-fca5-4acd-93b9-8bcb6d758f32/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202021-12-28%2019-17-14.png)

만약 `Command ifconfig not found` 에러가 난다면 아래와 같이 설치를 진행한 후에 다시 명령어를 입력한다.
```
sudo apt install net-tools
```

> ❓ **리눅스 쉘 변수**
😂깊게 들어갈 필요가 없는 사람들은 아래 내용은 참고만 하자.
* 위에서도 잠깐 밝혔듯, 리눅스 쉘에서는 변수를 설정하고 해제할 수 있다. 
- 쉘 변수에는 **환경 변수(Environment Variables)**와 **내장 환경 변수(Built-in Environment Variables)**, (사용자 지정) 변수가 있다. 
- 사용자가 임의로 변수를 할당할 때는 `변수명=값`으로 터미널 창에서 바로 선언이 가능하다. `set` 명령어는 현재 설정되어 있는 변수 모두를 출력한다. `unset 변수명`은 설정된 변수를 해제한다.
- **환경 변수**는 각 자식 프로세스가 부모 프로세스에서부터 copy해오는 변수들이다. 상속의 개념이다. `export 변수명=값`으로 선언하고, `env`(environment)로 모든 환경 변수를 확인할 수 있으며, `export -n 변수명`으로 해제한다.
- **내장 환경변수**는 리눅스가 미리 지정해놓은 변수들로, 보통 대문자로 선언되어 있다. (그렇기 때문에 바꾸면 좀 일이 복잡해진다.) `HOME`, `PATH`가 예시이다. `PATH`는 `PATH=/usr/local/sbin:/usr/local/bin:/usr/sbi
n:/usr/bin` 처럼 콜론(`:`)으로 구별되어 있는 경로의 모음이다.
- 그러니 위 코드에서 `ROS_HOSTNAME`, `ROS_MASTER_URI`는 환경변수 이름이고 `export`로 설정해준 것이다.
- 아래는 몇 개의 환경변수를 출력해본 결과이다. 참고로 `echo`는 터미널 창에 무언가를 출력하라는 명령어이며, 변수는 이름 앞에 `$`를 붙여줘야 명령어가 아닌 변수로 인식한다.

![](https://images.velog.io/images/717lumos/post/74d56bad-c69a-4328-a1b8-95cbce2b8d7e/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202021-12-28%2019-21-38.png)

> ❓ **파라미터 확장(변수 치환)(Parameter expansion (Variable substitution))**
리눅스에서 `${이름}`은 중괄호 안에 있는 변수로 바꾸라는 뜻의 변수 치환이다.
위 예시에서 `ROS_HOSTNAME`을 `192.168.1.100`으로 설정했으므로, 두번째 줄에서 `http://${ROS_HOSTNAME}:11311`은 ` http://192.168.1.100:11311`으로 치환된다.

## 3-3. 단축 명령어 설정
> ❓ **alias 명령어**
ROS 개발에 자주 사용하는 명령어를 등록한 것이다. 단축키를 새로 만드는 것이라 생각하면 쉽다.

| 명령어 | 명령 |
|-----|-----------|
| cw | catkin 작업폴더 `~/catkin_ws`로 이동 |
| cs | catkin 작업폴더 중 소스파일이 있는 폴더 `~/catkin_ws/src`로 이동 |
| cm | catkin 작업폴더 `~/catkin_ws`로 이동한 후, `catkin_make` 명령어로 ROS 패키지 빌드 |

- - -

# 🖥4. 터미네이터 설치
우분투에 기본적으로 내장된 터미널을 사용해도 아무 문제가 없다. 
하지만 개발과 테스트를 하다보면 필시 여러 창을 동시에 켜고 명령어를 입력하고 실행해야 할 때가 온다. 
이 기능을 편리하게 할 수 있는 프로그램 중 하나가 **터미네이터(Terminator)**이다.

```
$ sudo apt-get install terminator
```
위 명령어로 설치를 진행한다. 똑같이 단축키 `ctrl` + `alt` + `T`를 하면 기본 터미널이 아닌 터미네이터가 실행된다.

아래는 자주 사용되는 창 관련 단축키이다.

| 기능 | 단축키 |
|-------|----------|
| 수평 분할 | Ctrl + Shift + O |
| 수직 분할 | Ctrl + Shift + E |
| 다음 창 활성화 | Ctrl + Tab 또는 Ctrl + Shift + N |
| 이전 창 활성화 | Ctrl + Shift + Tab 또는 Ctrl + Shift + P |
| 현재 활성화 된 창 닫기 | Ctrl + Shift + W |
| 터미네이터 종료 | Ctrl + Shift + Q |
| 전체화면 | F11 |
| 글자 크기 크게 | Ctrl + Shift + +(백스페이스 좌측 +/=키)
| 글자 크기 작게 | Ctrl + -(0 우측 _/-키)

![](https://images.velog.io/images/717lumos/post/84da008d-43ff-40fc-b64c-18cfdc8baf09/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202021-12-28%2019-24-00.png)

(분할만 해둬도 뭔가 있어보여서 기분이 좋다)

- - -

# ⌨5. VS Code 설치
윈도우에서 C/C++을 쓸 때는 Visual Studio, Python을 쓸 때는 Pycharm을 사용하는 편이다. 리눅스(우분투)에서는 VS Code(Visual Studio Code)를 사용한다.  비주얼 스튜디오보다 가볍다는 평이 있다. 
이들을 통합개발환경(IDE)이라 하며, 코딩과 디버그, 컴파일, 배포 등 모든 작업을 하나의 프로그램 안에서 처리하도록 하는 소프트웨어이다.

1. [설치 파일 다운로드](https://code.visualstudio.com/) : 운영체제인 우분투에 맞게 `.deb` 파일을 다운받는다.
2. 다운로드 경로로 가 터미널 창에서 `sudo dpkg -i code*.deb`를 입력해 설치를 진행한다.

실행할 때는 아무 경로에서나 터미널 창에 `code .`를 입력하면 바로 실행된다. 

![](https://images.velog.io/images/717lumos/post/dc9c09ed-1383-4874-b43d-49c9629573c1/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202021-12-28%2019-27-16.png)

기본 문서 편집기로 VS code를 설정하고 싶다면 아래와 같은 명령을 실행한다.
```
$ xdg-mime default code.desktop text/plain
```

- - -

# 🐢6. ROS 동작 테스트(feat. 거북이)
ROS의 상징은 거북이이다. ROS에서 제공하는 `turtlesim` 패키지를 이용해 테스트해보자

한 터미널 창을 열고 `roscore`을 입력한다.
```
$ roscore
```

다른 새 터미널에 터틀심 노드를 실행한다. 
```
$ rosrun turtlesim turtlesim_node
```
파란 창에 거북이 한 마리가 보일 것이다. 
설명을 보태보자면, `turtlesim`은 패키지 이름, `turtlesim_node`는 `rosrun`으로 실행할 노드 이름이다. 이왕 터미네이터를 실행한 거, 화면 분할로 실행해도 좋다.

이제 이 거북이를 키보드로 움직일 수 있도록 하자. 또다른 터미널 창에 아래와 같은 명령어를 입력한다. 
```
$ rosrun turtlesim turtle_teleop_key
```
이 터미널 창에서 방향키를 누르면 아까 그 거북이가 움직인다.

![](https://images.velog.io/images/717lumos/post/7b03fb93-f35f-409f-838f-48ed732761ff/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202021-12-28%2019-35-10.png)

rqt 그래프를 그려 현재 노드들의 통신 상황을 알아보자. 새 터미널을 열자.
```
$ rqt_graph
```
![](https://images.velog.io/images/717lumos/post/962453c7-30e9-4a06-aa40-ab9d9e068f83/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202021-12-28%2019-36-06.png)

위 사진처럼 안 보인다면 상단 체크박스에서 `Leaf topics`를 클릭한다.
동그라미는 노드, 네모는 토픽을 의미하며, 화살표는 어디서 시작해 어디로 토픽을 전달하는지를 나타낸다.

노드를 종료할 때는 아까처럼 `Ctrl` + `C`로 하고, 터미널을 끄려면 `exit`로 끌 수 있다.

> ❗ **터미널 창에서 `Tab` 키 사용하기**
여기까지 따라왔다면, 오타 없이 터미널 창에 명령어를 입력하는 것이 얼마나 어려운 일인지 알 것이다. 익숙하지 않으니 필자도 아직까지 명령어 입력 시 신중에 신중을 기한다.(자칫 파일이 몽땅 삭제되거나 날아갈 수도 있으니)
리눅스 터미널 창에서는(터미네이터도 마찬가지) **자동완성기능을 제공**한다. 
예를 들어 `rosrun turtlesim`을 입력하고 **`Tab` 키**를 누르면 이 패키지에서 사용할 수 있는 노드 리스트를 검색할 수 있다. 또한 `rosrun turtlesim turtle_teleop`까지만 입력해도 `Tab`을 누르면 뒤에 `_key`를 자동으로 완성해준다.
**매우매우 자주 쓰는 기능이니 기억해두자.**

- - -

# 👀참고자료
* [ROS Wiki](http://wiki.ros.org/ROS/Installation)
* [리눅스 su, sudo 명령어 사용법 정리 (root 권한 획득 방법)](https://withcoding.com/106)
* [리눅스 환경변수](https://blog.naver.com/koromoon/220793570727)
* [[리눅스]셸(Shell)이란? 셸의 변경, 쉘 개념, 기능, 종류와 특징(sh, bash, csh, tcsh, ksh)](https://jhnyang.tistory.com/57)
* [쉘의 개념, bashrc의 개념](https://dohk.tistory.com/191)
* [[Linux] 우분투 터미널 다중 창, 창분할 - 터미네이터 (Terminator) Computer System/Linux](https://harryp.tistory.com/630)
* 표윤석, 조한철, 정려운, 임태훈. 2017. ROS 로봇 프로그래밍. 루비페이퍼.
