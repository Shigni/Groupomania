import { Injectable } from '@angular/core';
import { from, Subject } from 'rxjs';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { Comment } from '../models/comment.model'
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  posts$ = new Subject<Post[]>();

  constructor(private http: HttpClient,
    private auth: AuthService,) { }

  getPosts() {
    this.http.get('http://localhost:3000/api/post/timeline').subscribe(
      (posts: Post[]) => {
        this.posts$.next(posts);
      },
      (error) => {
        this.posts$.next([]);
        console.error(error);
      }
    );
  }

  getMessages() {
    this.http.get('http://localhost:3000/api/post/messages').subscribe(
      (posts: Post[]) => {
        this.posts$.next(posts);
      },
      (error) => {
        this.posts$.next([]);
        console.error(error);
      }
    );
  }

  getMedias() {
    this.http.get('http://localhost:3000/api/post/medias').subscribe(
      (posts: Post[]) => {
        this.posts$.next(posts);
      },
      (error) => {
        this.posts$.next([]);
        console.error(error);
      }
    );
  }
 
  getPostById(post_id: string) {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:3000/api/post/timeline/' + post_id).subscribe(
        (post: Post) => {
          resolve(post);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  likePost(post_id: string) {
    return new Promise((resolve, reject) => {
      this.http.post(
        'http://localhost:3000/api/post/timeline/' + post_id + '/like',
        {
          user_id: this.auth.getUserId(),
        })
        .subscribe(
          (response: { message: string }) => {
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  createMedia(post: Post, image: File) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('post', JSON.stringify(post));
      formData.append('image', image);
      this.http.post('http://localhost:3000/api/post/timeline/media', formData).subscribe(
        (response: { message: string }) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  createMessage(post: Post) {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:3000/api/post/timeline/message', post).subscribe(
        (response: { message: string }) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  deletePost(post_id: string) {
    return new Promise((resolve, reject) => {
      this.http.delete('http://localhost:3000/api/post/timeline/' + post_id).subscribe(
        (response: { message: string }) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  createComment(comment: Comment, post_id: string) {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:3000/api/post/timeline/' + post_id + '/comment', comment).subscribe(
        (response: { message: string }) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  deleteComment(post_id: string, comment_id: string) {
    return new Promise((resolve, reject) => {
      this.http.delete('http://localhost:3000/api/post/timeline/' + post_id + '/comment/' + comment_id).subscribe(
        (response: { message: string }) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}

