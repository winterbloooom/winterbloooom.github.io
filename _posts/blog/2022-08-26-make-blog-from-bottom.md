---
title:  "깃허브 블로그 바닥부터 만들기"
excerpt: ""

categories:
  - 
tags:
  - 
  - 

last_modified_at: 2022-08-26
published: true # 비공개 포스트

header:
  teaser: # 사진 파일 경로

render_with_liquid: false
---

# 참고 사이트
* [깃허브 페이지 소개](https://pages.github.com/)
* [깃허브 페이지 docs](https://docs.github.com/en/pages)
* 깃허브 페이지 만들기 (개인X)
  * [1](https://cheershennah.tistory.com/216)
  * 
* 지킬
  * [지킬 기초](https://velog.io/@kasterra/Github-%EB%B8%94%EB%A1%9C%EA%B7%B8-%EB%A7%8C%EB%93%A4%EA%B8%B0-%EC%B2%AB%EA%B1%B8%EC%9D%8C-Jekyll-%EA%B8%B0%EC%B4%88)

# 필기
## 깃허브 페이지
GitHub Pages는 웹사이트 만드는 도구. 데이터베이스나 서버 없이.

> GitHub Pages is a static site hosting service that takes HTML, CSS, and JavaScript files straight from a repository on GitHub, optionally runs the files through a build process, and publishes a website.
> (정적 웹사이트 호스팅 서비스. HTML, CSS, JS 파일을 직접 깃허브 레포지토리에 올리고, 빌드 과정과 퍼블리시 과정도 수행할 수 있음)

서버용 언어인 PHP, Ruby, Python을 지원하지 않음

![image](https://user-images.githubusercontent.com/69252153/186894340-42dd6d09-cd48-4abd-a591-c221d3fe9b82.png)

## 지킬
Jekyll은 plain text를 정적 웹사이트로 만들어주는 오픈소스 도구. 깃허브 페이지에서 지원하는 빌트인 도구. 빌드 프로세스.

HTML, Markdown 파일을 받아 정적 웹사이트 생성함. Markdown이나 Liquid 등의 템플릿 언어를 지원함.

윈도우에선 작동 안함

지킬이 아닌 개별적인 빌드 프로세스나 정적 사이트 생성기를 사용한다면 actions를 만들어 빌드 & 퍼블리시 해야 함.[방법](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow) 혹은 루트 디렉터리에 `nojekyll` 빈파일을 만들어두던가. [참고](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

브랜치에서 사이트를 퍼블리시 하려면, 깃허브 페이지는 지킬을 기본적으로 사용해 빌드함.




# 블로그 테마 개발 용 페이지 만들기
## 레포지토리 생성 및 publish 설정

[repo](https://github.com/winterbloooom/wbblog/) / [url](https://winterbloooom.github.io/wbblog/)

페이지 주소가 `https://userName.github.io/repoName/`으로 나옴

사이트의 진입 파일을 생성: `index.html`, `index.md`, `README.md` -> top level에 있어야 함

[publishing branch](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-from-a-branch)

## 404 페이지 만들기
1. `404.html`이나 `404.md` 파일 만들기
2. front matter 채워넣고, 내용 알아서 넣기
    ```yaml
    ---
    permalink: /404.html
    ---
    ```

## 플러그인

> [깃허브 페이지 docs](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll#plugins)
> [지킬 docs](https://jekyllrb.com/docs/plugins/)

## syntax highlighting
코드 스니펫 하이라이트 기능: Rough 하이라이터를 기본적으로 이용함.

>[깃허브 페이지 docs](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll#syntax-highlighting)

## 지킬 설치 및 테스트

> [지킬 사이트 만들기](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/creating-a-github-pages-site-with-jekyll#creating-your-site)
> [지킬 테스트](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll)

```bash
cd [프로젝트 폴더]
bundle exec jekyll serve #지킬 빌드
```

## 지킬 테마 적용
`_config.yml`에서
```yml
theme: minima # github supported 테마라면 (https://pages.github.com/themes/)
remote_theme: benbalter/retlab # 그외 지킬 테마라면
```
- - -

# 문법
## 디렉터리 구조 (일반적)
```
.
├── _config.yml [설정값 모음]
├── _data [지킬이 자동으로 불러올 파일들. yml, yaml, json, csv, tsv 등. `site.data`로 접근 가능. minimal mistakes의 ui-text.yml 참고.]
│   └── members.yml [`site.data.members`로 다른 글에서 접근 가능.]
├── _drafts [비공개 포스트. 날짜값 없이 제목 붙임(`title.md`)]
│   ├── begin-with-the-crazy-ideas.md
│   └── on-simplicity-in-technology.md
├── _includes [layout이나 posts에 재사용될 수 있는 부분적 것들. Liquid tag인 `{% include file.ext %}`를 사용해 _include/file.ext에 있는 내용을 불러올 수 있음]
│   ├── footer.html
│   └── header.html
├── _layouts [포스트 레이아웃. front matter에서 어떤 걸 쓸 지 지정 가능. Liquid `{{ content }}` 태그로 페이지의 내용을 넣을 수 있음]
│   ├── default.html
│   └── post.html
├── _posts [연-월-일-제목.md 순으로 꼭 제목 지어야 함. 포스트들을 모아놓음.]
│   ├── 2007-10-29-why-every-programmer-should-play-nethack.md
│   └── 2009-04-26-barcamp-boston-4-roundup.md
├── _sass [sass 파일 모음. `main.scss`에 임포트 할 것들. `main.scss`는 main.css에 처리되어 들어갈 것.]
│   ├── _base.scss
│   └── _layout.scss
├── _site [지킬이 변환을 끝낸 사이트를 둘 곳. `.gitignore`에 추가할 것을 권장.]
├── .jekyll-cache [빠른 서빙을 위해 생성된 페이지와 글들을 저장해둠. `jekyll serve` 등을 할 때 생성됨. config 옵션으로 끌 수 있음. `.gitignore`에 추가할 것을 권장.]
│   └── Jekyll
│       └── Cache
│           └── [...]
├── .jekyll-metadata [변경된 파일만 트랙킹 하도록 설정. config 옵션에서 incremental regeneration 사용 시에만 작동.(`jekyll serve -I`) `.gitignore`에 추가할 것을 권장.]
└── index.html [entry 페이지]
```

## 지킬 config

> [지킬 docs](https://jekyllrb.com/docs/configuration/)

* `_config.yml` 파일을 편집해 사용. 루트 디렉터리에 위치
* 탭을 사용하지 말 것.
* 빌드하지 않는 파일/폴더들
  * `/node_modules`나 `/vendor` 폴더에 있는 것들
  * `_`, `.`, `#`로 시작하는 것들
  * `~`로 끝나는 것들
  * `_config.yml`에 `exclude`로 지정한 것들

### config 옵션
> options: config 파일에 명시 <-> flags: 커맨드 라인에서 특정

Global config

|설정|options|flags|설명|
|---|---|---|---|
|사이트 source|`source: DIR`|`-s, --source DIR`|지킬이 읽어야 할 파일 디렉터리 설정|
|사이트 destination|`destination: DIR`|`-d, --destination DIR`|지킬이 파일을 쓸 위치|
|exclude|`exclude: [DIR, FILE, ...]`(리스트 형태)||포함하지 않을 파일/폴더|
|include|`include: [DIR, FILE, ...]`(리스트 형태)||반드시 포함해야 함. (ex) `.`으로 시작하는 파일은 제외하는데 `.htaccess`은 포함해야 할 때, `_pages`까지 이 둘은 꼭 넣어두기|
|파일 유지|`keep_files: []`(리스트)||지킬에서 생성되지 않는 파일에 유용. (ex) `.git`, `.svn`|
|시간대|`timezone: TIMEZONE`||환경변수 `TZ`에도 할당되는 값임. `Asia/Seoul`|
|front matter 변수 기본값|||아래 글 참고|

[여기](https://jekyllrb.com/docs/configuration/options/#build-command-options)서부터 정리 못함.

### defalut config
지킬이 기본값으로 설정하는 것들
```yaml
# Where things are
source              : .
destination         : ./_site
collections_dir     : .
plugins_dir         : _plugins # takes an array of strings and loads plugins in that order
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

## post vs page
page는 개별적인 콘텐츠로, 특정 날짜를 명시하지 않아도 됨(ex. About 페이지)
post는 글 하나하나.

## Pages
> [지킬 docs](https://jekyllrb.com/docs/pages/)

```yaml
layout: page
title: "PAGE TITLE"
permalink: /URL-PATH/
```

## Posts
> [지킬 docs](https://jekyllrb.com/docs/posts/)

* `_posts` 디렉터리 안에 넣음
* 제목은 `YYYY-MM-DD-NAME-OF-POST.md` 형식

```yaml
layout: post
title: "POST TITLE"
date: YYYY-MM-DD hh:mm:ss -0000
categories: CATEGORY-1 CATEGORY-2
```

## 테마 만들기
> [참고: Minima 테마의 README](https://github.com/jekyll/minima#customizing-templates)


### 특정 테마의 CSS 커스터마이징

`assets/css/style.scss` 파일 만들고 아래 내용 입력

```css
---
---

@import "{{ site.theme }}";
/* 이 뒤로 내가 하고픈 것 입력 */
```
### 특정 테마의 HTML 커스터마이징
`_layouts` 폴더에서 `default.html` 파일

- - -

# 폴더 구조
```
_layouts/ (HTML 파일 모음. 레이아웃 정의)
    default.html (기본 레이아웃)
_pages/ (페이지)
_posts/ (포스팅)
assets/
    css/
        style.scss (CSS 코드)
_config.yml (기본 사이트 설정)
```

- - -

# Liquid
templating 언어로 템플릿을 처리함. [공식 docs](https://shopify.github.io/liquid/)

주 요소 세 가지는 object, tags, filters.

## component1: Objects
* `{{`, `}}` 사이에 object를 나타냄
* 미리 정의된 변수를 출력하게 함.

```yaml
# `page.title` 변수를 출력함
{{ page.title }}
```

## component2: Tags
### 기본 사용법
* 템플릿의 논리/제어를 정의함
* `{%`, `%}` 사이에 선언

```yaml
# page 변수인 `show_sidebar`의 값이 true일 때 실행
{{ if page.show_sidebar }}
  # do something
{{ endif }}
```

### include 태그
* `_include` 폴더에 있는 다른 파일로부터 컨텐츠를 불러오게 함. (e.g. `{% include footer.html %}`은 `_include/footer.html` 파일의 내용을 쓸 수 있게 함 )
* 특정 경로/파일 이름을 담고 있는 변수도 사용할 수 있음. (e.g. `{% include {{ page.my_file_path }} %}`는 특정 페이지의 front matter에 정의된 `my_file_path` 변수 안에 든 파일 경로를 참조함)
* `include_relative` 태그는 꼭 `_include` 폴더가 아닌 어딘가의 파일도 불러올 수 있게 함. 대신 `../`으로 상위 폴더 접근은 안됨. (e.g. `{% include_relative _posts/2020-02-02-myPost.md %}`)

https://jekyllrb.com/docs/includes/#passing-parameters-to-includes

### highlight 태그
* 코드 스니펫(syntax highlighting)을 하는 태그. 
* 표현하고자 하는 코드를 아래와 같이 감싸면 됨. [Rouge에서 지원하는 언어 목록](https://github.com/rouge-ruby/rouge/wiki/List-of-supported-languages-and-lexers)

  ```
  {% highlight python %}
  def my_func():
    return 0
  {% endhighlight %}
  ```

* 줄 번호를 표기하고 싶다면 `{% highlight 언어 linenos %}`
* 특정 stylesheets를 이용하고 싶다면 `main.css`에서 스타일시트 css 파일을 불러와 사용함 (e.g. `@import "native.css"`) 👈 [예시 파일](https://jwarby.github.io/jekyll-pygments-themes/languages/ruby.html)

### raw 태그
중괄호를 이용하는 언어라면 `{% raw %}`와 `{% endraw %}`로 코드를 감싸거나, front matter에 `render_with_liquid: false`를 사용해 문서 전체에서 비활성화할 수 있음.

### link 태그
특정 포스트나 페이지, 파일 등으로 연결할 때 사용하며, `link` 태그는 permalink URL을 만들어 연결해줌. 해당 파일의 permalink가 바뀌어도 `link`가 알아서 연결함.

filter를 `link` 태그에 사용할 수 없음에 주의.

```yaml
# 특정 파일로 연결
{% link _posts/2016-07-26-name-of-post.md %}
# md에서 사용하기
[Link to a post]({% link _posts/2016-07-26-name-of-post.md %})
```

포스트로 링크하고 싶다면 `post_url` 태그도 존재함.

```yaml
# 특정 파일로 연결
{% post_url /subdir/2010-07-21-name-of-post %}
# md에서 사용하기
[Name of Link]({% post_url 2010-07-21-name-of-post %})
```

## component3: Filters
`|` 기호 뒤에 붙어 Liquid 객체의 출력을 변환함. 자세한 목록은 [docs](https://jekyllrb.com/docs/liquid/filters/) 참고

```yaml
# hi의 첫 글자를 대문자로 바꾸어 Hi로 출력
{{ "hi" | capitalize }}
```

- - -

# Front Matter
`---` 사이에 둘러싸인 YAML의 스니펫을 말함. 

이 안에 변수를 정의하면 `page` 변수에서 접근이 가능함
```yml
# md file
---
my_number: 5
---

# other location
{{ page.my_number }}
```

> [지킬 docs](https://jekyllrb.com/docs/front-matter/)

- - -

# Layouts

`_layouts` 폴더에 저장되어 페이지에 적용할 템플릿을 만듦.

레이아웃 만들기: `_layouts/defualt.html`

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>{{ page.title }}</title>
  </head>
  <body>
    {{ content }}
  </body>
</html>
```

레아아웃 사용하기

```yml
---
layout: default #layout 변수에 html 파일 이름 넣기
title: Home
---
```

- - -

# includes

https://jekyllrb.com/docs/step-by-step/05-includes/

- - -

# 변수

front matter가 있는 파일이라면 다 순회 가능. Liquid 통해 다양한 데이터를 사용 가능.

>[지킬 docs](https://jekyllrb.com/docs/variables/)

* `site`: site wide 정보와 `_config.yml`의 설정
  * time
  * pages
  * posts
  * related_posts
  * static_files
  * html_pages
  * html_files
  * collections
  * data
  * documents
  * categories.CATEGORY
  * tags.TAG
  * url
  * CONFIGURATION_DATA: 명령줄이나 `_config.yml`에 있는 변수
* `page`: front matter 정보 & page 관련 정보. front matter에 정의한 커스텀 변수도.
  * content
  * title
  * excerpt
  * url
  * data
  * id
  * categories
  * collection
  * tags
  * dir
  * name
  * path
  * next
  * previous
* `layout`: front matter 정보 & layout 관련 정보. front matter에 정의한 커스텀 변수도.
* `content`: layout 파일에서, 포스트나 페이지의 렌더링된 내용(?). 포스트나 페이지에 정의되지는 않음.
* `paginator`: 옵션 `paginate` 설정 시 사용 가능
  * page
  * per_page
  * posts
  * total_posts
  * total_pages
  * previous_page
  * previous_page_path
  * next_page
  * next_page_path


> ProTip™: Use Custom Front Matter
Any custom front matter that you specify will be available under `page`. For example, if you specify `custom_css: true` in a page’s front matter, that value will be available as `page.custom_css`.
If you specify front matter in a layout, access that via `layout`. For example, if you specify `class: full_page` in a layout’s front matter, that value will be available as `layout.class` in the layout and its parents.

[지킬 튜토리얼 setup 부분](https://jekyllrb.com/docs/step-by-step/01-setup/)
