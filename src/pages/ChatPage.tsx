import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ChatPage = () => {
  const { t } = useTranslation();

  const messages = [
    { key: "message1", mine: false },
    { key: "message2", mine: true },
    { key: "message3", mine: false },
    { key: "message4", mine: true },
  ];

  return (
    <section className="animate-fade-in space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-aubergine">{t("chat.title")}</h1>
        <p className="text-lg text-gray-500">{t("chat.subtitle")}</p>
      </div>

      <div className="space-y-3 rounded-2xl bg-white p-5 shadow-sm">
        {messages.map(({ key, mine }) => (
          <div
            key={key}
            className={`flex ${mine ? "justify-end" : "justify-start"}`}
          >
            <p
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                mine
                  ? "bg-violet text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {t(`chat.${key}`)}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder={t("chat.placeholder")}
          className="flex-1 rounded-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-violet"
        />
        <button
          type="button"
          className="rounded-full bg-violet px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          {t("chat.send")}
        </button>
      </div>

      <Link
        to="/"
        className="inline-block text-sm font-medium text-violet hover:underline"
      >
        ← {t("chat.back")}
      </Link>
    </section>
  );
};

export default ChatPage;
