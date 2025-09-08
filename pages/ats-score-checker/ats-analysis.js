// ats-score-checker/ats-analysis.js
// Stopwords for keyword extraction
const STOPWORDS = new Set([
  'and', 'or', 'the', 'a', 'an', 'to', 'for', 'with', 'in', 'on', 'by', 'of', 'is', 'are', 'be', 'as', 'at', 'you', 'your',
  'will', 'that', 'this', 'from', 'but', 'we', 'our', 'us', 'responsibilities', 'responsibility', 'ability', 'abilities',
  'experience', 'years', 'year', 'including', 'work', 'works', 'working', 'have', 'has', 'using', 'use'
]);

// Advanced keyword extraction: n-grams for phrases
export function extractKeywordsFromJD(text, limit = 100) {
  const cleaned = normalizeText(text);
  const tokens = cleaned.split(/\s+/).filter(Boolean);
  const freq = {};
  const ngrams = [];
  // Single words
  for (let tok of tokens) {
    if (tok.length < 3 || /^\d+$/.test(tok) || STOPWORDS.has(tok)) continue;
    freq[tok] = (freq[tok] || 0) + 1;
  }
  // Bi-grams for phrases
  for (let i = 0; i < tokens.length - 1; i++) {
    const bigram = `${tokens[i]} ${tokens[i + 1]}`;
    if (!STOPWORDS.has(tokens[i]) && !STOPWORDS.has(tokens[i + 1])) {
      freq[bigram] = (freq[bigram] || 0) + 1;
      ngrams.push(bigram);
    }
  }
  const sorted = Object.keys(freq).sort((a, b) => freq[b] - freq[a]);
  return sorted.slice(0, limit);
}

// Enhanced score calculation with weights
export function calculateScore({ totalKeywords, matchedCount, sectionsScore, formattingScore, readabilityScore }) {
  const kWeight = 0.5, sWeight = 0.25, fWeight = 0.15, rWeight = 0.1;
  const kwScore = totalKeywords === 0 ? 50 : Math.round((matchedCount / totalKeywords) * 100);
  const combined = Math.round(kWeight * kwScore + sWeight * (sectionsScore * 100) + fWeight * (formattingScore * 100) + rWeight * (readabilityScore * 100));
  return { final: Math.min(100, combined), kwScore, sectionsScore: Math.round(sectionsScore * 100), formattingScore: Math.round(formattingScore * 100), readabilityScore: Math.round(readabilityScore * 100) };
}

// Enhanced sections analysis
export function analyzeSections(text) {
  const lower = normalizeText(text);
  const checks = {
    email: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(text),
    phone: /(\+?\d{1,3}[-.\s]?)?(\d{10}|\d{3}[-.\s]\d{3}[-.\s]\d{4})/.test(text),
    linkedin: /linkedin\.com/i.test(lower),
    github: /github\.com/i.test(lower),
    skills: /\bskills\b/i.test(lower),
    education: /\beducation\b/i.test(lower) || /\bdegree\b/i.test(lower) || /\bbachelor\b/i.test(lower) || /\bmaster\b/i.test(lower),
    experience: /\bexperience\b/i.test(lower) || /\bprojects\b/i.test(lower) || /\bwork history\b/i.test(lower),
    summary: /\bsummary\b/i.test(lower) || /\bobjective\b/i.test(lower) || /\bprofile\b/i.test(lower)
  };
  const presentCount = Object.values(checks).filter(Boolean).length;
  const score = presentCount / Object.keys(checks).length;
  return { checks, score };
}

// Advanced formatting checks
export function formattingHints(text) {
  const hints = [];
  if (text.length < 500) hints.push('Resume is too short — aim for at least 1 page with detailed achievements.');
  if (text.length > 5000) hints.push('Resume is too long — condense to 1-2 pages for better ATS parsing.');
  if (!/\n-|\n•|\t/.test(text)) hints.push('Add bullet points (e.g., "-", "•") for readability in experience sections.');
  if (text.toUpperCase() === text) hints.push('Avoid all caps; use title case for headings.');
  if (/\b(lorem|ipsum)\b/i.test(text)) hints.push('Remove placeholder text like "lorem ipsum".');
  return hints;
}

// Simple readability score (Flesch-Kincaid approximation)
export function calculateReadability(text) {
  const sentences = text.split(/[.!?]/).length || 1;
  const words = text.split(/\s+/).length || 1;
  const syllables = text.split(/[aeiouy]+/i).length || 1;
  const asl = words / sentences;
  const asw = syllables / words;
  const score = 206.835 - 1.015 * asl - 84.6 * asw;
  return Math.max(0, Math.min(100, score)) / 100; // Normalize to 0-1
}

// Text normalization utility
export function normalizeText(t) {
  return t.replace(/\u00A0/g, ' ').replace(/[\r\n]+/g, ' ').replace(/[^\w\s\-\+\/\.]/g, ' ').toLowerCase().trim();
}