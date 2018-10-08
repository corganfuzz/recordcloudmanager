import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import * as Chart from 'chart.js';
import { ClickerService } from '../services/clicker/clicker.service';
import { COLORS_BARS} from '../constants/colors';
@Component({
  selector: 'app-wordfrequency',
  templateUrl: './wordfrequency.component.html',
  styleUrls: ['./wordfrequency.component.scss']
})
export class WordfrequencyComponent implements AfterViewInit, OnDestroy {

  constructor(private clickerService: ClickerService) { }

  canvas: any;
  context: any;
  secondHistogram: Chart;
  labelData: any[];
  datasetData: any[];
  dataAndLabels: any;

  ngAfterViewInit() {
    this.setupChartConfig();
  }

  ngOnDestroy () {
    this.canvas.destroy();
  }

  setupChartConfig () {
    this.clickerService.myClicker.subscribe(response => {
    this.clickerService.freqClicker.subscribe(data => {
       const totalWords = response;
       const labelData = data[0];
       const datasetData = data[1];
      this.canvas = document.getElementById('secondHistogram');

      if (this.canvas !== null) {
        this.context = this.canvas.getContext('2d');
      }

      if (this.secondHistogram) {
        this.secondHistogram.destroy();
      }

      this.secondHistogram = new Chart(this.context, {
        type: 'bar',
        data: {
            labels: labelData,
            datasets: [{
                data: datasetData,
                backgroundColor: COLORS_BARS,
                borderWidth: 1,
                fontColor: '#FFF',
            }]
        },
        options: {
          legend: {
            labels: {
              fontColor: '#FFF',
            },
            display: false,
          },
          scales: {
            xAxes: [{
              ticks: {
                fontColor: '#FFF',
                autoSkip: false,
                maxRotation: 90,
                minRotation: 90,
              },
            scaleLabel: {
              display: true,
              labelString: 'Total Words: ' + totalWords,
              fontColor: '#FFF',
            },
            gridLines: {
              color: '#848080',
            },
          }],
            yAxes: [{
                ticks: {
                    fontColor: '#FFF',
                    beginAtZero: true,
                    userCallback: function(label, index, labels) {
                        if (Math.floor(label) === label) {
                            return label;
                        }
                    },
                },
                gridLines: {
                  color: '#red',
                },
            }],
        },
          responsive: true,
          showXLabels : 20,
        }
      });
    });
    });
  }

}
