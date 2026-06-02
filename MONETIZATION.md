# Hướng dẫn kiếm tiền với GameZone

## Tổng quan

Site dùng **GameMonetize API** để lấy game miễn phí (không cần license).  
Thu nhập đến từ: quảng cáo (AdSense) + GameMonetize publisher program.

---

## Bước 1 — Deploy lên Vercel

1. Tạo tài khoản tại https://github.com và push code lên repo mới
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/<username>/game-hub.git
   git push -u origin main
   ```

2. Vào https://vercel.com → **Sign up with GitHub**

3. Nhấn **Add New Project** → chọn repo vừa tạo → **Deploy**

4. Vercel tự detect Next.js, không cần config gì thêm

5. Site sẽ có URL dạng: `https://game-hub-xxx.vercel.app`

---

## Bước 2 — Mua domain

**Khuyến nghị:** Namecheap (~$10–12/năm) hoặc Porkbun (~$9/năm)

Tên domain gợi ý:
- `playgamezone.com`
- `freegames.fun`
- `arcadehub.io`

**Trỏ domain về Vercel:**
1. Vào Vercel → project → **Settings** → **Domains** → Add domain
2. Vercel hiển thị nameserver → copy vào DNS của Namecheap
3. Chờ 10–30 phút để propagate

---

## Bước 3 — Đăng ký GameMonetize Publisher

GameMonetize trả tiền theo **CPM** (mỗi 1000 lượt chơi game).

1. Vào https://gamemonetize.com → **Publisher** → **Sign Up**
2. Điền thông tin website
3. Sau khi duyệt nhận được **Publisher ID**
4. Thêm Publisher ID vào API call trong `lib/gamemonetize.ts`:
   ```
   ?format=json&type=html5&publisher=YOUR_ID&...
   ```

**Thu nhập ước tính:** $1–5 per 1,000 game plays

---

## Bước 4 — Đăng ký Google AdSense

Đây là nguồn thu nhập chính.

**Yêu cầu để được duyệt:**
- Có domain thật (không phải `.vercel.app`)
- Nội dung gốc, không spam
- Tối thiểu vài trăm lượt truy cập/ngày
- Trang Privacy Policy và Terms of Service (đã có sẵn trong code)

**Các bước:**
1. Vào https://adsense.google.com → **Get Started**
2. Nhập URL website → chọn quốc gia
3. Thêm script vào `app/layout.tsx`:
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossOrigin="anonymous"></script>
   ```
4. Chờ Google duyệt (3–14 ngày)
5. Sau khi duyệt → tạo Ad Units và đặt vào trang

**Vị trí đặt quảng cáo tốt nhất:**
- Trên header (banner 728x90)
- Sidebar bên phải trang game
- Giữa các game trong grid (AdCard đã có sẵn trong code)
- Dưới game iframe khi đang chơi

**Thu nhập ước tính:**
| Traffic/tháng | Thu nhập AdSense |
|---|---|
| 10,000 | $5–20 |
| 100,000 | $50–200 |
| 1,000,000 | $500–2,000 |

---

## Bước 5 — SEO cơ bản

Traffic = thu nhập. Không có traffic = không có tiền.

**Google Search Console:**
1. Vào https://search.google.com/search-console
2. Add property → nhập domain
3. Verify quyền sở hữu qua DNS record
4. Submit sitemap: `https://yourdomain.com/sitemap.xml`

**Thêm sitemap vào Next.js** (`app/sitemap.ts`):
```ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://yourdomain.com', changeFrequency: 'daily', priority: 1 },
    { url: 'https://yourdomain.com/games', changeFrequency: 'daily', priority: 0.9 },
  ]
}
```

**Checklist SEO:**
- [ ] Mỗi trang game có title và description riêng (đã có trong code)
- [ ] Ảnh thumbnail có `alt` text
- [ ] URL thân thiện dạng `/games/subway-surfers` (đã có)
- [ ] Tốc độ load nhanh (Vercel + Next.js đã tối ưu)
- [ ] Mobile-friendly (Tailwind responsive đã có)

---

## Bước 6 — Tăng traffic

**Miễn phí:**
- Đăng game hay lên Reddit: r/WebGames, r/Games, r/indiegaming
- Tạo TikTok/YouTube Shorts quay gameplay và link về site
- Đăng lên các Facebook group game Việt Nam

**Trả phí (khi có vốn):**
- Google Ads target từ khóa "free online games"
- Facebook Ads target người chơi game 13–35 tuổi

---

## Bước 7 — Thêm Cloudflare (tùy chọn, làm sau)

Chỉ cần khi traffic lớn (100k+ lượt/tháng) để giảm chi phí băng thông Vercel.

1. Tạo tài khoản tại https://cloudflare.com
2. Add site → nhập domain
3. Cloudflare cung cấp nameserver mới → cập nhật ở Namecheap
4. Bật **Cache Everything** rule cho ảnh thumbnail

---

## Tóm tắt thứ tự ưu tiên

| Thứ tự | Việc cần làm | Thời gian | Chi phí |
|---|---|---|---|
| 1 | Deploy lên Vercel | 30 phút | Miễn phí |
| 2 | Mua domain | 15 phút | ~$10/năm |
| 3 | Đăng ký GameMonetize Publisher | 1 ngày | Miễn phí |
| 4 | Đăng ký Google AdSense | 1–2 tuần | Miễn phí |
| 5 | Setup Google Search Console + Sitemap | 1 giờ | Miễn phí |
| 6 | Tăng traffic (SEO, social) | Liên tục | Miễn phí |
| 7 | Thêm Cloudflare | 30 phút | Miễn phí |
