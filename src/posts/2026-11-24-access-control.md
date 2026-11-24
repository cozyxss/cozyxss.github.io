---
no: 1
title: "What Is Access Control?"
summary: "My notes from starting the PortSwigger access control topic: what access control is, and how vertical, horizontal and context-dependent controls differ."
series: Access Control
part: 0
tags: [access control, portswigger]
---

Access control is the set of rules that decides which actions a user can perform and which resources they can reach. In web applications it relies on three steps:

- **Authentication:** Confirms the user is who they claim to be. *(Who are you?)*
- **Session management:** Recognizes that each following request belongs to that user. *(Who is this request from?)*
- **Access control:** Decides whether that user is allowed to do this action. *(Are you allowed to do this?)*

These rules are designed by people and turned into code by people, so they are very easy to get wrong. That is why broken access control is one of the most common and most critical vulnerabilities.

## What are the types of access control?

### Vertical access control

Users with different roles get access to different functions. The question is: *"Can this user do this action?"*

- **E-commerce:** A customer places and pays for orders, a seller adds products and changes prices, an admin closes a seller's account.
- **Hospital:** A nurse can see a prescription, but only a doctor can write one.
- **Vulnerability:** If a customer can open `/admin/products/edit` and change a price, that is *vertical privilege escalation*.

### Horizontal access control

Users with the same permissions can reach resources of the same type, but only the ones that belong to them. The question is: *"Does this record belong to this user?"*

- **E-commerce:** Ayşe and Mehmet both use the "My orders" page, but Ayşe can't see Mehmet's orders.
- **Bank:** Everyone can see account statements, but only for their own account.
- **Vulnerability:** If changing the order number in the URL opens someone else's order, that is *horizontal privilege escalation* (IDOR).

```http
GET /orders?id=1001 HTTP/2
```

This is my order. Changing it to `id=1002` must not open someone else's order.

### Context-dependent access control

Whether an action is allowed depends on the current state of the application and the order of the steps. The question is: *"Can this action be done at this stage?"*

- **E-commerce:** After payment, the items or quantities in the cart can't be changed.
- **Money transfer:** After the confirmation screen the amount can't be changed, and the SMS verification step can't be skipped.
- **Vulnerability:** If you can skip the payment step and send the "complete order" request directly, context-dependent access control is broken.

## Lesson learned

> Vertical controls **what you can do**, horizontal controls **whose data you can reach**, and context-dependent controls **when you can do it**.
