import { createRoot, type Root } from 'react-dom/client';
import { cn } from '@reef-ui/utils';
import { Icon, type IconName } from '../icon';
import { useLocale } from '../locale';
import type { NotificationArgs, NotificationItem, NotificationType } from './types';
import './notification.css';

/** 各类型对应的装饰性图标 */
const ICONS: Record<NotificationType, IconName> = {
  success: 'check',
  info: 'info',
  warning: 'warning',
  error: 'x-circle',
};

const DEFAULT_DURATION = 4500;
/** 退出动画时长，须与 notification.css 中 reef-notification-exit 的 duration 一致 */
const EXIT_DURATION = 200;

function NotificationList({
  items,
  onClose,
}: {
  items: NotificationItem[];
  onClose: (key: string) => void;
}) {
  const t = useLocale();
  if (items.length === 0) return null;
  return (
    <div role="status" className="reef-notification">
      {items.map((item) => (
        <div
          key={item.key}
          className={cn(
            'reef-notification__item',
            `reef-notification__item--${item.type}`,
            item.closing && 'reef-notification__item--closing',
          )}
        >
          <Icon name={ICONS[item.type]} size={16} className="reef-notification__icon" />
          <div className="reef-notification__body">
            <div className="reef-notification__title">{item.title}</div>
            {item.content != null && (
              <div className="reef-notification__content">{item.content}</div>
            )}
          </div>
          <button
            type="button"
            className="reef-notification__close"
            // ponytail: 复用 Message 的 close 文案，待 locale 包加入 Notification 段后再切换
            aria-label={t.Message.close}
            onClick={() => onClose(item.key)}
          >
            <Icon name="close" size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}

// —— 命令式单例：createRoot 挂到 body 下的空容器，列表变化时整体重渲染 ——
let container: HTMLDivElement | null = null;
let root: Root | null = null;
let items: NotificationItem[] = [];
let seed = 0;
const timers = new Map<string, ReturnType<typeof setTimeout>>();

function render() {
  if (!root || !container) {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  }
  root.render(<NotificationList items={items} onClose={close} />);
}

function open(args: NotificationArgs, type?: NotificationType): string {
  const item: NotificationItem = {
    key: `reef-notification-${++seed}`,
    type: type ?? args.type ?? 'info',
    title: args.title,
    content: args.content,
    duration: args.duration ?? DEFAULT_DURATION,
  };
  items = [...items, item];
  render();
  if (item.duration > 0) {
    timers.set(
      item.key,
      setTimeout(() => close(item.key), item.duration),
    );
  }
  return item.key;
}

/** 关闭单条：先播放退出动画，动画结束后真正移除 */
function close(key: string) {
  const item = items.find((i) => i.key === key);
  if (!item || item.closing) return;
  clearTimeout(timers.get(key));
  timers.delete(key);
  items = items.map((i) => (i.key === key ? { ...i, closing: true } : i));
  render();
  timers.set(
    key,
    setTimeout(() => remove(key), EXIT_DURATION),
  );
}

function remove(key: string) {
  clearTimeout(timers.get(key));
  timers.delete(key);
  items = items.filter((i) => i.key !== key);
  if (items.length === 0) {
    destroy();
    return;
  }
  render();
}

/** 清空全部通知并卸载挂载容器（供测试或路由切换时复位） */
function destroy() {
  timers.forEach((timer) => clearTimeout(timer));
  timers.clear();
  items = [];
  if (root) {
    root.unmount();
    root = null;
  }
  container?.remove();
  container = null;
}

export const Notification = {
  open: (args: NotificationArgs) => open(args),
  success: (args: NotificationArgs) => open(args, 'success'),
  info: (args: NotificationArgs) => open(args, 'info'),
  warning: (args: NotificationArgs) => open(args, 'warning'),
  error: (args: NotificationArgs) => open(args, 'error'),
  close,
  destroy,
};
