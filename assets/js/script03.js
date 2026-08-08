// 1. Inicializar iconos de Lucide
lucide.createIcons();

// 2. Generar estrellas dinámicas en el fondo (Tonos Góticos / Rojizos)
const starsContainer = document.getElementById('stars-container');
const starColors = ['#2b0000', '#4a0000', '#660000', '#800000', '#990000', '#1a1a1a']; 

for(let i = 0; i < 150; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    
    const size = Math.random() * 2.5 + 1;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    
    star.style.left = Math.random() * 100 + 'vw';
    star.style.top = Math.random() * 100 + 'vh';
    
    const color = starColors[Math.floor(Math.random() * starColors.length)];
    star.style.backgroundColor = color;
    star.style.boxShadow = `0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color}`;
    
    star.style.setProperty('--duration', (Math.random() * 3 + 1.5) + 's');
    star.style.animationDelay = (Math.random() * 5) + 's';
    
    starsContainer.appendChild(star);
}

// 3. Lógica de Intro Screen y Botón Minimizar
const introVideo = document.getElementById('intro-video');
const introContent = document.getElementById('intro-content');
let introShown = false;

// Función para mostrar los elementos del intro
function showIntroContent() {
    if(!introShown) {
        introShown = true;
        introContent.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
        introContent.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
    }
}

// Mostrar título y botón exactamente al segundo 3
introVideo.addEventListener('timeupdate', () => {
    if(introVideo.currentTime >= 3) {
        showIntroContent();
    }
});

// Fallback
setTimeout(showIntroContent, 3000);

// Función al hacer click en "Enter"
function enterSite() {
    const introScreen = document.getElementById('intro-screen');
    introScreen.classList.add('intro-hidden');
    
    setTimeout(() => introVideo.pause(), 1000);

    /*checkOnlineStatus();
    if(!window.statusInterval) {
        window.statusInterval = setInterval(checkOnlineStatus, 60000);
    }*/
    
    // Autoplay the first song
    if(audioPlayer.paused) {
        playMusic();
    }
}

// Función al hacer click en Minimizar (Botón Rojo)
function returnToIntro() {
    const introScreen = document.getElementById('intro-screen');
    introScreen.classList.remove('intro-hidden');
    
    introVideo.play();
    
    if (isPlaying) {
        togglePlay();
    }
    
    closeAllPanels();
}

// 4. Lógica del Banner de Conexión (xat API) dinámico
/*async function checkOnlineStatus() {
    const indicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');
    if (!indicator || !statusText) return;
    
    try {
        const response = await fetch('');
        if (!response.ok) throw new Error('Network error');
        
        const data = await response.json();
        const status = data.data?.status?.toLowerCase();
        
        if (status === 'online') {
            indicator.style.backgroundColor = '#16a34a'; 
            indicator.style.boxShadow = '0 0 8px #16a34a';
            statusText.innerText = 'ONLINE';
            statusText.style.color = '#16a34a';
        } else {
            indicator.style.backgroundColor = '#b91c1c'; 
            indicator.style.boxShadow = '0 0 8px #b91c1c';
            statusText.innerText = status === 'available' ? 'AVAILABLE' : 'OFFLINE';
            statusText.style.color = '#b91c1c';
        }
    } catch (error) {
        indicator.style.backgroundColor = '#b91c1c'; 
        indicator.style.boxShadow = '0 0 8px #b91c1c';
        statusText.innerText = 'OFFLINE';
        statusText.style.color = '#b91c1c';
    }
}*/

// 5. Lógica de Paneles (Abrir, Cerrar y Navegación de Flechas)
const panelsOrder = ['about', 'music', 'quotes'];
let currentPanelIndex = -1; // -1 = Home

function openPanel(panelId) {
    currentPanelIndex = panelsOrder.indexOf(panelId);
    const panels = document.querySelectorAll('.floating-panel');
    panels.forEach(p => p.classList.remove('active-panel'));
    
    document.getElementById('main-area').classList.add('panel-open');
    
    const targetPanel = document.getElementById(panelId + '-panel');
    if (targetPanel) {
        targetPanel.classList.add('active-panel');
    }
}

function closeAllPanels() {
    currentPanelIndex = -1;
    document.getElementById('main-area').classList.remove('panel-open');
    document.querySelectorAll('.floating-panel').forEach(p => p.classList.remove('active-panel'));
}

function nextPanel() {
    currentPanelIndex++;
    if (currentPanelIndex >= panelsOrder.length) currentPanelIndex = -1;
    
    if (currentPanelIndex === -1) {
        closeAllPanels();
    } else {
        openPanel(panelsOrder[currentPanelIndex]);
    }
}

function prevPanel() {
    currentPanelIndex--;
    if (currentPanelIndex < -1) currentPanelIndex = panelsOrder.length - 1;
    
    if (currentPanelIndex === -1) {
        closeAllPanels();
    } else {
        openPanel(panelsOrder[currentPanelIndex]);
    }
}

// 6. Lógica del Reproductor de Música (Playlist Automática y en Bucle)
const playlist = [
    { title: "Mein Herz Brennt", artist: "Rammstein", cover: "https://i.ibb.co/xqwg3bVg/IMG-5447.jpg", src: "https://raw.githubusercontent.com/Beltane001/Beltane001.github.io/master/Beltane/assets/audio/Mein_Herz_brennt.mp3" },
    { title: "Mein Herz Brennt", artist: "Rammstein", cover: "https://i.ibb.co/xqwg3bVg/IMG-5447.jpg", src: "https://raw.githubusercontent.com/Beltane001/Beltane001.github.io/master/Beltane/assets/audio/Mein_Herz_brennt.mp3" },
    { title: "Mein Herz Brennt", artist: "Rammstein", cover: "https://i.ibb.co/xqwg3bVg/IMG-5447.jpg", src: "https://raw.githubusercontent.com/Beltane001/Beltane001.github.io/master/Beltane/assets/audio/Mein_Herz_brennt.mp3" }
];

let currentSongIndex = 0;
let isPlaying = false;
const audioPlayer = document.getElementById('audio-player');
const musicCover = document.getElementById('music-cover');
const musicTitle = document.getElementById('music-title');
const musicArtist = document.getElementById('music-artist');
const playBtn = document.getElementById('play-btn');

loadSong(currentSongIndex);

function loadSong(index) {
    const song = playlist[index];
    musicTitle.innerText = song.title;
    musicArtist.innerText = song.artist;
    musicCover.src = song.cover;
    audioPlayer.src = song.src;
}

const playIcon = '<i data-lucide="play" class="w-4 h-4 fill-current ml-1 pointer-events-none"></i>';
const pauseIcon = '<i data-lucide="pause" class="w-4 h-4 fill-current pointer-events-none"></i>';

function updatePlayIcon() {
    if (isPlaying) {
        musicCover.classList.remove('paused-spin');
        playBtn.innerHTML = pauseIcon;
    } else {
        musicCover.classList.add('paused-spin');
        playBtn.innerHTML = playIcon;
    }
    lucide.createIcons();
}

function playMusic() {
    const playPromise = audioPlayer.play();
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            isPlaying = true;
            updatePlayIcon();
        }).catch(error => {
            isPlaying = false;
            updatePlayIcon();
        });
    }
}

function togglePlay() {
    if (audioPlayer.paused) {
        playMusic();
    } else {
        audioPlayer.pause();
        isPlaying = false;
        updatePlayIcon();
    }
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    loadSong(currentSongIndex);
    if (isPlaying) playMusic();
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentSongIndex);
    if (isPlaying) playMusic();
}

// Bucle automático a la siguiente canción
audioPlayer.addEventListener('ended', nextSong);

// Anti-Theft Script Extreme (Obfuscated & Locked)
(function(){
    const block = (e) => { e.preventDefault(); e.stopPropagation(); return false; };
    // Bloquear clic derecho, arrastre y selección de texto
    document.addEventListener('contextmenu', block, {capture: true});
    document.addEventListener('dragstart', block, {capture: true});
    document.addEventListener('selectstart', block, {capture: true});
    
    // Bloquear atajos de teclado (Windows/Mac/Linux)
    document.addEventListener('keydown', (e) => {
        if(e.keyCode === 123 || e.key === 'F12') return block(e); // F12
        if(e.ctrlKey || e.metaKey) { // Ctrl o Command
            const keys = ['a','c','v','x','u','s','p','i','j','k'];
            if(keys.includes(e.key.toLowerCase())) return block(e);
            if(e.shiftKey && ['i','j','c'].includes(e.key.toLowerCase())) return block(e);
        }
    }, {capture: true});

    // Trampa de Debugger (Inhabilita la consola si se fuerza su apertura)
    setInterval(function() {
        (function() { return false; }['constructor']('debugger')());
    }, 50);
})();
