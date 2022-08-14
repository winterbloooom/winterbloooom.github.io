---
title:  "GitHub Blog Tips"
excerpt: "GitHub Blog Setting & Customizing Tips"

categories:
  - Blog

last_modified_at: 2022-08-14

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

```md
---
title: "Blog"
layout: archive
permalink: categories/blog
author_profile: true
sidebar_main: true
---

{% assign posts = site.categories.Blog %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}
```

## 안내
```md
{: .notice--info}
{: .notice--danger}
```

## 이미지
* 정렬: 
* 크기: `{: width="50%", height="50%"}`