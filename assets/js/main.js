// Terminal-style JS interactions
// Typewriter effect for terminal intro (optional)
document.addEventListener("DOMContentLoaded", () => {
    const prompts = document.querySelectorAll(".prompt");
    prompts.forEach((el, i) => {
      const text = el.innerText;
      el.innerText = "";
      setTimeout(() => typeText(el, text), i * 400);
    });
  
    function typeText(el, text, i = 0) {
      if (i < text.length) {
        el.innerText += text.charAt(i);
        setTimeout(() => typeText(el, text, i + 1), 20);
      }
    }
  });
  