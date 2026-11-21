# cozyxss.com

Bug bounty notları, CTF writeup'ları ve öğrendiklerim.

## Yeni yazı ekleme

1. `src/posts/` klasörüne yeni bir dosya ekle. Adı tarihle başlasın:
   `2026-12-01-lab-adi.md`
2. `post-template.md` dosyasındaki üst kısmı kopyala ve doldur:

   ```yaml
   ---
   no: 1                      # yazı numarası, 001 olarak görünür
   title: "PortSwigger Lab: ..."
   summary: "Ana sayfada görünen 1-2 cümle."
   category: LessonLearned    # yeni kategori yazarsan menüye kendiliğinden eklenir
   tags: [authentication, portswigger]
   cover: /images/001/cover.png   # isteğe bağlı kapak görseli
   ---
   ```
3. Görselleri `src/images/<yazı-no>/` içine koy, yazıda şöyle kullan:
   `![açıklama](/images/001/step1.png)`
4. Commit + push. Site 1-2 dakika içinde kendini günceller.

Taslakların repoya gitmesini istemiyorsan `_drafts/` klasöründe tut, bu klasör git'e gönderilmiyor.

## Bilgisayarda önizleme

```
npm install
npm start
```

Sonra tarayıcıda `http://localhost:8080` adresini aç.
