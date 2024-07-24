import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from 'environments/environment';
import { User } from 'app/main/models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { One } from 'app/main/models/one';

@Component({
  selector: 'app-add-one',
  templateUrl: './add-one.component.html',
  styleUrls: ['./add-one.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddOneComponent implements OnInit {

  user_form: FormGroup;
  submit_attempt: boolean = false;
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
  public previewArchiticture = null;
  public previewTopographique = null;
  public previewPropriety = null;
  public previewProcuration = null;
  public USER_IMAGE_PATH = environment.RESOURCES_LINK + '/' + environment.URL_USER_RSC + '/';
  public content_loaded: boolean

  public paramId = "";
  public title = "";
  public uploading = false;
  public isGenerated = true;

  /* Subscription */
  public AddUserSup: Subscription = new Subscription();
  public UploadeImageSup: Subscription = new Subscription();

  constructor(
    private router: Router,
    private dataService: DataService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) {
    // this.user.email = "";
    // this.user.password = "";
  }

  /**
    * On Destroy
    */
  ngOnDestroy(): void {
    this.AddUserSup.unsubscribe();
    this.UploadeImageSup.unsubscribe();
    this.content_loaded = false;
  }
  getFileAsBase64(file: File): Promise<string> {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]); // Return only the base64 string without the data URL prefix
      };
      reader.onerror = error => reject(error);

      reader.readAsDataURL(file);
    });
  }

  /**
     * Submit
     *
     * @param form
     */
  addUrbRequests() {

    this.submit_attempt = true;

    if (this.user_form.valid) {
      
      // const formData = new FormData();
      const formData = {
        cin: this.user_form.get('cin')?.value,
        file_type: this.title,
        topographiqueFile: this.user.topographique_file,
        proprietyFile: this.user.propriety_file,
        architectFile: this.user.architect_file,
        procurationFile: this.user.procuration_file,
        // topographiqueFile: this.getFileAsBase64(this.topographique_File.item(0)),
        // proprietyFile: this.getFileAsBase64(this.propriety_File.item(0)),
        // architectFile: this.getFileAsBase64(this.architicture_File.item(0)),
        // procurationFile: this.getFileAsBase64(this.procuration_File.item(0)),
      };
      // Append files
      // if (this.procuration_File) {
      //   formData.append('filePu', this.procuration_File.item(0));
      // }
      // if (this.architicture_File) {
      //   formData.append('fileAr', this.architicture_File.item(0));
      // }
      // if (this.propriety_File) {
      //   formData.append('fileProprity', this.propriety_File.item(0));
      // }
      // if (this.topographique_File) {
      //   formData.append('fileTopographique', this.topographique_File.item(0));
      // }

      // Append other form data
      // formData.append('cin', this.user_form.get('cin')?.value);
      // formData.append('file_type', this.title)
      // formData.forEach(element => {
      //   console.log(element)
      // })
      console.log(this.procuration_File.item(0))
      console.log(formData)

      this.AddUserSup = this.dataService.post("urb_requests", formData, true).subscribe(async (res: any) => {
        if (res.success) {
          this.uploading = true;
      
          this.dataService.toastrSuccess("has been created");
          this.content_loaded = false;
          console.log(res)
          setTimeout(async () => {
            // Redirect to list
            await this.router.navigate(['/urb_requests/list/' + this.title]);
          }, 1500);
        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while , " + error);
        });
    }
  }

  ngOnInit(): void {
    this.title = this.route.snapshot.paramMap.get('title');
    this.content_loaded = false;
    // Setup form
    this.user_form = this.formBuilder.group({
      architectFile: ['', [Validators.required]],
      procurationFile: [''],
      proprietyFile: ['', [Validators.required]],
      topographiqueFile: ['', [Validators.required]],
      cin: [''],
    });

    // this.user_form.patchValue({
    //   email: "",
    //   password: ""
    // });

    setTimeout(() => {
      this.content_loaded = true;
    }, 500);

    // content header
    this.contentHeader = {
      headerTitle: this.title,
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Accueil',
            isLink: true,
            link: '/'
          },
          {
            name: 'ajouter ' + this.title,
            isLink: false
          }
        ]
      }
    };

    // Default status for user
    // this.user.status = 1;
    // setTimeout(() => {
    //   this.user.email = "";
    // }, 1500);
  }

  // When Select file from input
  selectFile(event: any): void {
    this.message = '';
    this.preview = '';
    this.progress = 0;
    this.selectedFiles = event.target.files;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.uploading = true;

      if (file) {
        this.preview = '';
        this.currentFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          // console.log(e.target.result);
          this.preview = e.target.result;
        };

        reader.readAsDataURL(this.currentFile);

        // this.upload();
      }
    }
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
                  this.user.architect_file = data.filename;
                }
                else if (name == 2) {
                  this.user.topographique_file = data.filename;
                }
                else if (name == 3) {
                  this.user.propriety_file = data.filename;
                }
                else if (name == 4) {
                  this.user.procuration_file = data.filename;
                }
                setTimeout(() => {
                  Swal.close()
                }, 500);
              } else {
                Swal.fire({
                  icon: 'error',
                  text: this.message,
                  confirmButtonColor: "#6FAAE2",
                })
                setTimeout(() => {
                  Swal.close()
                }, 500);
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
