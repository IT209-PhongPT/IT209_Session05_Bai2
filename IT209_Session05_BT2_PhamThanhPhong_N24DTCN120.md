# Báo cáo Bài tập 2: Tái cấu trúc Lịch sử Commit bằng Interactive Rebase

**Thông tin sinh viên:**
- **Họ và tên:** Phạm Thanh Phong
- **Mã sinh viên / Lớp:** N24DTCN120
- **Môn học:** IT209 - Phát triển ứng dụng Web / Cloud Infrastructure
- **Session:** Session 05 - Quản trị nâng cao & Khôi phục sự cố mã nguồn Git
- **Bài tập:** Bài tập 2 (ex2)

---

## 1. Mục tiêu & Bối cảnh bài toán

### 1.1. Bối cảnh (Context)
Trong chu trình phát triển tính năng (Feature Branch Workflow), lập trình viên thường xuyên tạo ra nhiều commit vụn vặt trong quá trình code, thử nghiệm và gỡ lỗi (chẳng hạn: `"fix typo"`, `"adds utility functions"`, `"add temp file for debug"`). Nếu trực tiếp đẩy các commit này lên môi trường cộng tác (Pull Request / Main branch), lịch sử mã nguồn của dự án sẽ bị phân mảnh, rối rắm và khó kiểm soát (Code Review / Git Bisect).

Kỹ thuật **Interactive Rebase (`git rebase -i`)** là công cụ tái cấu trúc (refactor) lịch sử commit cục bộ mạnh mẽ nhất, cho phép gộp các commit nhỏ lẻ (**squash**), viết lại thông điệp commit chuẩn chỉnh (**reword**) và xóa sạch các commit rác (**drop**) trước khi chia sẻ mã nguồn với đội ngũ.

### 1.2. Mục tiêu kỹ thuật
- Làm chủ công cụ **Interactive Rebase** của Git thông qua lệnh `git rebase -i HEAD~N` (hoặc `--root`).
- Hiểu và ứng dụng chính xác các lệnh hành động:
  - `pick`: Giữ nguyên commit.
  - `squash` (hoặc `s`): Gộp nội dung commit vào commit liền trước và cho phép viết lại thông điệp gộp chung.
  - `drop` (hoặc `d`): Xóa bỏ hoàn toàn commit và mọi thay đổi do commit đó tạo ra.
- Tái cấu trúc lịch sử từ 4 commit ban đầu thành 1 commit duy nhất mang thông điệp chuẩn: `feat: hoan thien module authentication`.
- Loại bỏ hoàn toàn tệp tin thử nghiệm `temp.txt` khỏi lịch sử và ổ đĩa.

### 1.3. Ràng buộc kỹ thuật
- Gộp chính xác 3 commit liên quan đến `auth.js` thành 1 commit duy nhất.
- Đổi tên thông điệp commit sau khi gộp thành: `feat: hoan thien module authentication`.
- Xóa bỏ triệt để commit chứa `temp.txt` bằng chỉ thị `drop`.
- Kết quả `git log --oneline` chỉ còn duy nhất 1 commit sạch sẽ.

---

## 2. Cơ sở lý thuyết & Bảng chỉ thị Interactive Rebase

### 2.1. Bảng chỉ thị tương tác trong Git Rebase

| Lệnh | Viết tắt | Ý nghĩa & Hành vi |
| :--- | :---: | :--- |
| **`pick`** | `p` | Giữ nguyên commit trong lịch sử. |
| **`reword`** | `r` | Giữ nguyên code thay đổi nhưng mở trình soạn thảo để sửa lại thông điệp commit. |
| **`edit`** | `e` | Dừng tiến trình rebase tại commit này để bổ sung/sửa đổi code hoặc tệp tin. |
| **`squash`** | `s` | **Gộp commit này vào commit đứng ngay phía trên**, đồng thời kết hợp các thông điệp commit lại để người dùng biên tập. |
| **`fixup`** | `f` | Giống `squash` nhưng tự động vứt bỏ thông điệp của commit này, chỉ giữ thông điệp của commit phía trước. |
| **`drop`** | `d` | **Xóa bỏ hoàn toàn commit này** khỏi lịch sử (tương đương với việc xóa dòng đó trong file cấu hình todo). |

### 2.2. Sơ đồ chuyển đổi trạng thái

```
[Trước khi Rebase: 4 commit rời rạc]
1033dd3 feat: khoi tao module auth       ──► (pick)
5684db0 fix typo                         ──► (squash) ──┐
de667d4 adds utility functions           ──► (squash) ──┼──► cf6b61e feat: hoan thien module authentication
0f956ea add temp file for debug          ──► (drop)   ──┘    (Lịch sử tinh gọn, sạch sẽ 100%)
```

---

## 3. Quy trình thực hiện chi tiết

### Bước 1: Khởi tạo Repository và tạo 4 commit ban đầu
```bash
# Khởi tạo repository
git init -b main
git config --local user.name "Pham Thanh Phong"
git config --local user.email "thanhphong102006@gmail.com"

# Commit 1: Tạo tệp auth.js
git add auth.js
git commit -m "feat: khoi tao module auth"

# Commit 2: Sửa chính tả trong auth.js
git add auth.js
git commit -m "fix typo"

# Commit 3: Bổ sung các hàm phụ trợ generateToken, validateToken
git add auth.js
git commit -m "adds utility functions"

# Commit 4: Tạo tệp rác thử nghiệm temp.txt
git add temp.txt
git commit -m "add temp file for debug"
```

Kiểm tra lịch sử trước khi Rebase:
```bash
git log --oneline
```
*Output ban đầu:*
```text
0f956ea add temp file for debug
de667d4 adds utility functions
5684db0 fix typo
1033dd3 feat: khoi tao module auth
```

---

### Bước 2: Kích hoạt Interactive Rebase
Mở trình điều khiển Interactive Rebase lùi về 4 commit:
```bash
git rebase -i HEAD~4
# (hoặc: git rebase -i --root nếu muốn rebase từ commit đầu tiên)
```

---

### Bước 3: Cấu hình kịch bản todo list trong trình soạn thảo
Giao diện tệp `git-rebase-todo` xuất hiện với danh sách commit theo thứ tự từ cũ nhất đến mới nhất (từ trên xuống dưới):

```text
pick 1033dd3 feat: khoi tao module auth
squash 5684db0 fix typo
squash de667d4 adds utility functions
drop 0f956ea add temp file for debug

# Rebase 0f956ea onto ...
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup <commit> = like "squash", but discard this commit's log message
# d, drop <commit> = remove commit
```

- Dòng 1 (`1033dd3`): Giữ nguyên `pick`.
- Dòng 2 (`5684db0`): Đổi thành `squash` để gộp vào commit 1.
- Dòng 3 (`de667d4`): Đổi thành `squash` để gộp tiếp vào commit 1.
- Dòng 4 (`0f956ea`): Đổi thành `drop` để xóa bỏ commit tạo `temp.txt`.

Lưu và đóng trình soạn thảo.

---

### Bước 4: Soạn thảo thông điệp commit gộp chung
Git mở trình soạn thảo thông điệp commit kết hợp. Xóa các dòng thông điệp cũ và nhập thông điệp chuẩn mực:
```text
feat: hoan thien module authentication
```
Lưu và đóng trình soạn thảo. Git sẽ áp dụng các thay đổi và thông báo:
`Successfully rebased and updated refs/heads/main.`

---

## 4. Nhật ký thực thi & Minh chứng nghiệm thu (Verification Logs)

### 4.1. Minh chứng lịch sử commit sau khi hoàn tất Rebase (`git log --oneline`)
```bash
git log --oneline
```
**Output thực tế:**
```text
cf6b61e feat: hoan thien module authentication
```
*(Toàn bộ 4 commit vụn vặt ban đầu đã được tái cấu trúc thành 1 commit duy nhất).*

---

### 4.2. Minh chứng chi tiết các thay đổi trong Commit gộp (`git log -1 --stat`)
```bash
git log -1 --stat
```
**Output thực tế:**
```text
commit cf6b61e45b25ef37d867836658f10d797e756faf
Author: Pham Thanh Phong <thanhphong102006@gmail.com>
Date:   Tue Oct 6 10:20:38 2026 +0700

    feat: hoan thien module authentication

 auth.js | 17 +++++++++++++++++
 1 file changed, 17 insertions(+)
```
*(Commit chứa toàn bộ mã nguồn hoàn chỉnh của `auth.js` với 17 dòng code).*

---

### 4.3. Minh chứng tệp rác `temp.txt` đã bị loại bỏ hoàn toàn
```powershell
Get-ChildItem
```
**Output thực tế:**
```text
Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        10/6/2026  10:22 AM            502 auth.js
```
*(Tệp tin `temp.txt` đã bị xóa hoàn toàn khỏi không gian làm việc và lịch sử Git).*

---

### 4.4. Minh chứng nội dung mã nguồn sạch của `auth.js`
```javascript
// Module Authentication - IT209 Session 05
// Sinh vien: Pham Thanh Phong - N24DTCN120

function login(username, password) {
    console.log("Xác thực người dùng: " + username);
    return Boolean(username && password);
}

function generateToken(userId) {
    return "jwt_token_" + userId + "_" + Date.now();
}

function validateToken(token) {
    return typeof token === "string" && token.startsWith("jwt_token_");
}

module.exports = { login, generateToken, validateToken };
```

---

## 5. Hướng dẫn nộp bài & Cấu trúc kho lưu trữ

- **Đường dẫn trên GitHub:** `homework/session_05/ex2/`
- **Tệp báo cáo:** `README.md` (hoặc `IT209_Session05_BT2_PhamThanhPhong_N24DTCN120.md`)
- **Cấu trúc nộp bài chuẩn:**
```text
homework/session_05/ex2/
├── .git/
├── auth.js
├── IT209_Session05_BT2_PhamThanhPhong_N24DTCN120.md
└── README.md
```

---

## 6. Tổng kết & Quy tắc vàng trong Git Rebase

1. **"Dọn dẹp trước khi chia sẻ":** Luôn sử dụng `git rebase -i` trên các nhánh feature cục bộ để làm sạch lịch sử commit trước khi tạo Pull Request / Merge Request.
2. **Quy tắc vàng (The Golden Rule of Rebase):** Tuyệt đối không thực hiện Rebase trên các nhánh công khai dùng chung (như `main`, `develop` đã push lên remote) để tránh viết lại lịch sử làm hỏng mã nguồn của các thành viên khác.
3. **Linh hoạt kết hợp các chỉ thị:** Thành thạo kết hợp `squash`, `fixup`, `reword` và `drop` giúp nâng cao tính chuyên nghiệp và tiêu chuẩn chất lượng của dự án phần mềm.
