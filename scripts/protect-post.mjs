#!/usr/bin/env node

/**
 * protect-post.mjs
 * ------------------------------------------------------------------
 * Root-Me처럼 "풀이를 인터넷에 공개하면 안 되는" 문제의 리뷰 글을
 * 비밀번호로 보호할 때 쓰는 스크립트.
 *
 * [배경]
 * 이 블로그는 글 상세 페이지(app/posts/[...slug]/page.tsx)에서
 * frontmatter에 `protected: true`가 있으면 쿠키 인증 전까지
 * 비밀번호 입력 폼만 보여주는 기능이 있음.
 * 근데 그것만으로는 부족한 게, mdx 파일 자체는 git 레포에 그대로
 * 커밋되기 때문에 레포가 public이 되는 순간 GitHub에서 파일을
 * 직접 열어보면 비밀번호 없이도 원문이 그대로 보여버림.
 *
 * 그래서 이 스크립트는:
 *   1) mdx 파일의 "본문"(frontmatter 제외한 나머지)을 base64로 인코딩해서
 *      .env.local(=git에 절대 안 올라가는 파일)에 저장하고,
 *   2) 레포에 남는 mdx 파일에는 frontmatter + "비밀번호로 보호된 글이에요"
 *      안내문 한 줄만 남겨두고,
 *   3) PostPage가 인증된 사용자에게는 파일 대신 이 환경변수에서
 *      실제 본문을 읽어오도록 매핑 테이블에 등록까지 자동으로 해줌.
 *
 * 결과적으로 실제 취약점 풀이 내용은 git 히스토리에 단 한 번도
 * 올라가지 않고, 오직 로컬 .env.local / Vercel 환경변수에만 존재하게 됨.
 *
 * [사용 전 준비물]
 * - 보호하고 싶은 mdx 파일을 평소처럼 다 작성해놓을 것
 * - 그 파일의 frontmatter에 `protected: true` 한 줄을 미리 추가해놓을 것
 *   (이게 없으면 스크립트가 실행을 거부함)
 *
 * [사용법]
 *   node scripts/protect-post.mjs <mdx 파일 경로>
 *   또는 (package.json에 등록된 alias)
 *   npm run protect -- <mdx 파일 경로>
 *
 *   예시:
 *   npm run protect -- app/posts/ctf/web/새로운-root-me-문제.mdx
 *
 * [실행하면 일어나는 일 - 순서대로]
 *   1. 대상 mdx 파일을 읽어서 frontmatter/본문을 분리 (gray-matter 사용)
 *   2. 파일 경로로부터 글의 slug를 계산
 *      (app/posts/ctf/web/foo.mdx -> "ctf/web/foo")
 *   3. slug를 대문자 스네이크케이스로 바꿔서 env 변수 이름을 만듦
 *      (예: PROTECTED_CONTENT_CTF_WEB_FOO_B64)
 *   4. 본문을 UTF-8 바이트 -> base64 문자열로 인코딩해서
 *      .env.local에 "새 키=값" 형태로 추가 (같은 키가 이미 있으면 교체)
 *   5. 방금 쓴 값을 즉시 다시 읽어서 디코딩한 결과가 원본 본문과
 *      바이트 단위로 완전히 일치하는지 검증함
 *      (저장/전송 중 한 글자라도 깨지면 여기서 바로 에러를 내고 멈춤 -
 *       이 검증 없이 진행했다가 실제로 base64 한 글자가 깨져서
 *       MDX 렌더링이 깨진 적이 있어서 반드시 넣어놓은 안전장치)
 *   6. 레포에 남을 mdx 파일 자체는 frontmatter + 안내문 한 줄짜리
 *      stub 내용으로 덮어씀 (원본 본문은 이제 이 파일 안에 없음)
 *   7. app/posts/[...slug]/page.tsx 안의 PROTECTED_CONTENT_ENV_MAP
 *      객체에 "slug": "envKey" 한 줄을 자동으로 추가함
 *      (이미 등록되어 있으면 건너뜀)
 *
 * [스크립트 실행 후 네가 직접 해야 하는 일]
 *   1. Vercel 프로젝트 → Settings → Environment Variables 에서
 *      방금 콘솔에 출력된 env 키/값을 .env.local에서 복사해서 새로 등록
 *      (Production 체크 필수)
 *   2. git add / git commit / git push
 *      (mdx stub 파일, page.tsx 수정분만 커밋되면 됨 -
 *       .env.local은 애초에 .gitignore에 걸려있어서 안 올라감)
 *   3. Vercel에서 재배포 (환경변수는 재배포해야 반영됨)
 *
 * [주의사항]
 * - 이 스크립트 자체(protect-post.mjs)는 시크릿을 담고 있지 않으므로
 *   그냥 평소처럼 git에 커밋해서 GitHub에 올라가도 안전함.
 *   실제로 지워야 하는 건 .env.local뿐이고, 그건 이미 .gitignore로
 *   막혀있음.
 * - 글 하나 안에 protected: true를 여러 번 등록/해제하며 계속 고치는
 *   경우, .env.local에 쌓인 옛날 항목이 지저분해질 수 있음 - 그럴 땐
 *   .env.local을 열어서 안 쓰는 PROTECTED_CONTENT_* 줄을 직접 지워도 됨.
 * ------------------------------------------------------------------
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_ROOT = path.join(process.cwd(), "app", "posts");
const ENV_PATH = path.join(process.cwd(), ".env.local");
const PAGE_PATH = path.join(process.cwd(), "app", "posts", "[...slug]", "page.tsx");
const STUB_NOTICE =
  "이 글은 비밀번호로 보호되어 있어요. [writeup.log](https://hwith-jlog.vercel.app/)에서 비밀번호를 입력하면 전체 내용을 볼 수 있습니다.\n";

function fail(msg) {
  console.error("✗ " + msg);
  process.exit(1);
}

// --- 1. 인자로 받은 mdx 파일 확인 ---
const target = process.argv[2];
if (!target) fail("사용법: node scripts/protect-post.mjs <mdx 파일 경로>");

const filePath = path.resolve(target);
if (!fs.existsSync(filePath)) fail("파일을 찾을 수 없음: " + filePath);

const raw = fs.readFileSync(filePath, "utf8");
const parsed = matter(raw); // { data: frontmatter 객체, content: 본문 문자열 }

if (!parsed.data.protected) {
  fail("frontmatter에 `protected: true`가 없어요. 먼저 추가하고 다시 실행해줘.");
}

// --- 2. 파일 경로 -> slug 계산 (app/posts/ 기준 상대경로, 확장자 제거) ---
const relFromPosts = path.relative(POSTS_ROOT, filePath).replace(/\.mdx$/, "");
const slug = relFromPosts.split(path.sep).join("/");

// --- 3. slug -> env 변수 이름 생성 ---
const envKey =
  "PROTECTED_CONTENT_" +
  slug
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_") // 영문자/숫자가 아니면 전부 _로 치환
    .replace(/^_+|_+$/g, "") + // 앞뒤 _ 정리
  "_B64";

// --- 4. 본문을 base64로 인코딩 ---
const bodyBytes = Buffer.from(parsed.content, "utf8");
const b64 = bodyBytes.toString("base64");

// --- 5. .env.local 갱신 (같은 키가 이미 있으면 그 줄만 교체) ---
let envText = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, "utf8") : "";
const keyLineRe = new RegExp(`^${envKey}=.*$`, "m");
envText = envText.replace(keyLineRe, "").replace(/\n{3,}/g, "\n\n");
envText = envText.replace(/\n*$/, "\n") + `${envKey}=${b64}\n`;
fs.writeFileSync(ENV_PATH, envText, "utf8");

// --- 6. 방금 쓴 값을 즉시 재검증 (원본과 바이트 단위로 일치하는지) ---
const readback = fs.readFileSync(ENV_PATH, "utf8");
const readMatch = readback.match(new RegExp(`^${envKey}=(.*)$`, "m"));
if (!readMatch) fail(".env.local에 값이 제대로 안 써졌어요.");
const decoded = Buffer.from(readMatch[1], "base64");
if (!decoded.equals(bodyBytes)) {
  fail("검증 실패: 저장된 값이 원본 본문과 달라요. 다시 실행해줘.");
}

// --- 7. 레포에 남길 stub으로 mdx 파일 교체 (frontmatter는 그대로 유지) ---
const stub = matter.stringify(STUB_NOTICE, parsed.data);
fs.writeFileSync(filePath, stub, "utf8");

// --- 8. PostPage의 PROTECTED_CONTENT_ENV_MAP에 slug -> envKey 등록 ---
let pageSrc = fs.readFileSync(PAGE_PATH, "utf8");
const mapMarker = "const PROTECTED_CONTENT_ENV_MAP: Record<string, string> = {";
if (!pageSrc.includes(mapMarker)) {
  console.warn("⚠ PostPage에서 매핑 테이블을 못 찾았어요. 수동으로 추가해줘.");
} else if (pageSrc.includes(`"${slug}":`)) {
  console.log("- 이미 매핑에 등록되어 있어서 건너뜀");
} else {
  pageSrc = pageSrc.replace(mapMarker, `${mapMarker}\n  "${slug}": "${envKey}",`);
  fs.writeFileSync(PAGE_PATH, pageSrc, "utf8");
  console.log("- PostPage 매핑 테이블에 등록 완료");
}

console.log("");
console.log("✓ 완료");
console.log("  slug:", slug);
console.log("  env 키:", envKey);
console.log("");
console.log("남은 할 일:");
console.log("  1. Vercel Environment Variables에 위 키/값 추가 (.env.local에서 복사)");
console.log("  2. git add / commit / push");
console.log("  3. Vercel 재배포");
