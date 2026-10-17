// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    
    // Элементы плеера
    const playBtn = document.querySelector('.play-main');
    const prevBtn = document.querySelectorAll('.control-btn')[1]; // ⏮
    const nextBtn = document.querySelectorAll('.control-btn')[3]; // ⏭
    const likeBtn = document.querySelector('.like-btn');
    const dislikeBtn = document.querySelector('.dislike-btn');
    const volumeSlider = document.querySelector('.volume-slider');
    const progressContainer = document.querySelector('.progress-container');
    const progressCurrent = document.querySelector('.progress-current');
    const progressDot = document.querySelector('.progress-dot');
    const timeDisplay = document.querySelector('.time-display');
    
    // Текст трека в плеере
    const trackName = document.querySelector('.track-name');
    const trackArtist = document.querySelector('.track-artist');

    // Состояние плеера
    let isPlaying = false;
    let duration = 216; // 3:36 в секундах
    let currentTime = 74; // 1:14 в секундах
    let progressInterval;

    // 1. КНОПКА PLAY / PAUSE
    function togglePlay() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            playBtn.textContent = '⏸'; // Меняем иконку на паузу
            playBtn.style.paddingLeft = '0px'; // Корректируем центровку
            startTimer();
        } else {
            playBtn.textContent = '▶';
            playBtn.style.paddingLeft = '4px';
            clearInterval(progressInterval);
        }
    }
    playBtn.addEventListener('click', togglePlay);

    // 2. ТАЙМЕР И ПОЛОСА ПРОГРЕССА
    function formatTime(secs) {
        let mins = Math.floor(secs / 60);
        let remainingSecs = secs % 60;
        return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
    }

    function updateProgressUI() {
        const percentage = (currentTime / duration) * 100;
        progressCurrent.style.width = `${percentage}%`;
        progressDot.style.left = `${percentage}%`;
        timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
    }

    function startTimer() {
        clearInterval(progressInterval);
        progressInterval = setInterval(() => {
            if (currentTime < duration) {
                currentTime++;
                updateProgressUI();
            } else {
                currentTime = 0;
                togglePlay(); // Останавливаем, если трек кончился
            }
        }, 1000);
    }

    // Клик по полосе прогресса (Перемотка)
    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const percentage = clickX / width;
        
        currentTime = Math.floor(percentage * duration);
        updateProgressUI();
    });

    // 3. РАБОТА С КАРТОЧКАМИ (Выбор трека)
    // Функция для смены трека при клике на микс или альбом
    function changeTrack(name, artist) {
        trackName.textContent = name;
        trackArtist.textContent = artist;
        currentTime = 0;
        duration = Math.floor(Math.random() * (300 - 180) + 180); // Случайная длина трека
        if (!isPlaying) togglePlay();
        updateProgressUI();
    }

    // Вешаем клики на быстрые миксы
    document.querySelectorAll('.mix-item').forEach(item => {
        item.addEventListener('click', () => {
            const title = item.querySelector('.mix-title').textContent;
            const subtitle = item.querySelector('.mix-subtitle').textContent;
            changeTrack(title, subtitle);
        });
    });

    // Вешаем клики на карточки альбомов
    document.querySelectorAll('.album-card').forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('.album-title').textContent;
            const artist = card.querySelector('.album-artist').textContent;
            changeTrack(title, artist);
        });
    });

    // 4. ЛАЙКИ И ДИЗЛАЙКИ
    likeBtn.addEventListener('click', () => {
        likeBtn.textContent = likeBtn.textContent === '🤍' ? '❤️' : '🤍';
        dislikeBtn.textContent = '👎'; // Сбрасываем дизлайк
    });

    dislikeBtn.addEventListener('click', () => {
        dislikeBtn.textContent = dislikeBtn.textContent === '👎' ? '👎🔴' : '👎';
        likeBtn.textContent = '🤍'; // Сбрасываем лайк
    });

    // 5. РЕГУЛЯТОР ГРОМКОСТИ
    volumeSlider.addEventListener('input', (e) => {
        const volume = e.target.value;
        const volumeIcon = document.querySelector('.volume-container span');
        if (volume == 0) volumeIcon.textContent = '🔇';
        else if (volume < 40) volumeIcon.textContent = '🔈';
        else if (volume < 80) volumeIcon.textContent = '🔉';
        else volumeIcon.textContent = '🔊';
    });

    // 6. ФИЛЬТРЫ-ЧИПСЫ
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelector('.chip.active').classList.remove('active');
            chip.classList.add('active');
        });
    });
});
