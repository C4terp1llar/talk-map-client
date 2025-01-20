<script setup lang="ts">
import CmCreateGroupCover from "@/components/communications/cmCreateGroupCover.vue";
import {ref} from "vue";
import CmCreateGroupTitle from "@/components/communications/cmCreateGroupTitle.vue";
import FriendsList from "@/components/friends/friendsList.vue";
import CmCreateGroupMembers from "@/components/communications/cmCreateGroupMembers.vue";

const newGroupCover = ref<string | ArrayBuffer | null>(null);
const newGroupTitle = ref<string>('');

</script>

<template>
  <div class="cm-create-group__wrapper">
    <cm-create-group-cover @cover-select="img => newGroupCover = img"/>
    <cm-create-group-title @title-select="title => newGroupTitle = title"/>
    <cm-create-group-members/>
  </div>
</template>

<style scoped lang="scss">
.cm-create-group__wrapper{
  display: flex;
  flex-direction: column;
}
</style>