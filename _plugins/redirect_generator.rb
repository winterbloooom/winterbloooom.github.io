# 구 URL(Jekyll 기본 date permalink) → 신규 flat permalink 301 리다이렉트.
# 각 포스트의 과거 경로를 계산해 redirect_from 에 주입하면 jekyll-redirect-from 이 리다이렉트 페이지를 생성한다.
#
# 과거 형식 (live sitemap 으로 검증됨):
#   /<cat0_downcased>/<cat1_downcased>/<YYYY>/<MM>/<DD>/<filename_slug>.html
#   예) categories [AI, Computer Vision], 2023-02-14, hpe_ref
#       → /ai/computer vision/2023/02/14/hpe_ref.html  (요청 시 %20 인코딩)
module Jekyll
  class LegacyRedirectGenerator < Generator
    safe true
    priority :highest   # jekyll-redirect-from 보다 먼저 실행되어 redirect_from 을 채운다

    def generate(site)
      site.posts.docs.each do |post|
        cats = Array(post.data["categories"]).map { |c| c.to_s.downcase }
        next if cats.empty?

        slug = File.basename(post.path, ".*").sub(/^\d{4}-\d{2}-\d{2}-/, "")
        date = post.date.strftime("%Y/%m/%d")
        legacy = "/#{cats.join('/')}/#{date}/#{slug}.html"

        existing = Array(post.data["redirect_from"])
        post.data["redirect_from"] = (existing + [legacy]).uniq
      end
    end
  end
end
