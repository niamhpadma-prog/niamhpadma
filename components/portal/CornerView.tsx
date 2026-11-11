import type { CornerData, Resource } from "@/lib/portal/corner";
import { Markdown } from "./Markdown";
import { TaskList } from "./TaskList";
import { MediaItem } from "./MediaItem";
import { NoteReply } from "./NoteReply";
import { MessageThread } from "./MessageThread";
import { PracticeDays } from "./PracticeDays";
import { EditableField } from "./edit/EditableField";
import { TaskListAdmin } from "./edit/TaskListAdmin";
import { NewWeeklyNote, WeeklyNoteAdmin } from "./edit/WeeklyNoteAdmin";
import { ResourceAdmin } from "./edit/ResourceAdmin";

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long" });

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-[28px] mt-9 mb-2.5 pt-7 border-t border-cream-dark">
      {children}
    </h2>
  );
}

// One client's corner. With `asAdmin`, Niamh sees the same page plus Edit
// buttons, and empty sections stay visible so she can fill them in.
export function CornerView({
  data,
  viewerId,
  asAdmin,
}: {
  data: CornerData;
  viewerId: string;
  asAdmin: boolean;
}) {
  const clientId = data.clientId;
  const noteOptions = data.notes.map((n) => ({ id: n.id, label: n.title }));

  // Group the checklist by heading ("To Begin", then any later lists).
  const sections = [...new Set(data.tasks.map((t) => t.section))];
  if (asAdmin && sections.length === 0) sections.push("To Begin");

  const media = (r: Resource) =>
    asAdmin ? (
      <ResourceAdmin key={r.id} clientId={clientId} resource={r} notes={noteOptions}>
        <MediaItem resource={r} />
      </ResourceAdmin>
    ) : (
      <MediaItem key={r.id} resource={r} />
    );

  const title = <h1 className="font-serif text-[clamp(36px,6vw,52px)] leading-tight">{data.title}</h1>;
  const intro = data.intro ? <Markdown className="mt-4">{data.intro}</Markdown> : null;

  return (
    <article className="bg-white rounded-[20px] border border-cream-dark px-6 py-8 sm:px-14 sm:py-14">
      {asAdmin ? (
        <>
          <EditableField clientId={clientId} field="title" label="Title" value={data.title} multiline={false}>
            {title}
          </EditableField>
          <div className="mt-4">
            <EditableField clientId={clientId} field="intro" label="Welcome text" value={data.intro}>
              {intro}
            </EditableField>
          </div>
        </>
      ) : (
        <>
          {title}
          {intro ?? (
            <p className="text-espresso-light mt-4">
              Niamh is preparing your space. Your programme will appear here soon.
            </p>
          )}
        </>
      )}

      {sections.map((section, i) => {
        const tasks = data.tasks.filter((t) => t.section === section);
        const checklistIntro = data.checklistIntro ? <Markdown>{data.checklistIntro}</Markdown> : null;
        return (
          <section key={section}>
            <SectionTitle>{section}</SectionTitle>
            {i === 0 &&
              (asAdmin ? (
                <EditableField clientId={clientId} field="checklist_intro" label="Checklist introduction" value={data.checklistIntro}>
                  {checklistIntro}
                </EditableField>
              ) : (
                checklistIntro
              ))}
            {asAdmin ? (
              <TaskListAdmin clientId={clientId} section={section} tasks={tasks} />
            ) : (
              <TaskList tasks={tasks} />
            )}
          </section>
        );
      })}

      <PracticeDays clientId={clientId} plans={data.practicePlans} asAdmin={asAdmin} />

      {data.programmes.length > 0 && (
        <section>
          <SectionTitle>Your programmes</SectionTitle>
          <ul className="grid gap-3 sm:grid-cols-2">
            {data.programmes.map((p) => (
              <li key={p.id} className="bg-cream rounded-[14px] px-4 py-3.5">
                <div className="font-serif text-xl">{p.title}</div>
                {p.subtitle && <div className="text-[13px] text-espresso-light">{p.subtitle}</div>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {(asAdmin || data.resources.length > 0 || data.resourcesIntro) && (
        <section>
          <SectionTitle>Resources</SectionTitle>
          {asAdmin ? (
            <EditableField clientId={clientId} field="resources_intro" label="Resources introduction" value={data.resourcesIntro}>
              {data.resourcesIntro ? <Markdown>{data.resourcesIntro}</Markdown> : null}
            </EditableField>
          ) : (
            data.resourcesIntro && <Markdown>{data.resourcesIntro}</Markdown>
          )}
          {data.resources.map(media)}
          {asAdmin && data.resources.length === 0 && (
            <p className="text-[13px] text-espresso-light mt-3">
              No recordings yet. Use &ldquo;Add a recording or file&rdquo; at the top of the page.
            </p>
          )}
        </section>
      )}

      {(asAdmin || data.notes.length > 0) && (
        <section>
          <SectionTitle>Weekly notes</SectionTitle>
          {asAdmin && <NewWeeklyNote clientId={clientId} />}
          {data.notes.map((note, i) => {
            const content = (
              <>
                {i === 0 && (
                  <span className="inline-block font-sans text-[11px] tracking-[0.08em] uppercase font-semibold px-2.5 py-1 rounded-full bg-[#F6E6DD] text-terracotta-dark">
                    Latest
                  </span>
                )}
                <h3 className="font-serif text-2xl mt-2">
                  {note.title}
                  {note.note_date && ` · ${dateFmt.format(new Date(note.note_date))}`}
                </h3>
                {note.resources.map(media)}
                {note.body && <Markdown className="mt-2">{note.body}</Markdown>}
              </>
            );
            return (
              <div
                key={note.id}
                className={`border-l-[3px] pl-5 py-1 my-6 ${i === 0 ? "border-terracotta" : "border-sage"}`}
              >
                {asAdmin ? (
                  <WeeklyNoteAdmin clientId={clientId} note={note}>
                    {content}
                    {note.reply && (
                      <div className="bg-cream rounded-xl px-4 py-3 mt-3 text-sm whitespace-pre-wrap">
                        <b>Their thoughts:</b>
                        <br />
                        {note.reply.body}
                      </div>
                    )}
                  </WeeklyNoteAdmin>
                ) : (
                  <>
                    {content}
                    <NoteReply noteId={note.id} initial={note.reply?.body ?? ""} />
                  </>
                )}
              </div>
            );
          })}
        </section>
      )}

      <MessageThread
        clientId={clientId}
        viewerId={viewerId}
        messages={data.messages}
        asAdmin={asAdmin}
      />
    </article>
  );
}
