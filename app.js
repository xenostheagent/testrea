const POSTS_KEY = "gather.posts.v1";
const FOLLOWING_KEY = "gather.following.v1";
const MEDIA_DB = "gather-media";
const MEDIA_STORE = "attachments";
const me = { name: "Mira Chen", handle: "@miramakes", initials: "M", avatar: "avatar-you" };
const people = [
  { name: "Nia Park", handle: "@niapark", initials: "N", avatar: "avatar-nia", bio: "Slow mornings & ceramics", following: true },
  { name: "Omar Reyes", handle: "@omaroutside", initials: "O", avatar: "avatar-omar", bio: "Taking the long way home", following: true },
  { name: "June Kim", handle: "@junekim", initials: "J", avatar: "avatar-june", bio: "A small studio in the city", following: false },
  { name: "Ari Flores", handle: "@ariflores", initials: "A", avatar: "avatar-ari", bio: "Making things, growing things", following: false }
];
const now = Date.now();
const starterPosts = [
  { id: "seed-1", author: "Nia Park", handle: "@niapark", initials: "N", avatar: "avatar-nia", createdAt: now - 36e5 * 2, kind: "photo", scene: "garden", caption: "The first tomatoes finally showed up. I think we both needed a little sun today. #slowmorning #growingthings", likes: 128, liked: false, saved: false, comments: [{ author: "Omar Reyes", text: "Look at those little guys!", id: "c1" }] },
  { id: "seed-2", author: "Omar Reyes", handle: "@omaroutside", initials: "O", avatar: "avatar-omar", createdAt: now - 36e5 * 5, kind: "video", scene: "coast", caption: "Took the path that doesn't have a name. Turns out it had a pretty good ending. #outsidehours", likes: 86, liked: false, saved: false, comments: [] },
  { id: "seed-3", author: "June Kim", handle: "@junekim", initials: "J", avatar: "avatar-june", createdAt: now - 36e5 * 19, kind: "photo", scene: "studio", caption: "A few seconds before the kiln opens. Holding my breath, as usual. #makerdays #madebyhand", likes: 204, liked: false, saved: false, comments: [{ author: "Nia Park", text: "Fingers crossed! 🌱", id: "c2" }, { author: "Ari Flores", text: "The colors are lovely.", id: "c3" }] },
  { id: "seed-4", author: "Ari Flores", handle: "@ariflores", initials: "A", avatar: "avatar-ari", createdAt: now - 36e5 * 25, kind: "text", scene: "note", caption: "Reminder from my walk: you don't have to turn every quiet thing into something productive. #littlejoys", likes: 64, liked: false, saved: false, comments: [] }
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
let activeView = "home";
let activeFilter = "all";
let query = "";
let selectedFile = null;
let previewUrl = null;
let toastTimer = null;
let posts = loadJson(POSTS_KEY, starterPosts);
let following = loadJson(FOLLOWING_KEY, people.filter((person) => person.following).map((person) => person.handle));

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
    const source = mediaUrls.get(post.id);
    return post.kind === "video"
      ? `<video class="uploaded-media" src="${source}" controls preload="metadata" aria-label="Video posted by ${escapeHtml(post.author)}"></video>`
      : `<img class="uploaded-media" src="${source}" alt="Photo posted by ${escapeHtml(post.author)}">`;
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
  const ownPost = post.handle === me.handle;
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
        <button class="post-action like-action ${post.liked ? "is-liked" : ""}" type="button" data-action="like" data-id="${escapeHtml(post.id)}" aria-pressed="${Boolean(post.liked)}" aria-label="${post.liked ? "Unlike" : "Like"} post"><span aria-hidden="true">${post.liked ? "♥" : "♡"}</span><span>${Number(post.likes) || 0}</span></button>
        <button class="post-action" type="button" data-action="comments" data-id="${escapeHtml(post.id)}" aria-expanded="false"><span aria-hidden="true">◯</span><span>${comments.length}</span></button>
        <button class="post-action share-action" type="button" data-action="share" data-id="${escapeHtml(post.id)}"><span aria-hidden="true">↗</span><span>Share</span></button>
        <button class="post-action save-action ${post.saved ? "is-saved" : ""}" type="button" data-action="save" data-id="${escapeHtml(post.id)}" aria-pressed="${Boolean(post.saved)}" aria-label="${post.saved ? "Remove from saved" : "Save post"}"><span aria-hidden="true">${post.saved ? "◆" : "◇"}</span></button>
      </div>
      <div class="comment-thread" data-comments-for="${escapeHtml(post.id)}" hidden>
        <div class="comment-list">${comments.map((comment) => `<p><strong>${escapeHtml(comment.author)}</strong> ${escapeHtml(comment.text)}</p>`).join("")}</div>
        <form class="comment-form" data-comment-form="${escapeHtml(post.id)}"><span class="avatar avatar-you">M</span><label class="visually-hidden" for="comment-${escapeHtml(post.id)}">Write a comment</label><input id="comment-${escapeHtml(post.id)}" name="comment" maxlength="240" placeholder="Add a kind thought…" required><button type="submit" aria-label="Send comment">↗</button></form>
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
  if (activeView === "saved") visible = visible.filter((post) => post.saved);
  if (activeView === "following" || activeFilter === "following") {
    visible = visible.filter((post) => post.handle === me.handle || following.includes(post.handle));
  }
  if (activeView === "profile") visible = visible.filter((post) => post.handle === me.handle);
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
    persist(FOLLOWING_KEY, following);
    render();
    return;
  }
  if (!post) return;
  if (action.dataset.action === "like") {
    post.liked = !post.liked;
    post.likes = Math.max(0, (Number(post.likes) || 0) + (post.liked ? 1 : -1));
    saveAndRender();
  } else if (action.dataset.action === "save") {
    post.saved = !post.saved;
    saveAndRender();
    showToast(post.saved ? "Saved to your collection." : "Removed from your collection.");
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
  } else if (action.dataset.action === "delete" && post.handle === me.handle) {
    posts = posts.filter((item) => item.id !== post.id);
    if (post.attachmentId) {
      try { await removeAttachment(post.attachmentId); }
      catch { showToast("Post removed, but its local media couldn't be cleared."); }
    }
    mediaUrls.delete(post.id);
    saveAndRender();
    showToast("Your post was removed.");
  } else if (action.dataset.action === "more") {
    showToast("Thanks for helping keep Gather thoughtful.");
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
  post.comments.push({ id: crypto.randomUUID(), author: me.name, text });
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
  if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
    showToast("Choose an image or video file.");
    fileInput.value = "";
    return;
  }
  if (file.size > 40 * 1024 * 1024) {
    showToast("Choose a file smaller than 40 MB.");
    fileInput.value = "";
    return;
  }
  clearPreview();
  selectedFile = file;
  previewUrl = URL.createObjectURL(file);
  uploadPreview.innerHTML = file.type.startsWith("video/")
    ? `<video src="${previewUrl}" controls muted></video>`
    : `<img src="${previewUrl}" alt="Selected upload preview">`;
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
  try {
    if (selectedFile) await writeAttachment(id, selectedFile);
    const post = {
      id, author: me.name, handle: me.handle, initials: me.initials, avatar: me.avatar,
      createdAt: Date.now(), kind: selectedFile ? (selectedFile.type.startsWith("video/") ? "video" : "photo") : "text",
      scene: "garden", caption, likes: 0, liked: false, saved: false, comments: [],
      attachmentId
    };
    posts.unshift(post);
    if (!savePosts()) {
      posts.shift();
      if (attachmentId) await removeAttachment(attachmentId);
      return;
    }
    if (selectedFile) mediaUrls.set(id, previewUrl);
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
      if (file) mediaUrls.set(post.id, URL.createObjectURL(file));
    } catch (error) {
      showToast(error instanceof Error ? error.message : "A saved upload couldn't be loaded.");
      break;
    }
  }
  render();
}

renderStories();
render();
loadSavedMedia();
