const list = document.querySelector("#movie-list");
const status = document.querySelector("#status");
const summary = document.querySelector("#summary");
const search = document.querySelector("#search");
const genre = document.querySelector("#genre");
let allMovies = [];
function setStatus(message, kind = "info") {
  status.textContent = message;
  status.dataset.kind = kind;
}
function normalizeMovie(raw) {
  // TODO 1: верните объект с title, genre, year, rating, duration,
  // sessions (массив строк) и tags (массив строк).
  // Учтите отсутствие либо неверный тип отдельных полей.
}
function renderMovies(movies) {
  // TODO 2: создайте карточки createElement/textContent (без innerHTML).
  // Покажите жанр, год, рейтинг, длительность, ближайший сеанс и теги.
  // Для пустого списка создайте элемент .empty.
}
function applyFilters() {
  // TODO 3: найдите фильмы по подстроке названия (без учёта регистра),
  // затем примените фильтр жанра и обновите #summary и карточки.
}
async function fetchMovies(empty = false) {
  // TODO 4: fetch('/api/movies' + (empty?'?empty=1':'')), response.ok, response.json().
  // Извлеките data.movies, проверьте Array.isArray, преобразуйте normalizeMovie,
  // запишите в allMovies и вызовите applyFilters().
  setStatus("TODO: загрузите и обработайте JSON");
}
document
  .querySelector("#load-button")
  .addEventListener("click", () => fetchMovies());
document
  .querySelector("#clear-button")
  .addEventListener("click", () => fetchMovies(true));
search.addEventListener("input", applyFilters);
genre.addEventListener("change", applyFilters);
// TODO 5: вызовите fetchMovies() при открытии страницы.
function normalizeMovie(raw) {
  const movie = raw || {};
  const strings = value => Array.isArray(value) ? value.filter(item => typeof item === "string" && item.trim()) : [];
  return {
    title: typeof movie.title === "string" && movie.title.trim() || "Без названия",
    genre: typeof movie.genre === "string" && movie.genre.trim() || "Жанр неизвестен",
    year: Number.isInteger(movie.year) ? movie.year : "не указан",
    rating: Number.isFinite(movie.rating) ? movie.rating.toFixed(1) : "нет оценки",
    duration: Number.isFinite(movie.duration) ? movie.duration + " мин" : "не указана",
    sessions: strings(movie.sessions), tags: strings(movie.tags)
  };
}

function renderMovies(movies) {
  list.replaceChildren();
  if (!movies.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "Фильмы не найдены";
    list.append(empty);
  }
  for (const movie of movies) {
    const card = document.createElement("article");
    card.className = "card";
    const title = document.createElement("h3");
    title.textContent = movie.title;
    const details = document.createElement("p");
    details.textContent = `${movie.genre} · ${movie.year} · Рейтинг: ${movie.rating} · ${movie.duration}`;
    const sessions = document.createElement("p");
    sessions.textContent = `Ближайший сеанс: ${movie.sessions[0] || "нет сеансов"} · Теги: ${movie.tags.join(", ") || "нет"}`;
    card.append(title, details, sessions);
    list.append(card);
  }
}

function applyFilters() {
  const query = search.value.trim().toLowerCase();
  const movies = allMovies.filter(movie => movie.title.toLowerCase().includes(query)
    && (genre.value === "all" || movie.genre === genre.value));
  renderMovies(movies);
  summary.textContent = `Показано ${movies.length} из ${allMovies.length}`;
}

async function fetchMovies(empty = false) {
  try {
    const response = await fetch("/api/movies" + (empty ? "?empty=1" : ""));
    if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
    const result = await response.json();
    if (!Array.isArray(result.data?.movies)) throw new Error("Сервер вернул неверный список фильмов");
    allMovies = result.data.movies.map(normalizeMovie);
    applyFilters();
    setStatus("Каталог загружен", "success");
  } catch (error) {
    setStatus(error.message, "error");
  }
}
document.querySelector("#load-button").addEventListener("click", () => fetchMovies());
document.querySelector("#clear-button").addEventListener("click", () => fetchMovies(true));
search.addEventListener("input", applyFilters);
genre.addEventListener("change", applyFilters);
fetchMovies();
