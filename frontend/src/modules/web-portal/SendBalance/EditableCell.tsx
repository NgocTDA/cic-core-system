import React, { useState, useEffect } from 'react';
import { Input, Select, Tooltip } from 'antd';
import { colors } from '@/design-system';
import { ReconciliationDetailRow } from './types';

interface EditableCellProps {
  value: any;
  onChange: (val: any) => void;
  type?: 'text' | 'select';
  selectOptions?: { value: string; label: string }[];
  style?: React.CSSProperties;
  record: ReconciliationDetailRow;
  ruleCode?: string | null;
  renderDisplay?: (val: any) => React.ReactNode;
}

export const EditableCell: React.FC<EditableCellProps> = ({
  value,
  onChange,
  type = 'text',
  selectOptions = [],
  style = {},
  record,
  ruleCode = null,
  renderDisplay
}) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleSave = () => {
    setEditing(false);
    onChange(tempValue);
  };

  const isEditable = record.trangThai === 'TAO_MOI';

  if (!editing) {
    return (
      <div
        style={{
          cursor: isEditable ? 'pointer' : 'default',
          minHeight: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: style.textAlign === 'right' ? 'flex-end' : style.textAlign === 'center' ? 'center' : 'flex-start',
          width: '100%',
          padding: '2px 4px',
          borderRadius: '4px',
          transition: 'background-color 0.2s',
          ...style
        }}
        onClick={() => {
          if (isEditable) setEditing(true);
        }}
        className={isEditable ? "editable-cell-hover" : ""}
      >
        {renderDisplay ? renderDisplay(value) : (
          ruleCode ? (
            <Tooltip title={ruleCode} placement="top" arrow>
              <span style={{
                cursor: 'help',
                borderBottom: '1px dashed #fa8c16',
                color: colors.text.primary,
                fontWeight: 500,
                paddingBottom: 2
              }}>
                {value || <span style={{ color: '#bfbfbf' }}>-</span>}
              </span>
            </Tooltip>
          ) : (
            value || <span style={{ color: '#bfbfbf' }}>-</span>
          )
        )}
      </div>
    );
  }

  if (type === 'select') {
    return (
      <Select
        value={tempValue}
        onChange={(val) => {
          setTempValue(val);
          onChange(val);
          setEditing(false);
        }}
        onBlur={() => setEditing(false)}
        autoFocus
        open
        style={{ width: '100%' }}
        size="small"
      >
        {selectOptions.map(opt => (
          <Select.Option key={opt.value} value={opt.value}>
            {opt.label}
          </Select.Option>
        ))}
      </Select>
    );
  }

  return (
    <Input
      value={tempValue || ''}
      onChange={(e) => setTempValue(e.target.value)}
      onBlur={handleSave}
      onPressEnter={handleSave}
      autoFocus
      size="small"
      style={{ width: '100%', ...style }}
    />
  );
};
