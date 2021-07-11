import { AuthService } from './../../services/auth.service';
import { VersionService } from './../../services/version.service';
import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [NgbCarouselConfig]
})
export class DashboardComponent implements OnInit {
  
  ordersChartLabels = ["10","","","20","","","30","","","40","","", "50","","", "60","","","70"];
  ordersChartData = [
    {
      label: 'Product',
      data: [200, 480, 700, 600, 620, 350, 380, 350, 850, 600, 650, 350, 590, 350, 620, 500, 990, 780, 650],
      fill: false,
      borderColor: '#248afd'
    },
    {
      label: 'Product',
      data: [400, 450, 410, 500, 480, 600, 450, 550, 460, 560, 450, 700, 450, 640, 550, 650, 400, 850, 800],
      fill: false,
      borderColor: '#ff4747'
    }
  ];
  ordersChartColors = [
    {
      borderColor: '#248afd'
    },
    {
      borderColor: '#ff4747'      
    }
  ]
  ordersChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      xAxes: [{
        display: true,
        ticks: {
          display: true,
          padding: 10
        },
        gridLines: {
          display: false,
          drawBorder: false,
          color: 'transparent',
          zeroLineColor: '#eeeeee'
        }
      }],
      yAxes: [{
        display: true,
        ticks: {
          display: true,
          autoSkip: false,
          maxRotation: 0,
          stepSize: 200,
          min: 200,
          max: 1200,
          padding: 18
        },
        gridLines: {
          display: false,
          drawBorder: false
        }
      }]
    },
    legend: {
      display: false
    },
    elements: {
      point: {
        radius: 0
      }
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    },
    stepsize: 1
  }


  salesChartLabels = ["Jan", "Feb", "Mar", "Apr", "May"];
  salesChartColors = [
    {
      backgroundColor: '#ffc100',
    },
    {
      backgroundColor: '#f5a623'
    }
  ];
  salesChartData = [
    {
      label: 'Offline sales',
      data: [480, 230, 470, 210, 330],
      backgroundColor: '#fff'
    },
    {
      label: 'Online sales',
      data: [400, 340, 550, 460, 170],
      backgroundColor: '#fff'
    }
  ];
  salesChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      yAxes: [{
        display: true,
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          display: false,
          min: 0,
          max: 500
        }
      }],
      xAxes: [{
        stacked: false,
        ticks: {
          beginAtZero: true,
          fontColor: "#9fa0a2"
        },
        gridLines: {
          color: "rgba(0, 0, 0, 0)",
          display: false
        },
        barPercentage: 1
      }]
    },
    legend: {
      display: false
    },
    stepsize: 1
  }

  northAmericaChartData = [
    {
      label: ['Request', 'Email', 'null'],
      data: [100, 50, 50]
    }
  ];
  northAmericaChartLabel = ["Jan", "Feb", "Mar"];
  northAmericaChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    segmentShowStroke: false,
    cutoutPercentage: 78,
    elements: {
      arc: {
          borderWidth: 4
      }
    },      
    legend: {
      display: false
    },
    tooltips: {
      enabled: true
    }
  }
  northAmericaChartColors = [
    {
      backgroundColor: ["#71c016", "#ffc100", "#248afd"],
      borderColor: "rgba(0,0,0,0)"
    }
  ];
  northAmericaChartPlugins = {
    beforeDraw: function(chart) {
      var width = chart.chart.width,
          height = chart.chart.height,
          ctx = chart.chart.ctx;
  
      ctx.restore();
      var fontSize = 3.125;
      ctx.font = "600 " + fontSize + "em sans-serif";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#b1b1b5";
  
      var text = "90",
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 2;
  
      ctx.fillText(text, textX, textY);
      ctx.save();
    }
  }


  southAmericaChartData = [
    {
      label: ['Request', 'Email', 'null'],
      data: [60, 70, 70]
    }
  ];
  southAmericaChartLabel = ["Jan", "Feb", "Mar"];
  southAmericaChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    segmentShowStroke: false,
    cutoutPercentage: 78,
    elements: {
      arc: {
          borderWidth: 4
      }
    },      
    legend: {
      display: false
    },
    tooltips: {
      enabled: true
    }
  }
  southAmericaChartColors = [
    {
      backgroundColor: ["#ffc100", "#248afd", "#71c016"],
      borderColor: "rgba(0,0,0,0)"
    }
  ];
  southAmericaChartPlugins = {
    beforeDraw: function(chart) {
      var width = chart.chart.width,
          height = chart.chart.height,
          ctx = chart.chart.ctx;
  
      ctx.restore();
      var fontSize = 3.125;
      ctx.font = "600 " + fontSize + "em sans-serif";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#b1b1b5";
  
      var text = "76",
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 2;
  
      ctx.fillText(text, textX, textY);
      ctx.save();
    }
  }
  
  version = 2.1;
  saldo: number;
  jugadasActivas: number;
  totalJugadas: number;
  juegos: number;
  inPlayJuegos: number;
  username: string;  
  constructor(config: NgbCarouselConfig, private versionSvc: VersionService,
              private spinner: NgxSpinnerService, private authSvc: AuthService) {
    config.showNavigationArrows = true;
    config.showNavigationIndicators = false;
  }

  ngOnInit() {
    this.spinner.show();
    this.username = this.authSvc.activeUser.primerNombre;
    this.authSvc.getHome().subscribe((resp: any) => {
      this.saldo = resp.saldo;
      this.jugadasActivas = resp.jugadasActivas;
      this.totalJugadas = resp.totalJugadas;
      this.juegos = resp.juegos;
      this.inPlayJuegos = resp.inPlayjuegos;
      this.spinner.hide();
    })
    this.versionSvc.getVersion().subscribe(
      (resp: any) => {
        if(resp.version != this.version){
          window.location.reload();
        }
      }
    );    
  }

}
