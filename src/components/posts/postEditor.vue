<script setup lang="ts">
import {ref} from 'vue';
import {QuillEditor} from '@vueup/vue-quill'

const editorContent = ref('');

const editorOptions = {
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'blockquote', 'code-block'],
      [{header: 1}, {header: 2}],
      [{list: 'ordered'}, {list: 'bullet'}],
    ],
    clipboard: {
      matchVisual: true
    }
  }
}

const filterVal = () => {
  if (!editorContent.value) return;

  let cleanedHtml = editorContent.value;

  // Удаляем пустые сочетания типа <h1><br></h1>, <h2><br></h2>, и т.п.
  cleanedHtml = cleanedHtml.replace(/<([h1-h6])>\s*<br\s*\/?>\s*<\/\1>/gi, '');

  // Удаляем все пустые теги, такие как <p></p>, <ul></ul>, <ol></ol> и т.п.
  cleanedHtml = cleanedHtml.replace(/<([a-z]+)>\s*<\/\1>/gi, '');

  // Удаляем пустые <span> теги с классом "ql-cursor"
  cleanedHtml = cleanedHtml.replace(/<span class="ql-cursor">.*?<\/span>/gi, '');

  // Дополнительно фильтруем любые элементы, которые содержат только пробелы или разрывы
  cleanedHtml = cleanedHtml.replace(/<pre class="ql-syntax"[^>]*>\s*<\/pre>/gi, '');

  // Удаляем пустые заголовки, такие как <h1></h1>, <h2></h2>, и т.п.
  cleanedHtml = cleanedHtml.replace(/<h[1-6]>\s*<\/h[1-6]>/gi, '');

  // Удаляем пустые списки, такие как <ol><li><br></li></ol>
  cleanedHtml = cleanedHtml.replace(/<([ou])l>\s*<li>\s*<\/li>\s*<\/\1>/gi, '');

  // Удаляем пустые блоки <blockquote><br></blockquote>
  cleanedHtml = cleanedHtml.replace(/<blockquote>\s*<br\s*\/?>\s*<\/blockquote>/gi, '');

  editorContent.value = cleanedHtml;
}

</script>

<template>
  <div class="post-editor__wrapper">

    <div class="post-editor__exact-wrapper">
      <quill-editor
          v-model:content="editorContent"
          content-type="html"
          :options="editorOptions"
          placeholder="Напишите что-нибудь..."
      />
    </div>

    <v-btn @click="filterVal">ok</v-btn>

    <div class="editor-preview">
      <h6>Предросмотр:</h6>
      <div class="editor-content" v-html="editorContent"></div>
      {{editorContent}}
    </div>
  </div>
</template>

<style scoped lang="scss">
.post-editor__wrapper {
  display: flex;
  flex-direction: column;

  .post-editor__exact-wrapper{
    box-shadow: 0 1px 10px currentColor;
    background: rgb(var(--v-theme-background));
    border-radius: 10px;
  }
}



</style>
