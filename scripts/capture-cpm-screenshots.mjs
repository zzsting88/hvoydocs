import { chromium } from "/Users/zack/work/APIVerifier/node_modules/playwright/index.mjs";
import fs from "node:fs/promises";
import path from "node:path";

const BASE_URL = process.env.CPM_DOCS_BASE_URL || "http://127.0.0.1:5174";
const OUT_DIR = new URL("../assets/images/cpm/", import.meta.url);

const now = "2026-06-01T10:00:00+08:00";
const campaignRef = "cc_demoCpmGuide2026x";

function partnerPro(active = true) {
  return {
    expiresAt: active ? "2026-12-31T23:59:59+08:00" : null,
    active,
    remainingDays: active ? 213 : 0,
    permissions: [
      { key: "cpm", label: "CPM 投放", enabled: active },
      { key: "analytics", label: "数据分析", enabled: active },
    ],
    billing: {
      allowedMonths: [1, 3, 6],
      monthlyDisplayAmountCents: 29900,
      displayCurrency: "CNY",
      gatewayCurrency: "HKD",
      termsVersion: "2026-05-19",
      termsPath: "/partner/terms",
    },
  };
}

const site = {
  relaySiteId: 101,
  siteName: "示例中转站",
  siteDomain: "example-relay.ai",
  signupUrl: "https://example-relay.ai/register",
  slug: "example-relay",
  isPublic: true,
  qqGroupId: "",
  telegramUrl: "",
  wechatId: "",
  siteDescription: "用于文档截图的示例站点。",
  officialSiteEstablishedAt: "2025-09-01",
  statusPageUrl: "https://status.example-relay.ai",
  partnerPro: partnerPro(true),
  detailUpdatedAt: now,
  pendingDetailChange: null,
};

const overview = {
  authenticated: true,
  user: {
    id: 1,
    username: "demo_partner",
    email: "partner@example-relay.ai",
    emailVerifiedAt: "2026-05-01T09:00:00+08:00",
  },
  sites: [site],
  siteOptions: [
    {
      relaySiteId: site.relaySiteId,
      siteName: site.siteName,
      siteDomain: site.siteDomain,
      partnerPro: site.partnerPro,
    },
  ],
  adminMessages: [],
  listingRequests: [],
  payments: [],
  verification: {
    personal: { status: "approved" },
    enterprise: { status: "approved" },
  },
  verificationAttemptQuota: {
    windowDays: 7,
    limit: 3,
    used: 0,
    remaining: 3,
    resetAt: null,
  },
  selectedRelaySiteId: site.relaySiteId,
  selectedSiteName: site.siteName,
  periods: {},
  dailyTrend: [],
  hourlyTrend: [],
  sourceBreakdown: [],
  modelAlgoBreakdown: [],
  displayAlgoBreakdown: [],
  rankPositionBreakdown: [],
  positionBreakdown: [],
};

const campaigns = [
  {
    publicRef: campaignRef,
    relaySiteId: site.relaySiteId,
    siteName: site.siteName,
    siteDomain: site.siteDomain,
    targetPosition: "lb|gpt55|*|pin1",
    landingQueryString: "aff=demo&utm_source=hvoyai&utm_medium=cpm",
    bidCpmCents: 7500,
    budgetTotalCents: 300000,
    budgetDailyCents: 80000,
    minImpressions: 1000,
    servedCapDaily: 8,
    billableViewableCapDaily: 6,
    capTimezone: "Asia/Hong_Kong",
    dailyStartMinute: null,
    dailyEndMinute: null,
    startAt: "2026-06-01T00:00:00+08:00",
    endAt: "2026-06-30T23:59:59+08:00",
    isLongTerm: false,
    status: "active",
    archivedAt: null,
    spentCents: 128400,
    pendingSpendCents: 3200,
    servedImpressions: 28600,
    impressionsDelivered: 21840,
    validImpressionsDelivered: 17120,
    pacingMode: "even",
    pacingSkipRatio: 0.08,
    isTest: false,
    createdAt: "2026-05-28T15:10:00+08:00",
    updatedAt: now,
  },
  {
    publicRef: "cc_demoDraftPlan2026y",
    relaySiteId: site.relaySiteId,
    siteName: site.siteName,
    siteDomain: site.siteDomain,
    targetPosition: "index|sonnet|*|pin2",
    landingQueryString: "aff=sonnet",
    bidCpmCents: 6000,
    budgetTotalCents: 120000,
    budgetDailyCents: null,
    minImpressions: 1000,
    servedCapDaily: 8,
    billableViewableCapDaily: 6,
    capTimezone: "Asia/Hong_Kong",
    dailyStartMinute: 540,
    dailyEndMinute: 1320,
    startAt: "2026-06-05T09:00:00+08:00",
    endAt: null,
    isLongTerm: true,
    status: "draft",
    archivedAt: null,
    spentCents: 0,
    pendingSpendCents: 0,
    servedImpressions: 0,
    impressionsDelivered: 0,
    validImpressionsDelivered: 0,
    pacingMode: "even",
    pacingSkipRatio: 0,
    isTest: true,
    createdAt: "2026-05-31T12:30:00+08:00",
    updatedAt: now,
  },
];

const cpmReport = {
  dateFrom: "2026-05-19",
  dateTo: "2026-06-01",
  summary: {
    auctions: 22640,
    impressions: 21840,
    viewableImpressions: 18420,
    billableImpressions: 17120,
    refundedImpressions: 18,
    clicks: 856,
    spentCents: 128400,
    refundedCents: 135,
    ctr: 0.05,
    viewableRate: 0.843,
    avgCpmCents: 7500,
  },
  budgetForecast: {
    remainingBudgetCents: 168400,
    averageDailySpendCents: 12300,
    estimatedDaysRemaining: 13.7,
    estimatedBudgetEndDateHk: "2026-06-14",
    willExhaustWithin7Days: false,
  },
  daily: [
    ["2026-05-26", 920, 860, 42, 6450],
    ["2026-05-27", 1100, 1010, 56, 7575],
    ["2026-05-28", 1680, 1520, 81, 11400],
    ["2026-05-29", 2400, 2200, 112, 16500],
    ["2026-05-30", 3200, 2980, 143, 22350],
    ["2026-05-31", 4100, 3860, 201, 28950],
    ["2026-06-01", 5020, 4690, 221, 35175],
  ].map(([date, viewableImpressions, billableImpressions, clicks, spentCents]) => ({
    date,
    auctions: Number(billableImpressions) + 180,
    impressions: Number(viewableImpressions) + 260,
    viewableImpressions,
    billableImpressions,
    refundedImpressions: 0,
    clicks,
    spentCents,
    refundedCents: 0,
    ctr: Number(clicks) / Number(billableImpressions),
    viewableRate: 0.84,
    avgCpmCents: 7500,
  })),
  positionBreakdown: [
    {
      source: "lb",
      modelTab: "gpt55",
      displayAlgo: "*",
      position: "pin1",
      positionKey: "lb|gpt55|*|pin1",
      auctions: 22640,
      impressions: 21840,
      viewableImpressions: 18420,
      billableImpressions: 17120,
      refundedImpressions: 18,
      clicks: 856,
      spentCents: 128400,
      refundedCents: 135,
      ctr: 0.05,
      viewableRate: 0.843,
      avgCpmCents: 7500,
    },
  ],
  modelBreakdown: [
    {
      source: "lb",
      modelTab: "gpt55",
      displayAlgo: "*",
      position: "pin1",
      positionKey: "lb|gpt55|*|pin1",
      auctions: 22640,
      impressions: 21840,
      viewableImpressions: 18420,
      billableImpressions: 17120,
      refundedImpressions: 18,
      clicks: 856,
      spentCents: 128400,
      refundedCents: 135,
      ctr: 0.05,
      viewableRate: 0.843,
      avgCpmCents: 7500,
    },
  ],
  datePositionBreakdown: [],
  auctionPriceDistribution: {
    truncated: false,
    summary: {
      auctions: 22640,
      avgEffectiveCpmCents: 7500,
      p50EffectiveCpmCents: 7200,
      p90EffectiveCpmCents: 8600,
      minEffectiveCpmCents: 6000,
      maxEffectiveCpmCents: 9800,
      basePriceWins: 9200,
      secondPriceWins: 13440,
      overrideWins: 0,
      basePriceWinRate: 0.406,
      secondPriceWinRate: 0.594,
      overrideWinRate: 0,
      avgWinningBidCpmCents: 7900,
      avgSecondBidCpmCents: 7100,
    },
    buckets: [
      { key: "lt60", label: "< ¥60", minCpmCents: 0, maxCpmCents: 6000, auctions: 2400, rate: 0.106 },
      { key: "60-75", label: "¥60-75", minCpmCents: 6000, maxCpmCents: 7500, auctions: 7300, rate: 0.322 },
      { key: "75-90", label: "¥75-90", minCpmCents: 7500, maxCpmCents: 9000, auctions: 10400, rate: 0.459 },
      { key: "gt90", label: "> ¥90", minCpmCents: 9000, maxCpmCents: null, auctions: 2540, rate: 0.112 },
    ],
  },
  invoiceCoverage: {
    walletNetDebitCents: 128265,
    paidRechargeCents: 300000,
    paidRechargeWithInvoiceCents: 300000,
    paidRechargeWithoutInvoiceCents: 0,
    invoiceCoverageCents: 128265,
    uncoveredCents: 0,
    coverageRate: 1,
    invoiceCount: 1,
    recentInvoices: [],
    status: "ok",
    issueKeys: [],
  },
};

const walletPayload = {
  wallet: {
    partnerUserId: 1,
    balanceCents: 468000,
    pendingSpendCents: 3200,
    totalRechargedCents: 600000,
    totalSpentCents: 132000,
    updatedAt: now,
  },
  transactions: [
    {
      id: 31,
      createdAt: "2026-06-01T09:35:00+08:00",
      kind: "cpm_spend",
      direction: "debit",
      amountCents: 35175,
      balanceAfterCents: 468000,
      note: "CPM impression settlement",
      actorType: "system",
    },
    {
      id: 29,
      createdAt: "2026-05-31T10:20:00+08:00",
      kind: "recharge",
      direction: "credit",
      amountCents: 300000,
      balanceAfterCents: 503175,
      note: "Stripe wallet recharge",
      actorType: "gateway",
    },
    {
      id: 28,
      createdAt: "2026-05-30T23:50:00+08:00",
      kind: "makegood",
      direction: "credit",
      amountCents: 135,
      balanceAfterCents: 203175,
      note: "无效展示补偿返还",
      actorType: "system",
    },
  ],
};

const rechargeOrders = {
  orders: [
    {
      id: 17,
      orderNo: "WR202606010001",
      status: "paid",
      displayCurrency: "CNY",
      displayAmountCents: 300000,
      gatewayCurrency: "HKD",
      gatewayAmountCents: 327000,
      gatewayMethod: "stripe",
      stripeInvoiceId: "in_demo_001",
      stripeInvoiceStatus: "paid",
      invoiceUrl: "https://example.com/invoice.pdf",
      stripeInvoiceUrl: "https://example.com/invoice",
      stripeInvoicePdfUrl: "https://example.com/invoice.pdf",
      createdAt: "2026-05-31T10:10:00+08:00",
      paidAt: "2026-05-31T10:20:00+08:00",
    },
  ],
};

const allChannels = {
  channels: [
    {
      relaySiteId: site.relaySiteId,
      siteDomain: site.siteDomain,
      site: site.siteName,
      channel: "GPT-5.5 高速组",
      modelKey: "gpt-5.5",
      passRate: 96,
      onlineRate: 99,
      avgLatencyS: 1.9,
      latencySuspicious: false,
      latestInputPriceCny: 2.8,
      priceTrend: [],
      sampleCount: 184,
      weightedScore: 91.2,
      defaultRanking: 3,
    },
    {
      relaySiteId: site.relaySiteId,
      siteDomain: site.siteDomain,
      site: site.siteName,
      channel: "GPT-5.5 稳定组",
      modelKey: "gpt-5.5",
      passRate: 94,
      onlineRate: 98,
      avgLatencyS: 2.4,
      latencySuspicious: false,
      latestInputPriceCny: 2.5,
      priceTrend: [],
      sampleCount: 132,
      weightedScore: 88.6,
      defaultRanking: 7,
    },
  ],
};

const adminCampaigns = {
  campaigns: campaigns.map((item, index) => ({
    id: index + 1001,
    partnerUserId: 1,
    partnerUsername: "demo_partner",
    partnerEmail: "partner@example-relay.ai",
    ...item,
  })),
};

const adminReport = {
  report: {
    ...cpmReport,
    campaignId: null,
    campaignIds: [1001],
    budgetForecast: {
      campaignCount: 2,
      activeCampaigns: 1,
      budgetTotalCents: 420000,
      currentSpentCents: 128400,
      currentPendingSpendCents: 3200,
      remainingBudgetCents: 288400,
      reportSpendCents: 128400,
      reportWindowDays: 14,
      averageDailySpendCents: 12300,
      estimatedDaysRemaining: 23.4,
      estimatedBudgetEndDateHk: "2026-06-24",
      willExhaustWithin7Days: false,
      exhaustedCampaigns: 0,
    },
    billingReconciliation: {
      dateFrom: "2026-05-19",
      dateTo: "2026-06-01",
      reportSettledSpendCents: 128400,
      reportRefundedCents: 135,
      walletCpmSpendCents: 128400,
      walletRefundCents: 0,
      walletMakegoodCents: 135,
      walletNetDebitCents: 128265,
      expectedNetDebitCents: 128265,
      deltaCents: 0,
      status: "ok",
      issueKeys: [],
    },
    auctionDiagnostics: {
      summary: {
        requests: 24800,
        requestedPositions: 24800,
        wins: 22640,
        noFills: 2160,
        winRate: 0.913,
        noFillRate: 0.087,
        blockedBySettings: 120,
        matchedCampaigns: 23100,
        eligibleCandidates: 22640,
        partnerProExpired: 0,
        budgetExhausted: 240,
        insufficientWallet: 0,
        pacingSkipped: 1180,
        servedCap: 620,
        runtimeUnavailable: 0,
        excludedPartner: 0,
      },
      reasons: [
        { reasonKey: "pacing_skipped", requests: 1180, wins: 0, noFills: 1180, rate: 0.047 },
        { reasonKey: "served_cap", requests: 620, wins: 0, noFills: 620, rate: 0.025 },
        { reasonKey: "budget_exhausted", requests: 240, wins: 0, noFills: 240, rate: 0.01 },
      ],
      daily: [
        { date: "2026-05-29", requests: 3300, wins: 3040, noFills: 260, blockedBySettings: 20 },
        { date: "2026-05-30", requests: 5100, wins: 4680, noFills: 420, blockedBySettings: 30 },
        { date: "2026-05-31", requests: 6900, wins: 6310, noFills: 590, blockedBySettings: 40 },
        { date: "2026-06-01", requests: 7400, wins: 6810, noFills: 590, blockedBySettings: 30 },
      ],
      positions: [],
    },
  },
};

const basePrices = {
  basePrices: [
    { positionKey: "lb|gpt55|*|pin1", baseCpmCents: 7500, matchPriority: 4, enabled: true, notes: "GPT-5.5 榜单 pin1" },
    { positionKey: "lb|*|*|pin2", baseCpmCents: 5000, matchPriority: 2, enabled: true, notes: "榜单通用 pin2" },
    { positionKey: "index|sonnet|*|pin1", baseCpmCents: 6000, matchPriority: 4, enabled: true, notes: "首页 Sonnet" },
  ],
};

const basePriceRecommendations = {
  ok: true,
  recommendations: [
    {
      positionKey: "lb|gpt55|*|pin1",
      source: "lb",
      modelTab: "gpt55",
      displayAlgo: "*",
      position: "pin1",
      rankPosition: 1,
      dateFrom: "2026-05-29",
      dateTo: "2026-06-01",
      statDays: 3,
      siteCount: 18,
      validImpressions: 18420,
      validClicks: 856,
      ctr: 0.0465,
      clickValueCents: 150,
      recommendedBaseCpmCents: 6975,
      currentBaseCpmCents: 7500,
      currentMatchPriority: 4,
      currentEnabled: true,
      currentNotes: "GPT-5.5 榜单 pin1",
      sampleTooSmall: false,
    },
  ],
};

const pinOverrides = {
  overrides: [
    {
      id: 5,
      positionKey: "lb|gpt55|*|pin1",
      campaignId: 1001,
      partnerUserId: 1,
      partnerUsername: "demo_partner",
      siteName: site.siteName,
      siteDomain: site.siteDomain,
      startAt: "2026-06-01T00:00:00+08:00",
      endAt: "2026-06-03T23:59:59+08:00",
      priority: 10,
      enabled: true,
      notes: "活动期固定置顶",
    },
  ],
};

const operations = {
  ok: true,
  status: {
    settings: { enabled: true, previewEnabled: true, allowedPositionKeys: ["lb|*|*|pin1", "index|*|*|pin1"] },
    runtime: {
      hardDisabled: false,
      candidatePoolEnabled: true,
      memoryFreqCapEnabled: true,
      redisEnabled: true,
      redisConfigured: true,
      redisHealth: {
        configured: true,
        enabled: true,
        healthy: true,
        status: "ok",
        endpoint: "redis://127.0.0.1:6379/2",
        prefix: "hvoy:cpm",
        dbIndex: "2",
        latencyMs: 3,
        timeoutMs: 500,
        checkedAt: now,
      },
      candidatePoolSnapshot: {
        enabled: true,
        ttlMs: 30000,
        maxEntries: 128,
        entryCount: 3,
        healthy: true,
        checkedAt: now,
        entries: [
          { key: "lb|gpt55|*|pin1", cached: true, healthy: true, rowCount: 2, refreshedAt: now, expiresAt: "2026-06-01T10:00:30+08:00", hits: 1860, misses: 8, refreshes: 21 },
        ],
      },
      freqCapSource: "redis",
      candidatePoolTtlMs: 30000,
    },
    cron: {
      alertEnabled: true,
      alertConfigured: true,
      alertProvider: "telegram",
      logDir: "/home/ubuntu/logs",
      issues: [],
      jobs: [
        { job: "settle-cpm-impressions", schedule: "*/5 * * * *", healthy: true, lastSuccessAt: now, expectedIntervalSeconds: 300, maxAgeSeconds: 900, issues: [], lastLines: ["done CPM settlement"] },
        { job: "update-cpm-pacing", schedule: "*/10 * * * *", healthy: true, lastSuccessAt: now, expectedIntervalSeconds: 600, maxAgeSeconds: 1200, issues: [], lastLines: ["done CPM pacing update"] },
        { job: "audit-cpm-makegoods", schedule: "10 3 * * *", healthy: true, lastSuccessAt: "2026-06-01T03:10:00+08:00", expectedIntervalSeconds: 86400, maxAgeSeconds: 93600, issues: [], lastLines: ["done CPM makegood audit"] },
      ],
    },
    anomalyHistory: {
      windowDays: 7,
      totalMakegoods: 2,
      totalRefundCents: 135,
      totalAdjustmentCents: 0,
      daily: [{ dateHk: "2026-05-30", makegoods: 2, refundCents: 135, adjustmentCents: 0 }],
      rules: [{ ruleKey: "duplicate_impression_token", makegoods: 1, refundCents: 75, adjustmentCents: 0 }],
    },
    checkedAt: now,
  },
};

const operationEvents = {
  ok: true,
  events: [
    {
      id: 41,
      createdAt: "2026-06-01T09:50:00+08:00",
      campaignId: 1001,
      partnerUserId: 1,
      relaySiteId: site.relaySiteId,
      siteDomain: site.siteDomain,
      actionKey: "bid_update",
      actorType: "partner",
      actorId: 1,
      before: { bidCpmCents: 7000 },
      after: { bidCpmCents: 7500 },
      note: "partner_dashboard_bid_update",
      visibleToPartner: true,
    },
    {
      id: 40,
      createdAt: "2026-06-01T09:30:00+08:00",
      campaignId: 1001,
      partnerUserId: 1,
      relaySiteId: site.relaySiteId,
      siteDomain: site.siteDomain,
      actionKey: "status_update",
      actorType: "admin",
      actorId: 2,
      before: { status: "scheduled" },
      after: { status: "active" },
      note: "上线前检查通过",
      visibleToPartner: true,
    },
  ],
};

async function fulfillJson(route, payload) {
  await route.fulfill({
    status: 200,
    contentType: "application/json; charset=utf-8",
    body: JSON.stringify(payload),
  });
}

async function installRoutes(page) {
  await page.route("**/__partner/session", (route) => fulfillJson(route, overview));
  await page.route("**/__partner/overview", (route) => fulfillJson(route, overview));
  await page.route("**/__partner/wallet?**", (route) => fulfillJson(route, walletPayload));
  await page.route("**/__partner/wallet/recharge/orders?**", (route) => fulfillJson(route, rechargeOrders));
  await page.route("**/__partner/cpm/campaigns?**", (route) => fulfillJson(route, { ok: true, campaigns, items: campaigns }));
  await page.route("**/__partner/cpm/campaigns", (route) => fulfillJson(route, { ok: true, campaigns, items: campaigns }));
  await page.route(`**/__partner/cpm/campaigns/${campaignRef}`, (route) => fulfillJson(route, { ok: true, campaign: campaigns[0] }));
  await page.route(`**/__partner/cpm/campaigns/${campaignRef}/report?**`, (route) => fulfillJson(route, { ok: true, report: cpmReport }));
  await page.route(`**/__partner/cpm/campaigns/${campaignRef}/bid-history?**`, (route) => fulfillJson(route, {
    ok: true,
    history: [
      { id: 1, createdAt: "2026-06-01T09:50:00+08:00", oldBidCents: 7000, newBidCents: 7500, changedByType: "partner", note: "partner_dashboard_bid_update" },
    ],
  }));
  await page.route(`**/__partner/cpm/campaigns/${campaignRef}/events?**`, (route) => fulfillJson(route, operationEvents));
  await page.route("**/__partner/cpm/minimum-bid?**", (route) => fulfillJson(route, { ok: true, minimumBidCpmCents: 7500, targetPosition: "lb|gpt55|*|pin1" }));
  await page.route("**/__all-channels", (route) => fulfillJson(route, allChannels));
  await page.route("**/__admin/session", (route) => fulfillJson(route, { authenticated: true, user: { username: "admin", roleKey: "admin" } }));
  await page.route("**/__admin/cpm/campaigns?**", (route) => fulfillJson(route, adminCampaigns));
  await page.route("**/__admin/cpm/reports?**", (route) => fulfillJson(route, { ok: true, ...adminReport }));
  await page.route("**/__admin/cpm/settings", (route) => fulfillJson(route, { enabled: true, previewEnabled: true, allowedPositionKeys: ["lb|*|*|pin1", "index|*|*|pin1"] }));
  await page.route("**/__admin/cpm/operations", (route) => fulfillJson(route, operations));
  await page.route("**/__admin/cpm/base-prices?**", (route) => fulfillJson(route, basePrices));
  await page.route("**/__admin/cpm/base-price-recommendations?**", (route) => fulfillJson(route, basePriceRecommendations));
  await page.route("**/__admin/cpm/pin-overrides?**", (route) => fulfillJson(route, pinOverrides));
  await page.route("**/__admin/cpm/operations/events?**", (route) => fulfillJson(route, operationEvents));
}

async function screenshot(page, url, filename, options = {}) {
  await page.goto(`${BASE_URL}${url}`, { waitUntil: "networkidle" });
  if (options.scrollY) {
    await page.evaluate((y) => window.scrollTo(0, y), options.scrollY);
  }
  await page.screenshot({
    path: path.join(OUT_DIR.pathname, filename),
    fullPage: options.fullPage ?? false,
  });
}

await fs.mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1100 },
  deviceScaleFactor: 1,
  locale: "zh-CN",
});
const page = await context.newPage();
await installRoutes(page);

await screenshot(page, "/partner/wallet", "wallet.png");
await screenshot(page, "/partner/cpm/new", "create-campaign.png");
await screenshot(page, "/partner/cpm", "partner-overview.png");
await screenshot(page, "/partner/cpm/campaigns", "campaigns.png");
await screenshot(page, `/partner/cpm/campaigns/${campaignRef}`, "campaign-detail.png");
await screenshot(page, "/admin/cpm-campaigns", "admin-dashboard.png");
await screenshot(page, "/admin/cpm-campaigns?section=campaigns", "admin-campaigns.png");
await screenshot(page, "/admin/cpm-campaigns?section=pricing", "admin-pricing.png", { fullPage: true });
await screenshot(page, "/admin/cpm-campaigns?section=operations", "admin-operations.png");

await browser.close();
console.log(`Saved CPM screenshots to ${OUT_DIR.pathname}`);
