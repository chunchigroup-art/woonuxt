<template>
  <div class="max-w-5xl mx-auto px-4 py-10 text-gray-800">
    <h1 class="text-2xl font-bold mb-6 border-b pb-2">Refund and Returns Policy</h1>

    <!-- 政策概述 -->
    <section class="mb-8">
      <p class="mb-2">
        Welcome to chunchitools.com! All our products come with a 12-months warranty and can be returned for free within 30 days of delivery for approved reasons! The same warranty applies to replacement products. Please contact us if you have any problems!
      </p>
    </section>

    <!-- 退换货流程 -->
    <section class="mb-10">
      <h2 class="text-xl font-semibold mb-4">How to return and get a refund/replacement?</h2>
      <ol class="list-decimal pl-5 space-y-2">
        <li>Please contact our CHUNCHI customer service (<a href="/contact" class="text-blue-600 hover:underline">Contact us</a>) and provide the reason and the necessary pictures or videos to verify your order issue.</li>
        <li>Our customer service team investigate and offer a solution based on our policy.</li>
        <li>Both parties reach an agreement on the solution, and our customer service team provide the return information (Please do not send your return to the sender’s address on your package.).</li>
        <li>Return the product (if required). When our warehouse receives the return, our customer service team will operate the refund/replacement. And you will receive the refund within 2-14 business days. The exact time depends on your card issuer.</li>
      </ol>
    </section>

    <!-- 免费退货原因 -->
    <section class="mb-10">
      <h2 class="text-xl font-semibold mb-4">1. Reasons Supporting Free Return</h2>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-4 py-2 text-left">Return reason</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Note</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in freeReturnReasons" :key="idx">
              <td class="border border-gray-300 px-4 py-2">{{ item.reason }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mt-2 text-sm text-gray-600">
        Note: Please contact us with necessary pictures or videos for above return situations. Once verified, We will offer you a suitable solution.
      </p>
    </section>

    <!-- 不支持免费退货 -->
    <section class="mb-10">
      <h2 class="text-xl font-semibold mb-4">2. Reasons Not Supporting Free Return</h2>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-4 py-2 text-left">Return reason</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Note</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in nonFreeReturnReasons" :key="idx">
              <td class="border border-gray-300 px-4 py-2">{{ item.reason }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mt-2 text-sm text-gray-600">
        Note: For above return situations, the buyer will bear the cost of return & restock.
      </p>
    </section>

    <!-- 退款到账时间 -->
    <section class="mb-10">
      <h2 class="text-xl font-semibold mb-4">3. How long does it take to receive my refund?</h2>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-4 py-2 text-left">Payment Method</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Refund Processing Time</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Note</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in refundTime" :key="idx">
              <td class="border border-gray-300 px-4 py-2">{{ item.method }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.time }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ item.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mt-2 text-sm text-gray-600">
        Note: If you have not received a refund within the time frame, please fell free to contact us or your card issuer.
      </p>
    </section>

    <!-- 声明 -->
    <section class="text-sm text-gray-500 mt-10 pt-4 border-t">
      <p>Statement: CHUNCHI reserve all the right for the final explanation of the return and refund policy. If you have any questions, please don’t hesitate to contact us .</p>
    </section>
  </div>
</template>

<script setup lang="ts">
// 免费退货原因
const freeReturnReasons = [
  { reason: 'DOA(Dead on arrival)', note: 'You can reject it directly if it is confirmed damaged' },
  { reason: 'Wrong item sent', note: 'Please provide us with clear pictures of the item, the SKU/PN number and all shipping labels on the package' },
  { reason: 'Doesn’t match the description', note: 'Please provide us with some photos to show the problem' },
  { reason: 'Quality issues', note: 'Please provide us with some pictures or videos to verify it' },
  { reason: 'Missing parts', note: 'Please provide us with some pictures or videos to verify it' },
]

// 不支持免费退货
const nonFreeReturnReasons = [
  { reason: 'Arrived too late', note: 'CHUNCHI will not offer free returns if the delivery is delayed due to reasons out of our control.' },
  { reason: 'Don’t want/need/like it', note: 'Receive the item but change your mind/ Order by mistake/ Price changes/ Does not meet my expectations/ Paying high shipping cost/ Find better products' },
  { reason: 'Without manual or non-standard manual', note: 'Contact us for an electronic or video manual' },
  { reason: 'User’s error', note: 'Any damage caused by user’s misoperation will not be covered/ Bought wrong' },
]

// 退款到账时间
const refundTime = [
  { method: 'Credit Card', time: 'Within 3-15 business days after receiving the refund email (depends on your card issuer)', note: 'We will not charge you any processing fee' },
  { method: 'Paypal', time: 'Up to 48 hours after you receive the refund email', note: '/' },
  { method: 'Klarna', time: 'Depending on your financial institution, it can take up to 14 days for the funds to show in your account.', note: '/' },
]
</script>

<style scoped>
/* 如需自定义样式可在此添加 */
</style>