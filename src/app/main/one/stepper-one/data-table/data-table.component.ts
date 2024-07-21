import {
  Component,
  Input,
  OnChanges,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { Router } from "@angular/router";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from "@swimlane/ngx-datatable";
import { One } from "app/main/models/one";

@Component({
  selector: "app-stepper-data-table",
  templateUrl: "./data-table.component.html",
  styleUrls: ["./data-table.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DataTableStepperComponent implements OnChanges {

  @Input() allDataTable;
  // @Input() title;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  public ColumnMode = ColumnMode;
  public SelectionType = SelectionType;
  private tempData: One[] = [];
  constructor(private router: Router,) {}
  dataTable: any;
  // content_loaded = false;
  ngOnChanges(): void {
    console.log(this.allDataTable);
    this.dataTable = this.allDataTable;
    this.tempData = this.allDataTable;
    // if (
    //   typeof this.allDataTable !== "undefined" &&
    //   this.allDataTable.length > 0
    // ) {
    //   this.dataTable = this.allDataTable;
    //   this.tempData = this.allDataTable;
    //   // this.content_loaded = true;
   
    // }
  }
  // go(){
  //   this.router.navigate(['urb_requests/list/' + this.in_out]);
  // }

  filterUpdate(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempData.filter(function (d:any) {
      return d.user.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.dataTable = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

}
