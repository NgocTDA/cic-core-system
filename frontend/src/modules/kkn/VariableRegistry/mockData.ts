import type { IVariable } from './VariableTypes';

export const mockVariables: IVariable[] = [
  {
    id: '1',
    code: 'customer_name',
    displayName: 'Tên khách hàng',
    group: 'Thông tin chung',
    type: 'STRING',
    sampleValue: 'Nguyễn Văn A',
    description: 'Họ và tên đầy đủ của khách hàng nhận tin',
    status: 'ACTIVE',
    isInUse: true
  },
  {
    id: '2',
    code: 'otp_code',
    displayName: 'Mã xác thực OTP',
    group: 'Bảo mật',
    type: 'NUMBER',
    sampleValue: '654321',
    description: 'Mã số xác thực giao dịch gồm 6 chữ số',
    status: 'ACTIVE',
    isInUse: true
  },
  {
    id: '3',
    code: 'transaction_amount',
    displayName: 'Số tiền giao dịch',
    group: 'Giao dịch',
    type: 'CURRENCY',
    sampleValue: '5.000.000 VND',
    description: 'Số tiền phát sinh trong giao dịch tài chính',
    status: 'ACTIVE',
    isInUse: true
  },
  {
    id: '4',
    code: 'account_number',
    displayName: 'Số tài khoản',
    group: 'Tài khoản',
    type: 'STRING',
    sampleValue: '0011XXXX9876',
    description: 'Số tài khoản thanh toán đã được che một phần',
    status: 'ACTIVE',
    isInUse: false
  },
  {
    id: '5',
    code: 'datetime_log',
    displayName: 'Thời điểm phát sinh',
    group: 'Hệ thống',
    type: 'DATETIME',
    sampleValue: '10:30:25 04/04/2026',
    description: 'Thời gian chính xác xảy ra sự kiện',
    status: 'ACTIVE',
    isInUse: false
  },
  {
    id: '6',
    code: 'card_type',
    displayName: 'Loại thẻ',
    group: 'Thẻ',
    type: 'STRING',
    sampleValue: 'Visa Platinum',
    description: 'Tên hạng thẻ của khách hàng',
    status: 'ACTIVE',
    isInUse: false
  },
  {
    id: '7',
    code: 'branch_name',
    displayName: 'Tên chi nhánh',
    group: 'Hệ thống',
    type: 'STRING',
    sampleValue: 'Chi nhánh Hà Nội',
    description: 'Nơi khách hàng mở tài khoản hoặc thực hiện giao dịch',
    status: 'INACTIVE',
    isInUse: false
  },
  {
    id: '8',
    code: 'last_digits',
    displayName: '4 số cuối thẻ',
    group: 'Thẻ',
    type: 'NUMBER',
    sampleValue: '1234',
    description: 'Bốn chữ số cuối ghi trên thẻ của khách hàng',
    status: 'ACTIVE',
    isInUse: false
  },
  {
    id: '9',
    code: 'balance_current',
    displayName: 'Số dư hiện tại',
    group: 'Tài khoản',
    type: 'CURRENCY',
    sampleValue: '1.200.000 VND',
    description: 'Số dư khả dụng tại thời điểm gửi tin',
    status: 'ACTIVE',
    isInUse: false
  },
  {
    id: '10',
    code: 'merchant_name',
    displayName: 'Tên đơn vị chấp nhận thẻ',
    group: 'Giao dịch',
    type: 'STRING',
    sampleValue: 'GrabFood',
    description: 'Nơi thực hiện giao dịch thanh toán',
    status: 'ACTIVE',
    isInUse: false
  },
  {
    id: '11',
    code: 'limit_remaining',
    displayName: 'Hạn mức còn lại',
    group: 'Tài khoản',
    type: 'CURRENCY',
    sampleValue: '15.000.000 VND',
    description: 'Hạn mức tín dụng chưa sử dụng',
    status: 'ACTIVE',
    isInUse: false
  },
  {
    id: '12',
    code: 'payment_duedate',
    displayName: 'Ngày đến hạn thanh toán',
    group: 'Thẻ',
    type: 'DATETIME',
    sampleValue: '25/04/2026',
    description: 'Hạn chót để khách hàng thanh toán nợ tín dụng',
    status: 'ACTIVE',
    isInUse: false
  }
];

