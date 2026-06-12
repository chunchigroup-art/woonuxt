<template>
  <section class="bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-2xl my-16 max-w-7xl mx-auto shadow-2xl relative overflow-hidden">
    <div class="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
    
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 relative z-10">
      
      <div class="lg:col-span-2 flex flex-col justify-between">
        <div>
          <span class="text-xs font-bold tracking-widest text-blue-500 uppercase block mb-3">
            Global Wholesale & OEM/ODM
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Request A Bulk Quote
          </h2>
          <p class="text-slate-400 mt-4 text-sm leading-relaxed">
            Looking for a reliable supply chain partner? Submit your technical specifications or purchasing volume below. Our technical sales engineers will send a formal quote within 12 hours.
          </p>
        </div>

        <div class="mt-8 space-y-4 border-t border-white/10 pt-8">
          <div class="flex items-center space-x-3 text-sm text-slate-300">
            <svg class="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            <span>Flexible Low MOQ Solutions Supported</span>
          </div>
          <div class="flex items-center space-x-3 text-sm text-slate-300">
            <svg class="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>Fast Response Within 12 Hours Guarantee</span>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-5">
        
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Your Name *</label>
          <input v-model="form.name" type="text" required class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="e.g. John Doe" />
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Business Email *</label>
          <input v-model="form.email" type="email" required class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="e.g. company@email.com" />
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Company Name</label>
          <input v-model="form.company" type="text" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="e.g. HVAC Importer Ltd." />
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Estimated Order Qty *</label>
          <input v-model="form.quantity" type="text" required class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="e.g. 500 pcs / 1x20GP" />
        </div>

        <div class="sm:col-span-2">
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Requirements & Technical Specs *</label>
          <textarea v-model="form.message" rows="4" required class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none" placeholder="Please describe product specifications, customized packing, laser-logo branding, or specific logistics needs..."></textarea>
        </div>

        <div class="sm:col-span-2 mt-2">
          <button type="submit" :disabled="isSubmitting" class="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-sm font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-60 transition-all shadow-lg shadow-blue-600/20 cursor-pointer">
            <span v-if="!isSubmitting">Send Inquiry / Get RFQ</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Processing...
            </span>
          </button>
        </div>
      </form>
      
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const isSubmitting = ref(false)
const form = ref({
  name: '',
  email: '',
  company: '',
  quantity: '',
  message: ''
})

const handleSubmit = async () => {
  isSubmitting.value = true
  
  // 组装发往 Web3Forms 的数据对象
  const submissionData = {
    // 💡 替换成你之前申请到的 Web3Forms 专属 Access Key
    access_key: "cc58678f-68c6-461f-a887-78054f3f9290", 
    subject: `New Bulk Inquiry from ${form.value.company || form.value.name}`,
    from_name: "Chunchi Tools RFQ System",
    
    // 表单实际数据
    name: form.value.name,
    email: form.value.email,
    company: form.value.company || 'N/A',
    quantity: form.value.quantity,
    message: form.value.message
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(submissionData)
    })
    
    const result = await response.json()
    
    if (result.success) {
      alert('Thank you! Your RFQ has been submitted successfully. Our team will contact you within 12 hours.')
      // 成功后清空表单输入框
      form.value = { name: '', email: '', company: '', quantity: '', message: '' }
    } else {
      alert('Submission failed: ' + (result.message || 'Please try again later.'))
    }
  } catch (error) {
    console.error('Web3Forms submit error:', error)
    alert('Network error. Please try again or email us directly.')
  } finally {
    isSubmitting.value = false
  }
}
</script>