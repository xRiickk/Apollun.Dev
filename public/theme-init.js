try {
  const savedTheme = localStorage.getItem("apollun-theme");
  document.documentElement.dataset.theme =
    savedTheme ||
    (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
} catch {
  document.documentElement.dataset.theme = "dark";
}
