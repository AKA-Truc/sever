document.addEventListener("DOMContentLoaded", function() {
    const uploadBtn = document.querySelector(".upload-btn");
    const fileUpload = document.querySelector(".file-upload");
    const avatar = document.querySelector(".profile-picture-inner img");

    const themKhachHangBtn = document.querySelector(".save");
    const cancelBtn = document.querySelector(".cancel");

    uploadBtn.addEventListener("click", function() {
        fileUpload.click();
    });

    fileUpload.addEventListener("change", function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function() {
                avatar.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    });

    themKhachHangBtn.addEventListener("click", function() {
        const hoVaTen = document.querySelector('input[name="họ và tên "]').value;
        const sdt = document.querySelector('input[name="SĐT"]').value;
        const tinhThanh = document.querySelector('input[name="tỉnh/thành phố"]').value;
        const quanHuyen = document.querySelector('input[name="Quận/Huyện"]').value;
        const phuongXa = document.querySelector('input[name="Phường/Xã"]').value;
        const diaChi = document.querySelector('input[name="Địa chỉ cụ thể"]').value;
        const chucvu = document.querySelector('input[name="Cập nhật chức vụ"]').value;
        
        if (!hoVaTen || !sdt || !tinhThanh || !quanHuyen || !phuongXa || !diaChi || !chucvu) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        const NhanVien= {
          hoVaTen,
          sdt,
          tinhThanh,
          quanHuyen,
          phuongXa,
          diaChi,
          chucvu,
        };
    
        localStorage.setItem('NhanVien', JSON.stringify(NhanVien));
        alert("Thêm Nhân Viên thành công");
        window.location.href = 'danhsach.html';
      });
      
    cancelBtn.addEventListener("click", function() {
        if (confirm("Bạn có chắc muốn hủy không?")) {
            // Xóa giá trị đã nhập trong các input
            const inputs = document.querySelectorAll(".field input");
            inputs.forEach(input => {
                input.value = "";
            });

            // Đặt lại ảnh mặc định cho khung hình
            avatar.src = "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg";

            // Xóa tệp đã chọn từ input file-upload
            fileUpload.value = "";
        }
    });
});
