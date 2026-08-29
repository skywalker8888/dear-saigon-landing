# Dear Saigon safe takeout foundation

Status: `LOCAL PREVIEW / NOT PUBLISHED`

This branch intentionally fails closed while Clover-native Online Ordering is unavailable in the current merchant dashboard.

## What this local preview fixes

- Removes every online-order button that currently routes to Google Maps.
- Removes direct-order, pickup-time, fee, price, loyalty, catering, rating, and social-count claims that do not have current scoped approval.
- Uses the owner-confirmed regular hours, Burlington public address without the internal-only unit, and ordinary customer voice line.
- Shows only two menu names already present in the scoped owner-confirmed nine-name tranche, without prices or availability claims.
- States plainly that direct online ordering is not enabled on the page.

## What remains blocked

- Clover-native Online Ordering eligibility or provisioning.
- Current Clover menu identity, prices, taxes, modifiers, availability, and pickup rules.
- Payment, receipt, printer or kitchen-routing test.
- Exact photo reuse and website publication approval.
- A public Clover storefront URL.
- Release owner approval, deployment evidence, rollback evidence, and live verification.

## Activation rule

Do not add or publish an online-order link until an owner-approved Clover storefront has passed private phone and desktop review plus the separately authorized end-to-end order, payment, and printer test.

No push, pull request, deployment, public edit, account change, order, payment, or customer-data access is part of this branch.
