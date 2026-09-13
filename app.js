const data = window.PORTFOLIO_DATA;
let language = "en";
let activeFilter = "All";

const translations = {
  en: {
    navWork: "Work", navExpertise: "Expertise", navProcess: "Process", navContact: "Contact",
    availability: "Available for select remote projects",
    heroLine1: "I turn complex ideas", heroLine2: "into stories people finish.",
    heroIntro: "YouTube scriptwriter and researcher crafting high-retention narratives across psychology, travel, history, science, and self-development.",
    workEyebrow: "Selected channel work", workTitle: "Stories across<br /><em>different worlds.</em>",
    workNote: "A selection of channels I have contributed to. Public metrics are snapshots and may change over time.",
    expertiseEyebrow: "What I bring", expertiseTitle: "Writing built for<br /><em>watch time.</em>",
    expertiseNote: "From the first research question to the final line, every choice serves clarity, curiosity, and momentum.",
    philosophyEyebrow: "Writing philosophy", philosophyQuote: "“A strong script does not simply explain. It creates a question the viewer needs answered — then makes every sentence earn the next.”",
    processEyebrow: "The process", processTitle: "From blank page<br /><em>to final draft.</em>",
    aboutTitle: "Research-minded.<br />Audience-obsessed.<br /><em>Always story-first.</em>",
    aboutBody: "I am a graduate and full-time YouTube scriptwriter with experience developing research, outlines, full scripts, and title angles for international audiences. I move comfortably between analytical explainers and cinematic storytelling while keeping the voice clear, human, and engaging.",
    contactEyebrow: "Have a story to tell?", contactTitle: "Let’s make it", contactEm: "impossible to click away.",
    contactBody: "Open to long-form YouTube scripts, research-led explainers, and ongoing channel partnerships.",
    footerRole: "YouTube Scriptwriter & Researcher", backTop: "Back to top ↑", all: "All", watch: "Watch on YouTube", github: "GitHub", email: "Email", linkedin: "LinkedIn"
  },
  vi: {
    navWork: "Dự án", navExpertise: "Kỹ năng", navProcess: "Quy trình", navContact: "Liên hệ",
    availability: "Sẵn sàng cho các dự án remote phù hợp",
    heroLine1: "Tôi biến ý tưởng phức tạp", heroLine2: "thành câu chuyện người xem muốn xem hết.",
    heroIntro: "Biên kịch YouTube và researcher chuyên xây dựng nội dung giữ chân người xem trong các lĩnh vực tâm lý, du lịch, lịch sử, khoa học và phát triển bản thân.",
    workEyebrow: "Các kênh tiêu biểu", workTitle: "Những câu chuyện từ<br /><em>nhiều thế giới.</em>",
    workNote: "Một số kênh tôi đã tham gia phát triển nội dung. Số liệu công khai là ảnh chụp tại một thời điểm và có thể thay đổi.",
    expertiseEyebrow: "Giá trị tôi mang lại", expertiseTitle: "Viết để tối ưu<br /><em>thời gian xem.</em>",
    expertiseNote: "Từ câu hỏi nghiên cứu đầu tiên đến dòng cuối cùng, mọi lựa chọn đều phục vụ sự rõ ràng, tò mò và nhịp điệu.",
    philosophyEyebrow: "Triết lý viết", philosophyQuote: "“Một kịch bản tốt không chỉ giải thích. Nó tạo ra câu hỏi người xem cần được trả lời — rồi khiến mỗi câu đều xứng đáng dẫn đến câu tiếp theo.”",
    processEyebrow: "Quy trình", processTitle: "Từ trang trắng<br /><em>đến bản thảo cuối.</em>",
    aboutTitle: "Tư duy nghiên cứu.<br />Thấu hiểu khán giả.<br /><em>Luôn ưu tiên câu chuyện.</em>",
    aboutBody: "Tôi đã tốt nghiệp và hiện là biên kịch YouTube toàn thời gian, có kinh nghiệm thực hiện research, outline, full script và phát triển góc tiêu đề cho khán giả quốc tế. Tôi linh hoạt giữa video giải thích chuyên sâu và kể chuyện điện ảnh, luôn giữ giọng văn rõ ràng, tự nhiên và cuốn hút.",
    contactEyebrow: "Bạn có một câu chuyện?", contactTitle: "Hãy biến nó thành nội dung", contactEm: "không thể bỏ qua.",
    contactBody: "Sẵn sàng hợp tác cho kịch bản YouTube dài, video giải thích dựa trên nghiên cứu và đồng hành phát triển kênh.",
    footerRole: "Biên kịch YouTube & Researcher", backTop: "Lên đầu trang ↑", all: "Tất cả", watch: "Xem trên YouTube", github: "GitHub", email: "Email", linkedin: "LinkedIn"
  }
};

function t(key) { return translations[language][key] || key; }

function renderStaticText() {
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.innerHTML = t(element.dataset.i18n);
  });
  document.querySelectorAll(".language-toggle span").forEach((span) => span.classList.toggle("active", span.textContent.toLowerCase() === language));
}

function renderStats() {
  document.querySelector("#stats").innerHTML = data.stats.map((stat) => `
    <div class="stat">
      <div class="stat-value">${stat.value}</div>
      <div class="stat-label">${stat[language]}</div>
    </div>`).join("");
}

function renderFilters() {
  const categories = ["All", ...new Set(data.projects.map((project) => project.category))];
  document.querySelector("#filters").innerHTML = categories.map((category) => `
    <button class="filter-btn ${activeFilter === category ? "active" : ""}" type="button" data-filter="${category}">
      ${category === "All" ? t("all") : category}
    </button>`).join("");
  document.querySelectorAll(".filter-btn").forEach((button) => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    renderFilters();
    renderProjects();
  }));
}

function renderProjects() {
  const projects = activeFilter === "All" ? data.projects : data.projects.filter((project) => project.category === activeFilter);
  document.querySelector("#project-grid").innerHTML = projects.map((project, index) => `
    <article class="project-card reveal visible">
      <a class="project-image" href="https://www.youtube.com/watch?v=${project.videoId}" target="_blank" rel="noreferrer" aria-label="${t("watch")}: ${project.title}">
        <img src="https://i.ytimg.com/vi/${project.videoId}/maxresdefault.jpg" onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${project.videoId}/hqdefault.jpg'" alt="Thumbnail for ${project.title}" loading="lazy" />
        <span class="view-badge">${project.views}</span><span class="play" aria-hidden="true">▶</span>
      </a>
      <div class="project-meta"><span>0${index + 1} / ${project.category}</span><span>${project.channel}</span></div>
      <h3><a href="https://www.youtube.com/watch?v=${project.videoId}" target="_blank" rel="noreferrer">${project.title}</a></h3>
      <p>${project[language]}</p>
    </article>`).join("");
}

function renderExpertise() {
  document.querySelector("#expertise-grid").innerHTML = data.expertise.map((item, index) => `
    <article class="expertise-item reveal">
      <span class="num">0${index + 1}</span><h3>${item.title[language]}</h3><p>${item.body[language]}</p>
    </article>`).join("");
}

function renderProcess() {
  document.querySelector("#process-list").innerHTML = data.process.map((item) => `
    <li class="process-step reveal"><h3>${item.title[language]}</h3><p>${item.body[language]}</p></li>`).join("");
}

function renderTags() {
  document.querySelector("#about-tags").innerHTML = data.tags.map((tag) => `<span class="about-tag">${tag}</span>`).join("");
}

function renderContact() {
  const links = [{ label: t("github"), url: data.contact.github }];
  if (data.contact.email) links.push({ label: t("email"), url: `mailto:${data.contact.email}` });
  if (data.contact.linkedin) links.push({ label: t("linkedin"), url: data.contact.linkedin });
  document.querySelector("#contact-links").innerHTML = links.map((link) => `<a class="contact-link" href="${link.url}" target="_blank" rel="noreferrer"><span>${link.label}</span><span>↗</span></a>`).join("");
}

function activateReveal() {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
  }), { threshold: .12 });
  document.querySelectorAll(".reveal:not(.visible)").forEach((element) => observer.observe(element));
}

function render() {
  renderStaticText(); renderStats(); renderFilters(); renderProjects(); renderExpertise(); renderProcess(); renderTags(); renderContact(); activateReveal();
}

document.querySelector(".language-toggle").addEventListener("click", () => { language = language === "en" ? "vi" : "en"; render(); });
document.querySelector(".menu-toggle").addEventListener("click", (event) => {
  const open = document.body.classList.toggle("menu-open"); event.currentTarget.setAttribute("aria-expanded", String(open));
});
document.querySelectorAll(".mobile-nav a").forEach((link) => link.addEventListener("click", () => document.body.classList.remove("menu-open")));
document.querySelector("#year").textContent = new Date().getFullYear();
render();
