import { defineField, defineType } from "sanity";

export const courseEnrollment = defineType({
  name: "courseEnrollment",
  title: "Course Enrollments",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "course",
      title: "Course",
      type: "reference",
      to: [{ type: "course" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "stripeSessionId",
      title: "Stripe Session ID",
      type: "string",
    }),
    defineField({
      name: "stripeCustomerId",
      title: "Stripe Customer ID",
      type: "string",
    }),
    defineField({
      name: "purchasedAt",
      title: "Purchased At",
      type: "datetime",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["active", "refunded"] },
      initialValue: "active",
    }),
  ],
  preview: {
    select: { email: "email", courseTitle: "course.title", status: "status" },
    prepare: ({ email, courseTitle, status }) => ({
      title: email,
      subtitle: `${courseTitle || "Unknown course"} — ${status}`,
    }),
  },
});
