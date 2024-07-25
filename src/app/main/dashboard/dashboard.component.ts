import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { DataService } from "app/services/data.service";
import { One } from "../models/one";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  constructor(private dataService: DataService) {}

  public contentHeader: object;
  public SallesAndPurchase: any;
  public topProduct: any;
  public topCategory: any;
  public unapproved: One[] = [];
  public approved: One[] = [];
  public topClient: any;
  chartColors1 = [
     "#ffe700",
    "#00d4bd",
     "#d05f9b",
    "#2b9bf4",
     "#FFA1A1",
];
  chartColors2 = [
     "#ec3f33",
    "#0c3622",
    "#e08788",
     "#c91c25",
     "#a87603",
    ];
  chartColors3 = [
    "#2a031e",
    "#006ed4",
    "#00885f",
    "#2c033d",
    "#11ee8f",
  ];
     
  

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {


    this.getUnapprovedRequest();
    this.getApprovedRequest();

    this.contentHeader = {
      headerTitle: "Accueil",
      actionButton: true,
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Accueil",
            isLink: true,
            link: "/",
          },
          {
            name: "Tableau de bord",
            isLink: false,
          },
        ],
      },
    };
  }


  async getUnapprovedRequest() {
    this.dataService.get("get_unapproved_request").subscribe(
      async (res: any) => {
        const newUnapproved = [];
        if (res.success) {
          // console.log(res);
          await res.data.forEach((element) => {
              newUnapproved.push(element);
              
          });
          this.unapproved = newUnapproved; 
          
        }
      },
      async (error: any) => {
        console.log(error);
        this.dataService.toastrDanger(
          "Error while taking - Check your info input, " + error
        );
      }
    );
  }
  async getApprovedRequest() {
    this.dataService.get("get_approved_request").subscribe(
      
      async (res: any) => {
        const newApproved = [];
        if (res.success) {
          await res.data.forEach((element) => {
            newApproved.push(element);
          });
          this.approved = newApproved; 
          console.log(this.approved)
        }
      },
      async (error: any) => {
        console.log(error);
        this.dataService.toastrDanger(
          "Error while taking - Check your info input, " + error
        );
      }
    );
  }
}
