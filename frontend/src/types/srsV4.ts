// ============================================================
//  Types cho Mẫu SRS v4.0 (Đa tính năng: 1 Chức năng chứa N Tính năng)
//  Tương thích đề cương outline.py v4.0 và srs-pipeline
// ============================================================

export type SrsV4Profile = 'UI' | 'TICHHOP' | 'JOB' | 'PHANTICH' | 'DANHMUC';

// Bảng 1: Mô tả chung (Cấp Chức năng FUNC-...)
export interface SrsV4General {
    loai: SrsV4Profile;
    maChucNang: string; // VD: FUNC-QLSP-047
    tenChucNang: string; // VD: Quản lý thông tin sản phẩm
    nhomChucNang: string; // VD: GRP-QLSP-01
    moTa: string; // Mô tả ngắn gọn
    tacNhanChinh: string; // VD: Cán bộ QLSP
    tacNhanPhu?: string; // VD: Hệ thống M5
    viTriChucNang: string; // VD: Menu Sản phẩm > Quản lý sản phẩm
    dieuKienTienQuyet?: string;
    hauDieuKien?: string;
    chucNangTienDe?: string;
    chucNangKeTiep?: string;
    chucNangDungChung?: string;
    yeuCauDacThu?: string;
}

// Bảng 2: Truy vết yêu cầu (Use Cases)
export interface SrsV4TraceabilityItem {
    maUc: string; // VD: UC-0787
    tenUc: string;
    tinhNangDapUng: string; // VD: FEAT-QLSP-047-01
    vaiTro: 'Chính' | 'Dùng chung';
    mucDapUng: 'Đầy đủ' | 'Một phần';
    ghiChu?: string;
}

// Bảng 3: Ma trận phân quyền
export interface SrsV4PermissionItem {
    stt: number;
    maFeat: string; // VD: FEAT-QLSP-047-01
    tinhNang: string; // Tên tính năng / thao tác
    roles: Record<string, string>; // e.g. { 'ROLE-QTHT': 'X', 'ROLE-CB': '' }
    phamVi: string; // VD: Toàn hệ thống | Theo đơn vị | Bản ghi của mình
}

// Bảng 4: Quy tắc nghiệp vụ BR
export interface SrsV4BusinessRule {
    maBr: string; // VD: BR-QLSP-047-001
    noiDung: string;
    apDungCho: string;
    maThongBao: string; // VD: ERR_014
}

// Luồng xử lý chính trong tính năng
export interface SrsV4MainFlowStep {
    step: number;
    actor: string;
    action: string;
    result: string;
}

// Luồng xử lý thay thế
export interface SrsV4AltFlow {
    maLuong: string; // VD: ALT_01
    dieuKien: string;
    xuLy: string;
    quayVeStep: string;
}

// Luồng xử lý ngoại lệ
export interface SrsV4ExcFlow {
    maLuong: string; // VD: EXC_01
    tinhHuong: string;
    xuLy: string;
    maThongBao: string;
}

// Thành phần giao diện / dữ liệu
export interface SrsV4UIComponent {
    stt: number;
    name: string; // Tên trường / thành phần
    type: string; // Kiểu dữ liệu / loại control (e.g. InputText, Select, Table)
    required: 'Có' | 'Không';
    limit?: string; // Giới hạn (e.g. max 100 char)
    validation?: string; // Mô tả ràng buộc / Mã BR
}

// Xử lý sự kiện & thao tác
export interface SrsV4EventHandling {
    stt: number;
    event: string; // Sự kiện / Thao tác (e.g. Click Nút Lưu)
    condition?: string; // Điều kiện
    processing: string; // Xử lý hệ thống
    resultMsg?: string; // Mã thông báo / Kết quả
}

// Thông báo
export interface SrsV4MessageItem {
    stt: number;
    maThongBao: string; // VD: ERR_014, WAR_002, SUC_001
    loai: 'ERR' | 'WAR' | 'INF' | 'SUC' | 'CONF';
    noiDung: string;
    dieuKien: string;
}

// Tiêu chí chấp nhận
export interface SrsV4AcceptanceCriteria {
    stt: number;
    tieuChi: string; // "Khi ... thì hệ thống phải ..."
    maBr?: string; // Mã BR liên quan
}

// Khối Tính năng (FEAT-...) - Nhân bản 1-to-N
export interface SrsV4Feature {
    maFeat: string; // VD: FEAT-QLSP-047-01
    tenFeat: string; // VD: Tra cứu danh sách sản phẩm
    moTaYeuCau: string;
    luongChinh: SrsV4MainFlowStep[];
    luongThayThe: SrsV4AltFlow[];
    luongNgoaiLe: SrsV4ExcFlow[];
    thietKeGiaoDien?: string; // Mockup image path / reference / dataUrl
    thanhPhanGiaoDien: SrsV4UIComponent[];
    suKienThaoTac: SrsV4EventHandling[];
    thongBao: SrsV4MessageItem[];
    tieuChiChapNhan: SrsV4AcceptanceCriteria[];
}

// Phân loại dữ liệu (Cấp Chức năng)
export interface SrsV4DataClassification {
    stt: number;
    truongDuLieu: string;
    phanLoai: 'Công khai' | 'Nội bộ' | 'Nhạy cảm' | 'Định danh cá nhân';
    quyTacChe: string;
    ghiNhatKy: 'Có' | 'Không';
    thoiHanLuu: string;
}

// Câu hỏi mở / Vấn đề còn mở
export interface SrsV4OpenQuestion {
    topic: string;
    content: string;
}

// Cấu trúc Data JSON tổng thể cho 1 trang SRS v4.0
export interface SrsV4DocData {
    profile: SrsV4Profile;
    general: SrsV4General;
    traceability: SrsV4TraceabilityItem[];
    permissions: SrsV4PermissionItem[];
    overallFlow?: string; // Sơ đồ luồng màn hình / kiến trúc tích hợp / luồng dữ liệu
    stateDiagram?: string; // Sơ đồ trạng thái
    businessFlow?: string; // Luồng nghiệp vụ tổng thể
    businessRules: SrsV4BusinessRule[];
    features: SrsV4Feature[];
    dataAndIntegration?: string;
    dataClassification: SrsV4DataClassification[];
    openQuestions: SrsV4OpenQuestion[];
}

// Registry Data Models
export interface RegistryManifestItem {
    ma_chuc_nang: string;
    ten_chuc_nang: string;
    phan_he: string;
    nhom: string;
    owner?: string;
    trang_thai?: string;
    thu_tu?: string;
}

export interface RegistryGroupItem {
    ma: string;
    ten_nhom: string;
    phan_he: string;
}

export interface RegistryUseCaseItem {
    ma_uc: string;
    ten_uc: string;
    phan_he: string;
}

export interface RegistryMessageItem {
    ma: string;
    loai: string;
    noi_dung: string;
}

export interface RegistryStateItem {
    ma: string;
    ten: string;
}

export interface RegistryRoleItem {
    ma: string;
    ten_vai_tro: string;
}

export interface RegistryParticipantItem {
    ma: string;
    ten: string;
}

export interface RegistryObjectItem {
    ma: string;
    ten: string;
}
