# PRD — Bİ'MOLA TERAS CAFE Modern QR Menü Sistemi

## 1. Proje Özeti

**Proje adı:** Bİ'MOLA TERAS CAFE QR Menü  
**İşletme:** Bİ'MOLA TERAS CAFE  
**Konum:** Hatay / Yayladağı  
**Amaç:** Kafe müşterilerinin QR kod okutarak hızlı, modern, mobil uyumlu ve görsel ağırlıklı bir dijital menüye ulaşmasını sağlamak. İşletme sahibinin ürünleri, fiyatları, kategorileri ve görselleri kolayca yönetebileceği bir admin panel oluşturmak.

Bu proje ilk aşamada sadece **QR menü + admin panel** olarak geliştirilecektir. Sipariş alma, ödeme, masa yönetimi gibi özellikler ilk sürüme dahil edilmeyecek; sistem sade, hızlı ve profesyonel bir MVP olarak yayına alınacaktır.

---

## 2. Temel Hedef

QR kod okutulduğunda kullanıcı doğrudan şu sayfaya yönlenmelidir:

```txt
https://bimolateras.com/menu
```

Müşteri herhangi bir uygulama indirmeden, telefondan menüyü hızlıca görebilmelidir.

Admin tarafı:

```txt
https://bimolateras.com/admin
```

Admin panelden ürün/kategori/fiyat/görsel yönetimi yapılabilmelidir.

---

## 3. Marka ve Tasarım Yönü

Logoda sıcak, premium, kahve/teras konseptli bir yapı var. Tasarım dili bu logoya uygun olmalıdır.

### Marka hissi

- Modern
- Sıcak
- Premium ama samimi
- Cafe / teras / kahve atmosferi
- Mobilde çok rahat kullanılabilir
- Animasyonlu ama abartısız
- Hızlı ve sade

### Renk paleti önerisi

```txt
Ana arka plan: #F6EFE7 / krem tonları
Ana metin: #2B1A0F / koyu kahve
İkincil metin: #6F5A48
Vurgu rengi: #B8864B / bronz-altın
Koyu zemin: #1E140D
Kart zemini: #FFF9F2
Border: #E7D7C6
Başarı/aktif: #5A7C55
```

### Tipografi

- Başlıklar için modern serif font tercih edilmeli.
- Metinler için okunabilir sans-serif kullanılmalı.
- Öneri:
  - Başlık: `Playfair Display`, `Cormorant Garamond` veya benzeri
  - Gövde: `Inter`, `Manrope` veya benzeri

### Genel UI tarzı

- Yuvarlatılmış kartlar
- Soft gölgeler
- Büyük ürün görselleri
- Krem/kahve/bronze renk dengesi
- Sticky kategori bar
- Mobil öncelikli tasarım
- Hafif scroll animasyonları
- Smooth page transition

---

## 4. Teknik Mimari

### Önerilen teknoloji stack

```txt
Framework: Next.js App Router
Dil: TypeScript
UI: Tailwind CSS
Animasyon: Framer Motion
Form: React Hook Form + Zod
Database: PostgreSQL / Supabase veya Neon
ORM: Prisma
Auth: NextAuth/Auth.js veya custom session
Storage: Cloudflare R2
Deploy: Vercel
DNS: Cloudflare
```

### Hosting ve domain yapısı

Ana site Vercel üzerinde çalışacaktır. Görseller Cloudflare R2 üzerinden public custom domain ile servis edilecektir.

```txt
bimolateras.com          → Vercel
www.bimolateras.com      → Vercel
images.bimolateras.com   → Cloudflare R2
```

### Kritik medya kuralı

Ürün görselleri kesinlikle Vercel üzerinden proxy edilmemelidir.

Yanlış kullanım:

```txt
/api/media/...
/api/upload/...
/media/...
```

Doğru kullanım:

```txt
https://images.bimolateras.com/products/latte.webp
```

Veritabanında ürün görseli için sadece `imageUrl` tutulacaktır. Menü sayfasında görseller doğrudan Cloudflare R2 custom domain üzerinden yüklenecektir.

Next.js `Image` component kullanılırsa:

```tsx
<Image
  src={product.imageUrl}
  alt={product.name}
  width={600}
  height={400}
  unoptimized
/>
```

Alternatif olarak normal `img` etiketi kullanılabilir:

```tsx
<img src={product.imageUrl} alt={product.name} loading="lazy" />
```

---

## 5. Kullanıcı Rolleri

### 5.1 Müşteri

QR kod okutarak menüye girer. Ürünleri ve fiyatları görür. Instagram, WhatsApp ve konum linklerine ulaşabilir.

### 5.2 Admin / İşletme Sahibi

Admin panele giriş yapar. Menü içeriklerini yönetir.

Admin işlemleri:

- Ürün ekleme
- Ürün düzenleme
- Ürün silme
- Ürün aktif/pasif yapma
- Fiyat güncelleme
- Kategori ekleme/düzenleme/silme
- Görsel yükleme
- Popüler ürün seçme
- Yeni ürün etiketi verme
- Kampanya/öne çıkan ürün yönetimi

---

## 6. Sayfa Yapısı

## 6.1 Public Ana Sayfa — `/`

Ana sayfa sade bir tanıtım sayfası olabilir. QR menünün önüne gereksiz engel koymamalı.

İçerik:

- Logo
- Bİ'MOLA TERAS CAFE başlığı
- Kısa slogan
- “Menüyü Gör” butonu
- Instagram butonu
- Konum butonu
- WhatsApp butonu

Örnek sloganlar:

```txt
Yayladağı'nda kahvenin en keyifli molası.
```

```txt
Manzara, kahve ve keyifli bir mola.
```

---

## 6.2 Menü Sayfası — `/menu`

Bu sayfa QR kodun ana hedefidir. Mobilde çok hızlı açılmalı ve kolay kullanılmalıdır.

### Menü sayfası bölümleri

1. Üst marka alanı
2. Logo
3. İşletme adı
4. Kısa açıklama
5. Sticky kategori filtreleri
6. Ürün listesi
7. Öne çıkan ürünler
8. Footer / iletişim butonları

### Üst alan

İçerik:

```txt
Bİ'MOLA TERAS CAFE
Yayladağı'nda keyifli bir mola.
```

Butonlar:

- Instagram
- Konum
- WhatsApp

### Kategori bar

Kategori bar sticky olmalıdır. Kullanıcı aşağı kaydırsa bile kategorilere hızlı erişebilmelidir.

Örnek kategoriler:

```txt
Tümü
Sıcak Kahveler
Soğuk Kahveler
Sıcak İçecekler
Soğuk İçecekler
Tatlılar
Aperatifler
Kampanyalar
```

### Ürün kartı

Her ürün kartında şu bilgiler olmalıdır:

- Ürün görseli
- Ürün adı
- Kısa açıklama
- Fiyat
- Kategori
- Popüler etiketi
- Yeni etiketi
- Aktif/pasif durumu

Kart tasarımı:

- Mobilde tek kolon
- Tablet/desktopta 2-3 kolon
- Büyük görsel
- Fiyat net görünür
- Kart hover/press animasyonu

Örnek ürün kartı:

```txt
Latte
Espresso ve sıcak süt ile yumuşak içimli klasik kahve.
85₺
Popüler
```

### Menü boş durumları

Kategori içinde ürün yoksa:

```txt
Bu kategoride henüz ürün bulunmuyor.
```

Ürün görseli yoksa:

- Logo veya kahve temalı placeholder gösterilmeli.

---

## 6.3 Admin Login — `/admin/login`

Admin giriş sayfası sade ve güvenli olmalıdır.

Alanlar:

- E-posta
- Şifre
- Giriş yap butonu

Hatalar:

- Hatalı e-posta/şifre
- Boş alan uyarısı
- Oturum süresi doldu mesajı

---

## 6.4 Admin Dashboard — `/admin`

Admin giriş yaptıktan sonra dashboard görünmelidir.

Dashboard kartları:

- Toplam ürün sayısı
- Aktif ürün sayısı
- Kategori sayısı
- Öne çıkan ürün sayısı

Kısa aksiyonlar:

- Yeni ürün ekle
- Kategorileri yönet
- Menüyü görüntüle

---

## 6.5 Ürün Yönetimi — `/admin/products`

Tablo veya kart görünümü olabilir.

Alanlar:

- Ürün görseli
- Ürün adı
- Kategori
- Fiyat
- Aktif/pasif
- Popüler
- Yeni
- Sıralama
- Düzenle
- Sil

Filtreler:

- Kategoriye göre filtre
- Aktif/pasif filtre
- Arama

---

## 6.6 Ürün Ekle/Düzenle — `/admin/products/new`, `/admin/products/[id]/edit`

Form alanları:

```txt
Ürün adı
Slug
Açıklama
Fiyat
Kategori
Ürün görseli
Aktif mi?
Popüler mi?
Yeni mi?
Sıralama
```

### Görsel yükleme

Admin panelde görsel yükleme yapılınca dosya Cloudflare R2’ye gönderilecektir.

Görsel kuralları:

- JPG, PNG, WEBP kabul edilmeli
- Maksimum dosya boyutu: 5 MB
- Yüklenen görsel WebP formatına dönüştürülebilir
- Görsel ürün klasörüne kaydedilmeli
- Dosya yolu örneği:

```txt
/products/americano-1719000000.webp
```

Public URL örneği:

```txt
https://images.bimolateras.com/products/americano-1719000000.webp
```

---

## 6.7 Kategori Yönetimi — `/admin/categories`

Kategori alanları:

```txt
Kategori adı
Slug
Açıklama
Sıralama
Aktif mi?
```

Özellikler:

- Kategori ekleme
- Kategori düzenleme
- Kategori silme
- Sıralama değiştirme
- Aktif/pasif yapma

---

## 6.8 Ayarlar — `/admin/settings`

İşletme bilgileri buradan yönetilebilir.

Alanlar:

```txt
İşletme adı
Kısa açıklama
Telefon
WhatsApp numarası
Instagram URL
Google Maps URL
Adres
Logo URL
Tema rengi
```

---

## 7. Veritabanı Modeli

## 7.1 Category

```prisma
model Category {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?
  sortOrder   Int       @default(0)
  isActive    Boolean   @default(true)
  products    Product[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

## 7.2 Product

```prisma
model Product {
  id          String   @id @default(cuid())
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  name        String
  slug        String   @unique
  description String?
  price       Decimal
  imageUrl    String?
  isActive    Boolean  @default(true)
  isPopular   Boolean  @default(false)
  isNew       Boolean  @default(false)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 7.3 AdminUser

```prisma
model AdminUser {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

## 7.4 SiteSettings

```prisma
model SiteSettings {
  id          String   @id @default(cuid())
  businessName String
  description  String?
  phone        String?
  whatsapp     String?
  instagramUrl String?
  mapsUrl      String?
  address      String?
  logoUrl      String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

---

## 8. API / Server Actions

Tercihen Next.js Server Actions kullanılabilir. Alternatif olarak route handlers kullanılabilir.

### Product işlemleri

```txt
GET products
GET product by id
CREATE product
UPDATE product
DELETE product
TOGGLE product active
```

### Category işlemleri

```txt
GET categories
CREATE category
UPDATE category
DELETE category
TOGGLE category active
```

### Upload işlemleri

```txt
POST upload image to Cloudflare R2
DELETE image from Cloudflare R2
```

Upload response:

```json
{
  "url": "https://images.bimolateras.com/products/latte.webp",
  "key": "products/latte.webp"
}
```

---

## 9. Animasyon ve Etkileşim

Animasyonlar modern olmalı ama siteyi yavaşlatmamalı.

Kullanılacak animasyonlar:

- Sayfa açılışında soft fade-in
- Hero alanında logo hafif scale/fade
- Kategori geçişlerinde smooth scroll
- Ürün kartlarında hover/tap animasyonu
- Ürünler listelenirken stagger animation
- Admin form save sonrası toast bildirimi
- Skeleton loading

Framer Motion kullanılabilir.

Örnek davranış:

- Menü açıldığında logo 0.95 scale’den 1’e gelir.
- Ürün kartları aşağıdan hafifçe görünür.
- Kategori seçildiğinde aktif kategori bronz/koyu kahve görünür.

---

## 10. Responsive Tasarım

Mobil öncelikli tasarlanmalıdır.

### Mobil

- Tek kolon ürün kartları
- Sticky kategori bar
- Alt kısımda hızlı iletişim butonları olabilir
- Büyük dokunma alanları

### Tablet

- 2 kolon ürün grid

### Desktop

- 3 kolon ürün grid
- Daha geniş hero alanı
- Admin panel sidebar layout

---

## 11. Performans Gereksinimleri

- Menü sayfası hızlı açılmalı.
- Görseller lazy loading olmalı.
- Görseller Cloudflare R2’den servis edilmeli.
- Vercel üzerinden medya proxy yapılmamalı.
- İlk yüklemede gereksiz JS azaltılmalı.
- Public menü sayfasında cache kullanılmalı.
- Admin tarafı public menüyü yavaşlatmamalı.

Hedefler:

```txt
Mobile Lighthouse Performance: 85+
Accessibility: 90+
SEO: 90+
Best Practices: 90+
```

---

## 12. SEO ve Meta

Menü sayfası için meta bilgileri:

```txt
Title: Bİ'MOLA TERAS CAFE | QR Menü
Description: Hatay Yayladağı Bİ'MOLA TERAS CAFE dijital menüsü. Kahveler, içecekler, tatlılar ve aperatifler.
```

Open Graph:

```txt
og:title: Bİ'MOLA TERAS CAFE
og:description: Yayladağı'nda kahve, teras ve keyifli mola.
og:image: logo veya özel og görseli
```

---

## 13. Güvenlik

- Admin panel login zorunlu olmalı.
- Admin route middleware ile korunmalı.
- Şifreler hashlenerek saklanmalı.
- Upload endpoint sadece admin kullanabilmeli.
- Dosya tipi kontrol edilmeli.
- Dosya boyutu kontrol edilmeli.
- Environment variable bilgileri client tarafına sızmamalı.
- R2 secret key client tarafında kullanılmamalı.

---

## 14. Environment Variables

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_BASE_URL=https://images.bimolateras.com

ADMIN_EMAIL=
ADMIN_PASSWORD=
```

Not: `ADMIN_PASSWORD` sadece seed aşamasında kullanılmalı, düz metin olarak DB’de tutulmamalıdır.

---

## 15. İlk Seed Verisi

### Kategoriler

```txt
Sıcak Kahveler
Soğuk Kahveler
Sıcak İçecekler
Soğuk İçecekler
Tatlılar
Aperatifler
Kampanyalar
```

### Örnek ürünler

```txt
Americano — 75₺
Latte — 85₺
Cappuccino — 85₺
Mocha — 95₺
Ice Latte — 95₺
Limonata — 80₺
Çay — 25₺
Türk Kahvesi — 70₺
Cheesecake — 120₺
Tost — 110₺
```

Fiyatlar örnektir; admin panelden değiştirilebilir olmalıdır.

---

## 16. MVP Kapsamı

İlk sürümde yapılacaklar:

- Next.js proje kurulumu
- Modern landing page
- Mobil uyumlu `/menu` sayfası
- Kategori filtreleri
- Ürün kartları
- Admin login
- Admin dashboard
- Ürün CRUD
- Kategori CRUD
- Cloudflare R2 görsel yükleme
- Public image URL kullanımı
- Vercel deploy
- Cloudflare DNS yapısı
- QR kod yönlendirmesi

İlk sürümde yapılmayacaklar:

- Online sipariş
- Sepet
- Ödeme
- Masa yönetimi
- Garson çağırma
- Çoklu şube
- Çoklu kullanıcı yetkisi
- Gelişmiş analitik

---

## 17. Gelecek Sürüm Özellikleri

Sonradan eklenebilir:

- Masa numarasına özel QR
- Garson çağırma
- Sepet ve sipariş gönderme
- WhatsApp ile sipariş
- Çoklu dil: TR / EN / AR
- Google yorum yönlendirmesi
- En çok görüntülenen ürünler
- Kampanya banner yönetimi
- Günün ürünü
- Kapalı/açık saat yönetimi
- Çoklu şube desteği
- SaaS yapısına çevirme

---

## 18. Cursor Geliştirme Talimatı

Cursor projeyi tek seferde karmaşık hale getirmemelidir. Aşamalar halinde ilerlenmelidir.

### Aşama 1 — Proje kurulumu

```txt
Next.js App Router, TypeScript, Tailwind CSS ve Framer Motion kullanarak Bİ'MOLA TERAS CAFE için modern QR menü projesi kur.
Tasarım mobil öncelikli, krem/kahve/bronz renk paletine sahip ve premium cafe hissinde olsun.
```

### Aşama 2 — Public menü

```txt
/menu sayfasını oluştur. Sticky kategori filtreleri, animasyonlu ürün kartları, ürün görselleri, fiyat ve etiketler olsun. Şimdilik mock data kullan.
```

### Aşama 3 — Admin panel

```txt
/admin login, dashboard, products ve categories sayfalarını oluştur. Ürün ekleme/düzenleme/silme, kategori yönetimi ve aktif/pasif işlemleri tasarım olarak hazır olsun.
```

### Aşama 4 — Database

```txt
Prisma ve PostgreSQL bağlantısını ekle. Category, Product, AdminUser ve SiteSettings modellerini oluştur. Mock datayı database verisiyle değiştir.
```

### Aşama 5 — Cloudflare R2 upload

```txt
Cloudflare R2 upload entegrasyonu ekle. Görseller products klasörüne yüklensin. Database içinde imageUrl olarak sadece public Cloudflare URL tutulsun. Görseller kesinlikle /api/media veya Vercel proxy üzerinden servis edilmesin.
```

### Aşama 6 — Production hazırlığı

```txt
Vercel deploy için environment variable yapısını düzenle. Build hatalarını gider. Public menünün performansını optimize et. SEO metadata ve Open Graph ayarlarını ekle.
```

---

## 19. Kabul Kriterleri

Proje tamamlandı sayılması için:

- QR kod `/menu` sayfasını açmalı.
- Menü mobilde düzgün görünmeli.
- Kategoriler çalışmalı.
- Ürünler kategoriye göre filtrelenmeli.
- Ürün görselleri `images.bimolateras.com` üzerinden gelmeli.
- Vercel üzerinden `/api/media` veya `/media` proxy kullanılmamalı.
- Admin giriş yapılabilmeli.
- Admin ürün ekleyebilmeli.
- Admin ürün fiyatı değiştirebilmeli.
- Admin ürün görseli yükleyebilmeli.
- Admin ürünü aktif/pasif yapabilmeli.
- Admin kategori ekleyip düzenleyebilmeli.
- Deploy sonrası production build hatasız çalışmalı.
- Menü sayfası mobilde hızlı açılmalı.

---

## 20. Proje Dosya Yapısı Önerisi

```txt
app/
  page.tsx
  menu/
    page.tsx
  admin/
    page.tsx
    login/
      page.tsx
    products/
      page.tsx
      new/
        page.tsx
      [id]/edit/
        page.tsx
    categories/
      page.tsx
    settings/
      page.tsx
  api/
    upload/
      route.ts

components/
  public/
    Hero.tsx
    MenuHeader.tsx
    CategoryTabs.tsx
    ProductCard.tsx
    ContactButtons.tsx
  admin/
    AdminSidebar.tsx
    ProductForm.tsx
    CategoryForm.tsx
    ImageUpload.tsx
  ui/

lib/
  db.ts
  auth.ts
  r2.ts
  slug.ts
  utils.ts

prisma/
  schema.prisma
  seed.ts

public/
  logo.png
```

---

## 21. Önemli Notlar

- Logo `public/logo.png` olarak projeye eklenebilir.
- Menü görselleri public klasöre konmamalı; Cloudflare R2 kullanılmalıdır.
- Ürün görselleri direct Cloudflare URL ile gösterilmelidir.
- Admin upload işlemi server-side yapılmalıdır.
- İlk sürüm sade tutulmalıdır.
- Tasarım güçlü ve modern olmalı ama kullanım basit kalmalıdır.

