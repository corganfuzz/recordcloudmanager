import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import * as Chart from 'chart.js';
import { ClickerService } from '../services/clicker/clicker.service';

@Component({
  selector: 'app-histogramer',
  templateUrl: './histogramer.component.html',
  styleUrls: ['./histogramer.component.scss']
})
export class HistogramerComponent implements AfterViewInit, OnDestroy {

  data: any;
  canvas: any;
  context: any;
  initialChartValue: any;
  histogramChart: Chart;

  constructor(private clickerService: ClickerService) {
   }

  ngAfterViewInit () {
     this.setupChartConfig();
  }

  ngOnDestroy () {
    this.canvas.destroy();
  }

  setupChartConfig () {
    this.clickerService.myClicker.subscribe(response => {
    this.canvas = document.getElementById('histogramChart');

    if (this.canvas !== null) {
      this.context = this.canvas.getContext('2d');
    }

    if (this.histogramChart) {
      this.histogramChart.destroy();
    }

    this.histogramChart = new Chart(this.context, {
      type: 'bar',
      data: {
          datasets: [{
              label: ['Word Count'],
              data: [response],
              backgroundColor: [
                  '#7b1fa2',
              ],
              borderWidth: 1
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
          scaleLabel: {
            display: true,
            labelString: 'Word Count per clicked file',
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
                color: '#848080',
              },
          }],
      },
        responsive: true,
      }
    });
  });

  }
}

