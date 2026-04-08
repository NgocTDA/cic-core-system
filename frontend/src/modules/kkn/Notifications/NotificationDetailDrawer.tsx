import React from 'react';
import { Drawer } from 'antd';
import type { INotification } from './../../../types/notification';
import NotificationDetail from './../../../components/NotificationDetail';
import { useIsMobile } from './../../../hooks/useIsMobile';

interface Props {
  visible: boolean;
  notification: INotification | null;
  onClose: () => void;
  onSubmitFeedback: (id: string, content: string) => void;
  onToggleRead: (id: string, isRead: boolean) => void;
}

const NotificationDetailDrawer: React.FC<Props> = ({ visible, notification, onClose, onSubmitFeedback, onToggleRead }) => {
  const isMobile = useIsMobile();

  return (
    <Drawer
      placement="right"
      width={isMobile ? '100%' : 800}
      onClose={onClose}
      open={visible}
      styles={{ body: { padding: 0 } }}
      closable={true}
    >
      <NotificationDetail
        selectedItem={notification}
        onToggleRead={onToggleRead}
        onSubmitFeedback={onSubmitFeedback}
      />
    </Drawer>
  );
};

export default NotificationDetailDrawer;

