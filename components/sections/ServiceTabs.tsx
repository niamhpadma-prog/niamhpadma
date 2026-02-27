"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

interface ServiceItem {
  _id?: string;
  title: string;
  type: string;
  description?: string;
  pricing?: string;
  bookingUrl?: string;
  questionnaireType?: string;
  includes?: string[];
}

interface ServiceTabsProps {
  services: ServiceItem[];
}

const tabOrder = ["1-1 Coaching", "Group Classes", "Workshops", "Corporate"];

export function ServiceTabs({ services }: ServiceTabsProps) {
  const [activeTab, setActiveTab] = useState(tabOrder[0]);

  const grouped = tabOrder.reduce(
    (acc, type) => {
      acc[type] = services.filter((s) => s.type === type);
      return acc;
    },
    {} as Record<string, ServiceItem[]>
  );

  return (
    <Section background="white">
      <Container>
        {/* Tab bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabOrder.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-sans text-sm px-6 py-2.5 rounded-full transition-all duration-300 ${
                activeTab === tab
                  ? "bg-espresso text-cream"
                  : "bg-cream-dark text-espresso/60 hover:text-espresso"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {grouped[activeTab]?.length ? (
              grouped[activeTab].map((service) => (
                <div
                  key={service._id || service.title}
                  id={activeTab.toLowerCase().replace(/\s+/g, "-")}
                  className="bg-cream rounded-3xl p-8 md:p-12"
                >
                  <h3 className="font-serif text-3xl mb-4">{service.title}</h3>
                  {service.description && (
                    <p className="font-sans text-base text-espresso/70 leading-relaxed mb-6 max-w-2xl">
                      {service.description}
                    </p>
                  )}
                  {service.includes && (
                    <ul className="font-sans text-sm text-espresso/60 space-y-2 mb-6">
                      {service.includes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-sage mt-0.5">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex flex-wrap items-center gap-4">
                    {service.pricing && (
                      <span className="font-sans text-lg font-semibold text-terracotta">
                        {service.pricing}
                      </span>
                    )}
                    {service.bookingUrl && (
                      <Button href={service.bookingUrl} variant="primary" size="md">
                        Book Now
                      </Button>
                    )}
                    {service.questionnaireType && (
                      <Button
                        href={`/questionnaires/${service.questionnaireType}`}
                        variant="outline"
                        size="md"
                      >
                        Take the Questionnaire
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="font-sans text-base text-espresso/40">
                  Services coming soon.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </Container>
    </Section>
  );
}
