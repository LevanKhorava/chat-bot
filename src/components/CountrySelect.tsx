import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type Country = "georgia" | "italy";

// Value passed to the CX agent's "country" variable.
const COUNTRY_VALUES: Record<Country, string> = {
  georgia: "ie_en",
  italy: "it_it",
};

type Variables = Record<string, unknown>;

type SessionOpts = { retainHistory?: boolean };

type ChatMessengerElement = HTMLElement & {
  setVariables?: (variables: Variables) => void;
  // Starts a fresh CX session (clears history + restarts the bidi client) and
  // fires the "chat-messenger-start-new-session" event.
  startNewSession?: (opts?: SessionOpts) => void;
  // The public readers live on the element's presenter, not the element itself.
  presenter?: {
    getVariables?: () => Variables;
    startNewSession?: (opts?: SessionOpts) => void;
  };
};

/**
 * Ask the chat-messenger widget to begin a brand-new CX session. The SDK exposes
 * startNewSession() on the element (and its presenter); as a last resort we fire
 * the same event the SDK listens for. Returns which path was used, for logging.
 */
const startNewChatSession = (el: ChatMessengerElement): string => {
  if (typeof el.startNewSession === "function") {
    el.startNewSession();
    return "element";
  }
  if (typeof el.presenter?.startNewSession === "function") {
    el.presenter.startNewSession();
    return "presenter";
  }
  el.dispatchEvent(
    new CustomEvent("chat-messenger-start-new-session", { bubbles: true })
  );
  window.dispatchEvent(new CustomEvent("chat-messenger-start-new-session"));
  return "event";
};

/**
 * Set the CX session variable "country" (a locale code such as "ie_en" / "it_it")
 * on the chat-messenger widget so the Conversational Agent (CES deployment)
 * receives it with every message.
 *
 * The CES request path sends `variables` (via setVariables/getVariables) with
 * every message — NOT queryParameters, which only the Dialogflow path uses.
 *
 * When `startNewSession` is true (a user changed the country) we start a fresh
 * session first, then set the variable on that new session so it rides along
 * from the very first message.
 */
const setChatCountry = (
  country: Country,
  { startNewSession }: { startNewSession: boolean }
) => {
  const apply = () => {
    const el = document.querySelector<ChatMessengerElement>("chat-messenger");
    if (!el || typeof el.setVariables !== "function") return false;

    // Capture existing variables BEFORE any reset so we don't clobber other CX
    // variables when we re-apply them onto the fresh session.
    const previous = el.presenter?.getVariables?.() ?? {};

    if (startNewSession) {
      const via = startNewChatSession(el);
      console.log("CX new session started via:", via);
    }

    // Runs synchronously right after startNewSession, so the country is stored
    // before the new session sends anything over the wire.
    el.setVariables({ ...previous, country: COUNTRY_VALUES[country] });
    console.log("CX variables set to:", el.presenter?.getVariables?.());
    return true;
  };

  // The <chat-messenger> element lives in index.html and is defined by the SDK
  // script, which may finish loading after React mounts. Retry until it's ready.
  if (apply()) return;
  window.customElements?.whenDefined("chat-messenger").then(() => {
    if (!apply()) window.setTimeout(apply, 300);
  });
};

const CountrySelect = () => {
  const { t } = useTranslation();
  const [country, setCountry] = useState<Country>("georgia");
  // Only reset the session on an actual user change — not on the initial mount,
  // which would needlessly discard a session that survived a page reload.
  const isInitialMount = useRef(true);

  useEffect(() => {
    const startNewSession = !isInitialMount.current;
    isInitialMount.current = false;
    setChatCountry(country, { startNewSession });
  }, [country]);

  return (
    <select
      aria-label={t("country.label")}
      value={country}
      onChange={(e) => setCountry(e.target.value as Country)}
      className="cursor-pointer rounded-none border border-line bg-white px-3 py-1.5 text-xs font-medium uppercase tracking-[0.1em] text-ink outline-none transition-colors hover:border-ink focus:border-brand focus:ring-2 focus:ring-brand/30"
    >
      <option value="georgia" className="text-ink">
        🇬🇪 {t("country.georgia")}
      </option>
      <option value="italy" className="text-ink">
        🇮🇹 {t("country.italy")}
      </option>
    </select>
  );
};

export default CountrySelect;
