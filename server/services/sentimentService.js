// ─────────────────────────────────────────────────────────
//  StockSense AI · Advanced Sentiment Engine v4
//  ✅ Weighted keyword scoring
//  ✅ Confidence percentage
//  ✅ 5-tier verdict: Strong Positive → Strong Negative
//  ✅ Context-aware chatbot response (based on real data)
//  ✅ No fake/generic responses
// ─────────────────────────────────────────────────────────

// ── Weighted keyword dictionaries ─────────────────────────
const POSITIVE = [
  { w: 'surge',        v: 3.5 }, { w: 'surges',       v: 3.5 }, { w: 'soar',         v: 3.5 },
  { w: 'soars',        v: 3.5 }, { w: 'soared',        v: 3.5 }, { w: 'record',       v: 3.0 },
  { w: 'breakthrough', v: 3.0 }, { w: 'boom',          v: 3.0 }, { w: 'booming',      v: 3.0 },
  { w: 'rally',        v: 3.0 }, { w: 'rallies',       v: 3.0 }, { w: 'skyrocket',    v: 3.5 },
  { w: 'profit',       v: 2.5 }, { w: 'profits',       v: 2.5 }, { w: 'growth',       v: 2.5 },
  { w: 'strong',       v: 2.5 }, { w: 'beat',          v: 2.5 }, { w: 'beats',        v: 2.5 },
  { w: 'bullish',      v: 2.5 }, { w: 'outperform',    v: 2.5 }, { w: 'outperforms',  v: 2.5 },
  { w: 'exceed',       v: 2.5 }, { w: 'exceeded',      v: 2.5 }, { w: 'upgrade',      v: 2.5 },
  { w: 'upgraded',     v: 2.5 }, { w: 'milestone',     v: 2.0 }, { w: 'revenue',      v: 2.0 },
  { w: 'gain',         v: 2.0 }, { w: 'gains',         v: 2.0 }, { w: 'jump',         v: 2.0 },
  { w: 'jumps',        v: 2.0 }, { w: 'boost',         v: 2.0 }, { w: 'boosted',      v: 2.0 },
  { w: 'dividend',     v: 2.0 }, { w: 'invest',        v: 1.5 }, { w: 'investment',   v: 1.5 },
  { w: 'innovation',   v: 1.5 }, { w: 'expand',        v: 2.0 }, { w: 'expansion',    v: 2.0 },
  { w: 'recover',      v: 2.0 }, { w: 'recovery',      v: 2.0 }, { w: 'partnership',  v: 2.0 },
  { w: 'approve',      v: 2.0 }, { w: 'approved',      v: 2.0 }, { w: 'confident',    v: 1.5 },
  { w: 'confidence',   v: 1.5 }, { w: 'win',           v: 2.0 }, { w: 'wins',         v: 2.0 },
  { w: 'up',           v: 0.8 }, { w: 'high',          v: 0.8 }, { w: 'higher',       v: 1.0 },
  { w: 'best',         v: 1.5 }, { w: 'rising',        v: 1.5 }, { w: 'increased',    v: 1.5 },
  { w: 'robust',       v: 1.5 }, { w: 'momentum',      v: 1.5 }, { w: 'demand',       v: 1.0 },
  { w: 'launched',     v: 1.5 }, { w: 'optimism',      v: 1.5 }, { w: 'opportunity',  v: 1.0 },
  { w: 'accelerate',   v: 1.5 }, { w: 'positive',      v: 1.0 }, { w: 'excellent',    v: 1.5 },
  { w: 'leading',      v: 1.0 }, { w: 'acquire',       v: 1.5 }, { w: 'acquisition',  v: 1.5 },
  { w: 'buyback',      v: 2.0 }, { w: 'buybacks',      v: 2.0 }, { w: 'profitability',v: 2.5 },
  { w: 'margins',      v: 1.5 }, { w: 'ipo',           v: 1.5 }, { w: 'contract',     v: 1.5 },
];

const NEGATIVE = [
  { w: 'crash',        v: 4.0 }, { w: 'crashes',       v: 4.0 }, { w: 'collapse',     v: 4.0 },
  { w: 'bankrupt',     v: 4.0 }, { w: 'bankruptcy',    v: 4.0 }, { w: 'fraud',        v: 3.5 },
  { w: 'hack',         v: 3.0 }, { w: 'breach',        v: 3.0 }, { w: 'plunge',       v: 3.5 },
  { w: 'plunges',      v: 3.5 }, { w: 'slump',         v: 3.0 }, { w: 'loss',         v: 2.5 },
  { w: 'losses',       v: 2.5 }, { w: 'decline',       v: 2.5 }, { w: 'declines',     v: 2.5 },
  { w: 'drop',         v: 2.5 }, { w: 'drops',         v: 2.5 }, { w: 'layoffs',      v: 2.5 },
  { w: 'layoff',       v: 2.5 }, { w: 'investigation', v: 2.5 }, { w: 'probe',        v: 2.5 },
  { w: 'lawsuit',      v: 2.5 }, { w: 'lawsuits',      v: 2.5 }, { w: 'fine',         v: 2.5 },
  { w: 'fines',        v: 2.5 }, { w: 'penalty',       v: 2.5 }, { w: 'bearish',      v: 2.5 },
  { w: 'downgrade',    v: 2.5 }, { w: 'downgraded',    v: 2.5 }, { w: 'recession',    v: 2.5 },
  { w: 'tumble',       v: 2.5 }, { w: 'tumbles',       v: 2.5 }, { w: 'fall',         v: 2.0 },
  { w: 'falls',        v: 2.0 }, { w: 'fail',          v: 2.0 }, { w: 'failed',       v: 2.0 },
  { w: 'failure',      v: 2.0 }, { w: 'miss',          v: 2.0 }, { w: 'misses',       v: 2.0 },
  { w: 'weak',         v: 2.0 }, { w: 'weakness',      v: 2.0 }, { w: 'concern',      v: 1.5 },
  { w: 'concerns',     v: 1.5 }, { w: 'risk',          v: 1.5 }, { w: 'risks',        v: 1.5 },
  { w: 'sanction',     v: 2.0 }, { w: 'sanctions',     v: 2.0 }, { w: 'tariff',       v: 2.0 },
  { w: 'tariffs',      v: 2.0 }, { w: 'recall',        v: 2.0 }, { w: 'warning',      v: 2.0 },
  { w: 'lowered',      v: 2.0 }, { w: 'reduced',       v: 1.5 }, { w: 'cut',          v: 1.5 },
  { w: 'cuts',         v: 1.5 }, { w: 'down',          v: 0.8 }, { w: 'low',          v: 0.8 },
  { w: 'slow',         v: 1.0 }, { w: 'slowing',       v: 1.5 }, { w: 'volatile',     v: 1.5 },
  { w: 'volatility',   v: 1.5 }, { w: 'uncertainty',   v: 1.5 }, { w: 'challenge',    v: 1.0 },
  { w: 'challenges',   v: 1.0 }, { w: 'worries',       v: 1.5 }, { w: 'worry',        v: 1.5 },
  { w: 'debt',         v: 1.5 }, { w: 'deficit',       v: 1.5 }, { w: 'default',      v: 2.5 },
  { w: 'worst',        v: 2.0 }, { w: 'withdrawn',     v: 1.5 }, { w: 'headwind',     v: 1.5 },
  { w: 'suspend',      v: 2.0 }, { w: 'suspended',     v: 2.0 }, { w: 'delisted',     v: 3.0 },
  { w: 'resign',       v: 2.0 }, { w: 'resigned',      v: 2.0 }, { w: 'regulatory',   v: 1.5 },
];

// Build fast lookup maps
const posMap = new Map(POSITIVE.map(({ w, v }) => [w, v]));
const negMap = new Map(NEGATIVE.map(({ w, v }) => [w, v]));

const TITLE_WEIGHT = 3.0;   // Title carries more weight
const DESC_WEIGHT  = 1.0;

// ── Score individual text ─────────────────────────────────
function scoreSentenceText(text) {
  if (!text) return { score: 0, pos: [], neg: [] };
  const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
  let score = 0;
  const pos = [];
  const neg = [];

  // Negation context tracking
  const negators = new Set(['not', 'no', 'never', 'without', 'cannot', "can't", "don't", 'neither', 'nor', 'hardly', 'barely']);
  let lastNegatorIdx = -3;

  words.forEach((w, i) => {
    if (negators.has(w)) {
      lastNegatorIdx = i;
      return;
    }
    const isNegated = (i - lastNegatorIdx) <= 2;

    if (posMap.has(w)) {
      const val = posMap.get(w);
      if (isNegated) { score -= val * 0.5; neg.push(w); } // negated positive = mild negative
      else { score += val; pos.push(w); }
    }
    if (negMap.has(w)) {
      const val = negMap.get(w);
      if (isNegated) { score += val * 0.3; pos.push(w); } // negated negative = mild positive
      else { score -= val; neg.push(w); }
    }
  });

  return { score, pos, neg };
}

// ── 5-tier verdict ────────────────────────────────────────
function verdictFromScore(avgScore) {
  if (avgScore >= 4.5)  return { label: 'Strong Positive',   emoji: '🚀', color: 'emerald' };
  if (avgScore >= 1.5)  return { label: 'Mild Positive',     emoji: '🟢', color: 'green'   };
  if (avgScore >= 0.3)  return { label: 'Slightly Positive', emoji: '📈', color: 'teal'    };
  if (avgScore <= -4.5) return { label: 'Strong Negative',   emoji: '💥', color: 'red'     };
  if (avgScore <= -1.5) return { label: 'Mild Negative',     emoji: '🔴', color: 'rose'    };
  if (avgScore <= -0.3) return { label: 'Slightly Negative', emoji: '📉', color: 'orange'  };
  return                       { label: 'Neutral',           emoji: '🟡', color: 'slate'   };
}

// ── Context-aware chatbot response (data-driven, never fake) ──
function buildChatResponse(stockName, avgScore, verdict, topArticle, totalArticles, posCount, negCount, neuCount, topPosKW, topNegKW) {
  const name  = stockName || 'The stock';
  const total = totalArticles || 1;
  const v     = verdict.label;

  const isStrongPos = avgScore >= 4.5;
  const isMildPos   = avgScore >= 1.5;
  const isPositive  = avgScore > 0.3;
  const isStrongNeg = avgScore <= -4.5;
  const isMildNeg   = avgScore <= -1.5;
  const isNegative  = avgScore < -0.3;

  // Opening line based on verdict
  let opening;
  if (isStrongPos)  opening = `🚀 **${name}** is showing **exceptional bullish momentum**`;
  else if (isMildPos)  opening = `${name} is trending with a **${v}** outlook`;
  else if (isPositive) opening = `${name} shows a **${v}** signal in recent coverage`;
  else if (isStrongNeg) opening = `⚠️ **${name}** is under **significant bearish pressure**`;
  else if (isMildNeg)   opening = `${name} is facing a **${v}** trend`;
  else if (isNegative)  opening = `${name} is showing **${v}** sentiment signals`;
  else                  opening = `${name} is showing **neutral** market sentiment`;

  // Key driver from top article (real headline)
  let driver = '';
  if (topArticle?.title && topArticle.title.length > 15) {
    const shortened = topArticle.title.length > 85 ? topArticle.title.slice(0, 85) + '…' : topArticle.title;
    driver = ` — latest key signal: *"${shortened}"*`;
  }

  // Stats line
  const posPct = Math.round((posCount / total) * 100);
  const negPct = Math.round((negCount / total) * 100);
  const neuPct = Math.max(0, 100 - posPct - negPct);
  const statsLine = `Based on **${total} real news articles**: **${posPct}%** positive, **${negPct}%** negative, **${neuPct}%** neutral.`;

  // Keyword drivers
  let kwLine = '';
  if (topPosKW && topPosKW.length > 0 && isPositive) {
    kwLine = `Positive drivers: *${topPosKW.slice(0, 3).join(', ')}*.`;
  } else if (topNegKW && topNegKW.length > 0 && isNegative) {
    kwLine = `Negative signals: *${topNegKW.slice(0, 3).join(', ')}*.`;
  }

  // Actionable insight
  let insight;
  if (isStrongPos)     insight = 'Strong buy signals detected from multiple sources. Momentum appears sustained.';
  else if (isMildPos)  insight = 'Moderate positive outlook supported by recent news coverage.';
  else if (isPositive) insight = 'Slight positive tilt — monitor for confirmation of trend.';
  else if (isStrongNeg) insight = 'Exercise caution — multiple negative signals detected across sources.';
  else if (isMildNeg)  insight = 'Monitor closely for recovery signals before taking positions.';
  else if (isNegative) insight = 'Slight negative bias detected — watch for directional clarity.';
  else                 insight = 'Market is mixed or uncertain — wait for a clearer directional signal.';

  return [opening + driver + '.', statsLine, kwLine, insight].filter(Boolean).join(' ');
}

// ── Main analysis function ────────────────────────────────
function analyzeArticles(articles, query) {
  const stockName = query || 'This stock';

  if (!articles || articles.length === 0) {
    return {
      overall:          'Neutral',
      emoji:            '🟡',
      color:            'slate',
      explanation:      'No news data available to determine market sentiment.',
      distribution:     { positive: 0, neutral: 100, negative: 0 },
      confidence:       'N/A',
      confidenceLabel:  'No Data',
      confidencePercent: 0,
      analyzedArticles: [],
      chatResponse:     `I couldn't find any recent news for ${stockName}. Try a different stock name or ticker.`,
      avgScore:         0,
      posCount: 0, negCount: 0, neuCount: 0,
    };
  }

  let totalWeightedScore = 0;
  let posCount = 0, negCount = 0, neuCount = 0;
  let topPosArticle = null, topNegArticle = null;
  let maxScore = -Infinity, minScore = Infinity;
  let allKeywords = { pos: [], neg: [] };

  const analyzed = articles.map(article => {
    const titleA = scoreSentenceText(article.title);
    const descA  = scoreSentenceText(article.description || '');

    const articleScore = (titleA.score * TITLE_WEIGHT) + (descA.score * DESC_WEIGHT);
    totalWeightedScore += articleScore;

    allKeywords.pos.push(...titleA.pos, ...descA.pos);
    allKeywords.neg.push(...titleA.neg, ...descA.neg);

    let sentiment = 'Neutral';
    if (articleScore > 1.0)       { sentiment = 'Positive'; posCount++; }
    else if (articleScore < -1.0) { sentiment = 'Negative'; negCount++; }
    else                          { neuCount++; }

    if (articleScore > maxScore) { maxScore = articleScore; topPosArticle = article; }
    if (articleScore < minScore) { minScore = articleScore; topNegArticle = article; }

    return {
      ...article,
      sentiment,
      score: parseFloat(articleScore.toFixed(2)),
      keywords: {
        positive: [...new Set(titleA.pos.concat(descA.pos))].slice(0, 4),
        negative: [...new Set(titleA.neg.concat(descA.neg))].slice(0, 4),
      },
    };
  });

  const total      = articles.length;
  const avgScore   = totalWeightedScore / total;
  const posPercent = Math.round((posCount / total) * 100);
  const negPercent = Math.round((negCount / total) * 100);
  const neuPercent = Math.max(0, 100 - posPercent - negPercent);

  const verdict    = verdictFromScore(avgScore);
  const topArticle = avgScore > 0.3 ? topPosArticle : avgScore < -0.3 ? topNegArticle : (analyzed[0] || null);

  // ── Top keywords by frequency ──────────────────────────
  function topFreq(arr, n) {
    const freq = {};
    arr.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, n).map(e => e[0]);
  }
  const topPosKW = topFreq(allKeywords.pos, 6);
  const topNegKW = topFreq(allKeywords.neg, 6);

  const chatResponse = buildChatResponse(
    stockName, avgScore, verdict, topArticle,
    total, posCount, negCount, neuCount,
    topPosKW, topNegKW
  );

  // ── Confidence calculation ─────────────────────────────
  // Based on: article count, signal spread, score clarity
  const spread  = Math.abs(posPercent - negPercent);
  const clarity = Math.abs(avgScore);

  let confidencePercent = 25;
  if (total >= 10 && spread >= 60 && clarity >= 4) confidencePercent = 92 + Math.min(5, clarity);
  else if (total >= 8 && spread >= 50)             confidencePercent = 86 + Math.min(8, spread / 8);
  else if (total >= 6 && spread >= 40)             confidencePercent = 78 + spread / 5;
  else if (total >= 5 && spread >= 30)             confidencePercent = 68 + spread / 4;
  else if (total >= 4 && spread >= 20)             confidencePercent = 58 + spread / 3;
  else if (total >= 3)                             confidencePercent = 48 + Math.min(15, spread / 2);
  else if (total >= 2)                             confidencePercent = 38 + spread / 3;

  confidencePercent = Math.min(97, Math.max(15, Math.round(confidencePercent)));

  let confidenceLabel = 'Low';
  if (confidencePercent >= 80)      confidenceLabel = 'High';
  else if (confidencePercent >= 58) confidenceLabel = 'Medium';

  return {
    overall:          verdict.label,
    emoji:            verdict.emoji,
    color:            verdict.color,
    avgScore:         parseFloat(avgScore.toFixed(3)),
    distribution:     { positive: posPercent, neutral: neuPercent, negative: negPercent },
    confidence:       `${confidencePercent}%`,
    confidencePercent,
    confidenceLabel,
    posCount,
    negCount,
    neuCount,
    topKeywords:      { positive: topPosKW, negative: topNegKW },
    analyzedArticles: analyzed,
    chatResponse,
  };
}

module.exports = { analyzeArticles };
