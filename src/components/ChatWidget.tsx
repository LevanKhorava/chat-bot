import { useEffect } from "react";
import type { DetailedHTMLProps, HTMLAttributes } from "react";
import { closeChat, openChat } from "../lib/chat";
import { saveSelectedProduct } from "../lib/selectedProduct";

const SDK_BASE = "https://www.gstatic.com/chat-messenger/sdk/prod/v1.16";

const DEPLOYMENT_NAME =
  "projects/660780940216/locations/eu/apps/6308cd9f-f98f-4e32-a9b4-9ff8388df9b2/deployments/ceaf5d81-5e70-4b2d-bb22-0af34e723c8c";

// ID of the client-side tool the agent calls once the shopper settles on a
// product: the last segment of the tool's resource name
// (projects/…/apps/…/tools/<id>). The SDK routes CES tool calls to browser
// handlers by this ID, so it must match the tool in the CES app exactly.
const SELECT_PRODUCT_TOOL_ID = "select_product";

type ClientSideFunction = (args: Record<string, unknown>) => unknown;

type ChatMessengerElement = HTMLElement & {
  presenter?: {
    registerClientSideFunctionForAllTools?: (
      toolId: string,
      handler: ClientSideFunction,
    ) => void;
  };
};

type ChatSdk = {
  registerContext: (context: unknown) => void;
  prebuilts: {
    ces: {
      createContext: (options: {
        deploymentName: string;
        tokenBroker: { enableTokenBroker: boolean; enableRecaptcha: boolean };
      }) => unknown;
    };
  };
};

type CustomElementProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
>;

declare global {
  interface Window {
    chatSdk?: ChatSdk;
  }
}

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "chat-messenger": CustomElementProps;
      "chat-messenger-container": CustomElementProps;
    }
  }
}

// Adds the SDK's theme stylesheets and script to <head>. The SDK defines the
// <chat-messenger> custom elements globally and that can't be undone, so this
// runs once per page and is never cleaned up (StrictMode re-runs effects).
const loadChatSdk = () => {
  if (document.getElementById("chat-messenger-sdk")) return;

  for (const theme of ["chat-messenger-default", "chat-messenger-layout"]) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${SDK_BASE}/themes/${theme}.css`;
    document.head.appendChild(link);
  }

  const script = document.createElement("script");
  script.id = "chat-messenger-sdk";
  script.src = `${SDK_BASE}/chat-messenger.js`;
  document.head.appendChild(script);
};

const registerCesContext = () => {
  const sdk = window.chatSdk;
  if (!sdk) return;
  sdk.registerContext(
    sdk.prebuilts.ces.createContext({
      deploymentName: DEPLOYMENT_NAME,
      tokenBroker: {
        enableTokenBroker: true,
        enableRecaptcha: false,
      },
    }),
  );
};

// Runs in the browser when the agent calls the select_product tool. The SDK
// sends the return value back to the agent as the tool response, which is how
// the agent learns the checkout link to show the shopper.
const selectProduct: ClientSideFunction = (args) => {
  const product = saveSelectedProduct(args);
  console.log("CX product selected:", product);
  return { status: "saved", checkoutUrl: `${window.location.origin}/checkout` };
};

// The presenter (and its client-function registry) is created when
// <chat-messenger> connects and survives startNewSession(), so registering once
// on load is enough.
const registerClientTools = () => {
  document
    .querySelector<ChatMessengerElement>("chat-messenger")
    ?.presenter?.registerClientSideFunctionForAllTools?.(
      SELECT_PRODUCT_TOOL_ID,
      selectProduct,
    );
};

const onChatLoaded = () => {
  registerCesContext();
  registerClientTools();
};

const findFileInput = (
  root: Document | ShadowRoot,
): HTMLInputElement | null => {
  const direct = root.querySelector<HTMLInputElement>('input[type="file"]');
  if (direct) return direct;
  for (const el of root.querySelectorAll("*")) {
    if (el.shadowRoot) {
      const found = findFileInput(el.shadowRoot);
      if (found) return found;
    }
  }
  return null;
};

// The chat-messenger SDK only supports uploading images via its own upload
// button; it doesn't listen for clipboard paste. This forwards a pasted image
// to the SDK's hidden file input so paste-to-upload works.
const handlePaste = (e: ClipboardEvent) => {
  const items = e.clipboardData?.items;
  if (!items) return;
  const imgItem = Array.from(items).find((i) => i.type.startsWith("image/"));
  const file = imgItem?.getAsFile();
  if (!file) return;
  const input = findFileInput(document);
  if (!input) return;
  const dt = new DataTransfer();
  dt.items.add(file);
  input.files = dt.files;
  input.dispatchEvent(new Event("change", { bubbles: true }));
  e.preventDefault();
};

/**
 * Floating chat panel pinned to the bottom-right corner, plus the launcher
 * icon shown while it's collapsed. The chat stays mounted the whole time; we
 * only toggle the wrapper's visibility so the session (and the "country"
 * variable) survives collapse/expand.
 */
const ChatWidget = () => {
  useEffect(() => {
    // Must be registered before the SDK is added: <chat-messenger> fires
    // "chat-messenger-loaded" when the SDK defines it and it first renders.
    window.addEventListener("chat-messenger-loaded", onChatLoaded);
    document.addEventListener("paste", handlePaste);
    loadChatSdk();

    return () => {
      window.removeEventListener("chat-messenger-loaded", onChatLoaded);
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  return (
    <>
      {/* Launcher icon: opens the chat */}
      <button
        id="cx-chat-launcher"
        type="button"
        aria-label="Open chat"
        onClick={openChat}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H8l-4 4V5a1 1 0 0 1 1-1z"
            fill="currentColor"
          />
        </svg>
      </button>

      {/* url-allowlist: comma-separated origins allowed to render images.
          blob: and data: are needed so images the user uploads/pastes render
          in the sent message bubble. */}
      <div id="cx-chat-widget" className="cx-collapsed">
        <button
          id="cx-chat-close"
          type="button"
          aria-label="Close chat"
          onClick={closeChat}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <chat-messenger
          // url-allowlist="https://www.ventis.com,https://ik.imagekit.io,https://help.scalapay.com,blob:,data:"
          color-scheme="light"
          max-query-length="1000"
        >
          <chat-messenger-container
            chat-title="VENTIS"
            chat-title-icon="https://gstatic.com/dialogflow-console/common/assets/ccai-favicons/conversational_agents.png"
            enable-file-upload
            enable-audio-input
          />
        </chat-messenger>
      </div>
    </>
  );
};

export default ChatWidget;
