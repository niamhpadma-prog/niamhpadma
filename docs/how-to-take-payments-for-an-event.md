# Taking card payments for an event

This is the one-off setup, then the three-minute routine for each new event.

Nothing on this page asks you to share a secret key with anyone. Keys go
straight from Stripe into Vercel.

---

## One-off setup (you only do this once)

### 1. Put your Stripe keys into Vercel

1. In **Stripe** → **Developers** → **API keys**, copy your **Secret key**
   (it starts with `sk_live_` for real payments, or `sk_test_` for practice).
2. In **Vercel** → your `niamhpadma` project → **Settings** →
   **Environment Variables**, add:
   - Name: `STRIPE_SECRET_KEY` — Value: the key you copied.
3. Save.

### 2. Tell Stripe where to send confirmations

This is what creates the booking in your Studio and sends the confirmation
email. Without it, people can pay but nothing is recorded.

1. In **Stripe** → **Developers** → **Webhooks** → **Add endpoint**.
2. Endpoint URL: `https://www.niamhpadma.com/api/webhooks/stripe`
3. Under events to send, choose **`checkout.session.completed`**.
4. Save, then copy the **Signing secret** (starts with `whsec_`).
5. Back in **Vercel** → **Environment Variables**, add:
   - Name: `STRIPE_WEBHOOK_SECRET` — Value: the signing secret.
6. Redeploy the site (Vercel → Deployments → ⋯ → Redeploy) so it picks up the
   new values.

---

## For each event you want to sell

### 1. Create the price in Stripe

1. **Stripe** → **Product catalogue** → **Add product**.
2. Name it the same as your event, set the price and currency, choose
   **One-off**, and save.
3. Click the price you just made and copy its **API ID**. It starts with
   `price_`.

⚠️ Copy the **price** ID (`price_…`), not the product ID (`prod_…`).

### 2. Switch it on in the Studio

1. **Studio** → **Events** → open the event.
2. Tick **Take payment on the website**.
3. Paste the ID into **Stripe Price ID**.
4. Check the **Price** field above matches what you set in Stripe — that field
   is only the text shown on the page, it does not set the charge.
5. Optionally set **Capacity**. Once that many places are sold, the site stops
   taking bookings.
6. **Publish**.

The "Book Now" button on that event now goes to Stripe checkout.

### 3. Test it before you share the link

Do one real booking on yourself with a real card, then refund it in Stripe.
It's the only way to be certain the whole chain works. You should get:

- a booking in **Studio → Event Bookings**
- a confirmation email to the buyer
- a notification email to you

---

## Everyday questions

**Where do I see who's booked?**
Studio → **Event Bookings**. Stripe is still the record of money taken.

**Someone wants a refund.**
Refund in **Stripe** (that moves the money), then open their booking in the
Studio and set **Status** to `refunded`. That frees their place up again.
Changing it in the Studio alone does *not* refund anyone.

**I want to stop selling an event.**
Either untick **Take payment on the website**, or set **Status** to `sold-out`.
Both take effect within about a minute.

**An event without the tick-box.**
Behaves exactly as before: your own booking link if you set one, otherwise the
enquiry form.

---

## Things worth knowing

- **Capacity is a safety net, not a lock.** If two people pay in the same
  second for the last place, both can get through. Rare, but if it happens,
  refund one in Stripe.
- **Test mode vs live mode.** Stripe keeps separate keys and separate prices
  for each. A `price_` ID created in test mode will not work with a live key.
  If checkout says the price doesn't exist, this is usually why.
- **Refunds and cancellations are yours to handle.** The site doesn't have a
  cancellation policy built in. If you want one shown before people pay, say so
  and it can be added to the event page.
