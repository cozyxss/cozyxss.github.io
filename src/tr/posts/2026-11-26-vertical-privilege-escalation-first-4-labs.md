---
no: 3
title: "Vertical Privilege Escalation: İlk 4 Lab"
summary: "Access control konusundaki ilk dört vertical privilege escalation lab'inden çıkardığım notlar: gizli admin panelleri, frontend'de yapılan yetki kontrolü ve request üzerinden rol değiştirme."
series: Access Control
part: 1
tags: [access control, portswigger, privilege escalation]
---

Access control konusundaki ilk 4 lab'i çözdüm, dördü de vertical access control üzerine ve hepsi Apprentice seviyesinde. Kısaca hatırlatmak gerekirse vertical access control, farklı rollerdeki kullanıcıların farklı fonksiyonlara ve kaynaklara erişmesiydi; buradaki saldırı da erişimi bir üst role, yani yukarı doğru taşımak. Müşteri, admin fonksiyonlarına ulaşamamalı. Bu dört lab'de de hedef hep aynıydı: admin paneline girmek.

Lab'leri çözerken çıkardığım notlar şöyle.

## Lab 1 — [Unprotected admin functionality](https://portswigger.net/web-security/access-control/lab-unprotected-admin-functionality)

Burada admin paneli gizlenmiş olabiliyor ama korunmuyor. URL'yi `robots.txt` içinde bulabiliriz. Oradan adrese girince panel açılıyor, çünkü "bu kullanıcı gerçekten admin mi?" kontrolü yapılmıyor. Yani URL'yi bilen herkes admin işlemlerine erişebiliyor.

## Lab 2 — [Unprotected admin functionality with unpredictable URL](https://portswigger.net/web-security/access-control/lab-unprotected-admin-functionality-with-unpredictable-url)

Bu sefer URL tahmin edilmesi daha zor, `robots.txt`'de de yok. Adresi sitenin JavaScript kodunun içinde buldum. Yani ikinci bakılacak yer: sayfanın kaynak kodu. Admin kontrolü frontend'de mi yapılıyor diye bakıyoruz. Burada öyleydi; JS tarafında "admin mi?" kontrolü yapılıp panele yönlendiriliyordu, dolayısıyla adres de kodun içinde duruyordu.

## Lab 3 — [User role controlled by request parameter](https://portswigger.net/web-security/access-control/lab-user-role-controlled-by-request-parameter)

Bundan sonrası request'i değiştirmekle ilgili. Bu lab'de admin kontrolü cookie içindeydi. Cookie'deki `Admin` değerini `true` yapınca admin olduk ve bir kullanıcıyı sildik. Cookie'yi her istekte elle değiştirmek yerine Burp'ün Match & Replace özelliğini kullanmıştım, onu [ayrı bir notta](/tr/posts/burp-match-and-replace/) anlattım.

## Lab 4 — [User role can be modified in user profile](https://portswigger.net/web-security/access-control/lab-user-role-can-be-modified-in-user-profile)

Burada Burp'te request'i incelerken bir `roleid` olduğunu fark ettim. `roleid`'yi değiştirerek admin olup olamayacağımı test ettim; `roleid`'yi 2 yapınca sitede admin paneli göründü. Üstelik bu değişikliği e-posta güncelleme request'inde yapabildim, yani bir POST update request'iydi.

## Lesson learned

> Buraya kadar çıkardığım kontrol listesi şu:
> - `robots.txt`'ye bak
> - sayfanın kodlarına (JavaScript dahil) bak
> - request'leri incele
> - cookie, JSON gibi değerleri değiştirebiliyor musun diye kontrol et
