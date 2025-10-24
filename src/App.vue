<script setup>
import AppLayoutNavbar from './components/AppLayout/AppLayoutNavbar.vue';
import AppLayoutSidebar from './components/AppLayout/AppLayoutSidebar.vue';

</script>

<template>

  <div class="drawer lg:drawer-open">
    <!-- Hidden checkbox controls the sidebar toggle on small screens -->
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />

    <!-- Drawer content: navbar (on small screens) and main page content -->
    <div class="drawer-content flex flex-col">
      <AppLayoutNavbar />

      <main class="p-4">
        <router-view></router-view>
      </main>
    </div>

    <AppLayoutSidebar />
  </div>


</template>
