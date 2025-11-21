<template>
  <div>
    <h2>Connecting...</h2>
  </div>
</template>

<script>
import axios from 'axios';
import { setCookie } from '../utils/cookies';

export default {
  async mounted() {
    // Récupérer le code OAuth dans l'URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      console.log('OAuth code reçu:', code);
      try {
        // Send the code to backend to exchange it for tokens and fetch user info
        // The backend should return user info (including a username)
        const resp = await axios.post('/api/auth/discord/callback', { code });
        const data = resp.data || {};

        // Try several common fields for username
        const username = data.username || data.discord_username || data.name || (data.user && data.user.username) || null;

        if (username) {
          // store username in cookie for 7 days
          setCookie('discord_username', username, 7);
          console.log('Saved discord_username cookie:', username);
        } else {
          console.warn('No username returned from backend, response:', data);
        }
      } catch (err) {
        console.error('Error sending code to backend:', err);
      }

      // Redirect back to home after short delay so cookie is set
      setTimeout(() => this.$router.push('/'), 800);
    } else {
      console.error('Aucun code OAuth trouvé');
    }
  },
};
</script>
