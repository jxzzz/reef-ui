import { describe, expect, test } from 'vitest';
import { calcThumb } from './thumb';

describe('calcThumb', () => {
  test('无溢出时 needed 为 false', () => {
    expect(calcThumb(200, 200, 0, 192)).toEqual({ size: 0, offset: 0, needed: false });
    expect(calcThumb(200, 150, 0, 192).needed).toBe(false);
  });

  test('滑块大小 = 轨道 × 视口/内容', () => {
    // viewport 200, content 400, track 192 → size 96
    expect(calcThumb(200, 400, 0, 192).size).toBe(96);
  });

  test('滑块有 24px 下限（内容略溢出时不会被压成针尖）', () => {
    // viewport 200, content 100000, track 192 → 0.384 → clamp 24
    expect(calcThumb(200, 100000, 0, 192).size).toBe(24);
  });

  test('offset 随 scroll 线性映射到 [0, track - size]', () => {
    const g = calcThumb(200, 400, 100, 192); // maxScroll 200, track-size 96
    expect(g.offset).toBe(48);
    expect(calcThumb(200, 400, 200, 192).offset).toBe(96);
    expect(calcThumb(200, 400, 0, 192).offset).toBe(0);
  });

  test('content === viewport 视为无溢出（Review Focus #5）', () => {
    expect(calcThumb(200, 200, 0, 192).needed).toBe(false);
  });
});
