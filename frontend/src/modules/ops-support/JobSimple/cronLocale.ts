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

// ─── Mô tả lịch chạy thân thiện tiếng Việt ───────────────────
// VD: "Chạy hàng ngày vào lúc 02:00 sáng"
//     "Chạy hàng tháng vào ngày 5, 10, 15, 20, 25 lúc 03:00 sáng và 15:00 chiều"

/**
 * Mở rộng một trường cron thành danh sách số đã sắp xếp (unique).
 * Hỗ trợ: '*', số đơn, danh sách (a,b,c), khoảng (a-b), bước (a-b/s, *​/s, a/s).
 * Trả 'any' nếu là '*', hoặc null nếu không phân tích được.
 */
function expandField(field: string, min: number, max: number): number[] | 'any' | null {
  if (field === '*') return 'any';
  const out = new Set<number>();
  for (const token of field.split(',')) {
    let m: RegExpMatchArray | null;
    if (token === '*') {
      for (let i = min; i <= max; i++) out.add(i);
    } else if ((m = token.match(/^(\d+)-(\d+)(?:\/(\d+))?$/))) {
      const from = +m[1];
      const to = +m[2];
      const step = m[3] ? +m[3] : 1;
      if (from > to || step < 1) return null;
      for (let i = from; i <= to; i += step) out.add(i);
    } else if ((m = token.match(/^\*\/(\d+)$/))) {
      const step = +m[1];
      if (step < 1) return null;
      for (let i = min; i <= max; i += step) out.add(i);
    } else if ((m = token.match(/^(\d+)\/(\d+)$/))) {
      const from = +m[1];
      const step = +m[2];
      if (step < 1) return null;
      for (let i = from; i <= max; i += step) out.add(i);
    } else if (/^\d+$/.test(token)) {
      out.add(+token);
    } else {
      return null;
    }
  }
  const arr = [...out].filter((v) => v >= min && v <= max).sort((a, b) => a - b);
  return arr.length ? arr : null;
}

/** Định dạng giờ:phút kèm buổi trong ngày (sáng/chiều/tối). */
function formatTime(hour: number, minute: number): string {
  const hh = String(hour).padStart(2, '0');
  const mm = String(minute).padStart(2, '0');
  const period = hour < 12 ? 'sáng' : hour < 18 ? 'chiều' : 'tối';
  return `${hh}:${mm} ${period}`;
}

/** Nối danh sách kiểu tiếng Việt: "a, b và c". */
function joinVi(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} và ${items[items.length - 1]}`;
}

/** "10, 11, 15, 18, 20" — gom các dãy liên tiếp (≥3 số) thành "a–b" cho gọn. */
function formatNumberList(values: number[]): string {
  const parts: string[] = [];
  let i = 0;
  while (i < values.length) {
    let j = i;
    while (j + 1 < values.length && values[j + 1] === values[j] + 1) j++;
    if (j - i >= 2) {
      parts.push(`${values[i]}–${values[j]}`);
    } else {
      for (let k = i; k <= j; k++) parts.push(String(values[k]));
    }
    i = j + 1;
  }
  return parts.join(', ');
}

/** Mô tả phần thời gian trong ngày. `freq=true` nghĩa là cụm tần suất (mỗi X phút/giờ). */
function describeTime(minF: string, hourF: string): { text: string; freq: boolean } | null {
  const minStep = minF.match(/^\*\/(\d+)$/);
  if (minStep && hourF === '*') return { text: `mỗi ${+minStep[1]} phút`, freq: true };

  const mins = expandField(minF, 0, 59);
  const hours = expandField(hourF, 0, 23);
  if (mins === null || hours === null || mins === 'any' || mins.length !== 1) return null;
  const minute = mins[0];

  if (hours === 'any') {
    return { text: minute === 0 ? 'mỗi giờ' : `vào phút thứ ${minute} mỗi giờ`, freq: true };
  }
  if (/^\*\/(\d+)$/.test(hourF)) {
    const step = +hourF.split('/')[1];
    return { text: `mỗi ${step} giờ`, freq: true };
  }
  if (hours.length > 12) return null;
  return { text: `lúc ${joinVi(hours.map((h) => formatTime(h, minute)))}`, freq: false };
}

/**
 * Sinh mô tả lịch chạy thân thiện, dễ hiểu cho người dùng cuối.
 * VD: "Chạy hàng ngày vào lúc 02:00 sáng"
 *     "Chạy hàng tháng vào ngày 5, 10, 15, 20, 25 lúc 03:00 sáng và 15:00 chiều"
 *     "Chạy vào ngày 10, 11, 15, 18, 20 hàng tháng hoặc vào Chủ nhật, Thứ hai và Thứ tư, lúc 02:00 sáng"
 * Mẫu quá phức tạp sẽ fallback về {@link humanizeCron}.
 */
export function describeCron(cron?: string): string {
  if (!cron || !cron.trim()) return '—';
  const fields = cron.trim().split(/\s+/);
  if (fields.length !== 5) return humanizeCron(cron);
  const [minF, hourF, domF, monF, dowF] = fields;

  const time = describeTime(minF, hourF);
  if (!time) return humanizeCron(cron);

  const domVals = expandField(domF, 1, 31);
  const dowVals = expandField(dowF, 0, 7);
  const monVals = expandField(monF, 1, 12);
  if (domVals === null || dowVals === null || monVals === null) return humanizeCron(cron);

  const hasDom = domVals !== 'any';
  const hasDow = dowVals !== 'any';

  const domText = hasDom ? formatNumberList(domVals as number[]) : '';
  let dowText = '';
  if (hasDow) {
    const names = [...new Set((dowVals as number[]).map((d) => (d === 7 ? 0 : d)))]
      .sort((a, b) => a - b)
      .map((d) => viCronLocale.weekDays?.[d] ?? `thứ ${d}`);
    dowText = joinVi(names);
  }

  // Cụm ngày (chưa gồm thời gian). Khi cả ngày-trong-tháng và thứ đều được chọn,
  // cron chạy khi TRÙNG một trong hai → dùng "hoặc".
  let dayClause: string;
  if (!hasDom && !hasDow) dayClause = 'hàng ngày';
  else if (hasDom && !hasDow) dayClause = `hàng tháng vào ngày ${domText}`;
  else if (!hasDom && hasDow) dayClause = `hàng tuần vào ${dowText}`;
  else dayClause = `vào ngày ${domText} hàng tháng hoặc vào ${dowText}`;

  // Ghép ngày + thời gian, tránh lặp từ "vào".
  let text: string;
  if (time.freq) {
    text = !hasDom && !hasDow ? `Chạy ${time.text}` : `Chạy ${time.text} ${dayClause}`;
  } else if (!hasDom && !hasDow) {
    text = `Chạy hàng ngày vào ${time.text}`;
  } else if (hasDom && hasDow) {
    text = `Chạy ${dayClause}, ${time.text}`;
  } else {
    text = `Chạy ${dayClause} ${time.text}`;
  }

  if (monVals !== 'any') {
    text += `, chỉ trong ${joinVi((monVals as number[]).map((m) => `Tháng ${m}`))}`;
  }
  return text;
}
