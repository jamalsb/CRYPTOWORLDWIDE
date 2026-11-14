const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

document.getElementById("year").textContent = new Date().getFullYear();

const urlInput = document.getElementById("urlInput");
const checkButton = document.getElementById("checkButton");
const result = document.getElementById("result");

function reviewAddress() {
  const raw = urlInput.value.trim();
  if (!raw) {
    result.className = "result-box warning";
    result.innerHTML = '<div class="result-icon">!</div><div><b>Enter a website address first</b><span>Use a public URL only. Never enter wallet secrets.</span></div>';
    return;
  }

  let parsed;
  try {
    parsed = new URL(raw.includes("://") ? raw : `https://${raw}`);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Unsupported protocol");
  } catch {
    result.className = "result-box warning";
    result.innerHTML = '<div class="result-icon">!</div><div><b>This does not look like a valid web address</b><span>Check the spelling and try again.</span></div>';
    return;
  }

  const host = parsed.hostname.toLowerCase();
  const warnings = [];
  if (parsed.protocol !== "https:") warnings.push("The address does not use HTTPS.");
  if (host.startsWith("xn--") || host.includes(".xn--")) warnings.push("The domain uses internationalized characters. Check carefully for lookalike spelling.");
  if (host.split(".").length > 4) warnings.push("The address has several subdomain levels. Confirm the official domain.");
  if (/@/.test(raw)) warnings.push("The address contains an @ symbol. Make sure it is not disguising the destination.");
  const riskyWords = ["claim", "bonus", "airdrop", "connect", "verify", "wallet"];
  if (riskyWords.some(word => host.includes(word))) warnings.push("The domain contains wording often used in crypto promotions. This is not proof of a scam.");

  result.className = warnings.length ? "result-box warning" : "result-box neutral";
  const heading = warnings.length ? "Review carefully before interacting" : "No basic pattern warning found";
  const detail = warnings.length ? warnings.slice(0, 2).join(" ") : "This basic demo found no listed pattern. That does not mean the website is safe.";
  result.innerHTML = `<div class="result-icon">${warnings.length ? "!" : "i"}</div><div><b>${heading}</b><span>${detail}</span></div>`;
}
checkButton.addEventListener("click", reviewAddress);
urlInput.addEventListener("keydown", event => {
  if (event.key === "Enter") reviewAddress();
});
