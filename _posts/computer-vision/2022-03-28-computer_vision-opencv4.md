---
title:  "[OpenCV] 밝기 및 명암 조절, 히스토그램"
excerpt: "밝기 및 명암 조절, 히스토그램 스트레칭 및 평활화"

categories:
  - Computer Vision
tags:
  - OpenCV
  - Computer Vision
  - C++

last_modified_at: 2022-03-28

use_math: true
toc: true
tock_sticky: true
toc_label: "Contents"
---

# 밝기 조절하기

💙 **+ / - 연산자 재정의 또는 add() 함수 등 사용**

💙 **saturate_cast<템플릿>()함수 등으로 포화연산 처리하기**

트랙바를 이용해 영상의 밝기를 조절해본다.

```cpp
void on_level_change(int pos, void* userdata);

int main()
{
	Mat src = imread("lenna.bmp", IMREAD_GRAYSCALE);

	if (src.empty()) {
		cerr << "Image laod failed!" << endl;
		return -1;
	}

	namedWindow("image");
	createTrackbar("level", "image", 0, 200, on_level_change, (void*)&src);
	setTrackbarPos("level", "image", 100);

	waitKey();
}

void on_level_change(int pos, void* userdata)
{
	Mat img = *(Mat*)userdata;
	imshow("image", img + (pos - 100));
}
```

![](https://images.velog.io/images/717lumos/post/8b5e566e-06b2-4f50-8caa-771f2218a2e4/1.%EB%B0%9D%EA%B8%B0%EC%A1%B0%EC%A0%88.jpg){: .align-center}

이번에는 동영상에서 관심영역(ROI)를 지정해 그 영역에서의 평균 밝기를 128로 일정하게 유지되도록 밝기를 보정해본다.

```cpp
// ROI가 될 영역의 점들을 roiPoints 로 선언
vector<vector<int>> roiPoints({
    vector<int>({ 240, 280 }),
    vector<int>({400, 280}),
    vector<int>({620, 440}),
    vector<int>({20, 440})
    });

VideoCapture cap("base_camera_dark.avi");

if (!cap.isOpened()) {
    cerr << "Video open failed!" << endl;
    return -1;
}

Mat frame, gray;
Mat mask(frame.rows, frame.cols, CV_8UC1, Scalar(0));
Mat dst(frame.rows, frame.cols, CV_8UC1, Scalar(0));

while (true) {
    cap >> frame;
    if (frame.empty()) break;

    // grayscale 변환
    cvtColor(frame, gray, COLOR_BGR2GRAY);

    // 원본 영상에 ROI 범위를 line으로 그리기
    line(frame, Point(240, 280), Point(400, 280), Scalar(0, 0, 255), 2);
    line(frame, Point(400, 280), Point(620, 440), Scalar(0, 0, 255), 2);
    line(frame, Point(620, 440), Point(20, 440), Scalar(0, 0, 255), 2);
    line(frame, Point(20, 440), Point(240, 280), Scalar(0, 0, 255), 2);

    // ROI 부분 mask 생성
    fillPoly(mask, roiPoints, 255);

    //평균 밝기 구해 적용하기
    int m = mean(gray, mask)[0];
    dst = gray + (128 - m);

    //영상 보이기
    imshow("frame", frame);
    imshow("gray", gray);
    imshow("dst", dst);

    if (waitKey(10) == 27)
        break;
}

cap.release();
destroyAllWindows();
```

![](https://images.velog.io/images/717lumos/post/1e4226f2-da8e-4144-b2ee-76bf9c9de26c/2.%ED%8F%89%EA%B7%A0%EB%B0%9D%EA%B8%B0.jpg){: .align-center}

- - -

# 명암비 조절하기
밝기 조절이 +/- 연산이었다면 명암비는 곱하기(`*`) 연산이다. 밝기의 중간값인 (128, 128)을 반드시 지나도록 설정하면 전체적으로 어두워지거나 전체적으로 다 밝아지는 현상을 방지할 수 있다. 식으로 작성하면 아래와 같다.

$$ \rm dst = saturate(src(x, y) + (src(x, y) - 128) \times alpha) $$

입력 영상의 평균 밝기를 m 이라 하면 (m, m)을 지나도록 설정한다면 아래와 같다.

$$ \rm dst = saturate(src(x, y) + (src(x, y) - m) \times alpha)$$

![](https://images.velog.io/images/717lumos/post/49c0a7e4-3c3f-4a5f-95c4-96ee51527abe/3.%EB%AA%85%EC%95%94%EB%B9%84.png){: .align-center}

- - -

# 히스토그램
영상의 픽셀값의 분포를 그래프 형태로 표현한 것이다. 확률의 개념을 도입해 히스토그램을 정규화시켜 사용하는 경우가 많다.

g는 픽셀값, p(g)는 그 픽셀값이 나타난 횟수(픽셀의 개수, h(g))를 전체 개수로 나눈, 즉 해당 픽셀값이 차지하는 비율이라고 하면 아래의 식이 성립한다. 

$$ p(g) = \cfrac{N_g}{w \times h} , \sum_{g=0}^{L-1} p(g) = 1 $$

## 히스토그램 구하기
직접 구현하는 방식은 아래와 같다.
```cpp
int hist[256] = { 0, }; 
    // GrayScale 의 입력 영상을 쓰므로, 밝기정보는 256개가 존재함
    // 이를 모두 0으로 초기화함

for (int j = 0; j < src.rows; j++) {
    for (int i = 0; i < src.cols; i++) {
        hist[src.at<uchar>(j, i)]++;    // 특정 픽셀값이 나타난 횟수 누적
    }
}

int histMax = 0;    // 최빈 픽셀값
for (int i = 0; i < 256; i++) {
    if (hist[i] > histMax) histMax = hist[i];
}

Mat imgHist(100, 256, CV_8U, Scalar(255));
  // 히스토그램을 나타내기 위한 이미지로, 흰색으로 초기화
for (int i = 0; i < 256; i++) {
    line(imgHist, Point(i, 100),
        Point(i, 100 - cvRound(hist[i] * 100 / histMax)), Scalar(0));
        // 최대 높이인 histMax를 기준으로 특정 픽셀의 빈도수를 히스토그램으로 나타냄
}
```

![](https://images.velog.io/images/717lumos/post/7f0c4d1a-22fb-441a-b25b-9b9b571d4048/4.%ED%9E%88%EC%8A%A4%ED%86%A0%EA%B7%B8%EB%9E%A8.jpg){: .align-center}

💙 **calcHist()**: OpenCV에서 제공되는 히스토그램 도출 함수

```cpp
// 히스토그램 Mat 객체 만들기
Mat calcGrayHist(const Mat& img)
{
	CV_Assert(img.type() == CV_8U);

	Mat hist;
	int channels[] = { 0 };
	int dims = 1;
	const int histSize[] = { 256 };
	float graylevel[] = { 0, 256 };
	const float* ranges[] = { graylevel };

	calcHist(&img, 1, channels, noArray(), hist, dims, histSize, ranges);

	return hist;
}

// 히스토그램 그리기
Mat getGrayHistImage(const Mat& hist)
{
	CV_Assert(hist.type() == CV_32F);
	CV_Assert(hist.size() == Size(1, 256));

	double histMax = 0.;
	minMaxLoc(hist, 0, &histMax);   // 최댓값 찾기

	Mat imgHist(100, 256, CV_8U, Scalar(255));
	for (int i = 0; i < 256; i++) {
		line(imgHist, Point(i, 100),
			Point(i, 100 - cvRound(hist.at<float>(i, 0) * 100 / histMax)), Scalar(0));
	}

	return imgHist;
}
```

밝은 영상은 히스토그램이 오른쪽(255 근방)으로 치우치고, 어두운 영상은 왼쪽으로 치우친다. 명암비가 높은 영상은 전체적으로 히스토그램이 퍼져있고, 명암비가 낮은 영상은 한쪽으로 몰려 위치한다.

## 히스토그램 스트레칭(streching)
영상의 히스토그램이 전 구간에 걸쳐 나타나도록 선형 변환하는 것을 말한다. 가장 작은 픽셀값을 $\rm G_{min}$라고 하고 가장 큰 픽셀값을 $\rm G_{max}$라고 하면 아래의 식으로 출력 히스토그램을 구할 수 있다.

 $$ \rm dst \it (x, y) = \cfrac{\rm{src}\it(x, y) - G_{min}}{G_{max}-G_{min}} \times \rm 255 $$

```cpp
//방법1
double gmin, gmax;
minMaxLoc(src, &gmin, &gmax);
Mat dst = (src - gmin) * 255 / (gmax - gmin);

// 방법2
Mat dst;
normalize(src, dst, 0, 255, NORM_MINMAX);
```

![](5.스트레칭.png){: .align-center}


실제 영상에서는 매우 밝거나 매우 어두운 픽셀들이 한 두개씩 있기 마련이다. 그런 경우에는 min, max 값을 찾는다고 해서 히스토그램 스트레칭이 잘 안 이루어질 수도 있다. 한다고 했는데 한 두개씩 튀는 픽셀값들 때문에 큰 차이가 없는 것이다. 때문에 너무 적은 개수를 갖는 픽셀값 분포는 무시하는 식으로 히스토그램 스트레칭을 개선할 수 있다.

```cpp
// 히스토그램 계산하기
int hist[256] = { 0, };
for (int j = 0; j < src.rows; j++) {
    for (int i = 0; i < src.cols; i++) {
        hist[src.at<uchar>(j, i)]++;
    }
}

int gmin, gmax; // 각각 1% 이상이 되는 최소 픽셀값, 최대 픽셀값
int ratio = int(src.cols * src.rows * 0.01);
  // 전체 픽셀 개수의 1%는 무시하고자 비율을 설정

for (int i = 0, s = 0; i < 255; i++) {
    s += hist[i];

    if (s > ratio) {
        gmin = i;
        break;
    }
}

for (int i = 255, s = 0; i >= 0; i--) {
    s += hist[i];

    if (s > ratio) {
        gmax = i;
        break;
    }
}

dst = (src - gmin) * 255 / (gmax - gmin);
```

![](https://images.velog.io/images/717lumos/post/f14727ee-a97a-4487-9a01-8aaa324d1e35/6.%EC%8A%A4%ED%8A%B8%EB%A0%88%EC%B9%AD%EA%B0%9C%EC%84%A0.png){: .align-center}

## 히스토그램 평활화(equlization)
히스토그램이 전체 구간에서 균일한 분포를 가지도록 명암비를 향상시키는 기법으로, '히스토그램 균등화, 균일화, 평탄화'라고도 한다.

누적 분포 함수(cdf, cummulative density function)는 현재 위치까지의 pdf(probability density function)인 $ p(g) $를 누적합한 것 함수이다.

히스토그램 평활화를 위한 변환함수는 아래와 같다.

$$ \rm dst(x, y) = round(cdf(src \it (x, y)) * L_{max}) $$

히스토그램 평활화를 직접 구현하면 이렇다.

```cpp
// 히스토그램을 계산하기
int hist[256] = { 0, };
for (int j = 0; j < src.rows; j++)
    for (int i = 0; i < src.cols; i++)
        hist[src.at<uchar>(j, i)]++;

int size = (int)src.total();    // 전체 크기 계산하기
float cdf[256] = { 0.0f, }; // 누적분포함수 만들어 초기화하기
cdf[0] = float(hist[0]) / size;
    // 누적분포함수의 첫 값을 먼저 대입하기
    // 아래 for 문의 시작을 1로 해야 오류가 없음

for (int i = 1; i < 256; i++)
    cdf[i] = cdf[i - 1] + float(hist[i]) / size;
        // 누적분포 함수 만들기

for (int j = 0; j < src.rows; j++) {
    for (int i = 0; i < src.cols; i++) {
        dst.at<uchar>(j, i) = uchar(cdf[src.at<uchar>(j, i)] * 255);
            // 출력 영상 만들기
    }
}
```

![](https://images.velog.io/images/717lumos/post/2a3d72f9-beaa-4128-9498-85431e2c554e/7.%ED%8F%89%ED%99%9C%ED%99%94%EA%B5%AC%ED%98%84.png){: .align-center}

💙 **eqalizeHist()**: OpenCV에서 제공되는 히스토그램 평활화 함수. 그레이스케일만 지원하며, 값이 많이 존재하는 구간에서는 많이 떨어지고, 적게 존재하면 간격이 좁게 분포된다.

히스토그램 스트레칭과 히스토그램 평활화를 비교하면 아래와 같다. 히스토그램 스트레칭의 경우 픽셀값 간 간격이 균일하게 퍼지는 경향이 있는 반면, 히스토그램 평활화는 각 구간(픽셀값)의 픽셀 개수를 균일하게 유지하려는 경향이 있어 픽셀이 많은 구간은 서로 간격이 넓고 픽셀이 적은 구간은 간격이 좁다.

![](https://images.velog.io/images/717lumos/post/6d41c692-8a0e-40ba-991b-cbf7dd2a8813/8.%ED%9E%88%EC%8A%A4%ED%86%A0%EA%B7%B8%EB%9E%A8%EB%B6%84%EC%84%9D.png){: .align-center}