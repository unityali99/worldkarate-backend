# WorldKarate Video Delivery & Security Architecture Plan

This document records the locked architectural decisions, domain models, storage setup, API contracts, and roadmap for protected video streaming on the WorldKarate platform.

---

## 1. Core Architectural Decisions

| Decision | Chosen Solution | Rationale / Invariant |
|---|---|---|
| **Video Protection** | HLS + AES-128 Encryption | Slices video into 4-second `.ts` segments encrypted with AES-128. Public chunks in storage are ciphertext; downloading them via IDM or scripts yields unplayable files. |
| **Key Granularity** | Unique 16-byte key per lesson | Caps the blast radius of any key leak to a single lesson, preventing full-catalog compromise. |
| **Key Storage** | Wrapped at rest in Postgres (`LessonKey`) | Encrypted with `KEYS_MAIN_KEY` (AES-256-GCM). Isolated in its own table so standard lesson queries never load key bytes. Never stored in S3. |
| **Domestic Infrastructure** | ArvanCloud (`ir-central1`) | CloudFront dropped due to lack of edge nodes in Iran and sanction risks. Storage and delivery operate reliably inside Iran even during international connectivity throttling. |
| **Storage Architecture** | Two-Bucket Strategy | **Private Bucket** (`worldkarate`): for encrypted `hls/` chunks and original raw `masters/`.<br/>**Public Bucket** (`worldkarate-content`, listing off): for marketing assets (`media/` covers, trailers, images) requiring permanent, shareable, cacheable URLs. |
| **Token Mechanism** | 10-Minute JWT Playback Ticket | Signed with dedicated secret (`PLAYBACK_TOKEN_SECRET`). Contains `{ lid, cid, uid?, prv, exp }`. Authorizes reading the rewritten manifest and key without exposing long-lived access or complex cross-origin cookie issues. |
| **Manifest Delivery** | Express API rewriting | Stored manifests hold placeholder `__KEY_URI__`. The API validates the ticket, injects `/course/:cid/lesson/:lid/key?t=<ticket>`, rewrites segment paths, and serves with `Cache-Control: no-store`. |
| **Interruption & Resuming** | Player-side auto-retry & re-mint | `hls.js` configured with retry logic. On 403 (e.g., segment signature or ticket expiration after long pauses), the player silently re-requests `/playback` and resumes from the current playback timestamp. |

---

## 2. Content Hierarchy & Invariants

```
COURSE (Commercial & catalog root)
  │  - title, price, cover, trailer, description
  │  - style relations (kata, kumite, etc.)
  │  - publishedAt (null = draft, invisible to students)
  │  - deletedAt (soft-delete preserves transaction history)
  │
  └── SECTION (Module grouping)
        │  - title, position, description
        │  - NO video, NO keys, NO individual price
        │
        └── LESSON (Playback & learning unit)
              - title, position, durationSec
              - isPreview (boolean: free teaser lesson)
              - assetPrefix (hls/{cid}/{lid}/{hash})
              - masterKey (path to raw upload in private bucket)
              - processState (NONE | UPLOADED | PROCESSING | READY | FAILED)
              - LessonKey (wrapped AES key)
              - LessonProgress (per-user resume position)
```

---

## 3. Storage & Bucket Configuration

- **Private Bucket**: `worldkarate.s3.ir-central1.arvanstorage.ir`
  - Access: Private (All anonymous requests return 403).
  - Prefixes:
    - `hls/{courseId}/{lessonId}/{random8}/`: Encrypted `.ts` chunks + `master.m3u8`.
    - `masters/{courseId}/{lessonId}.mp4`: Uploaded raw video pending encoding.
- **Public Bucket**: `worldkarate-content.s3.ir-central1.arvanstorage.ir`
  - Access: Public-read enabled, anonymous `ListBucket` disabled.
  - Prefixes:
    - `media/courses/{courseId}/cover.jpg`: Permanent public course thumbnails.
    - `media/courses/{courseId}/trailer.mp4`: Marketing preview trailers.

---

## 4. Video Processing & Publishing Pipeline

Because hosting environments like Render free tier lack the RAM and CPU to execute heavy video transcode jobs:
1. **Instructor Action**: Instructor uploads raw `.mp4` video via the instructor panel (resumable multipart upload directly to the private bucket under `masters/`). The lesson row is created with `processState = UPLOADED`.
2. **Admin Claim**: Admin CLI / worker process fetches pending lessons (`GET /pipeline/pending`) and claims one (`POST /pipeline/claim/:lessonId`), setting `processState = PROCESSING`.
3. **Packaging**: The worker downloads the raw master, generates a random 16-byte AES key (`openssl rand 16`), packages into 4s independent HLS segments using FFmpeg, and uploads the ciphertext segments to `hls/{cid}/{lid}/{rand}/`.
4. **Completion**: The worker calls `POST /pipeline/complete/:lessonId` with `durationSec`, `assetPrefix`, and the raw AES key. The backend wraps the key with `KEYS_MAIN_KEY`, inserts into `LessonKey`, and marks `processState = READY`.

---

## 5. API Endpoints Specification

| Method | Path | Auth | Purpose | Response |
|---|---|---|---|---|
| `GET` | `/course/:id/outline` | Optional | Course sections & lessons tree with `locked` & `positionSec` status | `200 { sections: [...] }` |
| `GET` | `/course/:id/lesson/:lessonId/playback` | Optional (checks `isPreview` or enrollment) | Authorizes playback and issues short-lived manifest URL | `200 { manifestUrl, expiresAt }` |
| `GET` | `/course/:id/lesson/:lessonId/manifest?t=` | Ticket required | Returns rewritten `.m3u8` with injected key URL and segment locations | `200 application/vnd.apple.mpegurl` (`no-store`) |
| `GET` | `/course/:id/lesson/:lessonId/key?t=` | Ticket + Access check | Serves 16-byte raw AES decryption key | `200 application/octet-stream` (`no-store`) |
| `PUT` | `/course/:id/lesson/:lessonId/progress` | User auth required | Updates playback position & checks completion (`durationSec - 5s`) | `204 No Content` |
| `GET` | `/pipeline/pending` | Admin / Worker token | Lists lessons waiting for transcode processing | `200 { pending: [...] }` |
| `POST` | `/pipeline/claim/:lessonId` | Admin / Worker token | Claims lesson and transitions state to `PROCESSING` | `200 { lesson }` |
| `POST` | `/pipeline/complete/:lessonId` | Admin / Worker token | Submits transcode artifacts, stores wrapped key, sets `READY` | `200 { success: true }` |

---

## 6. Implementation Milestones

- **M1**: Schema migration for `Course.publishedAt` and `Lesson.processState` pipeline fields.
- **M2**: Access resolver (`canPlay`), playback ticket generation, `outline` and `playback` routes.
- **M3**: Manifest rewriting and AES key delivery endpoints + Arvan S3 integration.
- **M4**: Playback progress tracking (`LessonProgress`) and course completion logic.
- **M5**: Local/worker video packaging CLI (`wk publish`).
- **M6**: Frontend player integration (`hls.js` with silent re-mint and resume).

