---
title:  "GitHub Blog Tips"
excerpt: "GitHub Blog Setting & Customizing Tips"

categories:
  - Blog

last_modified_at: 2023-08-14

use_math: true
toc: true
tock_sticky: true
toc_label: "Contents"

published: false

---

계속 업데이트 예정.
{: .notice--info}

# Posting
## 최상단
```md
---
title:  "제목을 입력하세요"
excerpt: "포스팅 설명을 입력하세요"

categories:
  - 카테고리 이름
tags:
  - Papaer Review
  - Machine Learning
  - Deep Learning
  - Prediction
  - Autonomous Driving
last_modified_at: 2022-08-04

use_math: true
toc: true
tock_sticky: true
toc_label: "Contents"
---
```

`categories`에는 `_pages/catetory-XXX` 파일 내 `site.categories.`에 있는 이름을 사용한다. 아래 예시(`_pages/catetory-blog.md`)라면 `Blog`를 쓰는 것이다.

{% highlight ruby %}
{% raw %}
---
title: "Blog"
layout: archive
permalink: categories/blog
author_profile: true
sidebar_main: true
---

{% assign posts = site.categories.Blog %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}

{% endraw %}
{% endhighlight %}

## 안내
```md
{: .notice--info}
{: .notice--danger}
```

## 이미지
* 정렬: `{: .align-center}`
* 크기: `{: width="50%", height="50%"}`

## 마크다운 소스코드 Liquid error
에러 캡쳐본 2개 있음

'```' 내부에 쓰지 말고


{% highlight ruby %}
{% raw %}
  내용
{% endraw %}
{% endhighlight %}

- - -

# 구조 변경
## 글 순서 변경
날짜(data) 순서가 아닌, 임의대로 정한 순서대로 포스팅이 보여지게 하고 싶었다.

참고: https://gunbin91.github.io/githubpage/jekyll/2018/08/26/Jekyll(11).html

각 카테고리 페이지에서

변경 전

{% highlight ruby %}
{% raw %}
  {% assign posts = site.categories.ROS %}
  {% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}
{% endraw %}
{% endhighlight %}

변경 후

{% highlight ruby %}
{% raw %}
  {% assign posts = site.categories.ROS %}
  {% assign sorted_posts = posts | sort: 'order' | reverse %}
  {% for post in sorted_posts %} 
      {% include archive-single.html type=page.entries_layout %} 
  {% endfor %}
{% endraw %}
{% endhighlight %}

# 파비콘
https://velog.io/@eona1301/Github-Blog-%ED%8C%8C%EB%B9%84%EC%BD%98Favicon-%EC%84%B8%ED%8C%85%ED%95%98%EA%B8%B0

# post 설정
```yml
published: false
```

# 글씨
## 한글 폰트
https://devinlife.com/howto%20github%20pages/set-font/

## 본문 글자 크기
https://velog.io/@eona1301/Github-Blog-minimal-mistakes-%EB%B3%B8%EB%AC%B8-%EC%98%81%EC%97%AD-%EB%B0%8F-%EA%B8%80%EC%9E%90-%ED%81%AC%EA%B8%B0

# archive-single (글 목록)
https://devinlife.com/howto%20github%20pages/github-pages-settings/#3-%ED%8F%AC%EC%8A%A4%ED%8A%B8-%EC%A0%9C%EB%AA%A9-%EC%95%84%EB%9E%98-%EA%B2%8C%EC%8B%9C-%EB%82%A0%EC%A7%9C-%ED%91%9C%EC%8B%9C

# header의 teaser
기본 이미지는 `_config.yml`에서도 설정 가능. 포스트 상단에도 선언해 오버라이드 가능(2022-08-25-kaboat2022-dev-report.md)참고

# 파일 설명
* includes
  * `archive-single.html` 글 목록 보기에서 한 개의 포스팅을 보여줌
    ![image](https://user-images.githubusercontent.com/69252153/186781830-528bbc77-ebbc-444d-b4f5-4e207f56f345.png) 
  * `nav_list_main` : 카테고리 구성
* _layouts
  * `archive.html` : archive 이름의 layout 정의
  * `single.html` : 포스팅 글(?)
  * `splash.html` : splash 이름의 layout 정의
  * `home.html` : 메인화면 구성
  * 
* _pages
  * categories : 각 카테고리 페이지
  * `about.md` : 소개 페이지
  * `category-archive.md` : 카테고리 모아보기 페이지
  * `tag-archive.md` : 태그 모아보기 페이지
* _sass
  * minimal-mistakes
    * `_variables.scss` : 디자인 관련 변수 정의

# 추가 참고할 것
* 테마 docs: https://mmistakes.github.io/minimal-mistakes/
* 썸네일(teaser), 날짜별 이미지 폴더, 여러 줄 notice: https://jinjungs.github.io/blog/renewal-blog/
* 사이드바: 
  * https://jhlov.github.io/jekyll-%EB%B8%94%EB%A1%9C%EA%B7%B8%EC%97%90-%EC%82%AC%EC%9D%B4%EB%93%9C%EB%B0%94-%EC%B6%94%EA%B0%80%ED%95%98%EA%B8%B0/
  * https://blog.jungbin.kim/blog/2018/02/22/apply-sidebar-minimalmistake-jekyll.html
* Liquid 문법
  * https://goodgid.github.io/What-is-Liquid-Grammer/
* 커스텀
  * https://2ssue.github.io/blog/home_layout_update/#%ED%99%88-%EB%A0%88%EC%9D%B4%EC%95%84%EC%9B%83-%EB%B0%94%EA%BE%B8%EA%B8%B0