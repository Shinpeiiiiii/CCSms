import { useEffect, useRef } from "react";

const DEFAULT_TIMEOUT = 5 * 60 * 60 * 1000; // 5 hours

const EVENTS = [
    "mousemove",
    "mousedown",
    "keydown",
    "scroll",
    "touchstart",
];

const useIdleTimeout = ({
    timeout = DEFAULT_TIMEOUT,
    onIdle,
}) => {

    const lastActivity = useRef(Date.now());

    useEffect(() => {

        const updateActivity = () => {
            lastActivity.current = Date.now();
        };

        EVENTS.forEach((event) => {
            window.addEventListener(
                event,
                updateActivity,
                true
            );
        });

        const interval = setInterval(() => {

            const idleTime =
                Date.now() - lastActivity.current;

            if (idleTime >= timeout) {

                clearInterval(interval);

                onIdle?.();

            }

        }, 60000); // check every minute

        return () => {

            clearInterval(interval);

            EVENTS.forEach((event) => {
                window.removeEventListener(
                    event,
                    updateActivity,
                    true
                );
            });

        };

    }, [timeout, onIdle]);

};

export default useIdleTimeout;