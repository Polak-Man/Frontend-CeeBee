<template>
  <div class="ceebee-root">
            <button v-if="!discordUsername" class="btn btn-discord" @click="connectDiscord">Connecter à Discord</button>
            <button v-else class="btn btn-discord" disabled>Connecté en tant que {{ discordUsername }}</button>
    <div class="container card">
      <div class="card-header">
        <h1 class="card-title">CeeBee</h1>
      </div>

      <div class="card-body">
        <input type="file" @change="handleFileUpload" accept="image/*,video/*" class="form-control" />
        <input type="text" v-model="textInput" placeholder="Saisissez votre texte ici" class="form-control" />

        <label class="pseudo-label">
          <input type="checkbox" v-model="showPseudo" />
          <span>Afficher Pseudo ?</span>
        </label>

        <div class="checkbox-list">
          <label v-for="name in names" :key="name">
            <input type="checkbox" v-model="selectedNames" :value="name" />
            {{ name }}
          </label>
        </div>

        <div class="duration-inputs">
          <input type="number" v-model="durationSec" placeholder="Durée en s" class="form-control" />
          <input type="number" v-model="durationMs" placeholder="en ms" class="form-control" />
        </div>

        <div class="actions">
          <button class="btn btn-primary" @click="submitToBackend">Apply</button>
          <!--<button class="btn btn-primary" @click="applySettings,submitToBackend">Apply</button>-->
          <button class="btn btn-ghost" @click="resetForm">Reset</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { getCookie } from '../utils/cookies';

export default {
  data() {
    return {
      discordUsername: null,
      textInput: '',
      showPseudo: false,
      names: ['Aëlys', 'Alexis', 'Logan', 'Mattéo'],
      selectedNames: [],
      durationSec: null,
      durationMs: null,
      uploadedFile: null, // ajout de la variable pour garder le fichier
    };
  },
  mounted() {
    // read discord username from cookie if present
    try {
      this.discordUsername = getCookie('discord_username');
    } catch (err) {
      console.warn('Error reading discord cookie', err);
    }
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.uploadedFile = file;  // stocker le fichier sélectionné
        console.log('Fichier uploadé:', file.name);
      }
    },

    applySettings() {
      // action légère avant envoi
      console.log('Apply clicked', {
        text: this.textInput,
        pseudo: this.showPseudo,
        names: this.selectedNames,
        duration: `${this.durationSec}s ${this.durationMs}ms`
      });
    },

    resetForm() {
      this.textInput = '';
      this.showPseudo = false;
      this.selectedNames = [];
      this.durationSec = null;
      this.durationMs = null;
      this.uploadedFile = null;
    },

    connectDiscord() {
      // Placeholder: replace CLIENT_ID and REDIRECT_URI with your app values
      const clientId = '1368669199710425119';
      const redirectUri = encodeURIComponent('http://localhost:5173/callback');
      const scope = encodeURIComponent('identify email');
      const discordUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
      // Open the OAuth URL in a new window/tab
      window.open(discordUrl, '_blank');
    },

    async submitToBackend() {
      try {
        const url = 'https://localhost:7174/api/CeeBee'; // ou autre URL backend
        const fd = new FormData();

        fd.append('textInput', this.textInput || '');
        fd.append('showPseudo', this.showPseudo ? 'true' : 'false');
        this.selectedNames.forEach(name => fd.append('selectedNames', name));
        if (this.durationSec != null) fd.append('durationSec', String(this.durationSec));
        if (this.durationMs != null) fd.append('durationMs', String(this.durationMs));
        if (this.uploadedFile) {
          fd.append('mediaSent', this.uploadedFile, this.uploadedFile.name);
        }

        const resp = await axios.post(url, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
          // withCredentials: true // si besoin d’auth
        });

        console.log('Server response', resp.data);
        alert('Success');
      } catch (err) {
        console.error('Submit error', err);
        alert('Error: ' + (err.response?.data?.message || err.message));
      }
    },
  }
};
</script>


<style scoped>
.ceebee-root {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
}

.container {
  max-width: 640px;
  width: 94%;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  padding: 20px 22px;
  border-radius: 14px;
  box-shadow: 10px 12px 30px rgba(0,0,0,0.45);
  color: #efeefe;
  border: 1px solid rgba(255,255,255,0.03);
  /* ensure the .container.card element centers in its flex parent */
  align-self: center;
  margin: auto;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.card-title {
  font-size: 1.5rem;
  color: #f3e8ff;
  margin: 0;
  text-shadow: 0 2px 8px rgba(138,63,252,0.12);
}

/* Inputs */
input[type="file"],
input[type="text"],
input[type="number"] {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.04);
  background: rgba(10,6,14,0.36);
  color: #efeefe;
}

.pseudo-label {
  display: flex;
  gap: 8px;
  align-items: center;
  color: #e8defc;
  margin-top: 6px;
}

.checkbox-list {
  margin: 10px 0;
  display: grid;
  gap: 6px;
}

.checkbox-list label {
  display: flex;
  gap: 8px;
  align-items: center;
  color: #e8defc;
}

.duration-inputs {
  display: flex;
  gap: 10px;
}
.duration-inputs input { flex: 1; }

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 14px;
}

/* Buttons */
.btn {
  padding: 10px 16px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.btn-primary {
  background: linear-gradient(180deg,#9a4bff,#6e2be6);
  color: white;
  box-shadow: 0 8px 24px rgba(106,58,255,0.22);
}
.btn-primary:hover { transform: translateY(-3px); box-shadow: 0 18px 40px rgba(106,58,255,0.28); }

.btn-ghost {
  background: transparent;
  color: #cdb6ff;
  border: 1px solid rgba(205,182,255,0.12);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.02);
}
.btn-ghost:hover { background: rgba(205,182,255,0.04); transform: translateY(-2px); }

/* Discord connect button */
.btn-discord {
  background: linear-gradient(180deg,#6e80ff,#4757d6);
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: 700;
  box-shadow: 0 8px 20px rgba(71,87,214,0.22);
  border: 1px solid rgba(255,255,255,0.04);
  margin-bottom: 550px;
  margin-right: 10px;
}
.btn-discord:hover { transform: translateY(-2px); box-shadow: 0 16px 36px rgba(71,87,214,0.28); }

@media (max-width:520px) {
  .duration-inputs { flex-direction: column; }
  .actions { flex-direction: column; }
}
</style>