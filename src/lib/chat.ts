// Opens the floating chat widget that lives in index.html. It reuses the exact
// state the launcher/close controls toggle, so any React CTA (hero button,
// product "Order in chat", footer links) can start a live shopping conversation.
export function openChat(): void {
  const widget = document.getElementById("cx-chat-widget");
  const launcher = document.getElementById(
    "cx-chat-launcher"
  ) as HTMLButtonElement | null;

  widget?.classList.remove("cx-collapsed");
  if (launcher) launcher.hidden = true;
}
