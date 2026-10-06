# IT209 - Session 05 - Bài tập 2: Tái cấu trúc Lịch sử Commit bằng Interactive Rebase

- **Sinh viên:** Phạm Thanh Phong
- **MSSV:** N24DTCN120
- **Lớp / Học phần:** IT209 - Phát triển ứng dụng Web / Cloud Infrastructure
- **Đường dẫn nộp bài:** `homework/session_05/ex2/`

---

## Tóm tắt nội dung thực hiện

1. **Khởi tạo 4 commit thử nghiệm:**
   - Commit 1: `feat: khoi tao module auth`
   - Commit 2: `fix typo`
   - Commit 3: `adds utility functions`
   - Commit 4: `add temp file for debug` (tệp `temp.txt`)
2. **Kích hoạt Interactive Rebase:**
   - Lệnh: `git rebase -i HEAD~4`
3. **Cấu hình chỉ thị tương tác trong todo list:**
   - Dòng 1: `pick 1033dd3 feat: khoi tao module auth`
   - Dòng 2: `squash 5684db0 fix typo`
   - Dòng 3: `squash de667d4 adds utility functions`
   - Dòng 4: `drop 0f956ea add temp file for debug`
4. **Cập nhật thông điệp gộp chung:**
   - Đổi thành: `feat: hoan thien module authentication`
5. **Kiểm tra và nghiệm thu:**
   - Lệnh `git log --oneline` hiển thị duy nhất 1 commit sạch sẽ `cf6b61e feat: hoan thien module authentication`.
   - Tệp rác `temp.txt` bị xóa bỏ hoàn toàn.

---

> 📄 **Xem báo cáo chi tiết đầy đủ:** [IT209_Session05_BT2_PhamThanhPhong_N24DTCN120.md](./IT209_Session05_BT2_PhamThanhPhong_N24DTCN120.md)
