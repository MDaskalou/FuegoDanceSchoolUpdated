interface Window {
    /**
     * Must stay identical to the augmentation in @next/third-parties.
     * Optional because the queue is created by the consent bootstrap and GTM init.
     */
    dataLayer?: Object[];
    gtag?: (...args: unknown[]) => void;
    /** Set when the beforeInteractive script already replayed a stored choice. */
    __fuegoConsentBootstrapped?: boolean;
}
