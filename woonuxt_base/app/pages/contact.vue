<script setup>
import { reactive, ref } from 'vue'

// Nuxt 必备 SEO Meta 设置
useHead({
  title: 'Contact Our Sales Team | Custom HVAC/R Tools & Wholesale',
  meta: [
    {
      name: 'description',
      content: 'Get in touch with our expert team for wholesale pricing, OEM/ODM customization, and bulk ordering of HVAC refrigeration tools. 24-hour response guaranteed.'
    }
  ]
})

// Web3Forms 专用的扁平化数据结构（确保发到邮箱的字段清晰可读）
const formPayload = reactive({
  access_key: 'cc58678f-68c6-461f-a887-78054f3f9290', // 💡 在这里粘贴你的 Web3Forms Access Key
  subject: 'New RFQ Inquiry from chunchitools.com', // 邮件标题
  from_name: 'Chunchi Tools Website', // 发件人展示名称
  
  // 客户填写的数据字段
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  interest: '',
  message: ''
})

// 提交状态
const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref(false)

// 隐私政策勾选
const agreePrivacy = ref(false)

// 提交逻辑
const handleSubmit = async () => {
  isSubmitting.value = true
  submitSuccess.value = false
  submitError.value = false

  try {
    // 对接 Web3Forms 官方 API 接口
    const response = await $fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: formPayload
    })

    if (response.success) {
      // 成功状态切换
      submitSuccess.value = true
      
      // 清空用户输入的表单字段（保留配置项）
      formPayload.firstName = ''
      formPayload.lastName = ''
      formPayload.email = ''
      formPayload.company = ''
      formPayload.interest = ''
      formPayload.message = ''
      agreePrivacy.value = false
    } else {
      submitError.value = true
    }
  } catch (err) {
    submitError.value = true
    console.error('Web3Forms Submission error:', err)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="bg-slate-50 min-h-screen font-sans antialiased text-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">

      <div class="max-w-3xl mb-12 lg:mb-16">
        <span class="text-blue-600 font-bold uppercase tracking-wider text-sm">Global Supply Chain Partner</span>
        <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mt-2">
          Request a Wholesale Quote
        </h1>
        <p class="mt-4 text-lg text-slate-600 leading-relaxed">
          Partner with a one-stop certified manufacturer. From high-performance vacuum pumps to precision manifold gauges, our sales engineers provide the integrated solutions your business needs to scale.
        </p>
      </div>

      <div class="flex flex-col lg:flex-row gap-12 lg:gap-16">

        <div class="lg:w-2/5 space-y-8 lg:space-y-12">
          <div class="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
            <h3 class="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Direct Contact</h3>

            <div class="flex items-start space-x-4">
              <div class="bg-blue-50 p-3 rounded-xl text-blue-600 mt-1 flex-shrink-0">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Sales Department</h4>
                <p class="text-lg font-semibold text-slate-900 mt-0.5">support@chunchitools.com</p>
                <p class="text-xs text-emerald-600 font-medium mt-1">✓ Monitored 24/7. Response within 12-24h.</p>
              </div>
            </div>

            <div class="flex items-start space-x-4">
              <div class="bg-emerald-50 p-3 rounded-xl text-emerald-600 mt-1 flex-shrink-0">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
                </svg>
              </div>
              <div>
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Instant Chat & Technical Support</h4>
                <p class="text-lg font-semibold text-slate-900 mt-0.5">WhatsApp: +86 15823359769</p>
                <p class="text-xs text-slate-500 mt-1">Available for quick technical sizing and inventory checks.</p>
              </div>
            </div>
          </div>

          <div class="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div class="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
              <svg class="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            </div>

            <h4 class="text-xl font-bold mb-6 text-blue-400">Wholesale & OEM Solutions</h4>
            <ul class="space-y-4 relative z-10">
              <li class="flex items-start">
                <span class="text-blue-400 mr-3 mt-1 font-bold">✓</span>
                <div>
                  <strong class="text-white block">Custom Branding</strong>
                  <span class="text-slate-400 text-sm">Laser logo engraving, custom gauge faces, and OEM packaging available.</span>
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-blue-400 mr-3 mt-1 font-bold">✓</span>
                <div>
                  <strong class="text-white block">Flexible MOQ</strong>
                  <span class="text-slate-400 text-sm">Low initial minimum order quantities to support new market trials.</span>
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-blue-400 mr-3 mt-1 font-bold">✓</span>
                <div>
                  <strong class="text-white block">Global Compliance</strong>
                  <span class="text-slate-400 text-sm">Export-ready tools: All our products strictly adhere to CE, RoHS, and ISO 9001 international quality benchmarks.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="lg:w-3/5">
          <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-10">

            <div v-if="submitSuccess" class="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
              <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mb-2">Inquiry Received Successfully!</h3>
              <p class="text-slate-600 text-sm max-w-md mx-auto mb-6">
                Thank you for reaching out. A dedicated sales engineer from our team has been assigned to your request and will contact you via email within 12 hours.
              </p>
              <button @click="submitSuccess = false" class="text-sm font-semibold text-blue-600 hover:text-blue-700 underline">
                Submit another inquiry
              </button>
            </div>

            <div v-if="submitError" class="mb-6 bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-700 text-sm flex items-center">
              <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h6v2zm0-4h-2V7h2v6z"/></svg>
              Something went wrong. Please check your network or email us directly at support@chunchitools.com.
            </div>

            <form v-if="!submitSuccess" @submit.prevent="handleSubmit" class="space-y-6">
              
              <input type="checkbox" name="botcheck" class="hidden" style="display: none;">

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                  <input
                    v-model="formPayload.firstName"
                    type="text"
                    name="First Name"
                    class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                    placeholder="John"
                  >
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                  <input
                    v-model="formPayload.lastName"
                    type="text"
                    name="Last Name"
                    class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                    placeholder="Doe"
                  >
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Business Email *</label>
                <input
                  v-model="formPayload.email"
                  type="email"
                  name="email"
                  required
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                  placeholder="name@company.com"
                >
                <p class="text-xs text-slate-400 mt-1.5">Please provide your work email for faster corporate verification.</p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Company Name</label>
                <input
                  v-model="formPayload.company"
                  type="text"
                  name="Company"
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                  placeholder="Your Business Ltd."
                >
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Product of Interest</label>
                <input
                  v-model="formPayload.interest"
                  type="text"
                  name="Product of Interest"
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                  placeholder="e.g., 8 CFM Dual Stage Vacuum Pump / Custom Manifold Gauge"
                >
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Message & Project Requirements *</label>
                <textarea
                  v-model="formPayload.message"
                  name="Message"
                  rows="5"
                  required
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none resize-none"
                  placeholder="To get an accurate factory quote, please specify your expected order quantity, required voltage/standards, or destination port if shipping calculation is needed..."
                ></textarea>
              </div>

              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="privacy"
                    v-model="agreePrivacy"
                    type="checkbox"
                    required
                    class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-slate-300 rounded"
                  >
                </div>
                <div class="ml-3 text-xs text-slate-500">
                  <label for="privacy">I agree to the <a href="#" class="underline hover:text-slate-700">Privacy Policy</a> and consent to being contacted regarding this business inquiry.</label>
                </div>
              </div>

              <button
                :disabled="isSubmitting || !agreePrivacy"
                type="submit"
                class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg hover:shadow-blue-100 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
              >
                <svg v-if="isSubmitting" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isSubmitting ? 'Processing RFQ...' : 'Submit Inquiry & Get Quote' }}</span>
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>