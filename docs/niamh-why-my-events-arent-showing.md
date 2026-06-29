# Why aren't my events showing on the website?

Short answer: **an event only appears on the site when its Start Date is in the future _and_ you've pressed Publish.** Two of your events have dates that have already passed, so the site is hiding them. Nothing is broken — they just need fresh dates.

---

## The golden rule

For any event to appear at **yourname.com/events**, both of these must be true:

1. ✅ **Start Date is in the future** (today or later)
2. ✅ You pressed the green **Publish** button (bottom-right of the editor)

If either is missing, the event stays hidden. (Retreats are a little different — see the note at the bottom.)

---

## What to fix right now

Two events have start dates back in **March 2026**, so they're hidden:

| Event | Current Start Date | What to do |
|---|---|---|
| **Weekly Vinyasa Flow** | 10 March 2026 | Change to a future date, then Publish |
| **Online Breathwork Circle** | 15 March 2026 | Change to a future date, then Publish |

### How to fix one (same steps for both)

1. Open **Sanity Studio** (the `/studio` address you log into).
2. In the left menu click **Event**, then click **Weekly Vinyasa Flow**.
3. Find the **Start Date** field and pick a new date that's in the future.
4. Click the green **Publish** button at the bottom-right.
5. Wait about a minute, then refresh **yourname.com/events** — it should now appear under **Upcoming Events**.

Repeat for **Online Breathwork Circle**.

---

## One duplicate to tidy up

You currently have **two** copies of **"Roots & Restore: A Summer Evening Retreat"** — they have the same date but one is set as a **Retreat** and the other as a **Workshop**. That's why it shows up twice (once in the Retreats section and once in Upcoming Events).

- Decide which one you want to keep.
- Open the other one and delete it (the **⋮** menu at the bottom of the editor → **Delete**).

If you meant to have both, you can leave them — just know that's why it appears in two places.

---

## A note on Retreats

Events with **Type = Retreat** behave slightly differently: they show in the **Retreats** section even if the date has passed, and they get the full retreat landing page at **/retreats/your-slug**. Everything else (Class, Workshop, Online) shows under **Upcoming Events** and only while the date is still in the future.

---

*If something still doesn't show after a minute and a refresh, send Max a screenshot of the event's editor screen.*
