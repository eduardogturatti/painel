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
  const linhas = dadosCSV.split("\n").slice(1);
  const slides = {};

  linhas.forEach((linha) => {
    const [slideId, categoria, item, preco] = linha.split(",");
    if (!slides[slideId]) slides[slideId] = [];
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
  slider.innerHTML = "";

  Object.entries(slides).forEach(([slideId, itens]) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    let ultimaCategoria = "";

    itens.forEach(({ categoria, item, preco }, index) => {
      if (categoria !== ultimaCategoria) {
        const categoriaDiv = document.createElement("div");
        categoriaDiv.className = "categoria";
        categoriaDiv.innerHTML = categoria;
        slide.appendChild(categoriaDiv);
        ultimaCategoria = categoria;
      }
      const itemPrecoDiv = document.createElement("div");
      itemPrecoDiv.className = "item-preco";
      itemPrecoDiv.innerHTML = `<span class="item">${item}</span><span class="preco">${preco}</span>`;
      slide.appendChild(itemPrecoDiv);
    });

    slider.appendChild(slide);
  });

  // Inicialmente, ativa o primeiro slide
  if (slider.firstChild) slider.firstChild.classList.add("active");
}

function iniciarCicloDeSlides() {
  let currentSlideIndex = 0;
  const slides = document.querySelectorAll(".slide");
  const totalSlides = slides.length;

  function animateSlide(slide) {
    const elements = slide.querySelectorAll(".categoria, .item-preco");
    let delay = 0; // Delay inicial para a animação

    elements.forEach((el) => {
      // Remove a classe 'animate' para garantir que a animação seja reiniciada
      el.classList.remove("animate");
      // Força reflow para reiniciar a animação
      void el.offsetWidth;
    });

    // Agora, adiciona a classe 'animate' com o delay apropriado
    elements.forEach((el) => {
      if (el.classList.contains("categoria")) {
        setTimeout(() => el.classList.add("animate"), delay);
        delay += 100; // Incrementa o delay para a próxima animação
      } else {
        // Assegura que itens tenham um delay adicional para sincronizar com a animação das categorias
        setTimeout(() => el.classList.add("animate"), delay);
        delay += 100; // Incrementa o delay para a próxima animação
      }
    });
  }

  animateSlide(slides[currentSlideIndex]);

  setInterval(() => {
    slides[currentSlideIndex].classList.remove("active");
    currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
    const nextSlide = slides[currentSlideIndex];
    nextSlide.classList.add("active");
    animateSlide(nextSlide);
  }, 10000); // Ajuste conforme necessário
}
// Define um intervalo para a atualização automática da página (em milissegundos)
// Exemplo: 60000 milissegundos = 1 minuto
var refreshInterval = 240000; 

// Define a função de atualização
function autoRefresh() {
    // Recarrega a página
    window.location.reload();
}

// Configura a atualização automática com base no intervalo definido
setTimeout(autoRefresh, refreshInterval);

document.addEventListener("DOMContentLoaded", carregarDadosCSV);
