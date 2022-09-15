---
title:  "GitHub Blog 알고 사용하기 (1): GitHub Pages와 Jekyll"
excerpt: "GitHub Blog를 만드는 GitHub Pages와 Jekyll(+Liquid)의 개념 및 사용 방법"

categories:
  - Blog
tags:
  - Blog
  - GitHub
  - Frontend

last_modified_at: 2022-09-14
published: true

header:
  teaser: # 사진 파일 경로

render_with_liquid: false
---

# GitHub Pages
## GitHub Pages이란?

GitHub Pages(이하 '깃허브 페이지')는 데이터베이스나 서버 없이 정적 웹사이트(Static Site)를 만드는 호스팅 서비스이다. HTML과 CSS, JavaScript 파일을 직접 깃허브 레포지토리에 올리고 빌드 및 퍼블리시를 수행할 수 있도록 지원한다. 단, 서버용 언어인 PHP나 Ruby, Python을 지원하지는 않는다.

> **<u>정적 웹페이지</u>**?<br>웹 서버에 이미 완성된 상태로 저장되어 있는 HTML 등의 파일을 전달한다. 모든 사용자가 같은 결과를 받으며, 고정된 웹페이지를 본다. 반대말로는 동적 웹페이지가 있으며, 우리가 보는 대부분의 웹페이지는 동적으로 작동한다.

## GitHub Pages와 Jekyll의 관계
Jekyll(지킬)은 깃허브 페이지에서 지원하는 오픈소스 빌트인 도구인 빌드 프로세스이다. HTML이나 Markdown으로 적힌 Plain Text 파일을 받아 정적 웹사이트로 만드는 역할을 한다. Markdown이나 Liquid 등의 템플릿 언어를 지원한다.

깃허브 branch에서 웹사이트를 퍼블리시하려면 깃허브 페이지는 기본적으로 지킬을 사용해 빌드한다. 만약 지킬이 아닌 다른 빌드 프로세스나 정적 사이트 생성기를 사용하려면, 따로 GitHub Actions를 생성해 빌드하고 퍼블리시 해야 한다.

> **<u>지킬을 사용하지 않고 빌드 & 퍼블리시하는 방법</u>**<br>(1) [Publishing with a Custom GitHub Actions workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow)<br> (2) [Configuring a Publishing Source for Your Github Pages Site](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

- - -

# Jekyll
## 일반적 디렉터리 구조

```bash

├── _data/
│   └── members.yml # (예)
├── _drafts/
│   └── begin-with-the-crazy-ideas.md # (예)
├── _includes/
│   └── footer.html # (예)
├── _layouts/
│   └── default.html # (예)
├── _pages/
│   └── about.md # (예)
├── _posts/
│   └── 2022-09-14-what-is-github-pages.md # (예)
├── _sass/
│   └── _base.scss # (예)
├── _site/
├── .jekyll-cache/
│   └── Jekyll
│       └── Cache
│           └── [...]
├── .jekyll-metadata
├── _config.yml
└── index.html # (예)
```

* Directories
  * `_data` : 지킬이 자동으로 불러올 파일들  💡 [Data Files](#data-files)
  * `_drafts` : 비공개 포스트로, Post의 파일명 규칙(`작성일-제목.확장자`)를 따르지 않고 제목만 사용해도 된다.
  * `_includes` : 다른 문서에 재사용 될 요소들  💡 [Includes](#includes)
  * `_layouts` : 각종 레이아웃 정의  💡 [Layouts](#layouts)
  * `_pages` : 개별적인 웹페이지를 저장  💡 [Pages and Posts](#pages-and-posts)
  * `_posts` : 글(포스트)를 저장  💡 [Pages and Posts](#pages-and-posts)
  * `_sass` : 스타일을 정의하는 scss 파일을 저장  💡 [CSS and SCSS](#css-and-scss)
  * `_site` : 지킬이 변환을 끝낸 사이트를 둘 곳. `.gitignore`에 추가할 것을 권장한다.
  * `.jekyll-cache` : 빠른 서빙을 위해 존재하는 공간으로, 생성된 페이지와 글들을 저장해둔다. `jekyll serve` 등의 명령을 수행할 때 생성되며, config 옵션으로 끌 수 있다. `.gitignore`에 추가할 것을 권장한다.
  * `assets` : CSS, JS, 이미지 등의 asset을 저장하는 곳
* Files
  * `_config.yml` : 설정값 모음  💡 [Configuration](#configuration)
  * `.gitignore` : GitHub에 업로드할 때 제외할 파일을 지정한다.
  * `.jekyll-metadata` : 변경된 파일만 트랙킹 하도록 설정한다. config 옵션에서 `incremental regeneration`을 사용한다고 지정할 때만 작동한다. 혹은 `jekyll serve -I`로 flag 설정할 수도 있다. `.gitignore`에 추가할 것을 권장한다.
  * `index.html` : 웹사이트의 첫 페이지(entry page)가 될 페이지이다. 꼭 제목이 이러할 필요는 없다. 예시일 뿐.

- - -

## Configuration

웹사이트를 빌드할 때 작성자가 원하는 대로 일부 설정값을 설정(configure)할 수 있다. 루트 디렉터리에 `_config.yml` 이나 `_config.toml` 파일을 만들어 명시해야 한다. 혹은 터미널에서 `jekyll` 명령어로 빌드를 수행할 때 flags로 설정할 수도 있다.

> **<u>options VS flags</u>**<br>options는 `_config` 파일에 명시하는 설정이며, flags는 터미널에서 지정하는(커맨드 라인) 설정이다.

> `_config` 파일을 수정할 때는 `jekyll serve` 명령어를 중지하고 다시 시작해야 변경 내용이 적용된다.

### Config의 종류

모든 config는 공식 웹사이트 [Configuration Options](https://jekyllrb.com/docs/configuration/options/)에서 확인할 수 있다. 여기서는 중요하거나 자주 보인 설정을 위주로 정리했다.

설정 파일에는 탭(Tab)을 사용하면 안된다. 파싱 에러가 발생하거나 지킬이 초기 세팅으로 되돌려 빌드할 수도 있다.

#### Global Configuration

|설정|options|flags|설명|
|---|---|---|---|
|사이트 source|`source: DIR`|`-s, --source DIR`|지킬이 읽어야 할 파일 디렉터리 설정|
|사이트 destination|`destination: DIR`|`-d, --destination DIR`|지킬이 파일을 쓸 위치|
|exclude|`exclude: [DIR, FILE, ...]`(리스트 형태)||포함하지 않을 파일/폴더|
|include|`include: [DIR, FILE, ...]`(리스트 형태)||반드시 포함해야 함. (ex) `.`으로 시작하는 파일은 제외하는데 `.htaccess`은 포함해야 할 때, `_pages`까지 이 둘은 꼭 넣어두기|
|파일 유지|`keep_files: []`(리스트)||지킬에서 생성되지 않는 파일에 유용. (ex) `.git`, `.svn`|
|시간대|`timezone: TIMEZONE`||환경변수 `TZ`에도 할당되는 값임. `Asia/Seoul`|
|인코딩|`encoding: ENCODING`||파일들을 인코딩할 코드를 설정한다. 기본은 `utf-8`이다. |
|front matter 관련|||💡 [Front Matter Configuration](#front-matter-configuration) 참고|

#### Build Command Opetions

|설정|options|flags|설명|
|---|---|---|---|
| 설정 파일 |   | `--config FILE1, FILE2, ...`  | 자동으로 인식할 `_config.yml` 대신 따로 정의한 설정 파일을 지정한다. 중복된 값이 있다면 뒤의 것이 덮어씌워진다. |
| 레이아웃 리덱터리 | `layouts_dir: DIR` | `--layouts DIR` | 자동으로 인식할 `_layouts/` 대신 따로 레이아웃 폴더를 만든 것을 지정한다 |
| 초안 포스트 포이기 | `show_drafts: BOOL` | `-D` or `--drafts` | `_drafts/`에 있는 초안을 보일 것인지 |
| 미래 날짜 포스트 보이기 | `future: BOOL` | `--future` | 현재보다 앞선 날짜의 포스트를 보일 것인지 |
| 미발행 포스트 보이기 | `unpublished: BOOL` | `--unpublished` | unpublished라고 표시한 포스트를 렌더링 할 것인지 |
| 포스트 개수 | `limit_posts: NUM` | `--limit_posts NUM` | 파싱 & 퍼블리시 할 최대 포스트 개수 설정 |
| Base URL | `baseurl: URL` | `-b, --baseurl URL` | 해당 URL로 웹사이트 서빙함 |

#### Serve Command Options

TODO `serve` 부가 명령(sub-command)에 `build` 부가 명령을 위한 옵션을 사용할 수 있다 (??)

#### Front Matter 기본 설정

> Front Matter에 대한 자세한 설명은 [Front Matter](#front-matter)를 참고한다.

Front Matter에 반복해서 들어가는 설정을 한꺼번에 선언할 수 있다. `default` 키에 정의하며, 배열로 각 scope & value로 이루어진다. scope에는 path, type 등의 키를 사용할 수 있어 각각 해당 설정을 사용할 경로와 타입을 정의하고, value에는 그 scope에 적용할 설정값들을 나열한다.

`_config` 파일에 적용한 내용이 있다고 해도, 포스트나 페이지에 넣은 Front Matter가 중복되어 있다면 그것으로 오버라이딩된다.

```yml

defaults:
  -
    scope:
      path: ""
        # path를 빈 문자열("")로 선언하면, 모든 파일에 대해 적용된다
        # path에는 Globbing 기능(* 문자)을 사용할 수 있다
    values:
      layout: "default"
  -
    scope:
      path: "projects"
        # 'projects' 경로에 있는 파일들에 대해 적용한다
      type: "pages"
        # pages 타입의 글에 적용한다
    values:
      layout: "project"
        # 앞서 설정한 'default'가 오버라이딩된다
      author: "winterbloooom"
```

### 기본 설정

아래 내용은 지킬이 기본(default)로 설정하는 값들이다.

```yml
# 위치 지정
source              : .
destination         : ./_site
collections_dir     : .
plugins_dir         : _plugins
  # 문자열의 배열로 선언하면, 그 순서대로 플러그인을 불러옴
layouts_dir         : _layouts
data_dir            : _data
includes_dir        : _includes
sass:
  sass_dir: _sass
collections:
  posts:
    output          : true

# Handling Reading
safe                : false
include             : [".htaccess"]
exclude             : ["Gemfile", "Gemfile.lock", "node_modules", "vendor/bundle/", "vendor/cache/", "vendor/gems/", "vendor/ruby/"]
keep_files          : [".git", ".svn"]
encoding            : "utf-8"
markdown_ext        : "markdown,mkdown,mkdn,mkd,md"
strict_front_matter : false

# Filtering Content
show_drafts         : null
limit_posts         : 0
future              : false
unpublished         : false

# Plugins
whitelist           : []
plugins             : []

# Conversion
markdown            : kramdown
highlighter         : rouge
lsi                 : false
excerpt_separator   : "\n\n"
incremental         : false

# Serving
detach              : false
port                : 4000
host                : 127.0.0.1
baseurl             : "" # does not include hostname
show_dir_listing    : false

# Outputting
permalink           : date
paginate_path       : /page:num
timezone            : null

quiet               : false
verbose             : false
defaults            : []

liquid:
  error_mode        : warn
  strict_filters    : false
  strict_variables  : false

# Markdown Processors
kramdown:
  auto_ids          : true
  entity_output     : as_char
  toc_levels        : [1, 2, 3, 4, 5, 6]
  smart_quotes      : lsquo,rsquo,ldquo,rdquo
  input             : GFM
  hard_wrap         : false
  footnote_nr       : 1
  show_warnings     : false
```

- - -

## 변수

> 지킬은 사이트에 포함될 파일들을 순회하며 front matter가 있는 파일을 처리(processing) 한다. Liquid라는 언어를 통해 다양한 데이터를 사용할 수 있다. Liquid에 대한 자세한 설명은 해당 파트 💡 [Liquid](#liquid)를 참고한다.

> 아래 나열한 변수들은 잘 쓰이는 것으로 보이는 변수만 담았다. 더 다양한 변수는 [documentation](https://jekyllrb.com/docs/variables/)을 참고한다.

* `site`: site(블로그) 전반에 대한 정보 및 `_config.yml`의 설정값들을 담고 있다.
  * `pages`: 블로그에 있는 모든 페이지들의 리스트
  * `posts`: 블로그에 있는 모든 포스트들의 리스트. 시간 역순으로 정렬된다.
  * `categories.CATEGORY`: `CATEGORY`라는 카테고리에 해당하는 포스트의 리스트.
  * `tags.TAG`: `TAG`라는 태그를 가지는 포스트의 리스트.
  * `url`: `_config` 파일에 지정한 URL 주소값.
  * `CONFIGURATION_DATA`: 터미널 커맨드 라인이나 `_config` 파일에 정의한 어떠한 변수 `CONFIGURATION_DATA`의 값.
* `page`: front matter 정보 & page 관련 정보. front matter에 정의한 커스텀 변수도.
  * `content`: 포스트나 페이지의 내용물.
  * `title`: 본래는 파일 이름이며, front matter에 title 변수를 선언했다면 그것으로 오버라이딩된다.
  * `excerpt`: 포스팅의 부가적 설명. front matter에서 지정하지 않는다면, 기본적으로 첫 번째 단락으로 삼는다.
  * `url`: 포스트의 URL 주소값
  * `date`: 포스트의 날짜. 기본적으로는 파일 이름에 들어가있는 날짜이며, front matter에 date를 명시했다면 그것으로 오버라이딩된다.
  * `categories`: 해당 포스트의 카테고리 리스트
  * `tags`: 해당 포스트의 태그 리스트
  * `name`: 파일 이름
  * `path`: 파일 경로
  * `next`: `site.posts` 변수에 담긴 값을 기준으로 현재 포스트 바로 뒷 포스트.
  * `previous`: `site.posts` 변수에 담긴 값을 기준으로 현재 포스트 바로 앞 포스트.
  * date: `{{ page.date | date_to_string }}`로 필터를 주면 날짜를 더 좋은 포맷으로 보여준다.
* `layout`: front matter와 layout 관련 정보, front matter에 정의한 커스텀 변수를 담고 있다.
* `paginator`: 옵션 `paginate` 설정 시 사용 가능하다.
  * `page`: 현재 페이지의 번호
  * `per_page`: 페이지 마다 몇 개의 포스트가 들어가는지
  * `posts`: 현재 페이지에 있는 포스트들
  * `total_posts`: 포스트의 전체 개수
  * `total_pages`: 페이지의 전체 개수
  * `previous_page`: 이전 페이지의 번호
  * `previous_page_path`: 이전 페이지의 경로
  * `next_page`: 다음 페이지의 번호
  * `next_page_path`: 다음 페이지의 경로
- - -

## Pages

Page는 날짜 기반의 post가 아닌 독립적/개별적인 콘텐츠이다. 루트 디렉터리에 html이나 마크다운으로 적거나, `_pages` 폴더에 넣는다. `About.md`나 `Index.html` 등이 해당한다. 

- - -

## Posts

반면 post는 글(포스트) 하나하나를 가리킨다. `_posts` 디렉터리 안에 각 포스트 파일을 HTML이나 md로 저장하며, 제목은 `YYYY-MM-DD-NAME-OF-POST.md` 형식으로 써야 한다. 

포스트에는 tags와 categories를 지정할 수 있다. 하나의 태그만 지정할 때는 front matter의 `tag` 키에, 여러 개를 지정할 때는 `tags` 키에 적는다.

```html
---
tags: ["apple", "banana"]
<!-- 또는 tags: apple banana 으로 적어도 된다 -->
---
```

태그와 마찬가지로 작동하여, front matter에 `category`나 `categories`에 지정한다. 카테고리는 파일 경로(URL)에 표시가 된다는 점이 태그와 다르다. 

만약 `_posts` 폴더 위에 다른 폴더들이 있다면 그것은 자동으로 카테고리로 지정된다. `fruit/apple/_posts/2022-09-14-my-favorite-fruit.md`라면 fruit과 apple이 카테고리 등록이 된다.

Front matter에 키로 카테고리를 지정했다면 그것은 URL에 나타나는데, 카테고리를 `category: red`라고 설정했다면 `.../red/my-favorite-fruit/`이 되고, `category: "red fruit"`라면 `.../red%fruit/my-favorite-fruit/`이다.

포스트에 대한 부가 설명으로서(snippet) `excerpt`를 front matter에 지정할 수 있다. 명시하지 않는다면 지킬은 기본적으로 첫 번째 단락으로 삼는다. `_config` 파일에서 `excerpt_separator` 변수를 세팅하면 기본값을 다르게도 삼을 수 있다.([예시](https://jekyllrb.com/docs/posts/#post-excerpts)) 

파일 이름에 날짜가 없는 포스트는 draft(초안)이라 하여, 아직 작업 중이거나 발행하지 않을 포스트를 말한다. `_drafts` 폴더에 넣으면 된다. 만약 초안도 어떻게 빌드되거나 서브되는지 보고 싶다면 `jekyll serve`나 `jekyll build` 명령어 뒤에 `--draft` 옵션을 준다.

- - -

## Front Matter

페이지나 포스트의 특정 설정(e.g. 기본 레이아웃, 제목, 날짜/시간 등)을 정의하는 곳으로, YAML 형식을 따른다. 이 부분이 설정되어 있으면 지킬이 이를 인식하고 처리한다.

세 개의 dash 사이에 내용을 적으며(`---`) 파일 최상단에 위치한다. 미리 정의된 변수(e.g. `layout`, `title` 등)나 새로운 변수 선언이 가능하다. 아무것도 설정하길 원하지 않는다면 빈칸으로 두어도 좋다.

자주 사용하는 변수들은 아래와 같다.

* `layout` : `_layouts/` 디렉터리에 있는 레이아웃 파일을 불러와 레이아웃으로 삼는다.
* `permalink` : 기본적 URL 설정 말고, 여기서 특정한 주소값을 갖게 한다.
* `published` : 이 포스트가 사이트에서 보일지 말지를 결정한다. 만약 unpublished(false 값)으로 했지만 어떻게 보여지는지(preview) 알고 싶다면 `jekyll serve`나 `jekyll build` 명령어 뒤에 `--unpublished` 옵션을 준다.
* `date` : 포스트의 정렬은 날짜순으로 이루어지고, `YYYY-MM-DD HH:MM:SS +/-TTTT` 포맷으로 부여한다.
* `category` 혹은 `categories`
* `tag` 혹은 `tags`

이 외에도 커스텀 변수를 만들어 사용할 수 있으며, front matter에서 정의한 변수를 페이지 혹은 다른 곳에서 사용하는 예는 Liquid 예시에서 더 확인할 수 있다.

- - -

## Includes

`include` 태그는 `_includes` 폴더의 파일에 있는 컨텐츠를 불러올 수 있게 한다. 하나의 소스를 곳곳에서 사용할 때 include를 사용하면 템플릿화 시킬 수 있어 특히 유용하다. 

꼭 `_includes` 폴더가 아니더라도 `include_relative`는 현재 작성중인 파일을 기준으로 하여 불러오고 싶은 경로를 지정할 수 있게 한다. 이때 `../` 식으로 상위 디렉터리 이동은 안된다.


예를 들어 네비게이션을 `_includes/navigation.html`에 정의해두고 필요한 곳에서 `{% include navigation.html %}`로 사용하는 것이다.

상세한 사용 예시는 Liquid 문법 파트에서 다룰 것이다. 💡 [Liquid 예시 모음](#liquid-예시-모음) 참고

- - -

## Layouts

레이아웃은 컨텐츠를 감싸는 템플릿이다. 네비게이션이나 푸터(footer) 등 각 요소를 미리 정의해두고 재사용하면 된다. 레이아웃은 `_layouts` 디렉터리에 위치한다. 관습적으로 `default.html`을 기본 템플릿으로 하여 다른 레이아웃들이 이를 상속받아 쓴다.

`_layouts/defualt.html`을 아래와 같이 만들었다고 하자.

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>{{ page.title }}</title>
      <!-- page.title은 해당 페이지의 제목을 말하는 변수이다. -->
  </head>
  <body>
    {{ content }}
      <!-- 해당 페이지의 내용물을 말하는 변수이다. -->
  </body>
</html>
```

이 레아아웃을 포스트나 페이지에 사용할 때는 아래와 같이 front matter에 `layout` 변수에 HTML 파일 이름을 넣는다.

```html
---
layout: default
title: Home
  # 앞서 레이아웃 파일의 page.title이란 변수에 "Home"이 들어갈 것이다.
---

This is the content of page
  <!-- 해당 문장은 content 변수 부분에 들어갈 것이다. -->
```

`_layouts/defualt.html`를 상속받는 다른 레이아웃을 만들 때도 front matter를 사용한다.

```html
---
layout: default
---
<p>{{ page.date }} - Written by {{ page.author }}</p>
  <!-- default.html에 더하여 이 부분이 추가적으로 적용될 것이다. -->

{{ content }}
```

- - -

## Assets, Sass

CSS, JS, 이미지 등의 asset은 보통 `asset` 폴더에 담아두고 사용한다.

```
├── assets
│   ├── css
│   ├── images
│   └── js
```

Sass는 스타일시트 언어인 CSS의 전처리기(pre-processer)로, CSS를 보다 편하게 사용할 수 있게 해준다. `_sass` 폴더에 sass 파일을 저장한다.

`assets/css/styles.css` 파일이 있다고 하자.

```css
---
/* 빈 front matter는 지킬이 이 파일을 저리해야 함을 알려준다. */
---
@import "main";
  /* main.scss 파일을 보아야 함을 나타낸다. 
  기본적으로 해당 파일은 _sass 폴더에서 찾는다. */
```

그리고 `_sass/main.scss` 파일이다.

```css
.current {
  color: green;
}
```

`assets/css/styles.css` 파일을 HTML 파일에서 연결한다면, 그 파일은 다시 `main.scss`를 찾을 것이다.

```html
<head>
    <link rel="stylesheet" href="/assets/css/styles.css">
</head>
```

- - -

## Data Files

지킬은 `_data` 폴더에 있는 YAML, JSON, CSV 파일을 불러올 수 있다. 변수를 불러올 때는 `site.data.파일이름`이다. `_data` 폴더 안에 하위 폴더가 있다면 `site.data.폴더.파일이름` 식으로 확장하면 된다.

해당 기능으로 네비게이션을 만들 수도 있고(💡[Liquid 예시 모음](#liquid-예시-모음)) 변수 등을 정해놓고 사용할 수도 있다. 아래는 유명한 테마 minimal-mistakes의 `_data/ui-text.yml` 파일 일부이다.

```yml
ko: &DEFAULT_KO
  page                       : "페이지"
  pagination_previous        : "이전"
  pagination_next            : "다음"
  breadcrumb_home_label      : "Home"
  breadcrumb_separator       : "/"
  menu_label                 : "토글 메뉴"
```

이것을 이용하면 어디선가 `{{ site.data.ui-text[site.locale].page | default: "Page" }}` 식으로 쓸 수 있다. 이 뜻은 `ui-text.yml` 파일에서 `site.locale` 이란 변수와 동일한 값을 찾아, 그 안의 `page` 라는 변수를 불러오란 뜻이므로 위 예시에서는 `페이지`라는 문자열을 가져올 것이다.

- - -

# Liquid
## Liquid 예시 모음
- - -

# References
* [GitHub Pages](https://pages.github.com/)
* [GitHub Pages Documentation](https://docs.github.com/en/pages)
* [ppyooy336. "정적, 동적 웹페이지 차이는?"](https://velog.io/@ppyooy336/%EC%A0%95%EC%A0%81-%EB%8F%99%EC%A0%81-%EC%9B%B9%ED%8E%98%EC%9D%B4%EC%A7%80-%EC%B0%A8%EC%9D%B4%EB%8A%94)
* [https://nykim.work/97](https://nykim.work/97)