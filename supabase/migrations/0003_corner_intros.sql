-- Short introductions Niamh writes above the checklist and the resources on a
-- corner (Markdown).
alter table public.corners
  add column checklist_intro text,
  add column resources_intro text;
