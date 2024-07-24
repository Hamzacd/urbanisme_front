import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { Subscription } from 'rxjs';
import { DataService } from 'app/services/data.service';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { One } from '../models/one';
import Swal from 'sweetalert2';
import { ExportService } from '@core/services/export.service';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'app/auth/service';

@Component({
  selector: 'app-one',
  templateUrl: './one.component.html',
  styleUrls: ['./one.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OneComponent implements OnInit {
  @Input() title: string;
  // Private
  public users: One[] = []
  private tempData = [];
  private toastRef: any;
  private options: GlobalConfig;
  private currentUser: any;
  public userRole: any;
  // public
  public contentHeader: object;
  public basicSelectedOption: number = 10;
  public SelectionType = SelectionType;
  public exportCSVData = [];
  public no_data_text = "Aucune Donnée Disponible"
  public ColumnMode = ColumnMode;
  public USER_IMAGE_PATH = environment.RESOURCES_LINK + '/' + environment.URL_URB_RSC + '/';
  public content_loaded: boolean

  /* Subscription */
  public usersSup: Subscription = new Subscription();
  public uodateStatusSup: Subscription = new Subscription();



  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(private _authenticationService: AuthenticationService,
    private router: Router, public exportData: ExportService,
    private dataService: DataService, private toastr: ToastrService,
    private http: HttpClient, private route: ActivatedRoute) {
    this.options = this.toastr.toastrConfig;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const currentUser = this._authenticationService.currentUserValue;
    this.userRole = currentUser?.role;
  }

  /**
  * On Destroy
  */
  ngOnDestroy(): void {
    this.usersSup.unsubscribe();
    this.uodateStatusSup.unsubscribe();
    this.content_loaded = false;
  }

  /**
   * On init
   */
  async ngOnInit() {

    this.content_loaded = false;
    this.route.params.subscribe(params => {
      this.title = params['title'];
      this.getAllUsers();
      this.contentHeader = {
        headerTitle: this.title + 's',
        actionButton: true,
        breadcrumb: {
          type: '',
          links: [
            {
              name: 'Home',
              isLink: true,
              link: '/'
            },
            {
              name: this.title + 's',
              isLink: false
            }
          ]
        }
      };
    });
    // content header


    await this.getAllUsers();
    // this.dataService.toastrSuccess("Users retrieveawait this.getAlld successfully");
  }

  async getAllUsers() {

    const file_type = this.title;
    this.usersSup = this.dataService
      .get('urb_requests', { file_type })
      .subscribe(async (res: any) => {
        console.log(res);
        if (res.success) {
          this.users = await res.data;
          this.tempData = await res.data;
          this.content_loaded = true;
        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while taking - Check your info input, " + error);
        });
  }



  async updateStatus(user, event) {

    // update status user 
    user.status = event.target.checked ? 1 : 0;
    this.usersSup = this.dataService
      .post('urb_requests/updateStatus', user)
      .subscribe(async (res: any) => {
        if (res.success) {
          this.users = await res.data;
          this.tempData = await res.data;
          this.content_loaded = true;

          // Remove User connected from array users in table
          let id_user_connected = null;
          for (let index = 0; index < this.users.length; index++) {
            if (this.users[index].id === this.currentUser.id) {
              id_user_connected = index;
            }
          }
          this.users.splice(id_user_connected, 1);

          this.table.offset = 0;

          this.dataService.toastrSuccess("Status has been updated");

          // console.log("users : ",this.users)
        }
      }, async (error: any) => {
        console.log(error)
        this.dataService.toastrDanger("Error while taking - Check your info input, " + error);
      });
  }
  aproveRequest(id) {
    this.router.navigate(['urb_requests/stepper/' + id + '/' + this.title]);
  }
  filterUpdate(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempData.filter(function (d) {
      return d.user.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.users = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  deleteItem(id) {
    let that = this;

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to Cancel this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      cancelButtonColor: '#E42728',
      confirmButtonText: 'Yes, cancel it!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1'
      }
    }).then(async function (result) {
      if (await result.value) {

        // code
        const data = { id: id };
        that.dataService.delete('urb_requests', data).subscribe(async (res: any) => {
          if (res.success) {
            that.content_loaded = false;
            await that.getAllUsers();
            that.dataService.toastrInfo(res.message)
            that.table.offset = 0;
          }
        }, async (error: any) => {
          console.log(error)
          that.dataService.toastrDanger("Error while deleting use, " + error);
        });

      }
    });


  }
  downloadFile(fileName: string) {
    const fileUrl = this.USER_IMAGE_PATH + fileName;
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

}
