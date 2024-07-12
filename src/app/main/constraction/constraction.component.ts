import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-constraction',
  templateUrl: './constraction.component.html',
  styleUrls: ['./constraction.component.scss']
})
export class ConstractionComponent implements OnInit {
  public title = "";
  constructor(private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.title = params['title'];
      // this.loadData(this.type);
    });
    // this.title = this.route.snapshot.paramMap.get('title');
  }

}
