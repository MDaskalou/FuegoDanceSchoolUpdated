import { Suspense } from "react";
import BookingCompleteClient from "./BookingCompleteClient";

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Laddar...</div>}>
            <BookingCompleteClient />
        </Suspense>
    );
}