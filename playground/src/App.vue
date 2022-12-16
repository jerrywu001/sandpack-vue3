<template>
  <main class="main">
    <RouterView v-slot="{ Component }">
      <transition name="page-fade">
        <component
          :is="Component"
          class="component"
        />
      </transition>
    </RouterView>
  </main>
</template>

<style>
.main {
  color: rgba(55, 65, 81, 1);
  position: relative;
}

.component {
  position: absolute;
  left: 0;
  right: 0;
  top: 25px;
}
</style>
