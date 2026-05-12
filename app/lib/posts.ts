import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "app/posts");

export type Post = {
  slug: string[];
  title: string;
  date: string;
  category: string;
  subcategory: string;
  description: string;
};

export function getAllPosts(): Post[] {
  const posts: Post[] = [];

  function traverseDir(dir: string, slug: string[]) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        traverseDir(fullPath, [...slug, file]);
      } else if (file.endsWith(".mdx")) {
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data } = matter(fileContents);
        posts.push({
          slug: [...slug, file.replace(".mdx", "")],
          title: data.title,
          date: data.date,
          category: data.category,
          subcategory: data.subcategory,
          description: data.description,
        });
      }
    }
  }

  traverseDir(postsDirectory, []);
  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}