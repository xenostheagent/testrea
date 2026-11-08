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
      { id: "sub", name: "Sub Drop" },
      { id: "industrial", name: "Industrial Thud" },
    ],
    snare: [
      { id: "classic", name: "909 Snare" },
      { id: "tight", name: "Tight Snap" },
      { id: "noise", name: "Noise Burst" },
      { id: "body", name: "Deep Body" },
      { id: "metal", name: "Metal Snare" },
    ],
    clap: [
      { id: "classic", name: "Wide Clap" },
      { id: "tight", name: "Short Clap" },
      { id: "layered", name: "Layered Clap" },
      { id: "room", name: "Room Clap" },
    ],
    hat: [
      { id: "classic", name: "Bright Closed" },
      { id: "soft", name: "Soft Closed" },
      { id: "bright", name: "Sharp Closed" },
      { id: "vinyl", name: "Vinyl Tick" },
    ],
    openhat: [
      { id: "classic", name: "Open Hat" },
      { id: "shimmer", name: "Shimmer" },
      { id: "dark", name: "Dark Open" },
      { id: "wash", name: "Long Wash" },
    ],
    rim: [
      { id: "classic", name: "Rim Click" },
      { id: "low", name: "Low Tom" },
      { id: "high", name: "High Tick" },
      { id: "wood", name: "Wood Block" },
    ],
  };

  const LIBRARY_TRACKS = [
    { id: "kick-808", name: "808 Sub Kick", kind: "kick", variant: "deep", family: "Drums", color: "#b8dc67", volume: 0.72 },
    { id: "kick-industrial", name: "Industrial Kick", kind: "kick", variant: "industrial", family: "Drums", color: "#d48b68", volume: 0.72 },
    { id: "snare-tight", name: "Tight Snare", kind: "snare", variant: "tight", family: "Drums", color: "#e58b7a", volume: 0.58 },
    { id: "snare-metal", name: "Metal Snare", kind: "snare", variant: "metal", family: "Drums", color: "#a6a4c6", volume: 0.58 },
    { id: "clap-room", name: "Room Clap", kind: "clap", variant: "room", family: "Drums", color: "#d09bdb", volume: 0.42 },
    { id: "hat-vinyl", name: "Vinyl Hat", kind: "hat", variant: "vinyl", family: "Drums", color: "#78b8cf", volume: 0.4 },
    { id: "openhat-wash", name: "Long Wash Hat", kind: "openhat", variant: "wash", family: "Drums", color: "#d5b677", volume: 0.34 },
    { id: "rim-wood", name: "Wood Block", kind: "rim", variant: "wood", family: "Drums", color: "#89c5a5", volume: 0.48 },
    { id: "kit-909", name: "909 Drum Kit", kind: "drumkit", family: "Drum Kits", color: "#ff9178", volume: 0.72, patch: { kit: "909" } },
    { id: "kit-808", name: "808 Drum Kit", kind: "drumkit", family: "Drum Kits", color: "#d3f36b", volume: 0.72, patch: { kit: "808" } },
    { id: "kit-industrial", name: "Industrial Kit", kind: "drumkit", family: "Drum Kits", color: "#b5a0ff", volume: 0.72, patch: { kit: "industrial" } },
    { id: "synth-analog-lead", name: "Analog Lead", kind: "instrument", family: "Synths", color: "#7cc9ff", volume: 0.68, patch: { wave: "sawtooth", cutoff: 3600, attack: 0.008, decay: 0.12, sustain: 0.5, release: 0.12, detune: 7 } },
    { id: "synth-acid-bass", name: "Acid Bass", kind: "instrument", family: "Synths", color: "#76c6ad", volume: 0.7, patch: { wave: "sawtooth", cutoff: 1150, attack: 0.004, decay: 0.16, sustain: 0.18, release: 0.08, detune: 3 } },
    { id: "synth-warm-pad", name: "Warm Pad", kind: "instrument", family: "Synths", color: "#b5a0ff", volume: 0.62, patch: { wave: "triangle", cutoff: 2200, attack: 0.22, decay: 0.4, sustain: 0.62, release: 0.5, detune: 11 } },
    { id: "synth-fm-bell", name: "FM Bell", kind: "instrument", family: "Synths", color: "#f0ca75", volume: 0.58, patch: { wave: "sine", cutoff: 9000, attack: 0.002, decay: 0.7, sustain: 0.06, release: 0.35, harmonic: 2.01, harmonicLevel: 0.35 } },
    { id: "synth-glass-pluck", name: "Glass Pluck", kind: "instrument", family: "Synths", color: "#78d2df", volume: 0.62, patch: { wave: "triangle", cutoff: 6200, attack: 0.003, decay: 0.48, sustain: 0.08, release: 0.22, harmonic: 3, harmonicLevel: 0.16 } },
    { id: "piano-grand", name: "Concert Grand", kind: "instrument", family: "Pianos", color: "#e2d3b1", volume: 0.68, patch: { wave: "triangle", cutoff: 4200, attack: 0.004, decay: 0.72, sustain: 0.16, release: 0.42, harmonic: 2, harmonicLevel: 0.2 } },
    { id: "piano-soft", name: "Soft Felt Piano", kind: "instrument", family: "Pianos", color: "#d8c6a9", volume: 0.62, patch: { wave: "sine", cutoff: 2200, attack: 0.012, decay: 0.9, sustain: 0.12, release: 0.34, harmonic: 2, harmonicLevel: 0.08 } },
    { id: "piano-electric", name: "Electric Piano", kind: "instrument", family: "Pianos", color: "#c5a6ed", volume: 0.64, patch: { wave: "sine", cutoff: 5200, attack: 0.003, decay: 0.58, sustain: 0.25, release: 0.28, harmonic: 3, harmonicLevel: 0.22 } },
    { id: "organ-tonewheel", name: "Tonewheel Organ", kind: "instrument", family: "Pianos", color: "#9db4dc", volume: 0.58, patch: { wave: "sine", cutoff: 7000, attack: 0.012, decay: 0.04, sustain: 0.82, release: 0.08, harmonic: 2, harmonicLevel: 0.26 } },
    { id: "guitar-acoustic", name: "Steel Acoustic", kind: "instrument", family: "Guitars", color: "#d29b79", volume: 0.62, patch: { wave: "triangle", cutoff: 3600, attack: 0.003, decay: 0.5, sustain: 0.08, release: 0.2, harmonic: 2.76, harmonicLevel: 0.13 } },
    { id: "guitar-clean", name: "Clean Electric Guitar", kind: "instrument", family: "Guitars", color: "#97c9b0", volume: 0.58, patch: { wave: "triangle", cutoff: 4800, attack: 0.006, decay: 0.32, sustain: 0.18, release: 0.24, harmonic: 2, harmonicLevel: 0.24, detune: 3 } },
    { id: "guitar-muted", name: "Muted Guitar", kind: "instrument", family: "Guitars", color: "#c9ab7d", volume: 0.62, patch: { wave: "square", cutoff: 1800, attack: 0.002, decay: 0.16, sustain: 0.04, release: 0.08, harmonic: 2.7, harmonicLevel: 0.08 } },
    { id: "bass-finger", name: "Finger Bass", kind: "instrument", family: "Bass", color: "#89ad75", volume: 0.72, patch: { wave: "triangle", cutoff: 950, attack: 0.008, decay: 0.22, sustain: 0.35, release: 0.13, harmonic: 2, harmonicLevel: 0.16 } },
    { id: "bass-sub", name: "Sub Bass", kind: "instrument", family: "Bass", color: "#78a6d4", volume: 0.72, patch: { wave: "sine", cutoff: 420, attack: 0.01, decay: 0.2, sustain: 0.48, release: 0.16 } },
    { id: "bass-fuzz", name: "Fuzz Bass", kind: "instrument", family: "Bass", color: "#d47e78", volume: 0.68, patch: { wave: "sawtooth", cutoff: 1500, attack: 0.004, decay: 0.18, sustain: 0.32, release: 0.12, detune: 5 } },
  ].map((track) => ({ ...track, libraryOnly: true, subtitle: track.family }));

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
  const PROJECTS_KEY = `${STORAGE_KEY}-projects`;
  const PROJECT_STORAGE_PREFIX = `${STORAGE_KEY}-project-`;
  const STEP_COUNT = 64;
  const BAR_WIDTH = 116;
  const MAX_ARRANGEMENT_BARS = 256;
  const TRACK_COLORS = ["#7cc9ff", "#ff9178", "#ee9df6", "#f6ca74", "#93e2bd"];
  const PATTERN_COLORS = ["#d3f36b", "#7cc9ff", "#ff9178", "#ee9df6", "#f6ca74", "#93e2bd", "#b5a0ff", "#f28dba"];
  const GRID_RESOLUTIONS = ["1/32", "1/16", "1/8", "1/4"];
  const GRID_STEPS_PER_BAR = { "1/32": 32, "1/16": 16, "1/8": 8, "1/4": 4 };
  const LIVE_KEY_CODES = [
    ..."1234567890".split("").map((key) => `Digit${key}`),
    ..."qwertyuiopasdfghjklzxcvbnm".split("").map((key) => `Key${key.toUpperCase()}`),
    "Minus", "Equal", "BracketLeft", "BracketRight", "Semicolon", "Quote", "Backslash", "Comma", "Period", "Slash",
  ];
  const PIANO_KEY_MIDI = new Map([
    ["KeyZ", 60], ["KeyS", 61], ["KeyX", 62], ["KeyD", 63], ["KeyC", 64], ["KeyV", 65],
    ["KeyG", 66], ["KeyB", 67], ["KeyH", 68], ["KeyN", 69], ["KeyJ", 70], ["KeyM", 71],
    ["KeyQ", 72], ["Digit2", 73], ["KeyW", 74], ["Digit3", 75], ["KeyE", 76], ["KeyR", 77],
    ["Digit5", 78], ["KeyT", 79], ["Digit6", 80], ["KeyY", 81], ["Digit7", 82], ["KeyU", 83],
  ]);
  const PIANO_TICKS_PER_BAR = 32;
  const PIANO_ROW_HEIGHT = 18;
  const PIANO_TOP_MIDI = 83;
  const PIANO_BOTTOM_MIDI = 35;
  const state = {
    tracks: [],
    patterns: [],
    selectedPatternId: null,
    arrangementTracks: [],
    patternClips: [],
    mels: [],
    selectedMelId: null,
    melTracks: [],
    pianoNotes: [],
    pianoStartBar: 0,
    pianoBars: 4,
    pianoSnap: 2,
    pianoNoteLength: 2,
    selectedPianoTrackId: "piano-grand",
    selectedPianoNoteId: null,
    selectedPianoNoteIds: new Set(),
    selectedArrangementItems: new Set(),
    projectId: "default",
    projectName: "Untitled session",
    projects: [],
    suppressArrangementClick: false,
    pianoSelectionFromMarquee: false,
    arrangementSelectionFromMarquee: false,
    workspaceRatio: 50,
    workspaceHidden: false,
    trackViewHidden: false,
    scheduledPianoNotes: new Set(),
    liveRecordedHits: new Set(),
    keyboardRecording: null,
    suppressPianoGridClick: false,
    steps: 16,
    view: "arrangement",
    bpm: 124,
    swing: 0,
    arrangementBars: 32,
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
    const tracks = [...TRACKS, ...LIBRARY_TRACKS].map((definition) => {
      const cells = Array(STEP_COUNT).fill(false);
      definition.hits?.forEach((step) => { cells[step] = true; });
      return { ...definition, cells, variant: definition.variant || "classic", muted: false, solo: false, sample: null, gainNode: null };
    });
    tracks.forEach(ensureSequencerTrackAudio);
    return tracks;
  }

  function getPattern(patternId = state.selectedPatternId) {
    return state.patterns.find((pattern) => pattern.id === patternId) || null;
  }

  function getPatternGridResolution(pattern) {
    if (GRID_RESOLUTIONS.includes(pattern?.gridResolution)) return pattern.gridResolution;
    if (GRID_RESOLUTIONS.includes(pattern?.noteLength)) return pattern.noteLength;
    const counts = Object.fromEntries(GRID_RESOLUTIONS.map((resolution) => [resolution, 0]));
    Object.values(pattern?.noteLengths || {}).forEach((length) => {
      if (GRID_RESOLUTIONS.includes(length)) counts[length] += 1;
    });
    return GRID_RESOLUTIONS.reduce((selected, resolution) =>
      counts[resolution] > counts[selected] ? resolution : selected, "1/16");
  }

  function getStepsPerBar(pattern = getPattern()) {
    return GRID_STEPS_PER_BAR[getPatternGridResolution(pattern)] || 16;
  }

  function getGridStepCount(pattern = getPattern()) {
    const bars = pattern ? pattern.steps / 16 : state.steps / 16;
    return bars * getStepsPerBar(pattern);
  }

  function remapGridCells(cells, bars, previousSlotsPerBar, nextSlotsPerBar) {
    const remapped = Array(STEP_COUNT).fill(false);
    for (let index = 0; index < bars * previousSlotsPerBar; index += 1) {
      if (!cells[index]) continue;
      const bar = Math.floor(index / previousSlotsPerBar);
      const stepInBar = index % previousSlotsPerBar;
      const nextStepInBar = Math.min(nextSlotsPerBar - 1, Math.round(stepInBar * nextSlotsPerBar / previousSlotsPerBar));
      remapped[bar * nextSlotsPerBar + nextStepInBar] = true;
    }
    return remapped;
  }

  function getGridTicksPerStep(pattern = getPattern()) {
    return 32 / getStepsPerBar(pattern);
  }

  function isSongWorkspace() {
    return state.view === "arrangement" || state.view === "piano-roll";
  }

  function renderViewLayout() {
    const main = $("#arrangement-main");
    $("#workspace-area").hidden = state.workspaceHidden;
    $("#track-view-area").hidden = state.trackViewHidden;
    $("#view-resizer").hidden = state.workspaceHidden || state.trackViewHidden;
    if (state.workspaceHidden) main.style.gridTemplateRows = "0px 0px minmax(0, 1fr)";
    else if (state.trackViewHidden) main.style.gridTemplateRows = "minmax(0, 1fr) 0px 0px";
    else main.style.gridTemplateRows = `minmax(0, ${state.workspaceRatio}fr) 9px minmax(0, ${100 - state.workspaceRatio}fr)`;
    $("#view-resizer").setAttribute("aria-valuenow", String(state.workspaceRatio));
    $("#view-resizer").setAttribute("aria-valuetext", `Workspace ${state.workspaceRatio}%, Track View ${100 - state.workspaceRatio}%`);
    $("#hide-workspace-button").hidden = state.workspaceHidden;
    $("#show-track-view-button").hidden = !state.trackViewHidden;
    $("#hide-track-view-button").hidden = state.trackViewHidden;
    $("#show-workspace-button").hidden = !state.workspaceHidden;
  }

  function setViewVisibility(workspaceHidden, trackViewHidden) {
    state.workspaceHidden = workspaceHidden;
    state.trackViewHidden = trackViewHidden;
    renderViewLayout();
    saveState();
    if (workspaceHidden) $("#show-workspace-button").focus();
    if (trackViewHidden) $("#show-track-view-button").focus();
  }

  function setWorkspaceRatio(ratio) {
    state.workspaceRatio = Math.max(20, Math.min(80, Math.round(ratio)));
    renderViewLayout();
    saveState();
  }

  function getPatternColor(index) {
    if (index < PATTERN_COLORS.length) return PATTERN_COLORS[index];
    return `hsl(${Math.round(index * 137.508 % 360)} 68% 66%)`;
  }

  function isPatternColor(color) {
    return typeof color === "string" && (/^#[\da-f]{6}$/i.test(color) || /^hsl\(\d{1,3} 68% 66%\)$/.test(color));
  }

  function getPatternTrackIds(pattern) {
    return Array.isArray(pattern?.trackIds) ? pattern.trackIds : state.tracks.filter((track) => !track.libraryOnly).map((track) => track.id);
  }

  function makePatternSnapshot(id, name, color = getPatternColor(state.patterns.length)) {
    const cells = {};
    const variants = {};
    state.tracks.forEach((track) => {
      cells[track.id] = Array.from({ length: STEP_COUNT }, (_, index) => track.cells[index] === true);
      if (SOUND_VARIANTS[track.kind]) variants[track.id] = track.variant || "classic";
    });
    return {
      id,
      name,
      color,
      steps: state.steps,
      trackIds: state.tracks.filter((track) => !track.libraryOnly).map((track) => track.id),
      cells,
      variants,
      gridResolution: "1/16",
    };
  }

  function captureCurrentPattern() {
    const pattern = getPattern();
    if (!pattern) return;
    pattern.steps = state.steps;
    const trackIds = getPatternTrackIds(pattern).filter((id) => state.tracks.some((track) => track.id === id));
    pattern.trackIds = trackIds;
    pattern.cells = {};
    pattern.variants = {};
    pattern.gridResolution = getPatternGridResolution(pattern);
    state.tracks.filter((track) => trackIds.includes(track.id)).forEach((track) => {
      pattern.cells[track.id] = Array.from({ length: STEP_COUNT }, (_, index) => track.cells[index] === true);
      if (SOUND_VARIANTS[track.kind]) pattern.variants[track.id] = track.variant || "classic";
    });
  }

  function applyPattern(pattern) {
    state.selectedPatternId = pattern.id;
    state.steps = pattern.steps === 32 ? 32 : 16;
    const patternTrackIds = new Set(getPatternTrackIds(pattern));
    state.tracks.forEach((track) => {
      track.cells = patternTrackIds.has(track.id)
        ? Array.from({ length: STEP_COUNT }, (_, index) => pattern.cells?.[track.id]?.[index] === true)
        : Array(STEP_COUNT).fill(false);
      const variant = pattern.variants?.[track.id];
      if (patternTrackIds.has(track.id) && SOUND_VARIANTS[track.kind]) {
        track.variant = SOUND_VARIANTS[track.kind].some((sound) => sound.id === variant) ? variant : "classic";
      }
    });
    $("#arrangement-pattern-length").value = String(state.steps);
    $("#bar-label").textContent = state.steps === 16 ? "1 BAR" : "2 BARS";
    document.querySelectorAll(".length-button").forEach((button) => {
      const selected = Number(button.dataset.steps) === state.steps;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    $("#grid-resolution-select").value = getPatternGridResolution(pattern);
    renderHeader();
  }

  function renderPatternSelectors() {
    [$("#sequencer-pattern-select"), $("#arrangement-pattern-select")].forEach((select) => {
      select.replaceChildren();
      state.patterns.forEach((pattern) => {
        const option = document.createElement("option");
        option.value = pattern.id;
        option.textContent = pattern.name;
        select.append(option);
      });
      select.value = state.selectedPatternId;
    });
    const selected = getPattern();
    const dragSource = $("#pattern-drag-source");
    dragSource.textContent = selected ? `Drag ${selected.name} to timeline` : "No pattern selected";
    dragSource.disabled = !selected;
    dragSource.style.setProperty("--pattern-color", selected?.color || "var(--accent)");
    $("#grid-resolution-select").value = getPatternGridResolution(selected);
    renderPatternInstrumentOptions();
  }

  function renderPatternInstrumentOptions() {
    const available = state.tracks.filter((track) => !track.sourceId);
    [
      ["#sequencer-instrument-select", "#add-sequencer-instrument-button"],
      ["#pattern-instrument-select", "#add-pattern-instrument-button"],
    ].forEach(([selectSelector, buttonSelector]) => {
      const select = $(selectSelector);
      const addButton = $(buttonSelector);
      select.replaceChildren();
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = available.length ? "Choose instrument…" : "No instruments available";
      placeholder.disabled = true;
      placeholder.selected = true;
      select.append(placeholder);
      available.forEach((track) => {
        const option = document.createElement("option");
        option.value = track.id;
        option.textContent = track.name;
        select.append(option);
      });
      addButton.disabled = available.length === 0;
    });
  }

  function getPianoTrack(trackId = state.selectedPianoTrackId) {
    return state.tracks.find((track) => track.id === trackId) || null;
  }

  function getMel(melId = state.selectedMelId) {
    return state.mels.find((mel) => mel.id === melId) || null;
  }

  function makeMel(name, instrumentId = state.selectedPianoTrackId, bars = state.pianoBars, notes = []) {
    return { id: makeId(), name, instrumentId, bars, notes: notes.map((note) => ({ ...note })) };
  }

  function captureCurrentMel() {
    const mel = getMel();
    if (!mel) return;
    mel.instrumentId = state.selectedPianoTrackId;
    mel.bars = state.pianoBars;
    mel.notes = state.pianoNotes.map((note) => ({ ...note, trackId: mel.instrumentId }));
  }

  function loadMel(melId) {
    const mel = getMel(melId);
    if (!mel) return;
    state.selectedMelId = mel.id;
    state.selectedPianoTrackId = state.tracks.some((track) => track.id === mel.instrumentId)
      ? mel.instrumentId
      : state.tracks.find((track) => track.id === "piano-grand")?.id || state.tracks[0]?.id || "";
    state.pianoBars = [1, 2, 4, 8].includes(mel.bars) ? mel.bars : 4;
    state.pianoNotes = mel.notes.map((note) => ({ ...note, trackId: state.selectedPianoTrackId }));
    state.selectedPianoNoteId = null;
    state.selectedPianoNoteIds.clear();
    state.pianoSelectionFromMarquee = false;
  }

  function ensureMels() {
    if (!state.mels.length) {
      const mel = makeMel("Mel 1", state.selectedPianoTrackId, state.pianoBars, state.pianoNotes);
      state.mels = [mel];
      state.selectedMelId = mel.id;
      if (mel.notes.length) {
        const track = {
          id: makeId(), name: mel.name, instrumentId: mel.instrumentId, color: "#b5a0ff",
          muted: false, solo: false, clips: [{ id: makeId(), melId: mel.id, startBar: state.pianoStartBar }],
        };
        state.melTracks.push(track);
      }
    }
    if (!state.mels.some((mel) => mel.id === state.selectedMelId)) state.selectedMelId = state.mels[0].id;
    loadMel(state.selectedMelId);
  }

  function getMelLengthBars(mel) {
    const noteEnd = mel.notes.reduce((latest, note) => Math.max(latest, note.startTick + note.durationTicks), 0);
    return Math.max(1, Math.min(8, Math.max(mel.bars || 1, Math.ceil(noteEnd / PIANO_TICKS_PER_BAR))));
  }

  function renderMelOptions() {
    const select = $("#mel-select");
    select.replaceChildren();
    state.mels.forEach((mel) => {
      const option = document.createElement("option");
      option.value = mel.id;
      option.textContent = mel.name;
      select.append(option);
    });
    select.value = state.selectedMelId || "";
    const mel = getMel();
    const dragSource = $("#mel-drag-source");
    dragSource.textContent = mel ? `Drag ${mel.name} to Track View` : "No Mel selected";
    dragSource.disabled = !mel;
    dragSource.style.setProperty("--pattern-color", "#b5a0ff");
  }

  function selectMel(melId) {
    if (state.keyboardRecording?.mode === "piano-roll") stopPlayback();
    captureCurrentMel();
    loadMel(melId);
    renderMelOptions();
    renderPianoInstrumentOptions();
    renderPianoRoll();
    saveState();
  }

  function createMel() {
    captureCurrentMel();
    const mel = makeMel(`Mel ${state.mels.length + 1}`);
    state.mels.push(mel);
    loadMel(mel.id);
    renderMelOptions();
    renderPianoInstrumentOptions();
    renderPianoRoll();
    saveState();
    showToast(`${mel.name} created`);
  }

  function renameMel() {
    const mel = getMel();
    if (!mel) return;
    const value = window.prompt("Name this Mel", mel.name);
    if (value === null) return;
    const name = value.trim();
    if (!name) {
      showToast("A Mel needs a name.");
      return;
    }
    if (state.mels.some((item) => item.id !== mel.id && item.name.toLowerCase() === name.toLowerCase())) {
      showToast("Mel names must be unique.");
      return;
    }
    const oldName = mel.name;
    mel.name = name;
    state.melTracks.forEach((track) => {
      if (track.name === oldName && track.clips.some((clip) => clip.melId === mel.id)) track.name = name;
    });
    renderMelOptions();
    renderArrangement();
    saveState();
  }

  function renderPianoInstrumentOptions() {
    const select = $("#piano-instrument-select");
    const instruments = state.tracks.filter((track) => !track.sourceId);
    select.replaceChildren();
    const groups = new Map();
    instruments.forEach((track) => {
      const family = track.family || (track.kind === "sample" ? "Imported Sounds" : "Drums");
      if (!groups.has(family)) {
        const group = document.createElement("optgroup");
        group.label = family;
        groups.set(family, group);
        select.append(group);
      }
      const option = document.createElement("option");
      option.value = track.id;
      option.textContent = track.name;
      groups.get(family).append(option);
    });
    if (!instruments.some((track) => track.id === state.selectedPianoTrackId)) {
      state.selectedPianoTrackId = instruments.find((track) => track.id === "piano-grand")?.id || instruments[0]?.id || "";
    }
    select.value = state.selectedPianoTrackId;
  }

  function midiNoteName(midi) {
    const names = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
    return `${names[midi % 12]}${Math.floor(midi / 12) - 1}`;
  }

  function renderPianoRoll() {
    $("#piano-bars-select").value = String(state.pianoBars);
    $("#piano-snap-select").value = String(state.pianoSnap);
    $("#piano-note-length-select").value = String(state.pianoNoteLength);
    const keys = $("#piano-roll-keys");
    const ruler = $("#piano-roll-ruler");
    const grid = $("#piano-roll-grid");
    keys.replaceChildren();
    ruler.replaceChildren();
    grid.replaceChildren();
    const totalTicks = state.pianoBars * PIANO_TICKS_PER_BAR;
    const width = totalTicks * 16;
    const height = (PIANO_TOP_MIDI - PIANO_BOTTOM_MIDI + 1) * PIANO_ROW_HEIGHT;
    ruler.style.width = `${width}px`;
    grid.style.width = `${width}px`;
    grid.style.height = `${height}px`;
    for (let bar = 0; bar < state.pianoBars; bar += 1) {
      const marker = document.createElement("div");
      marker.className = "piano-roll-bar";
      for (let beat = 0; beat < 4; beat += 1) {
        const label = document.createElement("span");
        label.textContent = beat === 0 ? `BAR ${bar + 1}` : String(beat + 1);
        marker.append(label);
      }
      ruler.append(marker);
    }
    for (let midi = PIANO_TOP_MIDI; midi >= PIANO_BOTTOM_MIDI; midi -= 1) {
      const row = document.createElement("div");
      const pitchClass = midi % 12;
      row.className = `piano-roll-row${[1, 3, 6, 8, 10].includes(pitchClass) ? " is-black" : ""}${pitchClass === 0 ? " is-c" : ""}`;
      row.style.top = `${(PIANO_TOP_MIDI - midi) * PIANO_ROW_HEIGHT}px`;
      grid.append(row);
      const key = document.createElement("button");
      key.type = "button";
      key.className = `piano-roll-key${[1, 3, 6, 8, 10].includes(pitchClass) ? " is-black" : ""}${pitchClass === 0 ? " is-octave" : ""}`;
      key.textContent = pitchClass === 0 ? midiNoteName(midi) : "";
      key.setAttribute("aria-label", `Preview ${midiNoteName(midi)}`);
      key.addEventListener("click", async () => {
        try {
          await ensureAudio();
          playPianoNote(getPianoTrack(), state.audioContext.currentTime + 0.015, midi, 0.4, 0.75);
        } catch (error) {
          showToast(error.message || "The instrument could not be played.");
        }
      });
      keys.append(key);
    }
    state.pianoNotes
      .filter((note) => note.startTick < totalTicks)
      .forEach((note) => {
        const track = getPianoTrack(note.trackId);
        if (!track) return;
        const element = document.createElement("div");
        element.className = `piano-roll-note${state.selectedPianoNoteIds.has(note.id) || note.id === state.selectedPianoNoteId ? " is-selected" : ""}`;
        element.dataset.noteId = note.id;
        element.style.setProperty("--note-color", track.color);
        element.style.left = `${note.startTick * 16 + 1}px`;
        element.style.top = `${(PIANO_TOP_MIDI - note.midi) * PIANO_ROW_HEIGHT + 1}px`;
        element.style.width = `${Math.max(14, note.durationTicks * 16 - 2)}px`;
        element.textContent = midiNoteName(note.midi);
        element.title = `${track.name} · ${midiNoteName(note.midi)} · ${note.durationTicks}/32`;
        element.setAttribute("role", "button");
        element.setAttribute("tabindex", "0");
        element.setAttribute("aria-label", `${track.name}, ${midiNoteName(note.midi)}, start ${note.startTick}/32, duration ${note.durationTicks}/32`);
        element.addEventListener("focus", () => {
          selectPianoNote(note.id, state.selectedPianoNoteIds.has(note.id));
        });
        const resize = document.createElement("span");
        resize.className = "piano-roll-note-resize";
        element.append(resize);
        element.addEventListener("pointerdown", (event) => startPianoNoteEdit(event, note, event.target === resize));
        grid.append(element);
      });
  }

  function addPianoNoteFromPointer(event) {
    if (event.button !== 0 || !getPianoTrack()) return;
    if (event.shiftKey && (event.ctrlKey || event.metaKey)) {
      deleteSelectedPianoNotes(new Set(state.selectedPianoNoteIds));
      return;
    }
    const grid = $("#piano-roll-grid");
    const rect = grid.getBoundingClientRect();
    const totalTicks = state.pianoBars * PIANO_TICKS_PER_BAR;
    const rawTick = Math.max(0, Math.min(totalTicks - 1, (event.clientX - rect.left) / 16));
    const startTick = Math.floor(rawTick / state.pianoSnap) * state.pianoSnap;
    const row = Math.max(0, Math.min(PIANO_TOP_MIDI - PIANO_BOTTOM_MIDI, Math.floor((event.clientY - rect.top) / PIANO_ROW_HEIGHT)));
    const midi = PIANO_TOP_MIDI - row;
    const note = {
      id: makeId(),
      trackId: state.selectedPianoTrackId,
      midi,
      startTick,
      durationTicks: Math.max(1, Math.min(state.pianoNoteLength, totalTicks - startTick)),
      velocity: 0.8,
    };
    state.pianoNotes.push(note);
    state.selectedPianoNoteId = note.id;
    state.selectedPianoNoteIds = event.shiftKey
      ? new Set([...state.selectedPianoNoteIds, note.id])
      : new Set([note.id]);
    state.pianoSelectionFromMarquee = false;
    state.selectedArrangementItems.clear();
    updateArrangementSelection();
    renderPianoRoll();
    updateArrangementLength();
    renderArrangement();
    saveState();
    ensureAudio().then(() => playPianoNote(getPianoTrack(note.trackId), state.audioContext.currentTime + 0.015, note.midi, note.durationTicks / PIANO_TICKS_PER_BAR * (240 / state.bpm), note.velocity))
      .catch((error) => showToast(error.message || "The instrument could not be played."));
  }

  function startPianoNoteEdit(event, note, resizing) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    state.pianoSelectionFromMarquee = false;
    if (event.shiftKey) {
      if (event.ctrlKey || event.metaKey) {
        deleteSelectedPianoNotes(new Set([...state.selectedPianoNoteIds, note.id]));
      } else {
        selectPianoNote(note.id, true);
        renderPianoRoll();
      }
      return;
    }
    if (!state.selectedPianoNoteIds.has(note.id)) selectPianoNote(note.id);
    state.selectedPianoNoteId = note.id;
    const editNotes = !resizing && state.selectedPianoNoteIds.size > 1
      ? state.pianoNotes.filter((item) => state.selectedPianoNoteIds.has(item.id))
      : [note];
    const originals = editNotes.map((item) => ({
      note: item,
      startTick: item.startTick,
      durationTicks: item.durationTicks,
      midi: item.midi,
    }));
    const startX = event.clientX;
    const startY = event.clientY;
    const durationTicks = note.durationTicks;
    const totalTicks = state.pianoBars * PIANO_TICKS_PER_BAR;
    const noteElements = new Map(Array.from(document.querySelectorAll(".piano-roll-note"), (item) => [item.dataset.noteId, item]));
    const update = (moveEvent) => {
      const delta = Math.round((moveEvent.clientX - startX) / 16 / state.pianoSnap) * state.pianoSnap;
      if (resizing) {
        note.durationTicks = Math.max(1, Math.min(totalTicks - note.startTick, Math.round((durationTicks + delta) / state.pianoSnap) * state.pianoSnap));
      } else {
        const minStart = Math.min(...originals.map((item) => item.startTick));
        const maxEnd = Math.max(...originals.map((item) => item.startTick + item.durationTicks));
        const minPitch = Math.min(...originals.map((item) => item.midi));
        const maxPitch = Math.max(...originals.map((item) => item.midi));
        const deltaTicks = Math.max(-minStart, Math.min(totalTicks - maxEnd, delta));
        const deltaPitch = Math.max(PIANO_BOTTOM_MIDI - minPitch, Math.min(PIANO_TOP_MIDI - maxPitch,
          -Math.round((moveEvent.clientY - startY) / PIANO_ROW_HEIGHT)));
        originals.forEach((original) => {
          original.note.startTick = original.startTick + deltaTicks;
          original.note.midi = original.midi + deltaPitch;
        });
      }
      originals.forEach((original) => {
        const target = noteElements.get(original.note.id);
        if (!target) return;
        target.style.left = `${original.note.startTick * 16 + 1}px`;
        target.style.top = `${(PIANO_TOP_MIDI - original.note.midi) * PIANO_ROW_HEIGHT + 1}px`;
        target.style.width = `${Math.max(14, original.note.durationTicks * 16 - 2)}px`;
        const resizeHandle = target.querySelector(".piano-roll-note-resize");
        target.textContent = midiNoteName(original.note.midi);
        if (resizeHandle) target.append(resizeHandle);
      });
    };
    const finish = () => {
      document.removeEventListener("pointermove", update);
      document.removeEventListener("pointerup", finish);
      document.removeEventListener("pointercancel", finish);
      state.suppressPianoGridClick = true;
      window.setTimeout(() => { state.suppressPianoGridClick = false; }, 0);
      updateArrangementLength();
      renderPianoRoll();
      renderArrangement();
      saveState();
    };
    document.addEventListener("pointermove", update);
    document.addEventListener("pointerup", finish);
    document.addEventListener("pointercancel", finish);
  }

  function selectPianoNote(noteId, additive = false) {
    state.pianoSelectionFromMarquee = false;
    state.selectedArrangementItems.clear();
    updateArrangementSelection();
    state.selectedPianoNoteIds = additive
      ? new Set([...state.selectedPianoNoteIds, noteId])
      : new Set([noteId]);
    state.selectedPianoNoteId = noteId;
    document.querySelectorAll(".piano-roll-note").forEach((item) =>
      item.classList.toggle("is-selected", state.selectedPianoNoteIds.has(item.dataset.noteId)));
  }

  function deleteSelectedPianoNotes(noteIds) {
    if (!noteIds.size) return false;
    const existingIds = new Set(state.pianoNotes.filter((note) => noteIds.has(note.id)).map((note) => note.id));
    if (!existingIds.size) return false;
    state.selectedArrangementItems.clear();
    updateArrangementSelection();
    state.pianoNotes = state.pianoNotes.filter((note) => !existingIds.has(note.id));
    state.pianoSelectionFromMarquee = false;
    existingIds.forEach((id) => {
      [...state.scheduledPianoNotes].filter((key) => key.startsWith(`${id}:`)).forEach((key) => state.scheduledPianoNotes.delete(key));
    });
    state.selectedPianoNoteIds.clear();
    state.selectedPianoNoteId = null;
    renderPianoRoll();
    updateArrangementLength();
    renderArrangement();
    saveState();
    return true;
  }

  function deleteSelectedPianoNote() {
    const selected = new Set(state.selectedPianoNoteIds);
    if (state.selectedPianoNoteId) selected.add(state.selectedPianoNoteId);
    deleteSelectedPianoNotes(selected);
  }

  function startPianoSelection(event) {
    if (event.button !== 0 || event.target.closest(".piano-roll-note")) return;
    const grid = $("#piano-roll-grid");
    const startX = event.clientX;
    const startY = event.clientY;
    const additive = event.shiftKey;
    let marquee = null;
    let moved = false;
    const update = (moveEvent) => {
      if (!moved && Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) < 4) return;
      moved = true;
      moveEvent.preventDefault();
      if (!marquee) {
        marquee = document.createElement("div");
        marquee.className = "selection-marquee";
        grid.append(marquee);
      }
      const bounds = grid.getBoundingClientRect();
      marquee.style.left = `${Math.min(startX, moveEvent.clientX) - bounds.left}px`;
      marquee.style.top = `${Math.min(startY, moveEvent.clientY) - bounds.top}px`;
      marquee.style.width = `${Math.abs(moveEvent.clientX - startX)}px`;
      marquee.style.height = `${Math.abs(moveEvent.clientY - startY)}px`;
    };
    const finish = () => {
      document.removeEventListener("pointermove", update);
      document.removeEventListener("pointerup", finish);
      document.removeEventListener("pointercancel", finish);
      if (!moved) return;
      const selection = marquee.getBoundingClientRect();
      const next = new Set(additive ? state.selectedPianoNoteIds : []);
      document.querySelectorAll(".piano-roll-note").forEach((note) => {
        const bounds = note.getBoundingClientRect();
        if (bounds.left <= selection.right && bounds.right >= selection.left &&
          bounds.top <= selection.bottom && bounds.bottom >= selection.top) next.add(note.dataset.noteId);
      });
      state.selectedPianoNoteIds = next;
      state.selectedPianoNoteId = [...next].at(-1) || null;
      state.pianoSelectionFromMarquee = true;
      state.selectedArrangementItems.clear();
      state.arrangementSelectionFromMarquee = false;
      updateArrangementSelection();
      state.suppressPianoGridClick = true;
      window.setTimeout(() => { state.suppressPianoGridClick = false; }, 0);
      renderPianoRoll();
    };
    document.addEventListener("pointermove", update);
    document.addEventListener("pointerup", finish);
    document.addEventListener("pointercancel", finish);
  }

  function clearMarqueeSelectionOnOutsidePointer(event) {
    if (event.button !== 0 || event.shiftKey) return;
    const target = event.target;
    if (state.pianoSelectionFromMarquee && !target.closest(".piano-roll-note")) {
      state.selectedPianoNoteIds.clear();
      state.selectedPianoNoteId = null;
      state.pianoSelectionFromMarquee = false;
      if (target.closest("#piano-roll-grid")) state.suppressPianoGridClick = true;
      document.querySelectorAll(".piano-roll-note").forEach((item) => item.classList.remove("is-selected"));
    }
    if (state.arrangementSelectionFromMarquee && !target.closest("[data-selectable-type]")) {
      state.selectedArrangementItems.clear();
      state.arrangementSelectionFromMarquee = false;
      updateArrangementSelection();
    }
  }

  function addPatternInstrument(trackId) {
    const pattern = getPattern();
    const source = state.tracks.find((item) => item.id === trackId && !item.sourceId);
    if (!pattern || !source) return;
    captureCurrentPattern();
    const layerCount = getPatternTrackIds(pattern).filter((id) => {
      const layer = state.tracks.find((item) => item.id === id);
      return layer && (layer.id === source.id || layer.sourceId === source.id);
    }).length;
    const track = makePatternInstrumentLayer(source, {
      name: layerCount ? `${source.name} ${layerCount + 1}` : source.name,
    });
    state.tracks.push(track);
    pattern.trackIds.push(track.id);
    pattern.cells[track.id] = Array(STEP_COUNT).fill(false);
    if (SOUND_VARIANTS[track.kind]) pattern.variants[track.id] = track.variant || "classic";
    renderTracks();
    renderPatternSelectors();
    saveState();
    showToast(`${track.name} added to ${pattern.name}`);
  }

  function removePatternInstrument(track) {
    const pattern = getPattern();
    if (!pattern) return;
    captureCurrentPattern();
    pattern.trackIds = getPatternTrackIds(pattern).filter((id) => id !== track.id);
    delete pattern.cells[track.id];
    delete pattern.variants[track.id];
    track.cells = Array(STEP_COUNT).fill(false);
    track.solo = false;
    if (track.sourceId && !state.patterns.some((item) => item.id !== pattern.id && getPatternTrackIds(item).includes(track.id))) {
      track.gainNode?.disconnect();
      state.tracks = state.tracks.filter((item) => item !== track);
      if (track.kind === "sample" || track.sample) {
        deletePersistedDrumSample(track.id).catch(() => showToast("Layer removed, but its saved sample could not be deleted."));
      }
    }
    updateTrackGains();
    renderTracks();
    renderPatternSelectors();
    saveState();
    showToast(`${track.name} removed from ${pattern.name}`);
  }

  function selectPattern(patternId) {
    const pattern = getPattern(patternId);
    if (!pattern || pattern.id === state.selectedPatternId) return;
    if (state.keyboardRecording?.mode === "sequencer") stopPlayback();
    captureCurrentPattern();
    applyPattern(pattern);
    state.selectedPreset = null;
    renderTracks();
    renderPresets();
    renderPatternSelectors();
    updateArrangementLength();
    if (isSongWorkspace()) renderArrangement();
    saveState();
  }

  function createPattern() {
    captureCurrentPattern();
    const source = getPattern();
    if (!source) return;
    let number = state.patterns.length + 1;
    while (state.patterns.some((pattern) => pattern.name === `Pattern ${number}`)) number += 1;
    const pattern = {
      id: makeId(),
      name: `Pattern ${number}`,
      color: getPatternColor(state.patterns.length),
      steps: source.steps,
      trackIds: [...getPatternTrackIds(source)],
      cells: Object.fromEntries(Object.entries(source.cells).map(([trackId, cells]) => [trackId, [...cells]])),
      variants: { ...source.variants },
      gridResolution: getPatternGridResolution(source),
    };
    state.patterns.push(pattern);
    applyPattern(pattern);
    state.selectedPreset = null;
    renderTracks();
    renderPresets();
    renderPatternSelectors();
    updateArrangementLength();
    if (isSongWorkspace()) renderArrangement();
    saveState();
    showToast(`${pattern.name} created from the selected pattern`);
  }

  function renamePattern() {
    const pattern = getPattern();
    if (!pattern) return;
    const name = window.prompt("Rename pattern", pattern.name);
    if (name === null) return;
    const trimmed = name.trim();
    if (!trimmed) {
      showToast("Pattern name cannot be empty.");
      return;
    }
    if (state.patterns.some((item) => item.id !== pattern.id && item.name.toLowerCase() === trimmed.toLowerCase())) {
      showToast("A pattern with that name already exists.");
      return;
    }
    pattern.name = trimmed;
    renderPatternSelectors();
    if (isSongWorkspace()) renderArrangement();
    saveState();
  }

  function renderHeader() {
    stepsHeader.innerHTML = "";
    const gridHeader = stepsHeader.parentElement;
    gridHeader.classList.toggle("is-two-bars", state.steps === 32);
    const slotsPerBar = getStepsPerBar();
    const columns = Math.min(16, slotsPerBar);
    const stepCount = getGridStepCount();
    const rows = Math.ceil(stepCount / columns);
    const rowHeight = rows > 2 ? 12 : 17;
    gridHeader.style.height = `${Math.max(45, rows * rowHeight + 11)}px`;
    stepsHeader.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
    stepsHeader.style.gridTemplateRows = `repeat(${rows}, ${rowHeight}px)`;
    for (let step = 0; step < stepCount; step += 1) {
      const barStep = step % slotsPerBar;
      const stepsPerBeat = slotsPerBar / 4;
      const number = document.createElement("span");
      number.className = `step-number${barStep % stepsPerBeat === 0 ? " is-beat" : ""}${barStep === 0 ? " is-bar" : ""}`;
      number.textContent = String(barStep + 1).padStart(2, "0");
      stepsHeader.append(number);
    }
  }

  function renderTracks() {
    trackList.innerHTML = "";
    const includedTrackIds = new Set(getPatternTrackIds(getPattern()));
    const visibleTracks = state.tracks.filter((track) => includedTrackIds.has(track.id));
    const liveKeys = state.keyboardRecording?.mode === "sequencer" ? getStepKeyboardMap() : null;
    visibleTracks.forEach((track) => {
      const row = document.createElement("div");
      row.className = "track-row";
      row.dataset.trackId = track.id;
      row.style.setProperty("--track-color", track.color);
      const slotsPerBar = getStepsPerBar();
      const columns = Math.min(16, slotsPerBar);
      const stepCount = getGridStepCount();
      const rows = Math.ceil(stepCount / columns);
      const cellHeight = Math.min(28, Math.max(12, Math.floor((64 - (rows - 1) * 5) / rows)));
      row.style.minHeight = `${Math.max(64, rows * cellHeight + (rows - 1) * 5)}px`;

      const meta = document.createElement("div");
      meta.className = "track-meta";
      const color = document.createElement("span");
      color.className = "track-color";
      color.setAttribute("aria-hidden", "true");
      const info = document.createElement("div");
      info.className = "track-info";
      const name = document.createElement("div");
      name.className = "track-name";
      const nameText = document.createElement("span");
      nameText.className = "track-name-text";
      nameText.textContent = track.name;
      name.append(nameText);
      const liveKey = liveKeys?.get(track.id);
      if (liveKey) {
        const keyHint = document.createElement("kbd");
        keyHint.className = "live-key-hint";
        keyHint.textContent = liveKey.label;
        name.append(keyHint);
        name.title = `${track.name} · press ${liveKey.label} to record`;
      }
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
        makeTrackButton("remove-from-pattern", "Remove instrument from this pattern", track),
      );
      if (track.kind === "sample" && !track.sourceId) controls.append(makeTrackButton("remove", "Remove imported drum sound", track));
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
      grid.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
      grid.style.gridTemplateRows = `repeat(${rows}, minmax(0, 1fr))`;
      grid.style.setProperty("--step-cell-height", `${cellHeight}px`);
      grid.setAttribute("role", "group");
      grid.setAttribute("aria-label", `${track.name} steps`);
      for (let step = 0; step < stepCount; step += 1) {
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
    $("#track-count").textContent = String(visibleTracks.length).padStart(2, "0");
    renderInstrumentBrowser();
    renderPatternInstrumentOptions();
    renderPianoInstrumentOptions();
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
      if (isSongWorkspace()) renderArrangement();
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
    if (type === "remove-from-pattern") {
      button.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12" /></svg>';
      button.addEventListener("click", () => removePatternInstrument(track));
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
    const includedTrackIds = new Set(getPatternTrackIds(getPattern()));
    const slotsPerBar = getStepsPerBar();
    state.tracks.forEach((track) => {
      track.cells.fill(false);
      if (includedTrackIds.has(track.id)) {
        (preset.hits[track.sourceId || track.id] || []).forEach((sixteenthStep) => {
          const step = Math.min(slotsPerBar - 1, Math.round(sixteenthStep * slotsPerBar / 16));
          track.cells[step] = true;
        });
      }
    });
    renderTracks();
    renderPresets();
    $("#arrangement-pattern-length").value = String(state.steps);
    updateArrangementLength();
    if (isSongWorkspace()) renderArrangement();
    saveState();
    showToast(`${preset.title} pattern loaded`);
  }

  function setLength(steps) {
    state.steps = steps;
    state.liveRecordedHits.clear();
    const activePattern = getPattern();
    if (activePattern) activePattern.steps = steps;
    $("#arrangement-pattern-length").value = String(steps);
    state.patternClips.forEach((clip) => {
      const pattern = getPattern(clip.patternId);
      if (pattern) clip.startBar = Math.min(clip.startBar, maxPatternStartBar(pattern.steps * (clip.repeatCount || 1)));
    });
    document.querySelectorAll(".length-button").forEach((button) => {
      const selected = Number(button.dataset.steps) === steps;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    $("#bar-label").textContent = steps === 16 ? "1 BAR" : "2 BARS";
    renderHeader();
    renderTracks();
    updateArrangementLength();
    if (isSongWorkspace()) renderArrangement();
    if (state.currentStep >= getGridStepCount()) state.currentStep = -1;
    saveState();
  }

  function setPatternGridResolution(gridResolution) {
    const pattern = getPattern();
    if (!pattern || !GRID_RESOLUTIONS.includes(gridResolution)) return;
    captureCurrentPattern();
    const previousSlotsPerBar = getStepsPerBar(pattern);
    if (previousSlotsPerBar === GRID_STEPS_PER_BAR[gridResolution]) return;
    state.liveRecordedHits.clear();
    const nextSlotsPerBar = GRID_STEPS_PER_BAR[gridResolution];
    const bars = pattern.steps / 16;
    const cells = {};
    getPatternTrackIds(pattern).forEach((trackId) => {
      cells[trackId] = remapGridCells(pattern.cells[trackId] || [], bars, previousSlotsPerBar, nextSlotsPerBar);
    });
    pattern.cells = { ...pattern.cells, ...cells };
    pattern.gridResolution = gridResolution;
    applyPattern(pattern);
    renderTracks();
    renderPatternSelectors();
    if (isSongWorkspace()) renderArrangement();
    saveState();
  }

  function getStepKeyboardMap(pattern = getPattern()) {
    return new Map(getPatternTrackIds(pattern).map((trackId, index) => {
      const code = LIVE_KEY_CODES[index % LIVE_KEY_CODES.length];
      const shift = index >= LIVE_KEY_CODES.length;
      return [trackId, { code, label: `${shift ? "Shift+" : ""}${liveKeyLabel(code)}` }];
    }));
  }

  function liveKeyLabel(code) {
    if (code.startsWith("Key")) return code.slice(3);
    if (code.startsWith("Digit")) return code.slice(5);
    return ({
      Minus: "-", Equal: "=", BracketLeft: "[", BracketRight: "]", Semicolon: ";",
      Quote: "'", Backslash: "\\", Comma: ",", Period: ".", Slash: "/",
    })[code] || code;
  }

  function updateKeyboardRecordButtons() {
    [
      ["#step-keyboard-record-button", "sequencer"],
      ["#piano-keyboard-record-button", "piano-roll"],
    ].forEach(([selector, mode]) => {
      const button = $(selector);
      const isRecording = state.keyboardRecording?.mode === mode;
      button.classList.toggle("is-recording", isRecording);
      button.setAttribute("aria-pressed", String(isRecording));
      button.textContent = isRecording ? "Stop recording" : "Record keys";
    });
  }

  function createLivePattern() {
    captureCurrentPattern();
    const source = getPattern();
    if (!source) return null;
    let number = 1;
    while (state.patterns.some((pattern) => pattern.name === `Live Pattern ${number}`)) number += 1;
    const trackIds = [...getPatternTrackIds(source)];
    const pattern = {
      id: makeId(),
      name: `Live Pattern ${number}`,
      color: getPatternColor(state.patterns.length),
      steps: source.steps,
      trackIds,
      cells: Object.fromEntries(trackIds.map((trackId) => [trackId, Array(STEP_COUNT).fill(false)])),
      variants: { ...source.variants },
      gridResolution: getPatternGridResolution(source),
    };
    state.patterns.push(pattern);
    applyPattern(pattern);
    state.selectedPreset = null;
    renderTracks();
    renderPresets();
    renderPatternSelectors();
    addPatternClip(state.arrangementCursor, pattern.id);
    return pattern;
  }

  async function toggleKeyboardRecording(mode) {
    if (state.keyboardRecording) {
      stopPlayback();
      return;
    }
    if (state.isPlaying) stopPlayback();
    try {
      await ensureAudio();
      let targetId;
      if (mode === "sequencer") {
        const pattern = createLivePattern();
        if (!pattern) return;
        targetId = pattern.id;
      } else {
        createMel();
        const mel = getMel();
        if (!mel) return;
        targetId = mel.id;
        addMelTrack(mel.id, state.arrangementCursor);
        renderPianoRoll();
      }
      state.keyboardRecording = { mode, targetId };
      updateKeyboardRecordButtons();
      if (mode === "sequencer") renderTracks();
      await startPlayback();
      if (!state.isPlaying) {
        state.keyboardRecording = null;
        updateKeyboardRecordButtons();
        renderTracks();
        return;
      }
      showToast(mode === "sequencer"
        ? "Recording keys: use the shortcuts shown on each instrument."
        : "Recording keys: use Z/S/X… and Q/2/W… to play notes.");
    } catch (error) {
      state.keyboardRecording = null;
      updateKeyboardRecordButtons();
      showToast(error.message || "Keyboard recording could not start.");
    }
  }

  function recordStepKeyboardHit(event) {
    if (!state.keyboardRecording || state.keyboardRecording.mode !== "sequencer" ||
      state.view !== "sequencer" || !state.audioContext || event.repeat) return false;
    const keyIndex = LIVE_KEY_CODES.indexOf(event.code);
    if (keyIndex < 0) return false;
    const trackIndex = keyIndex + (event.shiftKey ? LIVE_KEY_CODES.length : 0);
    const pattern = getPattern(state.keyboardRecording.targetId);
    if (!pattern) return false;
    const trackId = getPatternTrackIds(pattern)[trackIndex];
    const track = state.tracks.find((item) => item.id === trackId);
    if (!track) return false;
    event.preventDefault();
    const ticksPerStep = getGridTicksPerStep(pattern);
    const elapsed = Math.max(0, state.audioContext.currentTime - state.playbackStartTime);
    const gridStepCount = getGridStepCount(pattern);
    const gridStepDuration = getSchedulerTickDuration() * ticksPerStep;
    const absoluteGridStep = Math.max(0, Math.ceil(elapsed / gridStepDuration - 0.000001));
    const loopIndex = Math.floor(absoluteGridStep / gridStepCount);
    const gridStep = absoluteGridStep % gridStepCount;
    pattern.cells[track.id] ||= Array(STEP_COUNT).fill(false);
    pattern.cells[track.id][gridStep] = true;
    state.liveRecordedHits.add(`${pattern.id}:${loopIndex}:${track.id}:${gridStep}`);
    track.cells[gridStep] = true;
    const hasSolo = state.tracks.some((item) => item.solo);
    if (!track.muted && (!hasSolo || track.solo)) {
      const time = state.audioContext.currentTime + 0.01;
      const midi = track.kind === "drumkit" ? 36 : 60 + (keyIndex % 24);
      if (track.kind === "instrument" || track.kind === "drumkit") {
        playPianoNote(track, time, midi, getStepDuration(), 0.85);
      } else {
        triggerTrack(track, time, gridStep, pattern.variants[track.id] || track.variant, getNoteDuration());
      }
    }
    renderTracks();
    saveState();
    return true;
  }

  function recordPianoKeyboardNote(event) {
    if (!state.keyboardRecording || state.keyboardRecording.mode !== "piano-roll" ||
      state.view !== "piano-roll" || !state.audioContext || event.repeat) return false;
    const midi = PIANO_KEY_MIDI.get(event.code);
    if (midi === undefined) return false;
    const mel = getMel(state.keyboardRecording.targetId);
    const instrument = mel ? getPianoTrack(mel.instrumentId) : null;
    if (!mel || !instrument) return false;
    event.preventDefault();
    const secondsPerBar = 240 / state.bpm;
    const loopTicks = getMelLengthBars(mel) * PIANO_TICKS_PER_BAR;
    const elapsedSeconds = Math.max(0, state.audioContext.currentTime - state.playbackStartTime);
    const elapsedTicks = Math.floor(elapsedSeconds / secondsPerBar * PIANO_TICKS_PER_BAR);
    const startTick = Math.floor((elapsedTicks % loopTicks) / state.pianoSnap) * state.pianoSnap;
    const durationTicks = Math.max(1, Math.min(state.pianoNoteLength, loopTicks - startTick));
    const note = { id: makeId(), trackId: instrument.id, midi, startTick, durationTicks, velocity: 0.8 };
    mel.notes.push(note);
    mel.notes.sort((left, right) => left.startTick - right.startTick);
    state.pianoNotes = mel.notes.map((item) => ({ ...item, trackId: instrument.id }));
    state.selectedPianoNoteId = note.id;
    state.selectedPianoNoteIds = new Set([note.id]);
    state.selectedArrangementItems.clear();
    updateArrangementSelection();
    const loopIndex = Math.floor(elapsedSeconds / (loopTicks / PIANO_TICKS_PER_BAR * secondsPerBar));
    state.scheduledPianoNotes.add(`${note.id}:${loopIndex}`);
    playPianoNote(instrument, state.audioContext.currentTime + 0.01, midi, durationTicks / PIANO_TICKS_PER_BAR * secondsPerBar, note.velocity);
    renderPianoRoll();
    renderArrangement();
    saveState();
    return true;
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

  function getSchedulerTickDuration() {
    return getStepDuration() / 2;
  }

  function getNoteDuration() {
    return getStepDuration();
  }

  function scheduleStep(step, time, pattern = null, loopIndex = null) {
    const activeTracks = pattern
      ? state.tracks.filter((track) => getPatternTrackIds(pattern).includes(track.id))
      : state.tracks;
    const hasSolo = state.tracks.some((track) => track.solo);
    activeTracks.forEach((track) => {
      const cells = pattern ? pattern.cells?.[track.id] || [] : track.cells;
      const variant = pattern ? pattern.variants?.[track.id] || "classic" : track.variant;
      if (cells[step] && !track.muted && (!hasSolo || track.solo)) {
        if (pattern && loopIndex !== null &&
          state.liveRecordedHits.delete(`${pattern.id}:${loopIndex}:${track.id}:${step}`)) return;
        triggerTrack(track, time, step, variant, getNoteDuration(pattern || getPattern()));
      }
    });
    const displayDelay = Math.max(0, (time - state.audioContext.currentTime) * 1000);
    const timerId = window.setTimeout(() => {
      state.stepTimers.delete(timerId);
      if (state.isPlaying) setPlayhead(step);
    }, displayDelay);
    state.stepTimers.add(timerId);
  }

  function scheduler() {
    const arrangementPlayback = state.view === "arrangement";
    const pianoLoopPlayback = state.view === "piano-roll";
    if (arrangementPlayback && state.isPlaying) {
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
      (!arrangementPlayback || state.nextStepTime < state.playbackEndTime)
    ) {
      const clockStep = state.stepIndex;
      const arrangementSteps = arrangementPlayback ? arrangementStepsAtTime(state.nextStepTime) : null;
      const swingOffset = Math.floor(clockStep / 2) % 2 === 1 ? getStepDuration() * (state.swing / 100) : 0;
      if (arrangementPlayback) {
        arrangementSteps.forEach(({ pattern, step: patternStep }) =>
          scheduleStep(patternStep, state.nextStepTime + swingOffset, pattern));
        if (state.metronome && clockStep % 8 === 0) {
          triggerClick(state.nextStepTime + swingOffset, clockStep % 32 === 0);
        }
      } else if (state.view === "sequencer") {
        const pattern = getPattern();
        const gridStepCount = getGridStepCount(pattern);
        const ticksPerGridStep = getGridTicksPerStep(pattern);
        if (clockStep % ticksPerGridStep === 0) {
          const absoluteTick = Math.round((state.nextStepTime - state.playbackStartTime) / getSchedulerTickDuration());
          const patternTicks = pattern.steps * 2;
          if (absoluteTick > 0 && absoluteTick % patternTicks === 0) state.liveRecordedHits.clear();
          const loopIndex = Math.floor(absoluteTick / patternTicks);
          scheduleStep(Math.floor(clockStep / ticksPerGridStep) % gridStepCount, state.nextStepTime + swingOffset, pattern, loopIndex);
        }
        if (state.metronome && clockStep % 8 === 0) {
          triggerClick(state.nextStepTime, clockStep % 32 === 0);
        }
      }
      state.nextStepTime += getSchedulerTickDuration();
      state.stepIndex = (clockStep + 1) % (state.steps * 2);
    }
    if (pianoLoopPlayback) scheduleCurrentMelLoop(lookAhead);
  }

  function arrangementStepsAtTime(time) {
    const barPosition = state.playbackStartBar + (time - state.playbackStartTime) / (240 / state.bpm);
    return state.patternClips.flatMap((clip) => {
      const pattern = getPattern(clip.patternId);
      const clipBars = pattern ? pattern.steps / 16 * (clip.repeatCount || 1) : 0;
      if (!pattern || barPosition < clip.startBar || barPosition >= clip.startBar + clipBars) return [];
      const stepsPerBar = getStepsPerBar(pattern);
      const position = (barPosition - clip.startBar) * stepsPerBar;
      const stepInClip = Math.round(position);
      if (Math.abs(position - stepInClip) > 0.001) return [];
      return [{
        pattern,
        step: stepInClip % getGridStepCount(pattern),
      }];
    });
  }

  function scheduleCurrentMelLoop(lookAhead) {
    const mel = getMel();
    const instrument = getPianoTrack();
    if (!mel || !instrument) return;
    const secondsPerBar = 240 / state.bpm;
    const now = state.audioContext.currentTime;
    const loopSeconds = getMelLengthBars(mel) * secondsPerBar;
    const firstLoop = Math.max(0, Math.floor((now - state.playbackStartTime) / loopSeconds));
    mel.notes.forEach((note) => {
      const noteOffset = note.startTick / PIANO_TICKS_PER_BAR * secondsPerBar;
      const duration = note.durationTicks / PIANO_TICKS_PER_BAR * secondsPerBar;
      for (let loop = firstLoop; loop <= firstLoop + 1; loop += 1) {
        const key = `${note.id}:${loop}`;
        if (state.scheduledPianoNotes.has(key)) continue;
        const when = state.playbackStartTime + loop * loopSeconds + noteOffset;
        if (when < now || when >= now + lookAhead) continue;
        playPianoNote(instrument, when, note.midi, duration, note.velocity || 0.8);
        state.scheduledPianoNotes.add(key);
      }
    });
  }

  function setPlayhead(step) {
    state.currentStep = step;
    document.querySelectorAll(".step-cell.is-playhead").forEach((cell) => cell.classList.remove("is-playhead"));
    document.querySelectorAll(`.step-cell[data-step="${step}"]`).forEach((cell) => cell.classList.add("is-playhead"));
  }

  function makeId() {
    return window.crypto?.randomUUID?.() || `clip-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function maxPatternStartBar(steps = state.steps) {
    return Math.max(0, MAX_ARRANGEMENT_BARS - steps / 16);
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

  function makePatternInstrumentLayer(source, options = {}) {
    const layer = {
      ...source,
      id: options.id || makeId(),
      sourceId: source.sourceId || source.id,
      name: options.name || source.name,
      libraryOnly: false,
      patch: source.patch ? { ...source.patch } : undefined,
      cells: Array.from({ length: STEP_COUNT }, (_, index) => options.cells?.[index] === true),
      volume: Number.isFinite(options.volume) ? Math.max(0, Math.min(1, options.volume)) : source.volume,
      muted: options.muted === true,
      solo: options.solo === true,
      variant: options.variant ?? source.variant,
      sample: source.sample ? { ...source.sample } : null,
      gainNode: null,
    };
    ensureSequencerTrackAudio(layer);
    return layer;
  }

  async function importDrumSamples(files) {
    if (!files.length) return;
    const imported = [];
    const failures = [];
    try {
      await ensureAudio();
      captureCurrentPattern();
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
          const pattern = getPattern();
          if (pattern) {
            pattern.trackIds = [...getPatternTrackIds(pattern), track.id];
            pattern.cells[track.id] = Array(STEP_COUNT).fill(false);
          }
          imported.push({ track, file });
        } catch {
          failures.push(file.name);
        }
      }

      if (imported.length) {
        renderTracks();
        if (isSongWorkspace()) renderArrangement();
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
    const removedTracks = track.sourceId
      ? [track]
      : state.tracks.filter((item) => item === track || item.sourceId === track.id);
    const removedIds = new Set(removedTracks.map((item) => item.id));
    removedTracks.forEach((item) => item.gainNode?.disconnect());
    state.tracks = state.tracks.filter((item) => !removedIds.has(item.id));
    const fallbackInstrumentId = state.tracks.find((item) => !item.sourceId)?.id || state.tracks[0]?.id || "";
    if (removedIds.has(state.selectedPianoTrackId)) state.selectedPianoTrackId = fallbackInstrumentId;
    state.pianoNotes = state.pianoNotes.map((note) => ({
      ...note,
      trackId: removedIds.has(note.trackId) ? fallbackInstrumentId : note.trackId,
    }));
    state.mels.forEach((mel) => {
      if (removedIds.has(mel.instrumentId)) mel.instrumentId = fallbackInstrumentId;
      mel.notes = mel.notes.map((note) => ({ ...note, trackId: mel.instrumentId }));
    });
    state.melTracks.forEach((melTrack) => {
      if (removedIds.has(melTrack.instrumentId)) melTrack.instrumentId = fallbackInstrumentId;
    });
    if (!state.pianoNotes.some((note) => note.id === state.selectedPianoNoteId)) state.selectedPianoNoteId = null;
    state.patterns.forEach((pattern) => {
      pattern.trackIds = getPatternTrackIds(pattern).filter((id) => !removedIds.has(id));
      removedIds.forEach((id) => {
        delete pattern.cells[id];
        delete pattern.variants[id];
      });
    });
    renderTracks();
    renderMelOptions();
    renderPianoInstrumentOptions();
    renderPianoRoll();
    if (isSongWorkspace()) renderArrangement();
    updateTrackGains();
    saveState();
    removedTracks.filter((item) => item.kind === "sample" || item.sample).forEach((item) => {
      deletePersistedDrumSample(item.id).catch(() => showToast("Track removed, but its saved sample could not be deleted."));
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
    const melEnd = state.melTracks.reduce((latest, track) =>
      track.clips.reduce((end, clip) => {
        const mel = getMel(clip.melId);
        return mel ? Math.max(end, clip.startBar + getMelLengthBars(mel)) : end;
      }, latest), 0);
    const clipEnd = state.arrangementTracks.reduce((latest, track) => {
      return track.clips.reduce((end, clip) => Math.max(end, clip.startBar + clip.buffer.duration / secondsPerBar), latest);
    }, state.patternClips.reduce((end, clip) => {
      const pattern = getPattern(clip.patternId);
      return pattern ? Math.max(end, clip.startBar + pattern.steps / 16 * (clip.repeatCount || 1)) : end;
    }, Math.max(32, melEnd)));
    state.arrangementBars = Math.min(MAX_ARRANGEMENT_BARS, Math.max(state.arrangementBars, Math.ceil(clipEnd)));
    if (state.playbackStartTime && state.isPlaying && state.view === "arrangement") {
      state.playbackEndTime = state.playbackStartTime + (state.arrangementBars - state.playbackStartBar) * secondsPerBar;
    }
    $("#arrangement-bar-label").textContent = `${state.arrangementBars} BARS`;
  }

  function renderArrangement() {
    $("#arrangement-empty").hidden = state.view !== "arrangement";
    $("#arrangement-tab-count").textContent = String(state.arrangementTracks.length + state.melTracks.length + state.patternClips.length);
    renderPatternSelectors();
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

    const arrangedPatternIds = new Set(state.patternClips.map((clip) => clip.patternId));
    const patternTracks = state.patterns.filter((pattern) =>
      pattern.id === state.selectedPatternId || arrangedPatternIds.has(pattern.id));
    patternTracks.forEach((pattern) => {
      const label = document.createElement("div");
      label.className = "arrangement-label";
      label.style.setProperty("--track-color", pattern.color || "var(--accent)");
      label.innerHTML = `<span class="track-color"></span><div class="arrangement-label-info"><div class="arrangement-label-name"></div><div class="arrangement-label-type">Beat pattern · ${getPatternTrackIds(pattern).length} instruments</div></div>`;
      label.querySelector(".arrangement-label-name").textContent = pattern.name;
      labels.append(label);

      const lane = createTimelineLane(`pattern:${pattern.id}`, width);
      state.patternClips
        .filter((clip) => clip.patternId === pattern.id)
        .forEach((clip) => lane.append(createPatternClip(clip)));
      content.append(lane);
    });

    state.melTracks.forEach((track) => {
      const label = document.createElement("div");
      label.className = "arrangement-label";
      label.style.setProperty("--track-color", track.color);
      label.innerHTML = '<span class="track-color"></span><div class="arrangement-label-info"><div class="arrangement-label-name"></div><div class="arrangement-label-type"></div></div>';
      label.querySelector(".arrangement-label-name").textContent = track.name;
      const instrument = getPianoTrack(track.instrumentId);
      label.querySelector(".arrangement-label-type").textContent = `Mel · ${instrument?.name || "Instrument"}`;
      labels.append(label);
      const lane = createTimelineLane(`mel:${track.id}`, width);
      track.clips.forEach((clip) => lane.append(createMelClipElement(track, clip)));
      content.append(lane);
    });

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
    const dropLabel = document.createElement("div");
    dropLabel.className = "arrangement-label mel-drop-label";
    dropLabel.textContent = "Drop Mel for a new track";
    labels.append(dropLabel);
    const melDropLane = createTimelineLane("new-mel-track", width);
    melDropLane.classList.add("mel-new-track-lane");
    const dropHint = document.createElement("span");
    dropHint.textContent = "DROP MEL HERE TO CREATE TRACK";
    melDropLane.append(dropHint);
    content.append(melDropLane);
    $("#arrangement-track-count").textContent = String(patternTracks.length + state.melTracks.length + state.arrangementTracks.length).padStart(2, "0");
    updateArrangementCursorMarker();
    updateArrangementSelection();
  }

  function renderInstrumentBrowser() {
    const browser = $("#instrument-browser");
    browser.replaceChildren();
    const instruments = state.tracks.filter((track) => !track.sourceId);
    $("#drum-sound-count").textContent = String(instruments.length);
    instruments.forEach((track) => {
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

  function addPatternClip(startBar = state.arrangementCursor, patternId = state.selectedPatternId) {
    const pattern = getPattern(patternId);
    if (!pattern) return;
    state.patternClips.push({
      id: makeId(),
      patternId: pattern.id,
      repeatCount: 1,
      startBar: Math.max(0, Math.min(maxPatternStartBar(pattern.steps), Math.floor(startBar))),
    });
    state.patternClips.sort((left, right) => left.startBar - right.startBar);
    updateArrangementLength();
    renderArrangement();
    saveState();
    showToast("Drum pattern added to the arrangement");
  }

  function addMelTrack(melId, startBar) {
    const mel = getMel(melId);
    if (!mel) return;
    const track = {
      id: makeId(),
      name: mel.name,
      instrumentId: mel.instrumentId,
      color: TRACK_COLORS[state.melTracks.length % TRACK_COLORS.length],
      muted: false,
      solo: false,
      clips: [],
    };
    state.melTracks.push(track);
    addMelClip(mel.id, track.id, startBar);
  }

  function addMelClip(melId, trackId, startBar) {
    const mel = getMel(melId);
    const track = state.melTracks.find((item) => item.id === trackId);
    if (!mel || !track) return;
    const length = getMelLengthBars(mel);
    track.clips.push({
      id: makeId(),
      melId,
      startBar: Math.max(0, Math.min(MAX_ARRANGEMENT_BARS - length, Math.floor(startBar))),
    });
    track.clips.sort((left, right) => left.startBar - right.startBar);
    updateArrangementLength();
    renderArrangement();
    saveState();
    showToast(`${mel.name} added to Track View`);
  }

  function moveMelClip(clipId, sourceTrackId, destinationTrackId, startBar) {
    const source = state.melTracks.find((track) => track.id === sourceTrackId);
    const destination = state.melTracks.find((track) => track.id === destinationTrackId);
    const clipIndex = source?.clips.findIndex((clip) => clip.id === clipId) ?? -1;
    const clip = clipIndex >= 0 ? source.clips[clipIndex] : null;
    const mel = clip ? getMel(clip.melId) : null;
    if (!source || !destination || !clip || !mel) return;
    if (source !== destination) source.clips.splice(clipIndex, 1);
    clip.startBar = Math.max(0, Math.min(MAX_ARRANGEMENT_BARS - getMelLengthBars(mel), Math.floor(startBar)));
    if (source !== destination) destination.clips.push(clip);
    destination.clips.sort((left, right) => left.startBar - right.startBar);
    if (source !== destination && !source.clips.length) state.melTracks = state.melTracks.filter((item) => item !== source);
    updateArrangementLength();
    renderArrangement();
    saveState();
  }

  function moveMelClipToNewTrack(clipId, sourceTrackId, startBar) {
    const source = state.melTracks.find((track) => track.id === sourceTrackId);
    const clip = source?.clips.find((item) => item.id === clipId);
    const mel = clip ? getMel(clip.melId) : null;
    if (!source || !clip || !mel) return;
    const destination = {
      ...source,
      id: makeId(),
      name: mel.name,
      instrumentId: mel.instrumentId,
      clips: [],
    };
    state.melTracks.push(destination);
    moveMelClip(clip.id, source.id, destination.id, startBar);
  }

  function removeMelClip(trackId, clipId) {
    const track = state.melTracks.find((item) => item.id === trackId);
    if (!track) return;
    track.clips = track.clips.filter((clip) => clip.id !== clipId);
    if (!track.clips.length) state.melTracks = state.melTracks.filter((item) => item !== track);
    updateArrangementLength();
    renderArrangement();
    saveState();
  }

  function movePatternClip(clipId, startBar) {
    const clip = state.patternClips.find((item) => item.id === clipId);
    if (!clip) return;
    const pattern = getPattern(clip.patternId);
    if (!pattern) return;
    clip.startBar = Math.max(0, Math.min(maxPatternStartBar(pattern.steps * (clip.repeatCount || 1)), Math.floor(startBar)));
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

  function setPatternClipRepeat(clip, repeatCount) {
    const pattern = getPattern(clip.patternId);
    if (!pattern) return;
    const patternBars = pattern.steps / 16;
    const maximum = Math.max(1, Math.floor((MAX_ARRANGEMENT_BARS - clip.startBar) / patternBars));
    clip.repeatCount = Math.max(1, Math.min(maximum, Math.round(repeatCount)));
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
      if (state.suppressArrangementClick) {
        state.suppressArrangementClick = false;
        return;
      }
      if (event.target.closest("[data-selectable-type]")) return;
      setArrangementCursor(barAtPointer(event, lane));
    });
    lane.addEventListener("dragover", (event) => {
      event.preventDefault();
      lane.classList.add("is-drop-target");
      if (event.dataTransfer) {
        const isPatternSource = Array.from(event.dataTransfer.types || []).includes("application/x-pulsegrid-pattern-source");
        const isMelSource = Array.from(event.dataTransfer.types || []).includes("application/x-pulsegrid-mel-source");
        event.dataTransfer.dropEffect = event.dataTransfer.files.length || isPatternSource || isMelSource ? "copy" : "move";
      }
    });
    lane.addEventListener("dragleave", (event) => {
      if (!lane.contains(event.relatedTarget)) lane.classList.remove("is-drop-target");
    });
    lane.addEventListener("drop", async (event) => {
      event.preventDefault();
      lane.classList.remove("is-drop-target");
      const startBar = barAtPointer(event, lane);
      const isPatternLane = trackId.startsWith("pattern:");
      const files = Array.from(event.dataTransfer?.files || []);
      if (files.length) {
        for (const file of files) await importRecording(file, isPatternLane ? null : trackId, startBar);
        return;
      }
      const melSource = event.dataTransfer?.getData("application/x-pulsegrid-mel-source");
      if (melSource) {
        try {
          const { melId } = JSON.parse(melSource);
          if (trackId.startsWith("mel:")) addMelClip(melId, trackId.slice(4), startBar);
          else addMelTrack(melId, startBar);
        } catch {
          showToast("That Mel could not be added.");
        }
        return;
      }
      const melClipTransfer = event.dataTransfer?.getData("application/x-pulsegrid-mel-clip");
      if (melClipTransfer) {
        try {
          const { clipId, sourceTrackId } = JSON.parse(melClipTransfer);
          if (trackId.startsWith("mel:")) moveMelClip(clipId, sourceTrackId, trackId.slice(4), startBar);
          else moveMelClipToNewTrack(clipId, sourceTrackId, startBar);
        } catch {
          showToast("That Mel clip could not be moved.");
        }
        return;
      }
      if (isPatternLane) {
        const patternSource = event.dataTransfer?.getData("application/x-pulsegrid-pattern-source");
        if (patternSource) {
          try {
            const { patternId } = JSON.parse(patternSource);
            addPatternClip(startBar, patternId);
          } catch {
            showToast("That pattern could not be added.");
          }
          return;
        }
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
    element.dataset.selectableType = "audio";
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
      if (!(event.shiftKey && (event.ctrlKey || event.metaKey))) selectArrangementItem("audio", clip.id, event);
      event.dataTransfer?.setData("application/x-pulsegrid-audio-clip", JSON.stringify({ clipId: clip.id, sourceTrackId: track.id }));
      if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
    });
    element.addEventListener("click", (event) => {
      if (event.target.closest(".clip-remove")) return;
      event.stopPropagation();
      if (!selectArrangementItem("audio", clip.id, event)) return;
      setArrangementCursor(clip.startBar);
    });
    element.append(waveform, name, remove);
    return element;
  }

  function createMelClipElement(track, clip) {
    const mel = getMel(clip.melId);
    if (!mel) return document.createElement("div");
    const bars = getMelLengthBars(mel);
    const element = document.createElement("div");
    element.className = "mel-arrangement-clip";
    element.draggable = true;
    element.dataset.clipId = clip.id;
    element.dataset.selectableType = "mel";
    element.style.setProperty("--clip-color", track.color);
    element.style.left = `${clip.startBar * BAR_WIDTH + 4}px`;
    element.style.width = `${Math.max(28, bars * BAR_WIDTH - 8)}px`;
    element.textContent = `${mel.name.toUpperCase()} · ${bars} BAR${bars === 1 ? "" : "S"}`;
    element.setAttribute("aria-label", `${mel.name}, bar ${clip.startBar + 1}; drag to move`);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "mel-clip-remove";
    remove.textContent = "×";
    remove.title = "Remove Mel clip";
    remove.setAttribute("aria-label", `Remove ${mel.name}`);
    remove.addEventListener("click", (event) => {
      event.stopPropagation();
      removeMelClip(track.id, clip.id);
    });
    element.addEventListener("dragstart", (event) => {
      if (!(event.shiftKey && (event.ctrlKey || event.metaKey))) selectArrangementItem("mel", clip.id, event);
      event.dataTransfer?.setData("application/x-pulsegrid-mel-clip", JSON.stringify({ clipId: clip.id, sourceTrackId: track.id }));
      if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
    });
    element.addEventListener("click", (event) => {
      if (event.target.closest(".mel-clip-remove")) return;
      event.stopPropagation();
      if (!selectArrangementItem("mel", clip.id, event)) return;
      setArrangementCursor(clip.startBar);
    });
    element.append(remove);
    return element;
  }

  function createPatternClip(clip) {
    const element = document.createElement("div");
    element.className = "drum-arrangement-clip";
    element.dataset.clipId = clip.id;
    element.dataset.selectableType = "pattern";
    const pattern = getPattern(clip.patternId) || getPattern();
    const steps = pattern?.steps || state.steps;
    const patternName = pattern?.name || "Drum pattern";
    const patternBars = steps / 16;
    const repeatCount = Math.max(1, Math.floor(clip.repeatCount || 1));
    const totalBars = patternBars * repeatCount;
    element.style.setProperty("--pattern-color", pattern?.color || "var(--accent)");
    element.draggable = true;
    element.style.left = `${clip.startBar * BAR_WIDTH + 4}px`;
    element.style.width = `${Math.max(28, totalBars * BAR_WIDTH - 8)}px`;
    element.setAttribute("aria-label", `${patternName}, bar ${clip.startBar + 1}, repeats ${repeatCount} times; drag to move or resize right edge to repeat`);
    const icon = document.createElement("span");
    icon.className = "pattern-clip-icon";
    icon.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 11h3l2-6 4 10 2-6h3" /></svg>';
    const text = document.createElement("span");
    text.className = "pattern-clip-name";
    text.textContent = `${patternName.toUpperCase()} · ${totalBars} BAR${totalBars > 1 ? "S" : ""}${repeatCount > 1 ? ` ×${repeatCount}` : ""}`;
    const repeatHandle = document.createElement("button");
    repeatHandle.type = "button";
    repeatHandle.className = "pattern-clip-repeat-handle";
    repeatHandle.title = "Drag right edge to repeat this pattern";
    repeatHandle.setAttribute("aria-label", "Drag right edge to repeat this pattern");
    repeatHandle.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      setPatternClipRepeat(clip, repeatCount + direction);
    });
    repeatHandle.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const startX = event.clientX;
      const startBars = totalBars;
      const maxRepeats = Math.max(1, Math.floor((MAX_ARRANGEMENT_BARS - clip.startBar) / patternBars));
      let nextRepeatCount = repeatCount;
      element.draggable = false;
      const onMove = (moveEvent) => {
        const bars = Math.max(patternBars, Math.min(maxRepeats * patternBars, startBars + (moveEvent.clientX - startX) / BAR_WIDTH));
        nextRepeatCount = Math.max(1, Math.round(bars / patternBars));
        const nextBars = patternBars * nextRepeatCount;
        element.style.width = `${Math.max(28, nextBars * BAR_WIDTH - 8)}px`;
        text.textContent = `${patternName.toUpperCase()} · ${nextBars} BAR${nextBars > 1 ? "S" : ""}${nextRepeatCount > 1 ? ` ×${nextRepeatCount}` : ""}`;
      };
      const onEnd = () => {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onEnd);
        document.removeEventListener("pointercancel", onEnd);
        element.draggable = true;
        setPatternClipRepeat(clip, nextRepeatCount);
      };
      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onEnd);
      document.addEventListener("pointercancel", onEnd);
    });
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
      if (!(event.shiftKey && (event.ctrlKey || event.metaKey))) selectArrangementItem("pattern", clip.id, event);
      event.dataTransfer?.setData("application/x-pulsegrid-pattern-clip", JSON.stringify({ clipId: clip.id }));
      if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
    });
    element.addEventListener("click", (event) => {
      if (event.target.closest(".pattern-clip-remove, .pattern-clip-repeat-handle")) return;
      event.stopPropagation();
      if (!selectArrangementItem("pattern", clip.id, event)) return;
      setArrangementCursor(clip.startBar);
    });
    element.append(icon, text, repeatHandle, remove);
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

  function arrangementSelectionKey(type, id) {
    return `${type}:${id}`;
  }

  function updateArrangementSelection() {
    document.querySelectorAll("[data-selectable-type][data-clip-id]").forEach((item) => {
      item.classList.toggle("is-selected", state.selectedArrangementItems.has(
        arrangementSelectionKey(item.dataset.selectableType, item.dataset.clipId)));
    });
  }

  function selectArrangementItem(type, id, event) {
    const key = arrangementSelectionKey(type, id);
    state.arrangementSelectionFromMarquee = false;
    if (event.shiftKey && (event.ctrlKey || event.metaKey)) {
      state.selectedPianoNoteIds.clear();
      state.selectedPianoNoteId = null;
      document.querySelectorAll(".piano-roll-note").forEach((item) => item.classList.remove("is-selected"));
      deleteSelectedArrangementItems(new Set([...state.selectedArrangementItems, key]));
      return false;
    }
    state.selectedPianoNoteIds.clear();
    state.selectedPianoNoteId = null;
    document.querySelectorAll(".piano-roll-note").forEach((item) => item.classList.remove("is-selected"));
    if (event.shiftKey) state.selectedArrangementItems.add(key);
    else state.selectedArrangementItems = new Set([key]);
    updateArrangementSelection();
    return true;
  }

  function deleteSelectedArrangementItems(selection = state.selectedArrangementItems) {
    let deleted = false;
    const has = (type, id) => selection.has(arrangementSelectionKey(type, id));
    const nextPatterns = state.patternClips.filter((clip) => {
      const keep = !has("pattern", clip.id);
      deleted ||= !keep;
      return keep;
    });
    state.patternClips = nextPatterns;
    state.melTracks.forEach((track) => {
      track.clips = track.clips.filter((clip) => {
        const keep = !has("mel", clip.id);
        deleted ||= !keep;
        return keep;
      });
    });
    state.melTracks = state.melTracks.filter((track) => track.clips.length > 0);
    state.arrangementTracks.forEach((track) => {
      track.clips = track.clips.filter((clip) => {
        const keep = !has("audio", clip.id);
        if (!keep) {
          deleted = true;
          deletePersistedClip(clip.id);
        }
        return keep;
      });
    });
    state.arrangementTracks = state.arrangementTracks.filter((track) => track.clips.length > 0);
    state.selectedArrangementItems.clear();
    state.arrangementSelectionFromMarquee = false;
    if (!deleted) return false;
    updateArrangementLength();
    renderArrangement();
    saveState();
    return true;
  }

  function startArrangementSelection(event) {
    if (event.button !== 0 || !event.target.closest(".timeline-lane") ||
      event.target.closest("[data-selectable-type]")) return;
    const content = $("#timeline-content");
    const startX = event.clientX;
    const startY = event.clientY;
    const additive = event.shiftKey;
    let marquee = null;
    let moved = false;
    const update = (moveEvent) => {
      if (!moved && Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) < 4) return;
      moved = true;
      moveEvent.preventDefault();
      if (!marquee) {
        marquee = document.createElement("div");
        marquee.className = "selection-marquee";
        content.append(marquee);
      }
      const bounds = content.getBoundingClientRect();
      marquee.style.left = `${Math.min(startX, moveEvent.clientX) - bounds.left}px`;
      marquee.style.top = `${Math.min(startY, moveEvent.clientY) - bounds.top}px`;
      marquee.style.width = `${Math.abs(moveEvent.clientX - startX)}px`;
      marquee.style.height = `${Math.abs(moveEvent.clientY - startY)}px`;
    };
    const finish = () => {
      document.removeEventListener("pointermove", update);
      document.removeEventListener("pointerup", finish);
      document.removeEventListener("pointercancel", finish);
      if (!moved) return;
      const selection = marquee.getBoundingClientRect();
      const next = new Set(additive ? state.selectedArrangementItems : []);
      document.querySelectorAll("[data-selectable-type][data-clip-id]").forEach((item) => {
        const bounds = item.getBoundingClientRect();
        if (bounds.left <= selection.right && bounds.right >= selection.left &&
          bounds.top <= selection.bottom && bounds.bottom >= selection.top) {
          next.add(arrangementSelectionKey(item.dataset.selectableType, item.dataset.clipId));
        }
      });
      state.selectedArrangementItems = next;
      state.arrangementSelectionFromMarquee = true;
      state.selectedPianoNoteIds.clear();
      state.selectedPianoNoteId = null;
      state.pianoSelectionFromMarquee = false;
      document.querySelectorAll(".piano-roll-note").forEach((item) => item.classList.remove("is-selected"));
      state.suppressArrangementClick = true;
      window.setTimeout(() => { state.suppressArrangementClick = false; }, 0);
      updateArrangementSelection();
    };
    document.addEventListener("pointermove", update);
    document.addEventListener("pointerup", finish);
    document.addEventListener("pointercancel", finish);
  }

  function setWorkspaceView(view, force = false) {
    if (view === state.view && !force && !state.workspaceHidden) return;
    if (state.isPlaying) stopPlayback();
    if (view !== "piano-roll") {
      state.selectedPianoNoteIds.clear();
      state.selectedPianoNoteId = null;
      state.pianoSelectionFromMarquee = false;
    }
    state.view = view;
    state.workspaceHidden = false;
    const showSequencer = view === "sequencer";
    const showPianoRoll = view === "piano-roll";
    $("#arrangement-view").hidden = false;
    document.body.classList.toggle("is-beat-grid-open", showSequencer);
    $("#sequencer-view").hidden = !showSequencer;
    $("#piano-roll-view").hidden = !showPianoRoll;
    $("#sequencer-tab").classList.toggle("is-selected", showSequencer);
    $("#sequencer-tab").setAttribute("aria-selected", String(showSequencer));
    $("#arrangement-tab").classList.toggle("is-selected", view === "arrangement");
    $("#arrangement-tab").setAttribute("aria-selected", String(view === "arrangement"));
    $("#piano-roll-tab").classList.toggle("is-selected", showPianoRoll);
    $("#piano-roll-tab").setAttribute("aria-selected", String(showPianoRoll));
    document.querySelectorAll(".workspace-open-button").forEach((button) => {
      button.classList.toggle("is-active", (button.id === "open-beat-grid-button" && showSequencer) || (button.id === "open-piano-roll-button" && showPianoRoll));
      button.setAttribute("aria-pressed", String((button.id === "open-beat-grid-button" && showSequencer) || (button.id === "open-piano-roll-button" && showPianoRoll)));
    });
    if (showSequencer) {
      renderTracks();
      renderPresets();
      renderPatternSelectors();
    }
    if (showPianoRoll) {
      renderMelOptions();
      renderPianoInstrumentOptions();
      renderPianoRoll();
    }
    renderArrangement();
    renderViewLayout();
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
        projectId: state.projectId,
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
        projectId: state.projectId,
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
      const projectRecords = records.filter((record) =>
        record.projectId === state.projectId || (!record.projectId && state.projectId === "default"));
      if (!projectRecords.length) return;
      initializeAudio();
      const sampleRecords = projectRecords.filter((record) => record.recordType === "drum-sample");
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
            const pattern = getPattern();
            if (pattern) {
              pattern.trackIds = [...getPatternTrackIds(pattern), track.id];
              pattern.cells[track.id] = Array.from({ length: STEP_COUNT }, (_, index) => record.cells?.[index] === true);
            }
          } else {
            track.sample = { name: record.fileName || record.trackName, buffer };
            ensureSequencerTrackAudio(track);
            if (track.kind === "sample") track.subtitle = "Imported drum sample";
          }
        } catch {
          showToast(`Could not restore ${record.fileName || record.trackName || "a drum sample"}.`);
        }
      }
      const sampleRecordIds = new Set(sampleRecords.map((record) => record.trackId));
      state.tracks.filter((track) => track.sourceId && !sampleRecordIds.has(track.id)).forEach((layer) => {
        const source = state.tracks.find((track) => track.id === layer.sourceId);
        layer.sample = source?.sample ? { ...source.sample } : null;
        ensureSequencerTrackAudio(layer);
      });

      const clipRecords = projectRecords.filter((record) => record.recordType !== "drum-sample");
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

  function triggerTrack(track, time, step, variant = track.variant, noteDuration = getStepDuration()) {
    const context = state.audioContext;
    const output = track.gainNode;
    if (track.sample) {
      const source = context.createBufferSource();
      source.buffer = track.sample.buffer;
      const envelope = context.createGain();
      envelope.gain.setValueAtTime(1, time);
      const duration = Math.max(0.005, Math.min(track.sample.buffer.duration, noteDuration));
      const fade = Math.min(0.01, duration * 0.1);
      envelope.gain.setValueAtTime(1, time + Math.max(0, duration - fade));
      envelope.gain.linearRampToValueAtTime(0.0001, time + duration);
      source.connect(envelope);
      envelope.connect(output);
      source.start(time, 0, duration);
      return;
    }
    const durationScale = noteDuration / getStepDuration();
    switch (track.kind) {
      case "kick": playKick(context, output, time, step, variant, durationScale); break;
      case "snare": playSnare(context, output, time, variant, durationScale); break;
      case "clap": playClap(context, output, time, variant, durationScale); break;
      case "hat": playHat(context, output, time, false, variant, durationScale); break;
      case "openhat": playHat(context, output, time, true, variant, durationScale); break;
      case "rim": playRim(context, output, time, variant, durationScale); break;
      case "drumkit": playDrumKitNote(track, time, 36, noteDuration, 0.8); break;
      case "instrument": playInstrumentVoice(track, time, 60, noteDuration, 0.8); break;
      default: break;
    }
  }

  function playPianoNote(track, time, midi, duration, velocity = 0.8) {
    if (!track) return;
    ensureSequencerTrackAudio(track);
    if (track.sample) {
      const context = state.audioContext;
      const source = context.createBufferSource();
      const envelope = context.createGain();
      const rate = Math.pow(2, (midi - 60) / 12);
      source.buffer = track.sample.buffer;
      source.playbackRate.setValueAtTime(rate, time);
      const bufferDuration = Math.min(source.buffer.duration, Math.max(0.01, duration) * rate);
      const outputDuration = bufferDuration / rate;
      const fade = Math.min(0.02, outputDuration * 0.12);
      envelope.gain.setValueAtTime(velocity, time);
      envelope.gain.setValueAtTime(velocity, time + Math.max(0, outputDuration - fade));
      envelope.gain.linearRampToValueAtTime(0.0001, time + outputDuration);
      source.connect(envelope);
      envelope.connect(track.gainNode);
      source.start(time, 0, bufferDuration);
      return;
    }
    if (track.kind === "instrument") {
      playInstrumentVoice(track, time, midi, duration, velocity);
      return;
    }
    if (track.kind === "drumkit") {
      playDrumKitNote(track, time, midi, duration, velocity);
      return;
    }
    triggerTrack(track, time, midi, track.variant, duration);
  }

  function playInstrumentVoice(track, time, midi, duration, velocity) {
    const context = state.audioContext;
    const patch = track.patch || {};
    const frequency = 440 * Math.pow(2, (midi - 69) / 12);
    const attack = Math.min(Number(patch.attack) || 0.005, Math.max(0.002, duration * 0.7));
    const decay = Math.min(Number(patch.decay) || 0.1, Math.max(0.005, duration - attack));
    const release = Math.max(0.04, Number(patch.release) || 0.1);
    const sustain = Math.max(0.04, Math.min(0.9, Number(patch.sustain) || 0.3));
    const gateEnd = time + Math.max(0.02, duration);
    const envelope = context.createGain();
    const filter = context.createBiquadFilter();
    const oscillator = context.createOscillator();
    const peak = velocity * 0.42;
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(Math.max(100, Number(patch.cutoff) || 5000), time);
    filter.Q.value = 0.7;
    oscillator.type = patch.wave || "triangle";
    oscillator.frequency.setValueAtTime(frequency, time);
    oscillator.detune.setValueAtTime(Number(patch.detune) || 0, time);
    envelope.gain.setValueAtTime(0.0001, time);
    envelope.gain.linearRampToValueAtTime(peak, time + attack);
    envelope.gain.linearRampToValueAtTime(peak * sustain, time + attack + decay);
    envelope.gain.setValueAtTime(peak * sustain, gateEnd);
    envelope.gain.linearRampToValueAtTime(0.0001, gateEnd + release);
    oscillator.connect(filter);
    filter.connect(envelope);
    envelope.connect(track.gainNode);
    oscillator.start(time);
    oscillator.stop(gateEnd + release + 0.02);
    if (patch.harmonic) {
      const overtone = context.createOscillator();
      const overtoneGain = context.createGain();
      overtone.type = patch.wave || "sine";
      overtone.frequency.setValueAtTime(frequency * patch.harmonic, time);
      overtone.detune.setValueAtTime(Number(patch.detune) || 0, time);
      overtoneGain.gain.setValueAtTime(Math.max(0, Math.min(0.6, Number(patch.harmonicLevel) || 0.15)), time);
      overtone.connect(overtoneGain);
      overtoneGain.connect(filter);
      overtone.start(time);
      overtone.stop(gateEnd + release + 0.02);
    }
  }

  function playDrumKitNote(track, time, midi, duration, velocity) {
    const kit = track.patch?.kit || "909";
    const kits = {
      "909": { kick: "classic", snare: "classic", altSnare: "tight", clap: "classic", hat: "bright", pedalHat: "soft", openhat: "classic", cymbal: "shimmer", ride: "classic", rim: "high" },
      "808": { kick: "deep", snare: "body", altSnare: "noise", clap: "room", hat: "soft", pedalHat: "soft", openhat: "dark", cymbal: "dark", ride: "shimmer", rim: "low" },
      industrial: { kick: "industrial", snare: "metal", altSnare: "body", clap: "layered", hat: "vinyl", pedalHat: "vinyl", openhat: "wash", cymbal: "wash", ride: "shimmer", rim: "wood" },
    };
    const sounds = kits[kit] || kits["909"];
    const scale = Math.max(0.25, Math.min(4, duration / getStepDuration()));
    const context = state.audioContext;
    const noteGain = state.audioContext.createGain();
    noteGain.gain.setValueAtTime(velocity, time);
    noteGain.connect(track.gainNode);
    if (midi === 35 || midi === 36) playKick(context, noteGain, time, midi, sounds.kick, scale);
    else if (midi === 37) playRim(context, noteGain, time, sounds.rim, scale * 0.7);
    else if (midi === 38) playSnare(context, noteGain, time, sounds.snare, scale);
    else if (midi === 39) playClap(context, noteGain, time, sounds.clap, scale);
    else if (midi === 40) playSnare(context, noteGain, time, sounds.altSnare, scale);
    else if ([41, 43, 45, 47, 48, 50, 60, 61, 62, 63, 64, 65, 66, 67, 68, 75, 76, 77].includes(midi)) {
      playDrumKitTom(noteGain, time, midi, velocity, scale, kit);
    }
    else if (midi === 42) playHat(context, noteGain, time, false, sounds.hat, scale);
    else if (midi === 44) playHat(context, noteGain, time, false, sounds.pedalHat, scale * 0.65);
    else if (midi === 46) playHat(context, noteGain, time, true, sounds.openhat, scale);
    else if ([49, 52, 55, 57, 82, 83].includes(midi)) playHat(context, noteGain, time, true, sounds.cymbal, scale * ([52, 82].includes(midi) ? 1.8 : 2.4));
    else if ([51, 59].includes(midi)) playHat(context, noteGain, time, true, sounds.ride, scale * 1.8);
    else if (midi === 53 || midi === 56) playDrumKitBell(noteGain, time, midi === 53 ? 1120 : 680, velocity, scale);
    else if (midi === 54) playNoise(context, noteGain, time, 0.15 * scale, 4200, 0.2);
    else if (midi === 58) playNoise(context, noteGain, time, 0.23 * scale, 1100, 0.26);
    else if ([69, 70, 73, 74, 78, 79].includes(midi)) {
      const percussion = {
        69: [0.12, 3200, 0.18], 70: [0.12, 5600, 0.18], 73: [0.14, 2800, 0.24],
        74: [0.34, 1800, 0.3], 78: [0.11, 1500, 0.2], 79: [0.28, 900, 0.3],
      }[midi];
      playNoise(context, noteGain, time, percussion[0] * scale, percussion[1], percussion[2]);
    }
    else if (midi === 71 || midi === 72) playDrumKitTone(noteGain, time, midi === 71 ? 1450 : 980, midi === 71 ? 0.12 : 0.3, velocity);
    else if (midi === 80 || midi === 81) playDrumKitBell(noteGain, time, midi === 80 ? 1680 : 2200, velocity, scale);
    else playRim(context, noteGain, time, sounds.rim, scale);
  }

  function playDrumKitTom(output, time, midi, velocity, scale, kit) {
    const context = state.audioContext;
    const pitches = {
      41: [175, 90], 43: [195, 100], 45: [220, 112], 47: [255, 130], 48: [290, 145], 50: [340, 170],
      60: [540, 300], 61: [320, 180], 62: [410, 260], 63: [360, 140], 64: [230, 90],
      65: [600, 300], 66: [420, 220], 67: [780, 420], 68: [560, 310], 75: [1800, 950],
      76: [1200, 650], 77: [720, 380],
    };
    const [startPitch, endPitch] = pitches[midi] || pitches[45];
    const baseDuration = { 75: 0.11, 76: 0.13, 77: 0.16 }[midi] || (kit === "industrial" ? 0.28 : 0.34);
    const duration = Math.min(0.75, baseDuration * scale);
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = kit === "industrial" ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(startPitch, time);
    oscillator.frequency.exponentialRampToValueAtTime(endPitch, time + duration * 0.72);
    envelope.gain.setValueAtTime(0.0001, time);
    envelope.gain.exponentialRampToValueAtTime(Math.max(0.0002, velocity * 0.72), time + 0.004);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    oscillator.connect(envelope);
    envelope.connect(output);
    oscillator.start(time);
    oscillator.stop(time + duration + 0.02);
  }

  function playDrumKitBell(output, time, frequency, velocity, scale) {
    const context = state.audioContext;
    const envelope = context.createGain();
    const duration = Math.min(0.55, 0.28 * scale);
    envelope.gain.setValueAtTime(0.0001, time);
    envelope.gain.exponentialRampToValueAtTime(Math.max(0.0002, velocity * 0.24), time + 0.003);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    [frequency, frequency * 1.48].forEach((partial, index) => {
      const oscillator = context.createOscillator();
      const partialGain = context.createGain();
      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(partial, time);
      partialGain.gain.value = index ? 0.42 : 1;
      oscillator.connect(partialGain);
      partialGain.connect(envelope);
      oscillator.start(time);
      oscillator.stop(time + duration + 0.02);
    });
    envelope.connect(output);
  }

  function playDrumKitTone(output, time, frequency, duration, velocity) {
    const context = state.audioContext;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, time);
    envelope.gain.setValueAtTime(0.0001, time);
    envelope.gain.exponentialRampToValueAtTime(Math.max(0.0002, velocity * 0.2), time + 0.004);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    oscillator.connect(envelope);
    envelope.connect(output);
    oscillator.start(time);
    oscillator.stop(time + duration + 0.02);
  }

  function playKick(context, output, time, step, variant, durationScale) {
    const osc = context.createOscillator();
    const envelope = context.createGain();
    const settings = {
      classic: [148, 43, 0.36],
      deep: [92, 31, 0.56],
      punch: [182, 58, 0.23],
      sub: [72, 24, 0.7],
      industrial: [120, 27, 0.4],
    }[variant] || [148, 43, 0.36];
    const duration = settings[2] * durationScale;
    const pitch = settings[0] * (step % 8 === 0 ? 1 : 0.88);
    osc.type = "sine";
    osc.frequency.setValueAtTime(pitch, time);
    osc.frequency.exponentialRampToValueAtTime(settings[1], time + duration * 0.38);
    envelope.gain.setValueAtTime(0.0001, time);
    envelope.gain.exponentialRampToValueAtTime(1, time + 0.004);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    osc.connect(envelope);
    envelope.connect(output);
    osc.start(time);
    osc.stop(time + duration + 0.02);
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

  function playSnare(context, output, time, variant, durationScale) {
    const settings = {
      classic: [0.17, 1500, 0.36, 185, 0.1],
      tight: [0.1, 2300, 0.32, 235, 0.075],
      noise: [0.23, 1000, 0.48, 145, 0.14],
      body: [0.2, 1250, 0.34, 125, 0.18],
      metal: [0.17, 4100, 0.4, 330, 0.085],
    }[variant] || [0.17, 1500, 0.36, 185, 0.1];
    playNoise(context, output, time, settings[0] * durationScale, settings[1], settings[2]);
    const body = context.createOscillator();
    const envelope = context.createGain();
    body.type = "triangle";
    body.frequency.setValueAtTime(settings[3], time);
    envelope.gain.setValueAtTime(0.2, time);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + settings[4] * durationScale);
    body.connect(envelope);
    envelope.connect(output);
    body.start(time);
    body.stop(time + settings[4] * durationScale + 0.02);
  }

  function playClap(context, output, time, variant, durationScale) {
    const settings = {
      classic: [[0, 0.018, 0.038], 0.17, 1100, 0.28],
      tight: [[0, 0.012], 0.1, 1500, 0.27],
      layered: [[0, 0.018, 0.038, 0.062], 0.22, 900, 0.34],
      room: [[0, 0.024, 0.052], 0.28, 720, 0.31],
    }[variant] || [[0, 0.018, 0.038], 0.17, 1100, 0.28];
    settings[0].forEach((offset, index) => {
      const last = index === settings[0].length - 1;
      playNoise(context, output, time + offset * durationScale, (last ? settings[1] : 0.045) * durationScale, settings[2], last ? settings[3] : 0.2);
    });
  }

  function playHat(context, output, time, open, variant, durationScale) {
    const settings = open
      ? ({ classic: [0.34, 6500, 0.2], shimmer: [0.48, 9000, 0.22], dark: [0.3, 3800, 0.25], wash: [0.7, 5200, 0.3] }[variant] || [0.34, 6500, 0.2])
      : ({ classic: [0.055, 6500, 0.16], soft: [0.07, 4300, 0.12], bright: [0.045, 10000, 0.2], vinyl: [0.09, 3200, 0.18] }[variant] || [0.055, 6500, 0.16]);
    playNoise(context, output, time, settings[0] * durationScale, settings[1], settings[2], 0.55);
  }

  function playRim(context, output, time, variant, durationScale) {
    const osc = context.createOscillator();
    const envelope = context.createGain();
    osc.type = "triangle";
    const pitch = { classic: [880, 420], low: [190, 110], high: [1450, 720], wood: [560, 250] }[variant] || [880, 420];
    osc.frequency.setValueAtTime(pitch[0], time);
    osc.frequency.exponentialRampToValueAtTime(pitch[1], time + 0.045 * durationScale);
    envelope.gain.setValueAtTime(0.32, time);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + 0.075 * durationScale);
    osc.connect(envelope);
    envelope.connect(output);
    osc.start(time);
    osc.stop(time + 0.09 * durationScale);
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
      const arrangementPlayback = state.view === "arrangement";
      const startBar = arrangementPlayback ? Math.min(state.arrangementCursor, state.arrangementBars - 1) : 0;
      state.playbackStartBar = startBar;
      state.playbackStartTime = state.audioContext.currentTime + 0.04;
      state.playbackEndTime = arrangementPlayback
        ? state.playbackStartTime + (state.arrangementBars - startBar) * (240 / state.bpm)
        : Infinity;
      state.stepIndex = 0;
      state.scheduledPianoNotes.clear();
      state.nextStepTime = state.playbackStartTime;
      updateTrackGains();
      if (arrangementPlayback) scheduleArrangementClips(state.playbackStartTime, startBar);
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
    const hasMelSolo = state.melTracks.some((track) => track.solo);
    const hasInstrumentSolo = state.tracks.some((track) => track.solo);
    state.melTracks.forEach((melTrack) => {
      const instrument = getPianoTrack(melTrack.instrumentId);
      if (!instrument || melTrack.muted || (hasMelSolo && !melTrack.solo) ||
        instrument.muted || (hasInstrumentSolo && !instrument.solo)) return;
      melTrack.clips.forEach((clip) => {
        const mel = getMel(clip.melId);
        if (!mel) return;
        const clipEndBar = clip.startBar + getMelLengthBars(mel);
        mel.notes.forEach((note) => {
          const key = `${melTrack.id}:${clip.id}:${note.id}`;
          if (state.scheduledPianoNotes.has(key)) return;
          const noteStartBar = clip.startBar + note.startTick / PIANO_TICKS_PER_BAR;
          const noteEndBar = Math.min(clipEndBar, noteStartBar + note.durationTicks / PIANO_TICKS_PER_BAR);
          if (noteEndBar <= startBar) return;
          const audibleStartBar = Math.max(startBar, noteStartBar);
          const when = startTime + (audibleStartBar - startBar) * secondsPerBar;
          const duration = Math.max(0, noteEndBar - audibleStartBar) * secondsPerBar;
          if (duration > 0) {
            playPianoNote(instrument, when, note.midi, duration, note.velocity || 0.8);
            state.scheduledPianoNotes.add(key);
          }
        });
      });
    });
  }

  function stopPlayback() {
    if (state.schedulerId !== null) window.clearInterval(state.schedulerId);
    state.schedulerId = null;
    const stoppedRecording = state.keyboardRecording;
    state.keyboardRecording = null;
    state.liveRecordedHits.clear();
    updateKeyboardRecordButtons();
    if (stoppedRecording?.mode === "sequencer") renderTracks();
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
      const previousBuffer = track.sample?.buffer;
      track.sample = { name: file.name, buffer };
      if (!track.sourceId) {
        state.tracks.filter((item) => item.sourceId === track.id && item.sample?.buffer === previousBuffer).forEach((layer) => {
          layer.sample = { ...track.sample };
          ensureSequencerTrackAudio(layer);
        });
      }
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

  function getProjectStorageKey(projectId) {
    return `${PROJECT_STORAGE_PREFIX}${projectId}`;
  }

  function writeProjectCatalog() {
    window.localStorage.setItem(PROJECTS_KEY, JSON.stringify({
      activeProjectId: state.projectId,
      projects: state.projects,
    }));
  }

  function updateProjectNameLabel() {
    $("#project-name").firstChild.textContent = `${state.projectName} `;
  }

  function initializeProjects() {
    try {
      const savedCatalog = JSON.parse(window.localStorage.getItem(PROJECTS_KEY) || "null");
      const projects = Array.isArray(savedCatalog?.projects)
        ? savedCatalog.projects.filter((project) => typeof project?.id === "string" && typeof project.name === "string")
        : [];
      if (projects.length) {
        state.projects = projects;
        state.projectId = projects.some((project) => project.id === savedCatalog.activeProjectId)
          ? savedCatalog.activeProjectId
          : projects[0].id;
      } else {
        const name = window.localStorage.getItem(`${STORAGE_KEY}-name`)?.trim() || "Untitled session";
        const project = { id: "default", name, updatedAt: Date.now() };
        const oldSnapshot = window.localStorage.getItem(STORAGE_KEY);
        if (oldSnapshot) window.localStorage.setItem(getProjectStorageKey(project.id), oldSnapshot);
        state.projects = [project];
        state.projectId = project.id;
        writeProjectCatalog();
      }
      const activeProject = state.projects.find((project) => project.id === state.projectId);
      state.projectName = activeProject?.name || "Untitled session";
      updateProjectNameLabel();
    } catch (error) {
      state.projects = [{ id: "default", name: "Untitled session", updatedAt: 0 }];
      state.projectId = "default";
      state.projectName = "Untitled session";
      updateProjectNameLabel();
      showToast(`Project storage is unavailable: ${error.message || "could not load projects"}`);
    }
  }

  function createStateSnapshot() {
    captureCurrentPattern();
    captureCurrentMel();
    return {
      bpm: state.bpm,
      swing: state.swing,
      steps: state.steps,
      selectedPreset: state.selectedPreset,
      selectedPatternId: state.selectedPatternId,
      patterns: state.patterns.map((pattern) => ({
        id: pattern.id,
        name: pattern.name,
        steps: pattern.steps,
        trackIds: [...getPatternTrackIds(pattern)],
        cells: Object.fromEntries(Object.entries(pattern.cells).map(([trackId, cells]) => [trackId, [...cells]])),
        variants: { ...pattern.variants },
        gridResolution: getPatternGridResolution(pattern),
        color: pattern.color,
      })),
      tracks: state.tracks.map((track) => ({
        id: track.id,
        sourceId: track.sourceId || null,
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
      mels: state.mels.map((mel) => ({
        id: mel.id,
        name: mel.name,
        instrumentId: mel.instrumentId,
        bars: mel.bars,
        notes: mel.notes.map((note) => ({ ...note })),
      })),
      selectedMelId: state.selectedMelId,
      melTracks: state.melTracks.map((track) => ({
        id: track.id,
        name: track.name,
        instrumentId: track.instrumentId,
        color: track.color,
        muted: track.muted,
        solo: track.solo,
        clips: track.clips.map((clip) => ({ ...clip })),
      })),
      patternClips: state.patternClips.map(({ id, patternId, startBar, repeatCount }) => ({ id, patternId, startBar, repeatCount: repeatCount || 1 })),
      pianoNotes: state.pianoNotes.map((note) => ({ ...note })),
      pianoStartBar: state.pianoStartBar,
      pianoBars: state.pianoBars,
      pianoSnap: state.pianoSnap,
      pianoNoteLength: state.pianoNoteLength,
      selectedPianoTrackId: state.selectedPianoTrackId,
      arrangementBars: state.arrangementBars,
      arrangementCursor: state.arrangementCursor,
      workspaceRatio: state.workspaceRatio,
      workspaceHidden: state.workspaceHidden,
      trackViewHidden: state.trackViewHidden,
      view: state.view,
    };
  }

  function persistStateSnapshot(snapshot, projectId = state.projectId) {
    try {
      window.localStorage.setItem(getProjectStorageKey(projectId), JSON.stringify(snapshot));
    } catch {
      $("#save-state").textContent = "Session-only changes";
      $(".save-dot").style.background = "#d3a34b";
      return false;
    }
    const project = state.projects.find((item) => item.id === projectId);
    if (project) {
      project.updatedAt = Date.now();
      try {
        writeProjectCatalog();
      } catch {
        showToast("Project saved, but its saved-project list could not be updated.");
      }
    }
    $("#save-state").textContent = "All changes saved";
    $(".save-dot").style.background = "#7f9d43";
    return true;
  }

  function flushSaveState() {
    window.clearTimeout(saveState.timeout);
    saveState.timeout = null;
    return persistStateSnapshot(createStateSnapshot(), state.projectId);
  }

  function saveState() {
    const saveDot = $(".save-dot");
    $("#save-state").textContent = "Saving…";
    saveDot.style.background = "#c8a95a";
    const snapshot = createStateSnapshot();
    const projectId = state.projectId;
    window.clearTimeout(saveState.timeout);
    saveState.timeout = window.setTimeout(() => {
      persistStateSnapshot(snapshot, projectId);
    }, 250);
  }

  function renderProjectList() {
    const list = $("#project-list");
    list.replaceChildren();
    state.projects.forEach((project) => {
      const button = document.createElement("button");
      button.className = `project-list-item${project.id === state.projectId ? " is-current" : ""}`;
      button.type = "button";
      button.disabled = project.id === state.projectId;
      const name = document.createElement("span");
      name.className = "project-list-name";
      name.textContent = project.name;
      const detail = document.createElement("span");
      detail.className = "project-list-detail";
      detail.textContent = project.id === state.projectId
        ? "CURRENT PROJECT"
        : project.updatedAt ? `SAVED ${new Date(project.updatedAt).toLocaleDateString()}` : "NOT SAVED YET";
      button.append(name, detail);
      button.addEventListener("click", () => switchProject(project.id));
      list.append(button);
    });
  }

  function switchProject(projectId) {
    if (projectId === state.projectId || !state.projects.some((project) => project.id === projectId)) return;
    if (state.mediaRecorder?.state === "recording") {
      showToast("Stop audio recording before switching projects.");
      return;
    }
    if (!flushSaveState()) {
      showToast("Could not save this project; switching was cancelled.");
      return;
    }
    if (state.isPlaying) stopPlayback();
    const previousProjectId = state.projectId;
    state.projectId = projectId;
    try {
      writeProjectCatalog();
      window.location.reload();
    } catch (error) {
      state.projectId = previousProjectId;
      showToast(`Could not switch projects: ${error.message || "storage is unavailable"}`);
    }
  }

  function createProject() {
    if (state.mediaRecorder?.state === "recording") {
      showToast("Stop audio recording before creating a project.");
      return;
    }
    if (!flushSaveState()) {
      showToast("Could not save this project; a new project was not created.");
      return;
    }
    const project = {
      id: makeId(),
      name: `New Project ${state.projects.length + 1}`,
      updatedAt: 0,
    };
    const previousProjectId = state.projectId;
    state.projects.unshift(project);
    state.projectId = project.id;
    try {
      writeProjectCatalog();
      window.location.reload();
    } catch (error) {
      state.projects = state.projects.filter((item) => item.id !== project.id);
      state.projectId = previousProjectId;
      showToast(`Could not create project: ${error.message || "storage is unavailable"}`);
    }
  }

  function renameProject() {
    const name = window.prompt("Rename project", state.projectName);
    const trimmed = name?.trim();
    if (!trimmed) return;
    const project = state.projects.find((item) => item.id === state.projectId);
    if (!project) return;
    const previousName = project.name;
    project.name = trimmed;
    state.projectName = trimmed;
    updateProjectNameLabel();
    try {
      writeProjectCatalog();
      renderProjectList();
    } catch (error) {
      project.name = previousName;
      state.projectName = previousName;
      updateProjectNameLabel();
      showToast(`Could not rename project: ${error.message || "storage is unavailable"}`);
    }
  }

  function saveProjectNow() {
    if (flushSaveState()) {
      renderProjectList();
      showToast(`${state.projectName} saved`);
    } else {
      showToast("Could not save this project.");
    }
  }

  function restoreState() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(getProjectStorageKey(state.projectId)) || "null");
      if (!saved || typeof saved !== "object") return;
      if (Number.isFinite(saved.bpm)) state.bpm = Math.max(60, Math.min(180, Math.round(saved.bpm)));
      if (Number.isFinite(saved.swing)) state.swing = Math.max(0, Math.min(45, Math.round(saved.swing)));
      if (saved.steps === 16 || saved.steps === 32) state.steps = saved.steps;
      if (Number.isFinite(saved.arrangementBars)) state.arrangementBars = Math.max(32, Math.min(MAX_ARRANGEMENT_BARS, Math.round(saved.arrangementBars)));
      if (Number.isFinite(saved.arrangementCursor)) state.arrangementCursor = Math.max(0, Math.min(MAX_ARRANGEMENT_BARS - 1, saved.arrangementCursor));
      if (Number.isFinite(saved.workspaceRatio)) state.workspaceRatio = Math.max(20, Math.min(80, Math.round(saved.workspaceRatio)));
      if (typeof saved.workspaceHidden === "boolean") state.workspaceHidden = saved.workspaceHidden;
      if (typeof saved.trackViewHidden === "boolean") state.trackViewHidden = saved.trackViewHidden;
      if (state.workspaceHidden && state.trackViewHidden) state.trackViewHidden = false;
      if (["sequencer", "arrangement", "piano-roll"].includes(saved.view)) state.view = saved.view;
      if (saved.selectedPreset === null) state.selectedPreset = null;
      else if (PRESETS.some((preset) => preset.id === saved.selectedPreset)) state.selectedPreset = saved.selectedPreset;
      if (Array.isArray(saved.tracks)) {
        saved.tracks.forEach((savedTrack) => {
          let track = state.tracks.find((item) => item.id === savedTrack.id);
          if (!track && typeof savedTrack.sourceId === "string") {
            const source = state.tracks.find((item) => item.id === savedTrack.sourceId);
            if (source) {
              track = makePatternInstrumentLayer(source, {
                id: savedTrack.id,
                name: savedTrack.name,
                cells: savedTrack.cells,
                volume: savedTrack.volume,
                muted: savedTrack.muted,
                solo: savedTrack.solo,
                variant: savedTrack.variant,
              });
              state.tracks.push(track);
            }
          }
          if (!track && !savedTrack.sourceId && savedTrack.kind === "sample" && typeof savedTrack.id === "string" && typeof savedTrack.name === "string") {
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
      if (Array.isArray(saved.patterns)) {
        const restoredPatterns = saved.patterns
          .filter((pattern) => typeof pattern?.id === "string" && typeof pattern.name === "string")
          .map((pattern, index) => {
            const cells = {};
            const variants = {};
            const gridResolution = getPatternGridResolution(pattern);
            const isLegacyGrid = !GRID_RESOLUTIONS.includes(pattern.gridResolution);
            const bars = pattern.steps === 32 ? 2 : 1;
            state.tracks.forEach((track) => {
              const storedCells = Array.from({ length: STEP_COUNT }, (_, cellIndex) => pattern.cells?.[track.id]?.[cellIndex] === true);
              cells[track.id] = isLegacyGrid
                ? remapGridCells(storedCells, bars, 16, GRID_STEPS_PER_BAR[gridResolution])
                : storedCells;
              const variant = pattern.variants?.[track.id];
              if (SOUND_VARIANTS[track.kind]?.some((sound) => sound.id === variant)) variants[track.id] = variant;
            });
            return {
              id: pattern.id,
              name: pattern.name,
              color: isPatternColor(pattern.color) ? pattern.color : getPatternColor(index),
              steps: pattern.steps === 32 ? 32 : 16,
              trackIds: Array.isArray(pattern.trackIds)
                ? [...new Set(pattern.trackIds.filter((trackId) => state.tracks.some((track) => track.id === trackId)))]
                : state.tracks.filter((track) => !track.libraryOnly).map((track) => track.id),
              cells,
              variants,
              gridResolution,
            };
          });
        state.patterns = restoredPatterns.length
          ? restoredPatterns
          : [makePatternSnapshot(state.patterns[0]?.id || makeId(), state.patterns[0]?.name || "Pattern 1", PATTERN_COLORS[0])];
      } else {
        const initialPattern = state.patterns[0];
        state.patterns = [makePatternSnapshot(initialPattern?.id || makeId(), initialPattern?.name || "Pattern 1", initialPattern?.color || PATTERN_COLORS[0])];
      }
      if (!state.patterns.length) state.patterns = [makePatternSnapshot(makeId(), "Pattern 1", PATTERN_COLORS[0])];
      state.selectedPatternId = state.patterns.some((pattern) => pattern.id === saved.selectedPatternId)
        ? saved.selectedPatternId
        : state.patterns[0].id;
      const activePattern = getPattern();
      if (activePattern) applyPattern(activePattern);
      if (Array.isArray(saved.patternClips)) {
        state.patternClips = saved.patternClips
          .filter((clip) => typeof clip?.id === "string" && Number.isFinite(clip.startBar))
          .map((clip) => {
            const patternId = state.patterns.some((pattern) => pattern.id === clip.patternId) ? clip.patternId : state.selectedPatternId;
            const pattern = getPattern(patternId);
            const requestedRepeats = Number.isInteger(clip.repeatCount) ? Math.max(1, clip.repeatCount) : 1;
            const repeatCount = pattern
              ? Math.min(requestedRepeats, Math.max(1, Math.floor(MAX_ARRANGEMENT_BARS / (pattern.steps / 16))))
              : 1;
            return {
              id: clip.id,
              patternId,
              repeatCount,
              startBar: Math.max(0, Math.min(maxPatternStartBar((pattern?.steps || 16) * repeatCount), Math.floor(clip.startBar))),
            };
          });
      }
      if (Number.isFinite(saved.pianoBars) && [1, 2, 4, 8].includes(saved.pianoBars)) state.pianoBars = saved.pianoBars;
      if (Number.isFinite(saved.pianoStartBar)) state.pianoStartBar = Math.max(0, Math.min(MAX_ARRANGEMENT_BARS - 1, Math.floor(saved.pianoStartBar)));
      if (Number.isInteger(saved.pianoSnap) && [1, 2, 4, 8].includes(saved.pianoSnap)) state.pianoSnap = saved.pianoSnap;
      if (Number.isInteger(saved.pianoNoteLength) && [1, 2, 4, 8].includes(saved.pianoNoteLength)) state.pianoNoteLength = saved.pianoNoteLength;
      if (typeof saved.selectedPianoTrackId === "string" && state.tracks.some((track) => track.id === saved.selectedPianoTrackId)) {
        state.selectedPianoTrackId = saved.selectedPianoTrackId;
      }
      if (Array.isArray(saved.pianoNotes)) {
        state.pianoNotes = saved.pianoNotes
          .filter((note) => note && typeof note.id === "string" && Number.isInteger(note.startTick) && Number.isInteger(note.durationTicks) &&
            Number.isInteger(note.midi) && state.tracks.some((track) => track.id === note.trackId))
          .slice(0, 4096)
          .map((note) => {
            const startTick = Math.max(0, Math.min(8 * PIANO_TICKS_PER_BAR - 1, note.startTick));
            return {
              id: note.id,
              trackId: note.trackId,
              midi: Math.max(PIANO_BOTTOM_MIDI, Math.min(PIANO_TOP_MIDI, note.midi)),
              startTick,
              durationTicks: Math.max(1, Math.min(8 * PIANO_TICKS_PER_BAR - startTick, note.durationTicks)),
              velocity: Number.isFinite(note.velocity) ? Math.max(0.1, Math.min(1, note.velocity)) : 0.8,
            };
          });
      }
      if (Array.isArray(saved.mels)) {
        state.mels = saved.mels
          .filter((mel) => typeof mel?.id === "string" && typeof mel.name === "string")
          .map((mel) => {
            const instrumentId = state.tracks.some((track) => track.id === mel.instrumentId)
              ? mel.instrumentId
              : state.tracks.find((track) => track.id === "piano-grand")?.id || state.tracks[0]?.id || "";
            const notes = Array.isArray(mel.notes) ? mel.notes
              .filter((note) => note && typeof note.id === "string" && Number.isInteger(note.startTick) &&
                Number.isInteger(note.durationTicks) && Number.isInteger(note.midi))
              .slice(0, 4096)
              .map((note) => {
                const startTick = Math.max(0, Math.min(8 * PIANO_TICKS_PER_BAR - 1, note.startTick));
                return {
                  id: note.id,
                  trackId: instrumentId,
                  midi: Math.max(PIANO_BOTTOM_MIDI, Math.min(PIANO_TOP_MIDI, note.midi)),
                  startTick,
                  durationTicks: Math.max(1, Math.min(8 * PIANO_TICKS_PER_BAR - startTick, note.durationTicks)),
                  velocity: Number.isFinite(note.velocity) ? Math.max(0.1, Math.min(1, note.velocity)) : 0.8,
                };
              })
              : [];
            return {
              id: mel.id,
              name: mel.name.trim() || "Mel",
              instrumentId,
              bars: [1, 2, 4, 8].includes(mel.bars) ? mel.bars : 4,
              notes,
            };
          });
      }
      if (Array.isArray(saved.melTracks)) {
        const fallbackInstrumentId = state.tracks.find((item) => item.id === "piano-grand")?.id || state.tracks[0]?.id || "";
        state.melTracks = saved.melTracks
          .filter((track) => typeof track?.id === "string" && typeof track.name === "string" && Array.isArray(track.clips))
          .map((track) => ({
            id: track.id,
            name: track.name,
            instrumentId: state.tracks.some((item) => item.id === track.instrumentId) ? track.instrumentId : fallbackInstrumentId,
            color: isPatternColor(track.color) ? track.color : "#b5a0ff",
            muted: track.muted === true,
            solo: track.solo === true,
            clips: track.clips
              .filter((clip) => typeof clip?.id === "string" && state.mels.some((mel) => mel.id === clip.melId) && Number.isFinite(clip.startBar))
              .map((clip) => {
                const mel = getMel(clip.melId);
                return {
                  id: clip.id,
                  melId: clip.melId,
                  startBar: Math.max(0, Math.min(MAX_ARRANGEMENT_BARS - (mel ? getMelLengthBars(mel) : 1), Math.floor(clip.startBar))),
                };
              }),
          }));
      }
      if (typeof saved.selectedMelId === "string") state.selectedMelId = saved.selectedMelId;
    } catch {
      try { window.localStorage.removeItem(getProjectStorageKey(state.projectId)); } catch { /* Storage may be disabled. */ }
    }
  }

  function exportPattern() {
    const activePattern = getPattern();
    const pattern = {
      app: "Pulsegrid",
      version: 1,
      exportedAt: new Date().toISOString(),
      tempo: state.bpm,
      swing: state.swing,
      bars: state.steps / 16,
      steps: getGridStepCount(activePattern),
      gridResolution: getPatternGridResolution(activePattern),
      pattern: activePattern?.name || "Pattern",
      tracks: state.tracks.filter((track) => getPatternTrackIds(activePattern).includes(track.id)).map((track) => ({
        name: track.name,
        sample: track.sample?.name || null,
        sound: track.variant || null,
        steps: track.cells.slice(0, getGridStepCount(activePattern)).map((active) => active ? 1 : 0),
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

      state.patternClips.forEach((clip) => {
        const pattern = getPattern(clip.patternId);
        if (!pattern) return;
        const patternTrackIds = new Set(getPatternTrackIds(pattern));
        const patternTracks = allTracks.filter((track) => patternTrackIds.has(track.id));
        const stepsPerBar = getStepsPerBar(pattern);
        const ticksPerGridStep = getGridTicksPerStep(pattern);
        const gridStepCount = getGridStepCount(pattern);
        const totalSteps = gridStepCount * (clip.repeatCount || 1);
        for (let step = 0; step < totalSteps; step += 1) {
          const patternStep = step % gridStepCount;
          const tick = patternStep * ticksPerGridStep;
          const time = clip.startBar * secondsPerBar + step * secondsPerBar / stepsPerBar +
            (Math.floor(tick / 2) % 2 === 1 ? getStepDuration() * (state.swing / 100) : 0);
          if (time >= duration) continue;
          patternTracks.forEach((track) => {
            if (pattern.cells[track.id]?.[patternStep] && !track.muted && (!hasSolo || track.solo)) {
              triggerTrack(track, time, patternStep, pattern.variants[track.id] || track.variant, getNoteDuration(pattern));
            }
          });
        }
      });
      const hasMelSolo = state.melTracks.some((track) => track.solo);
      state.melTracks.forEach((melTrack) => {
        const instrument = state.tracks.find((track) => track.id === melTrack.instrumentId);
        if (!instrument || melTrack.muted || (hasMelSolo && !melTrack.solo) ||
          instrument.muted || (hasSolo && !instrument.solo)) return;
        melTrack.clips.forEach((clip) => {
          const mel = getMel(clip.melId);
          if (!mel) return;
          const clipEnd = clip.startBar + getMelLengthBars(mel);
          mel.notes.forEach((note) => {
            const startBar = clip.startBar + note.startTick / PIANO_TICKS_PER_BAR;
            if (startBar >= duration / secondsPerBar || startBar >= clipEnd) return;
            const endBar = Math.min(clipEnd, startBar + note.durationTicks / PIANO_TICKS_PER_BAR);
            const startTime = startBar * secondsPerBar;
            const noteDuration = Math.min((endBar - startBar) * secondsPerBar, duration - startTime);
            if (noteDuration > 0) playPianoNote(instrument, startTime, note.midi, noteDuration, note.velocity || 0.8);
          });
        });
      });
      if (state.metronome) {
        for (let step = 0; step < Math.ceil(duration / stepDuration); step += 4) {
          const time = step * stepDuration;
          triggerClick(time, step % 16 === 0);
        }
      }

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
    const includedTrackIds = new Set(getPatternTrackIds(getPattern()));
    const activeTracks = state.tracks.filter((track) => includedTrackIds.has(track.id));
    const slotsPerBar = getStepsPerBar();
    const stepsPerBeat = Math.max(1, slotsPerBar / 4);
    const stepsPerEighth = Math.max(1, slotsPerBar / 8);
    state.tracks.forEach((track) => track.cells.fill(false));
    for (let step = 0; step < getGridStepCount(); step += 1) {
      const stepInBar = step % slotsPerBar;
      activeTracks.forEach((track) => {
        const sourceId = track.sourceId || track.id;
        if (sourceId === "kick" && stepInBar % stepsPerBeat === 0 && Math.random() > (stepInBar % (stepsPerBeat * 2) === 0 ? 0.08 : 0.27)) track.cells[step] = true;
        if (sourceId === "snare" && (stepInBar === stepsPerBeat || stepInBar === stepsPerBeat * 3) && Math.random() > 0.16) track.cells[step] = true;
        if (sourceId === "closed-hat" && stepInBar % stepsPerEighth === 0 && Math.random() > 0.28) track.cells[step] = true;
        if (sourceId === "open-hat" &&
          (stepInBar === Math.min(slotsPerBar - 1, Math.round(slotsPerBar * 0.375)) ||
            stepInBar === Math.min(slotsPerBar - 1, Math.round(slotsPerBar * 0.875))) &&
          Math.random() > 0.42) track.cells[step] = true;
        if (sourceId === "rim" && stepInBar % stepsPerBeat === stepsPerBeat - 1 && Math.random() > 0.48) track.cells[step] = true;
        if (sourceId === "clap" && stepInBar === stepsPerBeat && Math.random() > 0.6) track.cells[step] = true;
      });
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
      if (state.isPlaying && isSongWorkspace()) stopPlayback();
      state.bpm = Math.round(value);
      tempoValue.textContent = String(state.bpm);
      updateArrangementLength();
      if (isSongWorkspace()) renderArrangement();
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
    $("#piano-roll-tab").addEventListener("click", () => setWorkspaceView("piano-roll"));
    $("#hide-workspace-button").addEventListener("click", () => setViewVisibility(true, false));
    $("#show-workspace-button").addEventListener("click", () => setViewVisibility(false, false));
    $("#hide-track-view-button").addEventListener("click", () => setViewVisibility(false, true));
    $("#show-track-view-button").addEventListener("click", () => setViewVisibility(false, false));
    const viewResizer = $("#view-resizer");
    viewResizer.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      const main = $("#arrangement-main");
      const updateRatio = (moveEvent) => {
        const bounds = main.getBoundingClientRect();
        const available = bounds.height - viewResizer.offsetHeight;
        if (available <= 0) return;
        const pointerOffset = moveEvent.clientY - bounds.top - viewResizer.offsetHeight / 2;
        state.workspaceRatio = Math.max(20, Math.min(80, Math.round(pointerOffset / available * 100)));
        renderViewLayout();
      };
      const finish = () => {
        document.removeEventListener("pointermove", updateRatio);
        document.removeEventListener("pointerup", finish);
        document.removeEventListener("pointercancel", finish);
        saveState();
      };
      document.addEventListener("pointermove", updateRatio);
      document.addEventListener("pointerup", finish);
      document.addEventListener("pointercancel", finish);
    });
    viewResizer.addEventListener("keydown", (event) => {
      if (event.key === "ArrowUp") setWorkspaceRatio(state.workspaceRatio + 5);
      else if (event.key === "ArrowDown") setWorkspaceRatio(state.workspaceRatio - 5);
      else if (event.key === "Home") setWorkspaceRatio(20);
      else if (event.key === "End") setWorkspaceRatio(80);
      else return;
      event.preventDefault();
    });
    $("#open-beat-grid-button").addEventListener("click", () => setWorkspaceView(state.view === "sequencer" && !state.workspaceHidden ? "arrangement" : "sequencer"));
    $("#open-piano-roll-button").addEventListener("click", () => setWorkspaceView(state.view === "piano-roll" && !state.workspaceHidden ? "arrangement" : "piano-roll"));
    $("#step-keyboard-record-button").addEventListener("click", () => toggleKeyboardRecording("sequencer"));
    $("#piano-keyboard-record-button").addEventListener("click", () => toggleKeyboardRecording("piano-roll"));
    $("#mel-select").addEventListener("change", (event) => selectMel(event.target.value));
    $("#new-mel-button").addEventListener("click", createMel);
    $("#rename-mel-button").addEventListener("click", renameMel);
    $("#mel-drag-source").addEventListener("dragstart", (event) => {
      const mel = getMel();
      if (!mel || !event.dataTransfer) return;
      event.dataTransfer.setData("application/x-pulsegrid-mel-source", JSON.stringify({ melId: mel.id }));
      event.dataTransfer.effectAllowed = "copy";
    });
    $("#piano-instrument-select").addEventListener("change", (event) => {
      if (state.keyboardRecording?.mode === "piano-roll") stopPlayback();
      state.selectedPianoTrackId = event.target.value;
      state.pianoNotes = state.pianoNotes.map((note) => ({ ...note, trackId: state.selectedPianoTrackId }));
      state.selectedPianoNoteIds.clear();
      state.selectedPianoNoteId = null;
      state.pianoSelectionFromMarquee = false;
      renderPianoRoll();
      saveState();
    });
    $("#piano-snap-select").addEventListener("change", (event) => {
      state.pianoSnap = Number(event.target.value);
      saveState();
    });
    $("#piano-note-length-select").addEventListener("change", (event) => {
      state.pianoNoteLength = Number(event.target.value);
      saveState();
    });
    $("#piano-bars-select").addEventListener("change", (event) => {
      state.pianoBars = Number(event.target.value);
      renderPianoRoll();
      saveState();
    });
    $("#piano-roll-grid").addEventListener("click", (event) => {
      if (state.suppressPianoGridClick) {
        state.suppressPianoGridClick = false;
        return;
      }
      if (!event.target.closest(".piano-roll-note")) addPianoNoteFromPointer(event);
    });
    $("#piano-roll-grid").addEventListener("pointerdown", startPianoSelection);
    $("#clear-piano-roll-button").addEventListener("click", () => {
      state.pianoNotes = [];
      state.selectedPianoNoteId = null;
      state.selectedPianoNoteIds.clear();
      state.pianoSelectionFromMarquee = false;
      state.scheduledPianoNotes.clear();
      renderPianoRoll();
      updateArrangementLength();
      renderArrangement();
      saveState();
    });
    $("#timeline-scroll").addEventListener("scroll", (event) => {
      $("#arrangement-track-labels").scrollTop = event.currentTarget.scrollTop;
    });
    $("#timeline-content").addEventListener("pointerdown", startArrangementSelection);
    $("#timeline-content").addEventListener("click", (event) => {
      if (!state.suppressArrangementClick) return;
      state.suppressArrangementClick = false;
      event.preventDefault();
      event.stopPropagation();
    }, true);
    document.addEventListener("pointerdown", clearMarqueeSelectionOnOutsidePointer, true);
    $("#sequencer-pattern-select").addEventListener("change", (event) => selectPattern(event.target.value));
    $("#grid-resolution-select").addEventListener("change", (event) => {
      setPatternGridResolution(event.target.value);
    });
    $("#arrangement-pattern-select").addEventListener("change", (event) => selectPattern(event.target.value));
    $("#rename-pattern-sequencer-button").addEventListener("click", renamePattern);
    $("#rename-pattern-button").addEventListener("click", renamePattern);
    $("#pattern-drag-source").addEventListener("dragstart", (event) => {
      const pattern = getPattern();
      if (!pattern || !event.dataTransfer) return;
      event.dataTransfer.setData("application/x-pulsegrid-pattern-source", JSON.stringify({ patternId: pattern.id }));
      event.dataTransfer.effectAllowed = "copy";
    });
    $("#sequencer-browser-button").addEventListener("click", () => $("#source-browser-dialog").showModal());
    $("#arrangement-pattern-length").addEventListener("change", (event) => setLength(Number(event.target.value)));
    $("#new-pattern-button").addEventListener("click", createPattern);
    $("#new-pattern-sequencer-button").addEventListener("click", createPattern);
    $("#add-pattern-button").addEventListener("click", () => addPatternClip());
    [
      ["#sequencer-instrument-select", "#add-sequencer-instrument-button"],
      ["#pattern-instrument-select", "#add-pattern-instrument-button"],
    ].forEach(([selectSelector, buttonSelector]) => {
      $(buttonSelector).addEventListener("click", () => {
        const select = $(selectSelector);
        if (select.value) addPatternInstrument(select.value);
      });
    });
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
      if (!state.arrangementTracks.length && !state.patternClips.length && !state.melTracks.length) return;
      if (!window.confirm("Remove all clips from this arrangement?")) return;
      state.arrangementTracks.forEach((track) => track.clips.forEach((clip) => deletePersistedClip(clip.id)));
      state.arrangementTracks = [];
      state.patternClips = [];
      state.melTracks = [];
      state.scheduledPianoNotes.clear();
      state.arrangementBars = 32;
      state.arrangementCursor = 0;
      renderArrangement();
      saveState();
      showToast("Arrangement cleared");
    });
    $("#project-name").addEventListener("click", () => {
      renderProjectList();
      $("#project-dialog").showModal();
    });
    $("#project-dialog-close").addEventListener("click", () => $("#project-dialog").close());
    $("#save-project-button").addEventListener("click", saveProjectNow);
    $("#rename-project-button").addEventListener("click", renameProject);
    $("#new-project-button").addEventListener("click", createProject);
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
      state.steps = 16;
      state.patterns = [makePatternSnapshot(makeId(), "Pattern 1", PATTERN_COLORS[0])];
      state.selectedPatternId = state.patterns[0].id;
      renderPatternSelectors();
      state.patternClips = [];
      state.mels = [];
      state.selectedMelId = "";
      state.melTracks = [];
      state.pianoNotes = [];
      state.pianoStartBar = 0;
      state.pianoBars = 4;
      state.pianoSnap = 2;
      state.pianoNoteLength = 2;
      state.selectedPianoTrackId = "piano-grand";
      state.selectedPianoNoteId = null;
      state.selectedPianoNoteIds.clear();
      state.pianoSelectionFromMarquee = false;
      state.selectedArrangementItems.clear();
      state.arrangementSelectionFromMarquee = false;
      state.arrangementBars = 32;
      state.arrangementCursor = 0;
      state.workspaceRatio = 50;
      state.workspaceHidden = false;
      state.trackViewHidden = false;
      state.bpm = 124;
      state.swing = 0;
      state.selectedPreset = "warehouse";
      state.view = "arrangement";
      tempoValue.textContent = "124";
      swingSlider.value = "0";
      $("#swing-value").textContent = "0%";
      swingSlider.style.setProperty("--range-progress", "0%");
      ensureMels();
      renderMelOptions();
      setLength(16);
      loadPreset(PRESETS[0]);
      renderPianoInstrumentOptions();
      renderPianoRoll();
      setWorkspaceView("arrangement", true);
    });
    document.addEventListener("keydown", (event) => {
      const target = event.target;
      const isTyping = target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      const isButton = target instanceof HTMLElement && target.tagName === "BUTTON";
      const dialogOpen = $("#help-dialog").open || $("#project-dialog").open || $("#source-browser-dialog").open;
      if (!isTyping && !event.repeat && !event.ctrlKey && !event.metaKey && !event.altKey && !dialogOpen) {
        if (recordStepKeyboardHit(event) || recordPianoKeyboardNote(event)) return;
      }
      if (event.code === "Space" && !isTyping && !isButton && !dialogOpen) {
        event.preventDefault();
        state.isPlaying ? stopPlayback() : startPlayback();
      }
      if (!isTyping && !dialogOpen && (event.key === "Delete" || event.key === "Backspace")) {
        if (state.selectedArrangementItems.size) {
          event.preventDefault();
          deleteSelectedArrangementItems();
        } else if (state.selectedPianoNoteIds.size || state.selectedPianoNoteId) {
          event.preventDefault();
          deleteSelectedPianoNote();
        }
      }
      if (event.key === "Escape" && $("#help-dialog").open) $("#help-dialog").close();
    });
  }

  function initialize() {
    state.tracks = makeTracks();
    const initialPattern = makePatternSnapshot(makeId(), "Pattern 1");
    state.patterns = [initialPattern];
    state.selectedPatternId = initialPattern.id;
    initializeProjects();
    restoreState();
    ensureMels();
    tempoValue.textContent = String(state.bpm);
    swingSlider.value = String(state.swing);
    $("#swing-value").textContent = `${state.swing}%`;
    swingSlider.style.setProperty("--range-progress", `${state.swing / 45 * 100}%`);
    renderHeader();
    renderPresets();
    setLength(state.steps);
    renderTracks();
    renderArrangement();
    renderMelOptions();
    state.arrangementCursor = Math.min(state.arrangementCursor, state.arrangementBars - 1);
    setWorkspaceView(state.view, true);
    bindEvents();
  }

  initialize();
  restoreArrangement();
})();
