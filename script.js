const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".nav-link");
const contactForm = document.querySelector(".contact-form");
const formMessage = document.querySelector(".form-message");
const themeToggle = document.querySelector(".theme-toggle");

const savedTheme = localStorage.getItem("theme");
const initialTheme = savedTheme === "dark" ? "dark" : "light";
document.documentElement.dataset.theme = initialTheme;

const updateThemeToggle = (theme) => {
  const isDark = theme === "dark";
  themeToggle.setAttribute("aria-label", `${isDark ? "라이트" : "다크"} 모드로 전환`);
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.title = `${isDark ? "라이트" : "다크"} 모드로 전환`;
  themeToggle.querySelector("span").textContent = isDark ? "☀" : "☾";
};

if (themeToggle) {
  updateThemeToggle(initialTheme);
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("theme", nextTheme);
    updateThemeToggle(nextTheme);
  });
}

menuToggle?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((section) => revealObserver.observe(section));

const projectDialog = document.querySelector("#project-dialog");
const projectDialogTitle = document.querySelector("#project-dialog-title");
const projectDialogDescription = document.querySelector("#project-dialog-description");
const projectDialogRole = document.querySelector("#project-dialog-role");
const projectDialogTechnologies = document.querySelector("#project-dialog-technologies");
const projectDialogResults = document.querySelector("#project-dialog-results");
const projectDialogClose = document.querySelector(".project-dialog-close");
let activeProjectCard = null;

// 카드에 저장된 예시 정보를 모달에 표시하고, 열릴 때 닫기 버튼에 포커스를 둡니다.
const openProjectDialog = (card) => {
  const title = card.querySelector("h3");
  const description = card.querySelector(".project-info p");
  const { role, technologies, results } = card.dataset;

  if (
    !projectDialog || !projectDialogTitle || !projectDialogDescription ||
    !projectDialogRole || !projectDialogTechnologies || !projectDialogResults ||
    !projectDialogClose || !title || !description || !role || !technologies || !results
  ) {
    throw new Error("프로젝트 상세 정보를 표시하는 데 필요한 요소를 찾을 수 없습니다.");
  }

  projectDialogTitle.textContent = title.textContent.trim();
  projectDialogDescription.textContent = description.textContent.trim();
  projectDialogRole.textContent = role;
  projectDialogTechnologies.textContent = technologies;
  projectDialogResults.textContent = results;
  activeProjectCard = card;
  projectDialog.showModal();
  projectDialogClose.focus();
};

document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("click", () => openProjectDialog(card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProjectDialog(card);
    }
  });
});

projectDialogClose?.addEventListener("click", () => projectDialog.close());
projectDialog?.addEventListener("click", (event) => {
  if (event.target === projectDialog) projectDialog.close();
});
// ESC 키를 포함해 모달이 닫히면, 열었던 카드로 키보드 포커스를 되돌립니다.
projectDialog?.addEventListener("close", () => {
  activeProjectCard?.focus();
  activeProjectCard = null;
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = [
    {
      input: contactForm.querySelector('[name="name"]'),
      error: contactForm.querySelector("#name-error"),
      requiredMessage: "이름을 입력해 주세요.",
    },
    {
      input: contactForm.querySelector('[name="email"]'),
      error: contactForm.querySelector("#email-error"),
      requiredMessage: "이메일 주소를 입력해 주세요.",
    },
    {
      input: contactForm.querySelector('[name="message"]'),
      error: contactForm.querySelector("#message-error"),
      requiredMessage: "메시지를 입력해 주세요.",
    },
  ];
  let firstInvalidField = null;

  fields.forEach(({ input, error, requiredMessage }) => {
    if (!input || !error) {
      throw new Error("문의 양식의 입력 항목 또는 오류 메시지 요소를 찾을 수 없습니다.");
    }

    const value = input.value.trim();
    let errorText = "";
    if (!value) {
      errorText = requiredMessage;
    } else if (input instanceof HTMLInputElement && input.type === "email" && input.validity.typeMismatch) {
      errorText = "올바른 이메일 주소를 입력해 주세요.";
    }

    error.textContent = errorText;
    input.setAttribute("aria-invalid", String(Boolean(errorText)));
    if (errorText && !firstInvalidField) firstInvalidField = input;
  });

  if (!formMessage) {
    throw new Error("문의 양식의 결과 메시지 요소를 찾을 수 없습니다.");
  }

  if (firstInvalidField) {
    formMessage.textContent = "입력 내용을 확인해 주세요.";
    formMessage.classList.add("is-error");
    firstInvalidField.focus();
    return;
  }

  formMessage.textContent = "입력값 검증이 완료되었습니다. 실제 이메일은 전송되지 않습니다.";
  formMessage.classList.remove("is-error");
});

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = new Date().getFullYear();
