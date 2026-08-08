import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type Country = "georgia" | "italy";

// Value passed to the CX agent's "country" session parameter.
const COUNTRY_VALUES: Record<Country, string> = {
  georgia: "Georgia",
  italy: "Italy",
};

type QueryParameters = {
  parameters?: Record<string, unknown>;
  [key: string]: unknown;
};

type ChatMessengerElement = HTMLElement & {
  setQueryParameters?: (params: QueryParameters) => void;
  // The public reader lives on the element's presenter, not the element itself.
  presenter?: { getQueryParameters?: () => QueryParameters };
};

/**
 * Set the CX session parameter "country" on the chat-messenger widget so the
 * Conversational Agent receives "Georgia" or "Italy".
 */
const setChatCountry = (country: Country) => {
  const apply = () => {
    const el = document.querySelector<ChatMessengerElement>("chat-messenger");
    if (!el || typeof el.setQueryParameters !== "function") return false;

    // Merge into existing query parameters so we don't clobber other params.
    const current = el.presenter?.getQueryParameters?.() ?? {};
    console.log("Current query parameters:", current);
    el.setQueryParameters({
      ...current,
      parameters: {
        ...current.parameters,
        country: COUNTRY_VALUES[country],
      },
    });
    console.log(
      "Updated query parameters:",
      el.presenter?.getQueryParameters?.(),
    );
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
