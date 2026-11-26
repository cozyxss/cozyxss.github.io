---
no: 3
title: "Vertical Privilege Escalation: The First 4 Labs"
summary: "My notes from the first four vertical privilege escalation labs: hidden admin panels, access checks done on the frontend, and changing your role through the request."
series: Access Control
part: 1
tags: [access control, portswigger, privilege escalation]
---

I solved the first 4 access control labs, all four on vertical access control and all at Apprentice level. As a quick reminder, vertical access control is about users with different roles getting access to different functions and resources; the attack here is pushing your access up to a higher role. A customer shouldn't be able to reach admin functionality. In all four labs the goal was the same: get into the admin panel.

Here are the notes I took while solving them.

## Lab 1 — [Unprotected admin functionality](https://portswigger.net/web-security/access-control/lab-unprotected-admin-functionality)

Here the admin panel may be hidden, but it isn't protected. We can find the URL inside `robots.txt`. Once you browse to that address the panel opens, because there's no "is this user actually an admin?" check. So anyone who knows the URL can reach the admin actions.

## Lab 2 — [Unprotected admin functionality with unpredictable URL](https://portswigger.net/web-security/access-control/lab-unprotected-admin-functionality-with-unpredictable-url)

This time the URL is harder to guess and it isn't in `robots.txt` either. I found the address inside the site's JavaScript code. So the second place to look is the page's source. We check whether the admin control is done on the frontend. It was here; the JS was checking "is this an admin?" and redirecting to the panel, so the address was sitting right there in the code.

## Lab 3 — [User role controlled by request parameter](https://portswigger.net/web-security/access-control/lab-user-role-controlled-by-request-parameter)

From here on it's about changing the request. In this lab the admin check was inside the cookie. Setting the `Admin` value in the cookie to `true` made us admin, and we deleted a user. Instead of editing the cookie by hand on every request, I used Burp's Match & Replace feature, which I covered in a [separate note](/posts/burp-match-and-replace/).

## Lab 4 — [User role can be modified in user profile](https://portswigger.net/web-security/access-control/lab-user-role-can-be-modified-in-user-profile)

Here, while inspecting the request in Burp, I noticed a `roleid`. I tested whether I could become admin by changing it; setting `roleid` to 2 made the admin panel show up on the site. On top of that, I could make this change in the email-update request, so it was a POST update request.

## Lesson learned

> The checklist I ended up with so far:
> - check `robots.txt`
> - check the page's code (including JavaScript)
> - inspect the requests
> - see whether you can change values like cookies or JSON
