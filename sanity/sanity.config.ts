"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";

export default defineConfig({
  name: "niamh-padma",
  title: "Niamh Padma",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Site Settings")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.divider(),
            S.listItem()
              .title("Courses")
              .child(
                S.list()
                  .title("Courses")
                  .items([
                    S.documentTypeListItem("course").title("All Courses"),
                    S.documentTypeListItem("courseModule").title("Modules"),
                    S.documentTypeListItem("courseLesson").title("Lessons"),
                    S.divider(),
                    S.documentTypeListItem("courseEnrollment").title("Enrollments"),
                  ])
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) =>
                !["siteSettings", "course", "courseModule", "courseLesson", "courseEnrollment"].includes(
                  item.getId()!
                )
            ),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
