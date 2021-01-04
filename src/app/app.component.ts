import {Component, OnInit} from '@angular/core';
import {JitsiExternalApiService} from './services/jitsi-external-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private jitsiService: JitsiExternalApiService) {
  }

  ngOnInit() {
    this.jitsiService.createConnection('jitsi-test-123-dev', document.querySelector('#jitsi-wrapper'));
  }
}
