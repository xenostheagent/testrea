# ObVault

ObVault is a static, browser-side art-sharing prototype. Open `index.html` from
a local web server to try the feed, account screens, and file composer.

## Local demo accounts

The sign-in screen has four one-click demo profiles. You can also create a
separate account with any address ending in `@oberlin.edu`. Demo accounts and
your own demo login persist in that browser profile; posts and uploaded files
are local to that browser as well. The demo hashes passwords with PBKDF2 before
storing them, but its local account list and session can be inspected or
changed by anyone with access to the browser profile. The domain check does
not verify that an address exists or that its owner controls the inbox.

The local composer accepts any file type up to 100 MB, including video, images,
PDFs, and other documents. Files are stored in that browser's IndexedDB. Images
and video play inline, PDFs get a sandboxed preview, and other formats are
available to download. Browser storage limits still apply.

## Server-auth integration

The client has an `HttpAuthProvider` for a same-origin authentication service.
Set the `obvault-auth-api` meta tag in `index.html` to its base URL to select
that provider instead of the local demo. The provider expects:

| Method and path | Contract |
| --- | --- |
| `GET /auth/csrf` | Return `{ "token": "..." }` and set the matching CSRF cookie. |
| `POST /auth/register` | Accept `{ "name", "email", "password" }`. Enforce the domain on the server and send an email-verification link. Return `{ "verificationRequired": true }` until the address is verified. |
| `POST /auth/login` | Accept `{ "email", "password" }`; return `{ "user": { "name", "email", "handle", "initials", "avatar", "emailVerified": true } }` and set a session cookie only for verified users. |
| `GET /auth/session` | Return the signed-in user in the same public shape, or HTTP 401. |
| `POST /auth/logout` | Revoke the session and clear its cookie. |

Every POST includes `X-CSRF-Token` and uses `credentials: "include"`. The
service must be HTTPS, validate the Oberlin domain and mailbox ownership on
the server, hash passwords with a server-side password-hashing algorithm,
rate-limit authentication, use secure HttpOnly SameSite session cookies,
exclude password material from public responses, and enforce authorization for
posts and uploads. The frontend adapter is only the client integration: **this
repository does not include that service, real email verification, shared
accounts, or remote file storage.** Do not use the local demo mode for
production accounts or sensitive credentials.
