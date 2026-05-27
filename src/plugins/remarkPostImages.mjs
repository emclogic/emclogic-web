import { visit } from 'unist-util-visit';
import path from 'path';

/**
 * Rewrites relative image paths in post markdown to absolute public paths.
 * "images/foo.webp" → "/images/posts/{slug}/foo.webp"
 */
export function remarkPostImages() {
  return (tree, vfile) => {
    const filePath = vfile.history?.[0] ?? vfile.path ?? '';
    const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
    const relative = path.relative(postsDir, filePath);
    const slug = relative.split(path.sep)[0];

    if (!slug || slug.startsWith('.')) return;

    visit(tree, 'image', (node) => {
      if (node.url && !node.url.startsWith('http') && !node.url.startsWith('/')) {
        const filename = path.basename(node.url);
        node.url = `/images/posts/${slug}/${filename}`;
      }
    });
  };
}
