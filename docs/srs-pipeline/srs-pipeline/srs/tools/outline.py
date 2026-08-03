#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
outline.py — NGUON SU THAT DUY NHAT ve de cuong dac ta chuc nang (v3.0).

Bon noi tieu thu dinh nghia nay:
  tools/make_child_template.py      -> CHILD_TEMPLATE_<PROFILE>.docx
  tools/make_child_template_md.py   -> CHILD_TEMPLATE_<PROFILE>.md
  tools/validate_child.py           -> luat kiem tra, re nhanh theo profile
  tools/merge.py                    -> thay the placeholder so do

Sua de cuong thi chi sua o day roi chay lai ca bon.

---------------------------------------------------------------------------
BON LOAI CHUC NANG
---------------------------------------------------------------------------
  UI        Chức năng / Tính năng có giao diện
  TICHHOP   Tích hợp hệ thống
  JOB       Job (xử lý theo lô / định kỳ)
  PHANTICH  Phân tích chỉ tiêu báo cáo thống kê

  DANHMUC   Biến thể RÚT GỌN của UI, không phải loại thứ năm. Dùng cho các
            chức năng quản lý danh mục thừa hưởng hành vi CRUD chuẩn đã đặc tả
            một lần ở component CMP-DANHMUC-001 trong 00_master_head.docx.

Cap CHUC NANG (9 muc Heading 4) giu nguyen cho moi loai — chi doi ten 1 muc
va doi bang Ma tran phan quyen. Chi khoi Tinh nang (Heading 5) la thay the
hoan toan. Nho vay ma tran phan quyen, quy tac nghiep vu, du lieu tac dong van
tra cuu duoc xuyen loai, va tai lieu tong van la mot cay thong nhat.

Chieu rong cot tinh bang twips, tong moi bang phai bang USABLE = 9355
(= 6.5 inch, vung chu A4 voi le cua template CIC).
"""

# Phien ban de cuong. Tang khi them/bot/doi ten muc Heading 4 hoac Heading 5.
# export_outline_json.py ghi gia tri nay vao outline.json; web tool hien thi len
# UI de nguoi dung thay ngay khi ban dang dung da cu.
VERSION = "3.0"

USABLE = 9355

TITLE = "Chức năng [MÃ_CHỨC_NĂNG] «Tên chức năng»"
FEATURE_TITLE = "Tính năng [MÃ_TÍNH_NĂNG] «Tên tính năng»"
FEATURE_NOTE = "Nhân bản toàn bộ khối này (gồm các mục con bên dưới) cho mỗi tính năng."

DIAGRAM_MARK = "[[DIAGRAM: {ma}_seq-01]]"

CODE_RULES = [
    ("Chức năng", "FUNC-«NHÓM»-«3 số»", "FUNC-NSD-001"),
    ("Tính năng", "FEAT-«mã chức năng bỏ tiền tố»-«2 số»", "FEAT-NSD-001-02"),
    ("Quy tắc nghiệp vụ", "BR-«mã chức năng»-«3 số»", "BR-FUNC-NSD-001-001"),
    ("Thông báo", "[LOẠI]_[NHÓM]_[3 số]", "ERR_NGUOIDUNG_001"),
    ("Sơ đồ", "«mã chức năng»_seq-«2 số»", "FUNC-TCH-002_seq-01"),
]

# Dang chuan cua tung loai ma, dang bieu thuc chinh quy. validate_child.py va
# export_outline_json.py deu doc tu day — dung viet lai o noi khac.
#
# LUU Y: cac mau nay duoc xuat sang outline.json cho web tool dung, nen phai
# giu cu phap chung cho ca Python lan JavaScript. Chi dung \d, lop ky tu, neo
# ^$ — KHONG dung (?P<...>), \A\Z, hay lookbehind do dai thay doi.
CODE_PATTERNS = {
    "func": r"^FUNC-[A-Z0-9]+-\d{3}$",
    "feat": r"^FEAT-[A-Z0-9]+-\d{3}-\d{2}$",
    "br":   r"^BR-[A-Z0-9\-]+-\d{3}$",
    "msg":  r"^(ERR|WAR|INF|SUC|CONF)_[A-Z0-9]+_\d{3}$",
    "seq":  r"^FUNC-[A-Z0-9]+-\d{3}_seq-\d{2}$",
}

# Nhan hien thi cho tung khoa o tren, dung chung thu tu voi CODE_RULES.
CODE_KEYS = ["func", "feat", "br", "msg", "seq"]

GUIDANCE = [
    "Chỉ dùng style có sẵn: Heading 3/4/5, T-NoiDung, T-Gach -, T-Gach +, TableStyle3. "
    "Không tạo style mới, không định dạng trực tiếp.",
    "Cấp cao nhất của file này LUÔN là Heading 3. Không dùng Heading 1/Heading 2.",
    "Không gõ tay số thứ tự mục. Số do Word tự sinh; gõ tay sẽ sai sau khi ghép.",
    "Không xoá mục Heading 4/Heading 5 nào. Mục không áp dụng thì ghi “Không áp dụng”.",
    "Nhân bản khối “Tính năng” cho mỗi tính năng. Chức năng chỉ có 1 tính năng vẫn giữ tầng này.",
    "Sơ đồ trình tự viết bằng PlantUML, lưu ở diagrams/. Trong file này chỉ để "
    "placeholder [[DIAGRAM: mã_seq-01]] — script build tự render và chèn ảnh có caption.",
    "Ảnh khác đánh số bằng References > Insert Caption. Không gõ tay “Hình 3”, “Bảng 5”.",
    "Tham chiếu sang chức năng khác: gõ theo mã. Không dùng Cross-reference sang file khác.",
    "Vai trò, đơn vị/hệ thống, mã thông báo, mã trạng thái, component: chỉ tham chiếu "
    "theo mã đã đăng ký ở tài liệu tổng. Không định nghĩa lại trong file con.",
    "Mục “Lịch sử thay đổi” do script build tự đổ từ Git log — không gõ tay.",
    "Chức năng có tính toán phức tạp: KHÔNG đặc tả thuật toán ở đây. SRS khai báo "
    "quy tắc nào áp dụng ở đâu (mã BR); thuật toán định nghĩa trong thư viện đặc tả REL.",
]


def _t(headers, widths, rows=3, labels=None, label=None):
    assert sum(widths) == USABLE, f"{headers[:2]}: tổng {sum(widths)} ≠ {USABLE}"
    assert len(headers) == len(widths), f"{headers[:2]}: lệch số cột"
    return dict(headers=headers, widths=widths, rows=rows, labels=labels, label=label)


def _kv(labels, rows_note=None):
    """Bang 2 cot Hang muc / Noi dung."""
    return _t(["Hạng mục", "Nội dung"], [2400, 6955], rows=len(labels), labels=labels)


# ===========================================================================
# CAP CHUC NANG — dung chung cho moi loai
# ===========================================================================

MO_TA_CHUNG_LABELS = [
    "Loại chức năng", "Mã chức năng", "Tên chức năng", "Mô tả chức năng",
    "Tác nhân chính", "Tác nhân phụ", "Vị trí chức năng",
    "Điều kiện tiên quyết", "Hậu điều kiện",
    "Chức năng tiền đề", "Chức năng kế tiếp", "Chức năng dùng chung",
    "Mã yêu cầu BRD", "Yêu cầu đặc thù",
]

# Bang Ma tran phan quyen — khac nhau theo loai, nhung LUON co cot "Mã tính năng"
# de validator kiem duoc do phu mot cach thong nhat.
PQ_TABLE = {
    "UI": _t(["STT", "Mã tính năng", "Tính năng / Thao tác",
              "«MÃ_VAI_TRÒ_1»", "«MÃ_VAI_TRÒ_2»", "«MÃ_VAI_TRÒ_3»", "Phạm vi dữ liệu"],
             [500, 1900, 2400, 800, 800, 800, 2155], rows=5),
    "TICHHOP": _t(["STT", "Mã tính năng", "Endpoint / Thao tác",
                   "Mã đơn vị / hệ thống được phép", "Phạm vi dữ liệu", "Quota / Giới hạn"],
                  [500, 1750, 2000, 2200, 1500, 1405], rows=5),
    "JOB": _t(["STT", "Mã tính năng", "Thao tác thủ công",
               "Mã vai trò được phép", "Phạm vi dữ liệu"],
              [500, 1900, 2600, 2400, 1955], rows=4),
}
PQ_TABLE["PHANTICH"] = PQ_TABLE["UI"]
PQ_TABLE["DANHMUC"] = PQ_TABLE["UI"]

PQ_NOTE = {
    "UI": "Mã vai trò lấy từ Danh mục vai trò ở tài liệu tổng, không đặt tên tự do. "
          "Ô đánh “X” = được phép. Phạm vi dữ liệu: Toàn hệ thống / Theo đơn vị / "
          "Theo vùng / Bản ghi của mình. Mỗi tính năng khai báo phía dưới phải có ít "
          "nhất một dòng ở bảng này.",
    "TICHHOP": "Dòng là mã đơn vị / hệ thống được phép gọi, lấy từ Danh mục đơn vị và "
               "hệ thống ở tài liệu tổng (theo mã định danh nội bộ 19 ký tự). Quota ghi "
               "theo số lời gọi trên đơn vị trên ngày. Mỗi tính năng khai báo phía dưới "
               "phải có ít nhất một dòng ở bảng này.",
    "JOB": "Job chạy tự động không cần phân quyền người dùng; bảng này khai báo ai được "
           "thực hiện thao tác THỦ CÔNG: chạy lại, dừng, xem nhật ký, tải báo cáo lỗi. "
           "Mỗi tính năng khai báo phía dưới phải có ít nhất một dòng ở bảng này.",
}
PQ_NOTE["PHANTICH"] = PQ_NOTE["UI"]
PQ_NOTE["DANHMUC"] = PQ_NOTE["UI"]

# Muc thu 3 doi ten theo loai — thay vi de "Không áp dụng" cho co
SO_DO_TONG = {
    "UI": ("Luồng màn hình",
           "Sơ đồ điều hướng giữa các màn hình. Chức năng chỉ có một màn hình thì ghi "
           "“Không áp dụng”."),
    "TICHHOP": ("Sơ đồ kiến trúc tích hợp",
                "Sơ đồ khối thể hiện hệ thống nào gọi hệ thống nào, qua giao thức gì, "
                "đồng bộ hay bất đồng bộ. Không mô tả trình tự ở đây — trình tự nằm ở "
                "mục Sơ đồ trình tự trong từng tính năng."),
    "JOB": ("Sơ đồ luồng dữ liệu",
            "Dữ liệu đi từ nguồn nào, qua các bước xử lý nào, ghi vào đâu. Kèm các "
            "nhánh loại bỏ bản ghi không hợp lệ."),
}
SO_DO_TONG["PHANTICH"] = ("Luồng màn hình",
                          "Sơ đồ điều hướng giữa các màn hình tham số, xem trước và "
                          "kết xuất. Không có màn hình thì ghi “Không áp dụng”.")
SO_DO_TONG["DANHMUC"] = SO_DO_TONG["UI"]


def before_features(profile: str) -> list:
    ten_so_do, note_so_do = SO_DO_TONG[profile]
    return [
        dict(name="Mô tả chung",
             tables=[_kv(MO_TA_CHUNG_LABELS)],
             note=f"Loại chức năng: điền đúng một trong {' / '.join(ALL_PROFILES)}. "
                  "Vị trí chức năng: đường dẫn menu, hoặc endpoint, hoặc tên job. "
                  "Hậu điều kiện: trạng thái hệ thống sau khi thực hiện thành công."),
        dict(name="Ma trận phân quyền",
             tables=[PQ_TABLE[profile]],
             note=PQ_NOTE[profile]),
        dict(name=ten_so_do, note=note_so_do),
        dict(name="Sơ đồ trạng thái",
             note="Chỉ lập khi đối tượng nghiệp vụ có vòng đời trạng thái. Mã trạng thái "
                  "phải khớp mục “Danh sách trạng thái trên hệ thống”. Không có thì ghi "
                  "“Không áp dụng”."),
        dict(name="Luồng nghiệp vụ",
             note="Luồng nghiệp vụ tổng thể của chức năng, xuyên qua nhiều tính năng. "
                  "Chi tiết từng bước mô tả ở mục Tính năng tương ứng."),
        dict(name="Quy tắc nghiệp vụ",
             tables=[_t(["Mã quy tắc", "Nội dung quy tắc", "Áp dụng cho",
                         "Mã thông báo khi vi phạm"],
                        [2200, 3355, 1900, 1900], rows=5)],
             note="Mã theo dạng BR-«MÃ_CHỨC_NĂNG»-001. Bảng thành phần và bộ test case "
                  "tham chiếu theo mã này, không chép lại nội dung quy tắc."),
    ]


def after_features(profile: str) -> list:
    return [
        dict(name="Dữ liệu và tích hợp",
             tables=[_t(["STT", "Loại", "Tên đối tượng", "Chiều", "Mô tả / Ghi chú"],
                        [500, 1400, 2400, 1200, 3855], rows=4)],
             note="Loại: Bảng CSDL / API / File / Hàng đợi. Chiều: Đọc / Ghi / Vào / Ra. "
                  "Dùng để dựng ma trận CRUD và xác định phạm vi tác động khi đổi dữ liệu."),
        dict(name="Vấn đề còn mở",
             tables=[_t(["STT", "Nội dung vấn đề", "Người quyết định", "Hạn chốt",
                         "Trạng thái"], [500, 3800, 1800, 1400, 1855], rows=3)],
             note="Mục này PHẢI rỗng thì chức năng mới được chuyển sang status = approved."),
        dict(name="Lịch sử thay đổi",
             tables=[_t(["Phiên bản", "Ngày", "Người thực hiện", "Mô tả thay đổi"],
                        [1100, 1400, 2200, 4655], rows=1)],
             note="Script build tự đổ nội dung từ Git log của chính file này. Không gõ tay."),
    ]


# ===========================================================================
# KHOI TINH NANG — thay the hoan toan theo loai
# ===========================================================================

MSG_TABLE = _t(["STT", "Mã thông báo", "Loại", "Nội dung", "Điều kiện phát sinh"],
               [500, 2000, 1200, 3300, 2355], rows=4)
MSG_NOTE = ("Mã theo quy ước [LOẠI]_[NHÓM]_[SỐ] đã đăng ký ở mục “Danh sách thông báo "
            "trên hệ thống”. Mã mới phải đăng ký với Lead BA trước khi dùng.")

SEQ_NOTE = ("Viết bằng PlantUML, lưu ở diagrams/«mã chức năng»_seq-«nn».puml. "
            "Ở đây chỉ để placeholder — script build tự render và chèn ảnh có caption. "
            "Tên participant phải là mã hệ thống đã đăng ký, không viết tên mô tả tự do.")

FEATURES = {
    # ---------------------------------------------------------------- UI ---
    "UI": [
        dict(name="Mô tả yêu cầu",
             note="Người dùng làm gì, hệ thống trả về gì, ràng buộc và trường hợp ngoại lệ."),
        dict(name="Luồng xử lý", tables=[
            _t(["Bước", "Tác nhân", "Hành động", "Phản hồi của hệ thống"],
               [700, 1800, 3400, 3455], rows=4, label="Luồng chính"),
            _t(["Mã luồng", "Điều kiện rẽ nhánh", "Xử lý", "Quay về bước"],
               [1300, 2800, 3400, 1855], rows=3, label="Luồng thay thế"),
            _t(["Mã luồng", "Tình huống ngoại lệ", "Xử lý của hệ thống", "Mã thông báo"],
               [1300, 2800, 3400, 1855], rows=3, label="Luồng ngoại lệ"),
        ]),
        dict(name="Thiết kế giao diện",
             note="Chèn ảnh mockup, đặt In line with text. Đánh số hình bằng Insert Caption.",
             note_md="Đính kèm ảnh mockup vào trang, đặt tên file theo mã tính năng "
                     "(vd FEAT-NSD-001-02_tra-cuu.png)."),
        dict(name="Mô tả các thành phần trên giao diện",
             tables=[_t(["STT", "Tên thành phần", "Loại control", "Bắt buộc",
                         "Giá trị mặc định / Nguồn dữ liệu", "Ràng buộc (mã BR)",
                         "Mã thông báo"],
                        [500, 1600, 1100, 800, 1800, 2000, 1555], rows=5)],
             note="Đây là nơi duy nhất khai báo danh sách trường. Không lặp lại ở mục khác."),
        dict(name="Xử lý sự kiện và thao tác",
             tables=[_t(["STT", "Sự kiện / Thao tác", "Điều kiện", "Xử lý của hệ thống",
                         "Kết quả / Mã thông báo"], [500, 2000, 1800, 3000, 2055], rows=5)]),
        dict(name="Thông báo", tables=[MSG_TABLE], note=MSG_NOTE),
    ],

    # ----------------------------------------------------------- TICHHOP ---
    "TICHHOP": [
        dict(name="Mô tả yêu cầu",
             note="Tích hợp để làm gì, bên nào chủ động gọi, nghiệp vụ nào phụ thuộc vào nó."),
        dict(name="Hợp đồng giao tiếp",
             tables=[_kv(["Chiều tích hợp", "Giao thức", "Endpoint / Địa chỉ", "Method",
                          "Phiên bản", "Cơ chế xác thực", "Content-Type",
                          "Đơn vị / hệ thống được phép gọi", "Môi trường áp dụng"])],
             note="Chiều tích hợp: CIC cung cấp (inbound) / CIC gọi ra (outbound). "
                  "Phiên bản theo URL-path versioning, là bắt buộc chứ không tuỳ chọn."),
        dict(name="Dữ liệu vào",
             tables=[_t(["STT", "Trường", "Kiểu dữ liệu", "Bắt buộc",
                         "Ràng buộc (mã BR)", "Ví dụ"],
                        [500, 2000, 1300, 800, 2600, 2155], rows=6)],
             note="Khai báo cả trường trong header (xác thực, truy vết) nếu là bắt buộc."),
        dict(name="Dữ liệu ra",
             tables=[_t(["STT", "Trường", "Kiểu dữ liệu", "Luôn có",
                         "Ý nghĩa", "Ví dụ"],
                        [500, 2000, 1300, 800, 2600, 2155], rows=6)],
             note="Ghi rõ cấu trúc bọc ngoài (mã kết quả, thông điệp, dữ liệu) nếu có."),
        dict(name="Sơ đồ trình tự", note=SEQ_NOTE, diagram=True),
        dict(name="Chính sách lỗi và bù trừ",
             tables=[_kv(["Timeout", "Số lần thử lại", "Khoảng chờ giữa các lần thử",
                          "Idempotency key", "Hành vi khi gọi lại cùng key",
                          "Hành động bù trừ khi thất bại một phần"])],
             note="Đây là mục chức năng có giao diện không có tương đương, và là chỗ đặc tả "
                  "hay thiếu nhất. Không khai báo thì mỗi API sẽ do dev tự quyết một kiểu."),
        dict(name="Yêu cầu phi chức năng",
             tables=[_kv(["SLA thời gian đáp ứng", "Quota theo đơn vị theo ngày",
                          "Kích thước payload tối đa", "Số lời gọi đồng thời",
                          "Lưu vết và nhật ký"])]),
        dict(name="Mã lỗi và thông báo",
             tables=[_t(["STT", "Mã lỗi", "HTTP status", "Nội dung",
                         "Điều kiện phát sinh"],
                        [500, 2000, 1200, 3300, 2355], rows=5)],
             note=MSG_NOTE),
    ],

    # --------------------------------------------------------------- JOB ---
    "JOB": [
        dict(name="Mô tả yêu cầu",
             note="Job làm gì, chạy trên dữ liệu nào, kết quả dùng cho nghiệp vụ nào."),
        dict(name="Kích hoạt và lịch chạy",
             tables=[_kv(["Cơ chế kích hoạt", "Biểu thức lịch (cron)",
                          "Cửa sổ thời gian được phép chạy", "Job phụ thuộc chạy trước",
                          "Thời gian chạy dự kiến", "Cho phép chạy song song"])],
             note="Cơ chế kích hoạt: theo lịch / theo sự kiện / thủ công. "
                  "Cửa sổ thời gian quan trọng khi job nặng, tránh giờ cao điểm."),
        dict(name="Nguồn dữ liệu vào",
             tables=[_t(["STT", "Loại nguồn", "Tên đối tượng", "Định dạng",
                         "Điều kiện lấy dữ liệu"],
                        [500, 1500, 2400, 1400, 3555], rows=5)]),
        dict(name="Quy tắc kiểm tra và loại bỏ",
             tables=[_t(["Tầng kiểm tra", "Mã quy tắc", "Nội dung kiểm tra",
                         "Hành động khi sai", "Mã thông báo"],
                        [1200, 2000, 3000, 1800, 1355], rows=6)],
             note="Ba tầng theo thứ tự: đúng định dạng tệp → đúng cấu trúc dữ liệu → "
                  "đúng quy tắc nghiệp vụ. Hành động khi sai: loại bỏ bản ghi / dừng cả lô / "
                  "ghi nhận cảnh báo. Kèm cơ chế trả báo cáo lỗi về đơn vị gửi và quy trình "
                  "gửi lại."),
        dict(name="Xử lý và ghi nhận",
             tables=[_t(["Bước", "Xử lý", "Đối tượng ghi", "Ghi nhận kết quả"],
                        [700, 3400, 2400, 2855], rows=5)]),
        dict(name="Sơ đồ trình tự", note=SEQ_NOTE, diagram=True),
        dict(name="Chạy lại và bù trừ",
             tables=[_kv(["Job có idempotent không",
                          "Chạy lại từ đầu hay từ điểm dừng",
                          "Xử lý bản ghi đã ghi một phần",
                          "Thao tác bù trừ thủ công",
                          "Người được phép chạy lại"])],
             note="Nếu job không idempotent, phải nêu rõ hậu quả khi chạy lại và cách "
                  "phòng tránh. Đây là câu hỏi vận hành sẽ hỏi đầu tiên khi job lỗi."),
        dict(name="Giám sát và cảnh báo",
             tables=[_t(["STT", "Chỉ số giám sát", "Ngưỡng cảnh báo", "Kênh cảnh báo",
                         "Người nhận"], [500, 2600, 1800, 1800, 2655], rows=4)]),
        dict(name="Mã lỗi và thông báo", tables=[MSG_TABLE], note=MSG_NOTE),
    ],

    # ---------------------------------------------------------- PHANTICH ---
    "PHANTICH": [
        dict(name="Mô tả yêu cầu",
             note="Báo cáo phục vụ mục đích gì, ai đọc, gửi cho cơ quan nào, tần suất nào."),
        dict(name="Định nghĩa chỉ tiêu",
             tables=[_t(["Mã chỉ tiêu", "Tên chỉ tiêu", "Đơn vị đo", "Kỳ báo cáo",
                         "Công thức", "Văn bản quy định"],
                        [1400, 2200, 1000, 1200, 2400, 1155], rows=6)],
             note="Công thức viết bằng ký hiệu chỉ tiêu, không viết bằng tên bảng/trường. "
                  "Văn bản quy định: số hiệu và điều khoản làm căn cứ."),
        dict(name="Nguồn dữ liệu và phạm vi",
             tables=[_t(["STT", "Bảng / Nguồn", "Trường sử dụng", "Điều kiện lọc",
                         "Thời điểm chốt số liệu"],
                        [500, 1800, 2000, 2400, 2655], rows=5)],
             note="Thời điểm chốt số liệu quyết định con số — hai người chốt khác thời điểm "
                  "sẽ ra hai kết quả và không ai sai."),
        dict(name="Quy tắc tính toán và tổng hợp",
             tables=[_t(["Mã quy tắc", "Nội dung", "Chiều tổng hợp", "Quy tắc làm tròn",
                         "Xử lý giá trị thiếu"],
                        [2000, 2800, 1600, 1500, 1455], rows=5)],
             note="Quy tắc làm tròn và xử lý giá trị thiếu phải khai báo tường minh; đây là "
                  "nguyên nhân lệch số phổ biến nhất giữa báo cáo và đối chiếu."),
        dict(name="Bố cục kết xuất",
             tables=[_t(["Vùng", "Nội dung", "Nguồn", "Định dạng", "Ghi chú"],
                        [1200, 2600, 2000, 1600, 1955], rows=5)],
             note="Vùng: tiêu đề / thân / dòng tổng / chân trang. Định dạng kết xuất: "
                  "Excel / PDF / tệp phẳng theo mẫu của cơ quan nhận."),
        dict(name="Đối chiếu và kiểm chứng",
             tables=[_t(["STT", "Phép đối chiếu", "Nguồn đối chiếu", "Sai số cho phép"],
                        [500, 3400, 3400, 2055], rows=4)],
             note="Bắt buộc với báo cáo gửi cơ quan quản lý: nêu rõ cách chứng minh con số "
                  "đúng — tổng kiểm soát, đối chiếu chéo với báo cáo khác, so với kỳ trước."),
        dict(name="Xử lý khối lượng lớn",
             tables=[_kv(["Cơ chế kết xuất (đồng bộ / bất đồng bộ)",
                          "Cách thông báo hoàn thành",
                          "Thời gian giữ tệp kết quả",
                          "Khối lượng dữ liệu dự kiến",
                          "Giải pháp tăng tốc"])]),
        dict(name="Mã lỗi và thông báo", tables=[MSG_TABLE], note=MSG_NOTE),
    ],

    # ----------------------------------------------------------- DANHMUC ---
    "DANHMUC": [
        dict(name="Mô tả yêu cầu",
             note="Danh mục này dùng ở đâu, ai quản lý, có ảnh hưởng dữ liệu lịch sử không."),
        dict(name="Danh sách trường",
             tables=[_t(["STT", "Tên trường", "Kiểu dữ liệu", "Bắt buộc", "Độ dài",
                         "Ràng buộc (mã BR)", "Ghi chú"],
                        [500, 1900, 1400, 800, 900, 2200, 1655], rows=6)]),
        dict(name="Khoá duy nhất và quy tắc trùng lặp",
             tables=[_t(["STT", "Tổ hợp khoá", "Phạm vi duy nhất",
                         "Mã thông báo khi trùng"],
                        [500, 3000, 3000, 2855], rows=3)]),
        dict(name="Điểm khác biệt so với mẫu chuẩn",
             tables=[_t(["STT", "Hạng mục", "Mẫu chuẩn CMP-DANHMUC-001 quy định",
                         "Chức năng này khác thế nào"],
                        [500, 2200, 3200, 3455], rows=3)],
             note="Mục này RỖNG là bình thường và tốt — nghĩa là danh mục thừa hưởng đúng "
                  "hành vi CRUD chuẩn. Chỉ khai báo chỗ thật sự khác."),
        dict(name="Mã lỗi và thông báo", tables=[MSG_TABLE], note=MSG_NOTE),
    ],
}

# Bon loai GOC. DANHMUC khong nam trong day vi no la bien the rut gon cua UI,
# nhung VAN la gia tri hop le o dong "Loai chuc nang" — cho nen moi cho hien thi
# danh sach gia tri cho BA dien phai dung ALL_PROFILES, khong dung bien nay.
PROFILE_ORDER = ["UI", "TICHHOP", "JOB", "PHANTICH"]

PROFILES = {
    "UI":       dict(ten="Chức năng / Tính năng có giao diện", require_diagram=False),
    "TICHHOP":  dict(ten="Tích hợp hệ thống", require_diagram=True),
    "JOB":      dict(ten="Job (xử lý theo lô / định kỳ)", require_diagram=True),
    "PHANTICH": dict(ten="Phân tích chỉ tiêu báo cáo thống kê", require_diagram=False),
    "DANHMUC":  dict(ten="Danh mục (biến thể rút gọn của UI)", require_diagram=False,
                     variant_of="UI"),
}

ALL_PROFILES = list(PROFILES)


# ---------------------------------------------------------------- truy van --

def h4_singleton(profile: str) -> list:
    return [s["name"] for s in before_features(profile) + after_features(profile)]


def h5_required(profile: str) -> list:
    return [s["name"] for s in FEATURES[profile]]


def sections(profile: str):
    """Tra ve (truoc, khoi tinh nang, sau) cho 1 profile."""
    return before_features(profile), FEATURES[profile], after_features(profile)


def profile_of_name(text: str):
    """Doc gia tri o dong 'Loai chuc nang' -> ma profile."""
    t = (text or "").strip().upper().replace(" ", "")
    for key in PROFILES:
        if t == key:
            return key
    return None


if __name__ == "__main__":
    for p in ALL_PROFILES:
        h4, h5 = h4_singleton(p), h5_required(p)
        print(f"{p:<9} {PROFILES[p]['ten']}")
        print(f"          {len(h4)} mục cấp chức năng · {len(h5)} mục trong khối Tính năng"
              f"{' · bắt buộc sơ đồ trình tự' if PROFILES[p]['require_diagram'] else ''}")
        print(f"          {' | '.join(h5)}")
