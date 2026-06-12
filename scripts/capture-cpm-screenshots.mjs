import { chromium } from "/Users/zack/work/APIVerifier/node_modules/playwright/index.mjs";
import fs from "node:fs/promises";
import path from "node:path";

const BASE_URL = process.env.CPM_DOCS_BASE_URL || "http://127.0.0.1:5174";
const OUT_DIR = new URL("../assets/images/cpm/", import.meta.url);

const now = "2026-06-01T10:00:00+08:00";
const campaignRef = "cc_cpmguide_abcdefghijklmnopqr";
const coverageRefLbGpt55 = "cv_demoLbGpt55SearchTop";
const coverageRefIndexGpt55 = "cv_demoIndexGpt55SearchTop";
const coverageRefLbSonnet = "cv_demoLbSonnetSearchTop";

function coverage({
  coverageRef,
  coverageKey,
  bidCpmCents,
  enabled = true,
  archivedAt = null,
  sortOrder = 0,
  lastImpressionAt = "2026-06-01T09:45:00+08:00",
  lastClickAt = "2026-06-01T09:48:00+08:00",
}) {
  const [source = "", modelTab = "", displayAlgo = "*", placement = "search_top"] = coverageKey.split("|");
  return {
    coverageRef,
    coverageKey,
    targetPosition: coverageKey,
    source,
    modelTab,
    displayAlgo,
    placement,
    bidCpmCents,
    enabled,
    archivedAt,
    sortOrder,
    createdAt: "2026-05-28T15:10:00+08:00",
    updatedAt: now,
    deliveryAvailability: "available",
    availabilityReason: "",
    availabilityLabel: "",
    lastImpressionAt,
    lastClickAt,
    hasPendingSettlement: false,
  };
}

function coverageOption({
  coverageKey,
  minimumBidCpmCents,
  suggestedBidCpmCents,
  selectable = true,
  reasonCode = "",
  sampleCount = 18420,
  sampleThreshold = 1000,
}) {
  const [source = "", modelTab = "", displayAlgo = "*", placement = "search_top"] = coverageKey.split("|");
  return {
    coverageKey,
    targetPosition: coverageKey,
    source,
    modelTab,
    displayAlgo,
    placement,
    minimumBidCpmCents,
    floorCpmCents: minimumBidCpmCents,
    suggestedBidCpmCents,
    suggestedBidSource: "recent_clearing_price",
    sampleCount,
    sampleThreshold,
    sampleTooSmall: sampleCount < sampleThreshold,
    selectable,
    reasonCode,
  };
}

const coverageOptions = [
  coverageOption({
    coverageKey: "index|gpt55|*|search_top",
    minimumBidCpmCents: 7500,
    suggestedBidCpmCents: 8200,
  }),
  coverageOption({
    coverageKey: "lb|gpt55|*|search_top",
    minimumBidCpmCents: 8000,
    suggestedBidCpmCents: 9000,
  }),
  coverageOption({
    coverageKey: "lb|sonnet46|*|search_top",
    minimumBidCpmCents: 8500,
    suggestedBidCpmCents: 9500,
    sampleCount: 9200,
  }),
  coverageOption({
    coverageKey: "lball|gpt55|*|search_top",
    minimumBidCpmCents: 8800,
    suggestedBidCpmCents: 9600,
    selectable: false,
    reasonCode: "unsupported_model_tab",
    sampleCount: 0,
  }),
];

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
  cpmBetaEnabled: true,
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
    roleKey: "partner",
    canManageSites: true,
  },
  sites: [site],
  siteOptions: [
    {
      relaySiteId: site.relaySiteId,
      siteName: site.siteName,
      siteDomain: site.siteDomain,
      signupUrl: site.signupUrl,
      partnerPro: site.partnerPro,
      cpmBetaEnabled: true,
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
    id: 1001,
    publicRef: campaignRef,
    relaySiteId: site.relaySiteId,
    siteName: site.siteName,
    siteDomain: site.siteDomain,
    campaignName: "GPT-5.5 搜索顶部投放",
    coverages: [
      coverage({
        coverageRef: coverageRefLbGpt55,
        coverageKey: "lb|gpt55|*|search_top",
        bidCpmCents: 9000,
        sortOrder: 0,
      }),
      coverage({
        coverageRef: coverageRefIndexGpt55,
        coverageKey: "index|gpt55|*|search_top",
        bidCpmCents: 8200,
        sortOrder: 1,
      }),
    ],
    coverageCount: 2,
    enabledCoverageCount: 2,
    targetPosition: "lb|gpt55|*|search_top",
    landingQueryString: "aff=demo&utm_source=hvoyai&utm_medium=cpm",
    bidCpmCents: 9000,
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
    stats: {
      dateFrom: "2026-05-19",
      dateTo: "2026-06-01",
      viewableImpressions: 18420,
      clicks: 856,
      ctr: 0.0465,
      reportSpendCents: 128400,
      spendDays: 7,
    },
    budgetForecast: {
      remainingBudgetCents: 168400,
      averageDailySpendCents: 12300,
      estimatedDaysRemaining: 13.7,
      estimatedBudgetEndDateHk: "2026-06-14",
      willExhaustWithin7Days: false,
    },
    dailyBudget: {
      dateHk: "2026-06-01",
      budgetDailyCents: 80000,
      dailySpentCents: 35175,
      dailyReserveMillicents: 3200000,
      remainingDailyBudgetCents: 41625,
    },
    viewableImpressions: 18420,
    clicks: 856,
    ctr: 0.0465,
    validClicksDelivered: 856,
    pacingMode: "even",
    pacingSkipRatio: 0.08,
    isTest: false,
    createdAt: "2026-05-28T15:10:00+08:00",
    updatedAt: now,
  },
  {
    id: 1002,
    publicRef: "cc_draftplan_abcdefghijklmnopqr",
    relaySiteId: site.relaySiteId,
    siteName: site.siteName,
    siteDomain: site.siteDomain,
    campaignName: "Sonnet 覆盖测试计划",
    coverages: [
      coverage({
        coverageRef: coverageRefLbSonnet,
        coverageKey: "lb|sonnet46|*|search_top",
        bidCpmCents: 9500,
        enabled: false,
        sortOrder: 0,
        lastImpressionAt: null,
        lastClickAt: null,
      }),
    ],
    coverageCount: 1,
    enabledCoverageCount: 0,
    targetPosition: "lb|sonnet46|*|search_top",
    landingQueryString: "aff=sonnet",
    bidCpmCents: 9500,
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
    stats: {
      dateFrom: "2026-05-19",
      dateTo: "2026-06-01",
      viewableImpressions: 0,
      clicks: 0,
      ctr: 0,
      reportSpendCents: 0,
      spendDays: 0,
    },
    budgetForecast: {
      remainingBudgetCents: 120000,
      averageDailySpendCents: 0,
      estimatedDaysRemaining: null,
      estimatedBudgetEndDateHk: "",
      willExhaustWithin7Days: false,
    },
    dailyBudget: {
      dateHk: "2026-06-01",
      budgetDailyCents: null,
      dailySpentCents: 0,
      dailyReserveMillicents: 0,
      remainingDailyBudgetCents: null,
    },
    viewableImpressions: 0,
    clicks: 0,
    ctr: 0,
    validClicksDelivered: 0,
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
      position: "search_top",
      positionKey: "lb|gpt55|*|search_top",
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
      position: "search_top",
      positionKey: "lb|gpt55|*|search_top",
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
  coverageBreakdown: [
    {
      campaignCoverageId: 501,
      campaignId: 1001,
      coverageRef: coverageRefLbGpt55,
      coverageKey: "lb|gpt55|*|search_top",
      targetPosition: "lb|gpt55|*|search_top",
      source: "lb",
      modelTab: "gpt55",
      displayAlgo: "*",
      placement: "search_top",
      bidCpmCents: 9000,
      enabled: true,
      archivedAt: null,
      auctions: 22640,
      impressions: 21840,
      viewableImpressions: 18420,
      billableImpressions: 17120,
      refundedImpressions: 18,
      clicks: 856,
      spentCents: 128400,
      refundedCents: 135,
      ctr: 0.0465,
      viewableRate: 0.843,
      avgCpmCents: 7500,
      currentReasonCode: "",
      exclusionCount: 0,
      topExclusionReason: "",
      topExclusionCount: 0,
      delayedSettlementReasonCode: "",
    },
    {
      campaignCoverageId: 502,
      campaignId: 1001,
      coverageRef: coverageRefIndexGpt55,
      coverageKey: "index|gpt55|*|search_top",
      targetPosition: "index|gpt55|*|search_top",
      source: "index",
      modelTab: "gpt55",
      displayAlgo: "*",
      placement: "search_top",
      bidCpmCents: 8200,
      enabled: true,
      archivedAt: null,
      auctions: 0,
      impressions: 0,
      viewableImpressions: 0,
      billableImpressions: 0,
      refundedImpressions: 0,
      clicks: 0,
      spentCents: 0,
      refundedCents: 0,
      ctr: 0,
      viewableRate: 0,
      avgCpmCents: 0,
      currentReasonCode: "no_eligible_inventory",
      exclusionCount: 42,
      topExclusionReason: "no_eligible_inventory",
      topExclusionCount: 42,
      delayedSettlementReasonCode: "",
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
  coveragePriceDistribution: [
    {
      campaignCoverageId: 501,
      campaignId: 1001,
      coverageRef: coverageRefLbGpt55,
      coverageKey: "lb|gpt55|*|search_top",
      targetPosition: "lb|gpt55|*|search_top",
      source: "lb",
      modelTab: "gpt55",
      displayAlgo: "*",
      placement: "search_top",
      bidCpmCents: 9000,
      enabled: true,
      archivedAt: null,
      sortOrder: 0,
      createdAt: "2026-05-28T15:10:00+08:00",
      updatedAt: now,
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
        avgWinningBidCpmCents: 9000,
        avgSecondBidCpmCents: 7100,
      },
      buckets: [
        { key: "60-75", label: "¥60-75", minCpmCents: 6000, maxCpmCents: 7500, auctions: 7300, rate: 0.322 },
        { key: "75-90", label: "¥75-90", minCpmCents: 7500, maxCpmCents: 9000, auctions: 10400, rate: 0.459 },
        { key: "gt90", label: "> ¥90", minCpmCents: 9000, maxCpmCents: null, auctions: 2540, rate: 0.112 },
      ],
    },
    {
      campaignCoverageId: 502,
      campaignId: 1001,
      coverageRef: coverageRefIndexGpt55,
      coverageKey: "index|gpt55|*|search_top",
      targetPosition: "index|gpt55|*|search_top",
      source: "index",
      modelTab: "gpt55",
      displayAlgo: "*",
      placement: "search_top",
      bidCpmCents: 8200,
      enabled: true,
      archivedAt: null,
      sortOrder: 1,
      createdAt: "2026-05-28T15:10:00+08:00",
      updatedAt: now,
      truncated: false,
      summary: {
        auctions: 0,
        avgEffectiveCpmCents: 0,
        p50EffectiveCpmCents: 0,
        p90EffectiveCpmCents: 0,
        minEffectiveCpmCents: 0,
        maxEffectiveCpmCents: 0,
        basePriceWins: 0,
        secondPriceWins: 0,
        overrideWins: 0,
        basePriceWinRate: 0,
        secondPriceWinRate: 0,
        overrideWinRate: 0,
        avgWinningBidCpmCents: 0,
        avgSecondBidCpmCents: 0,
      },
      buckets: [],
    },
  ],
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
    { positionKey: "lb|gpt55|*|search_top", baseCpmCents: 8000, matchPriority: 4, enabled: true, notes: "GPT-5.5 榜单搜索顶部" },
    { positionKey: "index|gpt55|*|search_top", baseCpmCents: 7500, matchPriority: 4, enabled: true, notes: "GPT-5.5 首页搜索顶部" },
    { positionKey: "lb|sonnet46|*|search_top", baseCpmCents: 8500, matchPriority: 4, enabled: true, notes: "Sonnet 4.6 搜索顶部" },
  ],
};

const basePriceRecommendations = {
  ok: true,
  recommendations: [
    {
      positionKey: "lb|gpt55|*|search_top",
      source: "lb",
      modelTab: "gpt55",
      displayAlgo: "*",
      position: "search_top",
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
      currentBaseCpmCents: 8000,
      currentMatchPriority: 4,
      currentEnabled: true,
      currentNotes: "GPT-5.5 榜单搜索顶部",
      sampleTooSmall: false,
    },
  ],
};

const pinOverrides = {
  overrides: [
    {
      id: 5,
      positionKey: "lb|gpt55|*|search_top",
      campaignId: 1001,
      campaignCoverageId: 501,
      coverageRef: coverageRefLbGpt55,
      coverageKey: "lb|gpt55|*|search_top",
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
    settings: { enabled: true, previewEnabled: true, allowedPositionKeys: ["lb|*|*|search_top", "index|*|*|search_top"] },
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
          { key: "lb|gpt55|*|search_top", cached: true, healthy: true, rowCount: 2, refreshedAt: now, expiresAt: "2026-06-01T10:00:30+08:00", hits: 1860, misses: 8, refreshes: 21 },
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
      before: { coverageKey: "lb|gpt55|*|search_top", bidCpmCents: 8500 },
      after: { coverageKey: "lb|gpt55|*|search_top", bidCpmCents: 9000 },
      note: "coverage_bid_update",
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
  await page.route("**/__free-token/session", (route) => fulfillJson(route, {
    authenticated: true,
    user: { id: 1, username: "demo_partner", roleKey: "partner", canManageSites: true },
  }));
  await page.route("**/__partner/session", (route) => fulfillJson(route, overview));
  await page.route("**/__partner/overview", (route) => fulfillJson(route, overview));
  await page.route("**/__partner/wallet?**", (route) => fulfillJson(route, walletPayload));
  await page.route("**/__partner/wallet/recharge/orders?**", (route) => fulfillJson(route, rechargeOrders));
  await page.route(/\/__partner\/cpm\/campaigns(?:\?.*)?$/, (route) => fulfillJson(route, {
    ok: true,
    campaigns,
    items: campaigns,
    pagination: { page: 1, pageSize: 20, total: campaigns.length, totalPages: 1 },
  }));
  await page.route("**/__partner/cpm/coverage-options?**", (route) => fulfillJson(route, { ok: true, items: coverageOptions }));
  await page.route(`**/__partner/cpm/campaigns/${campaignRef}`, (route) => fulfillJson(route, { ok: true, campaign: campaigns[0] }));
  await page.route(`**/__partner/cpm/campaigns/${campaignRef}/coverages`, (route) => fulfillJson(route, { ok: true, coverages: campaigns[0].coverages, items: campaigns[0].coverages }));
  await page.route(/\/__partner\/cpm\/campaigns\/cc_[A-Za-z0-9_-]+\/report(?:\?.*)?$/, (route) => {
    const url = new URL(route.request().url());
    const ref = decodeURIComponent(url.pathname.split("/").slice(-2, -1)[0] || "");
    if (ref === campaignRef) return fulfillJson(route, { ok: true, report: cpmReport });
    return fulfillJson(route, {
      ok: true,
      report: {
        dateFrom: "2026-05-19",
        dateTo: "2026-06-01",
        summary: { viewableImpressions: 0, billableImpressions: 0, clicks: 0, spentCents: 0, ctr: 0 },
        budgetForecast: {},
        dailyBudget: {},
        daily: [],
        positionBreakdown: [],
        modelBreakdown: [],
        coverageBreakdown: [],
        datePositionBreakdown: [],
        auctionPriceDistribution: { summary: {}, buckets: [] },
        coveragePriceDistribution: [],
        invoiceCoverage: {},
      },
    });
  });
  await page.route(`**/__partner/cpm/campaigns/${campaignRef}/bid-history?**`, (route) => fulfillJson(route, {
    ok: true,
    history: [
      {
        id: 1,
        createdAt: "2026-06-01T09:50:00+08:00",
        campaignCoverageId: 501,
        coverageRef: coverageRefLbGpt55,
        coverageKey: "lb|gpt55|*|search_top",
        oldBidCents: 8500,
        newBidCents: 9000,
        changedByType: "partner",
        note: "coverage_bid_update",
      },
    ],
  }));
  await page.route(`**/__partner/cpm/campaigns/${campaignRef}/events?**`, (route) => fulfillJson(route, operationEvents));
  await page.route("**/__partner/cpm/minimum-bid?**", (route) => {
    const url = new URL(route.request().url());
    const targetPosition = url.searchParams.get("targetPosition") || url.searchParams.get("coverageKey") || "lb|gpt55|*|search_top";
    const option = coverageOptions.find((item) => item.coverageKey === targetPosition) || coverageOptions[1];
    return fulfillJson(route, {
      ok: true,
      targetPosition: option.coverageKey,
      minimumBidCpmCents: option.minimumBidCpmCents,
      suggestedBidCpmCents: option.suggestedBidCpmCents,
    });
  });
  await page.route("**/__all-channels", (route) => fulfillJson(route, allChannels));
  await page.route("**/__admin/session", (route) => fulfillJson(route, { authenticated: true, user: { username: "admin", roleKey: "admin" } }));
  await page.route("**/__admin/cpm/campaigns?**", (route) => fulfillJson(route, adminCampaigns));
  await page.route("**/__admin/cpm/reports?**", (route) => fulfillJson(route, { ok: true, ...adminReport }));
  await page.route("**/__admin/cpm/coverage-options?**", (route) => fulfillJson(route, { ok: true, items: coverageOptions }));
  await page.route("**/__admin/cpm/settings", (route) => fulfillJson(route, { enabled: true, previewEnabled: true, allowedPositionKeys: ["lb|*|*|search_top", "index|*|*|search_top"] }));
  await page.route("**/__admin/cpm/operations", (route) => fulfillJson(route, operations));
  await page.route("**/__admin/cpm/base-prices?**", (route) => fulfillJson(route, basePrices));
  await page.route("**/__admin/cpm/base-price-recommendations?**", (route) => fulfillJson(route, basePriceRecommendations));
  await page.route("**/__admin/cpm/pin-overrides?**", (route) => fulfillJson(route, pinOverrides));
  await page.route("**/__admin/cpm/operations/events?**", (route) => fulfillJson(route, operationEvents));
}

async function screenshot(page, url, filename, options = {}) {
  await page.goto(`${BASE_URL}${url}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(options.waitMs ?? 600);
  if (options.scrollY) {
    await page.evaluate((y) => window.scrollTo(0, y), options.scrollY);
    await page.waitForTimeout(200);
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
