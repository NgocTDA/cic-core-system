# JQL cho Dashboard buổi sáng — Jira Data Center (jira.teca.com.vn)

> **Placeholder cần đổi trước khi dùng:**
> - `TECA` → project key của bạn
> - `"Story Points"` → tên trường điểm thật (DC thường là `cf[10002]`; kiểm tra ở *Admin → Custom fields*)
> - `membersOf("teca-dev-team")` → tên group/role chứa thành viên team (hoặc thay bằng danh sách `assignee in (an, binh, chi, ...)`)
> - Tên status (`"In Progress"`, `"In Review"`, `Done`...) phải khớp đúng workflow của bạn
> - Blocker: chọn 1 trong các cách ở khối tương ứng tuỳ cấu hình (Flagged / status / priority / label)

---

## A. TAB CÁ NHÂN

### KPI 1 — Gán cho tôi (đang mở)
```
project = TECA AND assignee = currentUser() AND statusCategory != Done
ORDER BY priority DESC, updated DESC
```

### KPI 2 / Khối "Blocker" (của tôi)
```
project = TECA AND assignee = currentUser() AND statusCategory != Done
AND (Flagged = Impediment OR status = "Blocked" OR priority = Blocker OR labels = blocked)
ORDER BY priority DESC
```

### KPI 3 / Khối "Quá hạn" (của tôi)
```
project = TECA AND assignee = currentUser() AND statusCategory != Done
AND duedate < now()
ORDER BY duedate ASC
```

### KPI 4 / Khối "Cần phân loại" (ticket mới, chưa ước lượng)
```
project = TECA AND statusCategory = "To Do"
AND ("Story Points" IS EMPTY OR assignee IS EMPTY)
AND sprint IS EMPTY
AND created >= -7d
ORDER BY created DESC
```

### KPI 5 / Khối "Tiến độ Sprint" (sprint hiện tại của tôi)
> JQL không tự cộng điểm — lấy danh sách rồi cộng `"Story Points"` ở phía code, hoặc dùng **Sprint Report** của board.
```
project = TECA AND sprint IN openSprints() AND assignee = currentUser()
ORDER BY status ASC
```
Phần đã hoàn thành (để tính %):
```
project = TECA AND sprint IN openSprints() AND assignee = currentUser()
AND statusCategory = Done
```

### Khối danh sách "Việc gán cho tôi"
```
project = TECA AND assignee = currentUser() AND sprint IN openSprints()
AND statusCategory != Done
ORDER BY priority DESC, duedate ASC
```

---

## B. TAB THEO TEAM

> Định nghĩa "team" = thành viên trong group/role. Đổi `membersOf("teca-dev-team")` cho phù hợp.

### KPI 1 — Tổng việc mở (team)
```
project = TECA AND assignee IN membersOf("teca-dev-team")
AND statusCategory != Done
```

### KPI 2 — Đang làm
```
project = TECA AND assignee IN membersOf("teca-dev-team")
AND status = "In Progress"
```

### KPI 3 — Blocker toàn team
```
project = TECA AND assignee IN membersOf("teca-dev-team")
AND statusCategory != Done
AND (Flagged = Impediment OR status = "Blocked" OR priority = Blocker OR labels = blocked)
ORDER BY priority DESC
```

### KPI 4 — Quá hạn toàn team
```
project = TECA AND assignee IN membersOf("teca-dev-team")
AND statusCategory != Done AND duedate < now()
ORDER BY duedate ASC
```

### KPI 5 — Sprint hoàn thành (toàn team)
```
project = TECA AND sprint IN openSprints() AND assignee IN membersOf("teca-dev-team")
```
Đã Done (tử số tính %):
```
project = TECA AND sprint IN openSprints() AND assignee IN membersOf("teca-dev-team")
AND statusCategory = Done
```

### Bảng "Tải công việc theo thành viên"
> Một query lấy toàn bộ issue của sprint, rồi **group theo `assignee`** ở phía code để dựng từng dòng.
```
project = TECA AND sprint IN openSprints() AND assignee IN membersOf("teca-dev-team")
ORDER BY assignee ASC, status ASC
```
Nếu muốn truy vấn riêng từng người (ví dụ tải của An):
```
project = TECA AND sprint IN openSprints() AND assignee = "an"
```

### Khối "Phân bố trạng thái" (đếm theo cột)
> Chạy 4 query đếm, hoặc 1 query rồi đếm theo `status` ở code.
```
# To Do
project = TECA AND sprint IN openSprints() AND assignee IN membersOf("teca-dev-team") AND statusCategory = "To Do"
# In Progress
project = TECA AND sprint IN openSprints() AND assignee IN membersOf("teca-dev-team") AND status = "In Progress"
# In Review
project = TECA AND sprint IN openSprints() AND assignee IN membersOf("teca-dev-team") AND status = "In Review"
# Done
project = TECA AND sprint IN openSprints() AND assignee IN membersOf("teca-dev-team") AND statusCategory = Done
```

### Khối "Blocker toàn team" (danh sách)
```
project = TECA AND assignee IN membersOf("teca-dev-team") AND statusCategory != Done
AND (Flagged = Impediment OR status = "Blocked" OR priority = Blocker OR labels = blocked)
ORDER BY priority DESC, updated DESC
```

### Khối "Quá hạn toàn team" (danh sách)
```
project = TECA AND assignee IN membersOf("teca-dev-team") AND statusCategory != Done
AND duedate < now()
ORDER BY duedate ASC
```

### Khối "Theo Epic / Initiative"
> Lấy issue nhóm theo Epic. Trên DC, link epic là trường **"Epic Link"**.
Tất cả issue của sprint kèm Epic Link (group theo Epic ở code):
```
project = TECA AND sprint IN openSprints() AND "Epic Link" IS NOT EMPTY
ORDER BY "Epic Link" ASC
```
Tiến độ một epic cụ thể (ví dụ TECA-900 = "Onboarding đối tác"):
```
"Epic Link" = TECA-900
# và phần Done:
"Epic Link" = TECA-900 AND statusCategory = Done
```

---

## Ghi chú kỹ thuật khi đấu nối
- REST endpoint DC: `GET https://jira.teca.com.vn/rest/api/2/search?jql=...&fields=summary,status,assignee,priority,duedate,issuetype,customfield_XXXXX&maxResults=100`
- Xác thực: **Personal Access Token** (Profile → Personal Access Tokens), gửi qua header `Authorization: Bearer <token>`. Bạn tự tạo & cấu hình token trong connector — mình không xử lý token.
- `statusCategory` (To Do / In Progress / Done) ổn định hơn tên status; ưu tiên dùng khi có thể.
- `now()`, `currentUser()`, `openSprints()`, `membersOf()` đều được hỗ trợ trên Jira Server/DC.
- Cộng Story Points: API không cộng sẵn — cộng `customfield_XXXXX` của các issue trả về ở phía code dashboard.
