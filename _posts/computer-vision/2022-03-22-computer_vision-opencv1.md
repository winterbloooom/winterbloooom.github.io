---
title:  "[OpenCV] Ubuntu 및 VS Code 환경에서 C++, OpenCV 코드 컴파일하기"
excerpt: ""

categories:
  - Computer Vision
tags:
  - OpenCV
  - Computer Vision
  - C++

last_modified_at: 2022-03-22

use_math: true
toc: true
tock_sticky: true
toc_label: "Contents"
---

이번 포스팅에서는 Ubuntu 18.04 LTS의 Visual Studio Code에서 C++ 코드를 빌드, 실행, 디버깅하는 방법을 알아본다. 또한 C++로 작성된 OpenCV를 make하고 실행하는 법도 알아볼 것이다.

- - -
# 1. 필요 도구 설치
## 1.1. C/C++ Extension 설치
VS 코드를 실행하고 왼쪽 도크의 Extensions 아이콘을 누르거나 View - Extensions을 찾거나, 혹은 `Ctrl+Shift+X`를 눌러 Extensions을 실행시킨다.

검색 창에 C/C++을 검색해 해당 확장 도구를 설치한다.

![](https://images.velog.io/images/717lumos/post/681636d4-dc38-4b74-b95f-894b5a0f428b/1.png)

## 1.2. gcc 설치
컴파일러인 gcc를 설치하거나 설치 여부를 확인한다. 우선 설치 여부를 먼저 확인하기 위해 아래 명령어를 시행한다.

```bash
$ gcc -v
```

![](https://images.velog.io/images/717lumos/post/847e9330-c2c7-4978-b84e-b597dd36c8a0/2.png){: .align-center}

필자는 이미 설치가 되어 있어 사진처럼 나왔다.

## 1.3. gdb 디버거 설치
다음으로는 디버거를 설치한다.

```bash
$ sudo apt update
$ sudo apt install build-essential gdb
```

![](https://images.velog.io/images/717lumos/post/75ca63be-d478-4421-87c9-a59a34c0b605/3.png){: .align-center}

- - -

# 2. 파일 생성
C++ 코드를 테스트하기 위해 프로젝트 폴더와 C++ 파일을 만든다. 필자는 `cppTest` 디렉터리를 만들고 그 안에 `cppTest.cpp` 파일을 만들었다.

```bash
$ mkdir cppTest
$ cd cppTest
$ code .
```

참고로 `code`는 VS Code를 열고, `code .`하면 해당 위치에서 VS Code를 열며, `code 파일명`으로 명령하면 해당 파일을 열거나 없다면 생성해 연다.

열린 VS Code의 좌측 파일 탐색기(도크의 맨 윗 문서 아이콘 클릭 - New File 아이콘 클릭)에서 `cppTest.cpp` 파일을 추가하고 아래와 같은 간단한 코드를 입력하고 저장한다.

```cpp
#include <iostream>
using namespace std;
 
int main() {
    cout << "Hello C++!" << endl;
}
```

![](https://images.velog.io/images/717lumos/post/fe9eb269-9cb0-479f-93ce-a5164317abfa/5.png){: .align-center}

- - -
# 3. 빌드 및 실행
이제 빌드를 하고 실행시켜보자.

먼저 상단의 메뉴바에서 [Terminal] - [Configure Default Build Task]를 누른다. [C/C++: g++ 활성 파일 빌드]를 선택한다.

![](https://images.velog.io/images/717lumos/post/2d0d324d-efd4-4fb1-a796-115c888e5ed9/6.png){: .align-center}

선택과 동시에 `tasks.json` 파일이 만들어지고, 좌측 파일 탐색기에서 보면 해당 파일이 같은 프로젝트 폴더 안에 생성되었음을 확인할 수 있다. 해당 파일은 컴파일러의 빌드 설정을 담고 있다.

![](https://images.velog.io/images/717lumos/post/48180165-914a-4115-a4d5-bc4616601027/7.png){: .align-center}

다음으로는 `cppTest.cpp` 파일을 클릭해 해당 파일을 선택되게 하고, 그곳에서 `Ctrl + Shift + B` 로 빌드한다. 빌드가 되면 하단 터미널 창에 관련 안내가 나오고, 좌측 파일 탐색기에서 보면 `cppTest`라는  실행파일이 생성된다.

![](https://images.velog.io/images/717lumos/post/8d818e29-a91a-4405-9af4-807be4f5e6f3/8.png){: .align-center}

하단 터미널 창에서 `+` 버튼을 클릭하고 `bash`를 선택해 bash 터미널을 만든다. 이 과정은 Ubuntu의 터미널에서 작업해도 동일하다. 만약 VS Code에서 터미널이 안 보이거나 창을 닫았다면 상단 메뉴바 - [View] - [Terminal]에서 다시 보일 수 있다.

![](https://images.velog.io/images/717lumos/post/ec0bd6f4-7ea1-496d-bad1-d36371489291/7-1.png){: .align-center}

터미널에서 지금 만들어진 실행파일을 실행해본다.

```bash
$ ./cppTest
```

그럼 코드 내용이 실행되는 것을 확인할 수 있다.

![](https://images.velog.io/images/717lumos/post/aabf7a94-b9b6-467f-af0c-9df4bbae498f/9.png){: .align-center}

- - -

# 4. 디버깅
상단 메뉴바에서 [Run] - [Add Configuration...]을 선택한다. 이어 보이는 창에서 [C++ (GDB/LLDB)] - [g++ 활성 파일 빌드 및 디버그]를 선택한다. 

![](https://images.velog.io/images/717lumos/post/c3044a8d-a450-45cd-b084-a7e92960b897/10.png){: .align-center}

선택과 동시에 `launch.json` 파일이 만들어지고, 좌측 에는 디버깅 창이 활성화된다. 해당 파일은 디버거의 설정을 하는 파일이다. 디버깅을 하게 되면 해당 공간에 변수와 Call Stack 등이 나타난다. 

![](https://images.velog.io/images/717lumos/post/68668cb4-cc7d-4734-a3b8-f477b92ead0c/11.png){: .align-center}

> 개인적으로 Visual Studio 보다 디자인 측면에서 더 예쁜 것 같기도...?

중단점이 없어도 main 함수에서 디버깅을 하도록 하려면 `StopAtEntry`를 `true`로 바꾸고 저장한다.

![](https://images.velog.io/images/717lumos/post/c30ac48d-48eb-4b51-bb0d-8bc152cc7a67/12.png){: .align-center}

그리고 다시 `cppTest.cpp`로 돌아와 `F5`를 누르거나 상단 메뉴바에서 [Run] - [Start Debugging]을 누르거나, 아니면 좌측 창에서 ▷ 버튼을 눌러 디버깅을 시작한다.

![](https://images.velog.io/images/717lumos/post/8656f791-cad8-496a-a845-f435c0514ec8/13.png){: .align-center}

위쪽에 새로 생긴 아이콘 중에서 두 번째를 누르거나 `F10`을 누르면 해당 실행 라인 다음으로 넘어가는 등 기본 실행 방법은 다른 디버깅과 같다.

![](https://images.velog.io/images/717lumos/post/1593eb51-b244-4c5e-a862-f69fb77e2e69/14.png){: .align-center}

기타 설정 변경 등의 세부 사항과 이론은 포스팅 맨 아래 링크를 참고하기 바란다!

- - -

# 5. OpenCV 코드 make 하기
이번에는 OpenCV를 사용하는 C++ 코드를 make하고 실행해 보겠다.

과정의 진행을 위해서는 cmake가 설치되어 있어야 한다. `cmake --version`을 했을 때 버전 정보가 출력되지 않고 해당 command를 찾을 수 없다는 등의 메시지가 나오면 `sudo apt install cmake`로 먼저 설치를 진행하자.

## 5.1. 프로젝트 폴더 만들기
1번 과정과 같은 방법으로 프로젝트 폴더와 C++ 파일을 만든다.

```bash
$ mkdir opencvTest
$ cd opencvTest
$ code .
```

cpp 파일의 이름은 `opencvTest.cpp`로 했다. 코드를 아래와 같이 입력한다. 아래 코드는 단순히 이미지를 여는 내용이다.

> 아래 캡쳐 사진들에는 코드 두 번째 줄이 `#include "/usr/include/opencv2/opencv.hpp"`인데, ~`#include "opencv2/opencv.hpp"`로 실행해도 된다.~

```cpp
#include <iostream>
#include "opencv2/opencv.hpp"

using namespace std;
using namespace cv;

int main()
{
	Mat img = imread("lenna.bmp");

	if (img.empty()) {
		cerr << "Image laod failed!" << endl;
		return -1;
	}

	namedWindow("image");
	imshow("image", img);
	waitKey();
	destroyAllWindows();
}
```

또한 해당 폴더 내에 예시로 사용할 이미지 파일도 함께 넣었다. 이미지는 `lenna.bmp` 파일명을 가졌다.

![](https://images.velog.io/images/717lumos/post/a3c2ad76-a36e-4781-b229-08260f93e3fd/15.png)

## CMakeList.txt 생성
프로젝트 폴더 안에 `CMakeLists.txt` 파일을 만든다. 파일명은 정확히 이렇게 지정해야 한다. 안에 들어갈 내용의 구조는 아래와 같다.

```cmake
cmake_minimum_required(VERSION <본인 cmake의 버전>)
project(<프로젝트 폴더 이름>)
find_package(OpenCV REQUIRED)
include_directories(${OpenCV_INCLUDE_DIRS})
add_executable(<프로젝트 폴더 이름> <파일 이름>.cpp)
target_link_libraries(<프로젝트 폴더 이름> ${OpenCV_LIBS})
```

따라서 우리의 예시로 바꾸자면 이렇다.

```cmake
cmake_minimum_required(VERSION 3.10)
project(opencvTest)
find_package(OpenCV REQUIRED)
include_directories(${OpenCV_INCLUDE_DIRS})
add_executable(opencvTest opencvTest.cpp)
target_link_libraries(opencvTest ${OpenCV_LIBS})
```

## make 진행
터미널에서 `cmake.` 명령으로 `Makefile`을 생성한다. 좌측 탐색기 창에서 볼 수 있다. 해당 파일 외에도 `CMakeFiles` 디렉터리와 하위 파일들, `cmake_install.cmake` 파일, `CMakeCache.txt`도 함께 생성된다.

![](https://images.velog.io/images/717lumos/post/d0b453ef-2b11-4d24-bd0c-eeebae908610/16.png){: .align-center}

다음으로는 터미널에서 `make` 명령으로 프로그램을 빌드한다. 이때 `opencvTest`라는 이름의 실행파일이 생성된다.

![](https://images.velog.io/images/717lumos/post/7a37b928-8530-4fd1-a6c9-08fcbce25a83/17.png){: .align-center}

## 실행
터미널에서 `./opencvTest` 명령으로 프로그램을 실행한다. 그러면 우리가 넣어준 이미지가 윈도우 창 하나가 열리며 실행되는 것을 볼 수 있다.

![](https://images.velog.io/images/717lumos/post/05e3884a-012f-4cde-ac92-91fc8c1c46cf/18.png){: .align-center}

> 해당 진행 방법을 더 간단히 할 수 있는 방법이 있다고 한다. 추후 포스팅에서는 그 방법과 함께 OpenCV의 디버깅을 시도해보고자 한다.

- - -

# 참고 자료
* [Visual Studio Code "Using C++ on Linux in VS Code"](https://code.visualstudio.com/docs/cpp/config-linux)
* 황선규. 2019. OpenCV 4로 배우는 컴퓨터 비전과 머신 러닝. 길벗.