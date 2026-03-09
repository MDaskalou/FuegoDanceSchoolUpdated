// src/components/OpenHouseForm.tsx
"use client";

import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { FaCheckCircle, FaUser, FaEnvelope, FaUsers, FaLightbulb, FaCommentDots } from 'react-icons/fa';

interface FormData {
    name: string;
    email: string;
    role: string;
    referral: string;
    message: string;
    courses: string[];
}

export default function OpenHouseForm() {
    const { t } = useTranslation("openhouseTranslation");

    const courseOptions: string[] = t("courseOptions", { returnObjects: true }) as string[] || [];
    const roleOptions: string[] = t("roleOptions", { returnObjects: true }) as string[] || [];
    const referralOptions: string[] = t("referralOptions", { returnObjects: true }) as string[] || [];

    const [formData, setFormData] = useState<FormData>({
        name: '', email: '', role: '', referral: '', message: '', courses: []
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCourseChange = (course: string) => {
        setFormData(prev => ({
            ...prev,
            courses: prev.courses.includes(course)
                ? prev.courses.filter(c => c !== course)
                : [...prev.courses, course]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validering: Kontrollera att obligatoriska fält är ifyllda
        if (!formData.name || !formData.email || !formData.role || !formData.referral) {
            alert(t('requiredField', { defaultValue: 'Fyll i alla obligatoriska fält (*).' }));
            return;
        }

        setIsSubmitting(true);

        // Din Google Apps Script URL
        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyz1pVbPGyUNspPhDZ0nMTeeenNsBk4o4ZrpN8tcQZTtacTt4CPwGBtb9il3KzKPbM5ig/exec";

        try {
            // Vi skickar datan till Google Sheets
            await fetch(SCRIPT_URL, {
                method: "POST",
                mode: "no-cors", // Viktigt: Gör att vi kan skicka data till Google utan att blockeras
                headers: {
                    "Content-Type": "text/plain", // Viktigt: Förhindrar komplicerade "preflight"-checkar
                },
                body: JSON.stringify(formData), // Vi skickar hela formuläret som ett JSON-paket
            });

            // Eftersom vi använder 'no-cors' får vi inget läsbart svar från Google,
            // så vi antar att det lyckades om inget nätverksfel inträffade.
            console.log('Anmälan skickad till Google Sheet:', formData);
            setIsSubmitted(true);

        } catch (error) {
            console.error("Fel vid sändning till Google Sheet:", error);
            alert("Något gick fel vid sändningen. Vänligen försök igen.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Förbättrade input-klasser
    const inputClasses = `
        w-full py-3 px-4 rounded-lg
        bg-gray-800 border-2 border-gray-700 text-white
        focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20
        transition-all duration-300
        placeholder-gray-500
    `;

    const labelClasses = "flex items-center gap-2 text-gray-200 text-base font-medium mb-3";

    // Success screen
    if (isSubmitted) {
        const descriptionPoints = t('formSubmittedDescription', { returnObjects: true }) as string[];

        // Hjälpfunktion för att välja ikon baserat på textinnehåll
        const getIcon = (index: number) => {
            const icons = [
                <FaUsers className="text-orange-500" />,     // Schema
                <FaLightbulb className="text-orange-500" />, // Öppet hus
                <FaCheckCircle className="text-orange-500" />, // Kläder
                <FaCheckCircle className="text-orange-500" />, // Footwork
                <FaCommentDots className="text-orange-500" />  // Frågor
            ];
            return icons[index] || <FaCheckCircle className="text-orange-500" />;
        };

        return (
            <div className="pt-24 pb-16 min-h-screen bg-transparent text-white flex items-center justify-center px-4">
                <div className="bg-[#1a1a1a] p-8 sm:p-12 rounded-3xl shadow-2xl max-w-xl w-full text-center border border-orange-500/20">
                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <FaCheckCircle className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                        {t('formSubmittedMessage')}
                    </h1>


                    <div className="space-y-6 text-left">
                        {Array.isArray(descriptionPoints) && descriptionPoints.map((point, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-orange-500/30 transition-colors">
                                <div className="mt-1 flex-shrink-0 bg-gray-800 p-2 rounded-lg">
                                    {getIcon(index)}
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

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 font-serif">
                        {t('formTitle', { defaultValue: 'Föranmäl dig till Vinterkurserna' })}
                    </h1>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto">
                        {t('formDescription', { defaultValue: 'Fyll i formuläret nedan så kontaktar vi dig med mer information.' })}
                    </p>
                </div>

                {/* Form Container */}
                <div className="bg-[#262626] p-6 sm:p-10 rounded-2xl shadow-2xl border border-orange-500/20">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Namn */}
                        <div>
                            <label htmlFor="name" className={labelClasses}>
                                <FaUser className="text-orange-500" />
                                {t('nameLabel', { defaultValue: 'Namn' })} *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={inputClasses}
                                placeholder={t('namePlaceholder', { defaultValue: 'Ditt fullständiga namn' })}
                                required
                            />
                        </div>

                        {/* E-post */}
                        <div>
                            <label htmlFor="email" className={labelClasses}>
                                <FaEnvelope className="text-orange-500" />
                                {t('emailLabel', { defaultValue: 'E-post' })} *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={inputClasses}
                                placeholder={t('emailPlaceholder', { defaultValue: 'din@email.com' })}
                                required
                            />
                        </div>

                        {/* Kurser - Förbättrad design */}
                        <div>
                            <h3 className={labelClasses}>
                                <FaUsers className="text-orange-500" />
                                {t('coursesInterestTitle', { defaultValue: 'Vilka kurser är du intresserad av?' })}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {courseOptions.map(course => (
                                    <label
                                        key={course}
                                        className={`
                                            flex items-center space-x-3 p-4 rounded-lg cursor-pointer
                                            transition-all duration-300
                                            ${formData.courses.includes(course)
                                            ? 'bg-orange-500/20 border-2 border-orange-500'
                                            : 'bg-gray-800 border-2 border-gray-700 hover:border-gray-600'}
                                        `}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.courses.includes(course)}
                                            onChange={() => handleCourseChange(course)}
                                            className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500 focus:ring-2"
                                        />
                                        <span className="text-sm font-medium">{course}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Förare/Följare */}
                        <div>
                            <label htmlFor="role" className={labelClasses}>
                                <FaUsers className="text-orange-500" />
                                {t('roleTitle', { defaultValue: 'Förare eller Följare' })} *
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className={inputClasses}
                                required
                            >
                                {roleOptions.map((option, index) => (
                                    <option
                                        key={option}
                                        value={index === 0 ? '' : option}
                                        disabled={index === 0}
                                    >
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Hur hittade du oss? */}
                        <div>
                            <label htmlFor="referral" className={labelClasses}>
                                <FaLightbulb className="text-orange-500" />
                                {t('referralTitle', { defaultValue: 'Hur hittade du oss?' })} *
                            </label>
                            <select
                                id="referral"
                                name="referral"
                                value={formData.referral}
                                onChange={handleChange}
                                className={inputClasses}
                                required
                            >
                                {referralOptions.map((option, index) => (
                                    <option
                                        key={option}
                                        value={index === 0 ? '' : option}
                                        disabled={index === 0}
                                    >
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Övrigt */}
                        <div>
                            <label htmlFor="message" className={labelClasses}>
                                <FaCommentDots className="text-orange-500" />
                                {t('otherTitle', { defaultValue: 'Övrigt' })}
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                className={inputClasses}
                                placeholder={t('messagePlaceholder', { defaultValue: 'Finns det något annat vi bör veta?' })}
                            />
                        </div>

                        {/* Submit Button */}
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
                                {isSubmitting
                                    ? t('submittingButton', { defaultValue: 'Skickar...' })
                                    : t('submitButton', { defaultValue: 'Skicka Anmälan' })
                                }
                            </button>
                        </div>

                    </form>
                </div>

                {/* Disclaimer */}
                <div className="text-center text-sm text-gray-400 mt-8 space-y-2 max-w-xl mx-auto">
                    <p>{t('disclaimer1', { defaultValue: 'Genom att skicka in detta formulär godkänner du att vi behandlar dina personuppgifter.' })}</p>
                    <p>{t('disclaimer2', { defaultValue: 'Vi använder endast din information för att kontakta dig om kurserna.' })}</p>
                </div>

            </div>
        </div>
    );
}