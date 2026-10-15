// 1. Danh sách các máy (Dữ liệu gốc)
const machines = [
  {
    code: "M-101",
    name: "Băng tải cấp liệu",
    line: "L01",
    status: "ok",
    open: 0,
    time: "15:40",
    note: "Hoạt động ổn định, chưa ghi nhận bất thường.",
  },
  {
    code: "M-103",
    name: "Máy dán nhãn",
    line: "L01",
    status: "warn",
    open: 1,
    time: "15:39",
    note: "Cảm biến nhãn đọc chậm, đang theo dõi thêm.",
  },
  {
    code: "M-202",
    name: "Máy ép số 1",
    line: "L02",
    status: "err",
    open: 1,
    time: "15:48",
    note: "Lỗi kẹt cơ khí trục khuỷu, đang chờ thợ kỹ thuật xử lý.",
  },
  {
    code: "M-203",
    name: "Máy ép số 2",
    line: "L02",
    status: "warn",
    open: 1,
    time: "15:44",
    note: "Nhiệt độ khuôn cao hơn ngưỡng, cần kiểm tra hệ thống làm mát.",
  },
  {
    code: "M-301",
    name: "Camera kiểm tra",
    line: "L03",
    status: "ok",
    open: 0,
    time: "15:37",
    note: "Hoạt động ổn định, chưa ghi nhận bất thường.",
  },
];

// Từ điển dịch trạng thái sang tiếng Việt
const label = {
  ok: "Bình thường",
  warn: "Cảnh báo",
  err: "Sự cố",
};

// 2. Hàm vẽ (render) danh sách máy lên bảng
function renderTable() {
  // Lấy ô tìm kiếm và ô chọn dây chuyền
  var searchBox = document.getElementById("search");
  var lineFilter = document.getElementById("lineFilter");
  var tableBody = document.getElementById("machineBody");
  var emptyMsg = document.getElementById("empty");

  var keyword = searchBox.value.toLowerCase();
  var selectedLine = lineFilter.value;

  // Xóa bảng cũ đi trước khi vẽ lại
  tableBody.innerHTML = "";

  var count = 0;

  // Lặp qua từng máy trong danh sách
  for (var i = 0; i < machines.length; i++) {
    var m = machines[i];

    // Kiểm tra xem máy có khớp với từ khóa tìm kiếm không
    var textMatch = (m.code + m.name).toLowerCase().includes(keyword);

    // Kiểm tra xem máy có khớp với dây chuyền được chọn không
    var lineMatch = selectedLine === "" || m.line === selectedLine;

    // Nếu khớp cả hai điều kiện thì mới hiển thị
    if (textMatch && lineMatch) {
      count++;

      // Tạo dòng HTML mới cho máy đó
      var htmlRow = `
        <tr>
          <td>${m.code}</td>
          <td>${m.name}</td>
          <td>${m.line}</td>
          <td><span class="status ${m.status}">${label[m.status]}</span></td>
          <td>${m.open}</td>
          <td>${m.time}</td>
          <td><a href="#" class="view-btn" data-code="${m.code}">Xem →</a></td>
        </tr>
      `;

      // Nhét dòng vừa tạo vào bảng
      tableBody.innerHTML += htmlRow;
    }
  }

  // Nếu không tìm thấy máy nào thì hiện thông báo "Không tìm thấy", ngược lại thì ẩn đi
  if (count === 0) {
    emptyMsg.hidden = false;
  } else {
    emptyMsg.hidden = true;
  }
}

// 3. Lắng nghe hành động gõ phím tìm kiếm hoặc bấm chọn dây chuyền
document.getElementById("search").addEventListener("input", renderTable);
document.getElementById("lineFilter").addEventListener("change", renderTable);

// 4. Xử lý sự kiện bấm vào nút "Xem" để mở bảng chi tiết (Modal)
document
  .getElementById("machineBody")
  .addEventListener("click", function (event) {
    // Kiểm tra xem người dùng có bấm vào chữ "Xem →" hay không
    if (event.target.classList.contains("view-btn")) {
      event.preventDefault(); // Chặn việc nhảy trang mặc định của thẻ <a>

      var code = event.target.getAttribute("data-code");
      var foundMachine = null;

      // Đi tìm máy ứng với mã code vừa bấm
      for (var i = 0; i < machines.length; i++) {
        if (machines[i].code === code) {
          foundMachine = machines[i];
          break;
        }
      }

      // Nếu tìm thấy thì điền thông tin vào bảng chi tiết
      if (foundMachine) {
        document.getElementById("mName").textContent = foundMachine.name;
        document.getElementById("mCode").textContent = foundMachine.code;
        document.getElementById("mLine").textContent = foundMachine.line;
        document.getElementById("mOpen").textContent = foundMachine.open;
        document.getElementById("mTime").textContent = foundMachine.time;
        document.getElementById("mNote").textContent = foundMachine.note;

        var statusSpan = document.getElementById("mStatus");
        statusSpan.textContent = label[foundMachine.status];
        statusSpan.className = "status " + foundMachine.status;

        // Mở bảng modal lên
        document.getElementById("modal").showModal();
      }
    }
  });

// 5. Xử lý nút đóng bảng chi tiết (dấu X)
document.getElementById("modalX").addEventListener("click", function () {
  document.getElementById("modal").close();
});

// Bấm ra ngoài vùng modal thì cũng đóng lại
document.getElementById("modal").addEventListener("click", function (event) {
  if (event.target === document.getElementById("modal")) {
    document.getElementById("modal").close();
  }
});

// Chạy hàm vẽ bảng lần đầu tiên khi vừa mở trang web
renderTable();
