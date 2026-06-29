import { siteSettings } from "./siteSettings";
import { page } from "./page";
import { service } from "./service";
import { event } from "./event";
import { post } from "./post";
import { testimonial } from "./testimonial";
import { questionnaire } from "./questionnaire";
import { locationPage } from "./locationPage";
import { submission } from "./submission";
import { course } from "./course";
import { courseModule } from "./courseModule";
import { courseLesson } from "./courseLesson";
import { courseEnrollment } from "./courseEnrollment";
import { captionedImage } from "./_shared";

export const schemaTypes = [
  captionedImage,
  siteSettings,
  page,
  service,
  event,
  post,
  testimonial,
  questionnaire,
  locationPage,
  submission,
  course,
  courseModule,
  courseLesson,
  courseEnrollment,
];
