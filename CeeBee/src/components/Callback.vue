<template>
  <div>
  </div>
</template>

<script>
import { setCookie } from '../utils/cookies';

export default {
  watch: {
    '$route'(to) {
      this.handleCodeChange(to.query.code);
    }
  },
  mounted() {
    const code = this.$route.query.code;
  console.log("Code OAuth reçu ou changé : ", code);
  if (!code) {
    console.warn("Code OAuth absent dans l'URL");
    return;
  }
  // appelle la méthode qui envoie le code au backend
  this.handleCodeChange(code);
  },
  methods: {
    async handleCodeChange(code) {
      console.log("Code OAuth reçu ou changé :", code);
      if (!code) return;

      try {
        const response = await fetch('https://localhost:7174/api/CeeBee/discord/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });

        console.log('Status response:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Erreur backend:', errorText);
        } else {
          const data = await response.json();
          console.log('Réponse backend:', data);

          if (data.username && data.id && data.avatar) {
            setCookie('discord_username', data.username, 7);
            setCookie('discord_id', data.id, 7);
            setCookie('discord_avatar', data.avatar, 7);
            console.log('Cookies Discord stockés:', data.username, data.id, data.avatar);
          } else {
            console.warn('Réponse backend incomplète:', data);
          }
        }
      } catch (err) {
        console.error('Erreur requête POST:', err);
      } finally {
        setTimeout(() => {
          if (this.$router) this.$router.push('/');
          else window.location.href = '/';
        }, 800);
      }
    }
  }
};
</script>
