import UnavailableFeature from '@/components/UnavailableFeature';

export default function ForgotPasswordPage() {
  return (
    <UnavailableFeature
      title="Khôi phục mật khẩu"
      description="Chức năng khôi phục mật khẩu chưa được triển khai. Vui lòng liên hệ quản trị viên để được hỗ trợ tài khoản."
      returnPath="/auth/login"
      returnLabel="Về trang đăng nhập"
    />
  );
}
