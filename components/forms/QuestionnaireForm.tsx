"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface FormField {
  _key: string;
  label: string;
  name: string;
  type: "text" | "email" | "select" | "textarea" | "radio" | "checkbox";
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

interface QuestionnaireFormProps {
  title: string;
  serviceType: string;
  intro?: string;
  fields: FormField[];
  submitLabel?: string;
  successMessage?: string;
}

export function QuestionnaireForm({
  title,
  serviceType,
  intro,
  fields,
  submitLabel = "Submit",
  successMessage = "Thank you! I'll review your answers and get back to you within 48 hours.",
}: QuestionnaireFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Group fields into steps of 2-3 for multi-step UX
  const stepsPerPage = 2;
  const steps: FormField[][] = [];
  for (let i = 0; i < fields.length; i += stepsPerPage) {
    steps.push(fields.slice(i, i + stepsPerPage));
  }

  const totalSteps = steps.length;
  const isLastStep = currentStep === totalSteps - 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  function updateField(name: string, value: string | string[]) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function toggleCheckbox(name: string, option: string) {
    const current = (formData[name] as string[]) || [];
    const updated = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    updateField(name, updated);
  }

  function canProceed() {
    const currentFields = steps[currentStep];
    return currentFields.every((field) => {
      if (!field.required) return true;
      const val = formData[field.name];
      if (Array.isArray(val)) return val.length > 0;
      return val && val.trim().length > 0;
    });
  }

  async function handleSubmit() {
    if (!isLastStep) {
      setCurrentStep((s) => s + 1);
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType,
          title,
          answers: formData,
        }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-6">
          <span className="text-sage text-2xl">✓</span>
        </div>
        <h3 className="font-serif text-3xl mb-4">You&apos;re All Set</h3>
        <p className="font-sans text-base text-espresso/60 max-w-md mx-auto mb-8">
          {successMessage}
        </p>
        <Button href="/" variant="outline">
          Back to Home
        </Button>
      </motion.div>
    );
  }

  const inputClasses =
    "w-full px-5 py-3.5 rounded-2xl bg-white border border-sand/40 font-sans text-sm text-espresso placeholder:text-espresso/30 focus:outline-none focus:border-sage transition-colors";

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <p className="font-sans text-xs text-espresso/40">
            Step {currentStep + 1} of {totalSteps}
          </p>
          <p className="font-sans text-xs text-espresso/40">
            {Math.round(progress)}%
          </p>
        </div>
        <div className="h-1 bg-sand/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-sage rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {intro && currentStep === 0 && (
        <p className="font-sans text-base text-espresso/60 leading-relaxed mb-8">
          {intro}
        </p>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {steps[currentStep].map((field) => (
            <div key={field._key}>
              <label className="font-sans text-sm font-medium text-espresso mb-2 block">
                {field.label}
                {field.required && <span className="text-terracotta ml-1">*</span>}
              </label>

              {field.type === "text" && (
                <input
                  type="text"
                  value={(formData[field.name] as string) || ""}
                  onChange={(e) => updateField(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className={inputClasses}
                />
              )}

              {field.type === "email" && (
                <input
                  type="email"
                  value={(formData[field.name] as string) || ""}
                  onChange={(e) => updateField(field.name, e.target.value)}
                  placeholder={field.placeholder || "your@email.com"}
                  className={inputClasses}
                />
              )}

              {field.type === "textarea" && (
                <textarea
                  value={(formData[field.name] as string) || ""}
                  onChange={(e) => updateField(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  rows={4}
                  className={`${inputClasses} resize-none`}
                />
              )}

              {field.type === "select" && field.options && (
                <select
                  value={(formData[field.name] as string) || ""}
                  onChange={(e) => updateField(field.name, e.target.value)}
                  className={inputClasses}
                >
                  <option value="">{field.placeholder || "Select an option"}</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {field.type === "radio" && field.options && (
                <div className="space-y-2">
                  {field.options.map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                        formData[field.name] === opt
                          ? "border-sage bg-sage/5"
                          : "border-sand/40 bg-white hover:border-sand"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          formData[field.name] === opt
                            ? "border-sage"
                            : "border-sand"
                        }`}
                      >
                        {formData[field.name] === opt && (
                          <div className="w-2 h-2 rounded-full bg-sage" />
                        )}
                      </div>
                      <span className="font-sans text-sm text-espresso">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {field.type === "checkbox" && field.options && (
                <div className="space-y-2">
                  {field.options.map((opt) => {
                    const checked = ((formData[field.name] as string[]) || []).includes(opt);
                    return (
                      <label
                        key={opt}
                        className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                          checked
                            ? "border-sage bg-sage/5"
                            : "border-sand/40 bg-white hover:border-sand"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border-2 ${
                            checked ? "border-sage bg-sage" : "border-sand"
                          }`}
                        >
                          {checked && (
                            <span className="text-white text-[10px]">✓</span>
                          )}
                        </div>
                        <span className="font-sans text-sm text-espresso">{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-sand/20">
        {currentStep > 0 ? (
          <button
            onClick={() => setCurrentStep((s) => s - 1)}
            className="font-sans text-sm text-espresso/50 hover:text-espresso transition-colors"
          >
            ← Back
          </button>
        ) : (
          <div />
        )}

        <Button
          onClick={handleSubmit}
          variant="primary"
          size="md"
          disabled={!canProceed() || status === "loading"}
        >
          {status === "loading"
            ? "Submitting..."
            : isLastStep
              ? submitLabel
              : "Continue →"}
        </Button>
      </div>

      {status === "error" && (
        <p className="font-sans text-sm text-terracotta text-center mt-4">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}
