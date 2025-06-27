<template>
  <div>
    <nav style="background:#4caf50;padding:1em;">
      <router-link to="/" style="margin-right:1em;color:white;">Home</router-link>
      <router-link to="/budget" style="color:white;">Budget</router-link>
    </nav>
    <router-view/>
  </div>
</template>