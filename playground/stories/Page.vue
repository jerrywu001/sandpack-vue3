<template>
  <article>
    <my-header
      :user="user"
      @login="$emit('login')"
      @logout="$emit('logout')"
      @create-account="$emit('createAccount')"
    />

    <section>
      <h2>Pages in Storybook</h2>
      <p>
        We recommend building UIs with a
        <a href="https://componentdriven.org" target="_blank" rel="noopener noreferrer">
          <strong>component-driven</strong>
        </a>
        process starting with atomic components and ending with pages.
      </p>
      <p>
        Render pages with mock data. This makes it easy to build and review page states without
        needing to navigate to them in your app. Here are some handy patterns for managing page data
        in Storybook:
      </p>
      <ul>
        <li>
          Use a higher-level connected component. Storybook helps you compose such data from the
          "args" of child component stories
        </li>
        <li>
          Assemble data in the page component from your services. You can mock these services out
          using Storybook.
        </li>
      </ul>
      <p>
        Get a guided tutorial on component-driven development at
        <a
          href="https://storybook.js.org/tutorials/"
          target="_blank"
          rel="noopener noreferrer"
        >Storybook tutorials</a>
        . Read more in the
        <a href="https://storybook.js.org/docs" target="_blank" rel="noopener noreferrer">docs</a>
        .
      </p>
      <div class="tip-wrapper">
        <span class="tip">Tip</span>
        Adjust the width of the canvas with the Viewports addon in the toolbar
      </div>
    </section>
  </article>
</template>

<script lang="ts">
import './page.css';
import MyHeader from './Header.vue';

export default {
  name: 'MyPage',

  components: { MyHeader },

  props: {
    user: {
      type: Object,
      default() {
        return null;
      },
    },
  },

  emits: ['login', 'logout', 'createAccount'],
};
</script>
