import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { Subscription } from 'rxjs';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})

export class TimelineComponent implements OnInit {

  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  postSub: Subscription;
  postForm: FormGroup;
  loading: boolean;
  posts: Post[];
  errorMsg: string;
  imagePreview: string;
  user_id: string;
  user: User;
  currentPage = 1;
  itemsPerPage = 5;
  pageSize: number;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public post: PostService,
    private auth: AuthService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.user_id = this.auth.getUserId();
      this.route.params.subscribe(
        (params) => {
          console.log(this.auth.getUserId());
          this.auth.getUserById(this.auth.getUserId()).then(
            (user: User) => {
              console.log(user);
              this.user = user;
              this.loading = false;
            }
          );
        }
      );
      this.loading = true;
      this.postSub = this.post.posts$.subscribe(
      (posts) => {
        this.posts = posts;
        this.loading = false;
        this.errorMsg = null;
      },
      (error) => {
        this.errorMsg = JSON.stringify(error);
        this.loading = false;
      }
    );
    this.post.getPosts();
   }

   public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
  }

  public changePagesize(num: number): void {
    this.itemsPerPage = this.pageSize + num;
  }

  onClickPost(post_id: string) {
    this.router.navigate(['timeline/', post_id]);
  }

  onClickFilterMessages() {
    this.router.navigate(['./messages']);
  }

  onClickFilterMedias() {
    this.router.navigate(['./medias/']);
  }

  openMediaDialog() {
    const dialogRef = this.dialog.open(PostMediaDialog, { restoreFocus: false });
    dialogRef.afterClosed().subscribe(() => this.menuTrigger.focus());
  }

  openMessageDialog() {
    const dialogRef = this.dialog.open(PostMessageDialog, { restoreFocus: false });
    dialogRef.afterClosed().subscribe(() => this.menuTrigger.focus());
  }

  onLike(post_id: string) {
    this.loading = true;
    this.post.likePost(post_id).then(
      (response: { message: string }) => {
        console.log(response.message);
        this.loading = false;
        window.location.reload();
      }
    ).catch(
      (error) => {
        this.loading = false;
        //this.errorMessage = error.message;
        console.error(error);
      }
    );
  }
}

@Component({
  selector: 'PostMessageDialog',
  templateUrl: 'PostMessageDialog.html',
  styleUrls: ['./PostMessageDialog.scss']
})
export class PostMessageDialog {

  postSub: Subscription;
  mediaForm: FormGroup;
  messageForm: FormGroup;
  postMediaOrMessage = false;
  loading: boolean;
  posts: Post[];
  errorMsg: string;
  imagePreview: string;
  animal: string;
  name: string;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private post: PostService,
    private auth: AuthService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.loading = true;
    this.postSub = this.post.posts$.subscribe(
      (posts) => {
        this.posts = posts;
        this.loading = false;
        this.errorMsg = null;
      },
      (error) => {
        this.errorMsg = JSON.stringify(error);
        this.loading = false;
      }
    )
    this.post.getPosts();
    this.initEmptyFormMessage();
  }

  initEmptyFormMessage() {
    this.messageForm = this.formBuilder.group({
      title: [null, Validators.required],
      content: [null, Validators.required]
    });
  }

  onMessage() {
    this.loading = true;
    const newPost = new Post();
    newPost.content = this.messageForm.get('content').value;
    newPost.title = this.messageForm.get('title').value;
    newPost.user_id = this.auth.getUserId();

    this.post.createMessage(newPost).then(
      (response: { message: string }) => {
        console.log(response.message);
        this.loading = false;
        window.location.reload();
      }
    ).catch(
      (error) => {
        console.error(error);
        this.loading = false;
        this.errorMsg = error.message;
      }
    );
  }
}

@Component({
  selector: 'PostMediaDialog',
  templateUrl: 'PostMediaDialog.html',
  styleUrls: ['./PostMediaDialog.scss']
})
export class PostMediaDialog {

  postSub: Subscription;
  mediaForm: FormGroup;
  messageForm: FormGroup;
  postMediaOrMessage = false;
  loading: boolean;
  posts: Post[];
  errorMsg: string;
  imagePreview: string;
  animal: string;
  name: string;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private post: PostService,
    private auth: AuthService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.postSub = this.post.posts$.subscribe(
      (posts) => {
        this.posts = posts;
        this.loading = false;
        this.errorMsg = null;
      },
      (error) => {
        this.errorMsg = JSON.stringify(error);
        this.loading = false;
      }
    );
    this.post.getPosts();
    this.initEmptyFormMedia();
  }

  initEmptyFormMedia() {
    this.mediaForm = this.formBuilder.group({
      title: [null, Validators.required],
      image: [null, Validators.required],
    });
  }
  onMedia() {
    this.loading = true;
    const newPost = new Post();
    newPost.title = this.mediaForm.get('title').value;
    newPost.user_id = this.auth.getUserId();

    this.post.createMedia(newPost, this.mediaForm.get('image').value).then(
      (response: { message: string }) => {
        console.log(response.message);
        this.loading = false;
        window.location.reload();;
      }
    ).catch(
      (error) => {
        console.error(error);
        this.loading = false;
        this.errorMsg = error.message;
      }
    );
  }
  onFileAdded(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.mediaForm.get('image').setValue(file);
    this.mediaForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}