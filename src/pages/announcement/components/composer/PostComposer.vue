<template>
  <div class="bg-white rounded-xl border p-4 space-y-4">
    <div class="flex gap-3">
      <img
        class="w-10 h-10 rounded-full"
        src="https://static.wikia.nocookie.net/gametoons-among-us/images/a/a1/Cappuccino_Assassino_%28Render%29.png/revision/latest/thumbnail/width/360/height/450?cb=20250612003133">

      <div class="flex-1">
        <BaseEditor
          v-model="content"
          placeholder="เขียนประกาศ..." />
      </div>
    </div>

    <div class="flex items-center gap-2 border rounded-lg px-3 py-2">
      <i class="pi pi-paperclip" />
      <span>เขียนประกาศข่าวสารประจำเดือน.pdf</span>
    </div>

    <Button
      class="bg-red-600 border-none"
      label="โพสต์" />
  </div>
</template>

<script>

</script>
