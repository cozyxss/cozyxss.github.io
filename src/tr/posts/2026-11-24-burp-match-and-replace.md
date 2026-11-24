---
no: 2
title: "Burp Match & Replace ile Cookie'yi Otomatik Değiştirmek"
summary: "Lab çözerken cookie'deki Admin=false değerini her istekte elle değiştirmekten sıkıldım. Burp'ün Match and Replace özelliği bunu benim yerime yapıyor."
tags: [burp, access control, portswigger]
---

Cookie tabanlı bir yetki kontrolünü test ediyordum. Amaç basit bir privilege escalation: `Admin=false` değerini `Admin=true` yapıp admin işlevlerine erişmeye çalışmak.

Sorun şuydu: her isteği durdurup cookie'yi elle düzeltmek çok yorucu. Her tıklamada aynı işi tekrarlıyordum. Burp'ün **Match and Replace** özelliği tam da bunun için varmış: bir kural tanımlıyorsun, Burp her istekte o değişikliği senin yerine yapıyor.

## Kuralı nasıl kurdum

Proxy → **Settings → Match and Replace** bölümüne gidip yeni bir kural ekledim:

- **Type:** Request header
- **Match:** `Admin=false`
- **Replace:** `Admin=true`
- **Regex match:** Hayır (düz metin yeterli)
- **Comment:** Admin Cookie Bypass

![Burp Match and Replace kuralı: Admin=false değerini Admin=true ile değiştiriyor](/images/002/match-replace-rule.png)

## Nasıl çalışıyor

Kuralı kaydettikten sonra elle hiçbir şey yapmama gerek kalmadı. Sayfayı yenilediğimde (F5) giden isteklerdeki cookie otomatik olarak `Admin=true` oluyordu. Burada önemli bir nokta var: bu değişiklik sadece **giden istekte** oluyor, tarayıcıda duran cookie'ye dokunmuyor. Yani her istekte kural tekrar devreye giriyor.

Doğrulamak için **HTTP history**'den birkaç isteğe baktım, cookie'nin gerçekten değiştirilmiş gidip gitmediğini kontrol ettim.

## Lesson learned

> Aynı değişikliği her istekte tekrar yapıyorsan dur: Match and Replace onu bir kez tanımlayıp otomatiğe bağlamanı sağlıyor. Değişiklik giden istekte olur, tarayıcıdaki cookie aynı kalır.
