# Cloudflare R2 Setup

Bu proje ürün görsellerini Vercel üzerinden servis etmez. Admin panel upload işlemi R2'ye yazar, public menü görselleri doğrudan `images.bimolateras.com` üzerinden yükler.

## 1. Bucket Oluşturma

1. Cloudflare Dashboard'a girin.
2. R2 bölümünden yeni bir bucket oluşturun.
3. Bucket adını `.env` içindeki `R2_BUCKET_NAME` değerine yazın.

## 2. Access Key Oluşturma

1. R2 > Manage R2 API Tokens bölümüne gidin.
2. Bucket için read/write yetkili access key oluşturun.
3. Değerleri `.env` içine ekleyin:

```env
R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET_NAME=""
R2_PUBLIC_BASE_URL="https://images.bimolateras.com"
```

R2 endpoint formatı:

```txt
https://<R2_ACCOUNT_ID>.r2.cloudflarestorage.com
```

## 3. Custom Domain

1. R2 bucket ayarlarında custom domain ekleyin.
2. Domain olarak `images.bimolateras.com` kullanın.
3. Cloudflare DNS tarafında gerekli CNAME kaydını oluşturun.
4. Public URL şu formatta olmalıdır:

```txt
https://images.bimolateras.com/products/latte.webp
```

## 4. Public URL Mantığı

Database içinde ürün görseli için yalnızca public URL tutulur:

```txt
imageUrl = https://images.bimolateras.com/products/latte.webp
```

Public `/menu` sayfası görseli bu URL'den doğrudan yükler.

## 5. Vercel Proxy Kullanılmamalı

Aşağıdaki route'lar oluşturulmamalı ve kullanılmamalıdır:

```txt
/api/media
/api/upload
/media
```

Upload anında dosya Vercel server action üzerinden R2'ye gönderilebilir. Ancak müşterilerin görsel görüntüleme trafiği Vercel üzerinden geçmemeli, doğrudan Cloudflare R2 custom domaininden servis edilmelidir.
