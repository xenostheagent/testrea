const POSTS_KEY = "obvault.posts.v1";
const ACCOUNTS_KEY = "obvault.accounts.v1";
const SESSION_KEY = "obvault.demo-session.v1";
const MEDIA_DB = "obvault-media";
const MEDIA_STORE = "attachments";
const DEMO_ACCOUNTS = [
  { name: "Nia Park", email: "nia.park@oberlin.edu", handle: "@niapark", password: "OberlinDemo1!", initials: "N", avatar: "avatar-nia" },
  { name: "Omar Reyes", email: "omar.reyes@oberlin.edu", handle: "@omaroutside", password: "OberlinDemo2!", initials: "O", avatar: "avatar-omar" },
  { name: "June Kim", email: "june.kim@oberlin.edu", handle: "@junekim", password: "OberlinDemo3!", initials: "J", avatar: "avatar-june" },
  { name: "Ari Flores", email: "ari.flores@oberlin.edu", handle: "@ariflores", password: "OberlinDemo4!", initials: "A", avatar: "avatar-ari" }
];
const people = [
  { ...DEMO_ACCOUNTS[0], bio: "Slow mornings & ceramics", following: true },
  { ...DEMO_ACCOUNTS[1], bio: "Taking the long way home", following: true },
  { ...DEMO_ACCOUNTS[2], bio: "A small studio in the city", following: false },
  { ...DEMO_ACCOUNTS[3], bio: "Making things, growing things", following: false }
];
const now = Date.now();
const starterPosts = [
  { id: "seed-1", author: "Nia Park", authorEmail: "nia.park@oberlin.edu", handle: "@niapark", initials: "N", avatar: "avatar-nia", createdAt: now - 36e5 * 2, kind: "photo", scene: "garden", caption: "The first tomatoes finally showed up. I think we both needed a little sun today. #slowmorning #growingthings", likes: 128, likedBy: [], comments: [{ author: "Omar Reyes", text: "Look at those little guys!", id: "c1" }] },
  { id: "seed-2", author: "Omar Reyes", authorEmail: "omar.reyes@oberlin.edu", handle: "@omaroutside", initials: "O", avatar: "avatar-omar", createdAt: now - 36e5 * 5, kind: "video", scene: "coast", caption: "Took the path that doesn't have a name. Turns out it had a pretty good ending. #outsidehours", likes: 86, likedBy: [], comments: [] },
  { id: "seed-3", author: "June Kim", authorEmail: "june.kim@oberlin.edu", handle: "@junekim", initials: "J", avatar: "avatar-june", createdAt: now - 36e5 * 19, kind: "photo", scene: "studio", caption: "A few seconds before the kiln opens. Holding my breath, as usual. #makerdays #madebyhand", likes: 204, likedBy: [], comments: [{ author: "Nia Park", text: "Fingers crossed! 🌱", id: "c2" }, { author: "Ari Flores", text: "The colors are lovely.", id: "c3" }] },
  { id: "seed-4", author: "Ari Flores", authorEmail: "ari.flores@oberlin.edu", handle: "@ariflores", initials: "A", avatar: "avatar-ari", createdAt: now - 36e5 * 25, kind: "text", scene: "note", caption: "Reminder from my walk: you don't have to turn every quiet thing into something productive. #littlejoys", likes: 64, likedBy: [], comments: [] }
];
const stories = [
  { ...people[0], scene: "garden", note: "tiny things growing" },
  { ...people[1], scene: "coast", note: "a little fresh air" },
  { ...people[2], scene: "studio", note: "today in the studio" },
  { ...people[3], scene: "field", note: "found a new path" }
];

const postList = document.querySelector("#post-list");
const emptyState = document.querySelector("#empty-state");
const composer = document.querySelector("#composer");
const composerForm = document.querySelector("#composer-form");
const captionInput = document.querySelector("#post-caption");
const fileInput = document.querySelector("#post-file");
const uploadPreview = document.querySelector("#upload-preview");
const characterCount = document.querySelector("#character-count");
const publishButton = document.querySelector("#publish-button");
const storyDialog = document.querySelector("#story-dialog");
const storyViewer = document.querySelector("#story-viewer");
const searchInput = document.querySelector("#search");
const mediaUrls = new Map();
const authScreen = document.querySelector("#auth-screen");
const loginForm = document.querySelector("#login-form");
const registerForm = document.querySelector("#register-form");
let activeView = "home";
let activeFilter = "all";
let query = "";
let selectedFile = null;
let previewUrl = null;
let toastTimer = null;
let posts = loadJson(POSTS_KEY, starterPosts);
let following = [];
let interactions = { likedIds: [], savedIds: [] };
let currentUser = null;

function isOberlinEmail(email) {
  return /^[^\s@]+@oberlin\.edu$/i.test(email.trim());
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function profileKey(email) {
  return `obvault.profile.${encodeURIComponent(email)}`;
}

async function passwordDigest(password, salt) {
  if (!crypto?.subtle) throw new Error("Secure password hashing isn't available in this browser.");
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: 210000 }, key, 256);
  return [...new Uint8Array(bits)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function bytesToHex(bytes) {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(left, right) {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return mismatch === 0;
}

function publicAccount(account) {
  const { passwordHash, passwordSalt, ...publicFields } = account;
  return publicFields;
}

class DemoAuthProvider {
  async listAccounts() {
    return loadJson(ACCOUNTS_KEY, []);
  }

  async saveAccounts(accounts) {
    if (!persist(ACCOUNTS_KEY, accounts)) throw new Error("Couldn't save this account in local browser storage.");
  }

  async seed() {
    const accounts = await this.listAccounts();
    let changed = false;
    for (const demo of DEMO_ACCOUNTS) {
      if (accounts.some((account) => account.email === demo.email)) continue;
      const passwordSalt = crypto.getRandomValues(new Uint8Array(16));
      accounts.push({
        name: demo.name, email: demo.email, handle: demo.handle, initials: demo.initials, avatar: demo.avatar,
        passwordSalt: bytesToHex(passwordSalt),
        passwordHash: await passwordDigest(demo.password, passwordSalt)
      });
      changed = true;
    }
    if (changed) await this.saveAccounts(accounts);
  }

  async register({ name, email, password }) {
    const normalizedEmail = normalizeEmail(email);
    if (!isOberlinEmail(normalizedEmail)) throw new Error("Use a valid @oberlin.edu email address.");
    if (password.length < 8) throw new Error("Choose a password with at least 8 characters.");
    const accounts = await this.listAccounts();
    if (accounts.some((account) => account.email === normalizedEmail)) throw new Error("An account already exists for that email.");
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const account = {
      name: name.trim(), email: normalizedEmail,
      handle: `@${normalizedEmail.split("@")[0].replace(/[^a-z0-9_]/g, "")}`,
      initials: name.trim().charAt(0).toUpperCase(), avatar: "avatar-you",
      passwordSalt: bytesToHex(salt), passwordHash: await passwordDigest(password, salt)
    };
    if (!account.name) throw new Error("Enter a display name.");
    accounts.push(account);
    await this.saveAccounts(accounts);
    localStorage.setItem(SESSION_KEY, account.email);
    return { user: publicAccount(account), verificationRequired: false };
  }

  async login(email, password) {
    const normalizedEmail = normalizeEmail(email);
    if (!isOberlinEmail(normalizedEmail)) throw new Error("Only @oberlin.edu accounts can log in.");
    const account = (await this.listAccounts()).find((item) => item.email === normalizedEmail);
    if (!account) throw new Error("Email or password is incorrect.");
    const digest = await passwordDigest(password, Uint8Array.from(account.passwordSalt.match(/.{2}/g), (byte) => Number.parseInt(byte, 16)));
    if (!constantTimeEqual(digest, account.passwordHash)) throw new Error("Email or password is incorrect.");
    localStorage.setItem(SESSION_KEY, account.email);
    return publicAccount(account);
  }

  async current() {
    const email = normalizeEmail(localStorage.getItem(SESSION_KEY) || "");
    if (!email) return null;
    const account = (await this.listAccounts()).find((item) => item.email === email);
    return account ? publicAccount(account) : null;
  }

  async logout() {
    localStorage.removeItem(SESSION_KEY);
  }
}

class HttpAuthProvider {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.csrfToken = null;
  }

  async ensureCsrfToken() {
    if (this.csrfToken) return this.csrfToken;
    const response = await fetch(`${this.baseUrl}/auth/csrf`, { credentials: "include" });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || typeof result.token !== "string" || !result.token) {
      throw new Error("Couldn't initialize secure account access.");
    }
    this.csrfToken = result.token;
    return this.csrfToken;
  }

  async request(path, body) {
    const headers = {};
    if (body) {
      headers["Content-Type"] = "application/json";
      headers["X-CSRF-Token"] = await this.ensureCsrfToken();
    }
    const response = await fetch(`${this.baseUrl}/auth/${path}`, {
      method: body ? "POST" : "GET",
      credentials: "include",
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(result.message || "Account request failed.");
      error.status = response.status;
      throw error;
    }
    return result;
  }

  async register(details) {
    if (!isOberlinEmail(details.email)) throw new Error("Use a valid @oberlin.edu email address.");
    return this.request("register", details);
  }

  async login(email, password) {
    if (!isOberlinEmail(email)) throw new Error("Only @oberlin.edu accounts can log in.");
    const result = await this.request("login", { email: normalizeEmail(email), password });
    if (!result.user || result.user.emailVerified !== true) throw new Error("Verify your Oberlin email before logging in.");
    return result.user;
  }

  async current() {
    try {
      const user = (await this.request("session")).user;
      return user?.emailVerified === true ? user : null;
    }
    catch (error) {
      if (error.status === 401) return null;
      throw error;
    }
  }

  async logout() {
    await this.request("logout", {});
  }
}

const authApiUrl = document.querySelector('meta[name="obvault-auth-api"]')?.content.trim();
const authProvider = authApiUrl ? new HttpAuthProvider(authApiUrl) : new DemoAuthProvider();

function loadJson(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : structuredClone(fallback);
  } catch {
    showToast("Saved data couldn't be loaded. This session will still work.");
    return structuredClone(fallback);
  }
}

function persist(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    showToast("Couldn't save changes in this browser. Check available storage.");
    return false;
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function showToast(message) {
  const region = document.querySelector("#toast-region");
  if (!region) return;
  region.textContent = message;
  region.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => region.classList.remove("visible"), 2600);
}

function openMediaDatabase() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("This browser doesn't support local media storage."));
      return;
    }
    const request = indexedDB.open(MEDIA_DB, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(MEDIA_STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open media storage."));
  });
}

async function writeAttachment(id, file) {
  const database = await openMediaDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(MEDIA_STORE, "readwrite");
    transaction.objectStore(MEDIA_STORE).put(file, id);
    transaction.oncomplete = () => { database.close(); resolve(); };
    transaction.onerror = () => { database.close(); reject(transaction.error ?? new Error("Could not save this file.")); };
    transaction.onabort = () => { database.close(); reject(transaction.error ?? new Error("Saving this file was interrupted.")); };
  });
}

async function readAttachment(id) {
  const database = await openMediaDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(MEDIA_STORE, "readonly").objectStore(MEDIA_STORE).get(id);
    request.onsuccess = () => {
      database.close();
      resolve(request.result ?? null);
    };
    request.onerror = () => {
      database.close();
      reject(request.error ?? new Error("Could not load a saved file."));
    };
  });
}

async function removeAttachment(id) {
  if (!("indexedDB" in window)) return;
  const database = await openMediaDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(MEDIA_STORE, "readwrite");
    transaction.objectStore(MEDIA_STORE).delete(id);
    transaction.oncomplete = () => { database.close(); resolve(); };
    transaction.onerror = () => { database.close(); reject(transaction.error ?? new Error("Could not remove the saved file.")); };
  });
}

function savePosts() {
  return persist(POSTS_KEY, posts);
}

function saveProfile() {
  if (!currentUser) return;
  persist(profileKey(currentUser.email), { following, ...interactions });
}

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "File";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function mediaKind(fileName, type) {
  const name = fileName.toLowerCase();
  if (type.startsWith("video/") || /\.(mp4|mov|webm|m4v|ogv|avi|mkv)$/i.test(name)) return "video";
  if (type.startsWith("image/") || /\.(png|jpe?g|gif|webp|avif|bmp|tiff?)$/i.test(name)) return "image";
  if (type === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  return "file";
}

function showAuthError(form, message) {
  const error = document.querySelector(`#${form.id === "login-form" ? "login-error" : "register-error"}`);
  error.textContent = message;
  error.hidden = false;
}

function hideAuthError(form) {
  const error = document.querySelector(`#${form.id === "login-form" ? "login-error" : "register-error"}`);
  error.hidden = true;
  error.textContent = "";
}

function setAuthMode(mode) {
  const isLogin = mode === "login";
  loginForm.hidden = !isLogin;
  registerForm.hidden = isLogin;
  document.querySelectorAll("[data-auth-mode]").forEach((tab) => {
    const selected = tab.dataset.authMode === mode;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
  });
  document.querySelector(isLogin ? "#login-email" : "#register-name").focus();
}

async function enterApp(user) {
  if (!user || !isOberlinEmail(user.email)) {
    throw new Error("Only an @oberlin.edu account can access ObVault.");
  }
  if (authProvider instanceof HttpAuthProvider && user.emailVerified !== true) {
    throw new Error("Verify your Oberlin email before accessing ObVault.");
  }
  currentUser = { ...user, email: normalizeEmail(user.email) };
  const profile = loadJson(profileKey(currentUser.email), {});
  following = Array.isArray(profile.following) ? profile.following : [];
  interactions = {
    likedIds: Array.isArray(profile.likedIds) ? profile.likedIds : [],
    savedIds: Array.isArray(profile.savedIds) ? profile.savedIds : []
  };
  authScreen.hidden = true;
  document.body.classList.add("is-authenticated");
  document.querySelectorAll(".avatar-you").forEach((avatar) => { avatar.textContent = currentUser.initials || currentUser.name[0]; });
  document.querySelector(".composer-author strong").textContent = currentUser.name;
  document.querySelector(".composer-author small").textContent = currentUser.email;
  document.querySelector(".header-avatar").setAttribute("aria-label", `Open ${currentUser.name}'s profile`);
  document.querySelector("#welcome-date").textContent = `SIGNED IN AS ${currentUser.email.toUpperCase()}`;
  renderStories();
  render();
  await loadSavedMedia();
}

function leaveApp() {
  currentUser = null;
  document.body.classList.remove("is-authenticated");
  authScreen.hidden = false;
  closeDialogs();
  setAuthMode("login");
  loginForm.reset();
  registerForm.reset();
  setTimeout(() => document.querySelector("#login-email").focus(), 0);
}

function renderDemoAccountButtons() {
  const container = document.querySelector("#demo-account-list");
  if (!container) return;
  container.innerHTML = DEMO_ACCOUNTS.map((account) => `
    <button class="demo-account" type="button" data-demo-login="${escapeHtml(account.email)}">
      <span class="avatar ${escapeHtml(account.avatar)}">${escapeHtml(account.initials)}</span>
      <span><strong>${escapeHtml(account.name)}</strong><small>${escapeHtml(account.email)}</small></span>
      <span class="demo-enter">↗</span>
    </button>`).join("");
}

function timeAgo(timestamp) {
  const minutes = Math.max(1, Math.floor((Date.now() - timestamp) / 60000));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

function formatCaption(text) {
  return escapeHtml(text).replace(/(#[a-zA-Z0-9_]+)/g, '<button class="inline-tag" type="button" data-search="$1">$1</button>');
}

function getMedia(post) {
  if (mediaUrls.has(post.id)) {
    const media = mediaUrls.get(post.id);
    if (media.kind === "video") {
      return `<video class="uploaded-media" src="${media.url}" controls preload="metadata" aria-label="Video posted by ${escapeHtml(post.author)}"></video>`;
    }
    if (media.kind === "image") {
      return `<img class="uploaded-media" src="${media.url}" alt="${escapeHtml(media.name)}">`;
    }
    if (media.kind === "pdf") {
      return `<div class="pdf-frame"><iframe sandbox title="PDF preview: ${escapeHtml(media.name)}" src="${media.url}"></iframe><a href="${media.url}" download="${escapeHtml(media.name)}">Download PDF</a></div>`;
    }
    return `<div class="attachment-tile"><span class="attachment-icon">↧</span><div><strong>${escapeHtml(media.name)}</strong><small>${escapeHtml(media.type || "File")} · ${formatFileSize(media.size)}</small></div><a href="${media.url}" download="${escapeHtml(media.name)}">Download</a></div>`;
  }
  if (post.attachmentId) {
    return `<div class="media-unavailable">This upload isn't available in this browser.</div>`;
  }
  if (post.kind === "text") {
    return `<div class="text-art"><span>“</span><p>${escapeHtml(post.caption.slice(0, 100))}${post.caption.length > 100 ? "…" : ""}</p><small>A thought from ${escapeHtml(post.author.split(" ")[0])}</small></div>`;
  }
  return `<div class="visual-card scene-${escapeHtml(post.scene || "garden")}" role="img" aria-label="${post.kind === "video" ? "Decorative video preview" : "Decorative photo illustration"}">
    <span class="scene-sun"></span><span class="scene-shape shape-one"></span><span class="scene-shape shape-two"></span><span class="scene-shape shape-three"></span>
    ${post.kind === "video" ? `<button class="media-play" type="button" data-action="play" data-id="${escapeHtml(post.id)}" aria-label="Play preview"><span>▶</span></button><span class="media-duration">0:18</span>` : ""}
    <span class="scene-caption">${escapeHtml(post.scene === "garden" ? "A little room to grow" : post.scene === "coast" ? "The long way around" : post.scene === "studio" ? "In good hands" : "A pause for later")}</span>
  </div>`;
}

function renderPost(post) {
  const comments = Array.isArray(post.comments) ? post.comments : [];
  const ownPost = post.authorEmail === currentUser.email;
  const liked = interactions.likedIds.includes(post.id);
  const saved = interactions.savedIds.includes(post.id);
  const tags = [...new Set(post.caption.match(/#[a-zA-Z0-9_]+/g) || [])];
  return `<article class="post-card" data-post-id="${escapeHtml(post.id)}">
    <header class="post-author-row">
      <span class="avatar ${escapeHtml(post.avatar || "avatar-you")}">${escapeHtml(post.initials || post.author[0])}</span>
      <div class="author-details"><strong>${escapeHtml(post.author)}</strong><span>${escapeHtml(post.handle)} <i>·</i> ${timeAgo(post.createdAt)}</span></div>
      <button class="post-menu" type="button" data-action="${ownPost ? "delete" : "more"}" data-id="${escapeHtml(post.id)}" aria-label="${ownPost ? "Delete post" : "More post options"}">${ownPost ? "···" : "···"}</button>
    </header>
    ${post.kind === "text" ? "" : `<div class="post-media">${getMedia(post)}</div>`}
    <div class="post-content">
      <p class="post-caption">${formatCaption(post.caption)}</p>
      ${tags.length ? `<div class="post-tags">${tags.map((tag) => `<button type="button" data-search="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`).join("")}</div>` : ""}
      <div class="post-actions">
        <button class="post-action like-action ${liked ? "is-liked" : ""}" type="button" data-action="like" data-id="${escapeHtml(post.id)}" aria-pressed="${liked}" aria-label="${liked ? "Unlike" : "Like"} post"><span aria-hidden="true">${liked ? "♥" : "♡"}</span><span>${(Number(post.likes) || 0) + (liked ? 1 : 0)}</span></button>
        <button class="post-action" type="button" data-action="comments" data-id="${escapeHtml(post.id)}" aria-expanded="false"><span aria-hidden="true">◯</span><span>${comments.length}</span></button>
        <button class="post-action share-action" type="button" data-action="share" data-id="${escapeHtml(post.id)}"><span aria-hidden="true">↗</span><span>Share</span></button>
        <button class="post-action save-action ${saved ? "is-saved" : ""}" type="button" data-action="save" data-id="${escapeHtml(post.id)}" aria-pressed="${saved}" aria-label="${saved ? "Remove from saved" : "Save post"}"><span aria-hidden="true">${saved ? "◆" : "◇"}</span></button>
      </div>
      <div class="comment-thread" data-comments-for="${escapeHtml(post.id)}" hidden>
        <div class="comment-list">${comments.map((comment) => `<p><strong>${escapeHtml(comment.author)}</strong> ${escapeHtml(comment.text)}</p>`).join("")}</div>
        <form class="comment-form" data-comment-form="${escapeHtml(post.id)}"><span class="avatar avatar-you">${escapeHtml(currentUser.initials)}</span><label class="visually-hidden" for="comment-${escapeHtml(post.id)}">Write a comment</label><input id="comment-${escapeHtml(post.id)}" name="comment" maxlength="240" placeholder="Add a kind thought…" required><button type="submit" aria-label="Send comment">↗</button></form>
      </div>
    </div>
  </article>`;
}

function matchesSearch(post, value) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return true;
  return `${post.author} ${post.handle} ${post.caption}`.toLowerCase().includes(normalized);
}

function filteredPosts() {
  let visible = posts;
  if (activeView === "saved") visible = visible.filter((post) => interactions.savedIds.includes(post.id));
  if (activeView === "following" || activeFilter === "following") {
    visible = visible.filter((post) => post.authorEmail === currentUser.email || following.includes(post.handle));
  }
  if (activeView === "profile") visible = visible.filter((post) => post.authorEmail === currentUser.email);
  if (activeFilter === "video") visible = visible.filter((post) => post.kind === "video");
  if (activeFilter === "photo") visible = visible.filter((post) => post.kind === "photo");
  return visible.filter((post) => matchesSearch(post, query));
}

function updateHeader() {
  const titles = {
    home: ["YOUR SPACE, IN GOOD COMPANY", "A little inspiration <span>goes a long way.</span>", "Your feed"],
    discover: ["A WORLD OF GOOD IDEAS", "Find something <span>that moves you.</span>", "Explore"],
    following: ["THE PEOPLE YOU PICKED", "Your corner of <span>the community.</span>", "Following"],
    saved: ["KEEP WHAT YOU LOVE", "Your collection <span>of good things.</span>", "Saved"],
    profile: ["YOUR LITTLE CORNER", "Made and gathered <span>by you.</span>", "Your posts"]
  };
  const [eyebrow, title, heading] = titles[activeView] || titles.home;
  document.querySelector("#welcome-date").textContent = eyebrow;
  document.querySelector("#page-title").innerHTML = title;
  document.querySelector("#feed-heading").textContent = heading;
  document.querySelectorAll("[data-view].nav-link, .mobile-nav-link").forEach((button) => {
    const selected = button.dataset.view === activeView;
    button.classList.toggle("active", selected);
    if (button.classList.contains("mobile-nav-link")) {
      if (selected) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    }
  });
}

function render() {
  if (!currentUser) return;
  updateHeader();
  const visible = filteredPosts();
  postList.innerHTML = visible.map(renderPost).join("");
  emptyState.hidden = visible.length > 0;
  document.querySelector("#load-more").hidden = visible.length === 0;
  document.querySelectorAll(".filter-chip").forEach((button) => {
    const selected = button.dataset.filter === activeFilter;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  renderSuggestions();
}

function renderStories() {
  document.querySelector("#stories").innerHTML = stories.map((story, index) => `
    <button class="story-item" type="button" data-story="${index}" aria-label="View ${escapeHtml(story.name)}'s moment">
      <span class="story-ring"><span class="avatar ${escapeHtml(story.avatar)}">${escapeHtml(story.initials)}</span></span>
      <strong>${escapeHtml(story.name.split(" ")[0])}</strong>
      <small>${escapeHtml(story.note)}</small>
    </button>`).join("");
}

function renderSuggestions() {
  document.querySelector("#suggested-people").innerHTML = people.map((person) => `
    <div class="suggestion-row">
      <span class="avatar ${escapeHtml(person.avatar)}">${escapeHtml(person.initials)}</span>
      <span class="suggestion-info"><strong>${escapeHtml(person.name)}</strong><small>${escapeHtml(person.bio)}</small></span>
      <button class="follow-button ${following.includes(person.handle) ? "following" : ""}" type="button" data-action="follow" data-handle="${escapeHtml(person.handle)}" aria-pressed="${following.includes(person.handle)}">${following.includes(person.handle) ? "Following" : "Follow"}</button>
    </div>`).join("");
}

function openComposer(prefill = "") {
  composerForm.reset();
  captionInput.value = prefill;
  characterCount.textContent = `${prefill.length} / 500`;
  selectedFile = null;
  clearPreview();
  composer.showModal();
  captionInput.focus();
}

function clearPreview() {
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = null;
  uploadPreview.replaceChildren();
  uploadPreview.hidden = true;
  selectedFile = null;
  fileInput.value = "";
}

function closeDialogs() {
  if (composer.open) composer.close();
  if (storyDialog.open) storyDialog.close();
}

function openStory(index) {
  const story = stories[index];
  if (!story) return;
  storyViewer.className = `story-viewer scene-${story.scene}`;
  storyViewer.innerHTML = `<span class="story-progress"><i></i></span><div class="story-profile"><span class="avatar ${escapeHtml(story.avatar)}">${escapeHtml(story.initials)}</span><strong>${escapeHtml(story.name)}</strong><small>today</small></div><div class="story-art"><span class="scene-sun"></span><span class="scene-shape shape-one"></span><span class="scene-shape shape-two"></span><p>${escapeHtml(story.note)}</p></div><button class="story-reply" type="button" data-story-reply="${escapeHtml(story.name)}">Send a little love <span>♡</span></button>`;
  storyDialog.showModal();
}

function saveAndRender() {
  savePosts();
  render();
}

document.addEventListener("click", async (event) => {
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) {
    event.preventDefault();
    activeView = viewButton.dataset.view;
    activeFilter = "all";
    render();
  }

  const authTab = event.target.closest("[data-auth-mode]");
  if (authTab) setAuthMode(authTab.dataset.authMode);

  const demoLogin = event.target.closest("[data-demo-login]");
  if (demoLogin) {
    const account = DEMO_ACCOUNTS.find((item) => item.email === demoLogin.dataset.demoLogin);
    if (!account) return;
    try {
      await enterApp(await authProvider.login(account.email, account.password));
    } catch (error) {
      showAuthError(loginForm, error instanceof Error ? error.message : "Couldn't open this demo account.");
    }
  }

  if (event.target.closest("#logout")) {
    try {
      await authProvider.logout();
      leaveApp();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Couldn't log out.");
    }
  }

  const toastButton = event.target.closest("[data-toast]");
  if (toastButton) showToast(toastButton.dataset.toast);

  const searchButton = event.target.closest("[data-search]");
  if (searchButton) {
    searchInput.value = searchButton.dataset.search;
    query = searchInput.value;
    activeView = "discover";
    activeFilter = "all";
    render();
    searchInput.focus();
  }

  const openButton = event.target.closest("#open-composer, [data-open-composer]");
  if (openButton) openComposer();

  if (event.target.closest("[data-close-dialog]")) closeDialogs();

  const chip = event.target.closest("[data-filter]");
  if (chip) {
    activeFilter = chip.dataset.filter;
    activeView = "home";
    render();
  }

  const storyButton = event.target.closest("[data-story]");
  if (storyButton) openStory(Number(storyButton.dataset.story));

  const replyButton = event.target.closest("[data-story-reply]");
  if (replyButton) {
    storyDialog.close();
    showToast(`A little love sent to ${replyButton.dataset.story.split(" ")[0]}.`);
  }

  const personButton = event.target.closest("[data-person]");
  if (personButton) {
    activeView = "discover";
    activeFilter = "all";
    searchInput.value = personButton.dataset.person;
    query = personButton.dataset.person;
    render();
  }

  const promptButton = event.target.closest("#prompt-post");
  if (promptButton) openComposer("A tiny thing that made today better: ");

  const action = event.target.closest("[data-action]");
  if (!action) return;
  const post = posts.find((item) => item.id === action.dataset.id);
  if (action.dataset.action === "follow") {
    const handle = action.dataset.handle;
    following = following.includes(handle) ? following.filter((item) => item !== handle) : [...following, handle];
    saveProfile();
    render();
    return;
  }
  if (!post) return;
  if (action.dataset.action === "like") {
    const liked = interactions.likedIds.includes(post.id);
    interactions.likedIds = liked
      ? interactions.likedIds.filter((id) => id !== post.id)
      : [...interactions.likedIds, post.id];
    saveProfile();
    render();
  } else if (action.dataset.action === "save") {
    const saved = interactions.savedIds.includes(post.id);
    interactions.savedIds = saved
      ? interactions.savedIds.filter((id) => id !== post.id)
      : [...interactions.savedIds, post.id];
    saveProfile();
    render();
    showToast(saved ? "Removed from your collection." : "Saved to your collection.");
  } else if (action.dataset.action === "comments") {
    const thread = postList.querySelector(`[data-comments-for="${CSS.escape(post.id)}"]`);
    thread.hidden = !thread.hidden;
    action.setAttribute("aria-expanded", String(!thread.hidden));
    if (!thread.hidden) thread.querySelector("input").focus();
  } else if (action.dataset.action === "play") {
    const scene = action.closest(".visual-card");
    scene.classList.toggle("is-playing");
    action.setAttribute("aria-label", scene.classList.contains("is-playing") ? "Pause preview" : "Play preview");
  } else if (action.dataset.action === "share") {
    const shareUrl = `${window.location.origin}${window.location.pathname}#post-${encodeURIComponent(post.id)}`;
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        showToast("Post link copied.");
      } catch {
        showToast(shareUrl);
      }
    } else {
      showToast("Share link: " + shareUrl);
    }
  } else if (action.dataset.action === "delete" && post.authorEmail === currentUser.email) {
    posts = posts.filter((item) => item.id !== post.id);
    if (post.attachmentId) {
      try { await removeAttachment(post.attachmentId); }
      catch { showToast("Post removed, but its local media couldn't be cleared."); }
    }
    const media = mediaUrls.get(post.id);
    if (media) URL.revokeObjectURL(media.url);
    mediaUrls.delete(post.id);
    saveAndRender();
    showToast("Your post was removed.");
  } else if (action.dataset.action === "more") {
    showToast("Thanks for helping keep ObVault thoughtful.");
  }
});

postList.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-comment-form]");
  if (!form) return;
  event.preventDefault();
  const post = posts.find((item) => item.id === form.dataset.commentForm);
  const input = form.elements.comment;
  const text = input.value.trim();
  if (!post || !text) return;
  post.comments.push({ id: crypto.randomUUID(), author: currentUser.name, authorEmail: currentUser.email, text });
  saveAndRender();
  const thread = postList.querySelector(`[data-comments-for="${CSS.escape(post.id)}"]`);
  thread.hidden = false;
  thread.querySelector("input").focus();
});

searchInput.addEventListener("input", () => {
  query = searchInput.value;
  if (query && activeView === "home") activeView = "discover";
  render();
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideAuthError(loginForm);
  const submit = loginForm.querySelector(".auth-submit");
  submit.disabled = true;
  try {
    const user = await authProvider.login(loginForm.elements.namedItem("email").value, loginForm.elements.namedItem("password").value);
    await enterApp(user);
  } catch (error) {
    showAuthError(loginForm, error instanceof Error ? error.message : "Couldn't log in.");
  } finally {
    submit.disabled = false;
  }
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideAuthError(registerForm);
  const status = document.querySelector("#register-status");
  status.hidden = true;
  status.textContent = "";
  const submit = registerForm.querySelector(".auth-submit");
  submit.disabled = true;
  try {
    const result = await authProvider.register({
      name: registerForm.elements.namedItem("name").value,
      email: registerForm.elements.namedItem("email").value,
      password: registerForm.elements.namedItem("password").value
    });
    if (result.verificationRequired) {
      status.textContent = "Check your Oberlin inbox to verify your address before logging in.";
      status.hidden = false;
      registerForm.reset();
      return;
    }
    const user = result.user || await authProvider.current();
    if (!user) throw new Error("Account was created, but no signed-in session was returned. Log in to continue.");
    await enterApp(user);
  } catch (error) {
    showAuthError(registerForm, error instanceof Error ? error.message : "Couldn't create your account.");
  } finally {
    submit.disabled = false;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape") closeDialogs();
});

composer.addEventListener("click", (event) => {
  if (event.target === composer) composer.close();
});

composer.addEventListener("close", clearPreview);

captionInput.addEventListener("input", () => {
  characterCount.textContent = `${captionInput.value.length} / 500`;
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  if (file.size > 100 * 1024 * 1024) {
    showToast("Choose a file smaller than 100 MB for this local demo.");
    fileInput.value = "";
    return;
  }
  clearPreview();
  selectedFile = file;
  previewUrl = URL.createObjectURL(file);
  uploadPreview.replaceChildren();
  const kind = mediaKind(file.name, file.type);
  if (kind === "video") {
    const video = document.createElement("video");
    video.src = previewUrl;
    video.controls = true;
    video.muted = true;
    uploadPreview.append(video);
  } else if (kind === "image") {
    const image = document.createElement("img");
    image.src = previewUrl;
    image.alt = "Selected upload preview";
    uploadPreview.append(image);
  } else if (kind === "pdf") {
    const frame = document.createElement("iframe");
    frame.src = previewUrl;
    frame.title = `PDF preview: ${file.name}`;
    frame.setAttribute("sandbox", "");
    uploadPreview.append(frame);
  } else {
    const details = document.createElement("p");
    details.textContent = `${file.name} · ${file.type || "File"} · ${formatFileSize(file.size)}`;
    uploadPreview.append(details);
  }
  uploadPreview.hidden = false;
});

composerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const caption = captionInput.value.trim();
  if (!caption) {
    captionInput.focus();
    return;
  }
  publishButton.disabled = true;
  publishButton.textContent = "Sharing…";
  const id = crypto.randomUUID();
  const attachmentId = selectedFile ? id : null;
  const file = selectedFile;
  try {
  if (file) await writeAttachment(id, file);
  const post = {
    id, author: currentUser.name, authorEmail: currentUser.email, handle: currentUser.handle,
    initials: currentUser.initials || currentUser.name[0], avatar: currentUser.avatar || "avatar-you",
    createdAt: Date.now(), kind: file ? (mediaKind(file.name, file.type) === "video" ? "video" : mediaKind(file.name, file.type) === "image" ? "photo" : "file") : "text",
    scene: "garden", caption, likes: 0, liked: false, saved: false, comments: [],
    attachmentId, fileName: file?.name, fileType: file?.type, fileSize: file?.size
  };
  posts.unshift(post);
  if (!savePosts()) {
    posts.shift();
    if (attachmentId) await removeAttachment(attachmentId);
    return;
  }
  if (file) mediaUrls.set(id, {
    url: previewUrl, type: file.type || "application/octet-stream", kind: mediaKind(file.name, file.type), name: file.name, size: file.size
  });
    previewUrl = null;
    selectedFile = null;
    composer.close();
    activeView = "home";
    activeFilter = "all";
    query = "";
    searchInput.value = "";
    render();
    showToast("Your moment is out in the world.");
  } catch (error) {
    showToast(error instanceof Error ? error.message : "Couldn't save your post.");
  } finally {
    publishButton.disabled = false;
    publishButton.innerHTML = 'Share post <span aria-hidden="true">↗</span>';
  }
});

async function loadSavedMedia() {
  const saved = posts.filter((post) => post.attachmentId);
  for (const post of saved) {
    try {
      const file = await readAttachment(post.attachmentId);
      if (file) {
        mediaUrls.set(post.id, {
          url: URL.createObjectURL(file),
          type: file.type || post.fileType || "application/octet-stream",
          kind: mediaKind(post.fileName || "", file.type || post.fileType || ""),
          name: post.fileName || "Download attachment",
          size: file.size
        });
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : "A saved upload couldn't be loaded.");
      break;
    }
  }
  render();
}

renderStories();
if (authProvider instanceof DemoAuthProvider) {
  renderDemoAccountButtons();
} else {
  document.querySelector(".demo-access").hidden = true;
  document.querySelector(".auth-footnote").textContent =
    "Sign-up requires a verified Oberlin inbox. Passwords and sessions are handled by your configured authentication service.";
}

async function initializeAuth() {
  try {
    if (authProvider instanceof DemoAuthProvider) await authProvider.seed();
    const user = await authProvider.current();
    if (user) await enterApp(user);
    else setAuthMode("login");
  } catch (error) {
    showAuthError(loginForm, error instanceof Error ? error.message : "Could not initialize account access.");
  }
}

initializeAuth();
