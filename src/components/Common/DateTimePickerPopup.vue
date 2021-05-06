<template>
  <q-dialog v-model="showSync" class="date-time-picker">
    <q-card style="width: 700px; min-width: 700px; max-width: 700px">
      <q-card-section class="full-width flex justify-around">
        <q-date v-model="date" mask="DD.MM.YYYY" :locale="locale"></q-date>
        <q-time v-model="time" format24h></q-time>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn :label="$t('album.choose-release-date')" outline color="purple" @click="chooseReleaseDate" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Language } from '@/common/constants/language';
import { Vue, Component, Prop, PropSync } from 'vue-property-decorator';

interface Locale {
  days: string[];
  daysShort: string[];
  months: string[];
  monthsShort: string[];
  firstDayOfWeek: number;
}

type Locales = Exclude<keyof typeof Language, 'EN'>;

const format = (str: string): string[] => str.split('_');

const LOCALES: { [k in Locales]: Locale } = {
  RU: {
    days: format('Понедельник_Вторник_Среда_Четверг_Пятница_Суббота_Воскресенье'),
    daysShort: format('Пн_Вт_Ср_Чт_Пт_Сб_Вс'),
    months: format('Январь_Февраль_Март_Апрель_Май_Июнь_Июль_Август_Сентябрь_Октябрь_Ноябрь_Декабрь'),
    monthsShort: format('Янв_Фев_Мар_Апр_Май_Июн_Июл_Авг_Сен_Окт_Ноя_Дек'),
    firstDayOfWeek: 1
  },
  UK: {
    days: format(`Понеділок_Вівторок_Середа_Четвер_П'ятниця_Субота_Неділя`),
    daysShort: format('Пн_Вт_Ср_Чт_Пт_Сб_Нд'),
    months: format('Січень_Лютий_Березень_Квітень_Травень_Червень_Липень_Серпень_Вересень_Жоветнь_Листопад_Грудень'),
    monthsShort: format('Січ_Лют_Бер_Кві_Тра_Чер_Лип_Сер_Вер_Жов_Лис_Гру'),
    firstDayOfWeek: 1
  },
  DE: {
    days: format('Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag_Sonntag'),
    daysShort: format('Mon_Die_Mit_Don_Fre_Sam_Son'),
    months: format('Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'),
    monthsShort: format('Jan_Feb_Mär_Apr_Mai_Jun_Jul_Sep_Okt_Nov_Dez'),
    firstDayOfWeek: 1
  }
};
const appendZero = (digit: number): string => ('0' + digit).slice(-2);

@Component
export default class DateTimePickerPopup extends Vue {
  @Prop({ default: () => new Date(), type: Date })
  value!: Date;

  @PropSync('show', { default: false, type: Boolean })
  showSync!: boolean;

  time = `${appendZero(this.value.getHours())}:${appendZero(this.value.getMinutes())}`;
  date = `${appendZero(this.value.getDate())}.${appendZero(this.value.getMonth() + 1)}.${this.value.getFullYear()}`;

  get locale(): Locale | undefined {
    const locale = this.$i18n.locale.toUpperCase();
    return LOCALES[locale as Locales];
  }

  chooseReleaseDate(): void {
    const [day, month, year] = this.date.split('.').map(parseFloat);
    const [hours, minutes] = this.time.split(':').map(parseFloat);
    const date = new Date();

    date.setDate(day);
    date.setMonth(month - 1);
    date.setFullYear(year);
    date.setHours(hours);
    date.setMinutes(minutes);

    this.$emit('input', date);
    this.showSync = false;
  }
}
</script>
