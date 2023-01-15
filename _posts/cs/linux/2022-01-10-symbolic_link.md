---
title:  "[Linux] USB 장치 이름 고정하기: udev 설정, Symbolic Link 만들기"
excerpt: "udev rules, 심볼릭 링크(Symbolic Link), 장치 (포트) 이름 고정하기, 스크립트 파일(.sh) 사용하기"

categories:
  - Computer Science
  - Linux
tags:
  - OS
  - Linux
last_modified_at: 2022-01-10
---


# 😕 1. 장치 이름 설정의 필요성
여러 대의 USB 장치를 연결한다면 ttyUSB0, ttyUSB1, ttyUSB2, ..., ttyACM0, ttyACM1, ...처럼 번호가 부여된다. 그러나 <span style="color: green">**이 번호는 컴퓨터를 재부팅하거나, USB 포트에 재연결하는 등 매번 변경된다.**</span> `launch` 파일에서 serial_port 값을 파라미터로 넣을 때 등 많은 경우에 이 값을 사용하는데, 매번 바뀌면 매번 조회하고 매번 모든 파일에 일일이 들어가 수정해주어야 한다.

따라서 이 문제를 해결하기 위해 <span style="color: green">**장치마다 특정한 이름으로 고정하고 권한을 허용해줄 수 있는 방법**</span>이 있다. 예를 들어 카메라를 `ttyUSB0` 등이라 하지 않고 `ttyCamera`라 하는 것이다.

이 방식을 간단히 <span style="color: green">**udev 설정, 혹은 심볼릭 링크를 만들기**</span>라고 한다.

- - -

# 🙄 2. udev와 심볼릭 링크
<span style="background-color: #12B886; color: white">**udev**</span>은 <span style="color: green">**리눅스 커널을 위한 장치 관리자로, 주로 /dev 디렉터리의 장치 노드를 관리**</span>한다. 또한 하드웨어 장치가 시스템에 추가되거나 제거되는 동안 발생한 모든 사용자 공간 이벤트들을 관리한다. 우리에게는 USB를 컴퓨터에 꽂았을 때 연결된 기기를 관리한다고 보면 된다.

<span style="background-color: #12B886; color: white">**심볼릭 링크(Symbolic Link)**</span>는 말 그대로 무언가를 의미/상징하는 링크로, Winodws의 바로가기와 비슷하다 볼 수 있다. <span style="color: green">**링크를 연결해 원본 파일을 직접 사용하는 것처럼 만들 수 있다.**</span> 링크가 연결된 두 파일은 삭제, 수정 등 작업이 모두 동일하게 공유된다.


- - -

# 🧐 3. 장치 이름 설정 과정
> 📌 <span style="background-color: #12B886; color: white">**사용 장비**</span>
* LiDAR(라이다): RPLIDAR A3
* GNSS(GPS) 보드: ublox C099-F9P
* AHRS(IMU): myAHRS+
* Arduino

## 🔌 3-1. USB 정보 수집
필요한 정보는 <span style='color: green'>**Vender ID, Product ID, Serial Number**</span> 3가지이다.

<span style="background-color: #12B886; color: white">**[ 1 ]**</span> 장치를 연결한 뒤, <span style='color: green'>**USB 장치에 부여된 이름을 확인한다.**</span>

```
$ ls -al /dev/serial/by-id
```

![](https://images.velog.io/images/717lumos/post/c1eb6b5c-9a4d-46fe-98d9-2ef5229870b0/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202022-01-17%2016-57-38_cr.png)

<span style="background-color: #12B886; color: white">**[ 2 ]**</span> 기기의 <span style='color: green'>**Vendor ID(생산자), Product ID(제품번호)를 확인**</span>한다. 같은 제품(예: 아두이노 우노 보드)이라면 생산자나 제품 번호가 같을 수 있다. 이들은 다음 단계에서 알아볼 시리얼 번호가 다르다.

```
$ lsusb
```

![](https://images.velog.io/images/717lumos/post/371d5f61-ce38-4a9c-a0a4-a1a62385924b/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202022-01-17%2016-57-52_cr.png)

위 사진에서 정리한 각 기기의 vendor ID, product ID는 아래와 같다.

| 기기 | Vendor ID | Product ID | Description |
|:--:|:--:|:--:|:---:|
| ublox C099-F9P (GNSS board) | 1546 | 01a9 | U-Blox AG |
| myAHRS+ (IMU) | 0483 | 5740 | STMicroelectronics STM32F407 |
| RPLiDAR | 10c4 | ea60 | Cygnal Integrated Products, Inc...|


<span style="background-color: #12B886; color: white">**[ 3 ]**</span> <span style='color: green'>**Serial Number(시리얼 번호)**</span>를 알아낸다. USB0, USB1, ACM0, ACM1 등 숫자는 본인의 상황에 맞게 바꿔가며 정보를 조회한다.
```
$ udevadm info -a /dev/ttyUSB0 | grep '{serial}'
```

![](https://images.velog.io/images/717lumos/post/a00c7d8f-4520-487e-9dd0-9e4659b0aa2f/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202022-01-17%2016-58-50_cr.png)


## 💾 3-2. rules 파일 생성
리눅스 <span style='color: green'>**udev에서 사용할 rules를 추가하기 위해 rules 파일**</span>을 만들자.

<span style="background-color: #12B886; color: white">**[ 1 ]**</span> 파일을 생성한다. <span style="color: green">**`sudo` 명령어를 통해 루트 권한으로 실행해야 문서 작성/수정이 가능하다.**</span> 파일 이름은 임의로 `99-tty.rules`로 하였다. `gedit`은 지에디트(gedit)라는 문서 편집기로 해당 파일을 작성하겠다는 의미이다. 따라서 <span style="color: green">**아래 명령어를 입력하면 입력창이 열리며 문서 작성이 가능해진다.**</span>

```bash
$ cd /etc/udev/rules.d
$ sudo gedit 99-tty.rules
```

참고로 위에서 이동한 위치인 `/etc/udev/rules.d` 디렉토리로 가면 다른 `rules` 파일들도 존재하며 해당 공간은 root 권한이 있어야지만 읽고 쓸 수가 있다. 다른 파일들을 열어봐도 읽기전용으로만 열리며 이들은 udev rules를 따른다고 한다.

![](https://images.velog.io/images/717lumos/post/4f225456-4542-4050-a900-b6086fdcfa33/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202022-01-17%2017-00-41_cr.png)

<span style="background-color: #12B886; color: white">**[ 2 ]**</span> <span style="color: green">**파일 내용을 입력하고 저장한다.**</span> 아래는 RPLIDAR A3(LiDAR), ublox C099-F9P (GNSS 보드), myAHRS+(IMU), Arduino에 이름을 부여한 예시이다.

```cs
SUBSYSTEM=="tty", ATTRS{idVendor}=="0483", ATTRS{idProduct}=="5740", ATTRS{serial}=="000001010000", SYMLINK+="ttyIMU"
SUBSYSTEM=="tty", ATTRS{idVendor}=="10c4", ATTRS{idProduct}=="ea60", ATTRS{serial}=="0001", SYMLINK+="ttyLiDAR"
SUBSYSTEM=="tty", ATTRS{idVendor}=="1546", ATTRS{idProduct}=="01a9", SYMLINK+="ttyGPS"
SUBSYSTEM=="tty", ATTRS{idVendor}=="2341", ATTRS{idProduct}=="0042", ATTRS{serial}=="75834343639351A06141", SYMLINK+="ttyARDUINO"
```

한 문장이 하나의 조건문 격이다. <span style='color: green'>**해당 조건에 부합한다면 지정된 이름을 부여하라는 의미**</span>이다. 위 예시가 100% 모든 사람과 기기에 맞는 형식은 아님에 주의하자.
* `SUBSYSTEM`은 **디바이스의 서브 시스템**으로, 위 예에서는`tty`로 한다. `ls` 명령 등으로 장치에 부여되어 있는 이름을 보면 ttyUSB\*, ttyACM\* 등의 식으로 그 시스템이 tty임을 확인할 수 있었다.
* `ATTRS{idVendor}`, `ATTRS{idProduct}`, `ATTRS{serial}`은 각각 **Vendor ID(생산자), Product ID(제품번호), Seial Number(시리얼 번호)**로, 앞서 알아낸 정보를 입력해준다.
* `SYMLINK+`에는 **장치에 부여하게 될 고유의 이름**이다. 이곳에 원하는 이름을 입력해준다.
* `ACTION` : **특정 상황**에서 작업을 행하라는 뜻으로, `ACTION=="add"`은 장치가 연결되면 인식하라는 의미가 된다.
* `KERNEL` : **커널 이름**으로, 디바이스가 입력해준 커널 이름과 일치할 때 작업을 행한다. 
* `MODE` : 읽기, 쓰기 등의 **권한**을 말한다.

<span style="background-color: #12B886; color: white">**[ 3 ]**</span> <span style="color: green">**udevadm 규칙을 reload/restart한다.**</span> 아래 명령어로 <span style='color: green'>**규칙을 재로딩했다가, 장치를 제거하고 다시 연결**</span>한다.
```bash
$ sudo service udev reload
$ sudo service udev restart
```
또는 아래의 명령어들도 있다.
```bash
$ sudo udevadm control --reload-rules

$ sudo service udev restart
```

<span style="background-color: #12B886; color: white">**[ 4 ]**</span> <span style="color: green">**장치명이 어떻게 바뀌어 있는지 다시 확인한다.**</span>
```bash
(1) 개별로 확인하고 싶을 때 예
$ sudo ls -l /dev/ttyLiDAR

(2) tty만 확인하고 싶을 때 예
또는 ls -al /dev/tty*

```

![](https://images.velog.io/images/717lumos/post/f1ecf6cf-c114-4817-b384-2ef2b6268ec1/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202022-01-17%2017-04-39_cr.png)

<span style="color: green">**`->` 표시는 `ttyLiDAR`의 원본이 `ttyUSB2`라는 것을 의미한다.**</span> 즉, 각 기기의 '포트 이름이 고정되었다' 혹은 'remap 되었다'고 할 수 있다. 또한 사진의 좌측을 보면 기기의 퍼미션(권한)도 바뀌어있음을 알 수 있다.

<span style="background-color: #12B886; color: white">**[ 5 ]**</span> 필요에 따라 <span style="color: green">**장치 포트 이름(시리얼 포트)이 ttyUSB\*, ttyACM\* 등으로 설정된 곳(launch파일, 파라미터 파일 등)이 있다면 이를 바꾸어준다.**</span>

![](https://images.velog.io/images/717lumos/post/36c5bc05-d7aa-45e6-b90b-a233d761a413/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202022-01-17%2017-05-54_cr.png)

![](https://images.velog.io/images/717lumos/post/60f7b4b2-d8fe-4a88-9812-70f66c47bbca/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202022-01-17%2017-06-27_cr.png)

![](https://images.velog.io/images/717lumos/post/827d1a77-73cb-473c-92b9-fb48f088152f/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7,%202022-01-17%2017-07-49_cr.png)

- - -

# 📄 4. 주어진 스크립트(.sh) 파일 사용하기
특정 기기의 패키지 설치 과정 중 스크립트(`.sh`) 파일을 제공해주는 경우가 있다. udev 설정을 알아서 해주는 파일이다. 아래 예시는 [rplidar 패키지](https://github.com/robopeak/rplidar_ros)의 예이다.

패키지 내 `scripts/create_udev_rules.sh` 파일의 내용은 다음과 같다. 설명을 주석으로 달아두었다.

![](https://images.velog.io/images/717lumos/post/23e3bcfa-bb91-456d-9ae6-fc18cf8b11b6/carbon%20(8).png)


`rules.d`로 복사할 것이라는 `rplidar_ros/scripts/rplidar.rules` 파일의 내용은 아래와 같다.

![](https://images.velog.io/images/717lumos/post/05c24101-43b4-467b-b948-6754d182b5cf/carbon%20(9).png)

<span style='color: green'>**`ttyUSB*`의 커널을 가진, `10c4`에서 제조한 `ea60` 번호의 제품이 연결되었을 때, 모드(권한)를 `777`로 하고 이름을 `rplidar`로 한다**</span>는 뜻이다. 권한 설정에 관한 자세한 이론은 [[ROS] Linux, ROS 주요 명령어](https://velog.io/@717lumos/ROS-Linux-ROS-%EC%A3%BC%EC%9A%94-%EB%AA%85%EB%A0%B9%EC%96%B4)에 나타내었다.

위에서 udev 설정을 일일히 알아내 한 것 대신, 이렇게 제공된 스크립트 파일을 단순히 실행시키는 것으로 설정을 간단히 수행할 수 있다.

![](https://images.velog.io/images/717lumos/post/b416ab70-9e16-4383-bb9a-078b3196a074/carbon%20(10).png)

- - -

# 참고 문헌
* ["udev," Wikipedia](https://ko.wikipedia.org/wiki/Udev)
* ["심볼릭 링크," Wikipedia](https://ko.wikipedia.org/wiki/%EC%8B%AC%EB%B3%BC%EB%A6%AD_%EB%A7%81%ED%81%AC)
* [qjadud22, "[Linux] 심볼릭 링크(Symbolic link)," tistory](https://qjadud22.tistory.com/22)
* [와사비사와, "리눅스에서 장치 이름 고정하기(udev rules)," NAVER blog](https://blog.naver.com/PostView.nhn?blogId=hanyeji0818&logNo=221769459297&categoryNo=11&parentCategoryNo=0&viewDate=&currentPage=1&postListTopCurrentPage=1&from=search)
* [vicddory, "리눅스 심볼릭 링크 만들기: 우분투 ttyUSBx udev 재시작까지," 코딩 기록](https://codingcoding.tistory.com/212)
* ["UDEV 설정," OMOROBOT](https://omorobot.gitbook.io/manual/product/omo-r1mini/ros/ros1-melodic/udev)
