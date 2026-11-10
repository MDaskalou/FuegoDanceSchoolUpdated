"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCheckCircle, FaUser, FaEnvelope, FaUsers, FaLightbulb, FaCommentDots } from "react-icons/fa";
import {
    COURSE_KEYS,
    REFERRAL_KEYS,
    ROLE_KEYS,
    analyticsConsentGranted,
    buildGenerateLeadEvent,
    clearRegistrationAttempt,
    getOpenHouseFieldErrors,
    openHouseSubmissionState,
    payloadFingerprint,
    rememberRegistrationId,
    shouldTrackLead,
} from "@/lib/openHouseShared.mjs";

declare global {
    interface Window {
        turnstile?: {
            render: (
                element: HTMLElement,
                options: {
                    sitekey: string;
                    action: string;
                    theme: "dark";
                    callback: (token: string) => void;
                    "error-callback": () => void;
                    "expired-callback": () => void;
                }
            ) => string;
            reset: (widgetId: string) => void;
            remove: (widgetId: string) => void;
        };
    }
}

interface FormData {
    name: string;
    email: string;
    role: string;
    referral: string;
    message: string;
    courses: string[];
}

type FieldKey = "name" | "email" | "role" | "referral";
type FieldErrorMap = Partial<Record<FieldKey, string>>;

const FIELD_ORDER: FieldKey[] = ["name", "email", "role", "referral"];

export default function OpenHouseForm() {
    const { t, i18n } = useTranslation("openhouseTranslation");

    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        role: "",
        referral: "",
        message: "",
        courses: [],
    });
    const [ohHp, setOhHp] = useState("");
    const [fieldErrors, setFieldErrors] = useState<FieldErrorMap>({});
    const [formError, setFormError] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState("");
    const pendingFocus = useRef<FieldKey | null>(null);
    const turnstileRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const roleRef = useRef<HTMLSelectElement>(null);
    const referralRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        const key = pendingFocus.current;
        if (!key || !fieldErrors[key]) return;
        pendingFocus.current = null;
        const field =
            key === "name" ? nameRef.current :
            key === "email" ? emailRef.current :
            key === "role" ? roleRef.current :
            referralRef.current;
        field?.focus({ preventScroll: true });
        document.getElementById(`${key}-field`)?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }, [fieldErrors]);

    const resetTurnstile = () => {
        setTurnstileToken("");
        const widgetId = widgetIdRef.current;
        if (widgetId) window.turnstile?.reset(widgetId);
    };

    useEffect(() => {
        if (!siteKey || !turnstileRef.current) return undefined;
        let cancelled = false;

        const renderWidget = () => {
            if (cancelled || !turnstileRef.current || !window.turnstile || widgetIdRef.current) return;
            widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
                sitekey: siteKey,
                action: "open_house",
                theme: "dark",
                callback: (token: string) => setTurnstileToken(token),
                "error-callback": () => setTurnstileToken(""),
                "expired-callback": () => setTurnstileToken(""),
            });
        };

        const existing = document.querySelector<HTMLScriptElement>("script[data-turnstile]");
        const script = existing || document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.dataset.turnstile = "true";
        script.addEventListener("load", renderWidget);
        if (!existing) document.head.appendChild(script);
        if (window.turnstile) renderWidget();

        return () => {
            cancelled = true;
            script.removeEventListener("load", renderWidget);
            const widgetId = widgetIdRef.current;
            if (widgetId) window.turnstile?.remove(widgetId);
            widgetIdRef.current = null;
        };
    }, [siteKey]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const next = { ...formData, [e.target.name]: e.target.value };
        setFormData(next);
        const field = e.target.name;
        if (field !== "name" && field !== "email" && field !== "role" && field !== "referral") return;
        if (!fieldErrors[field]) return;
        if (getOpenHouseFieldErrors(next)[field]) return;
        setFieldErrors((current) => {
            const updated = { ...current };
            delete updated[field];
            return updated;
        });
    };

    const handleCourseChange = (course: string) => {
        setFormData((prev) => ({
            ...prev,
            courses: prev.courses.includes(course)
                ? prev.courses.filter((item) => item !== course)
                : [...prev.courses, course],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");

        const invalidFields = getOpenHouseFieldErrors(formData);
        const messages: FieldErrorMap = {
            name: invalidFields.name ? t("nameError") : undefined,
            email: invalidFields.email ? t("emailError") : undefined,
            role: invalidFields.role ? t("roleError") : undefined,
            referral: invalidFields.referral ? t("referralError") : undefined,
        };
        const firstInvalid = FIELD_ORDER.find((field) => messages[field]);
        if (firstInvalid) {
            pendingFocus.current = firstInvalid;
            setFieldErrors(messages);
            return;
        }
        setFieldErrors({});
        if (!turnstileToken.trim()) {
            setFormError(t("submitError"));
            resetTurnstile();
            return;
        }

        const language = i18n.language?.startsWith("en") ? "en" : "sv";
        const draft = {
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            role: formData.role,
            referral: formData.referral,
            courses: formData.courses,
            message: formData.message.trim(),
            language,
        };

        setIsSubmitting(true);

        try {
            const fingerprint = await payloadFingerprint(draft);
            const { registrationId } = rememberRegistrationId(sessionStorage, fingerprint);
            const response = await fetch("/api/openhouse/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...draft,
                    registrationId,
                    oh_hp: ohHp,
                    turnstileToken,
                }),
            });

            let data: { ok?: boolean; leadRecorded?: boolean; code?: string } = {};
            try {
                data = await response.json();
            } catch {
                data = {};
            }

            if (response.status === 409 || data.code === "registration_conflict") {
                clearRegistrationAttempt(sessionStorage);
                resetTurnstile();
                setFormError(t("submitError"));
                return;
            }

            if (response.status === 429) {
                resetTurnstile();
                setFormError(t("rateLimitError"));
                return;
            }

            const submissionState = openHouseSubmissionState(data);
            if (!response.ok || submissionState === "rejected") {
                resetTurnstile();
                setFormError(t("submitError"));
                return;
            }

            if (
                submissionState === "created" &&
                analyticsConsentGranted(
                    localStorage.getItem("cookieConsent"),
                    localStorage.getItem("cookiePreferences")
                ) &&
                shouldTrackLead(sessionStorage, registrationId, true)
            ) {
                const dataLayer = (window.dataLayer = window.dataLayer || []);
                dataLayer.push(buildGenerateLeadEvent(draft.courses.length));
            }

            setIsSubmitted(true);
        } catch {
            resetTurnstile();
            setFormError(t("submitError"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = (invalid: boolean) => `
        w-full py-3 px-4 rounded-lg
        bg-gray-800 border-2 text-white
        focus:outline-none focus:ring-2
        transition-all duration-300
        placeholder-gray-500
        ${invalid
            ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
            : "border-gray-700 focus:border-orange-500 focus:ring-orange-500/20"}
    `;

    const labelClasses = "flex items-center gap-2 text-gray-200 text-base font-medium mb-3";

    if (isSubmitted) {
        const descriptionPoints = t("formSubmittedDescription", { returnObjects: true }) as string[];
        const icons = [
            <FaUsers key="schedule" className="text-orange-500" />,
            <FaLightbulb key="open-house" className="text-orange-500" />,
            <FaCheckCircle key="clothes" className="text-orange-500" />,
            <FaCheckCircle key="footwork" className="text-orange-500" />,
            <FaCommentDots key="questions" className="text-orange-500" />,
        ];

        return (
            <div className="pt-24 pb-16 min-h-screen bg-transparent text-white flex items-center justify-center px-4">
                <div className="bg-[#1a1a1a] p-8 sm:p-12 rounded-3xl shadow-2xl max-w-xl w-full text-center border border-orange-500/20">
                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <FaCheckCircle className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                        {t("formSubmittedMessage")}
                    </h1>

                    <div className="space-y-6 text-left">
                        {Array.isArray(descriptionPoints) && descriptionPoints.map((point, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-orange-500/30 transition-colors">
                                <div className="mt-1 flex-shrink-0 bg-gray-800 p-2 rounded-lg">
                                    {icons[index] || <FaCheckCircle className="text-orange-500" />}
                                </div>
                                <p className="text-gray-300 text-base leading-relaxed">
                                    {point}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-16 min-h-screen bg-transparent text-white">
            <div className="container mx-auto max-w-2xl px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 font-serif">
                        {t("formTitle")}
                    </h1>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto">
                        {t("formDescription")}
                    </p>
                </div>

                <div className="bg-[#262626] p-6 sm:p-10 rounded-2xl shadow-2xl border border-orange-500/20">
                    <form onSubmit={handleSubmit} noValidate className="space-y-6">
                        <div aria-hidden="true" className="absolute -left-[10000px] h-0 overflow-hidden">
                            <label htmlFor="oh_hp">Leave blank</label>
                            <input
                                type="text"
                                id="oh_hp"
                                name="oh_hp"
                                tabIndex={-1}
                                autoComplete="oh-hp"
                                autoCorrect="off"
                                autoCapitalize="none"
                                spellCheck={false}
                                data-1p-ignore="true"
                                data-lpignore="true"
                                data-bwignore="true"
                                value={ohHp}
                                onChange={(event) => setOhHp(event.target.value)}
                            />
                        </div>

                        <div id="name-field" className="scroll-mt-28">
                            <label htmlFor="name" className={labelClasses}>
                                <FaUser className="text-orange-500" />
                                {t("nameLabel")} *
                            </label>
                            <input
                                ref={nameRef}
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={inputClasses(Boolean(fieldErrors.name))}
                                placeholder={t("namePlaceholder")}
                                required
                                aria-required="true"
                                aria-invalid={fieldErrors.name ? true : undefined}
                                aria-describedby={fieldErrors.name ? "name-error" : undefined}
                            />
                            {fieldErrors.name && (
                                <p id="name-error" className="mt-2 text-sm text-red-300" role="alert">
                                    {fieldErrors.name}
                                </p>
                            )}
                        </div>

                        <div id="email-field" className="scroll-mt-28">
                            <label htmlFor="email" className={labelClasses}>
                                <FaEnvelope className="text-orange-500" />
                                {t("emailLabel")} *
                            </label>
                            <input
                                ref={emailRef}
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={inputClasses(Boolean(fieldErrors.email))}
                                placeholder={t("emailPlaceholder")}
                                required
                                aria-required="true"
                                aria-invalid={fieldErrors.email ? true : undefined}
                                aria-describedby={fieldErrors.email ? "email-error" : undefined}
                            />
                            {fieldErrors.email && (
                                <p id="email-error" className="mt-2 text-sm text-red-300" role="alert">
                                    {fieldErrors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <h3 className={labelClasses}>
                                <FaUsers className="text-orange-500" />
                                {t("coursesInterestTitle")}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {COURSE_KEYS.map((course) => (
                                    <label
                                        key={course}
                                        className={`
                                            flex items-center space-x-3 p-4 rounded-lg cursor-pointer
                                            transition-all duration-300
                                            ${formData.courses.includes(course)
                                            ? "bg-orange-500/20 border-2 border-orange-500"
                                            : "bg-gray-800 border-2 border-gray-700 hover:border-gray-600"}
                                        `}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.courses.includes(course)}
                                            onChange={() => handleCourseChange(course)}
                                            className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500 focus:ring-2"
                                        />
                                        <span className="text-sm font-medium">{t(`courseLabels.${course}`)}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div id="role-field" className="scroll-mt-28">
                            <label htmlFor="role" className={labelClasses}>
                                <FaUsers className="text-orange-500" />
                                {t("roleTitle")} *
                            </label>
                            <select
                                ref={roleRef}
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className={inputClasses(Boolean(fieldErrors.role))}
                                required
                                aria-required="true"
                                aria-invalid={fieldErrors.role ? true : undefined}
                                aria-describedby={fieldErrors.role ? "role-error" : undefined}
                            >
                                <option value="" disabled>{t("rolePlaceholder")}</option>
                                {ROLE_KEYS.map((role) => (
                                    <option key={role} value={role}>{t(`roleLabels.${role}`)}</option>
                                ))}
                            </select>
                            {fieldErrors.role && (
                                <p id="role-error" className="mt-2 text-sm text-red-300" role="alert">
                                    {fieldErrors.role}
                                </p>
                            )}
                        </div>

                        <div id="referral-field" className="scroll-mt-28">
                            <label htmlFor="referral" className={labelClasses}>
                                <FaLightbulb className="text-orange-500" />
                                {t("referralTitle")} *
                            </label>
                            <select
                                ref={referralRef}
                                id="referral"
                                name="referral"
                                value={formData.referral}
                                onChange={handleChange}
                                className={inputClasses(Boolean(fieldErrors.referral))}
                                required
                                aria-required="true"
                                aria-invalid={fieldErrors.referral ? true : undefined}
                                aria-describedby={fieldErrors.referral ? "referral-error" : undefined}
                            >
                                <option value="" disabled>{t("referralPlaceholder")}</option>
                                {REFERRAL_KEYS.map((referral) => (
                                    <option key={referral} value={referral}>{t(`referralLabels.${referral}`)}</option>
                                ))}
                            </select>
                            {fieldErrors.referral && (
                                <p id="referral-error" className="mt-2 text-sm text-red-300" role="alert">
                                    {fieldErrors.referral}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="message" className={labelClasses}>
                                <FaCommentDots className="text-orange-500" />
                                {t("otherTitle")}
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                className={inputClasses(false)}
                                placeholder={t("messagePlaceholder")}
                            />
                        </div>

                        <div ref={turnstileRef} className="min-h-[65px]" />

                        {formError && (
                            <p className="text-sm text-red-300" role="alert">{formError}</p>
                        )}

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="
                                    w-full bg-orange-500 hover:bg-orange-600 text-white font-bold
                                    py-4 px-6 rounded-full shadow-2xl transition-all duration-300
                                    transform hover:scale-[1.02] active:scale-95
                                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                                    text-lg uppercase tracking-wider
                                "
                            >
                                {isSubmitting ? t("submittingButton") : t("submitButton")}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="text-center text-sm text-gray-400 mt-8 space-y-2 max-w-xl mx-auto">
                    <p>{t("disclaimer1")}</p>
                    <p>{t("disclaimer2")}</p>
                </div>
            </div>
        </div>
    );
}
