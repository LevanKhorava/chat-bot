import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type Country = "georgia" | "italy";

// Value passed to the CX agent's "country" variable.
const COUNTRY_VALUES: Record<Country, string> = {
  georgia: "Georgia",
  italy: "Italy",
};

type Variables = Record<string, unknown>;

type ChatMessengerElement = HTMLElement & {
  setVariables?: (variables: Variables) => void;
  // The public reader lives on the element's presenter, not the element itself.
  presenter?: { getVariables?: () => Variables };
};

/**
 * Set the CX session variable "country" on the chat-messenger widget so the
 * Conversational Agent (CES deployment) receives "Georgia" or "Italy".
 *
 * The CES request path sends `variables` (via setVariables/getVariables) with
 * every message — NOT queryParameters, which only the Dialogflow path uses.
 */
const setChatCountry = (country: Country) => {
  const apply = () => {
    const el = document.querySelector<ChatMessengerElement>("chat-messenger");
    if (!el || typeof el.setVariables !== "function") return false;

    // Merge into existing variables so we don't clobber other CX variables.
    const current = el.presenter?.getVariables?.() ?? {};
    el.setVariables({ ...current, country: COUNTRY_VALUES[country] });
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

  useEffect(() => {
    setChatCountry(country);
  }, [country]);

  return (
    <select
      aria-label={t("country.label")}
      value={country}
      onChange={(e) => setCountry(e.target.value as Country)}
      className="cursor-pointer rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white outline-none transition-colors hover:bg-white/20 focus:ring-2 focus:ring-white/40"
    >
      <option value="georgia" className="text-aubergine">
        🇬🇪 {t("country.georgia")}
      </option>
      <option value="italy" className="text-aubergine">
        🇮🇹 {t("country.italy")}
      </option>
    </select>
  );
};

export default CountrySelect;
