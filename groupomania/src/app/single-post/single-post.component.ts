import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { Comment } from '../models/comment.model';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent implements OnInit {

  loading: boolean;
  post: Post;
  user_id: string;
  likePending: boolean;
  liked: boolean;
  disliked: boolean;
  errorMessage: string;
  user: User;
  commentForm: FormGroup;
  durationInSeconds = 5;

  constructor(public posts: PostService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit() {
    this.user_id = this.auth.getUserId();
    this.loading = true;
    this.route.params.subscribe(
      (params) => {
        this.posts.getPostById(params.post_id).then(
          (post: Post) => {
            this.post = post;
            this.loading = false;
            console.log(post);
          }
        );
      }
    );
    this.user_id = this.auth.getUserId();
      this.route.params.subscribe(
        (params) => {
          console.log(this.auth.getUserId());
          this.auth.getUserById(this.auth.getUserId()).then(
            (user: User) => {
              this.user = user;
              this.loading = false;
            }
          );
        }
      );
      this.initEmptyFormComment();
      
  }

  openPostSnackBar() {
    this._snackBar.openFromComponent(DeletePostComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }


  onLike() {
    this.loading = true;
    this.posts.likePost(this.post.post_id).then(
      (response: { message: string }) => {
        console.log(response.message);
        this.loading = false;
        window.location.reload();
      }
    ).catch(
      (error) => {
        this.loading = false;
        this.errorMessage = error.message;
        console.error(error);
      }
    );
  }

  onBack() {
    this.router.navigate(['/timeline']);
  }

  onDelete() {
    this.loading = true;
    this.posts.deletePost(this.post.post_id).then(
      (response: { message: string }) => {
        console.log(response.message);
        this.loading = false;
        this.router.navigate(['/timeline']);
      }
    ).catch(
      (error) => {
        this.loading = false;
        this.errorMessage = error.message;
        console.error(error);
      }
    );
  }

  initEmptyFormComment() {
    this.commentForm = this.formBuilder.group({
      commentContent: [null, Validators.required]
    });
  }

  onComment(){
    this.loading = true;
    const newComment = new Comment();
    newComment.commentContent = this.commentForm.get('commentContent').value;
    newComment.user_id = this.auth.getUserId();

    this.posts.createComment(newComment, this.post.post_id).then(
      (response: { message: string }) => {
        console.log(response.message);
        this.loading = false;
        window.location.reload();
        //this.router.navigate(['/timeline']);
      }
    ).catch(
      (error) => {
        console.error(error);
        this.loading = false;
        this.errorMessage = error.message;
      }
    );
  }

  onDeleteComment(comment_id){
    this.loading = true;
    this.posts.deleteComment(this.post.post_id, comment_id).then(
      (response: { message: string }) => {
        console.log(response.message);
        this.loading = false;
        window.location.reload();
        //this.router.navigate(['/timeline']);
      }
    ).catch(
      (error) => {
        this.loading = false;
        this.errorMessage = error.message;
        console.error(error);
      }
    );
  }
  openAddCommentSnackBar() {
    this._snackBar.openFromComponent(AddCommentComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }
  openDeleteCommentSnackBar() {
    this._snackBar.openFromComponent(DeleteCommentComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }
}

@Component({
  selector: 'delete-post-snackbar',
  templateUrl: 'delete-post-snackbar.html',
  styles: [`
    .delete-post-snackbar {
      color: hotpink;
    }
  `],
})
export class DeletePostComponent {}

@Component({
  selector: 'delete-comment-snackbar',
  templateUrl: 'delete-comment-snackbar.html',
  styles: [`
    .delete-comment-snackbar {
      color: hotpink;
    }
  `],
})
export class DeleteCommentComponent {}

@Component({
  selector: 'add-comment-snackbar',
  templateUrl: 'add-comment-snackbar.html',
  styles: [`
    .add-comment-snackbar {
      color: hotpink;
    }
  `],
})
export class AddCommentComponent {}
