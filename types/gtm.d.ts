interface Window {
    /**
     * Must stay identical to the augmentation in @next/third-parties.
     * Optional because the queue is created by the consent bootstrap and GTM init.
     */
    dataLayer?: Object[];
    gtag?: (...args: unknown[]) => void;
}
