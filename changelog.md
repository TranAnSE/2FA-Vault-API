# Change log

## [1.15.0] - 2026-09-12

Companion spec bump for the **2FA-Vault upstream v8 sync release**. Drift check
remains at 0 (`php artisan 2fauth:openapi-drift`).

### Added

- `show_in_chips` (boolean) on the `GroupRead`/`GroupStore`/`GroupCollection`
  schemas — groups can now be pinned as chips on the main accounts view.
  Virtual groups (All) always report `false`.

### Changed

- `withSecret` query parameter (twofaccounts) is now policy-gated: only users
  holding the `readSecret` permission (the account owner) get secret fields;
  shared-account team members receive them omitted. Parameter description
  updated accordingly.

## [1.14.0] - 2026-09-02

Companion spec bump for the **2FA-Vault v1.3.1 workflow-audit fix release**. Drift
check remains at 0. New endpoints model the repaired/completed features:

### Added

- `post /api/v1/encryption/credentials` + `post /api/v1/encryption/bulk-secrets` —
  the two-step master-password rotation flow (client re-encrypts everything; the
  server never sees the password or key).
- `get /api/v1/emergency-contacts/grantee-key-info` — grantee RSA public key lookup
  so the owner's client can wrap the vault key at designation time.
- `get /api/v1/emergency-contacts/{contactId}/vault-data` — read-only emergency
  vault data for an active contact's grantee; fails closed with
  409 `emergency_key_unavailable` on stale/missing wrapped keys.
- `post /api/v1/vaults/{vaultId}/unlock` — the missing counterpart of the lock
  route (a vault locked via the API could previously never be unlocked).

### Changed

- `post /api/v1/backups/import` — format-2 envelopes must be decrypted client-side
  before upload (undecrypted v2 → 422, no silent legacy fallback); the response now
  reports `encrypted_count`, `key_mismatch_warning`, `legacy_format_warning` and
  `imported_account_ids`.

> **Snapshot policy note:** Versioned `2fauth-api-v<x.y.z>.yaml` snapshots are
> committed for each release. The `v1.9.0` and `v1.10.0` snapshots were not
> preserved on disk at their release time (their changelog entries below
> describe what changed). The `2fauth-api-latest.yaml` always mirrors the
> newest released version, and the public docs API viewer reflects the
> snapshots that actually exist.

## [1.13.0] - 2026-08-08

Companion spec bump for the **2FA-Vault v1.3.0 release**. Reconciles the spec against the live Laravel route table (now verified by `php artisan 2fauth:openapi-drift`, which reports 0 drift) and documents the outbound webhook payloads via the OpenAPI `webhooks:` keyword.

### Added

- `patch` operations on `/twofaccounts/{id}`, `/groups/{id}`, `/tags/{id}`, `/secure-notes/{id}` (the apiResource partial-update verb, previously undocumented).
- `patch /twofaccounts/{id}/owner` — direct 2FA account ownership transfer.
- `post /teams/{id}/transfer` — team ownership transfer for offboarding.
- `get` + `delete /otp-logs` (OTP generation audit log) and the `OtpLog` schema.
- A top-level `webhooks:` section modeling the 13 outbound event deliveries (event/timestamp/data body, `X-2FA-Vault-Event` and `X-2FA-Vault-Signature` headers, full `WebhookEvent` enum table) and a `WebhookDeliveryPayload` schema.

### Removed

- `post /secure-notes/{id}/pin` — no pin route is registered; secure-notes is a plain apiResource. (Documented only; never shipped.)

### Fixed

- `2fauth-api-v1.11.0.yaml` snapshot resynced to the corrected content.

## [1.11.0] - 2026-06-14

Companion spec bump for the **2FA-Vault v1.2.0 feature release**. The paths and schemas below back the v1.2.0 features: Account Notes (`notes`), Favorites/Pinned (`is_pinned`), Personal Audit Log (`activity`), Auto-Backup (`backup-destinations`), Email Invitations (`invitations`), Session Management (`sessions`), Secure Notes (`secure-notes`), and Prometheus observability (`metrics`).

### Added

- `notes` (string, nullable) and `is_pinned` (boolean) properties to the `2FAccountStore`, `2FAccountUpdate`, and `2FAccountRead` schemas
- `PersonalActivityLog` schema and `/api/v1/user/activity` GET + DELETE paths
- `UserSession` schema and `/api/v1/user/sessions` GET + `/api/v1/user/sessions/{id}` DELETE paths
- `UserInvitation` + `UserInvitationStore` schemas and `/api/v1/user/invitations` GET + POST + `/api/v1/user/invitations/{id}` DELETE paths (admin only)
- `UserBackupDestination` + `UserBackupDestinationStore` schemas and `/api/v1/user/backup-destinations` GET + POST + `/{id}` PUT + DELETE + `/{id}/test` POST paths
- `SecureNote` + `SecureNoteStore` schemas and `/api/v1/secure-notes` GET + POST + `/{id}` PUT + DELETE + `/{id}/pin` POST paths
- `/metrics` GET path (Prometheus text exposition format; IP allowlist or bearer token auth)
- New tags: `activity`, `backup-destinations`, `invitations`, `metrics`, `secure-notes`, `sessions`

## [1.10.0] - 2026-05-08

### Added

- 2FA-Vault fork metadata in the latest OpenAPI document
- `/api/v1/twofaccounts/count` GET path
- `/api/v1/twofaccounts/{id}/counter` PATCH path for HOTP counter sync
- `/api/v1/encryption/setup`, `/salt`, `/status`, `/verify`, `/lock`, and `/disable` paths
- `/api/v1/features` and `/api/v1/features/{name}` paths
- `/api/v1/backups/*` encrypted backup paths
- Legacy `/api/v1/backup/*` aliases
- `/api/v1/push/*` web push subscription paths
- `/api/v1/teams/*` team, invitation, member, and account-sharing paths
- `/api/v1/admin/users/*` administrator UI aliases
- `steamtotp` as a documented `otp_type`

## [1.9.0] - 2026-01-10

### Added

- `/api/v1/icons/packs` GET path
- `/api/v1/groups/reorder` POST path

### Fixed

- Missing `orderedIds` property in `/api/v1/twofaccounts/reorder` POST response

## [1.8.0] - 2025-06-18

### Added

- `/api/v1/icons/default` POST path

## [1.7.0] - 2025-03-27

### Added

- `403` response for the PUT operation of path `/api/v1/user/preferences/{name}`
- `409` response for the POST operation of path `/api/v1/groups/{id}/assign`
- `locked` property in the `userPreference` model

## [1.6.0] - 2024-11-08

### Added

- New `otpauth` query parameter for the GET operation of path `/api/v1/twofaccounts/export` to force data export as otpauth URIs instead of the 2FA-Vault json format.

## [1.5.0] - 2024-09-27

### Added

- New `group_id` property for POST and PUT operations of the `/api/v1/twofaccounts` path

## [1.4.0] - 2024-05-14

### Added

- `/api/v1/users/{id}/authentications` GET path

## [1.3.0] - 2024-03-15

### Added

- `/api/v1/users` paths
- `oauth_provider` property to the response body of `/api/v1/user` GET path

## [1.2.0] - 2023-12-22

### Added

- `/api/v1/user` GET path
- `ids` and `withOtp` query parameters to the `/api/v1/twofaccounts` GET path

## [1.1.0] - 2023-03-23

### Added

- `/api/v1/user/preferences` GET path
- `/api/v1/user/preferences/{name}` GET & PUT paths
- `/api/v1/twofaccounts/export` GET path
- `/api/v1/twofaccounts/migration` POST path
- Error 500 to file upload endpoints responses

### Changed

- Identify Settings endpoints as Admin only endpoints with tags
- Request body for Icon & QRcode POST are now binary format
- Update QR code paths descriptions

### Deprecated

- `/user/name` GET path

### Removed

- 404 response from `/api/v1/twofaccounts/otp` POST path

## [1.0.0] - 2022-04-13

Initial release
