import Link from "next/link";
import { FaCircle } from "react-icons/fa";
import Image from "next/image";
import { getServerT } from "@/i18n";
import aboutLeft from "../../public/img/About/Aboutleft1.jpg";
import aboutRight from "../../public/img/About/Aboutright1.jpg";
import about6 from "../../public/img/About/About6.jpg";
import about7 from "../../public/img/About/About7.jpg";
import about8 from "../../public/img/About/About8.jpg";

interface AboutProps {
    lang: string;
}

export default async function About({ lang }: AboutProps) {
    const t = await getServerT(lang, "aboutTranslation");

    const cardBaseClasses = "p-6 sm:p-8 rounded-xl shadow-xl backdrop-blur-sm";
    const uniquePoints = [t("uniquePoint1"), t("uniquePoint2")];
    const studentGoals = [t("goalPoint1"), t("goalPoint2"), t("goalPoint3"), t("goalPoint4")];

    return (
        <section
            id="about-section"
            className="relative scroll-mt-28 overflow-x-hidden bg-transparent py-16 text-white sm:py-24"
        >
            {/* Side images are positioned against the SECTION, not the text column */}
            <div className="absolute left-0 top-[15%] z-10 hidden h-80 w-64 -rotate-2 overflow-hidden rounded-xl shadow-2xl ring-2 ring-orange-500 ring-offset-2 ring-offset-[#1a1a1a] md:block md:h-96 md:w-80 lg:top-1/4">
                <div className="relative h-full w-full">
                    <Image
                        src={aboutLeft}
                        alt={t("aboutImgLeftAlt")}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        sizes="(max-width: 768px) 0vw, 320px"
                        placeholder="blur"
                    />
                </div>
            </div>

            <div className="absolute left-0 top-[65%] z-10 hidden w-64 grid-cols-2 gap-2 md:grid md:w-80">
                <div className="relative row-span-2 h-64 overflow-hidden rounded-lg border-2 border-orange-500/50 shadow-lg rotate-[-2deg] md:h-72">
                    <Image
                        src={about8}
                        alt="Fuego moment large"
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-110"
                        sizes="200px"
                        placeholder="blur"
                    />
                </div>
                <div className="relative h-32 overflow-hidden rounded-lg border-2 border-orange-500/50 shadow-lg rotate-[2deg] md:h-36">
                    <Image
                        src={about6}
                        alt="Fuego moment small 1"
                        fill
                        className="object-cover object-top transition-transform duration-700 hover:scale-110"
                        sizes="150px"
                        placeholder="blur"
                    />
                </div>
                <div className="relative h-32 overflow-hidden rounded-lg border-2 border-orange-500/50 shadow-lg rotate-[-1deg] md:h-36">
                    <Image
                        src={about7}
                        alt="Fuego moment small 2"
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-110"
                        sizes="150px"
                        placeholder="blur"
                    />
                </div>
            </div>

            <div className="absolute right-0 top-1/3 z-10 hidden h-80 w-64 rotate-2 overflow-hidden rounded-xl shadow-2xl ring-2 ring-orange-500 ring-offset-2 ring-offset-[#1a1a1a] md:top-1/2 md:block md:h-96 md:w-80">
                <div className="relative h-full w-full">
                    <Image
                        src={aboutRight}
                        alt={t("aboutImgRightAlt")}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        sizes="(max-width: 768px) 0vw, 320px"
                        placeholder="blur"
                    />
                </div>
            </div>

            <div className="container relative z-20 mx-auto max-w-5xl px-4">
                <h2 className="mb-10 text-center text-4xl font-bold text-orange-500 drop-shadow-lg sm:text-5xl">
                    {t("aboutTitle")}
                </h2>

                <div className={`mx-auto mb-16 max-w-3xl border border-white/10 bg-[#262626]/90 ${cardBaseClasses}`}>
                    <p className="mb-6 text-lg leading-relaxed text-gray-200">{t("aboutText1")}</p>
                    <p className="mb-6 text-lg leading-relaxed text-gray-200">{t("aboutText2")}</p>
                    <p className="text-lg leading-relaxed text-gray-200">{t("aboutText3")}</p>
                </div>

                <h3 className="mb-8 text-center text-2xl font-bold drop-shadow-md sm:text-3xl">
                    {t("uniqueTitle")}
                </h3>
                <div className={`mx-auto mb-16 max-w-3xl border border-white/10 bg-[#262626]/90 ${cardBaseClasses}`}>
                    <ul className="space-y-6">
                        {uniquePoints.map((point, index) => (
                            <li key={index} className="flex items-start">
                                <FaCircle className="mr-3 mt-2 h-2 w-2 flex-shrink-0 text-orange-500" />
                                <span className="text-lg text-gray-200">{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <h3 className="mb-8 text-center text-2xl font-bold drop-shadow-md sm:text-3xl">
                    {t("studentGoalTitle")}
                </h3>
                <div className={`mx-auto mb-16 max-w-3xl border border-white/10 bg-[#262626]/90 ${cardBaseClasses}`}>
                    <ul className="space-y-6">
                        {studentGoals.map((goal, index) => (
                            <li key={index} className="flex items-start">
                                <FaCircle className="mr-3 mt-2 h-2 w-2 flex-shrink-0 text-orange-500" />
                                <span className="text-lg text-gray-200">{goal}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-12 text-center">
                    <Link
                        href={`/${lang}/instructors`}
                        className="inline-block rounded-full bg-orange-500 px-10 py-4 text-lg font-bold uppercase tracking-wider text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-orange-600 active:scale-95"
                    >
                        {t("ctaInstructor")}
                    </Link>
                </div>
            </div>
        </section>
    );
}
