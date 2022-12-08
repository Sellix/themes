(function (document, window) {
  function ripple(selector) {
    const buttonRef = document.querySelector(selector);

    let isDown = false;
    let added = false;
    let ripple = document.createElement('span');

    const downListener = (e) => {
      if (e.button === 2 || !ripple.animate) {
        return false;
      }

      isDown = true;

      ripple.classList.add('ripple-effect');

      let rect = buttonRef.getBoundingClientRect();

      let xPos = e.x - rect.left;
      let yPos = e.y - rect.top;
      let scaledSize = Math.max(rect.width, rect.height) * Math.PI * 1.5;

      ripple.style.left = `${xPos}px`;
      ripple.style.top = `${yPos}px`;
      ripple.style.backgroundColor = 'black';
      ripple.style.opacity = '0.175';

      if (!added) {
        added = true;
        buttonRef.appendChild(ripple);
      }

      let rippleAnimate = ripple.animate(
        {
          height: ['0px', `${scaledSize}px`],
          width: ['0px', `${scaledSize}px`],
        },
        {
          duration: 700,
        },
      );

      rippleAnimate.onfinish = () => {
        ripple.style.width = `${scaledSize}px`;
        ripple.style.height = `${scaledSize}px`;
      };
    };

    const overListener = () => {
      if (!isDown) {
        return;
      }

      let rippleAnimate = ripple.animate(
        {
          opacity: [0.175, 0],
        },
        {
          duration: 700 / 3,
        },
      );

      rippleAnimate.onfinish = () => {
        if (added) {
          added = false;
          ripple.remove();
        }
      };
    };

    const upListener = () => {
      if (!isDown || !ripple.animate) {
        return;
      }

      isDown = false;

      let rippleAnimate = ripple.animate(
        {
          opacity: [0.175, 0],
        },
        {
          duration: 700 / 3,
        },
      );

      rippleAnimate.onfinish = () => {
        if (added) {
          added = false;
          ripple.remove();
        }
      };
    };

    buttonRef.addEventListener('mousedown', downListener);
    buttonRef.addEventListener('mouseup', upListener);
    buttonRef.addEventListener('mouseover', overListener);
  }
  window.ripple = ripple;
})(document, window);
