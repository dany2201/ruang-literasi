// Ruang Literasi: bangun daftar artikel untuk website statis.
// Dijalankan Netlify setiap kali artikel disimpan melalui Decap CMS.
const fs = require('node:fs');
const path = require('node:path');
const source = path.join(__dirname, 'content', 'posts');
const destination = path.join(__dirname, 'content', 'posts.json');
const items = fs.readdirSync(source).filter(name => name.endsWith('.json')).map(name => {
  const article = JSON.parse(fs.readFileSync(path.join(source, name), 'utf8'));
  const slug = path.basename(name, '.json');
  const date = String(article.date || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Tanggal artikel tidak valid: '+name);
  if (!article.title || !article.body) throw new Error('Judul atau isi kosong: '+name);
  return {
    slug,
    title: String(article.title),
    category: String(article.category || 'Pendidikan'),
    isoDate: date,
    date: new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(date+'T12:00:00Z')),
    minutes: Math.max(1,Math.ceil(String(article.body).split(/\s+/).filter(Boolean).length/200)),
    image: String(article.image || '/assets/cerita-1.svg'),
    excerpt: String(article.excerpt || ''),
    paragraphs: String(article.body).split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean),
    published: article.published !== false
  };
}).filter(a => a.published).sort((a,b) => b.isoDate.localeCompare(a.isoDate));
fs.writeFileSync(destination, JSON.stringify(items,null,2)+'\n');
console.log(`Sukses: ${items.length} artikel diterbitkan ke content/posts.json`);
