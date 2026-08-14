"use client";

import React from "react";
import { useTranslation } from "react-i18next";

export default function PrivacyPolicyClient() {
    const { t } = useTranslation("privacyPolicyTranslation");

    return (
        <section className="min-h-screen bg-[#121212] px-4 py-20 text-gray-300">
            <div className="mx-auto max-w-3xl space-y-8">
                <div className="mb-12 text-center">
                    <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                        {t("title")}
                    </h1>
                    <div className="mx-auto mb-4 h-1 w-20 rounded-full bg-orange-500" />
                    <p className="text-sm text-gray-500">{t("lastUpdated")}</p>
                </div>

                <div className="space-y-8 leading-relaxed">
                    <section>
                        <h2 className="mb-3 text-xl font-bold text-white">
                            {t("sections.controller.title")}
                        </h2>
                        <p>{t("sections.controller.body")}</p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-bold text-white">
                            {t("sections.cookies.title")}
                        </h2>
                        <p>{t("sections.cookies.body")}</p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-bold text-white">
                            {t("sections.howWeUse.title")}
                        </h2>
                        <p>{t("sections.howWeUse.intro")}</p>
                        <ul className="mt-3 list-disc space-y-2 pl-5">
                            <li>
                                <strong className="text-white">
                                    {t("sections.howWeUse.necessaryLabel")}:
                                </strong>{" "}
                                {t("sections.howWeUse.necessary")}
                            </li>
                            <li>
                                <strong className="text-white">
                                    {t("sections.howWeUse.analyticsLabel")}:
                                </strong>{" "}
                                {t("sections.howWeUse.analytics")}
                            </li>
                            <li>
                                <strong className="text-white">
                                    {t("sections.howWeUse.marketingLabel")}:
                                </strong>{" "}
                                {t("sections.howWeUse.marketing")}
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-bold text-white">
                            {t("sections.tools.title")}
                        </h2>
                        <p>{t("sections.tools.body")}</p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-bold text-white">
                            {t("sections.legalBasis.title")}
                        </h2>
                        <p>{t("sections.legalBasis.body")}</p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-bold text-white">
                            {t("sections.manage.title")}
                        </h2>
                        <p>{t("sections.manage.body")}</p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-bold text-white">
                            {t("sections.rights.title")}
                        </h2>
                        <p>{t("sections.rights.body")}</p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-bold text-white">
                            {t("sections.contact.title")}
                        </h2>
                        <p>{t("sections.contact.body")}</p>
                        <p className="mt-2 text-orange-400">
                            {t("sections.contact.email")}
                            <br />
                            {t("sections.contact.location")}
                        </p>
                    </section>
                </div>
            </div>
        </section>
    );
}
