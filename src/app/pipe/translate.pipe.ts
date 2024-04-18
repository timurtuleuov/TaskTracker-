import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translate',
  standalone: true,
  
})
export class TranslatePipe implements PipeTransform {
  constructor() {}
  wordsMap: { [key: string]: string } = {
    'Monday,': 'Понедельник,',
    'Tuesday,': 'Вторник,',
    'Wednesday,': 'Среда,',
    'Thursday,': 'Четверг,',
    'Friday,': 'Пятница,',
    'Saturday,': 'Суббота,',
    'Sunday,': 'Воскресенье,',
    January: 'Январь',
    February: 'Февраль',
    March: 'Март',
    April: 'Апрель',
    May: 'Май',
    June: 'Июнь',
    July: 'Июль',
    August: 'Август',
    September: 'Сентябрь',
    October: 'Октябрь',
    November: 'Ноябрь',
    December: 'Декабрь'
  };
  transform(value: any): any {
    if (typeof value !== 'string') {
      return value;
    }
    return value.split(' ').map(word => this.wordsMap[word] || word).join(' ');
  }
}
