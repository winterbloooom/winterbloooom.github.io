# 참고 사이트
* [깃허브 페이지 소개](https://pages.github.com/)
* [깃허브 페이지 docs](https://docs.github.com/en/pages)
* 깃허브 페이지 만들기 (개인X)
  * [1](https://cheershennah.tistory.com/216)
  * 
* 지킬
  * [지킬 기초](https://velog.io/@kasterra/Github-%EB%B8%94%EB%A1%9C%EA%B7%B8-%EB%A7%8C%EB%93%A4%EA%B8%B0-%EC%B2%AB%EA%B1%B8%EC%9D%8C-Jekyll-%EA%B8%B0%EC%B4%88)


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
## 지킬 config

> [지킬 docs](https://jekyllrb.com/docs/configuration/) -> environments 부터

* 빌드하지 않는 파일/폴더들
  * `/node_modules`나 `/vendor` 폴더에 있는 것들
  * `_`, `.`, `#`로 시작하는 것들
  * `~`로 끝나는 것들
  * `_config.yml`에 `exclude`로 지정한 것들



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
* `{% %}` 사이에 선언

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

## Liquid 사용 예

포스트 목록 만들기

```html
<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>
```

태그 목록 만들기 (같은 원리로 카테고리도 만들 수 있음)

```html
{% for tag in site.tags %}
  <h3>{{ tag[0] }}</h3>
  <ul>
    {% for post in tag[1] %}
      <li><a href="{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
  </ul>
{% endfor %}
```

부가설명을 불러오기
```
<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
      {{ post.excerpt }}
    </li>
  {% endfor %}
</ul>
```

[네비게이션 사용 예시](https://jekyllrb.com/docs/step-by-step/05-includes/#include-usage)

layout이나 posts에 재사용될 수 있는 부분적 것들. Liquid tag인 `{% include file.ext %}`를 사용해 _include/file.ext에 있는 내용을 불러올 수 있음

include  변수 사용
https://jekyllrb.com/docs/includes/#using-variables-names-for-the-include-file

include 파라미터 사용
https://jekyllrb.com/docs/includes/#using-variables-names-for-the-include-file
https://jekyllrb.com/docs/includes/#passing-parameters-to-includes

레이아웃 변수: layout이 있는 front matter에서는 page라는 변수 대신 layout이라는 변수를 사용할 수 있다.

```
---
city: San Francisco
---
<p>{{ layout.city }}</p>

{{ content }}
```

page.city가 아니라 layout.city로 사용할 수 있다.

[네비게이션을 yml 파일에 정의하고 사용하는 예](https://jekyllrb.com/docs/step-by-step/06-data-files/#data-file-usage)
- - -



[지킬 튜토리얼 setup 부분](https://jekyllrb.com/docs/step-by-step/01-setup/)
[지킬 튜토리얼 deploy 부분](https://jekyllrb.com/docs/step-by-step/10-deployment/)
[여러 저자가 함께 작업할 때 (collections)](https://jekyllrb.com/docs/step-by-step/09-collections/)