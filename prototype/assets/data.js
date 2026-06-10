/* Active Intelligence prototype — shared data model.
   Illustrative figures to make the grounding story legible; not real model output. */
window.DATA = (function(){
  const LYR = { content:'#6E5AA6', campaign:'#2E75B6', individual:'#A8557A' };
  const ROLE_LABEL = { manager:'Marketing Manager', exec:'Executive', analyst:'Analyst' };

  const CAMPAIGNS = [
    {
      id:'c1', flag:'urgent', flagText:'Retention risk', conf:0.86,
      title:'Win back over-mailed mid-tier accounts before renewal',
      trigger:'Cross-layer signal: 62% of at-risk accounts are over-mailed (>4/wk) AND price-sensitive — churn 2.3× baseline.',
      chips:[{l:'content',t:'Content fit',v:'0.71'},{l:'campaign',t:'Goal success',v:'0.83'},{l:'individual',t:'SMS affinity',v:'0.79'}],
      tier:'Industry model',
      lift:'+18 pts', liftLabel:'predicted retention on the at-risk cohort',
      action:'Cap email at 1/wk for this cohort, move the renewal nudge to SMS, attach a loyalty offer.',
      why:{
        narr:'Engagement didn’t fall because the offer is weak — it fell because your <b>highest-value accounts are fatigued</b>. The cross-layer engine joined the <b>Individual layer</b> (email-fatigue + SMS affinity) with the <b>Campaign layer</b> (loyalty-lever success score) and the <b>Content layer</b> (which creative scores for this cohort). The recommendation is the action the scores most support — not a generic best practice.',
        scores:[
          {n:'0.83',m:'Campaign layer · Goal→Automation success (loyalty lever · Industry · Gradient Boosting)'},
          {n:'0.79',m:'Individual layer · SMS channel affinity, at-risk cohort'},
          {n:'0.71',m:'Content layer · Predictive Cohort Impact, loyalty creative'},
          {n:'-0.34',m:'cMAB · marginal value of an additional broadcast email (negative)'}
        ]
      },
      build:{
        goal:'Increase Q3 retention', target:'+15%', voice:'Warm · helpful · concise (ac_default)',
        audienceSize:'3,184', audienceDesc:'mid-tier accounts flagged at-risk · over-mailed & price-sensitive',
        channels:[
          {n:'SMS',d:'Renewal nudge + loyalty offer',pin:'PRIMARY ▲',cls:'up',on:true},
          {n:'Email',d:'Capped to 1 / week',pin:'THROTTLED ▼',cls:'down',on:true},
          {n:'WhatsApp',d:'Not used for this cohort',pin:'OFF',cls:'same',on:false}
        ],
        creative:{icon:'🎁',title:'Loyalty offer — “We’ve missed you” (15% renewal credit)',
          copy:'“You’ve been with us a while — here’s 15% off your renewal as a thank-you. Lock it in by Friday.”',
          score:'Content Impact 0.71 · best-scoring of 6 variants for this cohort'},
        schedule:'Send Tue–Thu, 10am local · cMAB optimizes send-time per individual'
      }
    },
    {
      id:'c2', flag:'rev', flagText:'Revenue', conf:0.81,
      title:'Trigger integration-proof to high-consideration leads',
      trigger:'Funnel signal: 71% of qualified leads stall between /features and demo-booking; integration doubt unanswered.',
      chips:[{l:'content',t:'Proof fit',v:'0.77'},{l:'campaign',t:'Goal success',v:'0.74'},{l:'individual',t:'WhatsApp affinity',v:'0.68'}],
      tier:'Industry model',
      lift:'+22 pts', liftLabel:'predicted demo-booking on stalled leads',
      action:'Send an integration proof-point (WhatsApp where opted-in, else email) on /features revisit.',
      why:{
        narr:'The bottleneck is <b>unanswered integration doubt at high consideration</b>, not top-funnel volume. The Campaign layer scores a proof-led automation shape well above the generic welcome series for this segment, and the Individual layer shows enough WhatsApp affinity to justify the channel. Grounded in your funnel — not a webinar blog.',
        scores:[
          {n:'0.74',m:'Campaign layer · proof-led automation shape success (Industry)'},
          {n:'0.77',m:'Content layer · integration-proof creative impact'},
          {n:'0.68',m:'Individual layer · WhatsApp affinity, opted-in segment'}
        ]
      },
      build:{
        goal:'Grow new-customer acquisition', target:'+20%', voice:'Warm · helpful · concise (ac_default)',
        audienceSize:'4,902', audienceDesc:'qualified leads stalled between /features and demo-booking',
        channels:[
          {n:'WhatsApp',d:'Integration proof snippet (opted-in)',pin:'PRIMARY ▲',cls:'up',on:true},
          {n:'Email',d:'Integration proof fallback',pin:'FALLBACK',cls:'same',on:true},
          {n:'Cold email',d:'Top-funnel broadcast paused',pin:'PAUSED ▼',cls:'down',on:false}
        ],
        creative:{icon:'🔌',title:'Integration proof — “Works with your stack”',
          copy:'“You asked about Shopify — here’s a 30-second look at the live sync, plus a 1-click demo slot.”',
          score:'Content Impact 0.77 · proof-led beats generic welcome by 0.21'},
        schedule:'Trigger on /features revisit or integration question · real-time'
      }
    },
    {
      id:'c3', flag:'pro', flagText:'Proactive', conf:0.79,
      title:'Re-enter dormant list with utility + content, suppress promos',
      trigger:'Dormancy signal: 58% of 90-day-dormant contacts still click utility mail; promo win-backs under-index by 15 pts.',
      chips:[{l:'content',t:'Content fit',v:'0.69'},{l:'campaign',t:'Goal success',v:'0.72'},{l:'individual',t:'Topic affinity',v:'0.74'}],
      tier:'Tenant + Industry blend',
      lift:'+15 pts', liftLabel:'predicted reactivation vs. discount blast',
      action:'Replace promotional win-back with a utility + content re-entry; route a blog digest to recent returners.',
      why:{
        narr:'Your dormant list isn’t dead — it has <b>tuned out promotions specifically</b>. The Individual layer shows utility/content topic affinity; the Campaign layer scores a content-led re-entry shape above the discount blast. Tenant data is thin here, so the engine blends the <b>Industry model</b> for confidence.',
        scores:[
          {n:'0.72',m:'Campaign layer · content-led re-entry shape (Tenant+Industry blend)'},
          {n:'0.74',m:'Individual layer · utility/content topic affinity'},
          {n:'-0.21',m:'cMAB · marginal value of discount creative for dormant cohort'}
        ]
      },
      build:{
        goal:'Reactivate dormant subscribers', target:'+12%', voice:'Warm · helpful · concise (ac_default)',
        audienceSize:'11,740', audienceDesc:'90-day-dormant contacts · still engage utility/content',
        channels:[
          {n:'Email',d:'Utility + content re-entry series',pin:'PRIMARY ▲',cls:'up',on:true},
          {n:'Web',d:'Blog digest to recent returners',pin:'SUPPORT ▲',cls:'up',on:true},
          {n:'Promo email',d:'Discount blast suppressed',pin:'SUPPRESSED ▼',cls:'down',on:false}
        ],
        creative:{icon:'📰',title:'Content re-entry — “The 3 things you missed”',
          copy:'“Here’s what’s new and useful since you’ve been away — no pitch, just the good stuff.”',
          score:'Content Impact 0.69 · utility framing beats promo by 0.15'},
        schedule:'Weekly cadence, Wed AM · suppress promotional creative 90 days'
      }
    }
  ];

  const EXEC_CARD = {
    id:'e1', flag:'rev', flagText:'Portfolio', conf:0.84,
    title:'3 proactive plays this week → ~$48K projected at-risk revenue recoverable',
    trigger:'Across all active goals: retention risk in mid-tier, funnel stall pre-demo, and dormant-list decay are the top 3 movers.',
    chips:[{l:'campaign',t:'Avg goal success',v:'0.78'},{l:'individual',t:'Coverage',v:'71%'},{l:'content',t:'Grounded',v:'100%'}],
    tier:'Industry model',
    lift:'$48K', liftLabel:'projected at-risk revenue recoverable this week',
    action:'Approve all 3 grounded plays, or review each below. Every recommendation traces to a performance score.',
    why:{
      narr:'This is the <b>executive roll-up</b>: the cross-layer engine ranked every open goal by projected revenue impact and grounding confidence. No play is shown unless it traces to measured performance — grounding is 100% on this batch.',
      scores:[
        {n:'$31K',m:'Retention play · at-risk mid-tier cohort'},
        {n:'$12K',m:'Acquisition play · stalled high-consideration leads'},
        {n:'$5K',m:'Reactivation play · dormant list re-entry'}
      ]
    },
    build:null
  };

  const NOTES = {
    manager:[
      {ic:'🔔',bg:'#fdece9',t:'Retention play ready to launch',d:'Over-mailed mid-tier cohort — SMS + loyalty offer, +18pt predicted. One click to review.',m:'2m ago · grounded by Industry model',href:'builder.html?id=c1'},
      {ic:'⚡',bg:'#eef4ff',t:'Funnel stall detected',d:'71% of qualified leads stalling pre-demo. Integration-proof automation drafted.',m:'1h ago',href:'builder.html?id=c2'},
      {ic:'📝',bg:'#f0eaff',t:'Dormant re-entry suggested',d:'Promo win-backs under-indexing 15pts; content-led re-entry recommended.',m:'3h ago',href:'builder.html?id=c3'}
    ],
    exec:[
      {ic:'💰',bg:'#e6f5ee',t:'$48K at-risk revenue recoverable',d:'3 grounded plays this week across retention, acquisition, reactivation. Approve all or review.',m:'today · portfolio view',href:'index.html'},
      {ic:'📈',bg:'#eef4ff',t:'Retention vs. sector benchmark',d:'Your mid-tier retention is 4pts below industry peers — closing it is the top revenue lever.',m:'today',href:'reports.html'},
      {ic:'✅',bg:'#e6f5ee',t:'Grounding compliance: 100%',d:'Every recommendation surfaced this week traces to a performance score. Zero ungrounded outputs.',m:'this week',href:'reports.html'}
    ],
    analyst:[
      {ic:'📊',bg:'#eef4ff',t:'cMAB exploration within budget',d:'Retention campaign exploring at 0.12 vs 0.15 cap. Online learning stable.',m:'12m ago',href:'reports.html'},
      {ic:'🧮',bg:'#fdf3e4',t:'Industry model beat tenant on golden set',d:'Loyalty-lever success score: Industry AUC 0.81 vs Tenant 0.67 (sparse). Defaulting to Industry.',m:'1h ago',href:'reports.html'},
      {ic:'🔍',bg:'#f0eaff',t:'Gradient Boosting feature drift',d:'“email_freq_7d” importance up 0.08 w/w — driving the over-mailing signal. Monitor.',m:'4h ago',href:'reports.html'}
    ]
  };

  const REPORT = {
    content:{ color:LYR.content, name:'Content Layer', q:'Which content scores, for whom', metrics:[
      {t:'Predictive Cohort Impact', v:'0.71', chg:'+0.06 w/w', good:true, pct:71, g:'Gradient Boosting on tenant creative history, validated vs Industry model. Top feature: <code>loyalty_offer_present</code>. Trained on <span class="mt">14.2K sends</span>.'},
      {t:'Creative briefs ingested (OCR+Vision)', v:'128', chg:'+12', good:true, pct:64, g:'128 brand assets parsed via OCR + Vision into the Content layer; <code>brand_voice_id: ac_default</code> applied to scoring.'}
    ]},
    campaign:{ color:LYR.campaign, name:'Campaign Layer', q:'Whether the goal is achievable', metrics:[
      {t:'Goal→Automation Success', v:'0.83', chg:'+0.09 w/w', good:true, pct:83, g:'Industry model + Gradient Boosting. Loyalty-lever automation shape outperforms broadcast for at-risk cohort. <code>model_tier: industry</code>.'},
      {t:'Automation shape confidence', v:'High', chg:'stable', good:true, pct:78, g:'Automation Shape Training on 2.1K comparable journeys in your vertical. cMAB favors the 3-step SMS shape.'}
    ]},
    individual:{ color:LYR.individual, name:'Individual Layer', q:'Who responds, and how', metrics:[
      {t:'SMS channel affinity (at-risk)', v:'0.79', chg:'+0.11 w/w', good:true, pct:79, g:'Behavior & preference modeling at <code>individual_id</code> level. At-risk cohort shifted channel pref email→SMS over 21d.'},
      {t:'Email fatigue index', v:'High', chg:'▲ rising', good:false, pct:68, g:'62% of at-risk accounts exceed 4 emails/wk. <code>email_freq_7d</code> is the top churn-driver feature this week.'}
    ]}
  };

  function getCampaign(id){ return CAMPAIGNS.find(c=>c.id===id) || (EXEC_CARD.id===id?EXEC_CARD:null); }

  return { LYR, ROLE_LABEL, CAMPAIGNS, EXEC_CARD, NOTES, REPORT, getCampaign };
})();
