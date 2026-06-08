==========================================
   DELTA FORCE AUTO REDEEM TOOL
   Phiên bản: 1.0 | by Delta Force Tools
==========================================

GIỚI THIỆU
-----------
Tool tự động nhập hàng loạt Giftcode Delta Force (Garena) vào trang:
https://redeem.df.garena.sg/vi/cdkgarena.html

Tool hỗ trợ:
  - Tự động phát hiện trình duyệt (Edge hoặc Chrome)
  - Tự động bỏ qua code trùng lặp
  - Hiển thị kết quả từng mã (thành công / đã nhận / lỗi)
  - Hiển thị tổng thời gian hoàn thành

==========================================
YÊU CẦU HỆ THỐNG
==========================================

  [+] Windows 10 / 11 (64-bit)
  [+] Microsoft Edge HOẶC Google Chrome (cài sẵn trên máy)
  [+] Node.js (nếu chưa có, tool sẽ tự tải về ~30MB)
  [+] Kết nối Internet (lần đầu chạy)

==========================================
CÁCH SỬ DỤNG
==========================================

BƯỚC 1: Dán code vào file codes.txt
--------------------------------------
  - Mở file "codes.txt" bằng Notepad
  - Xóa các code mẫu có sẵn
  - Dán toàn bộ Giftcode vào, mỗi code 1 dòng
  - Lưu file lại (Ctrl+S)

  Ví dụ codes.txt:
    DFOSS260405B69
    DFReliable732
    DFUT2025FINALS1549
    ...

  Lưu ý:
    - Các dòng bắt đầu bằng // sẽ bị bỏ qua (dùng để ghi chú)
    - Code trùng lặp sẽ tự động bị lọc bỏ, không cần lo

BƯỚC 2: Chạy tool
--------------------------------------
  - Double-click vào file "AutoRedeem.bat"
  - Lần đầu chạy: tool sẽ tự động cài thư viện (~1-2 phút, chỉ 1 lần duy nhất)
  - Trình duyệt Edge hoặc Chrome sẽ tự động mở

BƯỚC 3: Đăng nhập Garena
--------------------------------------
  - Trang đổi quà sẽ mở ra trong trình duyệt
  - Đăng nhập tài khoản Garena của bạn như bình thường
  - Sau khi đăng nhập xong, quay lại cửa sổ dòng lệnh (CMD)

BƯỚC 4: Bắt đầu nhập code tự động
--------------------------------------
  - Nhấn Enter trong cửa sổ CMD để bắt đầu
  - Tool sẽ tự động nhập từng code và hiển thị kết quả:
      [THÀNH CÔNG]  - Code đổi thành công
      [BỎ QUA]      - Code đã được nhận trước đó
      [THÔNG BÁO]   - Kết quả khác từ server
  - Đợi đến khi hiện "HOÀN THÀNH!" và tổng thời gian

BƯỚC 5: Đóng tool
--------------------------------------
  - Nhấn Enter lần nữa để đóng trình duyệt
  - Tool tự động kết thúc

==========================================
CẤU TRÚC THƯ MỤC
==========================================

  delta-force-tools/
  ├── AutoRedeem.bat    <- FILE CHẠY CHÍNH (double-click vào đây)
  ├── redeem.js         <- Script tự động (không cần chỉnh)
  ├── codes.txt         <- DANH SÁCH CODE (bạn tự điền vào đây)
  ├── package.json      <- Cấu hình thư viện (không cần chỉnh)
  └── README.txt        <- Hướng dẫn này

==========================================
LƯU Ý QUAN TRỌNG
==========================================

  [!] Không đóng cửa sổ CMD trong lúc tool đang chạy
  [!] Không click vào trình duyệt trong lúc tool đang nhập code
  [!] Mỗi code chỉ dùng được 1 lần trên 1 tài khoản
  [!] Nếu trang web thay đổi giao diện, tool có thể cần cập nhật
  [!] Tool chỉ hỗ trợ server Garena (garena.sg)

==========================================
XỬ LÝ LỖI THƯỜNG GẶP
==========================================

  Lỗi: "Không tìm thấy Node.js"
    -> Tool sẽ tự tải về, chờ khoảng 1-2 phút
    -> Hoặc cài thủ công tại: https://nodejs.org

  Lỗi: "Không tìm thấy trình duyệt nào"
    -> Cài Microsoft Edge hoặc Google Chrome

  Lỗi: "npm install thất bại"
    -> Kiểm tra kết nối Internet
    -> Thử chạy lại AutoRedeem.bat

  Tool mở ra rồi tắt ngay lập tức:
    -> Đảm bảo double-click đúng file AutoRedeem.bat
    -> Thử nhấp chuột phải > "Run as administrator"

==========================================
