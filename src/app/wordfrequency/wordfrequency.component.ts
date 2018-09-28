import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import * as Chart from 'chart.js';
import { ClickerService } from '../services/clicker/clicker.service';

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
    this.clickerService.freqClicker.subscribe(data => {
      console.log(data);
      this.labelData = data[0];
      this.datasetData = data[1];
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
            labels: data[0],
            datasets: [{
                label: ['Word Count'],
                data: data[1],
                // backgroundColor: [
                //     'red',
                // ],
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
              labelString: 'Nope',
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
