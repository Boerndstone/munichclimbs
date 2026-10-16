# Protected write contract

Updated: 2026-10-16

## Decision

Next.js remains read-only during the migration. It does not receive upload
credentials, an authenticated browser session, or a write API. Public photo
uploads and rock-improvement messages stay owned by the Symfony frontend until
a separately designed authenticated API is approved.

The legacy entry route `/upload-photo` (and its German/English aliases) is a
permanent redirect to the Symfony home page; it accepts no upload. The only
active public writes are the two CSRF-protected forms embedded in the Symfony
rock page at `/{areaSlug}/{rockSlug}` and `/en/{areaSlug}/{rockSlug}`.

| Flow | Storage / effect | Owner |
| --- | --- | --- |
| Rock improvement | Sends a structured email to `admin@munichclimbs.de`; it does not mutate public rock/route data. | Symfony frontend + mailer; editorial follow-up is manual. |
| Gallery contribution | Re-encodes the uploaded image, creates a `Photos` record with `status = pending`, and stores uploader/contact metadata. | Symfony frontend; an authenticated backoffice administrator approves or rejects it. |

## Protections

- **Authentication:** contributions intentionally remain anonymous. Admin review lives under `/admin` and requires `ROLE_ADMIN`; public API reads expose only photos with `status = approved`.
- **CSRF:** both Symfony forms use the stateless `submit` CSRF token configured in `apps/frontend/config/packages/csrf.yaml`. A missing or invalid token prevents form validity and therefore any write.
- **Validation:** server-side form/DTO validation requires the relevant rock/name/route data, validates email when supplied, constrains text lengths, rejects a filled honeypot, and limits images to 10 MB of JPEG, PNG, WebP, or GIF. The image processor re-encodes accepted uploads before the pending record is persisted.
- **Authorization / integrity:** gallery route selection is checked against the selected rock before it is saved. The selected rock comes from the route rather than a form-controlled foreign key.
- **Rate limiting:** `public_contribution` is a fixed window of five submissions per hour, keyed by client IP and rock ID. Both forms consume the same bucket, including invalid submissions, so alternating form types cannot evade the limit. A rate-limited request makes no mail, file, or database write and receives a translated error flash.
- **Moderation:** uploads are pending by default. Approval/rejection is a separate authenticated backoffice action; the public visibility extension filters pending and rejected uploads from all public photo reads.

## Migration boundary

The Next application must link users to these retained Symfony flows if a
contribution UI is exposed before a replacement is authorized. It must not
post to `/api/v1`, upload directly to object storage, or attempt to replay the
Symfony CSRF contract cross-origin.

A future write API requires a separate security design covering authenticated
identity, CSRF/origin policy, request schemas, per-account and per-IP limits,
malware/content scanning, direct-upload authorization, moderation states,
audit records, and on-demand Next cache invalidation.

## Verification

The retained implementation is verified by:

1. Symfony container validation, which resolves the named `public_contribution` limiter.
2. Route inspection, confirming both rock routes accept `GET` and `POST` while `/upload-photo` only redirects.
3. Form validation tests/manual browser checks for missing CSRF, invalid image MIME/size, filled honeypot, and an unrelated route ID.
4. Five successful/invalid attempts for one IP/rock followed by a sixth request, which must display the rate-limit flash and create no mail/photo record.
5. A gallery submission that remains absent from `GET /api/v1/photos` until an authenticated admin approves it.
