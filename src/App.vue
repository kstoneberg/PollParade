<template>
  <div id="app">
    <router-view></router-view> <!-- This will load Poll or PollHistory based on the route -->
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
/* Global styles can go here */
</style>

