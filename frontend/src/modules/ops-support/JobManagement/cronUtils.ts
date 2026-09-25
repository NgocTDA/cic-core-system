/**
 * Converts a 6-part Cron expression string (SEC MIN HOUR DAY MONTH WEEKDAY)
 * into a human-readable Vietnamese description using 24-hour format (no AM/PM).
 * Compliance: G-01, G-02, BR-HTVH-027-014.
 */
export const getCronDescription = (cron: string): string => {
  if (!cron || !cron.trim()) return 'Chưa thiết lập biểu thức Cron';

  const expr = cron.trim();
  const parts = expr.split(/\s+/);

  if (parts.length < 6) {
    // Graceful handling for legacy/invalid expressions while enforcing 6-part rule
    if (parts.length === 5) {
      return 'Biểu thức Cron phải có đúng 6 trường (Giây Phút Giờ Ngày Tháng Thứ)';
    }
    return 'Biểu thức Cron không đúng định dạng (cần 6 trường)';
  }

  // Well-known 6-part Cron patterns (SEC MIN HOUR DAY MONTH WEEKDAY)
  if (expr === '0 0 1 * * ?' || expr === '0 0 1 ? * *') return 'Chạy hằng ngày vào lúc 01:00:00';
  if (expr === '0 0 2 * * ?' || expr === '0 0 2 ? * *') return 'Chạy hằng ngày vào lúc 02:00:00';
  if (expr === '0 0 0 * * ?' || expr === '0 0 0 ? * *') return 'Chạy hằng ngày vào lúc 00:00:00';
  if (expr === '0 0 12 * * ?' || expr === '0 0 12 ? * *') return 'Chạy hằng ngày vào lúc 12:00:00';
  if (expr === '0 0 8 * * ?' || expr === '0 0 8 ? * *') return 'Chạy hằng ngày vào lúc 08:00:00';
  if (expr === '0 0 18 * * ?' || expr === '0 0 18 ? * *') return 'Chạy hằng ngày vào lúc 18:00:00';
  if (expr === '0 */15 * * * ?' || expr === '0 */15 * ? * *') return 'Chạy định kỳ mỗi 15 phút một lần';
  if (expr === '0 */30 * * * ?' || expr === '0 */30 * ? * *') return 'Chạy định kỳ mỗi 30 phút một lần';
  if (expr === '0 0 */1 * * ?' || expr === '0 0 */1 ? * *') return 'Chạy định kỳ mỗi 1 giờ một lần';
  if (expr === '0 0 */4 * * ?' || expr === '0 0 */4 ? * *') return 'Chạy định kỳ mỗi 4 giờ một lần';
  if (expr === '0 0 8 ? * MON-FRI' || expr === '0 0 8 * * 1-5') return 'Chạy vào lúc 08:00:00 từ Thứ 2 đến Thứ 6';
  if (expr === '0 0 17 ? * MON-FRI') return 'Chạy vào lúc 17:00:00 từ Thứ 2 đến Thứ 6';
  if (expr === '0 0 12 1 * ?' || expr === '0 0 12 1 * *') return 'Chạy vào lúc 12:00:00 ngày 1 hàng tháng';
  if (expr === '0 0 2 1 1 ?') return 'Chạy vào lúc 02:00:00 ngày 1 tháng 1 hàng năm';

  // Dynamic 6-part heuristic parsing: [sec, min, hour, dayM, month, dayW]
  const [sec, min, hour, dayM, month, dayW] = parts;

  if (min.includes('*/')) {
    const step = min.replace('*/', '');
    return `Chạy định kỳ mỗi ${step} phút`;
  }
  if (hour.includes('*/')) {
    const step = hour.replace('*/', '');
    return `Chạy định kỳ mỗi ${step} giờ`;
  }

  const formatUnit = (val: string) => (val === '*' || val === '?' ? '00' : val.padStart(2, '0'));
  const formattedTime = `${formatUnit(hour)}:${formatUnit(min)}:${formatUnit(sec)}`;

  if (dayM !== '*' && dayM !== '?' && month !== '*' && month !== '?') {
    return `Chạy vào lúc ${formattedTime} ngày ${dayM} tháng ${month}`;
  }
  if (dayM !== '*' && dayM !== '?') {
    return `Chạy vào lúc ${formattedTime} ngày ${dayM} hàng tháng`;
  }
  if (dayW !== '*' && dayW !== '?') {
    const weekdayMap: Record<string, string> = {
      'MON': 'Thứ 2',
      'TUE': 'Thứ 3',
      'WED': 'Thứ 4',
      'THU': 'Thứ 5',
      'FRI': 'Thứ 6',
      'SAT': 'Thứ 7',
      'SUN': 'Chủ nhật',
      'MON-FRI': 'Thứ 2 đến Thứ 6',
      '1': 'Chủ nhật',
      '2': 'Thứ 2',
      '3': 'Thứ 3',
      '4': 'Thứ 4',
      '5': 'Thứ 5',
      '6': 'Thứ 6',
      '7': 'Thứ 7',
      '1-5': 'Thứ 2 đến Thứ 6',
    };
    const dayLabel = weekdayMap[dayW.toUpperCase()] || dayW;
    return `Chạy vào lúc ${formattedTime} các ngày ${dayLabel} trong tuần`;
  }

  return `Chạy hằng ngày vào lúc ${formattedTime}`;
};
