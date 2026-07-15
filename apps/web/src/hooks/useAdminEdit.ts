// apps/web/src/hooks/useAdminEdit.ts
// Hook để quản lý trạng thái chỉnh sửa nội dung in-place của admin.
'use client';

import { useState, useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { fetchApi } from '../lib/api';

interface UseAdminEditOptions<T> {
  settingKey: string;
  initialValue: T;
}

interface UseAdminEditReturn<T> {
  value: T;
  isContentEditor: boolean;
  isEditing: boolean;
  isSaving: boolean;
  openEditor: () => void;
  closeEditor: () => void;
  save: (newValue: T) => Promise<void>;
  saveError: string | null;
}

/**
 * Hook dùng chung cho tất cả các block có thể admin chỉnh sửa in-place.
 *
 * @param settingKey  - key trong bảng site_settings
 * @param initialValue - giá trị ban đầu (từ API fetch lúc load trang)
 */
export function useAdminEdit<T>({
  settingKey,
  initialValue,
}: UseAdminEditOptions<T>): UseAdminEditReturn<T> {
  const { isContentEditor } = useAuthStore();
  const [value, setValue] = useState<T>(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const openEditor = useCallback(() => {
    if (!isContentEditor) return;
    setIsEditing(true);
    setSaveError(null);
  }, [isContentEditor]);

  const closeEditor = useCallback(() => {
    setIsEditing(false);
    setSaveError(null);
  }, []);

  const save = useCallback(
    async (newValue: T) => {
      if (!isContentEditor) return;
      setIsSaving(true);
      setSaveError(null);
      try {
        await fetchApi(`/api/admin/settings/${settingKey}`, {
          method: 'PATCH',
          requireAuth: true,
          body: JSON.stringify({ value: newValue }),
        });
        setValue(newValue);
        setIsEditing(false);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Lỗi khi lưu. Vui lòng thử lại.';
        setSaveError(message);
      } finally {
        setIsSaving(false);
      }
    },
    [isContentEditor, settingKey],
  );

  return { value, isContentEditor, isEditing, isSaving, openEditor, closeEditor, save, saveError };
}
