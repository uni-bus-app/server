import { u1 } from './times';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
export class TimesService {
    
    constructor() {}
        

    getOneRow(stop, row, times) {
    let b, e, other; //stores the begining and end index for the stop times
    //loop through the entire string and
    for(let i = 0; i<times.length; i++) {
        if(times.charAt(i)==stop){
        if(other == row) {
            other++;
            b = i;
        }
        
        } else if(times.charAt(i)=="!"){
        e = i;
        }
    }
    return times.substring(b, e-1);
    }

    getLongString(stopLetter, times) {
    let x = 0;
    let b = new Array();
    let e = new Array();

    for(let i = 0; i<times.length; i++) {
        if(times.charAt(i)==stopLetter) {
        b[x]=i;
        x++;
        }
        if(times.charAt(i)=="!") {
        if(e[x-1]==null) {
            if(e.length<3){
            e[x-1]=i;
            }
        }
        }
    }
    let output
    if(times===u1) {
        output = times.substring(b[0], e[0])+times.substring(b[1], e[1])+times.substring(b[2], e[2]);
    } else {
        output = times.substring(b[0], e[0]);
    }
    return output;
    }

    createStopTime(timeReturn, times) {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        let stopTime;
            if(parseInt(timeReturn.substring(0,2)) < 6) {
                stopTime = new Date(year, month, day+1, timeReturn.substring(0,2), timeReturn.substring(2,4));
            } else {
                stopTime = new Date(year, month, day, timeReturn.substring(0,2), timeReturn.substring(2,4));
            }
        return {
            destination: times===u1?"Portsmouth University":"Langstone Campus",
            service: times===u1?"U1":"U2",
            time: stopTime.getHours() + ":" + ((stopTime.getMinutes()<10)?("0"+stopTime.getMinutes().toString()):(stopTime.getMinutes().toString())),
            eta: Math.round((stopTime.getTime() - date.getTime())/1000/60).toString(),
            etatime: stopTime.getMinutes()<59?"mins":"hours",
            timeValue: stopTime.getTime()
        };
    }

    getStopTimes(lngString, times) { //input parameter is string of times for stop
    const date = new Date();

    let timesArray = Array();
    let x = 0;
    //loop through each character in the string
    for(let i = 0; i<lngString.length; i++) {
        if (lngString.charAt(i) == " ") {
        } else if(lngString.charAt(i) == ".") {
        //skip the the next 4 characters and set the index +4
        i = i+3;
        //timesArray[x] = null;
        //x++;
        } else if(!(isNaN(lngString.charAt(i)))) {
            //checks if number and output the next 4 characters and set the index +4
            let timeReturn = (lngString.substring(i, i+4));
            i = i+3;
            
            timesArray[x] = this.createStopTime(timeReturn, times);
            x++

        } else if(lngString.charAt(i)=="!"){
        break;
        }
    }
    //console.log(timesArray);
    while(timesArray[0]===null||(timesArray[0]?timesArray[0].timeValue < (date.getTime()+60000):false))  {
        timesArray.shift();
    }
    for(let time of timesArray) {
        time = this.formatTime(time, date);
    }
    //console.log(timesArray);
    return Observable.of(timesArray);
    }

    formatTime(time, currentTime) {
        time.eta = Math.round(((time.timeValue - currentTime.getTime())/1000/60)).toString();
        time.etatime = "mins"
        if(parseInt(time.eta) < 2) {
          time.eta = "Now";
          time.etatime = null;
        } else if(parseInt(time.eta) == 60) {
          time.eta = "1";
          time.etatime = "hour"
        } else if(parseInt(time.eta) > 60) {
          time.eta = ((time.timeValue - currentTime.getTime())/1000/60/60).toFixed(1);
          time.etatime = "hours";
        }
      }

    getAllTimes(id) {
    const x = this.getTimes(id, u1);
    const y = this.getTimes(id, u2);
    this.thing = forkJoin([x, y]).subscribe(result => {

        this.nextU1Times.next(result[0]);
        this.updateServiceTimes(result[0], u1);

        this.nextU2Times.next(result[1]);
        this.updateServiceTimes(result[1], u2);

        //Run merge sort on both arrays and return merged array
        let sortedTimes = this.mergeSortedArray(result[0], result[1]);
        this.nextMergedTimes.next(sortedTimes);
        this.updateServiceTimes(sortedTimes, "u1u2");
        //console.log(sortedTimes);
    });
    }
    getU2Times(id) {
    this.thing = this.getTimes(id, u2).subscribe(result => {
        this.nextU1Times.next(null);
        this.updateServiceTimes(null, u1);

        this.nextU2Times.next(result);
        this.updateServiceTimes(result, u2);

        this.nextMergedTimes.next(null);
        this.updateServiceTimes(null, "u1u2");
    });
    }
    getU1Times(id) {
    this.thing = this.getTimes(id, u1).subscribe(result => {
        this.nextU1Times.next(result);
        this.updateServiceTimes(result, u1);

        this.nextU2Times.next(null);
        this.updateServiceTimes(null, u2);

        this.nextMergedTimes.next(null);
        this.updateServiceTimes(null, "u1u2");
    });
    }
    
}