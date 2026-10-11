import { Avatar } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode: Record<Lang, string> = {
  zh: `<Avatar>张</Avatar>
<Avatar src="https://i.pravatar.cc/64?img=5" alt="头像" />
<Avatar shape="square" size={48}>访客</Avatar>`,
  en: `<Avatar>Z</Avatar>
<Avatar src="https://i.pravatar.cc/64?img=5" alt="Avatar" />
<Avatar shape="square" size={48}>Guest</Avatar>`,
};

export function AvatarPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  return (
    <>
      <ComponentHeader group="数据展示" title={zh ? 'Avatar 头像' : 'Avatar'}>
        {zh ? '图片或字符头像，图片加载失败自动回退到字符内容。' : 'Image or character avatar. Falls back to the character content when the image fails to load.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        {zh ? (
          <>
            <Avatar>张</Avatar>
            <Avatar src="https://i.pravatar.cc/64?img=5" alt="头像" />
            <Avatar shape="square" size={48}>访客</Avatar>
          </>
        ) : (
          <>
            <Avatar>Z</Avatar>
            <Avatar src="https://i.pravatar.cc/64?img=5" alt="Avatar" />
            <Avatar shape="square" size={48}>Guest</Avatar>
          </>
        )}
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['src', zh ? '图片地址，失败回退到 children' : 'Image URL; falls back to children on failure', 'string', '—'],
          ['alt', zh ? '图片替代文本' : 'Image alt text', 'string', "''"],
          ['size', zh ? '边长（px）' : 'Side length (px)', 'number', '32'],
          ['shape', zh ? '形状' : 'Shape', "'circle' | 'square'", "'circle'"],
        ]}
      />
    </>
  );
}
