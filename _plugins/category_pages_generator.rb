# _data/categories.yml 하나로 카테고리 아카이브 페이지를 전부 생성한다.
#   - lv1: /category/<lv1slug>/            (해당 최상위 카테고리 전체 글)
#   - lv2: /category/<lv1slug>/<lv2slug>/  (해당 하위 카테고리 글)
# 기존 _pages/categories/* 24개 중복 파일을 대체한다 (이원화 방지).
module Jekyll
  class CategoryArchivePage < PageWithoutAFile
    def initialize(site, dir, title, eyebrow, filter_category, root_slug)
      super(site, site.source, dir, "index.html")
      self.data.merge!(
        "layout"             => "archive",
        "title"             => title,
        "eyebrow"           => eyebrow,
        "filter_category"   => filter_category,   # site.categories 필터 키 (front matter 값)
        "category_slug"     => true,
        "category_root_slug" => root_slug,        # 점 색상용 최상위 slug
        "sitemap"           => true
      )
    end
  end

  class CategoryPagesGenerator < Generator
    safe true
    priority :normal

    def generate(site)
      cats = site.data.dig("categories", "categories") || []
      cats.each do |lv1|
        slug1 = lv1["slug"]
        site.pages << CategoryArchivePage.new(
          site, File.join("category", slug1),
          lv1["name"], lv1["name"], lv1["name"], slug1
        )

        (lv1["children"] || []).each do |lv2|
          site.pages << CategoryArchivePage.new(
            site, File.join("category", slug1, lv2["slug"]),
            "#{lv1["name"]} · #{lv2["name"]}",
            "#{lv1["name"]} · #{lv2["name"]}",
            lv2["name"], slug1
          )
        end
      end
    end
  end
end
