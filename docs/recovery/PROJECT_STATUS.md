# Bumper Karma Marketplace — Project Status & Checklist

Single source of truth for the recovery and completion work. Updated as work is done.
Last updated: 2026-10-20.

Legend: ✅ verified · 🟡 partial / unverified · ❌ broken or insecure · ⬜ missing · ⏸ waiting on owner

## Where things are

| Item | Location / state |
|---|---|
| Production code | GitHub `main` @ `b666e69` (unchanged) |
| Backup of original code | GitHub branch `backup/main-2026-10-20` @ `b666e69` (do not change) |
| Working branch | GitHub `recovery/stage-2-security` (not deployed, not merged) |
| Owner's checkpoint tags | 12 tags (e.g. `orders-system-complete`), untouched |
| Database | Supabase project `bumper-karma-marketplace` (Free plan) |
| Deployment | ⏸ Unknown — no deployment config in the repo; owner to confirm host/URL |
| Build check | GitHub Actions "Build check" on `recovery/**` branches only (no deploy, placeholder env) |

## 1. Overall status
Early prototype. Accounts, product listing and a basic order record exist; no payments,
no seller approval, no admin, no moderation, no fulfillment. Original `main` does not build
(verified on GitHub's servers, 2026-10-20).

## 2. Verified working
- ✅ Sign up / log in at `/signup`, `/login` (Supabase Auth) — code reviewed, not click-tested
- ✅ Database: buyers can only see their own orders; users cannot change or delete orders (live test 2026-10-19)
- ✅ Database: order totals calculated from real prices by `place_order` (live test 2026-10-19)
- ✅ Database: negative prices blocked; image uploads limited to 5 MB, image types (applied 2026-10-19)
- ✅ No secrets committed to GitHub

## 3. Partial or broken
| Area | Status | Notes |
|---|---|---|
| Build | ❌ on `main` · 🟡 on working branch | see build results below |
| Explore / product list | 🟡 | Works, but shows no images or seller info |
| Product page `/products/[id]` | 🟡 | No image shown; fixed seller field on branch |
| Cart | ❌ main · 🟡 branch | +/−/Remove acted on wrong items; fixed on branch |
| Checkout | ❌ main · 🟡 branch | Browser set the total; branch uses `place_order` |
| Order details `/orders/[id]` | ❌ main · 🟡 branch | Used a client with no login; fixed on branch |
| Creator orders | ❌ | Database rules hide other buyers' orders from sellers, so sellers see nothing |
| Product create | 🟡 | Works; cents fail (price is whole dollars); publishes instantly, no review |
| Image upload | ❌ | `/dashboard/upload` sends to Cloudinary but result is never saved to a product |
| Seller dashboard `/dashboard/*` | ⬜ | "Coming soon" pages |
| `/api/products/[id]` | ❌ | Returns a hard-coded fake product |

## 4. Missing
Creator applications & approval · admin area & roles · moderation (hard rule) · payments ·
commissions · payouts · refunds/disputes · shipping/tracking/fulfillment · seller terms,
returns policy, prohibited-content policy · search/filter · product images on pages.

## 5. Security issues
| # | Issue | Status |
|---|---|---|
| S1 | Browser could set order totals | ✅ fixed in database (`place_order`); 🟡 checkout code on branch |
| S2 | Any logged-in user can read ALL order items | ⏸ held until new checkout is live |
| S3 | Any logged-in user can create orders with made-up totals directly | ⏸ held until new checkout is live |
| S4 | Any logged-in user can delete/upload any stored file | ⏸ proposal ready (`proposed/c3_storage_ownership_*.sql`), awaiting approval |
| S5 | `/api/upload` open to logged-out visitors, any file | 🟡 fixed on branch (login, images, 5 MB) |
| S6 | No links (foreign keys) between orders, items, products | ❌ 27 of 37 order items point to deleted orders |
| S7 | Leaked-password protection | ⏸ paid feature; free alternative (password rules) needs owner click |
| S8 | No admin role / server-side admin checks | ⬜ Stage 4 |
| S9 | Products publish instantly with no moderation | ⬜ Stage 3/4 (hard rule) |

## 6. Files changed (working branch only)
See `git diff backup/main-2026-10-20..recovery/stage-2-security`. Each commit message explains its purpose.

## 7. Database changes
| Change | Proposed | Applied | Verified |
|---|---|---|---|
| Stage A: `place_order`, price ≥ 0, bucket limits | ✅ | ✅ 2026-10-19 | ✅ 13/13 live test |
| Storage ownership rules (v3) | ✅ | ⏸ | practice copy 18/18 |
| Order-item / order permission fixes (S2, S3) | planned | ⏸ | — |

Rollback scripts in `docs/recovery/rollback/` and `docs/recovery/proposed/` — they RESTORE the original vulnerabilities.

## 8. Tests and results
See the status report in the conversation and the build-check runs on GitHub (Actions tab).

## 9. Needed from the owner
See "Decisions" in the latest status report.

## 10. Next stage
Stage 2 (security & data integrity) continues; then Stage 3 (core workflow).
