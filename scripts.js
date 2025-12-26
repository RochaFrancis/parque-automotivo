// ========== SISTEMA DE COCKPIT ==========
let isStarted = false;
let rpm = 0;
let speed = 0;
let turnSignalState = false;
let blinkInterval = null;

const needleRpm = document.getElementById('needleRpm');
const needleSpeed = document.getElementById('needleSpeed');
const speedTxt = document.getElementById('speed');
const gearTxt = document.getElementById('gear');
const dash = document.getElementById('dash');

const oilLight = document.getElementById('oil');
const batteryLight = document.getElementById('battery');
const tempLight = document.getElementById('temp');
const brakeLight = document.getElementById('brake');
const absLight = document.getElementById('abs');
const headlightLight = document.getElementById('headlight');
const turnLeftLight = document.getElementById('turnLeft');
const turnRightLight = document.getElementById('turnRight');

const hudCheck = document.getElementById('hudCheck');
const hudHighBeam = document.getElementById('hudHighBeam');
const hudABS = document.getElementById('hudABS');
const hudESP = document.getElementById('hudESP');

const audioStart = document.getElementById('audioStart');
const audioIdle = document.getElementById('audioIdle');
const audioRev = document.getElementById('audioRev');

const startPortal = document.getElementById('startPortal');

// URLs de áudio para o sistema de cockpit
audioStart.src = 'https://cdn.freesound.org/previews/651/651534_2396512-hq.mp3';
audioIdle.src = 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_26c2a95505.mp3?filename=idling-car-6038.mp3';
audioRev.src = 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3?filename=car-start-6037.mp3'; // Fallback to start sound for now or find better rev sound

// ========== SISTEMA DE SOM AUTOMOTIVO ==========
// Elementos do sistema de som
const speakerLeft = document.getElementById('speakerLeft');
const speakerRight = document.getElementById('speakerRight');
const vibrationLeft = document.getElementById('vibrationLeft');
const vibrationRight = document.getElementById('vibrationRight');
const waveCanvas = document.getElementById('waveCanvas');
const frequencyValue = document.getElementById('frequencyValue');
const activeFrequency = document.getElementById('activeFrequency');

// Elementos de status
const statusPower = document.getElementById('status-power');
const statusSignal = document.getElementById('status-signal');
const statusClip = document.getElementById('status-clip');

// Sliders
const volumeSlider = document.getElementById('volumeSlider');
const volumeFill = document.getElementById('volumeFill');
const volumeHandle = document.getElementById('volumeHandle');
const volumeValue = document.getElementById('volumeValue');

const bassSlider = document.getElementById('bassSlider');
const bassFill = document.getElementById('bassFill');
const bassHandle = document.getElementById('bassHandle');
const bassValue = document.getElementById('bassValue');

const trebleSlider = document.getElementById('trebleSlider');
const trebleFill = document.getElementById('trebleFill');
const trebleHandle = document.getElementById('trebleHandle');
const trebleValue = document.getElementById('trebleValue');

const reverbSlider = document.getElementById('reverbSlider');
const reverbFill = document.getElementById('reverbFill');
const reverbHandle = document.getElementById('reverbHandle');
const reverbValue = document.getElementById('reverbValue');

const fadeSlider = document.getElementById('fadeSlider');
const fadeFill = document.getElementById('fadeFill');
const fadeHandle = document.getElementById('fadeHandle');
const fadeValue = document.getElementById('fadeValue');

// Botões
const btnSystemOn = document.getElementById('btn-system-on');
const btnSystemOff = document.getElementById('btn-system-off');
const btnEqFlat = document.getElementById('btn-eq-flat');
const btnEqBass = document.getElementById('btn-eq-bass');
const btnEqVocal = document.getElementById('btn-eq-vocal');
const btnEqReset = document.getElementById('btn-eq-reset');
const btnModeNormal = document.getElementById('btn-mode-normal');
const btnModeParty = document.getElementById('btn-mode-party');
const btnModeConcert = document.getElementById('btn-mode-concert');
const btnDemo = document.getElementById('btn-demo');

// Presets
const presetRock = document.getElementById('preset-rock');
const presetElectro = document.getElementById('preset-electro');
const presetJazz = document.getElementById('preset-jazz');
const presetHiphop = document.getElementById('preset-hiphop');

// Medidores
const powerValue = document.getElementById('powerValue');
const currentValue = document.getElementById('currentValue');
const tempValue = document.getElementById('tempValue');
const impedanceValue = document.getElementById('impedanceValue');

// Áudios do sistema de som
const soundSystemDemo = document.getElementById('soundSystemDemo');
const soundBassTest = document.getElementById('soundBassTest');
const soundButton = document.getElementById('soundButton');
const soundPowerOn = document.getElementById('soundPowerOn');
const soundPowerOff = document.getElementById('soundPowerOff');

// URLs de áudio para o sistema de som
soundSystemDemo.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
soundBassTest.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3';
soundButton.src = 'https://www.soundjay.com/buttons/sounds/button-16.mp3';
soundPowerOn.src = 'https://www.soundjay.com/buttons/sounds/button-3.mp3';
soundPowerOff.src = 'https://www.soundjay.com/buttons/sounds/button-4.mp3';

// Configuração inicial dos áudios
audioStart.volume = 0.7;
audioIdle.volume = 0;
audioRev.volume = 0;
soundSystemDemo.volume = 0;
soundBassTest.volume = 0;
soundButton.volume = 0.3;
soundPowerOn.volume = 0.5;
soundPowerOff.volume = 0.5;

// Variáveis do sistema de som
let soundSystemActive = true;
let demoModeActive = false;
let currentVolume = 0.75;
let currentBass = 0.60;
let currentTreble = 0.45;
let currentReverb = 0.30;
let currentFade = 0.50;
let clipping = false;
let currentFrequency = 85;

// Variáveis para visualização de onda
let waveCanvasCtx;
let waveAnimationFrame;
let wavePhase = 0;

// Barras do equalizador
const eqFrequencies = [31, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
let eqLevels = [0.5, 0.6, 0.7, 0.8, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4];

// ========== FUNÇÕES DO COCKPIT ==========
function fadeIn(audio, target = 1, duration = 500) {
  audio.volume = 0;
  let v = 0;
  const step = target / (duration / 30);
  let fade = setInterval(() => {
    v += step;
    if (v >= target) {
      v = target;
      clearInterval(fade);
    }
    audio.volume = v;
  }, 30);
}

function fadeOut(audio, duration = 500) {
  let v = audio.volume;
  const step = v / (duration / 30);
  let fade = setInterval(() => {
    v -= step;
    if (v <= 0) {
      v = 0;
      audio.pause();
      audio.currentTime = 0;
      clearInterval(fade);
    }
    audio.volume = v;
  }, 30);
}

function ignite() {
  if (isStarted) return;
  isStarted = true;

  dash.classList.add("vibrating");
  document.getElementById('btnStart').classList.add('active');

  oilLight.classList.add('on');
  batteryLight.classList.add('on');
  tempLight.classList.add('on');
  absLight.classList.add('on');
  brakeLight.classList.add('on');
  headlightLight.classList.add('on');

  hudCheck.classList.add('on');
  hudESP.classList.add('on');

  startBlinkCheck();

  rpm = 900;
  updateRpmNeedle(rpm);
  updateSpeedNeedle(0);
  speedTxt.innerText = 0;
  gearTxt.innerText = "N";

  audioStart.currentTime = 0;
  audioStart.play();

  audioStart.onended = () => {
    audioIdle.currentTime = 0;
    audioIdle.play();
    fadeIn(audioIdle, 0.6);

    audioRev.currentTime = 0;
    audioRev.play();
    audioRev.volume = 0;

    startPortal.classList.add('visible');
  };
}

function shutdown() {
  if (!isStarted) return;
  isStarted = false;

  dash.classList.remove("vibrating");
  document.getElementById('btnStart').classList.remove('active');

  fadeOut(audioIdle);
  fadeOut(audioRev);
  audioStart.pause();
  audioStart.currentTime = 0;

  oilLight.classList.remove('on');
  batteryLight.classList.remove('on');
  tempLight.classList.remove('on');
  absLight.classList.remove('on');
  brakeLight.classList.remove('on');
  headlightLight.classList.remove('on');
  turnLeftLight.classList.remove('on');
  turnRightLight.classList.remove('on');

  hudCheck.classList.remove('on');
  hudHighBeam.classList.remove('on');
  hudABS.classList.remove('on');
  hudESP.classList.remove('on');

  if (blinkInterval) {
    clearInterval(blinkInterval);
    blinkInterval = null;
  }

  rpm = 0;
  speed = 0;
  updateRpmNeedle(rpm);
  updateSpeedNeedle(speed);
  speedTxt.innerText = 0;
  gearTxt.innerText = "N";

  startPortal.classList.remove('visible');
}

function startBlinkCheck() {
  if (blinkInterval) clearInterval(blinkInterval);
  let count = 0;
  blinkInterval = setInterval(() => {
    turnSignalState = !turnSignalState;
    if (turnSignalState) {
      turnLeftLight.classList.add('on');
      turnRightLight.classList.add('on');
      absLight.classList.add('on');
      hudABS.classList.add('on');
    } else {
      turnLeftLight.classList.remove('on');
      turnRightLight.classList.remove('on');
      absLight.classList.remove('on');
      hudABS.classList.remove('on');
    }
    count++;
    if (count > 8) {
      clearInterval(blinkInterval);
      blinkInterval = null;
      turnLeftLight.classList.remove('on');
      turnRightLight.classList.remove('on');
    }
  }, 250);
}

function toggleHighBeam() {
  const btn = document.getElementById('btnHighBeam');
  const active = btn.classList.toggle('active');
  if (active) {
    headlightLight.classList.add('on');
    hudHighBeam.classList.add('on');
  } else {
    headlightLight.classList.remove('on');
    hudHighBeam.classList.remove('on');
  }
}

function updateRpmNeedle(rpmValue) {
  let ratio = Math.min(rpmValue / 8000, 1);
  let angle = (ratio * 240) - 120;
  needleRpm.style.transform = `rotate(${angle}deg)`;
}

function updateSpeedNeedle(speedValue) {
  let ratio = Math.min(speedValue / 160, 1);
  let angle = (ratio * 240) - 120;
  needleSpeed.style.transform = `rotate(${angle}deg)`;
}

function accelerate(e) {
  if (!isStarted) return;

  let raw = e.clientX / window.innerWidth;
  raw = Math.max(0, Math.min(raw, 1));

  rpm = 900 + raw * 6100;
  updateRpmNeedle(rpm);

  speed = Math.floor(raw * 320);
  speedTxt.innerText = speed;

  let displaySpeed = Math.min(speed, 160);
  updateSpeedNeedle(displaySpeed);

  let idleVol = 0.6 * (1 - raw);
  let revVol = 0.8 * raw;

  audioIdle.volume = idleVol;
  audioRev.volume = revVol;

  if (speed === 0) gearTxt.innerText = "N";
  else if (speed < 40) gearTxt.innerText = "1";
  else if (speed < 80) gearTxt.innerText = "2";
  else if (speed < 130) gearTxt.innerText = "3";
  else if (speed < 200) gearTxt.innerText = "4";
  else gearTxt.innerText = "5";

  if (rpm > 6500) {
    speedTxt.style.color = "var(--neon-red)";
  } else {
    speedTxt.style.color = "white";
  }

  if (raw < 0.2 && speed > 40) {
    absLight.classList.add('on');
    hudABS.classList.add('on');
    brakeLight.classList.add('on');
    setTimeout(() => {
      absLight.classList.remove('on');
      hudABS.classList.remove('on');
      brakeLight.classList.remove('on');
    }, 300);
  }
}

function entrarSistemaSom() {
  document.getElementById('sound-system').scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });
}

document.addEventListener("mousemove", accelerate);

// ========== FUNÇÕES DO SISTEMA DE SOM ==========
function initSoundSystem() {
  // Inicializar canvas para visualização de onda
  waveCanvasCtx = waveCanvas.getContext('2d');
  waveCanvas.width = waveCanvas.offsetWidth;
  waveCanvas.height = waveCanvas.offsetHeight;
  
  // Inicializar equalizador gráfico
  initEqualizerGraphic();
  
  // Inicializar sliders
  initSliders();
  
  // Inicializar eventos dos botões
  initButtons();
  
  // Iniciar animação da onda
  startWaveAnimation();
  
  // Atualizar medidores
  updateMeters();
  
  // Iniciar áudio demo em volume zero
  soundSystemDemo.currentTime = 0;
  soundSystemDemo.play().catch(e => console.log('Áudio demo pronto'));
  
  console.log('Sistema de som inicializado!');
}

function initEqualizerGraphic() {
  const eqContainer = document.getElementById('equalizerGraphic');
  eqContainer.innerHTML = '';
  
  eqFrequencies.forEach((freq, index) => {
    const eqBar = document.createElement('div');
    eqBar.className = 'eq-bar';
    
    const barContainer = document.createElement('div');
    barContainer.className = 'eq-bar-container';
    barContainer.id = `eq-bar-${index}`;
    
    const barFill = document.createElement('div');
    barFill.className = 'eq-bar-fill';
    barFill.id = `eq-fill-${index}`;
    barFill.style.height = `${eqLevels[index] * 100}%`;
    
    const freqLabel = document.createElement('div');
    freqLabel.className = 'eq-frequency';
    freqLabel.textContent = freq < 1000 ? `${freq}Hz` : `${freq/1000}K`;
    
    barContainer.appendChild(barFill);
    eqBar.appendChild(barContainer);
    eqBar.appendChild(freqLabel);
    eqContainer.appendChild(eqBar);
    
    // Evento de clique para ajustar a barra
    barContainer.addEventListener('click', (e) => {
      const rect = barContainer.getBoundingClientRect();
      const y = rect.bottom - e.clientY;
      const level = Math.max(0, Math.min(y / rect.height, 1));
      
      eqLevels[index] = level;
      barFill.style.height = `${level * 100}%`;
      
      updateSoundSystem();
      playButtonSound();
    });
  });
}

function initSliders() {
  // Configurar sliders com valores iniciais
  updateSlider(volumeSlider, volumeFill, volumeHandle, currentVolume);
  updateSlider(bassSlider, bassFill, bassHandle, currentBass);
  updateSlider(trebleSlider, trebleFill, trebleHandle, currentTreble);
  updateSlider(reverbSlider, reverbFill, reverbHandle, currentReverb);
  updateSlider(fadeSlider, fadeFill, fadeHandle, currentFade);
  
  // Adicionar eventos aos sliders
  setupSlider(volumeSlider, volumeFill, volumeHandle, volumeValue, (value) => {
    currentVolume = value;
    volumeValue.textContent = `${Math.round(value * 100)}%`;
    updateSoundSystem();
  });
  
  setupSlider(bassSlider, bassFill, bassHandle, bassValue, (value) => {
    currentBass = value;
    bassValue.textContent = `${Math.round(value * 100)}%`;
    updateSoundSystem();
  });
  
  setupSlider(trebleSlider, trebleFill, trebleHandle, trebleValue, (value) => {
    currentTreble = value;
    trebleValue.textContent = `${Math.round(value * 100)}%`;
    updateSoundSystem();
  });
  
  setupSlider(reverbSlider, reverbFill, reverbHandle, reverbValue, (value) => {
    currentReverb = value;
    reverbValue.textContent = `${Math.round(value * 100)}%`;
    updateSoundSystem();
  });
  
  setupSlider(fadeSlider, fadeFill, fadeHandle, fadeValue, (value) => {
    currentFade = value;
    fadeValue.textContent = `${Math.round(value * 100)}%`;
    updateSoundSystem();
  });
}

function setupSlider(slider, fill, handle, valueElement, callback) {
  let isDragging = false;
  
  const updateSliderPos = (clientX) => {
    const rect = slider.getBoundingClientRect();
    let x = clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    
    const value = x / rect.width;
    updateSlider(slider, fill, handle, value);
    callback(value);
  };
  
  const startDrag = (e) => {
    isDragging = true;
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    updateSliderPos(e.clientX);
    playButtonSound();
  };
  
  const drag = (e) => {
    if (!isDragging) return;
    updateSliderPos(e.clientX);
  };
  
  const stopDrag = () => {
    isDragging = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
  };
  
  handle.addEventListener('mousedown', startDrag);
  slider.addEventListener('mousedown', (e) => {
    updateSliderPos(e.clientX);
    playButtonSound();
  });
}

function updateSlider(slider, fill, handle, value) {
  fill.style.width = `${value * 100}%`;
  handle.style.left = `${value * 100}%`;
}

function initButtons() {
  // Botão Ligar Sistema
  btnSystemOn.addEventListener('click', () => {
    if (!soundSystemActive) {
      soundSystemActive = true;
      btnSystemOn.classList.add('active');
      btnSystemOff.classList.remove('active');
      statusPower.classList.add('active');
      soundPowerOn.currentTime = 0;
      soundPowerOn.play();
      updateSoundSystem();
    }
    playButtonSound();
  });
  
  // Botão Desligar Sistema
  btnSystemOff.addEventListener('click', () => {
    if (soundSystemActive) {
      soundSystemActive = false;
      btnSystemOn.classList.remove('active');
      btnSystemOff.classList.add('active');
      statusPower.classList.remove('active');
      statusClip.classList.remove('active');
      soundPowerOff.currentTime = 0;
      soundPowerOff.play();
      
      // Parar demo se estiver ativa
      if (demoModeActive) {
        stopDemoMode();
      }
      
      updateSoundSystem();
    }
    playButtonSound();
  });
  
  // Botões do Equalizador
  btnEqFlat.addEventListener('click', () => {
    setEQFlat();
    playButtonSound();
  });
  
  btnEqBass.addEventListener('click', () => {
    setEQBassBoost();
    playButtonSound();
  });
  
  btnEqVocal.addEventListener('click', () => {
    setEQVocal();
    playButtonSound();
  });
  
  btnEqReset.addEventListener('click', () => {
    resetSoundSystem();
    playButtonSound();
  });
  
  // Botões de Modo
  btnModeNormal.addEventListener('click', () => {
    setSoundMode('normal');
    playButtonSound();
  });
  
  btnModeParty.addEventListener('click', () => {
    setSoundMode('party');
    playButtonSound();
  });
  
  btnModeConcert.addEventListener('click', () => {
    setSoundMode('concert');
    playButtonSound();
  });
  
  // Botão Demo
  btnDemo.addEventListener('click', () => {
    toggleDemoMode();
    playButtonSound();
  });
  
  // Presets
  presetRock.addEventListener('click', () => {
    setPreset('rock');
    playButtonSound();
  });
  
  presetElectro.addEventListener('click', () => {
    setPreset('electro');
    playButtonSound();
  });
  
  presetJazz.addEventListener('click', () => {
    setPreset('jazz');
    playButtonSound();
  });
  
  presetHiphop.addEventListener('click', () => {
    setPreset('hiphop');
    playButtonSound();
  });
}

function setEQFlat() {
  eqLevels = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
  updateEQBars();
  updateSoundSystem();
}

function setEQBassBoost() {
  eqLevels = [0.9, 0.8, 0.7, 0.6, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
  updateEQBars();
  updateSoundSystem();
}

function setEQVocal() {
  eqLevels = [0.4, 0.5, 0.6, 0.8, 0.9, 0.9, 0.8, 0.7, 0.6, 0.5];
  updateEQBars();
  updateSoundSystem();
}

function updateEQBars() {
  eqLevels.forEach((level, index) => {
    const barFill = document.getElementById(`eq-fill-${index}`);
    if (barFill) {
      barFill.style.height = `${level * 100}%`;
    }
  });
}

function setSoundMode(mode) {
  // Remover classe active de todos os botões de modo
  [btnModeNormal, btnModeParty, btnModeConcert].forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Adicionar classe active ao botão correspondente
  switch(mode) {
    case 'normal':
      btnModeNormal.classList.add('active');
      currentBass = 0.5;
      currentTreble = 0.5;
      currentReverb = 0.2;
      break;
    case 'party':
      btnModeParty.classList.add('active');
      currentBass = 0.8;
      currentTreble = 0.6;
      currentReverb = 0.4;
      break;
    case 'concert':
      btnModeConcert.classList.add('active');
      currentBass = 0.7;
      currentTreble = 0.7;
      currentReverb = 0.6;
      break;
  }
  
  // Atualizar sliders
  updateSlider(bassSlider, bassFill, bassHandle, currentBass);
  updateSlider(trebleSlider, trebleFill, trebleHandle, currentTreble);
  updateSlider(reverbSlider, reverbFill, reverbHandle, currentReverb);
  
  bassValue.textContent = `${Math.round(currentBass * 100)}%`;
  trebleValue.textContent = `${Math.round(currentTreble * 100)}%`;
  reverbValue.textContent = `${Math.round(currentReverb * 100)}%`;
  
  updateSoundSystem();
}

function setPreset(preset) {
  // Remover classe active de todos os presets
  [presetRock, presetElectro, presetJazz, presetHiphop].forEach(preset => {
    preset.classList.remove('active');
  });
  
  // Adicionar classe active ao preset correspondente
  switch(preset) {
    case 'rock':
      presetRock.classList.add('active');
      eqLevels = [0.6, 0.7, 0.8, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3];
      currentBass = 0.6;
      currentTreble = 0.7;
      break;
    case 'electro':
      presetElectro.classList.add('active');
      eqLevels = [0.9, 0.8, 0.7, 0.6, 0.5, 0.6, 0.7, 0.8, 0.7, 0.6];
      currentBass = 0.8;
      currentTreble = 0.6;
      break;
    case 'jazz':
      presetJazz.classList.add('active');
      eqLevels = [0.4, 0.5, 0.7, 0.8, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4];
      currentBass = 0.4;
      currentTreble = 0.5;
      break;
    case 'hiphop':
      presetHiphop.classList.add('active');
      eqLevels = [0.9, 0.8, 0.6, 0.5, 0.6, 0.7, 0.8, 0.7, 0.6, 0.5];
      currentBass = 0.9;
      currentTreble = 0.5;
      break;
  }
  
  // Atualizar visualizações
  updateEQBars();
  updateSlider(bassSlider, bassFill, bassHandle, currentBass);
  updateSlider(trebleSlider, trebleFill, trebleHandle, currentTreble);
  
  bassValue.textContent = `${Math.round(currentBass * 100)}%`;
  trebleValue.textContent = `${Math.round(currentTreble * 100)}%`;
  
  updateSoundSystem();
}

function toggleDemoMode() {
  if (demoModeActive) {
    stopDemoMode();
  } else {
    startDemoMode();
  }
}

function startDemoMode() {
  if (!soundSystemActive) return;
  
  demoModeActive = true;
  btnDemo.classList.add('active');
  btnDemo.innerHTML = '<span>PARAR DEMO</span>';
  
  // Configurar áudio demo
  soundSystemDemo.currentTime = 0;
  soundSystemDemo.volume = currentVolume * 0.8;
  soundSystemDemo.play();
  
  // Iniciar animação de demonstração
  startDemoAnimation();
}

function stopDemoMode() {
  demoModeActive = false;
  btnDemo.classList.remove('active');
  btnDemo.innerHTML = '<span>DEMO</span>';
  
  // Parar áudio demo
  soundSystemDemo.pause();
  soundSystemDemo.currentTime = 0;
  
  // Restaurar animação normal
  startWaveAnimation();
}

function startDemoAnimation() {
  if (waveAnimationFrame) {
    cancelAnimationFrame(waveAnimationFrame);
  }
  
  let demoPhase = 0;
  
  function animateDemo() {
    if (!demoModeActive) return;
    
    const canvas = waveCanvas;
    const ctx = waveCanvasCtx;
    const width = canvas.width;
    const height = canvas.height;
    
    // Limpar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Atualizar fase
    demoPhase += 0.05;
    if (demoPhase > Math.PI * 2) demoPhase = 0;
    
    // Desenhar múltiplas ondas para efeito de demonstração
    for (let i = 0; i < 3; i++) {
      const amplitude = (height / 2) * 0.7 * (1 - i * 0.2);
      const frequency = 0.02 * (i + 1);
      const phase = demoPhase * (i + 1);
      const color = i === 0 ? 'rgba(0, 242, 255, 0.8)' : 
                    i === 1 ? 'rgba(255, 0, 255, 0.6)' : 
                    'rgba(255, 119, 0, 0.4)';
      
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      
      for (let x = 0; x < width; x++) {
        const y = height / 2 + amplitude * Math.sin(x * frequency + phase);
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
    }
    
    waveAnimationFrame = requestAnimationFrame(animateDemo);
  }
  
  animateDemo();
}

function startWaveAnimation() {
  if (waveAnimationFrame) {
    cancelAnimationFrame(waveAnimationFrame);
  }
  
  function animateWave() {
    if (!soundSystemActive) return;
    
    const canvas = waveCanvas;
    const ctx = waveCanvasCtx;
    const width = canvas.width;
    const height = canvas.height;
    
    // Limpar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Calcular amplitude baseada nos controles
    const baseAmplitude = (height / 2) * 0.6;
    const amplitude = baseAmplitude * currentVolume;
    const frequency = 0.03 + (currentBass * 0.04) - (currentTreble * 0.02);
    
    // Atualizar fase
    wavePhase += 0.02 + (currentVolume * 0.03);
    if (wavePhase > Math.PI * 2) wavePhase = 0;
    
    // Desenhar onda
    ctx.beginPath();
    ctx.strokeStyle = clipping ? 'rgba(255, 0, 60, 0.8)' : 'rgba(0, 242, 255, 0.8)';
    ctx.lineWidth = clipping ? 5 : 3;
    ctx.lineJoin = 'round';
    
    for (let x = 0; x < width; x++) {
      // Adicionar variação baseada no equalizador
      const eqIndex = Math.floor((x / width) * eqLevels.length);
      const eqBoost = eqLevels[eqIndex] * 0.5;
      
      const y = height / 2 + 
               amplitude * 
               Math.sin(x * frequency + wavePhase) * 
               (0.8 + eqBoost) * 
               (1 + Math.sin(x * 0.01 + wavePhase) * 0.2);
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    
    // Desenhar pontos de amostra
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let i = 0; i < 5; i++) {
      const x = (width / 4) * (i + 1);
      const y = height / 2 + amplitude * Math.sin(x * frequency + wavePhase);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    waveAnimationFrame = requestAnimationFrame(animateWave);
  }
  
  animateWave();
}

function updateSoundSystem() {
  if (!soundSystemActive) {
    // Sistema desligado
    vibrationLeft.style.animation = 'none';
    vibrationRight.style.animation = 'none';
    statusSignal.classList.remove('active');
    statusClip.classList.remove('active');
    clipping = false;
    
    // Parar animação de onda
    if (waveAnimationFrame) {
      cancelAnimationFrame(waveAnimationFrame);
      waveCanvasCtx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
    }
    
    // Atualizar áudio demo
    soundSystemDemo.volume = 0;
    
    return;
  }
  
  // Sistema ligado
  statusSignal.classList.add('active');
  
  // Calcular clipping
  const totalLevel = currentVolume + currentBass + Math.max(...eqLevels);
  clipping = totalLevel > 2.5;
  
  if (clipping) {
    statusClip.classList.add('active');
    statusClip.style.animation = 'pulse-glow 0.5s infinite';
  } else {
    statusClip.classList.remove('active');
    statusClip.style.animation = 'none';
  }
  
  // Atualizar vibração dos auto-falantes
  const vibrationIntensity = currentVolume * 0.8 + currentBass * 0.5;
  const vibrationSpeed = 0.3 + vibrationIntensity * 0.7;
  
  vibrationLeft.style.animation = `pulse ${vibrationSpeed}s infinite`;
  vibrationRight.style.animation = `pulse ${vibrationSpeed}s infinite`;
  
  // Atualizar frequência ativa
  const bassFrequency = 20 + (currentBass * 100);
  const trebleFrequency = 5000 + (currentTreble * 10000);
  currentFrequency = Math.floor(bassFrequency + (trebleFrequency - bassFrequency) * currentFade);
  
  frequencyValue.textContent = currentFrequency;
  activeFrequency.textContent = `${currentFrequency} Hz`;
  
  // Atualizar áudio demo
  if (demoModeActive) {
    soundSystemDemo.volume = currentVolume * 0.8;
    
    // Aplicar efeitos de equalização ao áudio demo
    const bassBoost = 1 + (currentBass * 0.5);
    const trebleBoost = 1 + (currentTreble * 0.3);
    const reverbAmount = currentReverb * 0.5;
    
    // Nota: Em um sistema real, usaríamos Web Audio API para aplicar esses efeitos
    // Por simplicidade, apenas ajustamos o volume
    soundSystemDemo.volume = currentVolume * (1 + reverbAmount * 0.2);
  }
  
  // Atualizar medidores
  updateMeters();
}

function updateMeters() {
  if (!soundSystemActive) {
    powerValue.textContent = '0';
    currentValue.textContent = '0.0';
    tempValue.textContent = '25';
    impedanceValue.textContent = '4.0';
    return;
  }
  
  // Calcular valores baseados nos controles
  const power = Math.round(850 * currentVolume * (1 + currentBass * 0.5));
  const current = (42.5 * currentVolume * (1 + currentBass * 0.3)).toFixed(1);
  const temp = 25 + (currentVolume * 20) + (clipping ? 10 : 0);
  const impedance = (4.0 - (currentVolume * 1.0) - (currentBass * 0.5)).toFixed(1);
  
  powerValue.textContent = power;
  currentValue.textContent = current;
  tempValue.textContent = Math.round(temp);
  impedanceValue.textContent = impedance;
}

function resetSoundSystem() {
  // Resetar valores
  currentVolume = 0.75;
  currentBass = 0.60;
  currentTreble = 0.45;
  currentReverb = 0.30;
  currentFade = 0.50;
  
  // Resetar equalizador
  eqLevels = [0.5, 0.6, 0.7, 0.8, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4];
  
  // Resetar modos
  setSoundMode('normal');
  setPreset('electro');
  
  // Atualizar visualizações
  updateSlider(volumeSlider, volumeFill, volumeHandle, currentVolume);
  updateSlider(bassSlider, bassFill, bassHandle, currentBass);
  updateSlider(trebleSlider, trebleFill, trebleHandle, currentTreble);
  updateSlider(reverbSlider, reverbFill, reverbHandle, currentReverb);
  updateSlider(fadeSlider, fadeFill, fadeHandle, currentFade);
  
  volumeValue.textContent = `${Math.round(currentVolume * 100)}%`;
  bassValue.textContent = `${Math.round(currentBass * 100)}%`;
  trebleValue.textContent = `${Math.round(currentTreble * 100)}%`;
  reverbValue.textContent = `${Math.round(currentReverb * 100)}%`;
  fadeValue.textContent = `${Math.round(currentFade * 100)}%`;
  
  updateEQBars();
  updateSoundSystem();
}

function playButtonSound() {
  soundButton.currentTime = 0;
  soundButton.play();
}

// ========== INICIALIZAÇÃO ==========
window.addEventListener('DOMContentLoaded', () => {
  // Inicializar sistema de som
  initSoundSystem();
  
  // Garantir que o canvas seja redimensionado corretamente
  window.addEventListener('resize', () => {
    waveCanvas.width = waveCanvas.offsetWidth;
    waveCanvas.height = waveCanvas.offsetHeight;
  });
  
  console.log('Sistema inicializado com sucesso!');
});

// Liberar áudio no primeiro clique do usuário
document.addEventListener('click', function initAudio() {
  // Tentar tocar um som silencioso para liberar o áudio
  const silentAudio = new Audio();
  silentAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ';
  silentAudio.volume = 0.001;
  silentAudio.play().then(() => {
    console.log('Áudio liberado!');
  }).catch(console.error);
  
  document.removeEventListener('click', initAudio);
}, { once: true });


// ========== RADIO TUNER ==========
const radioFreqDisplay = document.getElementById('radioFreq');
const radioStationName = document.getElementById('stationName');
const radioTrackInfo = document.getElementById('trackInfo');
const tunerSlider = document.getElementById('tunerSlider');
const btnSeekUp = document.getElementById('btnSeekUp');
const btnSeekDown = document.getElementById('btnSeekDown');
const radioPwrBtn = document.getElementById('radioPwr');
const radioVolSlider = document.getElementById('radioVol');
const presetBtns = document.querySelectorAll('.preset-btn');
const stereoIndicator = document.getElementById('stereoIndicator');

let radioAudio = new Audio();
let isRadioOn = false;
let radioStations = [];
let tuningTimeout;

// Initialize Radio
async function initRadio() {
  try {
    const response = await fetch('https://de1.api.radio-browser.info/json/stations/search?limit=40&countrycode=BR&hidebroken=true&order=clickcount&reverse=true');
    const data = await response.json();
    
    // Assign random frequencies to stations
    // Sort by frequency to make tuning realistic
    radioStations = data.map(station => {
      return {
        ...station,
        freq: (Math.random() * (108 - 87.5) + 87.5).toFixed(1)
      };
    }).sort((a, b) => parseFloat(a.freq) - parseFloat(b.freq));
    
    console.log('Radio stations loaded:', radioStations.length);
  } catch (error) {
    console.error('Error loading radio stations:', error);
    if(radioStationName) radioStationName.textContent = "Erro de Conexão";
  }
}

initRadio();

// Power Button
if(radioPwrBtn) {
  radioPwrBtn.addEventListener('click', () => {
    isRadioOn = !isRadioOn;
    radioPwrBtn.classList.toggle('active', isRadioOn);
    
    if (isRadioOn) {
      const freq = (tunerSlider.value / 10).toFixed(1);
      radioFreqDisplay.textContent = freq;
      tuneToFrequency(freq);
    } else {
      radioAudio.pause();
      radioFreqDisplay.textContent = "OFF";
      radioStationName.textContent = "Parque Automotivo Radio";
      radioTrackInfo.textContent = "Sintonize para ouvir";
      stereoIndicator.classList.remove('active');
    }
  });
}

// Tuner Slider
if(tunerSlider) {
  tunerSlider.addEventListener('input', () => {
    if (!isRadioOn) return;
    const freq = (tunerSlider.value / 10).toFixed(1);
    radioFreqDisplay.textContent = freq;
    
    // Debounce tuning to avoid rapid switching
    clearTimeout(tuningTimeout);
    tuningTimeout = setTimeout(() => tuneToFrequency(freq), 300);
  });
}

function tuneToFrequency(freq) {
  if (!isRadioOn) return;
  
  // Find station within 0.3 MHz
  const station = radioStations.find(s => Math.abs(parseFloat(s.freq) - parseFloat(freq)) < 0.3);
  
  if (station) {
    playStation(station);
  } else {
    stopRadio();
    radioStationName.textContent = "Chiado..."; // Static noise
    radioTrackInfo.textContent = "";
    stereoIndicator.classList.remove('active');
  }
}

function playStation(station) {
  if (radioAudio.src !== station.url_resolved) {
    radioAudio.src = station.url_resolved;
    radioAudio.play().catch(e => console.log("Playback error:", e));
  }
  radioStationName.textContent = station.name;
  radioTrackInfo.textContent = station.tags || "Sem informações";
  stereoIndicator.classList.add('active');
}

function stopRadio() {
  radioAudio.pause();
  radioAudio.src = "";
}

// Seek Buttons
if(btnSeekUp) {
  btnSeekUp.addEventListener('click', () => {
    if (!isRadioOn) return;
    const currentFreq = parseFloat(tunerSlider.value) / 10;
    const nextStation = radioStations.find(s => parseFloat(s.freq) > currentFreq + 0.2);
    
    if (nextStation) {
      setFrequency(nextStation.freq);
    } else {
      // Wrap around
      if (radioStations.length > 0) setFrequency(radioStations[0].freq);
    }
  });
}

if(btnSeekDown) {
  btnSeekDown.addEventListener('click', () => {
    if (!isRadioOn) return;
    const currentFreq = parseFloat(tunerSlider.value) / 10;
    // Find last station with freq < current
    // Since array is sorted, we can reverse find
    const prevStation = [...radioStations].reverse().find(s => parseFloat(s.freq) < currentFreq - 0.2);
    
    if (prevStation) {
      setFrequency(prevStation.freq);
    } else {
      // Wrap around to end
      if (radioStations.length > 0) setFrequency(radioStations[radioStations.length - 1].freq);
    }
  });
}

function setFrequency(freq) {
  tunerSlider.value = freq * 10;
  radioFreqDisplay.textContent = freq;
  tuneToFrequency(freq);
}

// Volume
if(radioVolSlider) {
  radioVolSlider.addEventListener('input', (e) => {
    radioAudio.volume = e.target.value / 100;
  });
}

// Presets
presetBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (!isRadioOn) return;
    
    const slot = parseInt(btn.dataset.slot);
    // Distribute presets evenly across the list
    const stationIndex = Math.floor((slot - 1) * (radioStations.length / 6));
    
    if (radioStations[stationIndex]) {
      setFrequency(radioStations[stationIndex].freq);
      
      // Visual feedback
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
  });
});
