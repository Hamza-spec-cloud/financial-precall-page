// Source of truth for the long-form VSL script body rendered under the hero VSL.
// Structured (not raw markdown) so design-system emphasis tokens — burgundy italic
// and primary-weight strong — are author-controlled at the data layer instead of
// inferred by a parser.
//
// Inline tokens:
//   string                    → muted body text (#aaaaaa)
//   { b: "..." }              → .text-burgundy italic emphasis (use sparingly, 2–5 words)
//   { s: "..." }              → #e0e0e0 medium-weight emphasis
//
// Block types map to the typography scale defined in vsl-script.tsx.
// Content excludes the page H1 and lead subhead — those live in vsl-hero.tsx.

export type Inline = string | { b: string } | { s: string };

export type Block =
  | { type: "h2"; content: Inline[] }
  | { type: "h3"; content: Inline[] }
  | { type: "p"; content: Inline[] }
  | { type: "ul"; items: Inline[][] }
  | { type: "ol"; items: Inline[][] }
  | { type: "blockquote"; content: Inline[] }
  | { type: "hr" }
  | { type: "cta"; text: string }
  | { type: "image"; src: string; alt: string; width: number; height: number };

export const VSL_SCRIPT: Block[] = [
  // — Intro —
  {
    type: "p",
    content: [
      "You run a CPA, FP&A, or Fractional CFO firm doing somewhere between $500K and $3M a year. Referrals got you here. And referrals are now the thing capping you.",
    ],
  },
  {
    type: "p",
    content: [
      "You've got a team doing good work; but too much of it is low-margin compliance, and too little of it is the advisory engagements you actually want on your book.",
    ],
  },
  {
    type: "p",
    content: [
      "The quiet irony: you build cash flow predictability for your clients while you can barely forecast your pipeline over the next 90 days.",
    ],
  },
  {
    type: "p",
    content: ["I'm Ryan. I run arysn.io."],
  },
  {
    type: "p",
    content: [
      "And in the next few minutes I'm going to show you the exact method we use to put ",
      { b: "2–3 signed advisory retainers on your books every quarter" },
      ", $45K a month in new recurring revenue, without your growth depending on who mentions your name at lunch this week.",
    ],
  },
  { type: "p", content: ["If that's you, keep watching."] },

  { type: "hr" },

  // — Problem —
  {
    type: "h2",
    content: [
      "Most firms in your position think they have a marketing problem. They don't. They have a ",
      { b: "control problem" },
      ".",
    ],
  },
  {
    type: "p",
    content: [
      "Right now, your pipeline runs on luck. You wait for a past client to mention your name at lunch. If they do, you eat. If they don't, you stress.",
    ],
  },
  { type: "p", content: ["This video will work the same way you work with a client."] },
  {
    type: "p",
    content: [
      "They hand you their P&L and say, \"we just need more revenue.\" You don't take that at face value. You pull their margins, their cash conversion cycle, their revenue concentration. You run the variance. And nine times out of ten the real problem isn't on the top line. It's buried three layers deep in a cost structure they stopped questioning two years ago.",
    ],
  },
  {
    type: "p",
    content: [
      "You show them the number that's actually bleeding them. They didn't even know it was there. They nod, they pay you, they scale.",
    ],
  },
  { type: "p", content: ["Now let's run that same process on your firm."] },
  {
    type: "p",
    content: [
      "Every firm owner I talk to says some version of the same thing: \"I just need to get in front of more people.\" Which usually means more networking. More LinkedIn. Maybe run some Google ads.",
    ],
  },
  {
    type: "p",
    content: [
      "That's the equivalent of your client saying \"I just need more revenue.\" It's the symptom, not the root cause.",
    ],
  },
  {
    type: "p",
    content: [
      "The root cause: you have never once controlled how many qualified advisory conversations land on your calendar. Not once. Every client you've ever signed walked in through the same door — referrals — somebody who already trusted you said your name to somebody else.",
    ],
  },
  {
    type: "p",
    content: ["That's a dependency. And it creates three problems that get worse the more you wait…"],
  },

  { type: "h3", content: ["One. Referrals don't compound."] },
  {
    type: "p",
    content: [
      "You get an intro, maybe it turns into something. You get another one next month, maybe that one does too. But each one is independent. There's no flywheel. No momentum carrying over from last quarter into this one. Every 90 days, you're starting from zero. And because there's nothing to measure, there's nothing to scale.",
    ],
  },

  { type: "h3", content: ["Two. Your network sends you what it already knows you do."] },
  {
    type: "p",
    content: [
      "If half your book is compliance, half your referrals will ask for compliance. That's how networks work. The $15K-a-month advisory client you actually want isn't in your current circle. You won't meet them through a referral.",
    ],
  },

  {
    type: "h3",
    content: ["Three. The whole revenue engine runs on the one thing you can't delegate. Your time."],
  },
  {
    type: "p",
    content: [
      "You can hire staff to do the work. You can hire a VA to run the calendar. You can't hire someone to be you at lunch. The bigger you get, the less time you have to feed the system that keeps you alive.",
    ],
  },

  {
    type: "p",
    content: [
      "Those three walls create a triangle and that triangle is what we call the ",
      { b: "referral dependency" },
      ".",
    ],
  },
  {
    type: "p",
    content: [
      "That is the one thing you've never been able to fix no matter how good your work gets.",
    ],
  },
  {
    type: "p",
    content: [
      "Run the math on it. Say you get twelve referral intros a year. You close half. That's six clients. Sounds fine on paper. But because you don't control the front of the system, you can't filter for quality. Out of those six, four will haggle you down and lock your team into low-margin compliance. Maybe two buy premium advisory. If you're lucky.",
    ],
  },
  {
    type: "image",
    src: "/vsl/script/referral-funnel.png",
    alt: "Referral funnel: 12 intros → 6 closed clients → 4 haggle into compliance → 2 buy premium advisory",
    width: 1149,
    height: 329,
  },
  {
    type: "p",
    content: [
      "You can sharpen your proposals. Raise your close rate. Deliver faster. None of it changes the one fact underneath all of it: ",
      { b: "you do not control how many premium conversations enter your pipeline" },
      ".",
    ],
  },
  { type: "p", content: ["Think about your last five clients."] },
  {
    type: "p",
    content: [
      "How many came from referrals? How many came from a system you controlled?",
    ],
  },
  { type: "p", content: ["Now think about your next five. Where are they coming from?"] },
  {
    type: "p",
    content: [
      "You didn't build a practice to spend your career hoping the right person mentions your name at lunch.",
    ],
  },

  { type: "hr" },

  // — Mechanism —
  {
    type: "p",
    content: ["So the obvious next thought is, “I just need more leads.”"],
  },
  { type: "p", content: ["No. That'll make it worse."] },
  {
    type: "p",
    content: [
      "Right now, from the outside, your firm looks the same as every other firm. A stranger has no way to know you do high-level advisory. You look like another CPA shop.",
    ],
  },
  {
    type: "p",
    content: [
      "Turn on lead gen — any channel, LinkedIn, Google, email, an agency — and you don't get advisory clients. You get more compliance inquiries. More price shoppers.",
    ],
  },
  {
    type: "p",
    content: [
      "The exact same mix your referral network already sends you, except now you're paying for it.",
    ],
  },
  {
    type: "p",
    content: ["The channel isn't the issue. Think about why referrals actually close."],
  },
  {
    type: "p",
    content: [
      "A referral shows up pre-sold. Somebody they trust said, “call this person.” That trust did all the heavy lifting. Your offer never had to sell itself.",
    ],
  },
  {
    type: "p",
    content: [
      "Take that away. Put the same offer in front of someone cold — no warm intro, no one vouching — and they won't budge. No reason to pick you over the next firm.",
    ],
  },
  {
    type: "p",
    content: ["The offer was never built to work without borrowed trust."],
  },
  { type: "p", content: ["So we don't start with ads. We don't start with funnels."] },
  { type: "p", content: ["We start with the one thing every agency skips."] },

  {
    type: "h2",
    content: ["We call it ", { b: "Cold-Proof Positioning" }, "."],
  },
  {
    type: "p",
    content: [
      "We look at your best advisory clients. The ones with the best margins, the longest retention. We figure out how they think, what they actually care about, the words they use to describe their own problems. Then we rebuild how your practice is positioned using their language, not yours. So the offer can do the one thing it's never had to do — earn trust cold.",
    ],
  },
  {
    type: "p",
    content: [
      "That positioning determines what kind of demand comes in. Get it right, the system attracts advisory buyers. Skip it, you're just making tech billionaires richer.",
    ],
  },
  {
    type: "p",
    content: [
      "Positioning first. Demand system built around it. Then we run it. You get advisory clients at a known cost.",
    ],
  },
  {
    type: "image",
    src: "/vsl/script/advisory-conversations.png",
    alt: "Dual-line chart: erratic referral-driven advisory conversations vs. steadily rising protocol-driven conversations over 90-day cycles",
    width: 947,
    height: 456,
  },

  { type: "hr" },

  // — Case Study —
  {
    type: "h2",
    content: ["We ran this exact process for a wealth management firm."],
  },
  {
    type: "p",
    content: [
      "Same profile as yours. A financial practice capped by relationships, dependent on who already knew them, with no way to acquire a client who didn't already trust the founder.",
    ],
  },
  {
    type: "p",
    content: [
      "We didn't start with ads. We started with the offer. We analyzed their best accounts, mapped the buyer, pulled the language those buyers actually used, and rebuilt the positioning so it converted cold. Then we built the demand system on top of it.",
    ],
  },
  {
    type: "p",
    content: [{ b: "$262,011 in cash collected." }, " 120 days."],
  },
  {
    type: "p",
    content: [
      "Same firm. Same founder. Same market. The only thing that changed was what we did first.",
    ],
  },
  {
    type: "p",
    content: [
      "We ran the same process for a DT Institution out of Miami, Florida. ",
      { b: "$211,474.11 in Revenue in 90 days." },
    ],
  },

  // — Mid-VSL CTA —
  {
    type: "p",
    content: [
      "If you've seen enough, there's a link below this video. Book the call and we'll run the positioning assessment on your firm.",
    ],
  },
  { type: "cta", text: "Book The Call →" },

  { type: "hr" },

  // — Guarantee —
  { type: "h2", content: ["So here's what I have for you."] },
  {
    type: "p",
    content: [
      "We guarantee ",
      { s: "3 signed advisory contracts per quarter" },
      ". Each one worth at least $15K a month. That's $45K a month in new recurring revenue, every 90 days.",
    ],
  },
  {
    type: "p",
    content: [
      "If we miss that number, ",
      { b: "you pay nothing" },
      ". We refund every dollar. And we keep working, at our cost, until we hit it.",
    ],
  },

  { type: "hr" },

  // — Compounding Liability —
  {
    type: "h2",
    content: ["Now the part most firms refuse to model. The cost of waiting."],
  },
  {
    type: "p",
    content: [
      "You understand compounding interest better than almost anyone. Well let's look at ",
      { b: "compounding liability" },
      " here for a second.",
    ],
  },
  {
    type: "p",
    content: [
      "The market rate for routine compliance work is falling, and it's falling because software now does what used to bill hours. You're already watching firms around you lose those contracts. And that curve will not reverse. It'll compound even further. Every quarter you stay dependent on compliance, the floor under that revenue drops further.",
    ],
  },
  {
    type: "image",
    src: "/vsl/script/compliance-rate.png",
    alt: "Line chart: rate per compliance hour falling as software eats billable hours",
    width: 969,
    height: 334,
  },
  {
    type: "p",
    content: [
      "And this is where it ties back. If your compliance revenue keeps compressing and your firm still has no way to attract advisory clients outside your network, the business will collapse. The high-margin work you'd pivot to is the exact work your offer can't currently win cold. The hole gets deeper while the ladder out stays broken.",
    ],
  },

  { type: "hr" },

  // — Three Paths —
  { type: "h2", content: ["From here, you have three paths."] },

  { type: "h3", content: ["The first is inaction."] },
  {
    type: "p",
    content: [
      "You close this video, go back to your inbox, and wait for the next referral to show up whenever it decides to. Next quarter looks like this one. The one after that looks worse.",
    ],
  },

  { type: "h3", content: ["The second is doing it yourself."] },
  {
    type: "p",
    content: [
      "You see the problem clearly and you decide to rebuild your own positioning and build your own acquisition system from scratch, on top of running your firm. Think about that the way you'd think about a client. If an $18M HVAC contractor told you they were going to restructure their own corporate debt and build their own forensic models with no specialist, you'd tell them they were being reckless. The same logic applies here. This isn't your craft, and the learning curve is paid in years you don't get back.",
    ],
  },

  { type: "h3", content: ["The third is the one you'd recommend to your own client."] },
  {
    type: "p",
    content: [
      "You hand the infrastructure to specialists who back the work with a performance guarantee, and you keep doing what you're best at while the pipeline fills itself. Given the method, the proof, and the fact that the financial risk sits on our side, it's the only path that survives the kind of scrutiny you'd apply to anyone else's P&L.",
    ],
  },

  { type: "hr" },

  // — Close —
  { type: "h2", content: ["Here's how it works."] },
  {
    type: "p",
    content: [
      "You book a 30-minute call with our team. On that call we run the positioning diagnostic on your firm and show you exactly where the gaps are. The places your offer is leaking trust that a referral has been quietly covering for. Then we map what your first 90 days look like.",
    ],
  },
  {
    type: "p",
    content: [
      { s: "We get paid when you get paid." },
      " Our fee is a percentage of the revenue we actually collect for you. Nothing on the dollars that don't show up.",
    ],
  },
  {
    type: "p",
    content: [
      "3 signed advisory contracts per quarter, each worth at least $15K a month, or you pay nothing and we keep working until we hit it.",
    ],
  },
  {
    type: "p",
    content: ["There's a link below this video. Book the call, and we'll take it from there."],
  },
];
