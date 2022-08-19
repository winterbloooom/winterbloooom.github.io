---
title:  "[OpenCV] 그리기, 이벤트 처리, 마스크 연산"
excerpt: "그리기, 이벤트 처리, ROI & 마스크 연산"

categories:
  - Computer Vision
tags:
  - OpenCV
  - Computer Vision
  - C++

last_modified_at: 2022-03-25

use_math: true
toc: true
tock_sticky: true
toc_label: "Contents"
---

# 그리기
💜 **line(): 직선 그리기**

💜 **rectangle(): 사각형 그리기**

💜 **circle(): 원 그리기**

💜 **polylines(): 다각형 그리기**

💜 **putText(): 문자열 넣기**

```cpp
VideoCapture cap("test_video.mp4");

if (!cap.isOpened()) {
    cerr << "Video open failed!" << endl;
    return -1;
}

Mat frame;
while (true) {
    cap >> frame;

    if (frame.empty()) {
        cerr << "Empty frame!" << endl;
        break;
    }

    line(frame, Point(570, 280), Point(0, 560), Scalar(255, 0, 0), 2);
    line(frame, Point(570, 280), Point(1024, 720), Scalar(255, 0, 0), 2);

    int pos = cvRound(cap.get(CAP_PROP_POS_FRAMES));    // 현재 프레임 번호
    String text = format("frame number: %d", pos);
    putText(frame, text, Point(20, 50), FONT_HERSHEY_SIMPLEX, 0.7, Scalar(0, 0, 255), 1, LINE_AA);

    imshow("frame", frame);

    if (waitKey(10) == 27)
        break;
}

cap.release();
destroyAllWindows();
```

![](https://images.velog.io/images/717lumos/post/66292079-ed40-4e03-81d2-ccdebe29064a/1.%EA%B7%B8%EB%A6%AC%EA%B8%B0.png){: .align-center}

- - -

# 이벤트 처리하기
## 키보드 이벤트
💜 **waitKey(): 키보드 입력 대기**

인자 `delay`는 ms 단위의 대기 시간이며, default 값은 0으로 설정. 0이하이면 무한히 기다린다. 키보드 입력을 받았을 때, 눌린 키 값을 int 형으로 반환하며, 눌리지 않았으면 -1을 반환한다.

OpenCV 창이 하나라도 있어야 정상 동작을 하며, `imshow()` 함수 호출 후에 이 함수를 호출해야 영상이 화면에 나타난다.

특수 키(화살표, Fn키 등)는 `waitKeyEx()` 함수를 이용한다.

## 마우스 이벤트
💜 **setMouseCallback(): 마우스 이벤트 처리를 위한 콜백함수 등록**

콜백함수는 `typedef void (*MouseCallback)(int event, int x, int y, int flags, void* userdata)` 형식으로 정의되어야 한다.

```cpp
Mat src;
    // main과 callback 함수 모두에서 쓰기 위해 전역변수 선언
Point ptOld;

void on_mouse(int event, int x, int y, int flags, void*);

int main(void)
{
	src = imread("lenna.bmp");
	
	namedWindow("src");
	setMouseCallback("src", on_mouse);  // 창 이름이 먼저 지정되어 있어야 namedWindow를 위에 먼저 선언해줌

	imshow("src", src);
	waitKey();
}

void on_mouse(int event, int x, int y, int flags, void*)    //사용자 지정 데이터인 userdata를 쓰지 않을 예정이라 void* 뒤 이름 선언 안함
{
	switch (event) {
	case EVENT_LBUTTONDOWN: // 왼 버튼이 눌리면
		ptOld = Point(x, y);
		cout << "EVENT_LBUTTONDOWN: " << x << ", " << y << endl;
		break;
	case EVENT_LBUTTONUP:   // 왼 버튼이 눌렸다 떼어지면
		cout << "EVENT_LBUTTONUP: " << x << ", " << y << endl;
		break;
	case EVENT_MOUSEMOVE:   // 마우스가 움직이면
		if (flags & EVENT_FLAG_LBUTTON) {   
			cout << "EVENT_MOUSEMOVE: " << x << ", " << y << endl;
			line(src, ptOld, Point(x, y), Scalar(0, 255, 255), 3, LINE_AA);
			ptOld = Point(x, y);
			imshow("src", src);
		}
		break;
	default:
		break;
	}
}
```

위에서는 전역변수로 `src`를 선언했지만, 콜백함수에 `userdata`인자를 넣어주는 식으로 설정하면 `main()`에서 선언하고 지역변수로 쓸 수도 있다.

`if (flags & EVENT_FLAG_LBUTTON)`에서 `==` 연산자를 사용해 `flags == EVENT_FLAG_LBUTTON` 로 쓸 수도 있지만, `EVENT_FLAG_LBUTTON`이 1로 정의되어 있으므로 `flag`와 `&`(and) 연산을 통해 True 반환하는지 살펴보는 식이 더 좋다. 만약 `==`을 썼을 때, `ctrl` 키와 같이 마우스를 누르면 동작하지 않는다. `ctrl` 키는 8이기 때문에 true가 아니기 때문이다.

마우스 이벤트는 속도가 느리기 때문에 mouse의 이전 위치를 기록을 해뒀다가 이전 포인트에서 현재 포인트까지 직선을 그리는 식으로 구현해야 한다. 위에서 `ptOld` 변수를 쓴 이유이다. 만약 이 처리가 없다면 선이 띄엄띄엄 나올 수 있다.

## 트랙바(슬라이더 컨트롤)
💜 **createTrackbar(): 트랙바 생성 함수**

트랙바의 위치가 변할 때마다 호출될 콜백 함수는 `typedef void (*TrackbarCallback)(int pos, void* userdata)` 형식이어야 한다.

```cpp
void on_level_change(int pos, void* userdata);

int main(void)
{
	Mat img = Mat::zeros(400, 400, CV_8UC1);

	namedWindow("image");
	createTrackbar("level", "image", 0, 16, on_level_change, (void*)&img);
        // 세 번째 인자인 value(값을 받아올 곳)을 0(Null)로 하면 반드시 callback 함수를 지정해야 함

	imshow("image", img);
	waitKey();
}

void on_level_change(int pos, void* userdata)
{
	Mat img = *(Mat*)userdata;  // 원본과 동일한 영상 데이터를 가리킴

	img.setTo(pos * 16);    //256이 255보다 크기 때문에 255(white)로 출력이 됨
	imshow("image", img);
}
```

![](https://images.velog.io/images/717lumos/post/35e21413-c310-4e13-ab11-cad7e3cefe9a/2.%ED%8A%B8%EB%9E%99%EB%B0%94.jpg){: .align-center}

- - -

# 관심영역과 마스크 연산
관심영역(ROI)는 어떠한 연산을 수행하려는 임의의 영역을 말한다. ROI 기능을 지원하려는 OpenCV 함수를 쓰기 위해서는 마스크 영상을 인자로 전달해야 하는 경우가 생긴다. 마스크 영상은 그레이 스케일인 CV_8UC1 타입이며, 보통 0 아니면 255 (Black or White) 둘 중 하나의 픽셀값을 갖는 이진 영상(binary image)를 사용한다.

일례로 `copyTo()` 함수는 두 번째 인자 `mask`에 마스크 영상을 줄 수 있는데, 마스크 영상의 0이 아닌 부분에서만 copy가 일어난다.

```cpp
Mat src = imread("airplane.bmp", IMREAD_COLOR);
Mat mask = imread("mask_plane.bmp", IMREAD_GRAYSCALE);
Mat dst = imread("field.bmp", IMREAD_COLOR);

src.copyTo(dst, mask); //또는 copyTo(src, dst, mask);
```

![](https://images.velog.io/images/717lumos/post/1e5e692d-d838-4179-adbe-6b5838c15d04/3.%EB%A7%88%EC%8A%A4%ED%81%AC1.jpg){: .align-center}

위 사진은 왼쪽부터 `src`, `mask`, `dst` 영상이다. 비행기 부분만 마스크 연산을 해서 `dst`에 붙이면 아래와 같다.

![](https://images.velog.io/images/717lumos/post/1cbf1cd0-cbc9-45f8-9c07-37d477a66865/4.%EB%A7%88%EC%8A%A4%ED%81%AC2.png){: .align-center}

알파 채널이 있는 png 파일을 이용해 마스크 연산을 실습해본다. png 파일은 채널이 B, G, R, A로 4채널 이미지이며, alpha 채널은 RGB 값이 없는 투명한 공간을 0으로 채워넣고 있으며 색이 있으면 255이다. 따라서 alpha채널을 마스크로서 사용할 수 있다.

```cpp
Mat src = imread("cat.bmp", IMREAD_COLOR);
Mat logo = imread("opencv-logo-white.png", IMREAD_UNCHANGED);

vector<Mat> planes;
split(logo, planes);    // 채널 분할

Mat mask = planes[3];   //알파 채널이 4번째
merge(vector<Mat>(planes.begin(), planes.begin() + 3), logo);
    // 앞에서 3개만 따다가 새로운 vec<Mat> 객체를 만듦. BGR 만 있을 것. 그것을 logo라는 Mat 객체로 만듦
Mat crop = src(Rect(10, 10, logo.cols, logo.rows));
    // cat 영상이 더 크니까 로고 들어갈 부분만 잘라서 저장해둠. 참조이므로 이것을 변경하면 원본도 변경됨

logo.copyTo(crop, mask);    // 둘이 크기와 타입이 같으므로 새로 만들어지는 것이 아니라 crop에 직접 픽셀 들어감
```

![](https://images.velog.io/images/717lumos/post/abcc178f-20a4-4e31-8f90-5ee8743c491a/5.%EB%A7%88%EC%8A%A4%ED%81%AC3.jpg){: .align-center}