import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, throwError } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from 'environments/environment';
import { One } from 'app/main/models/one';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-edit-one',
  templateUrl: './edit-one.component.html',
  styleUrls: ['./edit-one.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditOneComponent implements OnInit {

  //Private
  private oldEmail = "";
  user_form: FormGroup;
  architicture_File: FileList = null;
  topographique_File: FileList = null;
  propriety_File: FileList = null;
  procuration_File: FileList = null;

  //Public 
  public contentHeader: object;
  public user: One = new One();
  public isDataEmpty;
  public selectedFiles?: FileList;
  public currentFile?: File;
  public progress = 0;
  public message = '';
  public preview = null;
  public USER_IMAGE_PATH = environment.RESOURCES_LINK + '/' + environment.URL_URB_RSC + '/';
  public content_loaded: boolean

  public paramId = "";
  public title = "";
  public uploading = false;
  public isGenerated = true;

  public previewArchiticture = null;
  public previewTopographique = null;
  public previewPropriety = null;
  public previewProcuration = null;

  /* Subscription */
  public EditUserSup: Subscription = new Subscription();
  public UploadeImageSup: Subscription = new Subscription();
  public CurrentUserSup: Subscription = new Subscription();

  constructor(
    private router: Router,
    private dataService: DataService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) { }

  /**
  * On Destroy
  */
  ngOnDestroy(): void {
    this.EditUserSup.unsubscribe();
    this.UploadeImageSup.unsubscribe();
    this.CurrentUserSup.unsubscribe();
    this.content_loaded = false;
  }

  /**
  * Submit
  *
  * @param form
  */
  editUrbRequests() {
    

      this.EditUserSup = this.dataService.put('urb_requests', this.user).subscribe(async (res: any) => {
        if (res.success) {
          this.dataService.toastrSuccess("User has been updated");
          this.content_loaded = false;
          setTimeout(async () => {
            // Redirect to list
            await this.router.navigate(['/urb_requests/list/' + this.title]);
          }, 1500);

        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while deleting User, " + error);
        });
    
  }

  ngOnInit(): void {
    this.content_loaded = false;
    this.paramId = this.route.snapshot.paramMap.get('id');
    this.title = this.route.snapshot.paramMap.get('title');

    this.user_form = this.formBuilder.group({
      architectFile: [''],
      procurationFile: [''],
      proprietyFile: [''],
      topographiqueFile: [''],
    });
    // content header
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
            name: 'Edit ' + this.title,
            isLink: false
          }
        ]
      }
    };


    this.CurrentUserSup = this.dataService.get('get_urb_requests/' + this.paramId).subscribe(async (res: any) => {
      let data = null;
      if (res.success) {
        
        data = await res.data;
        this.user = data;
        console.log(this.user);
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

  
  // Uploade image to Server
  upload(ficher, name): void {
    let data = null;
    this.progress = 0;

    if (ficher) {
      const file: File | null = ficher.item(0);

      if (file) {
        const currentFile = file;

        this.dataService.uploadImageFile('urb_requests/uploadImage', currentFile,).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 * event.loaded) / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
            }
            if (event instanceof HttpResponse) {
              data = event.body.data
              this.message = event.body.msg
              if (event.body.result == "ok") {
                this.uploading = false;
                Swal.fire({
                  icon: 'success',
                  text: this.message,
                  confirmButtonColor: "#6FAAE2",
                })
                if (name == 1) {
                  this.user.architectFile = data.filename;
                }
                else if (name == 2) {
                  this.user.topographiqueFile = data.filename;
                }
                else if (name == 3) {
                  this.user.proprietyFile = data.filename;
                }
                else if (name == 4) {
                  this.user.procurationFile = data.filename;
                }
                setTimeout(() => {
                  Swal.close()
                }, 3000);
              } else {
                Swal.fire({
                  icon: 'error',
                  text: this.message,
                  confirmButtonColor: "#6FAAE2",
                })
                setTimeout(() => {
                  Swal.close()
                }, 3000);
              }

              this.selectedFiles = undefined;
              this.currentFile = undefined;
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the image!';
            }
            Swal.fire({
              icon: 'error',
              text: this.message,
              confirmButtonColor: "#6FAAE2",
            })
            this.progress = 0;
            this.selectedFiles = undefined;
            this.currentFile = undefined;
            setTimeout(() => {
              Swal.close()
            }, 3000);

          },
        });
      }

    }
  }

  proprietyFile(event: any) {
    console.log(event.target.files[0])
    this.propriety_File = event.target.files
    if (this.propriety_File) {
      const file: File | null = this.propriety_File.item(0);
      // this.uploading = true;

      if (file) {
        this.previewPropriety = '';
        // this.currentFile = ;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          // console.log(e.target.result);
          this.previewPropriety = e.target.result;
        };

        reader.readAsDataURL(file);


        this.upload(this.propriety_File, 3);
        
      }
    }
  }
  architictureFile(event: any) {
    console.log(event.target.files[0])
    this.architicture_File = event.target.files
    if (this.architicture_File) {
      const file: File | null = this.architicture_File.item(0);
      // this.uploading = true;

      if (file) {
        this.previewArchiticture = '';
        // this.currentFile = ;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          // console.log(e.target.result);
          this.previewArchiticture = e.target.result;
        };

        reader.readAsDataURL(file);

        this.upload(this.architicture_File, 1);
      }
    }
  }
  topographiqueFile(event: any) {
    console.log(event.target.files[0])
    this.topographique_File = event.target.files
    if (this.topographique_File) {
      const file: File | null = this.topographique_File.item(0);
      // this.uploading = true;

      if (file) {
        this.previewTopographique = '';
        // this.currentFile = ;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          // console.log(e.target.result);
          this.previewTopographique = e.target.result;
        };

        reader.readAsDataURL(file);


        this.upload(this.topographique_File, 2);
      }
    }
  }
  procurationFile(event: any) {
    console.log(event.target.files[0])
    this.procuration_File = event.target.files
    if (this.procuration_File) {
      const file: File | null = this.procuration_File.item(0);
      // this.uploading = true;

      if (file) {
        this.previewProcuration = '';
        // this.currentFile = ;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          // console.log(e.target.result);
          this.previewProcuration = e.target.result;
        };

        reader.readAsDataURL(file);

        this.upload(this.procuration_File, 4);
      }
    }
  }






}
