import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { BalanceReport, ReconciliationDetailRow, canCicEdit } from './types';

interface ReportReviewActions {
  saveReportChanges: (
    reportKey: string,
    details: ReconciliationDetailRow[],
    editedFields?: Record<string, string[]>
  ) => void;
  startReview: (reportKey: string) => void;
  reopenReview: (reportKey: string) => void;
  acceptReport: (
    reportKey: string,
    details: ReconciliationDetailRow[],
    editedFields?: Record<string, string[]>
  ) => void;
  requestRevision: (reportKey: string, reason: string) => void;
}

interface UseReportReviewArgs {
  report: BalanceReport | null;
  initialDetails: ReconciliationDetailRow[];
  actions: ReportReviewActions;
}

// Hook cấp component dùng chung cho Modal trong list và trang [id].
// Quản lý bản nháp số liệu đang sửa, theo dõi ô nào đã đổi so với
// gốc, và bọc các thao tác lưu/tiếp nhận/từ chối.
export const useReportReview = ({ report, initialDetails, actions }: UseReportReviewArgs) => {
  const [editDetails, setEditDetails] = useState<ReconciliationDetailRow[]>(initialDetails);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const originalDetailsRef = useRef<Record<string, ReconciliationDetailRow>>({});
  // rowKey → set field đã sửa
  const [editedFields, setEditedFields] = useState<Record<string, string[]>>({});

  const reportKey = report?.key;

  // Seed lại khi đổi báo cáo
  useEffect(() => {
    setEditDetails(initialDetails);
    const orig: Record<string, ReconciliationDetailRow> = {};
    initialDetails.forEach(row => { orig[row.key] = { ...row }; });
    originalDetailsRef.current = orig;
    setEditedFields({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportKey]);

  // CIC chỉ sửa được số liệu khi báo cáo đang chờ kiểm tra (DA_GUI_CIC).
  // DANG_KIEM_TRA và DA_TIEP_NHAN đều khóa chỉnh sửa.
  const isReadOnly = report ? !canCicEdit(report.trangThai) : true;

  const editedCount = useMemo(
    () => Object.values(editedFields).reduce((acc, fields) => acc + fields.length, 0),
    [editedFields]
  );

  const handleCellChange = useCallback((
    rowKey: string,
    field: keyof ReconciliationDetailRow,
    value: any
  ) => {
    setEditDetails(prev => prev.map(row =>
      row.key === rowKey ? { ...row, [field]: value } : row
    ));

    // Cập nhật danh sách field đã sửa (so với giá trị gốc)
    setEditedFields(prev => {
      const original = originalDetailsRef.current[rowKey];
      const originalVal = original ? (original[field] ?? null) : null;
      const changed = (value ?? null) !== originalVal;
      const current = prev[rowKey] ?? [];
      const has = current.includes(field as string);

      if (changed && !has) {
        return { ...prev, [rowKey]: [...current, field as string] };
      }
      if (!changed && has) {
        const next = current.filter(f => f !== (field as string));
        const copy = { ...prev };
        if (next.length) copy[rowKey] = next; else delete copy[rowKey];
        return copy;
      }
      return prev;
    });
  }, []);

  const handleSave = useCallback((onDone?: () => void) => {
    if (!reportKey) return;
    setIsSubmitting(true);
    setTimeout(() => {
      actions.saveReportChanges(reportKey, editDetails, editedFields);
      setIsSubmitting(false);
      onDone?.();
    }, 400);
  }, [reportKey, editDetails, editedFields, actions]);

  const handleAccept = useCallback((onDone?: () => void) => {
    if (!reportKey) return;
    setIsSubmitting(true);
    setTimeout(() => {
      actions.acceptReport(reportKey, editDetails, editedFields);
      setIsSubmitting(false);
      onDone?.();
    }, 600);
  }, [reportKey, editDetails, editedFields, actions]);

  const handleRequestRevision = useCallback((reason: string, onDone?: () => void) => {
    if (!reportKey) return;
    setIsSubmitting(true);
    setTimeout(() => {
      actions.requestRevision(reportKey, reason);
      setIsSubmitting(false);
      onDone?.();
    }, 600);
  }, [reportKey, actions]);

  const handleStartReview = useCallback((onDone?: () => void) => {
    if (!reportKey) return;
    setIsSubmitting(true);
    setTimeout(() => {
      actions.startReview(reportKey);
      setIsSubmitting(false);
      onDone?.();
    }, 400);
  }, [reportKey, actions]);

  const handleReopenReview = useCallback((onDone?: () => void) => {
    if (!reportKey) return;
    setIsSubmitting(true);
    setTimeout(() => {
      actions.reopenReview(reportKey);
      setIsSubmitting(false);
      onDone?.();
    }, 400);
  }, [reportKey, actions]);

  return {
    editDetails,
    editedFields,
    editedCount,
    isReadOnly,
    isSubmitting,
    handleCellChange,
    handleSave,
    handleStartReview,
    handleReopenReview,
    handleAccept,
    handleRequestRevision,
  };
};
