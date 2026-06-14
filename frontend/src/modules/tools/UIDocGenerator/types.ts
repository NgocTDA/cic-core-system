// ============================================================
//  Types — CIC UI Doc Generator
// ============================================================

export type ProviderType = 'A' | 'O' | 'G'; // Anthropic | OpenAI | Gemini

// Thông tin provider an toàn cho client (do /api/ai/providers trả về).
// KHÔNG chứa apiKey/baseUrl — chỉ đủ để hiển thị & chọn.
export interface ProviderInfo {
    id: string;
    label: string;
    type: string; // giá trị thô; có thể không hợp lệ → xem typeValid
    hasKey: boolean; // server có cấu hình apiKey hay chưa (không lộ key)
    typeValid: boolean; // type ∈ A/O/G
}

// Ảnh mockup upload — đọc dưới dạng dataUrl bởi FileReader.
export interface UploadedImage {
    name: string;
    dataUrl: string; // "data:image/png;base64,..."
}

// Một dòng thành phần UI (mục 2.3).
export interface ComponentRow {
    stt: string;
    name: string;
    type: string;
    required: string;
    desc: string;
    validation: string;
}

// Một bước trong luồng xử lý (mục 2.4).
export interface FlowRow {
    step: string;
    actor: string;
    action: string;
    result: string;
}

// Một dòng xử lý lỗi (mục 2.5).
export interface ErrorRow {
    situation: string;
    message: string;
    action: string;
}

// Một câu hỏi mở / ghi chú (mục 2.7).
export interface OpenQuestion {
    topic: string;
    content: string;
}

// JSON mà AI trả về sau khi phân tích màn hình.
export interface DocData {
    funcName: string;
    screenCode: string;
    module: string;
    purpose: string;
    scope: string[];
    screenType: string;
    accessRoles: string;
    parentScreen: string | null;
    childScreens: string | null;
    components: ComponentRow[];
    flow: FlowRow[];
    errors: ErrorRow[];
    businessRules: string[];
    openQuestions: OpenQuestion[];
}

// Đầu vào form (người dùng nhập).
export interface DocInput {
    funcName: string;
    screenCode: string;
    module: string;
    funcDesc: string;
    images: UploadedImage[];
}
