---
no: 1
title: "Access Control Nedir?"
summary: "PortSwigger access control konusuna başlarken aldığım notlar: erişim kontrolü nedir ve vertical, horizontal, context-dependent türleri arasındaki fark."
series: Access Control
part: 0
tags: [access control, portswigger]
---

Erişim kontrolü, bir kullanıcının hangi işlemleri yapabileceğini ve hangi kaynaklara erişebileceğini sınırlayan kurallardır. Web uygulamalarında üç adıma dayanır:

- **Authentication:** Kullanıcının iddia ettiği kişi olduğunu doğrular. *(Sen kimsin?)*
- **Session management:** Sonraki her isteğin o kullanıcıya ait olduğunu tanır. *(Bu istek kimden geliyor?)*
- **Access control:** O kullanıcının bu işlemi yapmaya yetkisi olup olmadığına karar verir. *(Buna iznin var mı?)*

Bu kurallar insanlar tarafından tasarlanıp koda döküldüğü için hataya çok açıktır. Bu yüzden broken access control en yaygın ve en kritik açıklardan biridir.

## Access control türleri nelerdir?

### Vertical (dikey) erişim kontrolü

Farklı rollerdeki kullanıcıların farklı fonksiyonlara erişmesidir. Soru şu: *"Bu kullanıcı bu işlemi yapabilir mi?"*

- **E-ticaret:** Müşteri sipariş verip ödeme yapar, satıcı ürün ekleyip fiyat değiştirir, admin satıcı hesabını kapatır.
- **Hastane:** Hemşire reçeteyi görür, ama sadece doktor reçete yazabilir.
- **Açık:** Müşteri `/admin/products/edit` adresine gidip fiyat değiştirebiliyorsa bu bir *vertical privilege escalation*.

### Horizontal (yatay) erişim kontrolü

Aynı yetkideki kullanıcıların, aynı türdeki kaynaklardan sadece kendilerine ait olanlara erişmesidir. Soru şu: *"Bu kayıt bu kullanıcının mı?"*

- **E-ticaret:** Ayşe de Mehmet de "Siparişlerim" sayfasını kullanır, ama Ayşe Mehmet'in siparişini göremez.
- **Banka:** Herkes hesap dökümü görür, ama sadece kendi hesabının dökümünü.
- **Açık:** Adresteki sipariş numarası değiştirilince başkasının siparişi açılıyorsa bu bir *horizontal privilege escalation* (IDOR).

```http
GET /orders?id=1001 HTTP/2
```

Bu benim siparişim. `id=1002` yazınca başkasının siparişi açılmamalı.

### Context-dependent (duruma bağlı) erişim kontrolü

Bir işlemin yapılıp yapılamayacağı, uygulamanın o anki durumuna ve adımların sırasına bağlıdır. Soru şu: *"Bu işlem şu aşamada yapılabilir mi?"*

- **E-ticaret:** Ödeme yapıldıktan sonra sepetteki ürün ya da adet değiştirilemez.
- **Para transferi:** Onay ekranından sonra tutar değiştirilemez, SMS doğrulama adımı atlanamaz.
- **Açık:** Ödeme adımı atlanıp doğrudan "siparişi tamamla" isteği gönderilebiliyorsa context-dependent kontrol kırılmış demektir.

## Lesson learned

> Vertical **ne yapabildiğini**, horizontal **kimin verisine erişebildiğini**, context-dependent ise **ne zaman yapabildiğini** kontrol eder.
