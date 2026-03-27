# Deterministic Fixtures Catalog

## Muc Tieu

Chot fixture catalog dung chung cho pricing, dispatch, va state transition tests trong backend plan.

## Nguyen Tac

- fixture phai co ten on dinh va y nghia ro
- du lieu phai lap lai duoc tren local reset
- khong dung random coordinates trong smoke hoac integration tests

## Fixture Groups

### 1) Accounts

- `acct_user_demo_01`
- `acct_driver_demo_near_01`
- `acct_driver_demo_far_01`
- `acct_driver_demo_busy_01`
- `acct_admin_demo_01`

### 2) Coordinates

- `pickup_A`
- `dropoff_A`
- `driver_near_A`
- `driver_far_A`
- `driver_stale_A`

Rule:
- distance bucket can su dung cho test la: `near`, `mid`, `far`
- stale fixture phai co `last_seen_at` vuot freshness window

### 3) Quotes

- `quote_valid_A`
- `quote_expired_A`
- `quote_invalid_payload_A`

Rule:
- quote fixtures phai dinh nghia ro pricing version va expires_at

### 4) Orders

- `order_created_A`
- `order_searching_A`
- `order_assigned_A`
- `order_no_driver_found_A`

Rule:
- moi fixture state phai co timeline entries toi thieu

### 5) Dispatch Attempts

- `attempt_offered_A`
- `attempt_expired_A`
- `attempt_declined_A`
- `attempt_conflict_lost_A`

Rule:
- response_reason phai phan biet duoc timeout, declined, stale, conflict

## Mapping Theo Phase

- `BE-P02`: dung accounts + coordinates + quotes + orders
- `BE-P03`: dung accounts + coordinates + dispatch attempts
- `BE-P04`: dung orders + dispatch attempts cho investigation reads
- `BE-P05`: dung accounts + onboarding fixtures
- `BE-P06`: dung orders + chat membership fixtures

## Verification Hooks

Moi task dung fixture phai ghi ro:
- fixture id
- expected outcome
- verification mode

## TODO Cho Implementation Plan

- bo sung file SQL/JSON fixture ids tuong ung voi catalog nay
- chot exact lat/lng va distance thresholds trong app-level test assets
