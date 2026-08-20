import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <section className="animate-fade-in space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-extrabold uppercase tracking-tight text-ink">
          {t("home.title")}
        </h1>
        <p className="text-lg text-muted">{t("home.subtitle")}</p>
      </div>

      <blockquote className="border-l-2 border-brand bg-paper p-5 text-lg font-medium italic text-ink">
        “{t("home.lead")}”
      </blockquote>

      <div className="space-y-4 leading-relaxed text-ink/80">
        <p>{t("home.paragraph1")}</p>
        <p>{t("home.paragraph2")}</p>
      </div>
    </section>
  );
};

export default HomePage;
