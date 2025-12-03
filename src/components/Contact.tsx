"use client";

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaCheckCircle } from 'react-icons/fa';

export const ContactSection = () => {
    const { t, i18n } = useTranslation("footerTranslation");

    // State för formulärdata och status
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);


    const FORMSPREE_ENDPOINT = "https://formspree.io/f/xvgeryyd";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Säkerhetskoll så man inte glömmer länken
        if (FORMSPREE_ENDPOINT.includes("DIN_UNIKA_KOD")) {
            alert("Du måste klistra in din Formspree-länk i koden först!");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setIsSubmitted(true);
                setFormData({ name: '', email: '', message: '' }); // Rensa formuläret
            } else {
                alert("Något gick fel. Vänligen försök igen eller maila oss direkt.");
            }
        } catch (error) {
            console.error("Fel vid sändning:", error);
            alert("Något gick fel. Kontrollera din anslutning.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="pt-24 pb-16 bg-transparent min-h-screen text-white">
            <div className="container mx-auto max-w-6xl px-4 text-center">

                <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-orange-500">
                    {t('contactTitle', { defaultValue: 'Kontakta Oss' })}
                </h2>

                <p className="text-xl text-gray-300 mb-12">
                    {t('contactIntroText', { defaultValue: 'Har du frågor? Fyll i formuläret nedan så återkommer vi snart!' })}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                    {/* Kolumn 1: Kontaktformulär */}
                    <div>
                        <h3 className="text-3xl font-bold mb-6 text-orange-500">
                            {t('formTitle', { defaultValue: 'Skicka ett meddelande' })}
                        </h3>

                        {isSubmitted ? (
                            <div className="bg-[#262626] p-8 rounded-xl border border-orange-500/30 text-center animate-fadeIn">
                                <FaCheckCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                                <h4 className="text-2xl font-bold text-white mb-2">Tack för ditt meddelande!</h4>
                                <p className="text-gray-300">Vi återkommer till dig så snart vi kan.</p>
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="mt-6 text-orange-500 hover:text-orange-400 font-semibold underline"
                                >
                                    Skicka ett till meddelande
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2">
                                        {t('formNameLabel', { defaultValue: 'Namn' })}
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="shadow appearance-none border rounded w-full py-3 px-4 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 border-gray-700 text-white focus:border-orange-500 transition-colors"
                                        placeholder={t('formNamePlaceholder', { defaultValue: 'Ditt namn' })}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">
                                        {t('formEmailLabel', { defaultValue: 'E-post' })}
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="shadow appearance-none border rounded w-full py-3 px-4 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 border-gray-700 text-white focus:border-orange-500 transition-colors"
                                        placeholder={t('formEmailPlaceholder', { defaultValue: 'din.epost@example.com' })}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-gray-300 text-sm font-bold mb-2">
                                        {t('formMessageLabel', { defaultValue: 'Meddelande' })}
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={5}
                                        className="shadow appearance-none border rounded w-full py-3 px-4 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 border-gray-700 text-white focus:border-orange-500 transition-colors"
                                        placeholder={t('formMessagePlaceholder', { defaultValue: 'Ditt meddelande här...' })}
                                        required
                                        disabled={isSubmitting}
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`
                                        w-full font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300
                                        ${isSubmitting
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-orange-500 hover:bg-orange-600 text-white'}
                                    `}
                                >
                                    {isSubmitting
                                        ? t('formSending', { defaultValue: 'Skickar...' })
                                        : t('formSubmitButton', { defaultValue: 'Skicka meddelande' })}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Kolumn 2: Karta & Direktkontaktinfo */}
                    <div>
                        <h3 className="text-3xl font-bold mb-6 text-orange-500">
                            {t('findUsTitle', { defaultValue: 'Hitta oss' })}
                        </h3>
                        {/* Google Maps Embed */}
                        <div className="relative w-full h-80 bg-gray-800 rounded-xl overflow-hidden mb-8 shadow-lg border border-gray-700">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1825.2952402170364!2d11.964998399999999!3d57.697555699999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x464ff362247fb487%3A0xc368a5c6c06a4b16!2sDoktor%20Westrings%20gata%2014D%2C%20413%2024%20G%C3%B6teborg!5e0!3m2!1ssv!2sse!4v1709477025852!5m2!1ssv!2sse"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={false}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Fuego Dance School Location"
                            ></iframe>
                        </div>

                        {/* Direkt kontaktinfo */}
                        <div className="space-y-4">
                            <div className="flex items-center text-lg text-gray-300">
                                <FaMapMarkerAlt className="text-orange-500 mr-4 flex-shrink-0" />
                                <span>
                                    {t('address', { defaultValue: 'Doktor Westrings Gata 14D' })}<br/>
                                    {t('city', { defaultValue: '413 24 Göteborg' })}
                                </span>
                            </div>
                            <div className="flex items-center text-lg text-gray-300">
                                <FaEnvelope className="text-orange-500 mr-4 flex-shrink-0" />
                                <a href="mailto:info@fuegodanceschool.se" className="hover:text-white transition-colors">
                                    {t('email', { defaultValue: 'info@fuegodanceschool.se' })}
                                </a>
                            </div>
                            <div className="flex items-center text-lg text-gray-300">
                                <FaPhone className="text-orange-500 mr-4 flex-shrink-0" />
                                <a href="tel:+46701234567" className="hover:text-white transition-colors">
                                    {t('phone', { defaultValue: '+46 70 123 45 67' })}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};