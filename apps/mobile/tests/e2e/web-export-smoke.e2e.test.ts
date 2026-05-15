import { describe, expect, it } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('mobile web export smoke', () => {
  it('contains exported web entry and foundation content', () => {
    const outputDir = join(process.cwd(), 'dist-web');
    const indexPath = join(outputDir, 'index.html');

    expect(existsSync(outputDir)).toBe(true);
    expect(existsSync(indexPath)).toBe(true);

    const html = readFileSync(indexPath, 'utf8');
    expect(html.length).toBeGreaterThan(0);
    expect(html).toContain('expo');
  });
});
