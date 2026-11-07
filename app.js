(() => {
  "use strict";

  const TRACKS = [
    { id: "kick", name: "Kick", kind: "kick", color: "#d4f16c", subtitle: "Low-end foundation", volume: 0.8, hits: [0, 4, 8, 12] },
    { id: "snare", name: "Snare", kind: "snare", color: "#ff9178", subtitle: "Backbeat", volume: 0.57, hits: [4, 12] },
    { id: "clap", name: "Clap", kind: "clap", color: "#ee9df6", subtitle: "Layer & texture", volume: 0.42, hits: [4, 12] },
    { id: "closed-hat", name: "Closed hat", kind: "hat", color: "#7cc9ff", subtitle: "16th-note shimmer", volume: 0.42, hits: [2, 6, 10, 14] },
    { id: "open-hat", name: "Open hat", kind: "openhat", color: "#f6ca74", subtitle: "Air & movement", volume: 0.33, hits: [6, 14] },
    { id: "rim", name: "Rim / perc", kind: "rim", color: "#93e2bd", subtitle: "Add a little syncopation", volume: 0.48, hits: [3, 11] },
  ];

  const SOUND_VARIANTS = {
    kick: [
      { id: "classic", name: "909 Classic" },
      { id: "deep", name: "808 Deep" },
      { id: "punch", name: "Tight Punch" },
    ],
    snare: [
      { id: "classic", name: "909 Snare" },
      { id: "tight", name: "Tight Snap" },
      { id: "noise", name: "Noise Burst" },
    ],
    clap: [
      { id: "classic", name: "Wide Clap" },
      { id: "tight", name: "Short Clap" },
      { id: "layered", name: "Layered Clap" },
    ],
    hat: [
      { id: "classic", name: "Bright Closed" },
      { id: "soft", name: "Soft Closed" },
      { id: "bright", name: "Sharp Closed" },
    ],
    openhat: [
      { id: "classic", name: "Open Hat" },
      { id: "shimmer", name: "Shimmer" },
      { id: "dark", name: "Dark Open" },
    ],
    rim: [
      { id: "classic", name: "Rim Click" },
      { id: "low", name: "Low Tom" },
      { id: "high", name: "High Tick" },
    ],
  };

  const PRESETS = [
    {
      id: "warehouse", title: "Warehouse", tag: "04 / FLOOR", description: "Driving, no-nonsense techno", color: "#d4f16c", bpm: 128,
      hits: { kick: [0, 4, 8, 12], snare: [4, 12], clap: [4, 12], "closed-hat": [2, 6, 10, 14], "open-hat": [6, 14], rim: [3, 11] },
    },
    {
      id: "hypnotic", title: "Hypnotic", tag: "LATE NIGHT", description: "A steady pulse with space", color: "#93e2bd", bpm: 122,
      hits: { kick: [0, 6, 8, 14], snare: [4, 12], clap: [12], "closed-hat": [2, 6, 10, 14], "open-hat": [7, 15], rim: [3, 11] },
    },
    {
      id: "broken", title: "Broken beat", tag: "OFF-GRID", description: "Let the kick skip a step", color: "#ff9178", bpm: 116,
      hits: { kick: [0, 3, 7, 10, 14], snare: [4, 12], clap: [12], "closed-hat": [2, 5, 6, 10, 13, 14], "open-hat": [7, 15], rim: [3, 11] },
    },
    {
      id: "minimal", title: "Minimal", tag: "LESS IS MORE", description: "Room to build something", color: "#7cc9ff", bpm: 124,
      hits: { kick: [0, 4, 8, 12], snare: [12], clap: [], "closed-hat": [2, 6, 10, 14], "open-hat": [14], rim: [7] },
    },
  ];
  const STORAGE_KEY = "pulsegrid-session-v1";
  const STEP_COUNT = 32;
  const BAR_WIDTH = 116;
  const MAX_ARRANGEMENT_BARS = 256;
  const TRACK_COLORS = ["#7cc9ff", "#ff9178", "#ee9df6", "#f6ca74", "#93e2bd"];
  const state = {
    tracks: [],
    arrangementTracks: [],
    patternClips: [],
    steps: 16,
    view: "arrangement",
    bpm: 124,
    swing: 0,
    arrangementBars: 8,
    arrangementCursor: 0,
    arrangementSources: new Set(),
    playbackStartTime: 0,
    playbackStartBar: 0,
    playbackEndTime: 0,
    selectedPreset: "warehouse",
    isPlaying: false,
    isExporting: false,
    metronome: false,
    currentStep: -1,
    audioContext: null,
    masterGain: null,
    schedulerId: null,
    nextStepTime: 0,
    stepIndex: 0,
    stepTimers: new Set(),
    noiseBuffer: null,
    toastTimer: null,
    sampleTrackId: null,
    pendingImportTrackId: null,
    mediaRecorder: null,
    recordingStream: null,
    recordingChunks: [],
    recordingStartBar: 0,
  };

  const $ = (selector) => document.querySelector(selector);
  const trackList = $("#track-list");
  const stepsHeader = $("#steps-header");
  const patternCards = $("#pattern-cards");
  const playButton = $("#play-button");
  const tempoValue = $("#tempo-value");
  const swingSlider = $("#swing-slider");
  const sampleInput = $("#sample-input");
  const drumSamplesInput = $("#drum-samples-input");
  const toast = $("#toast");

  function makeTracks() {
    const tracks = TRACKS.map((definition) => {
      const cells = Array(STEP_COUNT).fill(false);
      definition.hits.forEach((step) => { cells[step] = true; });
      return { ...definition, cells, variant: "classic", muted: false, solo: false, sample: null, gainNode: null };
    });
    tracks.forEach(ensureSequencerTrackAudio);
    return tracks;
  }

  function renderHeader() {
    stepsHeader.innerHTML = "";
    const gridHeader = stepsHeader.parentElement;
    gridHeader.classList.toggle("is-two-bars", state.steps === 32);
    stepsHeader.style.gridTemplateRows = state.steps === 32 ? "repeat(2, 17px)" : "";
    for (let step = 0; step < state.steps; step += 1) {
      const barStep = step % 16;
      const number = document.createElement("span");
      number.className = `step-number${barStep % 4 === 0 ? " is-beat" : ""}${barStep === 0 ? " is-bar" : ""}`;
      number.textContent = String(barStep + 1).padStart(2, "0");
      stepsHeader.append(number);
    }
  }

  function renderTracks() {
    trackList.innerHTML = "";
    state.tracks.forEach((track) => {
      const row = document.createElement("div");
      row.className = "track-row";
      row.dataset.trackId = track.id;
      row.style.setProperty("--track-color", track.color);

      const meta = document.createElement("div");
      meta.className = "track-meta";
      const color = document.createElement("span");
      color.className = "track-color";
      color.setAttribute("aria-hidden", "true");
      const info = document.createElement("div");
      info.className = "track-info";
      const name = document.createElement("div");
      name.className = "track-name";
      name.textContent = track.name;
      const subtitle = document.createElement("div");
      subtitle.className = `track-subtitle${track.sample ? " has-sample" : ""}`;
      subtitle.title = track.sample?.name || track.subtitle;
      subtitle.textContent = track.sample?.name || track.subtitle;
      info.append(name, subtitle);
      const soundSelect = makeSoundSelect(track);
      if (soundSelect) info.append(soundSelect);

      const controls = document.createElement("div");
      controls.className = "track-controls";
      controls.append(
        makeTrackButton("mute", "Mute track", track),
        makeTrackButton("solo", "Solo track", track),
        makeTrackButton("sample", track.sample ? "Replace loaded sample" : "Load an audio sample", track),
      );
      if (track.kind === "sample") controls.append(makeTrackButton("remove", "Remove imported drum sound", track));
      const volume = document.createElement("input");
      volume.className = "track-volume";
      volume.type = "range";
      volume.min = "0";
      volume.max = "100";
      volume.value = String(Math.round(track.volume * 100));
      volume.setAttribute("aria-label", `${track.name} volume`);
      volume.addEventListener("input", () => {
        track.volume = Number(volume.value) / 100;
        updateTrackGains();
        saveState();
      });
      controls.append(volume);
      meta.append(color, info, controls);

      const grid = document.createElement("div");
      grid.className = "steps-grid";
      grid.setAttribute("role", "group");
      grid.setAttribute("aria-label", `${track.name} steps`);
      for (let step = 0; step < state.steps; step += 1) {
        const cell = document.createElement("button");
        cell.className = `step-cell${track.cells[step] ? " is-on" : ""}`;
        cell.type = "button";
        cell.dataset.step = String(step);
        cell.setAttribute("aria-label", `${track.name}, step ${step + 1}${track.cells[step] ? ", on" : ", off"}`);
        cell.setAttribute("aria-pressed", String(track.cells[step]));
        if (state.currentStep === step) cell.classList.add("is-playhead");
        cell.addEventListener("click", () => {
          track.cells[step] = !track.cells[step];
          cell.classList.toggle("is-on", track.cells[step]);
          cell.setAttribute("aria-pressed", String(track.cells[step]));
          cell.setAttribute("aria-label", `${track.name}, step ${step + 1}${track.cells[step] ? ", on" : ", off"}`);
          saveState();
        });
        grid.append(cell);
      }
      row.append(meta, grid);
      trackList.append(row);
    });
    $("#track-count").textContent = String(state.tracks.length).padStart(2, "0");
    renderInstrumentBrowser();
  }

  function makeSoundSelect(track, compact = false) {
    const sounds = SOUND_VARIANTS[track.kind];
    if (!sounds) return null;
    const select = document.createElement("select");
    select.className = `sound-variant${compact ? " is-compact" : ""}`;
    select.setAttribute("aria-label", `${track.name} sound`);
    sounds.forEach((sound) => {
      const option = document.createElement("option");
      option.value = sound.id;
      option.textContent = sound.name;
      select.append(option);
    });
    select.value = track.variant || "classic";
    select.addEventListener("change", () => {
      track.variant = select.value;
      saveState();
      renderTracks();
      if (state.view === "arrangement") renderArrangement();
    });
    return select;
  }

  function makeTrackButton(type, label, track) {
    const button = document.createElement("button");
    button.className = `track-icon-button${(type === "mute" && track.muted) || (type === "solo" && track.solo) ? " is-active" : ""}`;
    button.type = "button";
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
    if (type === "sample") {
      button.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4v12M4 10h12" /></svg>';
      button.addEventListener("click", () => {
        state.sampleTrackId = track.id;
        sampleInput.click();
      });
      return button;
    }
    if (type === "remove") {
      button.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 6h12m-10 0 .7 10h6.6L14 6M8 6V4h4v2m-3 3v4m2-4v4" /></svg>';
      button.addEventListener("click", () => removeImportedDrumTrack(track));
      return button;
    }
    if (type === "mute") {
      button.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 8v4h3l4 3V5L7 8H4Z" /><path d="m14 8 4 4m0-4-4 4" /></svg>';
    } else {
      button.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="6.5" /><path d="M10 7v6m-2-3h4" /></svg>';
    }
    button.setAttribute("aria-pressed", String(type === "mute" ? track.muted : track.solo));
    button.addEventListener("click", () => {
      if (type === "mute") track.muted = !track.muted;
      else track.solo = !track.solo;
      renderTracks();
      updateTrackGains();
      saveState();
    });
    return button;
  }

  function renderPresets() {
    patternCards.innerHTML = "";
    PRESETS.forEach((preset) => {
      const card = document.createElement("button");
      card.className = `pattern-card${state.selectedPreset === preset.id ? " is-selected" : ""}`;
      card.type = "button";
      card.style.setProperty("--pattern-color", preset.color);
      card.setAttribute("aria-pressed", String(state.selectedPreset === preset.id));
      card.innerHTML = `<span class="pattern-card-tag">${preset.tag}</span><span class="pattern-card-title">${preset.title}</span><span class="pattern-card-description">${preset.description}</span>`;
      card.addEventListener("click", () => loadPreset(preset));
      patternCards.append(card);
    });
  }

  function loadPreset(preset) {
    state.selectedPreset = preset.id;
    state.bpm = preset.bpm;
    tempoValue.textContent = String(state.bpm);
    state.tracks.forEach((track) => {
      track.cells.fill(false);
      (preset.hits[track.id] || []).forEach((step) => { track.cells[step] = true; });
    });
    renderTracks();
    renderPresets();
    $("#arrangement-pattern-length").value = String(state.steps);
    updateArrangementLength();
    if (state.view === "arrangement") renderArrangement();
    saveState();
    showToast(`${preset.title} pattern loaded`);
  }

  function setLength(steps) {
    state.steps = steps;
    $("#arrangement-pattern-length").value = String(steps);
    state.patternClips.forEach((clip) => { clip.startBar = Math.min(clip.startBar, maxPatternStartBar()); });
    document.querySelectorAll(".length-button").forEach((button) => {
      const selected = Number(button.dataset.steps) === steps;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    $("#bar-label").textContent = steps === 16 ? "1 BAR" : "2 BARS";
    renderHeader();
    renderTracks();
    updateArrangementLength();
    if (state.view === "arrangement") renderArrangement();
    if (state.currentStep >= steps) state.currentStep = -1;
    saveState();
  }

  function initializeAudio() {
    if (!state.audioContext) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) throw new Error("Web Audio is not supported in this browser.");
      state.audioContext = new AudioContext();
      state.masterGain = state.audioContext.createGain();
      state.masterGain.gain.value = 0.82;
      state.masterGain.connect(state.audioContext.destination);
      state.tracks.forEach(ensureSequencerTrackAudio);
      state.noiseBuffer = createNoiseBuffer(state.audioContext);
    }
    state.arrangementTracks.forEach(ensureArrangementTrackAudio);
    return state.audioContext;
  }

  function ensureAudio() {
    const context = initializeAudio();
    return context.resume();
  }

  function createNoiseBuffer(context) {
    const buffer = context.createBuffer(1, context.sampleRate, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;
    return buffer;
  }

  function getStepDuration() {
    return 60 / state.bpm / 4;
  }

  function scheduleStep(step, time) {
    state.tracks.forEach((track) => {
      if (track.cells[step] && !track.muted && (!state.tracks.some((item) => item.solo) || track.solo)) {
        triggerTrack(track, time, step);
      }
    });
    if (state.metronome && step % 4 === 0) triggerClick(time, step % 16 === 0);

    const displayDelay = Math.max(0, (time - state.audioContext.currentTime) * 1000);
    const timerId = window.setTimeout(() => {
      state.stepTimers.delete(timerId);
      if (state.isPlaying) setPlayhead(step);
    }, displayDelay);
    state.stepTimers.add(timerId);
  }

  function scheduler() {
    if (state.view === "arrangement" && state.isPlaying) {
      if (state.audioContext.currentTime >= state.playbackEndTime) {
        stopPlayback();
        return;
      }
      const elapsed = Math.max(0, state.audioContext.currentTime - state.playbackStartTime);
      state.arrangementCursor = Math.min(state.arrangementBars, state.playbackStartBar + elapsed / (240 / state.bpm));
      updateArrangementCursorMarker();
    }
    const lookAhead = 0.12;
    while (
      state.nextStepTime < state.audioContext.currentTime + lookAhead &&
      (state.view !== "arrangement" || state.nextStepTime < state.playbackEndTime)
    ) {
      const clockStep = state.stepIndex;
      const step = state.view === "arrangement" ? arrangementStepAtTime(state.nextStepTime) : state.stepIndex;
      const swingOffset = (step >= 0 ? step : clockStep) % 2 === 1 ? getStepDuration() * (state.swing / 100) : 0;
      if (step >= 0) scheduleStep(step, state.nextStepTime + swingOffset);
      else if (state.metronome && clockStep % 4 === 0) triggerClick(state.nextStepTime, clockStep % 16 === 0);
      state.nextStepTime += getStepDuration();
      state.stepIndex = (clockStep + 1) % state.steps;
    }
  }

  function arrangementStepAtTime(time) {
    const barPosition = state.playbackStartBar + (time - state.playbackStartTime) / (240 / state.bpm);
    const patternBars = state.steps / 16;
    const clip = state.patternClips.find((item) => barPosition >= item.startBar && barPosition < item.startBar + patternBars);
    return clip ? Math.floor((barPosition - clip.startBar) * 16 + 0.00001) % state.steps : -1;
  }

  function setPlayhead(step) {
    state.currentStep = step;
    document.querySelectorAll(".step-cell.is-playhead").forEach((cell) => cell.classList.remove("is-playhead"));
    document.querySelectorAll(`.step-cell[data-step="${step}"]`).forEach((cell) => cell.classList.add("is-playhead"));
  }

  function makeId() {
    return window.crypto?.randomUUID?.() || `clip-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function maxPatternStartBar() {
    return Math.max(0, MAX_ARRANGEMENT_BARS - state.steps / 16);
  }

  function isAudioFile(file) {
    return file.type.startsWith("audio/") || /\.(wav|wave|mp3|m4a|aac|flac|ogg|opus|webm|aiff?)$/i.test(file.name);
  }

  function makeDrumSampleTrack(options) {
    const name = options.name?.trim() || "Imported drum";
    const track = {
      id: options.id || makeId(),
      name,
      kind: "sample",
      color: /^#[\da-f]{6}$/i.test(options.color || "") ? options.color : TRACK_COLORS[state.tracks.length % TRACK_COLORS.length],
      subtitle: "Imported drum sample",
      volume: Number.isFinite(options.volume) ? Math.max(0, Math.min(1, options.volume)) : 0.72,
      cells: Array.from({ length: STEP_COUNT }, (_, index) => options.cells?.[index] === true),
      variant: null,
      muted: options.muted === true,
      solo: options.solo === true,
      sample: options.buffer ? { name: options.fileName || name, buffer: options.buffer } : null,
      gainNode: null,
    };
    ensureSequencerTrackAudio(track);
    return track;
  }

  async function importDrumSamples(files) {
    if (!files.length) return;
    const imported = [];
    const failures = [];
    try {
      await ensureAudio();
      for (const file of files) {
        if (!isAudioFile(file)) {
          failures.push(file.name);
          continue;
        }
        try {
          const buffer = await state.audioContext.decodeAudioData(await file.arrayBuffer());
          const track = makeDrumSampleTrack({
            name: file.name.replace(/\.[^.]+$/, "") || file.name,
            fileName: file.name,
            buffer,
          });
          state.tracks.push(track);
          imported.push({ track, file });
        } catch {
          failures.push(file.name);
        }
      }

      if (imported.length) {
        renderTracks();
        if (state.view === "arrangement") renderArrangement();
        saveState();
        const saves = await Promise.allSettled(imported.map(({ track, file }) => persistDrumSample(track, file)));
        const storageFailed = saves.some((result) => result.status === "rejected");
        const summary = `${imported.length} drum sound${imported.length === 1 ? "" : "s"} imported`;
        showToast(`${summary}${failures.length ? `; ${failures.length} could not be decoded` : ""}${storageFailed ? "; some couldn't be saved" : ""}.`);
      } else {
        showToast(failures.length ? `Could not import ${failures.join(", ")}.` : "Choose one or more audio files.");
      }
    } catch (error) {
      showToast(`Could not import drum sounds: ${error.message || "audio is unavailable"}`);
    } finally {
      drumSamplesInput.value = "";
    }
  }

  function removeImportedDrumTrack(track) {
    if (state.isPlaying) stopPlayback();
    track.gainNode?.disconnect();
    state.tracks = state.tracks.filter((item) => item !== track);
    renderTracks();
    if (state.view === "arrangement") renderArrangement();
    updateTrackGains();
    saveState();
    deletePersistedDrumSample(track.id).catch(() => {
      showToast("Track removed, but its saved sample could not be deleted.");
    });
    showToast(`${track.name} removed`);
  }

  function createArrangementTrack(name = "Audio track") {
    const track = {
      id: makeId(),
      name,
      color: TRACK_COLORS[state.arrangementTracks.length % TRACK_COLORS.length],
      clips: [],
      volume: 0.8,
      muted: false,
      solo: false,
      gainNode: null,
    };
    state.arrangementTracks.push(track);
    ensureArrangementTrackAudio(track);
    return track;
  }

  function ensureArrangementTrackAudio(track) {
    if (!state.audioContext || track.gainNode) return;
    track.gainNode = state.audioContext.createGain();
    track.gainNode.gain.value = track.muted ? 0 : track.volume;
    track.gainNode.connect(state.masterGain);
  }

  function ensureSequencerTrackAudio(track) {
    if (!state.audioContext || track.gainNode) return;
    track.gainNode = state.audioContext.createGain();
    track.gainNode.gain.value = track.volume;
    track.gainNode.connect(state.masterGain);
  }

  function updateArrangementLength() {
    const secondsPerBar = 240 / state.bpm;
    const clipEnd = state.arrangementTracks.reduce((latest, track) => {
      return track.clips.reduce((end, clip) => Math.max(end, clip.startBar + clip.buffer.duration / secondsPerBar), latest);
    }, state.patternClips.reduce((end, clip) => Math.max(end, clip.startBar + state.steps / 16), 8));
    state.arrangementBars = Math.min(MAX_ARRANGEMENT_BARS, Math.max(state.arrangementBars, Math.ceil(clipEnd)));
    if (state.playbackStartTime && state.isPlaying && state.view === "arrangement") {
      state.playbackEndTime = state.playbackStartTime + (state.arrangementBars - state.playbackStartBar) * secondsPerBar;
    }
    $("#arrangement-bar-label").textContent = `${state.arrangementBars} BARS`;
  }

  function renderArrangement() {
    const editor = $("#arrangement-editor");
    $("#arrangement-empty").hidden = true;
    editor.hidden = false;
    $("#arrangement-tab-count").textContent = String(state.arrangementTracks.length + state.patternClips.length);
    $("#arrangement-track-count").textContent = String(state.arrangementTracks.length + 1).padStart(2, "0");
    renderInstrumentBrowser();
    renderRecordingBrowser();

    const width = state.arrangementBars * BAR_WIDTH;
    const labels = $("#arrangement-track-labels");
    const content = $("#timeline-content");
    labels.replaceChildren();
    content.replaceChildren();
    content.style.width = `${width}px`;

    const ruler = document.createElement("div");
    ruler.className = "timeline-ruler";
    ruler.style.width = `${width}px`;
    ruler.style.gridTemplateColumns = `repeat(${state.arrangementBars}, ${BAR_WIDTH}px)`;
    for (let bar = 0; bar < state.arrangementBars; bar += 1) {
      const marker = document.createElement("div");
      marker.className = "timeline-bar";
      marker.textContent = `BAR ${String(bar + 1).padStart(2, "0")}`;
      ruler.append(marker);
    }
    content.append(ruler);

    const drumLabel = document.createElement("div");
    drumLabel.className = "arrangement-label";
    drumLabel.innerHTML = '<span class="track-color" style="--track-color:var(--accent)"></span><div class="arrangement-label-info"><div class="arrangement-label-name">Drum pattern</div><div class="arrangement-label-type">Sequencer loop</div></div>';
    labels.append(drumLabel);

    const drumLane = createTimelineLane("drums", width);
    state.patternClips.forEach((clip) => drumLane.append(createPatternClip(clip)));
    content.append(drumLane);

    state.arrangementTracks.forEach((track) => {
      const label = document.createElement("div");
      label.className = "arrangement-label";
      label.style.setProperty("--track-color", track.color);
      const color = document.createElement("span");
      color.className = "track-color";
      const info = document.createElement("div");
      info.className = "arrangement-label-info";
      const name = document.createElement("div");
      name.className = "arrangement-label-name";
      name.textContent = track.name;
      const type = document.createElement("div");
      type.className = "arrangement-label-type";
      type.textContent = `${track.clips.length} recording${track.clips.length === 1 ? "" : "s"}`;
      info.append(name, type);
      const actions = document.createElement("div");
      actions.className = "arrangement-label-actions";
      const add = document.createElement("button");
      add.type = "button";
      add.title = "Add a recording to this track";
      add.setAttribute("aria-label", `Add recording to ${track.name}`);
      add.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4v12M4 10h12" /></svg>';
      add.addEventListener("click", () => requestRecordingImport(track.id));
      const mute = document.createElement("button");
      mute.type = "button";
      mute.className = track.muted ? "is-active" : "";
      mute.title = track.muted ? "Unmute track" : "Mute track";
      mute.setAttribute("aria-label", mute.title);
      mute.setAttribute("aria-pressed", String(track.muted));
      mute.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 8v4h3l4 3V5L7 8H4Z" /><path d="m14 8 4 4m0-4-4 4" /></svg>';
      mute.addEventListener("click", () => {
        track.muted = !track.muted;
        updateTrackGains();
        renderArrangement();
        persistTrackClips(track);
      });
      actions.append(add, mute);
      const volume = document.createElement("input");
      volume.className = "arrangement-volume";
      volume.type = "range";
      volume.min = "0";
      volume.max = "100";
      volume.value = String(Math.round(track.volume * 100));
      volume.setAttribute("aria-label", `${track.name} volume`);
      volume.addEventListener("input", () => {
        track.volume = Number(volume.value) / 100;
        updateTrackGains();
      });
      volume.addEventListener("change", () => persistTrackClips(track));
      label.append(color, info, actions, volume);
      labels.append(label);

      const lane = createTimelineLane(track.id, width);
      track.clips.forEach((clip) => lane.append(createAudioClip(track, clip)));
      content.append(lane);
    });
    updateArrangementCursorMarker();
  }

  function renderInstrumentBrowser() {
    const browser = $("#instrument-browser");
    browser.replaceChildren();
    $("#drum-sound-count").textContent = String(state.tracks.length);
    state.tracks.forEach((track) => {
      const row = document.createElement("div");
      row.className = "instrument-source";
      const color = document.createElement("span");
      color.className = "source-color";
      color.style.background = track.color;
      const name = document.createElement("span");
      name.className = "instrument-source-name";
      name.textContent = track.name;
      name.title = track.sample?.name || track.subtitle;
      row.append(color, name);
      const soundSelect = makeSoundSelect(track, true);
      if (soundSelect) row.append(soundSelect);
      browser.append(row);
    });
  }

  function renderRecordingBrowser() {
    const browser = $("#recording-browser");
    browser.replaceChildren();
    $("#recording-source-count").textContent = String(state.arrangementTracks.length);
    if (!state.arrangementTracks.length) {
      const empty = document.createElement("div");
      empty.className = "recording-source-empty";
      empty.textContent = "No audio imported yet";
      browser.append(empty);
      return;
    }
    state.arrangementTracks.forEach((track) => {
      const item = document.createElement("button");
      item.className = "recording-source";
      item.type = "button";
      item.title = `Show ${track.name} on the timeline`;
      const color = document.createElement("span");
      color.className = "source-color";
      color.style.background = track.color;
      const name = document.createElement("span");
      name.className = "recording-source-name";
      name.textContent = track.name;
      const count = document.createElement("span");
      count.className = "recording-source-count";
      count.textContent = String(track.clips.length);
      item.append(color, name, count);
      item.addEventListener("click", () => {
        const clip = track.clips[0];
        if (!clip) return;
        setArrangementCursor(clip.startBar);
        $("#timeline-scroll").scrollLeft = clip.startBar * BAR_WIDTH;
        $("#source-browser-dialog").close();
      });
      browser.append(item);
    });
  }

  function addPatternClip(startBar = state.arrangementCursor) {
    state.patternClips.push({ id: makeId(), startBar: Math.max(0, Math.min(maxPatternStartBar(), Math.floor(startBar))) });
    state.patternClips.sort((left, right) => left.startBar - right.startBar);
    updateArrangementLength();
    renderArrangement();
    saveState();
    showToast("Drum pattern added to the arrangement");
  }

  function movePatternClip(clipId, startBar) {
    const clip = state.patternClips.find((item) => item.id === clipId);
    if (!clip) return;
    clip.startBar = Math.max(0, Math.min(maxPatternStartBar(), Math.floor(startBar)));
    state.patternClips.sort((left, right) => left.startBar - right.startBar);
    updateArrangementLength();
    renderArrangement();
    saveState();
  }

  function removePatternClip(clipId) {
    state.patternClips = state.patternClips.filter((clip) => clip.id !== clipId);
    updateArrangementLength();
    renderArrangement();
    saveState();
  }

  function createTimelineLane(trackId, width) {
    const lane = document.createElement("div");
    lane.className = "timeline-lane";
    lane.dataset.trackId = trackId;
    lane.style.width = `${width}px`;
    lane.style.setProperty("--bar-width", `${BAR_WIDTH}px`);
    lane.style.setProperty("--beat-width", `${BAR_WIDTH / 4}px`);
    lane.addEventListener("click", (event) => {
      if (event.target.closest(".audio-clip")) return;
      setArrangementCursor(barAtPointer(event, lane));
    });
    lane.addEventListener("dragover", (event) => {
      event.preventDefault();
      lane.classList.add("is-drop-target");
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = event.dataTransfer.files.length ? "copy" : "move";
      }
    });
    lane.addEventListener("dragleave", (event) => {
      if (!lane.contains(event.relatedTarget)) lane.classList.remove("is-drop-target");
    });
    lane.addEventListener("drop", async (event) => {
      event.preventDefault();
      lane.classList.remove("is-drop-target");
      const startBar = barAtPointer(event, lane);
      const files = Array.from(event.dataTransfer?.files || []);
      if (files.length) {
        for (const file of files) await importRecording(file, trackId === "drums" ? null : trackId, startBar);
        return;
      }
      if (trackId === "drums") {
        const patternTransfer = event.dataTransfer?.getData("application/x-pulsegrid-pattern-clip");
        if (!patternTransfer) return;
        try {
          const { clipId } = JSON.parse(patternTransfer);
          movePatternClip(clipId, startBar);
        } catch {
          showToast("That drum pattern could not be moved.");
        }
        return;
      }
      const transfer = event.dataTransfer?.getData("application/x-pulsegrid-audio-clip");
      if (!transfer) return;
      try {
        const { clipId, sourceTrackId } = JSON.parse(transfer);
        moveArrangementClip(clipId, sourceTrackId, trackId, startBar);
      } catch {
        showToast("That audio clip could not be moved.");
      }
    });
    const cursor = document.createElement("div");
    cursor.className = "arrangement-cursor";
    lane.append(cursor);
    return lane;
  }

  function barAtPointer(event, lane) {
    const bar = Math.floor((event.clientX - lane.getBoundingClientRect().left) / BAR_WIDTH);
    return Math.max(0, Math.min(MAX_ARRANGEMENT_BARS - 1, bar));
  }

  function createAudioClip(track, clip) {
    const element = document.createElement("div");
    element.className = "audio-clip";
    element.draggable = true;
    element.dataset.clipId = clip.id;
    element.style.setProperty("--clip-color", track.color);
    element.style.left = `${clip.startBar * BAR_WIDTH + 4}px`;
    element.style.width = `${Math.max(64, clip.buffer.duration / (240 / state.bpm) * BAR_WIDTH - 8)}px`;
    element.setAttribute("aria-label", `${clip.name}, bar ${clip.startBar + 1}; drag to move`);

    const waveform = document.createElement("span");
    waveform.className = "clip-waveform";
    const samples = clip.buffer.getChannelData(0);
    const peakCount = Math.max(12, Math.min(48, Math.floor(clip.buffer.duration * 5)));
    const stride = Math.max(1, Math.floor(samples.length / peakCount));
    const sampleStride = Math.max(1, Math.floor(stride / 80));
    for (let index = 0; index < peakCount; index += 1) {
      let peak = 0;
      const start = index * stride;
      for (let sample = start; sample < Math.min(samples.length, start + stride); sample += sampleStride) peak = Math.max(peak, Math.abs(samples[sample]));
      const bar = document.createElement("i");
      bar.style.height = `${Math.max(8, Math.round(peak * 82))}%`;
      waveform.append(bar);
    }
    const name = document.createElement("span");
    name.className = "clip-name";
    name.textContent = clip.name;
    const remove = document.createElement("button");
    remove.className = "clip-remove";
    remove.type = "button";
    remove.textContent = "×";
    remove.title = "Remove recording";
    remove.setAttribute("aria-label", `Remove ${clip.name}`);
    remove.addEventListener("click", (event) => {
      event.stopPropagation();
      removeArrangementClip(track.id, clip.id);
    });
    element.addEventListener("dragstart", (event) => {
      event.dataTransfer?.setData("application/x-pulsegrid-audio-clip", JSON.stringify({ clipId: clip.id, sourceTrackId: track.id }));
      if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
    });
    element.addEventListener("click", (event) => {
      if (event.target.closest(".clip-remove")) return;
      setArrangementCursor(clip.startBar);
    });
    element.append(waveform, name, remove);
    return element;
  }

  function createPatternClip(clip) {
    const element = document.createElement("div");
    element.className = "drum-arrangement-clip";
    element.draggable = true;
    element.style.left = `${clip.startBar * BAR_WIDTH + 4}px`;
    element.style.width = `${Math.max(28, state.steps / 16 * BAR_WIDTH - 8)}px`;
    element.setAttribute("aria-label", `Drum pattern, bar ${clip.startBar + 1}; drag to move`);
    const icon = document.createElement("span");
    icon.className = "pattern-clip-icon";
    icon.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 11h3l2-6 4 10 2-6h3" /></svg>';
    const text = document.createElement("span");
    text.className = "pattern-clip-name";
    text.textContent = `DRUM PATTERN · ${state.steps / 16} BAR${state.steps > 16 ? "S" : ""}`;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "pattern-clip-remove";
    remove.title = "Remove pattern clip";
    remove.setAttribute("aria-label", "Remove drum pattern clip");
    remove.textContent = "×";
    remove.addEventListener("click", (event) => {
      event.stopPropagation();
      removePatternClip(clip.id);
    });
    element.addEventListener("dragstart", (event) => {
      event.dataTransfer?.setData("application/x-pulsegrid-pattern-clip", JSON.stringify({ clipId: clip.id }));
      if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
    });
    element.addEventListener("click", (event) => {
      if (!event.target.closest(".pattern-clip-remove")) setArrangementCursor(clip.startBar);
    });
    element.append(icon, text, remove);
    return element;
  }

  function updateArrangementCursorMarker() {
    document.querySelectorAll(".arrangement-cursor").forEach((marker) => {
      marker.style.left = `${state.arrangementCursor * BAR_WIDTH}px`;
    });
  }

  function setArrangementCursor(bar) {
    if (state.isPlaying) stopPlayback();
    state.arrangementCursor = Math.max(0, Math.min(state.arrangementBars - 1, Math.floor(bar)));
    updateArrangementCursorMarker();
    saveState();
  }

  function setWorkspaceView(view, force = false) {
    if (view === state.view && !force) return;
    if (state.isPlaying) stopPlayback();
    state.view = view;
    const showArrangement = view === "arrangement";
    $("#sequencer-view").hidden = showArrangement;
    $("#arrangement-view").hidden = !showArrangement;
    $("#sequencer-tab").classList.toggle("is-selected", !showArrangement);
    $("#sequencer-tab").setAttribute("aria-selected", String(!showArrangement));
    $("#arrangement-tab").classList.toggle("is-selected", showArrangement);
    $("#arrangement-tab").setAttribute("aria-selected", String(showArrangement));
    if (showArrangement) renderArrangement();
    saveState();
  }

  function requestRecordingImport(trackId = null) {
    state.pendingImportTrackId = trackId;
    const input = $("#recording-input");
    input.value = "";
    input.click();
  }

  async function importRecording(file, trackId = null, startBar = state.arrangementCursor) {
    if (!isAudioFile(file)) {
      showToast(`"${file.name}" is not an audio file.`);
      return;
    }
    try {
      await ensureAudio();
      const buffer = await state.audioContext.decodeAudioData(await file.arrayBuffer());
      let track = state.arrangementTracks.find((item) => item.id === trackId);
      if (!track) track = createArrangementTrack(file.name.replace(/\.[^.]+$/, "") || "Audio track");
      const clip = { id: makeId(), name: file.name, buffer, startBar: Math.max(0, Math.floor(startBar)), blob: file };
      track.clips.push(clip);
      track.clips.sort((left, right) => left.startBar - right.startBar);
      updateArrangementLength();
      renderArrangement();
      saveState();
      try {
        await persistClip(track, clip);
      } catch {
        showToast("Recording added for this session, but browser storage is unavailable.");
      }
    } catch (error) {
      showToast(`Could not import ${file.name}: ${error.message || "unsupported audio format"}`);
    }
  }

  async function toggleAudioRecording() {
    if (state.mediaRecorder?.state === "recording") {
      $("#record-audio-button").disabled = true;
      $("#record-button-label").textContent = "Saving recording…";
      state.mediaRecorder.stop();
      return;
    }
    if (!window.navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      showToast("Microphone recording is not supported in this browser.");
      return;
    }
    try {
      const stream = await window.navigator.mediaDevices.getUserMedia({ audio: true });
      state.recordingStream = stream;
      state.recordingChunks = [];
      state.recordingStartBar = state.arrangementCursor;
      const mimeType = window.MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "";
      const recorder = new window.MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      state.mediaRecorder = recorder;
      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size) state.recordingChunks.push(event.data);
      });
      recorder.addEventListener("error", () => showToast("Microphone recording stopped because of an error."));
      recorder.addEventListener("stop", async () => {
        stream.getTracks().forEach((track) => track.stop());
        state.recordingStream = null;
        state.mediaRecorder = null;
        const chunks = state.recordingChunks;
        state.recordingChunks = [];
        $("#record-audio-button").classList.remove("is-recording");
        $("#record-audio-button").disabled = false;
        $("#record-audio-button").setAttribute("aria-pressed", "false");
        $("#record-button-label").textContent = "Record input";
        const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        if (!blob.size) {
          showToast("No audio was captured.");
          return;
        }
        const extension = blob.type.includes("ogg") ? "ogg" : "webm";
        const name = `Recording-${new Date().toISOString().replace(/[:.]/g, "-")}.${extension}`;
        try {
          await importRecording(new File([blob], name, { type: blob.type }), null, state.recordingStartBar);
        } catch (error) {
          showToast(`Could not add recording: ${error.message || "unknown error"}`);
        }
      });
      recorder.start();
      $("#record-audio-button").classList.add("is-recording");
      $("#record-audio-button").disabled = false;
      $("#record-audio-button").setAttribute("aria-pressed", "true");
      $("#record-button-label").textContent = "Stop recording";
      showToast(`Recording from bar ${state.recordingStartBar + 1}`);
    } catch (error) {
      state.recordingStream?.getTracks().forEach((track) => track.stop());
      state.recordingStream = null;
      state.mediaRecorder = null;
      showToast(`Microphone unavailable: ${error.message || "permission was denied"}`);
    }
  }

  function moveArrangementClip(clipId, sourceTrackId, destinationTrackId, startBar) {
    const source = state.arrangementTracks.find((track) => track.id === sourceTrackId);
    const destination = state.arrangementTracks.find((track) => track.id === destinationTrackId);
    const clipIndex = source?.clips.findIndex((clip) => clip.id === clipId) ?? -1;
    if (!source || !destination || clipIndex < 0) return;
    const [clip] = source.clips.splice(clipIndex, 1);
    clip.startBar = startBar;
    destination.clips.push(clip);
    destination.clips.sort((left, right) => left.startBar - right.startBar);
    if (source !== destination && source.clips.length === 0) {
      state.arrangementTracks = state.arrangementTracks.filter((track) => track !== source);
    }
    updateArrangementLength();
    renderArrangement();
    saveState();
    persistClip(destination, clip).catch(() => showToast("Clip moved, but browser storage could not be updated."));
    if (source !== destination) persistTrackClips(source);
  }

  function removeArrangementClip(trackId, clipId) {
    const track = state.arrangementTracks.find((item) => item.id === trackId);
    if (!track) return;
    track.clips = track.clips.filter((clip) => clip.id !== clipId);
    if (track.clips.length === 0) state.arrangementTracks = state.arrangementTracks.filter((item) => item !== track);
    deletePersistedClip(clipId);
    updateArrangementLength();
    renderArrangement();
    saveState();
  }

  function openRecordingDb() {
    if (!window.indexedDB) return Promise.reject(new Error("IndexedDB is unavailable"));
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open("pulsegrid-recordings", 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains("recordings")) request.result.createObjectStore("recordings", { keyPath: "id" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Could not open recording storage"));
    });
  }

  function persistClip(track, clip) {
    return openRecordingDb().then((database) => new Promise((resolve, reject) => {
      const transaction = database.transaction("recordings", "readwrite");
      transaction.objectStore("recordings").put({
        id: clip.id,
        trackId: track.id,
        trackName: track.name,
        color: track.color,
        name: clip.name,
        startBar: clip.startBar,
        volume: track.volume,
        muted: track.muted,
        blob: clip.blob,
      });
      transaction.oncomplete = () => { database.close(); resolve(); };
      transaction.onerror = () => { database.close(); reject(transaction.error || new Error("Could not save recording")); };
      transaction.onabort = () => { database.close(); reject(transaction.error || new Error("Recording save was cancelled")); };
    }));
  }

  function persistDrumSample(track, file) {
    return openRecordingDb().then((database) => new Promise((resolve, reject) => {
      const transaction = database.transaction("recordings", "readwrite");
      transaction.objectStore("recordings").put({
        id: `drum-sample:${track.id}`,
        recordType: "drum-sample",
        trackId: track.id,
        trackName: track.name,
        fileName: file.name,
        color: track.color,
        volume: track.volume,
        muted: track.muted,
        solo: track.solo,
        cells: track.cells,
        blob: file,
      });
      transaction.oncomplete = () => { database.close(); resolve(); };
      transaction.onerror = () => { database.close(); reject(transaction.error || new Error("Could not save drum sample")); };
      transaction.onabort = () => { database.close(); reject(transaction.error || new Error("Drum sample save was cancelled")); };
    }));
  }

  function deletePersistedDrumSample(trackId) {
    return openRecordingDb().then((database) => new Promise((resolve, reject) => {
      const transaction = database.transaction("recordings", "readwrite");
      transaction.objectStore("recordings").delete(`drum-sample:${trackId}`);
      transaction.oncomplete = () => { database.close(); resolve(); };
      transaction.onerror = () => { database.close(); reject(transaction.error || new Error("Could not remove drum sample")); };
      transaction.onabort = () => { database.close(); reject(transaction.error || new Error("Drum sample removal was cancelled")); };
    }));
  }

  function persistTrackClips(track) {
    track.clips.forEach((clip) => persistClip(track, clip).catch(() => {
      showToast("Could not save the latest track changes.");
    }));
  }

  function deletePersistedClip(clipId) {
    openRecordingDb().then((database) => new Promise((resolve, reject) => {
      const transaction = database.transaction("recordings", "readwrite");
      transaction.objectStore("recordings").delete(clipId);
      transaction.oncomplete = () => { database.close(); resolve(); };
      transaction.onerror = () => { database.close(); reject(transaction.error || new Error("Could not remove recording")); };
    })).catch(() => showToast("The clip was removed, but browser storage could not be updated."));
  }

  async function restoreArrangement() {
    if (!window.indexedDB) return;
    try {
      const database = await openRecordingDb();
      const records = await new Promise((resolve, reject) => {
        const transaction = database.transaction("recordings", "readonly");
        const request = transaction.objectStore("recordings").getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error("Could not read saved recordings"));
        transaction.oncomplete = () => database.close();
      });
      if (!records.length) return;
      initializeAudio();
      const sampleRecords = records.filter((record) => record.recordType === "drum-sample");
      for (const record of sampleRecords) {
        try {
          const buffer = await state.audioContext.decodeAudioData(await record.blob.arrayBuffer());
          let track = state.tracks.find((item) => item.id === record.trackId);
          if (!track) {
            track = makeDrumSampleTrack({
              id: record.trackId,
              name: record.trackName,
              fileName: record.fileName,
              color: record.color,
              volume: record.volume,
              muted: record.muted,
              solo: record.solo,
              cells: record.cells,
              buffer,
            });
            state.tracks.push(track);
          } else {
            track.sample = { name: record.fileName || record.trackName, buffer };
            ensureSequencerTrackAudio(track);
            if (track.kind === "sample") track.subtitle = "Imported drum sample";
          }
        } catch {
          showToast(`Could not restore ${record.fileName || record.trackName || "a drum sample"}.`);
        }
      }

      const clipRecords = records.filter((record) => record.recordType !== "drum-sample");
      for (const record of clipRecords) {
        let track = state.arrangementTracks.find((item) => item.id === record.trackId);
        if (!track) {
          track = {
            id: record.trackId,
            name: record.trackName,
            color: record.color,
            clips: [],
            volume: record.volume,
            muted: record.muted,
            solo: false,
            gainNode: null,
          };
          state.arrangementTracks.push(track);
          ensureArrangementTrackAudio(track);
        }
        try {
          const buffer = await state.audioContext.decodeAudioData(await record.blob.arrayBuffer());
          track.clips.push({ id: record.id, name: record.name, startBar: record.startBar, buffer, blob: record.blob });
        } catch {
          showToast(`Could not restore ${record.name}.`);
        }
      }
      state.arrangementTracks = state.arrangementTracks.filter((track) => track.clips.length > 0);
      if (sampleRecords.length) renderTracks();
      updateArrangementLength();
      renderArrangement();
      if (state.arrangementTracks.length) showToast("Your saved recordings are ready.");
      else if (sampleRecords.length) showToast("Your saved drum sounds are ready.");
    } catch {
      showToast("Saved recordings could not be restored.");
    }
  }

  function updateTrackGains() {
    if (!state.audioContext) return;
    const allTracks = [...state.tracks, ...state.arrangementTracks];
    const hasSolo = allTracks.some((track) => track.solo);
    allTracks.forEach((track) => {
      if (!track.gainNode) return;
      const isSilent = track.muted || (hasSolo && !track.solo);
      track.gainNode.gain.setTargetAtTime(isSilent ? 0 : track.volume, state.audioContext.currentTime, 0.015);
    });
  }

  function triggerTrack(track, time, step) {
    const context = state.audioContext;
    const output = track.gainNode;
    if (track.sample) {
      const source = context.createBufferSource();
      source.buffer = track.sample.buffer;
      const envelope = context.createGain();
      envelope.gain.setValueAtTime(1, time);
      source.connect(envelope);
      envelope.connect(output);
      source.start(time);
      return;
    }
    switch (track.kind) {
      case "kick": playKick(context, output, time, step, track.variant); break;
      case "snare": playSnare(context, output, time, track.variant); break;
      case "clap": playClap(context, output, time, track.variant); break;
      case "hat": playHat(context, output, time, false, track.variant); break;
      case "openhat": playHat(context, output, time, true, track.variant); break;
      case "rim": playRim(context, output, time, track.variant); break;
      default: break;
    }
  }

  function playKick(context, output, time, step, variant) {
    const osc = context.createOscillator();
    const envelope = context.createGain();
    const settings = {
      classic: [148, 43, 0.36],
      deep: [92, 31, 0.56],
      punch: [182, 58, 0.23],
    }[variant] || [148, 43, 0.36];
    const pitch = settings[0] * (step % 8 === 0 ? 1 : 0.88);
    osc.type = "sine";
    osc.frequency.setValueAtTime(pitch, time);
    osc.frequency.exponentialRampToValueAtTime(settings[1], time + settings[2] * 0.38);
    envelope.gain.setValueAtTime(0.0001, time);
    envelope.gain.exponentialRampToValueAtTime(1, time + 0.004);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + settings[2]);
    osc.connect(envelope);
    envelope.connect(output);
    osc.start(time);
    osc.stop(time + settings[2] + 0.02);
  }

  function playNoise(context, output, time, duration, cutoff, peak = 0.35, resonance = 0.7) {
    const source = context.createBufferSource();
    source.buffer = state.noiseBuffer;
    const filter = context.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(cutoff, time);
    filter.Q.value = resonance;
    const envelope = context.createGain();
    envelope.gain.setValueAtTime(0.0001, time);
    envelope.gain.exponentialRampToValueAtTime(peak, time + 0.003);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    source.connect(filter);
    filter.connect(envelope);
    envelope.connect(output);
    source.start(time);
    source.stop(time + duration + 0.015);
  }

  function playSnare(context, output, time, variant) {
    const settings = {
      classic: [0.17, 1500, 0.36, 185, 0.1],
      tight: [0.1, 2300, 0.32, 235, 0.075],
      noise: [0.23, 1000, 0.48, 145, 0.14],
    }[variant] || [0.17, 1500, 0.36, 185, 0.1];
    playNoise(context, output, time, settings[0], settings[1], settings[2]);
    const body = context.createOscillator();
    const envelope = context.createGain();
    body.type = "triangle";
    body.frequency.setValueAtTime(settings[3], time);
    envelope.gain.setValueAtTime(0.2, time);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + settings[4]);
    body.connect(envelope);
    envelope.connect(output);
    body.start(time);
    body.stop(time + settings[4] + 0.02);
  }

  function playClap(context, output, time, variant) {
    const settings = {
      classic: [[0, 0.018, 0.038], 0.17, 1100, 0.28],
      tight: [[0, 0.012], 0.1, 1500, 0.27],
      layered: [[0, 0.018, 0.038, 0.062], 0.22, 900, 0.34],
    }[variant] || [[0, 0.018, 0.038], 0.17, 1100, 0.28];
    settings[0].forEach((offset, index) => {
      const last = index === settings[0].length - 1;
      playNoise(context, output, time + offset, last ? settings[1] : 0.045, settings[2], last ? settings[3] : 0.2);
    });
  }

  function playHat(context, output, time, open, variant) {
    const settings = open
      ? ({ classic: [0.34, 6500, 0.2], shimmer: [0.48, 9000, 0.22], dark: [0.3, 3800, 0.25] }[variant] || [0.34, 6500, 0.2])
      : ({ classic: [0.055, 6500, 0.16], soft: [0.07, 4300, 0.12], bright: [0.045, 10000, 0.2] }[variant] || [0.055, 6500, 0.16]);
    playNoise(context, output, time, settings[0], settings[1], settings[2], 0.55);
  }

  function playRim(context, output, time, variant) {
    const osc = context.createOscillator();
    const envelope = context.createGain();
    osc.type = "triangle";
    const pitch = { classic: [880, 420], low: [190, 110], high: [1450, 720] }[variant] || [880, 420];
    osc.frequency.setValueAtTime(pitch[0], time);
    osc.frequency.exponentialRampToValueAtTime(pitch[1], time + 0.045);
    envelope.gain.setValueAtTime(0.32, time);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + 0.075);
    osc.connect(envelope);
    envelope.connect(output);
    osc.start(time);
    osc.stop(time + 0.09);
  }

  function triggerClick(time, downbeat) {
    const osc = state.audioContext.createOscillator();
    const gain = state.audioContext.createGain();
    osc.frequency.setValueAtTime(downbeat ? 1350 : 950, time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.22, time + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.028);
    osc.connect(gain);
    gain.connect(state.masterGain);
    osc.start(time);
    osc.stop(time + 0.035);
  }

  async function startPlayback() {
    if (state.isPlaying || state.isExporting) return;
    try {
      await ensureAudio();
      state.isPlaying = true;
      const startBar = state.view === "arrangement" ? Math.min(state.arrangementCursor, state.arrangementBars - 1) : 0;
      state.playbackStartBar = startBar;
      state.playbackStartTime = state.audioContext.currentTime + 0.04;
      state.playbackEndTime = state.playbackStartTime + (state.arrangementBars - startBar) * (240 / state.bpm);
      state.stepIndex = state.view === "arrangement" ? Math.floor(startBar * 16) % state.steps : 0;
      state.nextStepTime = state.playbackStartTime;
      updateTrackGains();
      if (state.view === "arrangement") scheduleArrangementClips(state.playbackStartTime, startBar);
      scheduler();
      state.schedulerId = window.setInterval(scheduler, 25);
      playButton.classList.add("is-playing");
      playButton.setAttribute("aria-label", "Pause");
      $("#now-playing").classList.add("is-live");
      $("#now-playing").innerHTML = '<span class="live-dot"></span>PLAYING';
    } catch (error) {
      showToast(error.message || "Audio could not start in this browser.");
    }
  }

  function scheduleArrangementClips(startTime, startBar) {
    const secondsPerBar = 240 / state.bpm;
    state.arrangementTracks.forEach((track) => {
      ensureArrangementTrackAudio(track);
      track.clips.forEach((clip) => {
        const offset = Math.max(0, (startBar - clip.startBar) * secondsPerBar);
        if (offset >= clip.buffer.duration) return;
        const when = startTime + Math.max(0, clip.startBar - startBar) * secondsPerBar;
        const source = state.audioContext.createBufferSource();
        source.buffer = clip.buffer;
        source.connect(track.gainNode);
        source.onended = () => state.arrangementSources.delete(source);
        source.start(when, offset);
        state.arrangementSources.add(source);
      });
    });
  }

  function stopPlayback() {
    if (state.schedulerId !== null) window.clearInterval(state.schedulerId);
    state.schedulerId = null;
    state.isPlaying = false;
    state.stepIndex = 0;
    state.stepTimers.forEach((timerId) => window.clearTimeout(timerId));
    state.stepTimers.clear();
    state.arrangementSources.forEach((source) => {
      try { source.stop(); } catch { /* The source may have ended between scheduler ticks. */ }
    });
    state.arrangementSources.clear();
    if (state.view === "arrangement") state.arrangementCursor = 0;
    if (state.audioContext) {
      const now = state.audioContext.currentTime;
      state.tracks.forEach((track) => {
        if (track.gainNode) {
          track.gainNode.gain.cancelScheduledValues(now);
          track.gainNode.gain.setTargetAtTime(track.muted || (state.tracks.some((item) => item.solo) && !track.solo) ? 0 : track.volume, now, 0.01);
        }
      });
    }
    playButton.classList.remove("is-playing");
    playButton.setAttribute("aria-label", "Play");
    $("#now-playing").classList.remove("is-live");
    $("#now-playing").innerHTML = '<span class="live-dot"></span>READY TO PLAY';
    setPlayhead(-1);
    updateArrangementCursorMarker();
  }

  async function loadSample(file) {
    const track = state.tracks.find((item) => item.id === state.sampleTrackId);
    if (!track || !file) return;
    if (!isAudioFile(file)) {
      showToast("Choose an audio file such as WAV, MP3, or OGG.");
      return;
    }
    let sampleLoaded = false;
    try {
      await ensureAudio();
      const bytes = await file.arrayBuffer();
      const buffer = await state.audioContext.decodeAudioData(bytes);
      track.sample = { name: file.name, buffer };
      sampleLoaded = true;
      renderTracks();
      saveState();
      await persistDrumSample(track, file);
      showToast(`${file.name} loaded on ${track.name}`);
    } catch (error) {
      if (sampleLoaded) showToast(`${file.name} loaded, but could not be saved: ${error.message || "browser storage is unavailable"}`);
      else showToast(`Could not load that audio file: ${error.message || "unsupported format"}`);
    } finally {
      sampleInput.value = "";
      state.sampleTrackId = null;
    }
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  function saveState() {
    const saveDot = $(".save-dot");
    $("#save-state").textContent = "Saving…";
    saveDot.style.background = "#c8a95a";
    const snapshot = {
      bpm: state.bpm,
      swing: state.swing,
      steps: state.steps,
      selectedPreset: state.selectedPreset,
      tracks: state.tracks.map((track) => ({
        id: track.id,
        name: track.name,
        kind: track.kind,
        color: track.color,
        cells: track.cells,
        volume: track.volume,
        muted: track.muted,
        solo: track.solo,
        variant: track.variant,
        sampleName: track.sample?.name || null,
      })),
      patternClips: state.patternClips.map(({ id, startBar }) => ({ id, startBar })),
      arrangementBars: state.arrangementBars,
      arrangementCursor: state.arrangementCursor,
      view: state.view,
    };
    window.clearTimeout(saveState.timeout);
    saveState.timeout = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
        $("#save-state").textContent = "All changes saved";
        saveDot.style.background = "#7f9d43";
      } catch {
        $("#save-state").textContent = "Session-only changes";
        saveDot.style.background = "#d3a34b";
      }
    }, 250);
  }

  function restoreState() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
      if (!saved || typeof saved !== "object") return;
      if (Number.isFinite(saved.bpm)) state.bpm = Math.max(60, Math.min(180, Math.round(saved.bpm)));
      if (Number.isFinite(saved.swing)) state.swing = Math.max(0, Math.min(45, Math.round(saved.swing)));
      if (saved.steps === 16 || saved.steps === 32) state.steps = saved.steps;
      if (Number.isFinite(saved.arrangementBars)) state.arrangementBars = Math.max(8, Math.min(MAX_ARRANGEMENT_BARS, Math.round(saved.arrangementBars)));
      if (Number.isFinite(saved.arrangementCursor)) state.arrangementCursor = Math.max(0, Math.min(MAX_ARRANGEMENT_BARS - 1, saved.arrangementCursor));
      if (saved.view === "sequencer" || saved.view === "arrangement") state.view = saved.view;
      if (Array.isArray(saved.patternClips)) {
        state.patternClips = saved.patternClips
          .filter((clip) => typeof clip?.id === "string" && Number.isFinite(clip.startBar))
          .map((clip) => ({ id: clip.id, startBar: Math.max(0, Math.min(maxPatternStartBar(), Math.floor(clip.startBar))) }));
      }
      if (PRESETS.some((preset) => preset.id === saved.selectedPreset)) state.selectedPreset = saved.selectedPreset;
      if (Array.isArray(saved.tracks)) {
        saved.tracks.forEach((savedTrack) => {
          let track = state.tracks.find((item) => item.id === savedTrack.id);
          if (!track && savedTrack.kind === "sample" && typeof savedTrack.id === "string" && typeof savedTrack.name === "string") {
            track = makeDrumSampleTrack({
              id: savedTrack.id,
              name: savedTrack.name,
              color: savedTrack.color,
              volume: savedTrack.volume,
              muted: savedTrack.muted,
              solo: savedTrack.solo,
              cells: savedTrack.cells,
            });
            state.tracks.push(track);
          }
          if (!track) return;
          if (Array.isArray(savedTrack.cells)) {
            track.cells = Array.from({ length: STEP_COUNT }, (_, index) => savedTrack.cells[index] === true);
          }
          if (Number.isFinite(savedTrack.volume)) track.volume = Math.max(0, Math.min(1, savedTrack.volume));
          if (SOUND_VARIANTS[track.kind]?.some((sound) => sound.id === savedTrack.variant)) track.variant = savedTrack.variant;
          track.muted = savedTrack.muted === true;
          track.solo = savedTrack.solo === true;
        });
      }
    } catch {
      try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* Storage may be disabled. */ }
    }
  }

  function exportPattern() {
    const pattern = {
      app: "Pulsegrid",
      version: 1,
      exportedAt: new Date().toISOString(),
      tempo: state.bpm,
      swing: state.swing,
      bars: state.steps / 16,
      steps: state.steps,
      tracks: state.tracks.map((track) => ({
        name: track.name,
        sample: track.sample?.name || null,
        steps: track.cells.slice(0, state.steps).map((active) => active ? 1 : 0),
      })),
    };
    const blob = new Blob([JSON.stringify(pattern, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pulsegrid-pattern.json";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast("Pattern exported as JSON");
  }

  async function exportArrangementWav() {
    if (state.mediaRecorder?.state === "recording") {
      showToast("Stop microphone recording before exporting the song.");
      return;
    }
    const OfflineAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!OfflineAudioContext) {
      showToast("WAV export is not supported in this browser.");
      return;
    }
    if (state.isPlaying) stopPlayback();
    const sampleRate = 44100;
    const secondsPerBar = 240 / state.bpm;
    const duration = state.arrangementBars * secondsPerBar;
    if (duration > 600) {
      showToast("Song export is limited to 10 minutes. Shorten the arrangement or raise the tempo.");
      return;
    }

    const previousContext = state.audioContext;
    const previousMaster = state.masterGain;
    const previousNoise = state.noiseBuffer;
    const allTracks = [...state.tracks, ...state.arrangementTracks];
    const previousGains = allTracks.map((track) => track.gainNode);
    const button = $("#export-song-button");
    state.isExporting = true;
    button.disabled = true;
    document.body.classList.add("is-exporting");
    showToast("Rendering your song to WAV…");
    try {
      const context = new OfflineAudioContext(2, Math.ceil(duration * sampleRate), sampleRate);
      state.audioContext = context;
      state.masterGain = context.createGain();
      state.masterGain.gain.value = 0.88;
      state.masterGain.connect(context.destination);
      state.noiseBuffer = createNoiseBuffer(context);
      const hasSolo = allTracks.some((track) => track.solo);
      allTracks.forEach((track) => {
        track.gainNode = context.createGain();
        track.gainNode.gain.value = track.muted || (hasSolo && !track.solo) ? 0 : track.volume;
        track.gainNode.connect(state.masterGain);
      });

      state.arrangementTracks.forEach((track) => {
        track.clips.forEach((clip) => {
          const startTime = clip.startBar * secondsPerBar;
          if (startTime >= duration) return;
          const source = context.createBufferSource();
          source.buffer = clip.buffer;
          source.connect(track.gainNode);
          source.start(startTime, 0, Math.min(clip.buffer.duration, duration - startTime));
        });
      });

      const stepDuration = 60 / state.bpm / 4;
      state.patternClips.forEach((clip) => {
        for (let step = 0; step < state.steps; step += 1) {
          const time = clip.startBar * secondsPerBar + step * stepDuration +
            (step % 2 === 1 ? stepDuration * (state.swing / 100) : 0);
          if (time >= duration) continue;
          state.tracks.forEach((track) => {
            if (track.cells[step] && !track.muted && (!hasSolo || track.solo)) triggerTrack(track, time, step);
          });
          if (state.metronome && step % 4 === 0) triggerClick(time, step === 0);
        }
      });

      const rendered = await context.startRendering();
      downloadBlob(encodeWav(rendered), "pulsegrid-song.wav");
      showToast("Song exported as WAV");
    } catch (error) {
      showToast(`Could not export the song: ${error.message || "render failed"}`);
    } finally {
      state.audioContext = previousContext;
      state.masterGain = previousMaster;
      state.noiseBuffer = previousNoise;
      allTracks.forEach((track, index) => { track.gainNode = previousGains[index]; });
      state.isExporting = false;
      button.disabled = false;
      document.body.classList.remove("is-exporting");
    }
  }

  function encodeWav(audioBuffer) {
    const channels = Math.min(2, audioBuffer.numberOfChannels);
    const frames = audioBuffer.length;
    const dataBytes = frames * channels * 2;
    const wav = new ArrayBuffer(44 + dataBytes);
    const view = new DataView(wav);
    const writeText = (offset, text) => {
      for (let index = 0; index < text.length; index += 1) view.setUint8(offset + index, text.charCodeAt(index));
    };
    writeText(0, "RIFF");
    view.setUint32(4, 36 + dataBytes, true);
    writeText(8, "WAVE");
    writeText(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, channels, true);
    view.setUint32(24, audioBuffer.sampleRate, true);
    view.setUint32(28, audioBuffer.sampleRate * channels * 2, true);
    view.setUint16(32, channels * 2, true);
    view.setUint16(34, 16, true);
    writeText(36, "data");
    view.setUint32(40, dataBytes, true);
    const channelData = Array.from({ length: channels }, (_, channel) => audioBuffer.getChannelData(channel));
    let offset = 44;
    for (let frame = 0; frame < frames; frame += 1) {
      for (let channel = 0; channel < channels; channel += 1) {
        const sample = Math.max(-1, Math.min(1, channelData[channel][frame]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
        offset += 2;
      }
    }
    return new Blob([wav], { type: "audio/wav" });
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function randomize() {
    const kick = state.tracks.find((track) => track.id === "kick");
    const snare = state.tracks.find((track) => track.id === "snare");
    const clap = state.tracks.find((track) => track.id === "clap");
    const hat = state.tracks.find((track) => track.id === "closed-hat");
    const openHat = state.tracks.find((track) => track.id === "open-hat");
    const rim = state.tracks.find((track) => track.id === "rim");
    state.tracks.forEach((track) => track.cells.fill(false));
    for (let step = 0; step < state.steps; step += 1) {
      if (step % 4 === 0 && Math.random() > (step % 8 === 0 ? 0.08 : 0.27)) kick.cells[step] = true;
      if (step % 8 === 4 && Math.random() > 0.16) snare.cells[step] = true;
      if (step % 2 === 1 && Math.random() > 0.28) hat.cells[step] = true;
      if (step % 8 === 6 && Math.random() > 0.42) openHat.cells[step] = true;
      if (step % 4 === 3 && Math.random() > 0.48) rim.cells[step] = true;
      if (step % 8 === 4 && Math.random() > 0.6) clap.cells[step] = true;
    }
    state.selectedPreset = null;
    renderTracks();
    renderPresets();
    saveState();
    showToast("A new groove, just for you");
  }

  function clearPattern() {
    state.tracks.forEach((track) => track.cells.fill(false));
    state.selectedPreset = null;
    renderTracks();
    renderPresets();
    saveState();
    showToast("Pattern cleared");
  }

  function toggleMetronome() {
    state.metronome = !state.metronome;
    const button = $("#metronome-button");
    button.classList.toggle("is-active", state.metronome);
    button.setAttribute("aria-pressed", String(state.metronome));
    showToast(state.metronome ? "Metronome on" : "Metronome off");
  }

  function bindEvents() {
    playButton.addEventListener("click", () => state.isPlaying ? stopPlayback() : startPlayback());
    $("#stop-button").addEventListener("click", stopPlayback);
    $("#tempo-control").addEventListener("click", () => {
      const entry = window.prompt("Set tempo (60–180 BPM)", String(state.bpm));
      if (entry === null || !entry.trim()) return;
      const value = Number(entry);
      if (!Number.isFinite(value) || value < 60 || value > 180) {
        showToast("Tempo must be between 60 and 180 BPM.");
        return;
      }
      const resumeBar = state.arrangementCursor;
      if (state.isPlaying && state.view === "arrangement") stopPlayback();
      state.bpm = Math.round(value);
      tempoValue.textContent = String(state.bpm);
      updateArrangementLength();
      if (state.view === "arrangement") renderArrangement();
      if (resumeBar > 0) setArrangementCursor(resumeBar);
      saveState();
    });
    swingSlider.addEventListener("input", () => {
      state.swing = Number(swingSlider.value);
      $("#swing-value").textContent = `${state.swing}%`;
      swingSlider.style.setProperty("--range-progress", `${state.swing / 45 * 100}%`);
      saveState();
    });
    document.querySelectorAll(".length-button").forEach((button) => {
      button.addEventListener("click", () => setLength(Number(button.dataset.steps)));
    });
    $("#clear-button").addEventListener("click", clearPattern);
    $("#randomize-button").addEventListener("click", randomize);
    $("#export-button").addEventListener("click", exportPattern);
    $("#export-song-button").addEventListener("click", exportArrangementWav);
    $("#metronome-button").addEventListener("click", toggleMetronome);
    $("#help-button").addEventListener("click", () => $("#help-dialog").showModal());
    $("#sequencer-tab").addEventListener("click", () => setWorkspaceView("sequencer"));
    $("#arrangement-tab").addEventListener("click", () => setWorkspaceView("arrangement"));
    $("#timeline-scroll").addEventListener("scroll", (event) => {
      $("#arrangement-track-labels").scrollTop = event.currentTarget.scrollTop;
    });
    $("#arrangement-pattern-length").addEventListener("change", (event) => setLength(Number(event.target.value)));
    $("#add-pattern-button").addEventListener("click", () => addPatternClip());
    $("#source-browser-button").addEventListener("click", () => $("#source-browser-dialog").showModal());
    $("#source-browser-close").addEventListener("click", () => $("#source-browser-dialog").close());
    $("#import-recording-button").addEventListener("click", () => requestRecordingImport());
    $("#empty-import-button").addEventListener("click", () => requestRecordingImport());
    $("#side-add-recording").addEventListener("click", () => requestRecordingImport());
    $("#recording-input").addEventListener("change", async (event) => {
      const files = Array.from(event.target.files || []);
      for (const file of files) await importRecording(file, state.pendingImportTrackId);
      state.pendingImportTrackId = null;
      event.target.value = "";
    });
    $("#add-track-button").addEventListener("click", () => {
      const track = createArrangementTrack();
      renderArrangement();
      requestRecordingImport(track.id);
    });
    $("#add-bars-button").addEventListener("click", () => {
      if (state.arrangementBars >= MAX_ARRANGEMENT_BARS) {
        showToast(`Arrangements are limited to ${MAX_ARRANGEMENT_BARS} bars.`);
        return;
      }
      state.arrangementBars = Math.min(MAX_ARRANGEMENT_BARS, state.arrangementBars + 4);
      updateArrangementLength();
      renderArrangement();
      saveState();
    });
    $("#record-audio-button").addEventListener("click", toggleAudioRecording);
    $("#arrangement-clear-button").addEventListener("click", () => {
      if (!state.arrangementTracks.length && !state.patternClips.length) return;
      if (!window.confirm("Remove all clips from this arrangement?")) return;
      state.arrangementTracks.forEach((track) => track.clips.forEach((clip) => deletePersistedClip(clip.id)));
      state.arrangementTracks = [];
      state.patternClips = [];
      state.arrangementBars = 8;
      state.arrangementCursor = 0;
      renderArrangement();
      saveState();
      showToast("Arrangement cleared");
    });
    $("#project-name").addEventListener("click", () => {
      const title = window.prompt("Name this session", $("#project-name").firstChild.textContent.trim());
      if (title?.trim()) {
        $("#project-name").firstChild.textContent = title.trim();
        try { window.localStorage.setItem(`${STORAGE_KEY}-name`, title.trim()); } catch { /* Storage may be disabled. */ }
      }
    });
    sampleInput.addEventListener("change", () => loadSample(sampleInput.files?.[0]));
    $("#import-drum-sounds-button").addEventListener("click", () => drumSamplesInput.click());
    drumSamplesInput.addEventListener("change", () => importDrumSamples(Array.from(drumSamplesInput.files || [])));
    $("#reset-session").addEventListener("click", () => {
      if (!window.confirm("Reset this session to the starter pattern?")) return;
      stopPlayback();
      state.tracks.filter((track) => track.sample || track.kind === "sample").forEach((track) => {
        deletePersistedDrumSample(track.id).catch(() => showToast(`Could not remove saved sample ${track.name}.`));
      });
      state.tracks.forEach((track) => track.gainNode?.disconnect());
      state.tracks = makeTracks();
      state.bpm = 124;
      state.swing = 0;
      state.steps = 16;
      state.selectedPreset = "warehouse";
      tempoValue.textContent = "124";
      swingSlider.value = "0";
      $("#swing-value").textContent = "0%";
      swingSlider.style.setProperty("--range-progress", "0%");
      setLength(16);
      loadPreset(PRESETS[0]);
    });
    document.addEventListener("keydown", (event) => {
      const target = event.target;
      const isTyping = target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      const isButton = target instanceof HTMLElement && target.tagName === "BUTTON";
      if (event.code === "Space" && !isTyping && !isButton && !$("#help-dialog").open) {
        event.preventDefault();
        state.isPlaying ? stopPlayback() : startPlayback();
      }
      if (event.key === "Escape" && $("#help-dialog").open) $("#help-dialog").close();
    });
  }

  function initialize() {
    state.tracks = makeTracks();
    restoreState();
    tempoValue.textContent = String(state.bpm);
    swingSlider.value = String(state.swing);
    $("#swing-value").textContent = `${state.swing}%`;
    swingSlider.style.setProperty("--range-progress", `${state.swing / 45 * 100}%`);
    try {
      const savedName = window.localStorage.getItem(`${STORAGE_KEY}-name`);
      if (savedName) $("#project-name").firstChild.textContent = savedName;
    } catch { /* Storage may be disabled. */ }
    renderHeader();
    renderPresets();
    setLength(state.steps);
    renderTracks();
    renderArrangement();
    state.arrangementCursor = Math.min(state.arrangementCursor, state.arrangementBars - 1);
    setWorkspaceView(state.view, true);
    bindEvents();
  }

  initialize();
  restoreArrangement();
})();
