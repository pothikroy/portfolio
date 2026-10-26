import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const projects = JSON.parse(await readFile(path.join(root,'content/projects.json'),'utf8'));
assert.equal(projects.length,9,'All nine CV projects must be represented');
assert.equal(new Set(projects.map(project=>project.id)).size,9,'Project IDs must be unique');
for (const project of projects) {
  assert.equal(new URL(project.url).protocol,'https:');
  assert.ok(project.roles.length && project.roles.every(role=>['editing','camera','writing','direction'].includes(role)));
}
for (const name of ['index.html','work.html','about.html','404.html']) {
  const html = await readFile(path.join(root,name),'utf8');
  assert.equal((html.match(/<h1\b/g)||[]).length,1,`${name}: exactly one h1`);
  assert.match(html,/<html lang="en">/);
  assert.match(html,/<meta name="description"/);
  assert.match(html,/<link rel="canonical"/);
  assert.match(html,/<a class="skip-link"/);
  assert.doesNotMatch(html,/github_pat_|ghp_[A-Za-z0-9]|National ID|Marital Status|Date of Birth|lorem ipsum|coming soon/i);
  JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  for (const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    const url = match[1].replaceAll('&amp;','&');
    if (/^https?:|^mailto:/.test(url)) continue;
    assert.ok(url.startsWith('/portfolio/'),`${name}: local URL must preserve the GitHub Pages base path: ${url}`);
    const [pathname, fragment] = url.slice('/portfolio/'.length).split('#');
    const file = pathname || 'index.html';
    await access(path.join(root,file));
    if (fragment) assert.match(await readFile(path.join(root,file),'utf8'),new RegExp(`id="${fragment}"`));
  }
  for (const tag of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) assert.match(tag[0],/rel="noopener noreferrer"/);
  for (const image of html.matchAll(/<img\b[^>]*>/g)) {
    assert.match(image[0],/alt="[^"]+"/);
    assert.match(image[0],/width="\d+" height="\d+"/);
  }
  for (const fragment of html.matchAll(/href="#([^"]+)"/g)) assert.ok(html.includes(`id="${fragment[1]}"`),`${name}: missing anchor ${fragment[1]}`);
}
const work = await readFile(path.join(root,'work.html'),'utf8');
assert.equal((work.match(/data-project /g)||[]).length,9);
for (const project of projects) assert.ok(work.includes(project.url.replaceAll('&','&amp;')));
console.log('PASS: 4 pages, all 9 project links, internal routes/assets/anchors, metadata, structured data, and publication content checks.');
