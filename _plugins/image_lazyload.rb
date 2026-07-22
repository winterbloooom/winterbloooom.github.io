# frozen_string_literal: true
#
# 본문 이미지에 지연 로딩 속성을 자동 주입한다.
# 이미 loading 속성이 있는 이미지(예: 히어로 teaser 의 eager)는 건너뛴다.
#
# NOTE: 이 파일 첫 줄 주석에 `coding=` 를 포함하는 단어(예: de''coding=)를 쓰지 말 것 —
# 루비가 매직 인코딩 주석으로 오인해 빌드가 깨진다.
Jekyll::Hooks.register [:posts, :pages], :post_render do |doc|
  next unless doc.output_ext == ".html"
  next if doc.output.nil?

  doc.output = doc.output.gsub(/<img(?![^>]*\bloading=)/i, '<img loading="lazy" decoding="async"')
end
