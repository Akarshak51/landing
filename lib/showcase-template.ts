function toText(value: unknown, fallback = "") {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized || fallback;
}

function toArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(text: string) {
  return escapeHtml(text).replace(/`/g, "&#96;");
}

type NormalizedContent = {
  company: { name: string; tagline: string; one_line: string };
  hero: {
    headline: string;
    subheadline: string;
    big_numbers: Array<{ label: string; value: string }>;
    supporting_paragraph: string;
  };
  pillars: Array<{ title: string; tag: string; description: string }>;
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
  proof: Array<{ metric: string; explanation: string }>;
  testimonials: Array<{
    quote: string;
    author: string;
    role: string;
    avatar?: string;
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
  team: Array<{
    name: string;
    role: string;
    bio?: string;
    avatar?: string;
  }>;
  partners: Array<{
    name: string;
    logo?: string;
    description?: string;
  }>;
  features: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  vision: { headline: string; body: string };
  cta: { primary_label: string; secondary_label: string; note: string };
  disclaimers: string[];
};

type Tone = "bold" | "friendly" | "corporate" | "playful" | "luxury" | "tech" | "creative" | "minimal";

type DesignVariant = {
  id: string;
  displayName: string;
  fontHref: string;
  headingFont: string;
  bodyFont: string;
  palette: {
    bg: string;
    bgAlt: string;
    surface: string;
    text: string;
    muted: string;
    accent: string;
    accentSoft: string;
    accentDark: string;
    border: string;
    buttonText: string;
    gradient1: string;
    gradient2: string;
  };
  heroMode: "split" | "stacked" | "orbital" | "centered" | "minimal";
  cardMode: "glass" | "solid" | "outline" | "gradient";
  texture: "grid" | "dots" | "grain" | "stripes" | "waves" | "noise";
  motion: "lift" | "slide" | "zoom" | "fade" | "bounce";
  badgePrefix: string;
  keywords: [string, string, string];
  heroImage?: string;
  heroPattern?: string;
  toneBias: Tone[];
  industryBias: string[];
  cardStyle: "rounded" | "sharp" | "pill";
  shadowIntensity: "light" | "medium" | "heavy";
};

const DESIGN_VARIANTS: DesignVariant[] = [
  {
    id: "kinetic-grid",
    displayName: "Kinetic Grid",
    fontHref:
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Manrope:wght@400;500;600;700&display=swap",
    headingFont: "'Space Grotesk', sans-serif",
    bodyFont: "'Manrope', sans-serif",
    palette: {
      bg: "#06112b",
      bgAlt: "#0d1b3f",
      surface: "rgba(10, 31, 66, 0.78)",
      text: "#ecf2ff",
      muted: "#bdd0f8",
      accent: "#2ec4ff",
      accentSoft: "#9de5ff",
      accentDark: "#0077b3",
      border: "rgba(146, 197, 255, 0.36)",
      buttonText: "#021427",
      gradient1: "#06112b",
      gradient2: "#0d1b3f"
    },
    heroMode: "split",
    cardMode: "glass",
    texture: "grid",
    motion: "lift",
    badgePrefix: "Signal",
    keywords: ["speed", "precision", "lift"],
    heroImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80",
    toneBias: ["bold", "corporate", "tech"],
    industryBias: ["tech", "saas", "startup"],
    cardStyle: "rounded",
    shadowIntensity: "medium"
  },
  {
    id: "editorial-sand",
    displayName: "Editorial Sand",
    fontHref:
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Work+Sans:wght@400;500;600;700&display=swap",
    headingFont: "'Fraunces', serif",
    bodyFont: "'Work Sans', sans-serif",
    palette: {
      bg: "#f6f0e6",
      bgAlt: "#efe4d5",
      surface: "rgba(255, 251, 245, 0.9)",
      text: "#21190f",
      muted: "#6a5644",
      accent: "#ca6b2f",
      accentSoft: "#f6b38b",
      accentDark: "#8b4513",
      border: "rgba(66, 45, 28, 0.22)",
      buttonText: "#fff9f0",
      gradient1: "#f6f0e6",
      gradient2: "#efe4d5"
    },
    heroMode: "stacked",
    cardMode: "solid",
    texture: "grain",
    motion: "slide",
    badgePrefix: "Edition",
    keywords: ["clarity", "craft", "trust"],
    toneBias: ["corporate", "friendly", "luxury"],
    industryBias: ["agency", "creative", "consulting"],
    cardStyle: "rounded",
    shadowIntensity: "light"
  },
  {
    id: "sunrise-loop",
    displayName: "Sunrise Loop",
    fontHref:
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@10..48,400;10..48,700&family=Nunito+Sans:wght@400;600;700&display=swap",
    headingFont: "'Bricolage Grotesque', sans-serif",
    bodyFont: "'Nunito Sans', sans-serif",
    palette: {
      bg: "#fff6e8",
      bgAlt: "#ffe8c8",
      surface: "rgba(255, 255, 255, 0.8)",
      text: "#2c2115",
      muted: "#7b5f40",
      accent: "#e65f24",
      accentSoft: "#ffd08c",
      accentDark: "#b34700",
      border: "rgba(145, 83, 43, 0.24)",
      buttonText: "#2f1302",
      gradient1: "#fff6e8",
      gradient2: "#ffe8c8"
    },
    heroMode: "orbital",
    cardMode: "solid",
    texture: "dots",
    motion: "zoom",
    badgePrefix: "Momentum",
    keywords: ["energy", "wins", "momentum"],
    heroImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80",
    toneBias: ["playful", "friendly", "creative"],
    industryBias: ["food", "lifestyle", "retail"],
    cardStyle: "pill",
    shadowIntensity: "light"
  },
  {
    id: "atelier-slate",
    displayName: "Atelier Slate",
    fontHref:
      "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Public+Sans:wght@400;500;600;700&display=swap",
    headingFont: "'DM Serif Display', serif",
    bodyFont: "'Public Sans', sans-serif",
    palette: {
      bg: "#e9edf3",
      bgAlt: "#d7dee7",
      surface: "rgba(255, 255, 255, 0.86)",
      text: "#132033",
      muted: "#485d76",
      accent: "#0e7c86",
      accentSoft: "#8fd2d8",
      accentDark: "#065e63",
      border: "rgba(24, 55, 83, 0.2)",
      buttonText: "#eaf8fa",
      gradient1: "#e9edf3",
      gradient2: "#d7dee7"
    },
    heroMode: "split",
    cardMode: "outline",
    texture: "stripes",
    motion: "slide",
    badgePrefix: "Atelier",
    keywords: ["focus", "structure", "confidence"],
    toneBias: ["corporate", "bold", "minimal"],
    industryBias: ["finance", "legal", "healthcare"],
    cardStyle: "sharp",
    shadowIntensity: "light"
  },
  {
    id: "mono-signal",
    displayName: "Mono Signal",
    fontHref:
      "https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap",
    headingFont: "'Sora', sans-serif",
    bodyFont: "'IBM Plex Sans', sans-serif",
    palette: {
      bg: "#0f1115",
      bgAlt: "#1a1d22",
      surface: "rgba(27, 30, 36, 0.84)",
      text: "#f5f6f8",
      muted: "#c4c8d2",
      accent: "#8ef53a",
      accentSoft: "#d3ffad",
      accentDark: "#4a8c00",
      border: "rgba(216, 224, 240, 0.28)",
      buttonText: "#142003",
      gradient1: "#0f1115",
      gradient2: "#1a1d22"
    },
    heroMode: "orbital",
    cardMode: "outline",
    texture: "grid",
    motion: "lift",
    badgePrefix: "Signal",
    keywords: ["ops", "clarity", "scale"],
    toneBias: ["bold", "tech", "minimal"],
    industryBias: ["devtools", "infrastructure", "ai"],
    cardStyle: "rounded",
    shadowIntensity: "medium"
  },
  {
    id: "industrial-brick",
    displayName: "Industrial Brick",
    fontHref:
      "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Cabin:wght@400;500;600;700&display=swap",
    headingFont: "'Archivo Black', sans-serif",
    bodyFont: "'Cabin', sans-serif",
    palette: {
      bg: "#f2ece6",
      bgAlt: "#e7ddd4",
      surface: "rgba(255, 255, 255, 0.9)",
      text: "#241d17",
      muted: "#5d5044",
      accent: "#ad3f20",
      accentSoft: "#f3b59f",
      accentDark: "#6b260f",
      border: "rgba(102, 65, 43, 0.26)",
      buttonText: "#fff2eb",
      gradient1: "#f2ece6",
      gradient2: "#e7ddd4"
    },
    heroMode: "split",
    cardMode: "solid",
    texture: "stripes",
    motion: "zoom",
    badgePrefix: "Forge",
    keywords: ["delivery", "grit", "impact"],
    heroImage: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=1400&q=80",
    toneBias: ["bold", "friendly", "creative"],
    industryBias: ["construction", "manufacturing", "logistics"],
    cardStyle: "sharp",
    shadowIntensity: "heavy"
  },
  {
    id: "cyber-neon",
    displayName: "Cyber Neon",
    fontHref:
      "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Rajdhani:wght@400;500;600;700&display=swap",
    headingFont: "'Orbitron', sans-serif",
    bodyFont: "'Rajdhani', sans-serif",
    palette: {
      bg: "#0a0a0f",
      bgAlt: "#12121a",
      surface: "rgba(20, 20, 35, 0.85)",
      text: "#e0e0ff",
      muted: "#8888aa",
      accent: "#ff00ff",
      accentSoft: "#ff66ff",
      accentDark: "#990099",
      border: "rgba(255, 0, 255, 0.3)",
      buttonText: "#0a0a0f",
      gradient1: "#0a0a0f",
      gradient2: "#1a0a2e"
    },
    heroMode: "centered",
    cardMode: "gradient",
    texture: "grid",
    motion: "bounce",
    badgePrefix: "Neon",
    keywords: ["future", "innovation", "power"],
    heroImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=80",
    toneBias: ["bold", "tech", "creative"],
    industryBias: ["gaming", "crypto", "ai"],
    cardStyle: "rounded",
    shadowIntensity: "heavy"
  },
  {
    id: "ocean-breeze",
    displayName: "Ocean Breeze",
    fontHref:
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap",
    headingFont: "'Playfair Display', serif",
    bodyFont: "'Source Sans 3', sans-serif",
    palette: {
      bg: "#f0f7fa",
      bgAlt: "#e0eef3",
      surface: "rgba(255, 255, 255, 0.9)",
      text: "#1a3a4a",
      muted: "#5a7a8a",
      accent: "#0077b6",
      accentSoft: "#90e0ef",
      accentDark: "#005082",
      border: "rgba(0, 119, 182, 0.2)",
      buttonText: "#ffffff",
      gradient1: "#f0f7fa",
      gradient2: "#e0eef3"
    },
    heroMode: "split",
    cardMode: "glass",
    texture: "waves",
    motion: "fade",
    badgePrefix: "Horizon",
    keywords: ["depth", "clarity", "flow"],
    toneBias: ["corporate", "friendly", "luxury"],
    industryBias: ["travel", "finance", "education"],
    cardStyle: "rounded",
    shadowIntensity: "light"
  },
  {
    id: "forest-mist",
    displayName: "Forest Mist",
    fontHref:
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Nunito:wght@400;500;600;700&display=swap",
    headingFont: "'Cormorant Garamond', serif",
    bodyFont: "'Nunito', sans-serif",
    palette: {
      bg: "#f4f7f3",
      bgAlt: "#e8efe6",
      surface: "rgba(255, 255, 255, 0.85)",
      text: "#1d2b1a",
      muted: "#5a6b52",
      accent: "#4a7c3f",
      accentSoft: "#a8d49e",
      accentDark: "#2d5028",
      border: "rgba(74, 124, 63, 0.2)",
      buttonText: "#ffffff",
      gradient1: "#f4f7f3",
      gradient2: "#e8efe6"
    },
    heroMode: "stacked",
    cardMode: "solid",
    texture: "noise",
    motion: "slide",
    badgePrefix: "Verdant",
    keywords: ["growth", "nature", "balance"],
    toneBias: ["friendly", "luxury", "minimal"],
    industryBias: ["wellness", "organic", "lifestyle"],
    cardStyle: "pill",
    shadowIntensity: "light"
  },
  {
    id: "midnight-purple",
    displayName: "Midnight Purple",
    fontHref:
      "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
    headingFont: "'Outfit', sans-serif",
    bodyFont: "'Plus Jakarta Sans', sans-serif",
    palette: {
      bg: "#0f0a1a",
      bgAlt: "#1a1028",
      surface: "rgba(30, 20, 50, 0.8)",
      text: "#f0e8ff",
      muted: "#a08cb8",
      accent: "#a855f7",
      accentSoft: "#d8b4fe",
      accentDark: "#7c3aed",
      border: "rgba(168, 85, 247, 0.3)",
      buttonText: "#ffffff",
      gradient1: "#0f0a1a",
      gradient2: "#1a1028"
    },
    heroMode: "orbital",
    cardMode: "glass",
    texture: "dots",
    motion: "lift",
    badgePrefix: "Cosmic",
    keywords: ["magic", "innovation", "vision"],
    toneBias: ["bold", "tech", "creative"],
    industryBias: ["saas", "app", "digital"],
    cardStyle: "rounded",
    shadowIntensity: "medium"
  },
  {
    id: "warm-terracotta",
    displayName: "Warm Terracotta",
    fontHref:
      "https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Poppins:wght@400;500;600;700&display=swap",
    headingFont: "'Libre Baskerville', serif",
    bodyFont: "'Poppins', sans-serif",
    palette: {
      bg: "#faf6f3",
      bgAlt: "#f5ebe3",
      surface: "rgba(255, 252, 249, 0.9)",
      text: "#2d2118",
      muted: "#6b5a4e",
      accent: "#c45c26",
      accentSoft: "#f5b89a",
      accentDark: "#8b3a15",
      border: "rgba(196, 92, 38, 0.2)",
      buttonText: "#ffffff",
      gradient1: "#faf6f3",
      gradient2: "#f5ebe3"
    },
    heroMode: "centered",
    cardMode: "solid",
    texture: "grain",
    motion: "fade",
    badgePrefix: "Craft",
    keywords: ["heritage", "quality", "artisan"],
    toneBias: ["luxury", "friendly", "corporate"],
    industryBias: ["food", "fashion", "home"],
    cardStyle: "rounded",
    shadowIntensity: "light"
  },
  {
    id: "steel-blue",
    displayName: "Steel Blue",
    fontHref:
      "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700&family=Barlow:wght@400;500;600;700&display=swap",
    headingFont: "'Barlow Condensed', sans-serif",
    bodyFont: "'Barlow', sans-serif",
    palette: {
      bg: "#1a2332",
      bgAlt: "#243044",
      surface: "rgba(35, 48, 68, 0.85)",
      text: "#e8edf3",
      muted: "#8a9bb0",
      accent: "#3b82f6",
      accentSoft: "#93c5fd",
      accentDark: "#1d4ed8",
      border: "rgba(59, 130, 246, 0.25)",
      buttonText: "#ffffff",
      gradient1: "#1a2332",
      gradient2: "#243044"
    },
    heroMode: "split",
    cardMode: "outline",
    texture: "stripes",
    motion: "lift",
    badgePrefix: "Aero",
    keywords: ["precision", "trust", "performance"],
    toneBias: ["corporate", "bold", "tech"],
    industryBias: ["aviation", "automotive", "engineering"],
    cardStyle: "sharp",
    shadowIntensity: "medium"
  }
];

const RECENT_VARIANT_LIMIT = 3;
const recentVariantIds: string[] = [];

function normalizeContent(raw: unknown): NormalizedContent {
  const input = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const companyRaw =
    input.company && typeof input.company === "object"
      ? (input.company as Record<string, unknown>)
      : {};
  const heroRaw =
    input.hero && typeof input.hero === "object"
      ? (input.hero as Record<string, unknown>)
      : {};

  const companyName = toText(companyRaw.name, "Your Company");
  const companyTagline = toText(
    companyRaw.tagline,
    "High-impact solution for modern digital teams"
  );
  const companyLine = toText(
    companyRaw.one_line,
    `${companyName} helps teams execute faster with better clarity.`
  );

  const heroNumbers = toArray<Record<string, unknown>>(heroRaw.big_numbers)
    .map((metric) => ({
      label: toText(metric.label, "Metric"),
      value: toText(metric.value, "N/A")
    }))
    .filter((item) => item.label && item.value)
    .slice(0, 4);

  const pillars = toArray<Record<string, unknown>>(input.pillars)
    .map((pillar) => ({
      title: toText(pillar.title, "Core Pillar"),
      tag: toText(pillar.tag, "PILLAR"),
      description: toText(pillar.description, "High-value capability that drives customer outcomes.")
    }))
    .slice(0, 6);

  const products = toArray<Record<string, unknown>>(input.products)
    .map((product) => ({
      name: toText(product.name, `${companyName} Product`),
      short_pitch: toText(product.short_pitch, "Built for ambitious teams."),
      detail_paragraph: toText(
        product.detail_paragraph,
        "Robust platform designed for speed, reliability, and real business impact."
      ),
      key_features: toArray<string>(product.key_features)
        .map((feature) => toText(feature))
        .filter(Boolean)
        .slice(0, 5)
    }))
    .slice(0, 6);

  const useCases = toArray<Record<string, unknown>>(input.use_cases)
    .map((entry) => ({
      title: toText(entry.title, "Operational Use Case"),
      audience: toText(entry.audience, "Cross-functional teams"),
      scenario: toText(
        entry.scenario,
        "Teams need to coordinate and deliver quickly under shifting priorities."
      ),
      outcome: toText(
        entry.outcome,
        "Execution quality improves and delivery becomes more predictable."
      )
    }))
    .slice(0, 6);

  const proof = toArray<Record<string, unknown>>(input.proof)
    .map((entry) => ({
      metric: toText(entry.metric, "Proven traction"),
      explanation: toText(entry.explanation, "Customers report meaningful gains in speed and consistency.")
    }))
    .slice(0, 6);

  const visionRaw =
    input.vision && typeof input.vision === "object"
      ? (input.vision as Record<string, unknown>)
      : {};
  const ctaRaw =
    input.cta && typeof input.cta === "object"
      ? (input.cta as Record<string, unknown>)
      : {};

  const disclaimers = toArray<string>(input.disclaimers)
    .map((entry) => toText(entry))
    .filter(Boolean)
    .slice(0, 4);

  const testimonials = toArray<Record<string, unknown>>(input.testimonials)
    .map((t) => ({
      quote: toText(t.quote, "Great product that transformed our workflow."),
      author: toText(t.author, "Team Member"),
      role: toText(t.role, "Customer"),
      avatar: toText(t.avatar)
    }))
    .slice(0, 6);

  const faq = toArray<Record<string, unknown>>(input.faq)
    .map((f) => ({
      question: toText(f.question, "Frequently asked question?"),
      answer: toText(f.answer, "Answer to the frequently asked question.")
    }))
    .slice(0, 6);

  const team = toArray<Record<string, unknown>>(input.team)
    .map((m) => ({
      name: toText(m.name, "Team Member"),
      role: toText(m.role, "Position"),
      bio: toText(m.bio),
      avatar: toText(m.avatar)
    }))
    .slice(0, 6);

  const partners = toArray<Record<string, unknown>>(input.partners)
    .map((p) => ({
      name: toText(p.name, "Partner"),
      logo: toText(p.logo),
      description: toText(p.description)
    }))
    .slice(0, 8);

  const features = toArray<Record<string, unknown>>(input.features)
    .map((f) => ({
      title: toText(f.title, "Feature"),
      description: toText(f.description, "Feature description"),
      icon: toText(f.icon)
    }))
    .slice(0, 8);

  return {
    company: {
      name: companyName,
      tagline: companyTagline,
      one_line: companyLine
    },
    hero: {
      headline: toText(heroRaw.headline, `${companyName} Reimagined for Scale`),
      subheadline: toText(
        heroRaw.subheadline,
        "A high-performance platform experience designed for modern growth teams."
      ),
      big_numbers:
        heroNumbers.length > 0
          ? heroNumbers
          : [
              { label: "Adoption", value: "High" },
              { label: "Setup", value: "< 1 day" },
              { label: "Execution", value: "Faster" }
            ],
      supporting_paragraph: toText(
        heroRaw.supporting_paragraph,
        `${companyName} transforms fragmented workflows into a unified, high-velocity operating system for your team.`
      )
    },
    pillars:
      pillars.length > 0
        ? pillars
        : [
            {
              title: "Clarity by Default",
              tag: "CLARITY",
              description: "Align teams around priorities, responsibilities, and measurable outcomes."
            },
            {
              title: "Operational Speed",
              tag: "SPEED",
              description: "Reduce delays with clean execution paths and fewer handoff bottlenecks."
            },
            {
              title: "Scalable Foundation",
              tag: "SCALE",
              description: "Grow confidently with systems designed to handle complexity over time."
            }
          ],
    products:
      products.length > 0
        ? products
        : [
            {
              name: `${companyName} Core Platform`,
              short_pitch: "Purpose-built for business-critical workflows.",
              detail_paragraph:
                "Combines visibility, automation, and collaboration in one system of action.",
              key_features: [
                "Workflow automation",
                "Real-time visibility",
                "Cross-team coordination",
                "Actionable analytics"
              ]
            }
          ],
    use_cases:
      useCases.length > 0
        ? useCases
        : [
            {
              title: "Launch Execution",
              audience: "Marketing and product teams",
              scenario: "Need to ship campaigns and releases quickly without confusion.",
              outcome: "Coordinated planning and faster execution with fewer missed deadlines."
            },
            {
              title: "Cross-Team Operations",
              audience: "Ops and leadership",
              scenario: "Teams work in silos with inconsistent process standards.",
              outcome: "Unified operating model with better accountability and throughput."
            }
          ],
    proof:
      proof.length > 0
        ? proof
        : [
            {
              metric: "Trusted by growth-focused teams",
              explanation: "Used to improve execution quality and shorten delivery cycles."
            },
            {
              metric: "Consistent operational gains",
              explanation: "Teams report better coordination and more predictable outcomes."
            }
          ],
    vision: {
      headline: toText(visionRaw.headline, `The next chapter of ${companyName}`),
      body: toText(
        visionRaw.body,
        `${companyName} is designed to become a long-term system for high-performance team execution.`
      )
    },
    cta: {
      primary_label: toText(ctaRaw.primary_label, "Get Started"),
      secondary_label: toText(ctaRaw.secondary_label, "Book a Demo"),
      note: toText(ctaRaw.note, "Ready to experience a faster, more confident way to operate?")
    },
    disclaimers:
      disclaimers.length > 0
        ? disclaimers
        : [
            "All performance outcomes depend on team context and implementation quality."
          ],
    testimonials:
      testimonials.length > 0
        ? testimonials
        : [
            {
              quote: "This platform transformed how our team operates. Productivity increased significantly within the first month.",
              author: "Sarah Chen",
              role: "VP of Operations"
            },
            {
              quote: "The best investment we've made for our team's efficiency. Intuitive, powerful, and reliable.",
              author: "Marcus Johnson",
              role: "CEO"
            }
          ],
    faq:
      faq.length > 0
        ? faq
        : [
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
            }
          ],
    team:
      team.length > 0
        ? team
        : [],
    partners:
      partners.length > 0
        ? partners
        : [],
    features:
      features.length > 0
        ? features
        : [
            {
              title: "Real-time Analytics",
              description: "Track performance with live dashboards and custom reports."
            },
            {
              title: "Seamless Integration",
              description: "Connect with your favorite tools through our robust API."
            },
            {
              title: "Enterprise Security",
              description: "Bank-level encryption and compliance with industry standards."
            },
            {
              title: "24/7 Support",
              description: "Our team is always available to help you succeed."
            }
          ]
  };
}

function metricToCounter(value: string) {
  const number = parseFloat(value.replace(/[^\d.]/g, ""));

  if (!Number.isFinite(number) || number <= 0) {
    return null;
  }

  const suffix = value.replace(/[\d.,\s]/g, "") || "";
  return { count: number, suffix };
}

function toTone(value: string | undefined): Tone {
  const normalized = toText(value, "bold").toLowerCase();

  if (normalized === "friendly") return "friendly";
  if (normalized === "corporate") return "corporate";
  if (normalized === "playful") return "playful";
  if (normalized === "luxury") return "luxury";
  if (normalized === "tech") return "tech";
  if (normalized === "creative") return "creative";
  if (normalized === "minimal") return "minimal";
  return "bold";
}

function hashString(text: string) {
  let hash = 2166136261;

  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function detectIndustry(companyName: string, content: NormalizedContent): string {
  const text = `${companyName} ${content.company.tagline} ${content.hero.headline} ${content.products.map(p => p.name).join(" ")}`.toLowerCase();
  
  const industryPatterns: Record<string, RegExp[]> = {
    tech: [/software|app|saas|platform|tech|code|dev|data|ai|ml|cloud|api|system/i],
    finance: [/finance|bank|payment|invest|fintech|crypto|trading|ledger|credit|money/i],
    health: [/health|medical|doctor|clinic|hospital|wellness|pharma|bio|patient|care/i],
    education: [/learn|edu|course|school|training|coach|skill|university|student/i],
    food: [/food|restaurant|chef|cook|meal|organic|cafe|dining|recipe/i],
    travel: [/travel|tour|hotel|flight|booking|vacation|adventure|destination/i],
    fashion: [/fashion|wear|clothing|apparel|design|style|brand|retail/i],
    realestate: [/real estate|property|home|building|rent|buy|apartment|commercial/i],
    marketing: [/marketing|seo|advert|brand|content|social|media|agency|growth/i],
    devtools: [/dev|developer|tool|code|git|debug|test|deploy|ci\/cd/i],
    gaming: [/game|gaming|play|player|arcade|esport|entertainment/i],
    agency: [/agency|consulting|firm|agency|services|solution|partner/i]
  };

  for (const [industry, patterns] of Object.entries(industryPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        return industry;
      }
    }
  }

  return "general";
}

function chooseVariant(content: NormalizedContent, tone: Tone) {
  const detectedIndustry = detectIndustry(content.company.name, content);
  
  const toneCandidates = DESIGN_VARIANTS.filter((variant) => variant.toneBias.includes(tone));
  const industryCandidates = DESIGN_VARIANTS.filter((variant) => variant.industryBias.includes(detectedIndustry));
  
  let pool = toneCandidates.length > 0 ? toneCandidates : DESIGN_VARIANTS;
  
  if (industryCandidates.length > 0 && toneCandidates.length > 0) {
    const intersection = industryCandidates.filter(v => toneCandidates.includes(v));
    if (intersection.length > 0) {
      pool = intersection;
    }
  } else if (industryCandidates.length > 0) {
    pool = industryCandidates;
  }
  
  const available = pool.filter((variant) => !recentVariantIds.includes(variant.id));
  const options = available.length > 0 ? available : pool;

  const seedSource = `${content.company.name}|${content.hero.headline}|${tone}|${detectedIndustry}|${Date.now()}|${Math.random()}`;
  const idx = hashString(seedSource) % options.length;
  const variant = options[idx];

  recentVariantIds.push(variant.id);
  if (recentVariantIds.length > RECENT_VARIANT_LIMIT) {
    recentVariantIds.shift();
  }

  return variant;
}

function buildTextureLayer(texture: DesignVariant["texture"]) {
  if (texture === "grid") {
    return "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)";
  }

  if (texture === "dots") {
    return "radial-gradient(rgba(255,255,255,0.22) 1px, transparent 1px)";
  }

  if (texture === "grain") {
    return "radial-gradient(rgba(0,0,0,0.07) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)";
  }

  if (texture === "waves") {
    return "linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.05) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.05) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.05) 75%)";
  }

  if (texture === "noise") {
    return "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")";
  }

  return "repeating-linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.12) 2px, transparent 2px, transparent 10px)";
}

function buildTextureSize(texture: DesignVariant["texture"]) {
  if (texture === "grid") {
    return "36px 36px, 36px 36px";
  }

  if (texture === "dots") {
    return "22px 22px";
  }

  if (texture === "grain") {
    return "9px 9px, 13px 13px";
  }

  if (texture === "waves") {
    return "40px 40px, 40px 40px";
  }

  if (texture === "noise") {
    return "200px 200px";
  }

  return "140px 140px";
}

function normalizeWebsiteUrl(rawUrl?: string) {
  if (!rawUrl) {
    return "";
  }

  try {
    const parsed = new URL(rawUrl);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "";
    }

    return parsed.toString();
  } catch {
    return "";
  }
}

function buildHeroVisual(variant: DesignVariant, companyName: string) {
  if (variant.heroImage) {
    return `
      <div class="hero-visual revup">
        <img src="${escapeAttr(variant.heroImage)}" alt="${escapeAttr(companyName)} visual" loading="lazy" />
        <div class="hero-glow"></div>
        <div class="hero-reflection"></div>
      </div>`;
  }

  return `
    <div class="hero-visual hero-abstract revup">
      <canvas id="hero-canvas"></canvas>
      <div class="orb orb-a"></div>
      <div class="orb orb-b"></div>
      <div class="orb orb-c"></div>
      <div class="orb orb-d"></div>
    </div>`;
}

export function buildShowcasePage(rawContent: unknown, websiteUrl?: string, toneInput?: string) {
  const content = normalizeContent(rawContent);
  const tone = toTone(toneInput);
  const variant = chooseVariant(content, tone);
  const h = escapeHtml;
  const a = escapeAttr;

  const textureLayer = buildTextureLayer(variant.texture);
  const textureSize = buildTextureSize(variant.texture);

  const heroStats = content.hero.big_numbers
    .map((item, idx) => {
      const counter = metricToCounter(item.value);
      const counterAttrs = counter
        ? ` data-count="${a(String(counter.count))}" data-suffix="${a(counter.suffix)}"`
        : "";

      return `
      <div class="stat revup" style="transition-delay:${idx * 0.08}s">
        <div class="stat-value"${counterAttrs}>${h(item.value)}</div>
        <div class="stat-label">${h(item.label)}</div>
      </div>`;
    })
    .join("");

  const pillarCards = content.pillars
    .map(
      (pillar, idx) => `
      <article class="card revup" style="transition-delay:${idx * 0.07}s">
        <div class="card-tag">${h(pillar.tag)}</div>
        <h3>${h(pillar.title)}</h3>
        <p>${h(pillar.description)}</p>
      </article>`
    )
    .join("");

  const productCards = content.products
    .map(
      (product, idx) => `
      <article class="card card-product revup" style="transition-delay:${idx * 0.07}s">
        <h3>${h(product.name)}</h3>
        <p class="sub">${h(product.short_pitch)}</p>
        <p>${h(product.detail_paragraph)}</p>
        <ul>${product.key_features.map((feature) => `<li>${h(feature)}</li>`).join("")}</ul>
      </article>`
    )
    .join("");

  const useCaseCards = content.use_cases
    .map(
      (item, idx) => `
      <article class="card revup" style="transition-delay:${idx * 0.07}s">
        <h3>${h(item.title)}</h3>
        <p><strong>Audience:</strong> ${h(item.audience)}</p>
        <p><strong>Scenario:</strong> ${h(item.scenario)}</p>
        <p><strong>Outcome:</strong> ${h(item.outcome)}</p>
      </article>`
    )
    .join("");

  const proofCards = content.proof
    .map(
      (item, idx) => `
      <article class="proof-chip revup" style="transition-delay:${idx * 0.06}s">
        <h3>${h(item.metric)}</h3>
        <p>${h(item.explanation)}</p>
      </article>`
    )
    .join("");

  const testimonialCards = content.testimonials
    .map(
      (t, idx) => `
      <div class="testimonial-card revup" style="transition-delay:${idx * 0.1}s">
        <div class="quote-mark">"</div>
        <p class="quote">${h(t.quote)}</p>
        <div class="author">
          <div class="avatar">${t.author.charAt(0)}</div>
          <div class="author-info">
            <div class="author-name">${h(t.author)}</div>
            <div class="author-role">${h(t.role)}</div>
          </div>
        </div>
      </div>`
    )
    .join("");

  const faqItems = content.faq
    .map(
      (f, idx) => `
      <details class="faq-item revup" style="transition-delay:${idx * 0.05}s">
        <summary class="faq-question">${h(f.question)}</summary>
        <p class="faq-answer">${h(f.answer)}</p>
      </details>`
    )
    .join("");

  const teamCards = content.team
    .map(
      (m, idx) => `
      <div class="team-card revup" style="transition-delay:${idx * 0.1}s">
        <div class="team-avatar">${m.name.charAt(0)}</div>
        <h3>${h(m.name)}</h3>
        <p class="team-role">${h(m.role)}</p>
        ${m.bio ? `<p class="team-bio">${h(m.bio)}</p>` : ""}
      </div>`
    )
    .join("");

  const partnerLogos = content.partners
    .map(
      (p, idx) => `
      <div class="partner-logo revup" style="transition-delay:${idx * 0.08}s">
        <div class="partner-icon">${p.name.charAt(0)}</div>
        <span>${h(p.name)}</span>
      </div>`
    )
    .join("");

  const featureCards = content.features
    .map(
      (f, idx) => `
      <div class="feature-card revup" style="transition-delay:${idx * 0.08}s">
        <div class="feature-icon">${f.icon || "✦"}</div>
        <h3>${h(f.title)}</h3>
        <p>${h(f.description)}</p>
      </div>`
    )
    .join("");

  const disclaimerMarkup = content.disclaimers.map((line) => `<p>${h(line)}</p>`).join("");

  const websiteLink = normalizeWebsiteUrl(websiteUrl);
  const websiteCta = websiteLink
    ? `<a class="btn btn-secondary" href="${a(websiteLink)}" target="_blank" rel="noreferrer">Visit Website</a>`
    : "";

  const navLabel = `${variant.badgePrefix} ${variant.displayName}`;
  const heroVisual = buildHeroVisual(variant, content.company.name);
  
  const hasTestimonials = content.testimonials && content.testimonials.length > 0;
  const hasFAQ = content.faq && content.faq.length > 0;
  const hasTeam = content.team && content.team.length > 0;
  const hasPartners = content.partners && content.partners.length > 0;
  const hasFeatures = content.features && content.features.length > 0;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${h(content.company.name)} - Landing Experience</title>
<meta name="description" content="${h(content.company.tagline)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${a(variant.fontHref)}" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:${variant.palette.bg};
  --bg-alt:${variant.palette.bgAlt};
  --surface:${variant.palette.surface};
  --text:${variant.palette.text};
  --muted:${variant.palette.muted};
  --accent:${variant.palette.accent};
  --accent-soft:${variant.palette.accentSoft};
  --accent-dark:${variant.palette.accentDark};
  --border:${variant.palette.border};
  --button-text:${variant.palette.buttonText};
  --gradient1:${variant.palette.gradient1};
  --gradient2:${variant.palette.gradient2};
  --heading:${variant.headingFont};
  --body:${variant.bodyFont};
  --card-radius:${variant.cardStyle === "pill" ? "30px" : variant.cardStyle === "sharp" ? "4px" : "18px"};
}
html{scroll-behavior:smooth}
body{
  font-family:var(--body);
  color:var(--text);
  background:
    radial-gradient(ellipse at 20% 20%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 50%),
    radial-gradient(ellipse at 80% 80%, color-mix(in srgb, var(--accent-soft) 22%, transparent), transparent 45%),
    radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--accent-dark) 8%, transparent), transparent 60%),
    linear-gradient(180deg, var(--bg) 0%, var(--bg-alt) 100%);
  background-attachment:fixed;
  line-height:1.7;
  overflow-x:hidden;
}
body::before{
  content:"";
  position:fixed;
  inset:0;
  pointer-events:none;
  background-image:${textureLayer};
  background-size:${textureSize};
  opacity:0.1;
  mix-blend-mode:overlay;
  z-index:0;
}
#particles-canvas{position:fixed;inset:0;pointer-events:none;z-index:0}
main,header,footer,nav,section{position:relative;z-index:1}
h1,h2,h3,h4{font-family:var(--heading);line-height:1.2;letter-spacing:-0.01em}
p{color:var(--muted);line-height:1.6}
a{text-decoration:none;color:inherit;transition:color 0.3s ease}
.topbar{
  position:fixed;
  top:0;
  left:0;
  right:0;
  z-index:1000;
  backdrop-filter:blur(20px);
  -webkit-backdrop-filter:blur(20px);
  background:color-mix(in srgb, var(--bg) 82%, transparent);
  border-bottom:1px solid color-mix(in srgb, var(--border) 50%, transparent);
  transition:all 0.3s ease;
}
.topbar.scrolled{
  background:color-mix(in srgb, var(--bg) 92%, transparent);
  box-shadow:0 4px 30px rgba(0,0,0,0.1);
}
.topbar-inner{
  width:min(1300px,92vw);
  margin:0 auto;
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:1rem 0;
  gap:1rem;
}
.brand{font-family:var(--heading);font-size:1.1rem;font-weight:700;letter-spacing:0.02em;text-transform:uppercase;background:linear-gradient(135deg,var(--accent),var(--accent-soft));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.nav-links{display:flex;gap:0.3rem;list-style:none;flex-wrap:wrap;justify-content:flex-end;align-items:center}
.nav-links a{font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;padding:0.5rem 1rem;border-radius:999px;border:1px solid transparent;transition:all 0.3s ease}
.nav-links a:hover{border-color:var(--accent);background:color-mix(in srgb, var(--accent) 12%, transparent);color:var(--accent)}
.nav-links .btn-cta{background:var(--accent);color:var(--button-text);margin-left:0.5rem}
.nav-links .btn-cta:hover{transform:translateY(-2px);box-shadow:0 8px 25px color-mix(in srgb,var(--accent) 40%,transparent)}
@media(max-width:900px){.nav-links{display:none}}
.section{width:min(1300px,92vw);margin:0 auto;padding:6rem 0;position:relative}
.section-pad{padding-top:8rem}
.hero-section{
  min-height:100vh;
  display:flex;
  align-items:center;
  padding-top:100px;
}
.hero-shell{
  display:grid;
  grid-template-columns:${variant.heroMode === "stacked" ? "1fr" : variant.heroMode === "centered" ? "1fr" : "minmax(0,1.15fr) minmax(300px,1fr)"};
  gap:4rem;
  align-items:center;
}
.hero-centered{text-align:center;max-width:900px;margin:0 auto}
.hero-centered .hero-sub,.hero-centered .hero-support{max-width:700px;margin-left:auto;margin-right:auto}
.hero-centered .stats{justify-content:center}
.hero-copy{perspective:1000px;padding:2rem 0}
.hero-badge{
  display:inline-flex;
  font-size:0.72rem;
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:0.15em;
  border:1px solid var(--accent);
  padding:0.4rem 1rem;
  border-radius:999px;
  margin-bottom:1.5rem;
  color:var(--accent);
  background:color-mix(in srgb, var(--accent) 12%, transparent);
  animation:badgePulse 2s ease-in-out infinite,badgeFloat 4s ease-in-out infinite;
}
@keyframes badgePulse{0%,100%{box-shadow:0 0 0 0 color-mix(in srgb,var(--accent) 40%,transparent)}50%{box-shadow:0 0 20px 5px color-mix(in srgb,var(--accent) 20%,transparent)}}
@keyframes badgeFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
.hero-copy h1{font-size:clamp(2.5rem,5.5vw,4.8rem);margin-bottom:1.2rem;background:linear-gradient(135deg,var(--text) 0%,var(--muted) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:titleReveal 1s cubic-bezier(0.16,1,0.3,1) forwards}
@keyframes titleReveal{from{opacity:0;transform:translateY(30px);filter:blur(10px)}to{opacity:1;transform:translateY(0);filter:blur(0)}}
.hero-sub{font-size:clamp(1.1rem,2.4vw,1.4rem);max-width:650px;margin-bottom:1rem;animation:fadeUp 0.8s 0.2s cubic-bezier(0.16,1,0.3,1) forwards;opacity:0}
.hero-support{font-size:1rem;max-width:600px;margin-bottom:1.5rem;animation:fadeUp 0.8s 0.35s cubic-bezier(0.16,1,0.3,1) forwards;opacity:0}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.hero-visual{
  border-radius:28px;
  border:1px solid var(--border);
  min-height:380px;
  background:linear-gradient(135deg,color-mix(in srgb, var(--surface) 92%, transparent),color-mix(in srgb, var(--surface) 60%, transparent));
  overflow:hidden;
  position:relative;
  transform-style:preserve-3d;
  perspective:1500px;
  animation:visualReveal 1s 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
  opacity:0;
}
@keyframes visualReveal{from{opacity:0;transform:rotateX(-10deg) rotateY(10deg) scale(0.95)}to{opacity:1;transform:rotateX(0) rotateY(0) scale(1)}}
.hero-visual img{width:100%;height:100%;object-fit:cover;display:block}
.hero-glow{position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 0%,var(--bg) 100%);pointer-events:none}
.hero-reflection{position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,color-mix(in srgb,var(--accent) 15%,transparent));pointer-events:none}
.hero-abstract{display:grid;place-items:center;background:linear-gradient(135deg,var(--bg),var(--bg-alt))}
#hero-canvas{position:absolute;inset:0;width:100%;height:100%}
.orb{position:absolute;border-radius:50%;filter:blur(2px);animation:orbFloat 10s ease-in-out infinite}
.orb-a{width:220px;height:220px;background:radial-gradient(circle,var(--accent),transparent 70%);top:15%;left:10%;animation-delay:0s}
.orb-b{width:160px;height:160px;background:radial-gradient(circle,var(--accent-soft),transparent 70%);right:12%;top:22%;animation-delay:-2.5s}
.orb-c{width:280px;height:280px;border:1px solid var(--border);bottom:-15%;left:30%;animation-delay:-5s}
.orb-d{width:100px;height:100px;background:radial-gradient(circle,var(--accent-dark),transparent 70%);top:45%;right:20%;animation-delay:-7.5s}
.orb-e{width:150px;height:150px;background:radial-gradient(circle,var(--accent),transparent 70%);bottom:20%;left:5%;animation-delay:-3s}
@keyframes orbFloat{0%,100%{transform:translate(0,0) scale(1);opacity:0.7}25%{transform:translate(15px,-20px) scale(1.08);opacity:1}50%{transform:translate(-8px,15px) scale(0.95);opacity:0.6}75%{transform:translate(-20px,-8px) scale(1.04);opacity:0.85}}
.hero-orbital .hero-shell,.hero-centered .hero-shell{grid-template-columns:1fr}
.hero-orbital .hero-visual,.hero-centered .hero-visual{display:none}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1rem;margin-top:2rem}
.stat{border-radius:16px;border:1px solid var(--border);padding:1.2rem 1.4rem;background:color-mix(in srgb, var(--surface) 60%, transparent);transform:translateZ(30px);transition:all 0.4s cubic-bezier(0.175,0.885,0.32,1.275)}
.stat:hover{transform:translateZ(50px) translateY(-8px);box-shadow:0 25px 50px -15px color-mix(in srgb,var(--accent) 30%,transparent)}
.stat-value{font-family:var(--heading);font-size:1.5rem;font-weight:700;color:var(--accent);margin-bottom:0.3rem}
.stat-label{font-size:0.75rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted)}
.kicker{display:inline-flex;font-size:0.72rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;border:1px solid var(--accent);padding:0.35rem 0.85rem;border-radius:999px;color:var(--accent);margin-bottom:1rem;background:color-mix(in srgb, var(--accent) 10%, transparent)}
.section-header{text-align:center;margin-bottom:3rem}
.section h2{font-size:clamp(1.8rem,3.5vw,3rem);margin-bottom:0.8rem}
.section-desc{max-width:650px;margin:0 auto;font-size:1.1rem}
.panel{border-radius:28px;border:1px solid var(--border);padding:2.2rem;background:linear-gradient(135deg,color-mix(in srgb, var(--surface) 88%, transparent),color-mix(in srgb, var(--surface) 55%, transparent));backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.grid{display:grid;gap:1.2rem}
.grid-2{grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}
.grid-3{grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}
.grid-4{grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}
.card{transition:all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);position:relative;overflow:hidden}
.card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 12%,transparent),transparent);opacity:0;transition:opacity 0.4s ease}
.card:hover::before{opacity:1}
.card:hover{transform:translateY(-12px);box-shadow:0 30px 60px -20px color-mix(in srgb, var(--accent) 35%, transparent)}
${variant.cardStyle === "pill" ? ".card{border-radius:30px}" : variant.cardStyle === "sharp" ? ".card{border-radius:4px}" : ".card{border-radius:18px}"}
${variant.cardMode === "glass" ? ".card{background:linear-gradient(135deg,color-mix(in srgb, var(--surface) 75%, transparent),color-mix(in srgb, var(--surface) 40%, transparent))}" : variant.cardMode === "solid" ? ".card{background:color-mix(in srgb, var(--accent-soft) 8%, var(--surface))}" : ".card{background:transparent}"}
.card-tag{font-size:0.68rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--accent);margin-bottom:0.7rem;display:inline-block}
.card h3{font-size:1.2rem;margin-bottom:0.5rem}
.card .sub{font-weight:600;color:var(--text);opacity:0.9}
.card ul{margin:0.8rem 0 0 1.2rem}
.card li{color:var(--muted);font-size:0.95rem;line-height:1.6;margin-bottom:0.4rem}
.proof-chip{transition:all 0.35s ease}
.proof-chip:hover{transform:translateX(8px);border-color:var(--accent)}
.proof-chip h3{font-size:1rem}
.proof-chip p{font-size:0.9rem}

/* Testimonials */
.testimonial-card{text-align:center;padding:2rem;border-radius:24px;background:linear-gradient(145deg,color-mix(in srgb, var(--surface) 90%, transparent),color-mix(in srgb, var(--surface) 50%, transparent));border:1px solid var(--border)}
.quote-mark{font-family:var(--heading);font-size:4rem;line-height:1;color:var(--accent);opacity:0.3;margin-bottom:-1rem}
.quote{font-size:1.1rem;font-style:italic;color:var(--text);margin-bottom:1.5rem}
.author{display:flex;align-items:center;justify-content:center;gap:0.8rem}
.avatar{width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent-soft));display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--button-text);font-size:1.1rem}
.author-name{font-weight:600;color:var(--text)}
.author-role{font-size:0.85rem;color:var(--muted)}

/* FAQ */
.faq-item{margin-bottom:0.8rem;border-radius:14px;border:1px solid var(--border);background:color-mix(in srgb, var(--surface) 50%, transparent);overflow:hidden}
.faq-question{padding:1.2rem 1.5rem;font-weight:600;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-size:1.05rem}
.faq-question::after{content:'+';font-size:1.5rem;color:var(--accent);transition:transform 0.3s ease}
.faq-item[open] .faq-question::after{transform:rotate(45deg)}
.faq-answer{padding:0 1.5rem 1.5rem;color:var(--muted);font-size:0.95rem}

/* Team */
.team-card{text-align:center;padding:2rem;border-radius:20px;background:color-mix(in srgb, var(--surface) 60%, transparent);border:1px solid var(--border)}
.team-avatar{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent-soft));display:flex;align-items:center;justify-content:center;font-family:var(--heading);font-size:2rem;font-weight:700;color:var(--button-text);margin:0 auto 1rem}
.team-role{color:var(--accent);font-size:0.9rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem}
.team-bio{font-size:0.9rem}

/* Partners */
.partners-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1.5rem;align-items:center}
.partner-logo{display:flex;flex-direction:column;align-items:center;gap:0.5rem;padding:1.5rem;border-radius:16px;background:color-mix(in srgb, var(--surface) 50%, transparent);border:1px solid var(--border);transition:all 0.3s ease}
.partner-logo:hover{transform:scale(1.05);border-color:var(--accent)}
.partner-icon{width:50px;height:50px;border-radius:12px;background:linear-gradient(135deg,var(--accent),var(--accent-soft));display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--button-text);font-size:1.2rem}
.partner-logo span{font-size:0.85rem;font-weight:600;color:var(--muted)}

/* Features */
.feature-card{text-align:center;padding:2rem;border-radius:var(--card-radius);border:1px solid var(--border);background:linear-gradient(145deg,color-mix(in srgb, var(--surface) 85%, transparent),color-mix(in srgb, var(--surface) 45%, transparent));transition:all 0.4s ease}
.feature-card:hover{transform:translateY(-8px);box-shadow:0 25px 50px -15px color-mix(in srgb,var(--accent) 25%,transparent)}
.feature-icon{font-size:2.5rem;margin-bottom:1rem;animation:iconFloat 3s ease-in-out infinite}
@keyframes iconFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.feature-card h3{font-size:1.15rem;margin-bottom:0.5rem}
.feature-card p{font-size:0.95rem}

/* CTA Section */
.cta-section{text-align:center;padding:5rem 2rem;background:linear-gradient(135deg,color-mix(in srgb, var(--accent) 18%, var(--surface)),color-mix(in srgb, var(--accent-soft) 12%, var(--surface)));border-radius:32px;border:1px solid var(--border);position:relative;overflow:hidden}
.cta-section::before{content:'';position:absolute;inset:0;background:conic-gradient(from 0deg at 50% 50%,transparent,color-mix(in srgb,var(--accent) 15%,transparent),transparent);animation:ctaRotate 12s linear infinite;opacity:0.4}
@keyframes ctaRotate{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.cta-section>*{position:relative;z-index:1}
.cta-section h2{font-size:clamp(1.8rem,3vw,2.5rem);margin-bottom:1rem}
.cta-section p{max-width:550px;margin:0 auto 2rem;font-size:1.1rem}
.btn-row{display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;margin-top:1.5rem}
.btn{display:inline-flex;align-items:center;justify-content:center;border-radius:12px;padding:1rem 2rem;text-transform:uppercase;letter-spacing:0.06em;font-size:0.8rem;font-weight:700;border:1px solid transparent;transition:all 0.3s cubic-bezier(0.175,0.885,0.32,1.275);position:relative;overflow:hidden}
.btn::before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,0.25),transparent);opacity:0;transition:opacity 0.3s ease}
.btn:hover::before{opacity:1}
.btn-primary{background:var(--accent);color:var(--button-text);box-shadow:0 8px 30px color-mix(in srgb,var(--accent) 45%,transparent)}
.btn-primary:hover{transform:translateY(-4px) scale(1.02);box-shadow:0 15px 40px color-mix(in srgb,var(--accent) 55%,transparent)}
.btn-secondary{border-color:var(--border);color:var(--text)}
.btn-secondary:hover{border-color:var(--accent);transform:translateY(-3px)}
footer{border-top:1px solid var(--border);margin-top:4rem;background:color-mix(in srgb, var(--bg) 88%, transparent)}
.footer-inner{width:min(1300px,92vw);margin:0 auto;padding:2rem 0;text-align:center}
.footer-inner p{font-size:0.85rem}
.revup{opacity:0;transform:translateY(40px) scale(0.96);transition:opacity 0.8s cubic-bezier(0.16,1,0.3,1),transform 0.8s cubic-bezier(0.16,1,0.3,1)}
.revup.on{opacity:1;transform:translateY(0) scale(1)}
.motion-lift .revup{transform:translateY(45px)}
.motion-slide .revup{transform:translateX(-45px)}
.motion-zoom .revup{transform:scale(0.92)}
.motion-fade .revup{transform:translateY(20px);opacity:0}
.motion-bounce .revup{transform:translateY(60px)}
.motion-slide .revup.on,.motion-zoom .revup.on,.motion-fade .revup.on,.motion-bounce .revup.on{transform:none}

/* Parallax Background */
.parallax-bg{position:absolute;inset:-50%;pointer-events:none;opacity:0.15}
.parallax-layer{position:absolute;width:100%;height:100%;animation:parallaxMove 30s linear infinite}
@keyframes parallaxMove{from{transform:translateY(0)}to{transform:translateY(-50%)}}

/* Responsive */
@media(max-width:1000px){
  .hero-shell{grid-template-columns:1fr}
  .hero-copy{padding-top:0;text-align:center}
  .hero-sub,.hero-support{margin-left:auto;margin-right:auto}
  .stats{justify-content:center}
  .hero-visual{min-height:300px}
}
@media(max-width:720px){
  .section{padding:4rem 0}
  .panel{padding:1.2rem}
  .testimonial-card,.team-card,.feature-card{padding:1.5rem}
}
</style>
</head>
<body class="motion-${variant.motion} ${variant.heroMode === "orbital" ? "hero-orbital" : ""} ${variant.heroMode === "centered" ? "hero-centered" : ""}">
<canvas id="particles-canvas"></canvas>

<nav class="topbar" id="navbar">
  <div class="topbar-inner">
    <div class="brand">${h(content.company.name)}</div>
    <ul class="nav-links">
      <li><a href="#pillars">Pillars</a></li>
      <li><a href="#features">Features</a></li>
      <li><a href="#products">Products</a></li>
      <li><a href="#testimonials">Reviews</a></li>
      <li><a href="#faq">FAQ</a></li>
      <li><a href="#final" class="btn-cta">Get Started</a></li>
    </ul>
  </div>
</nav>

<main>
  <!-- Hero Section -->
  <section class="section hero-section" id="hero">
    <div class="hero-shell">
      <div class="hero-copy">
        <div class="hero-badge">${h(navLabel)}</div>
        <h1>${h(content.hero.headline)}</h1>
        <p class="hero-sub">${h(content.hero.subheadline)}</p>
        <p class="hero-support">${h(content.hero.supporting_paragraph)}</p>
        <div class="stats">${heroStats}</div>
      </div>
      ${heroVisual}
    </div>
  </section>

  <!-- Features Section -->
  ${hasFeatures ? `
  <section class="section" id="features">
    <div class="section-header">
      <div class="kicker">Capabilities</div>
      <h2>Everything you need to succeed</h2>
      <p class="section-desc">Powerful features designed to transform your workflow</p>
    </div>
    <div class="panel">
      <div class="grid grid-4">${featureCards}</div>
    </div>
  </section>
  ` : ""}

  <!-- Pillars Section -->
  <section class="section" id="pillars">
    <div class="section-header">
      <div class="kicker">${h(variant.keywords[0])}</div>
      <h2>Why ${h(content.company.name)} leads the way</h2>
      <p class="section-desc">${h(content.company.tagline)}</p>
    </div>
    <div class="panel">
      <div class="grid grid-3">${pillarCards}</div>
    </div>
  </section>

  <!-- Products Section -->
  <section class="section" id="products">
    <div class="section-header">
      <div class="kicker">${h(variant.keywords[1])}</div>
      <h2>Solutions built for impact</h2>
      <p class="section-desc">${h(content.company.one_line)}</p>
    </div>
    <div class="panel">
      <div class="grid grid-2">${productCards}</div>
    </div>
  </section>

  <!-- Testimonials Section -->
  ${hasTestimonials ? `
  <section class="section" id="testimonials">
    <div class="section-header">
      <div class="kicker">Testimonials</div>
      <h2>Loved by teams everywhere</h2>
      <p class="section-desc">See what our customers have to say</p>
    </div>
    <div class="grid grid-3">${testimonialCards}</div>
  </section>
  ` : ""}

  <!-- Use Cases Section -->
  <section class="section" id="use-cases">
    <div class="section-header">
      <div class="kicker">${h(variant.keywords[2])}</div>
      <h2>Real-world applications</h2>
      <p class="section-desc">Solving complex challenges across industries</p>
    </div>
    <div class="panel">
      <div class="grid grid-2">${useCaseCards}</div>
    </div>
  </section>

  <!-- Partners Section -->
  ${hasPartners ? `
  <section class="section" id="partners">
    <div class="section-header">
      <div class="kicker">Partners</div>
      <h2>Trusted by industry leaders</h2>
      <p class="section-desc">Working with the best to deliver excellence</p>
    </div>
    <div class="partners-grid">${partnerLogos}</div>
  </section>
  ` : ""}

  <!-- Proof Section -->
  <section class="section" id="proof">
    <div class="section-header">
      <div class="kicker">Results</div>
      <h2>Proven performance</h2>
      <p class="section-desc">Evidence of measurable impact</p>
    </div>
    <div class="panel">
      <div class="grid grid-3">${proofCards}</div>
    </div>
  </section>

  <!-- FAQ Section -->
  ${hasFAQ ? `
  <section class="section" id="faq">
    <div class="section-header">
      <div class="kicker">Questions</div>
      <h2>Frequently asked questions</h2>
      <p class="section-desc">Everything you need to know</p>
    </div>
    <div class="panel">
      ${faqItems}
    </div>
  </section>
  ` : ""}

  <!-- Team Section -->
  ${hasTeam ? `
  <section class="section" id="team">
    <div class="section-header">
      <div class="kicker">Team</div>
      <h2>Meet the experts</h2>
      <p class="section-desc">The people driving innovation</p>
    </div>
    <div class="grid grid-4">${teamCards}</div>
  </section>
  ` : ""}

  <!-- Final CTA Section -->
  <section class="section" id="final">
    <div class="cta-section revup">
      <div class="kicker">Start Today</div>
      <h2>${h(content.vision.headline)}</h2>
      <p>${h(content.vision.body)}</p>
      <p><strong>${h(content.cta.note)}</strong></p>
      <div class="btn-row">
        <a class="btn btn-primary" href="#">${h(content.cta.primary_label)}</a>
        <a class="btn btn-secondary" href="#">${h(content.cta.secondary_label)}</a>
        ${websiteCta}
      </div>
    </div>
  </section>
</main>

<footer>
  <div class="footer-inner">
    ${disclaimerMarkup}
    <p style="margin-top:1rem;opacity:0.6">&copy; ${new Date().getFullYear()} ${h(content.company.name)}. All rights reserved.</p>
  </div>
</footer>

<script>
(function(){
  // Navbar scroll effect
  var navbar=document.getElementById('navbar');
  window.addEventListener('scroll',function(){
    if(window.scrollY>50){navbar.classList.add('scrolled')}else{navbar.classList.remove('scrolled')}
  });

  // Scroll reveal
  var revealItems=document.querySelectorAll('.revup');
  var revealObserver=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){entry.target.classList.add('on')}
    });
  },{threshold:0.1,rootMargin:'0px 0px -50px 0px'});
  revealItems.forEach(function(el){revealObserver.observe(el)});

  // Animated counters
  function animateCounter(el){
    var target=parseFloat(el.getAttribute('data-count')||'0');
    var suffix=el.getAttribute('data-suffix')||'';
    if(!target||target<=0)return;
    var value=0;
    var step=target/60;
    var interval=setInterval(function(){
      value+=step;
      if(value>=target){value=target;clearInterval(interval)}
      var nextText=target%1!==0?value.toFixed(1):Math.floor(value).toString();
      el.textContent=nextText+suffix;
    },16);
  }
  var counters=document.querySelectorAll('[data-count]');
  counters.forEach(function(counterEl){
    var hasRun=false;
    var observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!hasRun&&entry.isIntersecting){hasRun=true;animateCounter(counterEl)}
      });
    },{threshold:0.5});
    observer.observe(counterEl);
  });

  // Particle system
  (function(){
    var canvas=document.getElementById('particles-canvas');
    if(!canvas){canvas=document.createElement('canvas');canvas.id='particles-canvas';document.body.insertBefore(canvas,document.body.firstChild)}
    var ctx=canvas.getContext('2d');
    var particles=[];
    var particleCount=70;
    var mouseX=0,mouseY=0;
    var w=window.innerWidth,h=window.innerHeight;
    function resize(){w=window.innerWidth;h=window.innerHeight;canvas.width=w;canvas.height=h}
    resize();window.addEventListener('resize',resize);
    document.addEventListener('mousemove',function(e){mouseX=e.clientX;mouseY=e.clientY});
    for(var i=0;i<particleCount;i++){particles.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-0.5)*0.6,vy:(Math.random()-0.5)*0.6,size:Math.random()*2.5+1,alpha:Math.random()*0.5+0.1})}
    function draw(){
      ctx.clearRect(0,0,w,h);
      particles.forEach(function(p){
        p.x+=p.vx;p.y+=p.vy;
        if(p.x<0)p.x=w;if(p.x>w)p.x=0;if(p.y<0)p.y=h;if(p.y>h)p.y=0;
        var dx=mouseX-p.x,dy=mouseY-p.y,dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<180){var force=(180-dist)/180;p.vx+=(dx/dist)*force*0.015;p.vy+=(dy/dist)*force*0.015}
        p.vx*=0.995;p.vy*=0.995;
        ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
        ctx.fillStyle='rgba(255,255,255,'+p.alpha+')';ctx.fill();
      });
      for(var i=0;i<particles.length;i++){
        for(var j=i+1;j<particles.length;j++){
          var dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y,dist=Math.sqrt(dx*dx+dy*dy);
          if(dist<140){ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);ctx.strokeStyle='rgba(255,255,255,'+(0.12*(1-dist/140))+')';ctx.stroke()}
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  })();

  // 3D Hero Canvas
  (function(){
    var heroCanvas=document.getElementById('hero-canvas');
    if(!heroCanvas)return;
    var ctx=heroCanvas.getContext('2d');
    var width,height,shapes=[];
    function resize(){var rect=heroCanvas.parentElement.getBoundingClientRect();width=rect.width;height=rect.height;heroCanvas.width=width;heroCanvas.height=height}
    resize();window.addEventListener('resize',resize);
    for(var i=0;i<12;i++){shapes.push({x:Math.random()*width,y:Math.random()*height,z:Math.random()*250,radius:Math.random()*35+12,vx:(Math.random()-0.5)*0.6,vy:(Math.random()-0.5)*0.6})}
    function draw(){
      ctx.clearRect(0,0,width,height);
      shapes.forEach(function(s){
        s.x+=s.vx;s.y+=s.vy;
        if(s.x<-60)s.x=width+60;if(s.x>width+60)s.x=-60;if(s.y<-60)s.y=height+60;if(s.y>height+60)s.y=-60;
        var scale=250/(250+s.z),x2d=(s.x-width/2)*scale+width/2,y2d=(s.y-height/2)*scale+height/2,r=s.radius*scale;
        var grad=ctx.createRadialGradient(x2d,y2d,0,x2d,y2d,r);
        grad.addColorStop(0,'rgba(255,255,255,'+(0.35*scale)+')');
        grad.addColorStop(0.5,'rgba(100,200,255,'+(0.2*scale)+')');
        grad.addColorStop(1,'rgba(100,200,255,0)');
        ctx.beginPath();ctx.arc(x2d,y2d,r,0,Math.PI*2);ctx.fillStyle=grad;ctx.fill();
        ctx.beginPath();ctx.arc(x2d,y2d,r*1.6,0,Math.PI*2);ctx.strokeStyle='rgba(255,255,255,'+(0.08*scale)+')';ctx.stroke();
      });
      requestAnimationFrame(draw);
    }
    draw();
  })();

  // Card hover tilt
  (function(){
    var cards=document.querySelectorAll('.card,.testimonial-card,.team-card,.feature-card,.proof-chip');
    cards.forEach(function(card){
      card.addEventListener('mousemove',function(e){
        var rect=card.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top,cx=rect.width/2,cy=rect.height/2;
        card.style.transform='perspective(1000px) rotateX('+((y-cy)/cy*-10)+'deg) rotateY('+((x-cx)/cx*10)+'deg) translateY(-10px)';
      });
      card.addEventListener('mouseleave',function(){card.style.transform=''});
    });
  })();

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor){
    anchor.addEventListener('click',function(e){
      e.preventDefault();
      var target=document.querySelector(this.getAttribute('href'));
      if(target){target.scrollIntoView({behavior:'smooth',block:'start'})}
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-item summary').forEach(function(summary){
    summary.addEventListener('click',function(){
      this.parentElement.classList.toggle('open');
    });
  });
})();
</script>
</body>
</html>`;
}

