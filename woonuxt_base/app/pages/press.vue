<script setup lang="ts">
definePageMeta({
  title: 'Press',
});

useSeoMeta({
  title: 'Press Hub & Corporate News - CHUNCHI TOOLS',
  description: 'Keep track of CHUNCHI TOOLS latest supply chain integration breakthroughs, quality assurance standards, and global trade fulfillment insights.',
});

// 💡 贸易公司专属的高质感 B2B 核心通告矩阵
const pressReleases = [
  {
    date: 'June 02, 2026',
    category: 'Supply Chain',
    title: 'CHUNCHI TOOLS Optimizes Multi-Factory Supply Chain Matrix to Offer Verified One-Stop HVAC/R Sourcing',
    excerpt: 'To address the growing demand for procurement efficiency among global distributors, we have integrated our trusted manufacturing networks. By consolidating premium resources for copper components, manifold gauges, and vacuum pumps, CHUNCHI now provides a comprehensive, quality-verified "One-Stop Sourcing" solution with flexible MOQs, significantly lowering import complexities for our international B2B partners.'
  },
  {
    date: 'April 15, 2026',
    category: 'Quality Assurance',
    title: 'Global Standard Alignment: CHUNCHI Upgrades Pre-Shipment Inspection (PSI) Protocols for Wholesale Batches',
    excerpt: 'Quality risk management is at the heart of cross-border trade. CHUNCHI TOOLS has announced a comprehensive upgrade to its Quality Assurance (QA) track. Moving forward, all bulk orders destined for Europe, South America, and the Middle East will undergo advanced batch tolerance testing and strict Pre-Shipment Inspections (PSI) to ensure field-ready compliance with CE and RoHS standards.'
  },
  {
    date: 'February 24, 2026',
    category: 'Global Trade',
    title: 'Connecting Global Markets: CHUNCHI International Trade Division Expanding On-Site Distributor Consultation Networks',
    excerpt: 'As part of our 2026 global partnership initiative, our international trade team is expanding direct consultation services for regional HVAC/R wholesalers. In addition to mapping out schedules for upcoming major industrial hardware expos, our market specialists are conducting regional visits to support strategic OEM/ODM partners with tailored localization and catalogue distribution strategies.'
  }
];
</script>

<template>
  <div class="bg-slate-50/50 min-h-screen py-16">
    <div class="container max-w-4xl mx-auto px-4 sm:px-6">
      
      <div class="border-b border-slate-200 pb-10 mb-12">
        <span class="text-xs font-bold text-blue-600 tracking-widest uppercase block mb-3">Media Center</span>
        <h1 class="text-3xl font-extrabold text-slate-950 tracking-tight mb-4">
          CHUNCHI Press & Corporate Insights
        </h1>
        <p class="text-sm text-slate-500 leading-relaxed max-w-2xl">
          Stay informed with our latest international supply chain enhancements, strategic manufacturing matrix scaling, and global logistics fulfillment standards designed for worldwide industrial distribution.
        </p>
      </div>

      <div class="space-y-10">
        <article v-for="(item, index) in pressReleases" :key="index" class="group relative flex flex-col items-start bg-white p-6 sm:p-8 rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition-all">
          
          <div class="flex items-center gap-3 text-[11px] font-medium text-slate-400 mb-3">
            <span class="bg-slate-950 text-white font-bold text-[8px] tracking-wider uppercase px-2 py-0.5 rounded-sm">
              {{ item.category }}
            </span>
            <span>•</span>
            <time>{{ item.date }}</time>
          </div>

          <h2 class="text-base sm:text-lg font-bold text-slate-950 group-hover:text-blue-600 transition-colors mb-3 leading-snug">
            {{ item.title }}
          </h2>

          <p class="text-xs sm:text-sm text-slate-500 leading-relaxed mb-4">
            {{ item.excerpt }}
          </p>

          <div class="text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors flex items-center gap-1">
            Read Statement <span class="inline-block transition-transform group-hover:translate-x-0.5">→</span>
          </div>

        </article>
      </div>

      <div class="mt-16 bg-slate-100 rounded-xl p-6 sm:p-8 border border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Global Media & Distributor Inquiries</h4>
          <p class="text-xs text-slate-400 leading-relaxed">Require high-res product matrices, certified brand assets, or direct factory-network verification reports?</p>
        </div>
        <a href="mailto:support@chunchitools.com" class="bg-white border border-slate-200 text-xs text-slate-700 font-bold px-4 py-2 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors shrink-0">
          Contact Media Desk
        </a>
      </div>

    </div>
  </div>
</template>