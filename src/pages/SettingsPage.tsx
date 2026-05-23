import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ConfirmDialog } from '../components/ConfirmDialog';

export function SettingsPage() {
  const { tickets, practice, resetAll } = useAppStore();
  const [confirmClear, setConfirmClear] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const onClear = async () => {
    setConfirmClear(false);
    await resetAll();
    showToast('Данные удалены. Перезагрузка...');
    setTimeout(() => window.location.reload(), 600);
  };

  return (
    <>
      <div className="settings-group">
        <div className="settings-row">
          <div className="label">
            <div className="title">Билетов в базе</div>
            <div className="desc">Загружено в IndexedDB</div>
          </div>
          <div style={{ color: 'var(--primary)', fontWeight: 600 }}>{tickets.length}</div>
        </div>
        <div className="settings-row">
          <div className="label">
            <div className="title">Разделов практики</div>
            <div className="desc">Справочники и шпаргалки</div>
          </div>
          <div style={{ color: 'var(--primary)', fontWeight: 600 }}>{practice.length}</div>
        </div>
      </div>

      <div className="settings-group">
        <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
          <div className="label">
            <div className="title">Очистить данные приложения</div>
            <div className="desc">
              Удалит cache, IndexedDB, LocalStorage и скачанные материалы. Освободит память
              телефона после экзамена.
            </div>
          </div>
          <button className="btn btn-danger" onClick={() => setConfirmClear(true)}>
            Очистить данные
          </button>
        </div>
      </div>

      <div className="settings-group">
        <div className="settings-row">
          <div className="label">
            <div className="title">Офлайн-режим</div>
            <div className="desc">
              Приложение установлено как PWA и работает без интернета после первого запуска.
            </div>
          </div>
        </div>
      </div>

      {confirmClear && (
        <ConfirmDialog
          title="Удалить все данные?"
          message="Будут удалены билеты, кэш и Service Worker. Действие необратимо."
          confirmText="Удалить"
          danger
          onConfirm={onClear}
          onCancel={() => setConfirmClear(false)}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
