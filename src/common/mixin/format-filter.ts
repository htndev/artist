import Vue from 'vue';

export const FormatFilter = Vue.mixin({
  filters: {
    formatDuration(duration: number) {
      const MINUTE = 60;
      const hours = Math.round(duration / (MINUTE * MINUTE));
      const minutes = Math.round(duration / MINUTE);
      const seconds = Math.round(duration % MINUTE);
      return `${hours > 0 ? `${hours < 10 ? '0' + hours : hours}` : ''}${minutes}:${
        seconds < 10 ? '0' + seconds : seconds
      }`;
    }
  }
});
