# React Components for UI Flow
# Implementation Examples

## 📁 Project Structure

```
frontend/src/
├── components/
│   ├── records/
│   │   ├── RecordCard.tsx          # Main record display
│   │   ├── RecordActions.tsx       # Action buttons
│   │   ├── RecordStatus.tsx        # Status badge
│   │   ├── RecordProgress.tsx      # Approval progress
│   │   └── RecordModal.tsx         # Detail modal
│   ├── common/
│   │   ├── PermissionGuard.tsx     # Permission wrapper
│   │   ├── StateGuard.tsx          # State-based rendering
│   │   └── ActionButton.tsx        # Reusable action button
│   └── hooks/
│       ├── usePermissions.ts       # Permission hook
│       ├── useRecordState.ts       # State management hook
│       └── useWorkflow.ts          # Workflow logic hook
```

---

## 🔧 Core Hooks

### `usePermissions.ts`
```typescript
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export type UserRole = 'VIEN_CHUC' | 'TRUONG_DON_VI' | 'CHI_BO' | 'DANG_UY' | 'TCHC' | 'BGH';
export type HoSoState = 'DRAFT' | 'CHO_DUYET' | 'DANG_XU_LY' | 'DA_DUYET' | 'TU_CHOI' | 'HOAN_TAT';
export type Action = 'EDIT' | 'VIEW' | 'APPROVE' | 'REJECT' | 'SEND' | 'WITHDRAW' | 'CREATE_DECISION' | 'REPORT';

const PERMISSION_MATRIX: Record<UserRole, Record<HoSoState, Action[]>> = {
  VIEN_CHUC: {
    DRAFT: ['EDIT', 'VIEW', 'SEND'],
    CHO_DUYET: ['VIEW', 'WITHDRAW'],
    DANG_XU_LY: ['VIEW'],
    DA_DUYET: ['VIEW'],
    TU_CHOI: ['VIEW', 'EDIT', 'SEND'],
    HOAN_TAT: ['VIEW', 'REPORT']
  },
  TRUONG_DON_VI: {
    DRAFT: ['VIEW'],
    CHO_DUYET: ['VIEW', 'APPROVE', 'REJECT'],
    DANG_XU_LY: ['VIEW', 'APPROVE', 'REJECT'],
    DA_DUYET: ['VIEW'],
    TU_CHOI: ['VIEW'],
    HOAN_TAT: ['VIEW']
  },
  // ... other roles
};

export const usePermissions = () => {
  const { user } = useContext(AuthContext);

  const checkPermission = (action: Action, state: HoSoState, recordOwnerId?: string): boolean => {
    if (!user?.role) return false;

    const allowedActions = PERMISSION_MATRIX[user.role][state] || [];

    // Special case: VIEN_CHUC can only edit their own drafts
    if (action === 'EDIT' && state === 'DRAFT' && user.role === 'VIEN_CHUC') {
      return recordOwnerId === user.id;
    }

    return allowedActions.includes(action);
  };

  const getAvailableActions = (state: HoSoState, recordOwnerId?: string): Action[] => {
    if (!user?.role) return [];

    const allActions: Action[] = ['EDIT', 'VIEW', 'APPROVE', 'REJECT', 'SEND', 'WITHDRAW', 'CREATE_DECISION', 'REPORT'];
    return allActions.filter(action => checkPermission(action, state, recordOwnerId));
  };

  return { checkPermission, getAvailableActions, userRole: user?.role };
};
```

### `useRecordState.ts`
```typescript
import { useState, useEffect } from 'react';
import { HoSoState } from './usePermissions';

interface RecordState {
  id: string;
  state: HoSoState;
  ownerId: string;
  approvals: Approval[];
  decision?: Decision;
  report?: Report;
}

export const useRecordState = (recordId: string) => {
  const [record, setRecord] = useState<RecordState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecord();
  }, [recordId]);

  const fetchRecord = async () => {
    try {
      const response = await fetch(`/api/records/${recordId}`);
      const data = await response.json();
      setRecord(data);
    } catch (error) {
      console.error('Failed to fetch record:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateState = async (newState: HoSoState, actionData?: any) => {
    try {
      const response = await fetch(`/api/records/${recordId}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE_STATE', newState, ...actionData })
      });

      if (response.ok) {
        await fetchRecord(); // Refresh data
        return true;
      }
    } catch (error) {
      console.error('Failed to update state:', error);
    }
    return false;
  };

  return { record, loading, updateState };
};
```

---

## 🧩 Core Components

### `PermissionGuard.tsx`
```tsx
import React from 'react';
import { usePermissions, Action, HoSoState } from '../hooks/usePermissions';

interface PermissionGuardProps {
  action: Action;
  state: HoSoState;
  recordOwnerId?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  action,
  state,
  recordOwnerId,
  fallback = null,
  children
}) => {
  const { checkPermission } = usePermissions();

  const hasPermission = checkPermission(action, state, recordOwnerId);

  return hasPermission ? <>{children}</> : <>{fallback}</>;
};
```

### `StateGuard.tsx`
```tsx
import React from 'react';
import { HoSoState } from '../hooks/usePermissions';

interface StateGuardProps {
  currentState: HoSoState;
  allowedStates: HoSoState[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const StateGuard: React.FC<StateGuardProps> = ({
  currentState,
  allowedStates,
  fallback = null,
  children
}) => {
  const isAllowed = allowedStates.includes(currentState);

  return isAllowed ? <>{children}</> : <>{fallback}</>;
};
```

### `ActionButton.tsx`
```tsx
import React from 'react';
import { Button, ButtonProps } from 'antd';
import { usePermissions, Action, HoSoState } from '../hooks/usePermissions';

interface ActionButtonProps extends Omit<ButtonProps, 'onClick'> {
  action: Action;
  state: HoSoState;
  recordOwnerId?: string;
  onClick: (action: Action) => void;
  children: React.ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  action,
  state,
  recordOwnerId,
  onClick,
  children,
  ...buttonProps
}) => {
  const { checkPermission } = usePermissions();

  const hasPermission = checkPermission(action, state, recordOwnerId);

  const handleClick = () => {
    if (hasPermission) {
      onClick(action);
    }
  };

  return (
    <Button
      {...buttonProps}
      disabled={!hasPermission}
      onClick={handleClick}
      style={{
        opacity: hasPermission ? 1 : 0.5,
        cursor: hasPermission ? 'pointer' : 'not-allowed',
        ...buttonProps.style
      }}
    >
      {children}
    </Button>
  );
};
```

### `RecordStatus.tsx`
```tsx
import React from 'react';
import { Badge, Tag } from 'antd';
import { HoSoState } from '../hooks/usePermissions';

interface RecordStatusProps {
  state: HoSoState;
  size?: 'small' | 'default';
}

const STATUS_CONFIG = {
  DRAFT: { color: '#FFA500', text: 'Nháp', icon: '📝' },
  CHO_DUYET: { color: '#FF8C00', text: 'Chờ duyệt', icon: '⏳' },
  DANG_XU_LY: { color: '#007BFF', text: 'Đang xử lý', icon: '🔄' },
  DA_DUYET: { color: '#28A745', text: 'Đã duyệt', icon: '✅' },
  TU_CHOI: { color: '#DC3545', text: 'Từ chối', icon: '❌' },
  HOAN_TAT: { color: '#6F42C1', text: 'Hoàn tất', icon: '🎉' }
};

export const RecordStatus: React.FC<RecordStatusProps> = ({ state, size = 'default' }) => {
  const config = STATUS_CONFIG[state];

  if (size === 'small') {
    return (
      <Tag color={config.color}>
        {config.icon} {config.text}
      </Tag>
    );
  }

  return (
    <Badge
      color={config.color}
      text={`${config.icon} ${config.text}`}
      style={{ fontSize: '14px', fontWeight: 'bold' }}
    />
  );
};
```

---

## 📋 Main Components

### `RecordActions.tsx`
```tsx
import React from 'react';
import { Space, Button, Modal, Form, Input, message } from 'antd';
import { usePermissions, Action, HoSoState } from '../hooks/usePermissions';
import { ActionButton } from './ActionButton';
import { PermissionGuard } from './PermissionGuard';

interface RecordActionsProps {
  recordId: string;
  state: HoSoState;
  ownerId: string;
  onAction: (action: Action, data?: any) => Promise<void>;
}

export const RecordActions: React.FC<RecordActionsProps> = ({
  recordId,
  state,
  ownerId,
  onAction
}) => {
  const { getAvailableActions } = usePermissions();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [currentAction, setCurrentAction] = React.useState<Action | null>(null);
  const [form] = Form.useForm();

  const availableActions = getAvailableActions(state, ownerId);

  const handleAction = async (action: Action) => {
    setCurrentAction(action);

    // Actions that need confirmation
    if (['APPROVE', 'REJECT', 'SEND', 'WITHDRAW'].includes(action)) {
      setModalVisible(true);
      return;
    }

    // Direct actions
    try {
      await onAction(action);
      message.success('Thao tác thành công!');
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await onAction(currentAction!, values);
      setModalVisible(false);
      form.resetFields();
      message.success('Thao tác thành công!');
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    }
  };

  const getActionLabel = (action: Action): string => {
    const labels = {
      EDIT: 'Chỉnh sửa',
      VIEW: 'Xem',
      APPROVE: 'Phê duyệt',
      REJECT: 'Từ chối',
      SEND: 'Gửi phê duyệt',
      WITHDRAW: 'Thu hồi',
      CREATE_DECISION: 'Tạo quyết định',
      REPORT: 'Nộp báo cáo'
    };
    return labels[action] || action;
  };

  const getActionIcon = (action: Action): string => {
    const icons = {
      EDIT: '📝',
      VIEW: '👁️',
      APPROVE: '✅',
      REJECT: '❌',
      SEND: '📤',
      WITHDRAW: '↩️',
      CREATE_DECISION: '📋',
      REPORT: '📊'
    };
    return icons[action] || '🔧';
  };

  return (
    <>
      <Space wrap>
        {availableActions.map(action => (
          <PermissionGuard
            key={action}
            action={action}
            state={state}
            recordOwnerId={ownerId}
          >
            <ActionButton
              action={action}
              state={state}
              recordOwnerId={ownerId}
              onClick={handleAction}
              type={action === 'REJECT' ? 'danger' : action === 'APPROVE' ? 'primary' : 'default'}
            >
              {getActionIcon(action)} {getActionLabel(action)}
            </ActionButton>
          </PermissionGuard>
        ))}
      </Space>

      <Modal
        title={`${getActionIcon(currentAction!)} ${getActionLabel(currentAction!)}`}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          {(currentAction === 'APPROVE' || currentAction === 'REJECT') && (
            <Form.Item
              name="comment"
              label="Ý kiến"
              rules={[{ required: true, message: 'Vui lòng nhập ý kiến!' }]}
            >
              <Input.TextArea
                placeholder="Nhập ý kiến của bạn..."
                rows={4}
              />
            </Form.Item>
          )}
          {currentAction === 'SEND' && (
            <Form.Item name="note" label="Ghi chú">
              <Input.TextArea
                placeholder="Ghi chú thêm (tùy chọn)..."
                rows={3}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
};
```

### `RecordProgress.tsx`
```tsx
import React from 'react';
import { Steps, Card, Avatar, Tooltip } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

interface ApprovalStep {
  id: string;
  level: number;
  name: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected' | 'waiting';
  approvedAt?: string;
  approvedBy?: string;
  comment?: string;
}

interface RecordProgressProps {
  steps: ApprovalStep[];
  currentState: string;
}

export const RecordProgress: React.FC<RecordProgressProps> = ({ steps, currentState }) => {
  const getStepStatus = (step: ApprovalStep): 'wait' | 'process' | 'finish' | 'error' => {
    switch (step.status) {
      case 'approved': return 'finish';
      case 'rejected': return 'error';
      case 'pending': return 'process';
      default: return 'wait';
    }
  };

  const getStepIcon = (step: ApprovalStep) => {
    switch (step.status) {
      case 'approved': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'rejected': return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'pending': return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
      default: return <ClockCircleOutlined style={{ color: '#d9d9d9' }} />;
    }
  };

  const getStepDescription = (step: ApprovalStep) => {
    if (step.status === 'approved' && step.approvedBy) {
      return (
        <div>
          <div>{step.approvedBy}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{step.approvedAt}</div>
          {step.comment && (
            <div style={{ fontSize: '12px', marginTop: '4px' }}>
              💬 {step.comment}
            </div>
          )}
        </div>
      );
    }
    return step.role;
  };

  return (
    <Card title="Tiến độ phê duyệt" size="small">
      <Steps
        direction="vertical"
        size="small"
        current={steps.findIndex(step => step.status === 'pending')}
      >
        {steps.map(step => (
          <Steps.Step
            key={step.id}
            title={step.name}
            description={getStepDescription(step)}
            status={getStepStatus(step)}
            icon={getStepIcon(step)}
          />
        ))}
      </Steps>
    </Card>
  );
};
```

---

## 🎯 Usage Example

### `RecordCard.tsx`
```tsx
import React from 'react';
import { Card, Descriptions, Space, Tag } from 'antd';
import { useRecordState } from '../hooks/useRecordState';
import { RecordStatus } from './RecordStatus';
import { RecordActions } from './RecordActions';
import { RecordProgress } from './RecordProgress';
import { PermissionGuard } from './PermissionGuard';

interface RecordCardProps {
  recordId: string;
}

export const RecordCard: React.FC<RecordCardProps> = ({ recordId }) => {
  const { record, loading, updateState } = useRecordState(recordId);

  if (loading || !record) {
    return <Card loading />;
  }

  const handleAction = async (action: string, data?: any) => {
    // Call API to perform action
    await updateState(action, data);
  };

  return (
    <Card
      title={`Hồ sơ: ${record.maHoSo}`}
      extra={<RecordStatus state={record.state} />}
      actions={[
        <RecordActions
          key="actions"
          recordId={recordId}
          state={record.state}
          ownerId={record.ownerId}
          onAction={handleAction}
        />
      ]}
    >
      <Descriptions column={2} bordered>
        <Descriptions.Item label="Người đề nghị">{record.hoTen}</Descriptions.Item>
        <Descriptions.Item label="Đơn vị">{record.tenDonVi}</Descriptions.Item>
        <Descriptions.Item label="Mục đích">{record.mucDich}</Descriptions.Item>
        <Descriptions.Item label="Quốc gia">{record.quocGia}</Descriptions.Item>
        <Descriptions.Item label="Từ ngày">{record.tuNgay}</Descriptions.Item>
        <Descriptions.Item label="Đến ngày">{record.denNgay}</Descriptions.Item>
        <Descriptions.Item label="Kinh phí">{record.kinhPhi?.toLocaleString()} VND</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <RecordStatus state={record.state} size="small" />
        </Descriptions.Item>
      </Descriptions>

      <PermissionGuard
        action="VIEW"
        state={record.state}
        recordOwnerId={record.ownerId}
      >
        <div style={{ marginTop: '16px' }}>
          <RecordProgress
            steps={record.approvalSteps || []}
            currentState={record.state}
          />
        </div>
      </PermissionGuard>
    </Card>
  );
};
```

---

## 🔄 State Management Integration

### Redux Slice Example:
```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RecordState {
  records: Record[];
  currentRecord: Record | null;
  loading: boolean;
  error: string | null;
}

const initialState: RecordState = {
  records: [],
  currentRecord: null,
  loading: false,
  error: null
};

const recordSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {
    fetchRecordsStart: (state) => {
      state.loading = true;
    },
    fetchRecordsSuccess: (state, action: PayloadAction<Record[]>) => {
      state.records = action.payload;
      state.loading = false;
    },
    updateRecordState: (state, action: PayloadAction<{ id: string; newState: HoSoState }>) => {
      const record = state.records.find(r => r.id === action.payload.id);
      if (record) {
        record.state = action.payload.newState;
      }
      if (state.currentRecord?.id === action.payload.id) {
        state.currentRecord.state = action.payload.newState;
      }
    }
  }
});

export const { fetchRecordsStart, fetchRecordsSuccess, updateRecordState } = recordSlice.actions;
export default recordSlice.reducer;
```

---

## 🧪 Testing Examples

### Component Test:
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { RecordActions } from './RecordActions';

describe('RecordActions', () => {
  it('shows correct actions for VIEN_CHUC in DRAFT state', () => {
    render(
      <RecordActions
        recordId="123"
        state="DRAFT"
        ownerId="user123"
        onAction={jest.fn()}
      />
    );

    expect(screen.getByText('📝 Chỉnh sửa')).toBeEnabled();
    expect(screen.getByText('📤 Gửi phê duyệt')).toBeEnabled();
    expect(screen.queryByText('✅ Phê duyệt')).not.toBeInTheDocument();
  });

  it('disables actions without permission', () => {
    render(
      <RecordActions
        recordId="123"
        state="DRAFT"
        ownerId="different-user"
        onAction={jest.fn()}
      />
    );

    const editButton = screen.getByText('📝 Chỉnh sửa');
    expect(editButton).toBeDisabled();
  });
});
```

---

*Components được thiết kế để dễ dàng maintain và extend, với clear separation of concerns và comprehensive permission checking.*