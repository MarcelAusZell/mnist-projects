<script setup>
import ThemeToggler from './ThemeToggler.vue';
import Logo from '../../assets/Logo.vue';
</script>

<template>
  <div class="drawer-side font-semibold shadow-md">
    <!-- Clicking this overlay closes the drawer on small screens -->
    <label for="my-drawer" class="drawer-overlay"></label>
    <ul class="menu min-h-full w-80 bg-base-200 p-4 text-base-content">
      <li>
        <router-link to="/">
          <Logo />
        </router-link>
      </li>

      <li>
        <details open>
          <summary>Classification</summary>
          <ul>
            <li>
              <router-link to="/digit-recognition">Digit Recognition</router-link>
            </li>
            <li>
              <router-link to="/letter-recognition">Letter Recognition</router-link>
            </li>
          </ul>
        </details>
      </li>

      <li>
        <details open>
          <summary>More comming soon</summary>
        </details>
      </li>

      <div class="flex-1"></div>

      <ThemeToggler />
    </ul>
  </div>
</template>


<style xmlns="http://www.w3.org/2000/svg">
.st0 {
  fill: #fca326;
}

.st1 {
  fill: #fc6d26;
}

.st2 {
  fill: #e24329;
}
</style>