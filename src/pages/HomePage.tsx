import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <section className="animate-fade-in space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-aubergine">{t("home.title")}</h1>
        <p className="text-lg text-gray-500">{t("home.subtitle")}</p>
      </div>

      <p className="rounded-2xl bg-violet/10 p-5 text-lg font-medium italic text-violet">
        “{t("home.lead")}”
      </p>

      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>{t("home.paragraph1")}</p>
        <p>{t("home.paragraph2")}</p>
      </div>
    </section>
  );
};

export default HomePage;
