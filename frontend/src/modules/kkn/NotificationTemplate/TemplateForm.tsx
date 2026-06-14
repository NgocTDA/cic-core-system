import React from 'react';
import type { INotificationTemplate } from './TemplateTypes';

interface TemplateFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: Partial<INotificationTemplate>) => void;
  editingTemplate: INotificationTemplate | null;
}

const TemplateForm: React.FC<TemplateFormProps> = () => null;

export default TemplateForm;
