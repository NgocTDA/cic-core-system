-- Pandoc Lua filter: đổi <div class="page-break"> thành ngắt trang Word.
-- Pandoc KHÔNG tôn trọng CSS page-break-after từ HTML input, nên phải inject raw OOXML.
-- Dùng bởi /api/confluence/docx (Confluence → Word).
function Div(el)
  for _, class in ipairs(el.classes) do
    if class == "page-break" then
      return pandoc.RawBlock("openxml", '<w:p><w:r><w:br w:type="page"/></w:r></w:p>')
    end
  end
  return nil
end
