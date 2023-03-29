---
title:  "[GPS] GPS 이론: GNSS, RTK 등"
excerpt: "GPS/GNSS의 개요, GPS 신호 및 메시지(RTCM, NMEA), 측위 및 측량 기법(DGPS, RTK), 오차, 의사거리 결정, 자율주행과 GNSS"

categories:
  - Robotics
  - Perception
tags:
  - Perception
  - GPS
  - Localization
last_modified_at: 2022-01-11
---
# 1. 용어 정리
본격적인 내용에 들어가기 앞서 용어를 몇 가지 정리하고자 한다.

<span style="background-color: #7F6542; color: white">**측량(Surveying)**</span>이란, 지구 상의 여러 점들의 위치 관계와 특성을 결정하고 표현하며, 측정, 재현하는 기술이다. 측량에는 측량용 사진 촬영, 지도 제작, 건설 사업의 도면 작업 등을 포함한다.

<span style="background-color: #7F6542; color: white">**측위(Positioning)**</span>은 지물의 위치를 구하는 것으로 주로 이동체가 자신의 위치와 속도, 경로 등을 알아내는 위치 결정 기술이다.

<span style="background-color: #7F6542; color: white">**항법(Navigation)**</span>이란 현재 위치로부터 목적지까지 이동시키는 기술이나 방법으로, 주로 이동체의 위치와 속도를 결정한다. 지물(지문)(Ground Reference)/천문(Astronomial)/전파(Radio)/관성(Inertial)/위성(Satellite) 항법 등이 있다.

<span style="background-color: #7F6542; color: white">**기준국(Base Station)**</span>은 측량 및 측위, 항법의 기준이 되는 점(위치) 혹은 수신기를 뜻한다. 보통 고정되어 있다. 반면 <span style="background-color: #7F6542; color: white">**이동국(Rover)**</span>은 항법용 수신기로 GPS 수신기를 가지고 이동한다.

밑에서 보겠지만, <span style="color: #BF2D3A">**GPS와 GNSS는 그 설명에서 동일하다 보아도 된다.**</span> GPS가 GNSS의 일종이기 때문이다. 따라서 GPS 이론이라 되어 있지만 GNSS 이론이라 생각하자.

- - -

# 2. GPS의 개요
GPS는 <span style="background-color: #7F6542; color: white">**Global Positioning System**</span>의 약어로, <span style="color: #BF2D3A">**GPS 위성에서 보내는 신호를 수신해 사용자의 현위치를 알 수 있는 위성항법시스템(GNSS)의 일종**</span>이다. 1973년 미국 국방부에서 군사용으로 개발을 시작하였다.

GPS는 활용 분야를 아래와 같이 대표적으로 볼 수 있다.

* 시각 동기(Time Synchronization)
* 측위(Positioning): 위성으로부터 수신기까지 전파 도달 거리로 수신기의 3차원적 위치 결정
* 측량(Surveying): 기지점의 좌표를 기준으로 미지점의 좌표를 구한다. 4개 이상의 위성을 동시관측해 위상차를 이용한다.
* 항법(Navigation), 자세 결정, 위치기반서비스 등

모든 GPS 위성은 20,2000km의 고도를 12시간을 주기로 지구를 돌며, 지구 적도면과 $55\,^{\circ}$의 각도를 이루는 궤도면을 가지고 있다. 궤도는 총 6개로 $60\,^{\circ}$씩 1개의 궤도면 당 4개의 위성을 위치시켰다. 따라서 지구 어느 지점에서도 동시에 5~8개의 위성을 볼 수 있다.

- - -
# 3. GPS 신호
## 3-1. 반송파 신호
<span style="background-color: #7F6542; color: white">**반송파(搬送波, carrier wave)**</span>란 <span style="color: #BF2D3A">**정보를 전달하려 신호를 변조해 전자기파로 바꾼 것**</span>이다. 

각 위성은 서로 다른 주파수의 신호를 동시에 생성하며, 각각을 <span style="background-color: #7F6542; color: white">**L1 반송파(1.57542 GHz) L2 반송파(1.2276 GHz) 신호**</span>라 한다. 그 외에도 L1 ~ L5까지 있는데, 아래와 같이 구성되어 있다.

| 신호 | 주파수 | 내용 |
|---|---|---|
| L1 | 10.23 MHz × 154 = 1575.42 MHz | 항법메시지, C/A 코드, P(Y) 코드 |
| L2 | 10.23 MHz × 120 = 1227.60 MHz | P(Y) 코드, L2C 코드 |
| L3 | 10.23 MHz × 135 = 1381.05 MHz | 방위 지원 프로그램에 이용됨 |
| L4 | 1379.913 MHz | 추가적 전리층 보정 |
| L5 | 10.23 MHz × 115 = 1176.45 MHz | ARNS(Aeronautical Radio Navigation System)에 할당해 항공기 안전 운항에 사용 |

## 3-2. 의사랜덤 코드
> <span style="background-color: #7F6542; color: white">**PN(Pseudo Noise) Signal(의사 잡음 신호)**</span>
의사/유사 랜덤은 거의 무작위 수열에 가까운데, PN신호는 랜덤하게 보이나 실제로를 결정 신호 역할을 한다. <span style="color: #BF2D3A">**PRS(Pseudo-random Sequence, 의사 랜덤 수열)이나 PRN (Pseudo Random Number, 의사 난수)**</span>가 그런 수열이다. <span style="color: #BF2D3A">**PRN(Pseudo Random Noise, 의사 잡음 부호)**</span>도 같은 결로 이해하면 된다.

GPS는 의사랜덤 코드, 즉 PRN(Pseudo Random Noise) 신호라는 Ranging Code를 사용한다. 여기서 <span style="background-color: #7F6542; color: white">**Ranging Code**</span>는 <span style="color: #BF2D3A">**${\pm}$ 1이 무작위적으로 나오는, noise와 같은 긴 주기의 코드로, 한 주기동안 반복(중복)되는 패턴이 없다.**</span> 위성은 반송파에 의사랜덤코드를 실어 지상의 수신기에게 송신하고, 수신기는 이를 바탕으로 계산을 수행한다.

![](https://images.velog.io/images/717lumos/post/69b7094b-6c0d-4889-a95e-e6d6414679c4/gnss1.png)

의사랜덤 코드에는 <span style="background-color: #7F6542; color: white">**C/A 코드(Coarse/Acquisition code 또는 Standard code) 및 P 코드(Precision code)**</span> 등이 있다. 

C/A 코드는 1.023 Mbps의 속도, P코드는 10.23 Mbps의 속도를 가진다. C/A 코드는 민간에 개방되어 있으나 P 코드는 군사 전용으로, 공개되지 않은 W 코드로 암호화되어 있다. 암호화된 P 코드를 Y 코드 혹은 P(Y)코드라고 한다. 이를 해독하려면 특별한 장비와 키가 필요하다.

## 3-3. 항법 메시지
### 항법 메시지
<span style="background-color: #7F6542; color: white">**항법 메시지(Navigation Message)**</span>는 <span style="color: #BF2D3A">**GPS 위성에서 송출하는 반송파에 실리는 메시지로, 2진 부호화된 일련의 Pulse 신호의 형태를 띈다.**</span> 50bps의 속도로 지속적으로 방송된다. 항법 메시지 내에는 위성 탑재 시계의 시각 및 오차, 위성의 상태 정보, 모든 위성과 관련된 궤도 정보 및 상태(almanac), 각 궤도 정보와 이력(ephemeris), 오차 보정을 위한 계수 등이 있다.

### RTCM
RTCM은 <span style="background-color: #7F6542; color: white">**Radio technical Committee for Maritime Service**</span>의 약어로, <span style="color: #BF2D3A">**GPS 보정신호를 전송하는 데이터 포맷(규격)이다.**</span> (보정에 관한 사항은 밑에서 자세히 다룰 것이다. 지금은 단순히 이런 구조를 갖는다고만 알아두자.) 약어에서도 알 수 있듯이 선박에 사용되기 위해 처음 만들어졌고, 항공의 경우 RTCA를 사용한다. 

RTCM의 데이터는 메시지 번호(타입)으로 구분되어 표시되며, 각 메시지들은 헤더와 데이터를 포함한다.

### NTRIP
GPS의 RTCM 데이터를 수신하려면 인터넷 프로토콜이 있어야 한다. <span style="background-color: #7F6542; color: white">**NTRIP(Network Transport of RTCM via Internet Protocol)**</span>은 <span style="color: #BF2D3A">**GPS(GNSS) 보정 데이터 DGPS 등을 인터넷 프로토콜을 통해 전송하는 규약이다.**</span>

HTTP(Hypertext Transfer Protocol) 프로토콜을 기반으로 모바일 IP 네트워크를 통해 무선 인터넷 접속을 한다. RTK 보정 전송 프로토콜이기도 하다.

| 주체 | 설명 |
|---|---|
| NTRIP Source | RTK 데이터 스트리밍을 생성하는 GNSS 고정 기준국 |
| NTRIP Server | HTTP를 이용해 NTRIP Caster에 연결해 데이터를 전달함 |
| NTRIP Caster | 한 서버에 너무 많은 Client가 접속하면 딜레이, 정보 유실 발생 가능성이 있음. 이를 방지하려 프록시 서버의 역할을 함. 약 1천여 명의 수신기에게 동시에 데이터 유포 가능 |
| NTRIP Client | 인터넷 접속 가능한 NTRIP 방식으로 데이터를 수신하는 이동국 단말기. TCP/IP 인터넷 프로토콜을 사용해 유동 IP 네트워크도 가능 |

## 3-4. GPS 신호의 생성

![](https://images.velog.io/images/717lumos/post/239d3ca1-c603-4c70-863e-8cb19e3032ce/gnss26.png)

- - -

# 4. GPS 측량: 삼변측량
<span style="background-color: #7F6542; color: white">**GPS는 삼변 측량(三邊測量, Trilateration)**</span>을 사용해 측량을 진행한다.

삼변측량은 <span style="color: #BF2D3A">**물체의 상대 위치를 구하기 위해 삼각형 기하학을 사용**</span>한다. 여기엔 <span style="color: #BF2D3A">**두 개 이상의 기준점과, 각 기준점으로부터 물체까지의 거리가 필요**</span>하다. 2차원 상에서 정확하고 유일한 위치를 특정하고 싶다면 기준점은 최소 3개가 필요하다.

하나의 인공위성이 수신기에 시간 정보를 전송하면 인공위성까지의 거리는 구할 수 있으나, 같은 거리에 있는 무수한 점들이 수신기 위치의 후보가 된다. 위성이 두 개라면 두 원의 교점 두 개가 생긴다. 후보가 2개인 것이다. 따라서 하나의 원, 즉 하나의 위성이 더 있어야 수신기의 위치를 특정할 수 있다. (실제로는 4개의 위성을 사용한다.)

![](https://images.velog.io/images/717lumos/post/4f50ecde-3d2f-4eef-a913-a9f87f36c9fd/gnss27.png)

> <span style="background-color: #7F6542; color: white">**삼각측량(Triangulation Surveying)**</span>
삼변측량처럼 삼각형 기하학을 사용해 물체의 위치를 구하는 방법이다. <span style="color: #BF2D3A">**삼각형 중 미지점을 제외한 두 각과 그 사이의 변 하나의 길이를 측량한다.**</span>
반면 삼변측량은 기지점 두 개로부터 미지점(알고자 하는 점)을 사이에 둔 두 변의 길이를 측정한다.

- - -

# 5. GPS 측위법(1): 측위 기법
## 5-1. 측위 기법
GPS 측위 기법에는 수신기에 따라 아래와 같은 것들이 있다.

* <span style="background-color: #7F6542; color: white">**표준 측위 서비스(SPS, Standard Positioning System/Service)**</span>
  * <span style="color: #BF2D3A">**단독 측위로, 수신기 1대로 위치 측정**</span>
  * C/A 대역확산코드를 사용하며, 일반인도 사용할 수 있음
  * 정밀도: 10~30 m
* <span style="background-color: #7F6542; color: white">**정밀 측위 서비스(PPS, Precise Positioning Service)**</span>
  * SPS보다 chip rate가 높은 P 대역확산코드를 사용해, 군사용 신호 기반임
  * 정밀도: 1~3 m
* <span style="background-color: #7F6542; color: white">**상대 측위(DGPS, Differential GPS)**</span>
  * <span style="color: #BF2D3A">**위성항법 보정 시스템 (differential global positioning system)**</span>
  * 코드에 기반하면서 의사 거리를 보정함
  * 서로 가까운 거리에 위치한 두 수신기가 있을 때, 이 둘이 가지는 공통 오차를 상쇄해 정밀한 데이터를 얻음. 
  * <span style="color: #BF2D3A">**기준국(Base Station)(측량용 수신기)에서 오차 범위 등을 포함한 보정신호를 이동국(Rover)(항법용 수신기)에게 전송하는 것이 일반적**</span>
  * 정밀도: 1~3 m
* 후처리 상대 측위
  * 두 대 이상의 측량용 GPS 수신기를 이용해 높은 정밀도의 상대 위치를 측정함
  * 실시간 계산은 불가능함
  * 정밀도: 수 mm
* <span style="background-color: #7F6542; color: white">**실시간 이동 측위(RTK, Real-Time Kinematic)**</span>
  * <span style="color: #BF2D3A">**기준국에서 전송되는 데이터가 반송파의 수신자료임. 나머지 특징은 DGPS와 동일함.**</span>
  * <span style="color: #BF2D3A">**반송파 기반으로 측정을 진행하면서 정밀 의사 거리 보정을 진행한다.**</span>
  * <span style="color: #BF2D3A">**두 대 이상의 측량용 수신기를 이용함**</span>
  * 정밀도: 1~2 cm

DGPS와 RTK 기법을 비교해보자.

둘 모두에서, <span style="color: #BF2D3A">**일정 지역에서 수신기 하나는 정지해 있고(기준국) 나머지 하나는 이동하며 위치를 측정한다(이동국). 기준국은 위성에서 수신한 데이터들의 위치 오차를 계산하고 보정 데이터를 만든다. 이동국이 이 보정값으로 위치 결정 오차를 줄인다.**</span>

반면 DGPS와 RTK의 차이는 다음과 같다.

| DGPS | RTK |
|---|---|
| 4개 이상 위성 사용 | 5개 이상 위성 사용 |
| C/A 코드를 해석해 사용 | 반송파의 오차 보정치를 이용 |
| 장거리(100~200km)에서 사용 | 10~20km 내외에서 사용 |
| 1~5m 오차 | 1cm ~ 1m 오차 |

## 5-2. DGPS(DGNSS)
![](https://images.velog.io/images/717lumos/post/a79cab1f-42db-430d-b14d-bcd2e2e553b8/gnss4.png)

DGPS(DGNSS)를 더 자세히 살펴보자. DGNSS는 <span style="color: #BF2D3A">**차분(Differential) 측위법으로 GNSS 관측값을 처리하는 다양한 측위법이다.**</span>

신호 안에는 (1) GNSS 코드 관측에 대한 보정값(PRC, Pseudo-range Correction), (2) 기준국 위치 정보인 RTCM 메시지 Type1(Differential GPS Corrections), (3) Type3(GPS Reference Station Parameters)이 있다. 그러나 반송파의 위상 보정값은 없다.

GNSS 코드 관측에 대한 보정값은 의사 거리(GNSS 위성과 기준국 안테나 간 거리의 추정값)을 보정한 값이다. 이는 기준국 위치를 기준으로 계산되었기 때문에, 이동국과 기준국 사이의 거리를 고려해 이동국의 위치에서 보정값을 산술적으로 계산해야 한다. 다만 기준국과 이동국 간의 거리가 멀면 부정확해진다.

## 5-3. RTK
![](https://images.velog.io/images/717lumos/post/52e5e9be-7cfe-46a5-82f3-897e8744d71e/gnss5.png)

RTK는 <span style="color: #BF2D3A">**Real Time Kinematic**</span>의 약어이다. <span style="color: #BF2D3A">**위도, 경도, 고도 등 이미 정밀한 위치값을 알고 있는 기준국(예: 위성기준점)에 GPS 기지국을 설치하여 그곳의 GPS 위상 오차를 계산하고, 근처의 이동국은 해당 데이터를 받아 GPS 오차를 계산해 실시간으로 cm단위 급의 정밀도의 좌표값을 알 수 있는 측위 기법**</span>이다. 당연히 기준국과 멀어질수록 정밀도는 낮아진다.

자세한 RTK 보정 기법은 아래와 같다.

* OSR 방식
  * VRS(Vertual Reference Station) 기법: 각 오차 요인을 모두 더해 제공하는 방식
    * 네트워크 모델링을 통해 이동국의 인근 임의의 위치에서 관측된 것과 같은 가상기준점(VRS)을 생성한다.
    * 이 가상기준점과 이동국의 RTK를 통해 정밀한 이동국의 위치를 결정한다.
    사진 gnss21
  * FKP(Flachen-Korrektur-Parameter) 기법
    * 네트워크 모델링을 통해 네트워크 내부의 각 면 보정파라미터(FKP)를 생성한다.
    * 면 보정파라미터를 이동국에 전송해 RTK의 거리에 따른 오차를 보정해 정밀한 이동국의 위치를 결정한다.
  사진 gnss 22
* SSR(State Space Representation) 방식: 각 오차 요인별 보정 정보를 생성하여 제공하는 방식. 기존 고가형 장비 측지 측량 목적 외에 드론, 자율차 등의 이동체와 저가형 수신기에서 고정밀 위치 정보를 서비스할 수 있다.

VRS 방식의 순서를 조금만 더 알아보자.

<span style="color: #BF2D3A">**VRS(Virtual Reference Station)**</span>는 말 그대로 가상의 기준점이다. 기준국이 GPS 데이터를 수신해 VRS 서버로 전송하면, VRS 서버는 그 데이터로 보정치를 만든다. 이동국은 VRS 서버로 현재 위치를 전송하고(NMEA 이용(밑에 설명함)), VRS 서버는 이동국이 요청한 위치에 해당하는 보정치를 RTCM으로 전송한다. 이동국은 해당 보정치를 통해 정밀 좌표를 획득할 수 있다. 즉, 가상의 기준국을 이용해 이동국의 오차를 제거하는 것이다.

- - -

# 6. GPS 오차
GPS의 오차는 구조적 오차와 기하학적 오차로 나눌 수 있으며, 구조적 오차는 위성 위치 및 시간 / 전리층 및 대류층 / 잡음 / 다중경로 오차 등이 있고, 기하학적 오차는 위성의 배치와 관련이 있다.

![](https://images.velog.io/images/717lumos/post/13c4b59a-fb56-4f12-8ecb-77c703721877/gnss15.png)

* <span style="background-color: #7F6542; color: white">**위성 위치 및 시간 오차**</span>
  * <span style="color: #BF2D3A">**위성의 궤도에 대한 수학적 표현인 Ephemeris가 오차를 포함하거나, 상대성 원리에 의해 위성의 시계에서도 오차**</span>를 가질 수 있다.
  * 5m 이내의 오차로, 미국에서 해당 오차를 추적하며 보정 중이다.
* <span style="background-color: #7F6542; color: white">**전리층 및 대류층 오차**</span>
  * 인공위성에서 라디오파를 전송하는데, <span style="color: #BF2D3A">**전리층에서는 하전입자들이 이 신호를 끌어당겨 굴절시키고, 대류층에서는 물방울들이 굴절시킨다.**</span>
  * 0~15m의 오차를 가지며, 대기 굴절 모델 및 dual-frequency 수신기를 사용하는 등으로 보정한다.
* <span style="background-color: #7F6542; color: white">**잡음**</span>
  * <span style="color: #BF2D3A">**GPS 수신기 자체에서 발생하는 오차로, PRN 코드 잡음과 수신기 잡음이 합쳐 전체 잡음이 된다.**</span>
  * 0~3m의 오차를 가지며, 수신기 대부분이 내부 필터링 장치를 가지고 보정한다.
* <span style="background-color: #7F6542; color: white">**다중 경로 오차**</span>
  * <span style="color: #BF2D3A">**인공위성에서 송신한 신호가 다른 곳에 반사되거나 산란되어 수신기에 도달하는 경우, 지연(delay)를 갖는 오차를 발생**</span>시킨다.
  * 특히 도심의 경우 <span style="color: #BF2D3A">**Urban Canyon(건물 협곡)**</span>에 수신기가 위치할 경우 가시 위성의 수가 1~3개 정도로 적어지고, 높은 건물에 반사 및 회절되며 신호가 전달될 수 있다.(Multipath)
  * 도심의 경우 400m까지도 오차가 날 수 있으며, 심할 경우 km 단위가 되기도 한다.
  * 신호 세기에 따라 다중 경로 오차를 상쇄할 수 있다.

<div id="def-box">
<div class="def-title">가시 위성, 가시 신호(Line of Sight, LOS)</div>
<p markdown="1">
가시(可視)는 한자 뜻 그대로 '눈으로 볼 수 있다'는 뜻이다. <span style="color: #BF2D3A">**위성이 다른 장애물에 가려지지 않고 잘 보일 때**</span> 가시 위성이라 하며, 신호가 눈으로 볼 수 있도록 직선거리일 때 가시 신호라 한다.
</p>
</div>

<div id="def-box">
<div class="def-title">하전 입자(荷電粒子, charged particle)</div>
<p markdown="1">
수중에서 입자의 표면에 전기화학적 힘의 균형으로 전하를 띄는 입자
</p>
</div>

* 기하학적 오차
  * <span style="color: #BF2D3A">**측위에 이용되는 위성들의 배치로 인해 발생하는 오차**</span>로, PDOP를 사용한다.
  * PDOP가 3일 때 약 15m의 오차가 발생한다.


<div id="def-box">
<div class="def-title">DOP(Dilution of Precision)</div>
<p markdown="1">
<span style="color: #BF2D3A">**위성 배치의 고른 정도**</span>를 나타내는 개념이다. DOP가 2 이하일 때 매우 우수하며 4~5일 때 보통이고, 6 이상은 불가능하다. PDOP(Positional DOP)에 거리 오차(Range Error)를 곱하면 측위 오차가 된다.
</p>
</div>

물론 오차도 보정할 수 있다. 위치 및 시간 오차와 전리층 및 대류층 오차의 경우, <span style="color: #BF2D3A">**정확한 위치를 알고 있는 또 다른 수신기가 GPS 신호를 받아 역으로 각 오차를 계산한 뒤, 현 위치를 구해야 하는 수신기(이동국)에 전달**</span>한다. 그렇다면 해당 수신기는 오차 성분을 고려해 위치를 특정할 수 있다.

- - -

# 7. GPS 측위법(2): 의사 거리
## 7-1. 의사 거리 측정
<span style="background-color: #7F6542; color: white">**의사 거리 ${\rho_i}$(Pseudo-range)**</span>는 <span style="color: #BF2D3A">**GPS 위성과 수신기 간의 거리**</span>라 볼 수 있는데, 의사거리를 '코드 기반(시간 사용)'과 '위상 기반(위치 사용)' 거리 측정 방법 둘에 의해 계산할 수 있다.

<span style="color: #BF2D3A">**코드 기반 거리 측정 방법(시간 사용)**</span>에서는 위성이 방사한 C/A코드와 P코드 등을 수신해, 수신기 자체가 발생시킨 동일한 코드와의 시간차이로 거리를 계산한다. `(의사거리) = (전파 속도) X (시간 차)`인 것이다. 주로 저가 스마트폰 내장 GPS 등 저가 수신기에서만 사용한다.

<span style="color: #BF2D3A">**위상 기반 거리 측정 방법(위치 사용), 혹은 반송파 기반 거리 측정 방법**</span>은 아래와 같은 원리를 가진다.

의사 랜덤 코드를 사각함수로 나타냈을 때 <span style="color: #BF2D3A">**+1 혹은 -1의 시간 간격(chip)**</span>을 <span style="background-color: #7F6542; color: white">**${T_c}$, 칩의 시간 폭(chip width)**</span>라고 한다. <span style="color: #BF2D3A">**위성과 수신기 사이의 PRN 코드 칩의 개수를 ${N}$, 즉 신호가 수신될 때 ${T_c}$가 몇 개 있었는지를 ${N_i}$**</span>라 하자.


<div id="def-box">
<div class="def-title">칩(Chip)</div>
<p markdown="1">
빠르게 변화하는 파형 변화의 한 부분
</p>
</div>

그렇다면 빛의 속도를 ${c}$라 할 때, (에러가 없다 하면) <span style="color: #BF2D3A">**실제 거리 ${R_i}$는 ${c \times T_c \times N_i}$**</span>가 된다. ${T_c \times N_i}$는 <span style="color: #BF2D3A">**${ToA_i \times ToD_i}$**</span>라고도 할 수 있는데 <span style="background-color: #7F6542; color: white">**${ToA_i}$는 Time of Arrival**</span>, 수신기가 신호를 수신한 시각이며, <span style="background-color: #7F6542; color: white">**${ToD_i}$는 Time of Departure**</span>, 위성이 신호를 방사한 시간이다. 따라서, <span style="color: #BF2D3A">**위성에서 방사한 시간에서 수신기가 수신한 시간의 차에 빛의 속도를 곱하면 거리**</span>가 된다.

![](https://images.velog.io/images/717lumos/post/55f5a640-2796-4f2c-8903-6ce8c6202eb6/gnss9.png)

## 7-2. 의사 거리 오차
그러나 위성은 계속 움직이고 수신기마다 가진 시계과 시계의 오류가 있다. 따라서 GPS에서의 거리 계산은 정확하거나 간단하지 않다.

특정 시각에서 위성의 위치를 계산할 수는 있다. 위성이 방사하는 메시지 중 궤도 이력(ephemeris) 데이터가 있는데, 이를 이용한다. 수신기는 자신이 받은 신호가 얼마만큼의 시간을 거쳐 수신되었는지 계산하고, 위성에서 방사된 시간을 역추적해 위성의 위치를 구할 수 있다. 그러나 수신기 시계 자체의 오차가 있다면 ${ToA}$에 에러를 포함하므로 문제가 된다.

이를 보정하여 사용자와 위성 간 의사거리 ${\rho_i}$(Pseudo-range), 즉 <span style="color: #BF2D3A">**시각 오차가 포함된 거리를 계산**</span>할 수 있다.

<span style="color: #BF2D3A">**${b_u}$를 m 단위의 시각(clock) 에러에 빛의 속도 ${c}$를 곱한 것**</span>이라고 하자. 예를 들어, 1초 에러라면 ${c = 3 \times 10^8 m/s}$이므로 ${3 \times 10^8 m}$이다. 이 ${b_u}$를 기존의 수식 ${ToA_i \times ToD_i}$에 더해 의사거리 ${\rho_i = ToA_i \times ToD_i + b_u}$로 표현할 수 있다.

또 다르게는 위성의 위치와 수신기의 위치를 유클리드 거리로 구함으로써 의사거리를 구할 수 있다. 위성의 위치를 ${(x_i, y_i, z_i}$, 수신기의 위치를 ${(x_u, y_u, z_u}$라고 할 때 <span style="color: #BF2D3A">**${\rho_i = \sqrt{(x_i - x_u)^2 + (y_i - y_u)^2 + z_i - z_u)^2} + b_u}$**</span>이다.

![](https://images.velog.io/images/717lumos/post/1f532a6f-0753-4318-bf1a-e039bde09ed1/gnss10.png)

## 7-3. 의사거리 보정
이번엔 보정을 위한 식을 살펴보자.

<span style="color: #BF2D3A">**식 ${\rho_i - \rho_{Euclidean}}$은 시각과 위치에 의한 오차를 나타낼 것이다.**</span> 이를 활용할 것이다.

위치에 의해 거리를 계산한 식 ${\rho_i = ToA_i \times ToD_i + b_u}$을 테일러 급수로 미분하면, ${\delta \rho_i}$가 되고, 아래 식처럼 <span style="color: #BF2D3A">**선형화된 식으로 나타낼 수 있다.**</span> 여기서 'SV'는 Setellite Vehicle의 약자로, 분모 항은 몇 번째 위성의 위치와 유클리디 거리 차이인지를 나타낸다. Ephemeris 데이터로부터 위성의 위치를 계산할 수 있으므로, <span style="color: #BF2D3A">**수신기의 위치를 특정한다면 분자 역시 위성과 수신기의 위치 값으로 계산할 수 있다.**</span>

![](https://images.velog.io/images/717lumos/post/2a422982-0850-4fed-93f1-38874225b4a4/gnss10-2.png)

선형화된 위 식을 행렬로 표시하면 아래와 같다.

![](https://images.velog.io/images/717lumos/post/cd43d47b-0835-4354-bb7a-b90017c55b01/gnss12.png)

선형화 식에 <span style="color: #BF2D3A">**Geometry Matrix인 g = ${\left[ \delta x_u \ \delta y_u \ \delta z_u \ \delta b_u\right]}$를 곱하면, 수신기의 위치와 시각 오차 성분을 측정된 의사거리 ${\rho_i}$ 에러 성분이 된다.**</span>

해당 식을 반대로 생각해 보면 수신기위 실제 위치를 비교적 정확하게 구할 수 있다.

<span style="color: #BF2D3A">**위 선형화 식에서 Geometry Matrix만 남기고 아래처럼 식을 바꾼다면, 의사 거리의 보정(오차)값에 어떤 행렬을 곱했을 때 수신기의 위치와 시각에 대한 보정값으로 환산이 된다.**</span>

![](https://images.velog.io/images/717lumos/post/dd2a5436-baca-437c-91aa-473098e3d075/gnss13.png)

가장 먼저, <span style="color: #BF2D3A">**초기 수신기 위치를 특정해 그곳에서 위성의 신호들을 측정해 ${\delta \rho_i}$ 성분**</span>을 얻는다. 그런 다음 <span style="color: #BF2D3A">**${\delta \rho_i}$로 ${\delta x_u \ ,\ \delta y_u \ ,\ \delta z_u \ \ ,\ \delta b_u}$를 얻어 이것이 곧 해당 위치와 시각에 대한 보정 성분**</span>이 된다. <span style="color: #BF2D3A">**이 보정 성분을 해당 위치의 신호에 더하면 새로운 위치와 시각을 얻게 된다.**</span>

새 위치를 얻게 되었으므로 그 위치에서의 위성까지의 거리도 바뀔 것이다. 그럼 <span style="color: #BF2D3A">**다시 유클리드 거리, ${\rho_i}$를 새로 업데이트해야 하고, ${\rho_i}$ 차이로 ${\delta \rho_i}$가 구해질 수 있다.**</span>

<span style="color: #BF2D3A">**${\delta \rho_i}$로 다시 공식의 처음으로 돌아가 Geometry Matrix의 역행렬과 곱하면 다시 위치와 시각에 대한 보정 성분을 얻게 되는 과정이 반복**</span>된다. 이런 과정을 반복하다보면 어느 순간 <span style="color: #BF2D3A">**${\delta x_u \ ,\ \delta y_u \ ,\ \delta z_u \ \ ,\ \delta b_u}$가 매우 작아져 업데이트가 불필요할 시점**</span>이 온다. 통상적으로 4회 반복 후에 cm 단위로 업데이트된다.

위와 같은 선형화와 빠른 계산을 사용해 GPS 수신기는 빠르게 위치를 계산할 수 있다.

- - -

# 8. NMEA
## 8-1. NMEA-0183
<span style="background-color: #7F6542; color: white">**NMEA(National Marine Electronics Association)**</span>는 정확히는 '해양 전자공학 산업의 발달과 교육을 위해 모인 비영리 단체'이다. 

이곳에서 정의한 프로토콜 중 <span style="background-color: #7F6542; color: white">**NMEA-0183**</span>은 <span style="color: #BF2D3A">**GPS 통신의 표준 프로토콜이다. GPS 수신기가 위성 신호를 해석해 이 정보를 외부에 알릴 때 사용한다.**</span>

3개 레이어(Physical / DataLink / Application Layer)로 구성되어있다. 이 중 어플리케이션 레이어는 NMEA 문장에 대한 규약을 정의하며 GPS 등의 표준 프로토콜이 된다. ASCII 코드로 직렬(Serial) 방식의 통신을 사용한다.

아래는 그 예시이다.

```
$GPGGA,141113.999,3730.0308,N,12655.2369,E,1,06,1.7,98.9,M,,,,0000*3E

$GPGSA,A,3,02,07,01,20,04,13,,,,,,,3.7,1.7,3.2*31 

$GPRMC,141113.999,A,3730.0308,N,12655.2369,E,19.77,195.23,101200,,*3C

$GPGSV,2,1,07,07,84,025,47,04,51,289,48,20,40,048,47,02,32,203,46*74
```

## 8-2. NMEA 문장
GPS 수신기가 위와 같은 내용을 <span style="color: #BF2D3A">**Serial 출력의 형태**</span>로 내보내는데, <span style="color: #BF2D3A">**`$`로 시작하는 한 줄이 NMEA 문장(메시지)**</span>이라 한다. NMEA 메시지는 여러 타입이 있고 각 타입은 고유의 프로토콜이 있으며, <span style="color: #BF2D3A">**NMEA 메시지의 첫 5글자인 Sentence ID를 읽어 타입을 알 수 있다. 데이터 필드의 구분은 `,`로 하고 `*`로 끝난다.**</span> 줄바꿈 문자 `<CR>`, `<LF>`을 Linefeed라고 하여 문장의 끝에 붙인다.

<span style="color: #BF2D3A">**Device ID, 혹은 Talker ID는 장치(제품)를 구분하는 ID로, `$` 바로 뒤의 2개 문자**</span>이다. 예를 들어 GPS 제품은 GP, Loran-C receive는 LC, Omega Navigation receive는 OM, 레이더는 RA이다.

<span style="color: #BF2D3A">**Sentence ID, 혹은 Sentence Name은 해당 프로토콜이 가진 데이터의 종류**</span>이다. (Device ID까지 합쳐 앞 5개를 Sentence ID라고 하기도 한다)

맨 마지막 <span style="color: #BF2D3A">**`*` 뒤에는 Checksum이 있어 `$`와 `*` 사이의 모든 데이터를 XOR(배타적 OR) 계산**</span>한다.

통상적으로 GPS 수신기에서는 GP, LC, OM 등 몇 가지 Device ID만 제한적으로 출력되는데, 대표적으로 GPGGA를 살펴본다.

## 8-3. GPGGA
GPGGA는 Global Positioning System Fix Data로, 17개의 필드를 가지는 데이터 타입이다. 

![](https://images.velog.io/images/717lumos/post/378dfc5a-7596-4497-9496-6c65dd8eb80a/gnss-nmea.png)

| Index | Field | Value | Description |
|:---:|:---:|---|---|
| 1 | Sentence ID | GPGGA | Global Positioning System Fix Data |
| 2 | UTC Time | 114455.532 | 그리니치 표준시 기준 시간으로, hhmmss.sss 형태. 날짜는 GPRMC에서 처리해야 함. 한국에서 사용 시 +9 |
| 3 | Latitude | 3735.0079 | ddmm.mmmm(도분) 형식의 위도로, 예시에서는 37도 35.0079분. deg 단위 환산 시 37 + 35.0079 / 60 = 37.5도 |
| 4 | N/S Indicator | N | 남위가 S, 북위가 N |
| 5 | Longitude | 12701.6446 | dddmm.mmmm(도분) 형식의 경도로, 예시에서는 127도 1.6446분. deg 단위 환산은 위도와 동일 |
| 6 | E/W Indicator | E | 동경이 E, 서경이 W |
| 7 | Position Fix | 1 | 위치가 결정되었는가를 나타냄. 0(Invalid 잘못된 데이터), 1(Valid SPS. GPS 제공 기본 위성만 사용), 2(Valid DGPS. DGPS 보정해 계산), 3(Valid PPS) |
| 8 | Satellites Used | 03 | 계산에 쓸 위성 수. 최소 3개 이상이어야 함 |
| 9 | HDOP | 7.9 | horizontal dilution of Precision. 2차원적 오차결정(수평방향) |
| 10 | Altitude | 48.8 | WGS-84 타원체의 평균해수면(MSL, Mean Sea Level) 기준 고도 |
| 11 | Altitude Units | M | 고도값의 단위. 예시에서는 meter |
| 12 | Geoid Seperation | 19.6 | 지오이드(geoid) 고(height) |
| 13 | Seperation Units | M | 지오이드고의 단위. 예시에서는 meter |
| 14 | DGPS Age | 0.0 | DGPS 사용시 마지막으로 업데이트한 시간(데이터의 Age) |
| 15 | DGPS Station ID | 0000 | DGPS 기지국의 ID |
| 16 | CheckSum | 48 | Checksum |
| 17 | Terminator | CR/LF | 줄바꿈 문자 |

- - -

# 9. GNSS
GPS는 미국의 시스템이나, 이와 비슷하도록 다른 국가들도 자체적 측위 시스템을 구축했다. 이를 모두 합쳐 GNSS라고 통칭한다.

GNSS는 <span style="background-color: #7F6542; color: white">**Global Navigation Satellite System**</span>의 약어로, 우리말로는 범지구 위성 항법 시스템, 혹은 위성 항법 시스템이라 한다. <span style="color: #BF2D3A">**범지구적인 측위정보 서비스 시스템으로, 위성에서 발신한 전파를 이용해 정밀한 측위 정보를 제공**</span>한다.
  
지구 궤도 상에 수십 개의 위성군이 전 지구를 관측할 수 있도록 함으로써 사용자에게 위치, 항법, 시각 정보를 제공한다. 이를 위해 배치된 위성군을 일정한 형상으로 배치 및 유지하고, 통신 링크를 통해 위성의 정확한 궤도 정보를 실시간으로 탑재된 원자 시계로 동기시켜 송출한다. 
  
현재 글로벌 GNSS로는 <span style="color: #BF2D3A">**GPS**</span>(Global Positioning System, 미국), <span style="color: #BF2D3A">**GLONASS**</span>(GLObal NAvigation Satellite System, 러시아), <span style="color: #BF2D3A">**Galileo**</span>(유럽 연합), <span style="color: #BF2D3A">**BeiDou**</span>(중국)가 있으며, 이 외에도 QZSS(Quasi-Zenith Satellite System, 일본) NAVIC(Navigation Indian Constellation, 인도) 등이 존재한다. 2020년 기준으로 113 개의 항법 위성이 지구 주위를 돌고 있다. 2022년에는 125개의 위성이 있을 것으로 예상되어, 2002년 32개였던 것에 비해 약 4배 이상의 증가세이다. 따라서 Urban Canyon 처럼 가시 위성의 수가 적은 등의 문제를 완화하고 정확도를 높일 수 있을 것으로 보인다. 또한 각국은 GPS의 현대화를 위해 기술 개발 및 위성 업데이트를 진행 중이다.

# 10. 국토지리정보원, 국토정보플랫폼
## 10-1. 위성기준점 서비스
현재 국내 77개의 위성기준점이 있으며, 국토지리정보원에서는 이 <span style="color: #BF2D3A">**위성기준점의 일별 관측 데이터를 GNSS 후처리용으로 일반에게 국토정보플랫폼을 통해 제공하고 있다.**</span> 2005년부터는 위성기준점을 이용해 실시간으로 고정밀의 위치결정이 가능한 <span style="color: #BF2D3A">**네트워크 RTK 서비스를 제공**</span>하고 있다.
  
위성기준점 지도 및 좌표 다운로드는 [국토정보플랫폼 위성 기준점 현황](http://map.ngii.go.kr/ms/svcIntrcn/gnss/baseInfo.do)에서 볼 수 있다.

![](https://images.velog.io/images/717lumos/post/1b9df6af-746e-4375-93fb-b3b87b2bee3a/gnss20.jpg)

## 10-2. GNSS 데이터 통합 서비스
8개기관(국토지리정보원, 국립해양측위정보원, 한국천문연구원, 서울특별시, 한국지질자원연구원, 한국국토정보공사, 국가기상위성센터, 우주전파센터)이 참여해 GNSS데이터 통합체계를 구축했으며, <span style="color: #BF2D3A">**GNSS 상시관측소의 정보와 위성 수신 데이터를 통합적으로 민간에 제공하고 있다.**</span>

[링크](https://www.gnssdata.or.kr/main/getMainView.do)에 접속하면 서비스를 이용할 수 있다. <span style="color: #BF2D3A">**NTRIP Client를 이용해 GNSS 실시간 데이터(RTCM)를 수신할 수 있고, 일/시간 단위 GNSS 후처리 데이터(RINEX)를 수신할 수 있다.**</span>


<div id="def-box">
<div class="def-title">RINEX(Receiver Independent Exchange Format)</div>
<p markdown="1">
GPS 관측치를 받는 수신기에 구애받지 않고 공통적인 양식으로 변환되는 GPS 데이터 형식으로, GNSS 후처리 데이터이다.
</p>
</div>

- - -

# 11. 자율주행/운항과 GNSS
## 11-1. GPS 센서 퓨전(GNSS + INS)
자율주행 혹은 자율운항의 위치 측정에 GNSS는 시간과 위도, 경도, 방위각, 속도 등을 사용할 때 쓸 수 있다. 

GNSS로 연속 측정을 할 때 오차의 누적은 없을 수도 있으나, 기상 상태나 주변 환경에 따라 신뢰도 등에 영향을 받을 수 있다. 따라서 <span style="color: #BF2D3A">**GNSS와 INS를 결합한 형태로 사용하는 경우가 많다.**</span>
<span style="color: #BF2D3A">**GNSS는 건물이나 나무 등 장애물이 있을 경우 위성 신호의 수신이 원활치 않아 데이터의 신뢰도가 떨어진다.**</span> 당연히 실내의 경우 신호가 약해진다. <span style="color: #BF2D3A">**INS의 경우 누적 오차를 해결할 방법이 없어 오차의 누적(Drift 현상)이 일어날 수 있다.**</span>
<span style="color: #BF2D3A">**GNSS 수신 불가 지역에서는 IMU의 연속성으로 데이터의 jumping 현상을 보정하며, GNSS 정확성으로 IMU의 오차 누적을 보완할 수 있어, 둘을 융합하면 정확하면서 연속적 위치 데이터를 취득할 수 있다.**</span>

![](https://images.velog.io/images/717lumos/post/80862ba1-9530-4292-b1d3-807f5e7650b7/gnss16.png)

자세한 과정을 보자.

일단<span style="color: #BF2D3A">**GPS가 현 위치를 결정했다 하고**</span>, 다음 위치가 계산될 떄까지 시간차가 발생한다. 이 시간 동안 <span style="color: #BF2D3A">**IMU를 통해 이 작은 단위로의 위치 및 속도 변화를 예측할 수 있다**</span>. 다음 GPS 위치 측위 결과가 나오기 전에 예측하였다 하여 이를 <span style="background-color: #7F6542; color: white">**사전 추정**</span>이라고 한다.

이렇게 <span style="color: #BF2D3A">**사전 추정된 위치와 속도를 다음 GPS 측위 결과와 비교하여 IMU의 정확도를 칼만 필터(Kalman Filter)로 평가 및 보정한다**</span>. 두 측위 결과를 보고 추정한다 하여 <span style="background-color: #7F6542; color: white">**사후 추정**</span>이라 하며, 이를 통해 더욱 정확한 위치의 변화, 속도의 변화를 파악할 수 있다.


<div id="def-box">
<div class="def-title">칼만 필터(Kalman Filter, KF)</div>
<p markdown="1">
잡음이 포함된 선형 역학계의 상태를 추적하는 재귀(recursive) 필터이다. <span style="background-color: #7F6542; color: white">**확장 칼만 필터(Extended KF, EKF)**</span>는 비선형 데이터에도 칼만 필터를 적용할 수 있게 하여, GPS 등의 비선형 상태 추정에 사용되고 있다.
</p>
</div>

## 11-2. 지형지물 기반 상대 측위
다만 IMU와 GPS 각각이 오차를 내포하고 있으므로, <span style="color: #BF2D3A">**인공지능 및 센서 등을 이용해 주변의 지형지물(표지판, 신호등 등)의 위치로부터 현 위치를 알아내기도 한다.**</span> 지형지물은 정확한 위치를 특정하라 수 있으며, 자율주행/운항 차체의 카메라, 라이다, 레이다 등의 센서로 이를 인식하면 지형지물까지의 거리와 각도를 얻을 수 있다.
이렇게 <span style="background-color: #7F6542; color: white">**상대 측위**</span>란, <span style="color: #BF2D3A">**주변 고정물의 위치를 센서가 인지하여 차체의 상대 위치를 역으로 파악하여 GNSS의 측위 오차를 보상하는 기술**</span>이다.

지형지물로부터 떨어진 거리(L)와 각도(${\theta}$)는 각각 불확실성 ${\sigma_L \ ,\ \sigma_{theta}}$를 갖고, 거리와 각도를 가우시안(불확실성 함수)로 표현할 수 있다. 주변의 여러 지형지물에 대해 같은 과정을 반복해 합치면 정밀한 상대 측위가 가능하다.

![](https://images.velog.io/images/717lumos/post/48a124b0-eb22-49a0-816d-1c47bba90608/gnss17.png)
  
## 11-3. V2X 기반 상대 측위
<span style="background-color: #7F6542; color: white">**V2X**</span>는 Vehicle To Something(Anything)이다. 차와 연결되는 것이 다른 차라면 V2V가 되는 식으로, 다른 무언가와 연결된다는 뜻이다.

주변의 자동차가 V2X 모듈을 보유하고 있다면 이를 기반으로 자동차 간 상태 측위를 할 수 있다. 서로 자신의 위치를 주고 받으며 측정 결과를 바탕으로 상대 측위를 진행하는 것이다. 즉, <span style="color: #BF2D3A">**자차와 상대 차의 위치와 각도, 거리의 측정값과 상대 차가 자신의 위치를 자차에 알려준 값을 사용해 위치를 역으로 계산하는 방식이다.**</span>

주변의 자동차를 지형지물이라 생각한다면 인식한 차와 거리와 각도의 불확실성이 있을 것이다. 그러나 주변의 차가 자차의 위치를 V2X로 알려준다면, 자차가 계산한 값과 비교하는 등의 과정을 통해 보다 정확한 위치를 특정할 수 있다. 또한 여러 대의 자동차 간 정보가 전달된다면 정확도는 향상될 것이다.

이러한 <span style="background-color: #7F6542; color: white">**협력 항법(Cooperative Positioning)**</span>은 <span style="color: #BF2D3A">**GNSS 정보, 오차 정보, 상대차에 대한 정보 등 복합적인 정보를 공유함으로써 더욱 정확한 측위를 가능하게 하는 것**</span>이다. 더불어 사이버 공격은 통신 장치보다는 센서 자체에 대한 공격이 대부분이므로, 협력 항법을 사용하면 잘못된 센서 데이터를 보정할 수 있어 사이버 공격에 대한 대응도 어느 정도 가능하다.

<div id="inserted-box">
    SPAWN, MRH-SPAWN(2015) 연구 결과를 참고해보면 좋다.
</div>

## 11-4. 인공지능 기반 다중 경로 오차 완화
위에서 살펴본 바와 같이, 건물이 밀집한 지역의 경우 GPS 신호가 반사, 굴절, 회절되며 큰 오차를 보일 수 있다. 따라서 이런 <span style="color: #BF2D3A">**다중 경로 오차를 완화시키기 위해 인공지능 신경망이 개발되어 가시 신호인지 Multipath 신호을 구별**</span>하는 등이다.

다중 퍼셉트론 신경망(Multi Layer Perceptron)에 의사 거리의 변화율(${\dot{\rho}}$), 신호의 세기 성분(${CN_0}$), 그리고 신호의 Elevation Angle(EL, 위성 신호가 수평으로부터 얼마나 높이에서 내려오는가)를 입력해 학습시킨다. 그럼 MLP는 상당히 높은 정확도로 해당 신호가 Line of Sight(LOS, 가시 신호)인지 Non-Line of Sight 신호인지 구별한다. 보통 Multipath  신호는 반사되며 에너지를 소실해 LOS 신호보다 신호 세기가 작다.

- - -

# 참고 문헌
* ["측량," Wikipedia](https://ko.wikipedia.org/wiki/%EC%B8%A1%EB%9F%89)
* [차재복, "GPS, GNSS," 정보통신기술용어해설](http://www.ktword.co.kr/test/view/view.php?no=834)
* ["반송파," Wikipedia](https://ko.wikipedia.org/wiki/%EB%B0%98%EC%86%A1%ED%8C%8C)
* [뽕짝뽕짝, "삼변 측량: GPS는 어떤 원리로 나의 위치를 알아내는 걸까?," Naver blog](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=trnoo&logNo=221492873516)
* [국토정보플랫폼 홈페이지](http://map.ngii.go.kr/ms/svcIntrcn/gnss/gnssIntro.do)
* [GNSS 데이터 통합센터 홈페이지](https://www.gnssdata.or.kr/main/getMainView.do)
* ["위성기준점 서비스", 국토정보플랫폼](http://map.ngii.go.kr/ms/mesrInfo/gnss/vrsUserView.do)
* ["GNSS 현황," 서울시네트워크 RTK시스템](https://gnss.eseoul.go.kr/system_sub1_01)
* ["GNSS 오차," 서울시네트워크 RTK시스템](https://gnss.eseoul.go.kr/system_sub1_02)
* ["Satellite navigation," Wikipedia](https://en.wikipedia.org/wiki/Satellite_navigation)
* [갱파카, "[Localization] RTK, NTRIP에 대한 설명," tistory](https://99ar-paka.tistory.com/7)
* [다이브김, "인공위성의 종류," Naver blog](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=kim_changsu&logNo=221208788133)
* ["Networked Transport of RTCM via Internet Protocol," Wikipedia](https://en.wikipedia.org/wiki/Networked_Transport_of_RTCM_via_Internet_Protocol)
* [하얀쿠아, "[GPS 이야기] NMEA-0183 형식, NMEA Sentence Format," 하얀쿠아의 이것저것 만들기 Blog](https://techlog.gurucat.net/239)
* ["NMEA 0183," Wikipedia](https://ko.wikipedia.org/wiki/NMEA_0183)