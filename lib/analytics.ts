declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(action: string, params?: Record<string, string | number>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, params);
  }
}

// Pre-defined events
export const events = {
  ctaClick: (label: string, location: string) =>
    trackEvent("cta_click", { cta_label: label, cta_location: location }),

  formStart: (formName: string) =>
    trackEvent("form_start", { form_name: formName }),

  formSubmit: (formName: string) =>
    trackEvent("form_submit", { form_name: formName }),

  questionnaireStep: (type: string, step: number) =>
    trackEvent("questionnaire_step", { questionnaire_type: type, step }),

  newsletterSubscribe: () =>
    trackEvent("newsletter_subscribe"),

  eventView: (eventTitle: string) =>
    trackEvent("event_view", { event_title: eventTitle }),

  blogRead: (postTitle: string) =>
    trackEvent("blog_read", { post_title: postTitle }),
};
