/**
 * Converts a Cron expression string into a human-readable Vietnamese description.
 */
export const getCronDescription = (cron: string): string => {
  if (!cron || !cron.trim()) return 'Chưa thiết lập biểu thức Cron';

  const expr = cron.trim();
  const parts = expr.split(/\s+/);

  if (parts.length < 5) return 'Biểu thức Cron không đúng định dạng';

  // Well-known Cron patterns
  if (expr === '0 0 1 * * *') return 'Chạy hằng ngày vào lúc 01:00:00 AM';
  if (expr === '0 0 0 * * *') return 'Chạy hằng ngày vào lúc 00:00:00 AM (Nửa đêm)';
  if (expr === '0 0 12 * * *') return 'Chạy hằng ngày vào lúc 12:00:00 PM (Buổi trưa)';
  if (expr === '0 0 8 * * *') return 'Chạy hằng ngày vào lúc 08:00:00 AM (Đầu giờ sáng)';
  if (expr === '0 0 18 * * *') return 'Chạy hằng ngày vào lúc 18:00:00 PM (Cuối ngày)';
  if (expr === '0 */15 * * * *' || expr === '*/15 * * * *') return 'Chạy định kỳ mỗi 15 phút một lần';
  if (expr === '0 */30 * * * *' || expr === '*/30 * * * *') return 'Chạy định kỳ mỗi 30 phút một lần';
  if (expr === '0 0 */1 * * *' || expr === '0 0 * * * *') return 'Chạy định kỳ mỗi 1 giờ một lần';
  if (expr === '0 0 8 * * 1-5' || expr === '0 0 8 * * MON-FRI') return 'Chạy lúc 08:00 AM từ Thứ 2 đến Thứ 6';
  if (expr === '0 0 12 1 * *') return 'Chạy vào lúc 12:00 PM ngày 1 hàng tháng';
  if (expr === '0 0 2 1 1 *') return 'Chạy vào lúc 02:00 AM ngày 1 tháng 1 hàng năm';

  // Dynamic heuristic parsing
  const sec = parts.length === 6 ? parts[0] : '0';
  const min = parts.length === 6 ? parts[1] : parts[0];
  const hour = parts.length === 6 ? parts[2] : parts[1];
  const dayM = parts.length === 6 ? parts[3] : parts[2];
  const month = parts.length === 6 ? parts[4] : parts[3];
  const dayW = parts.length === 6 ? parts[5] : parts[4];

  if (min.includes('*/')) {
    const step = min.replace('*/', '');
    return `Chạy định kỳ mỗi ${step} phút`;
  }
  if (hour.includes('*/')) {
    const step = hour.replace('*/', '');
    return `Chạy định kỳ mỗi ${step} giờ`;
  }

  const formatUnit = (val: string) => (val === '*' ? '00' : val.padStart(2, '0'));
  const formattedTime = `${formatUnit(hour)}:${formatUnit(min)}:${formatUnit(sec)}`;

  if (dayM !== '*' && month !== '*') {
    return `Chạy vào lúc ${formattedTime} ngày ${dayM} tháng ${month}`;
  }
  if (dayM !== '*') {
    return `Chạy vào lúc ${formattedTime} ngày ${dayM} hàng tháng`;
  }
  if (dayW !== '*' && dayW !== '?') {
    return `Chạy vào lúc ${formattedTime} các ngày ${dayW} trong tuần`;
  }

  return `Chạy hằng ngày vào lúc ${formattedTime}`;
};
