// src/components/ContactSection.tsx
"use client";

import React, { useState } from 'react'; // NYTT: useState för formulär
import { useTranslation } from 'react-i18next';
import Link from 'next/link'; // Används fortfarande för CTA om formulär inte skickas
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa'; // Nya ikoner

export const ContactSection = () => {
    const { t, i18n } = useTranslation("footerTranslation");
    const currentLang = i18n.language;

    // NYTT: State för formulärdata
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Här skulle du normalt skicka data till din backend/API
        console.log('Formulär skickat:', formData);
        alert(t('formSubmittedMessage', { defaultValue: 'Tack för ditt meddelande!' }));
        // Återställ formuläret
        setFormData({ name: '', email: '', message: '' });
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
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 border-gray-700 text-white"
                                    placeholder={t('formNamePlaceholder', { defaultValue: 'Ditt namn' })}
                                    required
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
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 border-gray-700 text-white"
                                    placeholder={t('formEmailPlaceholder', { defaultValue: 'din.epost@example.com' })}
                                    required
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
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 border-gray-700 text-white"
                                    placeholder={t('formMessagePlaceholder', { defaultValue: 'Ditt meddelande här...' })}
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
                            >
                                {t('formSubmitButton', { defaultValue: 'Skicka meddelande' })}
                            </button>
                        </form>
                    </div>

                    {/* Kolumn 2: Karta & Direktkontaktinfo */}
                    <div>
                        <h3 className="text-3xl font-bold mb-6 text-orange-500">
                            {t('findUsTitle', { defaultValue: 'Hitta oss' })}
                        </h3>
                        {/* Google Maps Embed (Använd din egen iframe-kod här) */}
                        <div className="relative w-full h-80 bg-gray-800 rounded-xl overflow-hidden mb-8 shadow-lg border border-gray-700">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1825.2952402170364!2d11.964998399999999!3d57.697555699999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x464ff362247fb487%3A0xc368a5c6c06a4b16!2sDoktor%20Westrings%20gata%2014D%2C%20413%2024%20G%C3%B6teborg!5e0!3m2!1ssv!2sse!4v1709477025852!5m2!1ssv!2sse"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={false} // Bättre att inte ha den fullskärm per default
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
                                <a href="mailto:info@fuegoschool.se" className="hover:text-white transition-colors">
                                    {t('email', { defaultValue: 'info@fuegoschool.se' })}
                                </a>
                            </div>
                            {/* Lägg till telefonnummer om du vill */}
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