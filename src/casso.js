export function createCassoGame(cassoModal) {
  const cassoCanvas = cassoModal.querySelector("canvas");
  const cassoCtx = cassoCanvas.getContext("2d");
  const listeners = new AbortController();
  const { signal } = listeners;

  const CASSO_SIZE = 5;
  const CASSO_PALETTE = [
    { hex: "#FF5500", glow: "rgba(255, 85, 0, 0.55)" }, // Editorial Amber
    { hex: "#38BDF8", glow: "rgba(56, 189, 248, 0.55)" }, // Cyan Cobalt
    { hex: "#10B981", glow: "rgba(16, 185, 129, 0.55)" }, // Emerald Mint
    { hex: "#FACC15", glow: "rgba(250, 204, 21, 0.55)" }, // Ochre Gold
    { hex: "#F43F5E", glow: "rgba(244, 63, 94, 0.55)" }, // Coral Crimson
  ];

  let cassoAnimId = null;
  let cassoIsOpen = false;
  let cassoGrid = []; // 5x5 matrix of tile objects: { colorIdx, yOffset, scale }
  let cassoChain = []; // Array of { r, c }
  let cassoIsDragging = false;
  let cassoPointerPos = null;
  let cassoPopups = []; // Floating '+1' & glowing aura bursts
  let cassoScore = 0;
  let cassoTarget = 30;
  let cassoMoves = 15;
  let cassoStage = 1;
  let cassoStageWon = false;

  function createCassoTile(colorIdx, startOffsetY = 0) {
    return {
      colorIdx:
        colorIdx !== undefined
          ? colorIdx
          : Math.floor(Math.random() * CASSO_PALETTE.length),
      yOffset: startOffsetY,
      scale: 1,
    };
  }

  function initCassoBoard() {
    cassoGrid = [];
    for (let r = 0; r < CASSO_SIZE; r++) {
      const row = [];
      for (let c = 0; c < CASSO_SIZE; c++) {
        row.push(createCassoTile(undefined, -((CASSO_SIZE - r) * 56)));
      }
      cassoGrid.push(row);
    }
    cassoChain = [];
    cassoPopups = [];
    cassoIsDragging = false;
    cassoPointerPos = null;
    hideCassoOverlay();
    updateCassoHUD();
  }

  function resizeCassoCanvas() {
    if (!cassoCanvas) return;
    const rect = cassoCanvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    cassoCanvas.width = rect.width * dpr;
    cassoCanvas.height = rect.height * dpr;
    if (cassoCtx) {
      cassoCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  function openCassoGame() {
    const modal = cassoModal;
    if (!modal) return;
    cassoIsOpen = true;
    resizeCassoCanvas();
    if (cassoGrid.length === 0) {
      resetCassoGame();
    }
    if (!cassoAnimId) {
      loopCassoGame();
    }
  }

  function closeCassoGame() {
    const modal = cassoModal;
    if (!modal) return;
    cassoIsOpen = false;
    if (cassoAnimId) {
      cancelAnimationFrame(cassoAnimId);
      cassoAnimId = null;
    }
  }

  function resetCassoGame() {
    cassoStage = 1;
    cassoScore = 0;
    cassoTarget = 30;
    cassoMoves = 15;
    initCassoBoard();
  }

  function nextCassoStage() {
    if (cassoStageWon) {
      cassoStage += 1;
      cassoScore = 0;
      cassoTarget = 30 + (cassoStage - 1) * 15;
      cassoMoves = 15;
      initCassoBoard();
    } else {
      resetCassoGame();
    }
  }

  function updateCassoHUD() {
    const sEl = document.getElementById("cassoScore");
    const tEl = document.getElementById("cassoTarget");
    const mEl = document.getElementById("cassoMoves");
    if (sEl) sEl.textContent = cassoScore;
    if (tEl) tEl.textContent = cassoTarget;
    if (mEl) mEl.textContent = cassoMoves;
  }

  function showCassoToast(text) {
    const toast = document.getElementById("cassoToast");
    if (!toast) return;
    toast.textContent = text;
    toast.style.opacity = "1";
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.opacity = "0";
    }, 900);
  }

  function showCassoOverlay(won) {
    cassoStageWon = won;
    const overlay = document.getElementById("cassoOverlay");
    const badge = document.getElementById("cassoOverlayBadge");
    const title = document.getElementById("cassoOverlayTitle");
    const desc = document.getElementById("cassoOverlayDesc");
    const btn = document.getElementById("cassoOverlayBtn");
    if (!overlay) return;

    if (won) {
      badge.textContent = `STAGE 0${cassoStage} CLEARED`;
      title.textContent = "Target Reached!";
      desc.textContent = `You cleared ${cassoScore} squares. Advance to Stage 0${cassoStage + 1}?`;
      btn.textContent = `Play Stage 0${cassoStage + 1}`;
    } else {
      badge.textContent = "OUT OF MOVES";
      title.textContent = `${cassoScore} / ${cassoTarget} Cleared`;
      desc.textContent =
        "Chain longer groups of matching squares for higher efficiency.";
      btn.textContent = "Try Again";
    }

    overlay.classList.remove("hidden");
    overlay.classList.add("flex");
  }

  function hideCassoOverlay() {
    const overlay = document.getElementById("cassoOverlay");
    if (!overlay) return;
    overlay.classList.add("hidden");
    overlay.classList.remove("flex");
  }

  function getCassoMetrics() {
    const rect = cassoCanvas.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height);
    const pad = Math.max(22, size * 0.085);
    const gap = Math.max(10, size * 0.032);
    const cellSpan = (size - pad * 2 - gap * (CASSO_SIZE - 1)) / CASSO_SIZE;
    return { width: rect.width, height: rect.height, pad, gap, cellSpan };
  }

  function getCellCenter(r, c, m) {
    return {
      x: m.pad + c * (m.cellSpan + m.gap) + m.cellSpan / 2,
      y: m.pad + r * (m.cellSpan + m.gap) + m.cellSpan / 2,
    };
  }

  function getCellFromPointer(clientX, clientY) {
    if (!cassoCanvas) return null;
    const rect = cassoCanvas.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;
    const m = getCassoMetrics();

    for (let r = 0; r < CASSO_SIZE; r++) {
      for (let c = 0; c < CASSO_SIZE; c++) {
        const center = getCellCenter(r, c, m);
        const hitRadius = m.cellSpan * 0.62;
        if (
          Math.abs(px - center.x) <= hitRadius &&
          Math.abs(py - center.y) <= hitRadius
        ) {
          return { r, c, px, py };
        }
      }
    }
    return { r: -1, c: -1, px, py };
  }

  function handleCassoPointerDown(e) {
    if (!cassoIsOpen || cassoMoves <= 0) return;
    const pt = e.touches ? e.touches[0] : e;
    const hit = getCellFromPointer(pt.clientX, pt.clientY);
    if (hit && hit.r >= 0) {
      cassoIsDragging = true;
      cassoChain = [{ r: hit.r, c: hit.c }];
      cassoPointerPos = { x: hit.px, y: hit.py };
      cassoGrid[hit.r][hit.c].scale = 1.14;
    }
  }

  function handleCassoPointerMove(e) {
    if (!cassoIsDragging || !cassoIsOpen) return;
    if (e.cancelable) e.preventDefault();
    const pt = e.touches ? e.touches[0] : e;
    const hit = getCellFromPointer(pt.clientX, pt.clientY);
    if (!hit) return;

    cassoPointerPos = { x: hit.px, y: hit.py };
    if (hit.r < 0 || cassoChain.length === 0) return;

    const last = cassoChain[cassoChain.length - 1];
    if (last.r === hit.r && last.c === hit.c) return;

    // Backtrack if dragging back to previous tile in chain
    if (cassoChain.length >= 2) {
      const prev = cassoChain[cassoChain.length - 2];
      if (prev.r === hit.r && prev.c === hit.c) {
        const removed = cassoChain.pop();
        cassoGrid[removed.r][removed.c].scale = 1;
        return;
      }
    }

    // Must be orthogonally adjacent (horizontal or vertical) & matching color
    const dr = Math.abs(hit.r - last.r);
    const dc = Math.abs(hit.c - last.c);
    const isAdjacent = dr + dc === 1;
    const baseColor = cassoGrid[cassoChain[0].r][cassoChain[0].c].colorIdx;
    const hitColor = cassoGrid[hit.r][hit.c].colorIdx;
    const alreadyInChain = cassoChain.some(
      (item) => item.r === hit.r && item.c === hit.c,
    );

    if (isAdjacent && hitColor === baseColor && !alreadyInChain) {
      cassoChain.push({ r: hit.r, c: hit.c });
      cassoGrid[hit.r][hit.c].scale = 1.14;
    }
  }

  function handleCassoPointerUp() {
    if (!cassoIsDragging) return;
    cassoIsDragging = false;
    cassoPointerPos = null;

    // Reset hover scales
    cassoChain.forEach((pos) => {
      if (cassoGrid[pos.r] && cassoGrid[pos.r][pos.c]) {
        cassoGrid[pos.r][pos.c].scale = 1;
      }
    });

    if (cassoChain.length >= 2) {
      const m = getCassoMetrics();
      const clearedColor =
        CASSO_PALETTE[cassoGrid[cassoChain[0].r][cassoChain[0].c].colorIdx];
      const clearedCount = cassoChain.length;

      // Spawn glowing aura + '+1' floating popups for each cleared square
      cassoChain.forEach((pos, idx) => {
        const center = getCellCenter(pos.r, pos.c, m);
        cassoPopups.push({
          x: center.x,
          y: center.y,
          vy: -0.95 - idx * 0.08,
          alpha: 1,
          radius: m.cellSpan * 0.45,
          color: clearedColor.hex,
          glow: clearedColor.glow,
        });
        cassoGrid[pos.r][pos.c] = null;
      });

      // Apply gravity column by column and drop new tiles smoothly from top
      for (let c = 0; c < CASSO_SIZE; c++) {
        const surviving = [];
        for (let r = CASSO_SIZE - 1; r >= 0; r--) {
          if (cassoGrid[r][c] !== null) {
            surviving.push({ tile: cassoGrid[r][c], oldRow: r });
          }
        }
        const missingCount = CASSO_SIZE - surviving.length;
        for (let r = CASSO_SIZE - 1; r >= 0; r--) {
          const survIdx = CASSO_SIZE - 1 - r;
          if (survIdx < surviving.length) {
            const entry = surviving[survIdx];
            const dropDistance = (r - entry.oldRow) * (m.cellSpan + m.gap);
            entry.tile.yOffset -= dropDistance;
            cassoGrid[r][c] = entry.tile;
          } else {
            const spawnRank = missingCount - (survIdx - surviving.length);
            const startOffset = -spawnRank * (m.cellSpan + m.gap) - 18;
            cassoGrid[r][c] = createCassoTile(undefined, startOffset);
          }
        }
      }

      cassoScore += clearedCount;
      cassoMoves = Math.max(0, cassoMoves - 1);
      updateCassoHUD();

      if (clearedCount >= 4) {
        showCassoToast(`SUPER CHAIN +${clearedCount}!`);
      }

      if (cassoScore >= cassoTarget) {
        setTimeout(() => showCassoOverlay(true), 420);
      } else if (cassoMoves === 0) {
        setTimeout(() => showCassoOverlay(false), 420);
      }
    }

    cassoChain = [];
  }

  function loopCassoGame() {
    if (!cassoIsOpen || !cassoCanvas || !cassoCtx) return;

    const m = getCassoMetrics();
    cassoCtx.clearRect(0, 0, m.width, m.height);

    // Subtle architectural board container
    cassoCtx.fillStyle = "#111111";
    cassoCtx.beginPath();
    cassoCtx.roundRect(
      m.pad - 12,
      m.pad - 12,
      m.width - (m.pad - 12) * 2,
      m.height - (m.pad - 12) * 2,
      22,
    );
    cassoCtx.fill();
    cassoCtx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    cassoCtx.lineWidth = 1;
    cassoCtx.stroke();

    // Draw subtle empty slot recesses
    for (let r = 0; r < CASSO_SIZE; r++) {
      for (let c = 0; c < CASSO_SIZE; c++) {
        const center = getCellCenter(r, c, m);
        const s = m.cellSpan * 0.86;
        cassoCtx.fillStyle = "rgba(255, 255, 255, 0.025)";
        cassoCtx.beginPath();
        cassoCtx.roundRect(center.x - s / 2, center.y - s / 2, s, s, 12);
        cassoCtx.fill();
      }
    }

    // Draw active connection line behind tiles
    if (cassoChain.length > 0) {
      const chainColor =
        CASSO_PALETTE[cassoGrid[cassoChain[0].r][cassoChain[0].c].colorIdx];
      cassoCtx.save();
      cassoCtx.strokeStyle = chainColor.hex;
      cassoCtx.shadowColor = chainColor.glow;
      cassoCtx.shadowBlur = 16;
      cassoCtx.lineWidth = 7;
      cassoCtx.lineCap = "round";
      cassoCtx.lineJoin = "round";
      cassoCtx.beginPath();

      cassoChain.forEach((pos, idx) => {
        const center = getCellCenter(pos.r, pos.c, m);
        if (idx === 0) cassoCtx.moveTo(center.x, center.y);
        else cassoCtx.lineTo(center.x, center.y);
      });

      if (cassoIsDragging && cassoPointerPos) {
        cassoCtx.lineTo(cassoPointerPos.x, cassoPointerPos.y);
      }
      cassoCtx.stroke();
      cassoCtx.restore();
    }

    // Draw 5x5 Rounded Square Tiles with smooth gravity easing
    for (let r = 0; r < CASSO_SIZE; r++) {
      for (let c = 0; c < CASSO_SIZE; c++) {
        const tile = cassoGrid[r][c];
        if (!tile) continue;

        // Ease vertical drop smoothly to 0
        if (Math.abs(tile.yOffset) > 0.2) {
          tile.yOffset *= 0.76;
        } else {
          tile.yOffset = 0;
        }

        const center = getCellCenter(r, c, m);
        const pal = CASSO_PALETTE[tile.colorIdx];
        const isSelected = cassoChain.some(
          (item) => item.r === r && item.c === c,
        );
        const tileSize = m.cellSpan * 0.86 * tile.scale;

        cassoCtx.save();
        if (isSelected) {
          cassoCtx.shadowColor = pal.glow;
          cassoCtx.shadowBlur = 20;
        }
        cassoCtx.fillStyle = pal.hex;
        cassoCtx.beginPath();
        cassoCtx.roundRect(
          center.x - tileSize / 2,
          center.y + tile.yOffset - tileSize / 2,
          tileSize,
          tileSize,
          13,
        );
        cassoCtx.fill();

        // Crisp inner highlight bevel
        cassoCtx.strokeStyle = isSelected
          ? "rgba(255,255,255,0.85)"
          : "rgba(255,255,255,0.18)";
        cassoCtx.lineWidth = isSelected ? 2.2 : 1;
        cassoCtx.stroke();
        cassoCtx.restore();
      }
    }

    // Draw Glowing Aura Bursts & '+1' Floating Pop Animations
    for (let i = cassoPopups.length - 1; i >= 0; i--) {
      const p = cassoPopups[i];
      p.y += p.vy;
      p.radius += 1.4;
      p.alpha -= 0.026;

      if (p.alpha <= 0) {
        cassoPopups.splice(i, 1);
        continue;
      }

      cassoCtx.save();
      // Expanding Glowing Aura Ring
      cassoCtx.globalAlpha = p.alpha * 0.65;
      cassoCtx.strokeStyle = p.color;
      cassoCtx.shadowColor = p.glow;
      cassoCtx.shadowBlur = 18;
      cassoCtx.lineWidth = 3;
      cassoCtx.beginPath();
      cassoCtx.roundRect(
        p.x - p.radius / 2,
        p.y - p.radius / 2,
        p.radius,
        p.radius,
        14,
      );
      cassoCtx.stroke();

      // '+1' Floating Pop Label
      cassoCtx.globalAlpha = Math.min(1, p.alpha * 1.25);
      cassoCtx.fillStyle = "#FFFFFF";
      cassoCtx.font = '800 15px "Plus Jakarta Sans", sans-serif';
      cassoCtx.textAlign = "center";
      cassoCtx.textBaseline = "middle";
      cassoCtx.fillText("+1", p.x, p.y - 6);
      cassoCtx.restore();
    }

    cassoAnimId = requestAnimationFrame(loopCassoGame);
  }

  cassoCanvas.addEventListener("mousedown", handleCassoPointerDown, { signal });
  window.addEventListener("mousemove", handleCassoPointerMove, { signal });
  window.addEventListener("mouseup", handleCassoPointerUp, { signal });
  cassoCanvas.addEventListener("touchstart", handleCassoPointerDown, {
    passive: false,
    signal,
  });
  cassoCanvas.addEventListener("touchmove", handleCassoPointerMove, {
    passive: false,
    signal,
  });
  window.addEventListener("touchend", handleCassoPointerUp, { signal });
  window.addEventListener("touchcancel", handleCassoPointerUp, { signal });
  window.addEventListener(
    "resize",
    () => {
      if (cassoIsOpen) resizeCassoCanvas();
    },
    { signal },
  );

  return {
    open: openCassoGame,
    close: closeCassoGame,
    reset: resetCassoGame,
    next: nextCassoStage,
    dispose() {
      closeCassoGame();
      listeners.abort();
    },
  };
}
