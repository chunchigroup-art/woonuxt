<template>
  <div class="about-page">
    <section class="hero-section">
      <div class="container">
        <h1 class="hero-title">
          Our constant goal is to earn your trust and be a partner you can rely on
        </h1>
      </div>
    </section>

    <section class="comparison-section">
      <div class="container">
        <div class="comparison-grid">
          <div class="col-struggling">
            <h2 class="section-title">Struggling with Imports?</h2>
            <p class="desc">
              If you're an importer, you already know—it's not as simple as "order and sell." Behind every shipment, there's a long list of challenges that can slow you down and eat into your profits.
            </p>
            <ul class="challenges-list">
              <li v-for="(pain, pIdx) in importPains" :key="pIdx">
                <strong>{{ pain.title }}</strong> – {{ pain.text }}
              </li>
              <li class="more-text">And countless hidden overheads that drain your team's energy...</li>
            </ul>
          </div>

          <div class="col-services">
            <h2 class="section-title">What We Do?</h2>
            <p class="desc">
              We offer a one-stop solution, handling everything from sourcing to consolidation, so you can focus on sales.
            </p>

            <div class="service-item" v-for="(item, idx) in services" :key="idx">
              <p class="service-heading">• {{ item.title }}</p>
              <p v-if="item.desc" class="small-text">{{ item.desc }}</p>
              <ul class="service-list">
                <li v-for="(point, pIdx) in item.points" :key="pIdx">{{ point }}</li>
              </ul>
              <p class="result-text">{{ item.result }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="info-section">
      <div class="container">
        <div class="info-block">
          <div class="text-col">
            <h3 class="block-title">Factory Strength</h3>
            <p class="block-text">
              Vendor screening is executed through rigorous, comprehensive evaluations across price, consistency, manufacturing capacity, and reputation. We select and audit the most reliable production lines to protect your brand against short-term market fluctuations and long-term supply chain risks.
            </p>
          </div>
          <div class="img-col">
            <NuxtImg
              src="/images/factory.jpg"
              alt="CHUNCHI TOOLS Factory Production Line"
              class="main-img"
              width="600"
              height="400"
              loading="lazy"
            />
          </div>
        </div>

        <div class="info-block reverse-layout">
          <div class="img-col">
            <NuxtImg
              src="/images/warehouse.jpg"
              alt="CHUNCHI TOOLS Integrated Consolidation Warehouse"
              class="main-img"
              width="600"
              height="400"
              loading="lazy"
            />
          </div>
          <div class="text-col">
            <h3 class="block-title">Our Warehouse Center</h3>
            <ul class="block-list">
              <li><strong>Floor Area:</strong> 5,000+ square meters</li>
              <li><strong>Product Categories:</strong> Over 2,000 active SKUs</li>
              <li><strong>Available Inventory:</strong> Exceeding $5,000,000 USD</li>
            </ul>
          </div>
        </div>

        <div class="info-block">
          <div class="text-col">
            <h3 class="block-title">Our Technical Team</h3>
            <p class="block-text">
              We firmly believe that professional corporate growth is deep-rooted in employee expertise and shared dedication. Our technical engineers and foreign trade consultants work seamlessly to deliver custom scheme verification and flawless export documentation.
            </p>
          </div>
          <div class="img-col">
            <NuxtImg
              src="/images/team.jpg"
              alt="CHUNCHI TOOLS Professional Support Team"
              class="main-img"
              width="600"
              height="400"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// 1. 注入 B2B 独立站专业谷歌 SEO 元数据
useSeoMeta({
  title: 'About Us | CHUNCHI TOOLS - Reliable HVAC/R Sourcing & Solutions',
  meta: [
    { 
      name: 'description', 
      content: 'Discover CHUNCHI TOOLS. We solve import challenges with one-stop sourcing, supplier consolidation, rigid quality inspection, and flexible logistics for global HVAC/R wholesalers.' 
    }
  ]
})

// 2. 将左侧痛点列表抽离为数据，便于未来扩展多语言
const importPains = [
  { title: "High Time Costs", text: "Juggling multiple suppliers drains your time with repetitive communication." },
  { title: "High Shipping Costs", text: "Paying higher freight per unit without optimized batch container consolidation." },
  { title: "Unpredictable Delays", text: "Port congestion and supplier delays disrupt your local distribution." },
  { title: "Cash Flow Pressure", text: "Tying up vast capital upfront while waiting months for custom clearance." },
  { title: "Complex Customs Paperwork", text: "One missing document or compliance error leads to massive fines." },
  { title: "Supplier Reliability Issues", text: "Inconsistent tooling precision, shifting quality, and zero accountability." },
  { title: "Inventory Risks", text: "Balancing stock outs versus excessive warehousing capital stagnation." },
  { title: "Limited Negotiation Power", text: "Suffering high MOQs and inflexible terms from fragmented factories." },
  { title: "Lack of Shipment Visibility", text: "Operating in the dark without real-time milestone production tracking." }
];

const services = [
  {
    title: "One Point of Contact",
    desc: "Instead of dealing with 5–10 individual factories, you communicate with ONE professional account team.",
    points: ["No more chasing multiple late replies", "Zero language or cross-industry barriers", "Accelerated technical confirmation"],
    result: "Result: Saves hours of weekly management overhead"
  },
  {
    title: "Supplier Consolidation",
    desc: "We centralize products from multiple manufacturing lines into a single cost-effective shipment.",
    points: ["Minimized customs entries", "Drastically reduced container shipping costs", "Simplified domestic port logistics"],
    result: "Result: Drastically lower complexity, higher margins"
  },
  {
    title: "Quality Control & Factory Audits",
    points: ["Strict pre-production factory verification", "On-site pre-shipment inspections", "Manifold/pump calibration precision checks"],
    result: "Result: Zero defect arrivals, preserved brand reputation"
  },
  {
    title: "Full-Cycle Logistics Support",
    desc: "We manage the heavy lifting of global trade freight forwarding.",
    points: ["Multi-modal coordination (Sea, Air, and Rail options)", "Transparent milestone shipment tracking", "Proactive clearance crisis resolution"],
    result: "Result: Seamless, stress-free importing operations"
  },
  {
    title: "Vetted Supplier Networks",
    desc: "Gain immediate leverage from our pre-audited, top-tier industrial supply base.",
    points: ["Rapid sourcing response times", "Expanded specialized tooling catalog", "Reduced trial-and-error sample capital loss"],
    result: "Result: Faster speed-to-market with premium products"
  }
];
</script>

<style scoped>
.about-page {
  background: #ffffff;
  padding: 80px 0; /* 略微拉大上下留白，显得更大气 */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #333;
}

.container {
  max-width: 1200px; /* 拓宽最大宽度至 1200px，匹配主流大屏 */
  margin: 0 auto;
  padding: 0 24px;
}

/* --- 顶部 Hero --- */
.hero-section {
  text-align: center;
  margin-bottom: 80px;
}

.hero-title {
  font-size: 36px; /* 增强主标题视觉层级 */
  font-weight: 800;
  line-height: 1.3;
  color: #111827;
  max-width: 900px;
  margin: 0 auto;
  letter-spacing: -0.02em;
}

/* --- 核心对比区 (Grid Layout) --- */
.comparison-section {
  margin-bottom: 100px;
}

.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px; /* 拉开两列距离，防止左右内容在宽屏下粘连 */
  align-items: start;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #111827;
  position: relative;
  padding-bottom: 8px;
}

/* 加一条蓝色强调底线，凸显工业严谨风 */
.section-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40px;
  height: 3px;
  background-color: #0066cc;
}

.desc {
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 24px;
  color: #4b5563;
}

/* 左栏痛点列表 */
.challenges-list {
  padding-left: 20px;
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
}

.challenges-list li {
  margin-bottom: 12px;
}

.more-text {
  list-style: none;
  margin-left: -20px;
  color: #9ca3af;
  font-style: italic;
  margin-top: 16px;
}

/* 右栏服务项 */
.service-item {
  margin-bottom: 24px;
  background: #f9fafb; /* 为右侧增加极淡的底色块，使“解决方案”板块更聚焦 */
  padding: 16px;
  border-radius: 6px;
  border-left: 4px solid #0066cc;
}

.service-heading {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 6px;
  color: #111827;
}

.small-text {
  font-size: 13px;
  margin: 0 0 8px;
  line-height: 1.5;
  color: #6b7280;
}

.service-list {
  padding-left: 18px;
  margin: 0 0 8px;
  font-size: 13px;
  line-height: 1.5;
  color: #4b5563;
}

.service-list li {
  margin-bottom: 4px;
}

.result-text {
  font-size: 13px;
  color: #0055b3;
  font-weight: 700;
  margin: 0;
}

/* --- 底部信息板块 --- */
.info-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 80px;
}

.info-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 100px;
  gap: 60px;
}

.reverse-layout {
  flex-direction: row-reverse;
}

.text-col {
  flex: 1;
}

.img-col {
  flex: 1;
  min-width: 0;
}

.block-title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #111827;
}

.block-text {
  font-size: 15px;
  line-height: 1.7;
  color: #4b5563;
  margin: 0;
}

.block-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.block-list li {
  font-size: 15px;
  line-height: 1.8;
  color: #4b5563;
  margin-bottom: 12px;
  padding-left: 16px;
  position: relative;
}

/* 为仓库列表定制精致的蓝色圆点 */
.block-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10px;
  width: 6px;
  height: 6px;
  background-color: #0066cc;
  border-radius: 50%;
}

/* --- 图片样式 --- */
.main-img {
  width: 100%;
  height: auto;
  aspect-ratio: 3 / 2; /* 相比 4/3，3/2 黄金比例在现代大屏上显得更扁平、更具现代工业高级感 */
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
  display: block;
}

/* --- Responsive 移动端适配 --- */
@media (max-width: 960px) {
  .about-page {
    padding: 40px 0;
  }

  .hero-title {
    font-size: 26px;
  }

  .comparison-grid {
    grid-template-columns: 1fr;
    gap: 50px;
  }

  .info-block,
  .reverse-layout {
    flex-direction: column !important; /* 强制移动端图片永远在文本下方 */
    gap: 24px;
    margin-bottom: 60px;
  }

  .img-col {
    width: 100%;
  }
}
</style>