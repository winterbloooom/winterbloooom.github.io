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

