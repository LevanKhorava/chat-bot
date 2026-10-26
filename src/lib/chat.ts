// Opens the floating chat widget rendered by ChatWidget. It reuses the exact
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

// Collapses the chat back to the launcher icon. The <chat-messenger> element
// stays mounted, so the session survives.
export function closeChat(): void {
  const widget = document.getElementById("cx-chat-widget");
  const launcher = document.getElementById(
    "cx-chat-launcher"
  ) as HTMLButtonElement | null;

  widget?.classList.add("cx-collapsed");
  if (launcher) launcher.hidden = false;
}
