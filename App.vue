<template>
  <div>
    <nav style="background:#4caf50;padding:1em;">
      <router-link to="/" style="margin-right:1em;color:white;">Home</router-link>
      <router-link to="/budget" style="margin-right:1em;color:white;">Budget</router-link>
      <router-link to="/tasks" style="color:white;">Tasks</router-link> 
    </nav>
    <router-view/>
  </div>
</template>