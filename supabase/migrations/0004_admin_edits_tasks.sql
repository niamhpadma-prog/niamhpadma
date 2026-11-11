-- Let Niamh edit task wording from the portal, while clients can still only
-- tick and untick. Column grants can't tell the two apart (both sign in the
-- same way), so a trigger enforces it instead.
grant update on public.tasks to authenticated;

create function public.tasks_clients_only_tick()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if not public.is_admin() and (
    new.body is distinct from old.body
    or new.detail is distinct from old.detail
    or new.section is distinct from old.section
    or new.sort is distinct from old.sort
    or new.user_id is distinct from old.user_id
    or new.created_at is distinct from old.created_at
  ) then
    raise exception 'Only Niamh can change the wording of a task.';
  end if;
  return new;
end;
$$;

create trigger tasks_clients_only_tick
  before update on public.tasks
  for each row execute function public.tasks_clients_only_tick();
