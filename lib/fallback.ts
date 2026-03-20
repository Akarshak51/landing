export type LandingRequest = {
  company_name?: string;
  website_url?: string;
  short_description?: string;
  target_audience?: string;
  tone?: string;
  research_notes_raw?: string;
};

type LandingContent = {
  company: {
    name: string;
    tagline: string;
    one_line: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    big_numbers: Array<{ label: string; value: string }>;
    supporting_paragraph: string;
  };
  pillars: Array<{ title: string; tag: string; description: string }>;
  features: Array<{ title: string; description: string; icon: string }>;
  products: Array<{
    name: string;
    short_pitch: string;
    detail_paragraph: string;
    key_features: string[];
  }>;
  use_cases: Array<{
    title: string;
    audience: string;
    scenario: string;
    outcome: string;
  }>;
  testimonials: Array<{
    quote: string;
    author: string;
    role: string;
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
  team: Array<{
    name: string;
    role: string;
    bio: string;
  }>;
  partners: Array<{
    name: string;
    description: string;
  }>;
  proof: Array<{ metric: string; explanation: string }>;
  vision: { headline: string; body: string };
  cta: { primary_label: string; secondary_label: string; note: string };
  disclaimers: string[];
};

function toText(value: unknown, fallback = "") {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized || fallback;
}

function firstSentence(text: string) {
  const match = text.match(/[^.!?]+[.!?]?/);
  return (match?.[0] ?? text).trim();
}

function truncate(text: string, max = 180) {
  if (text.length <= max) {
    return text;
  }

  return `${text.slice(0, max - 1).trim()}...`;
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toneToWord(tone: string) {
  const normalized = tone.toLowerCase();

  if (normalized === "corporate") return "trusted";
  if (normalized === "playful") return "delightful";
  if (normalized === "friendly") return "human";
  return "bold";
}

function buildContent(input: LandingRequest): LandingContent {
  const companyName = toText(input.company_name, "Your Company");
  const shortDescription = toText(
    input.short_description,
    `${companyName} delivers practical solutions for modern teams.`
  );
  const audience = toText(input.target_audience, "growth-focused teams");
  const tone = toText(input.tone, "bold");
  const website = toText(input.website_url, "");
  const notes = toText(input.research_notes_raw, "");

  const coreSentence = truncate(firstSentence(shortDescription), 120);
  const toneWord = toneToWord(tone);

  const featuresFromNotes = notes
    .split(/\.|,|\n|;/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length >= 10)
    .slice(0, 4);

  const keyFeatures =
    featuresFromNotes.length > 0
      ? featuresFromNotes
      : [
          "Fast onboarding with minimal setup",
          "Clear workflows that reduce manual effort",
          "Team visibility through one unified view",
          "Designed to scale as demand grows"
        ];

  return {
    company: {
      name: companyName,
      tagline: coreSentence,
      one_line: `${companyName} helps ${audience} move faster with ${toneWord} execution.`
    },
    hero: {
      headline: `${companyName} for ${audience}`,
      subheadline: shortDescription,
      big_numbers: [
        { label: "Onboarding", value: "< 1 day" },
        { label: "Efficiency", value: "+45%" },
        { label: "Teams", value: "500+" }
      ],
      supporting_paragraph:
        `${companyName} is built for ${audience}. It simplifies daily execution, improves consistency, and helps teams ship meaningful outcomes faster.`
    },
    pillars: [
      {
        title: "Speed Without Chaos",
        tag: "SPEED",
        description: "Launch faster using repeatable workflows and a structure your team can trust."
      },
      {
        title: "Clear Team Alignment",
        tag: "ALIGNMENT",
        description: "Give everyone a shared direction so priorities stay clear and execution stays focused."
      },
      {
        title: "Reliable Delivery",
        tag: "EXECUTION",
        description: "Turn plans into outcomes with practical systems built for real operating conditions."
      },
      {
        title: "Data-Driven Insights",
        tag: "INSIGHTS",
        description: "Make informed decisions with comprehensive analytics and real-time reporting."
      }
    ],
    features: [
      {
        title: "Real-time Analytics",
        description: "Track performance with live dashboards and custom reports.",
        icon: "📊"
      },
      {
        title: "Seamless Integration",
        description: "Connect with your favorite tools through our robust API.",
        icon: "🔗"
      },
      {
        title: "Enterprise Security",
        description: "Bank-level encryption and compliance with industry standards.",
        icon: "🔒"
      },
      {
        title: "24/7 Support",
        description: "Our team is always available to help you succeed.",
        icon: "💬"
      }
    ],
    products: [
      {
        name: `${companyName} Platform`,
        short_pitch: `A practical operating layer for ${audience}.`,
        detail_paragraph:
          `${companyName} combines planning, execution, and visibility in one place, so teams can reduce rework and deliver results consistently.`,
        key_features: keyFeatures
      }
    ],
    use_cases: [
      {
        title: "Launch New Campaigns Faster",
        audience,
        scenario: "Your team needs to move from idea to execution quickly without dropped handoffs.",
        outcome: `${companyName} provides structure and visibility so launches happen faster with better quality.`
      },
      {
        title: "Standardize Cross-Team Work",
        audience,
        scenario: "Different teams are operating in silos with inconsistent workflows and unclear ownership.",
        outcome: "Create one clear operating model that improves collaboration and delivery confidence."
      }
    ],
    testimonials: [
      {
        quote: "This platform transformed how our team operates. Productivity increased significantly within the first month.",
        author: "Sarah Chen",
        role: "VP of Operations"
      },
      {
        quote: "The best investment we've made for our team's efficiency. Intuitive, powerful, and reliable.",
        author: "Marcus Johnson",
        role: "CEO"
      },
      {
        quote: "Outstanding support and incredible features. It just works.",
        author: "Emily Rodriguez",
        role: "Product Manager"
      }
    ],
    faq: [
      {
        question: "How long does onboarding take?",
        answer: "Most teams are up and running within a day. Our onboarding process is streamlined for quick adoption."
      },
      {
        question: "Is there a free trial available?",
        answer: "Yes, we offer a 14-day free trial with full access to all features. No credit card required."
      },
      {
        question: "What kind of support do you offer?",
        answer: "We provide 24/7 customer support via email, chat, and phone. Our dedicated success team is always ready to help."
      },
      {
        question: "Can I integrate with my existing tools?",
        answer: "Absolutely! We integrate with 100+ popular tools and offer a robust API for custom integrations."
      }
    ],
    team: [],
    partners: [],
    proof: [
      {
        metric: "Thousands of tasks coordinated",
        explanation: "Teams use structured workflows to keep execution consistent and measurable."
      },
      {
        metric: "Faster cycle times",
        explanation: "Centralized visibility helps unblock work early and avoid repeated delays."
      },
      {
        metric: "High customer satisfaction",
        explanation: "Our customers consistently rate us 4.8+ stars for usability and support."
      }
    ],
    vision: {
      headline: `Build a more predictable growth engine with ${companyName}`,
      body: `${companyName} is designed to help ${audience} operate with more clarity, speed, and confidence as complexity increases.`
    },
    cta: {
      primary_label: "Get Started",
      secondary_label: "Book a Demo",
      note: website ? `Learn more at ${website}` : "Built from your provided details in under a minute."
    },
    disclaimers: [
      "Results vary by team size, process maturity, and implementation context.",
      "Performance claims are directional and should be validated for your environment."
    ]
  };
}

function buildHtml(content: LandingContent) {
  const h = escapeHtml;

  const metrics = content.hero.big_numbers
    .map(
      (m) => `
      <div class="metric">
        <div class="metric-value">${h(m.value)}</div>
        <div class="metric-label">${h(m.label)}</div>
      </div>`
    )
    .join("");

  const pillars = content.pillars
    .map(
      (p) => `
      <article class="card">
        <div class="tag">${h(p.tag)}</div>
        <h3>${h(p.title)}</h3>
        <p>${h(p.description)}</p>
      </article>`
    )
    .join("");

  const products = content.products
    .map(
      (product) => `
      <article class="product">
        <h3>${h(product.name)}</h3>
        <p class="muted">${h(product.short_pitch)}</p>
        <p>${h(product.detail_paragraph)}</p>
        <ul>
          ${product.key_features.map((f) => `<li>${h(f)}</li>`).join("")}
        </ul>
      </article>`
    )
    .join("");

  const cases = content.use_cases
    .map(
      (item) => `
      <article class="card">
        <h3>${h(item.title)}</h3>
        <p><strong>Audience:</strong> ${h(item.audience)}</p>
        <p><strong>Scenario:</strong> ${h(item.scenario)}</p>
        <p><strong>Outcome:</strong> ${h(item.outcome)}</p>
      </article>`
    )
    .join("");

  const proof = content.proof
    .map(
      (item) => `
      <div class="proof-item">
        <strong>${h(item.metric)}</strong>
        <p>${h(item.explanation)}</p>
      </div>`
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${h(content.company.name)} | Landing Page</title>
  <style>
    :root {
      --bg: #0b1220;
      --surface: #121b2d;
      --muted: #9fb0ce;
      --text: #ecf2ff;
      --accent: #4da3ff;
      --accent-2: #74d4ff;
      --border: #22324f;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: var(--text);
      background: radial-gradient(circle at top right, #112140, var(--bg) 50%);
      line-height: 1.6;
    }
    .wrap { width: min(1100px, 92vw); margin: 0 auto; }
    header { padding: 28px 0; border-bottom: 1px solid var(--border); }
    .brand { font-weight: 700; letter-spacing: 0.02em; }
    .hero { padding: 68px 0 48px; }
    h1, h2, h3 { margin: 0 0 14px; line-height: 1.25; }
    h1 { font-size: clamp(2rem, 4vw, 3rem); }
    h2 { font-size: clamp(1.4rem, 3vw, 2rem); }
    p { margin: 0 0 12px; }
    .muted { color: var(--muted); }
    .metrics {
      margin-top: 24px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 12px;
    }
    .metric {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
    }
    .metric-value { font-size: 1.5rem; font-weight: 700; color: var(--accent-2); }
    .metric-label { color: var(--muted); font-size: 0.9rem; }
    section { padding: 34px 0; }
    .grid {
      display: grid;
      gap: 14px;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }
    .card, .product, .proof-item {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 18px;
    }
    .tag {
      display: inline-block;
      margin-bottom: 8px;
      padding: 2px 8px;
      border: 1px solid #2d466b;
      border-radius: 999px;
      color: var(--accent-2);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.06em;
    }
    ul { margin: 10px 0 0 18px; }
    .cta {
      margin: 38px 0 24px;
      padding: 22px;
      border-radius: 14px;
      border: 1px solid #2a4d7e;
      background: linear-gradient(135deg, #12325b, #173f71);
    }
    .cta-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 12px; }
    .btn {
      display: inline-block;
      text-decoration: none;
      border-radius: 10px;
      padding: 10px 14px;
      border: 1px solid transparent;
      font-weight: 600;
    }
    .btn-primary { background: var(--accent); color: #041227; }
    .btn-secondary { border-color: #7bb8ff; color: #d7ebff; }
    footer { padding: 20px 0 30px; color: var(--muted); font-size: 0.9rem; }
    @media (max-width: 700px) {
      .hero { padding-top: 40px; }
    }
  </style>
</head>
<body>
  <header>
    <div class="wrap">
      <div class="brand">${h(content.company.name)}</div>
      <div class="muted">${h(content.company.tagline)}</div>
    </div>
  </header>

  <main class="wrap">
    <section class="hero">
      <h1>${h(content.hero.headline)}</h1>
      <p class="muted">${h(content.hero.subheadline)}</p>
      <p>${h(content.hero.supporting_paragraph)}</p>
      <div class="metrics">${metrics}</div>
    </section>

    <section>
      <h2>Why teams choose ${h(content.company.name)}</h2>
      <div class="grid">${pillars}</div>
    </section>

    <section>
      <h2>Product</h2>
      <div class="grid">${products}</div>
    </section>

    <section>
      <h2>Use Cases</h2>
      <div class="grid">${cases}</div>
    </section>

    <section>
      <h2>Proof</h2>
      <div class="grid">${proof}</div>
    </section>

    <section>
      <h2>${h(content.vision.headline)}</h2>
      <p class="muted">${h(content.vision.body)}</p>
      <div class="cta">
        <h3>Ready to move faster?</h3>
        <p>${h(content.cta.note)}</p>
        <div class="cta-row">
          <a class="btn btn-primary" href="#">${h(content.cta.primary_label)}</a>
          <a class="btn btn-secondary" href="#">${h(content.cta.secondary_label)}</a>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <div class="wrap">
      <div>${h(content.company.one_line)}</div>
      ${content.disclaimers.map((d) => `<div>${h(d)}</div>`).join("")}
    </div>
  </footer>
</body>
</html>`;
}

export function buildFallbackLandingPage(input: LandingRequest) {
  const content = buildContent(input);
  const html = buildHtml(content);

  return {
    content,
    html,
    meta: {
      source: "fallback",
      generated_at: new Date().toISOString()
    }
  };
}
