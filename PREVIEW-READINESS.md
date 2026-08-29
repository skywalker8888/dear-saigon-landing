# Dear Saigon landing — preview readiness

Status: `LOCAL REVIEW READY / DEPLOYMENT BLOCKED`

## Intended slice

This is a visit-information website for Dear Saigon in Burlington, Ontario. It provides the owner-confirmed public address, regular weekly hours, restaurant phone, Google listing link, and a limited names-only menu preview.

It does not provide online ordering, checkout, payment, price, availability, third-party ordering, reservations, catering submission, or a customer form.

## Local acceptance checks

- Fail-closed content and link tests pass.
- The official public name is **Dear Saigon**; Burlington, Ontario is a location descriptor.
- The internal-only unit and timezone are absent from customer-facing content.
- Calculated open/closed claims are absent because holiday and temporary exceptions are not verified.
- The page identifies regular hours as a schedule and warns that holiday hours may differ.
- External customer actions are limited to the owner-confirmed phone number and exact Google listing.
- No third-party script, font, analytics, form, ordering, payment, or tracking dependency is present.
- Referenced local images exist, but photo reuse/publication approval remains a separate release gate.
- Essential content remains visible when JavaScript, motion, or observers fail.

## Vercel preview plan — not authorized for execution by this file

1. Review the exact local diff and create a new exact commit only after owner approval.
2. Re-run the test suite and record the commit SHA and parent.
3. Resolve the Vercel account mismatch: the browser-visible target is `sky-1cae`, while the current CLI/connector identity cannot access that scope.
4. Use a one-time **Preview** deployment of the exact reviewed commit. Do not import or configure a path that creates a Production deployment.
5. Require deployment protection or another verified access restriction while photo reuse/publication approval remains open.
6. Confirm the preview has a noindex response and no production/custom-domain alias.
7. Verify at desktop and mobile widths: content, navigation, phone link, Google link, images, no horizontal overflow, no browser errors, and no unexpected network requests.
8. Record the preview deployment ID, URL, source commit, protection state, and deletion/rollback path.
9. Keep merge, production promotion, public link sharing, analytics, domains, and Clover activation blocked until separately approved.

## Remaining release gates

- Exact photo reuse/publication approval.
- Preview deployment account and protection proof.
- Owner review of the exact preview.
- Clover-native eligibility/provisioning evidence.
- Full menu, prices, modifiers, taxes, availability, pickup rules, and operational truth.
- Separately approved order/payment/printer test.
- Separate merge and production approvals.

This file is a plan and evidence checklist. It does not authorize or perform any external action.
