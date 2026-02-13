import { useEffect } from "react";

const MERCURE_URL = "/.well-known/mercure";

const TOPIC_URL = "https://api.yourapp.com/invoices";

export const useInvoiceNotifications = (onInvoiceCreated: () => void) => {
  useEffect(() => {
    const url = new URL(MERCURE_URL, window.location.origin); // Ensure absolute URL for EventSource
    url.searchParams.append("topic", TOPIC_URL);

    const eventSource = new EventSource(url.toString());

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status === "created") {
        onInvoiceCreated();
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
    };

    return () => {
      eventSource.close();
    };
  }, [onInvoiceCreated]);
};