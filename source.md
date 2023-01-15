# 할 일 순서
1. 개별 포스트 화면 디자인
   * 푸터 위, 컨텐츠 맨 마지막: 공유 & 저작권 표시 의무적으로 들어가도록
2. 전체적 디자인 테마
   * 흰색, 회색, 검정색 선택
   * 글꼴 스타일: 태그 별(코드는 너비 같은 걸로)
   * 글꼴 크기: 화면 사이즈 별, 태그 별
   * 페이지 소스 보기 금지
   * 우클릭 금지?
   * 다크 모드
3. 시리즈 보기 기능
4. 프로젝트 페이지
5. 태그 별 보기
6. urgent notice도 include 처럼 빼기, lenet1의 첫 notice 처럼 안에 코드 들어갈 수 있도록. 원래는 `pytorch~~` 였음. 임시로 [] 처리한 것
7. 
https://docs.github.com/ko/pages/setting-up-a-github-pages-site-with-jekyll/creating-a-github-pages-site-with-jekyll

* 스크롤 따라
  * fixed, absolute: https://kooyh.tistory.com/18
* 카테고리 열기 (좌측): https://alvarotrigo.com/blog/hamburger-menu-css/
* 배경 흐리기
https://codingbroker.tistory.com/22
https://codingbroker.tistory.com/58
https://ssimplay.tistory.com/67
* 맨위로: http://rwdb.kr/css_scroll_icon/
* 그리드
https://studiomeal.com/archives/533

* 스크롤바
  * https://hhans.tistory.com/m/entry/%ED%8B%B0%EC%8A%A4%ED%86%A0%EB%A6%AC-%EC%83%81%EB%8B%A8-%EC%8A%A4%ED%81%AC%EB%A1%A4-%EC%A7%84%ED%96%89%EB%B0%94-%EB%A7%8C%EB%93%A4%EA%B8%B0 

* SCSS
  * https://heropy.blog/2018/01/31/sass/
  * https://nykim.work/113
* position태그: sticky, static, fixed (위치 고정하기)
* 글꼴
  * https://www.codingfactory.net/10561
* mixin, extend, use
  * https://nykim.work/113

* 검색
  * https://mi-nya.tistory.com/188
  * https://jamesu.dev/posts/2021/01/03/adding-search-page-on-jekyll/
  * searchResultTemplate에 표시할 형식이 나타나며, search.json에 있는 key로 불러옴. {title} 식으로 괄호 띄어쓰기 있으면 안됨

* 내 코드 breadcrumb
```
                <!-- {% assign path = post.path | split: '/' %}
                {% assign lv1 = path[1] %}
                {% assign lv2 = path[2] %}

                <div class="breadcrumb-category">{{ lv1 }}</div>
                <span class="breadcrumb-slash">/</span>
                <div class="breadcrumb-category">{{ lv2 }}</div> -->
```

```
.list-element-category {
                display: flex;
                flex-direction: row;
    
                .breadcrumb-category,
                .breadcrumb-slash {
                    font-size: 13px;
                    height: 25px;
                    border-radius: 3px;
                    color: rgb(55, 53, 47);
                }
    
                .breadcrumb-slash {
                    padding: 0 10px;
                }
            }
```

* 처음 홈 타이틀
```
    <!-- 제목 -->
    <!-- <div id="home-title">
        <div class="title-wrap">
            <div class="title-text">
                Welcome!
            </div>
    
            <div class="contact-list">
                <a class="contact" href="https://github.com/winterbloooom" >
                    <div class="contact-icon"><i class="fa-brands fa-github"></i></div>
                    <div class="contact-title">GitHub</div>
                </a>
    
                <a class="contact" href="mailto:winterbloooom@gmail.com">
                    <div class="contact-icon"><i class="fa-regular fa-envelope"></i></div>
                    <div class="contact-title">e-mail</div>
                </a>
    
                <a class="contact" href="https://www.instagram.com/winterbloooom/">
                    <div class="contact-icon"><i class="fa-brands fa-instagram"></i></div>
                    <div class="contact-title">Instagram</div>
                </a>
            </div>
        </div>

        <span class="material-symbols-outlined scroll-down">keyboard_double_arrow_down</span>
    </div> -->
```

# 요소 별 참고 사이트
## 콘텐츠 리스트
* https://developers.googleblog.com/
* https://engineering.linkedin.com/blog
* https://tech.ebayinc.com/
* https://channel.io/ko/blog/tag/tech
* https://blog.banksalad.com/tech/
* https://careers.devsisters.com/?category=1
* https://inpa.tistory.com/category/Style%20Sheet/CSS
* https://velog.io/@717lumos/Linux-Linux-Admin-systemd
* https://spain.siwonschool.com/?s=community&b=event

## 본문
* [뱅크샐러드](https://blog.banksalad.com/tech/github-action-npm-cache/): 관련 포스트, 태그
* https://www.blossominkyung.com/deeplearning/transfomer-positional-encoding: 상단 토글 메뉴
* https://ddangjiwon.tistory.com/103: 제목 상단바 고정
* https://deeplify.dev/front-end/markup/position-sticky
* https://github.blog/2022-12-23-whats-with-all-the-ducks/

## 메인페이지
* [GitHub](https://github.blog/)
* https://inpa.tistory.com/

## 전체
* https://inpa.tistory.com/entry/CSS-%F0%9F%93%9A-content-%EC%86%8D%EC%84%B1-%EC%A0%95%EB%A6%AC

# 예시 코드
## div 내 img를 div 가운데 정렬
```
.img {
    width: $content-width-mobile;
    margin: auto;
    display: block;
}
```
## 콘텐츠 카드형
```html
<div class="dgc-card">
    <!--카드 전체-->
    <a aria-label="Lynn Langit: Turning a passion for learning into online courses viewed by millions" class="dgc-card__href" href="주소.html"></a> 
    
    <!--이미지-->
    <div class="dgc-card__image-wrapper">
        <img alt="Lynn Langit: Turning a passion for learning into online courses viewed by millions" class="dgc-card__image" src="이미지.png">
    </div>

    <!--텍스트 영역-->
    <div class="dgc-card__content">
        <!--제목-->
        <div class="dgc-card__title">
            Lynn Langit: Turning a passion for learning into online courses viewed by millions
        </div>
        <!--날짜-->
        <div class="dgc-card__info">
            <p>December 09, 2022</p>
        </div>
        <!--설명-->
        <div class="dgc-card__description">
            <p>Posted by Kevin Hernandez, Developer Relations Community Manager</p>
        </div>
        <!--태그 목록-->
        <div class="blog-label-container">
            <a class="blog-label" href="https://developers.googleblog.com/search/label/Get%20Inspired?max-results=12">
                <span>Get Inspired</span>
            </a>
            <a class="blog-label" href="https://developers.googleblog.com/search/label/Google%20Cloud?max-results=12">
                <span>Google Cloud</span>
            </a>
        </div>
    </div>
</div>
```
## 맨 위로 가기
```html
<div class="container">
    <div id="header"></div>
    <main id="main"></div>
    <div class="back-to-top"> <!--맨 위에서 스크롤이 아래로 내려가면 back-to-top-on 생기며 버튼 활성화-->
        <i class="fa fa-arrow-up">:: before</i>
    </div>
</div>
```

## 사이드바 열기
```html
<div class="sidebar-toggle">
    <div class="sidebar-toggle-line-wrap">
        <!--지금은 가로 3줄. 마우스 올리면 화살표로 변함-->
        <span class="sidebar-toggle-line sidebar-toggle-line-first" style="top: 5px; transform: rotateZ(-45deg); width: 100%; opacity: 1; left: 0px;"></span>
        <span class="sidebar-toggle-line sidebar-toggle-line-middle" style="opacity: 0; width: 90%; left: 0px; top: 0px; transform: rotateZ(0deg);"></span>
        <span class="sidebar-toggle-line sidebar-toggle-line-last" style="top: -5px; transform: rotateZ(45deg); width: 100%; opacity: 1; left: 0px;"></span>
    </div>
</div>
```

## 사이드바
```html
<aside id="sidebar" class="sidebar sidebar-active" style="display: block; width: 320px;">
    <div class="sidebar-inner">
        <ul class="sidebar-nav motion-element" style="opacity: 1; display: block; transform: translateX(0px);">
          <li class="sidebar-nav-toc sidebar-nav-active" data-target="post-toc-wrap">
            Table of Contents
          </li>
          <li class="sidebar-nav-overview" data-target="site-overview">
            Overview
          </li>
        </ul>

        <section class="site-overview sidebar-panel sidebar-panel-active" style="opacity: 0; display: none; transform: translateY(0px);">
            <div class="site-author motion-element" itemprop="author" itemscope="" itemtype="http://schema.org/Person" style="opacity: 1; display: block; transform: translateX(0px);">
                <img class="site-author-image" itemprop="image" src="/assets/images/avatar.gif" alt="정재윤">
                <p class="site-author-name" itemprop="name">정재윤</p>
                    <p class="site-description motion-element" itemprop="description" style="opacity: 1; display: block; transform: translateX(0px);">AI Center, SKT</p>
                </div>
            <nav class="site-state motion-element" style="opacity: 1; display: block; transform: translateX(0px);">
                <div class="site-state-item site-state-posts">
                <a href="/archives/">
                    <span class="site-state-item-count">30</span>
                    <span class="site-state-item-name">포스트</span>
                </a>
                </div>
                <div class="site-state-item site-state-categories">
                <a href="/categories/">
                    <span class="site-state-item-count">4</span>
                    <span class="site-state-item-name">카테고리</span>
                </a>
                </div>
                <div class="site-state-item site-state-tags">
                <a href="/tags/">
                    <span class="site-state-item-count">24</span>
                    <span class="site-state-item-name">태그</span>
                </a>
                </div>
            </nav>
            <div class="feed-link motion-element" style="opacity: 1; display: block; transform: translateX(0px);">
                <a href="/atom.xml" rel="alternate">
                <i class="fa fa-rss"></i>
                RSS
                </a>
            </div>
            <div class="links-of-author motion-element" style="opacity: 1; display: block; transform: translateX(0px);">
                <span class="links-of-author-item">
                    <a href="https://github.com/Jayhey" target="_blank" title="GitHub">
                    
                        <i class="fa fa-fw fa-github"></i>
                    
                    GitHub
                    </a>
                </span>
                <span class="links-of-author-item">
                    <a href="mailto:winga1@korea.ac.kr" target="_blank" title="e-mail">
                    
                        <i class="fa fa-fw fa-envelope"></i>
                    
                    e-mail
                    </a>
                </span>
                <span class="links-of-author-item">
                    <a href="https://www.linkedin.com/in/%EC%9E%AC%EC%9C%A4-%EC%A0%95-3548a7151/?trk=uno-choose-ge-no-intent&amp;dl=no" target="_blank" title="Linkedin">
                    
                        <i class="fa fa-fw fa-linkedin-square"></i>
                    
                    Linkedin
                    </a>
                </span>
                <span class="links-of-author-item">
                    <a href="http://dsba.korea.ac.kr" target="_blank" title="DSBA Lab">
                    
                        <i class="fa fa-fw fa-laptop"></i>
                    
                    DSBA Lab
                    </a>
                </span>
            </div>
        </section>
        <!--noindex-->
        <section class="post-toc-wrap motion-element sidebar-panel sidebar-panel-active" style="opacity: 1; display: block; transform: translateX(0px) translateY(0px);">
            <div class="post-toc" style="max-height: 217px; width: calc(100% + 17px);">
                <div class="post-toc-content">
                    <ol class="nav">
                        <li class="nav-item nav-level-1"> 
                            <a class="nav-link" href="#style-based-generator-for-gans---overview"> <span class="nav-text">Style-Based Generator for GANs - overview</span> </a> 
                            <ol class="nav-child"> 
                                <li class="nav-item nav-level-2"> 
                                    <a class="nav-link" href="#introduction">
                                        <span class="nav-text">Introduction</span> 
                                    </a> 
                                    <ol class="nav-child"> 
                                        <ol class="nav-child"> 
                                            <ol class="nav-child"> 
                                                <ol class="nav-child"> 
                                                </ol> 
                                            </ol>
                                        </ol>
                                    </ol>
                                </li> 
                                <li class="nav-item nav-level-2"> 
                                    <a class="nav-link" href="#style-based-generator"> 
                                        <span class="nav-text">Style-based generator</span> 
                                    </a> 
                                    <ol class="nav-child"> 
                                        <li class="nav-item nav-level-3">
                                            <a class="nav-link" href="#mapping-network"> 
                                                <span class="nav-text">Mapping network</span> 
                                            </a> 
                                            <ol class="nav-child"> 
                                                <ol class="nav-child"> 
                                                    <ol class="nav-child"> </ol> 
                                                </ol> 
                                            </ol> 
                                        </li> 
                                        <li class="nav-item nav-level-3"> 
                                            <a class="nav-link" href="#adain-for-styling"> 
                                                <span class="nav-text">AdaIN for styling</span>
                                            </a>
                                            <ol class="nav-child"> 
                                                <ol class="nav-child">
                                                    <ol class="nav-child"> </ol> 
                                                </ol> 
                                            </ol> 
                                        </li> 
                                        <li class="nav-item nav-level-3"> 
                                            <a class="nav-link" href="#add-noise-for-stochastic-variation"> 
                                                <span class="nav-text">Add noise for stochastic variation</span> 
                                            </a> 
                                            <ol class="nav-child"> 
                                                <ol class="nav-child"> 
                                                    <ol class="nav-child"> </ol> 
                                                </ol> 
                                            </ol> 
                                        </li>
                                    </ol> 
                                </li> 
                            <li class="nav-item nav-level-2"> 
                                <a class="nav-link" href="#정리하면">
                                    <span class="nav-text">정리하면…</span> 
                                </a> 
                                <ol class="nav-child"> 
                                    <ol class="nav-child"> 
                                        <ol class="nav-child"> 
                                            <ol class="nav-child"></ol>
                                        </ol>
                                    </ol>
                                </ol>
                            </li>
                        </ol>
                        </li>
                    </ol>
                </div>
            </div>
        </section>
        <!--/noindex-->
    </div>
</aside>
```