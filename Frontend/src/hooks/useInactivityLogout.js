import { useEffect, useRef } from "react";

const DEFAULT_TIMEOUT = 10 * 60 * 1000;
export const useInactivityLogout = ({
    logoutFn,
    timeout = DEFAULT_TIMEOUT,
    events = ["mousemove"],
}) => {
    const timeoutRef = useRef(null);

    const resetInactivityTimer = () => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            logoutFn?.();
        }, timeout);
    };
    useEffect(() => {
        resetInactivityTimer();

        events.forEach((event) => window.addEventListener(event, resetInactivityTimer));

        return () => {
            clearTimeout(timeoutRef.current);
            events.forEach((event) =>
                window.removeEventListener(event, resetInactivityTimer)
            );
        };
    }, [timeout, events, logoutFn]);
}