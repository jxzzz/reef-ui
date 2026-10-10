import { Avatar } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `<Avatar>张</Avatar>
<Avatar src="/avatar.png" alt="头像" />
<Avatar shape="square" size={48}>访客</Avatar>`;

export function AvatarPage() {
  return (
    <>
      <h2>Avatar 头像</h2>
      <p>图片或字符头像，图片加载失败自动回退到字符内容。</p>

      <Demo title="基础用法" code={basicCode}>
        <Avatar>张</Avatar>
        <Avatar src="https://i.pravatar.cc/64?img=5" alt="头像" />
        <Avatar shape="square" size={48}>访客</Avatar>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['src', '图片地址，失败回退到 children', 'string', '—'],
          ['alt', '图片替代文本', 'string', "''"],
          ['size', '边长（px）', 'number', '32'],
          ['shape', '形状', "'circle' | 'square'", "'circle'"],
        ]}
      />
    </>
  );
}
