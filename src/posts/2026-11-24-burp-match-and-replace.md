---
no: 2
title: "Auto-Changing a Cookie with Burp Match & Replace"
summary: "While solving a lab I got tired of editing Admin=false in the cookie by hand on every request. Burp's Match and Replace feature does it for me."
tags: [burp, access control, portswigger]
---

I was testing a cookie-based access control. The goal was a simple privilege escalation: change `Admin=false` to `Admin=true` and try to reach the admin functionality.

The annoying part was intercepting every request and fixing the cookie by hand. I kept repeating the same edit on every click. Burp's **Match and Replace** feature is made exactly for this: you define a rule once, and Burp applies that change on every request for you.

## How I set up the rule

I went to Proxy → **Settings → Match and Replace** and added a new rule:

- **Type:** Request header
- **Match:** `Admin=false`
- **Replace:** `Admin=true`
- **Regex match:** No (plain text is enough)
- **Comment:** Admin Cookie Bypass

![Burp Match and Replace rule changing Admin=false to Admin=true](/images/002/match-replace-rule.png)

## How it works

After saving the rule I didn't have to touch anything by hand. When I refreshed the page (F5), the cookie in the outgoing requests automatically became `Admin=true`. One important detail: this change only happens on the **outgoing request**, it doesn't touch the cookie stored in the browser. So the rule kicks in again on every request.

To confirm it, I checked a few requests in **HTTP history** to make sure the cookie really went out modified.

## Lesson learned

> If you're making the same edit on every request, stop: Match and Replace lets you define it once and automate it. The change happens on the outgoing request; the cookie in the browser stays the same.
