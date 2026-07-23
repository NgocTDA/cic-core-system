// ─── Việt hóa cho react-js-cron + tiện ích mô tả lịch ────────

import type { Locale } from 'react-js-cron';
import cronstrue from 'cronstrue/i18n';

// Nhãn tiếng Việt cho bộ chọn cron (react-js-cron)
export const viCronLocale: Locale = {
  everyText: 'Mỗi',
  emptyMonths: 'mỗi tháng',
  emptyMonthDays: 'mỗi ngày trong tháng',
  emptyMonthDaysShort: 'ngày trong tháng',
  emptyWeekDays: 'mỗi thứ trong tuần',
  emptyWeekDaysShort: 'thứ trong tuần',
  emptyHours: 'mỗi giờ',
  emptyMinutes: 'mỗi phút',
  emptyMinutesForHourPeriod: 'mỗi',
  yearOption: 'năm',
  monthOption: 'tháng',
  weekOption: 'tuần',
  dayOption: 'ngày',
  hourOption: 'giờ',
  minuteOption: 'phút',
  rebootOption: 'khởi động lại',
  prefixPeriod: '',
  prefixMonths: 'vào',
  prefixMonthDays: 'vào',
  prefixWeekDays: 'vào',
  prefixWeekDaysForMonthAndYearPeriod: 'và vào',
  prefixHours: 'lúc',
  prefixMinutes: ':',
  prefixMinutesForHourPeriod: 'lúc phút',
  suffixMinutesForHourPeriod: '',
  errorInvalidCron: 'Biểu thức lịch không hợp lệ',
  clearButtonText: 'Xóa',
  weekDays: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'],
  months: [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
  ],
  altWeekDays: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  altMonths: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
};

// Danh sách múi giờ (tái dùng từ ScheduleConfigTab cũ, có mở rộng)
export const TIMEZONE_OPTIONS = [
  { value: 'Asia/Ho_Chi_Minh', label: 'Hà Nội (ICT UTC+7)' },
  { value: 'Asia/Bangkok', label: 'Bangkok (ICT UTC+7)' },
  { value: 'Asia/Singapore', label: 'Singapore (UTC+8)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (UTC+9)' },
  { value: 'UTC', label: 'UTC' },
];

export const DEFAULT_TIMEZONE = 'Asia/Ho_Chi_Minh';
export const DEFAULT_CRON = '0 2 * * *';

/**
 * Sinh mô tả người-đọc-được từ biểu thức cron.
 * Ưu tiên tiếng Việt (cronstrue locale 'vi'), fallback tiếng Anh nếu lỗi.
 */
/** Kiểm tra biểu thức cron có hợp lệ (không rỗng + parse được). */
export function isValidCron(cron?: string): boolean {
  if (!cron || !cron.trim()) return false;
  try {
    cronstrue.toString(cron, { throwExceptionOnParseError: true });
    return true;
  } catch {
    return false;
  }
}

export function humanizeCron(cron?: string): string {
  if (!cron || !cron.trim()) return '—';
  try {
    return cronstrue.toString(cron, { locale: 'vi', use24HourTimeFormat: true });
  } catch {
    try {
      return cronstrue.toString(cron, { use24HourTimeFormat: true });
    } catch {
      return cron;
    }
  }
}
