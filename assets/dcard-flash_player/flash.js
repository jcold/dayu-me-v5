// 存储已安装的容器，避免重复绑定事件
const installedContainers = new WeakSet();
// 存储播放器实例
const playerInstances = new WeakMap();

function createControlButtons(container, player) {
  // 创建控制按钮容器
  const controlsContainer = document.createElement("div");
  controlsContainer.className = "player-controls";

  // 暂停按钮
  const pauseButton = document.createElement("button");
  pauseButton.className = "control-button pause-button";
  pauseButton.setAttribute("aria-label", "暂停");
  pauseButton.innerHTML = `
    <svg class="control-icon pause-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
    </svg>
  `;

  // 全屏按钮
  const fullscreenButton = document.createElement("button");
  fullscreenButton.className = "control-button fullscreen-button";
  fullscreenButton.setAttribute("aria-label", "全屏");
  fullscreenButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M18.5 5.5H16a1.5 1.5 0 0 1 0-3h3A2.5 2.5 0 0 1 21.5 5v3a1.5 1.5 0 0 1-3 0zM8 5.5H5.5V8a1.5 1.5 0 1 1-3 0V5A2.5 2.5 0 0 1 5 2.5h3a1.5 1.5 0 1 1 0 3m0 13H5.5V16a1.5 1.5 0 0 0-3 0v3A2.5 2.5 0 0 0 5 21.5h3a1.5 1.5 0 0 0 0-3m8 0h2.5V16a1.5 1.5 0 0 1 3 0v3a2.5 2.5 0 0 1-2.5 2.5h-3a1.5 1.5 0 0 1 0-3"/></g></svg>
  `;

  // 关闭按钮
  const closeButton = document.createElement("button");
  closeButton.className = "control-button close-button";
  closeButton.setAttribute("aria-label", "关闭");
  closeButton.innerHTML = `
    <svg class="control-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
  `;

  controlsContainer.appendChild(pauseButton);
  controlsContainer.appendChild(fullscreenButton);
  controlsContainer.appendChild(closeButton);
  container.appendChild(controlsContainer);

  // 全屏按钮事件（调用 Ruffle 播放器的全屏）
  fullscreenButton.addEventListener("click", (e) => {
    e.stopPropagation();
    try {
      // 尝试调用播放器的全屏方法
      if (typeof player.enterFullscreen === "function") {
        player.enterFullscreen();
      } else if (typeof player.requestFullscreen === "function") {
        player.requestFullscreen();
      } else if (player.shadowRoot) {
        const rufflePlayer = player.shadowRoot.querySelector("ruffle-player");
        if (rufflePlayer) {
          if (typeof rufflePlayer.enterFullscreen === "function") {
            rufflePlayer.enterFullscreen();
          } else if (typeof rufflePlayer.requestFullscreen === "function") {
            rufflePlayer.requestFullscreen();
          } else if (rufflePlayer.requestFullscreen) {
            rufflePlayer.requestFullscreen();
          } else if (rufflePlayer.webkitRequestFullscreen) {
            rufflePlayer.webkitRequestFullscreen();
          } else if (rufflePlayer.mozRequestFullScreen) {
            rufflePlayer.mozRequestFullScreen();
          } else if (rufflePlayer.msRequestFullscreen) {
            rufflePlayer.msRequestFullscreen();
          }
        }
      }
    } catch (error) {
      console.warn("无法进入全屏:", error);
    }
  });

  // 暂停按钮事件（只执行暂停功能）
  pauseButton.addEventListener("click", (e) => {
    e.stopPropagation();
    try {
      // 只执行暂停操作
      if (typeof player.pause === "function") {
        player.pause().catch(() => {});
      } else if (player.shadowRoot) {
        const rufflePlayer = player.shadowRoot.querySelector("ruffle-player");
        if (rufflePlayer && typeof rufflePlayer.pause === "function") {
          rufflePlayer.pause().catch(() => {});
        }
      }
    } catch (error) {
      console.warn("无法控制播放器暂停:", error);
    }
  });

  // 关闭按钮事件
  closeButton.addEventListener("click", () => {
    // 移除播放器和控制按钮
    if (player && player.parentNode) {
      player.remove();
    }
    controlsContainer.remove();
    playerInstances.delete(container);

    // 恢复播放占位符
    const src = container.dataset.flashPlayer;
    if (src) {
      const playButton = document.createElement("button");
      playButton.className = "play-button";
      playButton.setAttribute("aria-label", "播放 Flash 内容");
      playButton.innerHTML = `
        <svg class="play-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      `;
      container.appendChild(playButton);
    }
  });
}

function setupFlashPlayer(src, container) {
  // 移除播放按钮
  const playButton = container.querySelector(".play-button");
  if (playButton) {
    playButton.remove();
  }

  window.RufflePlayer = window.RufflePlayer || {};
  const ruffle = window.RufflePlayer.newest();
  const player = ruffle.createPlayer();
  container.appendChild(player);

  // 保存播放器实例
  playerInstances.set(container, player);

  requestAnimationFrame(() => {
    player
      .load(src)
      .then(() => {
        // 播放器加载完成后添加控制按钮
        createControlButtons(container, player);
      })
      .catch(() => {
        // 即使加载失败也添加控制按钮（至少可以关闭）
        createControlButtons(container, player);
      });
  });
}

// 使用事件委托处理播放按钮点击
function handlePlayButtonClick(event) {
  const playButton = event.target.closest(".play-button");
  if (!playButton) {
    return;
  }

  const playerBox = playButton.closest("[data-flash-player]");
  if (!playerBox) {
    return;
  }

  const src = playerBox.dataset.flashPlayer;
  if (!src) {
    console.error("Flash player src not found");
    return;
  }

  setupFlashPlayer(src, playerBox);
}

document.addEventListener("dcard:install", (event) => {
  if (event.detail.dcardName !== "flash_player") {
    return;
  }

  const container = event.detail.container;

  // 只在第一次 install 时绑定事件委托
  if (!installedContainers.has(container)) {
    installedContainers.add(container);
    container.addEventListener("click", handlePlayButtonClick);
  }
});
