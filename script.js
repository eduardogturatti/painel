async function carregarDadosCSV() {
  const url =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vS1Tg4SJaVoDH3BBK7kSBcys_ZmjY5UVgOH5xO_AGE30HNZZJtpO9j5ZRNMthvL7VkjS24plZxjy4kP/pub?gid=0&single=true&output=csv";
  try {
    const resposta = await fetch(url);
    const textoCSV = await resposta.text();
    const slides = processarCSV(textoCSV);
    criarSlides(slides);
    iniciarCicloDeSlides();
  } catch (erro) {
    console.error("Erro ao carregar dados CSV:", erro);
  }
}

function processarCSV(dadosCSV) {
  const linhas = dadosCSV.split("\n").slice(1); // Remove cabeçalho
  const slides = {};

  linhas.forEach((linha) => {
    const [slideId, categoria, item, preco] = linha.split(",");
    if (!slides[slideId]) {
      slides[slideId] = [];
    }
    slides[slideId].push({
      categoria: categoria.trim(),
      item: item.trim(),
      preco: formatarPreco(preco)
    });
  });

  return slides;
}

function formatarPreco(preco) {
  return `R$ ${preco.replace(".", ",")}`;
}

function criarSlides(slides) {
  const slider = document.getElementById("slider");
  slider.innerHTML = ""; // Limpar slides existentes

  Object.entries(slides).forEach(([slideId, itens], slideIndex) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    if (slideIndex === 0) {
      // Apenas o primeiro slide é ativo inicialmente
      slide.classList.add("active");
    }

    let ultimaCategoria = "";
    let itemDelay = 0; // Inicializa o atraso de animação

    itens.forEach(({ categoria, item, preco }, index) => {
      if (categoria !== ultimaCategoria) {
        const categoriaDiv = document.createElement("div");
        categoriaDiv.className = "categoria";
        categoriaDiv.innerHTML = categoria;
        slide.appendChild(categoriaDiv);
        ultimaCategoria = categoria;
        itemDelay = 0.1; // Reinicia o atraso para a primeira item-preco de uma nova categoria
      }
      const itemPrecoDiv = document.createElement("div");
      itemPrecoDiv.className = "item-preco";
      itemPrecoDiv.style.animationDelay = `${itemDelay}s`; // Define o atraso da animação
      itemPrecoDiv.innerHTML = `
                <span class="item">${item}</span>
                <span class="preco">${preco}</span>
            `;
      slide.appendChild(itemPrecoDiv);

      itemDelay += 0.1; // Incrementa o atraso para o próximo item-preco
    });

    slider.appendChild(slide);
  });
}

function iniciarCicloDeSlides() {
  let currentSlideIndex = 0;
  const slides = document.querySelectorAll(".slide");
  const totalSlides = slides.length;

  function clearAnimation() {
    document.querySelectorAll(".slide").forEach((slide) => {
      slide.classList.remove("fade-out");
    });
  }

  function animateCurrentSlide() {
    // Limpa as animações e prepara o próximo slide
    clearAnimation();
    const activeSlide = slides[currentSlideIndex];
    const allElements = activeSlide.querySelectorAll(".categoria, .item-preco");
    allElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add("animate");
      }, index * 50); // Incrementa o delay para cada categoria e item
    });
  }

  // Animação inicial do primeiro slide
  animateCurrentSlide();

  setInterval(() => {
    const currentSlide = slides[currentSlideIndex];
    currentSlide.classList.add("fade-out");

    setTimeout(() => {
      currentSlide.classList.remove("active", "animate");
      currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
      slides[currentSlideIndex].classList.add("active");

      // Reinicia as animações para o slide ativo após o fade out
      animateCurrentSlide();
    }, 500); // Espera o fade out completar (1s) antes de mudar o slide
  }, 20000); // Alternar slides a cada 20 segundos
}

document.addEventListener("DOMContentLoaded", carregarDadosCSV);