import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'capitalize'
// })
// export class CapitalizePipe implements PipeTransform {
//   transform(value: string, args?: any): any {
//     return value.split(' ').map(word => {
//       return word.length > 2 ? word[0].toLowerCase() + word.substr(1) : word;
//     }).join(' ');
//   }
// }

@Pipe({
    name: 'thousandSuff'
  })
  export class ThousandSuffixesPipe implements PipeTransform {
  
    transform(input: any, args?: any): any {
      var exp, rounded,
        suffixes = ['K', 'M', 'G', 'T', 'P', 'E'];
      
      if (Number.isNaN(input)) {
        return null;
      }
  
      if (input < 1000) {
        return input;
      }
  
      exp = Math.floor(Math.log(input) / Math.log(1000));
      return (input / Math.pow(1000, exp)).toFixed(args) + suffixes[exp - 1];
  
  
    }
  
  }