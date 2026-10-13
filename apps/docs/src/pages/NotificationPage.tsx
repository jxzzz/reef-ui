import { Button, Notification } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo, TypeBlock } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode: Record<Lang, string> = {
  zh: `<Button onClick={() => Notification.success({ title: '已保存', content: '数据已写入' })}>
  成功
</Button>
<Button onClick={() => Notification.info({ title: '提示', content: '这是一条普通提示' })}>
  提示
</Button>
<Button onClick={() => Notification.warning({ title: '注意', content: '余额即将耗尽' })}>
  警告
</Button>
<Button onClick={() => Notification.error({ title: '出错了', content: '保存失败，请重试' })}>
  错误
</Button>`,
  en: `<Button onClick={() => Notification.success({ title: 'Saved', content: 'Data written' })}>
  Success
</Button>
<Button onClick={() => Notification.info({ title: 'Info', content: 'This is a plain notice' })}>
  Info
</Button>
<Button onClick={() => Notification.warning({ title: 'Warning', content: 'Balance is running low' })}>
  Warning
</Button>
<Button onClick={() => Notification.error({ title: 'Error', content: 'Save failed, please retry' })}>
  Error
</Button>`,
};

const durationCode: Record<Lang, string> = {
  zh: `<Button onClick={() => Notification.open({ title: '1 秒后消失', duration: 1000 })}>
  1 秒延时
</Button>
<Button onClick={() => Notification.open({ title: '常驻通知', content: 'duration 为 0 时不自动关闭', duration: 0 })}>
  不自动关闭
</Button>`,
  en: `<Button onClick={() => Notification.open({ title: 'Gone in 1s', duration: 1000 })}>
  1s duration
</Button>
<Button
  onClick={() =>
    Notification.open({ title: 'Sticky', content: 'duration 0 never auto-dismisses', duration: 0 })
  }
>
  Never auto-dismiss
</Button>`,
};

export function NotificationPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  return (
    <>
      <ComponentHeader group="反馈" title={zh ? 'Notification 通知提醒' : 'Notification'}>
        {zh
          ? '页面右上角的轻量通知。命令式调用 Notification.success / info / warning / error / open，多条堆叠，到时自动关闭。'
          : 'Lightweight notices stacked at the top-right. Call Notification.success / info / warning / error / open imperatively; multiple notices stack and auto-dismiss.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {zh ? (
            <>
              <Button
                onClick={() => Notification.success({ title: '已保存', content: '数据已写入' })}
              >
                成功
              </Button>
              <Button
                onClick={() => Notification.info({ title: '提示', content: '这是一条普通提示' })}
              >
                提示
              </Button>
              <Button
                onClick={() => Notification.warning({ title: '注意', content: '余额即将耗尽' })}
              >
                警告
              </Button>
              <Button
                onClick={() => Notification.error({ title: '出错了', content: '保存失败，请重试' })}
              >
                错误
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => Notification.success({ title: 'Saved', content: 'Data written' })}
              >
                Success
              </Button>
              <Button
                onClick={() =>
                  Notification.info({ title: 'Info', content: 'This is a plain notice' })
                }
              >
                Info
              </Button>
              <Button
                onClick={() =>
                  Notification.warning({ title: 'Warning', content: 'Balance is running low' })
                }
              >
                Warning
              </Button>
              <Button
                onClick={() =>
                  Notification.error({ title: 'Error', content: 'Save failed, please retry' })
                }
              >
                Error
              </Button>
            </>
          )}
        </div>
      </Demo>

      <Demo
        title={zh ? '延时与常驻' : 'Duration and sticky'}
        code={zh ? durationCode.zh : durationCode.en}
      >
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {zh ? (
            <>
              <Button onClick={() => Notification.open({ title: '1 秒后消失', duration: 1000 })}>
                1 秒延时
              </Button>
              <Button
                onClick={() =>
                  Notification.open({
                    title: '常驻通知',
                    content: 'duration 为 0 时不自动关闭',
                    duration: 0,
                  })
                }
              >
                不自动关闭
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => Notification.open({ title: 'Gone in 1s', duration: 1000 })}>
                1s duration
              </Button>
              <Button
                onClick={() =>
                  Notification.open({
                    title: 'Sticky',
                    content: 'duration 0 never auto-dismisses',
                    duration: 0,
                  })
                }
              >
                Never auto-dismiss
              </Button>
            </>
          )}
        </div>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          [
            'Notification.success / info / warning / error',
            zh
              ? '命令式打开对应类型的通知，返回该条 key'
              : 'Open a notice of that type imperatively, returns its key',
            '(args: NotificationArgs) => string',
            '—',
          ],
          [
            'Notification.open',
            zh
              ? '打开通知，type 可省略（默认 info）'
              : 'Open a notice, type optional (defaults to info)',
            '(args: NotificationArgs) => string',
            '—',
          ],
          ['args.title', zh ? '标题' : 'Title', 'ReactNode', zh ? '必填' : 'Required'],
          ['args.content', zh ? '可选正文内容' : 'Optional body content', 'ReactNode', '—'],
          [
            'args.type',
            zh ? '通知类型' : 'Notice type',
            "'success' | 'info' | 'warning' | 'error'",
            "'info'",
          ],
          [
            'args.duration',
            zh ? '自动关闭延时（毫秒），0 不自动关闭' : 'Auto-dismiss delay in ms, 0 means sticky',
            'number',
            '4500',
          ],
        ]}
      />

      <TypeBlock
        code={`interface NotificationArgs {
  type?: 'success' | 'info' | 'warning' | 'error';
  title: ReactNode;
  content?: ReactNode;
  /** 自动关闭延时（毫秒），0 表示不自动关闭 */
  duration?: number;
}`}
      />
    </>
  );
}
