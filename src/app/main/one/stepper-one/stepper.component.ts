import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { One } from 'app/main/models/one';
import { DataService } from 'app/services/data.service';
import Stepper from 'bs-stepper';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-stepper',
    templateUrl: './stepper.component.html',

    encapsulation: ViewEncapsulation.None
})
export class SteeperComponent implements OnInit {
    name = 'Angular';
    private stepper: Stepper;
    public paramId = "";
    public content_loaded: boolean
    public one: One[] = [];
    public title = "";
    public CurrentUserSup: Subscription = new Subscription();
    constructor(private route: ActivatedRoute,private router: Router, private dataService: DataService,) {

    }

    /**
    * On Destroy
    */
    ngOnDestroy(): void {
        this.CurrentUserSup.unsubscribe();
    }

    /**
     * On init
     */
    async ngOnInit() {
        this.paramId = this.route.snapshot.paramMap.get('id');
        this.title = this.route.snapshot.paramMap.get('title');
        this.stepper = new Stepper(document.querySelector('#stepper1'), {
            linear: false,
            animation: true
        });
        this.CurrentUserSup = this.dataService.get('get_urb_requests/' + this.paramId).subscribe(async (res: any) => {
            const data = [];
            if (res.success) {
              
              let response = await res.data;
            //   data.push(response);
            //   console.log(this.one);
              this.one = response;
              // this.user.role = data.role_user.role;
              // this.oldEmail = this.user.email;
              // this.user.password = null;
              this.content_loaded = true;
      
      
            } else {
              console.log('Error while taking - Check your info input');
            }
          },
          async (error: any) => {
            console.log(error)
            this.dataService.toastrDanger("Error while taking - Check your info input " + error);
          });
    }
    next() {
        this.stepper.next();
      }
    
      onSubmit() {
        this.dataService
          .post('urb_requests/updateStatus', this.one[0])
          .subscribe(async (res: any) => {
            if (res.success) {
              this.content_loaded = true;

              this.dataService.toastrSuccess("Status has been updated");
              this.router.navigate(['urb_requests/list/' + this.title]);
              // console.log("users : ",this.users)
            }
          }, async (error: any) => {
            console.log(error)
            this.dataService.toastrDanger("Error while taking - Check your info input, " + error);
          });
      }









}
