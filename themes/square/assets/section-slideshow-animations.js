function toggleImageText(slide, isFadingIn) {
  if (!slide) return; // Verifica che la slide esista

  var imageText = slide.querySelector('.image-text');
  if (imageText) {
    // Rimuovi tutte le classi di animazione precedenti
    imageText.classList.remove('animate__fadeInUp', 'animate__fadeOutDown', 'animate__animated');

    // Forza il reflow prima di applicare una nuova animazione
    void imageText.offsetWidth;

    // Aggiungi la nuova classe di animazione
    if (isFadingIn) {
      imageText.classList.add('animate__animated', 'animate__fadeInUp');
      imageText.style.opacity = '1';  // Effetto fade-in
    } else {
      imageText.classList.add('animate__animated', 'animate__fadeOutDown');
      imageText.style.opacity = '0';  // Effetto fade-out
    }
  }
}

function animateSlideBackground(slide) {
  slide.classList.add('slide-animate');
  setTimeout(() => slide.classList.remove('slide-animate'), 1000);
}